# UI-102 — handoff Mech → Alien: development complete, review requested

```text
MISSION        = UI-102 (Android 产品壳与信息架构)
FROM           = Mech (development host)
TO             = Alien (review host - must not be Mech, CONSTRUCTION_RULES §3)
BRANCH         = ui/UI-102-android-product-shell
HEAD_SHA       = 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410
CI             = 36886549081 success (android + gateway-web)
UNIT_TESTS     = 64 passed, 0 failures
DEVELOPMENT_COMPLETE = true
```

Report: `mission-book/reports/UI-102/DEVELOPMENT_REPORT.md` (§7 is the completion claim).
Defect record: `mission-book/reports/UI-102/NARROW_WIDTH_DEFECT.md`.
Evidence: `evidence/raw/mission-book/UI-102/` in the utopia repo.

## What I want challenged hardest

I got this task wrong twice in the same way, so please do not take the acceptance on trust:

1. **Re-do the legibility claim from pixels, not from a dump.** Twice I asserted a
   narrow-width result from `uiautomator dump`. A dump reports a widget's *full* text and its
   *layout* bounds; it cannot report that the text was clipped inside them. My first claim
   ("no overflow, pass") and my second ("truncation, fail") were both wrong, and the second was
   also aimed at the wrong width. If you only run dumps you will reproduce my error.
2. **Check the dp arithmetic.** `wm size 320x640` at `density 320` is **160 dp**, not 320 dp.
   Two increments of "narrow width" acceptance were run at a width no phone has, which is why
   320 dp and 360 dp went untested for so long. Verify my matrix rather than my prose:
   360 dp @ 1.0/1.5 and 320 dp @ 1.3/1.5, from screenshots.

## Specific things I know are weak

*   **The 160 dp residual.** At 160 dp @ 1.5 the labels **still clip** and the icon-only
    fallback in `UtopiaComponents.kt` does **not** engage. I documented the fallback as if it
    worked; at that width it demonstrably does not. 160 dp is outside the specified acceptance,
    which is why I did not treat it as blocking — judge for yourself whether that is the right
    call. Either the threshold is never reached or the measurement is not seeing the real slot;
    I did not diagnose it.
*   **The measured-fit path is not asserted by any composition test.** `UiSizing.kt`'s
    arithmetic has 8 unit tests, but `rememberTextMeasurer()` / `MaterialTheme` need a
    composition and `ui-test-junit4` + `androidx.test` are absent from this host's offline
    Gradle cache, so no `androidTest` exists. The step-down ladder working *in a real
    composition* is evidenced only by the screenshots.
*   **Keyboard/focus traversal has no instrument here at all.** Carried, not verified.
*   **A `rememberTextMeasurer()` font-scale cache caveat** was raised by the implementing
    subagent: `LocalDensity.fontScale` is not a key for the measurer, so after a *live*
    `font_scale` change (no activity recreation) the ladder may measure with stale metrics. My
    acceptance runs set the scale *before* launching and force-stopped the app between
    configurations, so they would not have exposed it. Bounded consequence: a wrong rung may be
    chosen, but `softWrap=false` means no mid-word clip, so it cannot restore the reported
    defect. Unexercised either way.
*   **A custom `UtopiaNavigationBar` replaced the Material `NavigationBar`** (~160 lines). Its
    touch-target height, pill indicator and `Role.Tab` semantics are code-reviewed but only
    visually confirmed at the sizes I shot. Worth a hard look, since replacing a platform
    component is the kind of change that quietly loses accessibility behaviour.
*   **Header spacing changed.** The old `weight(1f)` spacer is gone in favour of a scrollable
    measured row, so wordmark and status sit closer on wide screens. Intentional, but I only
    looked at narrow widths.

## Cross-surface question I deliberately did NOT patch

The default path renders device freshness as a raw machine timestamp
(`Last seen: 2026-10-01T15:42:25.473Z`), and at 320 dp @ 1.5 it runs into the card edge. I left
it alone on purpose: Web renders the same value, so a one-sided Android change would break the
truth-parity this task just established. Please decide it as an **Android + Web** question, not
an Android one. If you rule it should change, it belongs in a follow-up that covers both.

## Truth-parity check worth re-running

Increment 6 fixed both parsers discarding the Gateway's `statusLabel` in favour of a client-side
mapping. If you re-verify one thing, re-verify that the Gateway's label still wins and that the
local mapping is only a fallback — that is the one behaviour in this task whose whole point is
that two surfaces agree.

## Environment notes that will save you time

```text
emulator -avd utopia36 -no-audio -no-boot-anim -gpu swiftshader_indirect -no-snapshot -memory 4096
  -> WINDOWED is required for screencap to capture the Compose surface.
     -no-window makes it a black frame; -gpu host also black. This is a flag property,
     not a machine property - the earlier "screenshots are impossible" note was wrong.
adb reverse tcp:4310 tcp:4310   + host = http://127.0.0.1:4310 in city-connection.xml
  -> reliable; the 10.0.2.2 slirp alias failed intermittently and looks like a product OFFLINE.
Kill by qemu-system-x86_64*  -- windowed runs qemu-system-x86_64.exe, headless runs
  qemu-system-x86_64-headless.exe. Matching only "emulator" leaves it alive, and the next boot
  then dies with "Running multiple emulators with the same AVD" while adb emu kill looks fine.
JAVA_HOME=D:\GDPR-Refine\.tools\jdk-17.0.20.1+1  (machine default is a non-existent path)
```

## What I am NOT claiming

I am not claiming this passes review. Review is yours and must be independent — Mech developed
this task and cannot review it.
