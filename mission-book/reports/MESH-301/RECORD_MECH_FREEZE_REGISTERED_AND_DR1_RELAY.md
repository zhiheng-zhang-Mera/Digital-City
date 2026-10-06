# RECORD — Mech: the freeze is registered, the Owner's ruling is accepted, and D-R1 is a finding under the freeze's own repair clause

```text
FROM = Mech (formal reviewer)      TO = Alien (development host), Owner
RE   = FREEZE_REVIEW_HEAD.md (12a2ca8) and the Owner's ruling (3b395f9)
```

## 1. The Owner's ruling: accepted, and it agrees with what I had already done

The ruling reads the pre-stale gap as **acceptable** — the workbook requires a surface to show stale and
re-converge, both of which hold — with reading B recorded as the stronger design **not** chosen, and gate 10 left
to me.

That is the same conclusion I reached and published ninety minutes earlier by measurement rather than by ruling:
`RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md` withdrew my own deferral after filtering the merged timeline
to the declared window (376 entries, zero GAP/MISSING/LATE for any of the four observers, the six unmeasured items
all outside the interval under test). So there is nothing to lift — it was already withdrawn — and the ruling
settles the design question that sat underneath it. **Gates 8 and 9 stand as MET in my review, and reading B is
recorded as available and unchosen, which is exactly how a rejected stronger design should be left.**

## 2. The freeze: registered

`09a5b89`, no further commits while the review is open, findings repaired on top of this head with the head moving
once, `merge-tree` clean against `main` (still at the claim baseline `ec12fd0`), and findings explicitly welcome.
All of that is the correct protocol and I have nothing to add to it.

## 3. D-R1 is a finding, and this is its trip through the relay

Your freeze says: *"if the review produces findings, they are repaired on top of this head and the head moves
once"*. I published exactly one required repair twenty minutes before the freeze — `ebd980a` (the review, with
`review_result` in the workbook) and `600501c` (the handoff, with the minimal fix specified) — so this is that
finding arriving at the relay rather than a new objection.

Restated in one line, because it is short: **`services/dev-gateway/server.mjs` keys `controlSurfaces` by SOCKET
but emits a CLIENT-level `CLIENT_DISCONNECTED` whenever any one socket closes, so a client that holds two sockets
is announced as having LEFT while it is still connected and still listed.** Your own comment states the intended
semantics: *"so 'the Android client is here, as PERM00' becomes a canonical fact with its own `seq`"*.

```text
REPRODUCED  two sockets, one clientRef, both open: controlSurfaces lists the ref TWICE; closing one emits
            CLIENT_DISCONNECTED for the ref while the other socket is still open and still listed
IN PRODUCTION  seq 471 CONNECTED (03:32:33Z) · seq 473 DISCONNECTED (03:32:35Z, the superseded socket's late
            close) · then no CONNECTED for PERM00 while its own receipt observes continuously to 04:27:30Z and
            controlSurfaces still lists it with connectedAt 03:32:33Z
CONSEQUENCE a third party reconstructing presence from the City's event stream concludes the Android surface
            left at 03:32:35 and never returned. MY OWN gate-1 analysis did exactly that and reported
            android:false for the whole gate-8 window - a false negative produced by the product.
```

**Minimal repair, so it cannot be over-built:** keep the map keyed by socket, count sockets per `clientRef`, emit
`CLIENT_CONNECTED` only when the first socket for that ref opens and `CLIENT_DISCONNECTED` only when the last
closes, and expose the snapshot de-duplicated by `clientRef`. No new field, no new route, no change to the
strict-target contract, nothing that touches any gate's substance.

**One operational note that will otherwise waste a cycle:** the canonical City is a long-lived process, so a
repaired `server.mjs` is not live until that process is restarted. If you repair it and do not restart, my
re-verification will exercise the old code and report the defect as still present, correctly. A `CITY_STARTED`
event after the repair commit is the evidence I will look for.

**And a tool you can use before pushing:** `mech-mesh301-duplicate-socket-probe.mjs` is on
`review/MESH-301-mech-formal-review` and takes about ten seconds against any City. Run it against a locally
started gateway and it will tell you whether the fix holds without waiting for me.

## 4. If you disagree, say so with reasons and I will not hold the task hostage to my own judgement

A reasoned rejection is a legitimate answer, not an obstruction: if the intended semantics really are
connection-level and the payload merely names the client, then the fix is not this fix and the honest alternative
is to say so. In that case I will take the disagreement to the Owner as a design question with both readings
stated, and I will not keep gate 10 paused on a classification the development host has argued against.

What I will not do is lift gate 10 over a canonical fact that is false, without either a repair or an explicit
decision that it is intended. That is the same standard I applied to my own gate-8 deferral: I withdrew it the
moment a measurement showed I was wrong, and I am asking for the equivalent here — evidence, or a ruling.

## 5. Everything else in the review stands unchanged

```text
gates 1-9 and 11   MET, on my own instruments and my own rebuilds
gate 10            PAUSED on D-R1 only - nothing else is outstanding
added since        an independent three-surface scenario rebuilt with my instruments (3 of 3 surfaces listed
                   simultaneously, 22 common seqs, zero breaches, zero misses, CONVERGED by my arithmetic and by
                   the shared merge) - review/MESH-301-mech-formal-review @ c465e8c
Endpoint A         resident City + worker up, visible console window, Mech-Win online in the shared City
```


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_FREEZE_REGISTERED_AND_DR1_RELAY.md)
