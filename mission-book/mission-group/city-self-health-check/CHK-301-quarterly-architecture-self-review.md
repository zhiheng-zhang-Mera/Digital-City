---
workbook_id: CHK-301
phase: CITY_SELF_HEALTH_CHECK
sequence: 301
execution_enabled: true
status: WAITING_DEPENDENCIES
activation_state: OWNER_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/Alien-GPT-CHK"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: WAITING_ACCEPTED_DEPENDENCIES
dependencies: ["CHK-201"]
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
ui_exemption_reason: "Internal bounded health checks; activation does not authorize UI changes or automatic repairs."
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
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CHK
dependency_source_workbooks: ["CHK-201"]
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
---

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
