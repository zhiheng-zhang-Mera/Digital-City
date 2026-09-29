# Process Data / Utopia Dogfood Policy

## Decision

```text
Digital-City
  = mission definitions + claims + compact reports

Utopia
  = raw/structured migration experience + accepted evolution episodes

City MUST NOT be a raw-process staging warehouse.
Utopia MUST NOT learn directly from unfiltered raw logs.
```

Digital-City 是 ownership / boundary / mission control plane。终端日志、截图、重复 retry 和 raw trace 不应堆进 City，否则每次 Hns 扫任务都会被历史噪声拖慢。

Utopia 是产品与 experience learner，所以迁移过程数据归 Utopia；但 raw event 只是 evidence，不是立即生效的 instruction。

> **Process evidence is not instruction inheritance.**

失败方案、临时 workaround、旧分支决策、Verifier 修复，都不能因为出现在历史中就自动成为 Utopia 的当前规则。

## Three-layer Utopia flow

建议逻辑布局：

```text
Utopia/
├─ .runtime/evidence/mission-book/<MISSION_ID>/<run-id>/
│  └─ raw receipts / screenshots / error artifacts   [git-ignored]
│
└─ data-records/evolution/
   ├─ inbox/mission-book/<MISSION_ID>/
   │  └─ bounded structured event stream             [mission branch]
   │
   └─ episodes/mission-book/<MISSION_ID>/
      └─ verified normalized episode                 [accepted/main]
```

### Layer 1 — Raw runtime evidence

施工时先写入 `.runtime/evidence/mission-book/<MISSION_ID>/<run-id>/`，遵循 Utopia 现有 `.runtime/` Git-ignore 规则。记录：

- command/action receipts；
- test / CI results；
- errors；
- crash/restart/recovery receipts；
- UI/Android/Windows evidence；
- refs/SHA/digests；
- timing/resource data（有价值时）。

禁止提交 secrets、credentials、hidden model reasoning 或无界 terminal dump。大型临时日志保持在本机/hosted artifact。Migration/Verification 需要跨主机共享的少量非敏感证据，可以在对应 mission branch 上选择性发布到 `evidence/raw/mission-book/<MISSION_ID>/`；它们在 Verification 前只是 candidate evidence，只有随验证完成后的 branch 合入 main 才成为已接受仓库证据。

### Layer 2 — Evolution inbox

Migration 与 Verification 过程中，把**有界、结构化、非敏感**的事实追加到 mission implementation branch 的 `data-records/evolution/inbox/mission-book/<MISSION_ID>/events.jsonl`。它是跨主机 handoff 数据，不是 raw terminal dump，也不是权威规则。

建议事件：

```text
MISSION_CLAIMED
ATTEMPT_STARTED
CHANGE_APPLIED
TEST_PASS
TEST_FAIL
RUNTIME_FAIL
RECOVERY
OWNER_INTERVENTION
VERIFIER_FINDING
REPAIR_APPLIED
CI_RESULT
MISSION_ACCEPTED
```

每条至少带 Mission ID、host/role、source/target SHA 或 ref、timestamp、outcome、evidence pointer。

**Inbox 不得被当作 active policy/rule source。**

### Layer 3 — Verified episode

只有 Verification 完成且 required CI 全绿后，才把整段 Mission 历史归一化为 `data-records/evolution/episodes/mission-book/<MISSION_ID>/episode.json`。在同一最终分支提交中删除当前树上的 inbox 文件（Git 历史仍保留施工轨迹），使 main 默认只暴露 verified episode。

Episode 同时保留：

- 成功的 migration/verification 路径；
- 失败、被拒方案、维修动作，并显式标记 outcome。

只有这个 provenance-bound normalized episode 才允许进入 Utopia 后续自进化 / retrieval / training feed。

## City report relationship

```text
Utopia .runtime raw / branch inbox / verified episode
               ↓
      pointer + digest + summary
               ↓
Digital-City/mission-book/reports/MB-xxx/
```

City 存索引和结论；Utopia 存经验。

**不需要 raw data 先经过 City 再回流 Utopia。**


## Implemented bootstrap contract

Utopia 提供固定工具与 contract：

```text
contracts/evolution/mission-event-v1.schema.json
contracts/evolution/mission-episode-v1.schema.json

pnpm mission:event -- ...
pnpm mission:finalize -- ...
```

`mission:event` 只追加有界结构化事实，不修改运行策略。`mission:finalize` 只允许在两台不同主机参与、Migration 已 PASS、存在独立 Verifier Finding、最后一次 implementation CI 为 PASS、且其后存在 PASS Verification Complete 时生成 verified episode。

### Verification closeout order

```text
independent review
  ↓
repair / real-use verification
  ↓
implementation required CI = GREEN
  ↓
record CI_RESULT PASS
  ↓
record VERIFICATION_COMPLETE PASS
  ↓
pnpm mission:finalize
  ↓
commit episode + inbox removal
  ↓
FINAL BRANCH HEAD required CI = GREEN
  ↓
merge main
  ↓
City VERIFICATION_REPORT
```

第二次 CI 用于覆盖 finalize 产生的最终精确 branch HEAD；它不再写回已删除的 inbox，而由 City Verification Report 保存 run/结论。只有 final branch CI 也全绿时，episode 才会真正随 merge 进入 Utopia `main`。

### Mandatory event coverage

至少记录：

```text
MISSION_CLAIMED
ATTEMPT_STARTED
CHANGE_APPLIED
TEST_PASS / TEST_FAIL
RUNTIME_PASS / RUNTIME_FAIL
RECOVERY
OWNER_INTERVENTION        (发生时)
MIGRATION_COMPLETE
VERIFIER_FINDING
REPAIR_APPLIED            (发生时)
CI_RESULT
VERIFICATION_COMPLETE
```

事件名不得由施工模型自行扩展；以 Utopia event contract 为准。
