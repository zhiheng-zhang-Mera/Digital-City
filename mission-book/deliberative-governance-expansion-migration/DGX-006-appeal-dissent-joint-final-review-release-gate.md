---
workbook_id: DGX-006
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 6
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
dependencies: ["DGX-005"]
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

# DGX-006 — Appeal / Dissent / Joint Final Review & Release Gate

## 目标

在 Integrated Candidate 形成后，把结果发回所有实际参与者做 scoped final review，并提供有界申诉/少数意见机制。

## Final reviewer verdict

```text
APPROVE
APPROVE_WITH_MINOR_NOTES
REQUEST_CHANGES
BLOCK
```

每个 verdict 必须声明 review scope、checked claims/evidence 与 unresolved objection severity。

## Release semantics

不是要求所有 Agent 对所有内容完全同意，而是：

- 无未解决 Critical；
- 无未解决 Major factual/safety/correctness objection；
- 对应领域责任 reviewer 的必需 gate 已 PASS；
- dissent 可保留但不得被静默删除。

重大 REQUEST_CHANGES/BLOCK → 返回 Integration；Owner-only 边界 → Owner。

## Appeal

申诉必须新增证据、指出 procedure violation 或具体 factual error；不得无限循环。次数/升级阈值在激活时由 policy 明确。

## 完成门槛

有界终审、无无限 consensus loop、release receipt 可审计。
