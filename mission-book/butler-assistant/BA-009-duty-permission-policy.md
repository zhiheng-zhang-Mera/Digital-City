---
mission_id: BA-009
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
development_claimed_at: 2026-09-30T17:26:15Z
development_branch: assistant/BA-009-duty-permission-policy
development_head_sha: 9e1de31ba53766758406e991dbacdb8f707b1bfc
development_ci: 36750981300-success-attempt-5
development_report: mission-book/reports/BA-009/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-10-01T05:00:18Z
correction_head_sha: 2abf8d47ad0663c175779ab9a3057594d2db86ab
correction_ci: 36818585688-gateway-web-success-android-success
correction_report: mission-book/reports/BA-009/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-009 — Duties, Permission + Proactivity Policy

## Goal

Define what each assistant is responsible for and how much initiative it may take while ensuring task handoff, persona and device embodiment can never manufacture authority.

## Development scope

- Define assistant duties/role scope as assistant-owned configurable policy.
- Define proactivity levels and notification/initiative boundaries.
- Map assistant requests into existing Action/Core permission checks rather than bypassing them.
- Contribute AssistantPolicy into the Shared Core policy contract rather than creating a second global policy engine; Remote Fabric later revalidates/enforces the same effective decision at the target device.
- Define effective permission as the intersection of Owner/User policy, assistant permission/duty policy, current device capability/authorization and task/action grant.
- Require permission recomputation after handoff, executor/device change, reconnect or capability change.
- Ensure execution lease proves which executor may act but does not itself grant a capability forbidden by policy.
- Support different duties/policies for multiple assistants using the same Digital-Me/context source.

## Explicitly out of scope

- granting permissions merely because personality/profile says so
- moving Root/Core authority into the assistant
- autonomous expansion into new capabilities
- copying the outgoing assistant's permissions to the recipient during handoff
- treating an execution lease as a substitute for Owner/User policy or device capability

## Required acceptance

- Two assistants can have different duties/proactivity while sharing the same authorized user context.
- Out-of-duty requests are refused/delegated without changing underlying permissions.
- Changing duties is independent of Digital-Me canonical data.
- Handoff to a less-privileged assistant remains less privileged; the handoff payload cannot elevate it.
- Moving execution to a device lacking the required capability blocks the action even if the task owner is authorized.
- Tests cover allowed, denied, confirmation-required, proactive-notification, handoff, reconnect and capability-loss boundaries.

## Normative permission equation

For an action to execute, the implementation must enforce the equivalent of:

`EffectivePermission = User/OwnerPolicy ∩ AssistantPolicy ∩ DeviceCapability ∩ TaskActionGrant`

A valid execution lease is an additional execution-safety prerequisite; it is **not** a source of permission.

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
2. create `assistant/BA-009-duty-permission-policy` from the pinned Butler baseline;
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

No worker may merge `assistant/BA-009-duty-permission-policy` to Utopia main. A project-wide merge workbook may be created only after every BA-001..BA-009 branch passes the two-stage/two-host gate.
