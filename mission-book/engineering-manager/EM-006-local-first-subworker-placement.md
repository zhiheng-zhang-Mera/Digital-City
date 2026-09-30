---
mission_id: EM-006
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
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: engineering-manager/EM-006-local-first-subworker-placement
development_head_sha: null
development_ci: null
development_report: mission-book/reports/EM-006/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/EM-006/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
---

# EM-006 — LOCAL_FIRST Sub-worker Resource + Placement Gate

## Goal

Make a Sub-worker start on its own/controller device by default and consider remote execution only when measured local conditions make execution blocked or unavailable.

## Development scope

- Implement LOCAL_ALLOWED, LOCAL_THROTTLED, LOCAL_BLOCKED and LOCAL_UNAVAILABLE eligibility states with explanations/evidence.
- Evaluate local CPU/RAM/GPU/VRAM/thermal/battery/disk/runtime pressure and protected foreground workload policy through interfaces rather than product-name guesses.
- Treat a sustained high-load protected workload such as a large game as a possible local BLOCKED condition only when measured policy thresholds say the worker would materially interfere.
- Before remote fallback, reduce local worker count/concurrency/resource envelope when the state is THROTTLED.
- Set placement_policy=LOCAL_FIRST and remote_fallback=ASK_USER.
- Generate RemoteFallbackProposal only for BLOCKED/UNAVAILABLE.
- Never propose remote execution merely because another machine is faster, emptier or has more worker capacity.
- Record the local eligibility reason and any remote proposal in job provenance.

## Out of scope

- Remote Fabric dispatch
- remote host ranking implementation beyond an interface
- provider connector invocation
- automatic permanent remote authorization

## Required acceptance

- LOCAL_ALLOWED starts locally
- LOCAL_THROTTLED stays local with reduced resource/concurrency policy
- a faster idle remote machine does not trigger a proposal while local is allowed/throttled
- LOCAL_BLOCKED/UNAVAILABLE produces at most one active proposal per proposal epoch
- no remote execution starts from this task
- eligibility state exposes the measured reason rather than a generic busy flag

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
