# UI-102 — narrow-width defect found by screenshot that the hierarchy dump had passed

> Host `Mech`. Branch `ui/UI-102-android-product-shell`, head `3bdba53`.
> Status: **DEVELOPMENT_COMPLETE = false**. This report records a defect and corrects an
> earlier acceptance claim made by this same host.

## 1. The correction

Increment 5 of the development report claimed narrow-width / font-scale acceptance had
passed, and the current round repeated that claim from a `uiautomator dump`:

```text
320x640 @ font_scale 1.5
  bar: Home x=[0..46] | Ask x=[68..113] | Rooms x=[135..180] | Devices x=[202..247] | Activity x=[269..320]
  max right edge = 320 = viewport  -> reported as "NO OVERFLOW"
  leaks = 0
```

That check was measuring the **semantics tree**, not the rendered pixels. A `uiautomator`
node carries the widget's *full* text and its *layout* bounds; it does not report whether
the text was visually clipped inside those bounds. So "no node exceeds the viewport" is
not the same claim as "no text was truncated", and the earlier acceptance rested on the
weaker one.

The screenshot of the same build, same device, same configuration
(`android-shell-connected-320x640-font1.5.png`) shows what the user actually sees:

```text
bottom bar labels      "Ho"  "As"  "Ro"  "De"  "Ac"        <- all five truncated
status chip            O N L I N E  stacked, one character per line
```

That is a direct hit on two of the review checklist's own items — *底栏溢出* (bottom-bar
overflow) and *文本拥挤* (text crowding) — and on the hard rule that the primary path must
stay readable. **The narrow-width acceptance is a FAIL, not a pass.**

## 2. Why the earlier pass happened

Three separate causes, all of them this host's mistakes rather than environment limits:

1. **Wrong instrument for the claim.** The dump is the right instrument for "which
   surfaces exist and where", and the wrong instrument for "is the text legible". It was
   allowed to answer a question it cannot answer.
2. **Screenshots were believed to be impossible here.** The earlier note recorded
   `screencap` returning an all-black 7.9 KB PNG and concluded screenshots could not be
   used. That conclusion was drawn from one launch configuration and was wrong — see §3.
3. **A false positive was briefly mistaken for success.** One 50.9 KB non-black capture
   was the *launcher wallpaper*, not the app; the app had not come to the foreground.
   It was discarded rather than reported, but it shows how easily "a real PNG" gets
   accepted as "a real screenshot of the app".

## 3. Environment facts corrected

The black-framebuffer limitation recorded in `E2E_VERIFICATION_NOTES.md` is **not** a
property of `screencap` on this machine. It is a property of the launch configuration:

```text
-no-window  -gpu host                  -> screencap = black (7904 B), launcher also black-ish
-no-window  -gpu swiftshader_indirect  -> launcher captures (226 KB); Compose app still black
 window     -gpu swiftshader_indirect  -> launcher (786 KB) and Compose app BOTH capture
```

The working invocation, and the one the acceptance evidence was produced with:

```text
emulator -avd utopia36 -no-audio -no-boot-anim -gpu swiftshader_indirect -no-snapshot -memory 4096
```

Also worth keeping, because it removes a whole class of flakiness:

*   `adb reverse tcp:4310 tcp:4310` + `host = http://127.0.0.1:4310` connects the debug
    build to the host Gateway reliably. The `10.0.2.2` slirp alias used in the earlier note
    failed intermittently after an emulator restart and produced a spurious OFFLINE.
*   The real emulator process is `qemu-system-x86_64-headless.exe`. Matching only
    `emulator`/`qemu-system-x86_64` leaves it alive, which then makes the *next* boot fail
    with "Running multiple emulators with the same AVD" and `adb emu kill` appear to work
    when it does not.

## 4. Connected evidence that is now durable

| file | what it establishes |
| --- | --- |
| `acceptance-connected-native.xml` | 720x1600 @ font 1.0, `ONLINE`, five bar entries, `Alien-PC` telemetry, 0 identifier leaks |
| `android-shell-connected-native.png` | the same state as rendered — dark HUD, lime `ONLINE`, five-entry bar, Devices selected, no console character |
| `acceptance-connected-320x640-font1.5.xml` | 320x640 @ font 1.5, `ONLINE`, five entries, 0 leaks — the tree is correct |
| `android-shell-connected-320x640-font1.5.png` | the same state as rendered — **and this is where the truncation is visible** |

The two narrow files disagree, and that disagreement is the finding: the tree is right and
the pixels are wrong.

## 5. Cross-surface observation, deliberately NOT fixed here

The native screenshot shows device freshness as a raw machine timestamp on the default
path:

```text
Last seen: 2026-10-01T15:26:39.519Z
```

This is arguably the kind of engineering-flavoured value the hard rule wants folded into
technical details. It was **not** changed on this branch, on purpose: this task's own
boundary forbids re-deriving presentation away from the shared truth, and Web renders the
same value. Changing Android alone would break the truth-parity this task just fixed, so
this is raised for the Review host as a **cross-surface** question (Android + Web together),
not patched unilaterally.

## 6. What must happen before this task can be called complete

1. Fix the bottom-bar label truncation at 320dp @ 1.5x so all five labels are legible.
2. Fix the status chip so `ONLINE` does not wrap one character per line.
3. Re-run the acceptance **with a screenshot**, not only a dump, at 320dp and 360dp, at
   font 1.0 and 1.5.
4. Re-state the acceptance result from the pixels, and keep any dump-based claim explicitly
   labelled as a structural (not legibility) claim.
