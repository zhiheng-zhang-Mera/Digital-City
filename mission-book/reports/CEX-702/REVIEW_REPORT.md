# CEX-702 — REVIEW REPORT (opposite physical host)

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex (MERA-ALIANWARE)
REVIEWED HEAD       3d233ff39d1e96b8a590b12f520f98c283356f25
BRANCH              cex/CEX-702-Alien-codex-alternate-device (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
DEPENDENCY          UXI-391 COMPLETE / review_host Mech / review_complete true; declared ancestor
                    ec12fd0831f31fd81aef9cd9dfb0c959d010f63b verified reachable from the head
REVIEW BRANCH       review/CEX-702-mech-review
EXACT-HEAD CI       V0.2 checks push run 37213802935 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR19 pull run 37213840569 completed/success on the same head
                    City linkage check run 37213840571 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1, F5 LOW · F2, F3, F4 INFORMATIONAL
TERMINAL MARKER     ALTERNATE_DEVICE_USER_CHOICE_EXPOSED released
```

## 1. How this review was performed (and how it was NOT)

Sixteen changed paths, 279 insertions, 21 deletions. The backend change is `schedulerChoicesFor` plus a real
behaviour change to `candidateFromNode` and a rewritten `/switch-declined` route; the substance beyond that is the
Web and Android surfaces. Nothing below is taken from the development report, the PR body, a comment or an author
test title.

```text
author suite, unmodified   tests/cex702-choice-ui.test.mjs -> 4 tests / 4 pass / 0 fail
reviewer probes, new       tests/cex702-mech-review-probes.test.mjs -> 10 tests / 10 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 15 suites / 82 tests / 0 failures / 0 errors
                                                     (SchedulerChoiceTest 2/2, host MEGA-REP)
```

**Two probes drive a real browser** and one of them captures the exact request body the page sends, so "the user can
issue this decision from the normal UI" is measured rather than inferred.

**No pre-existing test file is touched** — the only test path in the diff is the new `cex702-choice-ui.test.mjs`. That
was measured (`git diff --name-status`), not assumed, so there is no relaxed assertion here needing compensation.

Probe drafts that failed on **my own** wrong assumptions are recorded in comments rather than quietly fixed, because a
draft that fails for the wrong reason looks exactly like a product defect:

```text
asserting the unwired CONFIRM control AFTER the decision closed   it had correctly disappeared; the assertion now
                                                                  runs while a choice is still open
comparing paused-vs-enabled claim on a task already RUNNING on a  neither could claim it, so the comparison proved
different node                                                      nothing; a fresh QUEUED task is used instead
```

## 2. What the workbook's Formal Review section demands, and what decided each

| Requirement | Probe | Result |
|---|---|---|
| choose provider | PROBE 1 | the DTO's own provider index resolves to a real candidate ref; the choice is executable, `chosenProviderRef` is recorded, the task re-queues unassigned, and the decision then CLOSES on the surface |
| decline switch → alternate device | PROBE 2 | `switchDeclined`, the accepted revision, `handoffTargetRef` and exactly one `TASK_SWITCH_DECLINED` are recorded, and the handoff is consumed |
| strict target refusal | PROBE 3 | reason `TARGET_DEVICE_BOUND`, button withheld, the route answers 409 by name and **nothing is mutated and no event is emitted** |
| no alternate available | PROBE 4 | reason `ALTERNATE_NOT_AVAILABLE`, 409 by name, no mutation |
| stale / offline candidate | PROBE 5 | a wrong revision → 409 `CHOICE_STALE`; an alternate that went offline, or paused sharing, after the surface was rendered → 409 `ALTERNATE_NOT_AVAILABLE`. All three refuse against **current** City truth, not against what the client last saw |
| duplicate click | PROBE 6 | the same decision with the same revision replays as 200 with **one** event and **one** handoff; `decision:"CONFIRM"` → 400 `CHOICE_INVALID`; a decision without a usable revision → 400 `CHOICE_INVALID` |
| handoff result returns to the original surface | PROBE 7 | node b claims the **same** task, executes it, and the result lands on the original task; one task, not two; the original surface still reads task and result |
| Web / Android state agreement | PROBE 8 + inspection | the browser sends exactly `{decision:'ALTERNATE_DEVICE', expectedUpdatedAt:<the server's revision>}` — the revision is the server's, so neither client re-derives routing; Android parses the same `userChoices` object from the same feed and computes nothing locally |

The four user semantics the workbook lists are all present and distinct: use another provider (pre-existing choose
control), keep this service and use another device (new `ALTERNATE_DEVICE` button), keep waiting (local
acknowledgement) and cancel (pre-existing supported action). PROBE 9 pins the one that could have been faked:
**"keep waiting" writes nothing** — no `switchDeclined`, no event, and the page issues no non-GET request at all, so it
cannot be mistaken for a decline. PROBE 8 pins the other: the generic CONFIRM control is still rendered disabled and
has no route behind it.

### 2.1 The presentation contract versus the executable route — the workbook's mandatory paper point

The workbook asks for the difference between the presentation contract and the executable route to be recorded. This
commit **closes** the one that mattered. `candidateFromNode` now reads the canonical per-node sharing flag
(`node?.sharingEnabled === false ? 'DISABLED' : …`) instead of always defaulting to `ENABLED`, and PROBE 10 measures
both directions against a real gateway:

```text
paused device (sharingEnabled:false)   presentation: not offered, reason ALTERNATE_NOT_AVAILABLE
                                        executable: claim returns NO task for a healthy QUEUED task
re-enabled                              presentation: offered again
                                        executable: claim hands over the very task that was just created
```

Before this change the surface could show a paused device as SELECTABLE while `server.mjs` already refused it work —
the exact presentational/executable divergence the workbook names. It is now aligned in both directions, not merely
both-negative.

## 3. Findings

### F1 — LOW (paper material): the mandatory handoff latency was left NOT_OBSERVABLE and is supplied by this review

The workbook lists **handoff latency** among its mandatory paper points. The development receipt records it as
unknown:

```text
evidence/raw/mission-book/CEX-702/development-receipt.json
  metrics.click_to_handoff_ms  null
  metrics.click_to_result_ms   null
  metrics.unknown_reason       NOT_OBSERVABLE
```

The author's own index is explicit that `waitedMs:500` is synthetic task output and that "the reviewer must
independently reproduce, not trust undocumented timing" — so this is not a truthfulness defect. But the quantity was
measurable in the author's own controlled browser fixture: their test 1 performs a real click, a real handoff and a
real worker execution. The mandatory measurement is therefore satisfied by the reviewer rather than by development.
**Measured here, on the opposite physical host** (PROBE 11, one physical Windows host, controlled fixture):

```text
switch-decline HTTP round trip      12 ms
click -> handoff accepted           13 ms
click -> final result              598 ms
canonical decline -> handoff event   4 ms   (delta between the two event timestamps the City itself stamped)
scope: ONE_PHYSICAL_WINDOWS_HOST_CONTROLLED_FIXTURE_NOT_A_PERFORMANCE_CLAIM
```

The canonical 4 ms figure is the one worth carrying forward: it is derived only from timestamps the City wrote, so it
does not depend on this reviewer's client. **Minimum repair boundary:** record the two receipt metrics from the
author's existing fixture, or state in the receipt that latency is delegated to the review — declaring them unknown
while an instrument that could measure them already exists is the gap.

### F2 — INFORMATIONAL: a comment that now argues against the line beneath it

`services/dev-gateway/presentation.mjs` carries a long UXI-391 comment justifying the old default, and its premise is
no longer true. It states that "this City keeps no per-node user-disable state at all - `server.mjs` writes node
records with id/displayName/metadata/telemetry/capabilities/online/lastHeartbeatAt and nothing else", and concludes
that the line "must READ the field rather than keep a default" only "should it gain that ability". The line directly
under it now reads `sharingEnabled`, and `server.mjs` has written that field and enforced it on the claim path
(`n.sharingEnabled!==false`) for some time. The code is right; the argument above it is obsolete and states something
false about canonical truth, in a file whose whole subject is presentation honesty.

### F3 — INFORMATIONAL: the two surfaces fall back differently for an unresolved service

The Web falls back to the candidate ref itself (`candidateLabels[p.index] ?? ref ?? ''`); Android falls back to the
literal English word `Service` (`SchedulerPanel.kt`: `candidateLabels.getOrNull(candidateRefs.indexOf(provider.ref))
?: "Service"`). An unresolved ref therefore renders as a device named "Service" on Android and as its identifier on
the Web. The DTO does carry `ref` and the live payload resolves, so this is unreachable today — recorded because the
workbook's whole subject is that the two surfaces agree about what the user is being offered.

### F4 — INFORMATIONAL: the Android in-flight guard can latch

`SchedulerPanel.kt` sets `busy[taskId] = true` on click and clears it only inside the callback, behind
`fence.accepts(ticket)`. `CityClient.deliver` drops the callback when the client is closed, so a `switch-declined`
in flight when the client goes away can leave the control permanently disabled for that task. The same shape as the
sticky-loading item recorded in the CEX-701 review. **Not reproduced**: the Compose surface was not rendered here, so
this is a reading of the control flow and is recorded as such.

### F5 — LOW (control plane): sixteen template fields were absent, including every exposure and capability field

Relative to `MISSION_TEMPLATE.md`, CEX-702's frontmatter omitted `user_exposure_class`, `user_exposure_surface`,
`user_exposure_nesting`, `backend_wiring`, `ui_exemption_reason`, all four `capability_*` fields, all three
research-grade fields, and the monitor and decision evidence fields. As in CEX-701 this is not a declaration of
`NOT_APPLICABLE`: `CAP-SCHEDULER-CHOICE-001` already exists, names CEX-702 as its source workbook, and states the
exposure class, both surfaces and both nestings — so the facts existed in the registry while the workbook that owns
them declared nothing, and `PAPER_MATERIAL_INDEX.md` cites watchlist categories the workbook never named.

**Reconciled by this review** (§4), transcribing the exposure values from the author's own registry record. One
deliberate omission: the author's index names its watchlist categories in prose ("G2 ordinary bugfix/lifecycle
guards; G3 identity provenance, independent-review boundary and registry onboarding; G4 capability-state/reality-drift")
and no `RS-` identifier appears anywhere in the reports or the receipt. Five of those map unambiguously to watchlist
ids and were recorded; the G2 "ordinary bugfix" entry does not map to a single id, so **the reviewer left it out
rather than invent one**, and says so here. `highest_research_grade_observed` and `research_capture_level` follow from
the two G4 categories the author names explicitly.

## 4. Completion gates, independently checked

| # | Gate (workbook §完成门槛) | Verdict | Basis |
|---|---|---|---|
| 1 | alternate-device decision can be issued from the normal UI | PASS | PROBE 8: real browser, exact request body captured |
| 2 | backend canonical truth records the decision | PASS | PROBE 2/6: `switchDeclined`, accepted revision, `handoffTargetRef`, one event, one handoff |
| 3 | Web + Android both see the subsequent handoff | PASS (scope stated) | PROBE 7/8 on Web (label change and real result return); Android reads the same feed and does not re-derive routing, 82/82 unit tests first-hand — but the Compose surface was not rendered, and the author's own receipt records `online_click: NOT_RUN` |
| 4 | generic CONFIRM is not mis-wired | PASS | PROBE 8: still rendered disabled, no route behind it; PROBE 9: keep-waiting writes nothing |
| 5 | opposite-host Review + exact-head CI | PASS | this report; runs 37213802935 / 37213840569 / 37213840571 all success on the reviewed head |
| 6 | PAPER_MATERIAL_INDEX | PASS (F1 recorded) | present, with the functional chain and the synthetic-result caveat; the mandatory latency is supplied by §3 F1 |
| 7 | terminal marker | RELEASED | `ALTERNATE_DEVICE_USER_CHOICE_EXPOSED` |

Registry reconciliation performed by this review:

```text
capability-registry/records/CAP-SCHEDULER-CHOICE-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      the pending-Formal-Review entry replaced by the PASSED record
  evidence                        reviewer probes + this report added as review refs
workbook CEX-702
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict
```

## 5. What this review does NOT claim

* **No Android rendering.** The Android surface was read, its parser exercised by the project's own 82-test unit suite
  run first-hand, and the feed it consumes confirmed against a real gateway. The Compose UI was not rendered on a
  device or emulator here; `online_click` and `physical_devices_campaign` remain `NOT_RUN` exactly as the author's
  receipt states.
* **No performance claim.** The latencies in §3 F1 are one controlled fixture on one physical Windows host, are
  labelled as such, and say nothing about a distributed or loaded system. The `waitedMs:500` in PROBE 7 is synthetic
  task output, as the author already states.
* **No intent validation.** That a real user's need was met in production is not established by this review; the
  capability's `intent_validation_status` remains `NOT_TESTED`.
* F1 is not repaired in the reviewed artifact — the review supplies the missing measurement instead, and says so. F2,
  F3 and F4 are recorded with minimum repair boundaries and left to the programme. F5 is reconciled in the control
  plane by this review and stated as such.
* This verdict covers only `3d233ff39d1e96b8a590b12f520f98c283356f25`. A later head needs its own review, and
  `review/CEX-702-mech-review` is review evidence, not a merge candidate.
