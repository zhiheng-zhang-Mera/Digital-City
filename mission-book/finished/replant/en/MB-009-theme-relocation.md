> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-009-theme-relocation.md) 的原始 frontmatter 是唯一元数据来源。

# MB-009 — Theme Engine 11→00/05 physical ownership relocation

> **Currently claimable: NO** (Migration and Verification are both complete, and verification host `Alien` merged into
> `zhiheng-zhang-Mera/utopia` `main` @ `b4bd602971abe83083cd72ab8247d9bd50371f57`).
>
> **⚠ A cross-Mission conflict discovered during merge must be brought to the Owner’s attention (Verification Report §5):** MB-001 marked `00-foundation`
> as `kind: "infrastructure"`, so `registry()` excluded this district’s modules from resolution. Following the City map, MB-009
> moved the theme engine into `00-foundation/05-control-centre`; after merging, `presentation.theme.lab` became `DEGRADED`
> (the five accepted bridged services became four). Resolution: refine kind to the **building level** (`05-control-centre` declares
> `kind: "domain"`; `city/manifest.mjs` adds validation and the single decision point `buildingKind`; registry’s **resolution index** covers all
> declared modules while **enumeration** retains both exclusions). This change is strictly conservative (behavior for all existing inputs stays unchanged; kernel assertions increased, with none removed),
> but it **changes shared files and tests introduced by MB-001**, so it is explicitly reported as the Owner requires. Disposition options appear in report §5.4.

## Goal

Relocate the already PROMOTED Utopia Theme Engine from the historical physical path under 11 Entertainment into the currently confirmed 00/05 Control Centre ownership. This migrates paths, references, and consumer boundaries without adding theme features.

## Donor / Frozen baseline

- `Utopia main current city/11-entertainment/01-entertainment-centre/theme-engine`
- Historical donor: `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- Accepted D9 theme-builder promotion history

## City ownership and implementation boundary

- **City owner:** 00/05 City Control Centre — Presentation & Theming
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/00-foundation/05-control-centre/theme-engine`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- Relocate existing theme contract/color/raster/package/designer/builder/assets/validation code and tests without semantic changes.
- Update manifest/import/promotion provenance/consumer references.
- Keep existing Theme Generate / D9 parity and historical evidence traceable.

## Explicit exclusions / Outside this Mission

- Global theme apply (currently explicitly NO).
- New theme editors, asset generators, or Android UI.
- 11 Entertainment voice/avatar/VR/AR/media capabilities.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-009/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Donor oracle / D9 / package / theme-engine digests and behavior must remain equivalent before and after relocation.
- Existing Web/Android-callable Theme Generate paths must continue to work; do not add global apply to manufacture “availability.”
- Historical promotion/provenance links must not break because physical paths change.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-009/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T14:45:00Z
- City claim commit: `268ab59411ee54893cdd1f648e5155008e2b2a6a` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-009-theme-relocation` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Relocation commit: `65f9aa740a937e52542e1ecf60babf742f4cf9ba`
- Provenance commit: `277f576e9eb35670d77edd0aa98c192d56a7a961`
- Final branch HEAD: `d338152b0c7ef2ef7e94d78901454ea91f200156`
- Migration CI: **PASS** — run `36580730966` (`V0.2 checks`) on `277f576e…`: `gateway-web` success, `android` success.
- Migration Report: [`reports/MB-009/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-009/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.
- Selection note: selection was made against the latest Digital-City `main`. MB-007 and MB-008 are claimed by host `Alien`; every other enabled Mission has `migration_complete: true`. No verification task is available to this host (MB-001/003/006 belong to `Alien`; `Mech` migrated MB-002, MB-004 and MB-005, so rule 5 forbids it from verifying any of those). Sequence order therefore selected MB-009, the last unclaimed enabled Mission.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T16:02:49Z
- City claim commit: `4ac89ca4b22cdbb03e5eb275464f6d1137e4c0ce`
- Reviewed migration branch: `mission/MB-009-theme-relocation` @ `d338152b0c7ef2ef7e94d78901454ea91f200156`
- Repairs (same branch only):
  - `R1` — `881f0bcbef203448058a87137ce80cf7bad49a5f`: added
    `apps/rooms/tests/promotion-relocation.test.mjs`, because the relocation guards the
    migration added to `scripts/verify-promotion-history.mjs` had no test coverage at all
    (rooms 67 → 69).
  - `R2`/`R3` — verification probes, not branch content. `R2` executed every relocation guard
    against a mutated record and restored it byte-exactly; `R3` ran the same theme generate
    call in a pre-relocation worktree and on the branch and got an identical digest.
  - `R4` — added `scripts/mb009-theme-relocation-pilot.mjs`, which drives the real gateway path
    the Web and Android clients use.
- Episode closeout: `40660e7479931b2218d28a8400a69f20c4a97b81` (`MB-009:e1f0526f2c07fb41`)
- Merged to `main`: `b4bd602971abe83083cd72ab8247d9bd50371f57`
- Verification Report: [`reports/MB-009/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-009/VERIFICATION_REPORT.md)
- **Cross-mission conflict recorded and reported to the Owner:** the merge exposed a conflict
  between MB-001's district-level `kind` marker and MB-009's City-map-mandated target path.
  See the report §5.
- Selection note: re-read against the latest Digital-City `main` (`0764924`) immediately
  before claiming, as rule 3 requires. Every enabled Mission now has `migration_complete: true`, so
  the migrated-but-unverified set decides by `SEQUENCE` ascending: `MB-003` is
  `BLOCKED_OWNER_DECISION`, `MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and rule 13,
  and `MB-004`/`MB-005` were completed by this host. `MB-009` is therefore the lowest-sequence
  eligible mission and the last one open to this host.

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.

### Verifier should know

- **The provenance decision in §2.2 is the part to challenge.** `targetCityPath` in
  the three theme promotion records is deliberately still the **historical** path,
  and `verify-promotion-history.mjs` now requires the *current* location at `HEAD`
  via a new `relocatedTo` + `relocatedByMission` pair. The check was made
  relocation-aware, **not weaker**: it still requires `targetCityPath` at
  `promotedAtCommit`, refuses an unattributed `relocatedTo`, and refuses one outside
  `city/`. Negative-test it as §2.2 describes rather than trusting the green run.
- `apps/rooms/hub/manifest.mjs` still names the old path **on purpose** (§8.1) — it
  records where those promotions landed, beside immutable promotion records.
- The capability went `BRIDGE_PENDING` mid-construction while `registry.mjs` was
  stale; it is `AVAILABLE` now. §6.4.
- This branch's city-suite baseline is **129** tests, not the 173/212/586 seen on
  MB-002/MB-005/MB-004 — those branches carry their own modules. §8.3.


## Binding execution conditions (mandatory for every Mission)

> **ACTIVE RULESET:** [`README.md`](.././README.md) (integration-first v2)  
> **OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. If they conflict with the latest Owner ruling, response-9-29.md prevails.

## Mission-specific evidence

- pre/post path mapping
- theme/D9 parity digests
- existing Web/Android service invocation
- promotion/provenance continuity check
