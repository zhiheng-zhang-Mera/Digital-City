---
workbook_id: CHK-101
phase: CITY_SELF_HEALTH_CHECK
sequence: 101
execution_enabled: true
status: COMPLETE
activation_state: ACTIVATED_OWNER_2026_10_07_FOUR_SERIES_CLOSURE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/4-in-1-REX+PCF+CHK+DGX"]
required_ancestor_shas: ["17271f04829877ee56668221afeda5fbd35f66e8"]
development_baseline_sha: "6b6963210c103db2ab25b5bbf34bdbf09e63bf1a"
baseline_resolution_evidence: "BASELINE CHOICE, MEASURED (Mech host, COMPUTERNAME MEGA-REP, 2026-10-07): the development baseline recorded here is the SERIES HEAD 6b6963210c103db2ab25b5bbf34bdbf09e63bf1a (the PCF series tip that this round folded into the 4-in-1 pack, PR #45), not the merge base. The merge base / main content is 17271f04829877ee56668221afeda5fbd35f66e8 (origin/main db6b6f9 has the SAME TREE) and it is recorded as the required ancestor, because it is the integration point that already contains the upstream series heads: DGX e5a03dae02ca341d6d23565735e6cd6c3edc27d9 (merged into main by a1bb0937defc29af686cb40f1a21340731d4d7a3), CHK 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d (merged into main by a1bb093) and PCF tip 6b6963210c103db2ab25b5bbf34bdbf09e63bf1a. The pack was then accepted at 185d043e11ae8516a1e7a492d09d031610be576b. Per-task dependency exact heads are superseded by that integration point rather than re-invented here, so dependency_source_shas is empty by design and not by omission; the series-level dependency heads are named in this field."
anchor_state: RESOLVED_AT_INTEGRATED_ACCEPTANCE_2026_10_07
development_host: "Mech"
development_branch: "4-in-1-REX+PCF+CHK+DGX"
development_head_sha: "185d043e11ae8516a1e7a492d09d031610be576b"
development_ci: "exact-head CI on 185d043, all read from the Actions API, all completed/success: push V0.2 checks run 37613355839 (gateway-web SUCCESS, android SUCCESS); pull_request V0.2 checks run 37613438305 (gateway-web SUCCESS, android SUCCESS); pull_request City linkage check run 37613438289 (reciprocal-contract SUCCESS); pull_request PCF Linux component candidate run 37613438369 (linux-components SUCCESS). Local re-runs at 185d043 on this Mech host (COMPUTERNAME MEGA-REP): node --test tests/*.test.mjs 1969 tests / 1961 pass / 5 fail / 3 skipped, where the 5 failures are tests/host-city-launcher.test.mjs x3 (this host's resident City occupies the coordination port and the test refuses by design) plus 2 load-sensitive web flakes (theme-packages store guard, rex803-campaign-web), each passing when run alone; node city/test-all.mjs 2013 tests / 2006 pass / 0 fail / 7 skipped; node scripts/verify-promotion-history.mjs exit 0; pnpm check:docs exit 0. Series test surfaces at 185d043 on this host: tests/pcf*.test.mjs 406 tests / 403 pass / 0 fail / 3 skipped (the 3 skips are typed external prerequisites); tests/dgx-*.test.mjs 52 tests / 52 pass / 0 fail; tests/rex801..807 suites 158 tests / 158 pass when each task's files are run together, with 3 of them timing out under full parallel load and passing alone; CHK module tests 27 tests / 27 pass at city/02-engineering/05-city-self-health-check/city-self-health-check/tests/."
development_complete: true
review_host: "Mech"
review_head_sha: "185d043e11ae8516a1e7a492d09d031610be576b"
review_ci: "Exact-head CI at 185d043e11ae8516a1e7a492d09d031610be576b: push V0.2 checks run 37613355839, pull_request V0.2 checks run 37613438305, City linkage check run 37613438289 and PCF Linux component candidate run 37613438369, all completed/success; PR https://github.com/zhiheng-zhang-Mera/utopia/pull/46 mergeable=MERGEABLE mergeStateStatus=CLEAN. Cross-host evidence read live by Mech: Cross-host evidence, taken on the LIVE City restarted at 185d043 (D:\\utopia-rex-pcf-merge, pid 44920, 172.31.12.151:4310): both nodes ONLINE/HEALTHY - Mega-rep (dev-544adda130594c6fae7d71ddfd0f3b8c) and Alien (dev-1428bce5297146df88720f270af71bc3, hostname Mera-Alianware) - with nodeDescriptor contractVersion=1 and roles=[EXECUTION_NODE]. A canonical task strictly targeted at the Alien node really ran there: state=COMPLETED, progress=100, assignedNodeId=dev-1428bce5..., result={bytes:65, sha256:248dbb6778be39e9de1460909c35dd4628944852c89f6d6dda4fa97f8fe3f001, cleaned:true}; the same was done for the local node; /api/v0/join/nearby answered bounded=true discovered=1 excludedSelf=1 rows=0; GET /api/v0/health = healthy; /api/v0/pcf completeness=COMPLETE; /api/v0/governance = AVAILABLE."
review_complete: true
terminal_marker_statement_2026_10_07: "No per-task terminal marker is declared by this workbook. The series marker CITY_SELF_HEALTH_CHECK_V1_ACCEPTED is released on CHK-990 only; this workbook contributes to it and releases no marker of its own."
integrated_acceptance_2026_10_07: "Integrated four-series acceptance measured on 2026-10-07 by Mech (COMPUTERNAME MEGA-REP) at exact head 185d043e11ae8516a1e7a492d09d031610be576b of utopia branch 4-in-1-REX+PCF+CHK+DGX (merge base 17271f04829877ee56668221afeda5fbd35f66e8 = main content). VERIFIED: exact-head CI on 185d043, all read from the Actions API, all completed/success: push V0.2 checks run 37613355839 (gateway-web SUCCESS, android SUCCESS); pull_request V0.2 checks run 37613438305 (gateway-web SUCCESS, android SUCCESS); pull_request City linkage check run 37613438289 (reciprocal-contract SUCCESS); pull_request PCF Linux component candidate run 37613438369 (linux-components SUCCESS). Local re-runs at 185d043 on this Mech host (COMPUTERNAME MEGA-REP): node --test tests/*.test.mjs 1969 tests / 1961 pass / 5 fail / 3 skipped, where the 5 failures are tests/host-city-launcher.test.mjs x3 (this host's resident City occupies the coordination port and the test refuses by design) plus 2 load-sensitive web flakes (theme-packages store guard, rex803-campaign-web), each passing when run alone; node city/test-all.mjs 2013 tests / 2006 pass / 0 fail / 7 skipped; node scripts/verify-promotion-history.mjs exit 0; pnpm check:docs exit 0. Series test surfaces at 185d043 on this host: tests/pcf*.test.mjs 406 tests / 403 pass / 0 fail / 3 skipped (the 3 skips are typed external prerequisites); tests/dgx-*.test.mjs 52 tests / 52 pass / 0 fail; tests/rex801..807 suites 158 tests / 158 pass when each task's files are run together, with 3 of them timing out under full parallel load and passing alone; CHK module tests 27 tests / 27 pass at city/02-engineering/05-city-self-health-check/city-self-health-check/tests/. Cross-host evidence, taken on the LIVE City restarted at 185d043 (D:\\utopia-rex-pcf-merge, pid 44920, 172.31.12.151:4310): both nodes ONLINE/HEALTHY - Mega-rep (dev-544adda130594c6fae7d71ddfd0f3b8c) and Alien (dev-1428bce5297146df88720f270af71bc3, hostname Mera-Alianware) - with nodeDescriptor contractVersion=1 and roles=[EXECUTION_NODE]. A canonical task strictly targeted at the Alien node really ran there: state=COMPLETED, progress=100, assignedNodeId=dev-1428bce5..., result={bytes:65, sha256:248dbb6778be39e9de1460909c35dd4628944852c89f6d6dda4fa97f8fe3f001, cleaned:true}; the same was done for the local node; /api/v0/join/nearby answered bounded=true discovered=1 excludedSelf=1 rows=0; GET /api/v0/health = healthy; /api/v0/pcf completeness=COMPLETE; /api/v0/governance = AVAILABLE. Eight defects found during this acceptance, each FIXED in the utopia branch at 185d043 with a falsifiable guard: D1 an open LAN discovery scan could kill the City (services/dev-gateway/server.mjs read .port off a null server.address() after close); D2 the ENGINEERING review independence floor was selected by the caller's spelling of the role, so a same-host reviewer could be reached by renaming the role (contracts/deliberative-governance-v2/assignment.mjs); D3 the CHK sensitive-path filter missed id_rsa/.npmrc etc., so declared credential paths were read and hashed into source-manifest.json; D4 redaction missed AWS/GCP/Slack/Stripe/PEM shapes; D5 unreferenced sensitive paths were dropped silently while static_scan_complete stayed true; D6 a deliberately-unread path was also reported as DEAD_CAPABILITY_RECORD; D11 apps/web/research.js never called assertPrimarySurfacesClean, so the primary-surface guard was vacuous; D12 only 2 of 5 DIRECT_CONTROL entries carried wired/wiredAt. Gaps MEASURED but NOT fixed and NOT claimed closed: REX-801's frozen manifest contract lacks the five fields its workbook names (metrics, research_signal_ids, research_grade_snapshot, control_plane_rule_version, authority_surfaces_if_applicable); REX-807 has a `pause` control in RESEARCH_CONTROL_SURFACE.md with no route, and the campaign page's seed/warmup/abandon controls bypass the ADVANCED_CONTROL confirmation path; PCF 702/703/709/710/711 name a two-host/two-worker physical half that is neither performed nor marked NOT_RUN; PCF 719 has no androidTest instrumentation source set; PCF 718's named platform/linux/pcf-worker/ path does not exist; DGX's validateDomainGate has no production caller - the release gate trusts a host port and fails closed without it; REX-890 (reproducibility study + freeze) has NOT been started: no heads, no report directory, no RESEARCH_MATERIAL_SYNTHESIS.md, and the programme terminal marker RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE is NOT released. Explicitly NOT verified by this round for this workbook: Development and acceptance were carried out by Mech on the utopia branch 4-in-1-REX+PCF+CHK+DGX, whose merge base 17271f04829877ee56668221afeda5fbd35f66e8 equals main content, and Mech authored part of that work, so no independent per-workbook review of this task exists. no per-workbook split acceptance was performed (waived by the recorded Owner authority) and the unfixed gaps above are NOT claimed closed. CHK-specific not-verified: no periodic schedule, scheduler or automatic self-modification is created or verified, and CHK-990's own independent_review was recorded NOT_RUN even though the opposite host's thirty adversarial probes covered its twelve must-test items."
owner_ruling_2026_10_07_four_series_closure: "OWNER RULING 2026-10-07 (four-series closure): the Owner instructed this round that the four series' development and acceptance be marked complete, and that the per-workbook split acceptance be waived by that authority. The waiver is recorded here so the consistency checker prints REVIEW_WAIVED_BY_RECORDED_AUTHORITY naming this field instead of the waiver being hidden. The marker statements and the non-claims recorded in integrated_acceptance_2026_10_07 still hold: that acceptance is the integrated four-series acceptance at refs/heads/4-in-1-REX+PCF+CHK+DGX @ 185d043e11ae8516a1e7a492d09d031610be576b plus the cross-host evidence there, NOT a per-workbook independent review of each task."
owner_gate: SATISFIED_OWNER_FOUR_SERIES_CLOSURE_2026_10_07
merge_authority: false
report_path: "mission-book/reports/4IN1-ACCEPTANCE"
development_ruling_2026_10_07: "Development and acceptance were carried out by Mech on the utopia branch 4-in-1-REX+PCF+CHK+DGX, whose merge base 17271f04829877ee56668221afeda5fbd35f66e8 equals main content, and Mech authored part of that work, so no independent per-workbook review of this task exists. The sub-claims that are NOT verified by this record: CHK-990's twelve must-test items were exercised by the opposite host's thirty adversarial probes at 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d and the 27/27 module tests at 185d043, but the workbook's own independent_review was recorded NOT_RUN; no periodic schedule, scheduler or automatic self-modification was created or verified, and this freeze creates no timed task (frequency and execution host still need a separate explicit activation). Acceptance here is the integrated four-series acceptance, not a per-workbook independent review; merge_authority stays false because the pack is MERGEABLE, not merged, and the merge decision is the Owner's."
exposure_decision_2026_10_07: "No per-workbook capability-exposure decision (CONSTRUCTION_RULES 14A) was made for this workbook this round: the per-workbook split acceptance was waived, so the class is carried forward from the workbook's own design statement (INTERNAL_ONLY with user_exposure_nesting NONE_INTERNAL and an explicit ui_exemption_reason) rather than re-derived. What the integrated acceptance did verify is the CHK module: 27/27 tests at 185d043e11ae8516a1e7a492d09d031610be576b with the sensitive-path filter, redaction, unreferenced-path and unread-path defects (D3-D6) fixed and each carrying a falsifiable guard. backend_wiring is NOT_MEASURED_PER_TASK for the same reason."
research_evidence_note_2026_10_07: "Research material for this round is INDEXED AT THE ROUND LEVEL ONLY and no per-task applicability class is asserted here: research_evidence_applicability keeps whatever value the workbook already declared (workbooks that never declared it keep it undeclared) rather than being set to APPLICABLE without the PAPER_MATERIAL_INDEX.md that class requires. Long-horizon context evidence WAS captured by the integrated acceptance: exact-identity and provenance material (frozen heads, exact-head CI run ids, a live cross-host canonical task with a byte count and sha256, an eight-defect fix list each with a falsifiable guard) plus a measured-but-unfixed gap list kept as negative evidence, all written into mission-book/reports/4IN1-ACCEPTANCE/. No research grade is re-derived here, so highest_research_grade_observed is not raised. Per-task state-identity/monitor/decision traces were NOT collected for each workbook (NOT_MEASURED_PER_TASK, reason: the per-workbook split acceptance was waived this round)."
unfixed_gaps_2026_10_07: "Gaps MEASURED but NOT fixed and NOT claimed closed: REX-801's frozen manifest contract lacks the five fields its workbook names (metrics, research_signal_ids, research_grade_snapshot, control_plane_rule_version, authority_surfaces_if_applicable); REX-807 has a `pause` control in RESEARCH_CONTROL_SURFACE.md with no route, and the campaign page's seed/warmup/abandon controls bypass the ADVANCED_CONTROL confirmation path; PCF 702/703/709/710/711 name a two-host/two-worker physical half that is neither performed nor marked NOT_RUN; PCF 719 has no androidTest instrumentation source set; PCF 718's named platform/linux/pcf-worker/ path does not exist; DGX's validateDomainGate has no production caller - the release gate trusts a host port and fails closed without it; REX-890 (reproducibility study + freeze) has NOT been started: no heads, no report directory, no RESEARCH_MATERIAL_SYNTHESIS.md, and the programme terminal marker RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE is NOT released."
dependency_source_shas: []
dependencies: []
user_exposure_surface: null
user_exposure_nesting: NONE_INTERNAL
ui_exemption_reason: "Parked self-check design; no runtime/UI implementation authorized."
capability_ids: []
capability_registry_refs: []
research_evidence_applicability: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
research_capture_level: STANDARD
state_identity_evidence_refs: []
monitor_observability_refs: []
decision_trace_refs: []
backend_wiring: NOT_MEASURED_PER_TASK
---

> **2026-10-07 四系列收口（Owner 裁决）/ four-series closure:** 本条目的开发与验收按 Owner 本轮裁决记为完成，逐本拆分验收由该裁决豁免（工作书 frontmatter 的 `owner_ruling_2026_10_07_four_series_closure` 字段），因此一致性检查器打印 `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` 而不是把豁免藏起来。**未验证的部分照实写在 frontmatter 的 `integrated_acceptance_2026_10_07` 与 `unfixed_gaps_2026_10_07` 字段里**；`merge_authority` 仍为 false —— 整包 MERGEABLE 不等于已合并，合并决定归 Owner。证据：`mission-book/reports/4IN1-ACCEPTANCE/`。 当前仅保存未来小体检合同。

# CHK-101 — Small Operational Reconciliation / 小体检

## 目标

用低成本方式发现“最近施工后刚产生的漂移”，避免把小问题积成大范围 control-plane drift。

## 检查面

### 1. Capability Registry

- 新/改 capability 是否登记；
- CAP record 路径/symbol/API 是否仍存在；
- exact verified SHA 是否过期或指错；
- implementation / wiring / reachability / intent 四层是否诚实；
- surface 路径是否仍可发现；
- INTERNAL_ONLY 是否仍合理。

### 2. Mission Book

对账：

```text
workbook frontmatter
↔ generated README
↔ MISSION_PROGRESS.json
↔ dependency state
↔ finished archive
```

检查 duplicate ID、错误 active/parked 状态、完成未归档、依赖未解锁等。

### 3. Identity / Evidence

检查：

- development/review/CI/evidence SHA 一致性；
- dependency accepted SHA ancestry；
- stale mutable ref；
- EVIDENCE_POINTER_MISMATCH；
- STALE_EXECUTION_IDENTITY；
- BASELINE_ANCESTRY_MISMATCH。

### 4. Sentinel runtime flows

只跑少量高价值路径，例如：

```text
start City
→ create task
→ route/select target
→ receive canonical state
→ complete/fail
→ UI reconciliation
```

不默认跑全套重型 E2E。

### 5. UI / Exposure

抓新增 regression：

- false affordance；
- hidden important state；
- broken entry；
- backend disconnected；
- Web/Android parity regression；
- refusal/error display mismatch。

### 6. Open findings / debt

将 Review finding 至少归为：

`OPEN / ACKNOWLEDGED_DEBT / DEFERRED_BY_DESIGN / SUPERSEDED / RESOLVED`。

### 7. Research/evolution evidence防漏

只判断最近是否出现值得保存的 G3/G4 episode、Owner intervention、reality drift、semantic integration conflict；不在小体检里开研究工程。

## 输出

```text
HEALTHY
DRIFT_FOUND
REQUIRES_RECONCILIATION
FOLLOWUP_WORKBOOK_CANDIDATE
OBSERVE_MORE
```

每个 finding 必须有 owner surface、severity、evidence pointer、recommended destination。

## 禁止

- 体检中顺手修所有问题；
- 因文档不整齐就开大重构；
- 把 transient runtime noise 直接变成永久规则。

## 完成门槛

形成 bounded health report；若需维修，只创建/建议后续正式工作项，不在本任务扩边施工。


---

语言读本 / Reading translation: [English](en/CHK-101-small-operational-reconciliation.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
