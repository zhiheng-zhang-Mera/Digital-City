---
mission_id: GAI-001
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
development_claimed_at: 2026-09-30T12:38:59Z
development_branch: general-ai/GAI-001-core-contracts-action-vocabulary
development_head_sha: 57915d05906f17d244bc48bbe07dc37ea5e0a89e
development_ci: 36716761318-gateway-web-success-android-success
development_report: mission-book/reports/GAI-001/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-001/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-001 — Core Contracts + Action Vocabulary

## Goal

Define the replacement-safe General AI Gateway contract layer and extend Utopia's user-level Action vocabulary with `GENERAL_AI` without exposing historical product names.

## Development scope

- Add versioned contracts for GeneralAIRequest, InputBundle, ResultEnvelope, PartialResult, AttentionRequest, DeviceSwitchProposal, ApiSwitchProposal, EscalationReceipt and typed errors.
- Define canonical identifiers for action, provider, model, account, conversation and backend execution/thread references.
- Reserve `GENERAL_AI` as the user-level route. Do not add `BOSS` as a route.
- Preserve current ROOM/CAPABILITY/CITY_TASK semantics and provenance.
- Define idempotency/replay rules so retry/reconnect cannot create duplicate user-level actions.
- Define terminal/non-terminal status mapping, including ATTENTION_REQUIRED and honest unavailable/refused states.
- Keep contracts transport-neutral and provider-neutral.

## Out of scope

- real provider calls;
- Web/API/browser implementation;
- JEV inference;
- Remote Fabric transport implementation;
- UI redesign beyond the minimum schema compatibility.

## Required acceptance

- old Action routes remain backward-compatible;
- GENERAL_AI has stable typed backend/provenance references;
- malformed/unknown route/state/version is rejected rather than guessed;
- idempotency key reuse for a different request is rejected;
- partial output cannot mark an Action terminal;
- no schema contains raw credential/cookie/token bytes;
- repository/runtime scan finds no Boss dependency.

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
