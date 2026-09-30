# Verification Report — MB-008

```text
MISSION = MB-008
ROLE = VERIFICATION
HOST = Mech
MIGRATION_HOST = Alien
IMPLEMENTATION_BRANCH = mission/MB-008-computer-use
IMPLEMENTATION_CI = 36584056291 PASS (migration head aa2a6a8) ; 36655586918 PASS (reconciled head 77b774c)
FINAL_BRANCH_CI = 36662962981 PASS (runtime-evidence head 0e1d97e) ; episode head CI recorded in §5
FINAL_BRANCH_SHA = PENDING — filled at closeout (see §5)
MERGED_MAIN_SHA = PENDING — filled at closeout (see §5)
VERIFICATION_COMPLETE = true
```

Mission: [MB-008 — Computer Use](../../MB-008-computer-use.md) ·
Migration report: [MIGRATION_REPORT.md](./MIGRATION_REPORT.md)

---

## 1. 独立审查 / Independent review

> 本节按规则 9 在阅读 Migration Report **之前** 写下，内容取自 Git 历史、分支 diff 与第一次门禁运行；
> 它的逐条结论以 `VERIFIER_FINDING` `MB-008:67f53cc8da24edda` 的形式先行记录在 evolution inbox 中。

- **Code/diff findings.** The branch was 48 commits behind `main` and touches the shared control
  plane (`city/manifest.mjs`, `city/tests/manifest.test.cjs`, `services/capability-bridge/registry.mjs`,
  the census). Per `README.md` §6 the latest `main` was merged **first**, before any gate ran, and
  the merge was committed (`77b774c`) because `verify-promotion-history.mjs` tests `HEAD`.
  Three conflicts were resolved as **union or superset**, none weakening a mechanism:
  the registry kept `main`'s version (it already carries **both** the building-aware kind filter and
  the module-level `capabilityProvider` filter); the manifest was resolved by parsing each side as a
  whole document from git stages 2 and 3 and unioning districts by id with `main` winning collisions;
  the census was regenerated from the merged manifest in **declaration order**.
  `11-entertainment` was dropped rather than resurrected, verified through the promotion records'
  `relocatedTo` field, so the relocated theme engine never has two owners.
- **Donor parity findings.** Not re-derived here. The migration's differential harnesses were
  deleted after use, so parity rests on the migration host's recorded numbers; this verification
  did **not** independently re-derive them and does not claim to have. The identity standard
  (migration report D4) was re-read and its shipped bindings confirmed present:
  `bounded-run/stabilization.mjs` imports `revalidate` from `../target-guard/target.mjs` and
  `bounded-run/recovery.mjs` imports `CHANNEL_PLANS`/`fallbackChannels` from
  `../routing-safety/routing.mjs`.
- **Runtime/use findings.** The migration report declared the runtime plane deferred. Confirmed:
  no executor, no controllers, no drivers, no OS backends are present in
  `city/10-automation/01-computer-use-runtime`. Six library rooms only.
- **Initial verdict.** `ROUTE_B_CONTINUE`. `main` declares no `city/10-automation` district and
  nothing elsewhere covers `createSafetyGuard`, `classifyRisk` or the target guard, so the Mission
  still has value and `SKIPPED_NOT_REQUIRED` was not available. The deferred runtime plane must
  remain deferred; verification may only cover the boundary `response-9-29.md` R7 accepted.

## 2. 对照 Migration Report / Reconciliation

- **Migration claims confirmed.** Six modules with 664 tests; all six declare
  `capabilityProvider: false`; the new `10-automation` district and `01-computer-use-runtime`
  building are registered; the census matches the merged manifest in declaration order;
  `11-entertainment` is absent and the theme engine has exactly one owner (`00-foundation`/`05-control-centre`
  relocation, MB-009). No `MIGRATION_COMPLETE` event exists and none was backfilled — the
  `RUNTIME_FAIL / BLOCKED` (`MB-008:5a72b750eb33a552`) stands, per `response-9-30.md` R5.
- **Migration claims corrected/rejected.** None rejected. One clarification: the report §6.5 states
  the Verification gate requires **two** hosts each performing a real bounded action.
  `response-9-30.md` **R7** explicitly reinterprets this for MB-008 — Alien is **not** required to
  retroactively re-enact a bounded action it had no lawful consumption surface for, and Mech's real
  bounded chain plus Alien's blocker plus the Owner ruling together constitute the evidence.
  This verification therefore covers one host's real chain, as R7 authorises, and does not claim
  two. The two-host gate remains the standing rule for any future Mission with a lawful environment.
- **Boundary mismatches.** The migration report §6.3 and R7 agree: this is a library, not a working
  computer-use runtime. Nothing here is written up as a completed runtime plane.

## 3. 二次维修与验证 / Secondary repair & verification

### 3.1 Repairs

No repair was made to any migrated module. Three bookkeeping defects were found and fixed in the
**Verification host's own evidence driver**, which is host-local tooling under `.runtime/`
(gitignored) and not part of the product:

1. **`assertActionAllowed` is `async`** (`routing-safety/safety.mjs`). The first driver revision
   called it inside a synchronous `try/catch`, which cannot catch a rejected promise: the recorded
   outcome stayed `not-thrown` while the rejection escaped as an unhandled rejection and killed the
   process. Reproduced before the fix (`refusalPath.assertionThrew: false`, exit 1). Fixed by
   `await`ing inside the `try` — and the same latent defect on the happy-path assertion was fixed
   with it.
2. **Side-effect absence was asserted, not measured.** Every evidence-workspace mutation now goes
   through counted helpers, and the driver compares both the mutation counter and the full artifact
   state (exists / bytes / sha256 / mtime) across the refusal block.
3. **`validateAction` is throw-based** — it returns the action and has no `.valid` field, so the
   first revision's `validation.valid === false` check could never fire and always reported
   `validated: null`. It is now recorded as a real throw/return outcome.

The judged call was **not** to touch the runtime. The guard, `evaluateDestructive`, the verifier and
every migrated module were already correct, and editing them to make the evidence look better is
exactly what the closeout order forbids.

### 3.2 Tests

Five gates, all green on the verification tree (`gates.txt` holds the raw output):

| Gate | Result |
| --- | --- |
| `pnpm test` | **73 / 73**, 0 failures, exit 0 |
| `node city/test-all.mjs` | **1698 / 1699**, 0 failures, 1 skipped, exit 0 |
| `node --test apps/rooms/tests/*.test.mjs` | **69 / 69**, 0 failures, exit 0 |
| `node scripts/verify-promotion-history.mjs` | **10 records verified** at `65418f2493cb`, exit 0 |
| `pnpm check:docs` | docs / evidence / data-records all `PAIR_STATUS = SYNCHRONIZED`, exit 0 |

`pnpm` is not on `PATH` in this shell; the gates were run through the corepack shim
(`D:\Tools\corepack-shims\pnpm.CMD`, pnpm 11.19.0), so the **declared** commands were executed
rather than substituted. `pnpm test` and `pnpm check:docs` are thin wrappers over
`node --test tests/*.test.mjs` and `node scripts/check-bilingual.mjs`.

### 3.3 Real UI / use — the bounded Computer-Use chain

Driver: `.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs` → **exit 0**.
Every decision on the way is made by the **migrated** modules; the driver's only job is the I/O.

| Path | Result |
| --- | --- |
| **HAPPY** | `execution-contract.normalizeAction` → `validateAction` → `routing-safety.classifyRisk` = `high` ("FILE_WRITE has a side effect that must not be assumed") → guard allows → real bounded `FILE_WRITE` inside the evidence workspace only → `createWorldState` before/after digests differ (`006b5a10f23168a0` → `7f3b81bae425d9d6`) → `meaningfulChange.changed = true` (title, controlSignature, windowSignature) → **postcondition `success`, kind `file`** |
| **REFUSAL** | guard decision `allowed:false`, `mode:forbidden`, `kinds:["DELETE"]`; **await**ed `assertActionAllowed` **threw** `ComputerUseError` `code: DESTRUCTIVE_FORBIDDEN`, message `"destructive action(s) DELETE are forbidden by this contract"`, `details.mode = forbidden`, `details.kinds = ["DELETE"]`; an out-of-vocabulary `TELEPORT` was refused with `ACTION_INVALID`; **zero mutations** during the block and the target artifact byte-identical |
| **RECOVERY** | the target was **really deleted**; the **same** real `facts.fileExists` function then reported it absent (`false`) and the donor postcondition returned **`failure`, kind `file`**, detail `"file missing: <path>"`; donor recovery `decide()` → `step: retry`, `verdict: RETRYABLE`, `cooldownSignals: ["previous-miss"]`; donor stabilization `settle` → `stable`, `afterAction` → `landed`; the target was recreated and the postcondition re-verified to **`success`** |

Machine verdicts (`run/summary.json`):

```text
HAPPY_PATH = PASS          REFUSAL_PATH = PASS       PROCESS_EXIT = 0
EXPECTED_EXCEPTION_CAUGHT = true                     UNEXPECTED_EXCEPTION = none
SIDE_EFFECT = none         RECOVERY_PATH = PASS     GENUINE_MISS_FIRST = true
MISS_OBSERVED = true       NO_MOCK_FACTS = true      RECOVERED = true
FINAL_POSTCONDITION = success
```

**No mocked facts.** One function reference `fileFacts.fileExists` is used by all three `verify()`
calls; it reports `false` while the file is deleted and `true` after recovery. That identity is the
proof. No fake failure was manufactured: the miss was produced by making the world actually miss.

**Honest note on `detectMiss`.** The donor's `detectMiss` returns `missed:false`,
`confidence:"low"`, `signals:[]` here, and is recorded as-is rather than coerced. That is correct
donor behaviour: `detectMiss` is the **UI-miss** ladder (`no_state_change` / focus / event / state
signals), and the world state demonstrably *did* change — the control disappeared. For a **file**
effect the donor establishes the miss through the verifier verdict instead, which is the `failure`
(kind `file`) that `MISS_OBSERVED` is taken from.

### 3.4 Fault / recovery

Covered by the REFUSAL and RECOVERY paths above: a real refusal with a measured absence of side
effects, and a real postcondition failure recovered through the donor's own retry/revalidate +
stabilization vocabulary to a verified success.

### 3.5 Cross-host observations

Migration host **Alien**, verification host **Mech** — distinct, as required. Alien's historical
`RUNTIME_FAIL / BLOCKED` is preserved verbatim; no `MIGRATION_COMPLETE` was fabricated for it
(`response-9-30.md` R5). The one place this Mission diverges from the migration report's stated gate
(two hosts) is authorised in writing by `response-9-30.md` R7 and is recorded in §2 rather than
silently applied.

## 4. Utopia verified episode

- Implementation CI used by `mission:finalize`: **36662962981** (the runtime-evidence head `0e1d97e`).
- Episode path: `data-records/evolution/episodes/mission-book/MB-008/episode.json`
- Episode ID: **PENDING** — filled at closeout
- Inbox SHA-256 digest: **PENDING** — filled at closeout
- Candidate/accepted evidence pointers:

```text
.runtime/evidence/mission-book/MB-008/run-2/CHAIN-STATE.md
.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs
.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.log
.runtime/evidence/mission-book/MB-008/run-2/gates.txt
.runtime/evidence/mission-book/MB-008/run-2/run/{summary,action-spec,before-after-state,
  refusal-receipt,side-effect-absence-receipt,miss-receipt,final-postcondition,digests,
  recovery-timeline}.json
.runtime/evidence/mission-book/MB-008/run-2/run/audit.jsonl
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36662962981
Digital-City/mission-book/response-9-29.md#R7
Digital-City/mission-book/response-9-30.md#R5
Digital-City/mission-book/response-9-30.md#R7
```

Evolution events (inbox `data-records/evolution/inbox/mission-book/MB-008/events.jsonl`), ordering
asserted — `VERIFIER_FINDING` (8) < latest `CI_RESULT PASS` (12) < `VERIFICATION_COMPLETE PASS` (13):

| # | Event | Outcome | Event id |
| ---: | --- | --- | --- |
| 1 | MISSION_CLAIMED | INFO | `MB-008:4ba425de0933dc87` |
| 2 | ATTEMPT_STARTED | INFO | `MB-008:ef9cf276cbb63010` |
| 3 | CHANGE_APPLIED | INFO | `MB-008:69a6b819de80de0b` |
| 4 | TEST_PASS | PASS | `MB-008:7189d8757b9c40de` |
| 5 | RUNTIME_FAIL | **BLOCKED** (retained) | `MB-008:5a72b750eb33a552` |
| 6 | OWNER_INTERVENTION | INFO | `MB-008:fe4650b1af0044de` |
| 7 | ATTEMPT_STARTED | INFO | `MB-008:7208d35e54fae3cf` |
| 8 | VERIFIER_FINDING | BLOCKED | `MB-008:67f53cc8da24edda` |
| 9 | TEST_PASS | PASS | `MB-008:1ce4bdb9cbe65fda` |
| 10 | CI_RESULT | PASS | `MB-008:1cd9ff19bf0c3d6e` |
| 11 | RUNTIME_PASS | PASS | `MB-008:bbf126eae72598ed` |
| 12 | CI_RESULT | PASS | `MB-008:06f57c0602aa5553` |
| 13 | VERIFICATION_COMPLETE | PASS | `MB-008:fd0225d163afa3d2` |

## 5. 最终门禁 / Final gate

- **Final branch HEAD required CI:** `36662962981` PASS (gateway-web **and** android) on `0e1d97e`;
  the episode commit's own hosted run is recorded below at closeout.
- **Merge result:** PENDING — filled at closeout.
- **Verdict: PASS.**

### Deferred / not established (must not be read as complete)

1. **The runtime plane stays deferred.** No executor, controllers, drivers or OS backends were
   migrated or exercised: **no real desktop, browser or UI automation was driven.** This
   verification does not make Computer Use a complete product runtime.
2. The bounded action is a **file** action inside the evidence workspace. It is genuine and
   bounded, but it is not a desktop/UI interaction.
3. **Donor parity was not independently re-derived** here; the migration host's differential
   harnesses were deleted after use and their numbers are taken as recorded.
4. **Two-host coverage was not achieved**; `response-9-30.md` R7 authorises single-host coverage
   for MB-008 specifically. Any future Mission with a lawful environment must still meet the
   standing two-host gate.
5. `detectMiss` did not independently confirm the file miss (see §3.3); the miss rests on the
   donor verifier's `failure` verdict, which is the donor's own path for a file effect.
