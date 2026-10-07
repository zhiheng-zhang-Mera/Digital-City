---
workbook_id: DGX-001
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 1
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
baseline_resolution_evidence: mission-book/reports/DGX/DGX-001.md
anchor_state: EXACT_SHA_ANCHORED
dependencies: []
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 99c5d36a402422ad2b9100648d1ccd443ce25503
development_ci: {"head_sha":"99c5d36a402422ad2b9100648d1ccd443ce25503","run_id":37574261361,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37574261361"}
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
development_component_commit_sha: 3833751c1a075142f82d91c7be07910eccbcdfdb
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。依赖与正式 Review 不豁免。  
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

# DGX-001 — Governance Ownership Audit & Capability Map

## 目标

对现有跨域能力做一次**软重分类审计**，不搬代码。除治理能力外，本轮增加对认知拆分/汇合所需 primitive 的 canonical owner 审计，生成机器可读/人工可读的 Governance Capability Map：

```text
capability
canonical_owner
governance_role
execution_role
domain_profile
consumer_refs
duplication_or_conflict
migration_required
```

## 必查对象

Shared Task Core、Capability Fabric、JEV/Monitor、Guardian/compliance、Engineering Foreman/verifier、Research Review/adjudicator、Health evidence/simulation seams、GAI triage、Owner gates，以及：

- request decomposition / planner；
- Shared Fact Snapshot；
- Problem Graph / DAG representation；
- Task Capsule；
- structured Result / Evidence Envelope；
- participant capability/history facts；
- independence / recusal facts。

## 关键审计问题

1. 哪些 primitive 已由现有 Task/Event/Evidence infrastructure 提供？
2. 哪些只是 governance schema，不需要新 runtime service？
3. Problem Graph 是否会错误复制 Mission Book / scheduler truth？
4. capability/history/independence facts 的 canonical owner 在哪里？
5. 哪些现有 reviewer/critic/adjudicator 能力只需 adapter，而不是迁移？
6. 是否存在“同一个概念在 Engineering / Research / DGX 各存一份”的 drift 风险？

## 强约束

- 默认 `migration_required=false`；
- DOMAIN_REVIEW 与 GOVERNANCE_REVIEW 分离；
- DOMAIN_ADJUDICATOR 与 GOVERNANCE_ADJUDICATOR 分离；
- Problem Graph 不得成为第二套 runtime task truth；
- history/reputation/independence facts 不复制成 DGX 私有数据库；
- 只有重复实现、跨域制度语义或 canonical owner 明显错误时允许提出迁移；
- 本工作书不得改变当前 Formal Review 异机门槛。

## 完成门槛

形成 ownership map、冲突清单、KEEP/REFERENCE/EXTRACT 三分类、认知编排 primitive 的 owner map 与后续工作书输入；不得产生产品行为变化。

语言配对 / Language pair: [English reading](en/DGX-001-governance-ownership-audit-and-capability-map.md)
