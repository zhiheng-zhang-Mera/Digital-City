> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-007-research-institute.md) 的原始 frontmatter 是唯一元数据来源。

# MB-007 — Boss Research Institute existing pipeline migration only

> **Repair queue step 1.** Implementation and Verification were accepted and entered Utopia main. This round repairs only the Owner-override finalizer / verified episode closeout. Rollback, remigration, or rewriting Alien’s historical BLOCKED as PASS is forbidden.

> ## ✅ Owner ruling applied — Migration COMPLETE / Verification OPEN
>
> In [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) R6, the Owner accepted this Mission’s boundary: when no semantically equivalent Utopia product consumer surface currently exists,
> for a `capabilityProvider:false` research pipeline, the Verification Host may use a real, bounded, reproducible research chain
> as evidence of “real consumption”; do not add a Web/Android capability for acceptance.
>
> Because migration implementation, parity, and required CI completed and all passed on the original branch, this file now marks `migration_complete` as `true`.
> An actual host different from Migration Host `Alien` must claim Verification and synchronize the latest Utopia `main` at the start.
> The next worker touching the implementation branch must first record `OWNER_INTERVENTION` referencing `response-9-29.md`, and, under the current
> Utopia evolution contract, add the completion events required after the Owner ruling before entering Verification.

## Goal

Migrate the research pipeline already implemented in Codex-Boss and belonging to 06 Research into Research Institute. Preserve the already ACTIVE Utopia Evidence Engine without duplicating its implementation.

## Donor / Frozen baseline

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `Utopia city/06-research/.../evidence-engine` is the already migrated baseline.

## City ownership and implementation boundary

- **City owner:** 06/01 Research Institute — Research Mechanism Experimentation Platform
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/06-research/01-research-institute`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- ResearchIR/protocol freeze。
- literature/source provenance。
- Experiment planning/execution and deterministic statistics.
- reproducibility/evidence graph、claim/citation verification、review/adjudication。
- figures/tables、manuscript assembly、LaTeX/PDF。
- durable ledger/resume/partial-failure honesty。

## Explicit exclusions / Outside this Mission

- A second Evidence Engine implementation.
- Implementation of new delayed-learning / Machine Intelligence research directions.
- Boss Core authority。
- Adding new paper workflows or external data sources for migration.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- Real consumption follows `mission-book/README.md` §7; in `response-9-29.md` R6, the Owner accepted a bounded real research chain as the way to satisfy this Mission.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-007/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Use existing donor capabilities to complete a bounded protocol→evidence/statistics→manuscript/PDF chain or an equivalent existing chain, and preserve provenance.
- During interruption/partial failure, ledger/resume and error truth must retain donor semantics.
- Existing Evidence Engine acceptance checks and reference relationships must continue to pass.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-007/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T13:34:10Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-007/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-007-research-institute` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

> **Claim order note.** MB-001 and MB-003 (host `Alien`) and MB-006 (host `Alien`) are
> migration-complete; MB-002, MB-004 and MB-005 are held or completed by host `Mech`. With
> MB-004 claimed by `Mech`, the lowest-sequence unclaimed migration was MB-007, which declares
> no dependency. See the mission index for the MB-003/MB-004 dependency history.

#### Migration closeout — PARTIAL

- City claim commit: `c6ff44f4bd6e2a711a2e838d1efd04e61fd0b5e4`
- Implementation head: `71267e83570f5749bb2d1cf9537040ef0af869eb` (CI `36577840443` PASS)
- Migration head: `68015caa71b7788f700abb1c7918d1b5ee8f9e8c` (CI `36578310170` PASS)
- Report: [`reports/MB-007/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-007/MIGRATION_REPORT.md)
- **Done:** ported, parity-tested (142 tests, plus a 1 590-comparison differential harness on
  `research-manuscript`), registered behind `capabilityProvider: false`, full CI green, donor defects
  preserved verbatim and pinned by tests.
- **Not done:** the product-consumption gate. No `MIGRATION_COMPLETE` event was written; the branch
  event stream records `RUNTIME_FAIL / BLOCKED` for it (`MB-007:7d6c861428278c83`).
- Not merged to `main`; `mission:finalize` deliberately not run.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-30T03:10:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-007/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-007-research-institute` @ `68015caa71b7788f700abb1c7918d1b5ee8f9e8c`
- **Selection under the current scheduler (`README.md` §3).** This is a **P0 — Verification / Integration** claim, not an assessment. At the time of claiming, the queue read: MB-001/002/004/005/006/009 verified and merged; MB-003 `BLOCKED_OWNER_DECISION` (excluded by P0's own condition); MB-007 and MB-008 `migration_complete=true`, verification unclaimed, migration host `Alien` ≠ `Mech`. MB-007 is the lower sequence, so it is taken first; MB-008 remains available to another host. MB-010..012 are assessment-first (P1A) and are therefore **not** eligible while a P0 exists for this host.
- **Integration pressure (P0 sort key 1 and 2).** The branch is **23 commits behind** the implementation repo's `main` and **touches the shared control plane** (`city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/manifest.mjs`, `city/tests/manifest.test.mjs`, `services/capability-bridge/registry.mjs`). Per `README.md` §6, verification begins by merging the latest `main` into this branch and resolving the manifest/registry/census union and semantic conflicts **before** running the Mission gates — not by force-updating or rewriting the migration host's history.
- **Basis for verification being open.** Owner ruling [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) **R6** explicitly declares: *"ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN VERIFICATION."* The migration host recorded its product-consumption gate as `RUNTIME_FAIL / BLOCKED` (`MB-007:7d6c861428278c83`) and wrote no `MIGRATION_COMPLETE` event, so this claim rests on the Owner ruling plus `README.md` §7.2's v2 rule for infrastructure/pipeline modules with no equivalent product seam: the Verification Host satisfies the real-consumption gate with a **real, bounded, reproducible research chain** that directly executes the migrated modules and records inputs, outputs, failure/recovery, parity and evidence.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened.

#### Verification closeout

- Reconciliation first, per `README.md` §6: latest `main` merged into the branch **before** any gate ran (branch was 23 commits behind and touches the shared control plane). Two conflicts resolved in favour of the union — `services/capability-bridge/registry.mjs` took `main`'s superset (both the building/district `kind` filter and the module-level `capabilityProvider` filter, plus the `declared`/enumerated split MB-009 needs), and the census list in `city/tests/manifest.test.mjs` was restored after the merge silently dropped seven modules. The gate caught that; it is recorded rather than hidden.
- Reconciled head: `8bce1f79ba0940e35eb3b2e2ac352793af886802` (CI `36649748973` PASS).
- Real consumption: the `README.md` §7.2 bounded research chain, 22 steps across all five migrated modules on a seeded, reproducible measurement (effect `0.4800`, permutation `p = 0.0330`, bootstrap CI `[106.500, 108.183]`), with negative controls that **refuse** a broken artifact chain, a vetoed review and a primary claim resting on an `UNSUPPORTED` citation, and six provenance digests pinned in `run/provenance-ledger.json`.
- Final branch CI: `36650198208` PASS at `ff50086`. Merge to `main`: `cb8e0bd77ccf0864cf0af50b4624f2f556b6b279`, CI `36650723833` PASS. All five gates re-run green on the merged tree.
- **Episode: none, and that is deliberate.** `pnpm mission:finalize` refuses this Mission with `Missing PASS MIGRATION_COMPLETE`, because the migration host recorded `RUNTIME_FAIL/BLOCKED` for the product-consumption gate and never wrote that event. This verifier did **not** backfill it — that would attribute to host `Alien` a claim it never made. The deviation and the request to the Owner are in `reports/MB-007/VERIFICATION_REPORT.md` §6.5; the same question applies to MB-008, whose ruling is worded identically.
- Report: [`reports/MB-007/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-007/VERIFICATION_REPORT.md). Not established: no compiled PDF (the donor's compile step is deferred), no re-derived donor differential for the five modules' PARITY vectors, and this does not make the research pipeline a complete product runtime.


## Binding execution conditions (mandatory for every Mission)

> **LATEST OWNER RULING:** [`response-9-30.md`](../../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) (clauses not superseded by 9-30 remain effective)
> **ACTIVE RULESET:** [`README.md`](.././README.md)  
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. In conflict, latest-dated Owner response prevails.

## Mission-specific evidence

- bounded research run
- source/provenance ledger
- statistics/evidence receipts
- manuscript/PDF artifact digest
- resume/partial-failure trace
