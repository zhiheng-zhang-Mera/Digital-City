# RECORD — MESH-301: the Android silent-staleness defect is FIXED and verified; two residual findings remain

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ a8fe3ef
```

## 1. Root cause, and it was exactly one line of ordering

The previous round measured that the Android surface lost `seq 233` while its receipt recorded **no `stale`
and no `reconnected`** — a surface that can be silently stale, which the workbook forbids. The cause is now
established rather than suspected:

```kotlin
// refresh()'s failure path, AND the network callback, both did this:
socketOnline = false; socket?.cancel(); socket = null;

// ...and onFailure's guard then read:
override fun onFailure(...) { if (webSocket === socket) { ... log.surface("stale") ... } }
```

Nulling the field **first** made `webSocket === socket` compare against `null`, so the one callback that would
have written the `stale` record was **discarded**. The surface had a state — socket given up, nothing
recorded — that its own receipt could not represent.

The fix is a single surrender point, `dropSocket(message)`: record the `stale`, then cancel, then clear. The
invariant it restores is the point, not the refactor: **a socket is either held, or it was surrendered through
here and the surrender is in the receipt. There is no third state.**

## 2. Verified on the device, by the path that used to record nothing

The straightforward way to test this is to exercise the exact code path that was broken. `adb shell svc wifi
disable` triggers `onLost`, which is one of the two paths that previously wrote nothing:

```text
{"kind":"resync",     "observedAt":1790998092378,"maxSeq":323}
{"kind":"stale",      "observedAt":1790998106918}      <- NEW: the drop is now recorded
{"kind":"reconnected","observedAt":1790998115292}
{"kind":"resync",     "observedAt":1790998115379,"maxSeq":334}
```

Then a desktop probe covered the **same** window while the Android network was cut a second time, so the merge
could judge the gap against an independent observer rather than against the device's own word:

```text
PERM00 states across the run:  BEFORE_OBSERVATION x323, CONVERGED x48, OFFLINE_AT_EMIT x32, MISSING x8
verdict = FAILED
```

`OFFLINE_AT_EMIT x32` is the fix working: those 32 events were emitted while the surface was away, and are now
correctly classified as *not its fault* instead of being counted as misses or, worse, silently omitted.

## 3. Two residual findings, both real, neither smoothed over

### R1 — events emitted between the network dying and the callback firing are still lost (`MISSING x8`)

The 8 remaining misses (`seq 359–364` and two others) fall **before** the `stale` timestamp `03:29:04.360Z`.
The network is already dead; `onLost` has not fired yet. The receipt is therefore honest — it does not claim to
have observed them — but the events are gone, and **a receipt cannot bound a gap it never saw begin**.

This is a genuine limit of a client-driven staleness signal, and it matters for the workbook's requirement
that a stale surface show stale *rather than* presenting missing events as live consistency. The honest
resolutions are one of: a heartbeat the server can use to mark a surface absent, a resync that fetches the
gap and records what was recovered, or an explicit bound in the merge on how long a silent gap may be before
it is a failure. **This is a design decision, not a bug fix, and it is being recorded as open rather than
chosen unilaterally mid-run.**

### R2 — a `resync` can carry a snapshot read BEFORE the socket reopened

```text
resync saw maxSeq 392 but 394 had already been emitted   -> verdict RESYNC_STALE
```

`pendingResync` is set in `onOpen` and consumed by `refresh()`, but `refresh()` also runs on a 2-second
schedule. A scheduled refresh that began before the socket reopened can therefore consume the flag and write a
`resync` stamped with a snapshot read from *before* the reconnection. The surface then observed 393 and 394
anyway, so nothing was actually lost — but **the record of the re-convergence understates what the surface
had**, which is the kind of quiet inaccuracy this programme keeps finding. The fix (bind the resync to an
`open` generation counter rather than a boolean) is small and belongs with R1's decision.

## 4. Gate status — unchanged, and 8/9 remain NOT MET

```text
 2/3/4/7  MET.   5 HALF (reverse direction's tool is in place; Mech has not pressed it).
 6  live City 8/8; the reviewer must rebuild independently.
 8  three surfaces converging in ONE window ....... NOT MET (Mech Web has been exercised, and the Android
                                                     defect is now fixed, but no single window holds all three)
 9  Android offline/reconnect re-converges ........ NOT MET while R1 stands: the surface now SAYS it went
                                                     away, but it still cannot account for the gap's beginning.
10-14  NOT STARTED.
```

The verification run's own verdict is **FAILED**, and that is the correct reading: the fix is proven, and the
convergence claim it was meant to support is not yet earned.
