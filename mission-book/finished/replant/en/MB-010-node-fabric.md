> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-010-node-fabric.md) 的原始 frontmatter 是唯一元数据来源。

# MB-010 — Node Fabric Boss extraction value assessment / conditional migration

> **Status: COMPLETE_NO_VALUE (2026-09-30, Host `Mech`).** Assessment verdict: `NO_VALUE`, **assessed as having no value; task retained; no migration performed**. This is green completion under README §2 / response-9-30 R1+R4 (`migration_complete=true`, `migration_completion_basis=SKIPPED_NOT_REQUIRED`, `verification_complete=true`). No implementation code was written and no verified episode is generated. The scheduler must subsequently treat it as complete and skip it unless the Owner explicitly resets/reopens it.

## Goal

Assess whether existing physical/logical node semantics in Boss Node Fabric retain independent migration value relative to **current Utopia**. Migrate only when they close real gaps in current node identity, liveness, resources, or capability-host truth.

This Mission follows **Assessment → conditional Migration → conditional Verification**:

- `FULL_MIGRATION`: the planned donor capability set retains independent value as a whole; proceed to full Migration.
- `PARTIAL_MIGRATION`: migrate only the subset that closes real Utopia gaps; explicitly abandon the rest and preserve reasons.
- `NO_VALUE`: current Utopia provides equivalent/superior coverage, or donor behavior is obsolete, wrongly owned, requires new capabilities to work, lacks independent lifecycle/failure-domain value, etc. **Do not migrate**; report to City: **“Assessed as having no value; task retained; no migration performed.”**

`NO_VALUE` is a terminal assessment result, **considered Migration and Mission completion under current rules, although no implementation migration occurred**. Retain the task for provenance, paper material, and possible future Owner reopening.

## Donor / Frozen baseline

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City ownership and candidate implementation boundary

- **City owner:** 00/02 City Node Network — Device Node Fabric
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Candidate Target path:** `city/00-foundation/02-node-fabric`
- **Dependency Mission:** none
- Recheck the current City map before actual implementation. If ownership changed, stop and report to City; do not change ownership independently.

## Planned donor capability set

- **NF-01** — node principal / registration / membership identity truth
- **NF-02** — heartbeat / liveness / offline truth
- **NF-03** — runtime endpoint metadata / node endpoint truth
- **NF-04** — hardware / resource telemetry used as node truth
- **NF-05** — capability-host advertisement / capability-to-node hosting truth

## Current Utopia capabilities that must be checked when claiming

The claiming host must record the exact Utopia `main` SHA **at claim time** in `assessment_utopia_base_sha`; do not rely solely on impressions from task creation. Check at least:

- `city/00-foundation/**`, especially City Core, Capability Fabric, and any new 00/02 implementation.
- `services/dev-gateway/**` and existing host/runtime endpoint sources of truth.
- `services/capability-bridge/**` and capability provider/registry sources of truth.
- `platform/**`, and existing host/device identity, health, endpoint, and resource information in Windows/Android/device bridges.
- `city/CITY_IMPLEMENTATION_MANIFEST.json`, census, registry, and tests, to determine whether another building already owns the same semantics.

Also search for implementations, tests, registry/manifest entries, runtime consumers, and historical relocations with equivalent semantics at different paths. “The target directory does not exist” alone **cannot** prove a Utopia capability gap.

## Capability comparison matrix required after claiming

> Update this table directly in this Mission file to preserve compact decision truth. Put complete evidence and process in `ASSESSMENT_REPORT.md` and existing Utopia material locations.

| ID | Planned donor capability | Current equivalent/related Utopia capability | Coverage verdict | Decision | Reason for no/partial migration | Evidence |
|---|---|---|---|---|---|---|
| NF-01 | node principal / registration / membership identity truth | durable node record in `services/dev-gateway` SQLite `nodes` (`id`, `devicePrincipalId`, `online`, `lastHeartbeatAt`) + `agents/reference-node` register + MB-001 `fleet-routing` `FleetMemberRecord` | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT`: Utopia already has live registration and membership identity truth; the donor’s broader identity tuple has no Utopia consumer | `server.mjs:93-97`, `store.mjs:9`, `agent.mjs:10`, `fleet-routing/DONOR.json` |
| NF-02 | heartbeat / liveness / offline truth | gateway heartbeat endpoint + 1s sweeper → `online:false` + `NODE_OFFLINE`；`claimNodeFor`→`acceptsWork`；MB-001 already migrated `fleetNodeStateFor`/`handleNodeDropout`；Web ONLINE/OFFLINE/UNKNOWN + 10s freshness | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT`: MB-001 already migrated the donor’s three-state DEGRADED rule; connecting gateway to three-state semantics changes runtime behavior rather than filling missing donor behavior | `server.mjs:31,99,129`, `fleet.mjs:46-51,114`, `app.js:16-18` |
| NF-03 | runtime endpoint metadata / node endpoint truth | pairing `descriptor.endpoint{scheme,host,port}` + apiVersion/schemaVersion；`discovery.mjs` mDNS `utopia-city` + BLE；`store.cityId`；Web/Android pairing consumption | EQUIVALENT | ABANDON | `OBSOLETE_DONOR`: the remaining donor portion is a desktop proxy/AI-provider multi-route reachability matrix; Utopia’s single-City outbound-polling architecture has no such decision surface | `pairing.mjs:8`, `discovery.mjs:11-18`, `ble.mjs`；repository-wide grep `networkRoutes`/`providerMatrix` = 0 |
| NF-04 | hardware / resource telemetry used as node truth | `agents/reference-node/telemetry.mjs`(CPU delta%, memory, disk, uptime)+ `contracts/pairing-v1` validation + Web LIVE/CACHED rendering；MB-005 host-health-station；MB-001 `capabilityVerdicts` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR`: Utopia telemetry is actually measured and consumed by the product; donor `node-inspector.ts` always returns `gpu: []`, with no GPU behavior to migrate | `telemetry.mjs`, `descriptor.mjs:25-34`, `app.js:19`, `host-health-station/**` |
| NF-05 | capability-host advertisement / capability-to-node hosting truth | node `capabilities[]` durable advertisement；`REQUIRED_TASK_CAPABILITIES`+`acceptsWork` placement gate；MB-001 `eligibleCandidates`；capability-fabric registry(ownership/priority/duplicate-owner refusal/revocation)+ capability-bridge | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `NO_REAL_CONSUMER` + `NO_INDEPENDENT_VALUE`: Utopia already has a stronger registry mechanism across layers; migrating `NodeCapabilityRegistry` would merely duplicate registry state | `server.mjs:28-31,102`, `capability-fabric/registry.mjs`, `capability-bridge/registry.mjs` |

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
2. From that Utopia SHA, create `mission/MB-010-node-fabric`; at this stage only **record/evidence changes** are permitted; do not write migration implementation first.
3. Use the existing Utopia event contract with `role=MIGRATION` to record `MISSION_CLAIMED`, `ATTEMPT_STARTED`, necessary `TEST_PASS/TEST_FAIL`, etc.; **do not invent eventType values**.
4. Complete the donor source map, current Utopia capability inventory, and per-capability parity/gap comparison.
5. Create in City:
   - `mission-book/reports/MB-010/ASSESSMENT_REPORT.md`
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

- node principal/registration/membership、heartbeat/liveness/offline truth。
- runtime endpoint metadata、hardware/resource telemetry、capability-host advertisement。
- Only interface adaptation, equivalent refactoring, and parity tests needed to reuse existing donor semantics.

## Explicit exclusions / Outside this Mission

- 08 Device & Edge sensor/actuator semantics.
- Hns worker scheduling。
- Automatically turning Android into a compute node.
- Any new network/cloud capability absent from the donor.

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
  - `Digital-City/mission-book/reports/MB-010/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- Existing Windows/Android/node-truth regression checks must not deteriorate.
- Preserve union/parity records of overlaps/differences between Boss donor and current Utopia reference/host truth.
- The Verification host must differ from the assessment/migration host.
- Complete an independent code/runtime review and record findings before reading the Assessment/Migration report.
- Necessary repairs may occur only on the same Mission branch and must not expand the capability matrix’s approved scope.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-010/VERIFICATION_REPORT.md`
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
mission-book/MB-010-node-fabric.md
mission-book/reports/MB-010/ASSESSMENT_REPORT.md
mission-book/reports/MB-010/MIGRATION_REPORT.md      # 仅实际迁移时
mission-book/reports/MB-010/VERIFICATION_REPORT.md   # 仅实际迁移时
```

### Utopia — process / evidence

```text
.runtime/evidence/mission-book/MB-010/<run-id>/assessment/     # raw, git-ignored
data-records/evolution/inbox/mission-book/MB-010/events.jsonl # bounded structured events on branch
evidence/raw/mission-book/MB-010/assessment/                   # 仅选择性发布的非敏感有界证据
data-records/evolution/episodes/mission-book/MB-010/           # 只有实际迁移+验证后才 finalize
```

For `NO_VALUE`, the current episode schema does not represent a negative result without migration, so **do not fabricate a verified episode**. Retain the assessment branch, City Assessment Report, and evidence pointers.

## Claim / Host claim record

### Assessment Claim

- Host: **Mech**
- Claimed at: 2026-09-30T15:40:09Z
- City claim commit: `e424178c35dd7f47cd859dc5e784186c2e976a91`
- Utopia baseline SHA: `756c7d760c605e33ba386e87605e078fe24b82ca`
- Assessment branch: `mission/MB-010-node-fabric` @ `8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526`(retain; do not merge or delete)
- Donor frozen baseline: `zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080`
- Selection basis: integration-first scheduler had **no eligible P0** left (MB-001..MB-009 all `verification_complete=true`, all mission branches `AheadOfMain=0`), so the lowest-sequence eligible assessment-first Mission (MB-010) was claimed under README §3 P1A. Read-only reconnaissance preceded this claim; no implementation code has been written.
- Assessment outcome: `NO_VALUE` — 5/5 capabilities already equivalent-or-superior in current Utopia; 0 gaps; 0 migrated. Report: [`reports/MB-010/ASSESSMENT_REPORT.md`](../../completed-2026-10-01/reports/MB-010/ASSESSMENT_REPORT.md)

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

Decisive finding: MB-001 had already migrated the donor's **live** node logic
(`src/shared/fleet.ts`, `capability-router.ts`, `node-capabilities.ts`,
`adaptive-routing.ts`) from this **same** frozen commit into
`city/00-foundation/01-city-core/fleet-routing`; the running product already owns
registration, heartbeat/liveness, endpoint truth, telemetry and capability
advertisement. The donor remainder (`TenxNodeRegistry`, `TenxNetworkRegistry`,
`TenxObservability`) is **production-dead at the frozen baseline** — no
`electron/main.ts`/`bootstrap` import, only a type-only field plus tests, and
`config/capabilities/node.yaml` declares `modules: []` / `bootModules: []` /
`surface: []`. Measured evidence: bounded real runtime chain 8/8 PASS, city
fleet-routing 28/28 PASS, root gateway+telemetry+web 11/11 PASS (47 PASS / 0 FAIL).


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
