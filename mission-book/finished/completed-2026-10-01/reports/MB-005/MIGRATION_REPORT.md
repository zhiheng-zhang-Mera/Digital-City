# MB-005 — Host Health Station vendor-neutral 纯迁移 — MIGRATION REPORT

> **Status: `MIGRATION_COMPLETE`** (Migration stage only; **not merged to `main`**)
> Migration Host: **Mech**
> Claimed at: `2026-09-29T12:33:27Z`
> City claim commit: `89d506e7a791b9c90006d2a4f19dd4d73c4c897a` (pushed to `Digital-City` main; no write conflict)
> Implementation branch: `mission/MB-005-host-health`
> Branch base: `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`
> Implementation commit: `5fbbec666f61b2ff82f06a85630c2fb538ca7631`
> Final branch HEAD: `545d38fa6cc7023826c5a3a4a09cb2e37265eb06` (implementation + the event-stream closeout commit)
> Migration CI: **PASS on both** — run `36571598704` on `5fbbec66…` and run `36571983546` on `545d38fa…`; `gateway-web` success and `android` success in both

---

## 1. Donor / frozen baseline

| Donor | Frozen SHA |
|---|---|
| `zhiheng-zhang-Mera/dsh-health-scheduler` | `985e2b7389330db4b32ea2946e3657746c64b47b` |

The donor is an ESM TypeScript package with **zero runtime dependencies**, whose
only non-portable surface is `src/dsh/**` — the DeepSeek/Cordis plugin binding
that this Mission exists to remove.

The frozen tree was fetched into the git-ignored mission evidence area at exactly
that SHA. Because the donor has no runtime dependencies it can be **compiled and
run**, so this migration did not have to rely on transcribed expectation tables:
installing `typescript@5.7.2` into that checkout and running the donor's own
`tsc` produced `lib/**/*.js` (31 files) which executes on plain Node. That build
is the **executable golden oracle** used in §6. The donor's own suite passes
**155/155** against it, so the oracle is known-good rather than assumed-good.

---

## 2. Landing boundary (source → target)

**Target module:** `city/02-engineering/03-host-health-station/host-health-station`
**City owner:** 02/03 Host Health Station — Runtime Health Scheduling Service.

### 2.1 Path decision

The Mission names the target path `city/02-engineering/03-host-health-station`.
`city/manifest.mjs` enforces `module.path === city/<district>/<building>/<module>`,
so as with MB-002 this is realised as building `03-host-health-station` containing
module `host-health-station`. The manifest's ownership invariant is preserved and
no City ownership was changed.

### 2.2 Source → target file ledger

Transcription source was the donor's **compiled `lib/**`** (the oracle),
cross-checked against `src/**`, so constants, orderings, reason strings and
tolerances are the donor's own bytes rather than a re-derivation.

| Donor source | Target |
|---|---|
| `src/types/{metrics,provider,window,decision,config,index}.ts` | `types.mjs` |
| `src/core/bands.ts` | `bands.mjs` |
| `src/core/normalize.ts` | `normalize.mjs` |
| `src/core/rolling.ts` | `rolling.mjs` |
| `src/core/trend.ts` | `trend.mjs` |
| `src/core/pressure.ts` | `pressure.mjs` |
| `src/core/policy.ts` | `policy.mjs` |
| `src/core/maintenance.ts` | `maintenance.mjs` |
| `src/core/safe-point.ts` | `safe-point.mjs` |
| `src/core/config.ts` | `config.mjs` |
| `src/core/presets.ts` + `presets/*.json` | `presets.mjs` |
| `src/core/scheduler.ts` | `scheduler.mjs` |
| `src/audit/decision-log.ts` | `audit.mjs` |
| `src/providers/*.ts` (8 files) | `providers.mjs` |
| `src/adapters/types.ts` | `adapters.mjs` |
| `src/dsh/report.ts` + the three pure renderers buried in `src/dsh/plugin.ts` | `report.mjs` |
| `SETTINGS_NAMESPACE` / `configSchema` / the watch-callback behaviour from `src/dsh/plugin.ts` | `settings.mjs` |
| `registerBuiltInProviders` from `src/dsh/plugin.ts` | `wiring.mjs` |
| `src/index.ts` | `index.mjs` |

Full per-symbol detail, the adaptation list, the classification and the recorded
donor bug are in the module's `DONOR.json`.

**A note on the four extra files.** The brief's suggested layout did not
anticipate `report.mjs`, `settings.mjs`, `wiring.mjs` and `adapters.mjs`. They
exist because the donor buried **non-binding logic** inside its Cordis plugin
body. The Mission requires the binding to go and the behaviour to stay, so that
logic was migrated into its own modules rather than dropped. `DEFERRED` is
therefore empty: nothing was left behind under the excuse of "plugin code".

---

## 3. Preserved behaviour / explicitly NOT migrated

### 3.1 Preserved

The canonical metric registry (43 metrics with units, polarity, hard physical
bounds and descriptions) as the single vocabulary every provider speaks; band
ramps with polarity-owned endpoints and the `span === 0` guard; the sustain gate
whose unmet score is `0`, not a high score filtered later; the band-identity
contract that makes the rolling store responsible for timing band duration;
normalization with the `1e-9` relative hard-bound tolerance and the
ratio-above-1.0 clamping rule; rolling windows and trend analysis including the
bandless leak metrics; the six-dimension pressure engine with `WORST_WEIGHT = 0.5`
blending, the uptime ramp, coverage renormalization and the rule that **missing
telemetry is `unknown`, never a zero**; the level boundaries
(`moderate 35 / high 65 / critical 85`); the policy ladder with its
sustain/hysteresis/debounce/dwell/cooldown anti-flapping; maintenance windows,
safe points and defer; the bounded append-only decision log; the provider
contract and registry; and the scheduler that ties them together.

`autoResume`-style semantics, the refusal reason vocabulary, and the donor's
determinism seams (injected clock, injected providers, injected adapters) are all
preserved, which is what makes the differential harness in §6 possible at all.

### 3.2 Explicitly NOT migrated, and why

| Not migrated | Reason |
|---|---|
| `src/dsh/context.ts` | Pure Cordis context typing — the binding this Mission removes. |
| `src/index.ts` `name` / `inject` / `apply` / `applyHealthScheduler` | The plugin loader contract. A vendor-neutral City module registers nothing with a harness. |
| The model-facing tool definitions and descriptions | A harness tool surface, not health judgement. |
| `package.json`, `package-lock.json`, `tsconfig.json`, `cordis.patch.yml`, `plugin/manifest.json`, `presets/schema.json`, `scripts/**` | npm/Cordis packaging. Utopia's City modules are plain `.mjs` files discovered by `node city/test-all.mjs`; no build step and no new dependency. |
| `lib/**` | Build output. |
| Actually executing a restart or reboot | Out of scope by the Mission (MB-006 owns it) **and** never implemented by the donor. See §7. |

---

## 4. Interface / contracts

`index.mjs` re-exports the engine and its seams. The load-bearing entry points:

- `createScheduler(options)` / `HealthScheduler` — the engine.
- `resolveConfig` / `tryResolveConfig` / `deepMerge` / `ConfigError` — configuration.
- `PRESETS` / `preset` / `PRESET_SCALES` / `PRESET_DOCUMENTS` / `DEFAULT_METRIC_CONFIG` — the three shipped presets, with the donor's `presets/*.json` embedded verbatim as data and asserted equal to the built presets.
- `CANONICAL_METRICS` / `METRICS` / `metricDescriptor` / `isCanonicalMetric`; `ACTION_LEVEL` / `PRESSURE_LEVEL_RANK`; `DECISION_LADDER` / `PRESSURE_DIMENSIONS`.
- `normalizeSample`; `RollingStore`; `TrendAnalyzer`; `PressureEngine` / `dimensionOf` / `UPTIME_RAMP_START_MS` / `UPTIME_RAMP_FULL_MS`; `LEVEL_BOUNDS` / `levelOf` / `scoreMetric` / `scoreWithSustain`; `PolicyEngine` / `initialPolicyState`; `computeMaintenancePicture` / `maintenanceAllowsRequest` / clock helpers; `SafePointRegistry` / `foldReadiness`; `DecisionLog` / `LOG_SCHEMA_VERSION`.
- `ProviderRegistry`; `HardwareProvider` / `MemoryProvider` / `RuntimeProvider` / `EMPTY_RUNTIME_FEED`; `StatsFileSource` / `extractMetrics` / `parseNameValueLines` / `runCommandProbe` / `mergeBags`; `defaultEnvironment` / `readProcessFacade`; `buildBuiltInProviders` / `registerBuiltInProviders`.
- `UnavailableRestartAdapter` / `UnavailableWorkerControlAdapter` / `outcomeForAction` — the two shipped adapters that **refuse rather than act**.

The only entry points absent from the donor's published list are exactly the four
plugin members named in §3.2; the differential harness asserts that.

---

## 5. Existing consumption surface (no new UI)

No new UI, dashboard or HTTP route was added, and `services/dev-gateway/server.mjs`
was **not** touched. The Mission's verification criterion is that an existing
Utopia surface can read real status/history. The driver in §7 does exactly that:

- it starts the **real gateway** and the **real reference node** (the existing node
  fabric surface),
- it reads the node's **live telemetry** from the `GET /api/v0/city` payload that
  `apps/web` Devices already renders — telemetry produced by
  `agents/reference-node/telemetry.mjs` from `node:os`,
- maps that onto the module's canonical vocabulary, and
- drives the ported engine over the real series and prints status, pressure,
  coverage, per-dimension scores and the action request.

**Recorded judgement:** the telemetry→canonical-metric mapping lives in the
**evidence driver**, not in the module. It is a consumer concern, and the module
already ships its own provider contract for precisely that purpose; adding a
gateway-specific mapping to the module would be new product surface rather than
migration. Only metrics the reference node genuinely measures are mapped;
everything else stays absent so the picture reports it `unknown` rather than
inventing a zero. `disk` is deliberately unmapped: the donor's canonical
vocabulary has no disk metric, and inventing one would be new capability.

---

## 6. Tests

### 6.1 Module suite — 83 tests, all pass

`tests/host-health-station.test.mjs` (82) plus `tests/differential.test.mjs` (1),
run by `node city/test-all.mjs`.

### 6.2 Differential parity against the compiled donor

The strongest evidence here is not a transcribed table but an execution
comparison. The harness drives **both** the ported module and the compiled donor
through the same scenarios with the same injected clock:

```text
differential: 110 scenarios compared, 110 agreed, 0 disagreed; 916 ticks,
3433 per-metric entries, 89 decisions, 8 restart requests, 41 decisions
carrying a refusal reason
differential actions: PAUSE_NEW_WORK=67 REQUEST_APP_RESTART=1
                     REQUEST_SYSTEM_REBOOT=7 THROTTLE=14
```

The matrix is 70 hand-authored scenarios (normal load; no telemetry;
one-dimension-only; a provider going silent; sustained thermal and memory
pressure; a transient spike shorter than the 60 s sustain gate; a spike exactly
at the gate; recovery; a band-edge sweep for **every** banded metric; a 4-hour
RSS leak; latency ramps; a worker storm; a frozen UI; an 8→400 h uptime ramp; the
full ladder; debounce; each restart gate; urgent override; a missing capability;
cooldown pacing; 10 maintenance instants; a wrapping window across 3 local days)
plus 40 fixed-seed (`mulberry32`) random scenarios across all seven providers.

Compared per tick: pressure and its implied level, coverage, every dimension's
score/level/weight/effective weight/summary, every metric's value/score/level/
rule/`sustainedMs`/`trendApplied` **plus band, band key, raw score and gated score
recomputed from each side's own primitives**, drivers, trends, the maintenance
picture, the safe-point fold, capabilities, provider rows, daily summaries,
warnings, the full decision-record stream, and every adapter call including full
restart request objects. Only `unknownDimensions`/`warnings` are order-normalised;
the three per-metric intermediates are recomputed per side because the snapshot
does not publish them. The normalisation is documented in the file header.

**Additional parity evidence:** the donor's six non-plugin suites (**124 tests**),
copied with only their import specifiers rewritten, pass **124/124 unmodified**
against the port.

### 6.3 Required CI gates, run locally

| Gate | Command | Result |
|---|---|---|
| Root tests | `pnpm test` | **58 / 58** |
| City module tests | `node city/test-all.mjs` | **212 / 212** |
| Rooms tests | `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| Bilingual docs | `pnpm check:docs` | **SYNCHRONIZED** (docs, evidence, data-records) |
| Promotion history | `node scripts/verify-promotion-history.mjs` | **10 records verified** |
| Android | CI job (`temurin 21`) | see §11 |

Baselines measured for honesty: the city suite **without** this module is
**129 / 129** in this checkout (not 173 — that figure belongs to the MB-002
branch, which carries MB-002's own module; the two branches are independent, each
built from `c7ef3cd`). The frozen donor is **155 / 155**.

### 6.4 Real failures found and repaired during construction

**A latent fragility on `main`, repaired.** Three root tests hard-coded manifest
positions and absolute census counts: `tests/capability-registry.test.mjs` used
`m.districts[0]` and `m.districts[2]` and asserted an absolute unbridged count of
`1`; `tests/capability-adapters.test.mjs` used `manifest.districts[0]` and
asserted `catalog.length === 6` with exactly 5 `AVAILABLE`. Declaring the new
building changed the census and **all three failed**. The fixtures are now
census-relative (`districts.at(-1)`, counts taken against a baseline measured
before the fixture mutates the manifest, added entries asserted by capability-id
suffix). The properties under test — qualified identity per
district/building/module, `BRIDGE_PENDING` for an unbridged module, and all five
bridged adapters still executing — are unchanged, but they can no longer break
merely because a later Mission declares another district or building. This is a
generic defect that every future Mission declaring a district would have tripped.

**A stale draft replaced.** An untracked `tests/differential.test.mjs` draft
written by this Mission's author expected an API that does not exist
(`createHostHealthStation`, `snapshot.metrics` as an array) and never advanced its
clock by `advanceMs`. It was superseded by the working harness. The first
differential run then disagreed on `sustainedMs` and the rule text purely because
of that clock-wiring asymmetry; with one shared clock the engines agree exactly.
That is recorded because it is the failure mode a Verifier should re-check: a
differential test with two differently-wired clocks proves nothing.

---

## 7. Data / error / recovery records

- **The module never executes a restart.** Independently audited: no
  `process.kill`, `taskkill`, `execSync`/`spawnSync`, shutdown or reboot
  primitive appears in any module file. The string `reboot` appears only as
  policy/action vocabulary (`REQUEST_SYSTEM_REBOOT`). The ladder stops at a
  bounded action **request**; the two shipped adapters refuse rather than act; the
  differential harness confirms both sides issue the *same* request records and
  perform no effect.
- **The one `child_process` import is bounded and opt-in.** `providers.mjs`
  imports `execFile` and uses it **without a shell** for read-only command probes,
  so a crafted metric value cannot become shell injection. It is reachable only
  when a caller configures `helperCommand`; the shipped default is
  `helperCommand: null`, so importing the module spawns nothing and the tests run
  with synthetic telemetry only. `node:os` is read through an injectable facade.
- **Real telemetry consumption (no new UI).** 12 samples of the live reference
  node's telemetry through `GET /api/v0/city`:

  ```text
  state HEALTHY · action NO_ACTION · restart_pressure 12 · coverage 0.6
  cpu_usage 0.1818 · ram_used_ratio 0.5748 · ram_available_bytes 14485180416
  ram_total_bytes 34066345984 · uptime_seconds 603783
  unknownDimensions: runtime, worker, computer_use_ui      (UNKNOWN, never zero)
  restart requests: 0 (correct for a healthy host)
  ```

  Partial coverage is the honest outcome and is exactly what the donor's
  coverage field exists to publish: three of six dimensions were measurable from
  this host's telemetry, so a 60 %-coverage pressure can never be mistaken for a
  full-confidence one.
- **Errors.** Refusals are coded values in the donor's vocabulary, not throws
  across the boundary; the donor's own refusal-reason strings are preserved.
- **No secrets, no credentials, no unbounded terminal dumps** were recorded.

---

## 8. Known limitations

### 8.1 A real donor bug is reproduced, deliberately, not fixed

`bandKeyOf` in the donor's `src/core/bands.ts` **never returns `:warn` for a
`lower-is-worse` metric**. `rampEndpoints` returns `best > worst` for that
polarity, so the first test (`value <= best`) swallows the whole range and the
second (`value <= worst`) is unreachable. Independently reproduced against the
compiled oracle:

```text
bandKeyOf('recovery_rate', 0.6, {warn: 0.8, critical: 0.3})   -> 'recovery_rate:critical'  (should be ':warn')
bandKeyOf('ram_available_bytes', 1 GiB, {warn: 4 GiB, critical: 512 MiB}) -> ':critical'
bandKeyOf('cpu_temp_c', 88, {warn: 80, critical: 95})         -> 'cpu_temp_c:warn'         (unaffected)
```

Consequence: for the two `lower-is-worse` banded metrics the band clock starts at
the `warn` endpoint and never resets while the metric stays past `warn`, so
crossing `warn → critical` already satisfies the sustain gate.

**Decision:** ported exactly and pinned with a test that names it.
`MODE=MIGRATION_ONLY` forbids changing donor semantics, and a silent fix would
both break differential parity and change **when a gate opens** — that is a
behaviour change, not a migration. **Recommendation:** this needs a City-owner
decision (a superseding Mission or an explicit fix instruction); the code change
is two lines, but it is a semantics change and should be made deliberately.

### 8.2 The restart request's `source` field is still the donor literal

The request records carry `source: 'dsh-health-scheduler'`. Renaming it would
break field-by-field differential parity for a cosmetic reason, so it is kept and
flagged in `DONOR.json.knownDifferences`. If the City prefers a
`utopia.host-health-station` source, that is a deliberate contract change for the
Verification Host or a later Mission.

### 8.3 `checkManifestAgainstTree` does not guard against undeclared modules

`city/manifest.mjs` validates only modules the manifest declares; it never flags a
module **directory** that no manifest entry mentions. An earlier draft of this
report claimed that test would fail for an undeclared module — it does not, and
that claim has been corrected here. The module was registered explicitly (§2.1).
Adding a real undeclared-module guard is a `manifest.mjs` change outside this
Mission's boundary, and is recommended as a separate repair: as it stands, a
module can exist in the tree and be invisible to the census.

### 8.4 Android and cross-device verification

This Mission's verification criteria call for **two hosts** running real
telemetry through normal, unknown/missing and sustained-pressure/debounce
scenarios. That is the Verification Host's work. Locally the Android job cannot
run (this host has only JDK 25/26; CI uses temurin 21 — the same limitation
recorded in the MB-002 report), and no Android source was touched.

---

## 9. Utopia evidence pointers

Raw, git-ignored:

```text
.runtime/evidence/mission-book/MB-005/
├─ donor-health/                    frozen donor + its compiled lib/ oracle
└─ run-1/
   ├─ consumption-driver.mjs        real-telemetry consumption driver
   ├─ consumption/consumption.json  12 live samples + checks
   └─ tests/
      ├─ host-health-station-tests.txt   83/83
      ├─ city-tests.txt                  212/212
      └─ root-tests.txt                  58/58
```

Structured, on the mission branch:

```text
data-records/evolution/inbox/mission-book/MB-005/events.jsonl
```

Events recorded (all `MIGRATION` / `Mech`): `MISSION_CLAIMED`, `ATTEMPT_STARTED`
(twice: the module reconnaissance and the oracle), `OWNER_INTERVENTION` (the
donor-bug decision), `TEST_FAIL` and `REPAIR_APPLIED` (the census-relative test
repair), `TEST_PASS`, `RUNTIME_PASS`, and `CI_RESULT`.

No large raw logs were copied into Digital-City.

---

## 10. Branch HEAD / CI status

- Mission branch: `mission/MB-005-host-health`
- Implementation commit: `5fbbec666f61b2ff82f06a85630c2fb538ca7631`
- CI run: `36571598704` (`V0.2 checks`)
- **The migration branch is NOT merged to `main`.** Merging is the Verification
  Host's action after all required CI and the Mission's own gates are green.

---

## 11. CI result (settled)

```text
run 36571598704   head 5fbbec666f61b2ff82f06a85630c2fb538ca7631   gateway-web success / android success
run 36571983546   head 545d38fa6cc7023826c5a3a4a09cb2e37265eb06   gateway-web success / android success
```

The second run covers the final branch HEAD, which is the exact revision a
Verification Host will review and merge. The Android job ran on CI's
`temurin 21`, which is the environment §8.4 could not reproduce locally.

The `migration_ci` field in `mission-book/MB-005-host-health.md` records the same
facts; that field is the runtime truth.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/MIGRATION_REPORT.md)
