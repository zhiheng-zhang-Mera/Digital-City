# RECORD — MESH-301: gate 5 is MET by Mech; the silent-staleness class is closed (R1/R2 fixed and verified)

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 6854209
```

## 1. Step 5.2 is DONE — and Mech did it, from its own Web surface

I did not issue these; the trace is the point, so here it is end to end:

```text
seq 325  03:28:17.068Z  CLIENT_CONNECTED {"clientRef":"web-mech-39xei5vm","clientLabel":"Mech-Win-Web"}
action   03:28:17.540Z  target=Alien-Win  -> task Q-5d076006…  COMPLETED on Alien-Win   (472 ms later)

seq 357  03:29:03.637Z  CLIENT_CONNECTED {"clientRef":"web-mech-bpsf9r9j","clientLabel":"Mech-Win-Web"}
action   03:29:04.085Z  target=Alien-Win  -> task Q-0e068bea…  COMPLETED on Alien-Win   (448 ms later)
```

Two independent confirmations, because "the task exists" alone would not have told me who sent it: the
`Action` records carry the Web UI's own idempotency-key shape (`Date.now()-Math.random()`), **and** each
`Mech-Win-Web` connection precedes its task by under half a second. Both tasks were strictly targeted at
`Alien-Win` and both executed on the Alien host.

**Gate 5 (Alien ↔ Mech mutual strict target) is therefore MET**, with the two directions produced by two
different physical hosts and two different control surfaces: Alien Web → Mech-Win (`seq 267–273`) and
Mech-Win-Web → Alien-Win (above).

## 2. R1 — the surface now declares its own gaps, and `MISSING` is gone

The defect class from the last round was that events emitted between the network dying and `onLost` firing are
gone **before any staleness signal exists**, so no receipt can bound a gap it never saw begin (8 such seqs).
The fix does not need a new server signal, because the surface can see the discontinuity itself: it compares
consecutive `seq` values and writes a `gap` record naming exactly what it missed.

Verified on the device, wifi cut and restored under an independent desktop observer:

```text
{"kind":"stale",      "observedAt":1790998346588}
{"kind":"reconnected","observedAt":1790998354141}
{"kind":"gap",        "gapFrom":436,"gapTo":470}      <- the surface naming its own hole
{"kind":"resync",     "maxSeq":471}                   <- and re-reading the server after it

PERM00 states:  CONVERGED x40,  OFFLINE_AT_EMIT x33,  GAP_DECLARED x3,  MISSING x0
verdict = INCOMPLETE
```

`MISSING x0` where the previous run had `MISSING x8` is the whole result. The three `GAP_DECLARED` seqs are
the part of the hole that fell **outside** the declared offline interval — the pre-`stale` window — and they
are now *stated* rather than silently absent. The verdict is `INCOMPLETE`, not `CONVERGED`, because a declared
hole is still a hole; what changed is that the instrument is no longer being told a lie by omission.

## 3. R2 — the resync is bound to a socket generation

A boolean `pendingResync` was consumed by a `refresh()` that also runs every 2 seconds, so a refresh that had
already started when the socket reopened could stamp the resync with a snapshot read **from before** the
reconnection (measured: `maxSeq 392` while `394` existed). The generation counter is captured *before* the
request, so only a snapshot fetched inside the opening generation may witness a re-convergence. The
`RESYNC_STALE` finding did not recur in this run.

## 4. Also fixed: the desktop probe was connecting anonymously

Canonical truth had been carrying `CLIENT_CONNECTED {"clientRef":null,"clientLabel":null}` for my own probe —
a "surface" that could not be told apart from anyone else's, and that would have quietly weakened the
three-surface table by making one of the three unidentifiable. The probe now declares itself.

## 5. Gate status

```text
 2  two real workers online ................ MET
 3  Android is not a fake worker ............ MET
 4  Android strict-targets Alien and Mech ... MET
 5  Alien <-> Mech mutual strict target ..... MET   (Alien Web -> Mech-Win; Mech-Win-Web -> Alien-Win x2)
 6  negative controls fail-honest ........... live City 8/8; the REVIEWER must rebuild independently
 7  untargeted unregressed .................. MET
 8  three surfaces in ONE window ............ NOT MET — all three have now been exercised, but never inside a
                                              single measured window; that is the only form the gate accepts
 9  Android re-converges after reconnect .... MET on re-convergence (stale -> gap -> resync to server max),
                                              with ONE open policy question below
10-14  Formal Review / CI / merge / marker / re-entry .... NOT STARTED
```

### The one open policy question, stated rather than decided

The pre-`stale` window (events lost before the callback fires) is now **declared**, but it is still a loss
while the surface nominally believed it was online. Two readings are defensible and they are the Owner's
design call, not a mid-run choice of mine:

1. **It is acceptable** — the workbook allows an offline surface to miss events and only requires that it show
   stale and re-converge, which it now does provably (gap declared, then `resync` to the server's own max).
   Under this reading gate 9 is satisfied and the three `GAP_DECLARED` seqs are expected behaviour.
2. **It is not acceptable** — anything lost while the surface had not yet declared itself offline is a silent
   hole of unbounded length in principle, and the honest repair is a server-side liveness signal (the City
   marking a surface absent on a missed heartbeat) so the boundary is the server's to draw, not the client's.

The record states both because the difference is not cosmetic: reading 1 can be satisfied by the client alone,
reading 2 requires a server-side mechanism and therefore a change to the City, which is a larger commitment.

## 6. Next

```text
1. ONE window holding all three surfaces simultaneously (Alien Web + Mech-Win-Web + PERM00) -> gate 8, and
   the only remaining development-side item.
2. Mech's independent instruments and its Formal Review on the review head (step 6) -> gates 10-14.
3. The Owner's reading of §5's open question, since it decides whether gate 9 is already met or needs the
   server-side liveness signal.
```
