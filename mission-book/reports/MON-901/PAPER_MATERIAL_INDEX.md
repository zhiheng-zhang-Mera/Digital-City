# MON-901 paper material index

Evidence candidate: observation/decision separation and bounded canonical-truth projection. No performance or novelty conclusion inferred from constructing a monitor.

- Utopia tests/mon901-observation.test.mjs: actual API lifecycle, outstanding-monitor isolation, failing reader/cancel, bounded population/overflow, deleted canonical history, shared-flight and stale-preservation.
- Utopia .runtime/evidence/mission-book/MON-901/canary-receipt.json: City767ac781-8073-492b-972a-d5397ba43f58, taskQ-e8738c51-bd44-4e6b-b04e-1a561f57ebe5, RUNNING→COMPLETED, canonical task/event IDs and source pointers; controlled reports, NOT real hardware execution.
- Raw red / reviewer-red / green and initial full-suite failure are retained. Hash receipt will bind final candidate without self-referential evidence commits.
- canonical_event_id/observed_at/projected_at/sample-projection latency/drop-gap available for observed canonical window. Task owner/review/CI/model-switch/escalation absent-source fields NOT_OBSERVABLE. unrelated-task-blocking=false in controlled outstanding-reader/cancel experiments; not a production performance claim.
- monitor_reconciliation_result: CONTROLLED_CANONICAL_MATCH; graph/navigation/UI NOT_RUN (MON-902); decision latency/provenance NOT_APPLICABLE (MON-903); opposite physical-host review NOT_RUN.
- Highest research grade: NONE_PENDING_FORMAL; classification watchlist observation/decision decoupling candidate only. Model tokens, hosted/cross-device timings and end-to-end ingestion latency unknown/null.

Final binding: implementation7eb38f1b930dfe6cc13dab0e17dedee467b1254b, exact pushCI37242446183 and PR37242505126 SUCCESS; final local root1255/1255, raw SHA256 a0e2f6db35c61cf6d46f1f601fc803281caca9c7af13ce06ea9a813a39ab4505. All earlier failure/partial statements remain chronological; physical Formal Review NOT_RUN.

## Opposite-host review extension / 对侧物理主机复核（Mech, MEGA-REP）

The statements above are the author's and remain chronological. They are superseded on one point only.

Formal Review PASS on exact head7eb38f1b930dfe6cc13dab0e17dedee467b1254b by Mech (COMPUTERNAME MEGA-REP), a different physical host from development_host Alien-codex. Six probes written for the review (`utopia:tests/mon901-mech-review-probes.test.mjs`, branch review/MON-901-mech-review at d68afa225d3f6abb9ba93583745b305e9705fddc) 6/6 pass against a real gateway; author suite unmodified 8/8 + 4/4. Exact-head CI re-measured: 37242446183 push SUCCESS, 37242505126 PR24 SUCCESS on the same head, 37242505131 reciprocal-contract SUCCESS. Scope checked not assumed: no pre-existing test file is modified, so no relaxed assertion required compensation. Evidence receipt hash-verified: declared canary-receipt.json SHA256 18003d74374c869ea9325d5a77bcf51b8ec88df0831cdda1d6b68f14df43514a reproduced from the committed blob; the receipt itself records physicalDevices NOT_RUN and executor CONTROLLED_PROTOCOL_REPORT_NOT_HARDWARE_BENCHMARK, so the NOT_RUN wording above is accurate rather than a gap this review filled.

Findings, neither blocking: F1 LOW - completeness.continuous is a hardcoded constant inside the computed completeness object, so a complete contiguous window reports historyGap=false together with continuous=false; conservative and documented, but MON-902 is the named consumer and would raise a false alarm. F2 INFORMATIONAL - state_identity_evidence CAPTURED had empty refs; the reviewer verified the substantiating material and supplied the pointer. One hypothesis tested and REJECTED: the ref() 160-char truncation is unreachable (node id <=80, node displayName <=100, join name <=64, generated ids <=40), so no defect is recorded for it. Same physical Windows controlled fixtures; no user-visible surface, cross-device or performance result is claimed. See REVIEW_REPORT.md.

语言配对 / Language pair: [English](./PAPER_MATERIAL_INDEX.md) · [中文](./zh-CN/PAPER_MATERIAL_INDEX.md)
