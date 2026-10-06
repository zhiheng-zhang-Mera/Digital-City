---
workbook_id: MON-902
phase: CITY_WORK_MONITOR
sequence: 2
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["7eb38f1b930dfe6cc13dab0e17dedee467b1254b"]
dependency_source_shas: ["7eb38f1b930dfe6cc13dab0e17dedee467b1254b"]
development_baseline_sha: "7eb38f1b930dfe6cc13dab0e17dedee467b1254b"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-05): baseline_anchor_mode=DEPENDENCY_SHA_UNION_AT_CLAIM executed literally. Dependency MON-901 accepted exact head read from its workbook frontmatter (development_head_sha == review_head_sha) = 7eb38f1b930dfe6cc13dab0e17dedee467b1254b, which is the reviewed and released MON-901 head. The eligible base refs/heads/main resolved to d3262ce2dd81e51a53e39e6f9add8dee650a7682 and a worktree was created from that full SHA. The union was then constructed with git merge 7eb38f1b930dfe6cc13dab0e17dedee467b1254b, which fast-forwarded: MON-901 is a descendant of main, so the union baseline IS the MON-901 head and contains main rather than diverging from it. Ancestry verified with git merge-base --is-ancestor for the required ancestor and for d3262ce2dd81e51a53e39e6f9add8dee650a7682 -> both ANCESTOR_OK, so no BASELINE_ANCESTRY_MISMATCH. Dependency smoke run BEFORE any MON-902 product modification: node --test tests/mon901-observation.test.mjs -> pass 8 / fail 0 at the union baseline. One instrument failure recorded rather than hidden: the first smoke run failed with ERR_MODULE_NOT_FOUND for the package ws, because a fresh worktree has no node_modules; after npm ci the same command passed 8/8, so the failure was an environment-setup artefact, not a dependency defect. Development worktree: D:/utopia-mon902 on branch mon/MON-902-mech-overview-graph."
dependencies: ["MON-901"]
development_host: "Mech"
development_branch: "mon/MON-902-mech-overview-graph"
development_head_sha: "fd70d00837a8309db718ee56fab7738a8b947530"
development_ci: "CORRECTED CLAIM. The previous value of this field asserted that BOTH the push and the pull_request V0.2 runs were green on 5460697cfde5d807f022698a0411b040634a458b. That was wrong, and this host measured it wrong: re-reading the Actions API for that head shows push run 37290743026 COMPLETED FAILURE (job gateway-web failure, job android success) alongside pull run 37290746745 success and linkage 37290746628 success. The failure was a measurement defect in MON-902's own browser probe: tests/web.test.mjs waited for `.monitor-panel`, which exists while the page still says 'Loading from the Gateway...', and then asserted loaded-state copy - so it passed locally and in one CI run and failed in the push run with actual 'CITY MONITOR\\n\\nLoading from the Gateway...'. It is preserved in the record rather than cleaned away (evidence protocol section 1). REPAIRED by marking the panel's state machine-readably (data-loaded true/false/error) and waiting for the projection in the probe. NEW HEAD fd70d00837a8309db718ee56fab7738a8b947530 carries the repair. ITS EXACT-HEAD CI, re-read per run: V0.2 checks push run 37403423102 COMPLETED SUCCESS (jobs gateway-web pass 5m24s, android pass 1m24s) as reported by the PR check view for the same head; the earlier head's PR run 37290746745 was also green. At hand-off, PR zhiheng-zhang-Mera/utopia#27 reports the head as mergeable=CONFLICTING, which is the latest-main integration obligation recorded in integration_note and in DEVELOPMENT_HANDOFF.md section 3, not a CI failure."
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
integration_note: "LATEST-MAIN INTEGRATION IS STILL OWED. Measured at hand-off: the reviewed head is 48 commits behind origin/main 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef (32 commits ahead of the merge-base 7eb38f1b930dfe6cc13dab0e17dedee467b1254b). Seven files are touched on BOTH sides and will need a union at merge: apps/web/app.js, apps/web/i18n/en.js, apps/web/i18n/zh-CN.js, apps/web/index.html, services/dev-gateway/server.mjs, package-lock.json, city/package-lock.json."
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: City Work Monitor
user_exposure_nesting: L1_PRIMARY
backend_wiring: "VERIFIED end to end against the real gateway route. tests/mon902-monitor-panel.test.mjs creates a real canonical task through POST /api/v0/tasks, reads GET /api/v0/monitor/graph from the real gateway, asserts the graph describes that task, and renders THAT payload; it also asserts an unknown edge type filters to nothing, an unbounded collapse is refused with 400, and the route answers 401 without a credential. tests/web.test.mjs renders the page in a real Chromium and opens the inspector from a row."
ui_exemption_reason: null
capability_ids: ["CAP-MON-002"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-MON-002.yaml"]
capability_registry_sync_status: CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/MON-902/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: []
highest_research_grade_observed: G3_SPARSE_ACTIVE
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/MON-902/CLAIM_RECORD.md", "mission-book/reports/MON-902/PAPER_MATERIAL_INDEX.md"]
monitor_observability_evidence: CAPTURED
monitor_observability_refs: ["mission-book/reports/MON-902/PAPER_MATERIAL_INDEX.md", "mission-book/reports/MON-902/DEVELOPMENT_REPORT.md"]
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/MON-902
dependency_source_workbooks: ["MON-901"]
---

# MON-902 — Overview Graph + Node / Path Inspector

## 目标

把 MON-901 的 normalized projection 做成：

```text
Level 0 City Overview
→ Level 1 Node / Path Inspector
→ Level 2 Evidence / Technical Details
```

## UI 原则

### Overview

默认 task-centric，不以模型名组织全图。

必须支持：

- RUNNING / WAITING / REVIEW / BLOCKED / FAILED / COMPLETE；
- active warning / degraded / repeated retry 的 risk bubbling；
- stable layout；
- cluster/collapse；
- DAG；
- edge-type filter；
- 当前 Owner-required 状态显著可见。

### Node Inspector

至少回答 What / Why / Who-or-What owns it / What next。

### Path Inspector

至少展示：

- edge type；
- source/destination；
- trigger/reason；
- time/duration（可见时）；
- decision/evidence provenance；
- handoff/retry/review/device-route/model-route 等 semantic metadata。

## 禁止

- 总图状态“看起来正常”但详情里长期 retry/block；
- 用 UI tree 结构限制底层只能是 tree；
- 100+ 节点时无 collapse/cluster；
- 每个实时 event 都触发全图重新排版；
- 正常诊断需要穿过深层目录迷宫。

## 交互预算

常规异常从 Overview 到 exact evidence，目标不超过 2–3 次交互。

移动端可采用 overview + bottom sheet inspector；桌面端可采用 graph + inspector + event stream。

## Research capture

重点：

```text
active_risk_present
risk_bubbled_to_overview
false_safe_summary
node_count
visible_node_count
collapsed_cluster_count
edge_count
edge_filter
layout_reflow_count_if_observable
navigation_steps_to_cause
navigation_steps_to_evidence
edge_reason_complete
owner_intervention_due_to_missing_observability
```

## 完成门槛

- real task DAG projection；
- node/path inspector；
- risk bubbling；
- stable/collapsible layout；
- desktop + current supported Android/Web surface strategy；
- exact-head runtime/UI evidence；
- opposite-host review；
- PAPER_MATERIAL_INDEX。
