# REX-803 development evidence / 开发素材

Developer Mech (COMPUTERNAME `MEGA-REP`, role Mech-DS). Baseline `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`; exact
implementation `57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1`; branch `rex/REX-803-mech-scenario-runner`; PR
zhiheng-zhang-Mera/utopia#31. Opposite-host Formal Review PENDING (review_host Alien). Terminal marker
`SCENARIO_REPETITION_ENGINE_ACCEPTED` NOT released.

## Research object of this task

The engineering question is not "can a loop run N times". It is: **can a repetition be counted once, explained always,
and reproduced exactly — when the unit being repeated is real work that a real system can lose.** Every design decision
below exists to make a lost, cancelled, timed-out or interrupted repetition *visible as such* rather than invisible.

## Decisions and observations

- **A repetition is a real canonical task.** Each run creates an ordinary City task through the product's own creation
  path and the run outcome is that task's terminal state. No simulation path exists. A campaign cannot therefore claim a
  result the City did not reach, and it cannot report success for work that never executed.
- **Seeds are derived, never drawn.** `seed(campaignSeed, index)` is a pure FNV-1a function, and the default campaign
  seed is the experiment's immutable identity (`<experimentId>@<digest>`). Two hosts running the same registered
  manifest derive the same sequence with no number passed between them; the run seed is *used* to select among the
  experiment's declared workers, so a repetition's placement is reproducible too.
- **Warmup is executed and never measured**, by name, so a result cannot silently include a run that existed only to
  warm the system.
- **Accounting invariant.** Every planned repetition lands in exactly one state
  (`MEASURED/WARMUP/TIMEOUT/FAILED/EXCLUDED/CANCELLED/SKIPPED/INTERRUPTED`), so `accounted === planned` for a terminal
  campaign and no class is double counted. This is asserted by tests rather than asserted in prose.
- **Stop and timeout reach the work.** A run registers its cleanup with the runner's `control` handle; a stop or a
  timeout fires it. "Stopped" therefore means the canonical task was cancelled, not merely that the loop stopped
  looking — the difference between a bounded campaign and leaked execution.
- **A restart is a first-class outcome.** A campaign left `RUNNING` by a dead process is recovered as `INTERRUPTED`, the
  one repetition that was in flight is written down with its seed, and the work it had started is offered to a recovery
  hook that finds it by reference. Resuming continues the SAME campaign from the same seed sequence, and the lost
  repetition stays lost rather than being replaced by a later one. Abandoning it is a separate, explicit act.
- **The experiment's declared stop conditions bound the campaign**, and a caller may only tighten them. The
  `acceptance.minimumSuccessfulRuns` criterion is deliberately NOT used as a stop bound: a criterion for judging a
  result is not a bound on producing it.
- **Readiness is measured, not promised.** A campaign refuses to start unless every host, worker and control surface the
  manifest declares is live in this City at that moment, and the refusal names what was missing.
- **Receipts are immutable once filed.** A finished campaign is written once under `campaigns/<id>.json`; the live state
  file is overwritten as the campaign progresses, the receipt is not.

## Quantitative observations

| Observation | Value | Evidence |
|---|---|---|
| Engine probes on the exact head | 12 pass / 0 fail | `utopia:tests/rex803-scenario-runner.test.mjs` |
| Route/E2E probes against a real Gateway | 4 pass / 0 fail | `utopia:tests/rex803-campaign-surface.test.mjs` |
| Browser probes | 2 pass / 0 fail | `utopia:tests/rex803-campaign-web.test.mjs` |
| Neighbouring research/workbench suites | 51 pass / 0 fail (REX-801/802 + WBC-601..604) | `npm test` selection |
| Whole `tests/` glob | 1363 pass / 5 fail | all 5 classified inherited-environment (below) |
| Campaign trace receipts per settled run | 1:1, `canonicalRefs.taskRef` points at the real task | route test |
| Repetition accounting after resume | no repetition counted twice; `interrupted` retained | restart test |

### Physical campaign on the live City (Mech + Android, 2026-10-06)

| Observation | Value | Evidence |
|---|---|---|
| Campaigns run on the live resident City | 2 (`campaign-96b56dc0…`, `campaign-b0ebb3af…`), both COMPLETED | `utopia:evidence/raw/mission-book/REX-803/physical-campaign-receipt.json` |
| Repetitions per campaign | 4 planned = 1 warmup + 3 measured, `terminalAccountingComplete: true` | same receipt |
| Canonical tasks created and observed | 4 per campaign, all `WAIT`, all `COMPLETED`, each with `researchRunRef = <campaignId>:<index>` | `…/physical-canonical-tasks.json` |
| Run receipts in the research trace | 1 per settled run, each naming the real task, `latencyMs` ≈ 7.0–7.1 s | `…/physical-run-receipts.json` |
| Per-repetition seeds | distinct and derived (`275013131`, `276690950`, `278368569` in campaign 1) | `…/physical-campaign-receipt.json` |
| Campaign seed identity | `mech-android-canonical-repetition-r2@b872f35c85a66fc1d9304d5cf0b7be2f` (32 hex chars) | same |
| Control surface | the physical Android handset (OPPO PERM00 over ADB), ref `dev-be7832e3…`, `controlOnline: true` | `…/physical-live-topology.json`, `…/android-control-surface-online.png` |
| Owner-facing page | showed the campaign, the measured repetitions with durations/task ids, the empty "without a measurement" section with its explanation, and both filed receipts | `…/physical-campaign-live-surface.png`, `…/physical-surface-observation.json` |
| Alien host | OFFLINE throughout (last heartbeat 2026-10-05T11:15:06Z) | `…/physical-pre-state.json` |

The `latencyMs` values are observed wall-clock durations on one host and are **not** a performance claim: they mostly
reflect the reference node agent's polling cadence. No comparison, speed-up or efficiency claim is made anywhere.

## Failures and defects (kept, not cleaned up)

| Stage | Observed | Classification | Handling |
|---|---|---|---|
| Resume replay | A resumed campaign re-ran repetition 0 and appended a second row for it, so the accounting invariant was false while still plausible | PRODUCT DEFECT, caught by this task's own test | Repaired: a recorded row at a repetition's position means it is accounted for |
| Trace receipts missing | `deviceRef` written into trace `dimensions`, where it is not a vocabulary member, so every receipt failed validation inside the collector — which reports a failed record instead of throwing | PRODUCT DEFECT, caught by the route test (0 receipts where 3 were expected) | Repaired: `deviceRef` is a canonicalRef |
| Unknown stop limit | `limits: {madeUp: 1}` was accepted and silently dropped, so a mistyped bound looked applied | PRODUCT DEFECT, caught by the refusal test | Repaired: refused by name |
| Guessed surface identity | The first browser campaign was refused `TOPOLOGY_NOT_READY` because the declared control-surface ref had to be guessed | PRODUCT GAP, caught by the browser test | Repaired: the surface publishes the live worker/surface vocabulary and the page shows it |
| Stop of a finished campaign | A supplied `campaignId` was compared against the last campaign even after it finished, so a stale page got 409 instead of `stopped:false` | PRODUCT DEFECT, caught by the stop test | Repaired: the guard applies only while RUNNING |
| Browser fixture | The fixture failed every task from the Nth onward instead of the Nth, producing three failures where one was intended | MEASUREMENT_DEFECT (harness, not product) | Recorded; fixture corrected; the product was right |
| `capability-adapters.test.mjs`, `city-roads.test.mjs` | `CORRUPT_INPUT` from a document reader | ENVIRONMENT / PRE-EXISTING | Reproduced identically at baseline `213f9f9f` in worktree `D:/utopia-wbc604` |
| `host-city-launcher.test.mjs` (3 tests) | "requires a free coordination port; refusing to disturb an active City" | ENVIRONMENT | The resident City holds the host reservation; these are host-owning process tests |
| Campaign seed (physical run 1) | The campaign seed was `experimentId@<the entire manifest as JSON>` | PRODUCT DEFECT D-7, found ONLY by running on real hardware | Repaired; the route test now asserts the seed's shape and equality across two campaigns of the same manifest |
| Android topology identity | The declared-control-surface naming gate cannot be satisfied by the identity the City actually reports for a natively enrolled handset | FINDING F8, reality drift (contract vs runtime) | Recorded with the Kotlin line and the observed ref; not repaired here |
| Owner-facing form after a run | The form still showed the operator's last typed digits (warmup 0) while the campaign ran warmup 1 | FINDING F10 (LOW), honesty nit | Recorded for REX-807; totals stated the truth, so nothing was hidden |

## Claim collision (control-plane observation)

Alien claimed REX-803 at Digital-City `5baee25` (11:45:02); Mech claimed at `1acdc10` (11:46:24) on top of it,
overwriting the claim fields. Alien reconciled at `82acb5a` (11:56:16) with Mech as canonical owner and moved to
REX-804. Labels: `DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE`, `MUTABLE_REFERENCE_STATE_DRIFT`. Alien's
candidate `cae38b22bfb6c1050221aa4aa3e51844e3ec6e47` is preserved as design evidence and not merged; the two design
elements inherited from it (a run executes a real canonical task; the run reference is written onto that task) are named
for the reviewer. Cost: one discarded candidate, no duplicate merge, no lost evidence.

## Research evidence applicability

```text
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
state_identity_evidence: CAPTURED
```

`RS-G3-IDENTITY-PROVENANCE` (campaign seed IS a short hash of the registered document; run reference binds a receipt to
a canonical task), `RS-G3-DYNAMIC-LIVENESS` (topology readiness measured against live canonical refs at start time;
the Android surface reconnected across a City restart without re-pairing),
`RS-G3-PASSIVE-EVIDENCE-PIPELINE` (campaign receipts, trace rows and canonical-task read-back produced by an ordinary
development run against the live City), `RS-G3-OWNER-INTERVENTION-TAXONOMY` (operator stop/resume/abandon are explicit,
typed acts), `RS-G4-REALITY-DRIFT` (this task found three real drifts: a claim surface that had never been reachable;
a research surface that could not learn the identities it was required to declare; and an Android topology gate
satisfied by a name while the runtime reports a device id). Highest grade observed `G4_RARE_SYSTEMIC`; capture level
`MAXIMUM_BOUNDED`. No performance, novelty or autonomy claim is made.

## Physical gate

```text
GATE      workbook requires >= 1 controlled campaign on the Alien + Mech + Android topology
MEASURED  at development end: alien-reference-node online=FALSE (last heartbeat 2026-10-05T11:15:06Z); the resident
          City was restarted from this branch and the physical Android handset was re-enrolled and connected
RAN       Mech + Android, two controlled campaigns, full receipts and trace (see the table above)
STATUS    PARTIAL / BLOCKED ON PHYSICAL TOPOLOGY (the Alien host), not on code. Not claimed as the workbook gate.
```

## Pending

Opposite-host Formal Review (workbook checks: repeated execution, cancellation, restart, timeout, partial campaign,
seed reproducibility). The Alien half of the completion gate (the Alien host node was offline throughout). Android
surface for campaigns deliberately absent, owned by REX-807. `merge_authority: false`.

## Latest exact-source outcome (supersedes earlier snapshots in this file)

```text
IMPLEMENTATION  57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1
CI              V0.2 checks 37399258359 (push) and 37399254235 (pull); City linkage 37399258414 success
PHYSICAL        two controlled campaigns on the live City with the Android handset connected as the control surface
REVIEW          PENDING (Alien) — not performed, not claimed
MARKER          SCENARIO_REPETITION_ENGINE_ACCEPTED NOT released
```
