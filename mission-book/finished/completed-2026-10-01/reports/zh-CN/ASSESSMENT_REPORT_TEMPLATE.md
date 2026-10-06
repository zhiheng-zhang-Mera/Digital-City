# 评估报告 — MB-XXX

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

## 计划donor能力

- 列出Mission文件全部capability ID与语义。

## 领取时Utopia当前能力

- 必须基于UTOPIA_MAIN_BASELINE。
- 即使路径／命名不同，也记录语义等价实现。
- 记录相关manifest／registry／test／runtime consumer。

## 能力比较矩阵

| ID | donor能力 | donor证据 | Utopia等价／当前行为 | 覆盖 | 缺口 | 决策 | 原因码 | 证据 |
|---|---|---|---|---|---|---|---|---|
| | | | | NONE/PARTIAL/EQUIVALENT/SUPERIOR | | MIGRATE/PARTIAL/ABANDON | | |

## 判定

### FULL_MIGRATION

- 为什么整体仍有独立价值：

### PARTIAL_MIGRATION

- 允许迁移capability：
- 明确放弃capability与原因：

### NO_VALUE

若NO_VALUE，必须原样写：

> **判断无价值，任务保留，未迁移**

并说明为什么“不复制donor”比迁移更正确。

## 论文／研究素材

只记录真实可测数据：

- 计划能力数量：
- 已存在等价能力：
- Utopia更优能力：
- 具体缺口：
- 所选完整／部分迁移：
- 放弃项：
- 拒绝原因码计数：
- 已检查source／target锚点：
- parity／runtime检查PASS／FAIL：
- 评估开始／结束时间：
- 实现变更量／测试／CI（仅实际迁移后补）：
- 阴性结果观察：

## Utopia素材指针

- 本地raw：`.runtime/evidence/mission-book/MB-XXX/<run-id>/assessment/`
- 演化inbox：`data-records/evolution/inbox/mission-book/MB-XXX/events.jsonl`
- 已发布有界证据：`evidence/raw/mission-book/MB-XXX/assessment/`
- 评估分支不可变HEAD：

> NO_VALUE时不生成假verified episode；保留branch、本报告和evidence pointers。
