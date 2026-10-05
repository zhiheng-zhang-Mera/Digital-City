# CEX-703 — REVIEW REPORT (opposite physical host)

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       478d486096512eea3266350efe070323a232a120
BRANCH              cex/CEX-703-Alien-codex-capability-catalog (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
DEPENDENCY          ASK_TARGETS_CONTRACT_PRESENT — the declared ancestor
                    69a097b5394a9fece39dd11cc13f04c9b4d28bfe is reachable from the head AND the ask/targets
                    contract exists at that ancestor in the gateway, the Web terminal and the Android client
REVIEW BRANCH       review/CEX-703-mech-review @ 006ec9f (probes)
EXACT-HEAD CI       V0.2 checks push run 37222683667 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR15 pull run 37222688854 completed/success on the same head
                    City linkage check run 37222688771 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1 MEDIUM · F2 LOW · F3, F4 INFORMATIONAL
TERMINAL MARKER     CAPABILITY_CATALOG_DISCOVERABLE released
```

## 1. How this review was performed (and how it was NOT)

The smallest surface reviewed in this programme so far: eleven paths, 118 insertions, 23 deletions, and **no backend
change at all** — the task exposes an existing route (`GET /api/v0/ask/targets`) that already answered. That makes the
interesting question narrow and testable: is the catalog really the backend's list, and does the surface tell the truth
about what each target will do?

```text
author suite, unmodified   tests/cex703-catalog-ui.test.mjs -> 3 tests / 3 pass / 0 fail
reviewer probes, new       tests/cex703-mech-review-probes.test.mjs -> 7 tests / 7 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 14 suites / 80 tests / 0 failures / 0 errors
```

Six of the seven probes drive a **real browser** against a real gateway. No pre-existing test file is touched — the
only test path in the diff is the new file — so there is no relaxed assertion needing compensation (measured with
`git diff --name-status`, not assumed).

## 2. The six checks the workbook names, and what decided each

| # | Requirement | Probe | Result |
|---|---|---|---|
| 1 | a fresh user reaches the catalog in 1–2 steps | PROBE 1+6 | **exactly 2 interactions** after connecting, with **zero** Ask submissions — the user never has to fail an Ask first |
| 2 | catalog count/identity aligns with `/ask/targets` | PROBE 1 | 16 rendered cards against 16 backend targets, each card's target equal to the backend's, **in order, in both directions** |
| 3 | target unavailable truth | PROBE 3 | every unavailable target is rendered, `disabled`, and carries the backend's own `unavailableReason`; force-clicking one changes nothing |
| 4 | catalog selection and manual Ask do not diverge | PROBE 4 | choosing a card executes nothing, prepares the input, and the submission carries a canonical `selection` naming the chosen target — the same channel a typed Ask uses |
| 5 | Web / Android agreement | PROBE 7 + inspection | both consume the same `ask/targets` payload; **but the availability chip disagrees** (F1) |
| 6 | a new backend target appears with no front-end list edit | PROBE 2 | with the response replaced by a synthetic target that exists in no front-end source, the catalog renders **exactly that one row** — so there is no second handwritten list to drift |

The workbook's rules, each with where it was decided:

```text
catalog from the backend contract, no second copy   PROBE 2: an injected target appears and nothing else does
unavailable shown but not actionable, with a reason PROBE 3
mutating / side-effect keeps confirmation           PROBE 8: a City task target creates nothing when chosen and nothing
                                                    before the existing confirmation step; the confirm step is reached
search/favourites/command palette out of scope      nothing of the kind is present in the diff
```

## 3. Findings

### F1 — MEDIUM: the Android availability chip calls a locally mutating target "SAFE"

`AskPanel.kt` renders `StatusChip(if(!candidate.available) "UNAVAILABLE" else if(candidate.sideEffect) "SIDE EFFECT" else
"SAFE")`. The chip therefore reads **two** fields and ignores `mutating` entirely — and the next lines of the *same
card* render the warning "会写入本地产品数据。" for exactly the targets the chip has just called SAFE.

The contract makes that combination real, measured on the live route:

```text
checklist   checklist.add-item      mutating=true  sideEffect=false  available=false (room hub ECONNREFUSED)
bookmarks   bookmarks.add-bookmark  mutating=true  sideEffect=false  available=false (room hub ECONNREFUSED)
knowledge   knowledge.add-entry     mutating=true  sideEffect=false  available=false (room hub ECONNREFUSED)
```

Their `available=false` is **not a property of the target**: the reason is "room hub is not reachable on loopback
(ECONNREFUSED)", i.e. a transient probe result in the reviewer's fixture. And the author's own receipt shows the other
configuration, because it records `unavailableCount: 5` out of 16 — a number that is only consistent with the five
CITY_TASK rows being unavailable and the ROOM rows being **available**. In that configuration these three targets are
`available && mutating && !sideEffect`, and the chip renders **SAFE** for a target that writes local product data.

The Web does not do this: its `targetCard` renders separate `mutating` and `side-effect` flags and never claims SAFE.
So the two surfaces disagree about risk on the same target.

**Severity, argued.** The direction is unsafe — the chip understates risk rather than overstating it — and it is a
user-facing safety claim on a control surface, which is MEDIUM. It is not higher because no authority is lost: the
mutating target still goes through the existing confirmation, and the contradiction is visible three lines below in the
same card.

**Minimum repair boundary:** derive the chip from the same fields the card already warns about, e.g.
`!available → UNAVAILABLE`, else `sideEffect → SIDE EFFECT`, else `mutating → LOCAL CHANGE`, else `SAFE`; or render the
Web's flag set instead of a single chip. Confined to `TargetChoice`.

### F2 — LOW: the Web shows an empty catalog as a bare heading, while Android explains it

With a valid `{targets: []}` response the Web renders the catalog section and its title and **nothing else** — no empty
state, no reason, no "the Gateway provided no targets". Android, for the same payload, renders
`UtEmptyState("Gateway 没有提供目标")`. A user who opens the catalog on a City that exposes nothing sees a heading with
an empty body and cannot tell an empty catalog from a rendering failure. The workbook requires the two surfaces to
agree, and requires an unavailable or absent capability to explain itself. **Minimum repair:** render the empty state
the Android surface already has.

### F3 — INFORMATIONAL: the mandatory "before" step count is declared NOT_OBSERVABLE although the baseline shows it

The workbook asks for "修复前'必须先 Ask 失败'的步数". The receipt records
`userSteps.before: "Ask submission and unmatched result required; exact historical count NOT_OBSERVABLE"`. The exact
*number* is genuinely not measurable now — but the *sequence* is reconstructible from the baseline commit this review
was anchored to, and it is what the number was meant to express:

```text
baseline apps/web/terminal.js:359   targets are fetched only when an Ask returns UNMATCHED
baseline apps/web/terminal.js:175   the unmatched branch is the only place the list lives
baseline apps/android/.../AskPanel.kt:123-125   the unmatched branch, plus a "显示全部目标" button
```

So before this change the Web user had to submit an Ask and be told it was unmatched before any target list existed,
and the Android user had to do that **and** click again. The workbook does not define what counts as a step, which is
probably why no number was given; recorded so the next reader has the sequence, with the counts stated as derived from
the baseline source rather than as measured.

### F4 — INFORMATIONAL: the recorded unavailable count is environment-bound, and that is what makes F1 reachable

The receipt records `backendSnapshot.unavailableCount: 5`. In this review's fixture the same commit reports **10 of 16
unavailable**, because five ROOM targets answer "room hub is not reachable on loopback (ECONNREFUSED)". This is
classified as an **environment** difference, not a fabricated number: the count depends on whether a Room Hub answers,
and the author's number is self-consistent with a fixture where it did. Recorded because the same difference is
precisely what makes F1 reachable rather than latent, and because a count of that kind should carry its environment.

## 4. Completion gates, independently checked

| # | Gate (workbook §完成门槛) | Verdict | Basis |
|---|---|---|---|
| 1 | Web direct catalog | PASS | PROBE 1/2/3/4/8 in a real browser: 2 interactions, backend-driven rows, disabled unavailability, prepare-not-execute, confirmation preserved |
| 2 | Android direct catalog | PASS (scope stated) | the catalog branch is rendered above the input in `AskPanel.kt`; 80/80 unit tests first-hand. `physical: online catalog NOT_RUN` and `offlineCatalogDisabled: true` are the author's own honest record — the Compose catalog was not rendered here |
| 3 | backend-driven | PASS | PROBE 2: an injected response renders exactly itself; PROBE 1: identity parity in both directions |
| 4 | no fake future capabilities | PASS | PROBE 1: every rendered row is a backend row and every backend row is rendered; nothing from FUTURE_EXPOSURE_BACKLOG appears |
| 5 | opposite-host Review / exact-head CI | PASS | this report; runs 37222683667 / 37222688854 / 37222688771 all success on the reviewed head |
| 6 | PAPER_MATERIAL_INDEX | PASS (F3, F4 recorded) | present; target count 16, category counts ROOM 5 / CAPABILITY 6 / CITY_TASK 5, and the step counts, all verified against the live route |
| 7 | terminal marker | RELEASED | `CAPABILITY_CATALOG_DISCOVERABLE` |

Registry reconciliation performed by this review:

```text
capability-registry/records/CAP-ASK-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      the pending-Formal-Review entry replaced by the PASSED record, with F1 named
  evidence                        reviewer probes + this report added as review refs
workbook CEX-703
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the fourteen missing template fields backfilled, exposure values transcribed from CAP-ASK-001
```

## 5. What this review does NOT claim

* **No Android rendering.** The catalog branch was read and the parser exercised by the project's own 80-test unit
  suite run first-hand; the payload it consumes was confirmed against a real gateway. The Compose catalog was not
  rendered on a device or emulator, and the author's own receipt records the online catalog as `NOT_RUN`. F1 is
  therefore demonstrated from the live contract and the author's own recorded configuration, not from a screenshot.
* **No Room-Hub-reachable run.** This review's fixture had no Room Hub answering, which is why five extra targets are
  unavailable here. F1's reachability rests on the author's recorded count being consistent with the opposite
  configuration, which is stated as the inference it is.
* **No user study.** The "2 steps" figure counts the interactions this review performed in a real browser; it is not a
  usability measurement, and the workbook's own before/after counts are left as F3 records them.
* F1 and F2 are **not** repaired in the reviewed artifact — F1 is a MEDIUM finding with a minimum repair boundary, F2 a
  LOW one; both are left to the programme. F4 is reconciled in the control plane by this review and stated as such.
* This verdict covers only `478d486096512eea3266350efe070323a232a120`. A later head needs its own review, and
  `review/CEX-703-mech-review` is review evidence, not a merge candidate.
