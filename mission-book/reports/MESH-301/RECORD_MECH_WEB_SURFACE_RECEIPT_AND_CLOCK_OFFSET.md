# RECORD — Mech: Mech Web is a live control surface, and its convergence receipt exposes a clock-offset trap

```text
FROM = Mech (endpoint A / formal reviewer)   TO = Alien (development host), Owner
CLOSES THE GAP ALIEN NAMED: "Mech Web has not been exercised - there is no receipt from a browser on the Mech
host", and the Mech side of the three-surface convergence table.
```

## 1. Mech Web is now a real control surface of the canonical City

Read from the City's own snapshot, not from a screenshot:

```text
controlSurfaces BEFORE  [{"clientRef":"android-PERM00","clientLabel":"PERM00"}]
controlSurfaces AFTER   [ android-PERM00 / PERM00,
                          {"clientRef":"web-y8yvunie","clientLabel":"Mech-Win-Web"} ]
nodes                   Alien-Win, Mech-Win          (Android is still NOT a node - gate 3 holds)
```

So a browser **on the Mech host** is attached to the canonical City with its own label, and the label is the
one the surface chose: `window.utopiaWebSurface.rename('Mech-Win-Web')`, with `clientRef` stable across the
rename, which is the identity layering D13/D14 requires.

## 2. The convergence receipt, and the trap in producing one

Its own live stream was captured by wrapping `WebSocket` **before the app loaded**, so what is recorded is what
the surface actually received rather than what a later poll saw:

```text
seq=256 COMMAND_ACCEPTED  server=03:24:00.313Z  observed=03:23:59.315Z  raw=-998ms
seq=257 TASK_CREATED      server=03:24:00.313Z  observed=03:23:59.316Z  raw=-997ms
seq=258 TASK_ASSIGNED     server=03:24:00.587Z  observed=03:23:59.589Z  raw=-998ms
seq=259 TASK_STARTED      server=03:24:00.591Z  observed=03:23:59.595Z  raw=-996ms
seq=260 TASK_CHECKPOINTED server=03:24:00.600Z  observed=03:23:59.602Z  raw=-998ms
seq=261 TASK_CHECKPOINTED server=03:24:01.811Z  observed=03:24:00.813Z  raw=-998ms
seq=262 TASK_COMPLETED    server=03:24:03.026Z  observed=03:24:02.028Z  raw=-998ms
```

**Every raw figure is about −998 ms: the surface appears to observe each event a full second BEFORE the server
emitted it.** That is impossible, and the constant component is therefore **clock offset between the two
hosts**, not latency. Reporting those numbers as "convergence" would have been a fabricated measurement, so:

```text
clock offset estimated by minimum delay (the fastest event bounds the offset):  -998ms
OFFSET-FREE latencies:  0.0, 1.0, 0.0, 2.0, 0.0, 0.0, 0.0 ms
=> UPPER BOUND on this surface's convergence:  2.0 ms        jitter: 2.0 ms
```

**Against the workbook's 5-second window this is not close** — Mech Web converges within milliseconds. But the
finding is the method, not the number:

> **MESH-301 says to rest convergence on the canonical server `seq` rather than comparing three machines'
> clocks. That is necessary and not sufficient.** The convergence *table* still needs a per-event observed-at
> from each surface, and those come from **three different clocks**. On this pair of hosts the offset is ~1 s,
> so a table built by subtracting the server timestamp from each surface's local time yields negative
> latencies for one host and inflated ones for another — with nothing in the output looking obviously wrong.
> The offset has to be **estimated and subtracted per surface**, and this receipt records the estimate rather
> than hiding it. The estimator used is the minimum-delay argument (the fastest event bounds the offset) and it
> is an **estimate**, stated as one.

This is the same class as the defects this programme keeps recording — an instrument that reports a number
without the precondition that makes the number mean anything — and it would have landed inside the
three-surface table, which is the last artifact before handoff.

## 3. Two errors of mine in getting here, both about assuming a shape instead of reading it

1. **`window.utopiaWebSurface.ref/label` are FUNCTIONS**, not values (`ref:webClientRef,label:webClientLabel`).
   Reading them as properties yielded `undefined`, so the first receipt recorded no identity at all.
2. **The stream message nests the event**: `{apiVersion, schemaVersion, event:{seq,type,taskId,timestamp}}`, plus
   bare `{type:'REFRESH'}` keepalives. My first parser looked for `seq`/`taskId` at the top level and therefore
   reported **zero** sequenced events — which I could easily have written up as "the surface receives no
   sequenced events", a product claim, when it was my parsing.
3. And a third, smaller one: the label must be set **before the app connects**, because the surface declares its
   identity at connect time; renaming afterwards does not re-register. The first run registered as
   `Web · Win32`.

## 4. What this does NOT establish

- **The Mech → Alien strict-target direction (step 5.2) is still missing.** This run exercised a plain
  untargeted task so the surface had events to observe; it did **not** strict-target anything, so it does not
  close that item.
- **The other two surfaces' receipts are theirs to produce.** A three-surface table needs three receipts; this
  is one, and it is deliberately a receipt rather than a claim about the other two.
- **It is not a review verdict.** The task is still in development (`development_complete: false`), no review
  claim has been made, and nothing here scores a gate.
