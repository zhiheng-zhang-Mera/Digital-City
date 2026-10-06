# MESH-301 — DEVELOPMENT REPORT

```text
workbook      mission-book/mesh-3end/MESH-301-三端实机互联与相互指挥.md
task          three real endpoints on one canonical City, mutually commandable
development   Alien host (development host, per Owner ruling 2026-10-03)
review        Mech host (endpoint A + formal reviewer; a DIFFERENT physical machine)
utopia        zhiheng-zhang-Mera/utopia, branch mesh/MESH-301-three-end
baseline      ec12fd0831f31fd81aef9cd9dfb0c959d010f63b  (main)
status        development COMPLETE except gate 8's final row; see §6
```

Detailed reasoning for every decision is in the sibling records in this directory. This report is the index
and the summary, not a second copy of them.

## 1. What was built

```text
services/dev-gateway/targeting.mjs        NEW  strict target-device rules; pure and unit-tested
services/dev-gateway/server.mjs           MOD  one task-creation path, the claim guard, the no-reroute
                                               guards, control-surface identity on the stream handshake
services/dev-gateway/actions.mjs          MOD  the user-level path; the target travels in `input`
apps/web/app.js, apps/web/index.html      MOD  the surface declares itself; a target selector beside Run
apps/android/.../CityClient.kt            MOD  self-declaration, createTargetedTask, dropSocket, gap
                                               self-declaration, generation-bound resync
apps/android/.../PairingApi.kt            MOD  the surface-observation receipt
apps/android/.../MainActivity.kt          MOD  the RUN ON row, built from the City's own node list
scripts/mesh301-mesh-probe.mjs            NEW  canonical-seq convergence and negative-control instrument
scripts/mesh301-web-surface.mjs           NEW  drives the browser surface and records what IT observed
tests/mesh301-strict-target.test.mjs      NEW  7 tests for the strict-target contract
evidence/raw/mission-book/MESH-301/alien-side/**   the gate-8 receipts and merge results
```

**Nothing frozen was reopened.** The low-level `POST /api/v0/tasks` still accepts only `type` — its contract
guarantee was preserved, and targeting reaches the City through the Action facade instead. RS presentation
`ALLOWED_ACTIONS` was not extended. `providerRef` and `handoffTargetRef` were not reused: a third field,
`targetDeviceRef`, exists precisely because a user target must never be releasable, while
`handoffTargetRef` is a reservation the City releases by design after 15 s.

## 2. Steps 1–7

```text
Step 1  claim-time reconciliation ....... done; baseline, hosted CI and dependencies recorded in the
                                          workbook's own claim fields
Step 2  three surfaces, one City ........ Alien Web, Mech-Win-Web and the Android client (PERM00) each
                                          declare themselves on the stream handshake and appear in
                                          GET /api/v0/city as controlSurfaces; two real worker nodes
                                          (Alien-Win, Mech-Win) are the only entries in `nodes`
Step 3  strict target-device routing .... done; the five required properties each have a named enforcing
                                          rule and a test (see RECORD_STEP3_STRICT_TARGET_INTENT.md)
Step 4  Android -> Alien / Mech ......... done end to end: Q-fa5c5669 (Alien-Win, seq 157-163),
                                          Q-cfc3912a (Mech-Win, seq 164-170)
Step 5  PC -> PC and convergence ........ both directions done: Alien Web -> Mech-Win (seq 267-273) and
                                          Mech-Win-Web -> Alien-Win x2 (traced by connection-then-task
                                          timing, 448 ms and 472 ms). Convergence instrument built and
                                          run over two declared windows
Step 6  dual-host acceptance ............ negative controls 8/8 on the live City from this side; Mech
                                          reports 11/11 of its own. Formal Review NOT STARTED
Step 7  merge and terminal state ........ NOT STARTED
```

## 3. The strict target contract, stated as the workbook states it

| requirement | enforced by |
| --- | --- |
| `target=Alien` → only Alien may claim | `claimAllowedByTarget` in the `/node/claim` guard |
| `target=Mech` → only Mech may claim | same rule, symmetric; proven by a healthy Alien node being refused |
| offline/unknown → no silent fallback | `UNKNOWN` refused at creation (`TARGET_DEVICE_UNKNOWN`); `OFFLINE`/`INELIGIBLE` created and **waiting**; the handoff sweep and the switch-decline path both refuse to move a targeted run |
| duplicate action → no double execution | the Action facade's `idempotencyKey` + request fingerprint, which already hashes `input`; one key cannot be made to mean two devices |
| untargeted task → unchanged | `claimAllowedByTarget` returns `true` when the field is absent; measured with the suite and with the full history of untargeted tasks in the City |

## 4. Evidence, and where the reviewer should look

```text
strict target, unit + gateway    tests/mesh301-strict-target.test.mjs           7/7
full root suite                  node --test "tests/*.test.mjs"                1041/1043
                                 (2 failures are PRE-EXISTING and unrelated: capability-adapters and
                                  city-roads document-reader CORRUPT_INPUT fixtures; reproduced on the
                                  untouched baseline with this work stashed)
negative controls, live City     scripts/mesh301-mesh-probe.mjs negative -> negatives.json   8/8
convergence, window 1            four observers on three machines, 1434 CONVERGED,
                                 verdict FAILED on exactly one silent miss (seq 505)
convergence, window 2            three observers, MISSING x0, verdict INCOMPLETE
branch CI                        run 37092665142 SUCCESS (and per-push runs green)
```

## 5. The defects this work found in its own instruments

This is the part a reviewer should read most carefully, because every one was found by **running** the
instrument rather than reading it, and several were of the "looks like evidence, is not" kind:

```text
1  merge read `at` for the server timestamp; the store's field is `timestamp` -> all latencies vs null
2  merge reported CONVERGED on an EMPTY timeline ("no surface breached the window" is vacuously true)
3  the desktop probe appended across runs, so one receipt held two sessions' boundaries interleaved
4  the probe reported its own start and stop as convergence failures
5  --skew defaulted to 0, so a table built WITHOUT declaring an offset still printed CONVERGED while a
   clock offset sat in the latency column (found by MECH, and the dangerous one)
6  --skew could not be combined with positional receipt filenames - the flag's value was read as a file
   (also found by Mech); my own first repair of it started at index 2 on an already-sliced argv
7  the Android surface recorded no `stale` because the drop path nulled the socket BEFORE cancel(), so
   the callback that would have logged the drop was discarded -> the surface could be SILENTLY STALE
8  a static clock skew drifts (592 ms -> 586 ms between runs), so a declared skew expires
```

Defects 7 and 8 are the substantive ones. 7 was a product defect and is fixed at a single surrender point
(`dropSocket`). 8 means every table must declare a skew **measured in the same run as the receipts it
judges**, which the gate-8 tables do.

## 6. Known limits, stated rather than rounded off

1. **Gate 8 is not claimed.** Window 1 produced the complete four-observer table and returned `FAILED` on one
   seq out of 1434 — `seq 505`, silently missed by the browser surface. That defect is fixed and the fix is
   verified by re-running window 2 (`MISSING x1` became `GAP_DECLARED x1`, verdict `FAILED` → `INCOMPLETE`).
   The remaining item is **Mech's row for window 2**, which Mech has been observing since 04:00:24Z but has
   not yet published; `mech-web-gate8-window.jsonl` covers window 1 only.
2. **An open policy question, and it is the Owner's to read.** Events emitted between the network dying and the
   client's `close` firing are lost before any staleness signal exists. They are now *declared* by the surface
   (a `gap` record) but they are still lost while the surface nominally believed it was online. Reading A:
   acceptable, because the workbook allows an offline surface to miss events and requires only that it show
   stale and re-converge — which it now provably does. Reading B: not acceptable, and the honest repair is a
   server-side liveness signal so the boundary is the City's to draw rather than the client's. I did not choose
   between them mid-run.
3. **The pre-existing suite failures** (2) are outside this task's allowed boundary and are untouched.
4. **`GET /api/v0/health` reports `degraded`** because the Room Hub is not running on loopback. That is a
   truthful component state, not a MESH-301 failure; the City's own routes are `READY`.

## 7. What the reviewer is asked to do

Per the workbook, the review must not be a signature on a report. It must rebuild the scenario with its own
instruments, prove from global events (not screenshots) that the Android-issued commands really changed
backend state, give a counter-example check for real-time consistency, include at least one
stale/duplicate/unauthorised-target negative control, verify exact-head CI and evidence openability, and
verify the post-completion re-entry actually happened. Mech has already begun this: it reports 11/11
independent negative controls, an independent Mech→Alien strict-target pair, and two defects found in the
shared merge. **Gate 10 is not satisfied by any of that yet — it is satisfied by a PASS on a frozen review
head.**


[阅读译本 / Reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
