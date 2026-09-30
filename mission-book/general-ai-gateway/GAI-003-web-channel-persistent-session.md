---
mission_id: GAI-003
project: GENERAL_AI_GATEWAY_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: GENERAL_AI_GATEWAY_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: general-ai/GAI-003-web-channel-persistent-session
development_head_sha: null
development_ci: null
development_report: mission-book/reports/GAI-003/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-003/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-003 — Web-First Channel + Persistent Session

## Goal

Implement Web as the default General AI execution channel with persistent provider/account browser profiles and honest login/session state.

## Development scope

- Create a provider-neutral WebChannel adapter contract: health, open/restore, execute, observe partial/final output, cancel and close/recover.
- Bind Web execution to provider/account browser-profile references rather than ephemeral windows, resolving persistent handles through the neutral 00-Foundation `SecureHandleStorePort`.
- Persist/restore allowed profile/session state across Utopia host restart without copying raw cookies into City state.
- Detect READY, AUTH_REQUIRED, RATE_LIMITED, PAGE_CHANGED, BUSY/GENERATING, DOWN/UNKNOWN and equivalent typed states.
- Keep provider-specific page knowledge below the Web adapter and reuse accepted generic Computer Use/browser/DOM primitives through interfaces rather than reimplementing remote mouse logic.
- Support conversation/thread reference capture and reopen hooks.
- Exercise a real configured Web provider path during Development when one is already available without Owner/hardware blocking. If real login/provider access is unavailable, record `REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION`; component Development/Correction may still complete from contract, adapter and deterministic integration tests. Real provider proof remains mandatory before the GAI programme terminal merge state.

## Out of scope

- API execution;
- Remote Fabric transport;
- automatic API fallback;
- remote-desktop streaming as the normal execution mode.

## Required acceptance

Component acceptance below may use deterministic provider adapters when real provider access is unavailable; real-provider proof is a programme-integration gate and may not be fabricated.

- default execution channel is WEB;
- persistent login/profile survives an allowed restart/reopen where the provider/platform permits it;
- expired login is AUTH_REQUIRED, not SUCCESS;
- page/selector drift is PAGE_CHANGED/UNAVAILABLE, not fabricated output;
- cancel reconciles the Web run honestly;
- provider-specific adapter failure does not corrupt another provider/account;
- no Boss profile, process, endpoint or repository is accessed.

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
