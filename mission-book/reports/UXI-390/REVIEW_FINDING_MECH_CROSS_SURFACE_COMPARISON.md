# REVIEW FINDING — Mech: cross-surface comparison of the SAME scheduler state, Web vs Android, from pixels

```text
FROM = Mech (Review host)   GATE ITEM = 5, "Web/Android/Rooms visually consistent"
METHOD = direct comparison of two captures of the SAME state, plus a source confirmation of each divergence
WEB    = Alien's step-5 capture 05-web-provider-state.png, 1440x900, sha256 e9d3f3420877...
ANDROID= my capture android-panel-devices-360dp.png, 360dp, sha256 91bf81aa0d7d...
```

Both captures show the identical condition — executor killed, work created after — so the comparison is
like-for-like rather than two different states being read as if they were one.

## What IS consistent, stated first because it is most of item 5

The panel header (`WHY THINGS ARE WAITING`), the state label (`Running in a reduced state`), the whole body
copy ("The current service is responding slowly. Use another available one?" / "Some of what this depends on
is not fully known right now."), the provider line with its reason (`Not available · This device isn't taking
new work`), and — most importantly — the **honest affordance**: `Cancel` rendered live in the accent colour
and `Choose another service` rendered greyed out on **both** surfaces. The semantics the workbook cares about
do survive the platform boundary.

## C-1 (attributable to this task) — the SAME disclosure is NAMED DIFFERENTLY on the two surfaces

```text
Web     apps/web/i18n/en.js:55      "scheduler.advanced.summary": "Technical detail"     -> "Technical detail"
Android SchedulerPanel.kt:167       TechnicalDetails(rows, title = "Scheduling detail")  -> "SCHEDULING DETAIL"
```

The Web label comes from the i18n table; the Android label is a **hardcoded literal**. Same disclosure, two
different names, and only one of them is translatable. This directly contradicts the panel's own stated rule
in its header comment — that the two surfaces render the same semantics "in the same words" — and it is in
**UXI-301/UXI-390 code**, mine, not inherited.

## C-2 (attributable to this task) — the disabled choice explains itself on Web and not on Android

```text
Web     i18n/en.js:59   "scheduler.action.nothingToSwitchTo": "nothing available to switch to"
        -> renders  "Choose another service · nothing available to switch to"
Android SchedulerPresentation.kt has no equivalent string
        -> renders  "Choose another service"   (greyed, with no reason)
```

A disabled control that says WHY it is disabled is the pattern this task has spent several rounds
establishing; Web does it for this control and Android does not. The reason is present on Android a line
above, on the provider row — so this is a divergence in the action's own copy rather than a loss of
information, but it is still two different renderings of one semantics.

## C-3 (recorded earlier, refined) — the task id layout

Web right-aligns `Q-f987c542-122f-4f18-875b-9ffbf7bf4313` on the state row and it fits, because the viewport
is 1440px wide. At 360dp the identical code wraps the id into **four** lines and the fragments run into the
state text. `SchedulerPanel.kt:86-88` puts the label and the id in one `Row` with no width constraint, so the
divergence is purely a function of width. **Layout: UXI-301's. The convention of showing a raw task id is the
frozen baseline's** (`1a5bc0e` renders ids on its own task surfaces).

## The root cause behind C-1 and C-2, which is a baseline property and not this task's

```text
apps/android has NO strings.xml and NO getString(R.string...) in its Kotlin   (grep: empty)
```

**The Android app localises with hardcoded Kotlin literals rather than string resources.** So "the same
words on both surfaces" is enforced by nothing except a human copying a string from the i18n table into a
Kotlin literal, and the two surfaces drift the moment anyone edits one side. That is *why* C-1 exists, and it
predicts C-2 and the `展开`/`收起` hardcoding in `UtopiaComponents.kt:243` rather than being three unrelated
slips. The architecture is the frozen UI-190 baseline's, so the fix is a baseline decision, not a UXI-390
repair — but the drift it causes shows up in this task's surfaces.

## Scored effect on gate item 5, for the verdict rather than for this document

Item 5 asks for visual consistency across Web, Android and Rooms. It is **substantially** met — the states,
the copy, the reasons and the live/disabled distinction all agree — with **two name-level divergences
attributable to this task** (C-1, C-2) and one narrow-width layout divergence (C-3, this task's layout over a
baseline convention). Whether that is MET or NOT MET is the review verdict's call and is deliberately not
made here.

Nothing in this document is a repair. All three are cheap and none touches the RS-290 contract.
