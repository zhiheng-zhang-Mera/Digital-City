# UXI-301 — CLAIM RACE, AND ALIEN'S CLAIM WITHDRAWN (Alien)

```text
TASK            = UXI-301 (scheduler status into the non-engineered UI)
WINNER          = Mech   claimed 2026-10-02T04:30:22Z
ALIEN'S ATTEMPT =        claimed 2026-10-02T04:30:46Z  -> WITHDRAWN, void
MARGIN          = 24 seconds
```

This task is **Mech's**. Alien attempted to claim it, lost the race by 24 seconds, and has withdrawn. No
duplicate claim remains anywhere, and Alien has not written to Mech's task, its workbook fields, or its
branch.

## What happened, in order

1. Alien declared `RESCHEDULING_BASELINE_FROZEN` for RS-290 and merged the reviewed head into utopia main
   as `1a5bc0e`. That freeze is what opens UXI-301 — Mech had recorded explicitly that UXI-301's
   dependency is the **freeze rather than the review verdict**, which is easy to get wrong.
2. Alien verified the dependency gate by **reading both workbooks** (UI-190 `UI_BASELINE_FROZEN`, RS-290
   `RESCHEDULING_BASELINE_FROZEN`), then read UXI-301's own definition, and prepared a claim at
   `2026-10-02T04:30:46Z` against `baseline_policy: CLAIM_TIME_MAIN`.
3. **Mech had already claimed it at `04:30:22Z`**, in two commits (`fad886e` wrote the workbook fields,
   `4523852` added `CLAIM_RECORD_MECH.md`), with `development_branch:
   uxi/UXI-301-scheduler-status-into-product-ui` at the same baseline `1a5bc0ee`.
4. Alien's `git push` was **rejected**, and the following rebase conflicted on the same frontmatter block.
   The rejection is what surfaced the race; had the push succeeded first, Alien would have overwritten a
   valid claim.

## The judgement, recorded because the workbook asks for the reasoning and not just the outcome

**Mech's claim stands and Alien's is void.** The deciding fact is the recorded
`development_claimed_at`: `04:30:22Z` against `04:30:46Z`. Mech was 24 seconds earlier against the same
baseline, so this is not a case where the claims are indistinguishable and a rule has to be invented —
the workbooks already carry the timestamp that settles it. The alternative readings were considered and
rejected:

- *"Alien declared the freeze, so Alien has the stronger claim"* — rejected. Declaring a baseline is the
  duty that **opens** a task; it does not create a right to the task. Treating it that way would make the
  freeze host a permanent first-in-line for everything it unblocks, which is not what any rule says.
- *"Two claims exist, so the task is contested and should be escalated"* — rejected as unnecessary. There
  is a deterministic tiebreak on the record, and section 9 forbids work that exists only to re-decide
  something already decided.

**Alien's claim was discarded rather than amended.** A claim that lost a race is not a smaller claim; it
is not a claim at all, so the commit was dropped and local `main` was reset to `origin/main` (`4523852`).
Verified afterwards: the void commit never reached origin (the push was rejected), so **origin never saw a
competing claim and Mech's record is unmodified** — `development_host: Mech`, `development_branch:
uxi/UXI-301-scheduler-status-into-product-ui`, baseline `1a5bc0ee`.

**Alien did not touch Mech's task.** No edits to UXI-301's workbook, no branch, no report inside Mech's
`report_path` other than this withdrawal, which is Alien's own record of its own error and is deliberately
named for the race rather than for the task.

## The method note, because this is a recurrence and not a novel event

This programme has already recorded that a null `development_host` can be taken **within the same minute
it opens** — most recently when Mech claimed RS-203 as RS-202's review completed. Alien nonetheless spent
the round confirming the gate, reading the task, and composing a careful claim before pushing, and lost by
24 seconds. The lesson is not "claim faster" but that **the gate check and the claim must be adjacent**:
the eligibility reading is worthless if a 24-second window closes between reading it and acting on it.

There is also a smaller, more useful observation. The race was detected only because the **push was
rejected**; had Alien's push landed first, a valid claim would have been silently overwritten and the
record would have looked clean. Nothing in the process would have flagged it. That is an argument for
treating the frontmatter `development_host` as compare-and-swap rather than last-write-wins, which is
noted here as a control-plane improvement rather than acted on unilaterally.

## Alien's position now

Nothing in the pool is claimable by anyone: UXI-390 declares `dependencies: ["UXI-301"]` and UXI-301 is
Mech's and in progress. Alien is therefore **waiting**, and will rescan on the standing interval.

Two things Alien owes and has not abandoned:

- **RS-290 step 7 is done** — `RESCHEDULING_BASELINE_FROZEN`, merge `1a5bc0e`, main CI `36964619541`
  green on both jobs, merged tree byte-identical to the reviewed head `2f81296`. Nothing further is owed
  there.
- **UXI-301's Review must not be Alien's** if Alien were ever to develop it; and symmetrically, Alien
  must not review Mech's development of it either. Section 3 is unaffected by the race.
