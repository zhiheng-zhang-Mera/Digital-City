---
mission_id: EM-004
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
development_claimed_at: 2026-09-30T13:38:44Z
development_branch: engineering-manager/EM-004-capability-probe-auth-registry
development_head_sha: 6e72536f40a310a3d1c36688ef0e4fe1352f1b72
development_ci: 36723706236-success
development_report: mission-book/reports/EM-004/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-09-30T15:02:58Z
correction_head_sha: 1e2c0e1e8afd540d9140e878e0c6fd039d06f8ed
correction_ci: 36735453774-gateway-web-success-android-success
correction_report: mission-book/reports/EM-004/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-004 — Connector Capability / Probe / Auth / Instance Registry

## Goal

Represent what engineering worker instances actually exist on each device, what they can do and whether they are usable without hard-coding provider choice into the Foreman.

## Development scope

- Define ConnectorDescriptor and ConnectorInstance separately so one connector type may have multiple installed/running/account instances.
- ConnectorInstance references canonical RF device identity/presence when cross-device. Its CapabilityManifest describes engineering-worker capabilities only; it must not duplicate RF's transport-addressable node capability registry.
- Implement probe() facts for installed/version/running/attachable/readiness/device and freshness/provenance.
- Define CapabilityManifest including filesystem, shell, git, browser, vision, computer-use, checkpoint/resume, interaction and other extensible capabilities.
- Define typed AuthStatus including READY, MISSING, EXPIRED, NEEDS_USER, REFRESHING, UNAVAILABLE and UNKNOWN.
- Keep auth status, health, process readiness and capability support separate.
- Provide requirement matching used by dispatch/remote fallback without actually selecting a remote host here.
- Unknown capability defaults to unknown/unsupported, never assumed true.

## Out of scope

- secret storage
- remote trust/discovery
- scheduling priority
- provider-specific authentication UI

## Required acceptance

- two instances of one connector type remain distinct
- stale probe data is visible as stale and not silently healthy
- auth READY cannot be inferred only from a live process
- capability mismatch produces a typed refusal before execution
- registry survives one connector probe throwing/timing out
- no raw credential material is stored in registry records

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
