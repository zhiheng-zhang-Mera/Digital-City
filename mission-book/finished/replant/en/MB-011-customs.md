> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-011-customs.md) 的原始 frontmatter 是唯一元数据来源。

# MB-011 — Customs Admission Boundary extraction value assessment / conditional migration

> **Status: COMPLETE_NO_VALUE (2026-09-30, Host `Mech`).** Assessment verdict: `NO_VALUE`, **assessed as having no value; task retained; no migration performed**. This is green completion under README §2 / response-9-30 R1+R4 (`migration_complete=true`, `migration_completion_basis=SKIPPED_NOT_REQUIRED`, `verification_complete=true`). No implementation code was written and no verified episode is generated. The scheduler must subsequently treat it as complete and skip it unless the Owner explicitly resets/reopens it.

## Goal

Assess whether Boss/Hns admission-time checks retain independent value relative to current Utopia manifest, promotion, capability, source/provenance, and package-admission flows. Migrate into 01/01 Customs only behavior that closes real, reusable admission-check gaps.

This Mission follows **Assessment → conditional Migration → conditional Verification**:

- `FULL_MIGRATION`: the planned donor capability set retains independent value as a whole; proceed to full Migration.
- `PARTIAL_MIGRATION`: migrate only the subset that closes real Utopia gaps; explicitly abandon the rest and preserve reasons.
- `NO_VALUE`: current Utopia provides equivalent/superior coverage, or donor behavior is obsolete, wrongly owned, requires new capabilities to work, lacks independent lifecycle/failure-domain value, etc. **Do not migrate**; report to City: **“Assessed as having no value; task retained; no migration performed.”**

`NO_VALUE` is a terminal assessment result, **considered Migration and Mission completion under current rules, although no implementation migration occurred**. Retain the task for provenance, paper material, and possible future Owner reopening.

## Donor / Frozen baseline

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

## City ownership and candidate implementation boundary

- **City owner:** 01/01 Customs Security — Extension Admission Checks
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Candidate Target path:** `city/01-governance/01-customs-security`
- **Dependency Mission:** none
- Recheck the current City map before actual implementation. If ownership changed, stop and report to City; do not change ownership independently.

## Planned donor capability set

- **CU-01** — manifest / schema admission validation
- **CU-02** — identity / source / provenance verification hooks at admission time
- **CU-03** — dependency / capability / permission / domain / storage declaration checks
- **CU-04** — isolation / crash-boundary / compatibility preflight
- **CU-05** — enable / disable / uninstall / rollback readiness checks before admission

## Current Utopia capabilities that must be checked when claiming

The claiming host must record the exact Utopia `main` SHA **at claim time** in `assessment_utopia_base_sha`; do not rely solely on impressions from task creation. Check at least:

- `city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/manifest.mjs`, and existing structural validation in city tests/census.
- `city/00-foundation/01-city-core/**` and trust/authority/protected-surface boundaries.
- `city/00-foundation/03-capability-fabric/**`, and registry/provider validation in `services/capability-bridge/**`.
- `apps/rooms/promotions/**`, promotion-history verifier, and `DONOR.json`/provenance reading logic.
- Any current package/plugin/module admission and install/enable/disable/rollback flows.

Also search for implementations, tests, registry/manifest entries, runtime consumers, and historical relocations with equivalent semantics at different paths. “The target directory does not exist” alone **cannot** prove a Utopia capability gap.

## Capability comparison matrix required after claiming

> Update this table directly in this Mission file to preserve compact decision truth. Put complete evidence and process in `ASSESSMENT_REPORT.md` and existing Utopia material locations.

| ID | Planned donor capability | Current equivalent/related Utopia capability | Coverage verdict | Decision | Reason for no/partial migration | Evidence |
|---|---|---|---|---|---|---|
| CU-01 | manifest / schema admission validation | `city/manifest.mjs` `validateManifest`/`checkManifestAgainstTree`(structure, id shape, bilingual text, duplicate id/path, lifecycle vocabulary, boolean `capabilityProvider`, **canonical path equality**, incubation-room uniqueness and necessity, donor SHA; then cross-check against the disk tree)+ `promotions.mjs` + `capability-fabric/contracts.mjs#FABRIC_API_VERSION` + five contract schemas | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR`: donor plugin-manifest fields (`api_version` equality, semver, provides/requires/conflicts arrays) have no corresponding admission object in Utopia (no plugin format); Utopia is stricter for fields that actually exist | `city/manifest.mjs`, `city/tests/manifest.test.mjs`, `promotions.mjs`, `contracts/*/schema.json` |
| CU-02 | identity / source / provenance verification hooks at admission time | `promotions.mjs` records and validates `donor.repository`/`commit`/`sourcePaths`; `crossCheckPromotions` rejects rooms that conflict with directories or remain live; `scripts/verify-promotion-history.mjs` uses local Git history to verify commit ancestry and target existence for every record; per-module `DONOR.json` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR`: the donor has **no provenance verification at all**; it merely builds and stores a provenance object from user input using regular expressions. Across the entire baseline, `createVerify`/`verifySignature`/`publicKey`/`x509`/`contentHash`/`pluginHash` each have zero hits; 17 admission modules have no `node:crypto` | `promotions.mjs`, `verify-promotion-history.mjs`, `DONOR.json` |
| CU-03 | dependency / capability / permission / domain / storage declaration checks | `capability-fabric/registry.mjs`(refuses a second owner at registration and names both parties; names requester on miss; revocation)；`providers.mjs`(refuses duplicate identities)；`capability-bridge/registry.mjs`（moduleRefs/owner/priority/kind）；`capability-routing.mjs#eligibleCandidates`；`city/manifest.mjs` domain path | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `WRONG_OWNERSHIP` + `NO_INDEPENDENT_VALUE`: capability/dependency decisions are already covered at registration rather than donor load time. MB-002 DONOR.json explicitly assigns permission resolution to **MB-012**; the donor itself does not enforce permissions at admission (`UNKNOWN_PERMISSION`/`PERMISSION_DENIED` are never produced). Neither side has storage declarations | `capability-fabric/registry.mjs`, `providers.mjs`, `capability-bridge/registry.mjs`, `capability-routing.mjs` |
| CU-04 | isolation / crash-boundary / compatibility preflight | `FABRIC_API_VERSION` + descriptor validation;`FAULT_LEVELS`(soft/degraded/fatal), health-reaction ladder, and bounded restart budget; MB-006 `04-restart-recovery-station` owns the real recovery boundary | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR` + `NO_REAL_CONSUMER`: the Mission’s isolation preflight **does not exist as a refusal in the donor** (`RUNTIME_KINDS` is merely declaration metadata; its only consumer is an advisory risk score in dead `plan.cjs` code; real isolation occurs at subprocess launch after admission). Codex-Boss root-recovery rollback belongs to Owner sovereignty / Root Authority, explicitly forbidden in this Mission | `plugin-adapters/contract.cjs`, `process/contract.cjs`, `capability-fabric/contracts.mjs`, `providers.mjs`, `04-restart-recovery-station/**` |
| CU-05 | enable / disable / uninstall / rollback readiness checks before admission | `providers.mjs`(installed/enabled/loaded/healthy are four independent facts; disabled providers refuse load unless force is explicit)；`RETIRED_LIFECYCLES` removes PROMOTED/REJECTED rooms from active directories;`crossCheckPromotions` + `verify-promotion-history` proves no second live implementation exists;MB-006 checkpoint gate fail-closed + restart lock/ticket | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR` + `OBSOLETE_DONOR`: the donor’s **live** paths (`setEnabled`/`removeOne`) refuse only `PLUGIN_NOT_FOUND`, without dependency checks or rollback; designed readiness (pin/quarantine/rollback-before-replace/confirm) exists only in **production-dead** `plugin-install/*` (960 lines, zero app consumers) | `plugin-manager/index.cjs`, `plugin-install/*`, `providers.mjs`, `promotions.mjs`, `04-restart-recovery-station/**` |

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
2. From that Utopia SHA, create `mission/MB-011-customs`; at this stage only **record/evidence changes** are permitted; do not write migration implementation first.
3. Use the existing Utopia event contract with `role=MIGRATION` to record `MISSION_CLAIMED`, `ATTEMPT_STARTED`, necessary `TEST_PASS/TEST_FAIL`, etc.; **do not invent eventType values**.
4. Complete the donor source map, current Utopia capability inventory, and per-capability parity/gap comparison.
5. Create in City:
   - `mission-book/reports/MB-011/ASSESSMENT_REPORT.md`
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

- manifest/schema validation、identity/source verification hooks。
- dependency/capability/permission/domain/storage declarations。
- isolation/crash-boundary、enable/disable/uninstall/rollback readiness、admission preflight。

## Explicit exclusions / Outside this Mission

- Owner sovereignty / Root Authority。
- Runtime enforcement (belongs to the MB-012 candidate boundary).
- The Capability registry itself.
- Business-domain quality assessment.

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
  - `Digital-City/mission-book/reports/MB-011/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- If migrating, prove the extracted admission contract is stable and independently testable and has at least one current real consumer/boundary; do not create new consumers to pass gates.
- Prove extraction does not duplicate existing Utopia manifest/promotion/capability checks, or clearly record why an independent Customs layer is needed.
- The Verification host must differ from the assessment/migration host.
- Complete an independent code/runtime review and record findings before reading the Assessment/Migration report.
- Necessary repairs may occur only on the same Mission branch and must not expand the capability matrix’s approved scope.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-011/VERIFICATION_REPORT.md`
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
mission-book/MB-011-customs.md
mission-book/reports/MB-011/ASSESSMENT_REPORT.md
mission-book/reports/MB-011/MIGRATION_REPORT.md      # 仅实际迁移时
mission-book/reports/MB-011/VERIFICATION_REPORT.md   # 仅实际迁移时
```

### Utopia — process / evidence

```text
.runtime/evidence/mission-book/MB-011/<run-id>/assessment/     # raw, git-ignored
data-records/evolution/inbox/mission-book/MB-011/events.jsonl # bounded structured events on branch
evidence/raw/mission-book/MB-011/assessment/                   # 仅选择性发布的非敏感有界证据
data-records/evolution/episodes/mission-book/MB-011/           # 只有实际迁移+验证后才 finalize
```

For `NO_VALUE`, the current episode schema does not represent a negative result without migration, so **do not fabricate a verified episode**. Retain the assessment branch, City Assessment Report, and evidence pointers.

## Claim / Host claim record

### Assessment Claim

- Host: **Mech**
- Claimed at: 2026-09-30T15:48:08Z
- City claim commit: `10b2267105a87dd610503a93d62793b5f12f62c1`
- Utopia baseline SHA: `756c7d760c605e33ba386e87605e078fe24b82ca`
- Assessment branch: `mission/MB-011-customs` @ `82b6ac486d024efcfcc64703b58cc136b546caf9`(retain; do not merge or delete)
- Donor frozen baselines: `zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080`, `zhiheng-zhang-Mera/DS-Hns@eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`
- Selection basis: MB-010 closed as `NO_VALUE` (green `SKIPPED_NOT_REQUIRED`) and no eligible P0 exists, so the next lowest-sequence assessment-first Mission (MB-011) was claimed under README §3 P1A. Read-only reconnaissance only; no implementation code written.
- Assessment outcome: `NO_VALUE` — 5/5 capabilities already equivalent-or-superior in current Utopia; 0 gaps; 0 migrated. Report: [`reports/MB-011/ASSESSMENT_REPORT.md`](../../completed-2026-10-01/reports/MB-011/ASSESSMENT_REPORT.md)

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

**This Mission was assessed as the named recipient of MB-002 deferral, rather than closed hastily as “already covered.”**
`city/00-foundation/03-capability-fabric/capability-fabric/DONOR.json` explicitly states that the Hns
plugin/adapter/installer platform was not migrated and belongs to `01/01 Customs (MB-011)`. Assessment of this deferral concluded
that it **is not** a migration opportunity:

1. **The donor’s most complete admission design is production-dead.** `app/core/plugin-install/`
   (`plan.cjs` + `pipeline.cjs` + `records.cjs`, 960 lines) has **zero app consumers**; its only non-test
   reference is `scripts/install-pipeline-acceptance.cjs`; `records.cjs` is the sole pin / quarantine /
   rollback implementation, so those CU-05 capabilities are consequently dead. The donor’s **live** `setEnabled` /
   `removeOne` refuses only `PLUGIN_NOT_FOUND`.
2. **The donor performs no provenance verification at all** (CU-02), merely building provenance records from user input using regular expressions;
   throughout the baseline `createVerify`/`verifySignature`/`publicKey`/`x509`/`contentHash`/`pluginHash`
   each has zero hits. Utopia actually verifies 10/10 promotion records using local Git history.
3. **CU-04 isolation preflight does not exist as a refusal in the donor**: `RUNTIME_KINDS` is only declaration metadata; its sole consumer
   is an advisory risk score in dead code; real isolation occurs at subprocess launch after admission.
4. **Permissions are not a donor admission gate** (`ADAPTER_UNKNOWN_PERMISSION`/`ADAPTER_PERMISSION_DENIED`
   are never produced; unauthorized access is merely logged and permitted), and MB-002 DONOR.json assigns permission resolution to **MB-012**.
5. **Live donor fragments are equivalent to or weaker than existing Utopia checks**; another Customs layer duplicating
   manifest/promotion/capability checks is precisely what this Mission’s Verification gates explicitly forbid.
6. **Utopia has no plugin/extension ecosystem**: it has no admission objects such as `dshns.plugin/v1`; building a new plugin platform so Customs
   has something to inspect is `NEW_FEATURE_DEVELOPMENT`, violating `MIGRATION_ONLY`.

**Measured evidence (1904 PASS / 0 FAIL)**:bounded admission chain 13/13 PASS；
`city/test-all.mjs` 1807 pass / 0 fail / 1 skipped(1808 total)；root `tests/*.test.mjs`
84 pass / 0 fail；`verify-promotion-history.mjs` verified 10/10 records successfully.

**Note on MB-002 deferral**: `DEFERRED ... belongs to MB-011` is a **pointer** to future work,
not a verified conclusion. Testing it as a hypothesis yields migration or an honest negative result; this assessment produced a negative result:
moving a module unreachable even inside its donor into a migration-only City would merely install code nobody calls.


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
