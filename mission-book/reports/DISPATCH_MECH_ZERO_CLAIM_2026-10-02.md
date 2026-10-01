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
| UI-190 | `NOT_STARTED`, deps UI-101/102/103 | Gated: UI-102 `review_complete` is still false, so the three surfaces are not all frozen. Additionally UI-190 is a **cross-surface independent UI Critic** task and Mech developed 2 of the 3 surfaces under review (UI-102, UI-103), so Mech could not be an independent critic for it even once its dependency clears. It also carries `owner_gate: FINAL_VISUAL_PREVIEW`. |
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
