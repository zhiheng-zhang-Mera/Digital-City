# MON-990 opposite-host Formal Review — Mech

```text
REVIEWER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
DEVELOPER           Alien (physical host MERA-ALIANWARE) — the workbook records development_host=Alien
REVIEWED HEAD       fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40   (branch mon/MON-990-Alien-20261006, PR #36)
REVIEW BRANCH       review/MON-990-Mech-20261006 @ 7fffe3f
CLAIM               mission-book/reports/MON-990/REVIEW_CLAIM_Mech.md (published before any verdict)
VERDICT             PASS on the eleven mandatory checks this reviewer manufactured; NO DEFECT FOUND
TERMINAL MARKER     CITY_WORK_MONITOR_V1_ACCEPTED — NOT RELEASED: check 9's Android half is NOT_RUN here
MERGE AUTHORITY     none
```

## 1. Claim-time measurement

The claim record carries the measurements taken before any verdict: `review_host` was null, the remote tip of
`mon/MON-990-Alien-20261006` equalled the recorded development head, the two accepted dependency heads (MON-902
`f4988248`, MON-903 `3cd32c60`) and `main` `213f9f9f` were all reachable from it by `git merge-base --is-ancestor`, and
the exact-head runs were re-read one at a time from the Actions API and matched on `headSha`:

```text
push          37420061997  COMPLETED SUCCESS attempt 1
pull_request  37420065177  COMPLETED SUCCESS attempt 1
linkage       37420065178  COMPLETED SUCCESS attempt 1
```

The reviewer is Mech and the author is Alien, on different physical machines, so §3 is satisfied and this is not a
self-review.

## 2. The reviewer's instruments, and what they measured

Eleven probes, invented for this review and published on `review/MON-990-Mech-20261006`. **All eleven pass on the
reviewed head.** Nothing below is the author's suite re-run: R3/R4/R7/R8/R10 drive the projection contract with inputs
the author's fixtures do not use, R1/R2/R5/R6/R9/R11 drive real routes and a real browser, and R11 injects a resolver
that never answers — because a fixture that cannot hang cannot test a timeout.

| # | Workbook check | Reviewer's probe | Result |
|---|---|---|---|
| 1 | overview state ↔ canonical task state | R4/R6 build a real canonical FAILED task and read it back through the graph and the browser | PASS |
| 2 | node owner/host/model metadata ↔ runtime truth | R7: a host with no model/owner metadata must not have it invented | PASS |
| 3 | edge reason ↔ real handoff/retry/review/routing event | R8: a reasonless edge says MISSING, is marked incomplete, and carries no invented evidence | PASS |
| 4 | decision receipt ↔ actual state transition | R9: the receipt's pre/post state equals what the canonical store actually held | PASS |
| 5 | risk bubbling must not hide an active failure | R4: 200 tasks, one FAILED, collapsed to 24 — the risk-carrying node stays visible, `activeRiskPresent` is true, `falseSafeSummary` false | PASS |
| 6 | unrelated tasks continue while JEV/monitor is unavailable | R2: a throwing observer gives a typed 500 on the graph, while task creation still returns 200 and the decision window still answers with `cityId` | PASS |
| 7 | a decision timeout affects only its target task | R11: a resolver that never answers times out, is attributed `RESOLVER_TIMEOUT`, escalates instead of inventing, and the unrelated task is resolved by its own rule | PASS |
| 8 | Capability Registry ↔ runtime/UI | section 4 below | PASS |
| 9 | Web + the current Android surface parity | Web half verified (R1, R6); **Android half NOT_RUN** — section 5 | NOT_RUN |
| 10 | large-graph collapse/filter/stable layout | R10: two projections of the same structure share a reflow key; a filter changes drawn edges and not visible nodes; R4 covers collapse | PASS |
| 11 | normal diagnosis reaches exact evidence in 2–3 interactions | R6: the Web walk is **counted**, not read — Monitor → risk node → evidence button = 3, and the evidence panel carries the canonical record including the probe's own failure code | PASS |
| 12 | no second task truth | R5: a receipt is `appliedBy: null`, `RECORDED_ONLY`, and the canonical task is byte-for-byte where it was | PASS |

The reviewer also attacked the property this programme has found false four times — a surface that can look safe while
it is missing information — and found it held here: R1 (unusable decision store is stated, not shown as a calm empty
window), R3 (absent coverage metadata raises `WINDOW_INCOMPLETE` and reports `unobserved.tasks === null`, never 0), R4
and R7/R8.

## 3. What the reviewer could NOT reproduce about the author's numbers

```text
author's claim      "Local full suite 1425 PASS / 0 FAIL / 0 SKIP"
reviewer's measure  tests 1425   pass 1422   fail 3
```

The **test count is reproduced exactly** (1425). The author's zero failures are not reproducible on this host, and the
three differences are a measured host condition rather than a disagreement: `tests/host-city-launcher.test.mjs` run
alone on this head gives 1 pass / 3 fail with `Error: Requires a free local host reservation`, and a resident City is
running on this machine holding that reservation. The same three failures have appeared identically at every head this
reviewer has measured in this session. This is an environment difference, not a defect, and it is recorded rather than
averaged away.

The author's physical Android/Web capture, the 2/3-tap and 3-click interaction counts **on the handset**, the
source-equivalence blob list and the APK SHA256 are the author's evidence. This reviewer reproduced the Web interaction
count independently (R6) and did not reproduce the handset measurements (section 5).

## 4. Registry reconciliation

```text
CAP-MON-001  GET /api/v0/monitor                       route exists; exposure BACKGROUND_DISCLOSED with
                                                       user_reachability_status PARTIAL, which is honest -
                                                       the raw observation view is deliberately not a surface
CAP-MON-002  GET /api/v0/monitor/graph?edges=&collapse= route exists and accepts both parameters, range-checked
                                                       (collapse 1..4096, a bad value is a typed 400)
CAP-MON-003  GET /api/v0/monitor/decisions              all three operations exist and answer: the list returns
             GET /api/v0/monitor/decisions/:id         200 with cityId, the single-receipt route answers a typed
             POST /api/v0/monitor/decisions            404 DECISION_NOT_FOUND for an unknown id, and the POST
                                                       refuses a City session on the owner-guarded path
all three    last_verified_full_sha fb042d9b…          equals the reviewed head
```

Every declared route was also driven with a live request rather than inferred from source. That mattered: the
reviewer's first, grep-based route inventory reported `GET /api/v0/monitor/decisions/:id` as **missing**, because the
route is declared as a regex (`/^\/api\/v0\/monitor\/decisions\/[^/]+$/`) and a `path===` scan cannot see it. The live
request contradicted the scan, so the scan was wrong and the registry was right. Recorded because this is the fifth
time in this programme that an instrument's *method* produced a confident wrong answer.

## 5. Check 9 — what is NOT_RUN, and the measured reason

The workbook requires "Web + 当前 Android surface 的合理 parity". The reviewer verified the Web half and could not
verify the Android half on this host. Two measured reasons, in that order:

```text
no device      C:\Users\15601\AppData\Local\Android\Sdk\platform-tools\adb.exe devices  ->  empty list
               (the handset that serves this City as a control surface is not attached over adb here)
no toolchain   gradlew :app:testDebugUnitTest with the only installed JDK (26) fails with
               "FAILURE: Build failed with an exception. * What went wrong: 26"
               i.e. the Android Gradle Plugin rejects Java 26; only JDK 26 is installed on this host
```

**Supporting evidence, explicitly not a substitute.** A structural audit shows the two surfaces consume the same
canonical contract: the Android client calls `monitor/graph?collapse=24[&edges=…]` and `monitor/decisions?limit=50` —
the same two routes the Web surface uses — and renders the same `riskReasons[].{code,level,evidenceRef}` projection
fields; `MonitorProjection.kt:40` even carries the Android-side form of the invariant R4 verifies on the server ("a
delivered node set cannot contain an ACTIVE/WATCH risk whose node is not present"). That is a source-level parity
argument. The check asks for observed parity, so the check stays **NOT_RUN** and is not upgraded by this paragraph.

## 6. The reviewer's own instrument defect, recorded rather than re-pushed away

The first version of the probe branch failed CI, and the failure is kept in the record because a reviewer who
overwrites a red run has stopped being evidence about anything but themselves:

```text
review branch, first head 7fffe3f   push 37422163771  FAILED (gateway-web)
  "MON990 review R1 ... AssertionError: the decision store is unusable and the surface says only:
   DECISIONS THE CITY RECORDED ..."
review branch, fixed head 14b2c7b    push 37422910108  SUCCESS attempt 1, jobs android and gateway-web both success
```

The cause was the reviewer's wait, not the product: `#monitor-decisions` exists as soon as the page mounts, carrying
`data-loaded="false"`, so on this host the projection had already arrived when the assertion read the panel and in CI it
had not. The probe now waits for `#monitor-decisions[data-loaded="true"]` — the state marker the product publishes
precisely so a reader, and a test, can tell the shell from the projection. R1's assertion is unchanged; only the wait
was wrong; 11/11 in three consecutive local runs afterwards.

This is the sixth instrument error recorded on this programme and the **third of exactly this shape** — MON-902's own
browser probe had it, this review branch had it, and both were exposed the same way: CI disagreeing with a local pass.
The pattern is now stable enough to state as a rule for this codebase: *a browser probe must wait for the product's own
state marker, never for an element that exists in more than one state.*

## 7. Verdict

```text
DEFECTS FOUND          none, across eleven independently manufactured checks
REPRODUCED             the author's exact-head CI (three runs, per-run read) and the author's test COUNT (1425)
NOT REPRODUCED         the author's zero-failure run (3 host-reservation failures here) and every handset measurement
MARKER                 CITY_WORK_MONITOR_V1_ACCEPTED is NOT released. The workbook permits it only when runtime/UI
                       reconciliation is satisfied, and one of its twelve mandatory checks is unverified by the
                       reviewer. Releasing it would mean accepting the author's physical capture as review evidence,
                       which this reviewer's own claim record says it will not do.
REVIEW STATE           review_complete stays false for the same reason. This is not a rejection: the review found no
                       defect and the author has nothing to repair.
REMEDY                 attach an Android device over adb on the review host (or install JDK 17/21 so the Android unit
                       tests can run), then re-run check 9; or the Owner may rule that the author's physical capture
                       is acceptable evidence for this one check, which is an Owner decision and not a reviewer one.
```

No merge was performed, no main was touched, and the author's branch and PR #36 are retained exactly as they are.

语言配对 / Language pair: [English](./REVIEW_REPORT.md) · [中文](./zh-CN/REVIEW_REPORT.md)
