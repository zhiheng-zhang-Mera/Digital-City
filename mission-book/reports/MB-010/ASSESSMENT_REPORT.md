# Assessment Report — MB-010

```text
MISSION = MB-010
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST = Mech
CLAIM_COMMIT = e424178c35dd7f47cd859dc5e784186c2e976a91   (Digital-City main)
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080
UTOPIA_MAIN_BASELINE = zhiheng-zhang-Mera/utopia@756c7d760c605e33ba386e87605e078fe24b82ca
ASSESSMENT_BRANCH = mission/MB-010-node-fabric
ASSESSMENT_HEAD = 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526
ASSESSMENT_RESULT = NO_VALUE
```

```text
PLANNED_CAPABILITIES = NF-01, NF-02, NF-03, NF-04, NF-05   (count 5)
SELECTED_GAP_CLOSURES = none
ABANDONED_CAPABILITIES_AND_REASONS =
  NF-01 DUPLICATE_EQUIVALENT
  NF-02 DUPLICATE_EQUIVALENT
  NF-03 OBSOLETE_DONOR
  NF-04 UTOPIA_SUPERIOR
  NF-05 DUPLICATE_EQUIVALENT + NO_REAL_CONSUMER + NO_INDEPENDENT_VALUE
ASSESSMENT_RESULT = NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

## 0. 领取依据 / Why this Mission was claimable

Selection followed [MISSION_INDEX.md](../MISSION_INDEX.md) and [README.md](../README.md) §3.

```text
P0 (verification / integration): NONE eligible.
   MB-001..MB-009 all have verification_complete = true.
   Every mission branch measured AheadOfMain = 0 against utopia@756c7d7
   (MB-001..MB-009 all merged; the only branch with unmerged commits was the
   pre-mission mech/knowledge-room-k0, which is not a Mission branch and is 192
   commits behind main).
P1A (assessment-first): MB-010 is the lowest-sequence enabled assessment-first
   Mission with assessment_complete = false and an unclaimed assessment stage.
```

`UNMERGED_WIP_LIMIT` was not a gate for this claim: an assessment-only branch makes no
substantive implementation commit and therefore does not count as WIP.

## 1. 计划能力 / Planned donor capabilities

The Mission names a "Boss Node Fabric" capability set. The donor contains **no module
literally called `node-fabric`**; the set maps onto the donor's node/fleet/identity
family. Mapping established by reading the frozen tree, not by directory name:

| ID | Planned capability | Donor anchors located |
|---|---|---|
| NF-01 | node principal / registration / membership identity truth | `src/shared/tenx/node.ts` (`NodeIdentity`), `electron/tenx/node-identity-registry.ts` (`TenxNodeRegistry`, `emptyAdvertisement`), `electron/node/node-capability-registry.ts`, `src/shared/tenx/fleet.ts` (`FleetMemberRecord`) |
| NF-02 | heartbeat / liveness / offline truth | `src/shared/tenx/node.ts` (`heartbeat`, `rederiveState`), `src/shared/fleet.ts` (`nodeStateFor`, `detectDropouts`, `FLEET10_*`), `electron/tenx/login-health.ts` |
| NF-03 | runtime endpoint metadata / node endpoint truth | `src/shared/tenx/network.ts` (`NodeNetworkReport`, `ProviderMatrixRow`, `effectiveNetworkState`), `electron/tenx/network-registry.ts` (`TenxNetworkRegistry`, `selectRoute`), `electron/tenx/provider-matrix.ts`, `electron/tenx/host-adapter.ts` |
| NF-04 | hardware / resource telemetry used as node truth | `electron/runtime-intelligence/node-profiler.ts`, `src/shared/runtime-intelligence/node-profile.ts`, `electron/runtime-intelligence/node-telemetry-log.ts`, `src/shared/node-capabilities.ts` (`NodeProbeData`), `electron/node/node-inspector.ts` |
| NF-05 | capability-host advertisement / capability-to-node hosting truth | `src/shared/tenx/node.ts` (`NodeCapabilityFlags`, `NodeCapabilityAdvertisement`, `canAcceptWork`), `src/shared/fleet.ts` (`capabilityInventory`), `electron/node/node-capability-registry.ts` |

Planned capability count = **5**.

## 2. Utopia 当前能力 / Claim-time Utopia inventory (baseline `756c7d7`)

The decisive fact: **MB-001 already migrated the donor's own node logic from this exact
frozen baseline.** `city/00-foundation/01-city-core/fleet-routing` records in
`DONOR.json`:

```text
repository = zhiheng-zhang-Mera/Codex-Boss
commit     = 8df428eaa437a409368401e95194e40266b83080
sourcePaths = src/shared/fleet.ts, src/shared/capability-router.ts,
              src/shared/node-capabilities.ts, src/shared/adaptive-routing.ts
```

Semantically equivalent implementations found (paths differ from the mission's
candidate `city/00-foundation/02-node-fabric`, which does **not** exist — and per City R2
that alone proves nothing):

| Concern | Utopia implementation | Kind |
|---|---|---|
| node registration / membership identity | `services/dev-gateway/server.mjs` `POST /api/v0/node/register` → durable row in `services/dev-gateway/store.mjs` table `nodes` (`id`, `devicePrincipalId`, `displayName`, `metadata.platform`, `agentVersion`, `capabilities`, `online`, `lastHeartbeatAt`) | live service |
| node agent side | `agents/reference-node/agent.mjs` (`register`/`heartbeat`/`claim`/`report` loop), `agents/reference-node/runner.mjs` | live runtime |
| heartbeat / liveness / offline | `server.mjs` heartbeat endpoint + 1 s sweeper (`heartbeatTimeout` default 8000) setting `online:false` and emitting `NODE_OFFLINE`; `claimNodeFor` → `acceptsWork` | live service |
| heartbeat-age derivation (donor rule) | `fleet-routing/fleet.mjs` `fleetNodeStateFor`, `handleNodeDropout` (ported verbatim from donor `src/shared/fleet.ts`) | migrated module (MB-001) |
| self-inspection verdicts (donor rule) | `fleet-routing/capability-routing.mjs` `capabilityVerdicts`, `probeNodeStateFor`, `eligibleCandidates` (ported verbatim from donor `src/shared/node-capabilities.ts` / `capability-router.ts`) | migrated module (MB-001) |
| runtime endpoint truth | `services/dev-gateway/pairing.mjs` `descriptor()` (`endpoint{scheme,host,port}`, apiVersion/schemaVersion); `services/dev-gateway/discovery.mjs` mDNS `utopia-city` + BLE; `platform/windows/ble.mjs`; `store.cityId` | live service |
| hardware / resource telemetry | `agents/reference-node/telemetry.mjs` (`observedAt`, `cpu.usagePercent`, `memory.usedBytes/totalBytes`, `disk.used/free/total`, `uptimeSeconds`), `platform/windows/telemetry.mjs` | live runtime |
| telemetry contract validation | `contracts/pairing-v1/descriptor.mjs` `validateTelemetry` | contract |
| host pressure/health | `city/02-engineering/03-host-health-station/host-health-station` (MB-005) | migrated module |
| capability-host advertisement + hosting decision | node `capabilities[]` on the node record; `REQUIRED_TASK_CAPABILITIES` + `claimNodeFor` + `acceptsWork`; `fleet-routing/capability-routing.mjs` `eligibleCandidates` | live service + migrated module |
| city capability registry / ownership | `city/00-foundation/03-capability-fabric/capability-fabric/registry.mjs`, `services/capability-bridge/registry.mjs` (`moduleRefs`, owner, priority, duplicate-owner refusal, revocation) | migrated module + service |
| product consumer | `apps/web/app.js` `nodeRows`/`nodeBadge`/`nodeState`/`fresh`/`metrics` (device cards, ONLINE/OFFLINE/UNKNOWN, LIVE/CACHED telemetry with a 10 s freshness window), `GET /api/v0/city`, `GET /api/v0/nodes`, `/api/v0/events/stream` | live UI |

Evidence anchors searched and confirmed present: `city/00-foundation/**`,
`services/dev-gateway/**`, `services/capability-bridge/**`, `platform/**`,
`city/CITY_IMPLEMENTATION_MANIFEST.json`, `tests/gateway.test.mjs`,
`tests/telemetry.test.mjs`, `tests/web-v02.test.mjs`,
`scripts/device-telemetry-pilot.mjs`, plus repo-wide greps for `NodeIdentity`,
`devicePrincipalId`, `NetworkReport`, `providerMatrix`, `networkRoutes`,
`effectiveNetworkState`, `lastHeartbeatAt`, `NODE_OFFLINE`, `observedAt`.

Repo-wide grep result worth recording: `NodeIdentity`, `NetworkReport`,
`providerMatrix`, `networkRoutes` and `effectiveNetworkState` have **zero** occurrences
anywhere in Utopia outside the donor extraction — i.e. the donor's TenX route/proxy
registry has no Utopia counterpart at all.

## 3. Capability comparison matrix

| ID | Donor capability | Donor evidence | Utopia equivalent / current behavior | Coverage | Gap | Decision | Reason code | Evidence |
|---|---|---|---|---|---|---|---|---|
| NF-01 | node principal / registration / membership identity truth | `tenx/node.ts` `NodeIdentity`; `TenxNodeRegistry.register/ensureNodeId/deregister`; `FleetMemberRecord.joinedAt` | Durable node record in SQLite with stable `id`/`devicePrincipalId`, membership `online`, re-registration invalidation; `FleetMemberRecord` in the MB-001 port | EQUIVALENT | Donor's richer identity tuple (`deviceType`,`os`,`arch`,`bossVersion`) has no Utopia field, but Utopia records and displays `metadata.platform` + `agentVersion` and has no consumer for the extra tuple | ABANDON | `DUPLICATE_EQUIVALENT` | `server.mjs:93-97`, `store.mjs:9`, `agent.mjs:10`, `fleet-routing/DONOR.json` |
| NF-02 | heartbeat / liveness / offline truth | `heartbeat`, `rederiveState` (12 s/30 s); `controllerNodeStateFor` (10 s/30 s); `detectDropouts` | Live heartbeat endpoint + 1 s sweeper → `online:false` + `NODE_OFFLINE`; `claimNodeFor`→`acceptsWork`; `fleetNodeStateFor`/`handleNodeDropout` already migrated; Web ONLINE/OFFLINE/UNKNOWN + 10 s freshness | EQUIVALENT | None material. The gateway's runtime path is binary (online/offline); the donor's three-state DEGRADED band already exists in Utopia as the migrated pure `fleetNodeStateFor`, and wiring it in would change runtime behaviour rather than migrate a missing donor behaviour | ABANDON | `DUPLICATE_EQUIVALENT` | `server.mjs:31,99,129`, `fleet.mjs:46-51,114`, `app.js:16-18` |
| NF-03 | runtime endpoint metadata / node endpoint truth | `NodeNetworkReport`, `TenxNetworkRegistry`, `ProviderMatrixRow`, `host-adapter.ts` | Utopia owns the *endpoint* meaning: pairing `descriptor.endpoint{scheme,host,port}` + apiVersion/schemaVersion, mDNS `utopia-city` + BLE discovery, `cityId`, consumed by Web/Android pairing | EQUIVALENT | The donor's residual part is a per-node **proxy/AI-provider route + reachability matrix** (`direct/system-proxy/user-proxy/regional-proxy/provider-proxy`). Utopia has no such concept because its architecture is one city gateway with outbound-polling agents | ABANDON | `OBSOLETE_DONOR` | `pairing.mjs:8`, `discovery.mjs:11-18`, `ble.mjs`, repo grep = 0 hits |
| NF-04 | hardware / resource telemetry used as node truth | `node-profiler.ts` (309 lines), `node-profile.ts` (246), `node-telemetry-log.ts`, `NodeProbeData` | Live sampler (CPU delta %, memory, disk, uptime) validated by a contract, shipped on register/heartbeat, stored, rendered live/cached in Web; plus the whole MB-005 host-health station; plus the MB-001 port of `capabilityVerdicts` | SUPERIOR | Donor `gpu` is never observed by the donor itself (`gpu: []` in `node-inspector.ts`), so there is no donor GPU behaviour to migrate | ABANDON | `UTOPIA_SUPERIOR` | `telemetry.mjs`, `descriptor.mjs:25-34`, `app.js:19`, `host-health-station/**` |
| NF-05 | capability-host advertisement / capability-to-node hosting truth | `NodeCapabilityFlags`, `NodeCapabilityAdvertisement`, `capabilityInventory`, `NodeCapabilityRegistry` | Node advertises `capabilities[]` durably; placement gate `REQUIRED_TASK_CAPABILITIES`+`acceptsWork`; `eligibleCandidates`; city capability fabric with ownership/priority/duplicate refusal/revocation; bridge descriptors | EQUIVALENT | The donor's residual value is its `NodeCapabilityRegistry` persistence shape, which Utopia already covers by a stronger mechanism (fabric registry + bridge) from a different donor; migrating it would duplicate registry state | ABANDON | `DUPLICATE_EQUIVALENT`, `NO_REAL_CONSUMER`, `NO_INDEPENDENT_VALUE` | `server.mjs:28-31,102`, `capability-fabric/registry.mjs`, `capability-bridge/registry.mjs` |

## 4. Donor lifecycle finding (the decisive negative result)

The un-migrated remainder of the donor's node fabric is **production-dead at the frozen
baseline**. Verified on the frozen commit itself with read-only `git grep`:

```text
git grep TenxNodeRegistry  @8df428e -> definition + a TYPE-ONLY field in
                                       electron/tenx/observability.ts + tests
git grep TenxNetworkRegistry @8df428e -> same shape
git grep TenxObservability @8df428e -> consumed only by tests/unit/tenx-phase-10r.test.ts
git grep "tenx/" @8df428e -- electron/main.ts electron/bootstrap/ electron/host/ -> NO MATCHES
config/capabilities/node.yaml @8df428e -> node capability declares
                                          modules: []  bootModules: []  surface: []
docs/city/OWNER_CONTINUOUS_CONSTRUCTION_LEDGER.md CC-076 -> records the retirement of
                                          production-dead host-status/tenx modules
```

The donor paths that *are* live are exactly the ones already migrated:

```text
electron/node/node-capability-registry.ts  constructed in electron/main.ts:750
electron/node/node-inspector.ts#inspectDevice  used by bootstrap/host-status-ipc.ts, host/doctor.ts
src/shared/node-capabilities.ts#capabilityVerdicts/nodeStateFor  <- the logic, already in Utopia
```

So the donor's live node behaviour was consumed by MB-001, and its un-migrated remainder
is forward/test-only code whose own repository never constructs it in production.

## 5. Verdict

### NO_VALUE

> **判断无价值，任务保留，未迁移**

Why *not* copying the donor is the correct engineering choice here:

1. **The live half is already migrated.** MB-001 ported the donor's `fleet.ts`,
   `capability-router.ts`, `node-capabilities.ts` and `adaptive-routing.ts` **from this
   same frozen commit** into `city/00-foundation/01-city-core/fleet-routing`, with a
   recorded parity vector list and preserved donor defects. Re-migrating the same
   behaviour under a new `02-node-fabric` building would create a second owner for one
   semantic — the exact duplication the dependency/ownership rules exist to prevent.
2. **The product already owns the rest, and runs it.** Registration, heartbeat,
   liveness/offline, telemetry and capability advertisement are implemented and consumed
   end to end by `services/dev-gateway` + `agents/reference-node` + `apps/web`. This was
   confirmed by a real bounded run, not only by reading code (§6).
3. **The un-migrated remainder is production-dead donor code.** Its own repository never
   constructs `TenxNodeRegistry`/`TenxNetworkRegistry` outside tests, and the capability
   manifest for `node` declares no modules, no boot modules and no surface. Copying it
   would import dead forward-design into a `MIGRATION_ONLY` city.
4. **NF-03's residual concern is out of architecture.** Multi-route proxy /
   provider-reachability truth exists because the donor is a desktop app that must pick a
   working route to reach AI providers under regional restrictions. Utopia's single-city
   gateway has no such decision, and manufacturing it plus a consumer would be
   `NEW_FEATURE_DEVELOPMENT`, which is explicitly forbidden.
5. **No independent lifecycle/failure-domain value.** Every remaining donor fragment is
   either a durable-registry wrapper around logic Utopia already has, or a
   pure-function/route matrix with no consumer. Splitting them out would add a module
   with no independently failing boundary.

## 6. 论文 / 研究素材 (measured facts only)

```text
planned capability count                : 5
equivalent already present              : 4   (NF-01, NF-02, NF-03, NF-05)
Utopia superior                         : 1   (NF-04)
concrete gaps                           : 0
selected full / partial migration       : 0 / 0
abandoned                               : 5
rejection reason-code distribution      : DUPLICATE_EQUIVALENT 3, UTOPIA_SUPERIOR 1,
                                          OBSOLETE_DONOR 1, NO_REAL_CONSUMER 1,
                                          NO_INDEPENDENT_VALUE 1
                                          (multi-code on NF-05)
source/target anchors inspected         : 16 donor files (line counts 30..309) + 1 donor
                                          capability manifest + 1 donor fixture subset
                                          (68 files extracted read-only via git archive);
                                          18 donor tests/unit/tenx-phase-*.test.ts exist;
                                          Utopia: 13 module/service/UI anchors across
                                          city/00-foundation, services/dev-gateway,
                                          services/capability-bridge, agents,
                                          platform, apps/web, contracts
parity/runtime checks PASS/FAIL         : bounded runtime chain 8/8 PASS
                                          city fleet-routing suite 28/28 PASS, 0 FAIL
                                          root gateway+telemetry+web suites 11/11 PASS, 0 FAIL
                                          TOTAL: 47 PASS, 0 FAIL
assessment start (host clock)           : 2026-09-30T15:40:09Z (claim)
assessment end (host clock)             : see git commit time of assessment HEAD
implementation churn / tests / CI       : 0 product/runtime files changed; 0 new tests;
                                          no CI run required (no implementation)
```

### Real bounded runtime chain (8/8 PASS)

Run against a live `createGateway()` on an ephemeral loopback port and a live
`startAgent()` reference node; no mocks, no stubbed facts.

| Step | Result | Observed |
|---|---|---|
| NF-03 runtime endpoint metadata | PASS | `{scheme:http, host:127.0.0.1, port:58093}` |
| NF-01 registration + membership identity | PASS | `{id, devicePrincipalId, displayName "MB-010 probe node", agentVersion "0.2.0", metadata.platform "win32"}` |
| NF-05 capability-host advertisement | PASS | `["task.execute.safe","filesystem.temp"]` |
| NF-04 telemetry measured | PASS | `{cpu.usagePercent 9.0732, memory 17044938752/34066345984, disk used/free/total, uptimeSeconds 664451.125}` |
| NF-04 first sample honest null | PASS | `{cpu:{usagePercent:null}}` on sample #1 — the sampler refuses to fabricate a delta |
| NF-02 liveness online | PASS | `{online:true, lastHeartbeatAt}` |
| NF-02 offline after heartbeat stops | PASS | `{online:false}` after `heartbeatTimeout` 2500 ms with the agent stopped |
| NF-02 dropout recorded | PASS | real `NODE_OFFLINE` event, `seq 3` |

### Recorded issue and judgement call

*Problem observed:* the first bounded run reported NF-04 as FAIL because
`cpu.usagePercent` was `null`.
*Judgement:* this was a defect in **my probe**, not in Utopia. `createTelemetrySampler`
computes CPU usage from a counter delta and honestly returns `null` until a second
sample exists (its own tests assert that a counter reset must not fabricate load).
*Action:* the probe was corrected to (a) wait past the 3000 ms sampler interval before
asserting a measured CPU figure and (b) additionally assert the honest-`null` first
sample as its own positive property. Re-run: 8/8 PASS.
*Why recorded:* a first-sample `null` is a real property a future consumer must expect,
and mis-reporting it as a Utopia failure would have been a false negative in the
assessment.

### Negative-result observations (kept for research)

- A "planned capability set" in a Mission can name a donor subsystem that the donor
  itself never wired into production; directory-name or code-existence reasoning would
  have produced `FULL_MIGRATION` here. Reading the donor's own construction sites
  (`main.ts`/`bootstrap`) and its capability manifest inverted the verdict.
- Two different donors in the same Utopia do the same job at different layers: the
  DS-Hns-derived `capability-fabric` + `capability-bridge` own *city* capability
  ownership, while the Codex-Boss-derived `fleet-routing` owns *node* eligibility. That
  split is why NF-05 is already covered better than the donor's single
  `NodeCapabilityRegistry`.
- `UTOPIA_SUPERIOR` on NF-04 rests on measurement, not on prose: the donor's own
  `node-inspector.ts` always reports `gpu: []`, so "richer donor hardware truth" was an
  assumption that did not survive reading the donor.

## 7. Utopia 素材指针

- Raw local: `.runtime/evidence/mission-book/MB-010/2026-09-30-mb010-assessment-01/assessment/`
  (git-ignored: donor subset zip + extraction, probe script, receipts, suite logs)
- Evolution inbox: `data-records/evolution/inbox/mission-book/MB-010/events.jsonl`
  (5 events: `MISSION_CLAIMED`, `ATTEMPT_STARTED`, 2 × `TEST_PASS`)
- Published bounded evidence: `evidence/raw/mission-book/MB-010/assessment/`
  (`README.md`, `capability-matrix.json`, `bounded-node-truth.json`, `environment.json`)
- Assessment branch immutable HEAD: `mission/MB-010-node-fabric` @
  `8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526`

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
R1/R4, not a failure state. The scheduler must treat MB-010 as complete and skip it
unless the Owner explicitly resets or reopens it.

---

## 9. Independent re-verification (2026-09-30, host `Alien`)

Owner-directed: redo this Mission's verification **without reusing any existing test**, with real
Android device operation permitted. Method, fresh evidence and SHA tracking follow. The
`NO_VALUE` verdict is **independently confirmed**.

### 9.1 Donor lifecycle re-derived (own probes, frozen donor `8df428ea`)

| Question | Result |
| --- | --- |
| `new TenxNodeRegistry(` / `new TenxNetworkRegistry(` anywhere | **zero construction sites** |
| `tenx/` in `electron/main.ts`, `electron/bootstrap/`, `electron/host/` | **no matches** |
| files importing the tenx family | **none** |
| the live paths the report names | `node-capability-registry` constructed in `electron/main.ts`; `inspectDevice` used by `bootstrap/host-status-ipc.ts` and `host/doctor.ts` |

The un-migrated remainder is unreachable from the donor's own composition root, while the reachable
node logic is the part MB-001 already ported. Confirmed.

### 9.2 Real Android device verification

Real device `PERM00` (Android 12, `172.31.3.18`) paired over the LAN with the live City gateway
(`172.31.3.110:4310`) through the app's own `utopia://pair` descriptor, then exercised on-device.
No mock, and no repository pilot or test was used.

| Verdict | Fresh evidence |
| --- | --- |
| NF-01 registration / identity | device renders the node list: `Alien-PC`, platform `win32`, Agent `0.2.0`, capabilities `task.execute.safe` + `filesystem.temp` |
| NF-02 heartbeat / liveness | live node rendered `ONLINE`; stale node rendered `OFFLINE · Cached` with `Last seen` |
| NF-04 telemetry | device renders `CPU: 25.9%`, `Memory: 18.4 GB / 31.8 GB` |
| NF-04 numeric agreement | gateway `telemetry.memory.usedBytes = 19740823552` → 18.4 GB, **exactly** what the device renders (and the stale node's `17790050304` → 16.6 GB) |
| NF-05 capability advertisement | the Services view renders `Document Intake` as `AVAILABLE · ACTIVE` with its operation surface |
| durable history consumed on device | four `presentation.theme.lab` `COMPLETED` invocations rendered on the phone — the ids are from earlier real invocations, so this is real cross-session history, not fixture data |

Screenshots: `.runtime/evidence/mission-book/MB-010-011-012/device-devices-view.png` and
`device-services-view.png`.

**Verdict: `NO_VALUE` confirmed.** No live, uncovered donor node-fabric behaviour exists to
migrate: the product already owns and consumes the node truth end to end, and the remainder is
production-dead inside the donor itself.


### 9.3 Branch / SHA tracking

```text
utopia main at verification : 756c7d760c605e33ba386e87605e078fe24b82ca
assessment branch           : mission/MB-010-node-fabric @ 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526
ahead / behind main         : 1 / 0
that one commit contains    : data-records/evolution/inbox/mission-book/MB-010/events.jsonl
                              evidence/raw/mission-book/MB-010/assessment/** (README, capability-matrix,
                              environment, bounded-*)
                              NO IMPLEMENTATION CODE
merge (at verification time) : NOT PERFORMED, by rule. README line 223 (echoed by response-9-30 R1)
                              keeps a NO_VALUE assessment branch as provenance and explicitly forbids
                              merging it, and forbids fabricating a verified implementation episode.
merge (Owner ruling R11)    : PERFORMED afterwards as a PROVENANCE merge, by explicit Owner direction:
                              response-9-30.md#R11 overrides README line 223 for these three branches only.
                              git merge --no-ff mission/MB-010-node-fabric
                                -> 6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a  (parents 756c7d7, 8380c38), conflict-free,
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
`merged_main_sha` stays `null`. What ruling R11 archived into `main` is the assessment
provenance alone - the tests, dry-runs and probes this section reports, not a migrated capability.

### 9.4 Evidence pointers

- `.runtime/evidence/mission-book/MB-010-011-012/donor-lifecycle-probe.json` (donor reachability, all three)
- `.runtime/evidence/mission-book/MB-010-011-012/precise-claims-probe.json`
- `.runtime/evidence/mission-book/MB-010-011-012/utopia-admission-enforcement.json`
- `.runtime/evidence/mission-book/MB-010-011-012/real-device-node.json` plus the two device screenshots
