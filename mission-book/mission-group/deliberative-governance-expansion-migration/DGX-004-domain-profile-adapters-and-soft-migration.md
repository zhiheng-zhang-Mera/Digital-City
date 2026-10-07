---
workbook_id: DGX-004
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 4
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 0907309f0b8fbee2fcc0260e2a69a5582a1041b5
baseline_resolution_evidence: mission-book/reports/DGX/DGX-004.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-001", "DGX-002"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 33faba449222f2cfab108ccfe62a78f41c9743a9
development_ci: {"head_sha":"33faba449222f2cfab108ccfe62a78f41c9743a9","run_id":37573979023,"status":"IN_PROGRESS","conclusion":null}
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: CONTRACT_CONFORMANCE_ONLY
ui_exemption_reason: VERSIONED_GOVERNANCE_CONTRACT_OR_AUDIT_CONSUMED_BY_PROCESS_INSPECTOR
capability_ids: ["CAP-DGX-GOVERNANCE-001", "CAP-DGX-PROCESS-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-DGX-GOVERNANCE-001.yaml", "capability-registry/records/CAP-DGX-PROCESS-001.yaml"]
capability_registry_sync_status: CANDIDATE_PENDING_FORMAL_REVIEW
research_evidence_applicability: BOUNDED_DEVELOPMENT_OBSERVATION
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: STANDARD
state_identity_evidence: EXACT_DEVELOPMENT_HEAD
state_identity_evidence_refs: []
monitor_observability_evidence: CONTROLLED_CONFORMANCE
monitor_observability_refs: []
decision_trace_evidence: CONTROLLED_CONFORMANCE
decision_trace_refs: []
owner_gate: OWNER_AUTHORIZED_DEVELOPMENT_NO_MAIN_MERGE
merge_authority: false
report_path: mission-book/reports/DGX
development_component_commit_sha: d9d2750168050d0b4a91ae4ab192e2048b77fae0
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-001","DGX-002"]
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。依赖与正式 Review 不豁免。  
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

# DGX-004 — Domain Profile Adapters & Soft Migration

## 目标

让 Engineering / Research / Health 等旧楼通过 `DomainReviewProfile` 接入治理协议，而不是搬走专业能力。

## Profile 最低字段

```text
domain
task_decomposition_rules
problem_node_types
required_executor_roles
required_reviewer_roles
independence_floor
evidence_rules
validation_hooks
conflict_types
adjudication_inputs
criticality_policy
release_requirements
```

## 首批 Profile

### ENGINEERING

复用 Foreman + CI/exact SHA + fresh verifier + Formal Review。

**兼容性硬约束：**

- 当前 Formal Review 继续要求不同实体主机；
- 同机 fresh critic 仅可做诊断/预审；
- DGX 的 independence profile 可以要求更严格，不能要求更宽松；
- 如未来 Review Independence v2 被正式激活并验收，才允许以显式 migration 改写该 floor。

### RESEARCH

Method / Evidence / Claim / Reproducibility + research adjudication；Problem Graph 可表达并行证据检查、alternative hypothesis 与 replication task，但不能把论文兴趣变成产品 acceptance truth。

### HEALTH

先建立 contract/seam；不得把设计中的 PK/PD/DDI 能力伪装成已实现 clinical truth。高风险健康结论仍受专业 evidence/safety profile 限制。

## 迁移规则

KEEP-IN-PLACE 优先；通过 typed port/reference 连接。若需要 EXTRACT，必须给出重复 ownership 的实证和最小迁移边界。

## 完成门槛

至少 Engineering 与 Research 在不复制 canonical truth 的情况下完成 adapter conformance；Health 对未实现部分诚实标记 capability unavailable；现有领域 Review gate 不因 adapter 接入而被隐式降低。

语言配对 / Language pair: [English reading](en/DGX-004-domain-profile-adapters-and-soft-migration.md)
