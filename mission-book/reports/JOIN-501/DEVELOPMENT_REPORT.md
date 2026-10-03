# JOIN-501 — Pairing Session Lifecycle + Persistent Display — DEVELOPMENT REPORT

> Workbook: `mission-book/connection-onboarding/JOIN-501-pairing-session-lifecycle-and-display.md`  
> Programme: `mission-book/connection-onboarding/README.md`  
> Standing rules: `mission-book/CONSTRUCTION_RULES.md`, `mission-book/ASYNC_RELIEF_CONSTRUCTION.md`  
> Role: **Development**, host **Alien**  
> Implementation repo: `zhiheng-zhang-Mera/utopia`  
> Branch: `join/JOIN-501-pairing-session-lifecycle`

```text
TASK_ID      JOIN-501
ROLE         DEVELOPMENT (Alien)
BRANCH       join/JOIN-501-pairing-session-lifecycle
BASELINE     13109b4c206feb3c1a9107b369715e84af65eaf1   (Utopia main at claim time; V0.2 checks run 37112596448 SUCCESS on exactly this sha)
HEAD         e925ae1ef4dda6f51d89a1faa025d1b8666d8c58
CI           37116491572 COMPLETED SUCCESS on exactly e925ae1 (workflow V0.2 checks; jobs gateway-web + android)
STATUS       Development complete; opposite-host Formal Review NOT yet performed (see section 8)
```

## 1. 目标与结论

Owner 语义（programme README section 3，优先级高于旧 UI 行为）：

```text
NO CLICK = NO CODE
IDLE --Generate--> ACTIVE --consumed--> CONSUMED --Generate--> ACTIVE(new)
                       \--expires-----> EXPIRED  --Generate--> ACTIVE(new)
```

Development 结论：旧实现不是"少了一个按钮"，而是 session 生命周期根本不存在——配对材料是**渲染的副产品**，被
`go()`、`pagehide`、`connection!=='ONLINE'`、`refresh()` 五处无条件清除，并且 ACTIVE 时提供 `Revoke and refresh`
按钮主动换码。本次把生命周期变成一个可测试状态机，并把上面五条隐式路径全部删除。

**None of these five paths may create pairing material any more**（逐条对应 workbook section 3.1 的禁止清单）：

| 旧路径 | 旧行为 | 新行为 |
|---|---|---|
| 打开 Pairing 页面 | 不创建，但显示 `city.descriptor.pairingSessionId` | 不创建；未点击时不渲染任何材料 |
| `go(next)` 页面导航 | `clearPairing()` 无条件清空 | **不清除**；导航来回仍是同一 session |
| `pagehide` | `clearPairing()` 清除 | **只 persist**，不清除 |
| `status(s!=='ONLINE')` / WS reconnect | `clearPairing('pairing.reconnect')` | **不清除**；离线只影响能不能"生成" |
| `refresh()` 快照 | 无条件按 descriptor 清除 | 先向 City 求证（`pairing/info`），只有确定被消费/替换才结束 |
| ACTIVE 按钮 | `Revoke and refresh session` → 新码 | `Code active · expires on its own`，**disabled**，且点击不调用创建 API |

## 2. 真实代码基线（claim-time，已实测而非沿用他人结论）

`apps/web/app.js` 在 13109b4 上的配对相关事实（逐行读过，不是从报告推断）：

- `let ... pairing=null,pairingBusy=false,pairingEpoch=0,pairingNotice=''`（第 9 行）；
- `clearPairing()`（88 行）只做 `pairing=null`，**没有状态机**；
- `go()`（89 行）第一句就是 `clearPairing()`；
- `status()`（106 行）在非 ONLINE 时 `clearPairing('pairing.reconnect')`；
- `refresh()`（107 行）在 `pairing && city.descriptor?.pairingSessionId!==pairing.pairingSessionId` 时清除；
- 生成按钮点击（167 行）先 `pairing=null` 再请求，然后无条件赋值 —— 请求失败时**用户原有的码已经消失**；
- 计时器（173 行）负责过期；`pagehide`（174 行）清除。

City 侧（`services/dev-gateway/pairing.mjs`，本任务未修改）：`active()` 要求 `!usedAt && clock<expiresAt && attempts<5`；
`descriptor().pairingSessionId` 只在仍有 active session 时非空，**session 一旦被消费就变成 null**。这一点是本次
设计的关键约束（见第 4 节的 D1）。

## 3. 变更清单（允许边界内）

| 文件 | 变更 |
|---|---|
| `apps/web/pairing-lifecycle.js` | **新增**：唯一的状态机与持久化。导出 `createPairingLifecycle()`、`STORAGE_KEY`、三个终止原因。 |
| `apps/web/app.js` | 接入状态机；删除五条隐式清除路径；新增 `generatePairing()`（页面里唯一能创建材料的函数）；`pairing/info` 求证函数 `canonicalPairingSession()` 与 `reconcileRestoredPairing()`。 |
| `apps/web/i18n/en.js`、`zh-CN.js` | 新增 `pairing.active` / `pairing.used` / `pairing.revoked`；改写 `pairing.explanation`；删除已无意义的 `pairing.refresh`。两份语言包 key 集合仍完全一致（271/271）。 |
| `tests/pairing-lifecycle.test.mjs` | **新增**：15 项状态机单元测试（无浏览器）。 |
| `tests/pairing-session-lifecycle-web.test.mjs` | **新增**：4 项真网关 + 真浏览器验收测试，含"第二个进程消费"场景。 |
| `tests/web-v02.test.mjs` | **就地更新契约**：它原本断言的正是 Owner 已废止的行为（`Revoke and refresh session` 换码、离开页面清码）。 |

未修改：`services/dev-gateway/pairing.mjs`（City 的 session 语义本身正确，问题在页面对它的使用）、transport、
scheduler/assistant、Android、`apps/web/index.html`。

## 4. 施工中的未指定选项：问题、选择、判断逻辑

工程书没有明确写死的每一处，按下表决策；其中 D1 是本次唯一"看起来能跑但其实错了"的缺陷。

### D1 — 刷新/重载时，如何区分"被消费"与"City 还没给出答案"

- **问题**：`apps/web/pairing-lifecycle.js` 的 `clearOnSessionChanged(canonical)` 需要判定 ACTIVE → CONSUMED/EXPIRED。
  第一版实现把 `canonical !== ourSessionId` 一律当"被消费"，包括 `null`。
- **现象（实测）**：整页 reload 后，页面在第一次快照时仍是 `OFFLINE`，`city.descriptor` 尚未取到，
  `pairingSessionId` 为 `undefined` → 被当作"已使用"，于是**有效码被错误移除**，页面显示 `That code was used`。
  这就是 workbook section 3.3 明确禁止的行为（"不得让有效码提前消失"）。
- **判断逻辑（L2）**：`runtime measurement > canonical source`。实测证明 descriptor 在 boot 窗口内**不可判定**；
  而 City 有公开、无需凭据的 `GET /api/v0/pairing/info`，它返回 `activeSession` 与当前
  `descriptor.pairingSessionId`，才是"这个 session 还在不在"的权威来源，且**只读、不创建**。
- **选择**：新增 `canonicalPairingSession()`（读 `pairing/info`，失败即 `{known:false}`，不猜）；boot 与 refresh
  发现不一致时都先求证：
  - `known=false`（City 不可达/协议不匹配）→ **保留**现有材料，不结束 session；
  - `sessionId === ours` → 什么都不做；
  - `sessionId !== ours`（含 null）→ 结束 session；`expiresAt` 未过记 `USED`，已过记 `EXPIRED`。
- **为什么不用"只在 descriptor 非 null 时清理"这个更简单的规则**：因为被消费时 descriptor **正是** null，
  那样写会永远无法把 ACTIVE 收敛到 USED，直接违反 workbook 3.4。

### D2 — 持久化的作用域与键

- **问题**：3.3 要求 reload/重启可恢复"同一个仍有效 session"，但**不得**升级为永久凭据存储。
- **选择**：`sessionStorage['utopia.pairing-active-session']`，带 `version:1`。理由：sessionStorage 跨 reload 与
  页内导航存活，但**关闭标签页/浏览器即消失**；localStorage 会跨会话存活，正好是 3.3 禁止的"永久 credential"。
  写入内容只有 `pairingSessionId / shortCode / createdAt / expiresAt / qrPayload / qrSvg`，**不含任何 token**（有测试断言）。
- **恢复规则**：恢复**不是生成**。记录损坏、版本不符、结构不全、或 `expiresAt` 已过 → 丢弃记录；过期时记
  `EXPIRED`，绝不因为"恢复失败"而自动生成新码。

### D3 — ACTIVE 时按钮到底"隐藏"还是"禁用"

- **问题**：workbook 3.2 给出两个推荐（隐藏 / disabled = 配对码有效中）。
- **选择**：**disabled + 状态文案**。理由：完全隐藏会让用户不知道"这里本来有生成入口、只是现在不该点"，而
  不可用的按钮本身就是状态展示。同时保留"离线时也 disabled"，因为此时创建必然失败。

### D4 — 创建请求失败时旧材料怎么办

- **问题**：旧实现 `pairing=null` 之后再请求，失败就等于静默丢掉用户手上的码。
- **选择**：新实现**先请求、成功才替换**；in-flight 期间用 `pairingBusy` 禁用按钮，失败时把 City 的错误写进
  `#error` 而保留原状态。因为 `create()` 本身拒绝在 ACTIVE 上执行（返回 `SESSION_ALREADY_ACTIVE`），
  双击/陈旧按钮都不可能换码。

### D5 — 消费后的通知方式（不新增 API）

- **问题**：3.4 要求 owner 页面"尽快"观察到消费。City 未提供新的消费事件端点。
- **选择**：复用既有通道——另一个设备 exchange 会触发 City 的 `onChange` → 事件流 → 页面 `refresh()`；
  刷新时按 D1 求 `pairing/info` 求证。**不新增第二套 trust store、不新增端点**（workbook section 4 只允许
  "最小读取能力"，而 `pairing/info` 已存在且已公开）。实测：receiving 进程 exchange 后，owner 页面自行
  ACTIVE → USED（无测试触碰页面）。

### D6 — 修改既有测试 `tests/web-v02.test.mjs` 的边界

- **问题**：该测试断言 `Revoke and refresh session` 可换码、离开页面后 `#pairing-code` 为 0。这些断言与 Owner
  规则**直接冲突**；CONSTRUCTION_RULES §8 禁止"改成功定义换绿"。
- **判断**：这不是降低门槛，而是**把测试移到新契约上**。具体做法：
  - 换码断言 → 改为断言 `.disabled === true` **且**用请求计数器证明**没有创建调用**（比"按钮不可点"更强，
    因为 synthetic click 仍会派发事件）；
  - "离开页面清码" → 改为"离开页面**保留**同一个 session"（并核对 `pairing/info` 的 session id 未变）；
  - 新增"断连不清码"断言（`app.close()` 后 OFFLINE 但码仍在），并在测试里写明依据。
- 未删除任何测试，未降低任何既有断言强度。

### D7 — 双机实机验收的诚实边界

- **问题**：workbook section 7 要求 Development host + 另一真实 endpoint 消费，并且 Formal Review 必须由另一实体主机完成。
- **选择**：本机（Alien）能独立给出的是**同主机双进程**证据：一个真实 gateway 作为 owner City、一个**独立第二个
  gateway 进程**（不同端口、不同 token）作为 receiver，用二维码/邀请串完成 exchange（见第 6 节 T3）。
  这**不等于**两个物理主机。跨物理主机 Development-consume 与 opposite-host Formal Review 仍然 **DEFERRED**，
  由第 8 节显式记录为未满足门槛，**不**标 `PAIRING_SESSION_LIFECYCLE_ACCEPTED`。

## 5. 自动测试（全部在本机实跑）

### T1 `tests/pairing-lifecycle.test.mjs`（15 项，无浏览器）

覆盖 workbook section 6 的 1–12 中可在状态机层判定的部分：IDLE 不创建且读路径零写入、一次点击恰好一个 session、
ACTIVE 拒绝二次 create、普通读取保持 id/code/payload、消费→USED、过期→EXPIRED 且不创建、过期后再点击得到不同的
新 session、畸形响应不产生半个 session、reload 恢复同一 session 且剩余时间延续、过期记录恢复为 EXPIRED、
损坏/版本不符记录被丢弃、显式 clear 记录原因且不创建、canonical 相同则不动。

### T2 `tests/pairing-session-lifecycle-web.test.mjs`（4 项，真 gateway + msedge）

- **A（acceptance 主用例）**：进入页面 **创建调用 = 0**；refresh/reconnect/导航后仍为 0；一次显式点击 → 恰好 1 次；
  ACTIVE 时 re-render/强制点击/换语言都不改变 id/code/payload 且不新增调用；页内导航来回保持同一 session；
  **整页 reload 恢复同一 session 且不创建**；配对材料中**不含**控制 token；另一端点 exchange 后 owner 页面
  自行进入 USED 且 Generate 可用；**已消费 secret 复用返回 410**；再次显式点击得到**不同**的新 session。
- **B（第二个进程消费）**：owner 页面显示一个码；**独立的第二个 gateway 进程**（不同端口、不同 token）仅凭
  `utopia://pair` 邀请串完成 exchange（200）；owner 页面自行转 USED；City `activeSession=false`。
- **C（过期）**：TTL=3s，材料自行消失、显示 expired、Generate 重新可用、**创建调用仍为 1**（过期不生成）；
  reload 后过期码不复活。
- **D（无凭据的临时性）**：session scoped storage 里没有 token；同一浏览器另一个标签页（自己的 sessionStorage）
  显示 IDLE、不恢复别人的码；过期后 City 报告无 active session。

### T3 全量套件

```text
node --test tests/*.test.mjs
  tests 1070
  pass  1068
  fail  2
```

两项失败为 `tests/capability-adapters.test.mjs` 与 `tests/city-roads.test.mjs`（均为 `CORRUPT_INPUT`）。

**为什么判定它们与 JOIN-501 无关（实测，不是推断）**：在**未改动的基线** `13109b4` 上新建独立 worktree
（`D:\A-Utopia-ci-baseline`）并原样运行这两个文件，得到**完全相同的失败**。它们在 City 树自己的
`city/node_modules`（本机未安装，CI 会 `pnpm --dir city install`）上运行，属于本机环境缺口。
JOIN-501 未触碰 `services/capability-bridge/**`、`contracts/**` 或城市文档树。

其余与本次改动相关的重要 gate 也已实跑：`node scripts/check-bilingual.mjs` → docs/evidence/data-records 三个
`PAIR_STATUS = SYNCHRONIZED`；`node --test tests/web-i18n.test.mjs` 覆盖语言包 key 对齐与"web 资产只用已存在的
message key"，均通过。

**Hosted CI（required gate，绑定精确 head）**：`V0.2 checks` run **37116491572** 在 **exactly `e925ae1`** 上
`COMPLETED SUCCESS`，两个 job 都成功：`gateway-web`（Windows；`pnpm test`、`verify-promotion-history`、rooms tests、
`city/test-all`、`check:docs` 全部 success）与 `android`（Ubuntu；`testDebugUnitTest` + `assembleDebug` success）。
这一点同时**关闭了本机那 2 项失败的归属问题**：CI 在同一个套件上、按仓库自己的方式 `pnpm --dir city install` 后
全绿，与本机在未改动基线上复现到的同一失败互相印证 —— 它们属于本机 city 树依赖缺失，而非本次改动。
（本地 PASS 不替代 hosted CI 的规则在此得到满足：上面的 sha 与 run 一一对应，没有引用邻近 sha 的绿色。）

## 6. 实机验收（本机已完成 / 未完成）

| Workbook section 7 要求 | 状态 | 证据 |
|---|---|---|
| 生成一次 code | **DONE** | T2-A |
| 有效期内触发一次 City refresh | **DONE** | T2-A（等待一个 4s 刷新周期 + 手工 `pairing/info`） |
| 有效期内页面内导航返回 | **DONE** | T2-A（Devices → Pairing，id/code 未变） |
| 有效期内 WebSocket reconnect | **DONE** | T2-A（`offline` → `online` 事件重建连接） |
| 证明 code/session 没变 | **DONE** | T2-A（DOM + `pairing/info` session id 双重核对） |
| 用另一真实 endpoint 消费 | **部分**：同主机第二个真实进程 **DONE**；第二台物理主机 **DEFERRED** | T2-B（独立 gateway 进程，200）；`consume-invite.mjs` 已备好供 Mech 直接运行 |
| owner 页面 ACTIVE → USED | **DONE** | T2-A / T2-B |
| Formal Review 由另一实体主机完成 | **NOT DONE / DEFERRED** | 见第 8 节 |

## 7. 证据指针

- 原始过程证据（本机、Git 忽略）：`.runtime/evidence/mission-book/JOIN-501/alien-dev/`
  - `validate-frontmatter.mjs`（City 的 `validate_frontmatter.py` 需要 python+PyYAML，本机没有；用 City 树自带的
    YAML 解析器复刻同一检查，含 duplicate-key 拒绝。全树 395 文件 → 9 个既有问题，全部位于 `finished/` 归档，
    `connection-onboarding/` 为 0）；
  - `apply-appjs-edit.mjs` + `appjs-edit-set.json`（app.js 的 12 处精确字面替换，任一处匹配不唯一即报错中止，
    所以这次改动集合是可复核的，而不是"一堆手改"）；
  - `consume-invite.mjs`（receiver 侧消费工具，供另一主机使用；只回传凭据的**存在与长度**，不回传值）。
- 代码与测试：见第 3 节表格（随 branch `join/JOIN-501-pairing-session-lifecycle` @ `e925ae1`）。

## 8. 未完成 / 诚实边界（不得当作已通过）

1. **opposite-host Formal Review 未完成**。CONSTRUCTION_RULES §3 要求 Development 与 Formal Review 由不同实体主机
   完成，且同一主机不得自我复核。本机是 Alien；Mech 主机在本轮未上线，因此 `review_host` 保持 `null`、
   `review_complete` 保持 `false`，**不设置** `PAIRING_SESSION_LIFECYCLE_ACCEPTED`。
2. **跨物理主机 consume 未完成**。T2-B 是两个真实**进程**，不是两台真实**主机**；workbook section 8 的
   "Alien Windows + Mech Windows" 最低拓扑尚未达成。
3. **Android 端未参与**。QR payload 格式未改动（`utopia://pair?...` 仍是 City 自己生成的同一串），因此没有触发
   Android 变更；本任务也没有要求 Android 参与。如果 Review 主机希望用真机确认"扫到的码在码被消费前一直有效"，
   那属于 Review 可自行追加的独立证据，本轮没有做。
4. **本报告不声称任何"已复核"**。所有测试结论均为 Development host 自测；Review 必须独立重跑并特别尝试
   用 route / reload / reconnect 让码提前消失或偷偷换码。
