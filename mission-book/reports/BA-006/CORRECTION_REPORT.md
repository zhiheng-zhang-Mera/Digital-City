# BA-006 Correction Report — Authoritative Task Graph + Ownership/Executor Separation

```text
MISSION              = BA-006 (Butler Assistant programme, task 6 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION (PARTIAL — see §5)
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-006-shared-task-coordination.md
CLAIM_COMMIT         = b7ab22d (Digital-City main, claim of BA-006 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:47:40Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 062795534d97c818d3cce37430d0cab6d185309c
DEVELOPMENT_CI       = 36732856266-success
CORRECTION_BRANCH    = assistant/BA-006-shared-task-coordination
CORRECTION_HEAD_SHA  = a82b152726d885556c76480fe3ea125b2bf1f4ed
BRANCH_CI            = 36803134421-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-006 12 pass (8 author + 4 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = false — material findings from the independent review remain (see §5)
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

## 5. MATERIAL FINDINGS FROM THE INDEPENDENT REVIEW — STILL OPEN (the reason this task is not complete)

The independent adversarial review of the frozen Development head returned after the first repair pass and
pushed head `a82b152`. It confirmed the six mechanisms repaired in §3 and reported six further material
mechanisms, each reproduced with a runnable probe under `probes/` (`p1`–`p7`) and **not** caught by the
author's 8-test suite. They are recorded here rather than repaired, because the session's context budget ran
out; they must be repaired and re-verified before this Correction is marked complete.

| id | Mechanism (reviewer probe) | Why it matters |
| --- | --- | --- |
| **D2** | A **suspended** lease is still treated as live, so a released executor can re-issue its own lease through `changeExecutor` and then submit a result — `LEASE_SUSPENDED` gates only `submitExecutorResult`. The lease revalidation path (`revalidateLease`) is bypassable and `LEASE_REVALIDATED` is never logged | invariant 6 (revalidate a lease before resuming after reconnect) |
| **D7** | An **EXCLUSIVE** side effect can be created directly in a terminal state, and the guarded-path refusal is gated on `executor_ref` being truthy rather than on `side_effect` — so a task with no lease and no action key can be reported SUCCEEDED | invariant 4 (every side effect needs a lease + idempotency key); false success |
| **D4** | `bindForeground` and `releaseDevice` mutate foreground state **before** validating `at`, so a refused call still rebinds or releases the device | typed/audited operations; foreground binding is the module's whole effect |
| **D10** | `releaseDevice` audits a `LEASE_SUSPENDED_BY_DEVICE_RELEASE` entry into **completed** tasks, changing a terminal task's version and causal log | terminal truth must be immutable |
| **D3b** | `handoff.checkpoint_ref` is ingested with no type rule, so a cyclic value permanently poisons every projection with an untyped `RangeError` after the owner and version were already written | §3 fixed the freezer and the authority scan; this ingest path is still open |
| **D11** | `bindForeground` accepts an unvalidated `workspace_refs`, so a non-array value makes every projection read throw `TypeError` (and a string silently becomes substring membership) | projections must be exposable to every embodiment |

Also recorded from the review, lower materiality: `LEASE_REQUIRED` is declared and never thrown; a handoff
with `from` omitted is accepted and the causal log then names the previous owner as the actor; replaying a
handoff with the same `handoff_id` duplicates `OWNERSHIP_TRANSFERRED`; `authority_transferred: false` is a
constant (structurally true once the scan refuses authority fields).

Contract questions the review raised and the workbook does not settle: who authenticates `actor_ref`/role
(the module has no principal concept — a stranger's `actor_ref` can mutate as OWNER or supersede the
executor); `side_effect` defaults to `NONE`, so the action-key requirement is opt-out and depends on the
caller classifying its own task; a projection's `stale` flag is computed from the caller's own
`cached_version`, so a device can always report itself fresh; ASSISTANT/WORKSPACE visibility is entirely
self-declared at `bindForeground`, with no owner binding.

Certificate of the repaired part: head `a82b152`, hosted CI run 36803134421, and the 12-test suite
(8 author + 4 Alien) with 4 of the Alien regressions failing on the Development head.
