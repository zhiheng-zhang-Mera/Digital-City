# RECORD — MESH-301 gate 8: the complete three-surface table is in, with ZERO failures

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 09a5b89
EVIDENCE = evidence/raw/mission-book/MESH-301/alien-side/window2-three-surface-merge.json
           evidence/MESH-301-mech-receipts @ 9aa3e60   (Mech's window-2 row, its own)
```

## 1. The table

```text
declared window     04:08:00Z .. 04:26:00Z
timeline            the SERVER's own event table, 1269 events
bounded window      5000 ms
clock offsets       Alien Web=0, Alien-Host=0 (same machine as the reader), PERM00=+587 ms,
                    Mech-Win-Web=-1027 ms   -- every one measured in THIS run, none reused

surface         CONVERGED   corrected latency  min / max / avg
Alien Web          404        0 ms /   6 ms /  1.2 ms
Alien-Host         408       -1 ms /   6 ms /  0.5 ms
PERM00             816       14 ms / 135 ms / 42.4 ms      (the Android device, over wifi)
Mech-Win-Web       405        0 ms /  19 ms /  6.2 ms      (Mech's own browser, its own receipt)

CONVERGED total = 2033          FAILURES = 0
instrument verdict = INCOMPLETE
```

**Three control surfaces on three physical machines, one canonical City, converging on canonical server `seq`
inside a 5000 ms window, with every clock offset declared and measured in the same run — and not one breach of
the window.** The worst single observation in the whole table is 135 ms against a 5000 ms bound, and it belongs
to the device on wifi.

## 2. The residue, item by item, because `INCOMPLETE` must not be waved through

Six events are unmeasured. None is a convergence breach, and each has a name:

```text
PERM00        gap 436..470   x3   the earlier declared outage, OUTSIDE this window
Alien Web     gap 861..861   x1   the pre-stale single-event loss - DECLARED, not silent
Alien-Host    AT_SHUTDOWN    x1   the probe's own shutdown boundary
PERM00        AT_SHUTDOWN    x1   the receipt's own shutdown boundary
```

The `gap 861..861` line is the whole point of the repair: in window 1 the identical loss appeared as
**`MISSING x1`** and made the verdict `FAILED`. Here it appears as **`GAP_DECLARED x1`** — the surface naming
its own hole. The event is still lost; what changed is that nothing about it is hidden.

The instrument returns `INCOMPLETE` rather than `CONVERGED` because it refuses to call a run converged while
any event is unmeasured. That is the correct behaviour and it is left exactly as it is.

## 3. Why this is gate 8, stated against the workbook's own words

The gate reads: *三个在线 surface 对 canonical event seq 在 bounded window 内收敛.* The measurement is:

- three online surfaces (Alien Web, Mech-Win-Web, Android `PERM00`), plus an independent fourth observer
  (the desktop probe), all attached to the same `cityId` at the same time;
- convergence measured against canonical server `seq` and the server's own `timestamp`, never a device clock;
- **2033 convergences, zero window breaches, zero silent misses**;
- offline/reconnect behaviour exercised inside the same discipline (declared `stale`, declared `gap`,
  `resync` to the server's own maximum on return).

**Gate 8: MET**, on that evidence, with the instrument's verbatim verdict (`INCOMPLETE`, failures 0) and the
six-item residue published above rather than summarised away.

## 4. Mech's corroboration of the skew finding, and it is stronger than mine

Mech measured the inter-host clock offset across four successive windows:

```text
-998 ms  ->  -1001 ms  ->  -1012 ms  ->  -1027 ms
```

A monotonic drift of 29 ms over four windows. So a declared skew is not merely "best measured fresh" — it is
**measurably stale** if reused, and the drift is large enough to matter against a 5 s bound once a window gets
tight. This is now a shared finding between the two hosts, reached independently, which is the strongest form
it could take.

## 5. Gate status

```text
 2/3/4/5/7/8   MET
 6             live City 8/8 from this side; Mech reports 11/11 of its own, independently built
 9             MET on re-convergence; the pre-stale policy question remains the Owner's reading to give
10-14          NOT STARTED — and gate 10 is NOT satisfied by any of the above. It is satisfied by a PASS on a
               frozen review head, which is Mech's to produce.
```

`DEVELOPMENT_REPORT.md` is published for the review. The next move is Mech's: freeze a review head, review it
with its own instruments, and report PASS or findings — and if findings, the repair relay runs from there.


[阅读译本 / Reading translation](./zh-CN/RECORD_GATE8_MET_THREE_SURFACE_TABLE.md)
