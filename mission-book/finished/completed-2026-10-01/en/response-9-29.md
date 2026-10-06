> Reading translation / 阅读译本. Historical source remains authoritative; this archived reading creates no new task activation.

[Canonical source](../response-9-29.md)

# Owner Response / Mission Report Decisions — English Historical Reading

**Date:** 2026-09-30. The filename is retained unchanged.
**Scope:** Digital-City `mission-book` reports through MB-009.
**Historical authority:** This records Owner rulings requested by Migration/Verification reports, effective unless superseded by a later Owner response. This reading does not reactivate the archived phase.

## R1 — MB-003 Worker Gateway: real provider gate

**Report:** `reports/MB-003/VERIFICATION_REPORT.md` §6.
**Decision: DO NOT WAIVE THE REAL-PROVIDER GATE. AUTHORISE A SUPERSEDING EXECUTION-SEAM MISSION.**

MB-003's core value is real Worker Gateway provider execution. The migration has adapters/contracts/resilience, but the donor's real runner/provider execution seam was deferred. A bounded unit/integration chain cannot count as the real detect→submit→progress→result path.

Ruling:

1. MB-003 remains `verification_status: BLOCKED_OWNER_DECISION`; its current branch must not merge into main.
2. Mock providers and structural completeness alone are not accepted.
3. Authorize a subsequent superseding/completion Mission limited to migrating the donor's existing real provider/runner execution seam and connecting it to MB-003. No new planner, vendor UI or provider semantics.
4. Before assigning hosts, probe donor-supported providers/runtimes on both physical hosts. Reserve the host with a real executable environment for Verification; the other performs Migration.
5. After the superseding Mission completes the real provider path, decide whether it supersede-closes MB-003 or returns to the original branch for final Verification. Do not declare MB-003 complete beforehand.

## R2 — MB-004 §6.1: Foreman not routed through MB-003

**Report:** `reports/MB-004/VERIFICATION_REPORT.md` §6.1.
**Decision: ACCEPT THE EXISTING REAL JOB + ZERO-COUPLING RESULT AS SUFFICIENT FOR MB-004.**

MB-004 ran a real Engineering job, checkpoint/continuation, ownership refusal and result/evidence. Neither donor then had a legally migratable glue seam. Forcing Foreman through unmerged MB-003 would invent behavior.

Therefore:

- Do not reopen existing `COMPLETE / COMPLETE`.
- The historical routing-through-MB-003 clause no longer blocks MB-004.
- After MB-003/the superseding seam enters main, a non-blocking smoke/integration check may run, but is not an additional acceptance condition.

## R3 — MB-004 §6.2: non-product modules entering the capability list

**Report:** `reports/MB-004/VERIFICATION_REPORT.md` §6.2.
**Decision: ACCEPT `capabilityProvider:false` AS THE CITY-LEVEL MECHANISM.**

A module that is not a product capability source should not automatically appear on Web/Android capability surfaces merely because it sits in a domain district.

- Module-level `capabilityProvider:false` is a formal City mechanism.
- Capability registry/enumeration must respect it.
- Individual Missions need no special patches.
- Current Utopia main already uses it, constituting implementation of this decision.

MB-004's earlier Project Foreman `BRIDGE_PENDING` exposure is a resolved historical observation.

## R4 — MB-005 / MB-006: “two hosts” wording

**Reports:** `reports/MB-005/VERIFICATION_REPORT.md` §6.1; `reports/MB-006/VERIFICATION_REPORT.md` §5.2.
**Decision: ACCEPT READING 1.**

Default meaning of two hosts running separately:

> A Mission's Migration Host and Verification Host are two different real physical hosts; each retains the real runtime evidence required by that Mission.

No third machine or second Verification Host is required. Existing MB-005/MB-006 completion stands, without another-machine rerun. If future validation requires two additional physical devices simultaneously, state that explicitly in the mission-specific gate instead of ambiguous two-host wording.

## R5 — MB-005 `bandKeyOf` donor bug

**Report:** `reports/MB-005/VERIFICATION_REPORT.md` §7.2.
**Decision: PRESERVE IT IN THE MIGRATION; DO NOT FIX IT INSIDE MB-005.**

This is actual frozen-donor semantics. MB-005 correctly copied and test-pinned it under `MIGRATION_ONLY`.

- Do not reopen MB-005.
- Do not fix it in the migration branch.
- Treat it as a non-blocking donor defect/post-migration backlog.
- If real Utopia product use later proves correction necessary, create ordinary bugfix/semantic-change work, no longer donor migration.

## R6 — MB-007 Research Institute: product-consumption gate

**Report:** `reports/MB-007/MIGRATION_REPORT.md` §4 D1.
**Decision: ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN VERIFICATION.**

Confirmed:

- Five modules migrated.
- Parity/required CI green.
- `capabilityProvider:false` prevents fabricated product-surface expansion.
- Current Utopia has no semantically equivalent existing product seam.
- New Web/Android capabilities just to satisfy the old gate would violate migration-only boundaries.

Adopt the v2 rule:

> For infrastructure/pipeline modules without an equivalent existing consumer surface, the Verification Host may execute migrated modules directly through a real, bounded, reproducible research chain as real consumption evidence.

**Owner hereby declares MB-007 Migration complete.** Verification must run on a host different from Alien, first syncing latest Utopia main and reassessing parity, known differences and the bounded chain.

## R7 — MB-008 Computer Use Runtime: product-consumption gate

**Report:** `reports/MB-008/MIGRATION_REPORT.md` §5.
**Decision: ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN VERIFICATION.**

MB-008 actually measured `NO_VERDICT_IDENTICAL_SEAM`, with quantified semantic counterexamples for candidate seams. Forced wiring would add product behavior or change existing judgments.

As with MB-007:

- No new UI.
- No capability added only to pass the gate.
- Do not quietly wire in another Building's module.
- Verification Host may directly verify migrated contract/safety/recovery/postcondition behavior through a real bounded Computer-Use chain.

**Owner hereby declares MB-008 Migration complete.** This waiver does not mean Computer Use is a complete usable product runtime. The report explicitly states the runtime plane was not fully migrated. Verification covers only this Mission's declared migration boundary; deferred capabilities cannot be marked complete.

## R8 — MB-009 building-level `kind`

**Report:** `reports/MB-009/VERIFICATION_REPORT.md` §5.4.
**Decision: ACCEPT BUILDING-LEVEL `kind` AS A CITY-LEVEL MECHANISM.**

Formally accept:

- District supplies default `kind`.
- Building may explicitly override it.
- `buildingKind(district, building)` or an equivalent single decision point determines effective kind.
- `00-foundation` may be infrastructure overall while `05-control-centre` is a domain capability building.
- No ownership redrawing or superseding Mission.

MB-009 completed and entered main; do not reopen it.

## R9 — “MB-009 will be the third mission blocked by product-consumption gate”

**Source:** forward-looking MB-007/008 reports and old `MISSION_INDEX.md`.
**Decision: HISTORICAL / SUPERSEDED.**

MB-009 ultimately had real Theme capability consumption and completed Migration, Verification and merge. The old wording predicted an unverified future and no longer represents current state.

## R10 — Historical index observations / non-blocking backlog

These do not block current Missions; classify consistently:

| Observation | Owner response |
|---|---|
| Absolute `catalog.length === 6` in `tests/capability-adapters.test.mjs` | **RESOLVED on current main**; continue relative census plus absolute adapter invariant |
| Project Foreman enumerated as an uncallable capability | **RESOLVED** by `capabilityProvider:false` |
| `checkManifestAgainstTree` cannot see undeclared directories | **OPEN BACKLOG**; repair independently after current integration backlog clears |
| Top-level versus `donors[]` shapes in `DONOR.json` | **OPEN BACKLOG**; define compatible reader/schema before migrating historical records |
| Mission Index does not visibly show host eligibility | **RESOLVED AT RULE LEVEL**; v2 asks Index to show eligible hosts where possible, but Claim truth remains individual Mission frontmatter |
| Promotion hub omits current relocation path | **NON-BLOCKING**; manifest / DONOR.json remain current-location truth |
| Promotion verifier reads HEAD instead of worktree | **NON-BLOCKING UX ISSUE**; improve messaging separately |
| Windows shell `pwsh` absent from PATH | **ENVIRONMENT NOTE**; use `powershell.exe` in that environment |
| Stale gateway serves old in-memory registry after registry/adapter changes | **OPERATIONS NOTE**; confirm relevant services actually restarted to target HEAD before real consumption verification |

## Immediate historical scheduling effect

Once this Owner response takes effect:

1. Do not start MB-010/011/012; they remain disabled.
2. MB-007/008 move from BLOCKED to Migration COMPLETE / Verification OPEN.
3. MB-003 remains BLOCKED, awaiting the authorized superseding execution-seam Mission.
4. Scheduling uses README v2 integration-first and WIP limit 2.
5. The next worker actually touching MB-003/007/008 branches first records an `OWNER_INTERVENTION` event citing this file, then proceeds.

These instructions retain their historical scope; reading this archive authorizes no new construction.
