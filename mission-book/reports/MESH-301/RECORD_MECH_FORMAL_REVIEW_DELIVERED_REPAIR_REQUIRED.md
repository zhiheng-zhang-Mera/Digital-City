# RECORD — Mech: Formal Review of MESH-301 is delivered — gates 1-9 and 11 MET, gate 10 PAUSED on ONE required repair

```text
FROM = Mech (formal reviewer)      TO = Alien (development host), Owner
REVIEW HEAD = 09a5b89ab3040873791957d482814f2aefb7271a    REVIEW-HD CI = 37097103737 SUCCESS
VERDICT = gates 1-9 and 11 MET · gate 10 PAUSED on D-R1 · gates 12-14 not started
READ = reports/MESH-301/REVIEW_REPORT.md   (the full review, gate by gate, with its evidence)
RUN  = branch review/MESH-301-mech-formal-review @ 2524692  (my instruments, receipts and the reproduction)
```

## The one thing I need from the development host

**D-R1 — `CLIENT_DISCONNECTED` is a client-level fact emitted at socket level.**

`services/dev-gateway/server.mjs` keys `controlSurfaces` by SOCKET and emits a **ref-level** disconnect whenever
ANY socket for that ref closes. The code's own comment states the opposite intent — *"'the Android client is here,
as PERM00' becomes a canonical fact with its own `seq`"*. Reproduced with two sockets of my own:

```text
AFTER socket B opens   controlSurfaces entries for this ref = 2      <- the same surface listed twice
closing A, B still open:
  entries = 1 (correct)   socket B still open: true
  events: 1344 CONNECTED, 1345 CONNECTED, 1346 DISCONNECTED          <- announces the client LEFT
```

And it is in production, not just in my probe:

```text
seq 473  03:32:35Z  CLIENT_DISCONNECTED android-PERM00   (a superseded socket's late close)
        … and no CLIENT_CONNECTED for PERM00 afterwards — while PERM00's own receipt observes until 04:27:30Z
        and controlSurfaces still lists it with connectedAt 03:32:33Z.
```

A third party reconstructing "which surfaces are online" from canonical events concludes the Android surface left
at 03:32:35 and never returned. **My own gate-1 analysis did exactly that and reported `android: false` for the
whole gate-8 window** — a false negative produced by the product, which is why gate 1 is evidenced from
`controlSurfaces` above and not from the event stream.

**Why I am requiring a repair rather than writing a note:** the fact is false; Owner requirement 3 is that every
device knows what the others are doing, so a surface shown OFFLINE while online is user-visible; the code is this
task's own step-2/4 work; and the fix is small.

**Minimal repair, specified so it cannot be over-built:** keep the map keyed by socket, count sockets per
`clientRef`, emit `CLIENT_CONNECTED` only when the first socket for a ref opens and `CLIENT_DISCONNECTED` only
when the LAST closes, and de-duplicate the snapshot by `clientRef` (earliest live socket's `connectedAt`). No new
field, no new route, no change to the strict-target contract.

## What I will do when it lands

Exactly three checks, no re-review theatre: the D-R1 reproduction, gates 1-9 re-run with the same five
instruments on the new sha, and green hosted CI on that sha. Then gate 10 becomes PASS, `review_complete` becomes
true, and gates 12-14 proceed.

## What the review already settles, so no work is repeated

```text
gate 1  three NAMED surfaces on one City, from controlSurfaces + receipts (anonymous clients never counted)
gate 2  Alien-Win + Mech-Win: distinct principals, both online, fresh telemetry
gate 3  zero android-named nodes; Android is a control surface only
gate 4  MET and BOUNDED - the execution is independently established; the ISSUER rests on the Android receipt.
        I could not corroborate it from canonical truth (no requester) but I could test its provenance
        indirectly, and it passes: that receipt's clock offset is ~601ms, which is the device's own skew and
        cannot be a script on the City host (offset ~0). It was written on the device.
gate 5  both directions, canonical seq chains, including Mech Web driving the product's own Run control at head
gate 6  my own controls at head: 11/11, and 10/10 on the away-target control
gate 7  170/172 untargeted tasks COMPLETED; the 2 failures are typed and honest (gateway restart; node
        re-registered - interrupted work is not replayed); nothing assigned outside the two real workers
gate 8  I REBUILT both windows from the raw receipts: window 1 FAILED on the one silent miss, window 2
        INCOMPLETE with 0 failures and 2033 convergences; plus a fresh review-head window, 29/29, worst 13ms
gate 9  read from the Android receipt (stale -> declared gap 436..470 -> resync to the server's own max)
gate 11 run 37097103737 on exactly this head - and NOT any of the three runs the workbook cites
also    I ran the task's own suites at the frozen head myself: 13/13 pass, exit 0
```

## Reconciliation worth knowing

`git diff --name-only 28b1b0e 09a5b89` returns nine files and **all nine are evidence JSON**. The gate-8 receipts
were produced on product code byte-identical to the frozen head, which is why they are admissible at this head
without a re-run. The live City's `/app.js`, `/index.html` and `/terminal.js` hash-match the head exactly. The
running gateway cannot be hashed from outside; I established it behaviourally (the live City answers with
`controlSurfaces`, which does not exist in `4271cbf^`, and `4271cbf` is the last commit to touch that file) and I
have said so as a limit rather than glossed it.

Non-blocking findings N-1..N-4 (the `-1 ms` negative latencies on Alien-Host, the hard-coded City display name,
the two failure envelopes on the Action route, and the absent requester field) are in §4 of the report.


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_FORMAL_REVIEW_DELIVERED_REPAIR_REQUIRED.md)
