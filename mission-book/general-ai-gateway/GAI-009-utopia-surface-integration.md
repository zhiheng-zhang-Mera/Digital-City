---
mission_id: GAI-009
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
development_claimed_at: 2026-09-30T18:14:05Z
development_branch: general-ai/GAI-009-utopia-surface-integration
development_head_sha: 8dfdf9edcf6f525797de964650b383a916271371
development_ci: 36753891511-success-attempt-3
development_report: mission-book/reports/GAI-009/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-009/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-009 — Utopia Ask/Do + Action + Web/Android Integration

## Goal

Expose General AI Gateway through the existing Utopia product model without creating a parallel AI application shell.

## Development scope

- Add GENERAL_AI to the product Action facade using GAI-001 contracts.
- Extend Ask/Do so unmatched/AI-intended requests can enter GAI routing after deterministic/local routing.
- Keep provider/channel/device details visible as provenance/advanced state rather than forcing the user to choose backend class first.
- Render Web-first execution, DeviceSwitchProposal, ApiSwitchProposal, Budget verdict, ATTENTION_REQUIRED, partial output, cancellation and final result.
- Project GAI AttentionRequest into canonical shared Attention state/fan-out; do not create a GAI-only notification database or device-presence service.
- Preserve the same canonical Action/history truth across Web and Android.
- Do not expose Boss/Hns routes; use semantic GENERAL_AI and existing/future ENGINEERING boundaries.
- Ensure the current interaction device remains the UI endpoint during remote execution.
- Keep Tasks/Services/Rooms backend truths separate; this is a facade/integration layer only.

## Required acceptance

- deterministic local commands still route exactly as before;
- ordinary AI request can produce a GENERAL_AI Action;
- current-device Web flow is the default visible path;
- remote-device proposal/confirmation does not navigate the user away from the current device;
- remote result appears on the originating/shared Action surface;
- API proposal requires explicit confirmation and shows budget outcome before execution;
- cancel/control works from both Web and Android for the same Action where authorized;
- Advanced/debug views preserve real provider/channel/device/backend IDs and errors;
- no UI path claims success while backend state is unavailable/attention-required/failed.

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
