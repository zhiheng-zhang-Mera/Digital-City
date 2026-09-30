---
mission_id: GAI-008
project: GENERAL_AI_GATEWAY_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: GENERAL_AI_GATEWAY_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: general-ai/GAI-008-health-resilience-degradation
development_head_sha: null
development_ci: null
development_report: mission-book/reports/GAI-008/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-008/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-008 — Health + Resilience + Honest Degradation

## Goal

Provide channel/provider/account health, retry/circuit behavior and fault isolation tailored to Web-first General AI without importing Engineering ownership.

## Development scope

- Define typed health/readiness for provider, account, model, WEB channel and API channel.
- Keep availability, health, auth state, rate limit and budget state separate.
- Implement bounded retry/backoff/circuit behavior for genuinely transient technical failures.
- Never retry destructive/ambiguous actions without idempotency/reconciliation.
- AUTH_REQUIRED/USER_ACTION_REQUIRED are human-blocked states, not auto-retry loops.
- Web failure may trigger another-device proposal or remain unavailable; it must not silently trigger API.
- One provider/account/channel failure must not poison unrelated providers or Utopia local capabilities.
- Reuse accepted Utopia semantics where appropriate by copying/refactoring Utopia-owned code, but do not create a runtime dependency from General AI onto the 02 Engineering Worker Gateway namespace.

## Required acceptance

- transient technical failure follows bounded retry/circuit policy;
- auth/human attention never auto-resumes as if technical retry succeeded;
- stale health is distinguishable from healthy;
- circuit state is scoped so one provider/account/channel cannot globally trip all AI;
- General AI outage leaves Rooms/City Tasks/other independent Utopia surfaces usable;
- no automatic API escalation exists in resilience code.

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
