---
mission_id: EM-009
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
development_status: IN_PROGRESS
development_complete: false
development_host: Mech
development_claimed_at: 2026-09-30T15:19:05Z
development_branch: engineering-manager/EM-009-runtime-health-restart-recovery
development_head_sha: null
development_ci: null
development_report: mission-book/reports/EM-009/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/EM-009/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-009 — Runtime Ownership + Health / Restart / Recovery

## Goal

Port the reusable Hns long-hosting safety model into Engineering Manager so connectors/workers can run for long periods without giving health monitors destructive restart authority.

## Development scope

- Generalize runtime ownership records by connector/instance/worker identity with stale PID/process validation.
- Keep this recovery layer process/runtime scoped. Cross-device network/session reconnect remains Remote Fabric responsibility; process restart occurs only after domain reconciliation and current task/lease validation.
- Separate health sensing/pressure decisions from restart execution.
- Preserve HEALTHY/ELEVATED/DEGRADED/CRITICAL/UNKNOWN-style health semantics with confidence/freshness where useful.
- Implement bounded heartbeat/liveness/readiness, restart budget, cooldown/backoff, crash-loop ladder and safe mode.
- Require before-restart checkpoint/continuity hooks and after-restart readiness before resume.
- Prevent terminal jobs from reappearing in active queues after restart.
- Keep restart supervisor process/business neutral enough to supervise connector/worker runtime instances.

## Out of scope

- Engineering job planning
- Remote Fabric node restart
- machine reboot policy except through an explicit separate interface
- provider-specific health heuristics in core

## Required acceptance

- monitor cannot directly execute restart in source/permission tests
- restart executor has no authority to invent health pressure policy
- stale/dead ownership cannot kill an unrelated process with a reused PID
- restart budget ends in safe mode instead of an infinite loop
- resume occurs only after required readiness/checkpoint reconciliation
- terminal jobs do not resurrect after recovery
- one connector crash does not terminate unrelated connectors/Utopia

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
