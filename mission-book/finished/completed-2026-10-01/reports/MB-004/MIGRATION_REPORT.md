# MB-004 — Project Foreman Engineering Union 纯迁移 — MIGRATION REPORT

> **Status: `MIGRATION_COMPLETE`** (Migration stage only; **not merged to `main`**)
> Migration Host: **Mech**
> Claimed at: `2026-09-29T13:12:00Z`
> City claim commit: `945092ff14bfb9b0a3323b023ec3ad5b4c5b139c` (pushed to `Digital-City` main; no write conflict)
> Implementation branch: `mission/MB-004-project-foreman`
> Branch base: `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`
> Implementation commit: `8a0d5d6af7fd8ac007474e8df39c802b069ab785`
> Final branch HEAD: `70806ad1277904c214f29f5da52cb5c7db1d90da`
> Migration CI: **PASS** — run `36577933078` (`V0.2 checks`) on `faf6f7a011ff37ea427c592773bf837411964d7c`; `gateway-web` success, `android` success

---

## 1. Donor / frozen baseline

| Donor | Frozen SHA | Role in this Mission |
|---|---|---|
| `zhiheng-zhang-Mera/DS-Hns` | `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b` | primary implementation: plan/discovery ordering, failure classification, recovery/checkpoint, isolation, verification, result gate |
| `zhiheng-zhang-Mera/Codex-Boss` | `8df428eaa437a409368401e95194e40266b83080` | union additions: the §33 recovery ladder with per-class budgets, and the CI-repair parse/classify/plan loop |

This is a **union**, not a winner. §3.4 records how the two halves are kept side by side.

---

## 2. Landing boundary (source → target)

**Target module:** `city/02-engineering/01-project-foreman/project-foreman`
**City owner:** 02/01 Project Foreman — Engineering Task Orchestrator.

Path decision, as in MB-002 and MB-005: the Mission names `city/02-engineering/01-project-foreman`,
and `city/manifest.mjs` enforces `module.path === city/<district>/<building>/<module>`, so this is
realised as building `01-project-foreman` containing module `project-foreman`.

**Dependency:** MB-003 Worker Gateway, whose `migration_complete` was `true` on City main before this
Mission was claimed.

### 2.1 Source → target ledger (25 modules)

All 22 DS-Hns `app/engineering/**` modules are ported, plus three Boss `src/shared/**` modules.

| Donor | Target |
|---|---|
| `plan.cjs` | `plan.mjs` |
| `discovery.cjs` | `discovery.mjs` |
| `adapters/index.cjs` | `adapters.mjs` |
| `failure.cjs` | `failure.mjs` |
| `episode.cjs` | `episode.mjs` |
| `autonomy.cjs` | `autonomy.mjs` |
| `checkpoint.cjs` | `checkpoint.mjs` |
| `recovery-schema.cjs` | `recovery-schema.mjs` |
| `recovery-store.cjs` | `recovery-store.mjs` |
| `locking.cjs` | `locking.mjs` |
| `mutation.cjs` | `mutation.mjs` |
| `repository.cjs` | `repository.mjs` |
| `process-identity.cjs` | `process-identity.mjs` |
| `process.cjs` | `process.mjs` |
| `context.cjs` | `context.mjs` |
| `scheduler.cjs` | `scheduler.mjs` |
| `git.cjs` | `git.mjs` |
| `cross-volume-cleanup.cjs` | `cross-volume-cleanup.mjs` |
| `verifier.cjs` | `verifier.mjs` |
| `result.cjs` | `result.mjs` |
| `supervisor.cjs` | `supervisor.mjs` |
| `index.cjs` | `index.mjs` |
| Boss `src/shared/recovery.ts` | `failure-recovery.mjs` |
| Boss `src/shared/ci-repair.ts` | `ci-repair.mjs` |
| Boss `src/shared/correction.ts` | `correction.mjs` |

Full per-symbol detail, every adaptation and the classification are in the module's `DONOR.json`.

---

## 3. Preserved behaviour / explicitly NOT migrated

### 3.1 Preserved

The bounded plan with its four invariants — **a repair is proven before it is attempted** (the
`reproduce` step precedes any patch), the plan is bounded at `maxSteps` with every dropped step
written into `reasons`, the **cursor only moves forward one step at a time**, and the step vocabulary
is closed; the intent templates whose *order* is the correctness property; the closed 16-class
failure vocabulary with its class-to-action policy and ordered pattern table; the stable failure
signature that strips timestamps, paths, hashes and numbers so two runs of one failure remain the
same failure; the repair tracker that refuses a blind retry and a repeated hypothesis; episode phases
and transitions; the autonomy bounds (`maxContinuationRounds 8`, `maxTotalSteps 400`);
checkpoint/`verifyResume` as a **re-check** with refuse/restart/resume verdicts, the atomic rename
write, the retention bound and total corruption tolerance; the recovery index with its
sequence-regression and duplicate-sequence refusals and bounded automatic recovery attempts; the
single-writer workspace lock that is never stolen from a live owner; the protected-baseline
file-ownership rule that stops an episode overwriting the user's uncommitted work; the plan-digest and
executor-compatibility replay gates; the three verification levels with the freshness gate and the
rule that a killed, timed-out or signalled process is never a success; the result gate with its named
refusal reasons; the adapters with their detection scores and specificity order; the process
supervisor's classes, readiness kinds and four timeout ceilings; the scheduler's deadline bands and
backoff ladder; the context rings; git policy and the forbidden-command list; and cross-volume scratch
ownership with its cleanup protocol.

### 3.2 NOT migrated

| Not migrated | Reason |
|---|---|
| `app/engineering-host.cjs` | The Electron shell wiring, not the engineering runtime. |
| `app/computer-use/{processes,errors}.cjs` | Computer-Use domain. `createProcessSupervisor` keeps the donor's **injected registry** seam and falls back to a minimal local registry implementing exactly the surface the supervisor consumes, taken from the donor's own test helper. |
| `app/sub-worker/**` (worker worktree isolation, `FileOwnershipRegistry`, `filterConflicts`, `mergeFileChanges`, path permissions) | The worker-pool isolation mechanism behind 02/02 Worker Gateway (MB-003). The Foreman's *own* ownership guarantee is ported: `mutation.mjs`'s protected-baseline plus root confinement, and `locking.mjs`'s single-writer lock. |
| Boss `src/shared/execution-planner.ts` (requirements-driven Execution DAG) | **Deferred, not faked.** `planExecution` consumes a Boss `RequirementsGraph` for which this tree has no producer; porting it would mean inventing behaviour, which `MODE=MIGRATION_ONLY` forbids. `index.mjs` deliberately does not re-export it. |
| Boss acceptance-hub family (`acceptance*.ts`, `final-acceptance.ts`, `review.ts`, `verification.ts`, `git-checkpoint.ts`, `fleet.ts`, `repo-world-model.ts`) | They persist through Boss host stores or consume Boss requirement/evidence contracts this tree does not have; the four `THEME_*` surfaces are Entertainment-domain. Recorded as DEFERRED with reasons. |
| `guardian.ts`, `root-authority/*`, `tenx/*`, `node-capabilities`, `capability-graph` | City-wide authority/priority and Capability/Node global truth are explicitly forbidden by this Mission. |

### 3.3 The Mission's forbidden list, honoured

No new scheduling algorithm, no new worker type, no autonomy policy the donor does not already
implement, no City-wide authority, no Capability/Node global truth, no non-Engineering domain logic.
Every constant, threshold, budget and refusal string is the donor's.

### 3.4 How the union is kept a union

`failure.mjs` is the **DS-Hns** vocabulary: 16 lower-case classes, a class-to-action policy, and
repair memory. `failure-recovery.mjs` is the **Boss** vocabulary: 13 upper-case classes, an
evidence-driven ladder with per-class budgets, Owner escalation, and the HNS fallback rule. Neither
imports, re-exports nor translates the other, and both module headers name the overlap and the
disagreement (`workspace`/`WORKSPACE`, `TEST` vs `unit-test`+`integration-test`, `BUILD` vs
`syntax`+`type`+`compile`). `ci-repair.mjs` consumes the Boss ladder through a lazy named seam, so
CI-repair stays a consumer of failure policy rather than its owner.

---

## 4. Interface / contracts

`index.mjs` is the host's only seam and publishes **59 exports**. Load-bearing entry points:

- `run(input)` — one call, one episode: establish the workspace, discover the project, capture a
  baseline, plan bounded work, execute it, verify it with fresh evidence, report.
- `createEngineeringSupervisor(input)` / `runEpisode(input)` — the loop and its construction.
- Vocabularies a host may switch on: `EPISODE_PHASES`, `EPISODE_TRANSITIONS`, `FAILURE_CLASSES`,
  `CLASS_POLICY`, `VERIFICATION_LEVELS`, `PLAN_KINDS`, `WAKE_REASONS`, `OPERATIONS`, `CONFIDENCE`,
  `PROCESS_CLASS`, `READINESS`, `MUTATION_RESULTS`, `STEP_OUTCOMES`, `EPISODE_DEFAULTS`.
- Read-only inspectors: `classify`, `deadlineState`, `defaultAdapters`, `verifyWorkspace`, `gitState`,
  `fingerprint`, `diffFingerprint`, `detectProject`, `discoverCommands`, `discover`,
  `computePlanDigest`, `validateRecoveryDescriptor`, `verifyResume`, `truncateOutput`,
  `summarizeTestOutput`, `collectLeaks`, `isTerminalPhase`.
- Constructors: `createCheckpointStore`, `createRecoveryStore`, `createResultValidator`,
  `createMutationLog`, `createProcessSupervisor`, `createGitController`, `createEpisodeContext`,
  `createVerifier`, `createCrossVolumeTempRegistry`, `createEngineeringAutonomy`, `createRepairTracker`.
- The Boss half: `classifyFailure`, `planRecovery`, `advanceRecovery`, `parseCiFailure`,
  `classifyCiFailure`, `planCiRepair`, `ciVerdict`, `loopOutcome`, `applyCorrections`.

---

## 5. Existing consumption surface (no new UI)

**No new UI, route, dashboard or product surface was added**, and `services/dev-gateway/server.mjs`
was not touched. The module is consumed the way a host consumes it: construct the supervisor and call
`run()`. The evidence for that is §6.2 — the module's own supervisor suite drives a **real git
repository** on disk end to end (`git init`, real commits, a real dirty tree, real `git` invocations
for the fingerprint) through the real discovery, planning, mutation, checkpoint, lock and
result-validation paths.

---

## 6. Tests

### 6.1 Gates

| Suite | Result |
|---|---|
| Whole city suite (`node city/test-all.mjs`) | **586 pass / 0 fail / 1 skipped** |
| Donor parity (`tests/donor/*` + `tests/donor-boss/*`) | **146 pass / 0 fail** |
| Supervisor end-to-end (`tests/supervisor.test.mjs`) | **23 pass / 0 fail** |
| Root suite (`pnpm test`) | **58 / 58** |
| Rooms | **67 / 67** |
| Bilingual docs | **SYNCHRONIZED** |
| Promotion history | **10 records verified** |
| Required CI | **PASS** — run `36577933078`, `gateway-web` + `android` |

The 1 local skip is a host-dependent symlink path-safety case.

### 6.2 Parity by running the donor's own tests

Where a donor suite is runnable without a live harness it was copied into `tests/donor/` (Hns) or
`tests/donor-boss/` (Boss) with **only its import specifiers rewritten** — bodies, titles and
assertions byte-identical. That is the strongest available evidence and it is mechanical:

- `engineering-plan.test.js` → 32 tests
- `engineering-checkpoint.test.js` → 26
- `engineering-verifier.test.js` → 23 of 24
- `engineering-context.test.js` → 13
- `engineering-cross-volume-cleanup.test.js` → 8
- `engineering-recovery-schema.test.js` → 7
- `engineering-process-identity.test.js` → 4
- `engineering-scenarios.test.js` → 4
- `engineering-recovery-journal.test.js` → 3
- `engineering-scenarios-autonomy.test.js` → 2
- `engineering-wiring-lock.test.js` → 1 (the donor's only coverage of `locking.cjs`)
- `engineering-process-real.test.mjs` → 1 (the process case of the verifier suite)
- Boss `tests/unit/recovery-model.test.ts` → 22, through a `node:test` shim so the donor's assertions
  stay byte-identical

Every exclusion is named with its reason in `DONOR.json`; the common reason is that a suite's
top-level `require` pulls in a donor host or fixture harness this migration deliberately does not
carry.

### 6.3 Real failures found and repaired during construction

- **The adapters gap.** `discovery.mjs` loads `./adapters.mjs` lazily; while that file did not exist,
  discovery degraded to an empty operations table and **every command-bearing plan step was dropped**.
  Closed by porting `adapters.mjs`; verified end to end against a temporary Node fixture:
  `detectProject` → `node`, `discoverCommands` → `install,build,test,focusedTest`, and `buildPlan` on a
  repair goal → **all six fix steps** with `reasons == []`. The port's own differential fuzz compared
  400 random fixtures × 9 adapters × detect/commands/artifacts = **10,800 comparisons, 0 divergences**.
- **Four donor test files failed to load** with `ERR_MODULE_NOT_FOUND`, because their copied import
  specifiers were one directory level short. Reported back, corrected by their author, now passing.
- **The census-fragile root capability tests broke for the third time** — see §8.2.

### 6.4 An arbitration the migration owner had to settle

A subagent's `supervisor.test.mjs` expected `report.result === 'FAILED'` for a refused episode. That
is **not donor behaviour**: donor `supervisor.cjs:766` assigns the result-validator's verdict straight
through, and donor `result.cjs:165` emits only `'COMPLETED' | 'REFUSED'`. The `'FAILED'` strings in the
donor's scenarios suite are synthetic autonomy *inputs*, not report assertions. I ruled that
`result.mjs` is faithful and must not be bent to satisfy a test, and had the expectations corrected
instead. A Verifier should confirm the port preserves that one-line assignment.

---

## 7. Data / error / recovery records

- **Errors** are donor-coded values with donor strings throughout: plan refusals (`PLAN_INVALID`,
  `PLAN_STEP_INVALID`, `CURSOR_INVALID`, `CURSOR_UNVERIFIED`), recovery refusals (`CHECKPOINT_MISSING`,
  `CHECKPOINT_OUTSIDE_ROOT`, `CHECKPOINT_SYMLINK`, `CHECKPOINT_SEQUENCE_REGRESSION`,
  `CHECKPOINT_SEQUENCE_CONFLICT`, `RECOVERY_ATTEMPTS_EXHAUSTED`, `CLAIM_ALREADY_OWNED`,
  `CLAIM_OWNER_UNKNOWN`, `CLAIM_NOT_OWNED`, `RECOVERY_INDEX_CORRUPT`), lock reasons
  (`held`/`stale`/`unavailable`/`lost`) and the nine result-gate refusal reasons.
- **Recovery.** Resume is a re-check: HEAD drift restarts, a moved workspace refuses, an unchanged
  world resumes. Automatic recovery is bounded, and the fourth attempt blocks the episode. The plan's
  cursor, verified and skipped step ids, and the plan digest are all checkpointed, so a resumed episode
  cannot skip verification.
- **Isolation.** The workspace lock is never stolen from a live owner, and an episode may not overwrite
  a file the user had uncommitted when it started; both rules are pinned by tests.
- **No secrets, no credentials and no unbounded terminal dumps** were recorded. The Mission's
  process/transport surfaces spawn only what the donor spawns (`git` for the fingerprint,
  `powershell.exe` for the Windows process-identity probe).

---

## 8. Known limitations

### 8.1 One deliberate divergence from the donor

Boss `planRecovery` crashes with a `TypeError` on an unknown failure class (the donor indexes
`RECOVERY_RULES[cls]` and dereferences `.inapplicable` with no guard). It now throws a **named** error
naming the class. Every donor-class behaviour is unchanged. This is the **only** deliberate behaviour
change in the whole migration and it is recorded in `DONOR.json` so a Verifier treats it as such rather
than discovering it.

### 8.2 A latent fragility on `main`, now repaired for the third time

`tests/capability-registry.test.mjs` and `tests/capability-adapters.test.mjs` hard-coded manifest
positions (`districts[0]`, `districts[2]`) and absolute census counts (`length === 6`, 5 `AVAILABLE`).
Declaring one new building broke three root tests — as it did on MB-002 and MB-005. The fixtures are
now census-relative (`districts.at(-1)`, baseline-relative counts, additions matched by capability-id
suffix).

**The root cause is worth the City owner's attention:** the identical repair now exists independently
on three mission branches, because each was branched from `c7ef3cd` and the fix never landed on
`main`. Whichever Mission merges first carries it; the other two will duplicate or conflict. A
separate repair on `main` is recommended.

### 8.3 The census cannot detect an undeclared module

`city/manifest.mjs`'s `checkManifestAgainstTree` validates only the modules the manifest *declares*; it
never flags a module **directory** that no entry mentions. That is why this module was invisible to the
census until it was registered by hand. It is now registered (§2), and the gap is recorded here as a
recommended separate repair.

### 8.4 Deferred union surface

The requirements-driven Execution DAG and the Boss acceptance-hub family are **deferred, not faked**
(§3.2). The union is therefore *partial by design*: the failure/recovery and CI-repair halves of the
Boss contribution are in, the requirements-graph-dependent half is not, and `index.mjs` does not
pretend otherwise. A Verifier should treat the deferred list as a boundary claim to test, not as an
omission to silently fill.

### 8.5 Two donor defects reproduced deliberately

Both are pinned by tests that name them, and neither was silently repaired, because both are
behaviour decisions for the City owner:

1. **The supervisor's bounded-retry arm is unreachable.** `decideAfterFailure` calls `recordAttempt`
   *before* `wouldBeBlind`, which then matches the entry just recorded, so `blind` is true on the first
   attempt and a `retry-bounded` failure always blocks. The scheduler's 30s/60s/120s/300s/600s backoff
   ladder is therefore never reached from the supervisor.
2. **A cancelled episode never releases the workspace lock.** The CANCELLED branch returns before the
   tail's `lock.release()`, so the workspace stays locked into the stale window (up to 30 minutes,
   `DEFAULT_STALE_AFTER_MS`).

`DONOR.json` lists these with the other six donor bugs found during the migration.

### 8.6 Repository-root default for checkpoints

The donor's `createCheckpointStore` default root resolves to the **repository** root when no
`root`/`dir` is given. Running the suite locally therefore created
`city/02-engineering/runtime/engineering/` inside the tree; it was removed and is not committed. The
module's own suites pass an explicit temporary `checkpointRoot`, so this only appears when a caller
takes the default, and `DONOR.json` records it as a default a host should override deliberately.

### 8.7 Android and second-host verification

This host cannot build the Android app (only JDK 25/26; CI uses temurin 21), and the Mission's
verification criteria call for a real Engineering job through MB-003 Worker Gateway on a second host.
Both are the Verification Host's work. No Android source was touched.

---

## 9. Utopia evidence pointers

Raw, git-ignored:

```text
.runtime/evidence/mission-book/MB-004/
├─ donor-hns/app/engineering/**        frozen donor copy used by the differential tests
└─ run-1/tests/
   ├─ city-tests.txt                   586 pass / 0 fail / 1 skipped
   ├─ donor-parity.txt                 146 / 146
   └─ supervisor-e2e.txt               23 / 23, including the real-git lifecycle episode
```

Structured, on the mission branch:

```text
data-records/evolution/inbox/mission-book/MB-004/events.jsonl
```

Events recorded (all `MIGRATION` / `Mech`): `MISSION_CLAIMED`, `ATTEMPT_STARTED` (twice),
`CHANGE_APPLIED`, `REPAIR_APPLIED`, `TEST_PASS`, `CI_RESULT`, `MIGRATION_COMPLETE`.

---

## 10. Branch HEAD / CI status

- Mission branch: `mission/MB-004-project-foreman`
- Implementation commit: `8a0d5d6af7fd8ac007474e8df39c802b069ab785`
- Final branch HEAD: `70806ad1277904c214f29f5da52cb5c7db1d90da`
- CI run: `36577933078` (`V0.2 checks`) on `faf6f7a011ff37ea427c592773bf837411964d7c`
- CI result: **PASS** — `gateway-web` success, `android` success.
- **The migration branch is NOT merged to `main`.** Merging is the Verification Host's action.

### 10.1 Two CI-only failures, diagnosed and fixed

The first push (`36576859825`) failed `gateway-web` on two tests that pass locally. Both were
environmental; neither was a port defect:

1. **`tests/donor/engineering-cross-volume-cleanup.test.mjs` failed to *load*.** The donor helper
   resolves an off-volume temp root at module scope and throws when the host has only one volume —
   which `windows-latest` has. Because it ran at module scope, the throw failed the whole file rather
   than one case. It is now resolved without throwing and each test skips with a **named reason**, so
   the suite reports honestly that cross-volume scratch ownership cannot be exercised on a
   single-volume host. The tests' bodies and assertions are unmodified, and the suite still passes
   **8/8** on a two-volume host.
2. **`tests/supervisor.test.mjs`'s deadline-floor assertion** failed against the revision committed
   mid-flight; on the current revision, which carries the §6.4 arbitration fix, it passes.

A Verifier on a single-volume host should expect the cross-volume suite to **skip rather than fail**,
and should read the skip reason before concluding anything about coverage.

### 10.2 Note on this document's history

This report was written, then lost to a `git reset --hard` used to pick up concurrent City commits
(host `Alien` claimed MB-007 in the meantime), and rewritten from the recorded mission events, the
commit messages and the evidence files. The note is kept because a Verifier should know the document's
provenance, and because the same mistake was made once before on MB-002.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/MIGRATION_REPORT.md)
