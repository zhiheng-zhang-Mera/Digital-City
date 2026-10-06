# REX-803 — two-worker topology rehearsal (Mech, 2026-10-06)

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for REX-803
RECORDED TARGET     a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df — UNCHANGED, and still what PR #31 points at
BRANCH              probe/REX-803-mech-two-worker-rehearsal @ 42acdc6bfacb1e2260364afd2edce041f003638c
                    stacked on repair/REX-803-mech-receipt-order-and-close @ 07e8c3c
WHAT THIS IS        an AUTHOR SELF-TEST, in the form of a rehearsal. Not review evidence, no verdict, no marker.
                    It is NOT the completion gate: the gate needs the Alien host's own node, and two identities on
                    one physical host cannot satisfy it.
```

## 1. Why a two-worker rehearsal was worth writing at all

Every campaign fixture in this task's suite, and both physical campaigns run on the real resident City, declared
**one** worker. On the physical topology the Android handset was a CONTROL SURFACE, not a worker. So the only place a
repetition is assigned to a device —

```js
const workers = context?.workers ?? [];
const target  = context?.targetDeviceRef ?? (workers.length > 0 ? workers[seed % workers.length] : null);
```

— has never run with more than one candidate. With one worker `workers[seed % 1]` is the only worker, so a one-worker
fixture cannot distinguish *the rule works* from *the rule never runs*. That is a coverage gap rather than a hunch, and
it is the shape this programme has now recorded repeatedly: a suite that only exercises the degenerate case reports a
property of its own fixture.

## 2. What the rehearsal found on its first run

```text
red run on 07e8c3c (probes only)      tests 2   pass 0   fail 2
  "6 of 6 campaign task(s) were created with no targetDeviceRef, so the derived-seed placement rule never ran and
   the receipt's assignment is claim order, not the declared rule"
  "run 1 (seed 2220486659) landed on rehearsal-alpha, but the declared rule selects rehearsal-beta"
```

The root cause is a single wrong read, and it is checkable by reading two lines:

```text
server.mjs  campaignContext()  carries the topology under `manifest.workers` and never sets a top-level `workers`
server.mjs  runOnce()          reads `context?.workers ?? []`, so the array is ALWAYS empty
```

Therefore `target` was always `null`, every repetition was created **untargeted**, and the `assignedNodeId` the receipt
records was whichever able worker claimed first. The module's own comment claimed the opposite — *"the same campaign
places the same repetition on the same device, on any host"* — and the paper-material index repeated it. With one
worker both readings produce the same observable behaviour, which is exactly why it survived two physical campaigns, a
33-probe suite and one opposite-host review of the sibling work.

This is the most consequential defect found on this task so far, because it is a **false reproducibility claim in the
task's own deliverable**, not a storage edge case. The campaign receipts were never wrong about *what happened*; the
claim about *why that device* was.

## 3. The repair

```text
server.mjs   runOnce():  const workers = context?.manifest?.workers ?? context?.workers ?? [];
```

The canonical claim path already enforces a strict target (`claimAllowedByTarget` withholds a targeted task from every
other device), so once the target is set the placement is real rather than advisory. One consequence is stated plainly
in the commit and repeated here: a repetition is now **bound** to its declared worker, so if that worker leaves
mid-campaign the run WAITS rather than being silently rerouted — the same no-silent-fallback rule the targeting module
exists for — and it surfaces as a TIMEOUT carrying its reason if the worker does not return inside the campaign
timeout. A reviewer who prefers the other resolution (delete the dead rule, correct the documentation) is disagreeing
with the code's stated intent, not with a measurement; the measurement above is what that disagreement has to answer.

## 4. Measurement

```text
NEW PROBES                 2/2 on the repair; 0/2 on 07e8c3c (the red run above)
REX-803's five suites      24/24
FULL SUITE                 1373/1376, the 3 failures being this host's resident-City host reservation
CI (exact head)  V0.2 checks push run 37420563832 COMPLETED SUCCESS (attempt 1) on 42acdc6, jobs android and
                 gateway-web both success; read per-run from the Actions API and matched on headSha
```

Both installs were run as `ci.yml` prescribes, so the full-suite figure does not carry the missing-`city`-install
artefact this host corrected earlier.

The fixture deserves one note: the campaign seed is **chosen by scanning** for one whose derived run seeds span both
workers, and the probe asserts that both workers were actually used. The earlier probe for finding F-S6 passed on the
broken code because its fixture could agree with the defect by luck; this fixture is built so that it cannot.

## 5. What this changes about the record, and what it does not

```text
CORRECTED   reports/REX-803/PAPER_MATERIAL_INDEX.md: the reproducibility entry now carries the correction rather
            than the claim, with a pointer to this file
UNCHANGED   REX-803's head, workbook, review target, claim, terminal marker and PR #31
NOT CLAIMED the completion gate, which still needs alien-reference-node online in the City (last heartbeat
            2026-10-05T11:15:06.977Z, unchanged across every measurement this host has taken)
```

The reason the head is not hardened is unchanged from the third-class sweep: this task has already suffered one claim
collision, and a reviewer claiming `a695bb9` must not find it moved. The author will harden the head on request — and
for this finding in particular the author's recommendation is that it *should* be hardened, because a false
reproducibility claim is worse to leave on a review target than a storage edge case. That recommendation is recorded
here rather than acted on unilaterally.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/AUTHOR_TWO_WORKER_REHEARSAL.md)
