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
                                                             source with REPLAY_CONDITION_UNAVAILABLE. The routing half now has
                                                             its own evidence: the placement policy itself was recomputed from
                                                             the City's raw receipts, 6/6 (REX-806's
                                                             PLACEMENT_RECOMPUTE_CITY_MECH.py)
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

## Is option A only a deployment exercise? Measured

"Does the capability exist" cannot be answered by reading code, so a probe was written that starts one City in a temp directory only (never touching the resident City, its data dir or its credentials) and was run against two heads with the identical file: [rex890-fault-and-artifact-feasibility.mjs](./rex890-fault-and-artifact-feasibility.mjs).

```text
HEAD UNDER TEST  3950d47 (the REX-806 union head: fault controller and artifact surface)
  PASS  artifact surface is deployed (typed 422, not 404)        HTTP 422 ARTIFACT_NO_SOURCE
  PASS  artifact preview answers the same way                    HTTP 422
  PASS  [non-discriminating] research surface refuses node cred   HTTP 401
  PASS  a fault can be injected on this head                     HTTP 200
  PASS  the fault is targeted: faulted node fails, other does not target=503 other=200
  PASS  recovery is observable after the stop                    stop=200 recovered=200
  PASS  the receipt exposes the fault with metrics               status=STOPPED injected=1 detection=null recovery=6
  PASS  fault and artifact surfaces coexist on one City           artifacts=422 fault detail=200
  8/8 pass, exit=0

CONTROL  0261a9e (the candidate actually deployed on the City today)
  FAIL  artifact surface                                        HTTP 404
  FAIL  artifact preview                                        HTTP 404
  PASS  [non-discriminating] research surface refuses node cred  HTTP 401
  FAIL  a fault can be injected                                 HTTP 404
  FAIL  fault-dependent checks were skipped, not passed          unmeasurable on this head
  1/5 pass, exit=1
```

So REX-890's injected fault with recovery is executable on a head that already exists but is not deployed - including targeting (only the faulted node fails), observable recovery, and metrics on the fault receipt. Option A is a deployment exercise, not a product gap. Conversely the City today really does answer 404, and the same probe distinguishes the two heads, which is what gives the measurement its weight.

One honest detail the probe had to hit itself: it stopped the fault inside the 2 s heartbeat timeout, so `detectionTimeMs` stayed NOT_MEASURED with a typed `missingReasons` entry while `recoveryTimeMs` was measured - the "never write a number you did not observe" rule holds inside the fault receipt too. A study that wants a detection value must let the fault outlive the heartbeat timeout and wait for the offline transition to be observed.

Two of the probe's own defects are kept in the code with their comments: it first read only `error.code` although the City answers errors in two shapes (a string on older routes, an object on newer ones), which reported a working export surface as a failure; and it assumed a fault existed, so it threw on the control head that has no fault route - the very head it was written to characterise. One check (the research surface refusing a node credential) passes on both heads and is labelled non-discriminating, so it must never be quoted as evidence that the fault surface exists.

## End-to-end rehearsal on a brand-new City

Existence of a capability is not the whole chain, so a rehearsal ([rex890-study-rehearsal.mjs](./rex890-study-rehearsal.mjs), temp dir, ephemeral port, throwaway credentials, nothing of the resident City touched) runs: fresh City, two execution nodes, experiment registration, a 6-repetition campaign, a real fault injected and recovered, export by the real CLI, verification by the independent verifier. **13/13 pass**:

```text
PASS  a fresh City starts and answers the owner            HTTP 200
PASS  two execution nodes are online                        worker-a:true worker-b:true
PASS  the experiment registers / the campaign starts         HTTP 200 / HTTP 200 (6 runs)
PASS  the campaign settles                                   state=COMPLETED
PASS  the City holds a receipt for the campaign              receipts=1
PASS  both workers did real work (multi-device placement)     worker-b and worker-a each claimed
PASS  a fault can be injected in this City                    HTTP 200
PASS  the fault is targeted: only the faulted worker refused  503 vs 200
PASS  recovery is observable after the stop                   stop=200 recovered=200
PASS  the fault receipt records what was observed             STOPPED, injected=1, detection=null, recovery=4
PASS  the real exporter CLI produces a package                exit=0; 1 campaign / 6 runs / 6 measured / 4 reported / 23 NOT_MEASURED
PASS  the independent verifier accepts the produced package   14/14 independent checks pass
```

The produced package then passes this record area's third implementation (Python, 27 checks): 27/27. It comes from a **different City**, so the checker is not tailored to one package.

## What the rehearsal measured about writing the study

1. Manifest `workers` must be a subset of `hosts`, and `SINGLE_CITY` permits one host. A two-worker study therefore **cannot** declare SINGLE_CITY: the correct shape is `TWO_HOST_MESH` with `hosts = workers = [two device refs]`. Measured refusals: SINGLE_CITY with 2 hosts is rejected `TOPOLOGY_IMPOSSIBLE`; hosts=[one] with two workers is rejected because "worker a is not one of the declared hosts". The 18 real receipts in the resident City use exactly TWO_HOST_MESH.
2. Each campaign run creates ONE task and addresses it to the worker placement chose, so the driver must attempt a claim from every worker and report RUNNING then COMPLETED from whichever received it. Runs are sequential: the next task appears only after the previous one reaches a terminal state.
3. A fault injected during a campaign and landing on the addressed worker legitimately stalls that run. That is an experiment worth doing on its own; it should not be mixed into "can a City produce an artifact".
4. Hosting trap: when the City runs inside the parent process, the CLI must NOT be invoked with spawnSync - spawnSync blocks the parent's event loop, so the child's HTTP request to the City is never served (measured three times as ETIMEDOUT). Async spawn works.

Four defects of the rehearsal itself are kept in its comments: calling record() inside the drive loop (one check printed hundreds of times and buried earlier phases), stopping the same fault on every iteration, the spawnSync self-deadlock, and writing two workers into `hosts` while declaring SINGLE_CITY.

## The checklist a claimant should run

1. Confirm all seven markers REX-801..807 are released and take each task's ACCEPTED SHA - not a development head, not a branch name.
2. Build the union from those SHAs and measure every ancestor relation; the union should be main plus the accepted REX-807 head, which in turn should contain the REX-806 union (3950d47 already contains the three accepted REX heads).
3. Dependency smoke: the 26 research suites (rex801 4, rex802 2, rex803 8, rex804 5, rex805 4, rex806 3).
4. Deploy a candidate that serves both the fault controller and the artifact surface, or option A cannot be carried out and the City will answer 404.
5. Run the representative study, then export; before exporting, check that the City's `GET /research/replays` supportedScenarios matches the scenario the study used (measured today: `[WAIT]`).
6. Produce the eight summary items of RESEARCH_MATERIAL_SYNTHESIS.md; the opposite-host reproduction must be performed by the other physical host, since self-review is forbidden.

## Not done here

No claim was made, no workbook field was written, no reports/REX-890 was created, no candidate was deployed and no fault was injected - so the fault gap above comes from reading the code and a 404, not from an exercise. Nothing here claims REX-890 cannot be completed; it states that there is no ready evidence today, and gives the three ways out. The choices in options A/B/C and the handoff question are the record holder's.
