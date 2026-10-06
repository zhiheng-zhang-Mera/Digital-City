# Verification Report — MB-005

```text
MISSION = MB-005
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-005-host-health
MIGRATION_HEAD = 545d38fa6cc7023826c5a3a4a09cb2e37265eb06
FINAL_BRANCH_SHA = 75f9acd1e6e4738b46f663412935624359ea586c
FINAL_BRANCH_CI = PASS — run 36593553358 (V0.2 checks) on 75f9acd1e6e4738b46f663412935624359ea586c
MERGED_MAIN_SHA = cfe34df1109dbe6a90348f1a671bae6ff1dc3074
VERIFICATION_COMPLETE = true
```

- **Verification claim:** 2026-09-29T15:34:43Z, City claim commit `03f395dc623a86e99c64076c0542d7fa0be95b6f`.
- **Rule 5:** migration host `Mech`, verification host `Alien` — different hosts.
- **Rule 9 order:** §1 was written and recorded as events *before*
  `reports/MB-005/MIGRATION_REPORT.md` was opened. §2 is the reconciliation.
- **⚠ One gate clause is recorded as a mission-design tension in §6.1** (the "two hosts" wording),
  under both readings, with nothing fabricated.

---

## 0. 任务选择 / Why MB-005

Selection was re-made against the latest Digital-City `main` (`d6969d9`) immediately before claiming,
as rule 3 requires. No migration task remained claimable, so selection fell to the
migrated-but-unverified set by `SEQUENCE` ascending: `MB-003` is `BLOCKED_OWNER_DECISION`,
`MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and rule 13, and `MB-004` had just been
completed by this host. `MB-005` is the lowest-sequence eligible mission.

---

## 1. 独立审查 / Independent review

> 本节在阅读 Migration Report 之前记录。审查对象只有：冻结 donor、目标代码、diff、测试与运行状态。

### 1.1 审查范围 / Scope

| 项目 | 值 |
| --- | --- |
| 迁移分支 | `mission/MB-005-host-health` @ `545d38fa6cc7023826c5a3a4a09cb2e37265eb06` |
| merge-base with `main` | `c7ef3cd1c6be0155332d03afc3607dfdbf49c205` |
| 规模 | 27 文件、9 737 行新增；目标模块 19 个 `.mjs` + `DONOR.json` + 2 个测试文件 |
| Donor | `zhiheng-zhang-Mera/dsh-health-scheduler @ 985e2b7389330db4b32ea2946e3657746c64b47b` |
| 目标路径 | `city/02-engineering/03-host-health-station/host-health-station` |
| 外部依赖 | 只有 `node:` 内建（`assert/child_process/fs/os/path/process/test/url`），零 npm 依赖 |

### 1.2 Code / diff findings

- **F1 — 交付状态下最强的 parity 证据根本没运行。** `tests/differential.test.mjs` 需要
  **编译好的** donor 位于 `.runtime/evidence/mission-book/MB-005/donor-health/lib/index.js`
  （`:59-60`、`:638`），缺失时以具名原因 skip。交付分支上该目录**不存在**，所以差分比对没有执行。
- **F2 — 没有任何真实 telemetry 运行。** 迁移证据是构造性的：模块自己的测试文件头写明
  "no test reads `node:os`"。而 Verification 门槛要求**真实 telemetry** 跑正常/未知缺失/持续压力/防抖。
  本分支也没有把模块接到任何产品面上（diff 只触及模块、manifest、census 与两个 capability 测试）。
- **F3 — 现有消费面确实存在，且不需要新建 dashboard。** `apps/web/app.js` 的 device panel
  已经在渲染 `city.nodes[].telemetry`（CPU %、memory used/total、disk、uptime、freshness），
  数据来自 gateway 的 `POST /api/v0/node/register|heartbeat`（经
  `contracts/pairing-v1/descriptor.mjs` 的 `validateTelemetry` 校验）→ `GET /api/v0/nodes`
  与 `/api/v0/city` 快照。这满足了"复用现有消费面"的要求。
- **F4 — 模块把"缺失即 unknown"与"不执行重启"当作硬性质。** `index.mjs` 的模块头明确写出这两点，
  且 `DECISION_LADDER` 顶格是 `REQUEST_SYSTEM_REBOOT`（请求），两个 shipped adapter 只会拒绝。
- **F5 — 迁移同时改写了共享 capability 测试。** 与 MB-002/MB-004 同一模式（census 相对化）。
  **其中一处是真的弱化**，见 §3.3。

### 1.3 Donor parity findings（独立、非差分）

本主机另做了一次**词法级**独立比对（去注释后按 token 多重集比较 donor 编译产物与移植体）：

| 移植文件 | 结果 |
| --- | --- |
| `bands/normalize/rolling/trend/pressure/policy/maintenance/safe-point/config/scheduler/audit/adapters` | 除 import 说明符外 **token 完全一致** |
| `providers.mjs` | 与 donor 8 个 provider 文件**并集一致**，唯一差异是 3 个 `PROVIDES` 常量改名 |
| `types.mjs` | 一致（仅去掉 barrel） |
| `presets.mjs` | 无丢失，仅新增 `PRESET_DOCUMENTS`（与 donor `presets/*.json` 字节相等） |
| `report.mjs` | 无丢失 |
| 运行时导出 | donor 的导出**一个不缺**；`CANONICAL_METRICS`(42)、`METRICS`、`DECISION_LADDER`、`PRESSURE_DIMENSIONS`、`PRESETS`、`LEVEL_BOUNDS`、`resolveConfig({})` 全部 deepEqual |

**结论：唯一的行为分歧是 `bandKeyOf` 那个 donor bug，且是照抄而非修好。**

### 1.4 Runtime / use findings

- 真实 telemetry 运行缺失（F2）。
- 现有消费面存在但未接线（F3）；分支未新增 UI/路由/面板，`services/dev-gateway/server.mjs` 未被触碰。

### 1.5 Initial verdict

**PASS-with-required-evidence.** 移植本体忠实（词法级证据支持），但交付状态下既没有差分 parity 的实际执行，
也没有真实 telemetry 运行，还夹带一处测试弱化。三者都在 §3 修复。

---

## 2. 对照 Migration Report / Reconciliation

### 2.1 确认一致 / Confirmed（含可复现的强一致）

| 报告主张 | 独立复核结果 |
| --- | --- |
| §6.2 差分 `110 scenarios / 110 agreed / 916 ticks / 3433 metric entries / 89 decisions / 8 restart requests / 41 refusals` | **逐位复现**（补上 donor 之后） |
| §6.3 `pnpm test` 58/58、city 212/212、rooms 67/67、docs SYNCHRONIZED、promotion 10 records | **全部逐项复现** |
| §7 "模块从不执行重启" | **独立源码审计一致**：20 个模块源文件中无任何重启/关机执行原语；唯一能 spawn 进程的文件是 `providers.mjs`（其注入式 telemetry helper probe） |
| §7 真实消费：coverage 0.6、unknownDimensions = `runtime, worker, computer_use_ui` | **本主机的真实 telemetry 运行独立得到相同的 coverage 0.6 与相同的三个 unknown 维度** |
| §8.1 `bandKeyOf` 对 `lower-is-worse` 永不返回 `:warn` | **对 donor 源码与移植体逐行核对一致**，移植体照抄，并有会因"修好"而失败的测试钉住 |
| §8.4 两台主机是验证主机的活 | 与本次分工一致 |

### 2.2 差异 / Differences

| 编号 | 差异 | 判定 |
| --- | --- | --- |
| D1 | 报告 §9 把编译好的 donor oracle 与 `run-1/consumption-driver.mjs` 列为证据指针，但那些是**另一台主机上的 git-ignored 文件**；交付分支上证据区是空的。 | 直接导致 F1：最强证据静默 skip。已由 R1 补齐并**真实执行**。建议把"donor 缺席"记为失败而非 skip。 |
| D2 | 因此报告的真实 telemetry 证据**无法从分支复现**。 | 已由 R2（committed pilot）替代为可复现证据。 |
| D3 | 报告 §6.4 记录了同一处 census 脆弱性修复。 | 与 F5 一致；**这是第四个分支携带同一份修复**，合并必须并集。 |
| D4 | 报告 §8.2 保留 `source: 'dsh-health-scheduler'`。 | 认可：改名会破坏逐字段差分 parity，属合同变更，不是迁移。 |
| D5 | `DONOR.json` 文档层自相矛盾：`knownDifferences` 写 "Two donor bugs" 而 `donorBugsFound` 只有 1 条；`determinism` 声称"No test reads node:os"但测试 import 了 `tmpdir`。 | 已按事实更正（§3.3）。其余文档瑕疵列为遗留观察。 |

### 2.3 边界一致性 / Boundary

"明确未迁"与复核一致：`src/dsh/**` 的 Cordis 绑定、npm/Cordis 打包、模型面向的 tool 定义、
`lib/**` 构建产物全部未迁；实际执行重启/reboot 既不在本 Mission 也被 donor 本身排除。
`DEFERRED` 清单为空这一主张，经词法比对成立：donor 的非绑定逻辑确实全部落到
`report.mjs` / `settings.mjs` / `wiring.mjs` / `adapters.mjs`。

---

## 3. 二次维修与验证 / Secondary repair & verification

### 3.1 R1 —— 让差分 parity 真正运行

在 `.runtime/evidence/mission-book/MB-005/donor-health` 克隆 donor 冻结提交
`985e2b7389330db4b32ea2946e3657746c64b47b`，并按 harness 头部给出的配方构建
（`typescript@5.7.2` + `@types/node@22`，`npx tsc -p tsconfig.json`），产出 62 个文件。
`.runtime/` 被 git 忽略，**分支内容零改动**。效果：

```text
differential: 110 scenarios compared, 110 agreed, 0 disagreed; 916 ticks,
3433 per-metric entries, 89 decisions, 8 restart requests, 41 decisions carrying a refusal reason
differential actions: PAUSE_NEW_WORK=67 REQUEST_APP_RESTART=1 REQUEST_SYSTEM_REBOOT=7 THROTTLE=14
```

模块套件由"83 用例含 1 skip"变为 **83 / 83 / 0 fail / 0 skipped**。

### 3.2 R2 —— 真实 telemetry 运行时 pilot

新增 `scripts/mb005-health-pilot.mjs`（与仓库既有 20 个 `scripts/*-pilot.mjs` 同模式）。
证据：`.runtime/evidence/mission-book/MB-005/run-001/host-health-pilot.json`。

| 阶段 | 结果 |
| --- | --- |
| A 真实 telemetry（正常） | 用移植体自己的 provider 图（`defaultEnvironment` + `HardwareProvider` + `RuntimeProvider`）**真实采样本机**：7 个真实指标，`cpu_usage` 0.19 %、`ram_total_bytes` 34 101 420 032、`ram_available_bytes`、`ram_used_ratio`、`uptime_seconds` 227 248、`process_rss_bytes`、`handle_count`。调度后 coverage **0.6**，unknown 维度 `runtime`、`worker`、`computer_use_ui` —— **如实报告而非编造** |
| B 未知/缺失 | coverage **0**，unknown 维度 **6**，**0** 个指标被写成 0 |
| C 持续压力 | `ram_used_ratio` 高于 `band.critical`(0.96) 并超过其自身 `sustainMs` 120 000 → 恰好 **1** 次升级决策 `THROTTLE` |
| C 防抖 | 跨阈值振荡 6 次 → **0** 次进一步升级 |
| D 有界请求 | `DECISION_LADDER` 顶格 `REQUEST_SYSTEM_REBOOT`（请求）；shipped adapter 对 application/system restart 均返回 `accepted:false / state:rejected`；20 个源文件中**无**重启执行原语；`providers.mjs` 是唯一可 spawn 进程的文件 |
| E 现有消费面 | 把**同一份真实 telemetry** 送进**既有**节点通道：`POST /api/v0/node/register` → 200；`GET /api/v0/nodes` 原样读回 `cpu 0.2 %`、`memory.totalBytes 34 101 420 032`、`uptimeSeconds 227 248`、`online true` —— 正是 Web/Android device panel 渲染的字段。**未新建任何 dashboard** |

诚实说明（本报告写入后由 MB-009 的验证更正）：pilot 里的"重启共享 gateway"步骤实际**没有成功**。
它用 `spawnSync('pwsh', …)` 调用 `scripts/restart-gateway.ps1`，而本机 PATH 上**没有** `pwsh`（只有
`powershell.exe`），所以该调用以 `ENOENT` 失败，证据里记录的 `gatewayStartExit: null` 就是这次失败，
不是超时。E 阶段的往返因此是对**当时已经在运行**的 gateway 做的。

这不影响该阶段证据的有效性：MB-005 没有改动 `services/dev-gateway/server.mjs`，而节点 telemetry 通道
就在那个文件里，所以在运行的 gateway 与分支代码在这一点上是一致的；真实 telemetry 被接受并原样读回
仍然是真实发生的。但它确实说明：**在子进程里调用 shell 必须用 `powershell.exe`，不能用 `pwsh`**
（MB-009 的 pilot 已修正这一点，并在重启后确认 registry 真的加载了新路径）。

### 3.3 R3 —— 修复被弱化的既有测试（BLOCKING）

迁移提交 `5fbbec6` 改动 `tests/capability-registry.test.mjs` 时，把 fixture 从 `m.districts[2]`
改为 `m.districts.at(-1)`。后者是 `11-entertainment`，**只有 1 个 building**，于是

```js
assert.equal(new Set(added.map(c=>c.capabilityId)).size, buildingCount, '… a second building …');
```

退化成对 1 元集合的检查，**永远不可能失败**，而断言消息仍在声称"第二个 building 里的重名模块不得复用
第一个的 qualified identity"。实测：

```text
原 fixture（09-planning-knowledge，2 buildings）：2 条 parser，2 个不同 id
弱化后（11-entertainment，1 building）      ：1 条 parser，1 个不同 id
```

这违反"不得跳测试/删测试/放宽验收来换绿"。修复：把 fixture 指回 `09-planning-knowledge`（确有 2 个
building）并断言期望值 2，属性重新被真正检验（`.../01-knowledge-service/parser` 与
`.../02-document-intake/parser` 两个不同 id）；同时恢复姊妹测试里按 id 定位的更强断言。
顺带更正 `DONOR.json` 两处事实错误（是 1 个 donor bug 而非 2 个；测试用的是 `tmpdir` 而非读取 OS telemetry）。

### 3.4 被改动测试的复核 / Modified-test review

| 文件 | 迁移改动 | 判定 |
| --- | --- | --- |
| `tests/capability-registry.test.mjs` | 第一个 fixture 改 census 相对 | 合并时取并集，保留按 id 定位 + 精确 qualified capabilityId + 相对计数三重断言 |
| `tests/capability-registry.test.mjs` | 第二个 fixture 改 `at(-1)` | **弱化，已修复**（§3.3） |
| `tests/capability-adapters.test.mjs` | 绝对条数 → census 相对 | **可接受**：AVAILABLE 绝对数 `=== 5` 仍被 `tests/capability-bridge.test.mjs:26` 绝对钉住，且循环仍调用每个 available adapter |
| `city/tests/manifest.test.mjs` | census 增加一行 | 未放宽：仍是硬编码普查，要求每个条目在树上真实存在 |

没有任何测试被跳过、删除或改成 `todo`。模块套件 0 skip（差分 harness 在 R1 后真实运行）。

### 3.5 验收矩阵 / Acceptance matrix

**分支 `977cd0c3487c4f1fd11e71b1f123007829f95ef1`（含 R1–R3）：**

| 检查 | 结果 |
| --- | --- |
| 模块套件（19 文件，含 donor 差分） | **83 / 83**，0 fail，0 skip |
| `node city/test-all.mjs` | **212 / 212** |
| `pnpm test` | **58 / 58** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| `node scripts/verify-promotion-history.mjs` | 10 条记录 OK |
| `pnpm check:docs` | 三对 **SYNCHRONIZED** |

**合并后 `main` `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`：**

| 检查 | 结果 |
| --- | --- |
| `pnpm test` | **62 / 62** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| `node city/test-all.mjs` | **893 用例 / 892 pass / 0 fail / 1 skipped**（该 skip 是具名的 `EPERM` symlink 环境限制） |
| `node scripts/verify-promotion-history.mjs` | 10 条记录 OK |
| `pnpm check:docs` | 三对 **SYNCHRONIZED** |

### 3.6 真实消费 / Real use

见 §3.2 阶段 E。复用 `apps/web/app.js` 既有 device panel 所读的节点 telemetry 通道；
**未新增 UI/路由/dashboard**，符合规则 14。

---

## 4. Utopia verified episode

- Implementation CI used by `mission:finalize`: **`36593090881`** on
  `977cd0c3487c4f1fd11e71b1f123007829f95ef1` — `gateway-web` success、`android` success。
- Episode path: `data-records/evolution/episodes/mission-book/MB-005/episode.json`
- Episode ID: **`MB-005:bc50edf4e6a626d8`**
- Inbox SHA-256 digest: `34b2a598cd3b4d3c698491c0b9ad46b21e745fd260b11a56f42bdd0c23ca4493`
- Closeout commit: `75f9acd1e6e4738b46f663412935624359ea586c`（纯数据）
- Episode 内容：`status=VERIFIED`、25 个事件、4 个 `VERIFIER_FINDING`、3 个 repair、
  3 个 `RUNTIME_PASS`、0 个 owner intervention。

## 4.1 事件流 / Event stream (25)

| 角色 | 主机 | 类型 | 结果 |
| --- | --- | --- | --- |
| MIGRATION | Mech | MISSION_CLAIMED / ATTEMPT_STARTED ×2 | INFO |
| MIGRATION | Mech | TEST_FAIL | **FAIL** |
| MIGRATION | Mech | REPAIR_APPLIED | REPAIRED |
| MIGRATION | Mech | TEST_PASS ×2 | PASS |
| MIGRATION | Mech | OWNER_INTERVENTION（donor bug 决策） | INFO |
| MIGRATION | Mech | CI_RESULT | PASS |
| MIGRATION | Mech | MIGRATION_COMPLETE | PASS |
| VERIFICATION | Alien | MISSION_CLAIMED / ATTEMPT_STARTED | INFO |
| VERIFICATION | Alien | REPAIR_APPLIED（R1） | REPAIRED |
| VERIFICATION | Alien | TEST_PASS | PASS |
| VERIFICATION | Alien | RUNTIME_PASS ×3（真实 telemetry / 未知+压力+防抖 / 有界请求+消费面） | PASS |
| VERIFICATION | Alien | VERIFIER_FINDING ×4（独立审查、对照差异、两台主机张力、深度复核） | INFO |
| VERIFICATION | Alien | REPAIR_APPLIED（R3） | REPAIRED |
| VERIFICATION | Alien | CI_RESULT | PASS |
| VERIFICATION | Alien | VERIFICATION_COMPLETE | PASS |

---

## 5. 合并与冲突裁决 / Merge and conflict resolution

`main` 在本次验证期间已含 MB-001/002/004/006 的合并。合并产生 **4 个**冲突，全部是共享控制面文件。

| 文件 | 裁决 |
| --- | --- |
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | 只加入 MB-005 的 `03-host-health-station` building，并把它放在 `02-engineering` 内**升序 building-id** 位置。第一次尝试用全量排序脚本，导致 `00-foundation`、`04-restart-recovery-station`、`02-document-intake` 的**模块顺序**被改动，census 立即失败；已回退为**只移动这一个 building** 的最小改动。合计 17 个 module |
| `city/tests/manifest.test.mjs` | 保留 `main` 的 `EXPECTED_MODULES` 与 MB-001/002/003/004/006 各行，在**声明顺序**插入 MB-005 行 |
| `tests/capability-adapters.test.mjs` | 取 `main` 的更强版本（census 相对 + AVAILABLE `=== 5` 绝对钉） |
| `tests/capability-registry.test.mjs` | 两侧已收敛（R3 已把分支修成与 `main` 同形的强断言），取含解释注释的版本 |

**边界声明：** 裁决没有扩大 Mission 功能边界，也没有放宽任何验收；R3 恰好是**收紧**。

---

## 6. 最终门禁 / Final gate

| 门禁 | 状态 | 证据 |
| --- | --- | --- |
| 现有消费面读取真实 status/history/error，不得新建 dashboard | **PASS** | §3.2 E 阶段；复用既有 device panel 数据通道 |
| Health Station 只能产生 bounded action request，不能直接执行重启 | **PASS** | §3.2 D 阶段 + 词法/源码审计 |
| 真实 telemetry 覆盖正常 / 未知缺失 / 持续压力 / 防抖 | **PASS** | §3.2 A–C 阶段 |
| 两台主机分别跑（见 §6.1） | **TENSION RECORDED** | 见下 |
| 验证主机 ≠ 迁移主机 | **PASS** | Mech / Alien |
| 先独立审查后读 Migration Report | **PASS** | §1 先记录，§2 后对照（事件流可证） |
| 维修只在同一 Mission 分支 | **PASS** | R1 git-ignored、R2 一个 pilot 脚本、R3 一个测试修复 + 文档更正；无生产文件被验证主机改动 |
| 未跳过/删除测试、未放宽验收 | **PASS** | §3.4；迁移夹带的弱化已由 R3 修复 |
| required CI 全绿 | **PASS** | 分支 `36593090881`、最终 HEAD `36593553358`，两作业 success |
| 由验证主机合并到 `main` | **PASS** | `cfe34df1109dbe6a90348f1a671bae6ff1dc3074` |
| Episode 收口 + 双 CI（规则 16） | **PASS** | §4 与上表两条 CI |

### 6.1 ⚠ 两台主机条款 / The "two hosts" clause — recorded as a mission-design tension

> 门槛原文：*"两台主机分别用真实 telemetry 跑过正常、未知/缺失、持续压力/防抖场景。"*

- **Reading 1（按参与主机角色）**：满足。迁移主机在其分支上留下了自己的真实运行证据
  （`RUNTIME_PASS` 事件 + 报告 §7 的 12 次实时采样），验证主机完成了 §3.2 的真实运行。
- **Reading 2（两台物理机器）**：在本会话**不可满足** —— 规则 5 只允许**一台**验证主机且禁止第三台，
  本机也只有一台机器。
- **与先例一致**：MB-006 的验证报告 §5.2 记录的正是同一类歧义的同一处理方式 —— **两种读法都记录，
  不择一断言**。
- **本主机没有做的事**：没有伪造第二台机器，没有把一次运行说成两次，也没有因此阻塞整个 Mission。
  该条款与其余门禁相互独立，其余门禁全部达成。
- **Owner 可裁决**：接受 Reading 1；或要求一次真正的第二机器运行（需另一台机器与一次范围受限的补充验证）。

---

## 7. 遗留观察 / Carry-forward observations

1. **差分 parity 依赖机器本地 donor（D1）。** 交付状态下它静默 skip；这是 MB-004 同一问题的第二次出现。
   建议：让这类测试能自行获取冻结 donor，或把"donor 缺席"记为**失败**而不是 skip。
2. **`bandKeyOf` 对 `lower-is-worse` 永不返回 `:warn`（报告 §8.1）。** 移植体照抄并有测试钉住，
   本主机确认这是 `MODE=MIGRATION_ONLY` 下的正确处理。**建议 Owner 决策**：这会让"sustain 闸门何时打开"
   与直觉不符（跨过 warn→critical 即已满足 sustain），代码改动只有两行，但属语义变更，应显式裁决。
3. **`checkManifestAgainstTree` 无法发现"存在但未声明"的模块（报告 §8.3）。** 与 MB-004 报告同一发现；
   建议在 `city/manifest.mjs` 上做一次独立修复。
4. **census 脆弱性已第四次被同一个修复覆盖（D3）。** `catalog.length === 6` 这类绝对断言应停止使用；
   本次合并延续了"相对计数 + 绝对 adapter 不变量"的方向。
5. **`DONOR.json` 仍有的文档瑕疵**（不影响行为）：`sourcePaths` 未列 `src/dsh/report.ts` 与
   `src/dsh/plugin.ts`，而 `portedFiles` 声称它们已移植、`notPorted` 又同时列出并注明"ported"；
   `adaptation` 第 3 条把多数"已在其子模块导出、只是未被 `index.ts` 再导出"的函数称作
   "donor module-private"；`tests/` 未被纳入机器可读台账。
6. **donor 的 6 个测试文件未随模块交付**，"124 个 donor 测试对移植体通过"这条证据无法从仓库单命令复现
   （本主机以临时副本复现，124 pass / 22 suites）。建议随模块提供该套件或其 runner。
7. **未跑 Android 模拟器。** 本 Mission 未触碰 Android 源码；CI 的 android 作业 success。

---

## 8. 证据指针 / Evidence pointers

- 迁移报告：`mission-book/reports/MB-005/MIGRATION_REPORT.md`
- 实现分支：`zhiheng-zhang-Mera/utopia` `mission/MB-005-host-health`
- 实现 CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36593090881>
- 最终 branch HEAD CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36593553358>
- 运行时 pilot（分支内）：`scripts/mb005-health-pilot.mjs`
- 运行时证据（git-ignored）：`.runtime/evidence/mission-book/MB-005/run-001/host-health-pilot.json`
- 现场工作记录（git-ignored）：`.runtime/evidence/mission-book/MB-005/run-001/WORKING_STATE.md`
- Episode：`data-records/evolution/episodes/mission-book/MB-005/episode.json`（`MB-005:bc50edf4e6a626d8`）
- 合并提交：`cfe34df1109dbe6a90348f1a671bae6ff1dc3074`

语言配对 / Language pair: [原文 / Source](./VERIFICATION_REPORT.md) · [译本 / Translation](./en/VERIFICATION_REPORT.md)
