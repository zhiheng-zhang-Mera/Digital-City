---
workbook_id: MON-901
phase: CITY_WORK_MONITOR
sequence: 1
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
dependencies: []
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: BACKGROUND_DISCLOSED
user_exposure_surface: City Work Monitor
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: ["CAP-MON-001"]
capability_registry_action: CREATE
capability_registry_refs: []
capability_registry_sync_status: PENDING
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: UNASSESSED
state_identity_evidence_refs: []
monitor_observability_evidence: UNASSESSED
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/MON-901
---

# MON-901 — Observation Model + JEV Sidecar Projection

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> Programme：[README.md](./README.md)

## 目标

建立 City Work Monitor 的最薄真实 observation 基础：

```text
canonical Utopia runtime truth
→ bounded event adapter
→ JEV observation layer
→ normalized Node / Edge / Event projection
→ observable monitor state
```

## 强约束

- JEV 是 sidecar/observer，不是所有执行的同步必经路径；
- 不复制 scheduler/task/device/provider/review/capability truth；
- monitor failure 不得阻断无关 task；
- raw high-frequency telemetry 按 PROCESS_DATA_POLICY 分层；
- 不引入新的 hidden reasoning capture；
- first slice 必须能从真实 runtime state 显示至少一个 active task、owner/host、state 与 evidence pointer。

## 最低数据模型

```text
Node
Edge
Event
Evidence
```

Decision 可先保留 schema seam，由 MON-903 接入。

## 观测范围

优先复用已有 canonical events，覆盖：

- task claim/state transition；
- worker/host binding；
- review；
- test/CI summary；
- wait/retry/recovery；
- handoff；
- model/provider switch（如果 canonical truth 已存在）；
- Owner escalation；
- evidence refs。

不得因为 dashboard 需要方便字段就悄悄创建第二套状态机。

## 性能门

至少验证：

- observer disconnected 时任务继续运行；
- observer slow 时无关任务不被同步阻塞；
- projection lag 可测则记录；
- dropped/missing event 可被诚实暴露，不伪造“实时”。

## Research capture

重点记录：

```text
event_source
canonical_event_id
observed_at
projected_at
projection_latency_ms
drop_or_gap
reconciliation_result
monitor_reality_drift
unrelated_task_blocking
```

未知字段写 NOT_OBSERVABLE。

## Development / Review

Development 需更新 Capability Registry candidate。Formal Review 必须从 exact-head runtime 独立验证：

1. Monitor projection 不成为 task truth；
2. JEV sidecar failure 不冻结任务；
3. projection 与 canonical runtime 对得上；
4. observed risk 能留下 exact evidence pointer。

## 完成门槛

- bounded projection contract；
- 至少一个真实 task 的 node/edge/event projection；
- no-global-barrier evidence；
- opposite-host review；
- exact-head CI；
- Registry candidate/reconciliation；
- PAPER_MATERIAL_INDEX。
