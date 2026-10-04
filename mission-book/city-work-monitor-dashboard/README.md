# City Work Monitor Dashboard / 全城工作监视器仪表盘

> **状态：PLANNED / OWNER_ACTIVATION_REQUIRED**
>
> `execution_enabled=false`。本目录先固定架构、UI 信息层级、JEV 观察边界、Decision 语义与论文素材要求；未得到 Owner 显式启用前，不得被自动施工器 claim。
>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 研究信号：[../RESEARCH_SIGNAL_WATCHLIST.yaml](../RESEARCH_SIGNAL_WATCHLIST.yaml)  
> Research Fabric：[../research-strengthening/README.md](../research-strengthening/README.md)

## 1. 目标

把 Utopia 的多任务、多 Agent、多设备、多模型运行态统一投影成一个 **task-centric / city-centric** 的工作监视器：

```text
City Work Monitor
  ├─ Overview graph
  ├─ Node inspector
  ├─ Path / edge inspector
  ├─ JEV observation stream
  ├─ Decision overlay
  └─ Evidence / raw diagnostics
```

首页只回答：

- 哪些任务在工作；
- 哪些任务在等待 / Review / Blocked；
- 哪台设备或哪条路径异常；
- 系统自动做了什么 decision；
- 是否存在 Owner-required 事项。

模型、provider、host 是节点属性，不是整个监视器的一级组织结构。

## 2. 核心架构决定

### 2.1 JEV = 全城 Observation Layer，不是同步 traffic cop

```text
Worker / Task / Device / Gateway
             │
             ├──────── normal work ────────→
             │
             └── bounded events → JEV Observation Layer
                                      │
                                      └→ City Work Monitor
```

JEV 可以持续观察，但不得要求所有工作先经过 JEV 才能执行。监视器或 JEV 故障不得冻结无关任务。

### 2.2 Decision = event-triggered，不是每次汇报的额外审批

正常 heartbeat、普通日志、测试进度只记录，不触发决策。

只有状态跃迁或真正需要选择的事件，例如：

```text
FAILED
BLOCKED
READY_FOR_REVIEW
RETRY_REQUESTED
RESOURCE_CONFLICT
SCOPE_CHANGE
MERGE_READY
OWNER_DECISION_CANDIDATE
```

才允许进入 Decision path。

默认决策梯：

```text
deterministic rule
    ↓ unresolved
fast lightweight model
    ↓ uncertain / high impact
strong critic / architect
    ↓ owner-only boundary
Owner
```

Decision 必须 per-task、异步、可并行、有 timeout/fallback；**禁止形成全城同步锁。**

### 2.3 Monitor 只是 projection，不是新的 task truth

权威事实继续来自 Utopia canonical task/action/event、Mission Book、Capability Registry、Git/CI/runtime evidence。

Monitor 只做：

```text
canonical truth
→ normalized projection
→ aggregation
→ UI
```

不得为了做仪表盘复制 scheduler、task state、device identity、review truth 或 capability truth。

## 3. UI 信息层级

### Level 0 — City Overview

总图采用任务图 / DAG 风格，默认只显示关键状态与风险：

```text
MB-211 ● ── Review
   │
   └─ Test

MB-212 ⚠
MB-213 ◌ waiting
```

**总图可以隐藏细节，但不得隐藏风险。**

要求：

- active warning / degraded / repeated retry 必须向上冒泡；
- 默认布局尽量稳定，不因普通状态刷新整图重排；
- 大图自动 cluster/collapse；
- edge type 可筛选，默认不同时展示所有路径类型；
- UI 看起来可以是“树”，底层数据模型必须允许 DAG / merge / handoff。

### Level 1 — Node / Path Inspector

点节点至少回答：

```text
What?      现在发生什么
Why?       为什么这样
Who/What?  谁/哪台设备/哪个 Agent 负责
What next? 下一步是什么
```

点路径/edge 至少显示：

- edge type；
- source / destination；
- trigger / reason；
- handoff / review / retry / model-switch / device-route 等语义；
- exact evidence / decision provenance；
- start/end/duration（可观察时）。

### Level 2 — Evidence / Raw Diagnostics

需要真正排错时才进入：

- logs；
- diff；
- test / CI；
- screenshot；
- exact SHA / run / artifact id；
- decision receipt；
- trace / provenance。

普通用户不应被这一层淹没。

## 4. 数据模型

底层最低抽象：

```text
Node
Edge
Event
Decision
Evidence
```

而不是把 Markdown 汇报或 UI 树本身当系统状态。

建议 Decision 最低字段：

```text
decision_id
task/workbook_id
trigger_event
pre_state
decision_source = RULE | FAST_MODEL | CRITIC | OWNER
action
confidence_if_available
decision_latency_ms_if_observable
queue_wait_ms_if_observable
timeout_or_fallback
escalation_target
post_state
evidence_refs
```

## 5. 性能与阻塞原则

1. Observation continuous；Decision event-triggered。
2. JEV / Monitor 不得拥有 global execution lock。
3. Decision queue 必须 per-task independent。
4. fast model timeout 只能暂停/降级对应 task，不得冻结全城。
5. 能由 deterministic rule 解决的情况不得为了“智能感”调用模型。
6. UI refresh 与 observation ingestion 不应改变任务执行顺序。
7. 监控数据高频 raw stream 按 PROCESS_DATA_POLICY 分层，不把 unbounded telemetry 推进 City 当前施工面。

## 6. 论文素材

本 programme 是现有 G3/G4 control-plane 主线的 observation surface 与数据来源，不默认把“做了一个 Agent dashboard”当 novelty。

重点采集：

- observation → projection latency；
- state transition → decision latency；
- decision queue wait；
- auto-resolution source（rule / fast model / critic / owner）；
- Owner interruption avoided / required；
- escalation cause；
- timeout/fallback；
- unrelated-task blocking（应为 0；未知不得填 0）；
- false-safe summary / active risk 是否正确向 overview 冒泡；
- monitor projection ↔ canonical truth drift；
- node/edge provenance completeness；
- handoff/retry/model/device path explanation completeness；
- graph size / collapsed cluster / user navigation depth（可测时）。

重点 failure labels：

```text
MONITOR_SYNC_BARRIER
MONITOR_REALITY_DRIFT
SUMMARY_HIDES_ACTIVE_RISK
EDGE_CAUSALITY_MISSING
DECISION_PROVENANCE_MISSING
DECISION_TIMEOUT_GLOBAL_IMPACT
DASHBOARD_BECOMES_SECOND_TASK_TRUTH
```

专题研究材料见 Research Institute：

`paper-materials/{zh-CN,en}/CITY_WORK_MONITOR_OBSERVATION_DECISION_2026-10-05.md`

## 7. 工作拆分

| ID | 工作 | 状态 |
|---|---|---|
| [MON-901](./MON-901-observation-model-and-jev-projection.md) | Observation model + JEV sidecar projection | PLANNED |
| [MON-902](./MON-902-overview-graph-and-node-path-inspector.md) | Overview graph + node/path progressive disclosure | WAITING_MON_901 |
| [MON-903](./MON-903-event-triggered-decision-overlay.md) | Event-triggered Decision overlay + escalation provenance | WAITING_MON_901 |
| [MON-990](./MON-990-cross-device-monitor-acceptance-and-freeze.md) | Cross-device acceptance + reality reconciliation + freeze | WAITING_MON_902_903 |

MON-902 与 MON-903 在 MON-901 accepted 后可由不同主机并行。

## 8. 激活条件

Owner 显式允许后，才把对应 workbook 的：

`execution_enabled: false → true`

不得仅因目录存在就自动施工。
