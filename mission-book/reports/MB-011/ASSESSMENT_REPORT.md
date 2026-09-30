# Assessment Report — MB-011

```text
MISSION = MB-011
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST = Mech
CLAIM_COMMIT = 10b2267105a87dd610503a93d62793b5f12f62c1   (Digital-City main)
DONOR_BASELINES = zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080
                  zhiheng-zhang-Mera/DS-Hns@eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
UTOPIA_MAIN_BASELINE = zhiheng-zhang-Mera/utopia@756c7d760c605e33ba386e87605e078fe24b82ca
ASSESSMENT_BRANCH = mission/MB-011-customs
ASSESSMENT_HEAD = 82b6ac486d024efcfcc64703b58cc136b546caf9
ASSESSMENT_RESULT = NO_VALUE
```

```text
PLANNED_CAPABILITIES = CU-01, CU-02, CU-03, CU-04, CU-05   (count 5)
SELECTED_GAP_CLOSURES = none
ABANDONED_CAPABILITIES_AND_REASONS =
  CU-01 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR
  CU-02 UTOPIA_SUPERIOR
  CU-03 DUPLICATE_EQUIVALENT + WRONG_OWNERSHIP + NO_INDEPENDENT_VALUE
  CU-04 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR + NO_REAL_CONSUMER
  CU-05 UTOPIA_SUPERIOR + OBSOLETE_DONOR
ASSESSMENT_RESULT = NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

## 0. 领取依据 / Why this Mission was claimable

```text
P0 (verification / integration): NONE eligible.
   MB-001..MB-010 all closed; every mission branch AheadOfMain = 0 at utopia@756c7d7.
P1A (assessment-first): MB-011 is the next lowest-sequence enabled assessment-first
   Mission (seq 11) with assessment_complete = false and an unclaimed stage.
```

**This Mission was NOT dismissed as "already covered".** MB-002's
`city/00-foundation/03-capability-fabric/capability-fabric/DONOR.json` explicitly
records that the Hns plugin/adapter/installer platform was *deliberately not migrated*
and names the owners:

```text
"The Hns plugin/adapter/installer platform is deliberately NOT migrated: plugin-adapters
 (format detection, adapter registry, compatibility), plugin-compat, plugin-install,
 config-manager and the permission/host layers belong to 01/01 Customs (MB-011),
 01/02 Runtime Compliance (MB-012) and 02/02 Worker Gateway (MB-003)."
DEFERRED: "plugin/adapter format detection and the adapter registry (MB-011 Customs)"
          "permission and authorization resolution (MB-012 Runtime Compliance)"
```

So MB-011 is the *named* owner of the deferred admission layer, and the assessment was
run on its merits. The evidence below shows the deferral is **not** a migration
opportunity.

## 1. 计划能力 / Planned donor capabilities

The Mission names two donors and five capability IDs. The donor contains no module
literally called `customs`; mapping was established by reading the frozen trees:

| ID | Planned capability | Donor anchors located |
|---|---|---|
| CU-01 | manifest / schema admission validation | DS-Hns `app/core/contracts/plugin.cjs` (`validateManifest`, `validatePlugin`, `normalizeManifest`), `app/core/plugin-adapters/contract.cjs` (`validateAdapter`, `standardizeManifest`, `validateAdapterOutput`), `app/core/plugin-adapters/process/contract.cjs` (`validateProcessManifest`), Codex-Boss `electron/platform/capability-manifest.ts`, `config/capabilities/*.yaml` |
| CU-02 | identity / source / provenance verification hooks at admission | DS-Hns `app/core/plugin-install/pipeline.cjs` (`normalizeSource`), `app/core/plugin-install/records.cjs`, Codex-Boss `scripts/city-ledger-provenance.cjs` + `config/city-ledger-provenance.json` |
| CU-03 | dependency / capability / permission / domain / storage declaration checks | DS-Hns `app/core/plugin-manager/index.cjs#loadOne`, `app/core/contracts/plugin.cjs#normalizePermissions`, `app/core/plugin-adapters/contract.cjs` (`PERMISSIONS`, `resolvePermissions`), `app/core/plugin-compat/deps.cjs`, Codex-Boss `electron/security/permission-manifest.ts` |
| CU-04 | isolation / crash-boundary / compatibility preflight | DS-Hns `app/core/plugin-adapters/contract.cjs` (`RUNTIME_KINDS`, `standardizeRuntime`), `app/core/plugin-adapters/process/contract.cjs`, `app/core/plugin-compat/index.cjs` + `worker.cjs`, Codex-Boss `electron/root-recovery/rollback-controller.ts` |
| CU-05 | enable / disable / uninstall / rollback readiness before admission | DS-Hns `app/core/plugin-manager/index.cjs` (`setEnabled`, `removeOne`), `app/core/plugin-install/plan.cjs`, `app/core/plugin-install/pipeline.cjs`, `app/core/plugin-install/records.cjs` |

Planned capability count = **5**.

## 2. Donor source map and lifecycle (the decisive finding)

A read-only survey of the 17 DS-Hns admission modules at the frozen commit
`eeb57ca` established two facts that decide this Mission.

### 2.1 The coherent admission design is production-dead

```text
app/core/plugin-install/plan.cjs       232 lines   ADMISSION-INPUT, advisory only, produces NO refusal
app/core/plugin-install/pipeline.cjs   464 lines   ADMISSION state machine - ZERO app consumers
app/core/plugin-install/records.cjs    264 lines   readiness state        - dead with pipeline
                                       ---------
                                       960 lines   unreachable from app/
```

The only non-test importer of `plugin-install` is
`scripts/install-pipeline-acceptance.cjs`; `app/plugin-host.cjs` never references it.
Because `records.cjs` is the **only** implementation of pin / quarantine / rollback,
those CU-05 features are dead with it. The donor's *live* equivalents are far weaker:

```text
plugin-manager.install()    -> validatePlugin + duplicate check only
plugin-manager.setEnabled() -> refuses only PLUGIN_NOT_FOUND; no consumer-impact analysis
plugin-manager.removeOne()  -> refuses only PLUGIN_NOT_FOUND; no dependent check, no rollback
```

### 2.2 Declared-but-never-produced refusal codes

Refusal codes that exist as constants but are produced nowhere in the repository:

```text
ADAPTER_FAULT_CODES.{UNKNOWN_PERMISSION, PERMISSION_DENIED}
LOAD_REASONS.IMPORT_FAILED
COMPAT_LOAD_REASONS.IMPORT_FAILED
PROCESS_FAULT_CODES.{BAD_MANIFEST, NO_COMMAND, COMMAND_ESCAPES, HANDSHAKE_REFUSED, RESTART_LIMIT, PORT_NOT_REPORTED}
BRIDGE_FAULT_CODES.{HANDSHAKE_FAILED, NOT_ACTIVATED}
INSTALL_FAULT_CODES.{NO_ADAPTER, ALREADY_INSTALLED}
```

Consequences worth naming precisely:

- **Permissions are not an admission gate.** `resolvePermissions` computes
  `granted`/`refused`/`unknown`, and the admission path only logs
  `adapter-permissions-incomplete` before admitting the plugin (plugin-adapters/index.cjs
  L165-175). `plugin-manager.loadOne` never reads permissions at all.
- **The API-version refusal is classified by a regex over error prose**:
  `code = /api_version/.test(reason) ? LOAD_REASONS.API_INCOMPATIBLE : LOAD_REASONS.MANIFEST_INVALID`.
- **Requirement cycles are not refused.** `orderPlugins` detects them and returns
  `cycles`, but `loadAll` emits a `MANIFEST_INVALID` fault per cycle and still attempts
  the ordered entries.
- **Missing package peers are reported, not refused** (`cordis-structure.auditPeers` →
  `peers.missing`, risk +3 and a degradation note inside dead code).

### 2.3 There is no provenance verification and no cryptographic verification

Repo-wide at the frozen baseline:

```text
createVerify 0 hits    verifySignature 0    publicKey 0    x509 0
contentHash 0          pluginHash 0
node:crypto import:  NONE of the 17 surveyed admission modules
```

`plugin-install/pipeline.cjs` builds `provenance {kind, repo, path, branch, dir}` from a
**regex over a user-supplied string** and `records.cjs` persists it. Nothing checks a
remote, an author, a release manifest, a registry, a hash or a signature. The nearest
thing to a pin is `app/extensions/mega/store/installer.cjs` validating a `revision`
against `/^[0-9a-f]{7,40}$/i` and using `git fetch --depth 1` — git's own content
addressing, not a DS-Hns verification step. `node:crypto` appears in the adapter layer
once (`process/transport.cjs` L230, a per-start localhost socket token) and that is
runtime channel authentication, not plugin provenance.

### 2.4 There is no isolation / crash-boundary preflight

`RUNTIME_KINDS` declares honest enforcement/isolation metadata
(`in-process`→advisory/none, `isolated-process`→process-boundary/process,
`managed-process`→protocol/process, `declarative`→declared-only/none,
`remote`→protocol/network) and `standardizeRuntime` stamps it onto the manifest.
**Nothing anywhere refuses admission because of it.** The only decision it feeds is
`plugin-install/plan.cjs::assessRisk` (in-process = weight 8) — advisory, and in dead
code. The real crash boundaries are **post-admission, at activation**:
`plugin-compat/index.cjs` + `worker.cjs` (isolated child, 20 s bound) and
`bridge/host.cjs` + `bridge/child.cjs`. `COMPAT_UNSUPPORTED_API` is decided *inside the
child*, after the decision to admit.

The one structural preflight that does exist is **path containment**, in
`adapters/native-hns.cjs` and `process/contract.cjs` (a declared entry or command that
resolves outside the plugin directory is refused).

## 3. Utopia 当前能力 / Claim-time Utopia inventory (baseline `756c7d7`)

`city/01-governance/01-customs-security` — the Mission's candidate target — does not
exist, and no `01-governance` district exists (the manifest lists only `00-foundation`,
`02-engineering`, `06-research`, `09-planning-knowledge`, `10-automation`). Per City R2
that alone proves nothing; the semantic inventory follows.

| Concern | Utopia implementation | Kind |
|---|---|---|
| City manifest admission | `city/manifest.mjs` `loadManifest` / `validateManifest` / `checkManifestAgainstTree` — schemaVersion, district/building/module id shape, bilingual text, duplicate id/path detection, lifecycle vocabulary, `capabilityProvider` boolean, **canonical path equality**, incubation-room uniqueness and requiredness for implemented modules, donor repository + git-SHA commit; then implemented⇔directory-exists cross-check | live module + 13-test suite |
| Room / incubation admission | `apps/rooms/hub/manifest.mjs` (`ROOM_LIFECYCLES`, `RETIRED_LIFECYCLES`, metadata contract), `apps/rooms/docs/en/INCUBATION_POLICY.md` | live registry + policy |
| Promotion admission + provenance | `apps/rooms/hub/promotions.mjs` `normalizePromotionRecord` (status must be `PROMOTED`, `acceptedRoomCommit`/`promotedAtCommit`/`donor.commit` must be git SHAs, `targetCityPath` must live under `city/`), `crossCheckPromotions` (room known, not still active, lifecycle `PROMOTED`, target matches manifest) | live module |
| Promotion provenance verification | `scripts/verify-promotion-history.mjs` — `git cat-file -e` on accepted/promoted commits, `merge-base --is-ancestor` twice, `cat-file -e` on `promoted:target` and `HEAD:target`, plus "the retired incubator has no live implementation" | live verifier |
| Per-module provenance records | `DONOR.json` beside every migrated module (repository, commit, sourcePaths, portedFiles, adaptation, knownDifferences, parity vectors, classification) | live records |
| Capability ownership / declaration admission | `city/00-foundation/03-capability-fabric/capability-fabric/registry.mjs` (registration-time duplicate-owner refusal naming both owners, miss recording naming the requester, revocation), `contracts.mjs` (`FABRIC_API_VERSION`, `capabilityDescriptor`, `FABRIC_REASONS`), `services/capability-bridge/registry.mjs` (moduleRefs resolution, owner, priority, district/building kind + `capabilityProvider:false` gating) | live module + service |
| Provider lifecycle readiness | `capability-fabric/providers.mjs` — installed / enabled / loaded / healthy as four independent facts, duplicate identity refusal, disabled refused a load unless forced, health ladder, bounded restart budget | live module |
| Hard eligibility by capability | `city/00-foundation/01-city-core/fleet-routing/capability-routing.mjs` `eligibleCandidates` (excludes FAILED/DISABLED/RECOVERING with reasons, records missing capabilities, admits DEGRADED explicitly) | migrated module (MB-001) |
| Restart / rollback readiness | `city/02-engineering/04-restart-recovery-station/*` (MB-006: protocol, lock with declared transition edges, fail-closed checkpoint gate, checksummed ticket with expiry/pid/schema/checksum ladder) | migrated module |
| Contract schemas | `contracts/capability-bridge-v1`, `contracts/city-control-v0`, `contracts/pairing-v1`, `contracts/city-roads/document-knowledge-v1`, `contracts/evolution/mission-event-v1` + `mission-episode-v1` | live contracts + conformance test |
| Protected surface | `city/00-foundation/01-city-core/root-authority` — **explicitly out of scope** for this Mission | migrated module (MB-001) |

Anchors searched and confirmed: `city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/manifest.mjs`,
`city/tests/manifest.test.mjs`, `city/00-foundation/01-city-core/**`,
`city/00-foundation/03-capability-fabric/**`, `services/capability-bridge/**`,
`apps/rooms/promotions/**`, `apps/rooms/hub/**`, `scripts/verify-promotion-history.mjs`,
`contracts/**`, plus repo-wide greps for `api_version`, `semver`, `provides`,
`conflicts`, `validateManifest`, `validatePlugin`, `permission`, `uninstall`, `rollback`,
`01-governance`, `customs`.

Repo-wide grep results worth recording: the only occurrences of `customs` in Utopia are
MB-002's deferral note and its own module header ("what keeps it out of the 01 Customs
admission boundary"); there is no `api_version`/semver plugin-manifest validator and no
permission or state-namespace ownership admission anywhere.

## 4. Capability comparison matrix

| ID | Donor capability | Donor evidence | Utopia equivalent / current behavior | Coverage | Gap | Decision | Reason code | Evidence |
|---|---|---|---|---|---|---|---|---|
| CU-01 | manifest / schema admission validation | `plugin.cjs#validateManifest` (id pattern, semver, `api_version` equality, capability arrays, booleans, `fault_level`, permissions arrays); `validateAdapter`/`standardizeManifest`; `validateProcessManifest` (argv command, closed transport set, numeric consistency, path containment); Codex-Boss `capability-manifest.ts` (interface graph, duplicate provide, required∩optional) | `city/manifest.mjs` validates structure, ids, lifecycles, canonical path, room uniqueness, donor SHA, then cross-checks the tree; `promotions.mjs` validates promotion records; `capability-fabric/contracts.mjs` owns the fabric API version and descriptor shape; 5 contract schemas | EQUIVALENT | The donor's *plugin-format* field set has no Utopia artifact to admit — Utopia has no plugin format. On the fields that do exist, Utopia is stricter (canonical-path equality + tree cross-check have no donor analogue) | ABANDON | `DUPLICATE_EQUIVALENT`, `OBSOLETE_DONOR` | `city/manifest.mjs`, `city/tests/manifest.test.mjs`, `promotions.mjs`, `contracts/*/schema.json` |
| CU-02 | identity / source / provenance verification hooks at admission | `pipeline.cjs#normalizeSource` records `provenance` from a **regex over user input**; `records.cjs` persists it; **no verification anywhere**; no hash/signature primitives at all | Promotion records carry `donor.repository`/`commit`/`sourcePaths` and are **validated**; `crossCheckPromotions` refuses a record that disagrees with the catalog or a room still serving a surface; `verify-promotion-history.mjs` verifies every record's commit ancestry and target existence against local Git; per-module `DONOR.json` | SUPERIOR | None. The donor has no verification behaviour to migrate — only recording, which Utopia also does and then verifies | ABANDON | `UTOPIA_SUPERIOR` | `promotions.mjs`, `verify-promotion-history.mjs`, `DONOR.json` |
| CU-03 | dependency / capability / permission / domain / storage declaration checks | `loadOne` checks `requires_capabilities` only, at load time; `conflicts` compared to plugin ids only against **already-loaded** plugins; optional never consulted; peers reported not refused; **permissions not a gate** (`UNKNOWN_PERMISSION`/`PERMISSION_DENIED` never produced) | `capability-fabric/registry.mjs` refuses a second owner **at registration**, records misses naming the requester, distinguishes optional; `providers.mjs` refuses duplicate identity; `capability-bridge/registry.mjs` resolves moduleRefs, ownership, priority and kind; `eligibleCandidates` gives hard capability eligibility; `city/manifest.mjs` owns the domain path | EQUIVALENT | Two sub-parts are not gaps: permission/authorization resolution is explicitly deferred to **MB-012** by MB-002's DONOR.json (and is not an admission gate in the donor anyway); storage declarations exist in neither | ABANDON | `DUPLICATE_EQUIVALENT`, `WRONG_OWNERSHIP`, `NO_INDEPENDENT_VALUE` | `capability-fabric/registry.mjs`, `providers.mjs`, `capability-bridge/registry.mjs`, `capability-routing.mjs` |
| CU-04 | isolation / crash-boundary / compatibility preflight | `RUNTIME_KINDS` = declared metadata only; nothing refuses on it; risk weight only in dead `plan.cjs`; `api_version` compatibility is a real gate; real isolation is a child process spawned **after** admission; path containment exists in two adapters | Compatibility admission exists as `FABRIC_API_VERSION` + descriptor validation; fault levels (`soft`/`degraded`/`fatal`), health ladder with bounded restart budget; MB-006 restart/recovery station owns the real recovery boundaries | EQUIVALENT | The preflight the Mission names **does not exist as a refusal in the donor**. Migrating it means importing a plugin-process isolation model for a platform Utopia does not have; building the consumer would be new capability. Codex-Boss root-recovery rollback is Owner sovereignty / Root Authority — explicitly forbidden by this Mission | ABANDON | `DUPLICATE_EQUIVALENT`, `OBSOLETE_DONOR`, `NO_REAL_CONSUMER` | `plugin-adapters/contract.cjs`, `process/contract.cjs`, `capability-fabric/contracts.mjs`, `providers.mjs`, `04-restart-recovery-station/**` |
| CU-05 | enable / disable / uninstall / rollback readiness checks before admission | LIVE path: `setEnabled`/`removeOne` refuse only `PLUGIN_NOT_FOUND`, no dependent check, no rollback. Designed readiness (pin / quarantine / rollback-before-replace / `confirm`) exists **only** in the production-dead `plugin-install/*` (960 lines, 0 app consumers) | `providers.mjs` keeps installed/enabled/loaded/healthy independent and refuses to load a disabled provider unless forced; `RETIRED_LIFECYCLES` removes a promoted/rejected room from the active catalog; `crossCheckPromotions` + `verify-promotion-history` prove no second living implementation; MB-006 checkpoint gate fails closed and the restart lock/ticket own rollback readiness | SUPERIOR | None. The donor's live path performs less than Utopia already does, and the designed checks are dead code | ABANDON | `UTOPIA_SUPERIOR`, `OBSOLETE_DONOR` | `plugin-manager/index.cjs`, `plugin-install/*`, `providers.mjs`, `promotions.mjs`, `04-restart-recovery-station/**` |

## 5. Verdict

### NO_VALUE

> **判断无价值，任务保留，未迁移**

Why *not* copying the donor is the correct engineering choice here:

1. **The donor's coherent admission design cannot be reached by a user.** The entire
   `app/core/plugin-install/` state machine — the only place pin, quarantine, rollback
   readiness and explicit confirmation exist — has zero application consumers. Lifting
   dead design into a `MIGRATION_ONLY` city is not a migration of working behaviour.
2. **The donor does not verify provenance, so CU-02 has nothing to migrate.** It records
   a provenance object from a regex over user input and stops. Utopia records *and*
   verifies, against real Git history, for every promotion record.
3. **CU-04's preflight does not exist as a refusal in the donor** — the metadata is
   declared but nothing refuses on it, and the real isolation is post-admission process
   spawning for a plugin platform Utopia does not have.
4. **Permissions are out of scope and were never a gate.** MB-002's DONOR.json assigns
   permission/authorization resolution to MB-012; separately, the donor's own permission
   codes are produced nowhere and an ungranted permission is logged and admitted.
5. **The live donor fragments are equivalent-or-weaker than Utopia's existing checks.**
   Manifest admission, promotion provenance, capability ownership and enable/disable
   readiness are all already implemented, tested and consumed. A Customs layer
   re-performing them would duplicate existing checks — precisely what this Mission's
   Verification gate forbids ("必须证明抽取后没有重复执行 Utopia 已有
   manifest/promotion/capability 检查").
6. **There is no consumer to admit.** Utopia's admission units are City modules and
   incubator Rooms, not `dshns.plugin/v1` / `dshns.adapter/v1` / `dshns.process/v1`
   packages. Creating a plugin platform so that a Customs layer has something to check
   would be `NEW_FEATURE_DEVELOPMENT`, forbidden by `MODE = MIGRATION_ONLY`.

**Note on the MB-002 deferral.** MB-002's `DONOR.json` named MB-011 as the future owner
of the deferred Hns plugin/adapter platform. That note was written as a *placeholder* for
future work, not as a validated finding. This assessment validates it and closes it: the
deferred layer's consumer does not exist in Utopia, and its most complete part is
unreachable even inside the donor. Deferring to a Mission is not the same as proving the
Mission has value, and the honest outcome is `NO_VALUE` rather than a migration that would
land uncallable code.

## 6. 论文 / 研究素材 (measured facts only)

```text
planned capability count                : 5
equivalent already present              : 3   (CU-01, CU-03, CU-04)
Utopia superior                         : 2   (CU-02, CU-05)
concrete gaps                           : 0
selected full / partial migration       : 0 / 0
abandoned                               : 5
rejection reason-code distribution      : DUPLICATE_EQUIVALENT 3, UTOPIA_SUPERIOR 2,
                                          OBSOLETE_DONOR 3, NO_REAL_CONSUMER 2,
                                          WRONG_OWNERSHIP 1, NO_INDEPENDENT_VALUE 1
                                          (multi-code rows)
donor modules surveyed                  : 17 DS-Hns admission modules (343/421/363/260/416/330/
                                          453/273/442/217/309/205/232/464/264/190/550 lines)
                                          + Codex-Boss capability-manifest.ts (17622 B),
                                          permission-manifest.ts (2003 B),
                                          rollback-controller.ts (8887 B)
donor dead-code measurement              : plugin-install/* = 960 lines, 0 app consumers
                                          17 declared-but-never-produced refusal codes
                                          createVerify/verifySignature/publicKey/x509/
                                          contentHash/pluginHash = 0 hits each
source/target anchors inspected          : 17 donor admission modules + 2 Codex-Boss admission
                                          files + 2 donor capability configs; Utopia: 12
                                          module/service/verifier/contract anchors across
                                          city/, apps/rooms/, services/, scripts/, contracts/
parity/runtime checks PASS/FAIL          : bounded admission chain 13/13 PASS, 0 FAIL
                                          city/test-all.mjs 1807 pass / 0 fail / 1 skipped (of 1808)
                                          root node --test tests/*.test.mjs 84 pass / 0 fail
                                          promotion history 10/10 records verified
                                          TOTAL: 1904 PASS, 0 FAIL
assessment start (host clock)            : 2026-09-30T15:48:08Z (claim)
assessment end (host clock)              : see git commit time of assessment HEAD
implementation churn / tests / CI        : 0 product/runtime files changed; 0 new tests;
                                           no CI run required (no implementation)
```

### Recorded issues, choices and judgement calls

1. **Issue: two donors, and the Mission's capability names match neither literally.**
   *Choice:* map CU-01..CU-05 by semantics onto both frozen trees rather than by
   directory name, and record where the two donors overlap.
   *Judgement:* DS-Hns owns the plugin/adapter admission layer the Mission names;
   Codex-Boss owns the capability-interface-graph and permission-manifest admission.
   Both were assessed; neither produced a gap.

2. **Issue: MB-002 explicitly deferred work to MB-011, which could be read as a
   pre-existing commitment.** *Choice:* treat the deferral as a hypothesis to test, not
   as evidence of value, and test it explicitly (this report's §0 and §5).
   *Judgement:* the deferral is a placeholder; testing it is what converts it into either
   a migration or an honest negative result. It is a negative result.

3. **Issue: "the donor has feature X" is not the same as "the donor RUNS feature X".**
   *Choice:* for every capability, establish the donor's caller graph before judging
   coverage. *Judgement:* this inverted the verdict. The donor's most complete admission
   machinery (`plugin-install/*`) is unreachable from `app/`; several refusal codes that
   look like enforcement are declared and never produced; the permission "gate" logs and
   admits. An assessment that read the code without the caller graph would have returned
   `FULL_MIGRATION` for CU-05 and CU-01.

4. **Issue: a first bounded run reported CU-03's nameless-capability refusal using a
   different code than expected.** *Judgement:* this is correct behaviour — the
   descriptor factory raises `INVALID_INPUT` before the registry's own
   `FABRIC_REASONS.NAMELESS` path is reached, and the probe asserts refusal rather than a
   specific code. Recorded rather than smoothed over, because a future consumer must know
   which layer refuses.

### Negative-result observations (kept for research)

- **Deferral debt is not migration value.** A prior Mission's `DEFERRED ... belongs to
  MB-0NN` note is a *pointer*, not a finding. Two consecutive assessments (MB-010, MB-011)
  found that the named remainder of a donor was either already covered or dead; the
  mechanism that makes this detectable is the donor caller graph, not the donor file list.
- **Declared refusal codes are a trap for assessment.** Ten of the donor's refusal codes
  in *live* modules are never produced. Counting them as present enforcement would have
  over-stated donor coverage of CU-01/CU-03/CU-04 in the opposite direction too — it would
  have made the donor look like it refused things it does not.
- **Two donors can be strictly weaker than the target.** Utopia verifies promotion
  provenance against real Git history; the donor records provenance from a regex over a
  user string and never verifies it. "The donor has a provenance module" is not evidence
  that the donor enforces provenance.
- **Absence of a district is not absence of a capability.** `01-governance` does not
  exist in the City map, yet every admission check CU-01..CU-05 asks for already exists
  elsewhere and is consumed. Directory-name reasoning would have produced
  `FULL_MIGRATION` with a brand-new building.

## 7. Utopia 素材指针

- Raw local: `.runtime/evidence/mission-book/MB-011/2026-09-30-mb011-assessment-01/assessment/`
  (git-ignored: DS-Hns `app/core` subset zip + extraction, probe script, receipt, suite logs)
- Evolution inbox: `data-records/evolution/inbox/mission-book/MB-011/events.jsonl`
  (4 events: `MISSION_CLAIMED`, `ATTEMPT_STARTED`, 2 × `TEST_PASS`)
- Published bounded evidence: `evidence/raw/mission-book/MB-011/assessment/`
  (`README.md`, `capability-matrix.json`, `bounded-admission.json`, `environment.json`)
- Assessment branch immutable HEAD: `mission/MB-011-customs` @
  `82b6ac486d024efcfcc64703b58cc136b546caf9`

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
R1/R4, not a failure state. The scheduler must treat MB-011 as complete and skip it
unless the Owner explicitly resets or reopens it.
