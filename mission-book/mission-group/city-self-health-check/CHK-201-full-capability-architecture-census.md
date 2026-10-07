---
workbook_id: CHK-201
phase: CITY_SELF_HEALTH_CHECK
sequence: 201
execution_enabled: true
status: IN_PROGRESS
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
dependencies: []
development_host: Mera-Alianware
development_branch: Alien-GPT-CHK
development_head_sha: 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d
development_ci: IN_PROGRESS final exact-head CI; prior 672d6ce run 37577880475 SUCCESS is historical only
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
capability_ids: ["CAP-CITY-SELF-CHECK-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-CITY-SELF-CHECK-001.yaml"]
capability_registry_sync_status: CANDIDATE_PENDING_WHOLE_SERIES_REVIEW
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
baseline_blocker: null
owner_series_development_override: 2026-10-07_ALL_CHK_DEVELOPMENT_BEFORE_WHOLE_SERIES_SECOND_HOST_REVIEW
independent_series_review: NOT_RUN
---

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.

> **OWNER ACTIVATED / EXECUTION ENABLED.** 首次运行采用 bounded dry-run/read-only；依赖、正式复检与安全晋升门槛继续生效，不授权自动修复或自我修改。

# CHK-201 — Full Capability / Architecture Census / 大体检

## 目标

从真实实现与运行面反向重建一次 City/Utopia 现状，再与 Registry、City topology、Mission truth 对账，发现“账面自洽但现实已漂移”的问题。

## 1. Full Capability Census

从：

```text
Utopia code
+ API/actions
+ runtime services
+ Web/Android surfaces
+ Mission history
+ accepted evidence
```

反向发现 capability，再与 Registry 对账。

分类至少包括：

- UNREGISTERED_CAPABILITY；
- DUPLICATE_CAPABILITY；
- DEAD_CAPABILITY_RECORD；
- OVER_AGGREGATED_CAPABILITY；
- OVER_FRAGMENTED_CAPABILITY；
- WRONG_OWNER；
- WRONG_EXPOSURE_CLASS；
- REGISTRY_RUNTIME_MISMATCH。

## 2. Architecture Census

对照 URA 候选 taxonomy：

```text
Core
Platform/System Service
System App
Native App
Connector
```

检查业务侵入 Core、反向依赖、重复 owner、Service/App 角色漂移等。

输出只允许：

`KEEP / RECLASSIFY / BOUNDARY_REPAIR / MIGRATION_CANDIDATE`。

## 3. City ↔ Utopia Mapping

对账：

```text
District / Building / Room / Road
↔
Utopia module / service / app / contract
```

查 owner、Road/API、consumer、lifecycle 是否过期。

## 4. Dependency / Contract Health

重建真实依赖图，检查：

- cycle；
- reverse dependency；
- hidden coupling；
- dead dependency；
- orphan module；
- undocumented runtime dependency；
- schema/version/failure semantics drift。

## 5. Legacy / Zombie / Dead State

识别：

- dead code/API/surface；
- stale docs；
- superseded rules；
- abandoned future plans；
- old evidence pointers；
- duplicate adapters；
- dead feature flags。

发现不等于删除。

## 6. Governance / Rule Debt

每条长期规则回答：

```text
source failure
current scope
still needed?
false blocks?
conflicts?
overhead?
superseded?
retire/narrow/keep?
```

## 7. Autonomy Health

能测时汇总：

- Owner intervention；
- autonomous task transitions；
- false COMPLETE；
- duplicate work；
- repair loops；
- repeated escalation；
- idle/wait；
- resume/handoff failures。

## 8. Evidence / Security / Authority

检查 evidence 可取回性、checksum/retention、credential/permission/identity/revoke 边界与日志敏感信息。

## 输出

只生成 census/report + follow-up routing，不直接大修。


---

语言读本 / Reading translation: [English](en/CHK-201-full-capability-architecture-census.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
