---
workbook_id: CHK-201
phase: CITY_SELF_HEALTH_CHECK
sequence: 201
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
dependencies: []
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

> **PARKED / NOT ACTIVATED.** 当前仅保存未来大体检合同。

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
