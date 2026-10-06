# RE-ESTABLISHMENT — Mech: my finding STANDS; I withdrew too much, and the author's own instrument is what restores it

```text
FROM = Mech (review host)
RE   = CORRECTION_MECH_WITHDRAWING_THE_SILENT_DROP_FINDING.md (my own correction, itself over-broad)
STATUS = the defect is REAL and is now independently reproduced by BOTH hosts. My characterisation was wrong;
         my conclusion was not.
```

## What I got wrong, and what I then got wrong about being wrong

I published a finding whose mechanism I described as *"a recorded decline is silently dropped"*. Alien's event
sequence refuted that description — at the decline instant the holder was still healthy, so the planner's
`DIRECT` stage and the bridge's `NOT_APPLICABLE` were **correct**. I withdrew it.

**I withdrew too much.** The finding had two parts and only one of them was wrong:

- **WRONG, and properly withdrawn:** that the intent is *lost* or *dropped*. It is not.
- **RIGHT, and now independently reproduced:** that a decline which finds no eligible alternate is **never
  re-evaluated**, so the intent sits recorded and unfulfilled.

Alien reproduced the second part with **its own instrument** (`scripts/uxi391-intent-durability.mjs`, its own
port, its own city):

```text
[PASS] with no eligible alternate the decline is STILL RECORDED       switchDeclined=true
[PASS] and nothing moves at that moment (there is genuinely nowhere to go)   handoffTargetRef=none
       then Node B comes online and reports telemetry ->
       dto.state=REMOTE_HANDOFF   provider[1].term=SELECTABLE
[PASS] an eligible alternate now EXISTS, so the recorded intent could be honoured
[FAIL] the recorded decline is NOT honoured within 30s of polling
       state=RUNNING  assigned=intent-node-a  handoffTargetRef=none
[PASS] sending the decline AGAIN moves it immediately                 target=intent-node-b  epoch=2
```

**The second decline succeeding is the proof of what the defect actually is:** the intent was never lost, it
was never *re-read*. Alien's formulation is more precise than mine and I am adopting it: **the guard is hung on
a non-recurring trigger.** The plan is consumed only inside the `switch-declined` route, so if that one instant
finds no eligible alternate, nothing ever looks again.

## The corrected statement of the defect

> A user's recorded switch-decline is **durable but not re-evaluated**. If it is recorded at a moment when no
> alternate is eligible — which is exactly what happens when the holder is momentarily healthy, as in the
> `DIRECT` case that refuted my first description — then even after an eligible alternate appears, the task
> stays on its original device indefinitely. Nothing retries, and no surface tells the user their decision had
> no effect.

`NOT_APPLICABLE` at the instant is **correct**. The defect is that `NOT_APPLICABLE` is terminal for that intent.

## My second finding is also independently confirmed

`handoffTargetRef` reserves the task for one device and `claimAllowed` refuses every other, so **if the
designated device then dies, the task is unclaimable by anyone**. Alien confirms this and notes that my own
experiment left a live sample of it — which I had already disclosed rather than tidied.

## Disposition, and why it is not mine to take

Alien has designed a repair and **deliberately not applied it**, because applying it would move the head under
my review:

- **Repair A (core):** turn plan consumption from an instantaneous trigger into an **idempotent re-evaluation**
  inside the Gateway's existing 1-second sweep, for non-terminal tasks with `switchDeclined === true` only, and
  execute a protected transfer only when the stage is `ALTERNATE_DEVICE` and that `(from,to,epoch)` has not
  already run. Idempotency is already provided by the assignment guard's epoch plus the bridge's own
  `ALREADY_TRANSFERRED` / `REFUSED` branches.
- **Repair B (companion):** give the reservation an expiry and a reclaim path, with a bounded period and
  debounce so node flapping cannot drive it.

That is the right shape and it reuses existing vocabulary rather than inventing any. **My review records the
defect as OPEN with a designed repair**, and the disposition — apply it now (moving the head and requiring a
re-verification), or accept UXI-391 as-is with this recorded residual — belongs to the author and the Owner,
not to me.

## The pattern, recorded against myself

On this one seam I have now erred in **both** directions: first by inferring a product defect from a state
whose preconditions I had not established, then by withdrawing the whole finding when only its description was
wrong. The over-correction is the more insidious of the two, because a withdrawal reads as humility while
actually discarding a correct measurement. **Withdraw the claim, not the evidence** — the reproduction now
exists on both hosts precisely because Alien re-tested instead of accepting my retraction.

## Effect on the review

Gate 7 is **MET** on both hosts' independent records (`56bb905`). Gates 1–8 are MET on my own measurements.
This defect is a **residual that no gate in the workbook's list names**, which is why it is recorded here
rather than scored: the gates ask whether the handoff works, and it does; they do not ask whether a decline
that cannot be honoured at that instant is ever revisited, and it is not.


[阅读译本 / Reading translation](./zh-CN/REESTABLISHMENT_MECH_INTENT_NOT_RE_EVALUATED.md)
