> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-003-worker-gateway.md) 的原始 frontmatter 是唯一元数据来源。

# MB-003 — Worker Gateway Boss/Hns Union migration only

> **Repair queue step 3 — STARTED and RUN TO ITS HONEST TERMINAL STATE (2026-09-30).** MB-007 (`repair_status=COMPLETE`) and MB-008 (`repair_status=COMPLETE`) are both closed, so the precondition to begin step 3 was met. Step 3 performed the value reassessment and the provider probe; see the status block below for the outcome. First compare current Utopia main with the MB-003 donor/branch; if the whole migration has no value, `SKIPPED_NOT_REQUIRED` is permitted. If it retains value, the real provider/runner execution seam remains a hard gate and cannot be mocked or waived.

> **Current status: `VERIFICATION_COMPLETE` (repair step 3 closed on 2026-09-30)**: Step 3 value reassessment, probes on two hosts,
> completion repair, real chain, merge, and City closeout all completed.
> Value verdict = `ROUTE_B_CONTINUE` (at that time, `main` `02-worker-gateway` contained only `skill-intake`; all `WG-01..08` were missing),
> so the existing donor real execution seam was migrated under the **original Mission identity**, following `response-9-29` R1 and `response-9-30` R8.
>
> **two-host gate SATISFIED:** `Mech` (`MEGA-REP`) and `Alien` (`MERA-ALIANWARE`) **each** produced real, donor-supported
> provider receipts (Mech: `reports/MB-003/VERIFICATION_REPORT.md` §8.3; Alien: this file’s `alien_provider_receipt`),
> resolving the “Alien half cannot produce output” blocker recorded at `8262a41`.
>
> **completion repair:** added `city/02-engineering/02-worker-gateway/worker-runner`, migrating donor
> `dsh-runner.js` with line-by-line equivalence (the sole adaptation replaces hardcoded host paths with an injected seam); `scheduler.js`/`gate.js`/`system.js` remain
> deferred and recorded in `DONOR.json`. The real chain in engineering book §4.5 was rerun **through the migrated module itself**; all five verdicts were true;
> all four conflicts merging `main` were resolved by union/superset; census was regenerated from the merged manifest and matched every entry (32 modules).
>
> **Host separation: `OWNER_WAIVED` (`response-9-30.md#R10`).** The Verification Host could not perform closeout this round; the Owner explicitly authorized this
> Mission’s Migration Host to complete it. No history was fabricated: `Mech` VERIFICATION events and its `BLOCKED` finding remain unchanged in the
> timeline, still attributed to `Mech`. The episode explicitly records `hostSeparation.mode = OWNER_WAIVED`, the ruling reference,
> `migrationHosts=[Alien]`, `verificationHosts=[Alien, Mech]`, and the verification event count contributed by the completing host (5);
> finalizer adds this waiver path, accepting only when “the completing host actually produced verification events, and an event in the record references that ruling,”
> with 10 tests covering the positive case and all refusal cases (the original 11 remain unchanged). No other verification criterion was lowered.
>
> **Result:** episode `MB-003:5c0ab438d20476d1` (27 events, inbox digest `694b5edb421d90ddbd728f32c3fa0aec72af7b88392e81f5c42ea85569298a96`);
> implementation CI `36671050015`, final branch CI `36671502121`, and merged-main CI `36671850064` all PASS;
> merge `756c7d760c605e33ba386e87605e078fe24b82ca`。

## Goal

Migrate Engineering provider/runtime adapter behavior, primarily Hns with Boss supplementary, into 02/02 Worker Gateway. Preserve already migrated Skill Intake results without moving vendor product shells.

## Donor / Frozen baseline

- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City ownership and implementation boundary

- **City owner:** 02/02 Worker Gateway — Engineering Provider Adapter Layer
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/02-engineering/02-worker-gateway`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- provider/runtime detect/version/capabilities/readiness。
- create/attach/start、bounded work submit、status/progress、cancel/interrupt、result/evidence。
- Hns worker/task contract, provider adapter, readiness/health; Boss provider-session/router/circuit-breaker/outcome semantics.
- Unsupported-capability refusal and checkpoint/resume adapter capabilities already present in the donor.

## Explicit exclusions / Outside this Mission

- Foreman plans/DAG/global scheduling.
- DSH/DeepSeek-specific UI, auth/updater, billing/notifications/settings.
- City-global Capability registry truth.
- Rewriting/forking complete official products such as Codex/DeepSeek/Claude.
- A second Skill Intake implementation.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- At least one real product consumption; UI/client requirements reuse only existing Utopia consuming surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-003/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Each participating host must use at least one installed real provider already supported by the donor to complete an actual detect→submit→progress→result/unsupported path. Missing environments mean the task is BLOCKED; mock passes are forbidden.
- Provider failure/interruption/circuit-breaker semantics must be observable, and errors must not be rewritten as successes.
- Existing Skill Intake regression checks must all continue to pass.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-003/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T12:19:26Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-003/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-003-worker-gateway` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`, after confirming that `main` has not moved)

#### Migration closeout

- City claim commit: `5e69ebf0e366835547eb3c36e596937fe58565ec`
- Implementation head: `aff3c283e34b596c6c0ba6c666aed96893b6c395`
- Migration head: `c5734a5e646f1e379aa15282b59a08e8828d5d6a`
- Hosted CI: implementation `36570163616` PASS; final branch `36571564418` PASS (gateway-web + android)
- Report: [`reports/MB-003/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-003/MIGRATION_REPORT.md)
- Not merged to `main`; `mission:finalize` deliberately not run (that belongs to the Verification host)

> **Owner attention — cross-mission conflict.** MB-001 and MB-003 both branched from
> `c7ef3cd` and both edit `city/CITY_IMPLEMENTATION_MANIFEST.json`,
> `city/tests/manifest.test.mjs` and `city/docs/{en,zh-CN}/ARCHITECTURE.md`. MB-001 keeps
> the capability registry from advertising kernel modules with a **district-level**
> `kind: "infrastructure"`; MB-003 does it with a **module-level**
> `capabilityProvider: false`. Whichever merges second must reconcile the two. This is
> structural to the mission-book (missions branch from `main` and share city files), not a
> mistake by either host. See D3 in the MB-003 report.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-29T15:05:00Z
- City claim commit: `39d1c7f`
- Reviewed migration branch: `mission/MB-003-worker-gateway` @ `c5734a5e646f1e379aa15282b59a08e8828d5d6a`
- **Outcome: `BLOCKED_OWNER_DECISION`.** The rule 9 independent review is complete and
  committed (`reports/MB-003/VERIFICATION_REPORT.md` §1–§5); the branch's own gates pass
  (root 59/59, city 224/224, rooms 67/67) and its real consumption is confirmed. The
  Mission's **first** Verification gate — one real detect→submit→progress→result/unsupported
  path with an installed, donor-supported provider, with an explicit ban on mock passes —
  cannot be satisfied here and cannot be repaired without adding capability the branch does
  not carry, which rule 10 forbids. The report's §6 lists the three Owner options.
- A **merge rehearsal** against `main` (aborted, nothing merged) found two mechanical
  conflicts and their reconciliation shape: `registry.mjs` must keep **both** exclusion
  mechanisms (MB-001's district `kind` and MB-003's module `capabilityProvider`), and
  `city/tests/manifest.test.mjs` must take the **union** of the five districts and the seven
  mission modules.


### Step 3 — value reassessment, provider probe and the corrected blocker (`Mech`, 2026-09-30)

Base: Utopia `main` @ `168182c47df537f7c6c47d7e42ab3220af40de68` (post-MB-008).
Branch `mission/MB-003-worker-gateway` @ `60afe9e` → `8262a41`.

- **Value reassessment = `ROUTE_B_CONTINUE`.** `main`'s `city/02-engineering/02-worker-gateway` holds
  **only** `skill-intake`; nothing in the manifest references `provider-adapter`,
  `provider-resilience` or `worker-task-contract`, and no Worker-Gateway provider/runner execution
  seam exists anywhere in `city/`. **All eight of WG-01…WG-08 are missing**, so Route A
  (`SKIPPED_NOT_REQUIRED`) is forbidden.
- **Provider probe on Mech — CORRECTED, and it PASSED.** The earlier `BLOCKED` finding claimed this
  host had no provider environment; that was **incomplete**. The probe looked for provider CLIs on
  `PATH` and missed that the **donor's own runner seam**
  (`DS-Hns @ eeb57ca app/extensions/mega/scheduler/dsh-runner.js`) spawns
  `node <app>/node_modules/@deepseek-ai/dsh/lib/bin.js --profile headless <prompt>`, and
  **`@deepseek-ai/dsh` 0.1.5-rc.1 is installed here**. Mech produced a real receipt: detect/version ·
  bounded submit `exit 0` returning `OK` · liveness/progress through the donor's per-task log ·
  cancel/interrupt via the donor's own `killTree` · the migrated `unsupportedRuntime` refusing with
  `PERMANENT_FAILURE`/`UNSUPPORTED`/`retryable false` · a real provider failure
  (`MISSING_CREDENTIAL`, `exit 1`) **not rewritten as success** · the migrated circuit breaker
  `CLOSED → OPEN`. The host's already-authorised key (order §12 priority 4) was passed to the child
  process only and was **never printed or logged**.
- **Module regression green.** skill-intake **22/22** (the Skill Intake regression the Mission
  requires), provider-adapter **29/29**, provider-resilience **42/42**, worker-task-contract
  **23/23** — 116 total, 0 failures.
- **Still `BLOCKED`, and deliberately not skipped.** The Mission's gate requires **each participating
  host** (Alien and Mech) to leave a real donor-supported provider receipt. `response-9-30.md` **R7**
  rewrote that clause for **MB-008 only**; for MB-003 it stands, and the closeout order says
  explicitly *"Do not independently reduce this to testing only one host at present"*. **Alien is a different physical host** (its working copies
  `D:/Digital-City`, `D:/DS-Hns-donor`, `D:/Codex-Boss-donor` do not exist here; this host is
  `MEGA-REP`), so Alien's half cannot be produced from this session.
- **No repair was applied and no implementation was written.** §13's repair is gated on a lawful
  environment: Mech has one, the **Mission** does not, because the two-host gate is unsatisfiable
  here. Writing the deferred runner seam would create a delta that can never be verified by the
  required gate or merged — the anti-pattern the order names in §18. Instead the seam is fully mapped
  (§8 of the verification report) and Mech's receipt is reproducible.
- **Evolution events appended on the branch** (`8262a41`): `OWNER_INTERVENTION`
  `MB-003:f6c10e2976dde044`, `ATTEMPT_STARTED` `MB-003:c5aba9348638068d`,
  `RUNTIME_PASS` `MB-003:de2ff78e06806a93` (scoped to Mech only), `TEST_PASS`
  `MB-003:3f13f658e8d00e09`, `VERIFIER_FINDING/BLOCKED` `MB-003:6803294c04110f7d`.
  Alien's original migration events, including the real `MIGRATION_COMPLETE/PASS`
  `MB-003:e11774421776f289` and the earlier `BLOCKED` finding `MB-003:972dd415607db28b`, are retained.
- **What unblocks it.** Alien runs the same probe on its own host and leaves its receipt, **or** the
  Owner explicitly rewrites the two-host clause for MB-003 as R7 did for MB-008. Then: merge `main`,
  migrate the deferred seams, run the two-host gate, `host-pass` finalize (MB-003 already carries a
  real `MIGRATION_COMPLETE/PASS`), final CI, merge.

## Binding execution conditions (mandatory for every Mission)

> **LATEST OWNER RULING:** [`response-9-30.md`](../../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) (clauses not superseded by 9-30 remain effective)
> **ACTIVE RULESET:** [`README.md`](.././README.md)  
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. In conflict, latest-dated Owner response prevails.

## Mission-specific evidence

- real provider receipts
- provider/version/readiness snapshots
- interrupt/failure receipts
- existing Skill Intake regression
