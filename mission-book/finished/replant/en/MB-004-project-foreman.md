> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-004-project-foreman.md) 的原始 frontmatter 是唯一元数据来源。

# MB-004 — Project Foreman Engineering Union migration only

> **Currently claimable: NO** (Migration and Verification are both complete, and verification host `Alien` merged into
> `zhiheng-zhang-Mera/utopia` `main` @ `0eed05b58c126a70224cb4757ba12f76bbe4d4b7`).
>
> **⚠ A gate clause reported to the Owner:** the Verification requirement to "run one real
> Engineering job through MB-003 Worker Gateway" **was not executed** (and was not fabricated). The MB-003 gateway module had not merged into `main`; its Verification
> was `BLOCKED_OWNER_DECISION`. This migration has **zero coupling** to the gateway. Routing requires a new glue layer present in neither donor,
> while `MODE=MIGRATION_ONLY` forbids inventing behavior. The **substance** of this clause (a real Engineering job from inspect/plan to
> result/evidence, without substituting unit tests alone) was satisfied by a real run. The complete issue, options, and reasoning appear in
> [`reports/MB-004/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-004/VERIFICATION_REPORT.md) §6.1;
> The same report’s §6.2 records a cross-Mission product-surface observation: after merging, the capability list gained one entry that could not be invoked.

## Goal

Migrate the existing planning, scheduling, isolation, recovery, review, acceptance, and evidence capabilities of the primary Hns implementation and Boss engineering loop into 02/01 Project Foreman.

## Donor / Frozen baseline

- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City ownership and implementation boundary

- **City owner:** 02/01 Project Foreman — Engineering Task Orchestrator
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/02-engineering/01-project-foreman`
- **Dependency Mission:** MB-003
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- repo/world inspection、goal/convergence、plan/DAG。
- provider/worker assignment、adaptive resources、bounded task package。
- worktree/file ownership isolation、checkpoint/resume、stall/crash detection、retry/reassignment。
- independent review、targeted/full verification、CI repair、integration、final acceptance、durable evidence/result。

## Explicit exclusions / Outside this Mission

- City-wide authority/priority。
- Capability/Node global truth。
- Business logic outside the Engineering domain.
- New scheduling algorithms, worker types, or autonomous policies not implemented in the donor.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-004/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Run one real Engineering job through MB-003 Worker Gateway, from inspect/plan to result/evidence; unit tests alone must not substitute for this.
- Verify checkpoint/continuation through at least one controlled interruption/recovery scenario or an equivalent recovery scenario already existing in the donor.
- Isolation/worktree/file ownership and final acceptance must not be weakened.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-004/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T13:12:00Z
- City claim commit: `945092ff14bfb9b0a3323b023ec3ad5b4c5b139c` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-004-project-foreman` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Implementation commit: `8a0d5d6af7fd8ac007474e8df39c802b069ab785`
- Final branch HEAD: `70806ad1277904c214f29f5da52cb5c7db1d90da`
- Migration CI: **PASS** — run `36577933078` (`V0.2 checks`) on `faf6f7a011ff37ea427c592773bf837411964d7c`: `gateway-web` success, `android` success.
- Migration Report: [`reports/MB-004/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-004/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.
- Dependency note: this Mission declares **Dependency Mission: MB-003**, and MB-003's migration was **complete** (`complete(MB-003)` on Digital-City main, verified before claiming), so the dependency gate was satisfied.
- Selection note: selection was re-made against the latest Digital-City `main` **immediately before the claim**, as rule 3 requires. MB-006 was claimed by host `Alien` between two of this host's own commits, and a local claim for it was **abandoned** rather than forced through, because rule 4 forbids taking a task another host has claimed. No verification task was available to this host (MB-001's migration host is `Alien`; `Mech` migrated MB-002 and MB-005, so rule 5 forbids it from verifying either). Sequence order therefore selected MB-004.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T15:02:33Z
- City claim commit: `7d0569d4e68618721fdcb9e4a7c36c1cc7caa46a`
- Reviewed migration branch: `mission/MB-004-project-foreman` @ `70806ad1277904c214f29f5da52cb5c7db1d90da`
- Repairs (same branch only):
  - `R1` — supplied the frozen `DS-Hns` donor at the git-ignored path the differential tests
    expect, which turned five silently-skipped donor parity tests into executed, passing
    evidence. No branch content changed.
  - `R2` — `5ef0b2c7bbf7f24b5eb4a32d2cc5c7faa59c2af6`: added `scripts/mb004-foreman-pilot.mjs`,
    a real end-to-end runtime pilot. No production file changed.
- Episode closeout: `4ae80785696eac1ca077a45a4a5507d3802b3995` (`MB-004:d5d6498644ddb928`)
- Merged to `main`: `0eed05b58c126a70224cb4757ba12f76bbe4d4b7`
- Verification Report: [`reports/MB-004/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-004/VERIFICATION_REPORT.md)
- **Gate clause not exercised, reported to the Owner:** the "through the MB-003 Worker Gateway"
  clause. See the report §6.1. The gate's substance was met with a real run.
- Selection note: re-read against the latest Digital-City `main` (`de44f0b`) immediately before
  claiming, as rule 3 requires. No migration task remained claimable, so selection fell to the
  migrated-but-unverified set by `SEQUENCE` ascending: `MB-003` verification was already claimed
  by `Mech` (rule 4 → skip), and `MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and
  rule 13. `MB-004` is the lowest-sequence eligible mission.

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.

### Verifier should know

- **One deliberate divergence from the donor, and only one:** Boss `planRecovery` now
  throws a *named* error on an unknown failure class where the donor crashed with an
  unguarded `TypeError`. See the Migration Report §8.1.
- **The union is partial by design.** The requirements-driven Execution DAG and the Boss
  acceptance-hub family are **deferred, not faked**, because they consume a
  `RequirementsGraph` and host stores this tree does not have. `index.mjs` does not
  re-export them. Treat the deferred list as a boundary claim to test (§8.4).
- **The cross-volume donor suite skips on a single-volume host** with a named reason
  rather than failing. Read the skip reason before concluding anything about coverage (§10.1).
- **Two real donor defects are reproduced deliberately**, both pinned by tests that name
  them: the supervisor's bounded-retry arm is unreachable (so the retry ladder never
  fires), and a cancelled episode never releases the workspace lock. Neither was "fixed",
  because both are behaviour decisions for the City owner. `DONOR.json` lists them with the
  other six donor bugs found.
- **`result.mjs` must not be changed to report `FAILED`.** The donor reports the result
  validator's verdict (`supervisor.cjs:766` → `result.cjs:165`), so `REFUSED` is faithful;
  this was arbitrated during the migration and the test expectations were corrected instead (§6.4).


## Binding execution conditions (mandatory for every Mission)

> **ACTIVE RULESET:** [`README.md`](.././README.md) (integration-first v2)  
> **OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. If they conflict with the latest Owner ruling, response-9-29.md prevails.

## Mission-specific evidence

- end-to-end engineering run
- worktree/ownership ledger
- checkpoint/recovery receipts
- review/verification/CI evidence
