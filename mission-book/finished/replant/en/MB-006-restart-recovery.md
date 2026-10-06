> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-006-restart-recovery.md) 的原始 frontmatter 是唯一元数据来源。

# MB-006 — Restart Recovery Station vendor-neutral migration only

> **Current status: host `Mech` completed Verification and merged it into main** (host `Alien` completed Migration; the hosts differ, satisfying rule 5). Verification requires **each of two hosts to complete one real controlled process restart/relaunch**. An unsafe environment must be marked BLOCKED; capabilities must not be invented and mock passes are forbidden. The donor’s two known limitations must remain unchanged (see report D7 and `donorLimitations` in `restart-protocol/DONOR.json`).

## Goal

Extract the restart ticket, external supervision, relaunch, crash-loop safe mode, and audit behavior already implemented in dsh-restart from its Hns binding and migrate it into 02/04.

## Donor / Frozen baseline

- `zhiheng-zhang-Mera/dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd`

## City ownership and implementation boundary

- **City owner:** 02/04 Restart Recovery Station — Safe Restart External Supervision
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/02-engineering/04-restart-recovery-station`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- request validation、dedup/lock/cooldown。
- checkpoint/safe-point gate。
- atomic checksummed restart ticket。
- graceful shutdown request、external supervisor heartbeat、exit observation/relaunch。
- post-relaunch verification、crash-loop breaker/safe mode、append-only audit。

## Explicit exclusions / Outside this Mission

- Deciding whether a restart should occur (belongs to MB-005/the caller).
- Adding a WAITING_FOR_EXIT deadline absent from the current donor.
- Enabling force-terminate behavior currently declared but unused in the donor.
- Extending into arbitrary system power-management functions.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-006/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Both hosts must complete one real controlled process restart/relaunch. Reuse the donor’s existing reboot path when applicable and safe; do not invent new capabilities.
- Ticket checksum, dedup/cooldown, post-relaunch verification, and audit must be traceable.
- Record the two known donor limitations unchanged; do not incidentally repair them during migration.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-006/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T13:02:19Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-006/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-006-restart-recovery` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

> **Why MB-006 and not MB-004.** MB-004 (`01-project-foreman`) is the lowest-sequence
> unclaimed migration, but it declares `Dependency Mission: MB-003`, and MB-003 is only
> `migration_complete` — its Verification stage is open and its branch is **not merged** to
> the target repo's `main`. Rule 7 requires a migration branch to be cut from the target
> repo's latest `main`, so an MB-004 branch would not contain the Worker Gateway adapter
> layer it depends on. The mission-book does not define when a dependency counts as
> satisfied; the conservative reading is used here (a dependency is satisfied when its
> artifacts are in `main`, i.e. after the dependency's Verification host merged it), so
> MB-004 is skipped and MB-006 — which declares no dependency — is claimed instead.
> This is a recorded judgment, not a silent skip.

#### Migration closeout

- City claim commit: `3bb6a1c3ea80781a4912b604d388b8bf7fa4b139`
- Implementation head: `9584b98bd9f2bacad93274c74716281c7e0b2b1e`
- Migration head: `dab820b37ff39d1581b19dd43e75771507fb7139`
- Hosted CI: implementation `36574888667` PASS; final branch `36575418378` PASS (gateway-web + android)
- Report: [`reports/MB-006/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-006/MIGRATION_REPORT.md)
- Not merged to `main`; `mission:finalize` deliberately not run (that belongs to the Verification host)

> **Fidelity note for the Verification host.** Every defect this migration had to repair was
> found *after* the module's own tests were green: an added seventh rung in `verifyTicket`, an
> added draft guard in `buildTicket`, a duplicated checksum-defining `canonicalJson`, vocabularies
> re-declared instead of imported from the shared layer, and one test asserting an invented
> leniency. Compare the ported code against `D:\dsh-restart-donor` at `e20fb6cc` rather than
> against the report. See section 5 of the report.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-30T01:30:00Z
- City claim commit: `34e9f33`
- Reviewed migration branch: `mission/MB-006-restart-recovery` @ `dab820b37ff39d1581b19dd43e75771507fb7139`
- Selection note: selected under mission rule 6's second clause. No migration is claimable (`MB-007`/`MB-008` are `BLOCKED_OWNER_DECISION`; `MB-010`–`MB-012` have `execution_enabled: false`), so the verification queue is the claimable set, ascending by sequence. That queue is `MB-002` (claimed by `Alien`), `MB-003` (**blocked** by this host — no donor-supported provider), `MB-004` (claimed by `Alien`), `MB-005` (**not eligible for this host**: rule 5 — `Mech` was MB-005's *migration* host), `MB-009` (**not eligible for this host**: rule 5 — `Mech` was MB-009's migration host), and `MB-006`. `MB-006` is therefore the lowest-sequence verification this host is permitted to take, and its migration host is `Alien`, so rule 5 permits it.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened.

#### Verification closeout

- Verification head: `75edd7e` (the verified episode commit); the reconciled tree that CI covered is `d83ad16`.
- Hosted CI: reconciled tree `36588756363` PASS; final branch `36589287739` PASS; merged main `36590045745` PASS.
- Episode: `data-records/evolution/episodes/mission-book/MB-006/episode.json` — `MB-006:0a48549fc6f5f8c6`, status `VERIFIED`, sha256 `8247ecd76a7fbf713027d4f379b055dbe1017939e6dacd882e2c8682c9f8d3e8`. `mission:finalize` ran and removed the current-tree inbox.
- Merge to `main`: `ce33792ed50787e991b22465da28feabc8e50c50`. `main` had advanced to `83ea44e` (MB-002, verified by host `Alien`) while this episode was being finalized, so the two verified trees were **reconciled** rather than force-updated; the reconciliation keeps MB-001's district-level `kind: "infrastructure"`, MB-002's registry rewrite, and MB-003's/MB-006's module-level `capabilityProvider: false`, and takes the union of every mission's modules in the census test.
- **Recorded tension (not silently satisfied):** the gate asks for two hosts to complete a real controlled restart, while rule 5 permits exactly one verification host. This host performed one real restart/relaunch; the migration host has its own. Both readings are recorded in the report's §5.2 rather than one being presented as the rule.
- Report: [`reports/MB-006/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-006/VERIFICATION_REPORT.md). Boundaries this verification did **not** establish — including that the crash-loop breaker/safe mode is not migrated, so no crash-loop/safe-mode behaviour test is possible at this boundary — are in §6.6.


## Binding execution conditions (mandatory for every Mission)

> **ACTIVE RULESET:** [`README.md`](.././README.md) (integration-first v2)  
> **OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. If they conflict with the latest Owner ruling, response-9-29.md prevails.

## Mission-specific evidence

- restart ticket/audit
- process exit + relaunch trace
- post-relaunch verification
- crash-loop/safe-mode targeted test
- documented limitation parity
