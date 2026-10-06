---
workbook_id: DGX-004
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
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
dependencies: ["DGX-001", "DGX-002"]
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

# DGX-004 — Domain Profile Adapters & Soft Migration

## 目标

让 Engineering / Research / Health 等旧楼通过 `DomainReviewProfile` 接入治理协议，而不是搬走专业能力。

## Profile 最低字段

```text
domain
task_decomposition_rules
required_reviewer_roles
evidence_rules
validation_hooks
conflict_types
adjudication_inputs
criticality_policy
release_requirements
```

## 首批 Profile

- ENGINEERING：Foreman + fresh verifier + CI/exact SHA + independent review；
- RESEARCH：Method/Evidence/Claim/Reproducibility + research adjudication；
- HEALTH：先建立 contract/seam；不得把设计中的 PK/PD/DDI 能力伪装成已实现 clinical truth。

## 迁移规则

KEEP-IN-PLACE 优先；通过 typed port/reference 连接。若需要 EXTRACT，必须给出重复 ownership 的实证和最小迁移边界。

## 完成门槛

至少 Engineering 与 Research 在不复制 canonical truth 的情况下完成 adapter conformance；Health 对未实现部分诚实标记 capability unavailable。
