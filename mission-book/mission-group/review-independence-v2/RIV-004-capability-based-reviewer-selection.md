---
workbook_id: RIV-004
phase: REVIEW_INDEPENDENCE_V2
sequence: 4
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
dependencies: ["RIV-002", "RIV-003"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: []
capability_registry_action: UNASSESSED
capability_registry_refs: []
capability_registry_sync_status: UNASSESSED
research_evidence_applicability: UNASSESSED
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: STANDARD
state_identity_evidence: UNASSESSED
state_identity_evidence_refs: []
monitor_observability_evidence: UNASSESSED
monitor_observability_refs: []
decision_trace_evidence: UNASSESSED
decision_trace_refs: []
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

> **PARKED / NOT ACTIVATED.**

# RIV-004 — Capability-based Reviewer Selection & Scheduler Contract

## 目标

定义未来 Reviewer Pool 的 eligibility/scheduling contract，使任务声明 assurance 需求，由 scheduler 从合法候选中选择，而不是把 reviewer 名字永久写死。

## 输入

```text
task/domain/risk
required_review_capabilities
required_independence_profile
candidate reviewer facts
host/environment/tool availability
conflict/recusal facts
```

## 输出

```text
eligible_candidates
selected_reviewer
selection_basis
unmet_independence_dimensions
fallback
escalation
```

## 规则

- eligibility 先于 ranking；
- capability fit 不能抵消硬 independence 缺口；
- 暂时无候选时诚实 WAITING_ELIGIBILITY，不得同机自签；
- future scheduler 只消费 canonical Capability/History truth，不复制第二套 registry；
- selection failure 不得冻结与该 Review 无关的任务。

## 完成门槛

形成与 Foreman/Capability Registry 可对接的 contract；仍不修改当前 §3。


---

语言读本 / Reading translation: [English](en/RIV-004-capability-based-reviewer-selection.md). 原文状态与证据具有权威性 / The source remains authoritative for status and evidence.
