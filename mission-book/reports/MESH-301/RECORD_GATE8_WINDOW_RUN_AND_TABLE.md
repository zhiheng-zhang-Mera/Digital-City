# RECORD — MESH-301 gate 8: the declared window RAN, all three surfaces overlapped, and the table is FAILED on one finding

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 28b1b0e
```

## 1. The window happened, and the overlap is measured rather than assumed

```text
Alien's declared window   03:42:00Z .. 03:54:00Z
Mech's declared window    ~03:39Z    .. ~03:59Z          (published in RECORD_MECH_GATE8_WINDOW_OPEN.md)
overlap                   yes, and observed live: at 13:45:53 local (03:45:53Z) the City reported
                          android-PERM00 / PERM00,  web-p35glw68 / Alien Web,
                          probe-alien-host / Alien-Host,  web-mech-f8r3wwq7 / Mech-Win-Web
canonical stream          857 events by the end; a task issued every ~20 s for the whole window, so the table
                          cannot converge vacuously (the defect found once already)
```

Mech's reading of the merge was right and worth keeping: a surface only needs to **overlap** the window, not
match it, because seqs outside a surface's own range are already reported as `BEFORE_OBSERVATION` /
`AFTER_OBSERVATION`. A wide window costs nothing and absorbs the coordination latency of two hosts talking
through Git.

## 2. The table from this host's three observation sources, verdict exactly as the instrument returned it

```text
surfaces   Alien Web (browser), Alien-Host (desktop probe), PERM00 (Android device)
window     5000 ms
timeline   taken from the SERVER's own table (857 events)
skews      Alien Web=0, Alien-Host=0  (same machine as the reader),  PERM00=586 ms  (measured this run)

Alien Web    CONVERGED x345   OFFLINE_AT_EMIT x5   MISSING x1
Alien-Host   CONVERGED x342
PERM00       CONVERGED x405   OFFLINE_AT_EMIT x33  GAP_DECLARED x3

VERDICT = FAILED
  FAIL seq 505 Alien Web: online surface never observed seq 505
```

Two things are true at once and both matter:

- **The convergence itself is strong**: 1092 measured observations across three independent observers on two
  physical hosts, every one of them inside a 5 s window, and the Android surface now records **zero** silent
  misses (`GAP_DECLARED` covers its three, and they are outside the window, from the earlier outage).
- **The gate is not met**, because the verdict says FAILED and one genuinely unobserved seq is a failure. The
  instrument refusing to round `MISSING x1` down to nothing is the instrument working.

## 3. The one finding, and it is the same defect class one surface over

`seq 505` was emitted between the network dying and the browser socket's `close` firing — before any staleness
signal exists. That is precisely the R1 class already fixed in the Android app, and the browser surface had no
counterpart to the Android gap self-declaration, so the merge could only call it `MISSING`.

Fixed in `mesh301-web-surface.mjs`: the page now compares consecutive `seq` values and writes a `gap` record
exactly as the Android app does. **Parity is the point, not the one seq**: a convergence table that holds
three surfaces to three different standards of self-reporting is not a table.

## 4. A second finding worth recording on its own: a declared clock skew expires

```text
PERM00 skew measured in the previous round   592 ms
PERM00 skew measured this round              586 ms
```

The offset **drifts**, so a skew declared once and reused is a number that slowly stops being true — and it
would drift silently inside a column that reads as latency. Any table must therefore declare a skew measured
**in the same run as the receipts it judges**, which is what this one does. Mech's `--skew` defect and this
one are the same hazard approached from two directions: the instrument must never be able to present an
assumption it did not just check.

## 5. What is still missing for gate 8, precisely

**Mech's row.** `Mech-Win-Web` was inside the window, but the receipt file is not in this checkout — Mech's
record says the exact open/close seqs, read from the server *and* from the surface's own receipt, will be
published in its closing record. As soon as that receipt lands, it merges as a fourth row with no re-run:

```text
node scripts/mesh301-mesh-probe.mjs merge --window 5000 \
  --skew "Alien Web=0" --skew "Alien-Host=0" --skew "PERM00=586" --skew "Mech-Win-Web=<measured>" \
  alien-web.jsonl alien-host.jsonl android-perm00.jsonl mech-web-window.jsonl
```

## 6. Gate status

```text
 2/3/4/5/7   MET
 6           live City 8/8; Mech reproduced the offline-target control 10/10 on its own worker and made
             endpoint A reversible, which is its own instrument rather than mine
 8           NOT MET - all three overlapped one window for the first time, the table resolved 1092
             observations inside the window, and the verdict is FAILED on one seq that is now repaired.
             A re-run with the browser fix, plus Mech's row, is what closes it.
 9           MET on re-convergence; the pre-stale policy question remains the Owner's to read
10-14        NOT STARTED
```

The honest summary of this round: **the scheduling problem is solved and the table is one repaired finding
away from being complete** — and it is reported as FAILED rather than as a pass with a footnote.
