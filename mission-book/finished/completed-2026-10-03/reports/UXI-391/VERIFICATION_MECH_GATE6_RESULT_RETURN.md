# VERIFICATION — Mech: gate 6 PASSES, the result returns to the ORIGINAL surface

```text
FROM = Mech (review host)   GATE = 6, "the result returns to the original surface"
TREE = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9
RESULT = PASS 9/9, in a real browser on the real page
```

## What was tested, and why it had to be a UI test

Gate 6 is a UI claim, so a backend read-back cannot satisfy it. One page instance is opened, paired and left on
the Devices surface; the run is observed in flight; the device dies; an alternate comes up; the decline is
sent; the work transfers and completes on the alternate — **and then that same page, never reloaded and never
re-pointed at the other node, has to show the finished result.**

## The result

```text
[PASS] the ORIGINAL surface shows the run IN FLIGHT before anything is disturbed
[PASS] the surface FOLLOWS the device loss rather than staying frozen
[PASS] PRECONDITION 1 satisfied: the holder is judged unavailable before the decline
[PASS] the decline is accepted (driven by API, because NO surface control can send it) - status=200
[PASS] ownership moved to the live alternate while the page stayed open - from=mech-ui-a to=mech-ui-b epoch=2
[PASS] the transferred task COMPLETED on the alternate - result={"waitedMs":6000}
[PASS] GATE 6: the SAME page instance (never reloaded, never re-pointed) shows the completed result
[PASS] no raw RS-290 scheduler token leaks into the final rendered page - 22 tokens searched, none found
[PASS] no page errors during the whole gate-6 journey
=== PASS (9/9) ===
```

The screenshot shows the **Task Registry on the original page instance** carrying
`WAIT Q-40f00d9a-362d-4936-af45-9ca322781434` marked **COMPLETED** — the task that was handed off from `mech-ui-a`
to `mech-ui-b` during this very run. The result returned to the surface the user was already looking at.

A second line in that same registry reads **FAILED**. That is the task from my own aborted gate-6 attempt, and
it is worth naming rather than cropping: re-registering an interrupted task's device marks the work FAILED
("interrupted work is not replayed"), which is exactly the rule Alien cited when explaining why my earlier
acceptance instance could not be resumed. It is a visible consequence of my instrument's fault, not of the
product.

## Two faults of MY OWN that this test hit, and both are the recurring class

1. **Locale.** My first run waited for `#connection` to read `ONLINE` and timed out for 20 s. The UI had in fact
   connected — it displayed **在线**, because the app follows `navigator.language` and Edge on this host
   defaults to zh-CN. The product was correct; my assertion assumed English. Fixed by pinning
   `locale: 'en-US'` on the page, which also makes the remaining English assertions meaningful.
2. **Precondition 1, again.** My second run declined the switch **2.5 s** after killing the worker, but the
   Gateway keeps treating the holder as healthy until its heartbeat sweep times out (8 s). While the holder is
   healthy the planner's stage is `DIRECT`, so the decline *correctly* moved nothing and my wait for a transfer
   timed out. This is precisely the precondition Alien recorded, and hitting it independently is a second
   confirmation that it is the operative condition rather than a script detail.

Both were instrument faults on my side, both were fixed rather than worked around, and neither was a product
defect — which is the third time in this review that a negative of mine turned out to be my own precondition.

## What this does NOT establish

**The decline still has to be driven over the API.** UXI-391's change set touches no `apps/web/**` or
`apps/android/**` product code, so no surface control can send it: the offer can be rendered and a user cannot
act on it. That was Alien's own UXI-390 finding and this task does not close it. I am recording it as an open
item against the product rather than as a UXI-391 defect, because closing it is a product decision.

## Evidence

`mission-book/reports/UXI-391/review-by-mech/gate6-result-return.json` and the two screenshots
(`gate6-1-in-flight.png`, `gate6-2-result-returned.png`, sha256 `6e7880c9386473d2…`).
