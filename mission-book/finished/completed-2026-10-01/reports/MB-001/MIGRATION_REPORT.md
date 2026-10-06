# Migration Report — MB-001

```text
MISSION = MB-001
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = cc45ea203801d2c34c40924f55b4fa92b9b9768e
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
IMPLEMENTATION_BRANCH = mission/MB-001-core-os
IMPLEMENTATION_HEAD = 8a7fe21e1ad860bbc06866344f97abda6fb9e165
IMPLEMENTATION_CI = 36566575068 PASS (gateway-web + android)
MIGRATION_HEAD = a71bf9080294390a3e2c1482bb53930519d1b3b3
MIGRATION_CI = 36566973111 PASS (gateway-web + android)
MIGRATION_COMPLETE = true
```

The implementation SHA is the tree that carries the migration itself; the migration head is
that tree plus the two closing process-event commits (`CI_RESULT`, `MIGRATION_COMPLETE`),
whose only content is `data-records/evolution/inbox/mission-book/MB-001/events.jsonl`. Both
SHAs were run through the required CI and both are green, so the recorded head is not an
unverified tree.

Written in the construction order the mission-book asks for, and deliberately including
the questions, the choices and the reasoning behind each choice. Sections 4 and 5 are
that record; they are not decoration, because most of this mission's difficulty was in
deciding what *not* to migrate.

---

## 1. 落地边界 / Landing boundary

- **Source → target**

  | Cluster | Donor source (frozen SHA above) | Target | Tests |
  | --- | --- | --- | --- |
  | A — owner sovereignty / root authority / root trust, protected-surface contracts | `src/shared/root-authority/contracts.ts`, `src/shared/root-authority/protected-surface.ts`, `electron/root-authority/protected-surface-guard.ts` (decision composition only) | `city/00-foundation/01-city-core/root-authority/` | 18 |
  | B — global task identity / lifecycle / durable state | `src/shared/candidate-gate.ts` §35 | `city/00-foundation/01-city-core/task-lifecycle/` | 11 |
  | C — cross-domain orchestration/routing, city-scope runtime coordination | `src/shared/fleet.ts`, `src/shared/capability-router.ts`, `src/shared/node-capabilities.ts`, `src/shared/adaptive-routing.ts` | `city/00-foundation/01-city-core/fleet-routing/` | 28 |
  | D — continuation/recovery, durable audit primitives | `src/shared/decision-ledger.ts`, `src/shared/candidate-gate.ts` §36, `src/shared/recovery.ts` §33.1–§33.2 | `city/00-foundation/01-city-core/audit-ledger/` | 42 |

  30 files, 288 509 bytes, 99 module tests, all TypeScript → plain ESM JavaScript with no
  new dependency. Every module carries a `DONOR.json` naming its donor paths, its
  adaptation, its known differences, its parity vectors and a four-way classification.

- **Preserved behavior** (per module; the full vector list is in each `DONOR.json`)

  - `root-authority`: the CODEOWNERS subset grammar (leading `/` root anchor, internal `/`
    root anchor, bare pattern matches basename at any depth, trailing `/` protects the
    directory entry and everything beneath it, `*` within a segment, `**` across
    segments, `?` one character), case-insensitive default, one rule per path as evidence,
    non-string ⇒ escape, `normalizeRepoPath` returning `undefined` for absolute / UNC /
    drive-letter / `..`-escaping input, rename classified on BOTH endpoints, delete
    classified like a write, and the composition escape ⇒ `DENY` / protected ⇒
    `REQUIRE_OWNER` / else `ALLOW`, with at most 5 escapes and 10 hits in the reasons.
    A differential fuzz harness transcribed the donor classifier verbatim and compared it
    with the port over ~93 000 generated cases (40 k regex compilation, 40 k
    normalization, 8 k assessment, 5 k CODEOWNERS parse) with **0 divergences**.
  - `task-lifecycle`: the §35 order `RUNNING → IMPLEMENTED → VERIFYING → REVIEWING →
    CANDIDATE → ACCEPTED`, the exact edge tables, the forward move landing on the next
    *declared* state (so a jump is inexpressible), `REPAIR` moving exactly one step back,
    `ACCEPTED` terminal against every event, the refusal reason naming the whole
    lifecycle, `awaiting_release_permission` true for everything except `ACCEPTED`, the
    epoch default for `created_at`, and `candidateIdFor`'s canonical sorted-NUL-SHA256
    form (pinned vector `cand-6f6181a33382dced`).
  - `fleet-routing`: the three heartbeat-age outcomes with closed boundaries
    (10 000 ms / 30 000 ms), first-fit routing in join order, capability gating, the three
    dropout outcomes with unrelated and completed assignments returned untouched,
    `eligibleCandidates`'s exclusion reasons and `blocked` derivation, the
    "never assume a capability" node self-inspection, and `expectedUtility`'s clamped
    formula and 4-decimal rounding.
  - `audit-ledger`: the ledger's field bounds (question 2000, 10 candidates of 200,
    chosen 2000, 50 evidence rows of 2000, rollback 2000, policy 200 — boundaries
    accepted, one past refused), immutable append with duplicate-id refusal, the summary
    shape including `rollbacks`, all seven §36 checks with their pass/fail reason strings,
    NOT_RUN-as-blocker, the `unchecked`-removals fail-closed rule, the lexical Owner
    override threshold, the four theme checks, and §33.1–§33.2 failure classification,
    recovery planning and the budget/exhaustion/terminal rules.

- **Explicitly not migrated**

  - `electron/state-core/**` — the durable-state layer. It is a genuinely closed 10-file
    set but sits on `database.ts`, which reaches `node:sqlite` through
    `createRequire(process.cwd())`. Driver choice there is a separate decision, so cluster
    B landed as the *lifecycle and identity* half, not the persistence half.
  - `src/shared/autonomous-evolution-trust.ts` and the trust plane around it — it
    value-imports `acceptance-contracts.ts`, which pulls `desktop-black-box-contract.ts`
    and `hash.ts`, and it is the donor's own self-certification judge rather than a
    portable primitive.
  - `src/shared/evidence-ledger.ts` and `coordination-ledger.ts` — the real cluster-D
    couplers: `evidence-ledger` value-imports `execution-planner` and `requirements-graph`,
    and `requirements-graph` value-imports `tenx/knowledge.ts`. Migrating them would drag
    a second domain across the boundary.
  - The whole `electron/root-authority/` closure beyond the decision composition.
    `protected-surface-guard.ts` value-imports `electron/engineering/native-tools.ts`,
    which reaches `node:child_process` through `git-gateway` and `process-gateway` and is
    circular with `command-runner`; the full electron-A closure is 25 files.
  - `root-policy.ts` and `secret-scan.ts` (the policy-and-scanning floor), the
    operation-level classifier, run modes, execution profiles, `RootIdentity`,
    `authority-planes.ts`, `promotion-state.ts` and the promotion gate.
  - `planHnsFallback` / `recordHnsUsage` / `HNS_ROLES` / `MAX_CONSECUTIVE_HNS_CALLS` — a
    named external executor's invocation budget, not a recovery primitive. The ladder's
    `HNS_FALLBACK` rung and `plan.hns_allowed` ARE kept, because those are §33.2's own
    ordering rules.
  - The donor's task vocabulary that is entangled with the Boss provider/council runtime
    (`TaskStatus` queued/running/waiting/paused/cancelled/completed/failed, `BossTask`,
    the `UserTaskState` projection), and `session-lifecycle.ts` (provider/account domain).

- **Contract / interface boundary**

  Exported pure functions over plain serializable values. No fs, no network, no Electron,
  no clock, no `process.env`, no ambient I/O: time and ids are parameters, and every
  random or clocked value is injected. A module never constructs a container it cannot
  validate, and a shape factory copies arrays but passes a malformed non-array through
  untouched so validation stays the single gate.

- **Existing Utopia UI / real-consumption path**

  `services/dev-gateway/server.mjs` — the real task/control flow both Web and Android
  drive. `POST /api/v0/node/claim` no longer re-derives "can this node accept this work?";
  the decision is `acceptsWork` from the migrated `fleet-routing` module, with Utopia's
  policy supplied as data (`REQUIRED_TASK_CAPABILITIES = ['task.execute.safe',
  'filesystem.temp']`, and `claimNodeFor` mapping the gateway's own liveness truth onto
  the Core's node state). `tests/gateway.test.mjs` proves the running gateway agrees with
  the Core and refuses exactly what the Core refuses, over a real loopback gateway and
  real HTTP. No new UI was built.

---

## 2. 测试与运行 / Tests & runtime

- **Unit / contract / parity**: 99 module tests across the four modules. Full
  CI-equivalent suite on this branch: `pnpm test` 60/60, `apps/rooms` 67/67,
  `node city/test-all.mjs` 229/229, `node scripts/verify-promotion-history.mjs` 10
  records verified, `pnpm check:docs` `PAIR_STATUS = SYNCHRONIZED` for docs, evidence and
  data-records. Android lane on this host: `:app:testDebugUnitTest :app:assembleDebug`
  **BUILD SUCCESSFUL**, `app-debug.apk` 10 488 900 bytes.
- **Real consumption**: `tests/gateway.test.mjs :: the node-claim decision is owned by the
  migrated City Core` — plus the pre-existing gateway test, unchanged and still green.
- **Failures encountered**: five, all recorded as `TEST_FAIL`
  (`MB-001:1464839cde7ea8b6`). Four were pre-existing tests that had encoded *positional*
  or *global-count* assumptions about the City manifest, which the legitimate addition of
  the `00-foundation` district invalidated; the fifth was a defect in my own
  `audit-ledger` factory, caught by a new test before commit.
- **Repairs applied** (`MB-001:653e5fe245c095fb`): see §4, decision D8.
- **Known limitations** — see §6.

---

## 3. Utopia 狗粮 / Evolution handoff

- **Evolution inbox**: `data-records/evolution/inbox/mission-book/MB-001/events.jsonl`
  (7 events, on the mission branch, not merged to main by this host).

  | Event | Type | Outcome |
  | --- | --- | --- |
  | `MB-001:246c0bfe93cb1d17` | MISSION_CLAIMED | INFO |
  | `MB-001:cac627e4f2073968` | ATTEMPT_STARTED | INFO |
  | `MB-001:231528cdcc26ea2f` | CHANGE_APPLIED | INFO |
  | `MB-001:1464839cde7ea8b6` | TEST_FAIL | FAIL |
  | `MB-001:653e5fe245c095fb` | REPAIR_APPLIED | REPAIRED |
  | `MB-001:c7599ac438f7d2e4` | TEST_PASS | PASS |
  | `MB-001:0a756cb77839c3b6` | RUNTIME_PASS | PASS |

  A `CI_RESULT` event is appended by the same host once the hosted run settles; the
  `MIGRATION_HEAD` above is the branch head *before* that append.

- **Candidate evidence**: none published to `evidence/raw/mission-book/MB-001/`. Nothing
  here is needed cross-host beyond the branch itself plus the reports, so per the process
  policy the bulky material stayed local.
- **`.runtime` evidence** (git-ignored, this host):
  `.runtime/evidence/mission-book/MB-001/run-001/donor-survey/DONOR-SURVEY-REPORT.md`
  (73 KB, the per-file donor coupling survey that grounds the boundary decisions) with its
  four read-only analysis scripts, and `.runtime/mb001-android-build.log`.

---

## 4. 施工中的问题、选择与判断逻辑 / Problems, choices and the reasoning

Each entry is a point the mission did not specify. The choice is stated first, then why,
then what it costs.

**D1 — How much of a 300-file donor is "the Core OS"?**
*Choice:* four modules, one per cluster the mission names, each restricted to the donor's
*provably self-contained pure* core, with everything else declared `DEFERRED` in
`DONOR.json`. *Why:* the mission lists four behaviour groups, so a module per group is the
honest reading; and the survey proved by complete transitive closure which donor files are
runtime leaves (cluster C is three import-free files; cluster A's classifier has zero
imports). *Cost:* the donor's persistence and trust-judge planes are not migrated. That is
declared, not hidden.

**D2 — The City manifest says a module is only registered after a Room Pack promotion, and
`city/docs/{en,zh-CN}/ARCHITECTURE.md` says exactly that. A mission migration has no Room.**
*Choice:* register the modules as `PROMOTED` with a **mission-derived incubation identity**
(`mb-001-<module>-lab`) plus a machine-checked `mission` block, and extend the city
architecture docs to state the two identities. *Why:* (a) registering a mission migration
as a Room Pack promotion would be false provenance — no room ever ran; (b) leaving the
modules unregistered would put live code in `city/` that the manifest does not describe,
which is worse; (c) `mb-001-<module>-lab` cannot be mistaken for a Room Pack room, and
`city/tests/manifest.test.mjs` now *refuses* a module that claims one without a matching
`mission` block **and** a `DONOR.json` that agrees field by field. *Cost:* the manifest
gains a second incubation identity, documented in the manifest description and both
architecture docs. This is process bookkeeping, not a product capability.

**D3 — `city/docs/.../ARCHITECTURE.md` §5 forbids modifying `services/dev-gateway/**`;
MB-001's Verification gate demands that an existing task/control flow really consume the
migrated Core.**
*Choice:* the mission-book governs for MB-001. Consumption was wired into the existing
gateway as an **equivalence-preserving rewiring**, and §5 was amended in both languages to
state the reconciliation precisely: consumption may reach `services/**` when the
mission-book requires it, and the protocol/semantics freeze stays absolute. *Why:* the
mission-book is the newer, Owner-defined control plane for this exact task and explicitly
names "Services/Tasks" as a legitimate consumption surface. A Core nothing consumes is not
a migration, it is a library. *Cost:* a wave-era freeze sentence is now qualified. The
freeze that matters — City Control Protocol, Gateway API v0 shapes, runtime node task state
names, event names, payload shapes and the Android contract — is unchanged and is asserted
by the tests.

**D4 — Only one cluster could be consumed without inventing semantics.**
*Choice:* consume `fleet-routing` in the gateway; land `root-authority`,
`task-lifecycle` and `audit-ledger` with parity tests and record them as
**landed-but-not-yet-consumed boundaries**. *Why, concretely:*
- `task-lifecycle` — the gateway's task states are `QUEUED / ASSIGNED / RUNNING /
  COMPLETED / FAILED / CANCELLED`; the donor's §35 lifecycle is `RUNNING / IMPLEMENTED /
  VERIFYING / REVIEWING / CANDIDATE / ACCEPTED`. Wiring it would require *inventing a
  mapping* between two vocabularies, which is precisely what `MIGRATION_ONLY` forbids.
- `audit-ledger` — the gateway's `store.event(...)` journal has no notion of a decision
  (问题 / 候选 / 选择 / 证据 / 结果 / 是否回滚) or of a candidate gate, so encoding its
  events as ledger entries would mean inventing decisions that were never made.
- `root-authority` — no existing Utopia product surface has an owner-approval or
  protected-surface concept. Rule 14 of the mission-book says to record that as a boundary
  rather than dress a new feature up as a migration, so that is what this is.
  *Cost:* three modules ship without a product consumer. That is stated rather than
  papered over, and it is the first thing the verifier should attack.

**D5 — Adding the district made the capability registry advertise four kernel modules to
Web and Android as "unavailable capabilities".**
*Choice:* declare `00-foundation` with `kind: "infrastructure"` (validated in
`city/manifest.mjs`) and teach `services/capability-bridge/registry.mjs` to skip
infrastructure districts. *Why:* `registry()` turns every manifest module without an
adapter into an `inputKind: 'unavailable'` capability, which is right for a domain module
awaiting a bridge and wrong for runtime kernel. Advertising kernel modules as capabilities
would have changed the capability list both clients see — and would have been the "fake a
product surface" move the mission forbids. *Cost:* one new manifest field and a two-line
registry filter; the five domain adapters are asserted unaffected.

**D6 — The donor's protected-path list is Boss-specific policy.**
*Choice:* do **not** bake in a protected manifest for Utopia. `compileProtectedSurface`
takes the manifest as a caller option; the donor's list is exported as frozen, inert data
(`DONOR_ROOT_PROTECTED_MANIFEST`) read by nothing, and a test pins that a no-option
classifier protects nothing. *Why:* MB-001 forbids "任何新的 authority policy 或新的治理
语义". Choosing which Utopia paths are owner-protected is an Owner decision, not a
migration step. *Cost:* the module is mechanism without a policy; whoever adopts it must
supply one. Declared in `DONOR.json`.

**D7 — `candidate-gate.ts` spans two clusters.**
*Choice:* split it: §35 (the lifecycle) into `task-lifecycle` (cluster B), §36 (the
Guardian gate) into `audit-ledger` (cluster D). *Why:* the mission defines the clusters,
not the donor's file layout, and a lifecycle and a release gate are different primitives.
*Cost:* one donor file has two target modules; both cite the same donor and both say so.

**D8 — Five test failures from a legitimate manifest change.**
*Choice:* repair each by **removing the assumption the change invalidated**, never by
relaxing an assertion: positional district lookups (`districts[0]`, `districts[1]`,
`districts[2]`) became lookups by id; two global-count assertions (`unavailable.length`,
`catalog.length`) were scoped to the module refs under test; a missing `readFile` import
was added; and the `audit-ledger` factory was fixed to stop spreading a string into a
character array, which had been turning an invalid ledger entry into a valid one. *Why:*
each test's *stated* intent is about behaviour, and its intent is preserved exactly;
relying on district ordering or on "no other unbridged module exists" was incidental.
*Cost:* none of the assertions was deleted, skipped or weakened, and no threshold moved.
Recorded as `TEST_FAIL` + `REPAIR_APPLIED` so the verifier can check this claim rather
than take it.

**D9 — Host environment.** `pnpm` is not on `PATH`; `corepack pnpm@11.19.0` (the version
CI pins) works, so that is what was used. Note `pnpm mission:event -- --mission ...`
forwards the literal `--` to the script and fails; the working form is
`pnpm mission:event --mission ...`. Recorded because the process docs show the `--` form.

**D10 — Donor metrics in circulation are inconsistent.** The donor's own
`PRE_CITY_FREEZE_MANIFEST.json` records 258 unit test files / 3274 tests at commit
`23e1541`; a direct count at the frozen baseline `8df428e` gives **301 test files /
3793 `it()` cases**. The two are measurements at different commits and both may be true.
This report cites only the frozen baseline, and flags the difference rather than picking
whichever number sounds better. Likewise the survey corrected the brief on several donor
paths that do not exist (`electron/root-authority/contracts.ts`, `src/shared/state-*.ts`).

---

## 5. Files a verifier should read first

Independent-review hints only — no conclusion is suggested here.

- `city/00-foundation/01-city-core/*/DONOR.json` — the declared landing boundary per module,
  including every `DEFERRED` item and every `UTOPIA_EXTENSION` (three modules declare none;
  `task-lifecycle` declares three derived query helpers, `fleet-routing` one composition
  helper, `audit-ledger` two conveniences — each is argued in place).
- `city/tests/manifest.test.mjs` — the census and the mission-incubation provenance
  contract.
- `services/dev-gateway/server.mjs` (import, `REQUIRED_TASK_CAPABILITIES`, `claimNodeFor`,
  the `node/claim` route) and `tests/gateway.test.mjs` — the real-consumption claim.
- `services/capability-bridge/registry.mjs` — the infrastructure-district exclusion.
- `city/docs/{en,zh-CN}/ARCHITECTURE.md` — the documented reconciliation of D2, D3 and D5.
- `tests/capability-registry.test.mjs`, `tests/capability-adapters.test.mjs`,
  `city/tests/manifest.test.mjs` — the D8 repairs, to check nothing was weakened.

## 6. 已知限制 / Known limitations

1. Clusters A, B and D have **no product consumer** (D4). If the verifier judges that
   MB-001 requires all four clusters to be consumed, this mission is not complete.
2. `root-authority` ships **mechanism without policy** (D6): no protected manifest is
   active for Utopia.
3. Cluster B is the **identity/lifecycle** half only; the donor's durable-state
   persistence layer was not migrated (D1, `node:sqlite` driver decision pending).
4. The donor's `evidence-ledger` / `coordination-ledger` were not migrated (D1), so the
   cluster-D boundary is narrower than the donor's own D surface.
5. The Android lane was green on this host but every Gradle task was **UP-TO-DATE** —
   nothing under `apps/android/**` changed, so this is "unaffected and green", not a fresh
   compile of a changed input.
6. The hosted CI result is recorded in `MIGRATION_CI`; the branch was not merged to
   `main`, as the mission-book requires of the migration host.

## 7. 交给验证主机 / Handoff to verifier

- Verification must be performed by a **different host**. This host (`Alien`) has
  participated in MB-001 and may not claim its Verification stage.
- Branch HEAD: `a71bf9080294390a3e2c1482bb53930519d1b3b3` on
  `zhiheng-zhang-Mera/utopia`, branch `mission/MB-001-core-os`.
- Hosted CI, all three pushes on that branch: implementation `36566575068` PASS,
  final branch `36566973111` PASS, and the claim-stage push
  `36564561252` PASS.
- The migration host did **not** merge, and did **not** run `pnpm mission:finalize`.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/MIGRATION_REPORT.md)
