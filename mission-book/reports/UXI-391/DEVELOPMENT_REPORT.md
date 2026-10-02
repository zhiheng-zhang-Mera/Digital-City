# DEVELOPMENT REPORT — UXI-391（进行中：Step 1–4 已完成，Step 5–7 待办）

```text
HOST              = Alien（Development；本任务可由单机承担 Development）
BRANCH            = uxi/UXI-391-remote-handoff-closeout
BASELINE          = d0507b008cc4f91c494e24388c457a8decd9e559（claim-time Utopia main，未漂移）
HEAD              = 2e6b71a（本轮实现提交）
CLAIM COMMIT      = b057b2f（Digital-City）
EXACT-HEAD CI     = 尚无（Step 5 要求：development_complete 之前必须有 exact-head hosted CI success）
```

## Step 1 — Claim-time reconciliation（完成）

Digital-City main `9a19221`；Utopia main `d0507b0`（= workbook 记录值，未漂移，无需 integration refresh）；
main CI `37020640107` success；`66fa201` **不在** main 上（`merge-base --is-ancestor` false，diff 27 files
+285/−1207），故按其指示不整提交 cherry-pick。

## Step 2 — 纠错与五维变量清理（纠错记录已完成；回归测试待补）

- 纠错记录：`ERRATUM_WRONG_PREMISE_CORRECTED.md`（append-only，未改写任何历史记录）；
- 代码内注释更正：`services/dev-gateway/presentation.mjs` 中「an AUTOMATIC handoff is unreachable in this
  City, which has no switch-decline flow」已就地更正，并写明真实 blocker；
- partial load 语义**未改**（本来就正确）：`loadFromTelemetry` 只报已测量维度、缺失保持 missing、
  `min_observed_dimensions = 1`、binding 取已观测维度的最大值；
- **待补**：针对上述语义的回归测试（缺失≠0、饱和维 binding、partial 可用）。

## Step 3 — 单机双 Node 可重复 E2E（完成，21/21 PASS）

脚本 `scripts/uxi391-handoff-e2e.mjs`（隔离 runtime `.runtime-uxi391-e2e`、独立端口、临时数据目录）。
构造严格按工作书：只起 A → 建**同一个** target WAIT → 断言 RUNNING/assigned=A 且**持续 1.5s**（progress=18，
非毫秒假持有）→ 停 A 的 agent（Gateway 与交互面保持存活）→ 断言**指派在 dropout 后存活**（这是路由能有决策的
前提）→ 之后再起 B → 断言 B 有 telemetry → 断言**没有第二个任务** → 走真实 `switch-declined` →
planner 到达 ALTERNATE_DEVICE / presentation 到达 REMOTE_HANDOFF → **执行桥真实转移 A→B** →
同一 task id 在 B 上 COMPLETED → 结果 `{"waitedMs":6000}` 来自真实执行 → 全城只有 1 个任务、1 次终态完成
（无双执行）→ 后端事件 `TASK_HANDOFF_TRANSFERRED`（`handoffEpoch:2`）与 history
`handoff:uxi391-node-a->uxi391-node-b@epoch2`。

**anti-vacuity 全部为断言而非假设**：A 真的跑过 target、A 真的停了、B 是在指派存在之后才上线的、
所有权真的从 A 改到 B、完成的仍是原 task id、结果是 harness 从 backend 读回的而非自己打印的。

## Step 4 — Ownership transfer 最小实现（完成）

三处最小改动，均在允许边界内（handoff harness + 消费 routing plan 的最小桥接 + 最小状态字段）：

```text
1. candidateFromNode 现在显式携带 enablement
   （City 目前不持有 per-node disable 状态，故缺失即 ENABLED；注解写明：一旦 City 能表达禁用，
     这里必须改为读取该字段，且相邻回归测试会在"显式 disabled 被当成 enabled"时失败）
2. routeStageFor 重构为 routePlanFor（返回 stage + chosenDeviceRef + 完整 plan），routeStageFor 变成它的
   薄读取；并新增 routeInputsFor 供 orchestration 使用 —— 同一决策只有一个来源，杜绝第三份重建逻辑
3. 新增 services/dev-gateway/handoff.mjs：消费 plan，用 city-core 既有的 assignment-guard 执行
   {transfer}（只允许当前持有者移交、epoch 递增使旧持有者的迟到重试不再幂等）；
   switch-declined 端点记录用户意图后调用它；node/claim 端点按 handoffTargetRef/guard holder 限制领取，
   使恢复后的 A **不能**抢回已移交的任务；
   转移失败一律 REFUSED 且不改状态（绝不伪造 COMPLETED）。
   planRoute 保持 pure（executed:false），执行属 orchestration。
```

投影侧新增「待移交即 REMOTE_HANDOFF」规则（数据来自任务记录的 `handoffTargetRef`，UI 不重算、不选设备），
否则该状态只存在于"记录意图"与"执行转移"之间的瞬间，用户看不到 City 刚做的事。

## Step 5–7 — 待办

```text
Step 5 回归：five task types 协议事实 / WAIT 稳定持有 / partial load / 缺失≠0 / 饱和维 binding /
        target A→B ownership / 无重复执行与重复终态 / switch offer·decline·alternate·handoff term /
        result return / Web·Android scheduler parity / root 回归；随后 exact-head hosted CI 必须 success
Step 6 双机验收：释放给 Mech 独立复核（§3 同一主机不得既开发又复核）+ Alien/Mech 真实双机 handoff 验收
Step 7 merge main + main CI + 记录 REMOTE_HANDOFF_CLOSEOUT_REPAIRED，并写 POST_COMPLETION_REENTRY.md
```

## 本轮方法学记录（三次假阴性都出在仪器而非产品）

1. 诊断脚本把 `/tasks/:id` 的响应当成 `{task:{...}}` 读，实际任务对象在顶层 → 误报"任务从未 RUNNING"；
2. E2E 把投影状态读成 `entry.state`/`entry.routeStageRef`，实际在 `entry.dto.state` → 在网关已报
   `REMOTE_HANDOFF` 时误报 FAIL；
3. 诊断脚本自行重建 alternates 时漏传 enablement，与产品代码犯**同一个错**，导致 planRoute 行仍显示
   USER_DISABLED —— 这条恰好再次印证了本任务的根因类别：**字段没被传到位**。
