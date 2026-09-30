---
mission_id: BA-004
project: BUTLER_ASSISTANT_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_baseline_sha: d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: assistant/BA-004-shared-brain-runtime
development_head_sha: null
development_ci: null
development_report: mission-book/reports/BA-004/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/BA-004/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_PROJECT_MERGE
---

# BA-004 — Shared Brain Runtime

## Goal

Implement the logical assistant core as one shared mind that may be embodied on several devices at once.

## Development scope

- Define one Assistant Core state boundary for identity, relationship state, planning context, task view and shared conversation facts.
- Separate shared assistant state from per-device embodiment state.
- Allow multiple simultaneous embodiment connections to the same Assistant Core.
- Provide lifecycle/recovery semantics for core restart without turning each device into a separate mind.

## Explicitly out of scope

- device-specific UI implementation beyond adapter contracts
- duplicating the Assistant Core per device
- storing canonical user identity as assistant state

## Required acceptance

- A fact/task accepted through one embodiment is immediately visible to another embodiment of the same assistant.
- Disconnecting one embodiment does not terminate the assistant while another remains active.
- Per-device transient UI/sensor state does not leak into shared state unless explicitly promoted.
- Recovery tests prove one-core/many-embodiments semantics.

## Development stage

The Development Host must:
1. claim this stage in City before implementation;
2. use assistant/BA-004-shared-brain-runtime from the pinned project baseline unless the Owner updates the global baseline before any BA branch is claimed;
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

No worker may merge assistant/BA-004-shared-brain-runtime to Utopia main.
The project-wide merge workbook may only be created after every BA-001..BA-011 branch passes its two-stage/two-host gate.
