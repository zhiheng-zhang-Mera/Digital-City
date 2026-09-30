---
mission_id: BA-005
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_baseline_sha: TO_BE_PINNED_FROM_UTOPIA_MAIN_WHEN_GATE_OPENS
development_status: WAITING_PROJECT_GATE
development_complete: false
development_host: null
development_claimed_at: null
development_branch: assistant/BA-005-digital-me-context-gateway
development_head_sha: null
development_ci: null
development_report: mission-book/reports/BA-005/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/BA-005/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-005 — Digital-Me Scoped Context Gateway

## Goal

Let assistants understand the user through authorized contextual views without moving assistant persona or relationship state into Digital-Me.

## Development scope

- Define a scoped read/query gateway from assistants to Digital-Me.
- Support purpose/scope-aware context requests and least-data responses.
- Keep assistant identity/persona/relationship configuration outside Digital-Me.
- Provide explicit denial/unavailable behavior and audit provenance.

## Explicitly out of scope

- assistant direct database access
- assistant rewriting Digital-Me user identity/preferences as a side effect of conversation
- bulk dump of all Digital-Me data by default

## Required acceptance

- Different assistants can receive different authorized context scopes.
- Denied scope returns a typed refusal without partial leakage.
- Assistant profile changes never change Digital-Me records.
- Tests cover scope allow/deny, absence, stale context handling and audit/provenance.

## Start gate

Do not claim this task until the Pre-Assistant foundation branch has been merged to Utopia main and required merged-main GitHub CI is green. At the moment the gate opens, pin that exact Utopia main SHA as the Butler project baseline; all BA branches use the same baseline.

## Development stage

The Development Host must:
1. claim this stage in City;
2. create assistant/BA-005-digital-me-context-gateway from the pinned Butler project baseline;
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

No worker may merge assistant/BA-005-digital-me-context-gateway to Utopia main. A project-wide merge workbook may be created only after every BA-001..BA-009 branch passes the two-stage/two-host gate.
