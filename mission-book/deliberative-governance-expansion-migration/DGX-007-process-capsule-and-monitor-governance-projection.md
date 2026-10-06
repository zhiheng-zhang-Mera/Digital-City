---
workbook_id: DGX-007
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 7
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
dependencies: ["DGX-002", "DGX-005", "DGX-006"]
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

# DGX-007 — Process Capsule + Monitor Governance Projection

## 目标

让 Owner 每次收到正式复杂任务结果时都能看到**压缩后的思考/验证过程链**，但不被迫做人肉 reviewer。

## L0 — Process Capsule（默认随结果返回）

至少显示：

- task decomposition summary；
- participants / roles；
- assignment basis；
- material conflicts；
- adjudication outcomes；
- validation performed；
- residual uncertainty；
- final release-gate state。

## L1 — Deliberation Inspector

按需展开 Claim / Evidence / Objection / Defence / Arbiter rationale summary / dissent。

## L2 — Technical Evidence

按需查看 exact SHA、CI/test、source/citation、artifact、decision receipt、timestamps 等。

## 隐私与认知负担边界

不得显示/保存隐藏 chain-of-thought；不得把 routine heartbeat、重复日志、每个 token、未采用草稿默认推给 Owner。

## Monitor 边界

复用 City Work Monitor 的 projection/progressive disclosure；Governance projection 不是新的 task truth，Monitor/JEV 故障不能阻塞无关执行。

## 完成门槛

至少一个无冲突案例和一个有冲突/仲裁案例能生成准确 Process Capsule，并能从 L0 追到 exact evidence。
