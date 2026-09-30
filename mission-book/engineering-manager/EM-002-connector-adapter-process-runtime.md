---
mission_id: EM-002
project: ENGINEERING_MANAGER_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
donor_repo: zhiheng-zhang-Mera/DS-Hns
donor_baseline_sha: eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
architecture_contract: ENGINEERING_MANAGER_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: engineering-manager/EM-002-connector-adapter-process-runtime
development_head_sha: null
development_ci: null
development_report: mission-book/reports/EM-002/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/EM-002/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-002 — Connector Adapter Framework + Generic Managed-Process Runtime

## Goal

Extract the reusable Hns adapter/process ideas into a provider-neutral Connector runtime so new engineering workers are registrations/adapters rather than Foreman-core changes.

## Development scope

- Implement detect/select/adapt/validate/standardize/unify stages with per-adapter fault isolation.
- Define connector lifecycle hooks and stable coded failures; third-party adapter throw/invalid output must remain data rather than crash startup.
- Implement a generic managed-process transport for Node/Python/EXE/CLI-style workers with bounded startup, heartbeat, log capture, invoke, stop and restart budget.
- Keep process business-agnostic: the runtime understands process/transport/capability declarations, not Codex/Claude/DeepSeek semantics.
- Add permission-policy mediation so adapters propose capabilities/needs while Utopia policy decides grants.
- Preserve provenance showing detection evidence, selected adapter, granted/refused permissions and runtime kind.

## Out of scope

- job scheduling policy
- remote device placement
- provider login flows
- provider-specific prompts

## Required acceptance

- one malformed connector cannot prevent other connectors from loading
- generic process runtime can host at least two synthetic connector manifests with different capabilities
- undeclared capability/method calls are refused
- restart attempts are bounded and terminal safe mode exists
- logs/output are bounded and secrets can be redacted by the caller policy
- adding a synthetic connector requires registration/manifest code, not a Foreman-core conditional

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
