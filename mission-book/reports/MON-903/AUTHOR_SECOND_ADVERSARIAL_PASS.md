# MON-903 — author's second adversarial pass (Mech, 2026-10-06)

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for MON-903
TARGET              the author's own development head 78bdd9dc873ebc257aedecf421068a1387dbec82 — UNCHANGED
BRANCH              repair/MON-903-mech-honest-metrics @ 6ecc6f3cd4b6d3dd1df32d0cba2c27e49098cdaa
                    (parent = 78bdd9d, two commits: probes alone, then the repair)
WHAT THIS IS        an AUTHOR SELF-TEST. It is not review evidence, it does not replace the opposite host's
                    verdict, and it releases no marker. The reviewer's claim at 78bdd9d is preserved exactly:
                    the workbook is untouched and the head did not move.
WHY IT EXISTS       the opposite-host review of the SIBLING task MON-902 reproduced seven defects in code by the
                    same author in the same programme. This programme has now recorded four times that a defect
                    found by review does not propagate to its siblings unless somebody deliberately looks. So
                    the classes were re-probed here on purpose.
```

## 1. The classes carried over, and what they found

The classes are the author's own summary of MON-902's review (`reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md`
section 5). Every probe below states what its failure would mean, and the red run was recorded **before** the fix:

```text
red run on 78bdd9d (probes only)     tests 6   pass 1   fail 5
```

| Class | Finding | Measured symptom on 78bdd9d |
|---|---|---|
| L1 truncated data presented as complete | **F-S1** the bounded failure log | 24 overlay failures recorded → `snapshot().failures.length` **16**, and the only failure-related key is `failures`: no dropped count anywhere. `metrics().resolverFailures` publishes the same silent 16. A quiet overlay and a broken one produce the SAME payload |
| L3 a number nothing measured | **F-S2** the queue-full rejection | a trigger refused at the per-task queue bound published `decisionLatencyMs: 0` (`escalationReason DECISION_QUEUE_FULL`) although `decide()` never ran. This is the same defect as MON-902's fabricated `worstSteps: 2`, in a different module, one round later |
| L1 | **F-S3** the metrics surface | 9 decisions with `retentionLimit: 5` → `metrics().decisions` **5**, and `metrics()` carried **no** `retainedLimit`, `retentionTruncated` or window note. `snapshot()` did disclose it (`retained=5 limit=5 truncated=true`), so the headline auto-resolution rate was the one surface describing a truncated sample as if it were the whole |
| L1 | **F-S4** the published window | `window {firstSeq:10, lastSeq:100}` derived from the two events that happened to be triggers, with nothing saying so and no canonical high-water mark: it reads like a continuous span of the canonical stream |
| L4 only well-formed input is ever fed | **F-S2's UI half** | the decision table rendered `decisionLatencyMs` unguarded, so the module-level fix alone would have shown an empty cell. Found only by rendering the real component with a reachable payload |

## 2. The repair, and why the commits are ordered the way they are

```text
COMMIT 1  test(mon903): the six probes, added BEFORE the fix        -> red run 1 pass / 5 fail, recorded
COMMIT 2  fix(mon903): report truncated and unmeasured data         -> green run 6 pass / 0 fail
```

The ordering is the point. This programme has already recorded a regression probe that **passed on the broken tree**
because it reproduced the symptom rather than the defect, and a sweep whose table claimed two more traps than it
planted. A probe that has never been seen to fail is not evidence, so the red run is part of the history instead of a
claim about it.

What the repair changes:

```text
services/dev-gateway/decision.mjs
  failuresDropped counts what the bounded log discarded; published by snapshot() and metrics()
  the queue-full receipt carries decisionLatencyMs: null + decisionLatencyReason, and no longer claims 0
  metrics() publishes retained / retainedLimit / retentionTruncated / windowNote, and latencySamples plus
  latencyNotObservable so the mean cannot hide how many decisions it excluded
  window states it spans TRIGGER events, counts observed and trigger events, and names the canonical
  high-water mark as NOT_OBSERVABLE with the reason rather than omitting the field
apps/web/monitor-decisions.js
  the latency and queue-wait cells render NOT_MEASURED when the value is not a finite number
  the panel raises the truncation note beside the rate, and the dropped count beside the failure list
apps/web/i18n/{en,zh-CN}.js
  one new key (dec.failuresDropped) in both packs; check-bilingual reports every pair SYNCHRONIZED
```

## 3. Measurement

```text
NEW PROBES       6/6 on the repair; the same 6 give 1 pass / 5 fail on 78bdd9d (recorded above)
MON-903 + MON-901 suites   24/24
web-i18n + decision panel   9/9
decisions browser suite     2/2
full suite       1371/1374   the 3 failures being this host's resident-City host reservation, which is a real
                             property of this host and not of the change
CI (exact head)  V0.2 checks push run 37416035100 COMPLETED SUCCESS (attempt 1) on 6ecc6f3, jobs gateway-web and
                 android both success; read per-run from the Actions API and matched on headSha
```

The full-suite figure is stated with the correction this host published earlier: two further failures it used to report
were its own missing `city` dependency install, not an environment condition, and both installs were run here as
`ci.yml` prescribes before measuring.

## 4. What the opposite host's review found that this pass did NOT

The reviewer published their own MON-903 review while this pass was running
(`reports/MON-903/INDEPENDENT_REVIEW_Alien.md`), and it is the honest counterweight to everything above. Their pass
reproduced **eight** red probes plus two more (a poll-starvation probe and a Gateway-level Action probe); this pass found
four. The two sets are almost disjoint, and the reason is a limitation of the method this document is advocating.

| Reviewer's finding | Did this class-driven pass look for it? |
|---|---|
| resolver Owner actions (`OWNER_REQUIRED` / `AWAIT_OWNER_*`) miscounted as auto-resolution — a **wrong rate**, not an undisclosed one | **no**. This pass probed whether the rate *disclosed* its window (F-S3) and never probed whether the rate was *correct*. The reviewer's finding is the more serious of the two, on the same surface |
| UUID-ordered prune deleted an arbitrary set of receipts instead of the oldest | **no**. `readdirSync(...).filter(...).sort()` sorts `decision-<random uuid>.json` by UUID, and the comment above it claimed "oldest first". A wrong deletion predicate is not a false-safe summary and not an unmeasured number, so no inherited class pointed at it |
| `observe` bypassed `close` | **no** — a lifecycle defect |
| queue-full lost canonical evidence and its persistence failure | **partly**: this pass found the same row publishing an unmeasured latency (F-S2), the reviewer found the evidence reference and `receiptFailure` missing from it |
| canonical online-ineligible target lost its state | **no** |
| critic success discarded earlier timeout metrics | **no** |
| polling closed opened provenance and retained recovered errors; unavailable store invisible; high-frequency renders starved the 2-second poll | **no** — all lifecycle/robustness classes |

The lesson belongs in the record because it cuts against the sweep method this session has leaned on repeatedly: **a
class-driven sweep finds the classes it was given and, structurally, only those.** Four passes now exist on this
programme's modules — original suites, author adversarial passes, the deliberate shape sweep, and opposite-host review —
and the shape sweep is the cheapest but the narrowest. It is a complement to review, never a substitute, and a host that
substitutes one for the other will keep reporting "found everything" while a reviewer finds ten more.

The reviewer also did something this pass did not: they refused to accept a green push as sufficient, found their own
review head's PR run failing on an inherited Services navigation defect, repaired that too, moved the head, and retained
the failed run. Their review is a heavier instrument than this sweep, and it should be.

## 5. Reconciliation with the reviewer's head, and the adoptable merge

The reviewer's head and this pass both edit the same two functions, so this branch was fused onto theirs and published as
a ready-to-adopt merge rather than as a second conflicting branch:

```text
adoptable   repair/MON-903-mech-honest-metrics-on-review-head @ 10a020c3a02fd3c4be7b85ba8208313af71dcc0d
            base = review/MON-903-Alien-20261006 @ 5b71389   (the reviewer's latest)
            brings = repair/MON-903-mech-honest-metrics @ 6ecc6f3   (this pass, four findings + six probes)
CI          V0.2 checks push run 37416962184 COMPLETED SUCCESS (attempt 1), jobs android and gateway-web both success
LOCAL       1386 tests, 1383 pass, 3 fail — all three this host's resident-City host reservation
```

Checked one by one before publishing the merge, so the claim "complementary" is a measurement and not a hope: on the
reviewer's head, `decisionLatencyMs` is still `0` on the rejected row, `noteFailure` still discards entries without
counting them, `metrics()` still carries no window disclosure, and `window` still reports only `firstSeq`/`lastSeq`. The
merge keeps both hosts' intent — the rejected receipt keeps the reviewer's canonical `evidenceRefs` and `receiptFailure`
**and** stops claiming a latency, and the reviewer's resolver-owner fix sits beside this pass's window disclosure.

The workbook, the head, the review claim and the marker are still untouched by the author: the reviewer's target does not
move under them, and adopting this branch is their decision.

## 6. Adoption verified by this host, not assumed

The reviewer adopted the findings by **merging this host's commits**, which makes the verification structural rather
than a diff review:

```text
reviewer's head   3cd32c60d8e9beb9df961e6b7ff193a3f69ec224  (review/MON-903-Alien-20261006)
its history       contains 10a020c (this host's merge), 6ecc6f3 (the repair) and aa371d6 (the probes)
field presence    failuresDropped, windowNote, TRIGGER_EVENTS, decisionLatencyReason, latencyNotObservable all present
rejected row      decisionLatencyMs: null + decisionLatencyReason, checked in the reviewer's own file
```

The reviewer also changed the root test script to `node --test --test-concurrency=2 tests/*.test.mjs`, claiming it
"bounds browser suite concurrency without dropping checks". That claim was verified rather than read, because a CI
change that silently skips tests is exactly the kind of defect nobody notices:

```text
this host's merge branch  1386 tests  1383 pass  3 fail
reviewer's head 3cd32c6   1386 tests  1383 pass  3 fail
```

Identical test count and identical failures, so the concurrency bound drops nothing, and the 3 failures are this
host's resident-City host reservation in both runs. The change is a good one for a different reason too: this host
already recorded a browser assertion that failed only under full-suite load and passed in isolation, and bounding
concurrency is a direct attack on that instrument class.

The reviewer's change was then accepted by them at that head, and this host records the outcome as fact:

```text
MON-903 workbook    status COMPLETE; review_complete true; review_status ACCEPTED
                    terminal marker MON903_DECISION_OVERLAY_REVIEW_ACCEPTED
                    capability registry FORMAL_REVIEW_RECONCILED
review head         3cd32c60d8e9beb9df961e6b7ff193a3f69ec224 — the head that contains this host's four findings
MON-990             unlocked by the acceptance and claimed by Alien, not by this host
```

The author still claims nothing here: the four findings are a contribution to a review the opposite host ran, owned and
concluded. What this host can say is narrow and measured — its commits are in the accepted head, and the fields are
present.

## 7. Pool state at the end of this round

```text
claimable development work for Mech                0
new programme surfaced this round                  deliberative-governance-expansion-migration (DGX-001..007, DGX-990)
DGX state                                          every workbook NOT_STARTED with execution_enabled: false
MON-990                                            unlocked by MON-903's acceptance, claimed by Alien on the
                                                   accepted exact dependency union
```

The DGX series is parked, not claimable: the programme board's activation rule requires the Owner to flip
`execution_enabled: false -> true`, and no host may claim a workbook the Owner has not enabled. Nothing in this round
was built on it, and this host has opened no DGX file.

## 8. What this pass does and does not change

```text
CHANGES        nothing about MON-903's status, head, workbook, review claim or marker. The branch is published for
               adoption, exactly like the store-guard repairs, because moving the head under a claimed review would
               invalidate the reviewer's claim.
DOES NOT       count as review evidence, does not pre-empt or answer the opposite host's verdict, and does not claim
               the reviewer's own pass found any of these.
DEPENDS ON     nothing in the reviewer's branch; the four findings were measured on 78bdd9d from this host alone.
```

The observation worth keeping: two of the four findings (F-S1, F-S2) are the **identical class** to defects MON-902's
review had just found in a sibling module — a bounded sample described as complete, and a number nothing measured —
and neither would have been found by running MON-903's own suite, which passed 24/24 before and after. Per-module
review found one of the family; per-*class* probing keeps finding the rest.
