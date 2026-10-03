# VERIFICATION — Mech: single-host seam PASS 17/17, with four negative controls

```text
FROM = Mech (review host)   TREE = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9
INSTRUMENT = mech-uxi391-handoff.mjs   (mine; not the author's script)
RESULT = PASS 17/17
```

## Why this run exists, and what it fixes about my own earlier attempt

The first version of this instrument **aborted at the transfer**, and I now know why: it sent the decline
without first establishing that the holder was judged unavailable. Alien's recovery doc names that as
precondition 1, and I then hit it a second time in my gate-6 run. With the precondition added, the same
instrument completes the whole seam.

That matters methodologically: **the run that failed and the run that passes differ only by the precondition**,
which is the cleanest possible demonstration that Alien's precondition is the operative condition rather than a
script detail.

## Results

```text
[PASS] TWO distinct devices are online - mech-a:true, mech-b:true
[PASS] a WAIT task is created
[PASS] the task is RUNNING and assigned before anything is disturbed - state=RUNNING assigned=mech-a
[PASS] NEG-1 no transfer occurs without a recorded decline
[PASS] NEG-2 with its device dead the task stays NON-TERMINAL rather than being failed or faked
[PASS] the run is never COMPLETED while no device executed it
[PASS] PRECONDITION 1: the holder is judged UNAVAILABLE before the decline
[PASS] the decline is accepted and recorded as user intent - status=200
[PASS] the SAME task id is preserved across the transfer
[PASS] ownership is RECORDED: from=mech-a to=mech-b
[PASS] the transferred task is re-queued for its new owner - state=QUEUED assigned=null
[PASS] NEG-3 a DUPLICATE decline does not transfer again or move the epoch - epoch 2 -> 2
[PASS] NEG-4 the RECOVERED original holder does not re-take work that has moved away - assigned=mech-b
[PASS] the transferred task REACHES a terminal state - COMPLETED
[PASS] it COMPLETED rather than failed, so the transfer really delivered the work - result={"waitedMs":6000}
[PASS] the terminal result is REAL
[PASS] the executor of record is the ALTERNATE, not the device that died - assigned=mech-b
=== PASS (17/17) ===
```

Four of those are negative controls, and they are the ones worth naming: no transfer without a recorded
decline; a dead holder's task stays non-terminal rather than being failed or faked; a duplicate decline is
inert; and a **recovered** original holder cannot take back work that has moved. That last one is the
double-execution guard, tested rather than assumed.

One honest note on my own assertion: `completedAt` is `undefined` for this task, and the check passed on the
`result` arm of an `||`. So "the terminal result is real" is established by the result payload, **not** by a
completion timestamp, and I am not claiming the latter exists.

## What this closes

Gates **3** (single-machine dual-node handoff E2E), **4** (an actual ownership transfer occurs) and **5** (the
same task id continues on the other device and reaches terminal) are now verified by **my own instrument**, in
addition to the cross-host run that passed 13/13 and the UI-level result-return that passed 9/9.

## What remains open

- Gate 7's cross-host half has passed once (13/13); a re-run with my node named **`Mech-test`** awaits the
  development host's window, which is currently shut.
- Gates 9, 10, 11 and 12 depend on step 7, which has not been taken for UXI-391.
- Gate 12's board condition is already established and needs no further testing: **no other executable
  workbook exists** — every other workbook is `REVIEW_COMPLETE`, frozen or `FINAL_PRODUCT_ACCEPTED`, and
  `XX-000` is the template with `execution_enabled: false`. So the required outcome will be a **typed
  zero-claim**, which is a classification rather than a claim.

## Evidence

`mission-book/reports/UXI-391/review-by-mech/handoff-verification.json` — the task id, both node ids, the
from/to ownership refs, the epoch, the final state and result, and all seventeen results.
