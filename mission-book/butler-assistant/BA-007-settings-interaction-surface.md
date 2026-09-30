---
mission_id: BA-007
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: ASSISTANT_DISTRIBUTED_STATE_V2
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: IN_PROGRESS
development_complete: false
development_host: Mech
development_claimed_at: 2026-09-30T17:50:10Z
development_branch: assistant/BA-007-settings-interaction-surface
development_head_sha: 8fa4686bb7acb2b57a34a00fe517f6ecaad9769f
development_ci: 36752540378-BLOCKED_GITHUB_ACCOUNT_BILLING
development_report: mission-book/reports/BA-007/DEVELOPMENT_REPORT.md
development_blocker: EXTERNAL_GITHUB_ACTIONS_ACCOUNT_BILLING (implementation pushed and locally verified; CI run 36752540378 never started — see report §0; development_complete stays false until a CI run executes)
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/BA-007/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-007 — Assistant Settings + Interaction Surface

## Goal

Provide the user-facing surface for selecting assistants and safely changing assistant-owned personalization while making foreground presence, task ownership and background execution visibly distinct.

## Development scope

- List/select available assistants and edit supported AssistantProfile fields through the versioned profile contract.
- Switch butler/secretary/companion or future modes as assistant/relationship policy, not Digital-Me mutation.
- Show which assistant is foreground on the current device and where the same logical assistant has other embodiments.
- Show relevant background tasks separately from foreground binding, including logical owner/coordinator and current executor when useful.
- Make foreground switching a UI operation distinct from TaskHandoff; request/offer handoff only when responsibility truly needs to move.
- Reserve adapters for future voice/avatar editors without requiring those engines now.
- Surface stale/offline/reconnecting embodiment state without pretending a cached state is authoritative.

## Explicitly out of scope

- editing Digital-Me canonical user records from assistant settings
- binding UI state directly to one vendor/model
- requiring future voice/avatar capability for current acceptance
- presenting foreground switch as automatic task transfer
- hiding an active background task merely because its owner is not foreground

## Required acceptance

- Profile changes propagate to other embodiments through committed shared state, not direct synchronization of local UI/scratch context.
- Changing mode/personality/voice/avatar reference does not restart, duplicate or transfer tasks.
- Foreground assistant switching obeys BA-003 and produces no TaskHandoff unless the user/system explicitly requests responsibility transfer.
- UI clearly distinguishes assistant identity, user/Digital-Me identity, foreground binding, logical task owner and executor.
- Reconnect/stale indicators prevent the user from mistaking cached task/binding state for current authority.

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
2. create `assistant/BA-007-settings-interaction-surface` from the pinned Butler baseline;
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

No worker may merge `assistant/BA-007-settings-interaction-surface` to Utopia main. A project-wide merge workbook may be created only after every BA-001..BA-009 branch passes the two-stage/two-host gate.
