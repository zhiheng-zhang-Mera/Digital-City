---
workbook_id: MON-903
phase: CITY_WORK_MONITOR
sequence: 3
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: ["7eb38f1b930dfe6cc13dab0e17dedee467b1254b"]
development_baseline_sha: "213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-06): baseline_anchor_mode=DEPENDENCY_SHA_UNION_AT_CLAIM resolved literally. The single declared dependency MON-901 accepted head (7eb38f1b930dfe6cc13dab0e17dedee467b1254b) was verified to be an ANCESTOR of refs/heads/main (git merge-base --is-ancestor exit 0), and main resolved to 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef, so the dependency union is the eligible base itself and no merge had to be constructed. The workbook declares no required_ancestor_shas. Dependency smoke run BEFORE any MON-903 product change: node --test tests/mon901-observation.test.mjs -> 8 pass / 0 fail at that exact commit (a fresh worktree has no node_modules, so npm ci was run first as an environment step, not as part of the measurement). Development worktree D:/utopia-mon903 on branch mon/MON-903-mech-decision-overlay. Claim record: mission-book/reports/MON-903/CLAIM_RECORD.md, which also records why this task was claimed now (the research series had no eligible next task for this host) and that the control repository was re-fetched immediately before the claim so no other host's claim could be overwritten."
dependencies: ["MON-901"]
development_host: "Mech"
development_branch: "mon/MON-903-mech-decision-overlay"
development_head_sha: "1d1593df9f3370711df7fbb735fb2ccb393e7494"
development_ci: "V0.2 checks 37401385199 on exact 1d1593df9f3370711df7fbb735fb2ccb393e7494 - IN PROGRESS when this report was written; the terminal result is recorded in DEVELOPMENT_REPORT.md when observed. LOCAL measurement at that head: npm test -> 1365 tests, 1360 pass / 5 fail, the five being the same inherited-environment failures reported for REX-803 (capability-adapters and city-roads CORRUPT_INPUT, reproduced identically at baseline 213f9f9f, and host-city-launcher x3 because the resident City holds the host coordination reservation). MON-903's own probes: 8 unit + 5 real-gateway + 2 browser, all pass, plus the MON-901 dependency suite 8/8 unchanged."
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: City Work Monitor / Task Inspector / Autonomy & Approval
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: "VERIFIED locally: tests/mon903-decision-route.test.mjs drives the real gateway (create task -> claim -> report FAILED) and asserts the decision receipt appears with the canonical event it cites as evidence; tests/mon903-decisions-web.test.mjs renders the surface in a real Chromium and reads the pre/post state, the evidence pointer and the explicit 'Applied by: nobody'. Hosted CI verification is pending."
ui_exemption_reason: null
capability_ids: ["CAP-MON-003"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-MON-003.yaml"]
capability_registry_sync_status: CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/MON-903/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: ["RS-G3-OWNER-INTERVENTION-TAXONOMY","RS-G3-PASSIVE-EVIDENCE-PIPELINE","RS-G3-DYNAMIC-LIVENESS","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G3_SPARSE_ACTIVE
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/MON-903/PAPER_MATERIAL_INDEX.md"]
monitor_observability_evidence: CAPTURED
monitor_observability_refs: ["mission-book/reports/MON-903/PAPER_MATERIAL_INDEX.md"]
decision_trace_evidence: CAPTURED
decision_trace_refs: ["mission-book/reports/MON-903/DEVELOPMENT_REPORT.md"]
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/MON-903
dependency_source_workbooks: ["MON-901"]
baseline_blocker: null
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
