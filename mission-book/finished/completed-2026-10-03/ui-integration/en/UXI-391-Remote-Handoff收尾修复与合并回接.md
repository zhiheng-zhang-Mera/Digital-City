> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../UXI-391-Remote-Handoff收尾修复与合并回接.md) 的原始 frontmatter 是唯一元数据来源。

# UXI-391 — Remote handoff repair closeout and merge re-entry

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). README is a monitoring dashboard, not construction rules or a claim lock.

## Goal

A narrow repair after phase acceptance, not a restart of all UI civilization, RS-201..290 or UXI-301/390 construction. Four goals only:

1. Correct the false UXI-301/390 premise that City has only one instantaneous task type and cannot reliably construct busy-current-device.
2. Fix the recorded semantics of the five-dimensional load vector: partial observation allowed, missing dimensions unobserved rather than fabricated 0; do not require all five for this repair.
3. Repeatable target-task construction genuinely closes SWITCH_OFFERED → ALTERNATE_DEVICE / REMOTE_HANDOFF → same task continues on another node → result returns to original interaction surface.
4. After this workbook's terminal state, do not stop at this task completed: automatically rescan other incomplete merge workbooks/merge-authority tasks and immediately re-enter those with satisfied dependencies.

## Confirmed context / actual current code

Verified baseline when created:

- Utopia main = `d0507b008cc4f91c494e24388c457a8decd9e559`.
- Main hosted CI 37020640107 = success.
- UXI-390 visual acceptance, Android/Web wiring and phase acceptance remain valid; this does not revoke UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED.
- Branch uxi/UXI-301-scheduler-status-into-product-ui @ `66fa20118f1a7dbb269cf05d8b0a6580219afce3` found/corrected a real record error: City protocol has more than one task type.
- contracts/city-control-v0/protocol.mjs declares five requestable tasks: WAIT, CREATE_TEMP_ARTIFACT, HASH_TEMP_ARTIFACT, DELETE_TEMP_ARTIFACT, CHECKPOINT_DEMO.
- Reference runner WAIT defaults to approximately 1200 ms × 5 = 6000 ms and reliably holds a node.
- Do not merge all of 66fa201 directly into main: its new handoff evidence remains FAIL, and that head has no bindable hosted CI. Adopt only source-confirmed independently measured facts, not failed scenario construction.

### This task's ruling on five-dimensional load

RS-202 load remains cpu / memory / gpu / io / network. Having all five is not a handoff prerequisite. Current implementation:

- loadFromTelemetry() honestly supplies measured existing telemetry; CPU/memory are currently stable.
- Unmeasured GPU/IO/network remain absent, not 0.
- loadPressure() accepts partial vector; default min_observed_dimensions = 1.
- Pressure uses binding maximum of observed dimensions, not five-dimensional average.
- Other low-load dimensions must not dilute one saturated dimension.
- No available measurement remains LOAD_UNKNOWN, not idle.

The five-dimensional variable is not this round's blocker. Only correct conflicting old comments/records and test with real partial telemetry. Capability-declared required load dimensions may be future extension, but do not add that architecture in UXI-391.

## Dependencies and unlock conditions

- UXI-390 satisfied: phase acceptance, main merge, main CI complete.
- Either Alien or Mech may claim Development.
- Development requires one physical host only.
- Same-host Gateway + Node A + Node B controlled two-node E2E is allowed during Development.
- Final independent review/real two-host acceptance require the other physical host; hosted CI does not count.
- One host cannot complete both Development and independent Review.

## Allowed change boundary

Minimal changes only for:
1. UXI-301/390 handoff harness/evidence/error records.
2. Gateway/scheduler orchestration's necessary bridge consuming routing plan and executing existing ownership-transfer/reassignment semantics.
3. Minimal target-task safe reclaim/recovery state or CAS/lease guard.
4. Minimal existing Web/Android scheduler-surface wiring for actual handoff/result return.
5. Comments/tests/presentation descriptions contradicting current partial load.
6. Unit/integration/E2E/regression tests for this defect.
7. Corresponding mission-book/reports/UXI-391/** reports/evidence pointers/final re-entry records.

## Prohibited change boundary

- No UI shell/visual style/Rooms-layout redesign.
- No rewriting frozen RS-201/202/203/290 core semantics.
- Do not collect complete GPU/IO/network telemetry for this task.
- No missing load dimension filled with 0.
- Do not turn planner into implicit executor: planRoute() may remain pure/executed:false; caller orchestration explicitly executes handoff.
- No new AI provider/discovery protocol/permission model/general checkpoint framework.
- WAIT success does not prove lossless migration of arbitrary side-effect tasks.
- Do not reopen COMPLETE historical merge workbooks.
- Do not cherry-pick the entire 66fa201 as shortcut.

## Task-specific construction steps

### Step 1 — Claim-time reconciliation

Reread current Digital-City main, Utopia main, UXI-301/390 workbooks/reports, 66fa201 versus main diff, current main hosted CI. Record development_baseline_sha. Suggested branch uxi/UXI-391-remote-handoff-closeout. If main advanced, start from claim-time main, not force old d0507b0.

### Step 2 — Record correction and load-variable cleanup

Minimally correct/remove City only has one task type and obsolete complete-five-dimensional-vector alternate prerequisite. Preserve fail-honest partial vector; missing load remains visibly unobserved. Regression tests prevent missing=0 or incomplete-five-dimensions=unavailable returning. Do not rewrite historical reports to pretend they were never wrong: append erratum/correction record and retain traceable old evidence.

### Step 3 — Repeatable same-host two-node E2E

Isolated runtime namespace/store is mandatory to avoid historical-task claim-order interference. Build around one target WAIT task, not the faulty sequence WAIT occupies A then create a second task for free B:

1. Start Gateway.
2. Start only Node A.
3. Create target WAIT.
4. Wait/assert target RUNNING, assignedNodeId=A, sustained observable window; tens of milliseconds is not genuine holding.
5. Stop only Node A worker/agent; keep Gateway and original interaction surface live.
6. Then start Node B.
7. Scheduler produces switch offer from real state, not harness injection.
8. Drive actual user choice/decline paths.
9. Planner reaches ALTERNATE_DEVICE / presentation REMOTE_HANDOFF.
10. Orchestration genuinely executes one guarded A→B ownership-transfer/reassignment.
11. B continues the same task ID, not a hidden replacement task.
12. Task reaches actual terminal success.
13. Result returns from backend truth to still-open original Web/Android surface.
14. UI does not leak raw scheduler tokens.

Anti-vacuity asserts A actually ran target, A worker stopped, B joined only after A owned target, ownership really changed A→B, completed ID unchanged, and UI reread backend result rather than harness printing it.

### Step 4 — Minimal ownership-transfer implementation

If code has route decision but no execution bridge: keep pure planRoute(); add/fix explicit orchestration consumer. Transfer uses existing task truth plus guarded compare-and-set/lease-equivalent to prevent simultaneous A/B execution. Only explicit route stage plus user intent permits transfer. UI cannot recompute/select device. Transfer/recovery failure remains nonterminal or explicit failure, never fake COMPLETED. WAIT proves ownership transfer/result return; do not expand exactly-once guarantees to all side-effect tasks.

### Step 5 — Same-host regression and hosted CI

Cover five task types, stable WAIT holding, partial load, missing dimension != zero, saturated observed dimension binds, target ownership A→B, no duplicate execution/terminal completion, switch offer/decline/alternate/remote handoff terminology, result return, existing Web/Android scheduler parity, root regression. Exact-head hosted CI success before Development complete.

### Step 6 — Final two-physical-host acceptance

After Development release, opposite host Reviews and cooperates on genuine Alien+Mech acceptance. Recommended sequence:

1. Developer runs Gateway + original interaction UI + A worker.
2. After target WAIT RUNNING/assigned A, stop A worker only, not UI/Gateway.
3. Reviewer starts B.
4. Original UI drives actual switch/decline.
5. Observe/prove target ownership A→B.
6. B completes execution.
7. Original UI sees result without moving to B.
8. Independent negatives: B unavailable; duplicate handoff; stale assignment/lease; A recovery cannot execute alongside B; unmeasured load not fabricated idle.
9. Review may repair in-scope defects; code changes require new review head and rerun required CI.

Final report records at minimum development_head / development_ci / review_head / review_ci / physical hosts / target task id / A→B ownership evidence / result-return evidence / remaining limitations.

### Step 7 — Merge to Utopia main

Merge only after all: Development complete; independent Review complete; same-host two-node E2E PASS; real Alien+Mech acceptance PASS; exact review-head hosted CI PASS; fetch latest main before merge; on drift refresh integration under persistent rules and rerun affected validation; post-merge main hosted CI PASS.

Then record REMOTE_HANDOFF_CLOSEOUT_REPAIRED and explicitly state UXI-390 acceptance was not revoked, whether old deferred remote-handoff seam is truly CLOSED, and load still supports partial observation rather than complete five-dimensional telemetry.

## Automatic re-entry into other merge workbooks (MANDATORY POST-CONDITION)

UXI-391 completion does not allow the construction host to stop. Immediately after Step 7 main CI green and terminal marker recorded, a fresh control-plane rescan is mandatory.

### Scan set

Latest Digital-City main, outside mission-book/finished/**:
1. Filenames containing MERGE_WORKBOOK.
2. Nonterminal workbooks with frontmatter merge_authority: true.
3. Explicit integration/merge/closeout workbooks of current active programme.

### Automatic re-entry rules

- Never reopen COMPLETE/finished historical merge workbooks.
- Recompute each incomplete candidate's dependencies, not old pre-UXI-391 claimability conclusions.
- Exactly one satisfied eligible candidate: immediately atomically claim and continue.
- Several candidates: explicit dependencies → phase/sequence → programme merge order; do not guess from filenames.
- Host ineligible due to independence/hardware/role: record STRUCTURALLY_INELIGIBLE and trigger/leave wake condition for eligible host.
- Waiting only for CI/other host: TEMPORARILY_UNCLAIMABLE, events first, approximately 20-minute fallback only.
- No active merge candidate: classify entire pool under CONSTRUCTION_RULES.md §5; POOL_TERMINAL only for genuinely terminal whole pool.

### Prohibited fake automatic re-entry

Not sufficient: one report sentence that merging can continue later; jumping to old merge branch without fetching main; rerunning COMPLETE historical programme merge; declaring whole pool complete because this host is ineligible; changing dependencies/success definition to make workbook claimable.

### Required re-entry record

mission-book/reports/UXI-391/POST_COMPLETION_REENTRY.md contains at minimum:

```text
uxi391_terminal_marker
utopia_main_sha
utopia_main_ci
digital_city_main_sha
merge_candidates_scanned
eligible_now
temporarily_unclaimable
structurally_ineligible
external_blocked
next_claimed_workbook
next_claim_host
wake_condition
pool_classification_if_no_claim
```

If next merge workbook is claimed, record its workbook ID and claim commit. Otherwise provide typed reason compliant with §5.

## Task-specific independent review

Reviewer cannot merely sign reports. Independently reconstruct target WAIT A→B handoff; verify partial load without developer's fixed fixture as sole basis; one stale/duplicate-transfer negative control; check same task ID/ownership history/terminal result; UI result-return; exact-head CI; actual post-completion POST_COMPLETION_REENTRY.

## Completion gates

Only all satisfied permit development_complete: true, review_complete: true, status: COMPLETE:

1. False premise has append-only correction.
2. Five-dimensional semantics match code/tests.
3. Same-host two-node handoff E2E PASS.
4. Actual ownership transfer occurred.
5. Same task ID continues on B and becomes terminal.
6. Result returns to original surface.
7. Real Alien+Mech final acceptance PASS.
8. Exact review-head CI PASS.
9. Utopia main merge/main CI PASS.
10. REMOTE_HANDOFF_CLOSEOUT_REPAIRED recorded.
11. POST_COMPLETION_REENTRY.md generated.
12. Next executable merge workbook automatically claimed, or typed zero-claim classification under persistent rules.

## Reports / Utopia evolution records

City retains control-plane reports/conclusions/SHA/CI pointers/minimal text evidence; bulky raw evidence stays in Utopia:
- mission-book/reports/UXI-391/DEVELOPMENT_REPORT.md
- mission-book/reports/UXI-391/REVIEW_REPORT.md
- mission-book/reports/UXI-391/POST_COMPLETION_REENTRY.md
- Utopia evidence/raw/mission-book/UXI-391/**

Retain research/evolution events: seemingly impossible handoff came from wrong task-type selection; five-dimensional contract versus actual partial telemetry produced false limitation judgment; second scenario's assignment ordering let free B take second task, demonstrating anti-vacuity need; pure planner/execution bridge separation plus guarded ownership transfer enables real handoff; control-plane rescan after closeout automatically re-enters merge workflow, preventing a local closeout silently stalling the long-term pool.

## Binding persistent rules

Inherit mission-book/CONSTRUCTION_RULES.md atomic claims, two-host independence, wait/wake, 20-minute fallback rescan, external reconciliation, exact-head CI/evidence, no-idle, no-make-work, integration refresh.

Two stricter rules:
1. Development prioritizes one host; Review/final physical acceptance uses two. Do not manufacture parallel development branches both changing handoff core.
2. Automatic terminal-state merge-workbook re-entry is a completion gate, not an optional suggestion.
