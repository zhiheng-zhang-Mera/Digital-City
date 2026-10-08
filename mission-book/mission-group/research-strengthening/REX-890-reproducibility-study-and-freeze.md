---
workbook_id: REX-890
phase: RESEARCH_STRENGTHENING
sequence: 890
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-801","REX-802","REX-803","REX-804","REX-805","REX-806","REX-807"]
dependency_source_shas: ["7e96a4d28f4cb701d7a0951bace69857c3228f32","833279cae237080cca88b1b6dbc9f217027ba68f","8798ba9dd37051626033ad72080b2fad3ff66149","fe700aba957990f93b22fd63d594ddfff7b4e243","0261a9ed1cec88df3ab4675623d422b37b33f270","12e3d3bf868575a8e3cda983733a3186cb59da27","17271f04829877ee56668221afeda5fbd35f66e8"]
development_baseline_sha: "17271f04829877ee56668221afeda5fbd35f66e8"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, role Mech-DS, 2026-10-08): baseline_policy is IMMUTABLE_EXACT_SHA and baseline_anchor_mode is DEPENDENCY_SHA_UNION_AT_CLAIM. MEASURED, not assumed: the union of the seven declared dependency_source_shas IS the branch point - `git merge-base HEAD origin/main` returns 17271f04829877ee56668221afeda5fbd35f66e8, which is REX-807's accepted head (the newest declared dependency), so no union construction was needed. `git merge-base --is-ancestor` exits 0 for all seven dependency heads (7e96a4d2, 833279ca, 8798ba9d, fe700aba, 0261a9ed, 12e3d3bf, 17271f04) and for the required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe. The REX series merge commit on main (db6b6f9dbba1266d6783774d659d4eef912929ff) is NOT an ancestor of this branch, which is expected and stated rather than smoothed over: the branch forked at 17271f04 and does not contain the later merge."
baseline_blocker: null
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED", "REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED", "REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED", "REX-805:TRACE_REPLAY_ABLATION_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED", "REX-807:RESEARCH_CONTROL_SURFACE_ACCEPTED"]
development_host: "Mech"
development_branch: "feat/city-owner-remote-operation"
development_head_sha: "314326007dce6e328792053936ce4c3a80c3b1e2"
development_ci: "THREE heads, every failure kept with its cause. (1) 803c18d1dcc184b0e44a5e1806ad2d25b8100dc6: run 37715239464 success - the study package that carries its own trace evidence. (2) a3078e8035e630114d2107de4dd60dc0d3015469: run 37718096755 attempt 1 FAILED on exactly ONE case, CAJ-WEB 2, with a 10.1s TimeoutError; classified as LOAD, on four measured grounds: 803c18d..a3078e8 changes only the study instrument and two test files and touches no web or agent-job file, that case passes alone on this host (green), it takes 27-57s under local parallel load, and attempt 2 of the SAME head is green. The failed attempt is kept rather than erased. (3) 314326007dce6e328792053936ce4c3a80c3b1e2 (this development head): run 37720240214 success, https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37720240214. Locally the full suite stands at 2037 tests / 2029 pass / 6 skipped / 2 failures that are BOTH contention timeouts (the theme-lab build hitting its own 20.6s EXECUTION_TIMEOUT and DGX007 at 50.4s); each passes in isolation (the DGX007 file in 2.8s, the theme file 5/5) and neither appears on the clean CI runner. The 6 skips are named, not silent: they are cases that deliberately refuse to run while a City holds this machine's coordination reservation, or whose checkout precondition is a clean tree."
development_complete: true
development_completion_note: "DEVELOPMENT CLOSED at 3143260. DELIVERED: the multi-device study with every element the workbook names - multi-device execution across two REAL devices, repetitions, one injected fault WITH measured directionality (faulted device 503 vs the other 200), observable recovery (901 ms), one replay, one ablation that MEASURABLY changed placement (source run dev-1428bce5 to dev-544adda1), artifact export, and the routing/placement decision recorded per repetition; the artifact package that CARRIES the trace records it points at (243/243) and is committed to the branch, so an independent host depends on no hand-off; the study INSTRUMENT itself (scripts/rex890-dev-study.mjs), parameterised and re-runnable from a bare checkout with no install, which is what makes the study reproducible instead of merely reported; and the required synthesis material (mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md) with experiment/run/failure counts, defect taxonomy, review-only findings, reproducibility delta, measured metrics, unresolved limitations and candidate paper directions. WHAT IS NOT CLAIMED: the opposite-host reproduction has NOT happened - every reproduction measured so far is THIS host's own rehearsal and the synthesis says so; NOT_MEASURED is not zero and 23 of 27 metrics keep their stated reasons; a fresh full export from the City now exits 1 with RECEIPT_WINDOW_TRUNCATED because the City has grown to 50 receipts and its bounded window truncated the oldest, which is why the package must travel with the branch rather than be re-derived. THE FINAL GATE IS NOT MET AND IS NOT CLAIMED: it requires the opposite host's independent reproduction (rebuild, independent execution, recomputed metrics, trace/provenance comparison, named inconsistencies, repair and re-reproduction) AND the Owner's exposure-gate PASS on CAP-CITY-REMOTE-OPERATION-001 and CAP-CITY-AGENT-JOB-001; merge_authority stays false until both exist."
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L4_TECHNICAL
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-890
terminal_marker: RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE
owner_gate_ruling_2026_10_07: "OWNER GATE OPEN for the REX series (owner instruction this session): QUALIFIED sub-tasks may merge, i.e. those whose own review is complete and whose marker is released. merge_authority is set true on REX-801..805 (all accepted and now in main) and stays false on REX-806/807/890 until their reviews complete - acceptance, the opposite-host review and the markers are unchanged, and section 3 still forbids self-review. Recorded by Mech-DS."
---

# REX-890 — Independent Reproducibility Study + V1 Freeze

> 常驻规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

Development host 先用 Research Fabric 运行一个代表性 multi-device study。

另一实体主机不能只读报告，必须：

1. 从 artifact / manifest 重建；
2. 独立执行；
3. 重算关键 metrics；
4. 对比 trace/provenance；
5. 指出不一致；
6. 修复后再复现。

## 最低 study

至少包含：

- multi-device execution；
- one handoff or routing decision；
- one injected fault；
- recovery；
- repetitions；
- one replay；
- one ablation；
- artifact export。

## 最终素材

必须生成：

`mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`

并总结：

- experiment count；
- run count；
- failure/exclusion count；
- defect taxonomy；
- Review-only findings；
- reproducibility delta；
- measured metrics；
- unresolved limitations；
- potential paper directions。

## Final gate

只有 opposite-host 独立 reproduction 成功、exact-head CI green、用户 exposure gate PASS，才能记录：

`RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`

随后才允许创建 programme final integration workbook。


---

[English reading translation / 完整英文阅读说明](en/REX-890-reproducibility-study-and-freeze.md)
