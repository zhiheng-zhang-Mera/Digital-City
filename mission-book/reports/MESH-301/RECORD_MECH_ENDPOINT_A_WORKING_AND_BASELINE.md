# RECORD — Mech (endpoint A): joined as a WORKING worker, and the pre-change baseline is measured

```text
FROM = Mech   ROLE = endpoint A (Mech-Win) + formal reviewer, per the Owner's revised ruling
STATE = MESH-301 step 2's Mech-side requirement is DONE and FUNCTIONAL, not merely registered.
```

## 1. Endpoint A does not just connect — it claims and executes

The City was measured at claim/start time (MESH-301 forbids carrying a historical address), this host joined it
with the identity `Mech-Win`, and then an untargeted task was created and followed to terminal:

```text
cityId=22e1216b-f124-4d4a-be4a-4a280558c027   nodes=2
    Alien-Win online=true
    Mech-Win  online=false        <- before this host's worker started
  [node] City Node Reference Agent started as Mech-Win
    Mech-Win  online=true

created an UNTARGETED task   Q-b8ba7b5e-c0c5-4c11-bc40-236113c99000   (HTTP 200)
observed timeline (client-side observation times, this host)
    2026-10-03T02:57:45.872Z  QUEUED     progress=0
    2026-10-03T02:57:46.650Z  RUNNING    @Mech-Win progress=30
    2026-10-03T02:57:49.260Z  COMPLETED  @Mech-Win progress=100
```

`Mech-Win` claimed and completed it. That is worth stating plainly because "joined" and "works" are different
claims, and MESH-301 needs the second: completion gate 2 asks for two **real worker nodes**, not two
registrations.

## 2. The pre-change baseline for gate 7, taken deliberately BEFORE the product change lands

Gate 7 requires that the ordinary untargeted task path shows **no regression** once strict target-device routing
exists. A regression check needs a before, and this is it: an untargeted `CHECKPOINT_DEMO` schedules, is claimed
by whichever eligible node takes it, and reaches `COMPLETED` with `progress=100`. It will be re-run unchanged
after the development host lands the routing contract, so the comparison is like-for-like rather than against a
description.

## 3. The canonical `seq` basis for gate 8, confirmed readable from this host

MESH-301 is explicit that three-end synchronisation must rest on the **server event `seq`** and bounded
convergence, not on comparing three machines' clocks. Measured here:

```text
canonical events readable from this host: HTTP 200, 12 events
events for this task: 7, ALL 7 carrying a server seq
    seq=7   TASK_CREATED      actor=gateway
    seq=8   TASK_ASSIGNED     actor=Mech-Win
    seq=9   TASK_STARTED      actor=Mech-Win
    seq=10  TASK_CHECKPOINTED actor=Mech-Win
    seq=11  TASK_CHECKPOINTED actor=Mech-Win
    seq=12  TASK_COMPLETED    actor=Mech-Win
highest seq observed by this surface: 12
```

So the convergence measurement gate 8 needs has a real substrate on this side: a monotonically increasing
server sequence that a surface can read and timestamp locally.

## 4. What this does NOT establish, stated so nothing is over-read

- **Not three-end convergence.** That needs all three surfaces (Alien Web, Mech Web, Android) observing the
  same `seq`, and the Android control client is not in this measurement at all.
- **Not any strict-target behaviour.** The development host has not landed the routing contract yet, so there is
  nothing to test; `target=Alien`, `target=Mech`, the offline/unknown refusal and the duplicate-submission
  boundary are all still unmeasured.
- **Not a claim of authorship.** This host holds no development claim on MESH-301, and the Owner's revised
  ruling (Alien develops, Mech is endpoint A plus formal reviewer) leaves it that way.

## 5. Method notes, because both cost a run and both were mine

- **I probed rather than assumed the reachable path**, because MESH-301 forbids treating a historical endpoint as
  a fact: one City answered, everything else timed out.
- **The node credential is a second secret and pairing cannot substitute for it.** `GET /api/v0/city` accepted
  the control credential while `POST /api/v0/node/register` answered `Invalid pairing token`, and
  `pairing.exchange()` returns `credential: this.credential` — the CONTROL token — so the pairing route cannot
  mint a node token. The control/node split is by construction in `server.mjs auth()`. The Owner then supplied
  the `-node` form, which is exactly the derivation Alien's decision D1 had already recorded, and once both were
  present the node registered on the first attempt. **No token value appears in this file or in Git.**


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_ENDPOINT_A_WORKING_AND_BASELINE.md)
