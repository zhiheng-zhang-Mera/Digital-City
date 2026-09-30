---
mission_id: GAI-007
project: GENERAL_AI_GATEWAY_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: GENERAL_AI_GATEWAY_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: COMPLETE
development_complete: true
development_host: Mech
development_claimed_at: 2026-09-30T16:22:40Z
development_branch: general-ai/GAI-007-device-aware-remote-execution
development_head_sha: 99858b90e1470e7401d8ffd9cf52ade37d2c4381
development_ci: 36743516874-success
development_report: mission-book/reports/GAI-007/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-007/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-007 — Device-Aware Remote Execution + Result Return

## Goal

Allow a better trusted device to execute a General AI Web task while the user remains on the current interaction device.

## Core invariant

```text
REMOTE DEVICE = EXECUTION RESOURCE
NOT = A REQUIRED USER TERMINAL

interactionDevice may differ from executionDevice.
Changing execution host MUST NOT require the user to walk to or operate that host.
```

## Development scope

- Consume RemoteExecutionPort as a GAI domain adapter facade over the accepted Remote Fabric public API; do not implement independent trust/transport, presence or device identity here.
- Prefer current-device Web when healthy.
- Rank already-known alternate endpoints using presence/readiness, provider/account Web readiness, session/conversation availability, load, network/freshness and required input locality/capability.
- Discovery/ranking must not launch duplicate AI requests as probes.
- Produce DeviceSwitchProposal and require V1 user confirmation before dispatch to another device.
- Dispatch one canonical actionId to the remote execution host.
- Return status, progress, partial output, final result, typed error and AttentionRequest to the originating/shared Action surface.
- Allow cancellation/control from any authorized device viewing the Action.
- Support semantic remote file staging via InputBundle refs and cleanup policy.
- Hardware-bound authentication may require physical interaction; it must surface as ATTENTION_REQUIRED rather than false success.
- Normal mode transports semantic RPC/event/stream data, not mandatory full remote-desktop video.

## Non-blocking Remote Fabric rule

Branch development/correction uses the stable RemoteExecutionPort and deterministic transport doubles if accepted Remote Fabric code is not yet on the frozen baseline. This is honest component testing, not proof of real remote transport. **The final GAI merge workbook MUST perform real two-device execution through an accepted compatible Remote Fabric API before the programme can reach its terminal state.**

## Required acceptance

- local interaction device remains unchanged after remote dispatch;
- no duplicate Action is created on the execution host;
- remote progress/partial/final/error all correlate to the same actionId;
- remote cancel works and late/duplicate events are rejected/reconciled;
- stale/offline remote endpoint cannot be selected as healthy;
- no execution begins before DeviceSwitchProposal confirmation in V1;
- ATTENTION_REQUIRED is returned to the interaction device.

## Shared execution rules

- Branch from the exact frozen GAI baseline; do not branch from a sibling GAI branch.
- Development and Correction MUST be performed by different physical hosts (Alien / Mech).
- Development pushes the task branch and does not merge it to Utopia main.
- Correction independently reviews and directly repairs the same branch; it also does not merge to main.
- A worker MUST NOT wait for a sibling GAI task. Use the stable ports in the programme README plus deterministic test doubles where a sibling implementation is absent.
- A worker MUST NOT merge/cherry-pick a sibling GAI branch merely to make local tests pass.
- While hosted CI or an external check is running, continue independent in-scope tests/docs/evidence or another eligible task/worktree instead of idling.
- External provider / Remote Fabric absence may block only the acceptance step that genuinely requires it; it must not be rewritten as success and must not stall unrelated GAI tasks.
- Reports go under `mission-book/reports/${MISSION_ID}/` using the exact task ID.
- No Boss access: no clone/fetch/read/import/submodule/symlink/runtime call/build dependency against Codex-Boss. Historical names may appear only as provenance prose; executable behavior must be owned and tested in Utopia.


## Global cross-programme no-idle rule

This task participates in the normative global BA/RF/GAI/EM pool defined by `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`.

- Alien and Mech are both available; this Development may be claimed immediately.
- Correction is eligible immediately after Development is green and must use the opposite physical host.
- Ordinary claim truth is written only to this task workbook frontmatter/reports; README/MISSION_INDEX are not claim locks.
- Hosted CI, real-provider login, long tests and Remote Fabric waits never idle the host. Retain the claim, record the exact seam, and claim another eligible global stage in a separate worktree.
- Missing Remote Fabric uses stable RemoteExecutionPort doubles for component work. Real cross-device proof belongs to programme integration.
- A host stops claiming only when a fresh global scan finds no actionable owned repair, no eligible opposite-host Correction and no unclaimed Development.
