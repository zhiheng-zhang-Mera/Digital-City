# UI-102 — narrow-width / font-scale: a mis-specified acceptance, the defect it hid, and the fix

> Host `Mech`. Branch `ui/UI-102-android-product-shell`.
> Defect observed on `3bdba53`; fixed and verified on `652c41c`.
> This report also corrects the *configuration* the acceptance had been run at for two rounds.

## 1. The configuration was wrong, and that is the root of the confusion

The acceptance had been run for two increments as "narrow width": `wm size 320x640` with
`wm density 320`. Those are **pixels**, and at density 320 the density scale is 2 px/dp, so:

```text
320 x 640 px @ 320 dpi   =  160 dp wide      <- narrower than any real phone
640 x 1280 px @ 320 dpi  =  320 dp wide      <- a realistic narrow phone
720 x 1600 px @ 320 dpi  =  360 dp wide      <- the AVD's natural size
```

160 dp is half the width of the narrowest device the workbook's *常见窄屏* ("common narrow
screen") can mean. So for two rounds the task had been measuring a viewport no phone has,
and had never once measured a real narrow width.

That single mistake produced both of this task's wrong turns:

*   it made a **real** rendering failure at 160 dp look like the thing being tested, and
*   it meant the widths that actually matter (320 dp, 360 dp) were **never tested at all** —
    so neither the earlier pass nor the earlier withdrawal said anything about them.

## 2. What was actually true

**At 160 dp @ font_scale 1.5** the rendering genuinely failed, and the hierarchy dump could
not show it. The dump reported five bar nodes with full text and bounds inside the
viewport, which was read as "no overflow". A dump node carries a widget's full text and
its layout bounds; it cannot report that the text was **clipped inside** those bounds. The
screenshot of the same build, same device, same configuration showed:

```text
bottom bar labels      "Ho"  "As"  "Ro"  "De"  "Ac"      <- all five clipped
status chip            O N L I N E   stacked, one character per line
```

**At 320 dp and 360 dp nothing had been tested**, at any font scale. So the earlier claim
that the narrow-width acceptance had passed was unsupported, and the later claim that it
had *failed* was aimed at an out-of-scope width. Both are withdrawn; §4 replaces them.

## 3. The fix

`NavigationBarItem` measures its label slot in a duplicated pass and then clips whatever is
in it, which is exactly how `Ho`/`As`/`Ro` happened — a width-aware workaround inside that
slot cannot see the real bounded width. `UtopiaNavigationBar` owns the measure loop instead
so the label gets its true slot.

*   The label steps down **11 → 10 → 9 sp** to the largest size that fits the measured slot.
*   Below that it falls back to **icon-only**, keeping the surface name as the semantics
    label, so the entry never renders a word fragment.
*   The header status became a measured chip on a scrollable row, so `ONLINE` stays on one
    line and can no longer squeeze the wordmark or the overflow button to zero.
*   The sizing decision is a pure function (`UiSizing.kt`) with 8 unit tests, module total
    **56 → 64**, all green.

Compose here is Foundation **1.8.0** / Material 3 **1.3.2** via `compose-bom:2025.04.01`
(confirmed from the Gradle cache). `BasicText(autoSize=)` / `TextAutoSize` need Compose 1.9
/ M3 1.4, and the BOM cannot be bumped offline, so the measured ladder is a deliberate
substitute rather than an oversight.

## 4. Verification — from screenshots, at the correct dp sizes

Every row is a real emulator capture of the fixed build, windowed with
`-gpu swiftshader_indirect`, connected to a live Gateway (`ONLINE` true in every dump).

| viewport | font_scale | five full labels | `ONLINE` single line | screenshot |
| --- | --- | --- | --- | --- |
| 360 dp (720x1600 @320) | 1.0 | yes | yes | `v2-360dp-font1.0.png` |
| 360 dp (720x1600 @320) | 1.5 | yes | yes | `v2-360dp-font1.5.png` |
| 320 dp (640x1280 @320) | 1.3 | yes | yes | `v2-320dp-font1.3.png` |
| 320 dp (640x1280 @320) | 1.5 | yes | yes | `v2-320dp-font1.5.png` |
| 160 dp (320x640 @320) | 1.5 | **no — still clips** | chip collapsed to a sliver | `v2-160dp-font1.5.png` |

At 320 dp @ 1.5 — the hardest in-scope case — the bar reads `Home · Ask · Rooms · Devices ·
Activity` in full and the lime `ONLINE` pill sits on one line beside the wordmark. The
defect that motivated the change is resolved across the specified range.

## 5. Residual limit, recorded rather than hidden

**At 160 dp @ 1.5 the labels still clip, and the icon-only fallback does not engage.** The
ladder bottoms out and the text is clipped exactly as before, so the degradation is not yet
graceful at that width. 160 dp is below any real device and outside the specified
acceptance, which is why it does not block completion — but the fallback is documented in
§3 as if it worked, and at 160 dp it demonstrably does not. Either the fallback threshold
is not reached in practice or the measurement is not seeing the real slot; that is not
diagnosed here. Flagged for Review.

## 6. Cross-surface observation, deliberately NOT patched here

The default path renders device freshness as a raw machine timestamp:

```text
Last seen: 2026-10-01T15:42:25.473Z
Last snapshot: 2026-10-01T15:42:25.690Z
```

At 320 dp @ 1.5 the value also runs into the card edge. This was **not** changed on this
branch on purpose: this task's own boundary forbids re-deriving presentation away from the
shared truth, Web renders the same value, and a one-sided change would break the
truth-parity this task just established. Raised as a **cross-surface** question for Review
(Android + Web together).

## 7. Environment corrections (the earlier note was wrong)

The recorded claim that `screencap` is impossible on this host was wrong — it depends on
the launch flags:

```text
-no-window  -gpu host                  -> black 7.9 KB PNG
-no-window  -gpu swiftshader_indirect  -> launcher captures, Compose still black
 WINDOWED   -gpu swiftshader_indirect  -> launcher and Compose both capture correctly
```

Two more, each of which cost a wasted cycle:

*   **`adb reverse tcp:4310 tcp:4310`** with `host = http://127.0.0.1:4310` is reliable. The
    `10.0.2.2` slirp alias worked once and then failed intermittently after an emulator
    restart, presenting as a spurious `OFFLINE` that looks like a product bug and is not.
*   **The emulator process name depends on the launch mode.** Windowed mode runs
    `qemu-system-x86_64.exe`; `-no-window` runs `qemu-system-x86_64-headless.exe`. Matching
    only `emulator` leaves the real process alive, and the next boot then dies with
    *"Running multiple emulators with the same AVD"* while `adb emu kill` appears to have
    worked.

## 8. Method lesson worth carrying to other UI tasks

`uiautomator dump` answers *"which surfaces exist and where"*. It does **not** answer *"is
the text legible"*, because clipped text is still reported with its full string. Any
acceptance claim about legibility, truncation, overflow or crowding must be made from
pixels. This task made that claim from a dump twice, in opposite directions, and was wrong
both times.
