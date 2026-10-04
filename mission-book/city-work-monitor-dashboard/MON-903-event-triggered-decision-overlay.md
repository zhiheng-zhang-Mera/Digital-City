---
workbook_id: MON-903
phase: CITY_WORK_MONITOR
sequence: 3
execution_enabled: false
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
dependencies: ["MON-901"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: City Work Monitor / Task Inspector / Autonomy & Approval
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: ["CAP-MON-003"]
capability_registry_action: CREATE
capability_registry_refs: []
capability_registry_sync_status: PENDING
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: ["RS-G3-OBSERVE-DECIDE-DECOUPLING", "RS-G3-SUPERVISION-ATTENTION", "RS-G3-DECISION-ESCALATION-PROVENANCE", "RS-G4-AUTONOMY-SURVIVAL"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: UNASSESSED
state_identity_evidence_refs: []
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: mission-book/reports/MON-903
---

# MON-903 — Event-Triggered Decision Overlay

## 目标

给任务状态跃迁增加可观察、可追溯的 Decision layer，但**不把每次汇报变成同步审批**。

```text
observation
   ↓
state-transition candidate
   ↓
Rule
   ↓ unresolved
Fast model
   ↓ uncertain/high-impact
Critic
   ↓ owner boundary
Owner
```

## 触发原则

普通 heartbeat / progress / logs 不触发 Decision。

候选触发：

- failed / repeated failure；
- blocked；
- retry/reroute/reassign request；
- ready for review；
- resource conflict；
- scope change；
- merge/release gate；
- Owner-decision candidate。

## 非阻塞要求

- decision queue per-task；
- 无 global mutex / global approval lock；
- deterministic rule first；
- model timeout 有 bounded fallback；
- timeout/high-risk 最多暂停当前 task；
- monitor/decision service 故障不得冻结 unrelated tasks。

## Decision receipt

至少：

```text
decision_id
trigger_event
pre_state
source = RULE | FAST_MODEL | CRITIC | OWNER
action
confidence_if_available
queue_wait_ms_if_observable
decision_latency_ms_if_observable
timeout/fallback
escalation_reason
evidence_refs
post_state
```

Fast model 只输出 bounded decision contract，不以自由长文作为执行授权。

## Owner boundary

涉及花费阈值、外部发布、数据删除、权限/安全、不可逆动作、明确价值偏好或架构范围扩大时，继续遵守既有 Owner gate；本任务不得借“自动审批”扩大权限。

## Research capture

重点量化：

- rule-resolved / fast-model-resolved / critic-resolved / owner-required；
- auto-resolution rate；
- Owner interruption count and cause；
- escalation quality / repeated clarification；
- decision latency；
- queue wait；
- timeout；
- unrelated-task impact；
- wrong auto-decision / repair；
- confidence 与最终 review 结果（仅工具真实暴露时）；
- autonomy resumed after escalation。

## 完成门槛

- event-triggered rather than report-triggered；
- per-task queue；
- rule-first；
- bounded decision receipt；
- timeout/fallback；
- user-visible provenance；
- no-global-barrier evidence；
- exact-head tests/CI；
- opposite-host review；
- PAPER_MATERIAL_INDEX。
