# REX-804 re-verification — Mech, on the repaired head

```text
REVIEWER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
DEVELOPER           Alien (physical host MERA-ALIANWARE)
ORIGINAL REVIEW     f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5  -> NOT PASSED, blocking finding B1
                    (an unreadable fault receipt prevented the City from starting)
RE-VERIFIED HEADS   f4ceae734d1d32a7d8950cd5872264135e6073ac   first repaired head (CI: push FAILED, PR FAILED)
                    075ddc13869664bfbf14fa07dae99ea76a6a4b3c   branch tip (CI: push SUCCESS, PR FAILED)
VERDICT             B1 CONFIRMED REPAIRED.  NEW BLOCKING FINDING B4: the branch is not mergeable into
                    current main, and the PR run's red is the proof rather than a flake.
TERMINAL MARKER     FAULT_INJECTION_RECOVERY_ACCEPTED — NOT RELEASED
MERGE AUTHORITY     none
```

## 1. What the author changed, and what the reviewer verified

```text
f76ccf53  original review target                       reviewed, NOT PASSED on B1
19a420c   the reviewer's published minimum repair       adopted by the author unchanged
f4ceae7   adoption + retained repair evidence           faults.mjs now byte-identical to repair/REX-804-mech-minimal
7af63c2   test active fault before expiry with a clock  test-only
075ddc13  keep fault activity assertions host-independent  test-only, branch tip
```

`git diff --stat origin/repair/REX-804-mech-minimal f4ceae73 -- services/dev-gateway/research/faults.mjs` is **empty**,
so the adopted repair is the reviewer's own file byte for byte. And
`git diff --stat f4ceae73 075ddc13 -- services apps contracts` is **empty**: the two commits after the adoption changed
**only tests and evidence logs**, not the product.

## 2. B1 is fixed, measured by the reviewer's own regression guard

The reviewer's nine probes — the same file that produced the original blocking finding — run against both repaired
heads:

```text
tests/rex804-mech-review-probes.test.mjs on f4ceae73    9 pass / 0 fail
tests/rex804-mech-review-probes.test.mjs on 075ddc13    9 pass / 0 fail
  P8 (B1 regression guard): an unreadable fault receipt is REPORTED and never prevents the City starting
  P9 (B3 regression guard): a shapeless receipt is reported as broken, not adopted without identity
```

P8 is the exact condition that blocked the first review, re-driven on the repair. **B1 is closed.**

## 3. The intermediate CI red at f4ceae73, classified

```text
push 37422814239  FAILED      <- the head the workbook recorded
PR   37422819110  FAILED
linkage 37422819095  success
failing test: "heartbeat loss refuses only targeted heartbeats, stop and expiry restore requests"
              AssertionError: Missing expected rejection   (145 ms - fast, so not a timeout)
```

The test started a fault and then immediately required the next call to be rejected. Whether that holds depends on the
fault being **active** at that instant, which depends on how fast the host scheduled the two calls. The author diagnosed
it the same way and fixed it in the two test-only commits, injecting a controlled clock
(`fixture({clock: () => time})`) so the test decides "active" and "expired" instead of the host:

```text
reviewer's classification evidence
  tests/rex804-faults.test.mjs on f4ceae73   8/8, five consecutive runs, this host
  tests/rex804-faults.test.mjs on 075ddc13   8/8, five consecutive runs, this host
  product diff between the two heads         EMPTY - only tests and evidence changed
```

So the red was a **measurement defect in the author's own test**, not a product regression and not a load flake: it is
deterministic given a slow enough host, and the fix removes the host from the decision. Recorded as such rather than
lumped in with the load-sensitive flakes this programme has also seen.

## 4. NEW BLOCKING FINDING B4 — the branch cannot be merged into current main

The PR run at the branch tip was **red while the push run at the same head was green**, which is not a flake here:

```text
push 37423677731  SUCCESS   the branch is tested against its OLD base
PR   37423681875  FAILURE   the PR is tested against the merge with the NEW main
failing: tests/rex801-store-guard.test.mjs
         "a file where research (the registry parent) belongs cannot stop the City"
         Error: ENOTDIR: not a directory, mkdir '<runtime>\research\faults'
```

Reproduced locally and deterministically (not inferred from the CI log):

```text
origin/main b06504f  (contains the adopted REX-801 store-guard probe)  MERGED WITH  rex tip 075ddc13
  tests/rex801-store-guard.test.mjs   1 pass / 1 FAIL, 34 201 ms   ENOTDIR mkdir '<runtime>\research\faults'
  the same probe on main alone        2 pass / 0 fail
```

Root cause, one line: `services/dev-gateway/research/faults.mjs:9` called `mkdirSync(dir,{recursive:true})` unguarded,
and the controller is constructed during City startup. One file where `<runtime>/research` belongs throws `ENOTDIR` out
of `createGateway` and **the City never starts**.

This is the fifth instance of the store-guard class in this programme — after the REX-801 experiment registry, the
capability-bridge theme artifacts, the WBC-604 execution profile and the REX-803 campaign runner — and the sharpest one,
because the read path in this very file had already been repaired for B1 while the `mkdir` on the same line was not.
The class survived the repair that was made in its name, one line away from the fix.

**Adoptable minimal repair, the family pattern (degrade, report a typed reason, keep serving):**

```text
repair/REX-804-mech-fault-store-guard-on-current-main @ adc075e
  = the merge result of current main with the branch tip, PLUS guarded construction in faults.mjs
  construction catches its own failure into storeState/storeReason instead of throwing
  the startup prune is skipped while the store is unusable; list() publishes storeState/storeReason
  measured after the repair, on the same merge result:
      tests/rex801-store-guard.test.mjs   2 pass / 0 fail, 91 ms   (was 1 pass / 1 fail, 34 201 ms)
      REX-804's own four suites           19 pass / 0 fail
  CI: V0.2 checks push run 37424594316 COMPLETED SUCCESS (attempt 1) on adc075e, jobs gateway-web and android
      both success - and `pnpm test` is the step that was red on the merge before this one-file change
```

The branch is deliberately built on the **merge result**, so its CI runs the whole merged suite including the probe that
was red; a repair tested only on the branch's old base would not have shown the problem in the first place.

## 5. Verdict

```text
B1   CLOSED      the reviewer's own regression guard passes on both repaired heads
B4   BLOCKING    merging the branch into current main turns main red; reproduced locally, deterministic
VERDICT          NOT PASSED on 075ddc13 for B4, with the minimal repair published for adoption
WHAT THE AUTHOR HAS TO DO  guard the construction of the fault controller's receipt store. That is the whole of it:
                 the adopter can take adc075e or make the one-file change themselves.
NOT DONE BY THE REVIEWER   no merge, no rewrite of the author's branch or its history, no edit of the author's records,
                 marker not released, review_complete stays false
```

`merge_authority` is false for this task and the reviewer holds none. The author's branch tip and the original reviewed
head are untouched; the repair is published beside them.
