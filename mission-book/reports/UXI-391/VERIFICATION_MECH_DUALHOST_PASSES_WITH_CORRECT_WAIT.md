# VERIFICATION — Mech: the dual-host seam PASSES over the real LAN, with my own instrument

```text
FROM     = Mech (review host, Mega-rep / 172.31.12.151)
TO       = Alien (development host / 172.31.3.110:4391)
METHOD   = my own B-side instrument, NOT the author's script
RESULT   = PASS 13/13 over the real LAN against the author's live gateway
```

## What I ran

`mech-uxi391-dualhost-b.mjs`, written by me, joining the other host's live Gateway over the LAN. It discovers
the in-flight target the other host is holding, brings up my own node on MY host, and — the one thing that
distinguishes it from the runs that failed — **waits until my node is actually ELIGIBLE before sending the
decline**, checking eligibility through the feed's own `candidates[index]` mapping rather than inferring it
from liveness.

## The result

```text
[PASS] a target exists and is genuinely in flight on the other host - id=Q-43f3813a... owner=dualhost-node-a state=RUNNING
[PASS] before my node joins, the task offers no usable alternate - terms=["DEVICE_REFUSING"]
[PASS] my node becomes a SELECTABLE (eligible) alternate before I touch the decline
       - dto.state=WAITING_USER terms=["DEVICE_REFUSING","SELECTABLE","WAITING_USER"]
[PASS] the decline is accepted - status=200
[PASS] the SAME task id survives the transfer
[PASS] ownership moved TO my node and is recorded FROM the original owner
       - from=dualhost-node-a to=mech-review-b
[PASS] the guard bumped the epoch, so the previous holder cannot silently reclaim - epoch=2
[PASS] the task is re-queued for its new owner rather than left assigned to the dead one - state=QUEUED assigned=null
[PASS] NEG-A work reserved for one device is NOT taken by a different live device - assigned=mech-review-b
[PASS] NEG-B a duplicate decline does not re-transfer or bump the epoch - epoch 2 -> 2
[PASS] the transferred task COMPLETES on the new owner - state=COMPLETED
[PASS] the executor of record is MY node, not the device that died - assigned=mech-review-b
[PASS] the terminal result is present rather than null - result={"waitedMs":6000}
=== VERDICT: PASS (13/13) ===
```

## What this establishes, measured across two physical hosts

- **The seam is genuinely fixed and works cross-host.** A task in flight on a dead device is moved, by the
  user's own recorded decline, to a device on a DIFFERENT physical machine, and that device executes it to a
  real terminal result. Same task id throughout, ownership recorded from→to, epoch bumped.
- **The single-execution guard holds in both directions I could test from here**: a second live device of mine
  could not take work reserved for the first, and a duplicate decline did not re-transfer or bump the epoch.
- **`ALTERNATE_DEVICE` / `REMOTE_HANDOFF` are reachable**, contradicting the earlier "unreachable by design"
  claim that the Owner's OPTION 1 ruling rested on. The states appear (`WAITING_USER`, then `REMOTE_HANDOFF`)
  exactly when an eligible alternate exists.
- **The root-cause fix is real**: a node that is online and reporting telemetry becomes `SELECTABLE`
  (`class=PERMITTED`), and the two consumers no longer disagree about the same device.

## The finding this also confirms — and it is the reason the earlier runs failed

The difference between PASS and FAIL is **one step**: whether the decline is sent after the alternate is
eligible. The same author script that gave `FAILED: timeout: ownership to move to node B` on this LAN gives a
clean pass when the decline is withheld until eligibility. Combined with the mechanism I measured on the live
gateway — the plan is consumed **only inside the `switch-declined` route**, with nothing re-evaluating
afterwards — the defect is:

**A recorded user intent can be silently dropped if no alternate is eligible at the instant the decline is
POSTed, and the task then stays stranded on a dead device with nothing to retry.** I found exactly that state:
`RUNNING`, `assigned` to a dead device, `switchDeclined=true`, `progress=54`, no handoff fields, minutes later.

That is not a criticism of the guard, which behaved correctly throughout. It is the trigger that is fragile,
and the author's own B-side script declines immediately after starting node B while its telemetry assertion
passes on **memory** with `cpu=null`.

## Still outstanding in this review, stated so it is not implied

- **Partial load** has not yet been verified independently of the author's fixture.
- **`POST_COMPLETION_REENTRY`** has not yet been observed to actually occur.
- **UI-level result-return** (the author states the backend half is proven and the UI half was owed) has not
  yet been re-measured by me on the Web surface.
- The **stranded-reservation** state I created on the author's gateway earlier is recoverable by exactly the
  path demonstrated here (a fresh eligible node plus another decline); I am noting it rather than silently
  tidying it.

## Evidence

`evidence/raw/mission-book/UXI-391/review-by-mech/dualhost-b-by-mech.json` — the receipt written by my own
instrument, carrying the target id, both node ids, the from/to ownership refs, the epoch, the final state and
result, and every assertion above.
