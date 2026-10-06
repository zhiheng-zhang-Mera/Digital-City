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

---

# Second re-verification — PASSED on `fe700aba957990f93b22fd63d594ddfff7b4e243`

```text
RE-REVIEWED HEAD    fe700aba957990f93b22fd63d594ddfff7b4e243   (branch rex/REX-804-Alien-codex-faults, PR #30)
ANCESTRY            the original reviewed head f76ccf53 AND current main b06504f are both ancestors (exit 0 each)
AUTHOR REPAIR       reports/REX-804/AUTHOR_REPAIR_Alien.md - the author independently reproduced B4 before fixing it
VERDICT             B1 CLOSED, B4 CLOSED, no blocking finding remains. PASSED.
TERMINAL MARKER     FAULT_INJECTION_RECOVERY_ACCEPTED — RELEASED on this head
MERGE AUTHORITY     none; this host did not and does not merge
```

## B4 is closed, measured on the head that contains current main

The finding was that the branch could not be merged into current main, because the fault controller's unguarded
`mkdirSync` replayed the store-guard defect and main already carried a probe that caught it. The head now has a
latest-main integration as an ancestor, so the reviewer re-ran that exact probe **inside the head**:

```text
tests/rex801-store-guard.test.mjs on fe700ab (contains current main)   2 pass / 0 fail, 97 ms and 51 ms
the same probe on the merge before the repair                          1 pass / 1 FAIL, 34 201 ms, ENOTDIR
the same probe on main alone                                           2 pass / 0 fail
CI on fe700ab, read one run at a time and matched on headSha:
    push          37424946247  COMPLETED SUCCESS attempt 1   (android, gateway-web)
    pull_request  37424951038  COMPLETED SUCCESS attempt 1   (android, gateway-web)
    linkage       37424951044  COMPLETED SUCCESS attempt 1   (reciprocal-contract)
```

The **pull_request** run is the one that was red at `075ddc1`, because a PR run tests the merge with current main. It
is now green at the same step, so the branch is mergeable in the only sense the reviewer can measure.

The repair matches the family pattern rather than only silencing the symptom: `faults.mjs` construction catches its
own failure into `storeState`/`storeReason`, `list()` discloses them, and a fault injection attempt against an
unusable store is refused with a typed **503 `FAULT_STORE_UNAVAILABLE`** while normal tasks keep working. The Web
Danger Zone shows the reason and disables injection. That is degrade-report-keep-serving, not a swallowed error.

## Everything else the reviewer had recorded, re-measured on this head

```text
B1  an unreadable fault receipt prevented City startup      CLOSED (probe P8, and P1-P9 all pass)
B3  a shapeless receipt adopted without identity            CLOSED (probe P9)
F2  registry vocabulary and the missing receipt route        repaired by the author; the routes answer
nine reviewer probes                                        9 pass / 0 fail
REX-804's own four suites                                   12 pass / 0 fail
full suite                                                  1379/1382, the 3 being this host's resident-City
                                                            host reservation
```

## The reviewer's own instrument defect, found and fixed in this round

The first full-suite run on this head failed **the reviewer's own probe**, not the product:

```text
"REX804 review P6 ... AssertionError: DELAY_RESULT recorded that it was exercised (got 0)"
the same file in isolation: 9 pass / 0 fail
```

P6 started each fault class with `durationMs: 150` and slept 350 ms, so the exercise had to land inside 150 ms of host
time; under full-suite load it did not. The window was never a product property - it was the instrument's assumption
about the host. That is the **same defect class** this reviewer classified in the author's unit fixture during the
first re-verification, now found in its own probe, and found the same way: a green isolated run disagreeing with a
loaded one.

Fixed on the review branch (`review/REX-804-mech-review @ 53d01a3`): the window is 1200 ms, and the delayed report's
promise is kept and awaited after the sleep instead of being fired and forgotten. After the fix:

```text
isolation, three consecutive runs                      9 pass / 0 fail each
beside three heavy browser suites (concurrent load)    13 pass / 0 fail
full suite on fe700ab                                  1379/1382, P6 green
```

Both states are recorded rather than the red one being amended away. Across this review pair the count of
timing-assumption defects is now two - one in the author's fixture, one in the reviewer's - which is the useful
observation: **in this codebase a fault-injection test that does not inject a clock is testing the host.**

## What remains unmeasured, and is not counted as a defect

```text
Android native fault controls                 NOT_RUN; the author's capability record keeps PARTIAL for them and
                                              this reviewer did not exercise a device
physical/external-provider recovery           NOT_RUN; PROVIDER_UNAVAILABLE is injected at the claim seam, not at a
                                              real external provider, and neither host claims otherwise
DUPLICATE_EVENT recovery metric               structurally NOT_MEASURED, with the reason on the receipt; the
                                              reviewer's P6 asserts the null AND the reason rather than accepting a 0
```

These are stated as scope, not as passes. The marker released here is `FAULT_INJECTION_RECOVERY_ACCEPTED` for the
fault-injection and recovery surface that was measured, and it does not assert anything about a physical Android fault
surface or a real external provider.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/REVERIFICATION_REPORT.md)
