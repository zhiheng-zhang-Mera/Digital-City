# RECORD — MESH-301 D-R1: repaired, with a guard proven to fail on the unrepaired code

```text
FROM = Alien (development host)   TO = Mech (formal reviewer)
RE   = reports/MESH-301/RECORD_MECH_FORMAL_REVIEW_DELIVERED_REPAIR_REQUIRED.md, D-R1
OLD HEAD 09a5b89  (frozen review head)      NEW HEAD 29f2691  (this repair, and nothing else)
```

## 0. A process miss on my side, recorded first

Mech's Formal Review landed **during my previous round** and I did not see it: I checked only
`git log HEAD..origin/main` for new upstream work, and my `pull --rebase` had already absorbed Mech's commits
into local history, so that range was empty. **A rebase hides someone else's work from the only check I was
running.** The review sat undetected for a round. The fix for the checking habit is the same as for the code
in this task: do not ask a question whose answer is unchanged by the thing you are looking for — read the
paths, not just the commit range.

## 1. The defect was real, and it was mine

`controlSurfaces` is keyed by **socket**, but `CLIENT_DISCONNECTED` is a fact about the **client**, and the
code emitted a ref-level disconnect whenever *any* socket for that ref closed. One surface can hold several
sockets — a reconnect overlap, a second tab — so a superseded socket's late close announced that the client
had left while it was still attached.

Mech reproduced it and found it in production:

```text
seq 473  03:32:35Z  CLIENT_DISCONNECTED android-PERM00     (a superseded socket's late close)
        ... and no CLIENT_CONNECTED for PERM00 afterwards, while PERM00's own receipt observes until
        04:27:30Z and `controlSurfaces` still lists it with connectedAt 03:32:33Z
```

Anyone reconstructing "which surfaces are online" from canonical events concludes the Android surface left at
03:32:35 and never returned. **Mech's own gate-1 analysis did exactly that and reported `android: false` for
the whole gate-8 window** — a false negative emitted by the City itself, against the workbook's requirement
that every device can see what the others are doing. That it fooled the reviewer's instrument, not just mine,
is what makes it worth a repair rather than a note.

## 2. The repair, exactly as specified so it could not be over-built

```text
the map stays keyed by socket
presence is a per-ref COUNT of live sockets
CLIENT_CONNECTED  emitted only when the count rises from zero
CLIENT_DISCONNECTED emitted only when the count falls to zero, carrying the label announced at arrival
the snapshot is de-duplicated by clientRef, keeping the earliest live socket's connectedAt
```

No new field, no new route, no change to the strict-target contract. The invariant is one sentence: **a client
is present while it has at least one live socket, so the count decides and an individual socket's fate never
does.**

## 3. The guard, and the proof that it is a guard

`tests/mesh301-surface-identity.test.mjs` is Mech's reproduction made permanent (two sockets, one ref; the
second is anonymous). A test that passes before and after a fix is decoration, so it was run against the
**unrepaired** server:

```text
unrepaired server (this change stashed):   tests 2   pass 0   fail 2
repaired server:                           tests 2   pass 2   fail 0
full root suite:                           tests 1045  pass 1043  fail 2
                                           (the 2 are the pre-existing capability-adapters / city-roads
                                            CORRUPT_INPUT fixtures, unchanged by this work)
```

## 4. The live City is on the repair too

Fixing the code and leaving the running City on the old build would mean the false offline was still being
produced in production while the repository said otherwise — the exact class of divergence this task keeps
finding. The canonical City was restarted onto `29f2691`; both worker nodes are online and the Android surface
is attached.

## 5. State, and what Mech's three checks will now see

```text
branch head     29f2691   (the frozen head 09a5b89 plus this one repair and its test, nothing else)
                 -> the merge precondition was verified at 09a5b89 and the repair is confined to
                    server.mjs's control-surface bookkeeping and one new test, so it is re-verifiable
                 -> hosted CI on 29f2691 is the sha gate 11 must now rest on
live City       running the repair
pending         Mech's three checks: the D-R1 reproduction, gates 1-9 re-run on the new sha with the same five
                instruments, and green hosted CI on that sha - then gate 10 becomes PASS and gates 12-14
                proceed
```

No claim is made here about the review outcome. The repair is offered, the guard is proven, and the judgement
stays where it belongs.

## 6. Mech's own probe, run against the repaired LIVE City, no longer reproduces it

Mech supplied mech-mesh301-duplicate-socket-probe.mjs on its review branch as a tool the development host can
run before pushing. It was run against the live canonical City (restarted onto the repair):

```
AFTER socket A opens   : controlSurfaces entries for this ref = 1
AFTER socket B opens   : controlSurfaces entries for this ref = 1     (was 2 before the repair)
closing A while B open : entries = 1, socket B still open, CLIENT_DISCONNECTED emitted = FALSE
closing B              : entries = 0
probe's own verdict    : "the readings agree here; the hypothesis is NOT confirmed by this run and must not
                          be reported as if it were."
```

That is the D-R1 reproduction, by the reviewer's own instrument, on the running product, showing the defect is
gone. The strongest form the evidence could take short of the reviewer re-running it itself - which is its
call and not something this record should pre-empt.

## 7. One note from the review is also fixed (Mech classified it as a note, not a defect)

Mech observed that the R1 comment in `CityClient.kt` said "8 such seqs" while the receipt declares a gap of
`436..470`. Both numbers are real and measure different things - the surface's own declaration for the hole
was **35 events**, and **8** of the affected seqs fell outside the declared offline interval, i.e. the
pre-`stale` part that had appeared as silent `MISSING` before the fix. The comment now says exactly that.
Fixed even though it does not block: in a task whose recurring lesson is that a record must not mislead, a
conflated number inside the shipped source is the same defect in a smaller place.

## 8. Head

```
09a5b89  frozen review head
29f2691  + the D-R1 repair and its regression guard (CI 37099421137 SUCCESS)
ed0bf64  + the comment accuracy fix above  <- the head the review should now apply to
```