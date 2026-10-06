# VERIFICATION — Mech: Android device FAILURE and RECOVERY, independently measured at the reviewed head

```text
FROM = Mech (Review host)   TREE = 149a4c14b596b92f04fab6269eca1dcb7727303f
DEVICE = utopia36 AVD, 720x1600 @ 320dpi = 360dp, installed APK sha256 095ca640e806...
RESULT = PASS 6/6
```

## Why this exists

My own verdict recorded this as a boundary: "**I did NOT independently re-drive the Android device
failure/recovery scenario** (`40f9665`). That leg remains the author's evidence. It is the one named
acceptance property for which I have no measurement of my own." That was true when written and is not true
now, so the record is being corrected rather than left with a stale disclaimer in it.

## Method

Executor brought up, **killed**, then work created — so the panel has a genuine waiting state that cannot
drain — then the executor **restored**. Every phase is dumped from the real device UI tree, and screenshots
are taken in both. The installed APK was hash-checked against the reviewed-head build before the run.

## Results — PASS 7/7

```text
[PASS] executor comes online first
[PASS] executor loss is seen by the City - no online node remains
[PASS] the executor is restored and seen online again - node re-registered
[PASS] no raw scheduler token leaks in EITHER phase - 22 tokens, none found in either phase
[PASS] the panel is present in both phases - header present twice
[PASS] the surface FOLLOWED the executor loss, rather than being frozen - failed and recovered renders differ
[PASS] the DEVICE CARD itself reports the loss truthfully, not as healthy
```

**The card reading, which the first run failed to take**, is the one that settles the property. The panel
occupies the viewport, so the card had to be scrolled into view, and a second dump in the failed phase shows:

```text
Alien-PC
OFFLINE · Cached
Platform: win32 · Agent 0.2.0
CPU: Unavailable
Memory: 24.2 GB / 31.7 GB
Last seen: 42s ago
Last snapshot: 2:24:50 PM
```

`OFFLINE · Cached` on the badge, `CPU: Unavailable` where it read 19–21% while online, `Last seen` advancing,
and the retained memory figure shown **as cached** rather than presented as live. That is degradation that
distinguishes what it knows from what it is guessing, and the recovered phase takes the same card back to
`ONLINE` with live CPU and `Last seen: 0s ago`. Both ends of the transition are measured on the card, not
inferred from the panel.

**Failed phase**, verbatim from the device, two task cards: `Running in a reduced state`,
`The current service is responding slowly. Use another available one?`,
`Some of what this depends on is not fully known right now.`,
`Not available · This device isn't taking new work`, `Cancel`, `Choose another service`,
`SCHEDULING DETAIL` / `展开`. The City link still reads `ONLINE`, which is **correct** — the gateway is alive;
it is the *executor* that died, and the panel distinguishes those two facts rather than collapsing them.

**Recovered phase**, verbatim: the panel returns to `Nothing is waiting to run.` and the device card reports
`Alien-PC / ONLINE / Platform: win32 · Agent 0.2.0 / CPU: 21.0% / Memory: 24.2 GB / 31.7 GB / Last seen: 1s
ago` — live telemetry rather than a stale badge, so the recovery is a measurement and not a cached claim.

## What this does and does not establish

**Establishes:** the Android surface reflects an executor loss and its restoration truthfully, in user
language, with no contract-token leak in either phase, and the two phases render differently — so the surface
follows reality rather than being frozen at render time. That is the property the workbook names.

**The caveat this document carried in its first version is now closed.** It said the device card's own offline
badge had not been captured because the panel occupied the viewport. It has since been captured by scrolling,
and it is quoted above. Alien's earlier observation of the same card is now **corroborated by my own
measurement** rather than merely uncontradicted.

**Still not established, and not claimed:** that the emulator's rendering is identical to Alien's physical
device. This is a 360dp emulator; the card reading agrees with the author's report, which is corroboration and
not proof of device-independence.

## A method note kept because it nearly cost the result

The new card check reported PASS while its printed detail was **truncated to the first 220 characters**, and
those characters were all panel content. Read at face value it looked like the check had passed on the wrong
region. I went back to the stored JSON and printed the full scrolled dump before accepting it — which is where
the card reading above comes from. The same reflex that caught this is the one that caught a silently
unapplied mutation earlier in this task, and it is recorded here because the truncated-detail case will recur.

## Evidence

`mission-book/reports/UXI-390/mech-review/android-failure-recovery.json` (both phases' full text, the 22-token
search per phase, and the six results) plus `android-failure-panel-360dp.png` and
`android-recovered-panel-360dp.png`.


[阅读译本 / Reading translation](./zh-CN/VERIFICATION_MECH_ANDROID_FAILURE_RECOVERY.md)
