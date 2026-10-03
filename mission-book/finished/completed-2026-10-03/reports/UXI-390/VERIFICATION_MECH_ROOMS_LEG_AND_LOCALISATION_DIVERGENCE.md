# VERIFICATION — Mech: the Rooms leg of gate item 5 is INDEPENDENTLY CONFIRMED, plus a three-way localisation divergence

```text
FROM = Mech (Review host)   TREE = 149a4c14b596b92f04fab6269eca1dcb7727303f
METHOD = a real Room Hub on an ephemeral loopback port, driven in a real browser, with Alien's anti-vacuity guard
STATUS = verification complete. Gate scoring happens in the review verdict, not here.
```

## Why this run exists

Gate item 5 claims Web/Android/Rooms consistency and its Rooms evidence was Alien's alone. §3 forbids the
review resting on the developer's measurement for the leg the reviewer can see, so this leg is now driven
independently. The guard that matters is Alien's and I reused it deliberately: **a click counts only if the
rendered surface actually changes**, so three nav clicks that navigate nowhere cannot produce a green result.

## Result: PASS 5/5

```text
[PASS] the hub paints all 10 rooms in its navigation - all 10 room labels present
[PASS] opening "Bookmark Room" changed the rendered surface - body text differs
[PASS] opening "Checklist Room" changed the rendered surface - body text differs
[PASS] opening "Prompt Library" changed the rendered surface - body text differs
[PASS] zero page errors during the journey
```

The ten rooms are `Knowledge Room, Bookmark Room, Checklist Room, Prompt Library, Text Workshop, Hash Room,
Data Lab, Focus Room, Calendar Room, Decision Room`, which corroborates Alien's "01 Knowledge Room to 10
Decision Room" independently of its evidence.

**Alien's statement that the hub opens on the Knowledge Room is also independently corroborated — by a
failure of mine.** My first run demanded a surface change on clicking every room including the first, and
"Knowledge Room" produced **no change**. Read naively that is a product defect: a nav item that does nothing.
It is the opposite. The hub already displays the Knowledge Room, so clicking it correctly changes nothing, and
**my check was aimed at a target that could not change.** The evidence to explain my own negative was sitting
in Alien's handoff the whole time, and I had read it. Fixed by targeting three rooms other than the one
already open, and recorded because a guard that cannot fail and a guard that fails the product for being
right are the same mistake wearing different clothes.

## Visual-critic pass on the Rooms surface (1440x900)

Drawn correctly and consistently with itself: ten numbered nav entries each carrying an **English name and a
Chinese subtitle** (`01 Knowledge Room / 本地知识库`, …, `10 Decision Room / 决策室`); the open room
highlighted in the nav; the room's own surface with header, empty state, controls and a side pane; a status
line and a collapsed detail fold at bottom-left.

**V-3 — the three surfaces take three DIFFERENT localisation postures, and this is the real item-5 finding.**

```text
Web product shell   ENGLISH          "Your devices, in focus."  "Run Test Task"  nav: Home / Tools / Rooms / Devices
Android             ENGLISH copy      panel, actions and reasons all English
                    + CHINESE affordance  "展开" / "收起"  (UtopiaComponents.kt:243, a hardcoded literal)
Rooms               CHINESE chrome    "本地工具"  "会保存在本机"  "已就绪"  "运行详情"
                    + BILINGUAL nav   English name above, Chinese subtitle below
                    + ENGLISH content "PROMPT LIBRARY", "No prompts yet.", "Export JSON"
```

So one product renders English, English-with-a-Chinese-control, and Chinese-chrome-with-bilingual-nav. On the
Rooms page the hardcoded `展开` is *consistent* with its surroundings; on Android the identical hardcoded
string is an outlier in an otherwise English panel. **That is the same defect changing sign depending on the
surface it lands on**, which is a clearer statement of it than "a hardcoded string".

**Attribution, stated so it is not mis-scored:** the Web shell is UI-190's, the Rooms chrome and bilingual nav
are UI-103's, the Android affordance is UI-190's shared component, and only the *reuse* of that component is
UXI-301/390's. So the divergence is **inherited baseline, spanning three previously frozen tasks** — UI-103 and
UI-190 are both `REVIEW_COMPLETE`/frozen, so this cannot be repaired inside UXI-390 without unpicking frozen
work. Recorded for the Owner/verdict as an item-5 observation, not charged to this task.

## Evidence

`mission-book/reports/UXI-390/mech-review/rooms-journey.json` (the ten labels, the three opens with their
surface-change verdicts, the page-error list, and the bound head) and
`rooms-hub-mech-1440x900.png` (sha256 `9de7558c221dae3b9c6cd75751405d8a514bfe2071595bc45175b5d968d5b405`).

Two instrument notes, both mine, both kept because deleting the evidence of one's own faults is how a review
loses its value: the first run **aborted** because a bare `chromium.launch()` fails on this host and the task's
own E2E uses `channel: 'msedge'` — I copied its launch rather than skipping the check; and the second run's
false failure is described above.
