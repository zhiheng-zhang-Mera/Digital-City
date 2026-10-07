# DGX current full-series development delivery

Development: **8/8**. Formal second-host Review: **0/8 / NOT_RUN**, performed once for the entire series. No main merge.

Implementation candidate: `6fe6e85b51f3e067dc67405c8e01a93e89dca1b4` on `Alien-GPT-DGX`.
[Exact full CI](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37577646603): COMPLETED / success at that exact SHA.
[Whole-series evidence](series-evidence/SERIES_EVIDENCE.json) / [checksums](series-evidence/SHA256.json): PASS, clean source before/after, real physical hostname Mera-Alianware, 52 tests, all thirteen scenario mappings.
[Owner ruling](OWNER_SERIES_RULING.md) supersedes old per-workbook accepted dependency/review gating for development.

## New completion work

- Implemented the required PCF-owned ExecutionCapsule/ResultEvidenceEnvelope schema slice, including bounded payloads, canonical execution identities, exact SHA, expiry, artifact digest verification and explicit replay ledger.
- Wired its host-approved adapter into Gateway; mandatory trusted execution refs plus case/node/snapshot binding prevent caller identity substitution.
- Integrated result executors enter joint review. Claims/evidence/assumptions selected for release must exist in collected candidate records.
- Versioned final-review rounds archive old judgments and require renewed review after integration changes. Claim uncertainty and unresolved questions remain visible.
- One second-host runner executes the complete DGX test package and records SHA/hostname/clean source/checksums. It never auto-issues formal acceptance.

## Diagnostic review and remaining formal work

Fresh same-host series diagnostic review reproduced execution-reference fallback, immutable stale review and omitted uncertainty. All were fixed through failing-to-passing regressions; the narrow recheck observed 30 passing tests and no remaining Critical/Important findings. This is not second-host formal Review.

Second machine: fetch/check out the exact SHA, install dependencies as in CI, run `node scripts/verify-dgx-series.mjs --expected-sha 6fe6e85b51f3e067dc67405c8e01a93e89dca1b4 --second-host --out <new-absolute-directory-outside-source>`, then issue a single entire-series verdict with the generated evidence. See Utopia bilingual `docs/en/DGX_SERIES_ACCEPTANCE.md` and `docs/zh-CN/DGX_SERIES_ACCEPTANCE.md`.

Default production participant facts, contribution verification, approved execution/artifact readers and release receipts remain fail-closed unless the host installs trusted readers. Clinical simulation remains NOT_IMPLEMENTED/NOT_OBSERVED. These are explicit runtime boundaries, not skipped development acceptance. No production autonomous execution, domain safety relaxation, fabricated accepted SHA or unrelated programme activation is claimed.

## Historical candidate record

The following record preserves the previous candidate and its now-superseded per-workbook development blockers. Current state and Owner ruling above are authoritative.

# DGX series development candidate / 系列开发候选

Owner authorized activation on 2026-10-07 Australia/Sydney; execution_enabled=true for DGX-001..007 and DGX-990.
Single implementation branch: Alien-GPT-DGX. No merge to main, no force push.
Utopia initial main: cc799234e7daa3d8ccfde5673b9d07ccb2376742
Digital-City initial main: 04a6c855240de45e43828ad44a07ecbcfbe71b5d
Implementation candidate: 99c5d36a402422ad2b9100648d1ccd443ce25503
[Implementation branch](https://github.com/zhiheng-zhang-Mera/utopia/tree/Alien-GPT-DGX)
[Exact candidate](https://github.com/zhiheng-zhang-Mera/utopia/commit/99c5d36a402422ad2b9100648d1ccd443ce25503)

## Delivered / 已交付

- Ownership map: 12 canonical ownership rows, KEEP/REFERENCE, no extraction or duplicate reputation/task store.
- Versioned Constitution, facts, DAG, bounded PCF-domain consumer seams, authority/privacy invariants.
- Capability/history eligibility, hard independence floor, auditable scoring and honest fallback.
- Engineering/Research typed domain conformance; Health unavailable clinical seam.
- Explicit predicate conflict discovery, authenticated contribution seam, durable Pass A/defence/Pass B order with both-party independence.
- Exact case/head/scope receipt release policy, unresolved major/critical blockers, bounded appeal and retained dissent.
- Atomic bounded governance documents; Owner-only Gateway APIs; discoverable Web process capsule with L0/L1/L2, XSS protection, canonical task reconciliation.
- 13-scenario acceptance matrix; no final accepted/freeze marker.

## Validation / 验证

Final source 99c5d36a402422ad2b9100648d1ccd443ce25503:
- node --test tests/dgx*.test.mjs: 40/40 PASS, 0 failed; includes real local Gateway and headless Edge Web interaction, no canonical task mutation.
- node scripts/check-bilingual.mjs: PASS, three synchronized directories.
- git diff --check: PASS; source worktree clean, remote feature SHA matches.
- Initial broad local run: 1494/1500 PASS; 3 missing City parser dependency failures and 3 occupied-host coordination failures. Parser-sensitive tests rerun after dependency linkage; running City not disturbed.
- Hosted exact candidate full CI: COMPLETED / success at 99c5d36a402422ad2b9100648d1ccd443ce25503 (run 37574261361). Previous exact source 7194d37682a4d87b9e102ab5d791bd3dcf9df656 completed its full CI successfully (run 37573440288); this evidence is not substituted for the current head.
[Exact-head full CI](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37574261361) runs root tests, promotion history, Rooms, entire City tests, bilingual checks, Android unit tests and APK build.

## Diagnostic review / 诊断预审

Fresh-context same-host code review identified provenance override, snapshot defence leakage, cross-case receipt reuse, serialized-byte mismatch, appeal-state bypass, caller-supplied identity facts, and omitted actual participants. Each meaningful failure was reproduced in a targeted test and fixed. Pending appeals cannot be pre-resolved by input fields; all actual contributors enter joint final review; canonical identity ports replace request-supplied host/session facts.
This was not opposite-physical-host Formal Review. review_complete=false for all eight workbooks. No minor findings were deferred.

## Remaining gates / 剩余门槛

PCF-726 has no accepted implementation SHA at the frozen baseline. DGX-002's own contracts exist, but real versioned substrate integration is WAITING_DEPENDENCIES; development_complete remains false.
DGX-990's controlled harness exists; its Development/independent acceptance/freeze gate remains false until all prerequisites are satisfied.
DGX-001 and DGX-003..007 record development candidate completion; they remain unreviewed and do not acquire merge authority.
Production participant facts, authenticated contribution and final-release receipt readers are typed unavailable ports; the Gateway default only observes canonical tasks and supports case planning/inspection/manual conflict declaration. It cannot falsely release a product or execute a fabricated task. Clinical simulator NOT_IMPLEMENTED/NOT_OBSERVED. Registry entries are candidates, never formal verified truth.

## Rulings / 执行裁决

Owner's single-branch direction permits internal sequential development using exact previous commits; these are provisional development dependencies, not accepted Review source SHAs. PCF-owned execution transport/correlation/deduplication is not reimplemented. Different-host Engineering Formal Review stays mandatory. External gates are retained, not silently waived. Main and existing worktrees preserved.

Latest dependency refresh: Digital-City main 78d9efe4774d257678ad09c7c3cfb95d6d352306 still records PCF-726 execution_enabled=false, NOT_STARTED, no development/review head or accepted SHA. Its scope was not activated by DGX. Final integrated regression also proves an EVALUATE_RELEASE request cannot lower the case creation Owner-only boundary; cases default to Owner-only.
