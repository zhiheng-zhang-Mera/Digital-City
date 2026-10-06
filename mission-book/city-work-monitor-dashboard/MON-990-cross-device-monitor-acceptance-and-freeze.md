---
workbook_id: MON-990
phase: CITY_WORK_MONITOR_CLOSEOUT
sequence: 90
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: ["f4988248a3316806fc2e3fa9e62864ed129fe7b3","3cd32c60d8e9beb9df961e6b7ff193a3f69ec224"]
development_baseline_sha: "665d6c3c0fd216ca06ef1a18144a8743f12cc63b"
baseline_resolution_evidence: "Claim-time Alien MERA-ALIANWARE: main213f9f9 plus accepted MON902 f4988248 and MON903 3cd32c60 constructed semantic union665d6c3c. Both exact accepted dependency heads verified ancestors; main unchanged after fresh fetch. Five conflict files retain both monitor controllers, routes and locales. Dependency union smoke before native changes: 80 PASS / 0 FAIL. Isolated D:/Utopia-MON990. No main merge authority."
dependencies: ["MON-902", "MON-903"]
development_host: "Alien"
development_branch: "mon/MON-990-Alien-20261006"
development_head_sha: "fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40"
development_ci: "PENDING final push37420061997 / PR37420065177; linkage37420065178 SUCCESS. Earlier head523eb47 contained superseded global-Owner-calm test assertion; local89 corrected probes PASS."
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: City Work Monitor
user_exposure_nesting: L1_PRIMARY
backend_wiring: "LOCALLY_VERIFIED controlled physical Android/Web same City and exact canonical FAILED evidence; observer500 independent task200; final hosted CI pending."
ui_exemption_reason: null
capability_ids: ["CAP-MON-001", "CAP-MON-002", "CAP-MON-003"]
capability_registry_action: VERIFY_ONLY
capability_registry_refs: ["capability-registry/records/CAP-MON-001.yaml","capability-registry/records/CAP-MON-002.yaml","capability-registry/records/CAP-MON-003.yaml"]
capability_registry_sync_status: CANDIDATE_RECONCILED_AWAITING_CLOSEOUT_REVIEW
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/MON-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md"]
research_watchlist_hits: []
highest_research_grade_observed: G3_SPARSE_ACTIVE
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/MON-990/DEVELOPMENT_REPORT.md"]
monitor_observability_evidence: CAPTURED
monitor_observability_refs: ["mission-book/reports/MON-990/DEVELOPMENT_REPORT.md"]
decision_trace_evidence: CAPTURED
decision_trace_refs: ["mission-book/reports/MON-990/DEVELOPMENT_REPORT.md"]
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/MON-990
dependency_source_workbooks: ["MON-902","MON-903"]
baseline_blocker: null
development_pr: "https://github.com/zhiheng-zhang-Mera/utopia/pull/36"
---

# MON-990 — Cross-Device Monitor Acceptance & Freeze

## 目标

在 MON-901/902/903 accepted 后，对完整 City Work Monitor 做独立 reconciliation 与跨设备验收，并冻结 v1。

## 必验

1. Overview state ↔ canonical task state；
2. node owner/host/model metadata ↔ runtime truth；
3. edge reason ↔ real handoff/retry/review/routing event；
4. Decision receipt ↔ actual state transition；
5. risk bubbling 不隐藏 active failure；
6. JEV/monitor unavailable 时无关 task 继续；
7. Decision timeout 只影响目标 task；
8. Capability Registry ↔ runtime/UI；
9. Web + 当前 Android surface 的合理 parity；
10. large graph collapse/filter/stable layout；
11. normal diagnosis 2–3 interactions 内可到 exact evidence；
12. no second task truth。

## Research closeout

输出：

`mission-book/reports/MON-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`

至少汇总：

- observation/projection latency；
- decision latency；
- auto-resolution distribution；
- Owner interruption；
- false-safe summary；
- monitor reality drift；
- blocking incidents；
- edge provenance completeness；
- reviewer falsification；
- replay/ablation candidates。

## Terminal marker

`CITY_WORK_MONITOR_V1_ACCEPTED`

只有 exact-head CI、opposite-host review、runtime/UI reconciliation、Registry reconciliation 与论文素材索引全部满足后才能写入。
