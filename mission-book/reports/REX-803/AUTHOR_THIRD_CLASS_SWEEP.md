# REX-803 — author's third-class sweep (Mech, 2026-10-06)

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for REX-803
TARGET              the recorded review target a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df — UNCHANGED
                    (branch rex/REX-803-mech-scenario-runner and PR #31 still point at it)
BRANCH              repair/REX-803-mech-receipt-order-and-close @ 07e8c3cf31e9aefdb4d12c58e129da39935c8314
                    two commits: the probes alone, then the repair
WHAT THIS IS        an AUTHOR SELF-TEST. Not review evidence, not a verdict, no marker. The head did not move,
                    so a reviewer claiming at the recorded target cannot be overtaken.
WHY IT EXISTS       the opposite host's MON-903 review found EIGHT failures that this author's own class-driven
                    pass on that module had not looked for at all, because they were state-machine and lifecycle
                    defects. That was recorded as the structural limit of a class-driven sweep. This pass takes the
                    REVIEWER's classes and points them at the largest module this author still owns.
```

## 1. The classes, and the three findings

```text
red run on a695bb9 (probes only)      tests 4   pass 1   fail 3
```

| Class | Finding | Measured symptom on a695bb9 |
|---|---|---|
| **L6** a bounded collection ordered by a key that is not its age | **F-S6** the campaign receipt list | `receipts()` did `readdirSync(...).filter(...).sort().slice(-receiptLimit)`. A receipt file is `campaign-<random uuid>.json`, so sorting names sorts random identifiers. With six campaigns whose identifier order is the reverse of their age order, the bounded list returned **the three OLDEST** while the comment above the function said *"Finished campaigns, newest by name order"* |
| **L1b** a truncated list returned without saying how much was truncated | **F-S7** the same list | seven campaigns on disk, three returned, and **no surface anywhere** stated the size of the history — the same defect as MON-903's bounded failure log and its truncated metrics window |
| **L7** a closed/shutdown boundary an entry point ignores | **F-S8** `start()` after `close()` | `close()` fired the cleanups and drained the loop; `start()` then accepted and **launched** a new campaign (`{state: 'RUNNING', campaignId: 'campaign-d361…'}`) into a process that was already shutting down |

F-S6 is the same defect the opposite host found in MON-903's receipt prune (`readdirSync(...).sort()` over UUID
filenames), in a different module, written by the same author, found only because the class was deliberately carried
over. F-S8 is the same lifecycle hole the reviewer found when `observe()` ignored the overlay's close flag.

The CI on this branch failed once before it passed, and the failed attempt is kept rather than overwritten: a
31.2-second browser timeout in `tests/cex701-recovery-ui.test.mjs`, a file this change does not touch, classified in §4
by measuring the same head locally and by rerunning the identical job. Where a programme records a green run and hides
a red one, it has thrown away the only evidence that says how reliable its instrument is.

## 2. The fixture that had to be fixed before the probe meant anything

The first version of the L6 probe **passed on the defective code**. It used sequential identifiers
(`campaign-…-000000000000` … `-000000000005`), whose name order happens to equal their age order, so sorting the file
names produced the right answer by luck. The committed fixture uses identifiers whose lexicographic order is the
**reverse** of their age, which is what a real UUID gives you, and only then did the red run appear:

```text
actual:   [ campaign-dddddddd-…, campaign-eeeeeeee-…, campaign-ffffffff-… ]   <- the three OLDEST
expected: [ campaign-aaaaaaaa-…, campaign-bbbbbbbb-…, campaign-cccccccc-… ]   <- the three NEWEST
```

This is the fourth instrument error recorded on this programme and the second of exactly this kind: a probe whose
fixture can accidentally agree with the implementation tests nothing. It is the same failure as the sweep whose table
claimed eight traps while planting six, and as the regression probe that planted its fault after construction and so
passed on the broken tree.

## 3. The repair

```text
services/dev-gateway/scenario-runner.mjs
  receipts() orders by the record's OWN age (finishedAt, then startedAt, then the file's mtime for an unreadable
  receipt) and sorts NEWEST FIRST before applying the bound
  receiptWindow() returns {receipts, total, limit, truncated}
  close() sets a closed flag; start() refuses with a typed RUNNER_CLOSED (409); closed() reports it
services/dev-gateway/server.mjs
  the campaign list route publishes receiptWindow beside the existing receipts array, which is kept for callers
  that only want the rows
tests/rex803-third-class-sweep.test.mjs   (NEW, 4 probes)
```

The probe commit precedes the fix so the red run is part of the history rather than a claim about it.

## 4. Measurement

```text
NEW PROBES                 4/4 on the repair; the same 4 give 1 pass / 3 fail on a695bb9 (recorded in §1)
REX-803's own four suites  22/22
FULL SUITE                 1370/1374
  3 failures   host-city-launcher — the resident City on this machine holds the host reservation (a genuine
               host condition, not the change)
  1 failure    tests/relay-s1-tunnel.test.mjs "S1: a pipe that never stops is rate-limited" at 3081 ms
               CLASSIFIED as the known load-sensitive burst flake, not the change: the file passes 12/12 in
               isolation on this very head, and the repair touches the scenario runner and one server route line
               that the relay suite never exercises. Rerun-to-classify, recorded rather than averaged away
CI (exact head)  V0.2 checks push run 37418750045 on 07e8c3c, read per run from the Actions API and matched on
                  headSha. ATTEMPT 1 FAILED (gateway-web) and ATTEMPT 2 SUCCEEDED, and both are recorded because
                  the failed attempt is part of the evidence:
                    attempt 1  gateway-web FAILURE — tests/cex701-recovery-ui.test.mjs "CEX701 session sees only
                               own installation and actionable owner guidance" at 31 222 ms; android success
                    attempt 2  gateway-web success, android success
                  CLASSIFICATION: a load-sensitive browser timeout, not the change. Evidence, gathered before the
                  rerun rather than after: the same test PASSED on this exact head inside the author's own full
                  suite at 6 459 ms, and PASSES in isolation on this exact head in 1 368 ms (the whole file 3/3);
                  the 31.2 s runtime is ~23x the isolated figure and sits just past Playwright's 30 s default; the
                  change touches services/dev-gateway/scenario-runner.mjs and one added field on the campaigns list
                  route, neither of which CEX701 exercises; and the rerun of the identical head and job succeeded.
                  This is the same instrument class this host has now recorded three times (the MON-903 push run's
                  31.3 s BLE bootstrap, a web-services assertion that failed only under full-suite load, and this).
```

The full-suite figure is measured with both installs run as `ci.yml` prescribes (root plus the separate `city`
install), the correction this host published after finding that two long-reported "environment failures" were its own
missing dependency install.

### The remedy for that instrument class already exists and this host has verified it

The opposite host changed the root test script on their MON-903 branch to
`node --test --test-concurrency=2 tests/*.test.mjs`, and claimed it bounds browser-suite concurrency without dropping
checks. This host verified the claim rather than reading it: the same head yields **1386 tests / 1383 pass** with the
bound and **1386 tests / 1383 pass** without it, so nothing is skipped, and the failing test above is exactly the class
the bound is aimed at. That change is on `review/MON-903-Alien-20261006` and is not in `main`; when it lands, this
module's CI should be re-measured and this failure class will most likely stop appearing. Recorded here because the
third instance of an instrument flake is the point at which it stops being bad luck and starts being a missing
mitigation.

## 5. What this pass deliberately does not do

```text
DOES NOT   move REX-803's head, workbook, review target, claim or marker
DOES NOT   count as review evidence, answer a verdict, or claim the reviewer would find these
DOES NOT   touch main
LEAVES     the adoption decision to whoever reviews REX-803 — the branch is published beside the recorded target
```

The reason for keeping the target stable instead of hardening the head is specific to this task: REX-803 has already
suffered one claim collision in this programme, and its handoff names `a695bb9` as the head to review. Moving it now
would put a reviewer who claims the recorded target in exactly the position the collision record describes. The author
will harden the head on request, or the reviewer may adopt this branch into their own review head — both are one
command from here.

## 6. Honest limits of this pass

- Three findings is not a clean bill of health. The reviewer of this module has not run yet, and on MON-903 the
  reviewer found eight failures against this author's four.
- The sweep covered the runner's receipt handling, its bounded list and its close boundary. It did **not** re-derive
  the campaign-with-real-tasks paths, the seed/replay guarantees, or the physical-topology gate — those are covered by
  the existing suites and by the recorded physical campaign, not by this pass.
- F-S6's consequence is a misleading list, not data loss: this module never deletes a receipt. Stated because the
  reviewer's MON-903 version of the same class *did* delete.
