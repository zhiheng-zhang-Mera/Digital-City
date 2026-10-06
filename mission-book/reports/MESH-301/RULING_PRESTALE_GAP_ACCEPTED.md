# RULING — MESH-301: the Owner reads the pre-stale gap as ACCEPTABLE; gates 8 and 9 stand

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
RE   = the one question both hosts independently concluded was the Owner's to settle
```

## 1. The question, the facts, and the ruling

**Facts, measured, not inferred.** Events emitted between the network dying and the client's
`close`/`onLost` callback firing are lost before any staleness signal can exist, so during that window the
surface nominally believes it is online. The surface now **declares** the loss after the fact (`gap` record)
and re-converges by reading the server (`resync` to the server's own maximum). It is *stated*, but it did
happen.

```text
window 1   the loss appeared as MISSING x1 (seq 505)                      -> verdict FAILED
window 2   the same class appeared as GAP_DECLARED x1 (seq 861)           -> verdict INCOMPLETE
complete three-surface table (window 2):  2033 CONVERGED, 0 window breaches, 0 silent misses
residue: 6 unmeasured items, every one named, every one OUTSIDE the measured window
```

Mech independently reproduced both tables from the development host's raw receipts plus its own rows — the
same `FAILED (seq 505)` and the same `INCOMPLETE` at `1434/2033` converged — and then **deferred** its gate-8
classification rather than deciding it, on the grounds that it turns on an Owner ruling rather than on any
surface breaching the 5 s window. Mech was right to defer it.

**RULING: reading A — ACCEPTABLE.**

> The workbook requires that an offline surface (i) shows itself as stale/offline and (ii) re-converges to
> canonical truth on return. Both now hold, provably: `stale` is recorded, the hole is declared, and the
> return is evidenced by a server read rather than a cache. The pre-stale window is therefore not a
> convergence breach, and **gates 8 and 9 stand on the existing evidence.**

## 2. What this ruling does and does not decide

- **It closes the gate-8 classification.** No further code is required for it, and Mech can lift its
  deferral: the table is `2033 CONVERGED / 0 failures` with a named six-item residue, and the residue is
  acceptable by ruling rather than by omission.
- **It does NOT make the pre-stale window imaginary.** It remains a bounded, declared, client-reported loss.
  Reading B — a server-side liveness signal, so the City draws the boundary on a missed heartbeat instead of
  the client reporting its own absence — was the alternative, and it is recorded here as the stronger design
  that this ruling did **not** choose. It stays available as a future increment rather than being quietly
  dropped: the difference between "acceptable" and "not a defect" is exactly the difference that gets lost
  when a decision like this is only remembered as a green tick.
- **It does not touch gates 10–14.** Gate 10 needs a PASS on a frozen review head from the Mech host, and
  nothing in this ruling supplies it.

## 3. State of the task after the ruling

```text
 2/3/4/5/6/7/8/9   MET
10  Formal Review PASS on a frozen review head ...... the reviewer's to give
11  exact review-head CI PASS ...................... follows the freeze
12  main merge + merged-main CI .................... follows the PASS
13  THREE_END_MESH_E2E_ACCEPTED .................... follows the merge
14  post-completion re-entry ....................... follows the terminal marker
```

Development is handed over at `09a5b89` with `development_complete: true` and `DEVELOPMENT_REPORT.md`
published. The next move is Mech's, and it is now unblocked.


[阅读译本 / Reading translation](./zh-CN/RULING_PRESTALE_GAP_ACCEPTED.md)
