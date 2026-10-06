---
workbook_id: RIV-002
phase: REVIEW_INDEPENDENCE_V2
sequence: 2
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
dependencies: ["RIV-001"]
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

# RIV-002 — Independence Profile & Assurance Classes

## 目标

把 Review 独立性写成明确 profile，而不是“换一台机器”或“换一个 Agent”的模糊替代。

## Profile dimensions

```text
authorship_independence
agent_session_independence
model_family_independence
physical_host_independence
runtime_environment_independence
hardware_toolchain_independence
evidence_source_independence
conflict_recusal
```

每个维度定义 REQUIRED / PREFERRED / NOT_REQUIRED / NOT_APPLICABLE，并记录可观察证据。

## Assurance class

按任务风险和可验证性定义少量等级，例如：

- LOCAL_DIAGNOSTIC — 不构成 Formal Review；
- STANDARD_FORMAL — 至少不低于当前正式门槛；
- ENVIRONMENT_DIVERSE — 明确要求不同 runtime/hardware；
- HIGH_ASSURANCE — 多维独立 + stronger evidence；
- DOMAIN_SPECIALIST — 专业资格优先且仍满足必要 independence。

具体等级名称和阈值激活时可调整；不得为了减少等待而降低 assurance。

## 完成门槛

profile schema、eligibility semantics、failure/unknown semantics、与当前 §3 的兼容映射全部明确。
