# UI-102 — on-device verification notes (increment 2)

> Host `Mech`. Branch `ui/UI-102-android-product-shell`, head `9965af5` (CI `36869095667`).
> Companion to [DEVELOPMENT_REPORT.md](./DEVELOPMENT_REPORT.md); that report is still the completion
> record and still says `DEVELOPMENT_COMPLETE = false`.

## 1. What was verified on a real device

The app was brought up against a real local Gateway (dev-gateway on the host, plus a seeded
`.runtime/local-config.json`) and the **live view hierarchy** was dumped:

```text
topResumedActivity = city.utopia.control/.MainActivity
connection                              ONLINE
title / copy                            "Devices" · "Your devices. One shared view." · "Waiting for devices"
bottom bar entries, in order            Home · Ask · Rooms · Devices · Activity   ← exactly five
```

That confirms the task's core requirement — *"正常用户不再面对 9 个一级入口"* — on a device rather
than only in source, and it confirms the new theme and the online path both work.

## 2. Reusable technique: pointing a debug build at a real Gateway

The app reads `SharedPreferences("city-connection")` for `host` and `token`. A debug build can be
seeded without any typing, which is what made an end-to-end Android check possible at all:

```text
adb push city-connection.xml /data/local/tmp/
adb shell run-as city.utopia.control cp /data/local/tmp/city-connection.xml \
    /data/data/city.utopia.control/shared_prefs/city-connection.xml

# city-connection.xml
<map>
  <string name="host">http://10.0.2.2:4310</string>   <!-- emulator alias for host loopback -->
  <string name="token">…gateway CITY_TOKEN…</string>
</map>
```

Also useful for creating real records to look at, from the host:

```text
POST /api/v0/ask  {"text":"hash a file","idempotencyKey":"…"}   -> records a real Action
GET  /api/v0/actions?limit=50
```

## 3. What was NOT verified, and the two dead ends to avoid

The folded Actions/Ask panels were **not** captured on a device. Two headless-emulator problems
blocked it; recording them so the next attempt does not repeat the work:

1. **`screencap` returns an all-black framebuffer** (a 7.9 KB 720×1600 PNG) while the display reports
   `Display State=ON`, `mWakefulness=Awake`, and `uiautomator dump` returns a fully populated
   hierarchy. So on this emulator configuration **the hierarchy dump is the reliable instrument and
   screenshots are not**. Every visual claim in the increment-1 report came from a screenshot that did
   work, so this is configuration-dependent, not a claim that screenshots never work.
2. **Synthetic `input tap` did not move the Compose `NavigationBar` selection.** The bottom-bar item's
   bounds were read from the dump and tapped at its centre, yet `page` stayed on `Devices` and the
   title never changed. Reaching a non-bar surface (Actions lives in the header overflow) was
   therefore not possible through this path.
3. One further self-inflicted detour: an `input keyevent 82` sent the app to the launcher, which cost a
   cycle. Avoid stray keyevents during scripted acceptance.

Consequently **narrow-width / font-scale acceptance and the folded-panel demonstration are still
outstanding**, and the report's "what remains" list keeps them.

## 4. Recommended instrument for the next attempt

Use a **Compose UI test in `androidTest`** rather than pixels or synthetic taps. It drives semantics
directly, so it sidesteps both dead ends above, and it can assert the folding property exactly:

```text
onNodeWithText("运行详情").assertExists()          # the collapse affordance is present
onNodeWithText("actionId", substring = true).assertDoesNotExist()   # identifier not on the default path
onNodeWithText("运行详情").performClick()
onNodeWithText("actionId", substring = true).assertExists()          # but reachable once expanded
```

That is a stronger and more durable check than any screenshot, and it would turn "folded, not deleted"
from a code-reading claim into an asserted one. It needs an emulator or device in CI, which the
`android` job already provides for build/test.

## 5. Environment facts worth keeping

```text
JAVA_HOME must be D:\GDPR-Refine\.tools\jdk-17.0.20.1+1
  (machine JAVA_HOME points at a non-existent path; PATH java is JDK 26, which AGP 8.11 rejects)
AVD utopia36 = android-36 google_apis_playstore x86_64, 720x1600 @320dpi, boot ~75-90s
adb shell settings put global hide_error_dialogs 1   # suppresses system ANR overlays
```
