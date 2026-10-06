# JOIN-503 — Device Enrollment + Tokenless Routine Reconnect — DEVELOPMENT REPORT

> Workbook: `mission-book/finished/completed-2026-10-06/connection-onboarding/JOIN-503-device-enrollment-and-tokenless-reconnect.md`
> Programme: `mission-book/finished/completed-2026-10-06/connection-onboarding/README.md`
> Standing rules: `mission-book/CONSTRUCTION_RULES.md`, `mission-book/ASYNC_RELIEF_CONSTRUCTION.md`
> Role: **Development**, host **Alien**
> Branch: `join/JOIN-503-device-enrollment-and-tokenless-reconnect`

```text
TASK_ID      JOIN-503
ROLE         DEVELOPMENT (Alien)
BRANCH       join/JOIN-503-device-enrollment-and-tokenless-reconnect
BASELINE     13109b4c206feb3c1a9107b369715e84af65eaf1
HEAD         ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7
CI           see development_ci in the workbook frontmatter (V0.2 checks)
STATUS       Development complete; opposite-host review NOT performed; dual-physical-host acceptance DEFERRED
```

## 1. 目标与结论

正常用户的日常启动不应再出现"复制/粘贴 bare token"。本次把一次 join 变成**登记安装实例**，此后每次启动由设备自己
证明身份、由 City 换取短期会话：

```text
first join (pairing exchange + declare installation)
  → City enrolls a logical device + an installation (RF-001 records)
  → durable installation credential stored on the MACHINE (git-ignored, owner-only)
  → browser receives only a short-lived sess: credential
future boot → device layer mints a session → ONLINE, nothing typed
revoke     → reconnect refused, typed, and no silent re-enrollment
```

## 2. 边界：复用而不是重建（workbook section 2）

登记语义**完全来自** `city/00-foundation/02-city-node-network/device-identity`（RF-001 的 `device_id` /
`installation_id` / fingerprint / UNBOUND-BOUND-QUARANTINED-RETIRED / `resolveInstallationPresentation` 判定阶梯 /
`detectCredentialClones`）。新增的 `services/dev-gateway/enrollment.mjs` 是**接缝**：保存记录、签发 installation
credential、签发/校验会话、把生命周期拒绝翻译成 typed code。**没有**第二套 device registry、**没有**以 MAC/IP 作为
身份、**没有**第二套 trust store。`services/dev-gateway/pairing.mjs`（RF-002）未被修改。

## 3. 变更清单

| 文件 | 变更 |
|---|---|
| `services/dev-gateway/enrollment.mjs` | **新增**：登记注册器（enroll / openSession / checkSession / revoke / rebind / quarantine / list / cloneFindings）。纯逻辑：时钟与熵由调用方注入。 |
| `apps/client/device-enrollment.mjs` | **新增**：设备侧。`.runtime/device-enrollment.json` 的读写（0600）、`enrollWithCity`、`openDeviceSession`、`refreshDeviceSession`、`listInstallations`、`revokeInstallation`、`inviteForExchange`。 |
| `apps/web/enrollment.js` | **新增**：浏览器侧。只处理 `sess:` 会话凭据；`readSessionFromHash`（只接受 `sess:`，拒绝把控制 token 当会话传入）、`refreshSession`、`fetchEnrolled`、`revokeEnrolled`。 |
| `services/dev-gateway/server.mjs` | 新路由 `POST /device/enroll`、`POST /device/session`、`GET /device/installations`、`POST /device/installations/:id/{revoke,rebind}`；`auth()` 把 `Bearer sess:` 路由到登记注册器（每次请求都查，未缓存）；`pairing/exchange` 可携带 `installation` 声明并在同一次调用内登记；snapshot 增加 `enrolledDevice`；typed 错误不再退化成 500。 |
| `services/dev-gateway/store.mjs` | 三张表 `devices` / `installations` / `device_sessions`（与其他表同形状）。 |
| `scripts/utopia-client-launcher.mjs` | 启动时用设备凭据换取会话并把 `#session=…` 交给浏览器（不再给控制 token）；`--enroll` 一次性加入别的 City；`--forget-device` 删除本机凭据。 |
| `apps/web/app.js` | 支持 `#session=`；Settings 新增设备身份区（当前 installation、到期时间、已登记设备列表、移除设备）；会话到期由会话自身续期。 |
| `apps/web/i18n/{en,zh-CN}.js` | 新增设备身份文案（284/284 key 对齐）。 |
| `tests/join503-enrollment.test.mjs` | **新增**：9 项，全部打真实 gateway。 |

未修改：`pairing.mjs`、transport、scheduler/assistant、Android、RF-001 模块本身。

## 4. 未指定选项：问题、选择、判断逻辑

### D1 — 一次 join 时"谁"登记，以及登记用什么 authority

- **问题**：登记会制造 authority，因此不能对未认证请求开放；但加入的设备**没有**控制 token。
- **选择**：登记挂在已存在的 `POST /pairing/exchange` 上——**配对交换本身就是所有者的证明**（他主动生成了一次性码）。
  joining 端在同一次调用里声明 `installation`，City 在交换成功后立即登记并返回（a）一次性可见的 durable
  credential（b）首个 session。`POST /device/enroll` 也保留，但**必须**控制 token。
- **否决的方案**：让 joining 端猜/获得控制 token（违背"用户不管理长期凭据"）；新增一条公开的 enroll 路由（会变成
  任何人都能自助登记）。

### D2 — 会话凭据的形态与"谁保存什么"

- **问题**：workbook section 5 要求 durable key 由 device/runtime 层持有，browser 只持 session-scoped。
- **选择**：`sess:<32hex>` 前缀标识会话，`auth()` 只按前缀路由，**每次请求都去 registry 查**（不缓存），因此 revoke
  立刻生效；durable credential 落在 `.runtime/device-enrollment.json`（0600，git-ignored），**从不**进 URL/DOM/log/repo。
- **判断逻辑**：如果会话被缓存，revoke 就变成"下次重启才生效"，那正是 workbook section 9 要否定的行为。

### D3 — `POST /device/session` 必须是"自认证"路由

- **问题**：它本身就是出示凭据的地方，不可能要求先通过 `auth()`。
- **选择**：把它列为**唯一**的 `selfAuthenticating` 例外（`version(req)` 仍然执行），其内部校验严格：出示 installation
  credentials 走 RF-001 判定阶梯；出示自己的会话凭据则刷新。**首次实现漏掉这一点**，导致重连被 401 打回——这是本次
  施工中实测发现并修正的缺陷，记录在此而不是只留在 commit 里。

### D4 — 会话过期后如何"无 UI 提示"地续期

- **选择**：web 端每小时用**会话自身**续期；失败且 code 属于 `SESSION_UNKNOWN` / `INSTALLATION_RETIRED` /
  `INSTALLATION_QUARANTINED` 时清除本地会话并显示需重新配对。设备侧则用 durable credential 换新会话。
- **明确不做**：任何"失败后退回控制 token"的兜底——那会让 revoke 形同虚设。

### D5 — 重装（reinstall）与 rebind

- **选择**：`POST /device/enroll` 接受 `unbound: true`，产生**无逻辑设备**的 installation：它有身份、什么都不能做，
  直到带 proof 的显式 rebind。这直接来自 RF-001 的 `createInstallation` + `rebindInstallation`（后者强制要求 proof）。
- **判断逻辑**：一次"自动化方便"的隐式继承会让被 retire 的旧设备静默复活，正是 workbook 禁止的。

### D6 — 撤销一个 installation 时，正在使用的会话怎么办

- **选择**：`revoke` 同时 retire installation 并撤销它所有未撤销会话（返回 `sessionsRevoked`）。自我撤销时 web 端
  清掉本地会话并退回配对界面。
- **原因**：只 retire 记录会让"已撤销的显示器"继续用旧会话工作到过期——撤销必须是立即事实。

### D7 — 记录地址（endpoint）不是身份

- **问题**：测试里 City 重启后端口会变，于是"记住的 endpoint"不可达。
- **判断**：端口不是身份的一部分。`openDeviceSession(record, {endpoint})` 允许调用方给出**当前**可达地址（launcher
  正是这么用），记住的地址只是记录。第一次实现只信记录的地址，把一个"换了端口重启"的 City 误报成不可达——已修正。

### D8 — 双物理主机验收：诚实边界

- **选择**：本机可独立给出的只有**单主机双进程/多安装实例**证据（见第 5 节）。workbook section 9 的
  "Alien + Mech，关停→重启→自动 ONLINE→从可信端点 revoke→再重启失败"需要**第二台物理主机**，本机 **DEFERRED**，
  且不设置 `DEVICE_ENROLLMENT_RECONNECT_ACCEPTED`。

### D9 — 新增 Settings 面板未经浏览器专测

- **选择**：如实记录。全套浏览器测试（web.test / web-v02 / web-i18n / JOIN-501 的四项）在本改动后全绿，语言包 key
  对齐也通过，但**没有**一条测试专门驱动新的设备身份面板。这属于"未验证"，不是"已验证"。

## 5. 自动测试（`tests/join503-enrollment.test.mjs`，9 项，全部打真实 gateway）

| Workbook section 8 条款 | 覆盖 |
|---|---|
| 1 first approved join creates/reuses canonical installation identity | ✔ `joinOnce`（真实 pairing exchange + installation 声明）；断言 `ins-/dev-/cred-` 形态、City 侧可见、`cloneFindings` 为空 |
| 2 restart → reconnect without user-entered token | ✔ 关闭 gateway、同目录重启、仅凭设备凭据换取新会话；并证明该会话在 `/city` 上真的是 authority |
| 3 expired session → re-auth internal, no UI token prompt | ✔ 时钟推进 13h 后旧会话 401/`SESSION_EXPIRED`；设备凭据换到**新的**会话；旧会话不会复活 |
| 4 revoke → reconnect denied | ✔ `revoke` 后 `openDeviceSession` 抛 `INSTALLATION_RETIRED`（`retryable:false`） |
| 5 revoked installation cannot silently mint membership | ✔ 旧会话立即 401；installation 状态为 `RETIRED` |
| 6 reinstall/rebind follows explicit lifecycle | ✔ 新登记产生新 device/installation/secret；`unbound:true` 时不能行动（403 `INSTALLATION_UNBOUND`）；无 proof 的 rebind 403 `rebind_proof_required`；带 proof 的 rebind 绑回**同一逻辑设备**后可用 |
| 7 no permanent secret in DOM/log/url/repo | ✔ snapshot / canonical events / 持久记录 / QR payload 全部不含 durable secret；设备文件含之且为 0600（非 Windows 时断言） |
| 8 engineering manual fallback isolated | ✔ 控制 token 路径仍可用且 `enrolledDevice === null`；无凭据 401；invite 中不含 `cred-` |
| 额外 | ✔ clone 出示（正确凭据 + 错误 instance）→ 403 `CLONE_DETECTED` **且**产生 canonical event `DEVICE_CLONE_DETECTED`；损坏/陌生设备文件被拒绝而不是半用；结构性完好但不可达 → `CITY_UNREACHABLE`（`retryable:true`），与"凭据问题"明确区分 |

**全量套件**：`node --test tests/*.test.mjs` → 1080 tests / 1078 pass / 2 fail。两项失败与 JOIN-501 报告中记录的是
**同一对**（`tests/capability-adapters.test.mjs`、`tests/city-roads.test.mjs`，`CORRUPT_INPUT`），已在未改动基线的
独立 worktree 上复现，属本机 city 树依赖缺失，与本次改动无关。

## 6. 未完成 / 诚实边界

1. **opposite-host Formal Review 未完成**（`review_host` 保持 `null`，`review_complete` false）。
2. **双物理主机 acceptance 未完成**：需要第二台真实主机（Mech）执行 section 9 的完整序列。
3. **新 Settings 设备面板未经浏览器专测**（见 D9）。
4. **Android 未参与**：本次未改 QR payload 格式，也未要求 Android 参与；section 9 未点名 Android。
5. 本报告不声称任何"已复核"。所有结论均为 Development host 自测。

语言配对 / Language pair: [原文 / Source](./DEVELOPMENT_REPORT.md) · [译本 / Translation](./en/DEVELOPMENT_REPORT.md)
