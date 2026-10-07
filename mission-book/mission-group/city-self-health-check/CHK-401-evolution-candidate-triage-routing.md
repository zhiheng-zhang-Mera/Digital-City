---
workbook_id: CHK-401
phase: CITY_SELF_HEALTH_CHECK
sequence: 401
execution_enabled: true
status: REVIEW
activation_state: OWNER_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: OWNER_SERIES_DEVELOPMENT_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/Alien-GPT-CHK"]
required_ancestor_shas: ["cc799234e7daa3d8ccfde5673b9d07ccb2376742"]
dependency_source_shas: []
development_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
baseline_resolution_evidence: mission-book/reports/CHK/CLAIM.json
anchor_state: CLAIMED_EXACT_SHA_WITH_OWNER_SERIES_OVERRIDE
dependencies: ["CHK-301"]
development_host: Mera-Alianware
development_branch: Alien-GPT-CHK
development_head_sha: 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d
development_ci: SUCCESS https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37578970705 exact 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d (gateway-web and android)
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: NONE_INTERNAL
backend_wiring: NOT_APPLICABLE_INTERNAL
ui_exemption_reason: "Internal bounded health checks; activation does not authorize UI changes or automatic repairs."
capability_ids: ["CAP-CITY-SELF-CHECK-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-CITY-SELF-CHECK-001.yaml"]
capability_registry_sync_status: CANDIDATE_DEVELOPMENT_RECONCILED_AWAITING_WHOLE_SERIES_REVIEW
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
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CHK
dependency_source_workbooks: ["CHK-301"]
baseline_blocker: null
owner_series_development_override: 2026-10-07_ALL_CHK_DEVELOPMENT_BEFORE_WHOLE_SERIES_SECOND_HOST_REVIEW
independent_series_review: NOT_RUN
---

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.

> **OWNER ACTIVATED / EXECUTION ENABLED.** 首次运行采用 bounded dry-run/read-only；依赖、正式复检与安全晋升门槛继续生效，不授权自动修复或自我修改。

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
