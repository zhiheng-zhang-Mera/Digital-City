# BA-006 Development Report — Authoritative Task Graph + Ownership/Executor Separation

```text
MISSION                  = BA-006 (Butler Assistant programme, task 6 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 7acc1f9 (Digital-City main, "claim(BA-006): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:50:54Z
CONTROL_REVISION_AT_CLAIM= f49b98f (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-006-shared-task-coordination
IMPLEMENTATION_HEAD_SHA  = 062795534d97c818d3cce37430d0cab6d185309c
BRANCH_CI                = 36732856266 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/assistant-task-graph-v1/` — `task-graph.mjs` (authoritative graph, roles, leases, projections,
published codes), `index.mjs`, 8-test suite, root `tests/assistant-task-graph.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Same assistant on two devices sees one authoritative task, not duplicated copies | `one authoritative task is shared by every embodiment — never duplicated per device` (two devices, equal `task_id`/`task_version`/`owner_ref`; a second `createTask` for the same id is refused `DUPLICATE_TASK`; a stale cached version is flagged `stale: true`) |
| Device or foreground-session shutdown does not orphan a global task | `device release suspends the lease, never orphans a task and never moves ownership` (`orphaned_tasks: []`, owner/executor/state unchanged, task count unchanged, device-scoped task retained) |
| Foreground switching leaves owner/coordinator/executor unchanged unless an explicit handoff/executor change is committed | `foreground switching never changes owner, coordinator or executor` (`tasks_touched: []`, `role_changes: []`, identical version) |
| Assistant handoff may update logical ownership/coordinator without restarting the executor | `ownership moves only through an explicit accepted handoff, and never restarts the executor` (`executor_restarted: false`, `authority_transferred: false`) |
| Executor change is explicit and cannot create two simultaneous valid executors | `an exclusive side effect can never have two simultaneous valid executors` (`EXECUTOR_ALREADY_BOUND` while a lease is live; take-over requires the exact lease and supersedes it with a new epoch; `concurrent_valid_executors: 1`) |
| Conflicting task updates use typed version/state checks and preserve a causal audit trail | `mutations are versioned and typed, and conflicting updates keep a causal audit trail` (`TASK_VERSION_CONFLICT` carrying `current_version`/`current_state`; refused update leaves no partial state; accepted changes append `{seq, kind, from_version, to_version, actor_ref, caused_by}`) |
| Roles are distinct and never conflated; task truth lives outside device sessions | `ownership is logical, execution is physical — sessions and devices are never the owner` (`SESSION_IS_NOT_OWNER`, `DEVICE_IS_NOT_OWNER`, `EXECUTOR_IS_NOT_A_DEVICE`, `SESSION_IS_NOT_EXECUTOR`) |

Architecture-contract mapping (the seven mandatory invariants of the workbook):

- **Invariant 1 (one identity, many embodiments):** projections are derived views of one graph; two devices
  are shown the same task, and a per-device copy is refused as `DUPLICATE_TASK`.
- **Invariant 2 (one authoritative state, many contextual projections):** `projectFor` is the only reading
  surface; it is `local_copy_is_cache: true`, revision-stamped, and reports `stale` against a cached version.
- **Invariant 3 (foreground binding is not ownership):** `bindForeground` mutates no task and reports
  `ownership_changed: false`, `executor_changed: false`, `tasks_touched: []`.
- **Invariant 4 (ownership is not execution):** owner and executor are separate fields with separate,
  explicit operations; an exclusive side effect requires a lease plus an action key.
- **Invariant 5 (handoff never transfers authority):** a handoff package carrying authority-shaped fields
  anywhere (recursive scan) is refused `HANDOFF_TRANSFERS_NO_AUTHORITY`, and the result states
  `authority_transferred: false`.
- **Invariant 6 (local state is a cache, not authority):** releasing a device suspends the live lease; the
  executor must `revalidateLease` before resuming, and a suspended lease refuses a result with
  `LEASE_SUSPENDED`.
- **Invariant 7 (knowledge is not disclosure authority):** not in BA-006's scope — audience scoping is
  BA-005's gateway; this task only carries `audience_scope` through a handoff as opaque data and makes no
  disclosure decision.

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan of all 41 workbooks: no owned repair, and **no eligible
Correction for Mech** (the only Alien-developed open task, EM-003, was corrected by Alien; Alien has since
claimed BA-004's Correction). Development tier therefore applied, and the tie-break rule ("prefer a
different programme from the host's previous claim" — Mech's previous claim was RF-004, Remote Fabric)
pointed away from RF-005. Among BA/GAI/EM, BA-006 was chosen because the authoritative task graph is the
substrate BA-008 (embodiment event bus, execution lease, reconnect safety) and the two cross-programme
integration tasks (EM-013 shared task core, GAI-009 Ask/Do surface) both build on: claiming it first means
those tasks consume one settled task-truth contract instead of each inventing one.

**D2 — Does the graph own state, or is it a pure reducer?** OPTIONS: (a) pure functions over caller-held
state; (b) an authoritative store with an injected clock and injected persistence. CHOICE: (b), with the
clock injected (`createTaskGraph({ now })`) and no ambient state, following the module shape already used by
BA-004/BA-005. Reason: "task truth outside device sessions" is the point of the task, and a store that can
be instantiated twice with provably independent state (asserted in the suite) is the honest way to show that
task truth is not a device-local variable. Persistence stays a seam (D7).

**D3 — May a device or session own a task?** CHOICE: no, enforced by typed refusal at creation — a
`session:`/`foreground:`/`ui:`-shaped owner is `SESSION_IS_NOT_OWNER`, a device-shaped owner is
`DEVICE_IS_NOT_OWNER`, and an owner must be a logical `assistant:<id>`. Reason: the workbook's out-of-scope
list forbids "assuming the device showing a task is its owner". An executor, by contrast, must be
*device-shaped* (`EXECUTOR_IS_NOT_A_DEVICE` otherwise), because execution is physical. This is the
sharpest expression of "ownership is not execution" available in a type check.

**D4 — How is ownership transferred?** CHOICE: only by `transferOwnership`, which requires an *accepted*
BA-004 handoff naming this exact task at this exact version, sent by the authoritative owner, carrying no
authority fields, and addressed to a logical assistant identity. Reason: the workbook requires "explicit
ownership transfer using BA-004 rather than rewriting ownership on foreground switch". Every weaker input
gets a distinct code (`HANDOFF_NOT_ACCEPTED`, `CONSULTATION_TRANSFERS_NOTHING`, `HANDOFF_TASK_MISMATCH`,
`HANDOFF_STALE_VERSION`, `HANDOFF_TRANSFERS_NO_AUTHORITY`), so a caller can never mistake "sent something"
for "transferred ownership". Because BA-004 lives on a different component branch, the handoff is consumed
as a validated data package and the shared-shape seam is recorded in §5 rather than importing that branch's
module.

**D5 — Is `expected_version` optional?** CHOICE: no. Every mutation requires it, and a missing or stale one
is `TASK_VERSION_CONFLICT` carrying `current_version` and `current_state`. Reason: the workbook forbids
last-writer-wins for destructive updates; making the version mandatory means there is no code path that can
silently overwrite concurrent truth. Generic patches additionally refuse ownership/executor/lease/action-key
fields with `EXPLICIT_OPERATION_REQUIRED`, so state can never be rewritten through the back door.

**D6 — How is "two simultaneous valid executors" prevented?** CHOICE: a single live lease per task for
exclusive side effects. A second executor is refused `EXECUTOR_ALREADY_BOUND` while a lease is live; moving
execution requires an explicit take-over naming the *exact* current lease, which supersedes it and bumps
`lease_epoch`; only the current lease-holder can submit a result, and a consumed action key refuses a repeat
(`DUPLICATE_ACTION_KEY`). Reason: leases plus idempotency keys are the mechanism the workbook names for
"externally visible or state-changing side effects", and the epoch makes a superseded worker's late result a
typed refusal instead of a duplicate side effect. The alternative (allow two executors and reconcile later)
would make duplicate side effects possible, which is exactly what the task exists to prevent.

**D7 — Where do terminal states for exclusive work come from?** CHOICE: `updateTask` refuses to write a
terminal state for a task that has an assigned executor and an exclusive side effect
(`EXPLICIT_OPERATION_REQUIRED`), so completion must come through `submitExecutorResult`. Reason: otherwise a
coordinator could mark work SUCCEEDED while the leased executor is still running, creating a false success.

**D8 — DEVICE scope and shutdown.** CHOICE: scope decides *visibility* (GLOBAL everywhere; DEVICE only on
that device; ASSISTANT/WORKSPACE through the device's foreground binding), never ownership. Releasing a
device removes the binding, retains device-scoped tasks and suspends the live lease. Reason: the workbook
wants "device-scoped task references without making UI session the task owner" *and* "device shutdown does
not orphan a global task"; keeping scope and ownership orthogonal satisfies both, and suspending the lease
(invariant 6) is the honest way to say "this executor must revalidate before touching anything".

**D9 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/assistant-task-graph-v1/task-graph.mjs` | new — graph, roles, leases, projections, codes |
| `contracts/assistant-task-graph-v1/index.mjs` | new — public surface |
| `contracts/assistant-task-graph-v1/tests/conformance.test.mjs` | new — 8 conformance tests |
| `tests/assistant-task-graph.test.mjs` | new — root runner entry (106 → 109 tests) |

No City/Core file, no manifest and no doc was changed by this branch, so the merge stays additive.

## 4. Test summary, failures and fixes

8 tests. Every test name, assertion and expectation was written before running; the module then failed three
expectations, and in each case the **module was right** and the expectation was wrong:

1. `an unbound device sees no scoped projection` — actually a GLOBAL task is readable from every embodiment
   (`projection_count: 1`, `foreground_assistant_ref: null`). Corrected to assert global readability, and
   the device-scope isolation assertion was kept where it is genuinely true (a DEVICE-scoped task is not
   projected onto another device).
2. The superseded executor's late result was expected to be `STALE_LEASE` but is reported
   `NOT_THE_EXECUTOR`, because a take-over replaced `executor_ref`. Corrected, and a genuine `STALE_LEASE`
   case was added instead (the current executor submitting an older lease epoch) so both refusals are
   covered rather than one being hidden.
3. `the released device keeps no live binding` conflated *binding* with *scope visibility*: after release
   the device still sees the GLOBAL task and its own device-scoped task, but has
   `foreground_assistant_ref: null`. Corrected to assert exactly that distinction.

One genuine implementation defect was found and fixed before CI: `task_version` was initialised to `1` and
then incremented by the creation audit entry, so every first mutation conflicted with version `2`/`NaN`.
Fixed by starting at `0` so `TASK_CREATED` establishes version 1, which is also the honest reading of the
audit trail (`from_version: 0 → to_version: 1`).

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 109 tests, 109 pass, 0 fail (101 baseline + 8 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36732856266 on 062795534d97c818d3cce37430d0cab6d185309c | success |

## 6. Integration seams handed to sibling tasks

- **BA-004 (handoff):** `transferOwnership` consumes a handoff package whose accepted shape is BA-004's.
  At merge the two packages should share one validator so a handoff accepted by BA-004 is the same one
  BA-006 requires; today BA-006 re-validates the subset it depends on (kind, state, task ref/version,
  sender == owner, recipient shape, recursive authority-field scan).
- **BA-003 (embodiment binding):** `bindForeground`/`releaseDevice` model only what the graph needs from a
  device binding (device → foreground assistant + workspace refs). BA-003 owns the durable binding lifecycle;
  this module's binding table should be replaced by a projection of it.
- **BA-008 (embodiment event bus, execution lease, reconnect safety):** the lease model here
  (`lease_ref`, `lease_epoch`, `suspended`, `superseded_lease_refs`, `revalidateLease`) is the graph-side
  half of BA-008's reconnect safety. BA-008 should drive `revalidateLease` from its own reconnect
  detection rather than inventing a second lease notion.
- **BA-007 (settings/interaction surface):** `projectFor` is the read surface a UI should render; the
  `role_of_device` field tells a device whether it is EXECUTOR/WATCHER/REQUESTER/OBSERVER without letting
  it infer ownership from what it displays.
- **GAI-004 / GAI-006 (budget, consent, cancelled runs):** cancellation must arrive as a versioned
  `updateTask` by the owner or as `submitExecutorResult` by the leased executor — never as a device-local
  flag.
- **EM-013 (shared task core + Utopia control surface):** this graph is the contract that task core should
  implement; the `task_id`/`task_version`/`causal_log` triple is the minimum it must persist durably.
  Persistence, restart recovery and multi-writer conflict resolution beyond the in-process version check
  remain EM-013's problem and are deliberately not solved here.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a handoff whose `to`/`from` are nested inside arrays or extra keys to slip
   an authority field past the scan; a take-over from the same executor to keep two leases alive; a
   `releaseDevice` followed by a replay of the *pre-suspension* result; and `projectFor` with a
   `cached_version` used as a freshness oracle.
2. Confirm D4 (the exact validated subset of BA-004's handoff) as the intended seam, and D7 (terminal
   states for leased exclusive work only via `submitExecutorResult`).
3. Confirm that DEVICE scope retaining tasks after device release (D8) is the intended reading, rather than
   those tasks being cancelled.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
