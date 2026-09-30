---
mission_id: BA-001
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_baseline_sha: d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: assistant/BA-001-terminal-shell-rooms
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

# BA-001 — Terminal Shell + Rooms Foundation

## Goal

Absorb the unfinished pre-assistant closeout work that makes existing Utopia capabilities reachable from the normal terminal shell, without adding assistant identity semantics.

## Development scope

- Start the existing Room Hub through normal host lifecycle rather than a special manual path.
- Expose the accepted Room Pack through the normal Web shell.
- Expose at least truthful Room availability/status through the supported authenticated Android path.
- Preserve existing capability ownership, failures and provenance; do not create a new Room.

## Explicitly out of scope

- assistant persona or memory
- Digital-Me integration
- Boss/Hns connector expansion
- new capability invented only for UI completeness

## Required acceptance

- Normal supported startup exposes the existing Rooms.
- Web and Android report the same underlying Room availability truth.
- Failure/offline/refusal states are visible rather than silently rewritten.
- Regression tests cover startup, availability, unavailable/refusal and restart/reconnect.

## Development stage

The Development Host must:
1. claim this stage in City before implementation;
2. use assistant/BA-001-terminal-shell-rooms from the pinned project baseline unless the Owner updates the global baseline before any BA branch is claimed;
3. implement only this bounded scope;
4. add positive and negative tests;
5. push the branch and run relevant GitHub CI;
6. write DEVELOPMENT_REPORT.md with exact files, tests, failures/fixes, branch/head and CI;
7. mark development_complete only when the branch is green.

Do not merge to Utopia main.

## Correction stage

The Correction Host must be the other physical host.

Before relying on the Development report, independently inspect the branch design and implementation for relevant:
- architecture/boundary holes;
- state-consistency and lifecycle holes;
- concurrency/race/idempotency holes;
- permission/privacy violations;
- recovery/restart problems;
- false-success or unverifiable product behavior.

Correction is a repair task, not a passive verification task. Every discovered in-scope defect must be directly fixed on this same branch, with regression coverage. If a proposed repair would expand outside this task's scope, record the cross-branch integration seam and fix the local contract/guard without implementing another BA task.

Then push the corrected head, run relevant GitHub CI, write CORRECTION_REPORT.md and mark correction_complete only when green.

## Two-host gate

This branch cannot become final-merge eligible unless:
- Development Host != Correction Host;
- branch records show both Alien and Mech participated;
- development_complete = true;
- correction_complete = true.

## Merge lock

No worker may merge assistant/BA-001-terminal-shell-rooms to Utopia main.
The project-wide merge workbook may only be created after every BA-001..BA-011 branch passes its two-stage/two-host gate.
