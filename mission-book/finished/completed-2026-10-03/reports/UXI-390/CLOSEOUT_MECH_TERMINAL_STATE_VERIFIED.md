# CLOSEOUT — Mech: the terminal state independently verified

```text
FROM = Mech (review host for UXI-390)
TERMINAL MARKER = UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED, declared 2026-10-02T14:35:37Z
BOUND TO        = 6a82e35a2c5c40db426f815056bac6fda4c6806d   (the head I reviewed)
```

## The board is terminal

```text
UI-000   REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS      UI-101/102/103   REVIEW_COMPLETE
UI-190   UI_BASELINE_FROZEN                              RS-201/202/203   REVIEW_COMPLETE
RS-290   RESCHEDULING_BASELINE_FROZEN                    UXI-301          REVIEW_COMPLETE
UXI-390  FINAL_PRODUCT_ACCEPTED                          XX-000           NOT_STARTED (the template, not a task)
```

`reviewed_head_sha_at_acceptance` is `6a82e35a2c5c40db426f815056bac6fda4c6806d`, so acceptance is bound to the
head the review was actually conducted at, including the C-1/C-2 repairs, rather than to a head that merely
existed nearby.

## What I verified myself for this closeout, rather than accepting

- **The merge.** `main` is `d0507b008cc4f91c494e24388c457a8decd9e559`, parents `1a5bc0e` and `6a82e35`, and its
  tree hash **equals** the reviewed head's tree hash. `git diff origin/main 6a82e35` over `SchedulerPanel.kt`
  and the wording guard is empty, so `main` carries the repairs **and** the guard that protects them.
- **The merge by behaviour, not only by hash.** Re-ran on `main`: guards **11/11**, Web E2E **PASS 10/10**,
  root suite **1019 / 1017 / 2** — identical to the reviewed head, with the same two pre-existing failures.
  A hash equality read from the wrong tree would have survived the same mistake, which is why the behaviour
  check was worth the run.
- **The chain is in one tree.** `main` contains UXI-301's reviewed head `1c516b6` as an ancestor, so
  UI-000 → … → UXI-301 → UXI-390 is present together, not only the final link.
- **Gate 7.** Run `37020640107` on `d0507b0`: completed, success, both jobs — polled to completion by me rather
  than assumed from a scheduled run.

## What is still NOT MET, and I am not letting the marker paper over it

**Gate 3's remote-handoff sub-item remains explicitly NOT MET.** It is a deferral accepted by the Owner under
the OPTION 1 ruling, whose corrected reason is that the City publishes no five-dimension load vector and
unmeasured load is deliberately ineligible as an alternate. Acceptance does not repair it, and the acceptance
declaration says so itself. **That deferral's original rationale was disproven by a review correction whose
false premise was mine**, and I have recorded that throughout rather than letting a green marker retroactively
make the original claim true.

## Open items, attributed rather than quietly dropped

Both are against **frozen** baselines and both are the Owner's to re-open or leave, and the acceptance record
adopts my attribution for them:

- **C-3** — the raw task id wraps into four lines and collides with the state label at 360dp. Layout is
  `SchedulerPanel.kt:86-88`; the convention of rendering a raw task id is the frozen baseline's.
- **V-3** — the three surfaces take three different localisation postures, because `apps/android` has no
  `strings.xml` and no `getString`, so cross-surface wording parity now rests on a guard rather than on shared
  resources. UI-190/UI-103 components, frozen and reviewed at specific bytes.
- My own open question — whether two small review PNGs may live in City under `PROCESS_DATA_POLICY.md` line 16
  — was left to the Owner rather than reinterpreted by me.

## One residual record inaccuracy, stated and not hidden

`development_head_sha` still names `149a4c1` while `reviewed_head_sha_at_acceptance` and the acceptance
narrative correctly name `6a82e35`. The correction was dispatched and has not been applied. It does not affect
the acceptance, which is bound correctly, and **I deliberately did not edit the development host's field** — a
review host that writes the development host's record becomes its co-author, which is the ruling this
programme already made once in the other direction.

## Corrections to my own record during this stretch

Stated because a closeout that lists only successes is not a record. Each was recorded in place when it
happened: I published a **withdrawn over-claim** that the handoff seam's blocker had been empirically removed;
then a **withdrawn generalisation** that my harness never claimed work, refuted by a controlled A/B that showed
the behaviour was nondeterministic; my **proposed repair for the action-wiring trap was inadequate**, which
Alien demonstrated by mutation and I then reproduced myself; two defects in **my reconciliation instrument**;
and a run of tooling errors (`core.quotepath`, an inline regex flag, PowerShell quoting, and a silently
unapplied mutation that nearly produced a finding asserting the opposite of the truth).

One timing note for the record's accuracy: my previous round reported gate 8 as unclaimed. That was true when
checked and **was superseded inside the same round** by `d6e0c05` landing between my sync and my push. The
statement was time-bounded, not wrong, and it is the reason this round re-synced before concluding.


[阅读译本 / Reading translation](./zh-CN/CLOSEOUT_MECH_TERMINAL_STATE_VERIFIED.md)
