# MB-008 — Computer Use Runtime — 验证报告（中文阅读译本）

> 阅读译本 / Reading translation：本文件完整翻译历史报告供阅读，原报告是权威记录；不创建第二份工作簿或更新历史状态。代码证据原样保留。
> 状态：**COMPLETE — OWNER_OVERRIDE_CLOSEOUT_COMPLETE**；验证主机 `Mech`；迁移主机 `Alien`。
> 完成依据：`OWNER_ACCEPTED_COMPLETE`；维修步骤 `2`，`repair_status: COMPLETE`。

```text
MISSION = MB-008
ROLE = VERIFICATION
HOST = Mech
MIGRATION_HOST = Alien
IMPLEMENTATION_BRANCH = mission/MB-008-computer-use
IMPLEMENTATION_CI = 36584056291 PASS (migration head aa2a6a8) ; 36655586918 PASS (reconciled head 77b774c)
FINAL_BRANCH_CI = 36663533485 PASS (final branch head f8f82cd, gateway-web + android)
MERGED_MAIN_CI = 36663813362 PASS (merged main 168182c, gateway-web + android)
FINAL_BRANCH_SHA = f8f82cd54d2192ae63317b42182f96a9aaab466f
MERGED_MAIN_SHA = 168182c47df537f7c6c47d7e42ab3220af40de68
EPISODE = data-records/evolution/episodes/mission-book/MB-008/episode.json
EPISODE_ID = MB-008:6ae0bbd46e425c9f
EPISODE_SHA256 = a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e
VERIFICATION_COMPLETE = true
```

## 0. 检查点历史：验证开启 → run-2 恢复

保留链路执行前检查点，以便完整阅读整个过程；只有后文明确指出时才覆盖相应旧结论。

```text
OWNER_GATE = MB-007 repair_status=COMPLETE
VALUE_VERDICT = ROUTE_B_CONTINUE
MIGRATION_HEAD = aa2a6a8faab779a020d75b93dba548ba3755ce30
POST_MB007_MAIN = d850d73a9c23dbd07f9a0c7483dd2f44272f273f
RECONCILED_HEAD = 77b774cf34df
RECONCILED_CI = 36655586918 PASS
PRE_CHAIN_EVENT_HEAD = 65418f2493cb
PRE_CHAIN_EVENT_CI = 36658350359 PASS
```

### 0.1 价值重新评估

选择 Route B：重新评估时 Utopia `main` 尚无与 MB-008 的 safety/guard/recovery/postcondition 语义等价的实现，故将本任务标为 `SKIPPED_NOT_REQUIRED` 并跳过是不正确的。§1 记录本主机独立重新推导该判断的过程。

### 0.2 先集成、后协调

分支落后 MB-007 完成后的 `main` 48 个提交。三个共享控制面的冲突解决如下，未弱化任何现有机制：

- `services/capability-bridge/registry.mjs` 保留 `main` 的严格超集；它已包含**两种**排除过滤及 MB-009 的 declared/enumerated 区分。
- `city/CITY_IMPLEMENTATION_MANIFEST.json` 按 district id 合并完整 stage-2/stage-3 文档；所有权冲突以当前 `main` 为准；不重复已迁移的 `11-entertainment` 主题所有权。
- `city/tests/manifest.test.mjs` 按 manifest **声明**顺序重新生成 census。

协调后分支头为 `77b774cf34df`，托管 CI `36655586918 PASS`。

### 0.3 链路前验证事件：已提交于 `65418f2493cb`

这些事件早已存在，**没有**重复创建：

| 事件 | ID | 结果 |
|---|---|---|
| OWNER_INTERVENTION | `MB-008:fe4650b1af0044de` | INFO |
| ATTEMPT_STARTED | `MB-008:7208d35e54fae3cf` | INFO |
| VERIFIER_FINDING | `MB-008:67f53cc8da24edda` | BLOCKED / 独立发现 |
| TEST_PASS | `MB-008:1ce4bdb9cbe65fda` | PASS |
| CI_RESULT | `MB-008:1cd9ff19bf0c3d6e` | PASS — run `36655586918` |

独立发现有意保留为真实历史，不改写为绿色；后来的运行证据与完成事件建立收尾结论。

### 0.4 本轮开始时 run-2 的部分结果

正常路径当时已是真实执行：

```text
normalizeAction → validateAction → classifyRisk(FILE_WRITE) = high → evaluateDestructive
→ real bounded file write in the evidence workspace → createWorldState before/after
→ different digests → meaningfulChange.changed = true → file postcondition verdict = success
```

上述链依次规范化和验证动作，将 FILE_WRITE 风险分类为 high、评估破坏性，在证据工作区真实执行有界文件写入，构造前后世界状态，观察不同摘要与有意义变化，并得到文件后置条件成功。

还剩两个证据驱动器缺陷，并且明确**不得**为此修改已迁移产品逻辑：

1. **拒绝记账**：迁移的破坏性 guard 已对 `DELETE` 正确抛出 `ComputerUseError` / `DESTRUCTIVE_FORBIDDEN`，但驱动器记录 `not-thrown`，与此同时进程已退出。
2. **恢复次序**：尝试产生的“miss”真实返回 `success`，因为文件仍然存在；必须先删除文件才能产生真实 miss。

两者均已修复；§3.1、§3.3 记录修复方法，并确认运行时未修改。

### 0.5 从实际错误中学到的 API 事实（复用，不重新探索）

- `FILE_*` 动作直接携带 `path`；文件形状的 `target` 会抛出 `TARGET_INVALID`。
- 预期效果词汇是封闭的 snake_case 集合；使用 donor 的词汇，如 `file_created`。
- `vworld` / `pinnedClock` / `browserParts` 是**测试夹具**，不是运行时 API。
- 世界状态采用**感知形状**：`createWorldState(parts, { now })` 接收裸 `now` **函数**，而 `createVerifier({ clock })` 接收带 `{ now() }` 的**对象**。
- 文件后置条件验证要求 `facts.fileExists` 是**函数**；传入文件数据会产生 `verdict: "unknown"`。
- 每个 room 都声明自己的本地 `ComputerUseError`，故 `instanceof` 必须使用抛出该异常的 room 所拥有的类；guard 对应 `safety.ComputerUseError`。

## 1. 独立审查

> 本节按规则 9 在阅读 Migration Report **之前**写下；逐条结论以 `VERIFIER_FINDING` `MB-008:67f53cc8da24edda` 先行记录在 evolution inbox 中，内容取自 Git 历史、分支 diff 与第一次门禁运行。

- **代码/diff 发现**：分支落后 `main` 48 个提交，涉及共享控制面 `city/manifest.mjs`、`city/tests/manifest.test.cjs`、`services/capability-bridge/registry.mjs` 和 census。按 `README.md` §6，必须在任何门禁运行**之前先**合并最新 `main` 并提交（`77b774c`），因为 `verify-promotion-history.mjs` 检查 `HEAD`。冲突按联合/超集解决，不弱化机制（§0.2）。删除 `11-entertainment`，而非将其复活；通过 promotion 记录的 `relocatedTo` 字段验证，以免已迁移的主题引擎有两个 owner。
- **Donor parity 发现**：本轮**没有**重新推导。迁移的 differential harness 用后已删除，因此 parity 依据迁移主机记录的数字；本验证不声称独立复现。重新阅读迁移报告 D4 的单一源标准，并确认交付绑定存在：`bounded-run/stabilization.mjs` 从 `../target-guard/target.mjs` 导入 `revalidate`；`bounded-run/recovery.mjs` 从 `../routing-safety/routing.mjs` 导入 `CHANNEL_PLANS` / `fallbackChannels`。
- **运行/使用发现**：确认 deferred runtime plane 不存在：`city/10-automation/01-computer-use-runtime` 下没有 executor、controller、driver 或 OS backend；只有六个 library room。
- **初始判定**：`ROUTE_B_CONTINUE`。`main` 未声明 `city/10-automation` 区，其他地方也没有覆盖 `createSafetyGuard`、`classifyRisk` 或 target guard，因此任务仍有价值，不能使用 `SKIPPED_NOT_REQUIRED`。运行面继续 deferred；验证仅可覆盖 `response-9-29.md` R7 接受的边界。

## 2. 与迁移报告核对

- **确认的迁移声明**：六个模块、664 个测试；六者均声明 `capabilityProvider: false`；新 `10-automation` 区及 `01-computer-use-runtime` 建筑已注册；census 按声明顺序匹配合并后的 manifest；`11-entertainment` 不存在，主题引擎恰有一个 owner（MB-009 迁移）。没有 `MIGRATION_COMPLETE` 事件，也没有补造；按 `response-9-30.md` R5，`RUNTIME_FAIL / BLOCKED`（`MB-008:5a72b750eb33a552`）继续保留。
- **修正/拒绝的迁移声明**：没有拒绝项。有一处**澄清**：迁移报告 §6.5 指验证门禁要求**两台**主机分别执行真实有界动作。`response-9-30.md` **R7** 针对 MB-008 明确重新解释：Alien **不必**追溯重演当时无合法 consumption surface 的有界动作；Mech 的真实有界链、Alien 的 blocker 与 Owner 裁决共同构成证据。因此本验证按 R7 授权，仅覆盖**一台**主机的真实链，不声称两台。未来具合法环境的任务仍须遵守双主机门禁。
- **边界差异**：迁移报告 §6.3 与 R7 一致：交付的是库，不是可工作的 computer-use runtime。此处没有将 runtime plane 写成已完成。

## 3. 二次维修与验证

### 3.1 维修

**没有触碰任何迁移模块。** 三个记账缺陷仅在**验证主机自己的证据驱动器**中发现并修复；该工具位于主机本地 `.runtime/`（gitignored），不是产品组成部分：

1. **`assertActionAllowed` 是 `async`**（`routing-safety/safety.mjs`）。首版在同步 `try/catch` 内调用，无法捕获被拒绝的 promise；记录仍是 `not-thrown`，未处理拒绝却逸出并终止进程。修复前已复现（`refusalPath.assertionThrew: false`，exit 1）。改成在 `try` 内 `await`，同时修复正常路径断言的同一潜在缺陷。
2. **副作用不存在只是断言，没有测量。** 现在证据工作区的每次 mutation 均通过计数 helper；驱动器在拒绝段前后同时比较 mutation counter 与完整 artifact 状态（exists / bytes / sha256 / mtime）。
3. **`validateAction` 通过抛错表示无效**：返回值是 action，没有 `.valid` 字段。首版 `validation.valid === false` 永远不会触发，总是报告 `validated: null`。现在按实际抛错/返回结果记录。

判断是**不修改运行时**：guard、`evaluateDestructive`、verifier 和所有迁移模块本已正确；为了让证据好看而编辑它们恰是收尾指令禁止的行为。

### 3.2 测试：五个门禁全部绿色

| 门禁 | 结果 |
|---|---|
| `pnpm test` | **73 / 73**，0 failures，exit 0 |
| `node city/test-all.mjs` | **1698 / 1699**，0 failures，1 skipped，exit 0 |
| `node --test apps/rooms/tests/*.test.mjs` | **69 / 69**，0 failures，exit 0 |
| `node scripts/verify-promotion-history.mjs` | 在 `65418f2493cb` 验证 **10 records**，exit 0 |
| `pnpm check:docs` | docs / evidence / data-records 均 `PAIR_STATUS = SYNCHRONIZED`，exit 0 |

当前 shell 的 `PATH` 上没有 `pnpm`；通过 corepack shim（`D:\Tools\corepack-shims\pnpm.CMD`，pnpm 11.19.0）运行，所以实际执行的是**声明**的命令，没有替换：`pnpm test` 和 `pnpm check:docs` 分别是 `node --test tests/*.test.mjs`、`node scripts/check-bilingual.mjs` 的薄包装。原始输出见 `gates.txt`。

### 3.3 真实使用：有界 Computer-Use 链

驱动器 `.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs` → **exit 0**。途中每个决定都由**迁移模块**作出；驱动器仅负责 I/O。

| 路径 | 结果 |
|---|---|
| **HAPPY** | `normalizeAction` → `validateAction` → `classifyRisk` = `high`（“FILE_WRITE 存在不能假定无害的副作用”）→ guard 允许 → 仅在证据工作区真实执行有界 `FILE_WRITE` → 前后世界摘要不同（`006b5a10f23168a0` → `7f3b81bae425d9d6`）→ `meaningfulChange.changed = true`（title、controlSignature、windowSignature）→ **后置条件 `success`，kind `file`** |
| **REFUSAL** | guard 决定 `allowed:false`、`mode:forbidden`、`kinds:["DELETE"]`；等待的 `assertActionAllowed` **抛出** `ComputerUseError` `DESTRUCTIVE_FORBIDDEN`，message `"destructive action(s) DELETE are forbidden by this contract"`（本契约禁止 DELETE 破坏性动作），`details.mode = forbidden`、`details.kinds = ["DELETE"]`；词汇外的 `TELEPORT` 被以 `ACTION_INVALID` 拒绝；该段 **zero mutations**，目标 artifact 字节完全相同 |
| **RECOVERY** | 目标**确实被删除**；**同一个**真实 `facts.fileExists` 函数随后报告不存在，donor 后置条件返回 **`failure`，kind `file`**，detail `"file missing: <path>"`（文件缺失）；donor recovery `decide()` → `step: retry`、`verdict: RETRYABLE`、`cooldownSignals: ["previous-miss"]`；donor stabilization `settle` → `stable`，`afterAction` → `landed`；重新创建目标后复验后置条件为 **`success`** |

本节覆盖 §0.4 的部分结果。机器判定（`run/summary.json`）保持原样：

```text
HAPPY_PATH = PASS          REFUSAL_PATH = PASS       PROCESS_EXIT = 0
EXPECTED_EXCEPTION_CAUGHT = true                     UNEXPECTED_EXCEPTION = none
SIDE_EFFECT = none         RECOVERY_PATH = PASS     GENUINE_MISS_FIRST = true
MISS_OBSERVED = true       NO_MOCK_FACTS = true      RECOVERED = true
FINAL_POSTCONDITION = success
```

这些字段记录正常路径、拒绝、恢复通过，进程 exit 0，捕获预期异常且没有意外异常/副作用；先发生真实 miss，已观察 miss，不使用 mock facts，最终恢复且后置条件成功。

**没有 mocked facts。** 三次 `verify()` 均使用同一 `fileFacts.fileExists` 函数引用；文件删除时返回 `false`，恢复后返回 `true`。同一引用就是证明。失败没有伪造：通过让真实世界中的文件确实缺失来产生 miss。

**诚实记录 `detectMiss`。** Donor 的 `detectMiss` 此处返回 `missed:false`、`confidence:"low"`、`signals:[]`；原样记录，没有强行调整。这是正确的 donor 行为：`detectMiss` 是 **UI-miss** 判断阶梯（`no_state_change` / focus / event / state signals），而世界状态已明确变化——control 消失了。对于**文件**效果，donor 通过 verifier verdict 建立 miss；实际 `failure`（kind `file`）才是 `MISS_OBSERVED` 的依据。

### 3.4 故障/恢复

上面的 REFUSAL 和 RECOVERY 路径已覆盖：真实拒绝且**测量**无副作用；真实后置条件失败，经 donor 自己的 retry/revalidate 与 stabilization 词汇恢复为验证成功。

### 3.5 跨主机观察

迁移主机 **Alien**、验证主机 **Mech** 不同，符合要求。Alien 历史 `RUNTIME_FAIL / BLOCKED` 原样保留，没有为其伪造 `MIGRATION_COMPLETE`（`response-9-30.md` R5）。本任务唯一偏离迁移报告所述双主机门禁之处，获得 `response-9-30.md` R7 书面授权，并记录在 §2，而非默默应用。

## 4. Utopia 验证 episode

- `mission:finalize` 使用的 implementation CI：**36662962981**（runtime-evidence head `0e1d97e`）。
- Episode 路径：`data-records/evolution/episodes/mission-book/MB-008/episode.json`。
- Episode ID：**`MB-008:6ae0bbd46e425c9f`**。
- Episode SHA-256：`a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e`。
- Episode 状态：`VERIFIED`；`participants` 为 `Alien` / `Mech`；`migrationAcceptance.mode = OWNER_OVERRIDE`、`ownerRuling = Digital-City/mission-book/response-9-29.md#R7`、`migrationBlockerEventId = MB-008:5a72b750eb33a552`、`ownerInterventionEventId = MB-008:fe4650b1af0044de`。
- 检查生成的 episode：Alien 原 `RUNTIME_FAIL / BLOCKED` **同时**保留在 `timeline` 与 `failures`；**不存在** `MIGRATION_COMPLETE`（未伪造，R5）；`RUNTIME_PASS`、`VERIFICATION_COMPLETE` 均存在；`VERIFIER_FINDING` 保留。
- `finalize-mission-episode.mjs` 已消费 inbox（将其删除）。
- Inbox SHA-256：`dc65f523d04fc70519ef709367586fe5c42525e674076908bf59f9ec38757e8c`（13 个事件）。
- 候选/已接受证据指针如下，路径、CI 与 Owner 回复原样保留：

```text
.runtime/evidence/mission-book/MB-008/run-2/CHAIN-STATE.md
.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs
.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.log
.runtime/evidence/mission-book/MB-008/run-2/gates.txt
.runtime/evidence/mission-book/MB-008/run-2/run/{summary,action-spec,before-after-state,
  refusal-receipt,side-effect-absence-receipt,miss-receipt,final-postcondition,digests,
  recovery-timeline}.json
.runtime/evidence/mission-book/MB-008/run-2/run/audit.jsonl
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36655586918
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36658350359
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36662962981
Digital-City/mission-book/response-9-29.md#R7
Digital-City/mission-book/response-9-30.md#R5
Digital-City/mission-book/response-9-30.md#R7
```

完整 evolution 事件流的 inbox 为 `data-records/evolution/inbox/mission-book/MB-008/events.jsonl`；已断言次序：`VERIFIER_FINDING`（8）< 最新 `CI_RESULT PASS`（12）< `VERIFICATION_COMPLETE PASS`（13）。

| # | 事件 | 结果 | Event id |
|---:|---|---|---|
| 1 | MISSION_CLAIMED | INFO | `MB-008:4ba425de0933dc87` |
| 2 | ATTEMPT_STARTED | INFO | `MB-008:ef9cf276cbb63010` |
| 3 | CHANGE_APPLIED | INFO | `MB-008:69a6b819de80de0b` |
| 4 | TEST_PASS | PASS | `MB-008:7189d8757b9c40de` |
| 5 | RUNTIME_FAIL | **BLOCKED**（保留） | `MB-008:5a72b750eb33a552` |
| 6 | OWNER_INTERVENTION | INFO | `MB-008:fe4650b1af0044de` |
| 7 | ATTEMPT_STARTED | INFO | `MB-008:7208d35e54fae3cf` |
| 8 | VERIFIER_FINDING | BLOCKED | `MB-008:67f53cc8da24edda` |
| 9 | TEST_PASS | PASS | `MB-008:1ce4bdb9cbe65fda` |
| 10 | CI_RESULT | PASS | `MB-008:1cd9ff19bf0c3d6e` |
| 11 | RUNTIME_PASS | PASS | `MB-008:bbf126eae72598ed` |
| 12 | CI_RESULT | PASS | `MB-008:06f57c0602aa5553` |
| 13 | VERIFICATION_COMPLETE | PASS | `MB-008:fd0225d163afa3d2` |

## 5. 最终门禁

- **最终分支 HEAD 所需 CI**：在最终分支头 `f8f82cd54d2192ae63317b42182f96a9aaab466f`（episode 提交）运行 `36663533485` **PASS**，gateway-web **与** android 均通过。
- **合并结果**：`mission/MB-008-computer-use` → `main`，以 `--no-ff` 合并为 `168182c47df537f7c6c47d7e42ab3220af40de68`，符合项目既有 merge-commit 策略（`cb8e0bd`、`b4bd602`、`cfe34df`、`0eed05b`）。没有 squash/rebase，完整保留跨主机证据历史。
- **Merged-main CI**：`36663813362` **PASS**，gateway-web **与** android 均通过。
- **Merged-main 门禁**：`pnpm test` 73/73；`city/test-all.mjs` 1698/1699（0 failures，1 skipped）；`apps/rooms` 69/69；`verify-promotion-history` 在 `168182c47df5` 验证 10 records；`check:docs` 的 docs/evidence/data-records 均 `SYNCHRONIZED`。
- **Merged-main 结构检查**：`10-automation` 恰出现一次；`01-computer-use-runtime` 所有权唯一；六个模块均 `capabilityProvider: false`；district id 唯一、每区 building id 唯一、module id 和 path 全局唯一；registry 在完整 `declared` surface 上同时保留 building-aware kind filter 和 module-level `capabilityProvider` filter；theme engine 仅归 `00-foundation/05-control-centre` 所有（经 MB-009 从 11-entertainment 路径迁移，`relocatedFrom`）；`11-entertainment` 不存在。
- **判定：PASS — MB-008 验证关闭。**

## 6. 施工中的问题、选择与判断逻辑

以下各点都是收尾指令未完全指定选项的地方；明确记录所选方案及理由，不使其隐含。

**V1 — `PATH` 上没有 `pnpm`。**
*问题*：指令指定 `pnpm test`、`pnpm check:docs` 为门禁，两者均无法解析。*判断*：不能默默换成底层 node 命令。pnpm 11.19.0 经 `D:\Tools\corepack-shims\pnpm.CMD` 的 corepack shim 可用，故通过它运行**声明**的命令。*记录*：shim 路径/版本见 `gates.txt` 与 §3.2，替换成本为零但不隐藏事实。

**V2 — 首版驱动器有三个记账缺陷，容易误想去“修复” runtime。**
*问题*：拒绝断言记录 `not-thrown` 而进程退出；“miss” 返回 `success`。指令只允许修复 driver，不许“为了让测试好看”修改 runtime。*判断*：根因在迁移 API 的实际形状——`assertActionAllowed` 是 `async`，同步 `try/catch` 不可能捕获它——所以修复**驱动器**。guard、`evaluateDestructive`、verifier 经确认正确并保持字节不变。*理由*：修改 runtime 会破坏整条链的证据价值；诚实解释是 runtime 正确、harness 错误。

**V3 — `detectMiss` 报告 `missed: false`。**
*问题*：指令要求“真实 miss”，`detectMiss` 又是 donor 的 miss 函数，自然期待 `missed: true`，但实际为 `false`。*判断*：按**实际回答**记录并解释机制，不调整输入迫使它同意。`detectMiss` 是 donor 的 **UI**-miss 阶梯；对**文件**效果，donor 通过 verifier verdict 建立 miss，本轮实际得到 `failure`（kind `file`）。所以 `MISS_OBSERVED` 来自 verifier，差异记录在 §3.3 与 deferred 清单。*理由*：强迫 `detectMiss` 就是在制造证据，恰是指令禁止的行为。

**V4 — 本轮开始时 City 本地仓库落后远端。**
*问题*：工作副本显示 `7a8d9ac`，而 `origin/main` 已比早先会话前进 7 个提交，含其自己的 `VERIFICATION_REPORT.md` 和额外 front-matter 字段。首次 push 被以 non-fast-forward 拒绝。*判断*：**fetch、merge，并按 union 协调**；不 force-push、不丢弃早先会话的真实部分状态。冲突报告重写成单一文档，同时保留检查点历史（§0）并加入完成记录（§1–§5）；front matter 取两组字段联合，将过时的 `repair_resume_point` 更新而非留下陈旧值。*经验*：指令“注意每次领取任务前确认仓库的最新状态”意味着先 **`git fetch`**，而非仅 `git log`；本地 clone 的 HEAD 不等于远端状态。

**V5 — 合并到 `main` 的策略。**
*问题*：`main` 没有分叉（分支落后 0、领先 8），普通 `git merge` 会 fast-forward，不产生 merge commit。指令要求既有策略，禁止 squash/rebase 抹去跨主机证据。*判断*：用 `--no-ff` 创建明确合并提交 `168182c`，遵循 `cb8e0bd` / `b4bd602` / `cfe34df` / `0eed05b` 先例；全部 8 个分支提交（含 Alien blocker 和每个 evolution 事件提交）逐个保留。

**V6 — finalizer 的 `--branch-sha` 与 `--ci-run` 来自不同提交。**
*问题*：指令指定 `--branch-sha <COMMIT_CONTAINING_VERIFICATION_COMPLETE>` 与 `--ci-run <FINAL_VERIFICATION_CI_RUN_ID>`；分别对应 verification-complete 提交 `437be8b` 和 runtime-evidence 提交 `0e1d97e` 上的 run `36662962981`。*判断*：**字面遵守**，不自行“纠正”；在报告头与 §4 明确记录这对值，让读者看到每个 CI 属于哪棵树。finalizer 接受该组合；episode 记录 `ci.run = 36662962981`、`target.branchFinalSha = 437be8b`，两者均真实。

**V7 — 超过 1000 字符的 `--summary` 被拒绝（exit 2）。**
*问题*：`VERIFICATION_COMPLETE` 摘要多次超出工具上限。*判断*：精简文字，删除重复的“on host Mech”，因为事件 `hostId` 已明确携带它。未删任何事实内容。

**V8 — City 状态图例。**
*问题*：里程碑时验证绿色但尚未合并，既非图例 🟢（已接受），也不能干净地归入 🔴。*判断*：中间里程碑保留 🔴，不发明 README 图例未定义的 🟡；在文字备注中表达细节。收尾时该行正确变为 🟢。

## 7. Deferred / 未建立的内容（不可理解为已完成）

1. **Runtime plane 继续 deferred。** 未迁移或执行 executor、controller、driver、OS backend：**没有驱动真实 desktop、browser 或 UI automation。** 本验证没有令 Computer Use 成为完整产品 runtime。
2. 有界动作是证据工作区内的**文件**动作；真实且有界，但不是 desktop/UI interaction。
3. 本轮**未独立重新推导 donor parity**；迁移主机用后的 differential harness 已删除，其数字按历史记录引用。
4. **未实现双主机覆盖**；`response-9-30.md` R7 仅针对 MB-008 授权单主机覆盖。未来具合法环境的任务仍须满足既有双主机门禁。
5. `detectMiss` 没有独立确认文件 miss（§3.3）；miss 的依据是 donor verifier 的 `failure` 判定，这正是 donor 对文件效果的处理路径。

语言配对 / Language pair: [原文 / Source](../VERIFICATION_REPORT.md) · [中文阅读译本 / Chinese reading translation](./VERIFICATION_REPORT.md)
