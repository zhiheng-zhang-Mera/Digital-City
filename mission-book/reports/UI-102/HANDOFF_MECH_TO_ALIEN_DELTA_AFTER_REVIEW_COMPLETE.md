# UI-102 — handoff Mech → Alien: post-review delta, needs a delta review

```text
MISSION                  = UI-102 (Android 产品壳与信息架构)
FROM                     = Mech (development host)
TO                       = Alien
REVIEWED_HEAD            = ed4a663a4724c228d971809efcf42f113a9d7ca3   (your conclusion head)
BRANCH_TIP_NOW           = 61598be960a7137225d029fe08ccd678cdb6d506
DELTA_COMMITS            = 42ff112 (fix, CI 36889119939 success), 61598be (evidence)
UNIT_TESTS               = 70 passed, 0 failures  (was 68 at your conclusion head)
```

## Read this first: the PASS does not cover the current branch tip

Your review is complete and recorded as **PASS_WITH_REPAIRS** with conclusion head
`ed4a663`. `ed4a663` is your own R-1 repair. After that head, Mech pushed two further
commits, so **the branch tip is no longer the reviewed head** and your verdict must not be
read as covering it.

This is not a request to reopen your review retroactively. It is a flag that the artifact
you signed off and the artifact now on the branch differ, which the exact-head binding rule
exists to catch. A delta review of `42ff112` is required, or the delta must be consciously
excluded from the frozen baseline.

## Why the delta exists at all

The ordering was genuinely awkward and is worth stating plainly rather than hiding:

1. Your note 2 recorded R-1 as **confirmed-but-unrepaired** with a planned repair, and
   `review_complete` false. Mech read that as the development host owning the repair and
   began implementing it, including the screenshot evidence your §4.1 said was missing.
2. While that was in flight you completed the review and repaired R-1 yourself in `ed4a663`.
3. Mech's commit was then rebased onto `ed4a663` rather than pushed over it. Your commit is
   the base and nothing of yours was discarded or rewritten.

Mech's commit was pushed after your verdict landed, but was authored before it was known —
so it is an unintentional post-review delta, not a contested repair.

## What the delta actually changes

It does **not** re-litigate R-1. It keeps your `relativeAge` and deletes the duplicate
helper Mech had written (`ageLabel`), so there is exactly one such helper.

*   `relativeAge` reused for the card's `Observed:` line, which Web also renders with
    `age()` and which was still printing a raw ISO value.
*   `clockLabel` added for the **absolute** timestamps, which R-1 did not cover and which
    Web renders with `formatTime()` rather than `age()`: `Last snapshot`, the activity feed
    timestamp, and per-event timestamps in the device detail block. Four of five raw
    call sites remained, and the workbook's completion gate is truth parity with Web.
*   Both helpers share `parseIsoInstant`, which accepts the offset-bearing form as
    JavaScript's `Date.parse` does. `Instant.parse` alone rejects it, so R-1 would degrade a
    valid offset timestamp to `Unavailable` where Web renders an age.
*   Fallback wording follows **your** decision (`Unavailable`, the card's existing
    convention) rather than Web's `device.unknown`, because R-1 settled that.
*   Your `RelativeAgeTest` (4 tests) is kept unchanged. Mech's superseded age test was
    removed rather than left to drift against yours.

## Evidence that closes two of your four unverified items

Your §4.1 — *"the clipping fix has no screenshot evidence"* — is now closed from pixels.
Your §4.2 is partly closed: two more configurations are independently captured.

| config | node state | rendered | screenshot |
| --- | --- | --- | --- |
| 320 dp @ 1.5 | fresh heartbeat | `Last seen: 0s ago`, `Last snapshot: 4:04:24 PM` | `v4-320dp-font1.5.png` |
| 360 dp @ 1.0 | fresh heartbeat | `Last seen: 1s ago`, `Last snapshot: 4:04:41 PM` | `v4-360dp-font1.0.png` |
| 320 dp @ 1.5 | stale heartbeat | `Last seen: 1004s ago` | `v3-320dp-font1.5.png` |

At both sizes the device card shows a relative age and the footer a local clock time, the
five bar labels render in full, and **zero raw ISO-8601 timestamps remain anywhere on the
surface** (checked by regex against the dumped text, not by eye). The age ticks `0s` → `1s`
between the two captures, which is direct evidence the per-second `now` in `DeviceCard`
drives the value rather than a one-shot read.

These are the development host's captures, so they are **not independent** and do not
substitute for your verification — but the artifact you said was unverified now exists and
can be checked cheaply.

## Process disclosure you should weigh

`ed4a663` is **implementation code on the product branch, written by the host reviewing
it**. That is precisely what `CONSTRUCTION_RULES.md` §3 separates, and Mech's earlier
handoff had stated the repair would come from the development host.

Mech did **not** revert it: discarding a correct, tested repair would be worse, and
rewriting your commit would be worse still. But the consequence is concrete — the current
head contains code from both hosts, so no single host can be the sole author and sole
verifier of it. That is raised for the Owner rather than resolved unilaterally.

## Consequence for UI-190, which is now in flight

`UI-190` is `IN_PROGRESS` with `development_host: Alien` and integration landed at
`d81d52f`. That integration was built from an earlier UI-102 head, so it does **not**
contain this delta. If the frozen UI baseline is meant to include the complete R-1 repair
(all five call sites, offset-tolerant parsing, and the absolute-timestamp formatting), then
UI-190's integration needs to pick up `61598be` before the freeze — or consciously record
that it excludes it. Mech is not touching UI-190's branch.

## What Mech is not claiming

Not claiming the delta is reviewed, not claiming UI-102's PASS covers it, and not claiming
the delta makes UI-102's unverified list empty. Still open from your §4: keyboard/focus
traversal (no instrument on Mech's host either — `androidx.test`/`ui-test` absent from both
offline caches), and a composition-level test of the measured-fit path.
