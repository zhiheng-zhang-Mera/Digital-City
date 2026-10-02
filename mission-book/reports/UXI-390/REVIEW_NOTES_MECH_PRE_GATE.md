# REVIEW NOTES — Mech, UXI-390 pre-gate working set

```text
FROM = Mech   PURPOSE = accumulate review observations while the author develops, so nothing is lost to a
                        context compaction and the review starts from evidence rather than re-reading.
STATUS = NOT A REVIEW. No gate item is scored here and none of this is a verdict.
```

The review gate is `development_complete: true` on `mission-book/ui-integration/UXI-390-双机最终产品验收与收口.md`.
This file is the working set for when it opens. Each item says what is established, and what is still owed.

## A. What the parity guard does and does not prove

`tests/android-scheduler-parity.test.mjs` compares the Kotlin `ACTION_WIRING` map against
`apps/web/scheduler.js`'s, with a minimum entry count on both sides (so an empty parse cannot pass
vacuously), a `deepEqual` across the two, and an assertion that the unrouted set is exactly `{CONFIRM}`.
Verified: the two maps agree entry for entry, and the guard is load-bearing by mutation.

**What it proves:** both surfaces know the same *routes exist*. **What it does not prove:** that either
surface is *connected* to them. This is not a defect in the guard — it is the boundary of its claim, and the
review should state it in those terms rather than reading a green parity test as behaviour parity.

The reason it matters now is that the two surfaces' **effective live sets have legitimately diverged**, which
is the containment design working as intended:

| action | Web (effective) | Android (effective) |
|---|---|---|
| `CANCEL` | live → `POST tasks/:id/cancel` | **live** → `CityClient.cancel` |
| `CHOOSE_PROVIDER` | note on the action row; per-provider control | **disabled** on the action row; per-provider `Choose` → `CityClient.providerChoice` |
| `KEEP_WAITING` | live, local acknowledgement (`nothing to send`, then re-read the feed) | **disabled** (not in `supportedActions`) |
| `RETRY` | live → `POST tasks` (`CHECKPOINT_DEMO`) | **disabled** (not in `supportedActions`) |
| `CONFIRM` | disabled + labelled | disabled + labelled |

So the guard is green while `RETRY` is offered on Web and withheld on Android. That is **correct** — Android
cannot perform it and must not pretend — but it means the guard must not be cited at review as evidence that
the surfaces behave alike. It is evidence that they agree about the route table.

`KEEP_WAITING` is worth a line at review as the one case where the asymmetry is arguable in the other
direction: Web offers it as a live control whose handler explicitly sends nothing (`/* local acknowledgement:
nothing to send */`) and then re-reads the feed, while Android withholds it. Both are defensible; Android's is
the more conservative, and Android polls the feed on its own timer anyway, so the user-visible difference is
negligible. Record it as a parity observation, not as a defect on either side.

## B. Open findings filed during development

| item | state |
|---|---|
| `MainActivity.kt:103` omitted `onAction`, so every routed action was enabled and inert | **CLOSED** — fixed at `8ab8225` by making `onAction` nullable, then wired at `MainActivity.kt:108`–`116` |
| `supportedActions` and the per-provider `Choose` path have no test binding; the dead `CHOOSE_PROVIDER` branch is a trap | **FILED** — `FINDING_MECH_SUPPORTED_ACTIONS_UNGUARDED.md` |
| `CHOOSE_PROVIDER` unimplemented on Android | **CLOSED** — `CityClient.kt:113 providerChoice` now exists and the per-provider control sends that row's own ref |
| The guard would `FAIL` the honest Android state if `CHOOSE_PROVIDER` were declared unsupported | **MOOT AS WRITTEN** — Android now genuinely supports it, so `{CONFIRM}` remains the correct unrouted set. The containment point is still the right shape for any future divergence; do not cite it as an open defect |

## C. Owed verifications when the gate opens

Run these against the **exact** `development_head_sha` recorded in the workbook (§7), never the branch tip:

1. `node mission-book/reports/UXI-390/uxi390-reconcile.mjs` — expect 12/12 with the recorded head equal to the
   branch tip. Ran at 10/12 during development on the two expected lag checks; that is not a finding.
2. The **Android choice round-trip**, which Alien records as **still open** at `54445d3`. This is the one
   acceptance item with a live claim against it: the workbook requires the user's choice to *really reach the
   backend*. Alien's own record says `round-trip still open`. Do not accept a rendered control as closure.
3. Hosted CI bound to the exact recorded head, both jobs, on the **implementation** repo
   (`zhiheng-zhang-Mera/utopia`) — read `implementation_repo` from the workbook, never inferred.
4. Evidence openable from a **review host**: `evidence/raw/mission-book/UXI-390/` committed, not only under
   the gitignored `.runtime`. Verified present at the time of writing; re-verify at the recorded head.
5. The RS-290 contract byte-identical to `main` — verified at the time of writing; re-verify at the head.
6. The **unstated** disposition of the UXI-301 handoff seam, which was deferred to integration with the gate
   item explicitly NOT MET. Confirm it has not been silently converted into a pass by the integration.

## D. Standing review constraints

- The two hosts must be different physical hosts (§3). Development is Alien's; this review is mine, and
  `review_host` is `null` in the workbook.
- `REVIEW_COMPLETE` for a task I developed is never mine to issue — inapplicable here, but it is why the
  UXI-301 verdict is Alien's and this one is mine.
- Mocks may not substitute for real E2E. Deferred ≠ passed.
- The review runs against the work, not the record. A clean reconciliation is a precondition for a claim,
  never a verdict.
