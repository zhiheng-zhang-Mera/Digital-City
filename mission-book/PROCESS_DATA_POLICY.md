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
├─ evidence/raw/mission-book/<MISSION_ID>/<run-id>/
│  └─ bounded raw receipts / screenshots / error artifacts
│
└─ data-records/evolution/
   ├─ inbox/mission-book/<MISSION_ID>/
   │  └─ structured event stream / episode candidates
   │
   └─ episodes/mission-book/
      └─ verified normalized episode after Mission closeout
```

### Layer 1 — Raw evidence

施工时记录：

- command/action receipts；
- test / CI results；
- errors；
- crash/restart/recovery receipts；
- UI/Android/Windows evidence；
- refs/SHA/digests；
- timing/resource data（有价值时）。

禁止提交 secrets、credentials、hidden model reasoning 或无界 terminal dump。大型临时日志可保留在本机/hosted artifact，只向 Git 提交有界证据及 digest/reference。

### Layer 2 — Evolution inbox

Migration 与 Verification 过程中，把结构化事实追加到非权威 inbox。

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

只有 Verification 完成且 required CI 全绿后，才把整段 Mission 历史归一化为一个 verified episode。

Episode 同时保留：

- 成功的 migration/verification 路径；
- 失败、被拒方案、维修动作，并显式标记 outcome。

只有这个 provenance-bound normalized episode 才允许进入 Utopia 后续自进化 / retrieval / training feed。

## City report relationship

```text
Utopia raw / inbox / verified episode
               ↓
      pointer + digest + summary
               ↓
Digital-City/mission-book/reports/MB-xxx/
```

City 存索引和结论；Utopia 存经验。

**不需要 raw data 先经过 City 再回流 Utopia。**
