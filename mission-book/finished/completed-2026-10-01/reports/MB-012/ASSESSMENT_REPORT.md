# Assessment Report — MB-012

```text
MISSION = MB-012
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST = Mech
CLAIM_COMMIT = 2cc352197bf98dbfefcfd9058ee9d6769a516bc9   (Digital-City main)
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080
UTOPIA_MAIN_BASELINE = zhiheng-zhang-Mera/utopia@756c7d760c605e33ba386e87605e078fe24b82ca
ASSESSMENT_BRANCH = mission/MB-012-runtime-compliance
ASSESSMENT_HEAD = d071328d8f68ba1ddd5e8a1fde11718e75fd6672
ASSESSMENT_RESULT = NO_VALUE
```

```text
PLANNED_CAPABILITIES = RC-01, RC-02, RC-03, RC-04, RC-05   (count 5)
SELECTED_GAP_CLOSURES = none
ABANDONED_CAPABILITIES_AND_REASONS =
  RC-01 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR
  RC-02 UTOPIA_SUPERIOR + OBSOLETE_DONOR
  RC-03 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR
  RC-04 OBSOLETE_DONOR + DUPLICATE_EQUIVALENT + NO_REAL_CONSUMER
  RC-05 UTOPIA_SUPERIOR
ASSESSMENT_RESULT = NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

## 0. 领取依据 / Why this Mission was claimable

```text
P0 (verification / integration): NONE eligible.
   MB-001..MB-011 all closed; every mission branch AheadOfMain = 0 at utopia@756c7d7.
P1A (assessment-first): MB-012 is the last enabled assessment-first Mission (seq 12)
   with assessment_complete = false and an unclaimed stage.
```

**This Mission was NOT dismissed as "already covered".** MB-002's
`capability-fabric/DONOR.json` explicitly deferred work to it:

```text
"Codex-Boss electron/capability/capability-broker.ts, authorization.ts and
 permission-contract.ts are NOT migrated: they are the admission/authorization seam
 owned by MB-011/MB-012."
DEFERRED: "permission and authorization resolution (MB-012 Runtime Compliance)"
```

So MB-012 is the named owner of the deferred Codex-Boss permission/authorization
resolution, and the assessment was run on its merits. The evidence below shows the
deferral is **not** a migration opportunity.

Two boundaries were treated as binding throughout, because the Mission forbids them:
**Owner/Root authority source** and **constitutional protected-surface definition**.
`DEFAULT_ROOT_POLICY.rootOwner`, `ROOT_PROTECTED_MANIFEST` and `OWNER_AUTHORITY_PATHS`
were therefore read for context only and are never proposed for migration. Qualification
and promotion control (`promotion-state.ts`, `promotion-controller.ts`) is likewise out
of scope and reported for context only.

## 1. 计划能力 / Planned donor capabilities

| ID | Planned capability | Donor anchors located |
|---|---|---|
| RC-01 | privilege / cross-domain / protected-resource access enforcement | `electron/root-authority/protected-surface-guard.ts`, `electron/root-authority/root-authority.ts` (`enforce` → `RootDeniedError`), `src/shared/permission.ts` (`desktopMutationGate`, `manifestAllows`), `src/shared/guardian.ts` (`changeAllowed`), `electron/root-authority/execution-profile.ts` |
| RC-02 | service / capability registration enforcement hooks | `electron/capability/capability-broker.ts`, `electron/capability/authorization.ts`, `electron/capability/permission-contract.ts`, `electron/capability/integration/execution-authorization.ts`, `electron/capability/integration/boundary-inventory.ts` |
| RC-03 | authority escalation rejection | `src/shared/root-authority/authority-planes.ts` (`effectiveChangeClass`, `decideAuthorityAction`), `electron/root-authority/root-authority.ts` named `refuse*` guards, `src/shared/guardian.ts` |
| RC-04 | runtime-policy decision application | `.codex-boss/config/runtime-policy.json` + `.schema.json`, `electron/commander/runtime-policy.ts`, `src/shared/policy.ts`, `src/shared/network-policy.ts` |
| RC-05 | audit-friendly runtime verdict / enforcement evidence | `electron/root-authority/root-audit-ledger.ts`, `src/shared/root-authority/promotion-state.ts`, `scripts/permission-surface-report.cjs`, `electron/capability/integration/boundary-inventory.ts` |

Planned capability count = **5**. All 24 surveyed donor paths exist at the frozen commit.

## 2. Donor source map and lifecycle (the decisive finding)

A read-only survey of the 24 donor enforcement modules established three facts.

### 2.1 Only five refusal paths are actually live in the shipped app

```text
1. desktop mutation gate            electron/commander/main-commander.ts:701
                                    (desktopMutationGate / manifestAllows, fail-closed)
2. software action manifest gate    electron/software/software-runtime.ts:88
3. Guardian-token gate              workbook-dispatch.ts:233, secret-vault-store.ts:37,
                                    self-mod-sandbox.ts:118/159
4. host-operation privilege         electron/self-evolution/host-operations.ts:149
                                    (RootAuthority DENY -> throw)
5. promotion gate Root-Surface stop electron/promotion-gate/promotion-controller.ts:202
                                    (OUT OF SCOPE: qualification/promotion control)
```

The donor's live enforcement is therefore **narrow**, and it is narrower still once the
out-of-scope promotion path is removed.

### 2.2 The layer this Mission points at never runs

The entire `electron/capability/*` family has **zero non-test production callers**:

```text
createCapabilityBroker     callers: scripts/permission-surface-report.cjs + tests
invokeThroughBroker        callers: execution-authorization.ts + report script + tests
evaluate (authorization)   callers: capability-broker.ts + report script + tests
gateAuthorizer             callers: NONE outside tests
authorizeExecution         callers: NONE outside tests
```

The decisive wiring fact: `electron/main.ts:1003` constructs `new ExecutionGate()` with
**no options**, so `ExecutionGateOptions.authorizer` is `undefined` and the
`if (this.authorizer)` block inside `execution-gate.ts` never executes. The code's own
`boundary-inventory.ts` self-declares most boundaries as `legacy` and only
`execution-gate.ts` + `integration/execution-authorization.ts` as `mapped` — and even
those two are aspirational in the shipped app, because the gate is never built with an
authorizer.

### 2.3 The runtime-policy file has no consumer at all

```text
.codex-boss/config/runtime-policy.json       parsed by: NOTHING
.codex-boss/config/runtime-policy.schema.json  validated by: NOTHING (no ajv/schema validator in the repo)
electron/commander/runtime-policy.ts         exports NOTHING; loadRuntimePolicy is
                                             module-private with zero callers
live bound is a DIFFERENT object             electron/commander/scheduler.ts:38 SchedulerPolicy.maxParallel
```

The only other references are `electron/repro-snapshot.ts` (SHA-256s the file into a
reproduction snapshot — a hash, not a parse) and a report script that lists it as
"referenced".

### 2.4 Escalation rejection is CI-script-only; the audit ledger is never read

- `authority-planes.ts` has exactly **one** caller:
  `scripts/runtime-intelligence-diff-guard.cjs:64`. The named
  `refuseSelfElevation` / `refuseOwnerIdentityChange` / `refuseDirectMainPush` /
  `refuseOwnerCredentialAccess` / `refuseRepositoryAdministration` /
  `refuseStaleShaPromotion` / `refuseArbitraryShell` / `refuseWorkspaceEscape` and
  `acceptOwnerClaim` have **zero production callers**.
- `root-audit-ledger.ts` is written on live paths but read only by
  `RootAuthority.history()`, whose callers are tests. The one donor verdict reaching a
  live surface is the *owner-intervention* ledger (`host-status-ipc.ts:259`).
- Its integrity mechanism is an **unkeyed** SHA-256 hash chain: tamper-evident against
  naive edits only, and not a MAC or a signature.
- **No cryptographic verification exists**: `createVerify`, `verifySignature`,
  `publicKey`, `x509`, `createHmac` have **0 hits** in `electron/` and `src/`. The only
  signing is an outbound GitHub App JWT.
- Dead code inside otherwise-live files: `assessWorkspaceChanges`
  (protected-surface-guard.ts:208, not even exported), `autonomousCeiling` and
  `protectedPathFor` (root-authority.ts:341/346), `EvolutionExecutionProfile`'s three
  `assert*` methods, `guardedGrant`, `writeRootPolicy`.

### 2.5 Two verdict-precision defects (relevant to RC-05)

`authorization.ts` reports an unresolvable **subject** with `reason:
"unresolvable-resource"`, and `execution-authorization.ts` reuses the same reason for an
unmapped execution **kind**. A migration of RC-05 evidence quality would have to carry
that imprecision forward or fix it, and fixing it is not migration.

## 3. Utopia 当前能力 / Claim-time Utopia inventory (baseline `756c7d7`)

`city/01-governance/02-runtime-compliance` — the candidate target — does not exist, and
no `01-governance` district exists. Per City R2 that alone proves nothing; the semantic
inventory follows.

| Concern | Utopia implementation | Kind |
|---|---|---|
| protected-resource / containment enforcement | `city/00-foundation/01-city-core/root-authority/guard.mjs` — escape ⇒ `DENY`, protected hit ⇒ `REQUIRE_OWNER`, else `ALLOW`; a rename is classified on **both** source and destination; a delete is classified like a write; case-insensitive; injected containment seam; bounded coded reasons. Ported by MB-001 from `electron/root-authority/protected-surface-guard.ts` | migrated module + tests |
| cross-domain / scope enforcement | `city/00-foundation/01-city-core/audit-ledger/guardian-gate.mjs` `SCOPE_VALIDATION` — a write outside the granted scope is `FAIL`, and `DESTRUCTIVE_CHANGE_CHECK` — an unapproved removal is `FAIL` | migrated module + tests |
| computer side-effect permission gate | `city/10-automation/01-computer-use-runtime/backend-surface/permission.mjs` + `computer-recovery.mjs` — `COMPUTER_MUTATION_ACTIONS`, task-scoped `computer:<action>` grants, **migrated by MB-008 from the same donor `src/shared/permission.ts`** | migrated module (MB-008) |
| authority / escalation gate | `guardian-gate.mjs` — `ACCEPTED` is unreachable without a **named verdict for every required check**; `NOT_RUN` is a blocker rather than a pass; Owner-override compliance is checked lexically. Plus `task-lifecycle` `awaiting_release_permission` and `root-authority/contracts.mjs`'s three-valued strictest-decision order with an immutable floor table | migrated modules + tests |
| capability registration enforcement | `capability-fabric/registry.mjs` — registration-time refusal of nameless, ownerless, undescribed, duplicate-owner (naming both owners) and priority conflict; `services/capability-bridge/registry.mjs` — moduleRefs resolution, ownership, duplicate-owner refusal, district/building kind gating | live module + service |
| live invoke enforcement | `services/capability-bridge/bridge.mjs#invoke` — `CAPABILITY_NOT_FOUND` 404, `BRIDGE_PENDING` 409, `OPERATION_BLOCKED`, `BUSY` 429, `RESULT_TOO_LARGE`, worker isolation via `resourceLimits`, 20 s timeout, migrated circuit breaker | live service |
| runtime-policy application | `services/dev-gateway/server.mjs` — `apiVersion`/`schemaVersion` 0 required else **409**; separate control/node tokens (refuses to start if equal); refuses `0.0.0.0`/`::`; request size limits; task ownership **403**; transition validity **409**; progress monotonicity **400**; pairing session single-use/expiry/attempt-lock **410/429/403**; durable event stream + WS | live service |
| provider-level enforcement | `capability-fabric/providers.mjs` — installed/enabled/loaded/healthy as four independent facts, disabled refused a load unless forced, health ladder, bounded restart budget; `04-restart-recovery-station` fail-closed checkpoint gate + restart lock + checksummed ticket | migrated modules |
| computer-use safety gates | `city/10-automation/01-computer-use-runtime/routing-safety` (MB-008) — destructive-action and focus/foreground/modal gates, secret redaction, evidence risk grading | migrated module |
| audit-friendly verdicts | `guardian-gate.mjs` — every check carries `verdict` + `inspected[]` + `reasons[]` and the result carries a `blocking[]` list and bounded reason counts; `audit-ledger/decision-ledger.mjs` + `recovery.mjs`; gateway event stream consumed by `apps/web`; `data-records/evolution/episodes` with `inboxDigestSha256` | migrated modules + live service |
| client-side gate | `apps/android/.../CapabilityPolicy.kt` (`canInvokeCapability`) | live client |

Anchors searched and confirmed: `city/00-foundation/01-city-core/**`,
`city/00-foundation/03-capability-fabric/**`, `services/capability-bridge/**`,
`services/dev-gateway/**`, `city/02-engineering/01-project-foreman/**`,
`city/02-engineering/02-worker-gateway/**`, `city/10-automation/**`, `apps/android/**`,
`city/CITY_IMPLEMENTATION_MANIFEST.json`, `contracts/**`, plus repo-wide greps for
`permission`, `sideEffect`/`side-effect`, `protectedSurface`, `validateManifest`,
`uninstall`, `rollback`, `01-governance`, `runtime-compliance`.

Repo-wide grep results worth recording: the only occurrences of `customs` /
`runtime-compliance` framing in Utopia are MB-002's deferral note and its module header;
there is no separate permission/authorization engine, because the enforcement is carried
by the Guardian gate, the capability fabric and the gateway itself.

## 4. Capability comparison matrix

| ID | Donor capability | Donor evidence | Utopia equivalent / current behavior | Coverage | Gap | Decision | Reason code | Evidence |
|---|---|---|---|---|---|---|---|---|
| RC-01 | privilege / cross-domain / protected-resource access enforcement | `protected-surface-guard.ts` (`escapes⇒DENY`, `hits⇒REQUIRE_OWNER`, else `ALLOW`; **3 production callers**); `root-authority.ts#enforce` throws `RootDeniedError`; `desktopMutationGate`/`manifestAllows` live; `changeAllowed` live at 4 sites; `execution-profile` assert* methods **test-only** | `root-authority/guard.mjs` carries the same composition rule plus rename/two-sided and case-insensitivity; `guardian-gate.mjs` `SCOPE_VALIDATION` + `DESTRUCTIVE_CHANGE_CHECK`; MB-008 migrated the computer side-effect permission gate from the same `permission.ts`; live gateway per-route auth + binding + token separation; live bridge operation allowlist | EQUIVALENT | None material. The donor's extra surface is test-only, and what is live already has a migrated or live counterpart | ABANDON | `DUPLICATE_EQUIVALENT`, `OBSOLETE_DONOR` | `root-authority/guard.mjs`, `guardian-gate.mjs`, `backend-surface/permission.mjs`, `server.mjs`, `bridge.mjs` |
| RC-02 | service / capability registration enforcement hooks | `capability-broker.ts` refuses duplicate capability/undescribed provider/duplicate grant, `authorization.ts` default-deny `evaluate`, `permission-contract.ts#validateGrant` — **all zero non-test production callers**; `main.ts:1003` builds `ExecutionGate` with no authorizer | `capability-fabric/registry.mjs` registration refusals; `capability-bridge/registry.mjs` ownership; **live** `bridge.mjs#invoke` (`CAPABILITY_NOT_FOUND` 404, `BRIDGE_PENDING` 409, `OPERATION_BLOCKED`, `BUSY` 429, `RESULT_TOO_LARGE`, worker `resourceLimits`); Android `CapabilityPolicy` | SUPERIOR | None. The donor's registration enforcement is unreachable from production; Utopia's is live, tested and consumed | ABANDON | `UTOPIA_SUPERIOR`, `OBSOLETE_DONOR` | `capability-fabric/registry.mjs`, `capability-bridge/registry.mjs`, `bridge.mjs`, `CapabilityPolicy.kt` |
| RC-03 | authority escalation rejection | `authority-planes.ts#effectiveChangeClass` throws on autonomous downgrade + `decideAuthorityAction` DENY (3 codes) — **1 caller, a CI script**; named `refuse*` guards and `acceptOwnerClaim` **test-only**; `changeAllowed` live | `guardian-gate.mjs` makes `ACCEPTED` unreachable without a named verdict for every required check, treats `NOT_RUN` as a blocker, requires Owner approval for removals, and checks override compliance; `task-lifecycle` `awaiting_release_permission`; `root-authority/contracts.mjs` floor table | EQUIVALENT | None. The donor's escalation rejection is CI-script-only and test-only; Utopia's migrated gate enforces a strictly stronger property | ABANDON | `DUPLICATE_EQUIVALENT`, `OBSOLETE_DONOR` | `authority-planes.ts`, `guardian-gate.mjs`, `task-lifecycle/contracts.mjs`, `root-authority/contracts.mjs` |
| RC-04 | runtime-policy decision application | `.codex-boss/config/runtime-policy.json` — **no consumer**; `.schema.json` — **no validator in the repo**; `runtime-policy.ts` **exports nothing**, `loadRuntimePolicy` zero callers; live bound is a different object (`SchedulerPolicy.maxParallel`) | Live gateway enforcement: protocol version 409, token separation, wildcard-bind refusal, size limits, ownership 403, transition 409, progress 400, pairing 410/429/403; `providers.mjs` lifecycle + health ladder; computer-use routing-safety gates; bridge circuit breaker | SUPERIOR | None. The planned capability does not exist as a live donor behaviour, so there is nothing to migrate | ABANDON | `OBSOLETE_DONOR`, `DUPLICATE_EQUIVALENT`, `NO_REAL_CONSUMER` | `runtime-policy.json`, `runtime-policy.ts`, `scheduler.ts:38`, `server.mjs`, `routing-safety/**` |
| RC-05 | audit-friendly runtime verdict / enforcement evidence | `root-audit-ledger.ts` written on live paths but **read only by tests**; **unkeyed** SHA-256 chain; `createVerify`/`verifySignature`/`publicKey`/`x509`/`createHmac` = 0 hits; `promotion-state.ts` verdicts are out-of-scope promotion control | `guardian-gate.mjs` verdicts carry per-check `verdict` + `inspected[]` + `reasons[]` and a `blocking[]` list with bounded reason counts; `decision-ledger.mjs` + `recovery.mjs`; gateway event stream consumed by the Web UI; verified evolution episodes with `inboxDigestSha256` | SUPERIOR | None. The donor generates evidence nothing reads, with no cryptographic integrity; Utopia's verdicts are audit-friendly by construction and consumed | ABANDON | `UTOPIA_SUPERIOR` | `root-audit-ledger.ts`, `guardian-gate.mjs`, `decision-ledger.mjs`, `server.mjs`, `episodes/**` |

## 5. Verdict

### NO_VALUE

> **判断无价值，任务保留，未迁移**

Why *not* copying the donor is the correct engineering choice here:

1. **The deferred layer never runs in the donor.** The `electron/capability/*` family —
   broker, authorization, permission-contract, execution-authorization — has zero
   non-test production callers, and the composition root builds `ExecutionGate` with no
   authorizer so the hook cannot fire. Lifting it would import well-written but
   unreachable code, and claiming it as "working enforcement" would over-claim.
2. **RC-04's capability does not exist as a live donor behaviour.** The runtime-policy
   JSON is parsed by nothing, its only reader exports nothing, and no schema validator
   exists. There is literally no behaviour to migrate.
3. **RC-03 is CI-script-only and RC-05's ledger is never read.** The donor's escalation
   rejection has one caller outside tests — a standalone diff-guard script — and its
   audit chain is unkeyed, with no signature verification anywhere in `electron/` or
   `src/`.
4. **What is live is already migrated.** MB-008 migrated the computer side-effect
   permission gate from the same `src/shared/permission.ts` this Mission names, and
   MB-001 migrated the protected-surface guard and the Guardian gate from the same
   donor commit.
5. **Utopia's enforcement is live and consumed.** A real bounded run measured the
   bridge and the gateway refusing on live paths, and the city suite (1807 tests)
   covers the migrated enforcement modules.
6. **A second enforcement engine would duplicate truth.** The Mission's own verification
   gate forbids copying City Core / Capability Fabric enforcement into a second source
   of truth. That is exactly what a `01/02 Public Security` engine built from the
   donor's broker would do.

**Note on the MB-002 deferral.** As with MB-011, `DEFERRED ... owned by MB-012` is a
pointer, not a validated finding. Testing it is what converts it into either a migration
or an honest negative result. Here the tests resolve it: the deferred layer is
production-unreachable inside its own repository, and the enforcement that does run
already has a Utopia counterpart.

## 6. 论文 / 研究素材 (measured facts only)

```text
planned capability count                : 5
equivalent already present              : 2   (RC-01, RC-03)
Utopia superior                         : 3   (RC-02, RC-04, RC-05)
concrete gaps                           : 0
selected full / partial migration       : 0 / 0
abandoned                               : 5
rejection reason-code distribution      : DUPLICATE_EQUIVALENT 2, UTOPIA_SUPERIOR 3,
                                          OBSOLETE_DONOR 3, NO_REAL_CONSUMER 1
                                          (multi-code rows)
donor modules surveyed                  : 24 paths, all present at the frozen commit
                                          (8 files classified ENFORCEMENT, 10 DEFINITION,
                                          2 AUDIT/REPORTING, plus 2 config JSONs)
donor dead-code measurement              : 5 live refusal paths only;
                                          electron/capability/* = 0 non-test production callers;
                                          ExecutionGate built without an authorizer (main.ts:1003);
                                          runtime-policy JSON parsed by nothing;
                                          authority-planes 1 caller (a CI script);
                                          audit ledger read only by tests;
                                          createVerify/verifySignature/publicKey/x509/createHmac
                                          = 0 hits in electron/ and src/
source/target anchors inspected          : 24 donor enforcement paths + 12 Utopia module/
                                          service/client anchors across city/, services/,
                                          apps/android/, contracts/
parity/runtime checks PASS/FAIL          : bounded enforcement chain 19/19 PASS, 0 FAIL
                                          (including a live gateway on an ephemeral port and a
                                          live capability-bridge invoke)
                                          city/test-all.mjs 1807 pass / 0 fail / 1 skipped (of 1808)
                                          root node --test tests/*.test.mjs 84 pass / 0 fail
                                          promotion history 10/10 records verified
                                          TOTAL: 1904 PASS, 0 FAIL
assessment start (host clock)            : 2026-09-30T15:57:40Z (claim)
assessment end (host clock)              : see git commit time of assessment HEAD
implementation churn / tests / CI        : 0 product/runtime files changed; 0 new tests;
                                           no CI run required (no implementation)
```

### Recorded issues, choices and judgement calls

1. **Issue: three donor modules were explicitly deferred to this Mission, which reads
   like a pre-existing commitment.** *Choice:* treat the deferral as a hypothesis and
   test it, exactly as MB-011 did. *Judgement:* the hypothesis fails — the deferred
   layer has no production caller inside the donor itself.

2. **Issue: "the donor has a capability broker with default-deny authorization" is a
   true statement that would justify `FULL_MIGRATION`.** *Choice:* establish the caller
   graph before judging coverage, for every module. *Judgement:* this inverted the
   verdict. `main.ts:1003` builds `ExecutionGate` **with no options**, so the code's own
   "mapped" boundary never fires; an assessment that read the module without the
   composition root would have returned `FULL_MIGRATION` for RC-02 and RC-04.

3. **Issue: the Mission's scope excludes Owner/Root authority source and
   constitutional protected-surface definition, but RC-01 names "protected-resource
   access enforcement".** *Choice:* include the *enforcing mechanism* (guard, decision
   composition, scope gate) and exclude the *content* (`ROOT_PROTECTED_MANIFEST`,
   `OWNER_AUTHORITY_PATHS`, `rootOwner`). *Judgement:* this matches the Mission's own
   forbidden list and is recorded here so the boundary is auditable.

4. **Issue: a first bounded run reported the out-of-range-progress refusal as 403 rather
   than 400.** *Judgement:* this was a defect in **my probe**, not in Utopia — the task
   had not yet been legally assigned to the node, so the ownership gate refused first and
   the progress rule was never reached. *Action:* the probe now claims the task through
   the migrated capability gate before asserting the progress rule, and additionally
   asserts the assignment and the invalid-transition refusal. Re-run: 19/19 PASS.
   *Why recorded:* "refused for the wrong reason" is exactly the class of false positive
   an enforcement assessment must not accept.

## 7. Utopia 素材指针

- Raw local: `.runtime/evidence/mission-book/MB-012/2026-09-30-mb012-assessment-01/assessment/`
  (git-ignored: probe script, receipt, suite logs, gateway/bridge state)
- Evolution inbox: `data-records/evolution/inbox/mission-book/MB-012/events.jsonl`
  (4 events: `MISSION_CLAIMED`, `ATTEMPT_STARTED`, 2 × `TEST_PASS`)
- Published bounded evidence: `evidence/raw/mission-book/MB-012/assessment/`
  (`README.md`, `capability-matrix.json`, `bounded-enforcement.json`, `environment.json`)
- Assessment branch immutable HEAD: `mission/MB-012-runtime-compliance` @
  `d071328d8f68ba1ddd5e8a1fde11718e75fd6672`

> NO_VALUE 不生成假的 verified episode；保留 assessment branch + 本报告 + evidence pointers。
> The branch is retained as a research/provenance branch: **not merged, not deleted**.

## 8. 收口 / Closeout

```text
assessment_status          = COMPLETE_NO_VALUE
assessment_complete        = true
assessment_result          = NO_VALUE
migration_status           = SKIPPED_COMPLETE
migration_complete         = true
migration_completion_basis = SKIPPED_NOT_REQUIRED
verification_status        = NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete      = true
merged_main_sha            = null
```

**判断无价值，任务保留，未迁移** — this is a green completion under README §2 and City
R1/R4, not a failure state. The scheduler must treat MB-012 as complete and skip it
unless the Owner explicitly resets or reopens it.

With MB-010, MB-011 and MB-012 all closed, the assessment-first queue
(`MB-010 → MB-011 → MB-012`) is **empty**: every enabled Mission in
[MISSION_INDEX.md](../MISSION_INDEX.md) now has `verification_complete = true`.

## 9. Cross-Mission note (MB-010 / MB-011 / MB-012)

All three assessment-first Missions closed `NO_VALUE` in the same session, and the same
mechanism produced all three results, which is the reusable finding:

```text
A prior Mission's "DEFERRED ... belongs to MB-0NN" note is a POINTER, not a finding.
The test that resolves it is the DONOR CALLER GRAPH, not the donor file list:
  MB-010  the donor's live node logic was already migrated; the remainder was
          production-dead (TenxNodeRegistry/TenxNetworkRegistry: no main/bootstrap import)
  MB-011  app/core/plugin-install/* (960 lines) had ZERO app consumers and was the only
          pin/quarantine/rollback implementation
  MB-012  electron/capability/* had ZERO non-test production callers and the composition
          root built ExecutionGate with no authorizer; the runtime-policy JSON was
          parsed by nothing
```

Two secondary mechanisms recurred and are worth carrying into future assessments:

- **Declared refusal codes that are never produced** (17 in MB-011's donor, several in
  MB-012's) make a donor look like it enforces more than it does.
- **Migrated-but-unconsumed modules in Utopia** (`fleetNodeStateFor`,
  `createProtectedSurfaceGuard`, `evaluateGuardian` currently have only tests as
  consumers) are NOT gaps for an assessment Mission: wiring them is not migration, and
  inventing a consumer is `NEW_FEATURE_DEVELOPMENT`. They are recorded here as a
  standing, non-blocking backlog observation for a future Owner-directed integration
  rather than as a reason to migrate more donor code.

---

## 9. Independent re-verification (2026-09-30, host `Alien`)

Owner-directed: redo this Mission's verification **without reusing any existing test**, with real
Android device operation permitted. Method, fresh evidence and SHA tracking follow. The
`NO_VALUE` verdict is **independently confirmed**.

### 9.1 Donor lifecycle re-derived (own probes, frozen donor `8df428ea`)

| Question | Result |
| --- | --- |
| importers of `electron/capability/{capability-broker,authorization,permission-contract,integration/execution-authorization}` outside that family | only two CI scripts (`scripts/generate-test-catalogue.cjs`, `scripts/platform-certificate.cjs`) — **no application importer** |
| how `ExecutionGate` is built at the composition root | `electron/main.ts:1003`: `new ExecutionGate()` — **constructed with no authorizer** |
| `runtime-policy` references | its own validator, a repro-snapshot hash, and a lifecycle report list — nothing applies a decision from it |

So the family the Mission points at cannot fire: it is never imported by the app, and the gate that
is live is built without an authorizer. Confirmed.

### 9.2 Utopia's existing enforcement, re-proven on live paths

```text
capability surface              : 7 descriptors, 5 AVAILABLE
illegal operation refusal       : invokeAdapter('presentation.theme.lab','validate') -> OPERATION_BLOCKED
oversize input refusal          : 1 MiB + 1 byte document -> INPUT_TOO_LARGE
capability ownership            : second owner of one capability refused by name
lifecycle gate                  : 32 declared modules, 32 implemented, none unimplemented
```

**Verdict: `NO_VALUE` confirmed.** The enforcement that actually runs in Utopia is live and refuses
correctly, and the donor layer named by this Mission is production-unreachable inside its own
repository. Porting it would create a second source of truth for enforcement.


### 9.3 Branch / SHA tracking

```text
utopia main at verification : 756c7d760c605e33ba386e87605e078fe24b82ca
assessment branch           : mission/MB-012-runtime-compliance @ d071328d8f68ba1ddd5e8a1fde11718e75fd6672
ahead / behind main         : 1 / 0
that one commit contains    : data-records/evolution/inbox/mission-book/MB-012/events.jsonl
                              evidence/raw/mission-book/MB-012/assessment/** (README, capability-matrix,
                              environment, bounded-*)
                              NO IMPLEMENTATION CODE
merge (at verification time) : NOT PERFORMED, by rule. README line 223 (echoed by response-9-30 R1)
                              keeps a NO_VALUE assessment branch as provenance and explicitly forbids
                              merging it, and forbids fabricating a verified implementation episode.
merge (Owner ruling R11)    : PERFORMED afterwards as a PROVENANCE merge, by explicit Owner direction:
                              response-9-30.md#R11 overrides README line 223 for these three branches only.
                              git merge --no-ff mission/MB-012-runtime-compliance
                                -> e0d9470e2a5b5479c1614071d8f43af3d1d93248  (parents f22273c, d071328), conflict-free,
                                   5 files added (events.jsonl + 4 assessment evidence files),
                                   branch retained on the remote, no implementation code involved.
merged_main_sha             : null - UNCHANGED. The field means "the SHA where this Mission's
                              implementation landed in main"; nothing was implemented, so it stays null
                              even though the provenance branch is now archived in main.
utopia main afterwards      : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e (the three provenance merges plus Alien's forced
                              NO_VALUE record on top of 756c7d76)
```

There is no migration branch for this Mission: no implementation exists to merge, which is why
`merged_main_sha` stays `null`. What ruling R11 archived into `main` is the assessment provenance
alone - the probes, tamper cases and dry-runs this section reports, never a migrated capability.

### 9.4 Evidence pointers

- `.runtime/evidence/mission-book/MB-010-011-012/donor-lifecycle-probe.json` (donor reachability, all three)
- `.runtime/evidence/mission-book/MB-010-011-012/precise-claims-probe.json`
- `.runtime/evidence/mission-book/MB-010-011-012/utopia-admission-enforcement.json`
- `.runtime/evidence/mission-book/MB-010-011-012/real-device-node.json` plus the two device screenshots
