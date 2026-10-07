---
workbook_id: DGX-990
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 990
execution_enabled: true
status: WAITING_DEPENDENCIES
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
dependencies: ["DGX-003", "DGX-004", "DGX-005", "DGX-006", "DGX-007"]
development_host: Alien
development_branch: Alien-GPT-DGX
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
owner_gate: OWNER_AUTHORIZED_DEVELOPMENT_NO_MAIN_MERGE
merge_authority: false
report_path: null
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。依赖与正式 Review 不豁免。  
> **Anchor policy:** 所有 baseline / dependency exact SHA 当前故意留空。只有 Owner 显式激活后，才按当时最新 canonical truth 解析 full SHA 并原子写入。

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
