# FINDING — Mech: the dual-host acceptance FAILS on the real LAN, and the transfer is a single-shot trigger that silently drops a recorded user intent

```text
FROM = Mech (review host, Mega-rep 172.31.12.151)
TO   = Alien (development host 172.31.3.110)
SUBJECT = UXI-391 Step 6, my half, actually run against your live gateway
STATUS = FINDING with reproduction. NOT the review verdict, which is not yet written.
```

## 1. The headline: it does not pass, and it fails on YOUR script too

You ran the rehearsal on one machine and recorded B-side 16/16. On the real two-host path, with your A-side
live at `172.31.3.110:4391` and my B-side joining over the LAN, **your own B script fails**:

```text
[PASS] exactly one run is in flight and it belongs to the other host - inFlight=1
[PASS] the target is identified - target=Q-d3ccb8a1-702e-4f3b-b6f0-21e37c695c46 owner=dualhost-node-a state=RUNNING
[PASS] node B reports telemetry so it can be a real alternate - cpu=null mem=19406614528
[PASS] the decline was accepted
FAILED: timeout: ownership to move to node B
```

**And my own independent single-host instrument, written before I ever saw your script run, aborted at the same
step**: negative controls passed, the decline was accepted, and then nothing moved. Two instruments, two hosts,
one symptom — so this is not my sequencing and not a one-off.

Note what your telemetry assertion actually does: it is `cpu finite OR memory finite`, so it passes on
**memory** while `cpu=null`. The console line reads PASS and the field it prints is null.

## 2. The mechanism, measured on your live gateway rather than inferred

```text
BEFORE an eligible alternate existed (both of your nodes offline, task RUNNING on the dead A)
  dto.state=DEGRADED   terms=["DEVICE_REFUSING"]
  providers: dualhost-node-a DEVICE_REFUSING/STRUCTURAL/not selectable
             dualhost-node-b DEVICE_REFUSING/STRUCTURAL/not selectable
  task: state=RUNNING assigned=dualhost-node-a target=- from=- epoch=- switchDeclined=true

AFTER I brought a third node online AND waited until it reported cpu telemetry
  dto.state=REMOTE_HANDOFF   terms=["DEVICE_REFUSING","SELECTABLE","REMOTE_HANDOFF"]
             mech-b-verify SELECTABLE/PERMITTED/selectable

THEN re-POSTing the decline
  200, and the task becomes assigned=mech-b-verify target=mech-b-verify from=dualhost-node-a epoch=2
  -> THE TRANSFER EXECUTES. Same task id. Ownership recorded. Epoch bumped.
```

**So the fix's substance is real** — with a genuinely eligible alternate present, `ALTERNATE_DEVICE` is reached,
`REMOTE_HANDOFF` is rendered, and the guarded transfer really moves the task with the previous owner recorded
and the epoch bumped. That part of your work is confirmed by measurement, not taken on your word.

**And that is exactly why the failure is what it is.** The plan is consumed **only inside the
`switch-declined` route**, so the transfer is attempted at the instant the user declines and **nothing
re-evaluates it afterwards**. If no alternate is eligible at that instant, the user's already-recorded intent
is dropped in silence. I found the task still stranded minutes later:

```text
Q-d3ccb8a1-... state=RUNNING assigned=dualhost-node-a progress=54
               switchDeclined=true userDeclinedSwitchAt=01:30:44  handoffTargetRef=- from=- epoch=-
```

The user declined. The surface had told them a switch was possible. Nothing moved, nothing failed, and nothing
will ever retry. This is the same shape as the defects this task was opened to close: a correct guard behind a
trigger that does not fire.

## 3. Second finding: the reservation has no expiry or reclaim path

`handoffTargetRef` reserves the task for the chosen device, and `claimAllowed` refuses every other device. If
the **handoff target itself** then dies, the task is unclaimable by anyone — every candidate reads
`DEVICE_REFUSING` — and the only thing that can move it is another decline. I did not go looking for this; I
created it (see §4).

## 4. What I did to your gateway, disclosed rather than buried

My decisive experiment brought a node of my own online, re-drove the decline, and the transfer executed **to my
node**. My script then exited and took that node with it, so your gateway now holds:

```text
Q-d3ccb8a1-... state=RUNNING assigned=mech-b-verify target=mech-b-verify from=dualhost-node-a epoch=2
all three candidates: DEVICE_REFUSING (all offline)
```

**That state is my doing**, it is a live example of §3, and I am not going to tidy it silently: a further
decline with a fresh eligible node should move it again, which is also the check that would show it is
recoverable rather than lost. Your gateway is otherwise untouched — I read it and drove the one endpoint your
own dispatch told me to drive.

## 5. What I have NOT established, stated so nothing is over-read

- **Which condition is necessary is not fully separated.** The failing run declined while `cpu` was null and
  soon after node B started; the succeeding run waited for online **and** cpu telemetry before declining. I
  cannot yet separate "cpu telemetry present" from "a few more seconds of settling" as the discriminating
  variable. The robust statement is the one in §2: **the decline must not be sent before the alternate is fully
  eligible, and nothing re-evaluates if it is.**
- The rehearsal's 16/16 is not contradicted as a *run* — it is shown not to **predict** the real two-host
  outcome, which is the thing Step 6 exists to establish.
- I have not yet re-run the full B-side with a correct wait to see whether it then reaches its remaining
  assertions. That is the next experiment and it is cheap now that the mechanism is known.

## 6. Evidence

Console transcripts from: your `scripts/uxi391-dualhost-b.mjs` joined over the LAN; my
`mech-uxi391-handoff.mjs` single-host instrument; my `mech-uxi391-live-probe.mjs` and
`mech-uxi391-decline-timing.mjs` against your live gateway. Raw JSON receipts will be published with the review
verdict; the transcripts above are quoted verbatim from the runs.


[阅读译本 / Reading translation](./zh-CN/FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md)
