> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-012-runtime-compliance.md) 的原始 frontmatter 是唯一元数据来源。

# MB-012 — Runtime Compliance Enforcement extraction value assessment / conditional migration

> **Status: COMPLETE_NO_VALUE (2026-09-30, Host `Mech`).** Assessment verdict: `NO_VALUE`, **assessed as having no value; task retained; no migration performed**. This is green completion under README §2 / response-9-30 R1+R4 (`migration_complete=true`, `migration_completion_basis=SKIPPED_NOT_REQUIRED`, `verification_complete=true`). No implementation code was written and no verified episode is generated. The scheduler must treat it as complete and skip it unless the Owner explicitly resets/reopens it.

## Goal

Assess whether Boss runtime enforcement retains independent value relative to permission/boundary enforcement already present in current Utopia City Core, Capability Fabric, Worker Gateway, and runtime services. Migrate only portions closing real runtime-enforcement gaps.

This Mission follows **Assessment → conditional Migration → conditional Verification**:

- `FULL_MIGRATION`: the planned donor capability set retains independent value as a whole; proceed to full Migration.
- `PARTIAL_MIGRATION`: migrate only the subset that closes real Utopia gaps; explicitly abandon the rest and preserve reasons.
- `NO_VALUE`: current Utopia provides equivalent/superior coverage, or donor behavior is obsolete, wrongly owned, requires new capabilities to work, lacks independent lifecycle/failure-domain value, etc. **Do not migrate**; report to City: **“Assessed as having no value; task retained; no migration performed.”**

`NO_VALUE` is a terminal assessment result, **considered Migration and Mission completion under current rules, although no implementation migration occurred**. Retain the task for provenance, paper material, and possible future Owner reopening.

## Donor / Frozen baseline

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City ownership and candidate implementation boundary

- **City owner:** 01/02 Public Security — Runtime Compliance Enforcement
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Candidate Target path:** `city/01-governance/02-runtime-compliance`
- **Dependency Mission:** none
- Recheck the current City map before actual implementation. If ownership changed, stop and report to City; do not change ownership independently.

## Planned donor capability set

- **RC-01** — privilege / cross-domain / protected-resource access enforcement
- **RC-02** — service / capability registration enforcement hooks
- **RC-03** — authority escalation rejection
- **RC-04** — runtime-policy decision application
- **RC-05** — audit-friendly runtime verdict / enforcement evidence

## Current Utopia capabilities that must be checked when claiming

The claiming host must record the exact Utopia `main` SHA **at claim time** in `assessment_utopia_base_sha`; do not rely solely on impressions from task creation. Check at least:

- `city/00-foundation/01-city-core/**` runtime trust / authority / protected-surface enforcement.
- `city/00-foundation/03-capability-fabric/**` and registration/provider boundaries in `services/capability-bridge/**`.
- `city/02-engineering/01-project-foreman/**`, `02-worker-gateway/**`, and other current runtime dispatch/execution gates.
- `city/CITY_IMPLEMENTATION_MANIFEST.json`, registry/census, and shared contracts.
- Existing privilege/domain/resource rejection and audit-verdict paths in current real Windows/Android/service runtimes.

Also search for implementations, tests, registry/manifest entries, runtime consumers, and historical relocations with equivalent semantics at different paths. “The target directory does not exist” alone **cannot** prove a Utopia capability gap.

## Capability comparison matrix required after claiming

> Update this table directly in this Mission file to preserve compact decision truth. Put complete evidence and process in `ASSESSMENT_REPORT.md` and existing Utopia material locations.

| ID | Planned donor capability | Current equivalent/related Utopia capability | Coverage verdict | Decision | Reason for no/partial migration | Evidence |
|---|---|---|---|---|---|---|
| RC-01 | privilege / cross-domain / protected-resource access enforcement | `root-authority/guard.mjs`(escape⇒`DENY`, protected⇒`REQUIRE_OWNER`, both sides of rename, case-insensitive, injected containment seam, bounded coded reasons)；`guardian-gate.mjs` `SCOPE_VALIDATION` + `DESTRUCTIVE_CHANGE_CHECK`; MB-008 already migrated the computer side-effect permission gate from the **same** donor `src/shared/permission.ts` (`backend-surface/permission.mjs`, `computer-recovery.mjs`); live gateway per-route authorization and bind/token separation; live bridge operation allowlist | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR`: all live donor permission gates have migrated or live counterparts in Utopia; the donor’s extra portions (`execution-profile` assert* methods and named `refuse*` guards) are test-only | `root-authority/guard.mjs`, `guardian-gate.mjs`, `backend-surface/permission.mjs`, `server.mjs`, `bridge.mjs` |
| RC-02 | service / capability registration enforcement hooks | `capability-fabric/registry.mjs`(registration-time refusal of nameless/ownerless/undescribed entries, duplicate owners with both named, and priority conflicts)；`capability-bridge/registry.mjs` ownership；**live** `bridge.mjs#invoke`(`CAPABILITY_NOT_FOUND` 404, `BRIDGE_PENDING` 409, `OPERATION_BLOCKED`, `BUSY` 429, `RESULT_TOO_LARGE`, worker `resourceLimits`)；Android `CapabilityPolicy` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR` + `OBSOLETE_DONOR`: donor registration-time enforcement is **unreachable in production** (`createCapabilityBroker`/`invokeThroughBroker`/`evaluate`/`gateAuthorizer`/`authorizeExecution` have zero non-test callers; `main.ts:1003` constructs `ExecutionGate` with **no options**, so the authorizer hook never fires). Utopia counterparts are live, tested, and consumed by actual invoke paths | `capability-fabric/registry.mjs`, `capability-bridge/registry.mjs`, `bridge.mjs`, `CapabilityPolicy.kt` |
| RC-03 | authority escalation rejection | `guardian-gate.mjs`: `ACCEPTED` is unreachable without a named verdict for **every required check**; `NOT_RUN` is a blocker, not a pass; removal requires Owner approval; override compliance is checked lexically. Also `task-lifecycle` `awaiting_release_permission`, and the strictest-first three-value decision ordering plus immutable floor table in `root-authority/contracts.mjs` | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR`: donor `authority-planes.ts` has **one caller, a CI script** (`scripts/runtime-intelligence-diff-guard.cjs:64`); named `refuse*` guards and `acceptOwnerClaim` are test-only. Utopia’s migrated Guardian gate enforces a stronger property | `authority-planes.ts`, `guardian-gate.mjs`, `task-lifecycle/contracts.mjs`, `root-authority/contracts.mjs` |
| RC-04 | runtime-policy decision application | Live gateway runtime-policy enforcement: protocol-version mismatch **409**, token separation, refusal of `0.0.0.0`/`::` binds, request-size limits, task ownership **403**, state transitions **409**, progress monotonicity **400**, pairing-session one-time/expiry/attempt lock **410/429/403**; `providers.mjs` lifecycle and health ladder; computer-use routing-safety gate; bridge circuit breaker | SUPERIOR | ABANDON | `OBSOLETE_DONOR` + `DUPLICATE_EQUIVALENT` + `NO_REAL_CONSUMER`: the planned capability **does not exist as live behavior in the donor**: `.codex-boss/config/runtime-policy.json` has no consumers; `runtime-policy.ts` exports nothing and `loadRuntimePolicy` has zero callers; the repository has no JSON-Schema validator. The live bound is another object (`SchedulerPolicy.maxParallel`). There is no donor behavior to migrate | `runtime-policy.json`, `runtime-policy.ts`, `scheduler.ts:38`, `server.mjs`, `routing-safety/**` |
| RC-05 | audit-friendly runtime verdict / enforcement evidence | `guardian-gate.mjs` checks each carry `verdict` + `inspected[]` + `reasons[]`; results carry `blocking[]` and a bounded reason count;`decision-ledger.mjs` + `recovery.mjs`；gateway event streams are consumed by Web UI; verified evolution episodes carry `inboxDigestSha256` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR`: the donor Root audit ledger is **written but not read** on live paths (only `RootAuthority.history()` reads it, and its callers are tests). Its integrity mechanism is an **unkeyed** SHA-256 chain (neither MAC nor signature; `createVerify`/`verifySignature`/`publicKey`/`x509`/`createHmac` all have zero hits in `electron/`+`src/`). Utopia verdicts are inherently audit-friendly and actually consumed | `root-audit-ledger.ts`, `guardian-gate.mjs`, `decision-ledger.mjs`, `server.mjs`, `episodes/**` |

### Recommended reason codes

- `DUPLICATE_EQUIVALENT`: Utopia already provides semantically equivalent coverage.
- `UTOPIA_SUPERIOR`: current Utopia implementation is more complete/better suited to the current architecture.
- `OBSOLETE_DONOR`: donor behavior is obsolete or serves only the old architecture.
- `WRONG_OWNERSHIP`: the capability belongs to another building/domain and must not be duplicated in this Mission.
- `NEW_FEATURE_REQUIRED`: making it work requires creating capabilities absent from the donor, violating migration-only.
- `NO_INDEPENDENT_VALUE`: extraction provides no independent lifecycle/failure-domain/reuse value.
- `NO_REAL_CONSUMER`: no real consumer boundary currently exists, and creating a consumer for acceptance would expand product capabilities.
- `GAP_CLOSURE`: a demonstrable gap exists that a donor subcapability can directly close.
- `PARTIAL_GAP_CLOSURE`: only a bounded donor subset is worth migrating.

Do not infer migration value solely because code exists in the donor.

## Assessment claiming and execution procedure

1. Update this file on Digital-City `main`:
   - `assessment_status: IN_PROGRESS`
   - `assessment_claim_host` / `assessment_claimed_at`
   - Current Utopia `main` SHA → `assessment_utopia_base_sha`
2. From that Utopia SHA, create `mission/MB-012-runtime-compliance`; at this stage only **record/evidence changes** are permitted; do not write migration implementation first.
3. Use the existing Utopia event contract with `role=MIGRATION` to record `MISSION_CLAIMED`, `ATTEMPT_STARTED`, necessary `TEST_PASS/TEST_FAIL`, etc.; **do not invent eventType values**.
4. Complete the donor source map, current Utopia capability inventory, and per-capability parity/gap comparison.
5. Create in City:
   - `mission-book/reports/MB-012/ASSESSMENT_REPORT.md`
6. Record exactly one verdict:`FULL_MIGRATION | PARTIAL_MIGRATION | NO_VALUE`。
7. Push the assessment branch and record `assessment_branch` / `assessment_head_sha` / `assessment_report`。

### NO_VALUE closeout

If `assessment_result: NO_VALUE`:

- **Do not modify Utopia product/runtime code.**
- Update:
  - `assessment_status: COMPLETE_NO_VALUE`
  - `assessment_complete: true`
  - `migration_status: SKIPPED_COMPLETE`
  - `migration_complete: true`
  - `migration_completion_basis: SKIPPED_NOT_REQUIRED`
  - `verification_status: NOT_REQUIRED_SKIPPED_COMPLETE`
  - `verification_complete: true`
- The City report must explicitly state: **Assessed as having no value; task retained; no migration performed**, and note that this NO_VALUE counts as green completion under the rules.
- Retain the assessment branch for research/provenance; **do not merge or delete it**. Record its immutable HEAD in the City report.
- The scheduler must subsequently treat this state as complete and skip it unless the Owner explicitly resets/reopens it.

### Continue construction for FULL / PARTIAL

If the verdict is `FULL_MIGRATION` or `PARTIAL_MIGRATION`:

- The assessment host automatically becomes this Mission’s Migration Host; do not reopen competitive claiming.
- `migration_claim_host = assessment_claim_host`；
- `migration_branch = assessment_branch`；
- Only rows marked `MIGRATE/PARTIAL` in the capability matrix may enter implementation.
- `PARTIAL_MIGRATION` must carry abandoned items and their reasons into the Migration Report; silently expanding scope during construction is forbidden.

## Existing behavior permitted to migrate

- privilege/cross-domain/protected-resource access enforcement。
- service/capability registration enforcement hooks。
- authority escalation rejection。
- Runtime-policy decision application and audit-friendly verdicts.

## Explicit exclusions / Outside this Mission

- Owner/Root authority source。
- constitutional protected-surface definition。
- domain-local policy/business state。
- qualification/promotion control。

## Migration completion gates

Applicable only when the Assessment verdict is `FULL_MIGRATION` or `PARTIAL_MIGRATION`:

- Establish traceable source→target mapping from the frozen donor baseline.
- Migrate only behavior approved by the capability matrix; do not incidentally include unapproved items.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- Complete at least one real consumption run; UI/client requirements must reuse only existing Utopia consumer surfaces.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-012/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- If migrating, prove the enforcement contract is independently testable, reusable across boundaries, and its separation provides real lifecycle/failure-domain value.
- Prove existing City Core / Capability Fabric enforcement was not duplicated into a second source of truth.
- The Verification host must differ from the assessment/migration host.
- Complete an independent code/runtime review and record findings before reading the Assessment/Migration report.
- Necessary repairs may occur only on the same Mission branch and must not expand the capability matrix’s approved scope.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-012/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Paper/research material that must be preserved

Regardless of outcome, Assessment must preserve **real negative and positive results**; retaining only successful migrations is forbidden. Record at least:

- donor baseline SHA、Utopia claim-time main SHA、assessment branch HEAD；
- Number of planned capabilities;
- Counts of equivalent Utopia coverage, superior Utopia coverage, and real gaps;
- Counts of capabilities selected for full migration, partial migration, or abandonment;
- Reason code for each abandoned item;
- Inspection scope for source/target files and contract/test/runtime anchors;
- Pass/fail outcomes of parity/runtime checks, failure causes, and repairs (if any);
- If migration occurs: changed-file count, test changes, CI, real consumption, failure/recovery, and final differences;
- If NO_VALUE: why migrating nothing is more correct than copying the donor; this itself is negative-result/architecture-selection evidence;
- Record only measurable facts; do not fabricate test counts, durations, or metrics for a paper.

## Material storage locations

Continue using the already designed locations:

### Digital-City — compact truth / decision

```text
mission-book/MB-012-runtime-compliance.md
mission-book/reports/MB-012/ASSESSMENT_REPORT.md
mission-book/reports/MB-012/MIGRATION_REPORT.md      # 仅实际迁移时
mission-book/reports/MB-012/VERIFICATION_REPORT.md   # 仅实际迁移时
```

### Utopia — process / evidence

```text
.runtime/evidence/mission-book/MB-012/<run-id>/assessment/     # raw, git-ignored
data-records/evolution/inbox/mission-book/MB-012/events.jsonl # bounded structured events on branch
evidence/raw/mission-book/MB-012/assessment/                   # 仅选择性发布的非敏感有界证据
data-records/evolution/episodes/mission-book/MB-012/           # 只有实际迁移+验证后才 finalize
```

For `NO_VALUE`, the current episode schema does not represent a negative result without migration, so **do not fabricate a verified episode**. Retain the assessment branch, City Assessment Report, and evidence pointers.

## Claim / Host claim record

### Assessment Claim

- Host: **Mech**
- Claimed at: 2026-09-30T15:57:40Z
- City claim commit: `2cc352197bf98dbfefcfd9058ee9d6769a516bc9`
- Utopia baseline SHA: `756c7d760c605e33ba386e87605e078fe24b82ca`
- Assessment branch: `mission/MB-012-runtime-compliance` @ `d071328d8f68ba1ddd5e8a1fde11718e75fd6672`(retain; do not merge or delete)
- Donor frozen baseline: `zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080`
- Selection basis: MB-010 and MB-011 both closed as `NO_VALUE` (green `SKIPPED_NOT_REQUIRED`) and no eligible P0 exists, so the last lowest-sequence assessment-first Mission (MB-012) was claimed under README §3 P1A. Read-only reconnaissance only; no implementation code written.
- Assessment outcome: `NO_VALUE` — 5/5 capabilities already equivalent-or-superior in current Utopia; 0 gaps; 0 migrated. Report: [`reports/MB-012/ASSESSMENT_REPORT.md`](../../completed-2026-10-01/reports/MB-012/ASSESSMENT_REPORT.md)

### Assessment closeout (NO_VALUE)

```text
assessment_status          = COMPLETE_NO_VALUE
assessment_complete        = true
assessment_result          = NO_VALUE
migration_status           = SKIPPED_COMPLETE
migration_complete         = true
migration_completion_basis = SKIPPED_NOT_REQUIRED
verification_status        = NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete      = true
merged_main_sha            = null
```

**This Mission was assessed as the named recipient of MB-002 deferral.** MB-002’s
`capability-fabric/DONOR.json` explicitly states `Codex-Boss electron/capability/capability-broker.ts,
authorization.ts and permission-contract.ts ... owned by MB-011/MB-012`; the DEFERRED list states
`permission and authorization resolution (MB-012 Runtime Compliance)`. Testing that deferral concluded
it **is not** a migration opportunity:

1. **The deferred layer never runs in the donor.** `electron/capability/*`
   `createCapabilityBroker` / `invokeThroughBroker` / `evaluate` / `gateAuthorizer` /
   `authorizeExecution` has **zero non-test production callers**, and `electron/main.ts:1003` constructs
   `ExecutionGate` with **no options**, so its authorizer hook never fires; even boundaries the code calls `mapped`
   are aspirational in the shipped application.
2. **RC-04 capability does not exist as live behavior in the donor.** `.codex-boss/config/runtime-policy.json`
   has no consumers; `runtime-policy.ts` exports nothing and `loadRuntimePolicy` has zero callers; the repository has no
   JSON-Schema validator; the live bound is another object (`SchedulerPolicy.maxParallel`).
3. **RC-03 is CI-script-only and the RC-05 ledger is never read.** `authority-planes.ts` has only one
   caller (`scripts/runtime-intelligence-diff-guard.cjs:64`); named `refuse*` guards are test-only;
   the Root audit ledger is read only by tests; its integrity mechanism is an **unkeyed** SHA-256 chain; in `electron/`+`src/`,
   `createVerify`/`verifySignature`/`publicKey`/`x509`/`createHmac` all have zero hits.
4. **The live portions that actually execute have already migrated.** MB-008 migrated the computer side-effect permission gate from the **same**
   `src/shared/permission.ts` named by this Mission; MB-001 migrated protected-surface guard and Guardian gate from the same donor commit
   .
5. **Utopia enforcement is live and consumed.** Real bounded runs measured bridge and gateway refusal on live paths
   (`CAPABILITY_NOT_FOUND`/`OPERATION_BLOCKED`/409/401/403/400/409 and wildcard-bind refusal).
6. **A second enforcement engine would create a second source of truth**, precisely what this Mission’s Verification gates explicitly forbid.

**Scope boundaries (observed)**: Owner/Root authority source and constitutional protected-surface definition
were read only as background, never proposed for migration; `promotion-state.ts` / promotion-controller belong to qualification/promotion
control and likewise serve only as reference.

**Measured evidence (1904 PASS / 0 FAIL)**: bounded enforcement chain 19/19 PASS (including a live gateway temporary port
and live capability-bridge invoke);`city/test-all.mjs` 1807 pass / 0 fail / 1 skipped(1808 total)；
root `tests/*.test.mjs` 84 pass / 0 fail；`verify-promotion-history.mjs` 10/10。

**Queue status: the MB-010 → MB-011 → MB-012 assessment-first queue is fully closed and empty.**
All enabled Missions in `MISSION_INDEX.md` now have `verification_complete = true`.


### Migration Claim

- Host: **UNCLAIMED**
- Claimed at: —
- Implementation branch: —

### Verification Claim

- Host: **UNCLAIMED**
- Claimed at: —
- Reviewed migration branch: —

## Binding execution conditions (mandatory for every Mission)

> **LATEST OWNER RULING:** [`response-9-30.md`](../../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) (clauses not superseded by 9-30 remain effective)
> **ACTIVE RULESET:** [`README.md`](.././README.md)（integration-first + assessment-first）  
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.

## Mission-specific evidence

- claim-time Utopia main SHA required
- capability-by-capability comparison required
- Assessment Report required for **all** verdicts
- NO_VALUE negative result must remain traceable
