# RECORD — MESH-301 Step 3: strict target-device routing intent

```text
FROM = Alien (development host of MESH-301)
TO   = Mech (formal reviewer), Owner
RE   = MESH-301 step 3 and the "current real gap" the workbook names: an explicit, persisted
       user intent that ONE task belongs to ONE named physical device.
UTOPIA = zhiheng-zhang-Mera/utopia, branch mesh/MESH-301-three-end
HEAD   = 56126b2  (baseline ec12fd0831f31fd81aef9cd9dfb0c959d010f63b)
```

## 1. What exists now, in code

```text
services/dev-gateway/targeting.mjs        NEW  pure rules, unit-tested on their own
services/dev-gateway/server.mjs           MOD  the one creation path, the claim guard, the no-reroute guards
services/dev-gateway/actions.mjs          MOD  the user-level path; target travels in `input`
tests/mesh301-strict-target.test.mjs      NEW  7 tests, all passing
```

The properties the workbook states as five lines, and where each is enforced:

| workbook line | enforced by |
| --- | --- |
| `target=Alien` → only Alien may claim | `claimAllowedByTarget` in the `/node/claim` guard |
| `target=Mech` → only Mech may claim | same rule, symmetric |
| `target offline/unknown` → no silent fallback | `UNKNOWN` refused at creation; `OFFLINE`/`INELIGIBLE` created and waiting; the handoff sweep and the switch-decline path both refuse to move a targeted run |
| duplicate user action → no duplicate execution | the Action facade's existing `idempotencyKey` + request fingerprint, which already hashes `input` |
| untargeted task → scheduler unchanged | `claimAllowedByTarget` returns `true` when the field is absent |

## 2. Decisions taken where MESH-301 left the shape open (问题 / 选择 / 判断逻辑)

### D5 — a third device reference, not a reused one

- **问题**: the workbook says a new field must not reuse one with different semantics, but does not name it,
  and the City already carries `providerRef` and `handoffTargetRef`.
- **选择**: a new `targetDeviceRef`.
- **判断逻辑**: `providerRef` answers *which service*. `handoffTargetRef` answers *where the City moved a run
  after the fact* — and, decisively, it is a **reservation** that the existing sweep releases after
  `RESERVATION_GRACE_MS = 15000` when the named device looks offline. A user target written there would be
  silently released fifteen seconds later and the run handed to somebody else, which is precisely the silent
  fallback the workbook forbids. The two fields disagree about whether the device may ever be reconsidered, so
  they cannot be the same field.

### D6 — targeting reaches the City through the Action facade, not the low-level `/tasks` route

- **问题**: the workbook prefers the user-level path but allows the low-level route to be extended "if it must".
- **选择**: do **not** touch the low-level route.
- **判断逻辑**: `contracts/city-control-v0/protocol.mjs:7` rejects **every** request key except `type` — "Choose
  a supported safe task type; parameters are not accepted." That is a frozen contract with a deliberate
  guarantee, and extending it would reopen a frozen wire contract and break the guarantee for every existing
  caller, including the Android client's current `createTask()`. The Action facade already carries an
  `idempotencyKey`, a request fingerprint and a free-form `input`, so the target rides in `input` and the
  duplicate-submit boundary is **inherited rather than reinvented** — the workbook's stated preference and the
  cheapest correct option are the same option here.

### D7 — `UNKNOWN` is refused; `OFFLINE`/`INELIGIBLE` are accepted and wait

- **问题**: the workbook allows "explicit wait OR typed refusal" for an unavailable target and does not say
  which applies when.
- **选择**: a target that is not a **known City node identity** is refused at creation with
  `TARGET_DEVICE_UNKNOWN`. A target that is known but **offline or ineligible** is accepted, persisted, and
  waits, with `targetStateAtCreation` recorded and a `TASK_TARGET_WAITING` event emitted once.
- **判断逻辑**: the workbook's own wording separates the cases — "target 必须引用当前 City 已知 node
  identity" is a creation-time requirement, while offline is a *condition of the moment*. Refusing an offline
  target would make "queue this for Mech while Mech is away" impossible, and that ability is what step 5's
  offline/reconnect requirement is actually about. Refusing the unknown case is what stops a typo becoming a
  task nobody can ever run.

### D8 — a strict target is not gated by fleet-wide availability

- **问题**: the pre-existing gate refuses to create a task when no node in the whole City can take work.
- **选择**: the gate still applies unchanged to untargeted tasks, and is **skipped** for a strictly targeted
  one.
- **判断逻辑**: for a target task the fleet is not what decides — the named device is. Applying the fleet gate
  would refuse "queue this for Mech" whenever Mech and everyone else happened to be away, which contradicts
  D7. Applying it would also destroy the negative control the workbook wants: with the gate in place, "the
  instruction was issued and nobody could execute it" and "the instruction was issued for a device that is
  away" would produce the *same* answer and could not be told apart. Untargeted behaviour is untouched, which
  is the no-regression requirement.

### D9 — the claim route says *why* it withheld work

- **问题**: `/node/claim` answered a failed claim with a bare `task: null`.
- **选择**: add a `withheld` array naming each waiting strict task, the device it is held for, and the device
  that asked; omit the key entirely when empty.
- **判断逻辑**: `null` cannot distinguish "there is no work" from "there is work and it is not yours", and a
  device that cannot tell those apart will report the wrong thing to its user. The addition is additive, so a
  node that ignores it behaves exactly as before.

### D10 — nothing in the City may move a targeted run

- **问题**: two existing mechanisms move runs between devices — the RS-202 handoff plan consumed on
  switch-decline, and the one-second `honourDeclinedHandoffs` sweep that keeps re-planning.
- **选择**: both refuse to act on a task carrying a user target. Switch-decline on a targeted run emits
  `TASK_HANDOFF_REFUSED` with reason `STRICT_TARGET_BOUND` and moves nothing.
- **判断逻辑**: the sweep is the one that would eventually move the run, so guarding only the decline path
  would have left the hole open. And the guard is *recorded* rather than silent because a refusal that leaves
  no trace is indistinguishable from a mechanism that never fired.

### D11 — reconnect is stated in the canonical stream

- **问题**: when a waiting task's device returns, the task silently becomes claimable.
- **选择**: `NODE_ONLINE` is followed by one `TASK_TARGET_READY` per task that was waiting for that device.
- **判断逻辑**: step 5 requires convergence on the canonical server `seq`. A transition that exists only as a
  consequence of a later claim cannot be converged on by a surface that was offline while it happened; giving
  it its own `seq` makes "offline → reconnect → converged" observable instead of inferred.

## 3. Evidence

```text
unit + gateway integration   tests/mesh301-strict-target.test.mjs   7/7 PASS
full root suite              node --test "tests/*.test.mjs"
                             tests 1043   pass 1041   fail 2
```

The two failures are **pre-existing and unrelated** —
`capability-adapters.test.mjs` ("document bytes flow through real readers…") and `city-roads.test.mjs`
("Bridge Road extraction preserves all six published document retrieval digests…"), both `CORRUPT_INPUT` from
`services/capability-bridge/adapters.mjs:49`. This was **measured, not assumed**: the same two tests were run
with this change stashed and failed identically on the untouched baseline. They are recorded here rather than
fixed because they are outside this task's allowed boundary and §9 forbids make-work; they are also not
evidence about this change either way.

The integration test is deliberately not a self-confirming script. It makes the gateway **stop** the Alien
node first, so the target is *known but offline* — the state that a naive implementation would paper over —
and asserts that a healthy, capable Mech node is still refused, that the refusal is typed, that the task is
still waiting afterwards, that an untargeted task created in the same instant **is** claimable (so the waiting
strict task does not block the queue), that a replay creates no second task and that one key cannot be made to
mean two devices, that declining a switch moves nothing, and finally that the returning device completes the
run, with `wait → ready → completed` in ascending canonical `seq`.

## 4. What this does NOT establish

Nothing here is a three-end result. All of it ran on **one** host against a loopback gateway. It proves the
routing rule; it does not prove Alien → Mech or Android → Mech, and I will not describe it as if it did. Step 3
is the mechanism; steps 4–6 are the three-end proof and they need Mech's node to stay online and the Android
device to connect.


[阅读译本 / Reading translation](./zh-CN/RECORD_STEP3_STRICT_TARGET_INTENT.md)
