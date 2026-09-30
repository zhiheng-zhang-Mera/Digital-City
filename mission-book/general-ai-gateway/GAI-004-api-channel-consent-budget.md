---
mission_id: GAI-004
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
development_branch: general-ai/GAI-004-api-channel-consent-budget
development_head_sha: null
development_ci: null
development_report: mission-book/reports/GAI-004/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-004/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-004 — API Channel + Explicit Consent + Budget Policy

## Goal

Implement API as an explicit escalation/manual channel, never an automatic fallback from Web.

## Development scope

- Define API adapter contracts for provider/model execution, streaming where supported, usage and typed errors.
- Support protocol adapters needed by current requirements (including OpenAI-compatible, Anthropic-style and Gemini-style shapes) without coupling provider identity to protocol identity.
- Introduce ApiSwitchProposal before any Web→API escalation.
- Require explicit user confirmation before Budget Policy runs/admitting the API execution.
- Treat an explicit user command/setting selecting API for that action as the consent record.
- Add bounded per-action and aggregate budget policy hooks with provider/model metadata where known.
- Record EscalationReceipt / consent / budget verdict in provenance.
- Secret access uses handles/references; logs/evidence must redact secrets.

## Hard policy

```text
WEB failure != API permission
budget available != user consent
user consent -> budget check -> API admission
```

## Required acceptance

- no API network call occurs before consent and budget admission;
- deny consent => no API call;
- approve consent + deny budget => no API call;
- approve both => API run may proceed;
- explicit `use API` is recorded as user-directed choice;
- rate limit/auth/provider faults remain typed;
- usage absent from provider response remains unknown, not zero;
- secret values never appear in logs, Action provenance or reports.

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
