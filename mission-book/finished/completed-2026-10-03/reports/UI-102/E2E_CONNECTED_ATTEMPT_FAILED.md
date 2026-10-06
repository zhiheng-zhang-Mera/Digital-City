# UI-102 — connected narrow-width acceptance attempt (not completed)

> Host `Mech`. Branch `ui/UI-102-android-product-shell`, head `3bdba53`.
> This records a FAILED attempt, so the next round does not repeat it.

## What was attempted

The last verification item for UI-102: an end-to-end **connected** pass at narrow width and
large font. The earlier acceptance (head `7bdaf94`) ran with **no gateway**, so it proved the
shell chrome at 320×640 / font 1.5 but never exercised connected content.

Setup, all of which succeeded:

```text
dev-gateway + reference node started from the UI-102 worktree   -> /api/v0/city reports nodes=1
APK installed from the head's own build                          -> adb reported Success
SharedPreferences seeded via run-as                              -> 199-byte city-connection.xml
                                                                    present in shared_prefs
adb shell wm size 320x640 ; wm density 320 ; font_scale 1.5      -> applied
```

## Where it failed

```text
adb shell am start -n city.utopia.control/.MainActivity
  -> Error type 3
  -> Activity class {city.utopia.control/city.utopia.control.MainActivity} does not exist
adb shell pm list packages | grep utopia
  -> package:city.utopia.control          (the package IS installed)
adb shell dumpsys activity activities
  -> topResumedActivity = com.google.android.apps.nexuslauncher/.NexusLauncherActivity
```

So: the package is present, but the launcher activity will not resolve. Neither `--version`
nor the first `am start` produced an app process, and `logcat` showed no FATAL /
AndroidRuntime entry. The emulator's package/activity registry is in an inconsistent state
and the cause was **not** determined within this round's budget. The first dump of the round
returned only 1972 characters (the launcher), which is what exposed it.

## Consequence, stated plainly

**The connected narrow-width acceptance is NOT done.** The two remaining UI-102 items stand:

1. keyboard / focus traversal — still covered by no instrument on this task;
2. connected content at narrow width and large font — this attempt failed to reach it.

Nothing here is a product defect and nothing is claimed as passing.

## What the next attempt should do differently

1. **Uninstall, then install fresh**, and verify the launcher activity resolves (`pm dump
   city.utopia.control | findstr MainActivity`, or a plain `am start` on the default
   size/density) BEFORE changing `wm size` / `font_scale`. Changing display metrics first
   meant the failure looked like a layout problem for several minutes.
2. `am start -W` prints `Status`/`TotalTime`; read it rather than assuming the launch worked.
3. Keep the reliable channel: `uiautomator dump`, not `screencap` (this emulator returns an
   all-black framebuffer — recorded in E2E_VERIFICATION_NOTES.md).


## 中文阅读译本 / Chinese reading translation

[完整中文阅读译本](./zh-CN/E2E_CONNECTED_ATTEMPT_FAILED.md)逐节保留解释和历史限制，原代码证据不改写，不产生新的任务状态或验收。 / [Complete Chinese reading translation](./zh-CN/E2E_CONNECTED_ATTEMPT_FAILED.md) preserves the explanations and historical limits section by section, without rewriting code evidence or creating new task state or acceptance.
