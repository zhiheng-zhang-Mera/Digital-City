# RECORD — MESH-301 gate 8: the four-observer table, and exactly what still stands between it and a pass

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 5611e4b
EVIDENCE = evidence/raw/mission-book/MESH-301/alien-side/**  (my receipts + both merge results)
           evidence/MESH-301-mech-receipts @ 54dad12         (Mech's rows, its own)
```

## 1. Window 1 — the complete table, four observers on three physical machines

```text
declared window   03:42:00Z .. 03:54:00Z   (Mech's own window 03:39Z..03:59Z overlapped it)
timeline          the SERVER's own table, 1268 events
skews declared    Alien Web=0, Alien-Host=0 (same machine as the reader), PERM00=586 (measured that run),
                  Mech-Win-Web=-1012 (Mech's own measurement, not mine)

Alien Web      CONVERGED x345   OFFLINE_AT_EMIT x5   MISSING x1
Alien-Host     CONVERGED x342
PERM00         CONVERGED x405   OFFLINE_AT_EMIT x33  GAP_DECLARED x3
Mech-Win-Web   CONVERGED x342                                          <- Mech's row, zero misses

CONVERGED total = 1434        VERDICT = FAILED
  FAIL seq 505 Alien Web: online surface never observed seq 505
```

Everything the gate asks for is present in this one table: **three control surfaces (Alien Web, Mech-Win-Web,
Android `PERM00`) plus an independent desktop probe, on three physical machines, converging on canonical
server `seq` inside a 5000 ms window, with every clock offset declared and measured in the same run.** Mech's
row converged **342/342** with a worst case of 17 ms by its own account.

**And the verdict is FAILED**, on one seq out of 1434, because the instrument will not round a silent miss down
to nothing. That is the correct reading and it is why this record does not claim the gate.

## 2. Window 2 — the fix re-run, and what it proved

A repaired instrument that is not re-run leaves the repair as a **claim**. So window 2 (04:08–04:26Z, 54 tasks,
Mech's surface also inside it) re-ran my three observers with the browser gap fix in place:

```text
Alien Web    CONVERGED x404   GAP_DECLARED x1   OFFLINE_AT_EMIT x1      MISSING x0
Alien-Host   CONVERGED x408
PERM00       CONVERGED x816   GAP_DECLARED x3   OFFLINE_AT_EMIT x33     MISSING x0

CONVERGED total = 1628        VERDICT = INCOMPLETE  (no failure; only declared gaps and one shutdown boundary)
```

`seq 861` — the exact shape of loss that made window 1 `FAILED` — is now `GAP_DECLARED`: the surface names the
hole instead of leaving it silent. **`MISSING x1` became `GAP_DECLARED x1` and the verdict moved from FAILED to
INCOMPLETE.** That is the whole difference between the two runs, and it is the fix working.

## 3. What still stands between this and gate 8

One thing only: **Mech's row for window 2.** Mech's published receipt
(`evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl`) covers **window 1**
(`seq 515..857`, 343 events, `serverMaxSeq=857`) — it ends where window 1 ended, so it cannot serve window 2.
Mech's record says its surface has been observing since `04:00:24Z`, which would cover window 2, but that
stream is not the file published so far.

So the outstanding item is not measurement work, it is one file:

```text
window-2 Mech-Win-Web receipt  ->  merge --window 5000 \
  --skew "Alien Web=0" --skew "Alien-Host=0" --skew "PERM00=587" --skew "Mech-Win-Web=<its own measured>" \
  window2-alien-web.jsonl window2-alien-host.jsonl window2-android-perm00.jsonl <mech window-2 receipt>
```

If that comes back with no failures, gate 8 is met on a clean run with all three surfaces inside one declared
window. If it does not, the finding is the finding.

## 4. Gate status

```text
 2/3/4/5/7   MET
 6           live City 8/8 from my side; Mech reports 11/11 independent negative controls of its own
 8           NOT MET, and precisely one file away from being decidable. Four observers converged 1434 times
             in one declared window; the single FAILED seq is repaired and the repair is verified in window 2
 9           MET on re-convergence; the pre-stale policy question is still the Owner's reading to give
10-14        NOT STARTED
```

The instrument has now produced, in one window, exactly the thing the gate describes — and then refused to
pass it because one surface had lost one event in silence. Both facts belong in the record together: the
measurement is strong, and the bar has not been cleared.
