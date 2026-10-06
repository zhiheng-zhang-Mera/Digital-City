# Assessment Report — MB-XXX

[权威模板 / Authoritative template](../ASSESSMENT_REPORT_TEMPLATE.md)

完整阅读译文，非新评估。Complete reading translation, not a new assessment.

```text
MISSION = MB-XXX
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST =
CLAIM_COMMIT =
DONOR_BASELINE =
UTOPIA_MAIN_BASELINE =
ASSESSMENT_BRANCH =
ASSESSMENT_HEAD =
ASSESSMENT_RESULT = FULL_MIGRATION | PARTIAL_MIGRATION | NO_VALUE
```

## Planned donor capabilities

- List all capability IDs and their meanings from the Mission file.

## Claim-time Utopia inventory

- Must be based on `UTOPIA_MAIN_BASELINE`.
- Record semantically equivalent implementations even when paths/names differ.
- Record relevant manifest / registry / test / runtime consumers.

## Capability comparison matrix

| ID | Donor capability | Donor evidence | Utopia equivalent/current behavior | Coverage | Gap | Decision | Reason code | Evidence |
|---|---|---|---|---|---|---|---|---|
| | | | | NONE/PARTIAL/EQUIVALENT/SUPERIOR | | MIGRATE/PARTIAL/ABANDON | | |

## Verdict

### FULL_MIGRATION

- Why the whole still has independent value:

### PARTIAL_MIGRATION

- Capabilities permitted to migrate:
- Explicitly abandoned capabilities and reasons:

### NO_VALUE

For NO_VALUE, write the following exact Chinese statement:

> **判断无价值，任务保留，未迁移**

Its English meaning is: **judged to have no value; task retained; not migrated**. Explain why not copying the donor is more correct than migration.

## Paper / research material

Record only real measurable data:

- Planned capability count:
- Equivalent already present:
- Utopia superior:
- Concrete gaps:
- Selected full/partial migration:
- Abandoned:
- Rejection reason-code counts:
- Source/target anchors inspected:
- Parity/runtime checks PASS/FAIL:
- Assessment start/end timestamps:
- Implementation churn / tests / CI (fill only after actual migration):
- Negative-result observations:

## Utopia material pointers

- Raw local: `.runtime/evidence/mission-book/MB-XXX/<run-id>/assessment/`
- Evolution inbox: `data-records/evolution/inbox/mission-book/MB-XXX/events.jsonl`
- Published bounded evidence: `evidence/raw/mission-book/MB-XXX/assessment/`
- Assessment branch immutable HEAD:

> Do not generate a fake verified episode for NO_VALUE; retain the branch, this report and evidence pointers.
