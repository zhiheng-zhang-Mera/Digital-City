# EM-013 Development Report — Shared Task Core + Utopia Engineering Control Surface Integration

```text
MISSION                  = EM-013 (Engineering Manager programme, task 13 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 608ec89 (Digital-City main, "claim(EM-013): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T18:02:35Z
CONTROL_REVISION_AT_CLAIM= d9201af (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-013-utopia-task-surface-integration
IMPLEMENTATION_HEAD_SHA  = 5920e8076d317e15142b7d16c8531e529ce587f0 (pushed)
BRANCH_CI                = 36753243377 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §0)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 0. Blocker (fourth consecutive round with the same external condition)

Run `36753243377` — both jobs refused to start:

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
gateway-web: .github#1 … android: .github#1
```

Identical to BA-009 (`36750981300`, retried three times), EM-012 (`36751919772`) and BA-007
(`36752540378`): jobs end in 2–4 s with zero steps. Alien's GAI-004 pushes failed the same way while my
pre-block runs (EM-011, RF-010) succeeded. Implementation pushed, local checks green, CI unverifiable.

## 1. Deliverable

`contracts/engineering-control-surface-v1/` — `control-surface.mjs` (canonical job binding, submit/status/
progress/attention/control/result views, remote-fallback proposal and approval, attention projection and
acknowledgement, result gating, provenance view, surface contract), `index.mjs`, 6-test suite, root
`tests/engineering-control-surface.test.mjs`.

Acceptance mapping (all verified locally):

| Required acceptance | Test |
|---|---|
| Web and Android can observe the same canonical Engineering job without duplicate execution | `one canonical job is observed by Web and Android without duplicate execution` (`same_job_for_every_surface: true`, `duplicate_execution: false`, `per_device_job_copy: false`, one job in the store) |
| Foreground/interaction device may differ from execution device | `the interaction device may differ from the execution device` (`interaction_device_is_execution_device: false`, owner/executor separated, control stays on the shared surface) |
| Remote fallback requires explicit approval and local allowed/throttled work remains local | `remote fallback requires explicit approval and local allowed work stays local` (`LOCAL_WORK_MUST_STAY_LOCAL`, `requires_explicit_approval`, `auto_selected: false`, decline keeps it local) |
| Remote progress/attention/result/artifacts appear on the interaction/shared surface | Tests 2, 4 and 5 (`delivered_to_interaction_device`, `control_on_shared_surface`, `user_navigated_to_execution_host: false`) |
| First attention acknowledgement reconciles all device projections | `attention comes from shared state and one acknowledgement reconciles every projection` (`reconciles_all_projections`, `other_devices_reconciled`, duplicate ack is idempotent) |
| Bind Engineering jobs to canonical shared task/action state; obtain responsibility/leases rather than creating truth | Test 1 (`CANONICAL_TASK_REQUIRED`, `task_truth_source: SHARED_TASK_CORE`, `manager_creates_canonical_truth: false`) |
| Submit/status/progress/stage/attention/control/result/artifact views | `SURFACE_VIEWS` (8) asserted; each view exercised across tests 1–5 |
| Render LocalEligibility and RemoteFallbackProposal with explicit approval; no auto-selection | Test 3 (`ELIGIBILITY` vocabulary; `auto_selected: false`, `local_first_respected: true`) |
| Attention from canonical shared state; no second Engineering-global attention database | Test 4 (`SECOND_ATTENTION_STORE_REFUSED`, `engineering_global_store: false`, `projection_of_shared_state: true`) |
| Keep remote control/results on the current/shared surface | Tests 2 and 4 (`user_navigated_to_execution_host: false`) |
| Advanced/debug provenance without leaking secrets | `advanced provenance exposes identifiers without leaking secrets, and the surface is strict` (`SECRET_MATERIAL_REFUSED`, `contains_secret_material: false`, handle refs allowed) |
| User-visible success only from terminal accepted EngineeringResult state | `user-visible success comes only from a terminal accepted result` (`NOT_TERMINAL_ACCEPTED` for a non-terminal state; `progress_is_not_success`, `dispatch_is_not_success`; success requires an accepted result ref) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004…BA-008, EM-004…EM-011, GAI-003…008, RF-004…010 Corrections; GAI-004 and RF-006 in progress). Tie-break
after BA-007 excluded Butler, so EM-013 was chosen: it is the Engineering programme's capstone and the consumer
of EM-010/EM-011/EM-012 just delivered. BA-009, EM-012 and BA-007 remain CI-blocked, so this is again the
contract's no-idle rule rather than a claim that CI works.

**D2 — Where does task truth live?** CHOICE: `submit` requires a `canonical_task_ref` (refused with
`CANONICAL_TASK_REQUIRED` otherwise) and every projection states `task_truth_source: 'SHARED_TASK_CORE'` and
`manager_creates_canonical_truth: false`; `execution_responsibility: 'OBTAINED_FROM_SHARED_TASK_CORE'` with an
optional `lease_ref`. Reason: the workbook requires binding to Shared Task Core rather than creating competing
canonical truth, and publishing the negative is what makes it reviewable. Requiring the canonical reference at
submit time means no code path can create an unbound job.

**D3 — One job for two surfaces.** CHOICE: one job record per `job_ref`; `status()` is the single projection
both Web and Android render, with `same_job_for_every_surface: true`, `duplicate_execution: false` and
`per_device_job_copy: false`. Reason: "Web and Android can observe the same canonical Engineering job without
duplicate execution" — a per-device copy is the failure mode, so the surface states that it is not happening.

**D4 — Interaction vs execution device.** CHOICE: separate `interaction_device_ref`, `executor_connector_ref`
and `executor_device_ref` fields; `control` applies from the shared surface and every control/fallback result
carries `user_navigated_to_execution_host: false`. Reason: "foreground/interaction device may differ from
execution device" and "keep remote job control/results on the current/shared Utopia surface; do not navigate
the user to the execution host" — both are acceptance bullets, and the separation is visible in the data.

**D5 — Remote fallback.** CHOICE: `proposeRemoteFallback` requires `LOCAL_THROTTLED`/`LOCAL_BLOCKED`/
`REMOTE_REQUIRED` eligibility and refuses a locally allowed job with `LOCAL_WORK_MUST_STAY_LOCAL`; the proposal
is `requires_explicit_approval: true`, `approved: false`, `auto_selected: false`; approval is a separate call
and declining keeps the work local. Reason: "remote fallback requires explicit approval and local allowed/
throttled work remains local" plus "do not auto-select a faster remote machine". Refusing to *propose* for a
locally allowed job is stronger than proposing-and-ignoring, because it also stops a UI from showing a
meaningless prompt.

**D6 — Attention.** CHOICE: `registerAttentionStore` always refuses; `projectAttention` accepts only
`SHARED_CORE_ATTENTION` as a source and marks every entry `projection_of_shared_state: true`,
`engineering_global_store: false`; acknowledgement is single-shot with `reconciles_all_projections` and
`second_acknowledgement_needed: false`, and a repeat is idempotent. Reason: "do not create a second
Engineering-global attention database" and "first attention acknowledgement reconciles all device projections".

**D7 — Success.** CHOICE: `applyResult` accepts only terminal states (`NOT_TERMINAL_ACCEPTED` otherwise), a
`SUCCEEDED` needs an accepted `result_ref`, and the result reports `user_visible_success` with
`success_source: 'TERMINAL_ACCEPTED_ENGINEERING_RESULT'`; progress events and dispatches are explicitly
`progress_is_not_success` / `dispatch_is_not_success`. Reason: "ensure user-visible success comes only from
terminal accepted EngineeringResult state". A defect found by the suite: the first version mutated job state
and froze the artifact list *before* validating the result reference, so a refused call left partial state —
validation now happens first and the artifact list is rebuilt rather than mutated.

**D8 — Provenance and secrets.** CHOICE: only the seven canonical provenance fields are accepted; a
secret-shaped key is refused by name (`SECRET_MATERIAL_REFUSED`, `stored: false`) while handle references
(`*_ref`) are allowed; the view states `contains_secret_material: false`. Reason: "expose Advanced/debug
provenance … without leaking secrets". The suite deliberately checks both directions (a token refused, a
reference allowed) so the scanner cannot pass by rejecting everything.

**D9 — Two more defects found by the suite.** (a) `projectJob` froze the job's internal `attention_refs` array
(a projection mutated its source), fixed by cloning before freezing; (b) accepted artifacts never reached the
job-level list, so the projection showed none — fixed and the artifacts list is now rebuilt immutably.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/engineering-control-surface-v1/control-surface.mjs` | new — canonical binding, views, fallback, attention, result gating, provenance |
| `contracts/engineering-control-surface-v1/index.mjs` | new — public surface |
| `contracts/engineering-control-surface-v1/tests/conformance.test.mjs` | new — 6 conformance tests |
| `tests/engineering-control-surface.test.mjs` | new — root runner entry (101 → 107 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

6 tests. Four failures on first run: **three genuine module defects** and one corrected expectation.

1. **Defect:** `projectJob` froze the internal `attention_refs` array, so projecting a job broke the next
   attention projection (`TypeError: not extensible`). Fixed by cloning before freezing.
2. **Defect:** accepted artifacts were stored only under `result.artifacts` and never in the job's artifact
   list, so the surface projection reported none. Fixed.
3. **Defect:** a refused `applyResult` left partial state (job state changed, artifact array frozen). Fixed by
   validating before mutating (D7).
4. **Expectation:** a secret-shaped unknown provenance key was expected to be `INVALID_REQUEST`; the module now
   names it `SECRET_MATERIAL_REFUSED`, which is more precise. The test now covers both a secret-shaped key and
   a harmless unknown field.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 107 tests, 107 pass, 0 fail (101 baseline + 6 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36753243377 on 5920e8076d317e15142b7d16c8531e529ce587f0 | **BLOCKED** — jobs not started (account billing) |

## 6. Integration seams handed to sibling tasks

- **Shared Task Core (City):** `canonical_task_ref`/`canonical_action_ref` are the join keys; the manager must
  obtain responsibility and a lease there, and this surface must never hold task truth.
- **EM-010 / EM-011 / EM-012:** the job's `executor_connector_ref` is a connector instance, the SDK's adapter
  registry provides it, and the Foreman's node/job references should map onto this surface's `job_ref`.
- **EM-005 (attention) / BA-008 (embodiment bus):** attention is projected from shared state and acknowledged
  once; the recent-device notification/ring projection belongs to EM-005 and must not grow a second store here.
- **GAI-007 (device-aware remote execution):** the interaction/execution split is the same invariant expressed
  on two surfaces; at merge they should share one proposal/approval shape.
- **Utopia Web/Android surfaces:** `SURFACE_VIEWS` and `surfaceContract()` are the client contract; a client
  must be able to assert `dispatch_is_not_success` and `progress_is_not_success` rather than trusting copy.
- **Owner/ops actions (blocking):** GitHub Actions billing must be restored before BA-007, BA-009, EM-012 or
  EM-013 can reach a verified `development_complete`.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: `applyResult` called twice for one job (the second currently overwrites the
   result — a likely gap, since a terminal result should be immutable like elsewhere in this pool); a fallback
   proposal for a `REMOTE_REQUIRED` job without any proposal (currently the executor stays local — should that
   be refused?); attention projected for a terminal job; `control` RETRY on a `SUCCEEDED` job (currently
   allowed by the terminal guard — confirm); and provenance with a nested secret under an allowed key
   (`error_ref: { token: 'x' }` is caught, `error_ref: 'plain'` allowed).
2. Confirm D5 (refusing to *propose* for a locally allowed job) and D7 (only a terminal accepted result is
   success).
3. Correction cannot be claimed against this branch until CI can run: `development_complete` is false.

```text
DEVELOPMENT_COMPLETE = false (CI blocked by the account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
