# BA-006 Correction Report — Authoritative Task Graph + Ownership/Executor Separation

```text
MISSION              = BA-006 (Butler Assistant programme, task 6 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-006-shared-task-coordination.md
CLAIM_COMMIT         = b7ab22d (Digital-City main, claim of BA-006 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:47:40Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 062795534d97c818d3cce37430d0cab6d185309c
DEVELOPMENT_CI       = 36732856266-success
CORRECTION_BRANCH    = assistant/BA-006-shared-task-coordination
CORRECTION_HEAD_SHA  = bf6c6485ff76d18cf2b0f2f0e4ba59cdea5a3730
BRANCH_CI            = 36803893254-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-006 16 pass (8 author + 8 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   0627955 (Mech)   run 36732856266   success 2026-09-30T14:55:58Z
corrected head     a82b152 (Alien)  run 36803134421   success
```

The corrected head executed its real workflow steps on GitHub-hosted runners, and 4 of the 12 tests in the
suite fail on the Development head.

## 2. Independent review method

The Development head was exported with `git archive` and all four task blobs were verified against their Git
objects (`D:\A-Utopia\.runtime\evidence\mission-book\BA-006\frozen-0627955\`). An independent adversarial
reviewer was pointed only at that frozen export and told to read the workbook first; its probe run was still
in flight when this Correction was closed, so the defects below are the ones my own review and probes
established. **Any additional finding it returns must be treated as the next action for this task** (see
§5) — the workbook is only marked complete for the mechanisms actually repaired and verified here.

## 3. Defects found and repaired

| # | Mechanism | Root cause | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **The canonical allow-list used prototype-chain membership.** `toString`, `constructor`, `valueOf` and `__proto__` passed the "not part of the canonical contract" guard (the smuggled key is then dropped by the field-by-field record builder, so this is a contract/validation bypass rather than state corruption) | `if (!(key in spec))` | `Object.hasOwn(spec, key)` over `Reflect.ownKeys`, plus a plain-prototype requirement for canonical records | yes |
| 2 | **The handoff authority scan could be evaded with a non-enumerable own property.** `findAuthorityFields` walked `Object.entries`, so `Object.defineProperty(handoff, 'grants', {enumerable: false})` was invisible and a handoff carrying authority still satisfied `HANDOFF_TRANSFERS_NO_AUTHORITY` — the check whose entire purpose is that ownership moves without authority | enumerable-only walk | the scan uses `Reflect.ownKeys` (a symbol key is itself reported) | yes |
| 3 | **The same scan crashed on a cyclic handoff** with an untyped `RangeError: Maximum call stack size exceeded`, so a self-referential package could not be classified at all | recursion with no visited set | a shared visited set; a structural cycle is not authority | yes |
| 4 | **The shared freezer recursed with no visited set**, so any cyclic caller value reaching a projection would crash the module | recursion with no visited set | the freezer tracks visited objects | (defence in depth) |
| 5 | **Instants were validated by shape only.** `2026-13-45T99:99:99Z` and `2026-02-30T00:00:00Z` passed `isIsoInstant` and were stored as `created_at`/`updated_at`, so the audit trail and version ordering could carry impossible timestamps | regex-only check | the clock and every caller instant must survive a component round trip | yes |
| 6 | **A refused patch left a partial write.** `updateTask` applied `state` and `checkpoint_ref` and only then validated `watchers`, so a patch containing a session-shaped watcher threw `SESSION_IS_NOT_OWNER` **after** the state had changed — leaving a task whose state says RUNNING while its version and causal log say PENDING | validation interleaved with mutation | the whole patch is validated first, then applied | yes |

## 4. Local test summary

```text
corrected module  12 tests / 12 pass / 0 fail
development head  12 tests /  8 pass / 4 fail   ← the Alien regressions are the difference
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

Evidence under `D:\A-Utopia\.runtime\evidence\mission-book\BA-006\`: `frozen-0627955/` (byte-verified
export), `pre-fix-check/` (the corrected suite against the unfixed module — 4 failures),
`patch-task-graph.mjs` (the anchor-guarded repair pass), `author-after-patch.log`, `prefix-test.log`,
`postfix-test.log`, `gate-*.log`, `ci-*.log`.

## 5. Second pass — the independent review's findings, and the remaining boundaries

The independent adversarial review of the frozen Development head returned after the first pass and reported
twelve mechanisms against the author's 8-test suite (which catches none of them). Six were already repaired in
§3; the other six were repaired in a second pass, each with a regression that fails on the Development head:

| id | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 7 | **A released executor could resume a side effect on its own authority.** A *suspended* lease was still treated as "live", and the take-over branch only ran for a *different* device, so the released executor could re-issue its own lease through `changeExecutor` and then submit a result — the `revalidateLease` path was bypassable and `LEASE_REVALIDATED` was never required | `live = lease && !lease.superseded` ignored `suspended`; `LEASE_SUSPENDED` gated only `submitExecutorResult` | a suspended lease is not live: `changeExecutor` refuses it (`LEASE_SUSPENDED`) until `revalidateLease` succeeds |
| 8 | **An EXCLUSIVE side effect could be reported complete with no lease and no action key.** A task could be created directly in a terminal state, and the guarded-path refusal in `updateTask` was gated on `executor_ref` being truthy, so an exclusive task that never had an executor was completed by a plain owner patch | the guard read the executor instead of the side effect | an exclusive task cannot be created terminal, and every terminal transition for an exclusive side effect must come through `submitExecutorResult` |
| 9 | **`bindForeground` and `releaseDevice` changed state before validating `at`**, so a refused call still rebound or released the device | mutation before validation | the instant is validated first in both ports |
| 10 | **A device release rewrote settled tasks**: `releaseDevice` audited a `LEASE_SUSPENDED_BY_DEVICE_RELEASE` entry into completed tasks, changing a terminal task's version and causal log | no terminal guard in the release sweep | terminal tasks are skipped |
| 11 | **`handoff.checkpoint_ref` was ingested with no type rule**, so a cyclic value permanently poisoned every projection with an untyped `RangeError` — after the owner and version had already been written | an unvalidated reference copied into the record | the checkpoint is validated as text **before** ownership moves |
| 12 | **`workspace_refs` was stored unvalidated**, so a non-array value made every projection read throw `TypeError`, and a string silently became substring membership | no type rule | the workspace set must be an array of nonempty text |

### Recorded boundaries and contract questions (not repaired, with reasons)

1. **`LEASE_REQUIRED` is declared in `TASK_GRAPH_CODES` and never thrown** (every other code has a throw site);
   execution without a lease is reported through `STALE_LEASE`/`NOT_THE_EXECUTOR` instead of being renamed.
2. **`revalidateLease` passes the record's own version to `assertMutable`**, so its concurrency check is
   vacuous. Every other mutation requires the caller to name `expected_version`; the author's signature for
   this port does not take one, so requiring it is a contract change.
3. **Mutation authority is caller-asserted.** `updateTask` accepts role `OWNER` with any non-empty
   `actor_ref` and never compares it to `record.owner_ref`; `changeExecutor` likewise. The module is a pure
   library with no principal concept, and the workbook does not say who authenticates the actor, so this is a
   contract question rather than a repair.
4. **`side_effect` is a caller declaration defaulting to `NONE`**, so the action-key/idempotency requirement
   is opt-out: the caller classifies its own task. The workbook does not settle who classifies it.
5. **A projection's `stale` flag is computed from the caller's own `cached_version`**, so a device can always
   report itself fresh; nothing in the graph can verify a device's cache.
6. **ASSISTANT/WORKSPACE visibility is self-declared at `bindForeground`**, with no owner binding, and a
   handoff may omit `from`, in which case the causal log names the previous owner as the actor (an audit
   attribution the workbook does not settle). A replayed `handoff_id` also duplicates
   `OWNERSHIP_TRANSFERRED`; `authority_transferred: false` is a constant that is structurally true once the
   authority scan refuses any authority-bearing package.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
