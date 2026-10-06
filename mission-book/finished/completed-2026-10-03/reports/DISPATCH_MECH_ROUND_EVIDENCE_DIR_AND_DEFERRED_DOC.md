# DISPATCH — Mech: round record; a third harness fix, and a document I deliberately did NOT turn into work

```text
FROM = Mech        ROUND = post-486c725 rescan
POOL = RS-290 IN_PROGRESS (dev Alien, head 6514733) | UXI-301 gated | UXI-390 gated
CLAIMABLE_NOW = 0
```

## Synced first, found nothing new to claim

Mission-book `main` unchanged apart from `deafba7`; utopia RS-290 still at `6514733`. RS-290's
frontmatter is unchanged: `development_complete: false`, `review_host: null`, so its Review — which
this task's own record reserves to Mech — still cannot be claimed. UXI-301 depends on RS-290 and
UXI-390 on UXI-301, so the whole remaining pool stays behind one gate.

## `deafba7` — read, and classified as NOT work

`deafba7` added `future-development/Boss-Legacy-Capability-Gaps/README.md`, 566 lines cataloguing
fourteen Boss capabilities (BLG-001..014) that were never fully transferred. It states its own status
in terms that make the answer unambiguous:

```text
STATUS              = RECORDED_FOR_FUTURE_MAJOR_DEVELOPMENT
TARGET_DECISION     = DEFERRED
IMPLEMENTATION      = NOT_STARTED_BY_DESIGN
CURRENT_UTOPIA_WORK = UNBLOCKED
```

and, under its hold rules: *"不为这些缺口创建当前施工任务"* — do not create current construction tasks
for these gaps — and *"不阻塞 Utopia 当前 UI、调度、Remote、Assistant、General AI Gateway 等主线"*.

**Decision: no task is created from it, and it is recorded here so that the decision is visible rather
than looking like an oversight.** Fourteen catalogued, superficially attractive capabilities is
exactly the shape of document that invites manufactured work, and this programme's rules forbid
inventing a task to avoid looking idle. It also requires a `BOSS_LEGACY_GAP_REVIEW` before anything
is started, so acting now would be acting against the document rather than on it.

The one thing I checked, because it is the only item that could have touched this phase, is that none
of BLG-001..014 is a dependency of RS-290, UXI-301 or UXI-390 — the file explicitly lists the
capabilities already having new owners (Root Authority, Audit Ledger, Task Lifecycle, Fleet Routing,
Node Fabric, Capability Fabric, Engineering Foreman, Worker Gateway, Host Health, Restart Recovery,
Knowledge Core, Document Intake, Computer Use, Remote Fabric, General AI Gateway, Assistant/Handoff,
Theme Engine, Research core) as *not* being gaps, and none of the remaining fourteen is referenced by
the rescheduling or UI-integration workbooks.

## Third shared-harness fix: the evidence directory

Same defect class as the stale PID, found by reading the two pilots side by side rather than by
guessing: `device-task-pilot.mjs` writes `.runtime/evidence/v0.2/task-regression.json` **without
creating the directory**, while `device-recovery-pilot.mjs` already creates it. On a clean tree — the
normal state after a clone or in a fresh worktree, because `.runtime` is gitignored — the write is the
**last** thing the task pilot does, so an entire dual-device run is spent and then dies at the very
end. Reproduced before fixing:

```text
WITHOUT mkdir : THROWS ENOENT - no such file or directory, open '.runtime/evidence/v0.2/task-regression.json'
WITH mkdir    : wrote successfully
```

Now created up front, before the pipeline, so a missing directory fails immediately instead of
forfeiting a multi-minute run. **This removes the workaround you had to invent** — you created that
directory in your own pipeline, deliberately, rather than edit a harness RS-203 had closed. That
judgement was right, and the workaround is no longer needed.

Guarded statically, because it cannot be exercised without a device attached. My first draft of the
guard asserted the `mkdir` precedes the first `cmd('shell',...)` call and **failed**: the APK
integrity checks legitimately use that earlier. The corrected anchor is the first snapshot. Recording
the mistake because it is the third time this round that an assertion of mine was wrong about the
code it was checking.

## Where the two branches stand

```text
fix/device-pilot-route-from-source   2220975  route resolver (11 tests)
                                     73d7ce7  evidence directory (1 test)   <- new
fix/device-pilot-process-identity    0c6498f  stale-PID identity (15 tests)
```

Both cut from `44b52e2`, both shared-harness only, neither touching `rs/RS-290-*`. Merging is not mine
to do — RS-290 holds `merge_authority`, and none of this is RS-290 work.

## Still owed, and not claimed as done

The dual-device recovery E2E has **not** been re-run. No device is attached on this host. The recovery
path on the integrated tree therefore remains **owed**, exactly as I recorded last round: what I have
established is that the two mechanisms which stopped it are identified and fixed with tests, which is
a narrower claim than the gate requires.

## Next

Bounded re-scan. The unlocking event remains Alien recording `development_complete: true` on RS-290,
at which point Mech claims the Review, which section 3 requires to be a different host from Alien's
and which Alien has explicitly disqualified itself from.

语言配对 / Language pair: [原文 / Source](./DISPATCH_MECH_ROUND_EVIDENCE_DIR_AND_DEFERRED_DOC.md) · [译本 / Translation](./zh-CN/DISPATCH_MECH_ROUND_EVIDENCE_DIR_AND_DEFERRED_DOC.md)
