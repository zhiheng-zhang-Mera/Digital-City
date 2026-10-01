---
mission_id: EM-010
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
development_status: COMPLETE
development_complete: true
development_host: Mech
development_claimed_at: 2026-09-30T16:56:10Z
development_branch: engineering-manager/EM-010-foreman-scheduler-dag-worker-pool
development_head_sha: 5209b94fc846337c19194c72ab38a6c22cc3295c
development_ci: 36748073216-success
development_report: mission-book/reports/EM-010/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-10-01T03:14:24Z
correction_head_sha: 2ab350d0e6924b89765e54ab50e498a87307cb86
correction_ci: 36810665718-gateway-web-success-android-success
correction_report: mission-book/reports/EM-010/CORRECTION_REPORT.md
merge_status: MERGED_MAIN
merge_archive_tag: archive/EM-010
merge_integration_branch: merge/engineering-manager-integration
merge_integration_head: aef657fe65ec3e7ce6c34fadd0e6dedbf186213c
merge_integration_ci: 36829755814-success
merge_main_sha: e7c498f5acd86da324a45c3278219c8daa612561
merge_main_ci: 36830053908-success
---

# EM-010 — Foreman Queue / DAG / Resource Scheduling / Worker Pool

## Goal

Preserve the useful Hns project-foreman execution machinery above connectors: queueing, dependency scheduling, isolated writes, resource adaptation and auditable convergence.

## Development scope

- Implement ordered/scheduled Engineering queue and durable job lifecycle independent of one connector product.
- Support DAG nodes with depends_on, write_scope and acceptance tests; run only dependency-satisfied work.
- Use isolated worktrees/file ownership/conflict ceilings for concurrent writers and report conflicts rather than auto-merging unsafe overlaps.
- Maintain hardware/runtime resource ceilings and adaptive worker counts with hysteresis.
- Allow one-worker serial mode on the same code path.
- Keep connector selection constrained by capability/readiness/auth and the LOCAL_FIRST placement contract.
- Integrate checkpoint/resume, stall/crash signals, bounded retry/reassignment and integration validation without overriding Shared Task Core authority.
- Expose inspectable queue/task/worker metrics and evidence.

## Out of scope

- Remote Fabric implementation
- provider-specific prompts
- City-wide project priority policy
- silent architectural redesign by worker

## Required acceptance

- independent DAG nodes may run concurrently while dependency/order constraints hold
- two writers to the same protected file/scope cannot run unsafely at once
- resource pressure scales down/pauses new work without falsely failing completed work
- one-worker mode uses the same lifecycle/acceptance path
- retry/reassignment cannot duplicate terminal result or external side effect
- scheduler uses ConnectorPort/capabilities rather than provider-name conditionals
- queue remains resumable after controlled restart

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
