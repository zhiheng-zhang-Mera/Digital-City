---
mission_id: GAI-006
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
development_claimed_at: 2026-09-30T15:54:33Z
development_branch: general-ai/GAI-006-conversation-input-stream-cancel
development_head_sha: ac2df607e5aa01744678aa1e26aab481187ff356
development_ci: 36740524898-success
development_report: mission-book/reports/GAI-006/DEVELOPMENT_REPORT.md
correction_status: IN_PROGRESS
correction_complete: false
correction_host: Alien
correction_claimed_at: 2026-10-01T01:04:32Z
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-006/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-006 — Conversation + InputBundle + Streaming + Cancellation

## Goal

Make conversation continuity and rich inputs canonical at the Utopia level while keeping provider/device/thread details as backend references.

## Development scope

- Define canonical Utopia Conversation IDs independent of provider/device/channel.
- Map provider-specific thread/session references as backend refs that may change over time.
- Implement InputBundle text/files/images/references/contextRefs with bounded metadata, digest and provenance.
- Define logical file references that carry origin device and transfer/staging policy rather than hard-coded remote filesystem paths.
- Define PartialResult/event stream semantics; partial text is never a terminal success.
- Keep conversation/PartialResult semantics as the GAI domain-semantic stream. Cross-device carriage may use RF EVENT/STREAM, but RF transport envelopes never become canonical conversation/result state.
- Define ResultEnvelope and attachment/result references.
- Define cancellation/reconciliation semantics that work even after execution-host/channel changes.
- Preserve conversation continuation across allowed Web session reopen and channel/device transitions.

## Required acceptance

- one Utopia conversation can continue while backend thread/device metadata changes;
- backend thread loss is reported and does not silently create a false continuation;
- InputBundle validates size/type/digest/provenance metadata;
- temporary staging metadata has explicit cleanup policy;
- partial events are ordered/versioned and non-terminal;
- cancel is idempotent and late results after cancellation are reconciled rather than silently accepted.

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
