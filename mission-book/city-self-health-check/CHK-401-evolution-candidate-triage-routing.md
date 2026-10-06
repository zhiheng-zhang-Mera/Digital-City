---
workbook_id: CHK-401
phase: CITY_SELF_HEALTH_CHECK
sequence: 401
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
dependencies: ["CHK-301"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: NONE_INTERNAL
backend_wiring: NOT_APPLICABLE_INTERNAL
ui_exemption_reason: "Parked self-check design; no runtime/UI implementation authorized."
capability_ids: []
capability_registry_action: NOT_APPLICABLE
capability_registry_refs: []
capability_registry_sync_status: NOT_APPLICABLE
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

# CHK-401 — Evolution Candidate Triage & Routing

## 目标

把 CHK-301 产生的候选送到正确的后续机制，不让“自进化”变成一个可以直接改所有东西的万能权限。

## 候选路由

### Rule / governance change

→ DGX / RIV / Mission Book rule migration，视范围而定。

### Runtime architecture / ownership

→ URA 或独立 architecture migration。

### Research hypothesis / replay / fault / ablation

→ REX。

### Capability/UI exposure repair

→ Capability Registry-linked Mission workbook。

### Provider/routing intelligence

→ 对应 Engineering/GAI runtime programme；高风险策略先 shadow。

### Boss donor harvest

→ 先做 legacy diff，再决定 KEEP_AS_REFERENCE / EXTRACT_DESIGN / EXTRACT_CODE / SUPERSEDED。

## Safety ladder

任何真正 self-evolution proposal 默认至少：

```text
candidate
→ sandbox / isolated implementation
→ historical replay
→ controlled evaluation
→ shadow mode
→ independent verification
→ explicit promotion authority
→ limited rollout
→ Monitor/JEV observation
→ full promotion or rollback
```

具体任务可更严格，不得更宽松到绕过领域安全边界。

## Candidate states

```text
PROPOSED
NEEDS_EVIDENCE
ROUTED
CONTROLLED_EVALUATION
SHADOW
AWAITING_PROMOTION_AUTHORITY
PROMOTED_LIMITED
PROMOTED
ROLLED_BACK
REJECTED
SUPERSEDED
```

这些状态未来必须由实际 owner programme 持有；CHK 只保留 routing receipt，不建立第二套执行真相。

## 完成门槛

每个季度候选都有唯一 destination / defer reason / rejection reason；没有 ownerless evolution proposal。


---

语言读本 / Reading translation: [English](en/CHK-401-evolution-candidate-triage-routing.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
