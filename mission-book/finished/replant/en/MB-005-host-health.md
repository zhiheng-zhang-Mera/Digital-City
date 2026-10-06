> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-005-host-health.md) 的原始 frontmatter 是唯一元数据来源。

# MB-005 — Host Health Station vendor-neutral migration only

> **Currently claimable: NO** (Migration and Verification are both complete, and verification host `Alien` merged into
> `zhiheng-zhang-Mera/utopia` `main` @ `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`).
>
> **⚠ A gate clause reported to the Owner:** the Verification requirement that "**two hosts** each run with real telemetry…"
> is recorded under two readings as **mission-design tension**: Reading 1 (participating host roles) was satisfied;
> Reading 2 (two physical machines) could not be satisfied in this session: rule 5 permits only one verification host and forbids a third host; this host has only one machine.
> Following the precedent in MB-006 Verification Report §5.2, **both readings are recorded without choosing one as a definitive claim or fabricating a second machine**.
> The complete issue, options, and reasoning appear in [`reports/MB-005/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-005/VERIFICATION_REPORT.md) §6.1.
> The same report raises two further matters for the Owner: a dedicated ruling is recommended for the donor `bandKeyOf` bug (§7.2),
> and this verification discovered and repaired **a weakened test** introduced during migration (§3.3).

## Goal

Extract the host/runtime health assessment already implemented in dsh-health-scheduler from its Hns plugin binding and migrate its existing behavior into 02/03 vendor-neutral Host Health Station.

## Donor / Frozen baseline

- `zhiheng-zhang-Mera/dsh-health-scheduler @ 985e2b7389330db4b32ea2946e3657746c64b47b`

## City ownership and implementation boundary

- **City owner:** 02/03 Host Health Station — Runtime Health Scheduling Service
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/02-engineering/03-host-health-station`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- telemetry provider/normalization、rolling history/trends。
- Coverage/unknown semantics and pressure aggregation.
- sustain/hysteresis/debounce/dwell/cooldown anti-flapping。
- maintenance/safe-point/defer policy。
- Level 1/2 throttle/pause requests and Level 3/4 restart/reboot requests.
- Read-only status/history/policy and auditable decision records.

## Explicit exclusions / Outside this Mission

- Actually executing restart/reboot (MB-006).
- Hns task/checkpoint ownership。
- City Node membership/global scheduling。
- Adding sensors, metrics, or new health algorithms.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-005/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Two hosts must each run normal, unknown/missing, and sustained-pressure/hysteresis scenarios with real telemetry.
- Health Station may only produce bounded action requests; it must not directly execute restarts.
- Existing Utopia consumer surfaces must read real status/history/error; do not build a new dashboard for this Mission.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-005/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T12:33:27Z
- City claim commit: `89d506e7a791b9c90006d2a4f19dd4d73c4c897a` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-005-host-health` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Implementation commit: `5fbbec666f61b2ff82f06a85630c2fb538ca7631`
- Final branch HEAD: `545d38fa6cc7023826c5a3a4a09cb2e37265eb06` (implementation + the event-stream closeout commit)
- Migration CI: **PASS** — run `36571598704` (`V0.2 checks`) on `5fbbec66…`: `gateway-web` success, `android` success. The closeout commit carries its own branch run.
- Migration Report: [`reports/MB-005/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-005/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.
- Selection note: MB-003 (sequence 3) was claimed by host `Alien` and MB-004 (sequence 4) depends on MB-003, so sequence order selected MB-005.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T15:34:43Z
- City claim commit: `03f395dc623a86e99c64076c0542d7fa0be95b6f`
- Reviewed migration branch: `mission/MB-005-host-health` @ `545d38fa6cc7023826c5a3a4a09cb2e37265eb06`
- Repairs (same branch only):
  - `R1` — cloned and built the frozen donor at the git-ignored path the differential harness
    expects, which turned a silently-skipped parity run into an executed one
    (110/110 scenarios, 83/83 tests, 0 skipped). No branch content changed.
  - `R2` — added `scripts/mb005-health-pilot.mjs`, a real-telemetry pilot that also audits the
    bounded-action-request property and demonstrates the existing node consumption surface.
  - `R3` — `977cd0c3487c4f1fd11e71b1f123007829f95ef1`: repaired a **pre-existing test the
    migration weakened** (the duplicate-module-name uniqueness fixture had collapsed to a
    one-building district and could no longer fail) and corrected two factual errors in
    `DONOR.json`.
- Episode closeout: `75f9acd1e6e4738b46f663412935624359ea586c` (`MB-005:bc50edf4e6a626d8`)
- Merged to `main`: `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`
- Verification Report: [`reports/MB-005/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-005/VERIFICATION_REPORT.md)
- **Gate clause recorded as a tension, reported to the Owner:** the "two hosts" wording of the
  real-telemetry clause. See the report §6.1. Everything else in the gate is met.
- Selection note: re-read against the latest Digital-City `main` (`d6969d9`) immediately
  before claiming, as rule 3 requires. No migration task remained claimable, so selection fell
  to the migrated-but-unverified set by `SEQUENCE` ascending: `MB-003` is
  `BLOCKED_OWNER_DECISION`, `MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and
  rule 13, and `MB-004` had just been completed by this host. `MB-005` is the lowest-sequence
  eligible mission (`MB-009` remains for a later claimant).

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.

### Verifier should know

- **A real donor bug is reproduced, deliberately, not fixed.** `bandKeyOf`
  never returns `:warn` for a `lower-is-worse` metric. Reproduced against the
  compiled donor and pinned by a naming test. Fixing it changes when a sustain
  gate opens, so it is a semantics decision, not a migration step. See the
  Migration Report §8.1.
- `city/manifest.mjs`'s `checkManifestAgainstTree` does **not** flag a module
  directory the manifest never declares, so the census cannot be relied on to
  catch an undeclared module. See §8.3.
- The differential harness in the module is the strongest parity evidence; it
  needs the donor build, which lives in the git-ignored evidence area, and it
  **skips with a reason** when that build is absent rather than passing quietly.
  Re-running it is worth the Verifier's time.


## Binding execution conditions (mandatory for every Mission)

> **ACTIVE RULESET:** [`README.md`](.././README.md) (integration-first v2)  
> **OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. If they conflict with the latest Owner ruling, response-9-29.md prevails.

## Mission-specific evidence

- host telemetry snapshots
- pressure/unknown/anti-flap trials
- bounded action-request receipts
- status/history consumer evidence
