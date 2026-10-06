# REX-890 claim-readiness preflight — Mech

Author: Mech-DS (`MEGA-REP`), 2026-10-06. English reading of [REX-890_CLAIM_READINESS_MECH.md](../REX-890_CLAIM_READINESS_MECH.md); the Chinese source remains authoritative. REX-890 is the terminal task of the research-strengthening series.

```text
Measured      utopia @ b06504f (origin/main); the REX-806 head 3950d47 (contains every accepted REX head);
              the resident City 172.31.12.151:4391, running the accepted candidate 0261a9e
Boundary      READ-ONLY preflight: it does not claim REX-890, writes none of its workbook fields, creates no
              reports/REX-890, merges nothing and deploys nothing
```

## Why now

REX-890's final gate requires a successful opposite-host reproduction, and two of its minimum-study elements - one injected fault with recovery, and one handoff - have no ready evidence in the fabric as it stands. Measuring that before anyone claims the task is far cheaper than discovering it halfway through.

## The gate as written

The minimum study must contain multi-device execution, one handoff or routing decision, one injected fault, recovery, repetitions, one replay, one ablation and an artifact export. The opposite host must rebuild from the artifact, execute independently, recompute key metrics, compare trace/provenance, point out inconsistencies and reproduce again after repair - reading the report is explicitly not enough. The deliverable is `mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`, and the marker `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` needs a successful opposite-host reproduction, green exact-head CI and a passed exposure gate.

## Element by element, measured

```text
element                       state today                    evidence or gap (measured)
multi-device execution        present, as placement          the REX-806 package's 24 rows land on 2 devices (20 / 4)
one handoff or routing        routing only, NO handoff       live City GET /research/replays -> supportedScenarios=[WAIT];
                                                             replay.mjs:55 refuses scenarioId!=='WAIT' or a faultProfileRef
                                                             source with REPLAY_CONDITION_UNAVAILABLE
one injected fault+recovery   ABSENT                         the package's third exclusion ("fault and recovery metrics: no
                                                             fault receipt is present in the provided sources");
                                                             live City GET /research/faults -> 404 (the fault controller
                                                             arrives with fe700ab, which the deployed 0261a9e does not contain;
                                                             fe700ab is inside the REX-806 head 3950d47)
repetitions                   present                        18 campaigns / 24 runs / 22 measured / 2 warmups
one replay                    present                        11 replays (7 REPLAY rows + 4 ABLATION rows)
one ablation                  present                        4 rows; the seed-only divergence falls exactly on them
artifact export               present                        reports/REX-806/artifact (10 files + checksums; clone-verified 10/10)
trace/provenance comparison   materials exist                rawPointers: 18 receipts, 26 canonical tasks, 176 trace records,
                                                             17 experiments; provenance cross-check 8/8 separately
opposite-host reproduction    not started                    REX-806 workbook still has review_host null
RESEARCH_MATERIAL_SYNTHESIS   does not exist yet             path fixed by the workbook
```

One deployment fact also matters for REX-807's Export and Danger sections: the resident City runs `0261a9e`, which serves neither the fault controller nor REX-806's artifact surface (`GET /research/artifacts` is a 404 as well). The package exists because the REX-806 CLI read that City's campaign routes; a package existing does not mean the City serves an export surface.

## Three options for the fault element - and the choice is not this host's

```text
A  deploy a candidate containing the fault controller (the minimum is the REX-806 head, which already contains
   fe700ab), inject one real fault on the City, observe recovery and pair it with the contemporaneous campaign
   receipt; the package keeps that fault/recovery exclusion (the exporter is deliberately campaign-scoped in v1),
   so the study's
   fault evidence comes from the fault receipt set, not from the artifact.
   Cost: one deployment plus one exercise. No product change.
B  extend the exporter and replay to carry fault receipts - the v2 scope decision, since replay would first have
   to snapshot fault conditions. Cost: product change, and either a new workbook or an explicit scope ruling.
C  the record holder rules that the minimum study's "one injected fault" is satisfied by the fault controller's
   receipts and recovery observations, without requiring it in a campaign receipt or the artifact - recorded in
   the REX-890 workbook.
```

The same decision is owed for "one handoff": v1 supports the WAIT scenario only, so a handoff is not expressible in this generation unless (i) the routing decision already captured by placement rules is accepted as satisfying it, or (ii) a handoff scenario is built, which is new product scope beyond the accepted REX heads.

Suggested rather than decided: option A, plus (i), with both judgements written into the workbook; if a real handoff scenario is required, it belongs in the series' scope as an addition rather than inside REX-890's completion gate.

## The checklist a claimant should run

1. Confirm all seven markers REX-801..807 are released and take each task's ACCEPTED SHA - not a development head, not a branch name.
2. Build the union from those SHAs and measure every ancestor relation; the union should be main plus the accepted REX-807 head, which in turn should contain the REX-806 union (3950d47 already contains the three accepted REX heads).
3. Dependency smoke: the 26 research suites (rex801 4, rex802 2, rex803 8, rex804 5, rex805 4, rex806 3).
4. Deploy a candidate that serves both the fault controller and the artifact surface, or option A cannot be carried out and the City will answer 404.
5. Run the representative study, then export; before exporting, check that the City's `GET /research/replays` supportedScenarios matches the scenario the study used (measured today: `[WAIT]`).
6. Produce the eight summary items of RESEARCH_MATERIAL_SYNTHESIS.md; the opposite-host reproduction must be performed by the other physical host, since self-review is forbidden.

## Not done here

No claim was made, no workbook field was written, no reports/REX-890 was created, no candidate was deployed and no fault was injected - so the fault gap above comes from reading the code and a 404, not from an exercise. Nothing here claims REX-890 cannot be completed; it states that there is no ready evidence today, and gives the three ways out. The choices in options A/B/C and the handoff question are the record holder's.
