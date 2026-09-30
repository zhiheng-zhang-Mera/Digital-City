---
mission_id: BA-001
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_baseline_sha: TO_BE_PINNED_FROM_UTOPIA_MAIN_WHEN_GATE_OPENS
development_status: WAITING_PROJECT_GATE
development_complete: false
development_host: null
development_claimed_at: null
development_branch: assistant/BA-001-butler-zone-personalization
development_head_sha: null
development_ci: null
development_report: mission-book/reports/BA-001/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/BA-001/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-001 — Butler Zone + Personalization Contracts

## Goal

Create the standalone Butler & Companion Zone identity/configuration boundary, completely separate from Digital-Me user data.

## Development scope

- Define AssistantIdentity and AssistantProfile as replaceable assistant-owned state.
- Reserve versioned personalization ports for naming/form-of-address, voice, character/avatar appearance, personality, duties/role, companion/relationship mode and future extension fields.
- Support multiple saved assistant identities/profiles.
- Define import/export/reset semantics that cannot mutate Digital-Me.

## Explicitly out of scope

- full voice synthesis engine
- avatar rendering engine
- copying Digital-Me into the assistant profile
- hard-coding one companion personality

## Required acceptance

- Changing/resetting/switching assistant profile leaves Digital-Me untouched.
- Unknown future profile attributes can be versioned/extended without schema corruption.
- Two assistant identities can hold different profiles simultaneously.
- Tests prove profile isolation, reset, version validation and safe defaults.

## Start gate

Do not claim this task until the Pre-Assistant foundation branch has been merged to Utopia main and required merged-main GitHub CI is green. At the moment the gate opens, pin that exact Utopia main SHA as the Butler project baseline; all BA branches use the same baseline.

## Development stage

The Development Host must:
1. claim this stage in City;
2. create assistant/BA-001-butler-zone-personalization from the pinned Butler project baseline;
3. implement only this bounded scope;
4. add positive and negative tests;
5. push and run relevant GitHub CI;
6. write DEVELOPMENT_REPORT.md with exact files, tests, failures/fixes, branch/head and CI;
7. mark development_complete only when green.

Do not merge to Utopia main.

## Correction stage

The Correction Host must be the other physical host and must independently inspect the pushed Development branch for relevant architecture, state-consistency, concurrency, permission/privacy, lifecycle, recovery and false-success defects.

Correction is a repair task, not passive verification. Every discovered in-scope defect must be directly fixed on this same branch and covered by regression tests. Cross-subproject issues must be fixed at this task's local contract/guard and recorded for final integration rather than copying another BA implementation.

Push the corrected head, run relevant GitHub CI, write CORRECTION_REPORT.md and mark correction_complete only when green.

## Two-host gate

Final-merge eligibility requires:
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech participated;
- development_complete = true;
- correction_complete = true.

## Merge lock

No worker may merge assistant/BA-001-butler-zone-personalization to Utopia main. A project-wide merge workbook may be created only after every BA-001..BA-009 branch passes the two-stage/two-host gate.
