> Reading translation / 阅读译本. Inactive historical rules; current canonical workbooks/rulings govern current construction. Original code blocks remain unchanged.

[Canonical historical source](../2026-09-29-construction-rules-v1.md)

# Mission Book — Pure Migration Queue: Historical v1 English Reading

This directory was Digital-City's construction control plane for confirmed City-owned pure migration work. It specifies what to migrate, its destination and completion criteria; it stores no runtime code.

## Principles for that round

```text
MODE = MIGRATION_ONLY
NEW_FEATURE_DEVELOPMENT = FORBIDDEN
IMPLEMENTATION_LANDING = Utopia
CITY_REPO = mission / claim / ownership / acceptance metadata
```

Migrate only capabilities actually existing in the donor. Allowed: extraction, splitting, interface adaptation, path relocation, consumer wiring, equivalent refactoring, tests, real UI/use validation and telemetry/error/evidence completion. Prohibited: new product capabilities, completing future modules described only in design documents, new acceptance-only UI, broader permissions or treating TODOs as migrated implementations.

## Why two stages

Each Mission has two independent completion states:

- **MIGRATION_COMPLETE:** first host completes the migration branch, tests, real consumption and Migration Report. It must not merge into target main.
- **VERIFICATION_COMPLETE:** a different second host reviews independently first, then consults Migration Report for secondary repair/verification. After all CI is green, the Verification Host merges into target main and submits Verification Report.

Only both true fully close the Mission.

## Claim algorithm

Before each work session, read latest task state for this directory on Digital-City main:

1. Filter `execution_enabled=true`.
2. Prefer incomplete, unclaimed Migration tasks with satisfied dependencies, ordered by ascending sequence.
3. If none is claimable, choose migration-complete, verification-incomplete, unclaimed Verification tasks where this host is not Migration Host, again ascending sequence.
4. Skip any task whose claimed stage remains incomplete.
5. Before claiming, update the corresponding Mission Claim and commit to Digital-City main. Write conflict means claim failure; reread state and choose again.
6. Only two execution hosts participate per Mission, each once: Migration Host and Verification Host. One host cannot claim both roles. Hosted CI runners are not execution hosts.

### Claim anomalies

Automatic workers cannot clear others' Claims. If no target implementation commit/report exists after claim, Owner may explicitly reset it. If substantive work exists but claimant cannot finish, mark `BLOCKED_OWNER_DECISION`. Do not quietly introduce a third host merely to continue.

## Branches and merges

- Migration Host: target implementation main → new `mission/<MISSION_ID>-<slug>` branch → migrate → push → no merge.
- Verification Host: claim the same task → independently inspect donor/diff/code/tests/runtime before reading Migration Report → record initial findings → read report → repair/verify on the same branch → all required CI green → merge main.
- Digital-City Claim/status updates are task metadata and may directly update City main; this is not implementation code entering main.

## Reports

All quick Mission construction reports are stored in Digital-City:

```text
mission-book/reports/MB-xxx/
├─ MIGRATION_REPORT.md
└─ VERIFICATION_REPORT.md
```

Use structured bilingual/field-based writing within one Markdown file, so Hns need not open two files for quick access to the same facts. City does not duplicate raw runtime evidence; retain pointers, summaries and final SHAs only. This is the historical reporting rule, preserved without reactivating it.

Migration Report explicitly records the landing boundary for the verifier's post-independent-review comparison: donor/source SHA, source-to-target paths, preserved/unmigrated behavior, interfaces, actual UI/consumer paths, tests, logs/errors, faults/recovery, evidence locations, known limitations and branch/CI state.

## Mission scope at that time

- **Enabled MB-001..009:** Boss/Hns core splitting, Engineering, Host Health/Restart, Research, Computer Use and Theme ownership relocation.
- **Forbidden MB-010..012:** optional Node Fabric extraction, Customs and Runtime Compliance; enter the queue only after Owner explicitly changes execution_enabled.

### Items without migration Missions

- Already migrated ACTIVE/PROMOTED Skill Intake, Evidence Engine, Knowledge Core, Ingestion Core and Document Readers.
- Independent projects remain in their normal repositories: Digital-Me, Quant-ultra, Parama-Health, My_VR_Glove and Auto-Game-Bot. City placement does not require physical relocation.
- Qualification Control Plane is already a correct independent City building/source; do not fabricate relocation.
- Design-only/unimplemented future capabilities stay outside this round: General-Logic-Engine implementation, Drug Simulator runtime, unimplemented Auto-Game-Bot perception/autonomy and Parama modules.

## Binding execution conditions — mandatory for every historical Mission

1. **Pure migration:** `MODE=MIGRATION_ONLY`. Only move, split, adapt, wire, equivalently refactor, test and evidence existing donor behavior. No product capability, policy or semantics absent from the donor.
2. **Two independent completion states:** maintain MIGRATION_COMPLETE and VERIFICATION_COMPLETE separately; the former does not authorize main entry.
3. **Report to Digital-City main before claiming:** record host identifier, role and time in the Claim section and commit to City. On write conflict, reread latest state and reselect.
4. **Skip claimed incomplete stages:** other hosts must not preempt the task.
5. **Exactly two hosts per Mission:** one Migration, one Verification. Once a host appears in any Claim for that Mission, it cannot claim any role again. Hosted CI runners do not count as participating hosts.
6. **Selection order:** first enabled, unmigrated, unclaimed, dependency-satisfied Missions in ascending SEQUENCE; only with none claimable, select migrated-but-unverified, unclaimed Missions in the same order.
7. **Migration branch:** create `mission/<MISSION_ID>-<slug>` from latest target main. Migration cannot merge into target main; City Claim/status metadata is exempt.
8. **Migration Report:** submit `Digital-City/mission-book/reports/<MISSION_ID>/MIGRATION_REPORT.md`, recording donor SHA, source-to-target paths, retained behavior, explicitly unmigrated content, interfaces/contracts, existing UI/actual consumption, tests, data/error summaries, limitations, Utopia evidence pointers and branch HEAD/CI. City stores no bulky raw logs.
9. **Independent Verification before report reading:** review donor, target code, diff, tests and runtime; record independent findings before consulting Migration Report as a second reference.
10. **Repair the same migration branch:** necessary secondary repairs, additional tests, real UI/use validation, failure/recovery and evidence completion are allowed, without expanding Mission functionality.
11. **Merge gate:** all target required CI and Mission checks must be green before main merge. No skipped/deleted tests, relaxed acceptance or altered target semantics to obtain green.
12. **Final report:** submit `Digital-City/mission-book/reports/<MISSION_ID>/VERIFICATION_REPORT.md`, documenting independent review, differences after Migration Report comparison, repairs, real-device/second-host results, failures/recovery, CI runs, final branch SHA, merge SHA and Utopia evidence pointers.
13. **Abnormal claim recovery:** automatic constructors cannot clear Claims. Owner may explicitly reset if no implementation commit/report exists. With substantive work and an unable-to-finish host, mark BLOCKED_OWNER_DECISION; no covert third-host relay. Owner decides whether a superseding Mission is needed.
14. **No new acceptance-only UI:** real consumption must reuse existing Utopia Web/Android/Services/Tasks/Activity surfaces or donor UI behavior. If existing product surfaces cannot consume it, record a boundary/blocker; do not disguise new product features as migration.
15. **Mandatory Utopia process dogfooding:** after claim, before substantive construction and at each meaningful change/test/runtime failure/recovery/Owner intervention/verifier finding/repair/CI/completion, append structured events on the implementation branch with `pnpm mission:event -- ...`. Bulky field evidence goes to `.runtime/evidence/mission-book/<MISSION_ID>/<run-id>/`. Selectively publish only bounded non-sensitive evidence genuinely needed across hosts to `evidence/raw/mission-book/<MISSION_ID>/`.
16. **Episode closeout and double CI:** Verification first obtains green implementation required CI and records CI_RESULT=PASS, VERIFICATION_COMPLETE=PASS. Then run `pnpm mission:finalize -- ...` to generate the verified episode and remove current-tree inbox. After committing pure-data closeout, run all required CI again on final branch HEAD; all green is required before merge. City Verification Report records implementation CI, final branch CI, episode path/digest and final merge SHA.

## Utopia evolution bootstrap

Accepted bootstrap: `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`, PR #9, CI `36562928621` green.

Mission construction uses Utopia's built-in minimal experience-stream tools:

```text
contracts/evolution/mission-event-v1.schema.json
contracts/evolution/mission-episode-v1.schema.json
scripts/record-mission-event.mjs
scripts/finalize-mission-episode.mjs
```

Command entries:

```text
pnpm mission:event -- ...
pnpm mission:finalize -- ...
```

Detailed process-data boundaries: [PROCESS_DATA_POLICY.md](../../../../PROCESS_DATA_POLICY.md).
