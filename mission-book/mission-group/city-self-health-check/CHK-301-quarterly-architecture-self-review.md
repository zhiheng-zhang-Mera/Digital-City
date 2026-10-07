---
workbook_id: CHK-301
phase: CITY_SELF_HEALTH_CHECK
sequence: 301
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
dependencies: ["CHK-201"]
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
dependency_source_workbooks: ["CHK-201"]
baseline_blocker: null
owner_series_development_override: 2026-10-07_ALL_CHK_DEVELOPMENT_BEFORE_WHOLE_SERIES_SECOND_HOST_REVIEW
independent_series_review: NOT_RUN
---

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.

> **OWNER ACTIVATED / EXECUTION ENABLED.** 首次运行采用 bounded dry-run/read-only；依赖、正式复检与安全晋升门槛继续生效，不授权自动修复或自我修改。

# CHK-301 — Quarterly Architecture + Self Review / 季度架构与自检

## 目标

在 CHK-201 大体检基础上，回答：

> City/Utopia 现在如何理解自己？最近反复生了什么“病”？哪些改进值得进入安全自进化候选？

## A. Self Cognition

利用 Capability Registry、City topology、URA、Mission Book、dependency graph、runtime evidence 建立可查询 self model：

```text
what capabilities exist
where implemented
canonical owner
dependencies/dependents
authority
user surfaces
runtime state
blast radius
unknown / not measured / unavailable
```

重点对应 Boss BLG-001，但默认重构，不照搬旧实现。

## B. Self Diagnosis

对季度发现建立多假设诊断：

```text
symptom
→ observations
→ hypotheses
→ missing evidence
→ root cause / contributing factor / downstream symptom
→ treatment candidates
```

诊断权与维修权分离。对应 BLG-002。

## C. System Case Record

把重复 defect/recovery 归并为长期病例：

```text
symptom history
initial hypotheses
revisions
repairs/rejected repairs
verification
root cause
recurrence links
lessons/candidate rules
```

不得用后见之明覆盖原始判断。对应 BLG-003。

## D. Runtime Intelligence Review

季度汇总：

- provider/model task fit；
- routing outcomes；
- when split/review/model-switch helped or harmed；
- bottlenecks；
- stale/unused skills；
- continuation/stop quality；
- resource/budget observations。

对应 BLG-004 / BLG-005；输出建议，不直接改 routing policy。

## E. Boss Legacy Reconciliation

固定复核 BLG-001～006：

```text
SUPERSEDED
KEEP_AS_REFERENCE
LEGACY_HARVEST_CANDIDATE
PARTIALLY_RECOVERED
STILL_MISSING
```

禁止整包回迁 Boss。

## F. Evolution Review

从 verified episodes + system cases 中寻找重复模式，形成：

```text
candidate_id
source_patterns
problem_statement
proposed_change
expected_benefit
risk
authority_scope
affected_capabilities
replay/shadow opportunity
rollback_plan_candidate
evidence_needed
recommended_destination
```

输出只允许：

- NO_CHANGE；
- OBSERVE_MORE；
- EVOLUTION_CANDIDATE；
- RETIRE_RULE_CANDIDATE；
- RECLASSIFY_CAPABILITY_CANDIDATE；
- LEGACY_HARVEST_CANDIDATE；
- SUPERSEDED_BOSS_CAPABILITY。

## 禁止

- 自动修改生产规则；
- 自动 promotion；
- experience 直接变 authority；
- 用季度审查绕过 Owner gate；
- 为了“必须进化”而制造候选。

## 完成门槛

形成 quarterly self-review package，其中每个候选都能追溯到 evidence/case，不要求一定产生 evolution candidate。


---

语言读本 / Reading translation: [English](en/CHK-301-quarterly-architecture-self-review.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
