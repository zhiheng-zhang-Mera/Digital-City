# UXI-301 — THE DEFERRED HANDOFF SEAM: ITS TWO PREMISES MEASURED AGAINST THE FROZEN CITY (Alien)

```text
AUTHOR   = Alien        (independent of UXI-301's development; Mech develops it)
TARGET   = Mech's development_pending_seam_remote_handoff rationale
BASIS    = the FROZEN City on main 1a5bc0e, read directly
STATUS   = Mech's two premises are CONTRADICTED by the frozen code. The seam looks DRIVABLE.
           I have NOT driven it. The exact experiment is specified below.
```

## What Mech recorded, and why it matters

Mech deferred one of UXI-301's gate items — *"a remote handoff's result returns to the current
surface"* — and gave this reason, which it measured four ways:

> *"there is no way to HOLD a node occupied, so 'the current device is busy or gone WHILE the work is
> still assigned' cannot be sustained and the planner cannot be asked the routing question that reaches
> ALTERNATE_DEVICE."*

And, as the root of that: *"the City can create only one task type and it finishes in well under a
second."* Mech put this to the Owner, because it determines **what completing UXI-301 means**. It is
therefore the load-bearing premise of a pending ruling, which is why it deserves checking by a host that
did not write it.

## Measured fact 1 — the City has FIVE task types, not one

`services/dev-gateway/actions.mjs:356` on frozen `main` (`1a5bc0e`):

```js
export const CITY_TASK_TYPES = ['WAIT', 'CREATE_TEMP_ARTIFACT', 'HASH_TEMP_ARTIFACT', 'DELETE_TEMP_ARTIFACT', 'CHECKPOINT_DEMO'];
```

And they are **requestable**, not merely declared: `services/dev-gateway/server.mjs:139-141` handles
`POST /api/v0/tasks` by validating `b.type` and storing it verbatim — `type: b.type`. The validator
(`contracts/city-control-v0/protocol.mjs`) accepts `taskTypes`, which is the same five.

So *"the City can create only one task type"* does not hold of the frozen City. The likely source of the
belief is that only one type is **exercised** by the existing harnesses — the RS-290 pilots use
`CHECKPOINT_DEMO` — but reachability and usage are different facts, and this one was inferred from usage.

## Measured fact 2 — `WAIT` IS the way to hold a node occupied

`agents/reference-node/runner.mjs:7-8`:

```js
if(task.type==='WAIT'){
  for(let i=1;i<=5;i++){await sleep(stepDelay);await update(i*18,{step:'wait',tick:i});}result={waitedMs:stepDelay*5};
}
```

with `stepDelay` defaulting to **1200 ms**. So a `WAIT` task holds the node for **~6 seconds** while
continuously reporting `RUNNING` with progress and a checkpoint, and `update()` throws if the task is no
longer RUNNING — i.e. the node is genuinely occupied and the task is genuinely in flight for the whole
window.

That is precisely the condition Mech reported it could not sustain. Six seconds is also far longer than
the sub-second completion that defeated Mech's earlier attempts, and the retry window needed to issue a
routing query is milliseconds.

## What this does and does not establish

**Establishes:** both premises of the deferral are contradicted by the frozen code. There is a documented,
API-reachable mechanism for holding a node busy while work is assigned.

**Does NOT establish:** that the seam now passes end to end. I read the mechanism; **I did not drive it.**
This programme has recorded seven times that inferring a result from the *shape* of a mechanism rather than
from an execution is how wrong conclusions get published — twice by Mech, and the seventh was mine. So
this is reported as a strong, code-grounded hypothesis with a specified experiment, **not** as a result.
Anyone acting on it should run the experiment first.

## The experiment that would settle it

1. Bring up the gateway + a real reference node (the RS-290 pipeline `.runtime/e2e-pipeline.ps1` already
   does exactly this).
2. Create a task of type **`WAIT`** via `POST /api/v0/tasks` with `{"type":"WAIT"}` against the node the
   interaction device is on.
3. While its `state` is `RUNNING` (a ~6 s window), issue the routing query with a second eligible device
   present, and observe whether the planner reaches `ALTERNATE_DEVICE` → `REMOTE_HANDOFF`.
4. Assert the handoff's result returns to the interaction surface — the gate item as written.

Mech's own record says its probe already reaches `withoutDecline=SWITCH_OFFERED` and
`withDecline=ALTERNATE_DEVICE` **when given the condition**, so step 2 is the only missing ingredient.

## Recommendation to the Owner, stated as a recommendation

The ruling Mech asked for may be **premature**. It was framed as "may the gate be discharged with the seam
measured-and-attributed to the City", and that framing assumes the seam is undrivable. If `WAIT` works as
its code says, the seam is drivable and the honest outcome is to **drive it** rather than to rule on
waiving it — which is also what UXI-301's own step 7 demands ("用真实并发、provider unavailable、device
busy、remote handoff E2E 驱动 UI，而不是仅用静态 mock").

Suggested order: **run the experiment first**; rule only if it fails. That is cheaper than a ruling and it
produces evidence instead of a waiver.

## Scope and boundaries

- Alien did **not** touch Mech's branch, workbook fields, or `apps/**`. This is a read of frozen `main`.
- Alien did **not** claim UXI-301: `development_complete` is `false` and `review_host` is null. Alien
  remains the eligible Review host and will claim the Review when Mech declares development complete.
- This note corrects nothing about Mech's *measurement* discipline — its four attempts are recorded in
  detail and its probe does reach `ALTERNATE_DEVICE`. What is contradicted is one **premise** those
  attempts inherited: that only one task type exists.


[阅读译本 / Reading translation](./zh-CN/HANDOFF_SEAM_PREMISES_MEASURED_ALIEN.md)
