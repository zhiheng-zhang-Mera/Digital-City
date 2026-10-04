---
workbook_id: MON-902
phase: CITY_WORK_MONITOR
sequence: 2
execution_enabled: false
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
dependencies: ["MON-901"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: City Work Monitor
user_exposure_nesting: L1_PRIMARY
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: ["CAP-MON-002"]
capability_registry_action: CREATE
capability_registry_refs: []
capability_registry_sync_status: PENDING
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: ["RS-G3-HIERARCHICAL-RISK-BUBBLING", "RS-G3-EDGE-CAUSAL-OBSERVABILITY", "RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: UNASSESSED
state_identity_evidence_refs: []
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: mission-book/reports/MON-902
---

# MON-902 — Overview Graph + Node / Path Inspector

## 目标

把 MON-901 的 normalized projection 做成：

```text
Level 0 City Overview
→ Level 1 Node / Path Inspector
→ Level 2 Evidence / Technical Details
```

## UI 原则

### Overview

默认 task-centric，不以模型名组织全图。

必须支持：

- RUNNING / WAITING / REVIEW / BLOCKED / FAILED / COMPLETE；
- active warning / degraded / repeated retry 的 risk bubbling；
- stable layout；
- cluster/collapse；
- DAG；
- edge-type filter；
- 当前 Owner-required 状态显著可见。

### Node Inspector

至少回答 What / Why / Who-or-What owns it / What next。

### Path Inspector

至少展示：

- edge type；
- source/destination；
- trigger/reason；
- time/duration（可见时）；
- decision/evidence provenance；
- handoff/retry/review/device-route/model-route 等 semantic metadata。

## 禁止

- 总图状态“看起来正常”但详情里长期 retry/block；
- 用 UI tree 结构限制底层只能是 tree；
- 100+ 节点时无 collapse/cluster；
- 每个实时 event 都触发全图重新排版；
- 正常诊断需要穿过深层目录迷宫。

## 交互预算

常规异常从 Overview 到 exact evidence，目标不超过 2–3 次交互。

移动端可采用 overview + bottom sheet inspector；桌面端可采用 graph + inspector + event stream。

## Research capture

重点：

```text
active_risk_present
risk_bubbled_to_overview
false_safe_summary
node_count
visible_node_count
collapsed_cluster_count
edge_count
edge_filter
layout_reflow_count_if_observable
navigation_steps_to_cause
navigation_steps_to_evidence
edge_reason_complete
owner_intervention_due_to_missing_observability
```

## 完成门槛

- real task DAG projection；
- node/path inspector；
- risk bubbling；
- stable/collapsible layout；
- desktop + current supported Android/Web surface strategy；
- exact-head runtime/UI evidence；
- opposite-host review；
- PAPER_MATERIAL_INDEX。
