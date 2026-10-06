---
workbook_id: REX-806
phase: RESEARCH_STRENGTHENING
sequence: 806
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-803","REX-804","REX-805"]
dependency_source_shas: ["8798ba9dd37051626033ad72080b2fad3ff66149","fe700aba957990f93b22fd63d594ddfff7b4e243","0261a9ed1cec88df3ab4675623d422b37b33f270"]
development_baseline_sha: "e18c5c5350d7657cf046b7ba6bbcd888dc2a1540"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-06): baseline_anchor_mode resolved as the union of the three accepted dependency heads, which is what DEPENDENCY_SHA_UNION_AT_CLAIM requires and what main cannot stand in for. Measured: none of the accepted heads is in main (REX-803 8798ba9, REX-804 fe700ab, REX-805 0261a9e all exit non-zero for git merge-base --is-ancestor against origin/main), while the required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe is reachable from main (exit 0). Accepted REX-803 8798ba9 is already contained in accepted REX-805 0261a9e, so the union needs only main + 0261a9e + fe700ab. Construction: 0261a9e merged into main was a fast-forward; fe700ab then produced exactly one conflict in services/dev-gateway/server.mjs, the same union site the integration preflight had already measured, resolved as the union of the fault controller with the campaign and replay controllers (all three define a research controller at that point and none references another; the single return exposes campaigns and faults with a teardown releasing both). Resolved baseline (40-char): e18c5c5350d7657cf046b7ba6bbcd888dc2a1540, on branch rex/REX-806-mech-metrics-and-export, with all three accepted heads verified as ancestors of it. Dependency smoke BEFORE any REX-806 product change: node --test on the REX-803, REX-804 and REX-805 suites -> 17 suites, 68 tests, 68 pass, 0 fail. Worktree D:/utopia-rex806. Claim record published before any product change: reports/REX-806/CLAIM_REPORT.md. KNOWN PRE-EXISTING CONDITION recorded rather than silently handled: running the accepted REX-804 web suite dirties evidence/raw/mission-book/REX-804/danger-zone.png because that test writes into a committed evidence path; a repair is published and awaiting adoption (repair/REX-804-mech-test-evidence-outside-repo @ 690d723) and does not block this task."
baseline_blocker: null
dependencies: ["REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED", "REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED", "REX-805:TRACE_REPLAY_ABLATION_ACCEPTED"]
development_host: "Mech"
development_branch: "rex/REX-806-mech-metrics-and-export"
development_head_sha: "3950d478e627aaa615ef69e3ac65c30da37c5ea6"
development_ci: "LOCAL + HOSTED (Mech host, COMPUTERNAME MEGA-REP, 2026-10-06): the artifact exporter, its owner-only City surfaces, an independent verifier and 24 probes are on rex/REX-806-mech-metrics-and-export. EXACT HEADS, each read one at a time from the Actions API: 94a7d24 push 37451114057 SUCCESS attempt 1 (exporter + 13 module probes); d7aa5d7 push 37452319948 SUCCESS attempt 1 (owner-only surfaces + 5 surface probes); cd4f603 push 37453769570 **FAILED attempt 1** (the verifier probes read the published artifact from an absolute path on the authoring machine, so all six failed on the runner - CI caught what a local run could not); 3950d47 push 37454597004 SUCCESS attempt 1 (the fixture is now built in the test itself, and the file contains no host-specific path). The red run is retained rather than overwritten: a green suite beside a red one at the same feature is the finding, and the fix is the evidence. BASELINE: claim-time union of the accepted heads REX-803 8798ba9, REX-804 fe700ab, REX-805 0261a9e -> e18c5c5, all three verified as ancestors, dependency smoke 17 suites / 68 tests / 68 pass before any product change. PROBES: 24/24 (13 module, 5 surface, 6 verifier) and falsified before being trusted - a mutation fabricating an intervention count of zero turns eight module probes red, mutations to the placement policy and the run accounting turn the new ones red, and the verifier probes, once host-independent, fail on a changed metric value, an emptied NOT_MEASURED reason, a missing section, a changed dataset timestamp and a fabricated intervention count. INDEPENDENT VERIFIER: scripts/verify-research-artifact.mjs is a SECOND implementation that does not import the exporter; it recomputes the four reported metrics from the normalized dataset, checks every unavailable row against its reason and every measured row against its provenance, checks the placement verdicts and the accounting identity, and re-hashes the bytes. On the published package it passes 14/14; that run is the author's check and is not offered as the reviewer's evidence. SURFACES: GET /api/v0/research/artifacts (artifact + per-file checksums), ?format=csv, /preview?limit=N; all three refuse a member session with RESEARCH_OWNER_REQUIRED and refuse with ARTIFACT_NO_SOURCE when the City holds no readable campaign; the member-refusal probe enrolls a real device and opens a real session rather than inventing a credential. REGRESSIONS: REX-803 campaign surface, REX-805 gateway and MON-990 cross-surface stay 7/7. FULL SUITE at d7aa5d7: 1445 tests / 1442 pass / 3 fail, the three being this host's resident-City host reservation; EARLIER at 94a7d24 five failed and were classified - the same three plus two browser tests that fail under full-suite load and pass 4/4 alone, while the baseline at e18c5c5 without this work failed the same three plus the load-sensitive relay rate-limit probe. DELIVERABLE: 18 real campaigns (24 runs, 22 measured), per-file SHA256, verified 10/10 through a fresh clone; reports/REX-806/{DELIVERABLE.md,DEVELOPMENT_HANDOFF.md}. development_complete true; no marker released."
development_complete: true
development_physical_gate_basis: "NOT_APPLICABLE - this task's completion gate is not a physical topology; it requires that a complete artifact can be generated from a set of real campaigns and independently read and recomputed by the opposite host. Generation and publication are done (18 real campaigns, 24 runs, 22 measured, per-file SHA256, fresh-clone verified 10/10); the independent recomputation is the reviewer's step and is requested explicitly in reports/REX-806/DEVELOPMENT_HANDOFF.md."
development_handoff: "mission-book/reports/REX-806/DEVELOPMENT_HANDOFF.md"
development_final_full_suite: "1445 tests / 1442 pass / 3 fail on d7aa5d7, the three being tests/host-city-launcher.test.mjs (this host's resident-City host reservation, the same three at every head this host measures). No load-sensitive failure appeared in this run on this head."
review_host: "Mech"
review_head_sha: "12e3d3bf868575a8e3cda983733a3186cb59da27"
review_ci: "VERDICT ACCEPTED for the repair scope, decided by Mech as the opposite host for Alien's corrections. REVIEW TARGET 12e3d3bf868575a8e3cda983733a3186cb59da27 (draft PR39), which differs from development_head_sha 3950d47 because 3950d47 was reviewed by Alien and returned REQUIRES_REPAIR; the accepted entity is this repair head, and the workbook says so rather than blurring the two. Independence accounting, stated instead of implied: Alien reviewed the Mech-authored half (its findings F1/F2 describe d790a2a's behaviour) and Mech reviewed Alien's 5f3658f/897382c plus the integration, so each half has an opposite-host review; no third host exists and none is claimed. EXACT-HEAD CI re-measured by the reviewer with gh by commit: V0.2 push 37538019792 success, V0.2 PR 37538063650 success, City linkage PR 37538063656 success (the opposite host left the last two running at handoff). LOCAL, in a fresh worktree installed with the two-step frozen lockfile: REX-806 suites 29 pass / 0 fail; REX-803/805 regressions 54 pass / 0 fail (50 non-web + 2 + 2 web); boundary probe 10/10 PASS with its single PENDING item then closed by a second probe that produced REAL receipts with the product's own runner and corrupted one: the registry lists both, a complete set answers NO_KNOWN_SOURCE_LOSS, and after the corruption the CSV route answers {status:PARTIAL, knownSourceLossCount:1} while the preview manifest is PARTIAL too (4/4). REAL OWNER EXPORT from the running City (172.31.12.151:4391): artifact-031fdba6-e94c-4298-a095-6ff04a65481d-18-campaigns, campaigns=18 runs=24 measured=22, completion_time_ms=6595 at n=22 (matching Alien's independent Python recomputation), 11 files + checksums published under reports/REX-806/crosshost-artifact-2026-10-07/, and a 4/4 comparison against the City's real records (members equal the canonical deviceIds item by item, no source loss claimed for a complete set, all ten listed files re-hash identically, the metric is present). The historical artifact is retained unmodified (10/10 re-hash). Marker RESEARCH_ARTIFACT_EXPORT_ACCEPTED released by this verdict; merge_authority stays false. Verdict, evidence and the reviewer's own seven instrument errors: reports/REX-806/CROSS_HOST_VERIFICATION_Mech.md."
review_complete: true
research_evidence_applicability: APPLICABLE
research_watchlist_hits: ["RS-G3-OWNER-INTERVENTION-TAXONOMY","RS-G3-SUPERVISION-ATTENTION","RS-G3-RULE-LIFECYCLE-DEBT","RS-G3-SEMANTIC-INTEGRATION","RS-G3-PASSIVE-EVIDENCE-PIPELINE","RS-G4-AUTONOMY-SURVIVAL","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: true
merge_record_2026_10_07: "MERGED. The accepted repair head 12e3d3bf868575a8e3cda983733a3186cb59da27 is now origin/main, reached by FAST-FORWARD from 312b627b54af5bbf274fa25eca8f8383869c1c34 - measured, not assumed: git merge-base --is-ancestor origin/main 12e3d3b exited 0, because the repair branch had already merged main when it was formed, so no union conflict existed and no merge commit was needed. main therefore gained the whole REX-806 line in one step: baseline union e18c5c5, exporter 94a7d24, owner-only routes d7aa5d7, the independent verifier cd4f603, host-independence 3950d47, the two Mech repairs 4349f3d/d790a2a and Alien's two 5f3658f/897382c. Exact-head CI on the merged main: V0.2 checks run 37542958872 completed/success (gateway-web and android both green); City linkage check run 37542958826 had its reciprocal-contract job success while the run was still in progress at the time of writing and is recorded as such rather than pre-declared; a follow-up check shows the run completed/success, and the record says both. Local verification on the same tree before merging: REX-806 suites 29/29, REX-803/805 regressions 54/54, boundary probe 10/10, F4 route probe 4/4. Nothing was rewritten and no force-push was used; REX-807/890 keep merge_authority false. Full record: reports/REX-806/MERGE_RECORD_Mech_2026_10_07.md."
owner_gate_ruling_2026_10_07_qualification: "QUALIFIED AND EXERCISED. The owner's ruling already on file defines qualified as review complete plus marker released; measured: review_complete=true, review_host=Mech, review_head_sha=12e3d3b, terminal_marker RESEARCH_ARTIFACT_EXPORT_ACCEPTED released. merge_authority therefore moved false -> true for REX-806 exactly as for REX-801..805 when they were accepted, while REX-807/890 keep false until their own reviews complete. The permission was then EXERCISED: the accepted head was fast-forwarded into main (see merge_record_2026_10_07 below). Recorded by Mech-DS."
report_path: mission-book/reports/REX-806
terminal_marker: RESEARCH_ARTIFACT_EXPORT_ACCEPTED
owner_gate_ruling_2026_10_07: "OWNER GATE OPEN for the REX series (owner instruction this session): QUALIFIED sub-tasks may merge, i.e. those whose own review is complete and whose marker is released. merge_authority is set true on REX-801..805 (all accepted and now in main) and stays false on REX-806/807/890 until their reviews complete - acceptance, the opposite-host review and the markers are unchanged, and section 3 still forbids self-review. Recorded by Mech-DS."
---

# REX-806 — Metrics Analysis + Research Artifact Export

> 常驻规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

将实验导出为可检查的：

```text
artifact/
├─ manifest
├─ environment
├─ topology
├─ raw pointers
├─ normalized dataset
├─ metrics.csv
├─ failures
├─ exclusions
├─ tables
├─ reproduction
└─ checksums
```

## Metrics

至少支持来自前序真实数据的：

- completion time；
- recovery time；
- handoff time；
- failure rate；
- intervention count；
- retry count；
- duplicate execution；
- convergence / missing event（可测时）；
- task transitions before Owner intervention；
- time / steps to first Owner intervention；
- intervention-free survival（可构造时）；
- intervention cause taxonomy；
- task-pool drain before intervention；
- control-plane reality mismatch count / reconciliation time；
- implementation→wiring→reachability→intent transition timestamps；
- Exposure Lag / Intent Lag（可测时）；
- registry-assisted localization/onboarding cost（实验提供时）；
- high-value Owner decision count；
- avoidable technical escalation count；
- repeat clarification count；
- escalation → autonomy-resumed time；
- batchable escalation count / interruption burst（可测时）；
- rule activation / conflict / false-block / retirement observations；
- textually-clean semantic integration failure count；
- independently-green components → integrated semantic failure count。

不支持的指标标 NOT_MEASURED。

### Metric interpretation guard

- `owner_intervention_count = 0` 只有明确观察到完整窗口且确实无人介入时才允许；未知必须 NOT_MEASURED；
- “运行了更久”不等于更自治，idle loop / duplicate work / blocked polling 要单独分类；
- survival curve 若样本不足，只导出原始 censored episode 数据，不强行画结论；
- G1/G2 metric 默认 supporting；G3/G4 metric 优先进入 paper-ready tables。

## 导出

DIRECT_CONTROL：

- preview dataset；
- export artifact；
- export CSV/table-ready data；
- reproduction instructions。

不得自动生成夸大结论；统计结果与论文 narrative 分离。

## Review

Reviewer 从导出包独立重算至少一组指标，并核对 checksum/provenance。

## 完成门槛

可从一组真实 campaign 生成完整 artifact，并由另一实体主机独立读取/重算。


---

[English reading translation / 完整英文阅读说明](en/REX-806-metrics-analysis-and-artifact-export.md)
