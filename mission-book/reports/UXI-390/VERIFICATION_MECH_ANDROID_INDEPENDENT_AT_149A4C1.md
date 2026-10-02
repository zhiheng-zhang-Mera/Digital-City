# VERIFICATION — Mech: INDEPENDENT Android acceptance at the reviewed head `149a4c1`, on a 360dp narrow screen

```text
FROM = Mech (Review host)   TREE = 149a4c14b596b92f04fab6269eca1dcb7727303f  (verified by git rev-parse)
DEVICE = utopia36 AVD, sdk_gphone64_x86_64, Android 16, 720x1600 @ 320dpi = 360dp
STATUS = part of the UXI-390 REVIEW. Gate items are scored only in the review verdict, not here.
```

## Why this run exists

Gate item 4 claims "Real dual-device E2E" MET on the strength of a Web E2E and an **Android device
acceptance that only Alien had ever run, on Alien's physical device**. §3 forbids a review resting on the
developer's own measurement for the half the reviewer cannot see, so this is the first independent Android
measurement of this task. Alien's handoff also states that narrow-screen coverage "is the reviewer's to add
under section 3 if it judges it necessary" — 360dp is exactly that.

## Method

Everything in one process, because the harness kills the process tree when the invoking call ends: a real
Gateway and a real reference node are spawned on a distinct port with a fresh `CITY_DATA`; the executor is
killed **first** and work created second, so the work cannot complete and the panel has a genuine waiting
state to explain (Alien's recipe, reused); the app's own stored connection is seeded for THIS run through
`/data/local/tmp` + `run-as cp` with this run's token; `adb reverse` links the device loopback; the app is
force-stopped and relaunched; and every bottom-bar tab is walked, dumping the rendered UI tree on each.

**The first attempt screenshotted the wrong page** — the tab walk left Activity open, so the image showed the
event timeline, not the scheduler panel. That is recorded rather than quietly replaced: the image was not
evidence for the claim it was meant to support. The re-capture **asserts its own precondition** and refuses
to capture unless the panel header is confirmed on screen, which is the discipline Alien's own capture
scripts apply and the reason its three instrument faults were caught.

## Results, measured

**1. No raw RS-290 scheduler token leaks into the rendered UI by default — PASS.** All 22 contract tokens
(`PRESSURE_PAUSED`, `USER_DEVICE_DISABLED`-family, `FRESHNESS_*`, `AT_CAPACITY`, `SESSION_CONGESTED`,
`LOAD_UNMEASURED`, `POLICY_EXCLUDED`, `CHANNEL_READINESS_UNKNOWN`, `AVAILABILITY_UNKNOWN`,
`REMOTE_STATE_UNKNOWN`, `REMOTE_ONLINE`, `SESSION_ENDED`, `CREDENTIALS_MISSING`, `REGION_UNSUPPORTED`,
`SELECTABLE`, `DEVICE_ONLINE`, `STRUCTURAL`, `RESOURCE`) were searched across **every tab's** rendered text —
50 distinct strings over 6 pages — and **none was found**. Gate item 2 is independently confirmed on Android,
on a narrow screen.

**2. The panel renders user language, and only on the Devices page** — matching the Web surface's placement:

```text
WHY THINGS ARE WAITING
Running in a reduced state
The current service is responding slowly. Use another available one?
Some of what this depends on is not fully known right now.
Not available · This device isn't taking new work
Cancel
Choose another service
SCHEDULING DETAIL
展开
```

**3. The honest affordance is real in pixels, not just in source.** In the capture, `Cancel` renders in the
live accent colour and `Choose another service` renders **greyed out** — which is `supportedActions =
setOf("CANCEL")` and the `live = handler != null && token in supportedActions && token !in UNWIRED_ACTIONS`
rule showing up on the glass. That is the repair from `8ab8225`/`cd298c3` independently confirmed at the
reviewed head.

**4. The Advanced disclosure is present and collapsed** on the panel (`SCHEDULING DETAIL` + an expand
affordance), which is the Android half of the item whose Web half I found absent and Alien then fixed.

## Visual-critic findings at 360dp (the half §3 assigns to the review host)

**V-1 — the expand/collapse affordance is a HARDCODED CHINESE literal in a shared component.**

```kotlin
apps/android/app/src/main/java/city/utopia/control/ui/UtopiaComponents.kt:243
  Text(if (open) "收起" else "展开", style = ..., color = ...)
```

Every user-visible string around it in the same view is English — `WHY THINGS ARE WAITING`, `SCHEDULING
DETAIL`, `Cancel`, `Choose another service`, `Not available · …` — so one control renders Chinese inside an
otherwise English panel. The `title` parameter *is* localized; only the affordance is not, because it is a
literal rather than a string resource.

**Attribution, stated so it is not mis-scored:** `TechnicalDetails` lives in the shared
`ui/UtopiaComponents.kt` and is **reused** by the scheduler panel rather than reimplemented, which is the
correct "folded, not deleted" discipline. The defect is therefore in the **frozen UI-190 baseline component**,
not introduced by UXI-390. It is recorded because it surfaces in the reviewed surface and because gate item 5
asks for visual consistency — but it should be attributed to the baseline, not charged to this task.

**V-2 — the raw task id wraps and collides with the state label at 360dp.**

`Q-6c889879-2ee2-4e63-8793-bc2f3bb98205` is laid out as a right-hand column that wraps into **four** narrow
lines (`-2ee2-4e63`, `-8793-bc2f`, `3bb98205`) sitting immediately beside `Running in a reduced state`, so the
id's fragments visually run into the state text and the reading line is broken. On the 1440x900 Web captures
Alien took this does not appear, which is precisely why narrow-screen coverage is the reviewer's to add. The
id is also raw product vocabulary rendered on the default reading path, which is adjacent to — though not the
same as — gate item 2's prohibition, since the id is not one of the 22 contract tokens.

This one I am **not** attributing yet: it is a layout property of the panel, which UXI-301 authored, but
whether UI-190's surface already established this id rendering needs a look at the baseline before it is
charged to anyone.

## Evidence

`mission-book/reports/UXI-390/mech-review/` — `android-sweep.json` (all 6 pages, every rendered string, the
22-token search and its empty result), `android-panel-texts.json` (the capture's own precondition flag and
texts), `android-devices-360dp.png` (the **wrong-page** first capture, kept because deleting it would hide
the fault), and `android-panel-devices-360dp.png` (the panel, captured only after the header was confirmed
on screen; sha256 `91bf81aa0d7d9dc25b439de68f96f8f04005824f7a1acbd9e0fd58a7be293708`).

**Policy tension disclosed rather than resolved by me:** `PROCESS_DATA_POLICY.md` line 16 forbids piling
screenshots into City, which is why Alien's pixels live in the implementation repo. A visual-critic finding
and a visual Owner gate both need pixels, so I am publishing two small ones here and flagging it for the
Owner rather than reinterpreting the policy unilaterally. If the ruling is that they must not live in City,
they can be regenerated exactly by re-running the two scripts recorded in this report.
