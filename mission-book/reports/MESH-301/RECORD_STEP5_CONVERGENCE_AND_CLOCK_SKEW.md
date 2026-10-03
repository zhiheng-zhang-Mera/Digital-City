# RECORD — MESH-301 step 5: the Android surface measures its own convergence, and a 592 ms clock skew that would have been reported as latency

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ d9a3bac
```

## 1. A two-surface bounded-convergence measurement, one of them the real Android device

```text
surfaces       Alien-Host (desktop probe on the Alien host)   PERM00 (the Android app, on the device)
window         5000 ms
timeline       taken from the SERVER's own event table (223 events), not from the union of the receipts
result         Alien-Host 0 ms   PERM00 13-97 ms (median ~15 ms)   every measured seq CONVERGED
verdict        INCOMPLETE — solely because the Alien-Host probe's own shutdown boundary is unmeasurable
```

The Android receipt is written **on the device**, by the app, in the same JSONL vocabulary as the desktop
probe (`start` / `event` / `stale` / `reconnected` / `resync` / `stop`), so `merge` reads an Android receipt
beside a desktop one and produces ONE table.

### D16 — the surface records its own observation, not a number computed about it

- **问题**: step 5 asks for each surface's observed-at per canonical `seq`. The Android app is not a Node
  process, so it cannot run the desktop probe.
- **选择**: the app writes its own receipt, `files/surface-observations.jsonl`, from the event-stream callback.
- **判断逻辑**: the whole point of the step is that the number is what Android observed when Android observed
  it. A timestamp produced on the host, or derived from a later snapshot, would be a **claim about** Android
  wearing the shape of a measurement by Android — and this programme has already been bitten repeatedly by
  instruments that could not fail. One session is one receipt (`surfaceReset()` truncates) because the
  two-sessions-in-one-file defect was already found once, in the desktop probe, by running it.

## 2. THE FINDING: a constant offset is a clock, not a latency

The first two-surface merge reported Android at **~606 ms for every single event** while the other surface
reported **0–1 ms**. That pattern is diagnostic: a *constant* offset across every event is not delivery
latency, it is a clock difference. Measured directly, the device clock is **592 ms** off.

Reporting that as convergence latency would have been a **600 ms lie in the shape of a measurement** — the
worst kind, because it is precise, reproducible and wrong. It would also have passed the 5 s window and looked
like evidence.

- **选择**: `merge` takes a declared `--skew <surface>=<ms>`, and the receipt keeps **both** the raw and the
  corrected figure.
- **判断逻辑**: silently subtracting an offset would hide where the number came from, and the correction itself
  carries the uncertainty of however the offset was measured (here, across an `adb` round trip). Keeping both
  lets a reviewer disagree with the correction instead of having to trust it. With the skew declared, Android
  converges in **13–97 ms** — the real delivery latency.

Recorded for mechanical reasons as well: the workbook explicitly warns against comparing three devices' local
clocks, and this is what that warning looks like as a number.

## 3. Offline and reconnect, exercised for real rather than staged

The City was restarted twice during this work with the Android app attached. The app went `stale`, retried,
reconnected, and re-read the SERVER (`resync`), which is exactly the path step 5.6 requires; and its
`CLIENT_CONNECTED` with `{"clientRef":"android-PERM00","clientLabel":"PERM00"}` appears in the canonical
stream after each restart (`seq 156` after the first).

## 4. Completion-gate status, stated precisely

```text
 2  Alien + Mech two real distinct worker nodes, both ONLINE ............ MET (measured, running)
 3  Android is not faked as a worker node ............................... MET (nodes = Alien-Win, Mech-Win only;
                                                                              Android is in controlSurfaces)
 4  Android strict-targets Alien and Mech once each ..................... MET (seq 157-163, seq 164-170)
 5  Alien and Mech mutually strict-target ............................... HALF (Alien -> Mech DONE, seq 16-76;
                                                                              Mech -> Alien NOT DONE: needs Mech)
 6  negative controls fail-honest ....................................... MET on the live City (8/8), but the
                                                                              reviewer must rebuild them itself
 7  untargeted tasks unregressed ........................................ MET (Android-issued untargeted task
                                                                              completed; suite 1041/1043)
 8  three online surfaces converge within the bounded window ............ PARTIAL: two surfaces measured
                                                                              (desktop + Android); Mech Web absent
 9  Android offline/reconnect re-converges .............................. PARTIAL: reconnect observed twice;
                                                                              needs a receipt across a measured
                                                                              window
10  Formal Review PASS by another physical host ......................... NOT STARTED
11  exact review-head CI PASS .......................................... NOT STARTED (branch CI green per push)
12  main merge + merged-main CI ........................................ NOT STARTED
13  THREE_END_MESH_E2E_ACCEPTED ........................................ NOT STARTED
14  post-completion re-entry ........................................... NOT STARTED
```

## 5. What is missing, and who can supply it

Only two things now stand between this and a development report that Mech can review:

1. **The Mech host's control surface** — a browser on Mech pointed at this City, labelled, plus Mech's own
   `observe` receipt, and **Mech → Alien strict-target** (step 5.2). None of this is producible from here; the
   Mech host has the tool on `mesh/MESH-301-three-end` and its own identity already works.
2. **Mech's independent instruments** — step 6 requires the reviewer to rebuild the scenario rather than read
   my report, so Mech's negative controls and its own convergence receipts are the review, not a duplicate.
