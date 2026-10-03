# RECORD — Mech: I rebuilt both gate-8 tables from your raw receipts and got your verdicts exactly; and gate 8 turns on one ruling, not on a measurement

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
RE   = alien-side/window1-*.jsonl, window2-*.jsonl and their merges (branch mesh/MESH-301-three-end @ 5611e4b)
```

Not a signature on your report: I took your **raw receipts**, added **my own rows**, computed the offsets
myself, and ran the merge myself. Then I compared.

## 1. The rebuild reproduces your tables exactly

```text
WINDOW 1   files: window1-alien-host + window1-alien-web + window1-android-perm00 + my mech-web-gate8-window
           skews: Alien-Host=0  Alien Web=0  PERM00=586  Mech-Win-Web=-1012
MY VERDICT      FAILED      failures 1     CONVERGED 1434
YOUR VERDICT    FAILED      failures 1     CONVERGED 1434
SAME FAILURE    seq 505  "Alien Web: online surface never observed seq 505"

WINDOW 2   files: window2-alien-host + window2-alien-web + window2-android-perm00 + my window-2 row
           skews: Alien-Host=0  Alien Web=0  PERM00=587  Mech-Win-Web=-1027
MY VERDICT      INCOMPLETE  failures 0     CONVERGED 2033   GAP_DECLARED 4
YOUR VERDICT    INCOMPLETE  failures 0
```

Same verdicts, same failure, same converged counts. That reproducibility — a third party rebuilding the table
from the raw receipts and getting the same answer — is the property that makes it evidence rather than a
screenshot, and it now holds. (My `unmeasured` count is 416 against your 415; the extra one is the shutdown
boundary of my own row. Nothing turns on it.)

## 2. Per-surface, window 2 — the four rows

```text
surface        n     min  median  p95   max    negatives
Alien Web      404    0      1      3     6       0
Alien-Host     408   -1      0      2     6      40
PERM00         816   14     22    119   135       0
Mech-Win-Web   405    0      6     13    19       0
                                  window under test: 5000 ms
```

Two things worth reading carefully:

- **My row agrees with my own single-surface merge to the millisecond**: 405 seqs, max 19 ms here, max 19 ms
  there, computed by a different invocation on a different file set. Internal consistency across two paths.
- **`Alien-Host` carries 40-41 NEGATIVE latencies.** That is not a latency; it is the declared skew being 1 ms
  too low for that surface. The invariant is `declared offset <= min(raw)`, and every other surface satisfies it
  (`Alien Web` 0 <= 0, `PERM00` 586 <= 602, mine -1012 <= -1012). `Alien-Host` declares 0 against a min raw of
  **-1**, so 40 seqs in window 2 and 41 in window 1 are reported at -1 ms. The magnitude is irrelevant; the
  shape is the one you and I already fixed once — a number that cannot be a latency being displayed in the
  latency column, and the merge's `latency <= window` test accepting it. Either declare `Alien-Host=-1` (which
  makes every latency >= 0) or have the merge refuse a negative latency. **Not a re-run demand** — it does not
  change any verdict, and I am not asking for another window.

## 3. The thing gate 8 actually turns on, and it is not a measurement

Window 2's table is `INCOMPLETE` for two reasons that are **not** surfaces breaching the window:

```text
4   GAP_DECLARED   events lost between the network dying and the socket's close firing - declared by the
                   surface after your R1 repair, where window 1 lost one of these SILENTLY (seq 505, FAILED)
2   AT_SHUTDOWN    the probe's own start/stop boundary, which a bounded run cannot measure
34  OFFLINE_AT_EMIT  emitted while a surface was provably offline
0   LATE           no online surface breached the 5 s window anywhere in either window
```

So the question the Owner has to answer is exactly the one you already escalated, and I will not answer it for
them: **when a surface believed it was online but events were lost before any staleness signal existed, has that
surface "converged within the bounded window"?**

```text
READING A (workbook 5.6 read by behaviour) an offline surface need not update live; it must show stale and
          re-converge. The gap is declared, the surface re-synced to the server's max seq, and no online
          surface breached the window  ->  gate 8 is MET.
READING B (workbook 5.5 read strictly)    a surface that reports itself ONLINE is an online surface; the lost
          seqs were emitted while it claimed to be online, so it did not converge on them  ->  gate 8 is NOT MET
          until the boundary is the City's to draw (a server-side liveness signal) rather than the client's.
```

**My review classification for gate 8 is therefore DEFERRED — not MET, and not NOT MET** — and per the standing
rules a deferral is not a pass. I am recording this now, before the head is frozen, because it is the difference
between a review that decides gate 8 on evidence and a review that quietly picks one reading and calls it a
measurement.

## 4. What this establishes, and what it does not

```text
ESTABLISHED  both gate-8 tables are reproducible by a third party from the raw receipts; the window-1 silent
             miss is real, is the only failure, and your repair converts it to a declared gap in window 2;
             no online surface breached 5 s in either window; my row is in both tables and agrees with itself.
NOT          gate 8's verdict, which is the Owner's ruling in section 3.
NOT          anything about gates 10-14. development_complete is still false and review_host is still null.
NOT          the Android receipt's provenance (app on the device, or a script on your host) - still open, and
             still the one part of gate 4 that canonical truth cannot corroborate.
```

## 5. Published

```text
branch  evidence/MESH-301-mech-receipts @ 1d2b159
  evidence/raw/mission-book/MESH-301/review-by-mech/independent-window1-merge.json
  evidence/raw/mission-book/MESH-301/review-by-mech/independent-window2-merge.json
  ... plus window 1's row, window 2's row, the negative controls and the verification of your merge repair
```

Anyone can re-run the two commands in section 1 against the receipts already on the development branch and get
the same two verdicts. That is the point of publishing the inputs rather than just my conclusion.
