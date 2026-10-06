# REX-803 development handoff and opposite-host review request — Mech → Alien

```text
FROM            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for REX-803
TO              Alien (opposite physical host) — review_host for REX-803, unclaimed
REVIEW TARGET   a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df
                branch rex/REX-803-mech-scenario-runner (remote tip equals that commit)
                HEAD HISTORY: 85a79eca (first release), e284b712 (seed-identity repair D-7), 57d1c919 (physical campaign
                evidence), a695bb9f (hardening pass D-8/R-1 and D-9/R-2). Each head carried measured green CI at its
                time; THIS one is the review target because it is the only head that has also survived this host's own
                adversarial pass.
PR              zhiheng-zhang-Mera/utopia#31
INDEPENDENCE    the workbook records development_host=Mech, so a reviewer on the Alien host is a different physical
                host, which is what CONSTRUCTION_RULES section 3 requires. This document is NOT a review, and the
                author's own tests are NOT review evidence.
MARKER          SCENARIO_REPETITION_ENGINE_ACCEPTED — held until the review releases it
MERGE AUTHORITY false; do not merge this branch into main on the strength of this document
```

## What to review, in the workbook's own words

The workbook's Review section names the conditions to manufacture independently: **repeated execution, cancellation,
restart, timeout, partial campaign, seed reproducibility**. The author's instruments are in the PR; a reviewer's own
probes are expected in addition, on a `review/REX-803-<host>` branch, against the exact target SHA above.

Suggested attack list (the author's own, offered so the reviewer can reject it rather than repeat it):

```text
A1  Break the accounting invariant: a terminal campaign must satisfy accounted === planned with no state double
    counted. Try a stop racing a timeout; a resume racing a start; an abandon racing a drained loop.
A2  Leak work: after STOP, TIMEOUT, process death or CITY_SHUTDOWN, prove no canonical task is left non-terminal for a
    campaign that is no longer running, and that recovery finds by reference rather than by shape.
A3  Seed reproducibility: prove two independent runs of the same registered manifest derive the same seed sequence for
    the same indices, including after a resume, and that no clock or random source reaches a measured value.
A4  Readiness: prove a campaign cannot start on a topology the City does not have, and that the refusal names what is
    missing; try a manifest whose declared surface exists but whose worker is offline.
A5  Authority: prove an enrolled member and a node credential cannot start, stop or inspect a campaign, and that a
    stale surface cannot stop a campaign it is not looking at.
A6  Trace honesty: prove every settled run (including timeouts and cancellations) has a receipt naming the real
    canonical task, and that a run whose cleanup fails says so rather than reporting a clean stop.
```

## Exact-head CI (author-measured; the reviewer must re-measure independently)

```text
V0.2 checks      37399258359 (push) and 37399254235 (pull) on 57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1
City linkage     37399258414 success
EARLIER HEADS    85a79eca4fe0f4ad8882148725249e016434873e green (V0.2 37398347907/37398374690, linkage 37398375378);
                 e284b712c53e5b7f44acdb878afd6a23c7953735 green (linkage 37399121438). The head moved to repair a
                 defect the first PHYSICAL campaign found, then to add that campaign's evidence.
LOCAL            npm test: 1363 pass / 5 fail — the five are inherited-environment failures, each reproduced at the
                 baseline 213f9f9f (capability-adapters, city-roads) or caused by the resident City holding the host
                 reservation (host-city-launcher x3). The reviewer should re-measure on their own host.
```

## What the physical work already covers, and what it does not

Two controlled campaigns were run on the live resident City with the physical Android handset connected as the control
surface and this host's reference node executing every repetition (evidence:
`utopia:evidence/raw/mission-book/REX-803/`). They cover the happy path on real hardware, the derived-seed property,
the accounting invariant and the trace-run-receipt binding. They do **not** cover failure, timeout, exclusion,
cancellation, restart or partial-campaign behaviour on hardware — that is still only covered by the automated probes,
so a reviewer's own fault instruments remain the point of the review.

## Honest state of the workbook completion gate

The workbook requires at least one controlled campaign on the **Alien + Mech + Android** topology with a full research
trace. At development end this host measured the physical topology rather than assuming it:

```text
alien-reference-node   online=FALSE, last heartbeat 2026-10-05T11:15:06Z   (cannot be started by this host)
android PERM00         member online=FALSE                                (handset is on ADB at this host)
resident 4391 City     running join590 code, no campaign surface yet
```

So the gate is **PARTIAL**: this host can exercise Mech + Android on real hardware, and cannot supply the Alien host.
That is a physical-topology blocker, not a code one, and it is recorded as such in DEVELOPMENT_REPORT.md and
PAPER_MATERIAL_INDEX.md rather than smoothed over.

## Findings handed over (recorded, not repaired, and not claimed as fixed)

```text
F7  The experiment manifest contract has no warmup field, so a campaign that uses warmup measures something its own
    description does not contain. The campaign receipt records the warmup actually used. Owner: REX-801/REX-807.
F8  ANDROID_CONTROL_SURFACE is satisfied by a NAME, not by a platform fact: the topology gate requires a declared
    control surface whose text matches /android/i, while the City's native Android enrollment replaces the app's
    android-<MODEL> client ref with a device id (apps/android/.../NativeEnrollment.kt stores record.deviceId as
    clientRef). OBSERVED on hardware: the live Android surface was dev-be7832e35fc34b85966c3bb43a992e1d. An experiment
    therefore cannot declare the Android topology using the identity the City actually reports. Recorded for REX-807.
F9  REX-801's registry field named `digest` holds the canonical serialisation of the manifest, not a hash. Using it as
    an identity produced defect D-7 (the whole manifest inside every campaign seed). Raised for REX-801/REX-806.
F10 LOW: after a campaign finishes, the owner-facing form still shows the operator's last typed digits rather than the
    parameters of the campaign that ran. The totals state the truth. Recorded for REX-807.
D-7 Defect found by the FIRST PHYSICAL CAMPAIGN and repaired on this head: see DEVELOPMENT_REPORT.md section 3.
```

## What the author asks the reviewer to be sceptical about

The runner is deliberately NOT a scheduler, and the temptation for a reviewer is to test it as one. The properties worth
attacking are the ones in section "What a campaign is" of the PR: that a run is real canonical work, that an absence is
always explained, that a stop reaches the work, and that a resume continues rather than replays.

## Addendum: a hardened branch exists, and the review target deliberately did NOT move

After this handoff was written the author ran a third sweep over this module, using the state-machine/lifecycle classes
the opposite host's MON-903 review had found in a sibling module — the classes his own earlier class-driven passes had
never looked for. It found three defects in this module's receipt handling and close boundary
(`reports/REX-803/AUTHOR_THIRD_CLASS_SWEEP.md`). The fix is published as

```text
repair/REX-803-mech-receipt-order-and-close @ 07e8c3cf31e9aefdb4d12c58e129da39935c8314
   F-S6  receipts() sorted the FILE NAMES, i.e. random UUIDs, so the bounded "newest" list returned the three
         OLDEST campaigns while the comment claimed "newest by name order"
   F-S7  the bounded list stated nothing about the size of the history behind it
   F-S8  close() drained the loop and start() then accepted and LAUNCHED a new campaign into a shutting-down process
```

**The recorded review target is unchanged at `a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df`.** The author deliberately did
not harden the head: this task has already suffered one claim collision in this programme, and a reviewer who claims the
target in this handoff must not find it moved underneath them. The reviewer may either adopt the branch into their own
review head, or ask the author to harden `a695bb9` and re-record its exact-head CI — both are one command away, and the
second option produces a new target rather than replacing this one silently.

### A second, more serious finding, and a recommendation about the head

A two-worker topology rehearsal — the first time this campaign code has ever run with more than one placement candidate
— found that **the derived-seed placement rule never executed** (`reports/REX-803/AUTHOR_TWO_WORKER_REHEARSAL.md`).
`runOnce` read `context?.workers`, which the route never sets, so every repetition was created untargeted and the
`assignedNodeId` on the receipt was whichever able worker claimed first. The module comment and
`PAPER_MATERIAL_INDEX.md` both claimed the opposite. With one worker — every fixture, and both physical campaigns,
because the Android handset was a control surface rather than a worker — the two readings are indistinguishable.

```text
probe/REX-803-mech-two-worker-rehearsal @ 42acdc6bfacb1e2260364afd2edce041f003638c   (stacked on the branch above)
  red on 07e8c3c: "6 of 6 campaign task(s) were created with no targetDeviceRef"
                  "run 1 (seed 2220486659) landed on rehearsal-alpha, but the declared rule selects rehearsal-beta"
  fixed:          runOnce reads context?.manifest?.workers, so a repetition is targeted by its own derived seed
  CI:             push 37420563832 SUCCESS attempt 1
```

**The author's recommendation for this one differs from the storage findings: the head SHOULD be hardened.** A false
reproducibility claim is worse to leave on a review target than an edge case in a receipt list, and a reviewer who
spends budget discovering it has spent it on something the author already knows. The author is not acting on that
recommendation unilaterally, because the collision record is explicit about what happens when a target moves under a
reviewer; one instruction from the reviewer is all it takes.


