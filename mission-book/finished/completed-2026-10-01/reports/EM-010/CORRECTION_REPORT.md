# EM-010 Correction Report — Foreman Queue / DAG / Resource Scheduling / Worker Pool

```text
MISSION              = EM-010 (Engineering Manager programme, task 10 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-010-foreman-scheduler-dag-worker-pool.md
CLAIM_COMMIT         = 6a599a0 (Digital-City main, claim of EM-010 Correction by Alien)
CLAIMED_AT           = 2026-10-01T03:14:24Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 5209b94fc846337c19194c72ab38a6c22cc3295c
DEVELOPMENT_CI       = 36748073216-success
CORRECTION_BRANCH    = engineering-manager/EM-010-foreman-scheduler-dag-worker-pool
CORRECTION_HEAD_SHA  = 2ab350d0e6924b89765e54ab50e498a87307cb86
BRANCH_CI            = 36810665718-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-010 21 pass (7 author + 14 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   5209b94 (Mech)   run 36748073216   success
first-pass head    84340e4 (Alien)  run 36810161287   success   ← superseded by the review in §4
corrected head     2ab350d (Alien)  run 36810665718   gateway-web success / android success
```

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\EM-010\frozen-5209b94\`)
and all four branch blobs were verified against their Git objects before any review started:

```text
contracts/engineering-foreman-scheduler-v1/foreman.mjs                MATCH 44d3fcc8a18d6695797c9c45b195d23e180e914b
contracts/engineering-foreman-scheduler-v1/index.mjs                  MATCH 27d98bda64f86e03f39e796149179e2f7978b8a5
contracts/engineering-foreman-scheduler-v1/tests/conformance.test.mjs MATCH f555fbde9a0c22f2d02cb72aaa2f4a98e662a1c2
tests/engineering-foreman-scheduler.test.mjs                          MATCH dd1c6d1ae279496ace7f0431f95014b0dd96a39b
```

An independent adversarial reviewer was pointed only at that frozen export, told to read the workbook first
and briefed on the properties that matter here (dependency satisfaction, one writer per scope, resource
pressure that never falsely fails completed work, one-worker mode on the same path, no duplicated terminal
result or side effect, capability-based selection, a queue that survives a restart). It returned 19 probes and
`probes/FINDINGS.md` with 17 material mechanisms (`MATERIAL_DEFECTS_FOUND`, high confidence; module SHA-256
verified unchanged across every probe run). My own review ran in parallel; the two sets were merged by
mechanism, and every repair has a regression that fails on the Development head.

Twelve of the reviewer's mechanisms overlapped with my own pass. The six that did **not** are the second pass
in §4: the leaked worker slot on handover, cancel not being binding, a silently-decided `depends_on`, the
completed-effect memory lost across a restart, invisible starvation, and untyped clone errors from
unrepresentable declarations. The reviewer also independently corroborated the correct behaviour it found
(see §6 coverage), which is worth as much as the defects.

## 3. First pass — 11 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **A terminal result could be overwritten.** `completeAttempt` guarded only "SUCCEEDED after SUCCEEDED", so a late `FAILED` report set a `SUCCEEDED` node to `FAILED` (completed work falsely failed, which falsified `completed_work_falsely_failed: []`), and a late `SUCCEEDED` could move a `FAILED`/`CANCELLED` node back to `SUCCEEDED` | 5, 10 | a terminal node is immutable (`TERMINAL_RESULT_IMMUTABLE`), keeping the duplicate-result check and its own code first | yes |
| 2 | **A superseded attempt was still authority**: `completeAttempt` never compared the attempt with `node.attempt_ref` | 4 | only the node's current attempt may complete it (`INVALID_TRANSITION`) | yes (with #1) |
| 3 | **A stall or crash report re-opened completed work**: `reportSignal` on a `SUCCEEDED` node set it back to `READY` (and stole a live worker slot) | 5, 10 | a terminal node refuses a stall/crash signal | yes |
| 4 | **The retry budget was bypassable**: `schedule()` re-admitted a node blocked with `REASSIGNMENT_EXHAUSTED` and `dispatch` never checked the budget, so alternating schedule/dispatch ran attempt `max_attempts + 1` and beyond | 3, 10 | `schedule` keeps an exhausted node blocked; `dispatch` refuses when the budget is spent | yes |
| 5 | **One node could hold two concurrent attempts**: `dispatch` accepted a node already `RUNNING` | 4, 5 | a second dispatch of a running node is refused (`INVALID_TRANSITION`) | yes |
| 6 | **A named worker bypassed every selection rule**: supplying `worker_ref` skipped capability, readiness and capacity and could name an unregistered worker while still reporting `capability_based_selection: true` | 2, 4, 8 | a named worker passes the same capability/readiness/capacity rule as a selected one | yes |
| 7 | **The worker ceiling was not a ceiling**: `max_concurrent` unvalidated (NaN/0/negative) and re-registering a busy worker reset its `running` counter to 0 (oversubscription) | 3, 8 | `max_concurrent` must be a positive integer and a busy worker cannot be re-registered | yes |
| 8 | **The foreman policy was merged, not validated**: `max_workers: NaN/Infinity` made capacity `NaN`/infinite (schedule admitted everything), `pressure_pause_threshold: NaN/>1` disabled the pause, `scale_up_after_ticks: NaN` disabled the hysteresis, `min_workers > max_workers` inverted the ceiling, policy `max_attempts: NaN` allowed unbounded retries | 3 | every policy bound is validated (positive integer ceilings and their order, scale-up ticks, attempt budget, pause threshold in (0,1], placement, known keys) | yes |
| 9 | **A node declaration was trusted where it was used**: `exclusive_writes: 'true'` silently made a node *non*-exclusive, a non-text `action_key` dropped the duplicate-effect guard, `write_scope`/`capability_required`/`job_ref` accepted any type, `max_attempts` accepted 0, the allow-list used `Object.keys` (a hidden own field rode along) and any non-array object was accepted as a node | 1, 2, 11 | every declared node field is validated, the allow-list is decided by own keys, and a node must be a plain object | yes |
| 10 | **A refused resume wiped the live queue**: `resumeFrom` cleared nodes/attempts and then iterated, so a malformed entry threw an untyped `TypeError` after the queue was gone | 5, 9 | the whole snapshot is validated before anything is cleared | yes |
| 11 | **The freezer was not cycle-safe**: a self-referential snapshot entry overflowed the stack when projected | 9 | `freeze` walks with a `WeakSet` | yes (same test as #10) |

Instants: `isIsoInstant` was shape-only, the clock was validated by shape, and every caller `at` was recorded
verbatim; the helper, the clock and all twelve call sites now require a real instant. Regression: the
"uninterpretable instant" test.

## 4. Second pass — the independent review's non-overlapping findings

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 12 | **Reassignment leaked the worker slot it abandoned**: the superseded attempt stayed `RUNNING` and the worker's `running` count was never decremented, so each handover permanently consumed capacity and a one-worker pool wedged; the node's state was also mutated before the successor selection could fail | 5, 8 | the abandoned attempt is closed (`REASSIGNED`) and releases its slot, the successor is selected first, and if no successor can take the work the handover is rolled back and refused | yes |
| 13 | **Cancel was not binding**: cancelling a `RUNNING` node released neither its attempt nor its slot, so the cancelled node kept an attempt it no longer owned and the pool stayed short | 5, 10 | cancelling closes the live attempt (`INTERRUPTED`), releases the slot, and clears the node's worker reference | yes |
| 14 | **An unreadable dependency list was silently read as "no dependencies"**: `depends_on: 'upstream'` (a string) or a `Set` became `[]`, so the dependent was `READY` at submit time and ran before its upstream | 2, 10 | a `depends_on` that is not a list is refused as `INVALID_GRAPH` | yes |
| 15 | **The completed-effect memory did not survive a restart**: `snapshot()` omitted `completedEffects` and `resumeFrom` never restored it, so a controlled restart lost the duplicate-side-effect guard and re-executed an applied external effect | 10, 11 | the snapshot carries the effect memory and a resume merges it (effects outlive one graph), validated before anything is cleared | yes |
| 16 | **Invisible starvation**: `schedule()` filtered dependency-ready nodes that no worker could staff out of `runnable` while never adding them to `blocked`, so an unstaffable node vanished from both lists and `metrics().blocked_reasons` was empty | 8, 10 | `schedule()` reports them in `unstaffable` with their required capability | yes |
| 17 | **Unrepresentable declarations surfaced as untyped errors**: a function inside `acceptance` or a symbol `job_ref` reached `structuredClone` and threw `DataCloneError` (and could leave a node record permanently unreadable) instead of the declared refusal | 9 | every declared node field is type-checked at submit time, so the refusal is typed and the record stays readable | yes |

## 5. Local test summary

```text
corrected module                    21 tests / 21 pass / 0 fail
development head 5209b94            21 tests /  7 pass / 14 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-010\`: `frozen-5209b94/` (byte-verified export),
`prefix-test.log` (the corrected suite against the Development head), `gate-EM-010.log`,
`patch-foreman.mjs` and `patch-foreman-2.mjs` (the anchor-guarded repair passes — each aborts before writing on
any anchor mismatch), plus the independent review's `probes/FINDINGS.md`, 19 probes and run logs.

## 6. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **An `exclusive_writes: true` node with no `write_scope` conflicts with nobody, and a node that declares a scope without `exclusive_writes` is not serialised** (reviewer #8) | The workbook serialises writers to *the same protected file/scope*; a node that declares no scope has declared no protected resource, and the author's own model is opt-in per node. The reviewer recorded this as the author's open item. What was repaired is the silent-downgrade half: a truthy non-boolean `exclusive_writes` or a non-text `write_scope` is now a typed refusal instead of quietly meaning "not exclusive". A default-exclusive policy would be a workbook decision, not a Correction. |
| **`max_workers` bounds the scheduler's capacity, not a direct `dispatch`** (reviewer #7) | `schedule()`/`effectiveWorkers()` enforce the ceiling for the queue path; `dispatch` is an explicit admission call for one node, and its own guards are dependency, terminal, budget, conflict, capability and capacity-of-the-worker. The reviewer marked this author-encoded. |
| **Write-scope overlap is string-prefix based** | A scope is a declared string (`kind:path`); `..`, case and symlinks are not normalised, and the module does not claim to. Two scopes that overlap only after filesystem resolution are an execution-plane property. |
| **`scale_down_immediately` is validated but only echoed in the response** | Scale-down under pressure is unconditional here, so the flag is a fixed policy statement rather than an input. It is validated so it cannot be a `NaN`/truthy hole; a caller must not be able to disable immediate scale-down. |
| **`completed_work_falsely_failed: []` / `completed_work_failed_by_pressure: []` are literals in `metrics()`/`observeResources()`** | They are true by construction *after* repairs #1/#3: before them a late failure could mark completed work failed. The literals are now backed by a mechanism. |
| **Dead vocabulary**: `NO_WORKER_AVAILABLE` and `ACCEPTANCE_EVIDENCE_REQUIRED` are declared but never thrown, and the `PENDING` node state is never used | Coverage evidence: the conditions are refused with other declared codes and states. No reachable behavioural consequence. |

## 7. Coverage the reviewer found clean (kept as evidence)

The DAG core held: unknown, self, two-node and three-node cycles are refused with distinct codes; a merely
*started* dependency never counts as done; `FAILED`/`CANCELLED` dependencies block rather than satisfy; a
5 000-node chain does not overflow; admission order is declaration order. Refusals were also clean: dependency,
pause, write-conflict, terminal and `GRAPH_ALREADY_LOADED` refusals leave state untouched;
`ACCEPTANCE_NOT_RUN` leaves the attempt running with its slot held and then succeeds once evidence arrives; a
caller re-keying a node's `action_key` is refused. Two of the reviewer's nineteen probes found no defect at all.

## 8. Disclosure

- While applying the first pass I edited the module through a PowerShell string round trip, which rewrote the
  file's encoding and made it unreadable as UTF-8. The pristine bytes were restored (`git checkout --`) and the
  whole pass was re-applied through anchor-guarded Node scripts that assert every anchor matches exactly once
  and write only after all of them do. The scripts also aborted cleanly twice on their own guards (an instant
  site count of 12 rather than 11, and an anchor count mismatch), which is what the guards exist for. No
  result changed, and the failure is recorded rather than hidden.
- The reviewer observed the frozen *test* file grow while it was running (I appended the Alien regressions to
  the worktree copy, which the frozen export mirrors for pre-fix runs). The module bytes it judged were
  unchanged and hash-verified throughout.
- Two of my own regression assertions were wrong the first time and were fixed in the tests, not the module: a
  `completeAttempt` after a resume (the resume deliberately drops attempt references), and a graph reload after
  `resumeFrom` (which restores the graph, so the reload needs `replace: true`).
- Dependency installation is part of the gate procedure in a fresh Correction worktree
  (`pnpm install --frozen-lockfile` at the root and under `city/`). No billing refusal was recorded as a code
  failure; every hosted run in this task that started executed real steps.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
