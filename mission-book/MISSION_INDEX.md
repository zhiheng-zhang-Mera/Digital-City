# Mission Index — Active Queue

> **Runtime truth:** each Mission's current front matter + [README.md](./README.md) + [response-9-29.md](./response-9-29.md).  
> Historical rules/index snapshots are under [past-rules/](./past-rules/).

## Current state

| Seq | Mission | Enabled | Migration | Verification | Migration Host | Verification eligibility / next action |
|---:|---|:---:|:---:|:---:|---|---|
| 1 | [MB-001](./MB-001-core-os.md) | YES | COMPLETE | COMPLETE | Alien | closed |
| 2 | [MB-002](./MB-002-capability-fabric.md) | YES | COMPLETE | COMPLETE | Mech | closed |
| 3 | [MB-003](./MB-003-worker-gateway.md) | YES | COMPLETE | **BLOCKED_OWNER_DECISION** | Alien | claimed by Mech; **do not merge**; Owner authorised a superseding real execution-seam Mission — see response R1 |
| 4 | [MB-004](./MB-004-project-foreman.md) | YES | COMPLETE | COMPLETE | Mech | closed; historical MB-003 routing clause accepted as non-blocking — response R2 |
| 5 | [MB-005](./MB-005-host-health.md) | YES | COMPLETE | COMPLETE | Mech | closed |
| 6 | [MB-006](./MB-006-restart-recovery.md) | YES | COMPLETE | COMPLETE | Alien | closed |
| 7 | [MB-007](./MB-007-research-institute.md) | YES | **COMPLETE** | **NOT_STARTED / OPEN** | Alien | **Mech eligible**; integration-first P0 |
| 8 | [MB-008](./MB-008-computer-use.md) | YES | **COMPLETE** | **NOT_STARTED / OPEN** | Alien | **Mech eligible**; integration-first P0 |
| 9 | [MB-009](./MB-009-theme-relocation.md) | YES | COMPLETE | COMPLETE | Mech | closed; building-level kind accepted — response R8 |
| 10 | [MB-010](./MB-010-node-fabric.md) | **NO** | NOT_STARTED | NOT_STARTED | — | disabled / optional |
| 11 | [MB-011](./MB-011-customs.md) | **NO** | NOT_STARTED | NOT_STARTED | — | disabled / extraction gate not met |
| 12 | [MB-012](./MB-012-runtime-compliance.md) | **NO** | NOT_STARTED | NOT_STARTED | — | disabled / extraction gate not met |

## Immediate dispatch queue

Current scheduler is **integration-first**, not migration-first.

```text
P0. MB-007 Verification / Integration
P0. MB-008 Verification / Integration
BLOCKED. MB-003 until the authorised superseding execution-seam Mission exists
STOP. No new MB-010/011/012 migration
```

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
   eligible new migration
   → only while unmerged substantive WIP < 2
   → sequence ASC
3. blocked / disabled / claimed by another host
   → skip
```

### Dependency rule

Unless a Mission explicitly says otherwise, a dependency is satisfied only when the required dependency implementation has been Verification-accepted and is present in the target implementation repository `main`. `migration_complete=true` on an unmerged branch is not enough.

## Owner decisions now resolved

Canonical rulings: [response-9-29.md](./response-9-29.md).

- **MB-003 real provider:** not waived; superseding donor-backed execution-seam Mission authorised.
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
