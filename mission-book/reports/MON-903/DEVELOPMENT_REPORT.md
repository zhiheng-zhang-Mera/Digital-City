# MON-903 development report — Mech

```text
WORKBOOK            mission-book/city-work-monitor-dashboard/MON-903-event-triggered-decision-overlay.md
DEVELOPMENT HOST    Mech (COMPUTERNAME MEGA-REP), role Mech-DS
BRANCH              mon/MON-903-mech-decision-overlay
BASELINE (claim)    213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
                    DEPENDENCY_SHA_UNION_AT_CLAIM resolved literally: the accepted MON-901 head
                    7eb38f1b930dfe6cc13dab0e17dedee467b1254b is an ancestor of main, so the union IS main
DEPENDENCY SMOKE    node --test tests/mon901-observation.test.mjs -> 8 pass / 0 fail, before any product change
DEV HEAD            78bdd9dc873ebc257aedecf421068a1387dbec82
                    (head moved once after the first green CI: this task's own adversarial pass found D-7/M-1 and D-8/M-2
                     and both are repaired on this head)
CI (exact head)     V0.2 checks pull_request 37406286660 SUCCESS, City linkage 37406286695 SUCCESS, and push 37406282033
                    SUCCESS on RERUN after failing once on a load-sensitive browser timeout (D-9). All three read from
                    the Actions API and matched on headSha. Local full suite at this head: 1368 tests, 1363 pass; the 5
                    failures were first recorded as "inherited environment" and are CORRECTED here - 3 are this host's
                    resident-City host reservation (a genuine host condition) and 2 (capability-adapters, city-roads,
                    CORRUPT_INPUT) were this host's missing `city` install, not an environment property. See the
                    correction section of reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md.
PR                  zhiheng-zhang-Mera/utopia#32
REVIEW HOST         Alien — OUTSTANDING, not performed by this host
TERMINAL MARKER     none declared by this workbook; the workbook's completion gate is a nine-item list
MERGE AUTHORITY     false
```

## 1. What was built

```text
services/dev-gateway/decision.mjs        the event-triggered decision overlay (rules, ladder, per-task queues, receipts)
services/dev-gateway/server.mjs          the overlay is created before the projection, notified from the canonical event
                                         path in one line, and exposed through three routes
services/dev-gateway/observation.mjs     the MON-901 projection's `decision` placeholder is filled from an injected,
                                         read-only decision snapshot (the sidecar still decides nothing)
apps/web/monitor-decisions.js            the Decision provenance page
docs/CITY_WORK_MONITOR_DECISIONS.md      bilingual summary of what it does and what it refuses to do
tests/mon903-decision.test.mjs           8 overlay probes
tests/mon903-decision-route.test.mjs     5 real-gateway probes
tests/mon903-decisions-web.test.mjs      2 browser probes
```

```text
GET  /api/v0/monitor/decisions          bounded decision window + metrics + the vocabularies
GET  /api/v0/monitor/decisions/<id>     one receipt
POST /api/v0/monitor/decisions          submit a trigger for a kind no canonical event expresses (owner only)
```

## 2. Decisions taken, with the reasoning (owner rule: record every unspecified choice)

| # | Question | Decision | Why |
|---|---|---|---|
| D1 | Which events are triggers? | Only the seven canonical event types in `TRIGGER_SOURCES`; everything else is recorded and ignored | The programme's rule is "event-triggered, not report-triggered"; heartbeats, progress, completions and resource samples must not become approvals |
| D2 | `BLOCKED` has no canonical state | `TASK_TARGET_WAITING` IS the canonical expression of blocked, and the rule separates "target away" from "target present yet still waiting" | The vocabulary has no `BLOCKED` task state; inventing one would be a second task truth |
| D3 | Kinds with no canonical source (review readiness, retry request, scope change, merge gate) | SUBMITTED explicitly by the owner through the route, recorded with `origin: 'SUBMITTED'` | They are real trigger kinds; pretending they are observable would be a lie, and refusing them would drop four of the eight the workbook names |
| D4 | What may a resolver return? | A closed action vocabulary, an optional confidence in `0..1`, and a reason ≤120 characters; anything else is an invalid output | "Fast model 只输出 bounded decision contract，不以自由长文作为执行授权" — enforced in code, not in prose |
| D5 | When is a model consulted? | Only when no rule applies. A failure with a recorded cause is rule-resolved; a failure whose cause the canonical record does NOT state is unresolved, and the ladder asks the model | Without this distinction every trigger was rule-resolvable and the model stage was unreachable dead code — the first version had exactly that defect |
| D6 | Owner boundary | Scope change, merge gate, review readiness and owner-decision candidates escalate to the owner with NO resolver consulted | An owner matter is not an inference problem, and the workbook forbids widening owner authority through "auto-approval" |
| D7 | Does a decision act? | Never. The overlay receives a task READER and no writer; every receipt carries `appliedBy: null` and `application: RECORDED_ONLY` | "本任务不得借自动审批扩大权限"; a receipt that could be read as a performed action would be the false-affordance defect this programme keeps finding |
| D8 | Queueing | Per-task queues, depth-bounded at 16, parallel across tasks; `observe()` is never awaited on the canonical path | The programme forbids a city-wide barrier; the metric is reported as `ABSENT_BY_CONSTRUCTION` with its basis, never as a fabricated 0 |
| D9 | Confidence | A rule reports `confidence: null` with a reason | A deterministic rule is not a probability; writing a number would be inventing a measurement |
| D10 | Read vs ask | Members may READ the decision log; only the owner may ASK for a decision | Seeing what the City decided is a shared-team fact; putting words in the City's mouth is a governance act |
| D11 | Surface placement | A dedicated Advanced page now, with the projection already carrying the decisions | MON-902 owns the City monitor page and is developed separately; folding the panel in later is a presentation change, not a data change |

## 3. Defects found during development, and how each was caught

```text
D-1  RULE-LEVEL ESCALATIONS WERE RECORDED AS ORDINARY RESOLUTIONS. The non-boundary rule branch hardcoded
     `escalated: false` and dropped the rule's `escalationReason`, so REPEATED_FAILURE, RETRY_BUDGET_EXHAUSTED and
     TARGET_PRESENT_BUT_INELIGIBLE all arrived as `ownerRequired: false` with no reason - the opposite of what the rule
     layer had just decided. CAUGHT BY this task's own probe. REPAIRED: the branch honours the rule's escalation and
     records its reason.
D-2  THE MODEL STAGE WAS UNREACHABLE. Every trigger kind was resolvable by a rule, so the ladder's model and critic
     stages could never run - a seam that existed only in the comment. CAUGHT BY the probe that tried to exercise a
     resolver. REPAIRED: an ATTRIBUTABLE failure is rule-resolved while an UNEXPLAINED one (no cause in the canonical
     record) is genuinely uncertain and reaches the model, which is what "uncertain" was supposed to mean.
D-3  PROTOCOL COLLISION ON `schemaVersion`. The decision window carries its own `schemaVersion: 1`; spreading it flat
     into the response body overwrote the wire envelope's `schemaVersion: 0`, so every client rejected a 200 as a
     protocol mismatch - the browser probe saw "Decision records are unavailable" while the network log showed 200.
     CAUGHT BY the browser probe. REPAIRED: the window is nested (`body.window`), and the route test asserts both
     schema versions explicitly.
D-4  MEASUREMENT DEFECT (this task's own harness). The unit helper removed the receipt directory while a saturated
     per-task queue was still draining, and the suite reported ENOTEMPTY. The product was right; the harness raced it.
     REPAIRED: cleanup retries, the queue probe drains before teardown, and the drain result is asserted.
D-5  INSTRUMENT NOTE. `relay-s1-tunnel.test.mjs` failed once inside the full-suite run ("a sustained burst is refused
     with 429") and passes 12/12 in isolation; the same load-sensitive flake is recorded by the REX-804 author. It did
     not recur in the final full-suite run.
D-6  A BROKEN RECEIPT IS REPORTED, NOT FATAL - deliberately carried over from the REX-804 finding: this module reads
     its own receipts with a guard, publishes `broken`, and keeps serving. The probe asserts it, so the defect the
     opposite-host review found in a sibling module cannot reappear here.
D-7  AN UNUSABLE RECEIPT STORE PREVENTED THE CITY FROM STARTING (finding M-1). `createDecisionOverlay` called mkdirSync
     unguarded, so a single file sitting where `<runtime>/monitor/decisions` was supposed to be made `createGateway`
     throw with EEXIST and the City never bound its port. This is the SAME class as the REX-804 review's blocking
     finding B1 - a research-side storage problem turning into a City that will not boot - and this task's own
     adversarial pass found it in its own code one round after reviewing a sibling for it.
     CAUGHT BY  an adversarial self-test written for this round (a file at the store path), then pinned at the City
     level: the gateway must start and `/api/v0/monitor/decisions` must report `persistence: UNAVAILABLE` with a reason.
     REPAIRED: the store is created defensively; when it is unusable the overlay records decisions IN MEMORY, marks each
     one with `receiptFailure: DECISION_STORE_UNAVAILABLE`, serves them by id from the window, and reports the degraded
     state in `snapshot()` and `metrics()`. Two regression probes cover it (overlay level and City level).
D-8  A CLOSED OVERLAY BLAMED THE CALLER'S TRIGGER (finding M-2). Submitting after `close()` raised
     `DECISION_TRIGGER_INVALID`, which says the trigger was malformed when in fact the overlay was shutting down.
     CAUGHT BY  the same adversarial pass. REPAIRED: a distinct `DECISION_OVERLAY_CLOSED` with status 409, and a probe
     that asserts the code.
D-9  A LOAD-SENSITIVE BROWSER TEST FAILED THE PUSH CI ONCE (environment flake, not a product defect). On the hardened
     head the push run failed on `tests/pairing-search-web.test.mjs` -> "BLE_BOOTSTRAP search selects a peer and hands
     the code to its origin without a cross-origin POST" after 31.3s (its LAN sibling in the same file took 1.8s) while
     the PR run of the SAME head passed.
     EVIDENCE THAT IT IS THE ENVIRONMENT, not the change: the identical file passes 6/6 in isolation locally; the full
     local suite at that head is 1368 tests / 1363 pass, the failures being the host-reservation ones plus (as later
     corrected) two of this host's own missing-dependency failures rather than the "five inherited environment
     failures" first written here; the file is untouched by this task's diff (services/dev-gateway/decision.mjs and
     tests/mon903-decision.test.mjs only); and the rerun of the very job that failed COMPLETED SUCCESS on the identical
     head.
     RECORDED rather than cleaned away, and the workbook's CI field says so explicitly.
```

## 3A. Adversarial self-test of this task's own deliverable (2026-10-06, before review)

Because the opposite-host review is still outstanding, this host ran its own adversarial pass over the parts of MON-903 a
reviewer would attack first. Five probes were run; three properties held and two were defects, both now repaired:

```text
HELD   a throwing canonical task reader is recorded as typed failures (DECISION_OBSERVE_FAILED, DECISION_RUN_FAILED,
       DECISION_UNHANDLED_REJECTION) and produces NO fabricated decision
HELD   retention bounds the receipt DIRECTORY as well as the window (6 decisions, limit 3 -> 3 files, truncated flag)
HELD   receipts survive a restart with identity intact, and remain readable by id
DEFECT M-1 (D-7) an unusable receipt store prevented City startup           -> repaired, two regression probes
DEFECT M-2 (D-8) a closed overlay reported the caller's trigger as invalid   -> repaired, one regression probe
```

The pass is recorded because a self-test is not a review: it raises the floor for the reviewer and it is exactly how the
REX-804 defect class was found in this module rather than by the opposite host.

## 4. Test evidence on the exact head

```text
node --test tests/mon903-decision.test.mjs          8 pass / 0 fail
node --test tests/mon903-decision-route.test.mjs    5 pass / 0 fail
node --test tests/mon903-decisions-web.test.mjs     2 pass / 0 fail
node --test tests/mon901-observation.test.mjs       8 pass / 0 fail   (dependency, unchanged)
npm test (whole tests/ glob)                     1365 tests: 1360 pass / 5 fail
```

The five failures are the same inherited-environment failures reported for REX-803, each classified:

```text
capability-adapters.test.mjs  CORRUPT_INPUT in a document reader  -> reproduced identically at the baseline 213f9f9f
city-roads.test.mjs           CORRUPT_INPUT in a document reader  -> reproduced identically at the baseline 213f9f9f
host-city-launcher.test.mjs   x3 "requires a free coordination port" -> the resident City holds the host reservation
CLASSIFICATION  ENVIRONMENT / PRE-EXISTING  (not product defects, not measurement defects of this task)
```

## 5. Completion gate, item by item

```text
event-triggered rather than report-triggered   MET   seven canonical sources; a probe asserts heartbeat/progress/
                                                     completion/resource/connect produce ZERO decisions
per-task queue                                 MET   keyed by task, depth-bounded, asserted
rule-first                                     MET   asserted by counting resolver invocations (0 for a rule case)
bounded decision receipt                       MET   the workbook's field list is asserted field by field
timeout/fallback                               MET   hanging, throwing, free-text and invalid resolvers each become a
                                                     typed fallback that escalates
user-visible provenance                        MET   the Decision provenance page; a browser probe opens it and reads
                                                     the pre/post state, the evidence pointer and "Applied by: nobody"
no-global-barrier evidence                     MET   structural (no lock anywhere) + a probe showing two tasks decided
                                                     in parallel + a real-gateway probe where an unrelated task
                                                     completes while another task's decision is being made
exact-head tests/CI                            MET  15 local probes green and hosted V0.2 checks 37401385199
                                                     COMPLETED SUCCESS on the exact head 1d1593df9f3370711
                                                     df7fbb735fb2ccb393e7494, re-read from the Actions API
opposite-host review                           PENDING  review_host must be Alien; not performed by this host
PAPER_MATERIAL_INDEX                           MET   mission-book/reports/MON-903/PAPER_MATERIAL_INDEX.md
```

## 6. Open items handed to the reviewer

```text
O1  Opposite-host Formal Review outstanding. Points worth attacking: the trigger classification (is anything missing
    or wrongly included?), the "no barrier" claim, whether a decision can ever mutate state through any path, the
    receipt contract, and whether the metrics could flatter the reader.
O2  No resolver is configured in this City, so every uncertain case reaches the owner with RESOLVER_NOT_CONFIGURED.
    That is the honest production behaviour; a reviewer with a fixture resolver should confirm the bounded contract.
O3  `wrong auto-decision and repair` and `confidence versus final review outcome` are reported as unsupported: both
    need an independent judge, which this overlay cannot be.
O4  RESOLVED before hand-off: hosted CI is terminal SUCCESS on the exact head (run 37401385199), and the PR is #32.
F1  FINDING (recorded, not repaired): the canonical vocabulary has no BLOCKED task state and no review/merge event, so
    three of the eight trigger kinds (BLOCKED, READY_FOR_REVIEW, MERGE_READY) are expressed indirectly or must be
    submitted. A reviewer should decide whether that belongs in this workbook or in a later one.
F2  FINDING: the overlay's per-task queue is bounded at 16 and a full queue escalates immediately. The bound is a
    choice, not a measurement; no production queue depth has been observed yet.
F3  FINDING for MON-990: the decision window is surfaced on its own page today because the City monitor page belongs to
    MON-902, which is developed but not yet merged. Integration is a presentation change only.
MERGE AUTHORITY  false — this host does not merge MON-903.
```
