---
mission_id: GAI-002
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
development_branch: general-ai/GAI-002-provider-model-account-registry
development_head_sha: null
development_ci: null
development_report: mission-book/reports/GAI-002/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/GAI-002/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
---

# GAI-002 — Provider / Model / Account Registry

## Goal

Create provider-neutral discovery state for general-AI providers, models, accounts and channel readiness.

## Development scope

- Version ProviderDescriptor, ModelDescriptor, ProviderAccount and capability/profile records.
- Represent Web/API support independently per provider/account/model.
- Represent capability facts such as text, image, file/document, vision, code, long-context, streaming/tool/structured-output support where verified.
- Default unknown capability to unknown/unsupported, never assumed true.
- Support multiple accounts for one provider without conflating account identity with provider identity.
- Store persistent browser-profile references and credential handles only; never persist raw secrets in shared City state.
- Persist those handles through the neutral 00-Foundation `SecureHandleStorePort`; do not create a General-AI-only credential/profile storage engine that duplicates Engineering storage.
- Expose list/query APIs usable by routing without binding to one UI.
- Track freshness/source/provenance for discovered or configured capability facts.

## Out of scope

- logging into a provider;
- executing requests;
- selecting a provider for a specific task;
- extracting a global credential service.

## Required acceptance

- provider/model/account identities remain distinct under multiple-account tests;
- stale capability metadata is visible as stale/unknown;
- channel readiness can differ between WEB and API;
- missing model/provider/account produces typed absence;
- raw secret/cookie/token material is rejected from canonical records;
- registry works with synthetic providers and does not hard-code Boss-era identities.

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
