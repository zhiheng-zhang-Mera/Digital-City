# UXI-301 — HANDOFF-SEAM PREMISE: EXECUTED RESULT (Alien)

```text
AUTHOR  = Alien, independent of UXI-301's development (Mech develops it)
SUBJECT = the premise behind Mech's deferred remote-handoff gate item
METHOD  = the exact experiment specified in HANDOFF_SEAM_PREMISES_MEASURED_ALIEN.md, executed
VERDICT = BOTH PREMISES FALSIFIED BY MEASUREMENT
```

The earlier note in this directory read the frozen City's code and stated, deliberately, a **hypothesis**
rather than a result — because this programme has recorded seven times that inferring an outcome from the
*shape* of a mechanism is how wrong conclusions get published. The experiment has now been run and the
hypothesis is confirmed. This file replaces "looks drivable" with measured numbers.

## The measurement, raw

Probe: `.runtime/uxi301-premise-probe.ps1`, run against the frozen City (product tree byte-identical to
`main` `1a5bc0e`), gateway + one real reference node (`alien-reference-node`), both service processes
started and stopped inside a single command.

```text
registered nodes = 1  (alien-reference-node)

TYPE=WAIT              created_type=WAIT              (echoed back by the API)
  transitions      : 220ms:RUNNING -> 6310ms:COMPLETED
  RUNNING occupancy: 6090ms

TYPE=CHECKPOINT_DEMO   created_type=CHECKPOINT_DEMO
  transitions      : 214ms:QUEUED -> 1088ms:RUNNING -> 3483ms:COMPLETED
  RUNNING occupancy: 2395ms
```

## Premise 1 — *"the City can create only one task type"*: **FALSIFIED**

Two different types were created through `POST /api/v0/tasks` in the same run, and the stored task echoed
the type requested (`created_type` matches in both cases). This is execution, not a code reading: the API
accepts a chosen type and persists it.

## Premise 2 — *"there is no way to HOLD a node occupied"*: **FALSIFIED**

A `WAIT` task held the node in `RUNNING` for **6090 ms** — six seconds during which the node is
demonstrably occupied and the work is demonstrably still assigned and in flight. That is precisely the
condition Mech reported it could not sustain, and six seconds is three orders of magnitude more than the
millisecond-scale window a routing query needs.

## And the incidental correction

Mech's premise also asserted the City's work *"finishes in well under a second"*. Measured, the fast type
(`CHECKPOINT_DEMO`) occupied the node for **2395 ms**, not sub-second. The likely origin of the belief is
that the earlier pilots poll at ~1 s intervals, so a task is typically *observed* already finished — but
observed-early and short-lived are different facts, and the deferral was reasoned from the former.

## What this changes

Mech deferred the gate item — *"a remote handoff's result returns to the current surface"* — and put the
question to the Owner as whether the gate may be discharged with the seam **measured-and-attributed to the
City** rather than driven. That framing assumes the seam is undrivable. It is drivable:

1. create a `WAIT` task to occupy the interaction device's node (a ~6 s window, measured),
2. inside that window issue the routing query with a second eligible device present,
3. observe `ALTERNATE_DEVICE` → `REMOTE_HANDOFF` and assert the result returns to the current surface.

Mech's own probe already reaches `withoutDecline=SWITCH_OFFERED` and `withDecline=ALTERNATE_DEVICE` when
given the condition, so step 1 was the only missing ingredient — and it is available.

**Recommendation, offered as a recommendation:** run the drive rather than rule on the waiver. It is
cheaper than an Owner ruling, it produces evidence instead of a waiver, and it is what UXI-301's own step 7
requires ("drive the UI with real concurrency, provider-unavailable, device-busy and remote-handoff E2E,
not static mocks only").

## Boundaries observed

- Alien did **not** touch Mech's branch, UXI-301's workbook fields, or `apps/**`. The probe drives the
  frozen City's HTTP API read-only in the sense that it creates throwaway tasks and stops its own services.
- The probe is reproduced verbatim at `mission-book/reports/UXI-301/` so any host can re-run it and get the
  same numbers rather than taking them on Alien's word.
- Alien did **not** claim UXI-301: `development_complete` is `false` and `review_host` is null. Alien
  remains the eligible Review host and claims the Review when Mech declares development complete.
- **Not a criticism of Mech's measurement discipline.** Its four failed attempts are recorded in detail and
  its probe does reach `ALTERNATE_DEVICE`. What is falsified is one inherited **premise** — that only one
  task type exists — which the attempts took as given.


[阅读译本 / Reading translation](./zh-CN/HANDOFF_SEAM_PREMISE_PROBE_RESULT_ALIEN.md)
