# Engineering Book — Mission7→8→3 closeout repair

> Reading translation / 阅读译本: historical reading copy, not an authoritative executable workbook or a new task activation. Metadata and examples are quoted in code fences; original boundaries are retained.

Date2026-09-30. Owner orderMB-007→MB-008→MB-003. Control zhiheng-zhang-Mera/Digital-City/mission-book; implementation zhiheng-zhang-Mera/utopia.

> This is closeout repair, not another defensive expansion. Align facts, code, evidence, finalizer and City state and promptly drain7/8/3 backlog. Never fabricate history for green checks, expand Mission boundaries, add donor-absent capability or new UI, or rewrite accepted implementations.

## 0. Initial snapshot

At creation, Digital-City mainf616ddcb48413bc59fc9e8e661e5e0472da9b0f9; Utopia maincb8e0bd77ccf0864cf0af50b4624f2f556b6b279. MB007 Verification COMPLETE/main merged but lacks verified episode; MB008 Migration Owner-accepted, Mech claimed Verification not closed; MB003 Migration complete, Verification blocked on real provider execution seam. Before every step reread both live main heads and Mission frontmatter; this snapshot is not runtime truth.

# 1. Absolute rules

## 1.1 Order

```text
STEP 1 — MB-007
  ↓ only after repair_status=COMPLETE
STEP 2 — MB-008
  ↓ only after repair_status=COMPLETE
STEP 3 — MB-003
```

Later steps may read-only scout, never finalize/merge/claim completion out of order.

## 1.2 City state transaction

```text
A. City pre-state commit
B. Utopia work + evidence
C. City milestone update
D. final CI / finalize / merge OR SKIPPED_COMPLETE
E. City final closeout commit
```

Each step commits City pre-state, Utopia work/evidence, City milestone, final CI/finalize/merge or SKIPPED_COMPLETE, then final City closeout. Synchronize Mission frontmatter, body closeout/repair, mission-book README table, MISSION_INDEX and corresponding Assessment/Migration/Verification report. Failure leaves honest City state such as repair_status BLOCKED immediately, not accounting at the end.

## 1.3 Legal Migration completion basis

```text
IMPLEMENTED_COMPLETE
OWNER_ACCEPTED_COMPLETE
SKIPPED_NOT_REQUIRED
```

A complete comparison concluding no migration also counts complete. SKIPPED_NOT_REQUIRED only if current Utopia covers equivalently/better, donor has no independent value, migration duplicates/misowns, or no migration-only gap remains. It cannot hide still-valuable but missing-environment blockers.

## 1.4 No invented history

Do not write Alien MIGRATION_COMPLETE/PASS it never emitted. Original RUNTIME_FAIL/BLOCKED stays history and episode/report. Owner override explicitly references City ruling.

# STEP1 — MB007 process closeout

## 2.1 City pre-state

```yaml
repair_sequence: 1
repair_status: IN_PROGRESS
migration_completion_basis: OWNER_ACCEPTED_COMPLETE
```

Sequence1/IN_PROGRESS/OWNER_ACCEPTED_COMPLETE; explicitly implementation/Verification accepted and main merged, unique repair scopeOwner-override finalizer contract plus verified episode. Do not remigrate Research Institute.

## 2.2 Utopia repair branch

Create from execution-time latest main:

```text
repair/MB-007-owner-override-finalize
```

Modify finalizer, mission-episode schema and tests:

```text
scripts/finalize-mission-episode.mjs
contracts/evolution/mission-episode-v1.schema.json
对应 tests
```

Add acceptance mode and ruling args:

```text
--migration-acceptance host-pass|owner-override
--owner-ruling <City ruling ref>
```

Default remains host-pass, preserve existing Missions.

### owner-override must verify

Real migration-side BLOCKED event; Verification-host OWNER_INTERVENTION; it resolves specified ruling; independent VERIFIER_FINDING; finalCI_RESULT PASS; VERIFICATION_COMPLETE PASS; distinct migration/verification hosts. Add auditable episode fields, example:

```json
{
  "migrationAcceptance": {
    "mode": "OWNER_OVERRIDE",
    "ownerRuling": "Digital-City/mission-book/response-9-29.md#R6",
    "migrationBlockerEventId": "...",
    "ownerInterventionEventId": "..."
  }
}
```

### Minimum tests

Old host-pass happy path; owner-override happy; absent migration blocker fails; absent ruling fails; ruling/intervention mismatch fails; no verifier finding fails; nonPASS finalCI fails; samehost fails.

## 2.3 Replay real MB007 inbox

Use existing main events:

```text
data-records/evolution/inbox/mission-book/MB-007/events.jsonl
```

Owner basis:

```text
Digital-City/mission-book/response-9-29.md#R6
```

Never invent Alien PASS. Generate:

```text
data-records/evolution/episodes/mission-book/MB-007/episode.json
```

Remove inbox, commit episode, run final branch CI.

## 2.4 Merge and City closeout

```text
finalizer tests PASS
required Utopia checks PASS
episode generated
inbox removed
final branch CI PASS
repair branch merged
merged-main CI PASS
```

Finalizer and required checksPASS, episode generated/inbox removed, finalbranchCI PASS, repair branch merged and mainCI PASS all required. Then City:

```yaml
repair_status: COMPLETE
episode: data-records/evolution/episodes/mission-book/MB-007/episode.json
```

Append Verification repair SHA, episode digest, finalCI, mergeSHA and preserve original blocker. Only after final City closeout commit enterStep2.

# STEP2 — MB008 Verification / conditional skip

## 3.1 City pre-state

Confirm:

```yaml
MB-007 repair_status: COMPLETE
```

Then MB008:

```yaml
repair_sequence: 2
repair_status: IN_PROGRESS
verification_status: CLAIMED
verification_claim_host: Mech
migration_completion_basis: OWNER_ACCEPTED_COMPLETE
```

Sequence2/IN_PROGRESS, Mech CLAIMED verification, Owner-accepted basis.

## 3.2 Reassess current value first

Do not shove oldbranch into main. Compare frozen donors, MB008 branch, post-MB007-repair main, current Windows/platform/services/capability surfaces.

### RouteA — no remaining overall value

Only full planned capability equivalently/better covered or migration creates duplication/misownership permits:

```yaml
migration_status: SKIPPED_COMPLETE
migration_complete: true
migration_completion_basis: SKIPPED_NOT_REQUIRED
verification_status: NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete: true
repair_status: COMPLETE
merged_main_sha: null
```

Report “Determined no value; task retained; not migrated.” Keep oldbranch provenance, no merge or fake episode.

### RouteB — still valuable

Continue below.

## 3.3 Sync current main

Merge latest into mission/MB-008-computer-use, preserve007 finalizer, union manifest/registry/census, noforce, run HEAD-dependent promotion-history after merge commit.

## 3.4 Verification

Perresponse-9-30#R7 no retrospective Alien old bounded action demanded. Mech actually executes donor-supported desktop/file/shell/UI chain, validates postcondition, at least one refusal/permission/error and one recovery/stabilization. Do not expand deferredruntime or newUI/capability. Independently review before Migration report.

## 3.5 Owner-override finalize

Record OWNER_INTERVENTION with:

```text
Digital-City/mission-book/response-9-29.md#R7
Digital-City/mission-book/response-9-30.md#R7
```

AfterCI PASS/VERIFICATION_COMPLETE PASS:

```text
pnpm mission:finalize ...   --migration-acceptance owner-override   --owner-ruling Digital-City/mission-book/response-9-29.md#R7
```

Episode→removeinbox→finalbranchCI→mainmerge→mainCI.

## 3.6 City closeout

Create/update:

```text
mission-book/reports/MB-008/VERIFICATION_REPORT.md
```

Final:

```yaml
verification_status: COMPLETE
verification_complete: true
repair_status: COMPLETE
verification_head_sha: <final>
verification_ci: <runs>
merged_main_sha: <merge>
episode: <path>
```

Verification/repair COMPLETE plus exacthead, runs, merge, episode; syncREADME/index.

# STEP3 — MB003 reassessment and real execution seam

## 4.1 City pre-state

```text
MB-007 repair_status = COMPLETE
MB-008 repair_status = COMPLETE
```

Both prior repairs COMPLETE, then:

```yaml
repair_sequence: 3
repair_status: IN_PROGRESS
```

## 4.2 Compare before migrating oldbranch

Compare frozenDS-Hns/Codex-Boss, mission/MB-003-worker-gateway, postMB008 main, currentForeman/capabilityfabric/runtime/provider surfaces.

### RouteA — entire003 no value

If currentmain covers equivalent/better:

```yaml
migration_status: SKIPPED_COMPLETE
migration_complete: true
migration_completion_basis: SKIPPED_NOT_REQUIRED
verification_status: NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete: true
repair_status: COMPLETE
merged_main_sha: null
```

Report “Determined no value; task retained; not migrated”; do not mergeoldbranch.

### RouteB — still valuable

Real execution seam is a hardgate.

## 4.3 Probe both physicalhosts

Before code record:

```text
Alien provider/runtime inventory
Mech provider/runtime inventory
donor-supported provider availability
version/readiness
real execution possibility
```

Both provider/runtime inventories, donor-supported availability, version/readiness and realexecution possible. May install/enable official donor-supported runtime/provider, never mockprovider. If no realpath but still valuable:

```yaml
repair_status: BLOCKED
verification_status: BLOCKED_ENVIRONMENT
```

Report City and stopBLOCKED/BLOCKED_ENVIRONMENT; cannot mask withSKIPPED_COMPLETE.

## 4.4 Reconcile originalbranch

Retain Mission identity:

```text
mission/MB-003-worker-gateway
```

Merge latest main, noforce. Only frozen-donor existing provider/runner seam, registry/supervisor wiring, spawn/lifecycle/result/evidence, supported interruption/cancel/failure. No planner/vendorUI/newprotocol/mockPASS/unrelatedcleanup.

## 4.5 Realgate

```text
detect
→ submit
→ progress
→ result OR honest unsupported
```

Actually detect→submit→progress→result or honestunsupported. Verifyprovider failure/interruption, circuitbreaker, donor-supported cancel/interrupt, error not rewritten success, SkillIntake/Gateway regressions allgreen.

## 4.6 Finalize and merge

003 already has realMigration-host PASS, normal:

```text
--migration-acceptance host-pass
```

Complete:

```text
independent finding
real execution evidence
CI_RESULT PASS
VERIFICATION_COMPLETE PASS
mission:finalize
episode commit
final branch CI
merge main
merged-main CI
```

Independentfinding/realexecution/CI PASS/verificationPASS/finalize/episodecommit/branchCI/merge/mainCI.

## 4.7 City closeout

```yaml
verification_status: COMPLETE
verification_complete: true
repair_status: COMPLETE
verification_head_sha: <final>
verification_ci: <runs>
merged_main_sha: <merge>
episode: <path>
```

Update existingVerification, retain initial no-provider blocker and later realresolution.

# 5. Research and engineering material

Preserve each naturally produced datum, never create extra failures for paper: donor/sourceSHA, claim/repair mainSHA, staleahead/behind, conflict count/type, overlap/gapmatrix, rejected approaches/reasons, tests, CI IDs, runtimefail/recovery, Owner intervention, completion basis, meaningful files/lines, episodedigest andNO_VALUE negative. Existing locations:

```text
Digital-City/mission-book/reports/MB-xxx/
Utopia/.runtime/evidence/mission-book/...
Utopia/data-records/evolution/inbox/mission-book/...
Utopia/evidence/raw/mission-book/...      # bounded/non-sensitive only
Utopia/data-records/evolution/episodes/... # actual accepted implementation only
```

City reports; Utopia local runtime evidence/inbox; bounded nonsensitive raw; episodes only actualacceptedimplementation.

# 6. Overall acceptance

Only legal terminal:

```text
MB-007 repair_status = COMPLETE
AND
MB-008 repair_status = COMPLETE
AND
MB-003 repair_status = COMPLETE
```

All007/008/003 repairs COMPLETE.008/003 may derive from:

```text
verified implementation + episode + merge
OR
SKIPPED_NOT_REQUIRED with evidence-backed NO_VALUE
```

Verifiedimplementation+episode+merge or evidence-backed NO_VALUE skip. Stillvaluable003 lacking actualprovider must remainBLOCKED. Only after7→8→3 closes does dispatcher returnMB010→011→012 assessment-first.

语言配对 / Language pair: [中文原文](../ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md) · [English](./ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md)
