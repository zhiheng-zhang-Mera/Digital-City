---
mission_id: BA-008
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: ASSISTANT_DISTRIBUTED_STATE_V2
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: COMPLETE
development_complete: true
development_host: Mech
development_claimed_at: 2026-09-30T16:02:10Z
development_branch: assistant/BA-008-embodiment-event-bus
development_head_sha: f06cf316c87e710bf65092dbc96d76497eae3a79
development_ci: 36741617086-success
development_report: mission-book/reports/BA-008/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-10-01T02:04:49Z
correction_head_sha: 1070190c3bd39342780d2cb941123d9ab3666225
correction_ci: 36805605456-gateway-web-success-android-success
correction_report: mission-book/reports/BA-008/CORRECTION_REPORT.md
merge_status: MERGED_MAIN
merge_archive_tag: archive/BA-008
merge_integration_branch: merge/butler-assistant-integration
merge_integration_head: 4ff27babf52410b36a53ea32785d27e19303b7d8
merge_integration_ci: 36827219769-success
merge_main_sha: 41e241c3c817124c9c3d6e7756087d1022a836aa
merge_main_ci: 36827422797-success
---

# BA-008 — Embodiment Event Bus, Execution Lease + Reconnect Safety

## Goal

Route simultaneous inputs/outputs from an assistant's multiple embodiments through one authoritative state machine while preventing split-brain execution and duplicate side effects.

## Development scope

- Define embodiment input/output event envelopes with assistant, device/source, audience, task, causal/version and action correlation.
- Keep this as an Assistant domain-semantic bus. Cross-device delivery adapts through Remote Fabric RPC/EVENT/STREAM; Remote transport envelopes never replace the canonical Assistant event model.
- Define execution leases for exclusive or externally visible side effects, including holder/executor identity, task/action scope, lease version and expiry/renewal semantics.
- Require idempotency/action keys for retried side effects so duplicate events cannot produce duplicate external actions.
- Serialize or version conflicting commands against authoritative task state rather than live local plans.
- Reject stale/replayed events or make them idempotent.
- Define reconnect reconciliation: fetch authoritative task/binding state, invalidate/revalidate old leases, reconcile local intents and only then resume.
- Route output to suitable embodiments without broadcasting private responses or duplicating side effects.

## Explicitly out of scope

- independent per-device planners acting as separate authorities
- last-writer-wins without task/version checks for destructive state
- broadcasting every private response to every device
- resuming an external side effect after reconnect using only a stale local lease/cache
- two devices holding simultaneously valid exclusive execution authority for the same action

## Required acceptance

- Contradictory commands from two devices cannot execute two incompatible exclusive side effects.
- At most one valid execution lease exists for a given exclusive action scope at a time.
- Retries/replays with the same idempotency/action key do not duplicate the external side effect.
- Lease expiry/revocation/reassignment is authoritative and observable through the event/task state.
- After disconnect/restart, stale local work cannot resume a side effect until authority and lease are revalidated.
- Output routing respects device availability, current foreground binding where relevant, audience/privacy scope and causal task state.

## Mandatory distributed-assistant architecture contract

This task MUST preserve all of the following project-wide invariants:

1. **One logical identity, many embodiments.** Multiple devices connected to the same assistant are projections of one logical assistant, not independent minds that later synchronize.
2. **One authoritative durable state, many contextual projections.** Shared/authoritative state may contain committed identity/profile references, durable assistant↔user relationship state, committed memory references, the task graph, commitments, checkpoints and the causal/event log. Live token context, scratch reasoning, temporary plan drafts, uncommitted inference and device/UI transient state remain embodiment-local unless explicitly promoted through a typed commit/update.
3. **Foreground binding is not task ownership.** Each device has at most one foreground assistant, but foreground switching does not by itself transfer, cancel, pause or recreate task ownership or background execution.
4. **Ownership is not execution.** A task may distinguish logical owner/coordinator from its current executor. Any externally visible or state-changing side effect must be guarded by authoritative task/version state plus an execution lease and an idempotency/action key.
5. **Handoff never transfers authority implicitly.** A handoff may transfer responsibility, checkpoint/evidence and references, but never permission or capability grants. The receiving assistant/device must recompute effective permission from current policy and capability.
6. **Local state is a cache, not authority.** After disconnect/restart/reconnect, an embodiment must re-fetch authoritative task/binding state and revalidate any lease before resuming a side effect.
7. **Knowledge is not disclosure authority.** Information known in one scope/audience is not automatically releasable in another. Context projection must enforce memory/audience/privacy scope before output.

These are acceptance constraints, not optional future enhancements.

## Project gate

The Pre-Assistant foundation gate is already **OPEN**. The common Butler project baseline is pinned to Utopia main:

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

This task may be claimed now. It MUST branch from that exact baseline so BA-001..BA-009 remain independently integrable.

## Development stage

The Development Host must:
1. claim this stage in City;
2. create `assistant/BA-008-embodiment-event-bus` from the pinned Butler baseline;
3. implement only this bounded scope plus the mandatory architecture contract above;
4. add positive and negative tests, including concurrency/recovery tests relevant to this task;
5. push and run relevant GitHub CI;
6. write DEVELOPMENT_REPORT.md with exact files, tests, failures/fixes, branch/head and CI;
7. mark development_complete only when green.

Do not merge to Utopia main.

## Correction stage

The Correction Host must be the other physical host and must independently inspect the pushed Development branch for relevant architecture, state-consistency, concurrency, permission/privacy, lifecycle, recovery, stale-state, duplicate-side-effect and false-success defects.

Correction is a repair task, not passive verification. Every discovered in-scope defect must be directly fixed on this same branch and covered by regression tests. Cross-subproject issues must be fixed at this task's local contract/guard and recorded for final integration rather than copying another BA implementation.

Push the corrected head, run relevant GitHub CI, write CORRECTION_REPORT.md and mark correction_complete only when green.

## Two-host gate

Final-merge eligibility requires:
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech participated;
- development_complete = true;
- correction_complete = true.

## Global cross-programme no-idle rule

This task participates in the normative global BA/RF/GAI/EM pool defined by `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`.

- Alien and Mech are both available; this task may be claimed immediately.
- Ordinary claim truth is written only to this task workbook frontmatter and reports; do not serialize claims through README/MISSION_INDEX.
- Development and Correction remain opposite-host stages on this task branch.
- If this stage is waiting on hosted CI, a long test or an external condition, keep the claim but release the physical host to claim another eligible global stage in a separate worktree.
- Missing RF/GAI/EM sibling implementations never block bounded Butler work; use stable interfaces/test doubles and record the integration seam.
- A host stops claiming only after a fresh scan of all four programmes finds no actionable owned repair, no eligible opposite-host Correction and no unclaimed Development.

## Merge lock

No worker may merge `assistant/BA-008-embodiment-event-bus` to Utopia main. A project-wide merge workbook may be created only after every BA-001..BA-009 branch passes the two-stage/two-host gate.
