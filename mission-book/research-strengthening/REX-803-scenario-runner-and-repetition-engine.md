---
workbook_id: REX-803
phase: RESEARCH_STRENGTHENING
sequence: 803
execution_enabled: true
status: "IN_PROGRESS"
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-801","REX-802"]
dependency_source_shas: ["7e96a4d28f4cb701d7a0951bace69857c3228f32","833279cae237080cca88b1b6dbc9f217027ba68f"]
development_baseline_sha: "213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-05): baseline_anchor_mode resolved literally against refs/heads/main. Both declared dependencies were already accepted AND already in main - REX-801 (7e96a4d28f4cb701d7a0951bace69857c3228f32) and REX-802 (833279cae237080cca88b1b6dbc9f217027ba68f) - so the dependency union is the eligible base itself and no merge had to be constructed. Resolved baseline (40-char): 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef. Dependency smoke run BEFORE any REX-803 product change: node --test on the REX-801 and REX-802 suites -> 23 tests, 23 pass, 0 fail at that exact commit. Development worktree D:/utopia-rex803 on branch rex/REX-803-mech-scenario-runner, created from the resolved baseline."
baseline_blocker: null
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED"]
development_host: "Mech"
development_branch: "rex/REX-803-mech-scenario-runner"
development_head_sha: "a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df"
development_ci: "MEASURED, PER RUN, from the Actions API on exact a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df: push run 37407868473 attempt 1 COMPLETED SUCCESS, pull_request run 37407871700 attempt 1 COMPLETED SUCCESS, pull_request linkage run 37407871716 attempt 1 COMPLETED SUCCESS. No run on this head failed. LOCAL at that head: 41 tests pass across the REX-803 suites plus REX-801 and REX-802. PROCESS NOTE, recorded because it nearly became the very defect this programme keeps finding: the first draft of this field claimed a push-run failure with rerun ids that had NOT been read from the API (it was written from the MON-902 pattern rather than from measurement). The draft was replaced by this measured text before it was committed; nothing unmeasured left this host. The lesson - a CI claim is written from a per-run API read, never from an expected shape - is recorded in reports/REX-803/DEVELOPMENT_REPORT.md. EARLIER HEADS: 85a79eca4fe0f4ad8882148725249e016434873e (V0.2 37398347907/37398374690, linkage 37398375378), e284b712c53e5b7f44acdb878afd6a23c7953735 (linkage 37399121438), 57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1 (V0.2 37399258359/37399254235, linkage 37399258414) - all measured green. The head moved four times because development continued: the seed-identity repair (D-7, found by the first physical campaign), the physical campaign evidence, and this hardening pass (D-8/R-1 unusable receipt store broke the list route; D-9/R-2 an outside cancellation was classified FAILED)."
development_complete: true
review_host: Alien
review_head_sha: 8798ba9dd37051626033ad72080b2fad3ff66149
review_ci: Exact8798ba9 push37423084327 / PR37423138551 / linkage37423138558 all terminal SUCCESS. PR37 repair71 focused PASS, critic8 PASS. Physical two-host+Android campaign remains NOT_RUN; no accepted marker.
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-803
terminal_marker: SCENARIO_REPETITION_ENGINE_ACCEPTED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
state_identity_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/REX-803/PAPER_MATERIAL_INDEX.md"]
state_identity_evidence_refs: ["mission-book/reports/REX-803/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: ["RS-G3-IDENTITY-PROVENANCE","RS-G3-DYNAMIC-LIVENESS","RS-G3-OWNER-INTERVENTION-TAXONOMY","RS-G3-PASSIVE-EVIDENCE-PIPELINE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
capability_ids: ["CAP-RESEARCH-CAMPAIGN-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-RESEARCH-CAMPAIGN-001.yaml"]
physical_gate_status: "PARTIAL - two controlled campaigns were run on the live resident City on 2026-10-06 with the physical Android handset (OPPO PERM00) connected as the live control surface and the host reference node executing every repetition; the Alien host node was OFFLINE (last heartbeat 2026-10-05T11:15:06Z), so the Alien + Mech + Android topology the completion gate names was not available and is NOT claimed."
review_branch: review/REX-803-Alien-20261006
review_pr: https://github.com/zhiheng-zhang-Mera/utopia/pull/37
review_verdict: TECHNICAL_REPAIR_VERIFIED_PHYSICAL_GATE_PENDING
review_report_ref: mission-book/reports/REX-803/REVIEW_REPORT.md
---

# REX-803 — Controlled Scenario Runner + Repetition Engine

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

支持：

```text
scenario
× N repetitions
→ bounded execution
→ run receipts
→ normalized outcomes
```

## 必须支持

- deterministic seed policy；
- repetitions；
- warmup / measured run distinction；
- timeout；
- stop/cancel；
- per-run exclusion reason；
- topology readiness；
- no-idle long campaign handling；
- resume policy 明确，不默认偷偷续跑。

## 用户入口

DIRECT_CONTROL：

- choose scenario；
- set repetitions；
- start；
- stop；
- inspect progress；
- inspect failed/excluded runs。

## Review

独立检查重复执行、取消、重启、timeout、partial campaign、seed reproducibility。

## 完成门槛

可在 Alien + Mech + Android 基础拓扑运行至少一组 controlled campaign，并留下完整 research trace/material。
