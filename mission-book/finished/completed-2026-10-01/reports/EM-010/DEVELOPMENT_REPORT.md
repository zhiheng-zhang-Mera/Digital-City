# EM-010 Development Report — Foreman Queue / DAG / Resource Scheduling / Worker Pool

```text
MISSION                  = EM-010 (Engineering Manager programme, task 10 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 63950cc (Digital-City main, "claim(EM-010): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:56:10Z
CONTROL_REVISION_AT_CLAIM= ef62185 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-010-foreman-scheduler-dag-worker-pool
IMPLEMENTATION_HEAD_SHA  = 5209b94fc846337c19194c72ab38a6c22cc3295c
BRANCH_CI                = 36748073216 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-foreman-scheduler-v1/` — `foreman.mjs` (DAG validation and ordering, write-scope
isolation, resource-adaptive worker pool, capability-based selection, bounded retry/reassignment, restart
recovery, metrics/evidence), `index.mjs`, 7-test suite, root `tests/engineering-foreman-scheduler.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Independent DAG nodes may run concurrently while dependency/order constraints hold | `a DAG is validated and only dependency-satisfied work is runnable` (two dependency-free nodes admitted together and both `RUNNING`; the chain's next link admitted only after its dependency `SUCCEEDED`; a failed dependency yields `DEPENDENCY_FAILED`) |
| Two writers to the same protected file/scope cannot run unsafely at once | `two writers cannot hold the same protected scope at once, and conflicts are reported not merged` (`WRITE_CONFLICT`, `auto_merged: false`, the node deferred not failed, disjoint scope unaffected) |
| Resource pressure scales down/pauses new work without falsely failing completed work | `resource pressure scales workers down and pauses new work without failing completed work` (`paused: true`, `worker_target: 0`, `completed_work_failed_by_pressure: []`, completed node stays `SUCCEEDED`) |
| One-worker mode uses the same lifecycle/acceptance path | `one-worker serial mode uses the same lifecycle and acceptance path` (`run_mode: 'SERIAL'`, admission one at a time, the same `ACCEPTANCE_NOT_RUN` refusal and the same completion path) |
| Retry/reassignment cannot duplicate terminal result or external side effect | `bounded retry and reassignment never duplicate a terminal result or an external effect` (`DUPLICATE_TERMINAL_RESULT`, `TERMINAL_RESULT_IMMUTABLE`, `DUPLICATE_SIDE_EFFECT` with the completed effect remembered across a graph reload) |
| Scheduler uses ConnectorPort/capabilities rather than provider-name conditionals | `worker selection is capability and placement based with no provider-name branching` (`provider_name_branching: false`, `capability_based: true`, LOCAL_FIRST prefers but does not require the local device, an unauthenticated worker is ineligible) |
| Queue remains resumable after controlled restart | `a controlled restart keeps completed work and never resumes stale state as success` (completed preserved, running → `INTERRUPTED`, `resume_is_not_success: true`, explicit revalidation required) |
| DAG nodes with depends_on, write_scope and acceptance tests; run only dependency-satisfied work | tests 1, 2 and 4 (acceptance evidence required before success) |
| Isolated worktrees/file ownership/conflict ceilings; report conflicts rather than auto-merging | Test 2 (`write_conflicts_auto_merged: 0` in both the schedule result and the metrics) |
| Resource ceilings and adaptive worker counts with hysteresis | Test 3 (`scale_up_after_ticks`, `scales_down_immediately`, `relief_ticks`, `target_changed`) |
| Checkpoint/resume, stall/crash signals, bounded retry/reassignment, integration validation | Tests 5 and 7 (`checkpoint_ref` carried through dispatch and snapshot, `STALL`/`CRASH` signals, `ACCEPTANCE_NOT_RUN`) |
| Inspectable queue/task/worker metrics and evidence; no Shared Task Core override | Test 7 (`metrics().by_state`, `workers`, `blocked_reasons`, `owns_task_truth: false`, `overrides_task_core_authority: false`; `evidence()`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, GAI-003…008, RF-004…009 Corrections). This
was the task recorded as next in the previous round's report: it is the Engineering programme's largest
remaining substrate and the foundation EM-011/EM-012 (real connectors) and EM-013 (integration) need.

**D2 — Who decides the order?** CHOICE: the scheduler never invents an order; a node runs only when every
dependency has `SUCCEEDED`, independent nodes may run concurrently, and a failed or cancelled dependency
blocks its dependents as `DEPENDENCY_FAILED` rather than running them. Reason: the workbook asks for "DAG
nodes with depends_on … run only dependency-satisfied work" and "independent DAG nodes may run concurrently
while dependency/order constraints hold". The suite originally modelled a diamond wrong (a grandchild
depended on the root rather than the middle), which would have let a dependent run early — the test graph was
corrected to a real chain plus an independent node, which is a stronger check.

**D3 — Write-scope protection.** CHOICE: scopes overlap by equality or containment (so `scope:src/` protects
everything beneath it) and only nodes marked `exclusive_writes` participate; a conflict is reported with the
owning node and attempt, and the second node stays `READY` (deferred) rather than failing. Reason: "two
writers to the same protected file/scope cannot run unsafely at once" plus "report conflicts rather than
auto-merging unsafe overlaps". Deferring rather than failing is what makes the conflict survivable, and
`write_conflicts_auto_merged: 0` is published in both the schedule result and the metrics.

**D4 — Resource adaptation.** CHOICE: pressure at or above the threshold pauses new work and sets the
admitted worker count to zero; mid pressure halves the target; scaling back up requires
`scale_up_after_ticks` consecutive relief observations. Reason: "resource pressure scales down/pauses new work
without falsely failing completed work" and "adaptive worker counts with hysteresis". Reporting the admitted
count as 0 while paused is the honest expression of "admits nothing" (`paused: true` carries the reason), and
the empty `completed_work_failed_by_pressure` list is asserted rather than assumed.

**D5 — One-worker mode.** CHOICE: serial mode is the same code path with `max_workers: 1`; the same
acceptance requirement, the same dispatch/completion functions and the same states apply. Reason: "one-worker
serial mode uses the same lifecycle/acceptance path" is an acceptance bullet, and the only difference the
test observes is the admitted count — not a separate code path, which is what the bullet forbids.

**D6 — Worker selection.** CHOICE: capability + readiness + authentication + placement, resolved through the
injected port or the registered pool, with `LOCAL_FIRST` as a preference; nothing branches on a provider name,
and the result states `provider_name_branching: false`, `capability_based: true`. Reason: "scheduler uses
ConnectorPort/capabilities rather than provider-name conditionals" is an acceptance bullet, and RF/EM's
LOCAL_FIRST placement contract is a preference rather than a hard rule (a remote-only capability must still
be reachable).

**D7 — Acceptance evidence.** CHOICE: a node that declares acceptance tests cannot succeed without an
`acceptance_ref` (`ACCEPTANCE_NOT_RUN`), enforced before any terminal result is written. Reason: "integration
validation" is in scope and the honest failure mode is refusing the success, not recording an unvalidated one.
This applies identically in serial mode (D5).

**D8 — Retry/reassignment bounds.** CHOICE: a `STALL`/`CRASH` signal within the attempt budget returns the
node to `READY`; reassignment selects a capable worker and increments the attempt; exhausting the budget sets
`BLOCKED` with `REASSIGNMENT_EXHAUSTED`, `requires_attention: true` and `falsely_failed: false`; a terminal
result is immutable and a completed external effect is never repeated. Reason: "bounded retry/reassignment"
and "retry/reassignment cannot duplicate terminal result or external side effect". Three defects surfaced
here and were fixed: the node's declared `action_key` was discarded at graph load, `dispatch` then clobbered
it with `null`, and `completedEffects` was cleared on a graph reload (so the duplicate guard could be erased
by reloading). The effect memory now survives a reload and `dispatch` refuses a node whose effect already
completed.

**D9 — Graph reload.** CHOICE: a second `submitGraph` refuses with `GRAPH_ALREADY_LOADED` unless the caller
passes `replace: true`, and validation of the incoming graph happens first so a malformed graph is reported as
malformed rather than as a state conflict. Reason: silently discarding a loaded queue (and its effect memory)
is a data-loss hazard; making the reload explicit means it can only happen deliberately. Ordering validation
before the state check keeps error codes honest — a caller with a cyclic graph should not be told "a graph is
already loaded".

**D10 — Restart.** CHOICE: `snapshot`/`resumeFrom` preserves terminal nodes, marks previously `RUNNING` nodes
`INTERRUPTED` (not `FAILED`, not `SUCCEEDED`), and refuses to dispatch an interrupted node until
`revalidateInterrupted` accepts it. Reason: "queue remains resumable after controlled restart" plus the
programme-wide rule that stale local state cannot resume a side effect; `resume_is_not_success: true` and
`completed_work_failed_by_restart: []` are published. A defect found here: `dispatch` originally allowed an
interrupted node straight through, which is why `INTERRUPTED_REQUIRES_REVALIDATION` now exists as its own
refusal.

**D11 — Shared Task Core authority.** CHOICE: the scheduler carries `task_ref` and states `owns_task_truth:
false`, `overrides_task_core_authority: false` on the graph, the metrics and the evidence. Reason: the
workbook requires integration "without overriding Shared Task Core authority"; publishing the negatives makes
the boundary checkable at merge.

**D12 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/engineering-foreman-scheduler-v1/foreman.mjs` | new — DAG validation, scheduling, write scopes, worker pool, retry/reassignment, restart, metrics |
| `contracts/engineering-foreman-scheduler-v1/index.mjs` | new — public surface |
| `contracts/engineering-foreman-scheduler-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/engineering-foreman-scheduler.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Six failures on first run: **five genuine module defects** and several corrected expectations.

1. **Defect:** a node's declared `action_key` was dropped when the graph was loaded (`action_key: null` in the
   runtime node literal overwrote the declaration).
2. **Defect:** `dispatch` then set `node.action_key = action_key` unconditionally, so a caller that passed no
   key erased a declared one — the duplicate guard could never arm.
3. **Defect:** `completedEffects` was cleared on every graph load, so reloading a graph erased the memory of
   an already-applied external effect. It now survives reloads.
4. **Defect:** `dispatch` did not consult the completed-effect memory, so a new node with an existing action
   key could repeat the effect. It now refuses with `DUPLICATE_SIDE_EFFECT`.
5. **Defect:** `dispatch` allowed an `INTERRUPTED` node to run without revalidation. It now refuses with the
   new `INTERRUPTED_REQUIRES_REVALIDATION`.
6. **Hazard fixed by design:** a second `submitGraph` silently wiped the loaded queue. It now refuses with
   `GRAPH_ALREADY_LOADED` (validation runs first), which is also what made defect 3 observable.
7. **Expectations corrected:** the first DAG test modelled a diamond whose grandchild depended on the root
   (so it would not have caught early execution) and is now a real chain plus an independent node; a paused
   scheduler was expected to report `worker_target: 1` rather than the honest `0`; a frozen array was sorted
   in place; a test passed options as a second argument instead of inside the options object; and a metric
   expectation counted a node the scheduler had deliberately admitted but not dispatched.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36748073216 on 5209b94fc846337c19194c72ab38a6c22cc3295c | success |

## 5b. A note on the fix path

Several module edits in this task were applied through PowerShell string replacement and two of them
interpolated `${...}` inside template literals, corrupting two error messages (`graph  is already loaded`,
`he external effect for  already completed`). Both were detected immediately by `node --check` and repaired
with literal edits; the committed file is verified by the passing suite and by the syntax check. The lesson
recorded for future tasks in this pool: **use literal file edits for JavaScript containing template
literals**, never PowerShell string replacement.

## 6. Integration seams handed to sibling tasks

- **EM-002 / EM-004 / EM-006 (connector runtime, capability registry, placement):** worker/connector
  eligibility comes from capability + readiness + auth + placement through the port; the registry's instance
  health is the input, and this scheduler must not grow its own connector discovery.
- **EM-007 (remote subworker return control):** a remote subworker is a worker in this pool; its return
  control belongs there, while dependency ordering and write isolation belong here.
- **EM-008 / EM-009 (credentials/sessions, runtime recovery):** a node's connector needs a credential handle
  (EM-008) and the worker runtime is supervised by EM-009; a restart here should be driven by EM-009's
  recovery rather than a second restart notion.
- **EM-013 (shared task core + control surface):** `task_ref` and the `owns_task_truth: false` /
  `overrides_task_core_authority: false` statements are the boundary — the task core owns truth, this
  scheduler owns execution order.
- **BA-006 / BA-008 (task graph, leases):** an exclusive node should take a BA-008 lease on its worker before
  running, and BA-006's task version should gate the acceptance step.
- **GAI-004 / GAI-007 (consent/admission, device-aware execution):** an engineering node that calls a provider
  still passes the GAI admission gate; a device-switch proposal is a different mechanism from worker
  assignment and must not be substituted for it.
- **RF-008 / RF-009 (data plane, presence/reconnect):** remote dispatch of a node is a COMMAND, and a worker
  that goes unreachable is a presence fact rather than a node failure — an interrupted node is revalidated,
  not retried blindly.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a node that declares `exclusive_writes` without a `write_scope` (currently
   it can never conflict — likely a gap); two nodes with scopes `scope:src` and `scope:src2` (containment
   normalisation should treat them as disjoint — worth confirming); a reassignment for a node whose worker
   still holds a running slot (the slot is decremented on completion/signal only); `resumeFrom` with a
   snapshot whose dependency is terminal-failed (the dependents should be `BLOCKED`); and a `STALL` signal
   arriving after the node already completed.
2. Confirm D3 (a conflict defers rather than fails) and D8 (an exhausted node is `BLOCKED` for attention, not
   `FAILED`) as the intended readings.
3. Confirm the `exclusive_writes`-without-`write_scope` case in item 1: the most likely real gap, and the fix
   would be to require a write scope whenever exclusive writes are declared.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
