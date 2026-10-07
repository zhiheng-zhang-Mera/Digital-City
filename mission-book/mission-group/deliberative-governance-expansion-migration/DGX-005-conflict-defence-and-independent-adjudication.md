---
workbook_id: DGX-005
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 5
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: d9d2750168050d0b4a91ae4ab192e2048b77fae0
baseline_resolution_evidence: mission-book/reports/DGX/DGX-005.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-002", "DGX-003", "DGX-004"]
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
development_component_commit_sha: 16bd4ffc34aa77fd5401b2f56dc3a371653b18b7
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-002","DGX-003","DGX-004"]
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。依赖与正式 Review 不豁免。  
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

# DGX-005 — Conflict / Defence / Fresh-context Independent Adjudication

## 目标

实现 material conflict 的结构化发现、双方辩护与第三方独立仲裁，并降低仲裁者被前序叙事锚定的风险。

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

## Fresh-context two-pass adjudication

### Pass A — independent reconstruction

仲裁者先获得：

- accepted requirement / question；
- Shared Fact Snapshot；
- canonical evidence；
- conflict statement 的中性版本。

**暂不提供各方长篇 defence/rebuttal。**

仲裁者独立重建：

- material facts；
- missing evidence；
- candidate interpretations；
- provisional objections；
- needs-more-evidence 条件。

### Pass B — reconciliation

之后再开放各方 defence/rebuttal，与 Pass A 对账，形成 final verdict。

必须记录：

```text
pass_a_findings
new_information_from_defence
changed_findings
unchanged_findings
final_verdict
evidence_refs
```

不记录隐藏 chain-of-thought。

## Adjudicator independence

仲裁者不得参与争议部分原始实现；优先 evidence，不按声望/票数直接裁决。其 independence profile 由 DGX-003 声明与验证。

最低 verdict：

`A_ACCEPTED / B_ACCEPTED / MERGED / BOTH_REJECTED / MORE_EVIDENCE_REQUIRED / OWNER_REQUIRED`。

## 边界

该 two-pass protocol 是 **governance adjudication** 的独立性机制，不自动替代 Engineering Formal Review。任何正式代码/产品 Review 仍受当前领域规则约束。

## 完成门槛

冲突不会静默覆盖；仲裁 provenance 可追踪；能证明 Pass A 与 Pass B 的信息边界；缺证据时不得伪造确定结论。

语言配对 / Language pair: [English reading](en/DGX-005-conflict-defence-and-independent-adjudication.md)
