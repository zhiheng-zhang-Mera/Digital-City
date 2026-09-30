# Mission Index — Active Queue

> **Runtime truth:** each Mission's current front matter + [README.md](./README.md) + [response-9-30.md](./response-9-30.md) + [response-9-29.md](./response-9-29.md) where not superseded.  
> Historical rules/index snapshots are under [past-rules/](./past-rules/).

## Current state

| Seq | Mission | Enabled | Migration | Verification | Migration Host | Verification eligibility / next action |
|---:|---|:---:|:---:|:---:|---|---|
| 1 | [MB-001](./MB-001-core-os.md) | YES | COMPLETE | COMPLETE | Alien | closed |
| 2 | [MB-002](./MB-002-capability-fabric.md) | YES | COMPLETE | COMPLETE | Mech | closed |
| 3 | [MB-003](./MB-003-worker-gateway.md) | YES | COMPLETE | **BLOCKED_AWAITING_VERIFICATION_HOST** | Alien | Step 3 reassessment = `ROUTE_B_CONTINUE` (WG-01..08 all missing). **The two-host gate is now SATISFIED**: Mech (`MEGA-REP`) and Alien (`MERA-ALIANWARE`) each left a real donor-supported provider receipt (Alien's: driver `run-3/provider-probe.mjs`, eight verdicts all true, real `exit 0` + model answer `OK`). What remains is the completion repair + merge, which the active rules assign to the **Verification Host**; the finalizer enforces `migrationHost != verificationHost`, so Alien must not self-verify. Branch `99e5606` (6 ahead / 59 behind) |
| 4 | [MB-004](./MB-004-project-foreman.md) | YES | COMPLETE | COMPLETE | Mech | closed; historical MB-003 routing clause accepted as non-blocking — response R2 |
| 5 | [MB-005](./MB-005-host-health.md) | YES | COMPLETE | COMPLETE | Mech | closed |
| 6 | [MB-006](./MB-006-restart-recovery.md) | YES | COMPLETE | COMPLETE | Alien | closed |
| 7 | [MB-007](./MB-007-research-institute.md) | YES | **COMPLETE / OWNER_ACCEPTED** | **COMPLETE + REPAIR STEP 1 ✅** | Alien | repair closed: finalizer `f25cdb4`, merge `d850d73`, episode `MB-007:553ab7ba1c4b0902` |
| 8 | [MB-008](./MB-008-computer-use.md) | YES | **COMPLETE / OWNER_ACCEPTED** | **COMPLETE + REPAIR STEP 2 ✅** | Alien | repair closed: episode `MB-008:6ae0bbd46e425c9f`, merge `168182c`, merged-main CI `36663813362` PASS |
| 9 | [MB-009](./MB-009-theme-relocation.md) | YES | COMPLETE | COMPLETE | Mech | closed; building-level kind accepted — response R8 |
| 10 | [MB-010](./MB-010-node-fabric.md) | **YES** | **ASSESSMENT_PENDING** | NOT_STARTED | — | assessment-first; auto-claim when P0 clear |
| 11 | [MB-011](./MB-011-customs.md) | **YES** | **ASSESSMENT_PENDING** | NOT_STARTED | — | assessment-first; compare current Utopia before migration |
| 12 | [MB-012](./MB-012-runtime-compliance.md) | **YES** | **ASSESSMENT_PENDING** | NOT_STARTED | — | assessment-first; migrate only proven gaps |

## Immediate dispatch queue

Current scheduler is **integration-first**, not migration-first.

```text
COMPLETE. MB-007 — implementation + Owner-override episode closed
COMPLETE. MB-008 — bounded verification + owner-override episode + merge `168182c`; merged-main CI PASS
BLOCKED.  MB-003 — the two-host gate is now SATISFIED (Mech + Alien receipts both recorded), so the
          environment blocker is cleared. The remaining condition is host authority, not environment:
          the completion repair (merge main → migrate the §8.5 execution seam → gate → host-pass
          finalize → merge) must be done by the **Verification Host**, and the finalizer enforces
          `migrationHost != verificationHost`. Alien is the Migration Host and must not self-verify.
THEN.     Utopia main final integration sweep (MB-007 + MB-008 merged; MB-003 still has a real delta)
THEN.     MB-010 → MB-011 → MB-012 assessment-first queue
```

`SKIPPED_NOT_REQUIRED` is a **green completion basis**, not an eternal red/not-started state.

At the Owner review snapshot, the Utopia branches for MB-007 and MB-008 were both substantially behind current `main`; the verifier must recompute the exact ahead/behind count immediately before work and merge the latest `main` into each branch **one at a time**.

Do not prepare both integrations against the same stale `main`: finish/merge MB-007 first, then resync MB-008 against the new `main`.

## Active selection rule

See [README.md §3](./README.md).

Condensed:

```text
1. eligible verification/integration work first
   → stale/shared-control-plane pressure first
   → sequence ASC
2. only if no eligible P0:
   eligible assessment-first claim
   → sequence ASC
3. after FULL/PARTIAL assessment:
   same host continues eligible migration
   → only while unmerged substantive WIP < 2
4. NO_VALUE → SKIPPED_NOT_REQUIRED → Mission COMPLETE
5. blocked / disabled / claimed by another host
   → skip
```

### Dependency rule

Unless a Mission explicitly says otherwise, a dependency is satisfied only when the required dependency implementation has been Verification-accepted and is present in the target implementation repository `main`. `migration_complete=true` on an unmerged branch is not enough.

## Owner decisions now resolved

Latest ruling: [response-9-30.md](./response-9-30.md). Prior rulings in [response-9-29.md](./response-9-29.md) remain effective where not superseded.

- **Completion basis:** `IMPLEMENTED_COMPLETE`, `OWNER_ACCEPTED_COMPLETE`, and `SKIPPED_NOT_REQUIRED` are all valid Migration completion bases.
- **MB-010/011/012:** assessment-first remains required; NO_VALUE now means retained + unmigrated + **green SKIPPED completion**, with Verification not required.
- **Assessment evidence:** capability matrix + current Utopia main SHA + positive/negative selection evidence are mandatory and preserved for research/paper use.

- **MB-003 real provider:** not waived if MB-003 is still valuable after Step 2; the donor-backed completion repair may stay under the MB-003 Mission identity instead of requiring a new Mission number.
- **MB-004 routing clause:** existing real Engineering job + zero donor coupling accepted; no reopen.
- **Capability enumeration:** `capabilityProvider:false` accepted as City-level mechanism.
- **Two-host wording:** Migration Host + Verification Host are the two required real hosts by default.
- **MB-005 `bandKeyOf`:** preserve donor bug in migration; future semantic fix must be separate.
- **MB-007 / MB-008 product-consumption gate:** boundary accepted; bounded real chain may satisfy verification when no equivalent existing product seam exists.
- **MB-009 building-level `kind`:** accepted as City-level mechanism.

## Current non-blocking backlog

These items are **not Mission acceptance blockers** and must not delay MB-007/008 integration:

1. **OPEN:** `city/manifest.mjs` does not reverse-check filesystem modules that are absent from the manifest/census.
2. **OPEN:** `DONOR.json` has legacy top-level vs `donors[]` shapes; define a compatibility reader/schema before normalising history.
3. **RESOLVED:** absolute `catalog.length === 6` census fragility is no longer the current main assertion pattern.
4. **RESOLVED:** Project Foreman appearing as an unusable product capability is handled by `capabilityProvider:false`.
5. **NON-BLOCKING:** promotion hub's normalized record is historical placement, not current relocation truth; use manifest / `DONOR.json` for current location.
6. **NON-BLOCKING UX:** promotion-history verifier reads Git `HEAD`, not uncommitted worktree.
7. **ENVIRONMENT:** on the observed Windows host use `powershell.exe` where `pwsh` is unavailable.
8. **OPERATIONS:** restart shared gateway/services after registry/adapter changes before claiming a real runtime-consumption result.

## Notes for historical reports

Old reports contain statements such as:

- “migration work has priority over verification”;
- “MB-007/008 are blocked until Owner decision”;
- “MB-009 will be the third product-consumption blocker”;
- “MB-004 may still be blocked by MB-003”;
- old rule numbers 1..16.

Those statements remain valid descriptions of the state **when the reports were written**, but they are not current scheduler instructions. Use [past-rules/](./past-rules/) to interpret them historically and [response-9-29.md](./response-9-29.md) for the Owner's resolution.
