---
mission_id: EM-011
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
development_branch: engineering-manager/EM-011-deepseek-codex-reference-connectors
development_head_sha: null
development_ci: null
development_report: mission-book/reports/EM-011/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/EM-011/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-011 — DeepSeek Harness + Codex Reference Connectors

## Goal

Prove the generic Connector contract against the two most immediately useful engineering execution paths without turning either product into the Engineering Manager core.

## Development scope

- Implement a DeepSeek Harness connector through stable official/process/session boundaries available on the host; DS-Hns source is donor evidence, not a required runtime.
- Implement a Codex connector through the currently supported installed client/CLI/app boundary available on the host.
- Map probe/version/auth/readiness/capabilities/start-or-attach/submit/events/control/result/health into ConnectorPort.
- Preserve backend run/session IDs as provenance while keeping one canonical Engineering job ID.
- Translate unsupported provider operations to typed UNSUPPORTED_CAPABILITY/ATTENTION/REFUSED states.
- Exercise real host smoke tests where the product is installed; do not emulate a real smoke and label it provider acceptance.
- Keep provider-specific parsing/automation below the adapter boundary.

## Out of scope

- General AI chat/Web gateway behavior
- forking vendor UI/runtime
- changing provider software internals
- automatic cross-device placement

## Required acceptance

- both connectors can be registered without Foreman-core provider branches
- installed/uninstalled/auth-required states are probed honestly
- at least the products available on the acceptance host complete real submit→progress→terminal smoke tests
- cancel/interrupt and result correlation use the canonical job ID plus backend refs
- provider crash/session loss becomes typed connector failure/attention rather than fake completion
- DeepSeek connector has no DS-Hns repository runtime/build dependency

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
