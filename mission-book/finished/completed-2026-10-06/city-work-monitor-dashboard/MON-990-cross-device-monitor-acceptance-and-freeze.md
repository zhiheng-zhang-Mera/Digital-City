---
workbook_id: MON-990
phase: CITY_WORK_MONITOR_CLOSEOUT
sequence: 90
execution_enabled: true
status: "COMPLETE"
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
development_ci: "SUCCESS exact fb042d9: push37420061997 / PR37420065177 / linkage37420065178 all terminal SUCCESS; PR36 CLEAN/MERGEABLE; remote/local exact and clean. Earlier523eb47 failure retained."
development_complete: true
review_host: "Mech"
review_head_sha: "fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40"
review_ci: "REVIEWER (Mech) re-read the reviewed head's three runs one at a time from the Actions API and matched on headSha fb042d9: push 37420061997, PR 37420065177, linkage 37420065178, all COMPLETED SUCCESS attempt 1. Reviewer's own probe branch review/MON-990-Mech-20261006: first head 7fffe3f FAILED CI run 37422163771 on a REVIEWER INSTRUMENT defect (R1 waited for the panel shell instead of data-loaded=true), fixed at 14b2c7b with run 37422910108 SUCCESS attempt 1; both runs retained."
review_status: "PASS_ON_ALL_12_CHECKS_ANDROID_HALF_MEASURED_RENDERED_HANDSET_NOT_OBSERVED_HERE"
review_report: "mission-book/reports/MON-990/REVIEW_REPORT.md"
review_complete: true
terminal_marker: CITY_WORK_MONITOR_V1_ACCEPTED
review_verdict: "PASSED on fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40 (Mech, opposite physical host; developer Alien). No defect found across the reviewer's eleven manufactured probes, and check 9's Android half is measured rather than NOT_RUN: with JAVA_HOME pointing at the Temurin 17.0.18 already installed on this host, gradlew :app:testDebugUnitTest :app:assembleDebug is BUILD SUCCESSFUL in 3m51s at the reviewed head, 118 Android unit tests pass with 0 failures (22 suites, including MonitorProjectionTest 7/7), app-debug.apk builds, and a probe that fed the head's OWN captured server payloads to the Android projection accepted them (cityId-matched graph with 31 nodes, 2 clusters, 1 receipt). CORRECTION, kept rather than overwritten: this review first reported the Android half as un-runnable because 'only JDK 26 is installed on this host' - that was a reviewer measurement error (it read the PATH default), not a host limitation. Marker CITY_WORK_MONITOR_V1_ACCEPTED RELEASED on this head. Scope, stated not implied: the handset-RENDERED half of check 9 is NOT_OBSERVED on this host (adb devices is empty; the handset is live in the City as a control surface but attached elsewhere), so the author's physical capture remains the only evidence for it; this release is a reviewer judgement recorded in section 9 of the review report, not a measurement. No merge authority exercised, no main touched."
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: City Work Monitor
user_exposure_nesting: L1_PRIMARY
backend_wiring: "LOCALLY_VERIFIED controlled physical Android/Web same City and exact canonical FAILED evidence; observer500 independent task200; final exact-head hosted CI SUCCESS."
ui_exemption_reason: null
capability_ids: ["CAP-MON-001", "CAP-MON-002", "CAP-MON-003"]
capability_registry_action: VERIFY_ONLY
capability_registry_refs: ["capability-registry/records/CAP-MON-001.yaml","capability-registry/records/CAP-MON-002.yaml","capability-registry/records/CAP-MON-003.yaml"]
capability_registry_sync_status: CLOSEOUT_REVIEW_ACCEPTED_WITH_DISCLOSED_RENDERED_HANDSET_SEAM
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


---

[English reading translation / 完整英文阅读说明](en/MON-990-cross-device-monitor-acceptance-and-freeze.md)
