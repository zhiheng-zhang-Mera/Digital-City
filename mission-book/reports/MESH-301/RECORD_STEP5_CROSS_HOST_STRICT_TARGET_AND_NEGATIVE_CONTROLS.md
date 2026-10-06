# RECORD — MESH-301 steps 5/6 evidence so far: cross-host strict target, live negative controls, one instrument rebuilt four times

```text
FROM = Alien (development host)      TO = Mech (endpoint A + formal reviewer), Owner
CITY = http://172.31.3.110:4391      cityId 22e1216b-f124-4d4a-be4a-4a280558c027
```

## 1. Two real worker nodes, both online, in one City

```text
Alien-Win  online=true  platform=win32  [task.execute.safe, filesystem.temp]
Mech-Win   online=true  platform=win32  [task.execute.safe, filesystem.temp]
```

Completion-gate item 2 is satisfied as a **running** fact, not merely as two registered identities. Mech kept
its node up after the role question was settled, which is what made the next section possible.

## 2. A real cross-host strict-target run — Alien's control surface → Mech's worker

This was not staged for the report. The **negative-control instrument** created the task while Mech was away,
and Mech's node later came online and executed it. The canonical event stream, verbatim in sequence:

```text
seq 16  COMMAND_ACCEPTED                       (created from the ALIEN host's control surface)
seq 17  TASK_CREATED
seq 18  TASK_TARGET_WAITING  targetDeviceRef=Mech-Win targetState=OFFLINE
seq 20  TASK_SWITCH_DECLINED
seq 21  TASK_HANDOFF_REFUSED reason=STRICT_TARGET_BOUND from=null to=Mech-Win
seq 70  TASK_TARGET_READY    targetDeviceRef=Mech-Win        <-- Mech's node returned
seq 72  TASK_ASSIGNED        assignedNodeId=Mech-Win         <-- and ONLY Mech's node took it
seq 73  TASK_STARTED
seq 74  TASK_CHECKPOINTED    progress=30
seq 75  TASK_CHECKPOINTED    progress=75
seq 76  TASK_COMPLETED       result={bytes:65, sha256:…}     <-- executed on the MECH host
task    Q-6958c120-262e-49f0-b967-d6572748bd73  state=COMPLETED  assignedNodeId=Mech-Win
```

Four things are established at once, and each of them was a stated requirement rather than a side effect:

1. **Alien control surface → Mech worker, strictly targeted, end to end** (step 5.1). The instruction was
   issued on the Alien host, was refused by the healthy Alien node for the entire time Mech was away, and was
   executed on the Mech host with a real result digest.
2. **No silent fallback, measured rather than asserted.** `Alien-Win` was online and capable throughout and
   was never allowed to take the run. `seq 21` is the City saying *why* nothing moved.
3. **The reconnect path is real.** `TASK_TARGET_READY` at `seq 70` fires on `NODE_ONLINE` for exactly the tasks
   waiting on that device — so offline → reconnect → claim is visible in canonical truth with its own `seq`,
   not inferred from a later claim.
4. **Declining a provider switch cannot reroute a targeted run.** `seq 20` recorded the decline and `seq 21`
   refused the move. This is the guard against the one mechanism that would otherwise have handed the run to
   the Alien node while appearing authorised.

## 3. The negative-control instrument, against the live City

`scripts/mesh301-mesh-probe.mjs negative --target Mech-Win --other Alien-Win` → **8/8 PASS**:

```text
PASS  unknown target is refused with a typed code
PASS  malformed target is refused, not dropped
PASS  duplicate action replays the same task and does not execute twice
PASS  one idempotency key cannot be made to mean two devices
PASS  strict task for an away device waits instead of rerouting
PASS  strict task carries no releasable handoff reservation
PASS  declining a switch cannot move a user-targeted run
PASS  non-target device is refused with a stated reason
```

The instrument's **first** run reported one FAIL, and the failure was the instrument's own: the probe value
`__no_such_device__` contains underscores, which are not a valid node identity at all, so the City correctly
answered `TARGET_DEVICE_MALFORMED` where the control wanted `TARGET_DEVICE_UNKNOWN`. A control that cannot tell
"the product refused for the wrong reason" from "the probe asked the wrong question" is not a control, so both
cases are now checked with values that can only trigger one of them.

## 4. The convergence instrument, and the four times it lied before it worked

`observe` (runs on a surface's host, writes a receipt) + `merge` (reads receipts, produces the table and the
verdict). Convergence is measured against the canonical server `seq` **and the server's own `timestamp`** —
never a device clock, never a UI.

Every one of these four defects was found by *running* the instrument, not by reading it:

| # | the lie | why it was dangerous | the fix |
| --- | --- | --- | --- |
| 1 | it read `at` for the server timestamp; the store's field is `timestamp` | every latency was computed against `null`, so nothing was measured | read the real field, and throw if an event carries no server time |
| 2 | it reported **CONVERGED on an empty timeline** | "no surface breached the window" is vacuously true of nothing — a green tick from an instrument that had measured nothing | fail closed on an empty timeline and on any silent surface |
| 3 | one receipt file held **two sessions** because it appended across runs | the merge took the first session's bounds and reported the second session's ordinary behaviour as failures | one session is one receipt |
| 4 | it reported **its own start and stop** as convergence failures | a bounded run cannot measure its own shutdown boundary | that range is now `AT_SHUTDOWN` and the verdict becomes `INCOMPLETE`, which exits non-zero |

Result on a validated run, one host, two headless surfaces:

```text
137 1ms  138 7ms  139 1ms  140 1ms  141 0ms
142 OFFLINE_AT_EMIT   143 OFFLINE_AT_EMIT        <-- the City was deliberately restarted here
144 3ms  145 2ms  146 9ms
147 AT_SHUTDOWN
reconnect: awaySince 03:05:24.756Z -> returnedAt 03:05:32.880Z
           latestSeqWhileAway=143  resync.maxSeq=144 after 8ms  verdict=RECONVERGED
verdict = INCOMPLETE   (only because the probe's own shutdown boundary is unmeasurable)
```

The instrument also learned to take its timeline from the **server's own event table** when the City is
reachable, rather than from the union of the receipts: a receipts-only union cannot contain an event emitted
while every surface was away, so "nobody reported it" would silently read as "nothing to report".

## 5. What this is NOT, stated plainly

- **The convergence numbers above are one host and two headless probes.** They validate the instrument. They
  are **not** the three-end convergence evidence, which requires the three real surfaces (Alien Web, Mech Web,
  Android) and their own receipts.
- **One direction only.** Alien control surface → Mech worker is done. **Mech control surface → Alien worker**
  is not, and only the Mech host can produce it.
- **Android has not connected at all.** Completion-gate items 1, 3, 4 and 9 are untouched: no Android control
  client in this City, no Android → Alien, no Android → Mech, no Android offline/reconnect.
- **No Formal Review, no CI on this head yet, no merge, no terminal marker.**
- `GET /api/v0/health` reports `degraded` because the Room Hub is not running on loopback. That is a truthful
  component state, not a MESH-301 failure; the City's own routes are `READY`. Recorded so a reviewer reading
  `degraded` does not misread it.

## 6. What Mech can do next, independently

```text
1. Mech control surface -> Alien-Win strict target, once, safe task.  Step 5.2. Its own instrument, its own
   receipt; the strict-target Action route is POST /api/v0/actions with
   {route:'CITY_TASK', target:'city.task', operation:'CHECKPOINT_DEMO',
    input:{targetDeviceRef:'Alien-Win'}, idempotencyKey:'<new key>'}.
2. Run its own `observe` against the City for the window it generates, and keep the receipt.
3. Re-run the negative controls with its own values -- an independent instrument reproducing the controls is
   what step 6 asks for, not a copy of mine.
```

Mech's node is currently the only thing standing between a healthy task and its execution on that host, so
keeping it up is itself part of the evidence.


[阅读译本 / Reading translation](./zh-CN/RECORD_STEP5_CROSS_HOST_STRICT_TARGET_AND_NEGATIVE_CONTROLS.md)
