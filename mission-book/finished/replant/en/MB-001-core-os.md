> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-001-core-os.md) 的原始 frontmatter 是唯一元数据来源。

# MB-001 — Codex-Boss Core OS migration only

> **Current status: host `Mech` completed Verification and merged it into main** (host `Alien` completed Migration; the hosts differ, satisfying rule 5).

## Goal

Extract the City authority / runtime trust / global orchestration core already implemented in Codex-Boss from the multipurpose Boss project into Utopia’s 00/01 Core OS boundary. Other Boss domain functions are outside this migration.

## Donor / Frozen baseline

- `zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City ownership and implementation boundary

- **City owner:** 00/01 City Core — Runtime Trust & Orchestration Kernel
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/00-foundation/01-city-core`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- Owner sovereignty / Root Authority / Root Trust and protected-surface contracts.
- Global task identity/lifecycle/durable state.
- Cross-domain orchestration/routing and city-scope runtime coordination.
- Continuation/recovery and durable audit primitives.

## Explicit exclusions / Outside this Mission

- Engineering goal/DAG/worker behavior (MB-003/004).
- Research、Knowledge、Computer Use、Theme。
- Reusable extraction of Customs/Public Security (each belongs to a deferred Mission).
- The original Boss product shell, provider window, and project-local settings/history/archive.
- Any new authority policy or governance semantics.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-001/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- At least one existing Utopia task/control flow must actually consume the migrated Core boundary, keeping Web/Android state truth consistent.
- All Root/Trust/authority donor parity and protected-surface regression checks must pass.
- After restart/recovery, durable task/audit identities must not be fabricated as successful.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-001/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T11:52:10Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-001/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-001-core-os` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

#### Migration closeout

- City claim commit: `cc45ea203801d2c34c40924f55b4fa92b9b9768e`
- Migration head: `a71bf9080294390a3e2c1482bb53930519d1b3b3`
- Hosted CI: final branch `36566973111` PASS (gateway-web + android); implementation `36566575068` PASS
- Report: [`reports/MB-001/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-001/MIGRATION_REPORT.md)
- Not merged to `main`; `mission:finalize` deliberately not run (that belongs to the Verification host)

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-29T15:30:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-001/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-001-core-os` @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`
- Selection note: selected under mission rule 6's second clause. No migration was claimable (`MB-007`/`MB-008` are claimed by `Alien`; `MB-010`–`MB-012` have `execution_enabled: false`), so the verification queue is the claimable set, and `MB-001` is its lowest sequence. `Mech` is a different host from this Mission's migration host (`Alien`), so rule 5 permits it.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened. The independent findings are recorded in the Verification Report under a section that precedes any reference to the migration host's own account.

#### Verification closeout

- Verification head: `b2fb73b` (the verified episode commit); implementation repairs at `932196e`.
- Final branch CI: `36585164507` PASS (gateway-web + android). Verification-events CI: `36584692434` PASS. Repair CI: `36583350117` PASS.
- Episode: `data-records/evolution/episodes/mission-book/MB-001/episode.json` — `MB-001:16558c84c4d1547e`, status `VERIFIED`, sha256 `4f40ae9c0b09fc624de7927e1a66b886efaa1dfc2fa760dab0e2e9c66bd223f7`. `mission:finalize` ran and removed the current-tree inbox.
- Merge to `main`: `d81a567268d7cab26b84eaf798fc7a25c8033b25` (merge over `c7ef3cd`); its CI run `36585590593`.
- Report: [`reports/MB-001/VERIFICATION_REPORT.md`](../../completed-2026-10-01/reports/MB-001/VERIFICATION_REPORT.md). Boundaries this verification did **not** establish are listed in that report's §7.7.


## Binding execution conditions (mandatory for every Mission)

> **ACTIVE RULESET:** [`README.md`](.././README.md) (integration-first v2)  
> **OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. If they conflict with the latest Owner ruling, response-9-29.md prevails.

## Mission-specific evidence

- authority/trust parity receipts
- task lifecycle + restart/recovery receipts
- Web/Android existing control-surface evidence
- source→target symbol/path ledger
