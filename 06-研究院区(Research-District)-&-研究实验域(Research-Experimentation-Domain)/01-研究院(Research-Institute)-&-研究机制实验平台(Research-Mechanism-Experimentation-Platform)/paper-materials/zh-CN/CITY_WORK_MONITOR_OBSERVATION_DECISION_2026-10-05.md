# 全城工作监视器：Observation–Decision 分层与论文素材 — 2026-10-05

> 状态：**ACTIVE PAPER-MATERIAL TOPIC / CONSERVATIVE NOVELTY**
>
> 目的：记录 Utopia City Work Monitor、JEV 全城观察层、任务 DAG、节点/路径详情与 event-triggered Decision layer 的研究价值和数据协议。
>
> 注意：**“做一个 Agent dashboard / 拓扑图 / 日志监控器”本身只按 G2 处理。** 本专题优先研究监视器如何影响长期自治、决策升级、因果可观察性与多事实面 reconciliation。

## 1. 系统设计假设

~~~text
canonical Utopia truth
   ├─ task/action/event
   ├─ device/worker
   ├─ review/CI/evidence
   └─ capability/runtime state
          ↓
JEV observation sidecar
          ↓
normalized Node / Edge / Event
          ↓
City Work Monitor
          ↓
event-triggered Decision receipt
~~~

核心约束：

- Observation continuous；
- Decision event-triggered；
- per-task asynchronous；
- monitor 是 projection，不是第二套 task truth；
- JEV/Decision 不得形成全城同步锁；
- 总图可以隐藏细节，但不得隐藏 active risk。

## 2. 保守研究评级

### G2 — Generic Agent monitor/dashboard

包括：agent tree / topology graph、session log、node status cards、ordinary observability UI、generic progressive disclosure。

只保留正常 telemetry，不单独押论文 novelty。

### G3-A — Hierarchical risk bubbling

问题：当系统把复杂执行图压缩成总览时，是否能隐藏低价值细节而不隐藏 active risk？

候选 failure：

~~~text
SUMMARY_HIDES_ACTIVE_RISK
FALSE_SAFE_OVERVIEW
DEGRADED_STATE_NOT_BUBBLED
~~~

### G3-B — Edge-causal observability

节点状态只能回答“现在是什么”；edge/path 需要回答“为什么走到这里”。

重点：handoff reason、retry trigger、review transition、device/model route、source/destination、evidence/decision provenance。

候选 failure：

~~~text
EDGE_CAUSALITY_MISSING
EDGE_REASON_STALE
EDGE_EVIDENCE_POINTER_MISMATCH
~~~

### G3-C — Observation / Decision decoupling

问题：持续观察是否可以与仅在关键状态跃迁触发的轻量决策分离，从而提高自治而不形成新的同步瓶颈？

重点比较：

~~~text
always-synchronous decision
vs
event-triggered per-task decision
~~~

测量 task wall-clock、decision queue wait、unrelated-task blocking、timeout/fallback、retry/recovery time。

### G3-D — Decision escalation provenance

决策链：

~~~text
RULE
→ FAST_MODEL
→ CRITIC
→ OWNER
~~~

重点不是“哪个模型更聪明”，而是哪些事件可以由 rule 自动解决、哪些需要 fast model、哪些才需要 critic、哪些真正属于 Owner 价值/权限边界；记录每层延迟、错误、重复升级和恢复自治时间。

与现有 RS-G3-SUPERVISION-ATTENTION 联动。

## 3. 对现有 G4 的支撑

本专题**不新增独立 G4**。

Monitor/Decision 数据主要支撑：

- G4-A Unified Repository Control Plane；
- G4-C Project-level Autonomy Survival；
- G4-D Multi-truth Control-plane Reality Drift。

Monitor projection 可新增一个可观察 truth surface：

~~~text
Mission Book
Capability Registry
Git
CI / Review evidence
runtime
UI / City Work Monitor projection
~~~

研究重点不是“UI 会不会过期”，而是 monitor drift 是否导致错误下一步、错误 Owner attention 或 false-safe overview。

## 4. 建议结构化字段

~~~text
workbook_id
task_id
canonical_event_id
event_type
event_time
observed_at
projected_at
projection_latency_ms
node_count
visible_node_count
collapsed_cluster_count
edge_count
edge_type
active_risk_present
risk_bubbled_to_overview
false_safe_summary
edge_reason_complete
edge_evidence_refs
decision_id
decision_trigger_event
decision_source
decision_action
decision_confidence_if_available
decision_queue_wait_ms
decision_latency_ms
decision_timeout
decision_fallback
escalation_reason
owner_intervention_required
owner_intervention_class
autonomy_resumed_at
time_to_autonomy_resume_ms
unrelated_task_blocking
monitor_reality_drift
reconciliation_action
navigation_steps_to_cause
navigation_steps_to_evidence
~~~

不可观察字段写 NOT_OBSERVABLE + reason。

## 5. 候选指标

- Projection Lag = T(projected_at) - T(canonical_event_time)。
- Decision Latency = T(decision_committed) - T(decision_trigger_event)。
- Auto-resolution Rate：rule + fast-model + critic 在不需要 Owner 的情况下解决的 decision-triggering events 比例；同时报告 source distribution。
- Owner-required Rate。
- False-safe Summary Rate。
- Edge Provenance Completeness。
- Monitor Reality Drift Rate；区分 transient convergence 与 stale/incorrect projection。
- Unrelated-task Blocking Incidents；理想值即使可能为 0，未测量时也必须写 NOT_MEASURED。

## 6. 自然实验机会

优先被动记录：

- JEV 慢/断开但任务继续；
- fast model timeout；
- 多任务同时 decision；
- repeated retry；
- node/edge 数量快速增长；
- handoff 后 path explanation；
- total graph collapse；
- monitor state 与 runtime truth 短暂/长期不一致；
- Owner 因监控缺失被迫读 raw log；
- Owner 因 risk bubbling 直接定位异常。

只有明确 REX workbook 才允许故意 fault injection / ablation。

## 7. 论文叙事位置

最适合成为主 Control Plane 论文的 instrumentation + empirical section，例如：

> Persistent control state is insufficient if operators and successor agents cannot observe causally meaningful state transitions without turning observability into a synchronous control bottleneck.

正式投稿前必须重新做 literature review；当前 G3/G4 只是证据预算，不是首创声明。
