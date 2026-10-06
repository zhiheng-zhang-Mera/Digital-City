---
workbook_id: DGX-005
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 5
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
dependencies: ["DGX-002", "DGX-003", "DGX-004"]
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

> **PARKED / NOT ACTIVATED.** 本工作书当前只冻结设计边界；不得 claim、不得施工、不得据此创建 Utopia 产品分支。  
> **Anchor policy:** 所有 baseline / dependency exact SHA 当前故意留空。只有 Owner 显式激活后，才按当时最新 canonical truth 解析 full SHA 并原子写入。

# DGX-005 — Conflict / Defence / Independent Adjudication

## 目标

实现 material conflict 的结构化发现、双方辩护与第三方独立仲裁。

## Conflict taxonomy

至少支持 FACT / METHOD / INTERPRETATION / EXECUTION / REQUIREMENT。

## Defence contract

每个争议方可提交：

```text
claim
supporting_evidence_refs
assumptions
critique_of_alternative
what_evidence_would_change_my_mind
confidence_if_available
```

允许撤回、部分接受、合并；禁止强迫 Agent 为原方案死撑。

## Adjudicator independence

仲裁者不得参与争议部分原始实现；优先 evidence，不按声望/票数直接裁决。

最低 verdict：

`A_ACCEPTED / B_ACCEPTED / MERGED / BOTH_REJECTED / MORE_EVIDENCE_REQUIRED / OWNER_REQUIRED`。

## 完成门槛

冲突不会静默覆盖；仲裁 provenance 可追踪；缺证据时不得伪造确定结论。
