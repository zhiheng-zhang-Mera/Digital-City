---
workbook_id: RIV-990
phase: REVIEW_INDEPENDENCE_V2
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
dependencies: ["RIV-001", "RIV-002", "RIV-003", "RIV-004"]
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

# RIV-990 — Controlled Acceptance + Migration Decision

## 目标

在真正改变 Review 规则前，用可证伪证据判断多维 profile 是否能安全替代或强化现行异机门槛。

## 最低验收

比较至少覆盖：

1. current opposite-host Formal Review baseline；
2. same-host fresh critic（诊断对照，不预设可晋级）；
3. different-agent / same-host；
4. different-host / similar model；
5. environment-diverse review；
6. 高风险案例与普通案例；
7. developer-report-before vs fresh-context-first；
8. historical replay + 新受控案例。

关注：

- defect discovery；
- environment-specific defect；
- false assurance；
- evidence independence；
- time/resource overhead；
- Owner intervention；
- review disagreement / reversal。

## Migration gate

只有同时满足：

- 候选新规则达到不低于现行 assurance；
- 风险边界清楚；
- fallback/unknown 语义明确；
- `CONSTRUCTION_RULES.md` 有显式迁移补丁；
- Owner 明确批准；

才允许修改当前 Formal Review gate。

否则 terminal outcome 可以是：

`RIV_EVALUATED_KEEP_CURRENT_OPPOSITE_HOST_RULE`

这同样视为成功研究/设计结论。

## 候选成功 marker

`REVIEW_INDEPENDENCE_V2_ACCEPTED_FOR_EXPLICIT_MIGRATION`

它本身仍不自动修改施工规则。
