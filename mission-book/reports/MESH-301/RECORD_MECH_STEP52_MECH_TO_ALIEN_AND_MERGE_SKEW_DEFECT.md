# RECORD — Mech: step 5.2 closed (Mech control surface → Alien worker), and two defects found in the shared convergence instrument

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
CITY = http://172.31.3.110:4391                    cityId 22e1216b-f124-4d4a-be4a-4a280558c027
PRODUCT UNDER MEASUREMENT = mesh/MESH-301-three-end @ d919dc759f9a375ef8200b6bc7663aa8fa17852c
CLOSES THE GAP ALIEN NAMED, verbatim from RECORD_STEP5_CROSS_HOST_STRICT_TARGET_AND_NEGATIVE_CONTROLS.md §5:
  "One direction only. Alien control surface -> Mech worker is done. Mech control surface -> Alien worker is
   not, and only the Mech host can produce it."
```

## 1. What I ran, and why through the surface rather than around it

The workbook's allowed-change boundary 2 is *"Web / Android 发起 strict-target safe task 的最小交互"*. A script
that POSTs the Action route proves the **route** works; it does not prove the **surface** can issue the
instruction. So the instruction was issued the way a user issues it: on a real browser **on the Mech host**, by
selecting the device in the product's own `#run-target` selector and pressing the product's own `#run` button.

The product identity is not asserted, it is **measured by hash**: the live City at `172.31.3.110:4391` serves
`/app.js` and `/index.html` byte-identical to this branch head (`sha256 4dc4ead1449ca3c5…`, `d8c7025ff1277cd1…`,
24581 and 3120 bytes). A receipt about a surface that is not the reviewed revision is not evidence.

```text
surface identity      ref=web-mech-bpsf9r9j   label="Mech-Win-Web"   (set BEFORE load, so the stream
                                                                      handshake declares it)
selector options      (any), Alien-Win, Mech-Win        <- built from the City's own node list
node fleet            Alien-Win:true, Mech-Win:true
canonical baseline    seq 358 before the press
```

## 2. The instruction, end to end in canonical truth

```text
seq 359 COMMAND_ACCEPTED   task Q-0e068bea-b66c-4061-bf41-a39d0d55e478   (issued from the MECH host)
seq 360 TASK_CREATED       targetDeviceRef=Alien-Win  targetStateAtCreation=ELIGIBLE
seq 371 TASK_ASSIGNED      assignedNodeId=Alien-Win
seq 372 TASK_STARTED       Alien-Win
seq 373 TASK_CHECKPOINTED  Alien-Win  progress=30
seq 380 TASK_CHECKPOINTED  Alien-Win  progress=75  sha256=1fbb08a1…
seq 382 TASK_COMPLETED     Alien-Win  result={bytes:65, sha256:1fbb08a15187f76d1fd0cde7ad3939411a07c4785327e0278cdef1a6c7a7543b}
action  A-17ac7340-92b4-40e5-ae0c-eb251aeb9269  route=CITY_TASK  status=SUCCEEDED
        backendRef.targetDeviceRef=Alien-Win     provenance.targetDeviceRef=Alien-Win
```

Step 5.2 therefore holds as a running fact: **the Mech control surface instructed the Alien worker, strictly,
and the Alien worker executed it**, with the user-level intent readable in canonical Action truth (step 3's
requirement) rather than only on the task row.

Two things this run did *not* have to be arranged for and are worth stating, because they are the reason the
result is credible rather than staged: **the City was under heavy concurrent load from the Alien host** (four
other tasks were being created and executed by both nodes in the same 8-second window, seq 355-395), and the
strictly-targeted task was still assigned to `Alien-Win` and nothing else. **`Mech-Win` was busy with other
work the entire time and was never allowed to take it.**

## 3. This surface's own convergence receipt

Captured by wrapping `WebSocket` inside the page **before app code runs**, so these are the frames the browser
received and when — not a later poll:

```text
seq 359 COMMAND_ACCEPTED   server 03:29:04.098Z  observed 03:29:03.098Z  raw -1000ms  offset-free 1.0ms
seq 360 TASK_CREATED       server 03:29:04.098Z  observed 03:29:03.098Z  raw -1000ms  offset-free 1.0ms
seq 371 TASK_ASSIGNED      server 03:29:06.137Z  observed 03:29:05.138Z  raw  -999ms  offset-free 2.0ms
seq 372 TASK_STARTED       server 03:29:06.142Z  observed 03:29:05.144Z  raw  -998ms  offset-free 3.0ms
seq 373 TASK_CHECKPOINTED  server 03:29:06.147Z  observed 03:29:05.148Z  raw  -999ms  offset-free 2.0ms
seq 380 TASK_CHECKPOINTED  server 03:29:07.352Z  observed 03:29:06.352Z  raw -1000ms  offset-free 1.0ms
seq 382 TASK_COMPLETED     server 03:29:08.560Z  observed 03:29:07.562Z  raw  -998ms  offset-free 3.0ms
clock offset (minimum-delay estimate, this host minus the City): -1001ms
=> upper bound on this surface's convergence for its own instruction: 3.0ms     jitter 2.0ms
34 distinct seq received in the session; every seq inside its window was observed
```

The offset moved from **-998 ms** (my earlier 03:24 receipt) to **-1001 ms** (03:29) without anyone touching a
clock, which is itself the point: this host's clock drifts relative to the City's, so an offset measured once is
a measurement with a shelf life, not a constant to hard-code.

Mech's receipt was also fed to the **development host's own merge**, over the server's canonical timeline, as an
interop check rather than as my review conclusion:

```text
CONVERGED  window=5000ms  surfaces=Mech-Win-Web   (--skew Mech-Win-Web=-1001 declared)
34 events observed · 0 failures · 0 unmeasured
```

## 4. Two defects in the shared convergence instrument — found by using it as documented

Both are in `scripts/mesh301-mesh-probe.mjs` on the task branch. **Neither is a product defect and neither
changes any result already recorded**; both are instrument defects, and the second one is the dangerous kind.

**Defect 1 — `--skew` cannot be combined with positional receipt filenames.** The header documents both
`merge --window 5000 --out convergence.json alien.jsonl mech.jsonl android.jsonl` *and* `--skew PERM00=592`.
Doing both makes the merge treat the skew's **value** as a receipt file:

```text
$ node scripts/mesh301-mesh-probe.mjs merge --window 5000 --skew Mech-Win-Web=-1001 --out x.json mech.jsonl
Error: ENOENT: no such file or directory, open '…\Mech-Win-Web=-1001'
```

The positional-file filter (line 206) excludes only values that start with `--` or match `/^\d+$/`, so `--window`'s
value is filtered and `--skew`'s is not; `--out`'s value is excluded by name. It works with `--file`.

**Defect 2 — and this is the one that matters — a table built without `--skew` still prints `CONVERGED`.**
The check is `latency <= windowMs` with `skew` defaulting to `0` (line 275-277), so a surface whose raw numbers
are all about **-1000 ms** — i.e. apparently observing every event a second *before* the server emitted it — is
scored as converged, and its clock offset is reported in the latency column as if it were a latency:

```text
$ node scripts/mesh301-mesh-probe.mjs merge --window 5000 --out x.json mech.jsonl
CONVERGED  window=5000ms  surfaces=Mech-Win-Web
  359  -999ms   360  -999ms   371  -999ms   372  -999ms …
```

Combined with Defect 1 the failure mode is: the one documented way to declare the offset is the one that
crashes when receipts are positional, and the version that does not crash silently reports clocks as latencies
while saying CONVERGED. **A three-surface table assembled that way would be wrong in a way that looks green.**
Since Android's offset alone is ~592ms and mine is ~1001ms, this is not hypothetical for the gate-8 table.

What I am **not** claiming: that any table already produced was built this way. Alien's recorded run declares
the Android skew, so it used the working path. This is a defect surfaced ahead of the table that needs it.

## 5. An anomaly I found, chased, and had to correct

While reading canonical truth for §2 I saw an entry that should not exist:

```text
controlSurfaces: {"clientRef":null,"clientLabel":null,"connectedAt":"2026-10-03T03:28:48.472Z"}
```

My first reading was *"a stale, unnamed control surface that was never removed"* — which would have been a real
finding about gate 1 and gate 8, because an unnamed entry inflates "how many surfaces are connected" and no
receipt can be attributed to it. I did not report it; I tested it, with my own client, using the same handshake
shape the development probe uses (`apiVersion` + `schemaVersion`, no `clientRef`/`clientLabel`, line 103):

```text
BEFORE                        only android-PERM00
anonymous client OPEN         + {"clientRef":null,"clientLabel":null}    seq 412 CLIENT_CONNECTED {null,null}
anonymous client CLOSED       entry GONE                               seq 413 CLIENT_DISCONNECTED {null,null}
named client OPEN             + {"clientRef":"probe-mech-named","clientLabel":"Mech-Probe-Named"}
named client CLOSED           entry GONE                               seq 415 CLIENT_DISCONNECTED {…}
```

So the corrected finding is narrower, and the alarming half was **mine, not the product's**:

1. the City's control-surface list is a **live-connection** list and it is maintained correctly — entries are
   removed on close, for named and unnamed clients alike;
2. **identity is optional on the stream handshake**, so any stream client is counted as a control surface even
   when it declares nothing. The development probe is one such client, so a probe's connection is
   indistinguishable in that list from a real endpoint;
3. therefore gate 1's "three control endpoints" must be read from **named** entries only, and the list length is
   not evidence of anything. At the moment of my step-5.2 run an unnamed client (consistent with the development
   probe mid-run) was connected alongside the two named surfaces.

## 6. One independent negative control, on the confusion this task's audit is actually about

MESH-301's design audit exists because control clients and worker nodes were confused with each other. So the
control I added is that mistake, made deliberately: **the surface named its own label as a target device.**

```text
POST /api/v0/actions  input.targetDeviceRef="Mech-Win-Web"   (a real, currently-connected control surface)
-> http 200, action.status=REFUSED, error.code=TARGET_DEVICE_UNKNOWN
   "no City node identity \"Mech-Win-Web\" is known to this City",  backendRef.taskId=null
```

Refused, typed, and **no task created** — a control surface is not a device, even though its label is visible in
the same City snapshot. The value is deliberately different from the ones Alien's probe uses
(`No-Such-Device`, `not a valid id`, `__no_such_device__`): this one is a *plausible* mistake rather than an
obviously invalid string.

## 7. My own instrument failed once, and it failed on a successful run

Recorded because it is the same class of defect this programme keeps finding, and because leaving it out would
make the receipt look cleaner than the run was.

Attempt 1 issued the instruction correctly and it **executed on Alien-Win** (`seq 326-332`, `TASK_COMPLETED`,
`sha256 85ff02bc…`). My instrument then aborted with *"no TASK_CREATED strictly targeted at Alien-Win appeared"*,
because it looked for the target inside `TASK_CREATED.payload.targetDeviceRef` — and that event's payload is
`{}`. **The target is a property of the task, not of the creation event.** The instruction had run; the
instrument could not see it, and its message would have read as a product fault. Fixed by keying on the task set
before/after the press. The failed attempt's receipt is written too, so a run that aborts cannot be mistaken for
a run that never happened.

## 8. What this does NOT establish

- **Not the three-surface table.** This is one surface's receipt. Gate 8 needs Alien Web, Mech Web and Android
  observing a **common** window, each writing its own receipt; mine can be merged with the others but cannot
  stand in for them.
- **Not the offline/reconnect half for this window.** This run never took a surface away. Alien exercised
  offline/reconnect with a browser probe and Android must still do its own (gate 9).
- **Not an offline-target wait.** Both nodes were online throughout, so the "target away → wait, no silent
  fallback" case is not reproduced here; Alien recorded it separately (and I have not yet independently
  reproduced it — that belongs to the review).
- **No Formal Review, no review-head CI, no merge, no terminal marker.** Gate 5.2 being closed is not gate 10.

## 9. Decisions I made where the workbook did not choose for me

```text
MECH-D1  Issue the instruction through the product's own affordance (#run-target + #run), not a scripted POST.
         Rationale: boundary 2 is about the SURFACE's interaction; a POST would prove less and look like more.
MECH-D2  Verify the running product by hashing the served assets against the branch head rather than trusting
         that the City is running the reviewed revision. A receipt about an unknown revision is not evidence.
MECH-D3  Label the surface "Mech-Win-Web" and set it BEFORE load. Distinct from Alien's "Alien Web" so that
         canonical truth can tell the two browsers apart; before load because the identity is declared in the
         stream handshake and renaming afterwards does not re-register (a mistake I already made once).
MECH-D4  Write my own instrument rather than reuse scripts/mesh301-web-surface.mjs, because independent review
         may not lean on the development host's script - but emit the SAME JSONL record vocabulary, because that
         is interop with the shared merge, not dependence on it.
MECH-D5  Report only offset-corrected figures as latencies, and state the offset as an estimate. The raw column
         is published beside it so the correction can be audited rather than trusted.
MECH-D6  When an anomaly looks like a product defect, run the smallest experiment that can falsify MY reading
         before reporting it. §5 is the result: the alarming half was my misreading, and saying so is cheaper
         than a retraction later.
```

## 10. Evidence, and where it is

Kept on the Mech host, in the mesh301 review worktree:

```text
mech-mesh301-step52.mjs                                            the instrument (mine)
evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-strict-target.json
evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-strict-target.jsonl   (merge vocabulary)
evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-convergence-merge.json
.runtime/tmp/mesh301-anon-surface-probe.mjs                        the §5 experiment
.runtime/tmp/mesh301-cityprobe.mjs                                 the read-only control-plane probe
```

I am **not** pushing these onto `mesh/MESH-301-three-end`: that branch has one development owner and mixing a
reviewer's raw evidence into it is exactly the cross-host head collision the Owner asked both hosts to avoid
("避免与Alien机同时处理相同文件"). I will publish them on the review branch at Formal Review time, and can hand
the `.jsonl` over earlier if the three-surface merge needs a Mech Web row — asking for it is cheaper than
guessing.

## 11. What I need from the development host, and what I will do next

1. Whether the `--skew` defect above should be repaired on the task branch before the gate-8 table is assembled
   — it is your instrument and your decision, and if it is left as is the table must use `--file` plus `--skew`,
   never positional filenames.
2. The window you want the three surfaces to observe together, so my next Mech Web receipt can cover the same
   seq range as Alien Web's and Android's instead of standing alone.

Meanwhile, and without needing an answer: the Mech host stays online as endpoint A (`Mech-Win` worker,
`Mech-Win-Web` on demand, resident City and desktop shortcut up), and I will keep verifying the aliasing between
"a client connected" and "a named endpoint connected" so that gate 1 is claimed from named surfaces only.
