> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-002-capability-fabric.md) 的原始 frontmatter 是唯一元数据来源。

# MB-002 — Capability Fabric Boss/Hns Union migration only

> **Currently claimable: NO** (Migration and Verification are both complete; verification host `Alien`
> merged into `zhiheng-zhang-Mera/utopia` `main` @ `83ea44e02274f8d5bcbe866d339a5cd703839e9b`).

## Goal

Migrate reusable behavior already implemented in Boss/Hns and belonging to the city-global Capability Fabric into 00/03, preserving the accepted Utopia V0.3 Capability Bridge.

## Donor / Frozen baseline

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- Existing Utopia V0.3 Capability Bridge serves as the accepted reference baseline.

## City ownership and implementation boundary

- **City owner:** 00/03 City Service Network — Capability Registry & Discovery
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/00-foundation/03-capability-fabric`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- Boss capability/provider registry, broker/routing, provider health/discovery, and stable outcome/state model.
- The city-global reusable portions of Hns capability/plugin dependency, lifecycle, adapter/compatibility, fallback/fault, health, and config/lockfile verification.
- Preserve existing qualified identity, availability, and bounded invocation/history/typed error behavior.

## Explicit exclusions / Outside this Mission

- Engineering provider planning/worker pool（02/01/02）。
- Customs admission and runtime enforcement.
- Do not create a second copy of the already ACTIVE Skill Intake implementation.
- Expanding the operation allowlist, permissions, or network exposure.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-002/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- All historical/current acceptance vectors for the five existing Utopia bridged services must continue to pass.
- Donor parity must cover at least one Boss provider/broker scenario and one Hns lifecycle/fallback/compat scenario.
- Web and Android must keep availability/result/error/history digests and states consistent.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-002/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T12:02:31Z
- City claim commit: `bc2bbbdbac9ff670f2c9b3cbc93f091a7e46694b` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-002-capability-fabric` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Migration HEAD: `db3ac518de1d6125e00cee1d9ff6ff7868b58336` (implementation commit `00607f8b243e166b112319b1663eebb3d763fcfc` + the event-stream closeout commit)
- Migration CI: **PASS** — run `36568159888` (`V0.2 checks`) on `00607f8b243e166b112319b1663eebb3d763fcfc`: `gateway-web` success, `android` success. The follow-up event commit carries its own run on the same branch.
- Migration Report: [`reports/MB-002/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-002/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T14:44:07Z
- City claim commit: `8c4d214a9287a346e9b4b8060f82e7c5e1c6d695`
- Reviewed migration branch: `mission/MB-002-capability-fabric` @ `db3ac518de1d6125e00cee1d9ff6ff7868b58336`
- Repair (same branch only): `d0052d029f769ecbe1b7e8279fafb7aa93510ef2` — added
  `tests/v03-derivation-parity.test.mjs`, an independent oracle over 516 lifecycle
  mixtures; no production file was changed by the verifier.
- Episode closeout: `63acf7af029357ca8ad85939a23dc9ab46e06f85` (`MB-002:f859fd8391837e33`)
- Merged to `main`: `83ea44e02274f8d5bcbe866d339a5cd703839e9b`
- Verification Report: [`reports/MB-002/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-002/VERIFICATION_REPORT.md)

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.


## Binding execution conditions (mandatory for every Mission)

> **ACTIVE RULESET:** [`README.md`](.././README.md) (integration-first v2)  
> **OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. If they conflict with the latest Owner ruling, response-9-29.md prevails.

## Mission-specific evidence

- V0.3 regression matrix
- Boss provider/broker parity
- Hns lifecycle/fallback parity
- cross-client result/error/history evidence
