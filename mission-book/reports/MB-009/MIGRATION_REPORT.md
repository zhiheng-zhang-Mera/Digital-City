# MB-009 — Theme Engine 11→00/05 物理归属迁移 — MIGRATION REPORT

> **Status: `MIGRATION_COMPLETE`** (Migration stage only; **not merged to `main`**)
> Migration Host: **Mech**
> Claimed at: `2026-09-29T14:45:00Z`
> City claim commit: `268ab59411ee54893cdd1f648e5155008e2b2a6a` (pushed to `Digital-City` main; no write conflict)
> Implementation branch: `mission/MB-009-theme-relocation`
> Branch base: `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`
> Implementation commit: `65f9aa740a937e52542e1ecf60babf742f4cf9ba` (relocation)
> Provenance commit: `277f576e9eb35670d77edd0aa98c192d56a7a961`
> Final branch HEAD: `d338152b0c7ef2ef7e94d78901454ea91f200156`
> Migration CI: **PASS** — run `36580730966` (`V0.2 checks`) on `277f576e…`; `gateway-web` success, `android` success

---

## 1. Donor / frozen baseline

| Source | Notes |
|---|---|
| `Utopia main` `city/11-entertainment/01-entertainment-centre/theme-engine` | already `PROMOTED`; the thing being moved |
| `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b` | historical donor, unchanged |
| accepted D9 theme-builder promotion history | must stay traceable |

This is a **relocation**: path, references and consumer boundary only. No theme
behaviour is added and none may be. Global theme apply remains `NO`.

---

## 2. Landing boundary (source → target)

| | Path |
|---|---|
| Source | `city/11-entertainment/01-entertainment-centre/theme-engine` |
| Target | `city/00-foundation/05-control-centre/theme-engine` |

The Mission's stated target is exactly the target above, and — unlike MB-002,
MB-004 and MB-005 — it needs **no interpretation**. `city/manifest.mjs` enforces
`module.path === city/<district>/<building>/<module>`, and this path is already in
that shape: district `00-foundation`, building `05-control-centre`, module
`theme-engine`. The manifest was therefore restructured rather than reinterpreted.

**19 files moved with `git mv`**, so Git records them as renames and the code is
byte-identical; nothing was copied and nothing was edited in transit.

### 2.1 Reference ledger

| Reference | Action | Why |
|---|---|---|
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | **restructured**: a `00-foundation` district with a `05-control-centre` building now owns `theme-engine`, which records `relocatedFrom` / `relocatedByMission`. `11-entertainment` is no longer declared. | The manifest is a live ownership registry, so it must name the current owner. A district with no module is not declared (validation requires a building to have at least one module, and the census test asserts the exact set). |
| `city/tests/manifest.test.mjs` | census updated: district list and module-path list, with a comment saying why `11-entertainment` is gone. | The census is the guard on the manifest. |
| `services/capability-bridge/registry.mjs` | `presentation.theme.lab` now references `00-foundation/05-control-centre/theme-engine`. | This is the live capability wiring; leaving it stale made the capability `BRIDGE_PENDING`. |
| `services/capability-bridge/adapters.mjs` | the two `moduleAt` prefixes follow the new path. | The bridge loads the module by path. |
| `scripts/d9-donor-oracle.mjs` | the pinned fixture path follows the new path. | The D9 oracle reads its expectations from the module. |
| `theme-engine/DONOR.json` | `cityPath`, `district`, `building` updated; `relocatedFrom`, `relocatedAtMission` and an explicit `relocationNote` added. | Provenance must say where the module is now **and** that its promotion history is unchanged. |
| `theme-engine/tests/theme-engine.test.mjs`, `theme-package.test.mjs` | the module header and the `donor.cityPath` assertion follow the new path. | Self-referential provenance assertions. |
| `apps/rooms/promotions/theme-{engine,package,builder}-lab.json` | **`targetCityPath` deliberately UNCHANGED**; `relocatedTo` + `relocatedByMission` + `relocationNote` added. | See §2.2. |
| `scripts/verify-promotion-history.mjs` | relocation-aware: still requires `targetCityPath` at `promotedAtCommit`, now requires the **current** location at `HEAD`, and refuses a `relocatedTo` with no recorded authority. | So the chain is honest across the move instead of being weakened. |
| `apps/rooms/hub/manifest.mjs` | **UNCHANGED**, deliberately. | See §2.2. |

### 2.2 The provenance decision (a real judgement, recorded)

`verify-promotion-history.mjs` requires each promotion record's `targetCityPath` to
exist **at `promotedAtCommit`** — necessarily, because a monotone history check can
only demand a path that can still be inspected *in the past*. It also required the
same path at `HEAD`.

That produced a genuine conflict: rewriting `targetCityPath` to the new location
would make the record **false** (the promotion did not land there) and would also
fail the `promotedAtCommit` check; leaving it would fail the `HEAD` check. The
options were:

1. rewrite `targetCityPath` — **rejected**: it makes a historical record lie, and it
   cannot satisfy the past check either;
2. drop the `HEAD` check — **rejected**: that weakens the verifier's only live
   guarantee, which is exactly what rule 11 forbids;
3. separate *where it landed* from *where it is now* — **chosen**.

A record may now carry `relocatedTo` plus `relocatedByMission`. The verifier still
requires `targetCityPath` at `promotedAtCommit`, then requires the current location
at `HEAD`, and refuses a `relocatedTo` with no recorded authority or one outside
`city/`. Without a relocation record the original path is still required at `HEAD`,
so the new field cannot be used to lose track of a module.

`apps/rooms/hub/manifest.mjs` is left unchanged for the same reason: its
`targetCityPath` fields are the hub's record of **where those promotions landed**,
and they sit beside immutable promotion records that must agree with them. Changing
them would make the hub and the provenance files contradict each other. The current
location is carried by the manifest and by `DONOR.json`, which are the live
registries.

**Negative-tested**, so this is not a claim taken on faith: with a bogus
`relocatedTo` the verifier fails with
`… does not exist at HEAD (relocated from city/11-entertainment/…)`, and with
`relocatedTo` but no `relocatedByMission` it fails with
`relocatedTo is set without relocatedByMission, so the move has no recorded
authority`. Restoring the record returns it to green.

---

## 3. Preserved behaviour / explicitly NOT migrated

### 3.1 Preserved (byte-for-byte)

`git mv` moved the whole module: `contract/`, `color/`, `raster/`, `planning/`,
`build/`, `design/`, `assets/pipeline/`, `assets/procedural/`, `validation/`,
`DONOR.json` and all four test files, including the 140 KB D9 donor oracle fixture.
Only the self-referential path strings listed in §2.1 changed inside those files,
and `theme-engine.test.mjs` / `theme-package.test.mjs` changed only their own
provenance assertions. No semantic change anywhere.

### 3.2 Explicitly NOT migrated / NOT added

| Not done | Why |
|---|---|
| Global theme apply | The Mission states it is currently `NO`, and the verification criteria forbid adding it to manufacture "usability". Confirmed still `false` in the live build result (§6.2). |
| A new theme editor, asset generator, or Android UI | Forbidden by the Mission. |
| 11 Entertainment's voice / avatar / VR / AR / media capabilities | Out of scope; they are not part of this module. |
| Any change to the donor provenance waves | The promotion history is unchanged; only the current location was recorded. |

---

## 4. Interface / contracts

The module's public surface is unchanged; only its **path** changed. Consumers reach
it through the same seams as before:

- **Capability bridge** — `presentation.theme.lab` with operations `generate` and
  `build`, resolved by the registry from a module reference (now
  `00-foundation/05-control-centre/theme-engine`).
- **Gateway routes** — `GET /api/v0/capabilities`,
  `POST /api/v0/capabilities/presentation.theme.lab/invoke`; unchanged.
- **In-module entry points** — `contract/contract.mjs`, `contract/surface.mjs`,
  `color/color.mjs`, `raster/png.mjs`, `planning/planner.mjs`, `design/designer.mjs`,
  `build/builder.mjs`, `validation/validator.mjs` and the asset pipeline/factory;
  all still exported with the same names from the same relative import positions,
  so intra-module imports needed no change at all.

---

## 5. Existing consumption surface (no new UI)

No new UI, route, dashboard or product surface was added. The consumption evidence
in §6.2 drives the surfaces that already existed: the **real gateway** starts and its
capability registry, invocation route and adapter resolve the relocated module
exactly as `apps/web` Services and the Android Services panel do. `apps/web/**`,
`apps/android/**` and the gateway source were **not** touched by this Mission —
only the bridge's registry and adapter path constants, which are wiring, not surface.

---

## 6. Tests

### 6.1 Gates

| Gate | Result |
|---|---|
| City suite (`node city/test-all.mjs`) | **129 pass / 0 fail** |
| Root suite (`pnpm test`) | **58 / 58** |
| Rooms suite | **67 / 67** |
| Bilingual docs (`pnpm check:docs`) | **SYNCHRONIZED** |
| Promotion history | **10 records verified** |
| D9 donor oracle (`scripts/d9-donor-oracle.mjs`) | **PASS** |
| Required CI | **PASS** — run `36580730966`, `gateway-web` + `android` |

### 6.2 Real consumption, through the running gateway

The driver starts the **real** `createGateway` and speaks to it over HTTP, exactly as
a client does — no direct module import, no new surface:

```text
themeCapabilityResolvesAtTheNewPath   PASS
  presentation.theme.lab → bridgeState AVAILABLE, cityLifecycle PROMOTED
  moduleRef { districtId: 00-foundation, buildingId: 05-control-centre, moduleId: theme-engine }
  operations [generate, build]

generateRunsAtTheNewPath              PASS
  status COMPLETED · globalApply false · 66 tokens · PNG magic present
  resultDigest f62cc59cdf48373e9f0ee510e2c125b45ff1facf2d4d566bc421906828454383

buildRunsAtTheNewPath                 PASS
  status COMPLETED · validation.ok true · globalThemeApply false
  packageDigest 80a8df48e9bf676098e11c3b9617ac70fd2a1859670eb5ff5cf70e231e15dcc0
  digestIsStable true (two calls, same digest)

globalApplyIsStillFalse               PASS
```

Receipt: `.runtime/evidence/mission-book/MB-009/run-1/consumption/relocation.json`.

### 6.3 D9 parity and the donor oracle

```text
{"closure":"PASS","newFiles":7,"reusedFiles":6,"intentVectors":4,"pixelVectors":3,"modelRefinementPresent":false}
```

The oracle re-derives the promoted module against the donor sources staged in the
git-ignored `.runtime/donors/d9`: 13 files (7 `NEW_D9` + 6 `REUSE_PROMOTED`) whose
**git blob hashes** are checked against the pinned
`tests/fixtures/d9-donor-oracle.json`, plus 4 intent vectors and 3 pixel vectors.
It passing after the move is the strongest available statement that the relocation
changed nothing semantic: the same sources still satisfy the same pinned oracle.

### 6.4 Real failures found and repaired during construction

- **The capability went `BRIDGE_PENDING`.** Moving the module without updating
  `registry.mjs` left `presentation.theme.lab` pointing at a module reference that
  no longer existed, so the bridge correctly refused it. Fixed by updating the
  registry reference; the descriptor is `AVAILABLE` again (§6.2). This is exactly
  the failure a relocation is supposed to surface, and it was caught by running the
  gates rather than by reading the code.
- **CI run `36580351793` failed on `verify-promotion-history`.** That was the
  verifier doing its job: the relocated module's `targetCityPath` no longer existed
  at HEAD. Resolved by the provenance decision in §2.2, not by weakening the check.
- **Six local root-test failures** after the move, all from the same two causes: the
  stale registry reference, and fixtures that keyed off the old district. Both are
  recorded here because a Verifier should confirm the *current* wiring, not assume it.
- **My own harness bug, caught and corrected:** an early version of the consumption
  driver reached across into the `02-engineering/01-project-foreman` module, which
  belongs to **MB-004** and lives on its own unmerged branch, so it is absent from
  this branch's tree. The check was **removed** rather than worked around — borrowing
  another Mission's module would have made this evidence depend on work that has not
  landed. The comment in the driver says so.

---

## 7. Data / error / recovery records

- **Errors.** The relocation produced exactly one real error during construction —
  the capability refusing with `BRIDGE_PENDING` while the registry was stale — and it
  is recorded above with its cause and fix. The bridge's typed refusals
  (`OPERATION_BLOCKED`, `OUTPUT_PATH_FORBIDDEN`, `PROTECTED_SURFACE`,
  `INVALID_THEME_PROMPT`, `BUILD_STORAGE_UNAVAILABLE`) are untouched.
- **Recovery.** No recovery or interruption path is affected: the module holds no
  durable state, and the bridge's invocation history and interruption semantics are
  unchanged (they are MB-002's terrain).
- **Durability of the move.** `git mv` means the move is a rename in history; the
  module's bytes are recoverable from either path. The D9 fixture (140 KB) moved with
  it and still satisfies the pinned oracle.
- **No secrets, no credentials and no unbounded terminal dumps** were recorded.

---

## 8. Known limitations

### 8.1 The hub manifest still names the old path, deliberately

`apps/rooms/hub/manifest.mjs` records where each incubator room's promotion landed.
It is left pointing at `city/11-entertainment/…` because it sits beside immutable
promotion records that must agree with it (§2.2). It is a **historical** index, not a
live pointer; the live registries (the City manifest and `DONOR.json`) carry the new
location. If the City prefers the hub to show current locations, that is a deliberate
change to what that field means and should be a separate decision with the promotion
records updated in the same breath.

### 8.2 The `11-entertainment` district is no longer declared

It held only this module, so after the move it has no building with a module, and the
manifest validator requires at least one. The district therefore disappears from the
census. `CITY_MANIFEST.yaml` in Digital-City still describes 11 Entertainment as a
district with no promoted domain module, which is now literally true of this tree;
that is a planning-side statement, not an implementation one.

### 8.3 Local baselines differ from other branches

The city suite is **129** tests on this branch, not 173/212/586 — those figures belong
to the MB-002, MB-005 and MB-004 branches, which each carry their own module and were
each built from `c7ef3cd`. The branches are independent, so a cross-branch test count
is not comparable and should not be quoted as one.

### 8.4 Android and second-host verification

This host cannot build the Android app (only JDK 25/26; CI uses temurin 21), and the
Mission's verification criteria require the existing Web/Android Theme Generate path
to keep working plus digest/behaviour equivalence against the D9 oracle. CI's Android
job passed; a device-level Android pilot remains the Verification Host's work. No
Android source was touched.

---

## 9. Utopia evidence pointers

Raw, git-ignored:

```text
.runtime/evidence/mission-book/MB-009/
├─ donors/d9/**                     donor sources staged for the D9 oracle
└─ run-1/
   ├─ consumption-driver.mjs        the gateway-driven relocation proof
   ├─ consumption/relocation.json  the four checks with digests
   └─ reports/
      ├─ root-tests.txt             58/58
      ├─ city-tests.txt             129/129
      ├─ rooms-tests.txt            67/67
      ├─ promotion-history.txt      10 records verified
      └─ d9-oracle.txt              closure PASS
```

Structured, on the mission branch:

```text
data-records/evolution/inbox/mission-book/MB-009/events.jsonl
```

Events recorded (all `MIGRATION` / `Mech`): `MISSION_CLAIMED`, `CHANGE_APPLIED`,
`TEST_PASS`, `CI_RESULT`, `MIGRATION_COMPLETE`.

---

## 10. Branch HEAD / CI status

- Mission branch: `mission/MB-009-theme-relocation`
- Relocation commit: `65f9aa740a937e52542e1ecf60babf742f4cf9ba`
- Provenance commit: `277f576e9eb35670d77edd0aa98c192d56a7a961`
- Final branch HEAD: `d338152b0c7ef2ef7e94d78901454ea91f200156`
- CI run: `36580730966` on `277f576e…` — **PASS**, `gateway-web` and `android`
- **The migration branch is NOT merged to `main`.** Merging is the Verification
  Host's action after all required CI and the Mission's own gates are green.

### 10.1 A Verifier should check these specifically

1. **Byte-identity.** `git show --stat` the branch and confirm the relocation is
   recorded as renames, then diff any file between the two paths if in doubt.
2. **The capability is not merely described but callable.** Run
   `.runtime/evidence/mission-book/MB-009/run-1/consumption-driver.mjs`; it asserts
   `AVAILABLE`, a PNG from `generate`, and a stable `packageDigest` from `build` with
   `globalThemeApply === false`.
3. **The provenance decision in §2.2 is the one you would have made.** In particular
   that `targetCityPath` is still the historical path and that the `HEAD` check now
   follows `relocatedTo`. Negative-test it as §2.2 describes rather than trusting the
   green run.
4. **No global apply crept in.** `globalApply: false` and `globalThemeApply: false`
   appear in the receipts; confirm the code path did not gain one anywhere.
