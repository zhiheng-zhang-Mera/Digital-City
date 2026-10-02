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

## Results — PASS 6/6

```text
[PASS] executor comes online first
[PASS] executor loss is seen by the City - no online node remains
[PASS] the executor is restored and seen online again - node re-registered
[PASS] no raw scheduler token leaks in EITHER phase - 22 tokens, none found in either phase
[PASS] the panel is present in both phases - header present twice
[PASS] the surface FOLLOWED the executor loss, rather than being frozen - failed and recovered renders differ
```

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

**Does not establish, and I am not claiming it:** I did **not** capture the device card's own offline badge in
the failed phase. The panel occupied the viewport and the card was not in the dump, so the failed-phase
reading above is the *panel's* state and not the card's. The card's truthful degradation on executor loss was
observed by Alien and reported in its records; my dump does not corroborate or contradict it, and I would need
another run with a scroll to settle it.

## Evidence

`mission-book/reports/UXI-390/mech-review/android-failure-recovery.json` (both phases' full text, the 22-token
search per phase, and the six results) plus `android-failure-panel-360dp.png` and
`android-recovered-panel-360dp.png`.
