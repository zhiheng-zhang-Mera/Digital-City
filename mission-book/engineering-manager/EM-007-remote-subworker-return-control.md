---
mission_id: EM-007
project: ENGINEERING_MANAGER_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
donor_repo: zhiheng-zhang-Mera/DS-Hns
donor_baseline_sha: eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
architecture_contract: ENGINEERING_MANAGER_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: engineering-manager/EM-007-remote-subworker-return-control
development_head_sha: null
development_ci: null
development_report: mission-book/reports/EM-007/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/EM-007/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-007 — Remote Sub-worker Execution + Automatic Return / Control

## Goal

After explicit approval of a local-failure fallback, execute the same logical Sub-worker job on another trusted device while all normal control, attention and results return automatically to the user-facing/shared control plane.

## Development scope

- Consume EngineeringRemoteExecutionPort as an Engineering domain adapter facade over Remote Fabric semantic/public interfaces; do not implement independent node trust, transport, presence or physical-device identity here.
- Require an approved RemoteFallbackProposal before dispatch in V1.
- Select only eligible trusted remote hosts that satisfy the job's required capabilities after fallback is approved.
- Keep original job_id, logical owner/coordinator and canonical task truth; remote host becomes current executor/embodiment only.
- Return state, stage, progress, events, logs, AttentionEnvelope, result and ArtifactEnvelope automatically through canonical/shared state.
- Forward pause/resume/cancel/respond control from any authorized interaction device to the remote executor with idempotent reconciliation.
- Reject/reconcile stale, late or duplicate remote events and duplicate execution attempts.
- Stage required files/context semantically with digest/provenance and bounded cleanup policy.
- Normal operation must not require remote-desktop video or the user walking to the execution host.

## Out of scope

- Remote Fabric pairing/crypto/routing internals
- automatic cross-device fallback without user approval
- cross-device mouse-coordinate control as normal protocol

## Hard interaction invariant

```text
CONTROL PLANE follows the user.
EXECUTION PLANE may move.
REMOTE EXECUTION HOST is a compute/execution resource, not a required user terminal.
```

## Required acceptance

- no remote dispatch occurs before explicit approval
- remote execution creates no duplicate canonical job
- origin/current interaction surface receives remote progress, attention, final result and artifacts
- pause/resume/cancel from the interaction device controls the remote run
- a remote attention reply from an authorized interaction device reaches the originating worker
- late/duplicate events cannot resurrect terminal or execute a side effect twice
- if an underlying platform requires a truly physical local action, the job becomes a typed physical-action block rather than false success

## Shared asynchronous execution rules

- Branch from the exact frozen Engineering Manager baseline; do not branch from a sibling EM branch.
- Development and Correction MUST be performed by different physical hosts (Alien / Mech).
- Development pushes the task branch and does not merge it to Utopia main.
- Correction independently reviews and directly repairs the same branch; it also does not merge to main.
- A worker MUST NOT wait for a sibling EM task. Use the stable ports in the programme README plus deterministic test doubles when a sibling implementation is absent.
- A worker MUST NOT merge/cherry-pick a sibling EM branch merely to make local tests pass.
- While hosted CI, a long local test, an external login, or a provider check is waiting, continue independent in-scope tests/docs/evidence or another eligible task/worktree instead of idling.
- Missing Remote Fabric or unavailable third-party engineering software may block only the genuinely external acceptance step. Record it as a typed pending seam; never rewrite it as success and never stall unrelated EM tasks.
- Reports go under `mission-book/reports/${MISSION_ID}/` using the exact task ID.
- DS-Hns may be read only as the pinned donor described by this programme. Any reused implementation becomes Utopia-owned code with provenance; Utopia MUST NOT acquire a build/runtime dependency on the DS-Hns repository.
- Codex-Boss is out of scope and MUST NOT be cloned, fetched, opened, read, queried, imported, linked, submoduled, symlinked or called by this programme.


## Global cross-programme no-idle rule

This task participates in the normative global BA/RF/GAI/EM pool defined by `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`.

- Alien and Mech are both available; this Development may be claimed immediately.
- Correction becomes eligible as soon as Development is green and must use the opposite physical host.
- Ordinary claim truth is written only to this task workbook frontmatter/reports; README/MISSION_INDEX are dashboards, not locks.
- Hosted CI, long local tests, provider checks and Remote Fabric waits never idle the machine. Keep the claim, use a separate worktree and claim another eligible global stage.
- Missing Remote Fabric or optional provider software is represented with stable ports/doubles and an explicit deferred integration seam; component work does not wait.
- A host stops claiming only after a fresh scan of BA/RF/GAI/EM finds no actionable owned repair, no eligible opposite-host Correction and no unclaimed Development.
