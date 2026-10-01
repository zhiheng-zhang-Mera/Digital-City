# DISPATCH — Mech zero-claim classification, 2026-10-02

```text
HOST                       = Mech
SCAN_TIME                  = 2026-10-02T15:50Z (approx; see mission-book commit 8e31e6d)
pool_incomplete            = true
claimable_now              = 0
potentially_claimable_later = true
CLASSIFICATION             = 5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
```

## Why zero, per task

| task | status | why Mech cannot claim it now |
|---|---|---|
| UI-102 | `dc=true rc=false` | **Review is mine to request, not to perform.** Mech is the development host; `CONSTRUCTION_RULES.md` §3 requires a different physical host. Structurally barred for Mech, open for Alien. |
| UI-190 | `NOT_STARTED`, deps UI-101/102/103 | Gated, and the gate is explicit: its 完成门槛 requires "UI-101..103 全部 Development+**Review** complete", and UI-102 `review_complete` is still false. Locked until Alien's UI-102 review lands. See the eligibility correction below. |
| RS-201, RS-202 | `NOT_STARTED`, dep UI-190 | Dependency locked. |
| RS-203 | dep RS-201, RS-202 | Dependency locked. |
| RS-290 | dep RS-201..203 | Dependency locked. |
| UXI-301 | dep UI-190, RS-290 | Dependency locked. |
| UXI-390 | dep UXI-301 | Dependency locked. |

## Why this is 5.1 and not 5.2

Not every remaining task is structurally closed to Mech forever. A concrete event can unlock
work for this host:

```text
EVENT: Alien claims and completes the UI-102 review on branch ui/UI-102-android-product-shell
       (handoff: mission-book/reports/UI-102/HANDOFF_MECH_TO_ALIEN_DEVELOPMENT_COMPLETE.md,
        head 652c41c, CI 36886549081 green).

UNLOCKS: UI-190's dependency set becomes review-complete, and the cross-surface phase can be
         dispatched. Whether Mech or Alien takes UI-190 is an eligibility question that the
         lock resolution must settle, because Mech developed 2 of its 3 input surfaces.
```

So: low-cost wait, no busy-poll, bounded re-scan about every 20 minutes, and an immediate
re-scan on any event that resolves a dependency lock (UI-102 reaching `review_complete`, an
Owner gate action, or a phase freeze).

## Correction to my own first reading of UI-190 eligibility

My first pass at this dispatch implied Mech might be barred from UI-190 outright. Re-reading the
workbook, that is too pessimistic and I am correcting it before it hardens into a wrong claim
decision.

UI-190 is an **integration/development** task, not a review-only task: it builds an integration
branch from then-current `main`, merges the three reviewed UI branches, unifies tokens/terms/icons/
status colours/spacing, runs two rounds of screenshot → critic → fix → screenshot, regresses the
nine existing surfaces, then merges to `main` and marks `UI_BASELINE_FROZEN`. That is development
work, and `CONSTRUCTION_RULES.md` §3 requires only that the **Review** be a different host from the
**Development**, not that the development host differ from the developers of the merged branches.

So the correct reading is:

```text
UI-190 development_host = Mech is permissible (integration + automated fixes)
UI-190 review_host      = must NOT be Mech, because Mech developed UI-102 and UI-103
```

and UI-190's own step 3 makes the same point independently — *"同一上下文不得既给最终视觉评分又
无条件接受自己的实现"*: the same context must not both give the final visual score and
unconditionally accept its own implementation. Mech can do the merging and the fixes; the two
independent critic rounds and the final visual score must come from the other host.

This matters because it changes what happens when the lock clears: Mech should claim UI-190 as
development host rather than treating itself as structurally ineligible, and the critic pass must be
dispatched to Alien. Recorded now so the next scan does not repeat my first, lazier reading.

Still 5.1 rather than 5.2 for exactly that reason: the blocker is a pending event, not a permanent
bar on this host.

## What Mech did on the way to zero

UI-102 development was completed and pushed this round rather than left open to keep a claim
alive: head `652c41c` on `ui/UI-102-android-product-shell`, CI `36886549081` green, 64 unit
tests 0 failures, connected real-emulator acceptance with screenshots, and all six remaining
items from the report closed. The claim is released with the task, not held.

## Honest notes attached to this scan

*   Two earlier rounds of this task reported a narrow-width acceptance that was run at a
    **160 dp** viewport (mis-read as 320 dp because `wm size` takes pixels). That is corrected
    in the workbook, in `DEVELOPMENT_REPORT.md` §7 and in `NARROW_WIDTH_DEFECT.md`; the
    acceptance matrix in the handoff is the replacement.
*   A residual limit is recorded rather than hidden: at 160 dp @ 1.5 the bar labels still clip
    and the icon-only fallback does not engage. Out of the specified acceptance range, but the
    fallback does not behave as documented.
*   Not claimed and still open: keyboard/focus traversal (no instrument on this host), and the
    raw machine timestamp on the default path (cross-surface question, deliberately not
    patched unilaterally).
