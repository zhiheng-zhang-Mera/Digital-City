# MB-008 — Computer Use Runtime — VERIFICATION REPORT

> Status: **COMPLETE — OWNER_OVERRIDE_CLOSEOUT_COMPLETE**
> Verification Host: `Mech`
> Migration Host: `Alien`
> Completion basis: `OWNER_ACCEPTED_COMPLETE`
> Repair step: `2` — `repair_status: COMPLETE`

```text
MISSION = MB-008
ROLE = VERIFICATION
HOST = Mech
MIGRATION_HOST = Alien
IMPLEMENTATION_BRANCH = mission/MB-008-computer-use
IMPLEMENTATION_CI = 36584056291 PASS (migration head aa2a6a8) ; 36655586918 PASS (reconciled head 77b774c)
FINAL_BRANCH_CI = 36663533485 PASS (final branch head f8f82cd, gateway-web + android)
MERGED_MAIN_CI = 36663813362 PASS (merged main 168182c, gateway-web + android)
FINAL_BRANCH_SHA = f8f82cd54d2192ae63317b42182f96a9aaab466f
MERGED_MAIN_SHA = 168182c47df537f7c6c47d7e42ab3220af40de68
EPISODE = data-records/evolution/episodes/mission-book/MB-008/episode.json
EPISODE_ID = MB-008:6ae0bbd46e425c9f
EPISODE_SHA256 = a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e
VERIFICATION_COMPLETE = true
```

---

## 0. Checkpoint history — Verification open → run-2 resume

Preserved from the pre-chain checkpoint so the whole arc stays readable; superseded only where a
later section says so.

```text
OWNER_GATE = MB-007 repair_status=COMPLETE
VALUE_VERDICT = ROUTE_B_CONTINUE
MIGRATION_HEAD = aa2a6a8faab779a020d75b93dba548ba3755ce30
POST_MB007_MAIN = d850d73a9c23dbd07f9a0c7483dd2f44272f273f
RECONCILED_HEAD = 77b774cf34df
RECONCILED_CI = 36655586918 PASS
PRE_CHAIN_EVENT_HEAD = 65418f2493cb
PRE_CHAIN_EVENT_CI = 36658350359 PASS
```

### 0.1 Value reassessment

Route B selected: at the time of reassessment present Utopia `main` still lacked the MB-008
safety/guard/recovery/postcondition semantics as an equivalent implementation, so skipping the
Mission (`SKIPPED_NOT_REQUIRED`) would have been incorrect. §1 records this host's independent
re-derivation of that verdict.

### 0.2 Integration-first reconciliation

The branch was 48 commits behind post-MB-007 `main`. Three shared-control-plane conflicts were
resolved without weakening any existing mechanism:

- `services/capability-bridge/registry.mjs`: kept `main`'s strict superset, which already carries
  **both** exclusion filters and the MB-009 declared/enumerated split.
- `city/CITY_IMPLEMENTATION_MANIFEST.json`: unioned the complete stage-2/stage-3 documents by
  district id; current-`main` ownership won collisions; the relocated `11-entertainment` theme
  ownership was not duplicated.
- `city/tests/manifest.test.mjs`: census regenerated in manifest **declaration** order.

Reconciled branch head `77b774cf34df`, hosted CI `36655586918 PASS`.

### 0.3 Pre-chain Verification events — committed at `65418f2493cb`

These events already existed and were **not** duplicated:

| Event | ID | Outcome |
|---|---|---|
| OWNER_INTERVENTION | `MB-008:fe4650b1af0044de` | INFO |
| ATTEMPT_STARTED | `MB-008:7208d35e54fae3cf` | INFO |
| VERIFIER_FINDING | `MB-008:67f53cc8da24edda` | BLOCKED / independent finding |
| TEST_PASS | `MB-008:1ce4bdb9cbe65fda` | PASS |
| CI_RESULT | `MB-008:1cd9ff19bf0c3d6e` | PASS — run `36655586918` |

The independent finding is intentionally retained as a truthful historical finding. It is not
rewritten to green; the later runtime evidence and completion events establish the closeout.

### 0.4 Run-2 partial result that opened this pass

The happy path was already real:

```text
normalizeAction → validateAction → classifyRisk(FILE_WRITE) = high → evaluateDestructive
→ real bounded file write in the evidence workspace → createWorldState before/after
→ different digests → meaningfulChange.changed = true → file postcondition verdict = success
```

Two evidence-driver defects remained, with the migrated product logic explicitly **not** to be
modified for them:

1. **Refusal bookkeeping** — the migrated destructive guard correctly threw
   `ComputerUseError` / `DESTRUCTIVE_FORBIDDEN` for `DELETE`, but the driver recorded `not-thrown`
   while the process died.
2. **Recovery ordering** — the attempted "miss" truthfully returned `success` because the file
   still existed; a genuine miss had to be produced by deleting the file first.

Both are fixed; §3.1 and §3.3 record how, and confirm the runtime was left untouched.

### 0.5 API facts learned the hard way (reused, not rediscovered)

- `FILE_*` actions take `path` inline; a file-shaped `target` throws `TARGET_INVALID`.
- The expected-effect vocabulary is closed snake_case; use donor vocabulary such as `file_created`.
- `vworld` / `pinnedClock` / `browserParts` are **test fixtures**, not runtime API.
- The world state is **perception-shaped**; `createWorldState(parts, { now })` takes a bare `now`
  *function* while `createVerifier({ clock })` takes a `{ now() }` *object*.
- File postcondition verification requires `facts.fileExists` as a **function**; passing file data
  yields `verdict: "unknown"`.
- Each room declares its **own** local `ComputerUseError`, so an `instanceof` check must use the
  class the throwing room owns (`safety.ComputerUseError` for the guard).

---

## 1. 独立审查 / Independent review

> 本节按规则 9 在阅读 Migration Report **之前** 写下；逐条结论以 `VERIFIER_FINDING`
> `MB-008:67f53cc8da24edda` 先行记录在 evolution inbox 中，内容取自 Git 历史、分支 diff 与第一次门禁运行。

- **Code/diff findings.** The branch was 48 commits behind `main` and touches the shared control
  plane (`city/manifest.mjs`, `city/tests/manifest.test.cjs`,
  `services/capability-bridge/registry.mjs`, the census). Per `README.md` §6 the latest `main` was
  merged **first**, before any gate ran, and committed (`77b774c`) — required, because
  `verify-promotion-history.mjs` tests `HEAD`. Conflicts were resolved as union/superset and never
  weakened a mechanism (§0.2). `11-entertainment` was dropped rather than resurrected, verified
  through the promotion records' `relocatedTo` field, so the relocated theme engine never has two
  owners.
- **Donor parity findings.** **Not** re-derived here. The migration's differential harnesses were
  deleted after use, so parity rests on the migration host's recorded numbers; this verification
  does not claim to have independently reproduced them. The migration report's D4 single-source
  standard was re-read and its shipped bindings confirmed present:
  `bounded-run/stabilization.mjs` imports `revalidate` from `../target-guard/target.mjs`, and
  `bounded-run/recovery.mjs` imports `CHANNEL_PLANS`/`fallbackChannels` from
  `../routing-safety/routing.mjs`.
- **Runtime/use findings.** Confirmed the deferred runtime plane is absent: no executor, no
  controllers, no drivers, no OS backends under `city/10-automation/01-computer-use-runtime`. Six
  library rooms only.
- **Initial verdict.** `ROUTE_B_CONTINUE`. `main` declares no `city/10-automation` district and
  nothing elsewhere covers `createSafetyGuard`, `classifyRisk` or the target guard, so the Mission
  still has value and `SKIPPED_NOT_REQUIRED` was unavailable. The deferred runtime plane must stay
  deferred; verification may only cover the boundary `response-9-29.md` R7 accepted.

## 2. 对照 Migration Report / Reconciliation

- **Migration claims confirmed.** Six modules, 664 tests; all six declare `capabilityProvider: false`;
  the new `10-automation` district and `01-computer-use-runtime` building are registered; the census
  matches the merged manifest in declaration order; `11-entertainment` is absent and the theme
  engine has exactly one owner (MB-009 relocation). No `MIGRATION_COMPLETE` event exists and none was
  backfilled — `RUNTIME_FAIL / BLOCKED` (`MB-008:5a72b750eb33a552`) stands, per `response-9-30.md` R5.
- **Migration claims corrected / rejected.** None rejected. One **clarification**: report §6.5 states
  the Verification gate requires **two** hosts each performing a real bounded action.
  `response-9-30.md` **R7** explicitly reinterprets this for MB-008 — Alien is **not** required to
  retroactively re-enact a bounded action it had no lawful consumption surface for; Mech's real
  bounded chain, plus Alien's blocker, plus the Owner ruling together constitute the evidence. This
  verification therefore covers **one** host's real chain, as R7 authorises, and does not claim two.
  The two-host gate remains standing for any future Mission with a lawful environment.
- **Boundary mismatches.** Migration report §6.3 and R7 agree: this is a library, not a working
  computer-use runtime. Nothing here is written up as a completed runtime plane.

## 3. 二次维修与验证 / Secondary repair & verification

### 3.1 Repairs

**No migrated module was touched.** Three bookkeeping defects were found and fixed in the
**Verification host's own evidence driver**, which is host-local tooling under `.runtime/`
(gitignored) and not part of the product:

1. **`assertActionAllowed` is `async`** (`routing-safety/safety.mjs`). The first revision called it
   inside a synchronous `try/catch`, which cannot catch a rejected promise: the recorded outcome
   stayed `not-thrown` while the rejection escaped as an unhandled rejection and killed the process.
   Reproduced before the fix (`refusalPath.assertionThrew: false`, exit 1). Fixed by `await`ing
   inside the `try` — and the same latent defect on the happy-path assertion was fixed with it.
2. **Side-effect absence was asserted, not measured.** Every evidence-workspace mutation now goes
   through counted helpers, and the driver compares both the mutation counter and the full artifact
   state (exists / bytes / sha256 / mtime) across the refusal block.
3. **`validateAction` is throw-based** — it returns the action and has no `.valid` field, so the
   first revision's `validation.valid === false` check could never fire and always reported
   `validated: null`. It is now recorded as a real throw/return outcome.

The judged call was **not** to touch the runtime: the guard, `evaluateDestructive`, the verifier and
every migrated module were already correct, and editing them to flatter the evidence is exactly what
the closeout order forbids.

### 3.2 Tests — five gates, all green

| Gate | Result |
| --- | --- |
| `pnpm test` | **73 / 73**, 0 failures, exit 0 |
| `node city/test-all.mjs` | **1698 / 1699**, 0 failures, 1 skipped, exit 0 |
| `node --test apps/rooms/tests/*.test.mjs` | **69 / 69**, 0 failures, exit 0 |
| `node scripts/verify-promotion-history.mjs` | **10 records verified** at `65418f2493cb`, exit 0 |
| `pnpm check:docs` | docs / evidence / data-records all `PAIR_STATUS = SYNCHRONIZED`, exit 0 |

`pnpm` is not on `PATH` in this shell; the gates ran through the corepack shim
(`D:\Tools\corepack-shims\pnpm.CMD`, pnpm 11.19.0), so the **declared** commands were executed rather
than substituted — `pnpm test` and `pnpm check:docs` are thin wrappers over
`node --test tests/*.test.mjs` and `node scripts/check-bilingual.mjs`. Raw output: `gates.txt`.

### 3.3 Real use — the bounded Computer-Use chain

Driver `.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs` → **exit 0**.
Every decision on the way is made by the **migrated** modules; the driver's only job is the I/O.

| Path | Result |
| --- | --- |
| **HAPPY** | `normalizeAction` → `validateAction` → `classifyRisk` = `high` ("FILE_WRITE has a side effect that must not be assumed") → guard allows → real bounded `FILE_WRITE` inside the evidence workspace only → before/after world digests differ (`006b5a10f23168a0` → `7f3b81bae425d9d6`) → `meaningfulChange.changed = true` (title, controlSignature, windowSignature) → **postcondition `success`, kind `file`** |
| **REFUSAL** | guard decision `allowed:false`, `mode:forbidden`, `kinds:["DELETE"]`; awaited `assertActionAllowed` **threw** `ComputerUseError` `DESTRUCTIVE_FORBIDDEN`, message `"destructive action(s) DELETE are forbidden by this contract"`, `details.mode = forbidden`, `details.kinds = ["DELETE"]`; an out-of-vocabulary `TELEPORT` was refused with `ACTION_INVALID`; **zero mutations** during the block and the target artifact byte-identical |
| **RECOVERY** | the target was **really deleted**; the **same** real `facts.fileExists` function then reported it absent and the donor postcondition returned **`failure`, kind `file`**, detail `"file missing: <path>"`; donor recovery `decide()` → `step: retry`, `verdict: RETRYABLE`, `cooldownSignals: ["previous-miss"]`; donor stabilization `settle` → `stable` and `afterAction` → `landed`; the target was recreated and the postcondition re-verified to **`success`** |

This section supersedes the partial result in §0.4. Machine verdicts (`run/summary.json`):

```text
HAPPY_PATH = PASS          REFUSAL_PATH = PASS       PROCESS_EXIT = 0
EXPECTED_EXCEPTION_CAUGHT = true                     UNEXPECTED_EXCEPTION = none
SIDE_EFFECT = none         RECOVERY_PATH = PASS     GENUINE_MISS_FIRST = true
MISS_OBSERVED = true       NO_MOCK_FACTS = true      RECOVERED = true
FINAL_POSTCONDITION = success
```

**No mocked facts.** One function reference `fileFacts.fileExists` is used by all three `verify()`
calls; it reports `false` while the file is deleted and `true` after recovery. That identity is the
proof. No failure was manufactured: the miss was produced by making the world actually miss.

**Honest note on `detectMiss`.** The donor's `detectMiss` returns `missed:false`, `confidence:"low"`,
`signals:[]` here and is recorded as-is rather than coerced. That is correct donor behaviour:
`detectMiss` is the **UI-miss** ladder (`no_state_change` / focus / event / state signals), and the
world state demonstrably *did* change — the control disappeared. For a **file** effect the donor
establishes the miss through the verifier verdict instead, which is the `failure` (kind `file`) that
`MISS_OBSERVED` is taken from.

### 3.4 Fault / recovery

Covered by the REFUSAL and RECOVERY paths above: a real refusal with a **measured** absence of side
effects, and a real postcondition failure recovered through the donor's own retry/revalidate +
stabilization vocabulary to a verified success.

### 3.5 Cross-host observations

Migration host **Alien**, verification host **Mech** — distinct, as required. Alien's historical
`RUNTIME_FAIL / BLOCKED` is preserved verbatim and no `MIGRATION_COMPLETE` was fabricated for it
(`response-9-30.md` R5). The one place this Mission departs from the migration report's stated gate
(two hosts) is authorised in writing by `response-9-30.md` R7 and is recorded in §2 rather than
silently applied.

## 4. Utopia verified episode

- Implementation CI used by `mission:finalize`: **36662962981** (runtime-evidence head `0e1d97e`).
- Episode path: `data-records/evolution/episodes/mission-book/MB-008/episode.json`
- Episode ID: **`MB-008:6ae0bbd46e425c9f`**
- Episode SHA-256: `a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e`
- Episode status: `VERIFIED`; `participants` `Alien` / `Mech`;
  `migrationAcceptance.mode = OWNER_OVERRIDE`, `ownerRuling = Digital-City/mission-book/response-9-29.md#R7`,
  `migrationBlockerEventId = MB-008:5a72b750eb33a552`,
  `ownerInterventionEventId = MB-008:fe4650b1af0044de`.
- Assertions checked on the generated episode: Alien's original `RUNTIME_FAIL / BLOCKED` is retained in
  **both** `timeline` and `failures`; **no** `MIGRATION_COMPLETE` event exists (nothing fabricated, R5);
  `RUNTIME_PASS` and `VERIFICATION_COMPLETE` are both present; `VERIFIER_FINDING` retained.
- The inbox was consumed (removed) by `finalize-mission-episode.mjs`.
- Inbox SHA-256 digest: `dc65f523d04fc70519ef709367586fe5c42525e674076908bf59f9ec38757e8c` (13 events).
- Candidate / accepted evidence pointers:

```text
.runtime/evidence/mission-book/MB-008/run-2/CHAIN-STATE.md
.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs
.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.log
.runtime/evidence/mission-book/MB-008/run-2/gates.txt
.runtime/evidence/mission-book/MB-008/run-2/run/{summary,action-spec,before-after-state,
  refusal-receipt,side-effect-absence-receipt,miss-receipt,final-postcondition,digests,
  recovery-timeline}.json
.runtime/evidence/mission-book/MB-008/run-2/run/audit.jsonl
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36655586918
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36658350359
https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36662962981
Digital-City/mission-book/response-9-29.md#R7
Digital-City/mission-book/response-9-30.md#R5
Digital-City/mission-book/response-9-30.md#R7
```

Full evolution event stream (inbox
`data-records/evolution/inbox/mission-book/MB-008/events.jsonl`), ordering asserted —
`VERIFIER_FINDING` (8) < latest `CI_RESULT PASS` (12) < `VERIFICATION_COMPLETE PASS` (13):

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

- **Final branch HEAD required CI:** `36663533485` **PASS** (gateway-web **and** android) on the
  final branch head `f8f82cd54d2192ae63317b42182f96a9aaab466f` (the episode commit).
- **Merge result:** merged `mission/MB-008-computer-use` → `main` as
  `168182c47df537f7c6c47d7e42ab3220af40de68` using `--no-ff`, matching the project's existing
  merge-commit strategy (`cb8e0bd`, `b4bd602`, `cfe34df`, `0eed05b`). No squash and no rebase, so the
  cross-host evidence history is preserved intact.
- **Merged-main CI:** `36663813362` **PASS** (gateway-web **and** android).
- **Merged-main gates:** `pnpm test` 73/73 · `city/test-all.mjs` 1698/1699 (0 failures, 1 skipped) ·
  `apps/rooms` 69/69 · `verify-promotion-history` 10 records verified at `168182c47df5` ·
  `check:docs` docs/evidence/data-records all `SYNCHRONIZED`.
- **Structural checks on merged main:** `10-automation` appears exactly once ·
  `01-computer-use-runtime` ownership unique · `capabilityProvider: false` on all six modules ·
  district ids unique, building ids unique within district, module ids and paths globally unique ·
  registry keeps **both** the building-aware kind filter and the module-level `capabilityProvider`
  filter over the full `declared` surface · theme engine owned only by `00-foundation/05-control-centre`
  (`relocatedFrom` the 11-entertainment path, by MB-009) · `11-entertainment` absent.
- **Verdict: PASS — MB-008 verification closed.**

## 6. 施工中的问题、选择与判断逻辑 / Problems, choices and the reasoning

Every point below is a place the closeout order did **not** fully specify the option. The chosen
option and the reasoning are recorded rather than left implicit.

**V1 — `pnpm` is not on `PATH`.**
*Problem:* the order names `pnpm test` and `pnpm check:docs` as gates, and both failed to resolve.
*Judged:* do **not** silently substitute the underlying node commands. pnpm 11.19.0 exists via the
corepack shim at `D:\Tools\corepack-shims\pnpm.CMD`, so the **declared** commands were run through
it. *Recorded:* the shim path and version are in `gates.txt` and §3.2, so the substitution cost is
zero but the fact is not hidden.

**V2 — the first driver revision had three bookkeeping defects, and the temptation was to "fix" the
runtime.**
*Problem:* the refusal assertion reported `not-thrown` while the process died, and the "miss"
returned `success`. The order says only the driver may be fixed and the runtime must not be touched
"为了让测试好看" (to make the tests look good). *Judged:* the root cause was located in the migrated
API's real shape — `assertActionAllowed` is `async`, so a sync `try/catch` can never catch it — and
the **driver** was fixed. The guard, `evaluateDestructive` and the verifier were verified correct and
left byte-identical. *Why this is the right call:* editing the runtime would have destroyed the
evidence value of the whole chain; the honest reading is that the runtime was right and the harness
was wrong.

**V3 — `detectMiss` reports `missed: false`.**
*Problem:* the order asks for a "genuine miss" and `detectMiss` is the donor's miss function, so the
expectation is naturally `missed: true`. It returns `false` here.
*Judged:* record it **as it answered** and explain the mechanism, rather than adjust inputs until it
agreed. `detectMiss` is the donor's **UI**-miss ladder; for a **file** effect the donor establishes
the miss through the verifier verdict, which is the `failure` (kind `file`) actually obtained.
`MISS_OBSERVED` is therefore taken from the verifier, and the divergence is documented in §3.3 and
in the deferred list. *Why:* coercing `detectMiss` would have been manufacturing evidence — exactly
what the order forbids.

**V4 — the City repository was behind its remote when this pass started.**
*Problem:* the working copy showed `7a8d9ac`, but `origin/main` had advanced by 7 commits from the
earlier session — including its own `VERIFICATION_REPORT.md` and extra front-matter fields. The
first push was rejected as non-fast-forward.
*Judged:* **fetch, merge and reconcile as a union** — never force-push and never discard the earlier
session's truthful partial-state record. The conflicting report was rewritten as a single document
that keeps the earlier checkpoint history (§0) while adding the completion (§1–§5); the front matter
took the union of both field sets, and the now-obsolete `repair_resume_point` was updated rather than
left stale. *Lesson recorded:* the order's own "注意每次领取任务前确认仓库的最新状态" (confirm the
latest repository state before claiming) means **`git fetch` first**, not just `git log` — the local
clone's HEAD is not the remote's state.

**V5 — merge strategy into `main`.**
*Problem:* `main` had not diverged (branch was 0 behind, 8 ahead), so a plain `git merge` would have
fast-forwarded and produced no merge commit. The order requires the project's existing merge strategy
and forbids squashing or rebasing away the cross-host evidence history.
*Judged:* use `--no-ff` to create an explicit merge commit `168182c`, matching the precedent of
`cb8e0bd` / `b4bd602` / `cfe34df` / `0eed05b`. All 8 branch commits, including Alien's blocker and
every evolution event commit, are preserved individually.

**V6 — the finalizer takes `--branch-sha` and `--ci-run` from two different commits.**
*Problem:* the order specifies `--branch-sha <COMMIT_CONTAINING_VERIFICATION_COMPLETE>` but
`--ci-run <FINAL_VERIFICATION_CI_RUN_ID>`, and those are the verification-complete commit `437be8b`
and the runtime-evidence run `36662962981` on `0e1d97e` respectively.
*Judged:* follow the order **literally** rather than "correcting" it, and record the pair explicitly
in the report header and §4 so the reader can see exactly which tree each CI number belongs to. The
finalizer accepted the pair, and the episode records `ci.run = 36662962981` with
`target.branchFinalSha = 437be8b` — both truthful.

**V7 — a `--summary` over 1000 characters is refused (exit 2).**
*Problem:* the `VERIFICATION_COMPLETE` summary exceeded the tool's cap several times.
*Judged:* trim the prose, and drop the redundant "on host Mech" phrase — the event's `hostId` field
already carries it unambiguously. No factual content was dropped.

**V8 — City status legend.**
*Problem:* at the milestone the verification was green but not yet merged, which is neither the
legend's 🟢 ("accepted") nor cleanly 🔴.
*Judged:* keep 🔴 for the intermediate milestone rather than invent a new 🟡 symbol the README's
legend does not define, and carry the nuance in the prose note. At closeout the row correctly
becomes 🟢.



## 7. Deferred / not established (must not be read as complete)

1. **The runtime plane stays deferred.** No executor, controllers, drivers or OS backends were
   migrated or exercised: **no real desktop, browser or UI automation was driven.** This verification
   does not make Computer Use a complete product runtime.
2. The bounded action is a **file** action inside the evidence workspace. It is genuine and bounded,
   but it is not a desktop/UI interaction.
3. **Donor parity was not independently re-derived** here; the migration host's differential
   harnesses were deleted after use and their numbers are taken as recorded.
4. **Two-host coverage was not achieved**; `response-9-30.md` R7 authorises single-host coverage for
   MB-008 specifically. Any future Mission with a lawful environment must still meet the standing
   two-host gate.
5. `detectMiss` did not independently confirm the file miss (§3.3); the miss rests on the donor
   verifier's `failure` verdict, which is the donor's own path for a file effect.
