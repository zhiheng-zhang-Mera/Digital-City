---
mission_id: EM-005
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
development_claimed_at: 2026-09-30T13:55:55Z
development_branch: engineering-manager/EM-005-attention-recent-device-alerts
development_head_sha: adf0cf5e6bd17b5f1e4dba29a5f04d51743146f5
development_ci: 36725729360-success
development_report: mission-book/reports/EM-005/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-09-30T15:36:59Z
correction_head_sha: cefc6c7ec5343a9d33ae2d6a927603be963389db
correction_ci: 36739358075-gateway-web-success-android-success
correction_report: mission-book/reports/EM-005/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-005 â€?Attention Bridge + Recent-Device Notification/Ring

## Goal

Make blocking Engineering questions follow the user instead of trapping work on the execution host, while preventing notification storms and duplicate answers.

## Development scope

- Define Engineering AttentionEnvelope semantics and project them into canonical shared Attention state; do not create an Engineering-only global notification database.
- Use the shared projection/fan-out path with RF presence/device eligibility and current Utopia interaction state for current + recent-device delivery.
- Project the actionable event to the current interaction device and notification/ring copies to the 2â€? most recently user-operated eligible online devices.
- Rank recent devices by real user interaction recency, not uptime/heartbeat age.
- Implement first-valid-ack wins; globally close the event and withdraw/disable remaining projections.
- Deduplicate across reconnect, heartbeat, page refresh, repeated connector delivery and retry.
- Distinguish permission, question, authentication, confirmation and device-action attention types.
- Respect quiet/full-screen/protected-use policy by suppressing sound when required while retaining visible notification.
- Do not ring for non-blocking informational events by default.
- Route response back to the originating connector/job regardless of which authorized device answered.

## Out of scope

- Remote Fabric transport internals
- OS-specific notification styling beyond minimal integration
- automatic approval of permissions
- physically impossible remote authorization bypasses

## Required acceptance

- one attention_id creates one logical question despite multiple projections
- current interaction device is always included when eligible/online
- only the configured 2â€? recent eligible devices receive auxiliary alert projections
- first acknowledgement closes all copies atomically/idempotently
- duplicate/reconnect delivery does not ring twice for the same epoch
- quiet/protected device can suppress sound without losing the event
- reply from a non-execution device resumes the correct originating job where the platform permits mediation

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
