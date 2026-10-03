# VERIFICATION — Mech: BOTH required repairs verified at the new head `0a41efe`, with my own instrument

```text
FROM = Mech (review host)   REVIEWED HEAD MOVES TO 0a41efe50e1e6c7a8dde77edaeb3158636717b91
RE   = the two residuals I recorded as OPEN (DISPATCH_ALIEN_TO_MECH_REPAIRS_APPLIED_SINGLE_SHOT.md)
RESULT = PASS 9/9, then reproduced 9/9 again on a second run with a different task id
```

## Why the reviewed head moves

Applying the repairs moved the branch, and the established pattern in this programme — used on UXI-301 and
UXI-390 — is that **the repaired head becomes the reviewed head**. So `review_head_sha` is updated to
`0a41efe`, and the checks that were taken at `269aa96` are re-stated at the new head where they can be.

## Repair A — a recorded decline is now re-evaluated

```text
[PASS] setup: the decline is recorded while NO alternate exists at all
[PASS] (negative) with no alternate present, the sweep does NOT invent a destination
[PASS] REPAIR A: the recorded decline is honoured AUTOMATICALLY once an alternate becomes eligible
       - target=Mech-test-b epoch=2 from=Mech-test-a, and NO SECOND DECLINE WAS SENT
[PASS] the same task id, ownership recorded from the original holder
[PASS] idempotency: repeated sweep evaluations do NOT transfer again or bump the epoch - 2 -> 2
```

The last two are the parts worth naming. The repair could easily have been implemented as "retry the transfer
every second", which would have moved the epoch repeatedly or re-transferred; instead the sweep is idempotent,
and **I tested that rather than assuming it from the design description**. The negative control — that the
sweep does not invent a destination when no alternate exists — is the one that would have caught an
over-eager fix.

## Repair B — a dead reservation is released, guard hold included

```text
[PASS] a reservation whose device died is RELEASED rather than stranding the task - target=null state=QUEUED
[PASS] the release is a DISTINCT recorded event
[PASS] a THIRD device takes the released task and runs it to terminal
       - state=COMPLETED assigned=Mech-test-c result={"waitedMs":6000}
[PASS] still one task and one completion
```

The full event vocabulary recorded on the wire, printed in full precisely because a truncated sample had left
this ambiguous in my first run:

```text
CITY_STARTED, NODE_ONLINE, COMMAND_ACCEPTED, TASK_CREATED, TASK_ASSIGNED, TASK_STARTED, NODE_OFFLINE,
TASK_RUNNING, TASK_SWITCH_DECLINED, TASK_HANDOFF_TRANSFERRED, TASK_CHECKPOINTED,
TASK_HANDOFF_RESERVATION_RELEASED, TASK_COMPLETED
```

So `TASK_HANDOFF_RESERVATION_RELEASED` is genuinely a distinct event, and the third device really does run the
released work to terminal. **I had to re-run to establish that**: the first run's check passed on a raw-JSON
match while the printed list of distinct names was cut at eight, which is the truncated-detail ambiguity that
has caught me before. Both runs passed 9/9 and the second used a different task id, so this is a repetition
rather than a restatement.

**Note on the author's own addition, which my run independently confirms:** clearing `handoffTargetRef` was not
enough on its own — the in-memory assignment guard still held the dead device, so other devices were still
refused. The release now also releases the guard's claim, and my run is the evidence that a **third** device
can then take the work.

## CI at the new head, verified by me rather than read from the field

```text
run 37088320091   headSha 0a41efe50e1e6c7a8dde77edaeb3158636717b91
                  branch uxi/UXI-391-remote-handoff-closeout   completed / success
                  gateway-web: success (pnpm test, promotion-history, rooms tests, city test-all, check:docs)
                  android:     success (testDebugUnitTest + assembleDebug)
```

## One record item that is the author's, not mine

§7 reconciliation at the new head is **11/13**, and both failures are one cause: the workbook's
`development_head_sha` still names `269aa96` while the branch is `0a41efe`, and `development_ci` therefore
resolves to the older run. The **substance** is fine — the run for the new head exists, is bound to exactly
that head and is green, as verified above. This is the same author-field lag I dispatched on UXI-390; I am
recording it rather than editing the development host's fields, because a review host that writes them becomes
a co-author of the record it is reviewing.

## Effect on the ledger

The two residuals I recorded as OPEN are now **CLOSED**, verified by my own instrument. Gates 1–8 remain MET at
the new head, with gate 8 re-verified there. Gates 9–12 remain pending step 7.

## Evidence

`mission-book/reports/UXI-391/review-by-mech/repair-verification-by-mech.json`.
