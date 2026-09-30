---
mission_id: BA-007
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_baseline_sha: TO_BE_PINNED_FROM_UTOPIA_MAIN_WHEN_GATE_OPENS
development_status: WAITING_PROJECT_GATE
development_complete: false
development_host: null
development_claimed_at: null
development_branch: assistant/BA-007-settings-interaction-surface
development_head_sha: null
development_ci: null
development_report: mission-book/reports/BA-007/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/BA-007/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-007 — Assistant Settings + Interaction Surface

## Goal

Provide the user-facing surface for selecting assistants and safely changing assistant-owned personalization/mode settings.

## Development scope

- List/select available assistants.
- Edit supported AssistantProfile fields through the versioned profile contract.
- Switch butler/secretary/companion or future modes as assistant/relationship policy, not Digital-Me mutation.
- Show which assistant is active on the current device and where the same assistant is embodied.
- Reserve adapters for future voice/avatar editors without requiring those engines now.

## Explicitly out of scope

- editing Digital-Me canonical user records from assistant settings
- binding UI state directly to one vendor/model
- requiring future voice/avatar capability for current acceptance

## Required acceptance

- Profile changes propagate to all embodiments of that assistant through shared state.
- Changing mode/personality/voice/avatar reference does not restart or duplicate tasks.
- Device assistant switching obeys BA-003/004 contracts.
- UI clearly distinguishes assistant identity from user/Digital-Me identity.

## Start gate

Do not claim this task until the Pre-Assistant foundation branch has been merged to Utopia main and required merged-main GitHub CI is green. At the moment the gate opens, pin that exact Utopia main SHA as the Butler project baseline; all BA branches use the same baseline.

## Development stage

The Development Host must:
1. claim this stage in City;
2. create assistant/BA-007-settings-interaction-surface from the pinned Butler project baseline;
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

No worker may merge assistant/BA-007-settings-interaction-surface to Utopia main. A project-wide merge workbook may be created only after every BA-001..BA-009 branch passes the two-stage/two-host gate.
