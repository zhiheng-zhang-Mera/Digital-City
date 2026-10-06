---
workbook_id: RIV-003
phase: REVIEW_INDEPENDENCE_V2
sequence: 3
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
dependencies: ["RIV-001", "RIV-002"]
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

# RIV-003 — Fresh-context Two-pass Review Protocol

## 目标

评估严格的 fresh-context Review 是否能降低 reviewer 被 developer narrative / test choice 锚定的风险。

## Pass A — independent reconstruction

Reviewer 先只获得：

- accepted requirement / acceptance criteria；
- exact candidate head；
- canonical product/runtime context；
- 必要测试入口。

默认不先阅读 developer 的结论性 review guide、解释性 defence 或“应该看到什么”的答案。

Reviewer 独立形成：

- test plan；
- risk hypotheses；
- observed findings；
- missing evidence。

## Pass B — evidence reconciliation

再开放：

- Development Report；
- developer test/evidence；
- known limitations；
- repair history。

Reviewer 对账 Pass A / Pass B，记录哪些结论因新增显式证据改变。

## 边界

- 不记录隐藏 chain-of-thought；
- fresh context 不是“完全失忆”，必要安全/依赖事实仍必须提供；
- 本协议本身不授予 same-host Formal Review 资格；
- Pass A 失败不能被 Pass B 的作者叙事静默覆盖。

## 完成门槛

协议、最小 context contract、reconciliation receipt 与可测偏差指标明确。
