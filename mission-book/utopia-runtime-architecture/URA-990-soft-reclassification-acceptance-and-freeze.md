---
workbook_id: URA-990
phase: UTOPIA_RUNTIME_ARCHITECTURE
sequence: 990
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
dependencies: ["URA-001", "URA-002", "URA-003", "URA-004"]
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

# URA-990 — Soft Reclassification Acceptance & Freeze

## 目标

验证运行时 taxonomy 与 contract 能在不大拆 Utopia 的情况下提升边界清晰度，并冻结 v1 分类。

## 必测

1. Core 不依赖具体业务 App；
2. 至少一个 Platform Service 可被两个上层 consumer 通过 public contract 使用；
3. 至少一个 Native App 实现“逻辑独立 + UX 内嵌”；
4. Connector failure 不污染 Core truth；
5. App disable/crash 不拖垮无关能力；
6. Capability Registry 与 runtime reality / user surface 一致；
7. 单仓边界测试可阻止明显反向依赖；
8. 不要求为了分类整洁做无收益代码搬迁。

## Freeze outcomes

允许：

- `UTOPIA_RUNTIME_ARCHITECTURE_V1_ACCEPTED`
- `CLASSIFICATION_ACCEPTED_CODE_MOVES_DEFERRED`
- `KEEP_CURRENT_STRUCTURE_NO_MEASURED_BENEFIT`

后两者也可以是成功结论。

## 边界

URA-990 不自动授权物理拆仓。
