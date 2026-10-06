# MB-002 — Capability Fabric Boss/Hns Union 纯迁移 — MIGRATION REPORT

> **Status: `MIGRATION_COMPLETE`** (Migration stage only; **not merged to `main`**)
> Migration Host: **Mech**
> Claimed at: `2026-09-29T12:02:31Z`
> City claim commit: `bc2bbbdbac9ff670f2c9b3cbc93f091a7e46694b` (pushed to `Digital-City` main; no write conflict — MB-001 was already claimed by `Alien`, so sequence order selected MB-002)
> Implementation branch: `mission/MB-002-capability-fabric`
> Branch base: `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`
> Implementation commit: `00607f8b243e166b112319b1663eebb3d763fcfc`
> Final branch HEAD: `db3ac518de1d6125e00cee1d9ff6ff7868b58336` (implementation + the event-stream closeout commit)
> Migration CI: **PASS on both** — run `36568159888` on `00607f8b…` and run `36568734343` on `db3ac518…`; `gateway-web` success and `android` success in both

---

## 1. Donor / frozen baseline

| Donor | Frozen SHA | Role in this Mission |
|---|---|---|
| `zhiheng-zhang-Mera/Codex-Boss` | `8df428eaa437a409368401e95194e40266b83080` | provider capability identity, broker/routing, provider health/discovery, stable runtime outcome/state model |
| `zhiheng-zhang-Mera/DS-Hns` | `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973` | capability/plugin dependency, lifecycle, adapter/compatibility, fallback/fault, health, config/lockfile verification |

Both donors were fetched at the exact frozen SHAs into
`.runtime/evidence/mission-book/MB-002/donor-boss` and `donor-hns` (git-ignored),
so every claim in this report was checked against the frozen tree rather than a
moving working copy. `D:\DS-Hns` already sat at the frozen Hns SHA; the
Codex-Boss working copy is at a later commit, and every cited Boss file was
verified byte-identical between the frozen SHA and that working copy.

Utopia V0.3 `capability-bridge` (`contracts/capability-bridge-v1/**`,
`services/capability-bridge/**`, `services/dev-gateway/server.mjs`) is the
**accepted reference baseline** and was **not overturned**: every published
field of `GET /api/v0/capabilities`, the invocation history shape, the typed
errors and the five adapter behaviours are unchanged (see §6).

---

## 2. Landing boundary (source → target)

**Target module:** `city/00-foundation/03-capability-fabric/capability-fabric`
**City owner:** 00/03 City Service Network — Capability Registry & Discovery.

### 2.1 Path decision (a real ambiguity, recorded)

The Mission text names the target path as `city/00-foundation/03-capability-fabric`,
while `city/manifest.mjs` **enforces** `module.path === city/<district>/<building>/<module>`
and `city/tests/manifest.test.mjs` pins that invariant. A path that is exactly
`city/00-foundation/03-capability-fabric` is only valid if `03-capability-fabric`
is the **module** id, which would leave the district `00-foundation` with a
building literally named `03`.

**Decision:** treat `03-capability-fabric` as the **building** id and
`capability-fabric` as the **module** id, so the landing path is
`city/00-foundation/03-capability-fabric/capability-fabric`. This keeps the
manifest's ownership invariant and matches the convention in every other district
(`02-engineering/02-worker-gateway/skill-intake`,
`09-planning-knowledge/01-knowledge-service/knowledge-core`). It also matches the
shape MB-001 announced for its own target (`city/00-foundation/01-city-core`:
district `00-foundation`, building/module `01-city-core`). The City ownership
itself was **not** changed.

### 2.2 Source → target file ledger

| Donor source | Target | What moved |
|---|---|---|
| DS-Hns `app/core/capability-registry/index.cjs` | `registry.mjs` | resolution by capability, priority order, single-owner claim, revocation, miss recording, bounded lookup log |
| DS-Hns `app/core/contracts/capability.cjs` | `contracts.mjs` | the *shape* of a capability vocabulary entry: description, expected providers, documented fallback |
| DS-Hns `app/core/plugin-manager/index.cjs` | `providers.mjs` | the four independent lifecycle questions, the derived-state order, per-provider refusal containment, unload-releases-everything |
| DS-Hns `app/core/health-supervisor/index.cjs` | `providers.mjs` | the fault-level → reaction ladder, the bounded restart budget |
| DS-Hns `app/core/lockfile/index.cjs` | `lock.mjs` | strict document shape, id/version set diff, absent-is-not-drift, refuse-empty-write, sorted rendering |
| Codex-Boss `src/shared/provider-contracts.ts` | `contracts.mjs` | provider identity fields, the `AdapterOutcome` runtime vocabulary, availability modes |
| Codex-Boss `src/shared/provider-outcome.ts` | `outcome.mjs` | runtime vs semantic separation, ordered classifier, behaviour axes, goal drift, evaluator revision |
| Codex-Boss `src/shared/provider-state.ts` | `contracts.mjs` | `WAITING_PROVIDER` / `PAUSED_PROVIDER` / `ACTIVE` with the explicit `autoResume` flag and `retryAt` |
| Codex-Boss `src/shared/capability-router.ts` | `routing.mjs` | `ModuleState`, hard eligibility, DEGRADED admitted-and-tracked, UNKNOWN never capable |
| Codex-Boss `electron/commander/runtime-registry.ts` | `routing.mjs` | health folded into availability; an absent or thrown probe is not availability |
| Codex-Boss `electron/commander/role-router.ts` | `routing.mjs` | hard layer before any ranking; a ranking may only reorder an already-approved set |

Full per-symbol detail, the adaptation list and the classification are in
`city/00-foundation/03-capability-fabric/capability-fabric/DONOR.json`.

---

## 3. Preserved behaviour / explicitly NOT migrated

### 3.1 Preserved (proved by the 44 parity tests, §6)

Capability registration and resolution by capability name; priority order; refusal
of a second owner; re-registration by the same owner as an update; requirement
gating with recorded misses (and `REVOKED` distinguished from `MISSING`);
revocation of everything an owner provided; a provider that cannot say what it
does being refused; a bounded, copy-returning lookup log.

The four lifecycle questions staying independent with the donor's derived-state
order; disabled-load refusal; idempotent load; contained throwing health probes;
unparseable health staying `UNKNOWN` rather than `HEALTHY`; the reaction order
healthy → unknown → fatal → soft → restart budget; the aggregate
blocked/degraded/healthy verdict; restart budget reset on unload.

Runtime vs semantic outcome separation including all ten non-semantic codes;
`HARD_REFUSAL` from a refusal inside a *successful* call; deterministic
verification/format failures outranking provider signals; unobservable success
staying `UNCLASSIFIED`; goal drift reported but never rewritten; appended
evaluator revisions.

`autoResume` derived from the action and never passed in; an undefined `retryAt`
absent rather than zero; unknown actions yielding `ACTIVE` rather than throwing.

Lifecycle-derived availability with stricter-wins for mixed owners; hard
eligibility excluding FAILED/DISABLED/RECOVERING/unknown with recorded reasons;
DEGRADED admitted *and* tracked; a ranking that may only reorder, cannot add, and
whose throw leaves the deterministic order untouched.

Bounded invocation with the operation allowlist checked before any work runs, a
canonical result digest, typed errors preserved, unknown throws becoming
`ADAPTER_UNAVAILABLE`, an oversized result refused as `RESULT_TOO_LARGE`, a
`BUSY` concurrency bound, and **durable interruption truth**.

Strict lock semantics: version and id shape enforced, an owner required per
entry, an exact owner/version set diff naming added/removed/changed, absent not
drift, an empty write refused, enforcement opt-in, an unparsable lock invalid.

### 3.2 Explicitly NOT migrated, and why

| Not migrated | Reason |
|---|---|
| Hns `plugin-adapters/**` (format detection, adapter registry, compatibility), `plugin-compat/**`, `plugin-install/**` | External-format admission and adaptation belong to **01/01 Customs (MB-011)** and **02/02 Worker Gateway (MB-003)**. Carrying them here would build a second admission seam. |
| Boss `electron/capability/{capability-broker,authorization,permission-contract,credential-reference}.ts` | The grant/permission/credential boundary is **01/02 Runtime Compliance (MB-012)** and the **01/01** admission seam. The broker invariants that belong to the fabric were preserved in fabric terms instead: a provider must describe itself, and the only way to reach a provider is `invoke`, which checks availability and the operation allowlist first. |
| Hns `config-manager` | Used by no in-scope module (the manager's config is an injected plain object) and its schema/`reject` semantics are admission behaviour. |
| Hns 30-name `CAPABILITIES` vocabulary | Product vocabulary (`computer-use`, `ui-stability`, `long-term-worker`, `dshns.*` provider ids). Only the *shape* — a closed vocabulary with a documented fallback — was carried. |
| Boss `src/shared/provider-capabilities.ts`, `electron/input/attachment-router.ts` | Routing file attachments to web-AI panes is provider-window product behaviour, not city-global capability metadata. |
| Boss `src/shared/capability-gap.ts` and `electron/engineering/improvement-loop.ts` | Durable capability-gap improvement is Engineering self-improvement, owned by the Engineering Missions. |
| Boss `electron/learning/**`, `electron/commander/task-ledger|main-commander|scheduler|budget-manager|…` | Engineering provider planning / worker pool — out of scope by the Mission text. |
| Any Electron/DOM/product-shell surface | This module contacts nothing: no network, no shell, no credential. |

---

## 4. Interface / contracts

`city/00-foundation/03-capability-fabric/capability-fabric/contracts.mjs`

- `FABRIC_API_VERSION = 'utopia.capability-fabric/v1'`
- `providerStateFor(action, reason, retryAt, now)` → the donor's `ProviderStateRecord`
- `capabilityDescriptor(input)`, `capabilityRequirement(input)`, `requireProviderId`
- `RUNTIME_OUTCOMES`, `NON_SEMANTIC_RUNTIME_CODES`, `isNonSemanticRuntimeCode`, `runtimeOutcomeForError`, `recoveryActionFor`
- `canonical(value)`, `digest(value)`, `FabricError`, `FABRIC_REASONS`

`registry.mjs` — `createCapabilityRegistry({events, now, maxLookups})` →
`{register, revoke, revokeOwner, resolve, has, get, describe, list, capabilities,
providedBy, missingRequired, recordMiss, misses, lookups, revocations, size}`

`providers.mjs` — `createProviderLedger({now, maxRestarts, events, onRelease})` →
`{register, setEnabled, load, loadAll, fault, unload, checkHealth, status, list,
reactionFor, recordRestart, restartCount, aggregate, history, has, get, size}`;
plus pure `deriveProviderState`, `reactionFor`, `normalizeHealth`, `aggregateHealth`.

`outcome.mjs` — `deriveSemanticEvaluation(input, evaluatorVersion?)`,
`detectGoalDrift(goal, output)`, `createEvaluationRevision(input)`,
`SEMANTIC_OUTCOMES`, `OUTCOME_AXES`, `OUTCOME_EVALUATOR_VERSION`,
`SCOPE_CHANGE_MARKERS`.

`routing.mjs` — `createFabric({providers, lifecycleFor, now, maxInvocations,
routing, emit})` → `{registry, registerProvider, revokeProvider, revokeOwner,
descriptors, descriptorFor, capabilities, resolve, invoke, interrupt, list, get,
classify, missingRequired}`; plus pure `moduleStateForLifecycle`,
`bridgeStateForLifecycles`, `bridgeStateFor`, `describeOwnership`,
`eligibleCandidates`, `providerUpdateFor`, `MODULE_STATES`, `ABSENT_LIFECYCLE`.

`lock.mjs` — `renderLock`, `parseLock`, `compareLock`, `verifyLock`, `writeLock`,
`LOCK_FILE`, `LOCK_VERSION`, `LOCK_REASONS`.

**Composition-root wiring (the only change outside the new module):**
`services/capability-bridge/registry.mjs` now declares the five providers as
`ADAPTER_PROVIDERS` registration inputs, registers them into a real
`createCapabilityRegistry()`, and derives each descriptor's `moduleRefs`,
`moduleLifecycles`, `cityLifecycle`, `moduleState` and `bridgeState` through the
fabric's `describeOwnership`. The legacy `ADAPTERS` export is preserved as a
derived view, and every field the Web/Android clients already read is unchanged.

---

## 5. Existing UI / real consumption path (no new UI)

No new UI was created. Consumption is through the surfaces that already exist:

- **Web Services** (`apps/web/services.js`, `/services` page) — capability
  dropdown, operation controls, run button, invocation history and result
  detail, reading `GET /api/v0/capabilities` and
  `GET /api/v0/capability-invocations`.
- **Android Services** (`apps/android/.../ServicesPanel.kt`) — the same
  snapshot fields (`capabilities`, `invocations`) through the same gateway API.
- **Gateway** (`services/dev-gateway/server.mjs`) — unchanged routes:
  `/api/v0/capabilities`, `/api/v0/capabilities/:id`,
  `/api/v0/capability-invocations`, `/api/v0/capability-invocations/:id`,
  `POST /api/v0/capabilities/:id/invoke`.

Live check against the running gateway:

```text
planning.document.intake       AVAILABLE      ACTIVE     ops=read
planning.knowledge.query       AVAILABLE      ACTIVE     ops=query,fromDocument
engineering.skill.inspect      AVAILABLE      ACTIVE     ops=inspect,validate,catalog,archive
research.evidence.review       AVAILABLE      ACTIVE     ops=review,tamper
presentation.theme.lab         AVAILABLE      PROMOTED   ops=generate,build
city.00-foundation/03-capability-fabric/capability-fabric  BRIDGE_PENDING  PROMOTED  ops=
```

The last row is the newly declared City module: it is described, it is honestly
`BRIDGE_PENDING` because it has no invocable adapter, and it is not hidden.

---

## 6. Tests

### 6.1 Module parity suite — 44 tests, all pass

`city/00-foundation/03-capability-fabric/capability-fabric/tests/capability-fabric.test.mjs`,
run by `node city/test-all.mjs` (plain Node discovery, no new framework).

The assertions are written against the donor rules rather than against this
implementation's structure, so a Verifier can check them against the frozen
donors directly.

Two real defects were found and fixed by these tests during construction, both
recorded because a Verifier should look for the same class of mistake:

1. `compareLock` iterated `Object.keys(found)` where `found` is a `Map`, which
   yields an empty array. Drift was silently under-reported (added and changed
   entries lost). Fixed to spread the keys. This is exactly the failure that
   would have made the lock look clean while the composition had moved.
2. `invoke` recorded the in-flight row as `RUNNING` and then appended the
   settled row as a second entry, leaving a permanent `RUNNING` row that both
   counted against the concurrency bound and showed a finished call as in flight.
   Fixed by replacing the recorded row in place.

### 6.2 Required CI gates, run locally on this host

| Gate | Command | Result |
|---|---|---|
| Root tests | `pnpm test` | **58 / 58 pass** |
| City module tests | `node city/test-all.mjs` | **173 / 173 pass** |
| Rooms tests | `node --test apps/rooms/tests/*.test.mjs` | **67 / 67 pass** |
| Bilingual docs | `pnpm check:docs` | **PAIR_STATUS = SYNCHRONIZED** (docs, evidence, data-records) |
| Promotion history | `node scripts/verify-promotion-history.mjs` | **10 records verified** against history at `c7ef3cd` |
| Windows Services consumption | `scripts/capability-windows-pilot.mjs` | **26 / 26 rows PASS** |
| Restart interruption | `.runtime/…/interruption-driver.mjs` | **PASS** |
| Android unit test + assemble | `gradlew :app:testDebugUnitTest :app:assembleDebug` | **NOT RUN locally — see §8.1; PASS on CI** |

`pnpm` was invoked through the bundled corepack shim
(`D:\Node_JS\node_modules\corepack\shims`), resolving pnpm 11.19.0, which is the
version CI pins.

### 6.3 CI

```text
run 36568159888   head 00607f8b243e166b112319b1663eebb3d763fcfc   gateway-web success / android success
run 36568734343   head db3ac518de1d6125e00cee1d9ff6ff7868b58336   gateway-web success / android success
```

The second run covers the final branch HEAD, which is the exact revision a
Verification Host will review and merge.

---

## 7. Data / error / recovery records

- **Errors.** Every refusal is a typed code, never an exception across the module
  boundary: `CAPABILITY_NOT_FOUND`, `OPERATION_BLOCKED`, `BRIDGE_PENDING`,
  `BUSY`, `INVALID_INPUT`, `EXECUTION_TIMEOUT`, `ADAPTER_UNAVAILABLE`,
  `ENGINE_UNAVAILABLE`, `RESULT_TOO_LARGE`, `BUILD_STORAGE_UNAVAILABLE`,
  `GATEWAY_RESTARTED`. Real refusals observed through the Web surface:
  `CORRUPT_INPUT`, `INPUT_TOO_LARGE`, `CORRUPT_PDF`, `UNSAFE_ARCHIVE`,
  `ARTIFACT_HASH_MISMATCH` — all matching the pilot's expectations.
- **Concurrency.** The `BUSY` bound counts only genuinely `RUNNING` rows; the
  §6.1 defect was that it also counted a stale duplicate.
- **Recovery.** End-to-end through the real gateway: an invocation observed
  `RUNNING`, the gateway process killed, the gateway restarted, the same
  invocation id returned as `INTERRUPTED` with `errorCode GATEWAY_RESTARTED`,
  `resultDigest: null` and `resultAvailable: false`. Not left `RUNNING`, not
  reported `COMPLETED`. Receipt:
  `.runtime/evidence/mission-book/MB-002/run-1/recovery/interruption.json`.
- **Durability.** The registry, ledger and invocation history are in memory (as
  in the donor's registry). The store's own persistence is the gateway's
  business and was not changed. Only `lock.mjs` touches the filesystem, and only
  one file.
- **No secrets, no credentials and no unbounded terminal dumps** were recorded.

---

## 8. Known limitations

### 8.1 The Android job could not be built on this host (toolchain, not code)

`gradlew :app:testDebugUnitTest :app:assembleDebug` was attempted twice and
failed before compiling anything:

- `JAVA_HOME=D:\Android_Studio\jbr` → `JAVA_VERSION="25.0.3"`;
- `JAVA_HOME=C:\Program Files\Java\jdk-26` → `JAVA_VERSION=26`;
- the only other JDK on the machine is `D:\Software\Java\jdk-26`.

Both are refused by the Android Gradle Plugin; CI uses `temurin 21`. This is a
**host toolchain limitation**, not a defect: `git status` shows **no file under
`apps/android/**` was touched**, `apps/android/app/build.gradle.kts` declares no
dependency on anything that changed, and the Android job subsequently **passed on
CI** in both runs above.

### 8.2 Honest boundary of the cross-client claim

The Web pilot (26/26) is real end-to-end consumption. The **Android** Services
panel consuming the same payload was **not** re-run on this host, because
`scripts/capability-android-pilot.mjs` requires a connected device over ADB and
none is attached. What is verified for cross-client parity here is that the
payload shape and every field the Android panel reads (`capabilityId`, `name`,
`bridgeState`, `cityLifecycle`, `operations`, `inputKind`, `invocationId`,
`status`, `resultDigest`, `resultAvailable`, `errorCode`) is **unchanged**, and
the root tests asserting that shape pass. The Verifier should run the Android
job in CI and, if a device is available, the Android pilot.

### 8.3 Provider-capability override durability is not carried

The donor persists provider capability overrides to a file. That mechanism was
excluded (§3.2), so this module holds no persisted overrides. Nothing in the
Mission asked for it and no City module consumes it today.

### 8.4 Known non-parity in the lock format

The lock document is JSON rather than the donor's YAML-shaped line format,
because the donor's hand-written parser refused every deviation and JSON gives
the same strictness without a parser that can drift. The *rules* (version shape,
id shape, an owner per entry, exact set diff, absent-is-not-drift, refuse-empty,
sorted rendering) are preserved. Recorded in `DONOR.json`.

### 8.5 Deliberate adaptations a Verifier should challenge

1. Ownership refusal happens at **registration** time (naming the mistake where
   it is made) rather than at resolution time as in the donor. Re-registration by
   the same owner is still an update.
2. A module reference the manifest does not name derives `cityLifecycle:
   'NOT_IN_MANIFEST'` and `bridgeState: 'BRIDGE_PENDING'`. The marker is
   deliberately not the literal string `UNKNOWN`, so a caller that writes
   `UNKNOWN` as a real lifecycle still gets `DEGRADED`.
3. Provider effects are caller-supplied (`execute`), so the module never runs a
   provider's code.

---

## 9. Utopia evidence pointers

Raw, git-ignored:

```text
.runtime/evidence/mission-book/MB-002/
├─ donor-boss/                     Codex-Boss @ 8df428e (frozen checkout)
├─ donor-hns/                      DS-Hns @ eeb57ca5 (frozen checkout)
├─ interruption-driver.mjs         restart-interruption evidence driver
└─ run-1/
   ├─ tests/capability-fabric.test.txt     44/44
   ├─ tests/windows-pilot-rows.txt         26/26 rows
   ├─ windows/runs.json + evidence.png + theme.png
   └─ recovery/interruption.json           INTERRUPTED / GATEWAY_RESTARTED
```

Structured, on the mission branch:

```text
data-records/evolution/inbox/mission-book/MB-002/events.jsonl
```

Events recorded (all `MIGRATION` / `Mech`): `MISSION_CLAIMED`, `ATTEMPT_STARTED`,
`OWNER_INTERVENTION` (the scope decision in §3.2), `CHANGE_APPLIED`,
`TEST_PASS`, `RUNTIME_PASS`, `RECOVERY`, `CI_RESULT`, `MIGRATION_COMPLETE`.

No large raw logs were copied into Digital-City.

---

## 10. Branch HEAD / CI status

- Mission branch: `mission/MB-002-capability-fabric`
- Final branch HEAD: `db3ac518de1d6125e00cee1d9ff6ff7868b58336`
- CI runs: `36568159888` (implementation) and `36568734343` (final HEAD) — both
  **success** on `gateway-web` and `android`.
- **The migration branch is NOT merged to `main`.** Merging is the Verification
  Host's action after all required CI and the Mission's own gates are green.

---

## 11. Note on this document

An earlier, longer revision of this report was written into the Digital-City
working copy and then discarded when that copy was hard-reset to pick up
concurrent City commits (`MB-001` completion and the `MB-003` claim by host
`Alien`). The report was rewritten from the recorded mission events, the
implementation commit message and the evidence files, and the `migration_ci`
field in `mission-book/MB-002-capability-fabric.md` holds the same CI facts. All
figures above were re-verified against the branch and the CI runs at the time of
rewriting; the note is kept so a Verifier knows the document's history.

语言配对 / Language pair: [原文 / Source](./MIGRATION_REPORT.md) · [译本 / Translation](./zh-CN/MIGRATION_REPORT.md)
