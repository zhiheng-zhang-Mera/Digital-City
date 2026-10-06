# Assessment Report — MB-XXX

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

## 计划能力 / Planned donor capabilities

- 列出 Mission 文件中全部 capability ID 与语义。

## Utopia 当前能力 / Claim-time Utopia inventory

- 必须基于 `UTOPIA_MAIN_BASELINE`。
- 记录语义等价实现，即使路径/命名不同。
- 记录相关 manifest / registry / test / runtime consumer。

## Capability comparison matrix

| ID | Donor capability | Donor evidence | Utopia equivalent/current behavior | Coverage | Gap | Decision | Reason code | Evidence |
|---|---|---|---|---|---|---|---|---|
| | | | | NONE/PARTIAL/EQUIVALENT/SUPERIOR | | MIGRATE/PARTIAL/ABANDON | | |

## Verdict

### FULL_MIGRATION
- 为什么整体仍有独立价值：

### PARTIAL_MIGRATION
- 允许迁移的 capability：
- 明确放弃的 capability 与原因：

### NO_VALUE
若为 NO_VALUE，必须原样写：

> **判断无价值，任务保留，未迁移**

并说明为什么“不复制 donor”比迁移更正确。

## 论文 / 研究素材

只记录真实可测数据：

- planned capability count:
- equivalent already present:
- Utopia superior:
- concrete gaps:
- selected full/partial migration:
- abandoned:
- rejection reason-code counts:
- source/target anchors inspected:
- parity/runtime checks PASS/FAIL:
- assessment start/end timestamps:
- implementation churn / tests / CI（仅实际迁移后补）:
- negative-result observations:

## Utopia 素材指针

- Raw local: `.runtime/evidence/mission-book/MB-XXX/<run-id>/assessment/`
- Evolution inbox: `data-records/evolution/inbox/mission-book/MB-XXX/events.jsonl`
- Published bounded evidence: `evidence/raw/mission-book/MB-XXX/assessment/`
- Assessment branch immutable HEAD:

> NO_VALUE 时不生成假的 verified episode；保留 branch + 本报告 + evidence pointers。

## Language reading links / 语言阅读链接

[中文](./zh-CN/ASSESSMENT_REPORT_TEMPLATE.md) · [English](./en/ASSESSMENT_REPORT_TEMPLATE.md)
