---
workbook_id: DGX-990
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 990
execution_enabled: true
status: DEVELOPMENT_CANDIDATE_WAITING_DEPENDENCIES
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 954065e5b96c8daf8d0c234095459f3ab5ba87b9
baseline_resolution_evidence: mission-book/reports/DGX/DGX-990.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-003", "DGX-004", "DGX-005", "DGX-006", "DGX-007"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 99c5d36a402422ad2b9100648d1ccd443ce25503
development_ci: {"head_sha":"99c5d36a402422ad2b9100648d1ccd443ce25503","run_id":37574261361,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37574261361"}
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: PARTIAL
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
development_component_commit_sha: 7194d37682a4d87b9e102ab5d791bd3dcf9df656
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-003","DGX-004","DGX-005","DGX-006","DGX-007"]
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。依赖与正式 Review 不豁免。  
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

# DGX-990 — Cross-domain Acceptance & Freeze

## 目标

对 DGX v2 做跨域、跨角色、必要时跨主机的独立验收，并冻结制度合同。

## 必测场景

1. Engineering：复杂请求拆分成 Problem DAG，独立开发/验证/冲突/终审；
2. Research：多角色 objection/rebuttal/evidence adjudication；
3. Health-style professional query：允许使用可用 evidence/reviewer seam，但不得冒充未实现 clinical simulator；
4. 无冲突 fast path；
5. 双方都错 / MORE_EVIDENCE_REQUIRED；
6. Owner-only escalation；
7. 同一 Shared Fact Snapshot 下的隔离执行与结构化 ResultEnvelope 汇合；
8. DGX-003 independence profile 的 eligibility/fallback；
9. DGX-005 fresh-context Pass A → Pass B reconciliation；
10. Governance/Monitor unavailable 时 unrelated task 不冻结；
11. Problem Graph 与 canonical task truth 冲突时能诚实 reconciliation；
12. Process Capsule 不隐藏 active risk，也不过载 Owner；
13. **Engineering current opposite-host Formal Review floor 未被任何 DGX adapter 降级。**

## Freeze 条件

所有前置工作书均完成 Development + independent Review + exact-head evidence；Capability/ownership map 与 runtime reality reconciliation 一致。

若届时 Review Independence v2 尚未独立验收，Engineering Formal Review 继续使用当时 canonical 规则；DGX freeze 不得替它预先放宽门槛。

候选 terminal marker：

`DELIBERATIVE_GOVERNANCE_V2_CROSS_DOMAIN_ACCEPTED`

该 marker 只表示治理/拆分/仲裁协议被验证，不表示所有领域专业模型都已实现，也不表示 Review Pool v2 已生效。

语言配对 / Language pair: [English reading](en/DGX-990-cross-domain-acceptance-and-freeze.md)
