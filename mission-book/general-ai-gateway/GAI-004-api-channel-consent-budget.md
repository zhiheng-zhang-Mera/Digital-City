---
mission_id: GAI-004
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
development_claimed_at: 2026-09-30T15:11:40Z
development_branch: general-ai/GAI-004-api-channel-consent-budget
development_head_sha: fbb749272ad65c9a8de6cc303371b52fda22f7ef
development_ci: 36735078546-success
development_report: mission-book/reports/GAI-004/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-09-30T17:05:00Z
correction_head_sha: 11d5eced3e913cdd0cd9249d55825dedbcc3d5ac
correction_ci: 36750532665-gateway-web-success-android-success
correction_report: mission-book/reports/GAI-004/CORRECTION_REPORT.md
merge_status: MERGED_MAIN
merge_archive_tag: archive/GAI-004
merge_integration_branch: merge/general-ai-gateway-integration
merge_integration_head: a47e4eb33ca35901e954aa74577f473aea98b1ea
merge_integration_ci: 36828980482-success
merge_main_sha: 74b37cf01fc314e2afb01205916de6decc90bb03
merge_main_ci: 36829232339-success
---

# GAI-004 �?API Channel + Explicit Consent + Budget Policy

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


## Global cross-programme no-idle rule

This task participates in the normative global BA/RF/GAI/EM pool defined by `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`.

- Alien and Mech are both available; this Development may be claimed immediately.
- Correction is eligible immediately after Development is green and must use the opposite physical host.
- Ordinary claim truth is written only to this task workbook frontmatter/reports; README/MISSION_INDEX are not claim locks.
- Hosted CI, real-provider login, long tests and Remote Fabric waits never idle the host. Retain the claim, record the exact seam, and claim another eligible global stage in a separate worktree.
- Missing Remote Fabric uses stable RemoteExecutionPort doubles for component work. Real cross-device proof belongs to programme integration.
- A host stops claiming only when a fresh global scan finds no actionable owned repair, no eligible opposite-host Correction and no unclaimed Development.
