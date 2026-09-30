---
mission_id: EM-013
project: ENGINEERING_MANAGER_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
donor_repo: zhiheng-zhang-Mera/DS-Hns
donor_baseline_sha: eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
architecture_contract: ENGINEERING_MANAGER_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: engineering-manager/EM-013-utopia-task-surface-integration
development_head_sha: null
development_ci: null
development_report: mission-book/reports/EM-013/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/EM-013/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-013 — Shared Task Core + Utopia Engineering Control Surface Integration

## Goal

Expose Engineering Manager as one Utopia capability over canonical shared tasks/actions so users can supervise local or remote engineering work from the device they are actually using.

## Development scope

- Bind ENGINEERING jobs to Shared Task Core canonical task/action state; Engineering Manager obtains execution responsibility/leases rather than creating competing canonical truth.
- Expose submit/status/progress/stage/attention/control/result/artifact views through existing Utopia Web/Android patterns.
- Show current executor connector/device separately from logical owner/coordinator.
- Render LocalEligibility and RemoteFallbackProposal with explicit approval; do not auto-select a faster remote machine.
- Render ATTENTION_REQUIRED from canonical shared Attention state and integrate recent-device notification/ring projection; do not create a second Engineering-global attention database.
- Keep remote job control/results on the current/shared Utopia surface; do not navigate the user to the execution host.
- Expose Advanced/debug provenance for connector/backend/device/branch/commit/test/error IDs without leaking secrets.
- Ensure user-visible success comes only from terminal accepted EngineeringResult state.

## Out of scope

- Assistant persona UI
- General AI provider conversation UI
- Remote Fabric pairing UI beyond consuming its public state

## Required acceptance

- Web and Android can observe the same canonical Engineering job without duplicate execution
- foreground/interaction device may differ from execution device
- remote fallback requires explicit approval and local allowed/throttled work remains local
- remote progress/attention/result/artifacts appear on the interaction/shared surface
- first attention acknowledgement reconciles all device projections
- pause/resume/cancel from an authorized non-execution device reaches the same job
- UI never reports success for blocked/attention-required/unavailable/failed backend state
- raw secrets are absent from product/debug surfaces

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


## Global cross-programme no-idle rule

This task participates in the normative global BA/RF/GAI/EM pool defined by `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`.

- Alien and Mech are both available; this Development may be claimed immediately.
- Correction becomes eligible as soon as Development is green and must use the opposite physical host.
- Ordinary claim truth is written only to this task workbook frontmatter/reports; README/MISSION_INDEX are dashboards, not locks.
- Hosted CI, long local tests, provider checks and Remote Fabric waits never idle the machine. Keep the claim, use a separate worktree and claim another eligible global stage.
- Missing Remote Fabric or optional provider software is represented with stable ports/doubles and an explicit deferred integration seam; component work does not wait.
- A host stops claiming only after a fresh scan of BA/RF/GAI/EM finds no actionable owned repair, no eligible opposite-host Correction and no unclaimed Development.
