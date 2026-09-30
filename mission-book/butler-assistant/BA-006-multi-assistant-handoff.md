---
mission_id: BA-006
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_baseline_sha: d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: assistant/BA-006-multi-assistant-handoff
development_head_sha: null
development_ci: null
development_report: mission-book/reports/BA-006/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/BA-006/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-006 — Multi-Assistant Presence, Switching + Handoff

## Goal

Allow several assistant identities to be online while making device-level switching and true responsibility handoff explicit and conflict-safe.

## Development scope

- Maintain multiple online Assistant Cores.
- Switch the active assistant on one device without offlining the outgoing assistant on its other devices.
- Classify responsibilities as global assistant tasks versus device/session-scoped transferable responsibilities.
- Perform handoff only when responsibility must actually move; switch immediately when no transfer is needed.
- Support full assistant replacement/offline with required transferable-task handoff.

## Explicitly out of scope

- automatically transferring every global task when one device switches
- two active foreground assistants on one device
- losing tasks because an assistant persona was changed

## Required acceptance

- Phone A→B leaves A's unrelated global task running when A remains active elsewhere.
- No transferable responsibility produces an immediate switch.
- Transferable device/session responsibility produces a machine-readable handoff and acknowledged takeover.
- Full A→B replacement refuses shutdown until required handoff succeeds or Owner explicitly cancels the task.

## Development stage

The Development Host must:
1. claim this stage in City before implementation;
2. use assistant/BA-006-multi-assistant-handoff from the pinned project baseline unless the Owner updates the global baseline before any BA branch is claimed;
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

No worker may merge assistant/BA-006-multi-assistant-handoff to Utopia main.
The project-wide merge workbook may only be created after every BA-001..BA-011 branch passes its two-stage/two-host gate.
