---
mission_id: EM-008
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
development_claimed_at: 2026-09-30T15:01:02Z
development_branch: engineering-manager/EM-008-credential-profile-session
development_head_sha: 963b4f2e47fbb8715d1cf98cf90baee0f79a9c5d
development_ci: 36734070041-success
development_report: mission-book/reports/EM-008/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-10-01T02:42:14Z
correction_head_sha: 4e1b57f9a503458775a004b7bcc32e175e0ca463
correction_ci: 36808238886-gateway-web-success-android-success
correction_report: mission-book/reports/EM-008/CORRECTION_REPORT.md
merge_status: MERGED_MAIN
merge_archive_tag: archive/EM-008
merge_integration_branch: merge/engineering-manager-integration
merge_integration_head: aef657fe65ec3e7ce6c34fadd0e6dedbf186213c
merge_integration_ci: 36829755814-success
merge_main_sha: e7c498f5acd86da324a45c3278219c8daa612561
merge_main_ci: 36830053908-success
---

# EM-008 — Credential References + Persistent Connector Profiles / Sessions

## Goal

Replace DeepSeek-only .env assumptions with a connector-neutral authentication/profile layer while keeping canonical/shared state free of plaintext secrets.

## Development scope

- Define AuthMode including API_KEY, OAUTH, DEVICE_CODE, CLI_SESSION, BROWSER_PROFILE, DESKTOP_SESSION and NONE.
- Define credential_ref/profile_ref/session_ref contracts and lifecycle/freshness metadata.
- Consume the neutral 00-Foundation `SecureHandleStorePort` for platform-secure credential/profile/session handles; on Windows its implementation may use Credential Manager/DPAPI. Engineering Manager must not create a second domain-exclusive secure-store engine.
- Migrate/bridge existing DeepSeek key discovery behavior without copying secret values into shared task/registry records.
- Allow connector instances to persist permitted CLI/browser/desktop session references across restart.
- Surface missing/expired/needs-user states through AuthStatus and AttentionEnvelope.
- Redact secret material from logs, reports, artifacts and diagnostic snapshots.

## Out of scope

- provider-specific login page automation
- general consumer AI account routing
- Remote Fabric secret replication by default

## Required acceptance

- canonical job/connector/task state contains handles/references rather than plaintext secrets
- secret values are absent from logs/reports under failure tests
- expired session becomes EXPIRED/NEEDS_USER rather than READY
- restart can restore an allowed persistent profile/session reference
- missing secure-store support degrades honestly instead of falling back to plaintext shared state
- legacy DeepSeek env discovery can be consumed through the abstraction without becoming the universal schema

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


[阅读译本 / Reading translation](./zh-CN/EM-008-credential-profile-session.md)
