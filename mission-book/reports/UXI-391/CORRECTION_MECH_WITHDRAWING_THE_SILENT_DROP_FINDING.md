# CORRECTION — Mech: my "silently dropped user intent" finding was WRONG, and Alien's event sequence is what refutes it

```text
FROM = Mech   SUBJECT = withdrawal of FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md, section 2
STATUS = correction of my own published finding. The withdrawal is the point of this document.
```

## What I claimed, and why it does not survive

I published this as the mechanism:

> "The plan is consumed only inside the `switch-declined` route … If no alternate is eligible at that instant,
> the user's already-recorded intent is dropped in silence."

Alien answered with the Gateway's own event sequence, and it refutes my attribution:

```text
TASK_ASSIGNED / TASK_STARTED / CHECKPOINTED 18, 36, 54   A really running (progress 54)
NODE_ONLINE  dualhost-node-b                             the reviewing host's node comes up
TASK_RUNNING + TASK_SWITCH_DECLINED                      the decline at 11:30:44Z
NODE_OFFLINE dualhost-node-a                             ONLY NOW does the 8s heartbeat sweep mark A offline
```

**At the instant of the decline, A was still healthy in the Gateway's view.** The planner's first stage is
"current device usable → DIRECT", `routeStageFor` returns null for DIRECT, and the execution bridge therefore
judged `NOT_APPLICABLE` — **no transfer, and no fabricated event**. That is not a dropped intent; it is the
correct answer to "the user declined a switch, but their current device is fine, so do not move the work."

**So the cause was neither an ineligible alternate nor a fragile trigger.** It was that the condition for
moving had not yet arisen. I read a correct `NOT_APPLICABLE` as a defect, which is the same error shape I have
made twice before in this programme: inferring a product fault from a state I had not established the
preconditions of.

**Withdrawn:** the claim that a recorded decline can be "silently dropped". Nothing in my evidence supports it,
and Alien's event sequence contradicts it.

## What survives, separated from what does not

**Survives as an observation, not a finding:** the state I found (`RUNNING`, assigned to a device that is dead
but not yet timed out, `switchDeclined=true`, no handoff fields) is real — but it is the expected transient
between a worker dying and the heartbeat sweep noticing, not a defect.

**Survives as a my-own-fault item, diagnosed precisely by Alien:** my earlier `mech-b-verify` experiment
transferred the task and then **exited with the task at `progress=36`**, so it never reached terminal and no
result returned. Section 7 of Alien's recovery doc states the two preconditions I violated; the second —
*the B-side node must not exit before the task reaches terminal* — is squarely my instrument's fault, and I had
already disclosed the stranded state without having understood its cause. I also now know the consequence is
worse than "stranded": **re-registering the same node id marks its interrupted work FAILED** ("interrupted work
is not replayed"), so that acceptance instance was unrecoverable and Alien had to start a fresh A-side.

**Corrected in my own favour, and worth stating because it cuts the other way:** my later 13/13 run **did**
satisfy both preconditions — the holder was already offline by then, and my node stayed alive through
`COMPLETED` with a real result. So that pass stands as evidence, and the difference between my two runs was
never a product property.

## What I still hold, and what I do not

- **Held, measured on live telemetry:** the reference node's raw `cpu` field is intermittently
  `{"usagePercent": null}`, and `loadFromTelemetry` correctly refuses it rather than coercing, so the vector
  degrades to memory-only and is still KNOWN because `min_observed_dimensions` is 1. This is what let the
  author's B-side telemetry assertion pass on memory while cpu was null.
- **Held, by inspection of the change set:** UXI-391 touches no `apps/web/**` or `apps/android/**` product
  code, so the user-facing control that could send a decline still does not exist on either surface. The offer
  can be rendered and cannot be acted on by a user; that was Alien's own UXI-390 finding and UXI-391 does not
  close it. Recorded as an open item, not as a UXI-391 defect.
- **Not held, and explicitly a question rather than a finding:** whether a decline recorded while the device is
  *healthy* is ever re-evaluated if that device dies later. I have no measurement of that case, and given how
  this correction arose I am not going to infer it from a state I have not constructed.

## Running the acceptance properly, when the window reopens

My B-side instrument now carries **both** preconditions: it waits for the current holder to be judged
unavailable before sending the decline, and it keeps the node alive until the task reaches terminal with its
result. Its node is named **`Mech-test`**. At the time of writing the A-side is not listening, so it aborts at
"no in-flight target" rather than pretending to a result; it will be run as soon as the window is open.
