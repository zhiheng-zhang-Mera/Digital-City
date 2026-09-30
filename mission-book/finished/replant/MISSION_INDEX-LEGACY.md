# Mission Index — Migration Queue Closed / Pre-Assistant Product Closeout

> **Runtime truth:** each Mission's current front matter + [README.md](./README.md) + [response-9-30.md](./response-9-30.md) + [response-9-29.md](./response-9-29.md) where not superseded.  
> Historical rules/index snapshots are under [past-rules/](./past-rules/).

## Current phase — Owner ruling R12

```text
MIGRATION_QUEUE = CLOSED
CLAIMABLE_MB = NONE
CURRENT_WORK = ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md
AUTHORIZED_ORDER = T0 -> T1 -> T2 -> T3 -> T4 -> STOP
```

Current work is product integration, not a new MB migration. See
[`response-9-30.md#R12`](./response-9-30.md#r12--migration-only-正式结束进入-pre-assistant-product-closeout)
and the [binding workbook](./ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md).

## Current state

| Seq | Mission | Enabled | Migration | Verification | Migration Host | Verification eligibility / next action |
|---:|---|:---:|:---:|:---:|---|---|
| 1 | [MB-001](./MB-001-core-os.md) | YES | COMPLETE | COMPLETE | Alien | closed |
| 2 | [MB-002](./MB-002-capability-fabric.md) | YES | COMPLETE | COMPLETE | Mech | closed |
| 3 | [MB-003](./MB-003-worker-gateway.md) | YES | COMPLETE | **COMPLETE** | Alien | closed. Value = `ROUTE_B_CONTINUE`; the deferred donor execution seam was migrated as `worker-runner`; the two-host real-provider gate is satisfied by Mech (`MEGA-REP`) and Alien (`MERA-ALIANWARE`) each leaving a receipt, and the real chain was re-run through the ported seam. Episode `MB-003:5c0ab438d20476d1`; merge `756c7d7`; merged-main CI `36671850064`. Host separation OWNER_WAIVED under response R10, recorded in the episode |
| 4 | [MB-004](./MB-004-project-foreman.md) | YES | COMPLETE | COMPLETE | Mech | closed; historical MB-003 routing clause accepted as non-blocking — response R2 |
| 5 | [MB-005](./MB-005-host-health.md) | YES | COMPLETE | COMPLETE | Mech | closed |
| 6 | [MB-006](./MB-006-restart-recovery.md) | YES | COMPLETE | COMPLETE | Alien | closed |
| 7 | [MB-007](./MB-007-research-institute.md) | YES | **COMPLETE / OWNER_ACCEPTED** | **COMPLETE + REPAIR STEP 1 ✅** | Alien | repair closed: finalizer `f25cdb4`, merge `d850d73`, episode `MB-007:553ab7ba1c4b0902` |
| 8 | [MB-008](./MB-008-computer-use.md) | YES | **COMPLETE / OWNER_ACCEPTED** | **COMPLETE + REPAIR STEP 2 ✅** | Alien | repair closed: episode `MB-008:6ae0bbd46e425c9f`, merge `168182c`, merged-main CI `36663813362` PASS |
| 9 | [MB-009](./MB-009-theme-relocation.md) | YES | COMPLETE | COMPLETE | Mech | closed; building-level kind accepted — response R8 |
| 10 | [MB-010](./MB-010-node-fabric.md) | YES | **SKIPPED_COMPLETE / NO_VALUE** | **NOT_REQUIRED_SKIPPED_COMPLETE** | Mech | closed. Alien independently confirmed NO_VALUE under R11; provenance branch `mission/MB-010-node-fabric` @ `8380c38` was merged as provenance only (`6e9781c`) and retained remotely. No implementation merge; `merged_main_sha=null` remains correct |
| 11 | [MB-011](./MB-011-customs.md) | YES | **SKIPPED_COMPLETE / NO_VALUE** | **NOT_REQUIRED_SKIPPED_COMPLETE** | Mech | closed. Alien independently confirmed NO_VALUE under R11; provenance branch `mission/MB-011-customs` @ `82b6ac4` was merged as provenance only (`f22273c`) and retained remotely. No implementation merge; `merged_main_sha=null` remains correct |
| 12 | [MB-012](./MB-012-runtime-compliance.md) | YES | **SKIPPED_COMPLETE / NO_VALUE** | **NOT_REQUIRED_SKIPPED_COMPLETE** | Mech | closed. Alien independently confirmed NO_VALUE under R11; provenance branch `mission/MB-012-runtime-compliance` @ `d071328` was merged as provenance only (`e0d9470`) and retained remotely. No implementation merge; `merged_main_sha=null` remains correct |

## Immediate dispatch queue

The migration scheduler is **closed**. The block below preserves the final migration closeout trail for provenance; only the R12 CURRENT/FORBIDDEN lines are actionable now.

```text
COMPLETE. MB-007 — implementation + Owner-override episode closed
COMPLETE. MB-008 — bounded verification + owner-override episode + merge `168182c`; merged-main CI PASS
COMPLETE. MB-003 — step 3 closed 2026-09-30. Value = `ROUTE_B_CONTINUE`; the deferred donor execution
          seam was migrated as `worker-runner`; the two-host gate is satisfied by Mech's and Alien's
          own receipts, and the real chain was re-run through the ported seam (5/5 verdicts). Episode
          `MB-003:5c0ab438d20476d1`, merge `756c7d7`, merged-main CI `36671850064`. Host separation is
          OWNER_WAIVED under response-9-30 R10 and is recorded in the episode, with Mech's historical
          VERIFICATION events and BLOCKED finding preserved under their own host.
THEN.     Utopia main final integration sweep (MB-007 + MB-008 + MB-003 all merged) — VERIFIED:
          every mission branch measured AheadOfMain = 0 against utopia@756c7d7
COMPLETE. MB-010 — assessment verdict `NO_VALUE` (Host Mech, 2026-09-30). 5/5 capabilities
          already equivalent-or-superior; MB-001 had migrated the donor's live node logic
          from the same frozen `8df428e`; the donor remainder is production-dead at the
          baseline. 0 migrated, 0 implementation code, branch `mission/MB-010-node-fabric`
          @ `8380c38` later provenance-merged under R11 as `6e9781c` and retained remotely.
          Green completion basis `SKIPPED_NOT_REQUIRED`; no implementation merge.
COMPLETE. MB-011 — assessment verdict `NO_VALUE` (Host Mech, 2026-09-30). Assessed as the
          named owner of MB-002's deferred Hns plugin/adapter platform. The donor's
          coherent admission design (app/core/plugin-install/*, 960 lines) has ZERO app
          consumers; the donor neither verifies provenance nor refuses on isolation nor
          gates on permissions. 0 migrated, 0 implementation code, branch
          `mission/MB-011-customs` @ `82b6ac4` later provenance-merged under R11 as `f22273c`
          and retained remotely. Green completion basis `SKIPPED_NOT_REQUIRED`; no implementation merge.
COMPLETE. MB-012 — assessment verdict `NO_VALUE` (Host Mech, 2026-09-30). Assessed as the
          named owner of MB-002's deferred Codex-Boss permission/authorization
          resolution. The deferred layer has ZERO non-test production callers and the
          composition root builds `ExecutionGate` with no authorizer; the runtime-policy
          JSON is parsed by nothing; escalation rejection is CI-script-only; the audit
          ledger is read only by tests. 0 migrated, 0 implementation code, branch
          `mission/MB-012-runtime-compliance` @ `d071328` later provenance-merged under R11 as `e0d9470`
          and retained remotely. Green completion basis `SKIPPED_NOT_REQUIRED`; no implementation merge.

MIGRATION QUEUE CLOSED. Every enabled Mission (MB-001..MB-012) has verification_complete = true.
          R11 provenance closeout is merged and the recorded Utopia branch audit has unmerged = 0.
CURRENT.  Execute ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md only:
          T0 migration closeout/freeze -> T1 Rooms shell integration -> T2 Action facade ->
          T3 deterministic Ask/Do -> T4 independent acceptance/merge -> STOP.
FORBIDDEN. Do not auto-create MB-013, reopen a closed Mission, add Boss/Hns connectors,
          add an assistant/persona layer, add an LLM router, or create a new Room.
```

`SKIPPED_NOT_REQUIRED` is a **green completion basis**, not an eternal red/not-started state.

**Historical closeout note (inactive):** at the earlier Owner review snapshot, MB-007/008 required one-at-a-time resync against then-current Utopia `main`. Both are now closed and merged. This note must not be interpreted as current work.

## Historical migration selection rule — inactive unless Owner reopens a Mission

The current product executor must follow
[`ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md`](./ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md),
not this historical selector.

For provenance, the closed migration selector was:

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

> **MB-010 / MB-011 / MB-012 — independent re-verification (host `Alien`, 2026-09-30).** Owner-directed:
> redo the verification for the three assessment-first Missions **without reusing any existing test**, with
> real Android device operation permitted. All three `NO_VALUE` verdicts are **independently confirmed**;
> evidence in each report's new §9.
>
> - **MB-010 Node Fabric.** My own probes on the frozen donor: `new TenxNodeRegistry(` / `new TenxNetworkRegistry(`
>   have **zero construction sites** and `tenx/` appears nowhere in `electron/main.ts`, `electron/bootstrap/`
>   or `electron/host/`, while the live halves (`node-capability-registry` in `main.ts`, `inspectDevice` in
>   `host-status-ipc`/`doctor`) are the logic MB-001 already ported. The product side was verified on a
>   **real Android device** (`PERM00`, Android 12) paired over the LAN to the live gateway: the phone renders
>   the node list, `ONLINE` vs `OFFLINE · Cached`, CPU/memory telemetry, and the capability surface — and the
>   rendered memory figure matches the gateway byte count exactly (18.4 GB = 19740823552 bytes).
> - **MB-011 Customs.** Nothing imports or calls the donor's `app/core/plugin-install/` admission state
>   machine. Utopia's existing checks were re-proven by tampering: five malformed manifests are each refused
>   with a named reason while the untampered one is accepted, promotion provenance verifies against real Git
>   history, and the fabric refuses a second owner of one capability by name. One refinement is recorded:
>   CU-04's `plugin-adapters` home *is* reachable from the live `app/plugin-host.cjs`, so the decisive reason
>   for CU-04 is the report's separate one — Utopia has no plugin platform for a Customs layer to admit.
> - **MB-012 Runtime Compliance.** No application importer of the `electron/capability/*` family (only two CI
>   scripts), and the live gate is built as `new ExecutionGate()` with **no authorizer**, so the hook cannot
>   fire. Utopia's own enforcement was re-proven on live paths: illegal operation → `OPERATION_BLOCKED`,
>   oversize input → `INPUT_TOO_LARGE`.
>
> **Nothing was merged as implementation, and no verdict changes.** Each of the three assessment branches is
> exactly **1 ahead / 0 behind** `main`, and that single commit contains only assessment provenance
> (`data-records/evolution/inbox/mission-book/MB-0xx/events.jsonl` and
> `evidence/raw/mission-book/MB-0xx/assessment/**`) — **no implementation code**, which is why
> `merged_main_sha: null` stays correct for all three. Every Mission branch that does carry implementation
> (MB-001..MB-009) is **0 ahead / fully merged**.
>
> **Owner ruling [`response-9-30.md#R11`](./response-9-30.md) (2026-09-30): the three provenance branches are
> merged anyway.** After the independent verification passed, the Owner directed that the Utopia branches be
> merged into `main` with operation history and SHA tracking preserved, and that the `NO_VALUE` confirmation
> be **force-recorded under host `Alien`**. [README.md](./README.md) line 223 otherwise keeps a `NO_VALUE`
> assessment branch unmerged as provenance; R11 overrides that **for these three branches only**, and
> `assessment_result = NO_VALUE`, `migration_completion_basis = SKIPPED_NOT_REQUIRED` and
> `merged_main_sha: null` are all unchanged — a provenance merge must never read as an implementation merge.
> Alien's record is Alien-authored `VERIFICATION` events; the assessment host's events are preserved verbatim.
> The merge SHAs are in the block below.

```text
utopia main at re-verification : 756c7d760c605e33ba386e87605e078fe24b82ca
MB-010 assessment branch       : mission/MB-010-node-fabric        @ 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526  (1 ahead / 0 behind)
MB-011 assessment branch       : mission/MB-011-customs           @ 82b6ac486d024efcfcc64703b58cc136b546caf9  (1 ahead / 0 behind)
MB-012 assessment branch       : mission/MB-012-runtime-compliance @ d071328d8f68ba1ddd5e8a1fde11718e75fd6672  (1 ahead / 0 behind)
merged_main_sha                : null for all three (SKIPPED_NOT_REQUIRED - no implementation was merged)
```

Provenance merges executed under ruling R11 (`--no-ff`, second parent = branch tip, all three
conflict-free, all three branches retained on the remote):

```text
MB-010 mission/MB-010-node-fabric        @ 8380c38  -> merge 6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a  (parents 756c7d7, 8380c38)
MB-011 mission/MB-011-customs            @ 82b6ac4  -> merge f22273c37af1ebff6c95d49972b5d26a222f2ed2  (parents 6e9781c, 82b6ac4)
MB-012 mission/MB-012-runtime-compliance @ d071328  -> merge e0d9470e2a5b5479c1614071d8f43af3d1d93248  (parents f22273c, d071328)
Alien's forced NO_VALUE record  : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e (9 VERIFICATION events, 3 per Mission)
utopia main after everything    : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
files added per merge           : 5 (events.jsonl + 4 assessment evidence files) - NO IMPLEMENTATION CODE
branch audit after the merges   : 34 origin refs checked, unmerged = 0
                                  (MB-010..012 are now 0 ahead / 6 behind main, i.e. fully merged;
                                   every other branch, including MB-001..MB-009 and all alien/*,
                                   codex/*, mech/*, docs/*, infra/* and repair/* branches, is 0 ahead)
merged-main CI                  : run 36678805229 on d0dea7b - gateway-web success, android success
city main (this record)         : 247f20264cd1c0085f068f61ab0eaa18b2825ffd
```
