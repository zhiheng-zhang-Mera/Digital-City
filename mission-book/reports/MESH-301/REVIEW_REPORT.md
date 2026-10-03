# MESH-301 — FORMAL REVIEW

```text
REVIEWER        Mech (endpoint A) - a different physical host from the development host
REVIEW HEAD     09a5b89ab3040873791957d482814f2aefb7271a   (mesh/MESH-301-three-end)
REVIEW-HD CI    37097103737  COMPLETED SUCCESS on exactly that sha  ("V0.2 checks": android + gateway-web)
METHOD          preregistered at reports/MESH-301/PREREGISTRATION_MECH_FORMAL_REVIEW.md, BEFORE the head existed
VERDICT         gates 1-9 and 11 MET · gate 10 PAUSED on ONE required repair (D-R1) · gates 12-14 not started
```

## 1. Section 7 — exact-head reconciliation

Every line below is a measurement taken at claim time, not a quotation from the development report.

```text
development_complete                        true
workbook development_head_sha               09a5b89ab3040873791957d482814f2aefb7271a
remote branch tip (ls-remote, not a local
ref that could be stale)                    the SAME sha
review_host before the claim                null            (nothing overwritten; the claim is in the workbook)
host separation                             development Alien · review Mech
```

**The head is the code, not just the commit.** Two independent checks, because a review of a sha that is not what
ran is a review of nothing:

```text
(1) RECEIPT LINEAGE.  git diff --name-only 28b1b0e 09a5b89  returns NINE files and every one of them is under
    evidence/raw/mission-book/MESH-301/alien-side/. So the gate-8 receipts, which were produced while the branch
    was at 28b1b0e, were produced on product code that is byte-identical to the frozen head. The head adds
    evidence and nothing else. This is why the window-2 table is admissible at this head without re-running it.

(2) LIVE ASSETS.  the canonical City at 172.31.3.110:4391 serves, byte for byte:
        /app.js        sha256 4dc4ead1449ca3c5…  == 09a5b89:apps/web/app.js
        /index.html    sha256 d8c7025ff1277cd1…  == 09a5b89:apps/web/index.html
        /terminal.js   sha256 63dd08a542a4d862…  == 09a5b89:apps/web/terminal.js
    The three browsers and the strict-target Run control I exercised were the reviewed revision.

(3) RUNNING GATEWAY.  a long-lived process cannot be hashed from outside, so this was decided by behaviour:
    the live City answers with `controlSurfaces` and emits `CLIENT_CONNECTED/DISCONNECTED`, and neither exists in
    4271cbf^:services/dev-gateway/server.mjs - so the running server.mjs includes 4271cbf - and 4271cbf is the
    LAST commit to touch server.mjs, whose blob at the head is identical. The running gateway therefore contains
    the head's server.mjs. LIMIT, stated rather than glossed: this is behavioural identity, not byte identity.
```

## 2. Gate-by-gate

```text
GATE 1  three real control endpoints simultaneously on one canonical City ......... MET
GATE 2  Alien + Mech are two real, distinct worker nodes .......................... MET
GATE 3  Android does not pretend to be a worker node .............................. MET
GATE 4  Android strict-targets Alien and Mech, once each .......................... MET (bounded, §4)
GATE 5  Alien and Mech strict-target each other ................................... MET
GATE 6  negative controls fail honest (away / unknown / malformed / duplicate) .... MET
GATE 7  untargeted tasks: no regression ........................................... MET
GATE 8  bounded convergence on canonical seq, three surfaces ...................... MET
GATE 9  Android offline/reconnect re-converges .................................... MET (read from its own receipt)
GATE 10 Formal Review PASS ........................................................ PAUSED - one required repair
GATE 11 exact review-head CI ...................................................... MET
GATES 12-14 merge / merged-main CI / terminal marker / re-entry ................... not started, not claimed
```

**Gate 1.** `controlSurfaces` on the canonical City, at three separate samples during this review, lists
`PERM00` and `Mech-Win-Web`; the City's own connection events place `Alien Web` (`web-e622eirv`) online
03:59:59.657Z → 04:27:24.315Z and `Mech-Win-Web` (`web-mech-z20yxrrj`) 04:00:27.306Z → 04:34:32.181Z, so the
declared gate-8 interval is covered by both, and `PERM00` by its own receipt. All three carry a NON-EMPTY
clientRef and clientLabel, i.e. they are attributable endpoints and not anonymous stream clients. **How this gate
must be evidenced is itself a finding — see D-R1: the event stream cannot be used to reconstruct presence.**

**Gate 2/3.** `Alien-Win` (win32) and `Mech-Win` (win32) both `online:true` with heartbeats inside 4 s of the
sample, distinct `devicePrincipalId`s, and telemetry (`cpu`, `memory`, `disk`, `uptimeSeconds`) from both. The
node list contains NO android-named identity: `android-named nodes: 0`. Android appears only as a control
surface, which is what the design audit required.

**Gate 4.** Two strict-target instructions from the Android-side run are in canonical truth and each was executed
by its named device: `Q-fa5c5669…` → `Alien-Win` (created 03:15:26.912Z, COMPLETED, assigned Alien-Win) and
`Q-cfc3912a…` → `Mech-Win` (created 03:15:59.663Z, COMPLETED, assigned Mech-Win). The Android surface's own
receipts cover both windows. **Bounded, and the bound matters**: canonical truth carries no requester (D-R2 in
the development record; I verified the Action and task key sets myself), so what is independently established is
*that a strict-target instruction for each device was accepted, persisted, executed only by that device, and
finished with a result digest*; *that it was the Android device which issued them* rests on the Android receipt.
That receipt's provenance I could test indirectly and it passes: its minimum raw clock offset is ~601 ms, which
is the device's own skew and cannot be a script on the City host (offset ≈ 0). So it is a device-side receipt,
not a host script wearing the device's name.

**Gate 5.** Both directions, canonical seq chains, in the strict-target task list: Alien-side → `Mech-Win`
(`Q-6958c120…`, seq 16-76, incl. `TASK_TARGET_WAITING` OFFLINE → `TASK_TARGET_READY` → `TASK_ASSIGNED` Mech-Win)
and Mech-side → `Alien-Win` (my own run `Q-0e068bea…` seq 359-382, and again at the review head `Q-22aa3d23…`
seq 1310-1316 through the product's own `#run-target` + `#run` controls).

**Gate 6.** My own instruments, my own values, re-run at the frozen head: **11/11** on the control suite
(unknown → `TARGET_DEVICE_UNKNOWN`; malformed → `TARGET_DEVICE_MALFORMED`; a control surface's label offered as a
device → refused as unknown with no task; identical retry replays the same task and action; one key cannot be
reused for a different device → http 400 `IDEMPOTENCY_KEY_REUSED` with no task created) and **10/10** on the
away-target control, which takes THIS host's worker away on purpose: the task is created and WAITS with
`TASK_TARGET_WAITING targetState=OFFLINE reason=TARGET_DEVICE_OFFLINE`, the healthy other node does not take it
for 15 s, and on return `TASK_TARGET_READY` (seq 1303) precedes `TASK_ASSIGNED` to Mech-Win (seq 1304).

**Gate 7.** 172 `CHECKPOINT_DEMO` tasks in canonical truth: **170 COMPLETED, 2 FAILED**, and the two failures are
honest infrastructure outcomes rather than regressions — *"Gateway restarted during execution; create a new task
to retry safely"* and *"Node re-registered; interrupted work is not replayed"*. No untargeted task was assigned
to anything other than the two real workers, and 3 further untargeted tasks created inside my review run all
completed.

**Gate 8.** I rebuilt BOTH windows from the raw receipts with my own invocation rather than reading the published
tables:

```text
window 1  FAILED      1 failure   CONVERGED 1434   the failure is the one the development record names:
                                                    seq 505 "Alien Web: online surface never observed seq 505"
window 2  INCOMPLETE  0 failures  CONVERGED 2033   GAP_DECLARED 4 · LATE 0
```

and I re-ran a fresh Mech-surface window at the review head: `CONVERGED`, 29/29 seqs, 0 failures, worst case
13 ms against the 5000 ms bound, clock offset `-1034 ms` measured in that same run.

I also **withdrew my own earlier gate-8 objection** after measuring it instead of inferring it: filtering the
merged timeline to the declared interval `04:08:00Z-04:26:00Z` gives **376 entries and ZERO
GAP_DECLARED/MISSING/LATE for any of the four observers** — the residue lies outside the interval under test.
(Recorded in full in `RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md`.)

**Gate 9.** Read from the Android surface's own receipt: one `stale` (03:32:26.587Z), one `reconnected`
(03:32:34.141Z), a declared `gap` `436..470`, and a `resync` to the server's own max seq (471) — i.e. the
surface shows stale, names its hole, and re-converges on the City's truth rather than on its own. Not
independently reproducible by me: I can read the device's receipt, I cannot re-run its radio.

**Gate 11.** Run `37097103737` on exactly `09a5b89`. The three runs the workbook's `development_ci` cites are on
`28b1b0e`, `5611e4b` and others — none of them is this head, which is precisely why the exact-head reading is not
a formality. I also ran the task's own two suites at the frozen head myself: **13/13 pass, exit 0**.

## 3. Required repair — D-R1: `CLIENT_DISCONNECTED` is a client-level fact that is emitted at socket level

**Found by the review, reproduced with my own client, in code this task added.** The gateway's own comment states
the design intent: *"so 'the Android client is here, as PERM00' becomes a canonical fact with its own `seq` that
every surface can converge on — rather than something each surface infers privately from the state of its own
socket."* The implementation does not deliver that:

```js
controlSurfaces.set(ws, {...identity, connectedAt: now()});   // keyed by SOCKET
emit('CLIENT_CONNECTED', null, {clientRef, clientLabel});
ws.on('close', () => { const gone = controlSurfaces.get(ws); controlSurfaces.delete(ws);
                       if (!closed) emit('CLIENT_DISCONNECTED', null, {clientRef: gone?.clientRef, …}); });
```

Reproduction with two sockets of my own, same `clientRef`, both open:

```text
AFTER socket A opens   controlSurfaces entries for this ref = 1
AFTER socket B opens   controlSurfaces entries for this ref = 2     <- the SAME surface listed twice
closing A, B still open:
  controlSurfaces entries for this ref = 1     (correct)
  CLIENT_* events: 1344 CONNECTED, 1345 CONNECTED, 1346 DISCONNECTED   <- announces that the client LEFT
  socket B still open: true
AFTER socket B closes  controlSurfaces entries = 0   (cleanup on the last socket is correct)
```

**The consequence is in production, not in a laboratory.** The Android surface holds more than one socket across
a reconnect, and canonical truth therefore contains a false client-level disconnect for it:

```text
seq 471  03:32:33.531Z  CLIENT_CONNECTED     android-PERM00   (new socket)
seq 473  03:32:35.488Z  CLIENT_DISCONNECTED  android-PERM00   (the SUPERSEDED socket's late close)
…and NO further CLIENT_CONNECTED for PERM00 - while PERM00's own receipt shows it observing continuously until
04:27:30Z and controlSurfaces still lists it with connectedAt 03:32:33.531Z.
```

So a third party reconstructing "which surfaces are online" from the City's event stream — the canonical truth
the workbook tells devices to converge on — concludes that the Android surface left at 03:32:35 and never came
back. **My own gate-1 analysis did exactly that and reported `android: false` for the whole gate-8 window.** That
is a false negative produced by the product, and it is the reason gate 1 is evidenced from `controlSurfaces`
above rather than from events.

Why this is a required repair and not a note:

```text
* it is a canonical fact that is false, and canonical truth is what the whole task is built on;
* Owner requirement 3 is that every device knows what the others are doing - a surface that appears OFFLINE
  while it is online is a user-visible wrong state, not an internal detail;
* it is in the code this task introduced for control-surface identity (step 2/4), inside the allowed boundary
  ("the minimal connection configuration for three control endpoints pointing at one canonical City");
* it is small and precisely specified (below), so the cost of repairing it is one commit, not one round.
```

**Minimal repair, specified so it cannot be over-built:** keep the map keyed by socket, but make the EVENTS
client-level by counting sockets per `clientRef`: emit `CLIENT_CONNECTED` only when the first socket for that
ref opens, emit `CLIENT_DISCONNECTED` only when the LAST socket for that ref closes, and expose the snapshot
de-duplicated by `clientRef` (one entry per surface, `connectedAt` = the earliest live socket). No new field, no
new route, no change to the strict-target contract.

## 4. Non-blocking findings, recorded so they are not re-discovered later

```text
N-1  Alien-Host declares clock skew 0 against a minimum raw of -1 ms, so 40 seqs in window 2 and 41 in window 1
     appear at -1 ms - a number that cannot be a latency, in the latency column. No verdict changes. Fix by
     declaring -1, or by having the merge refuse a negative latency.
N-2  displayName is hard-coded 'Utopia · Alien' in services/dev-gateway/server.mjs and pairing.mjs, so the Mech
     host's resident City also introduces itself as "Utopia · Alien". cityId differs and is the real identity, so
     nothing is broken; a human comparing two City snapshots side by side would be misled.
N-3  the Action route answers failures in two envelopes: a refused TARGET is http 200 with an Action whose
     status is REFUSED, while a reused idempotency key is http 400 with a top-level {error, errorCode} and no
     Action. Defensible, but a client must handle both - it misled my first control run.
N-4  neither the Action nor the City task carries a requester, so the issuing surface of an instruction is not
     attributable from canonical truth. This bounds gate 4, as stated in §2.
```

## 5. What I did NOT independently establish, whatever the verdict

```text
* that the Android app (rather than anything else on that device) wrote the Android receipts - bounded, and the
  clock-offset argument in §2 gate 4 is the strongest available evidence, not proof;
* gate 9 as lived by the device - read from its receipt, not re-enacted;
* byte identity of the RUNNING gateway process with the head - behavioural identity only (§1(3));
* the Alien host's internal instrumentation - I re-ran it from its published receipts, I did not build it;
* the pre-stale boundary policy question, which remains the Owner's reading to give.
```

## 6. Evidence

```text
review branch   review/MESH-301-mech-formal-review   (instruments + receipts + the reproduction of D-R1)
instruments     mech-mesh301-review-analysis.mjs        canonical-truth analysis for gates 1/2/3/4/5/6/7
                mech-mesh301-duplicate-socket-probe.mjs  the D-R1 reproduction
                mech-mesh301-step52.mjs                  Mech Web -> Alien-Win through the product's own control
                mech-mesh301-offline-target.mjs          away-target control
                mech-mesh301-negative-controls.mjs       the independent negative-control suite
                mech-mesh301-observe-window.mjs          a surface-observed window, one receipt per window
receipts        evidence/raw/mission-book/MESH-301/review-by-mech/*   (17 evidence files in this head all parse)
```

## 7. What happens next

Gate 10 stays PAUSED until D-R1 is repaired and verified. On the repaired head I will re-check exactly three
things and no more (§8 minimal repair, no re-review theatre): the D-R1 reproduction, that gates 1-9 still hold on
the new sha by re-running the five instruments, and that the new sha has its own green hosted CI. If all three
hold, gate 10 becomes PASS, `review_complete` becomes true, and gates 12-14 proceed.
