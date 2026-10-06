# Mission Reports / 施工报告

本目录只保存 **快速施工结论**，供 Hns、验证主机和 Owner 在领取下一项工作时快速读取。

## 当前布局 — BA/RF/GAI/EM 组件阶段（2026-10-01，41/41 两阶段完成）

```text
reports/
└─ <TASK-ID>/                     # BA-001..BA-009 · RF-001..RF-010 · GAI-001..GAI-009 · EM-001..EM-013
   ├─ DEVELOPMENT_REPORT.md       # Development 阶段，由 development_host 撰写
   └─ CORRECTION_REPORT.md        # Correction 阶段，由另一台物理主机撰写（全部 41 项均已存在）
```

`CORRECTION_REPORT.md` 的必备内容：任务/角色/claim 提交与时间、组件基线、Development head 与 CI、
correction 分支/head 与托管 CI、独立对抗式审查方法与探针、逐条修复机制表（含缺陷类别）、本机测试摘要
（修正后 vs Development head 的对照基线）、**边界**（作者编码、故意不修的原因）、审查完整性说明、以及
公开披露（含本机自身错误）。工作簿 frontmatter 是动态事实源；本目录只保存结论，完整日志、截图与 CI
artifact 留在实现仓库的 evidence 目录。

以下 `MB-xxx` 格式属于较早的 assessment/migration/verification 阶段（`finished/replant/` 时期），作为历史
格式保留，不再用于 BA/RF/GAI/EM 组件任务。

## 目录

```text
reports/
└─ MB-xxx/
   ├─ ASSESSMENT_REPORT.md    # assessment-first Mission 必填
   ├─ MIGRATION_REPORT.md     # 仅实际迁移时
   └─ VERIFICATION_REPORT.md  # 仅实际迁移时
```

不要把完整终端日志、截图集、CI artifact、raw event stream 或大体量错误 dump 复制进 Digital-City。

报告只保存：

- Mission / Host / role / timestamps；
- Assessment 时的 donor/Utopia 双 baseline SHA；
- capability-by-capability 对照、覆盖判定、迁移/放弃决策与 reason code；
- NO_VALUE negative result 与“判断无价值，任务保留，未迁移”结论（适用时）；
- donor SHA 与实现 branch/head；
- source → target 落地边界；
- 已迁行为与明确未迁行为；
- 独立审查发现；
- 二次维修摘要；
- 测试与 CI 摘要（区分 implementation CI 与 finalize 后 final branch CI）；
- 真机/第二机结果；
- failure/recovery 摘要；
- Utopia 中 raw evidence / evolution episode 的路径或 digest；
- 最终 merge SHA；
- PASS / FAIL / BLOCKED 判定。

## ASSESSMENT_REPORT.md 最小格式

```text
MISSION
ASSESSMENT_HOST
CLAIM_COMMIT
DONOR_BASELINE
UTOPIA_MAIN_BASELINE
ASSESSMENT_BRANCH
ASSESSMENT_HEAD

PLANNED_CAPABILITIES
UTOPIA_CURRENT_CAPABILITIES
CAPABILITY_COMPARISON_MATRIX
ABANDONED_CAPABILITIES_AND_REASONS
SELECTED_GAP_CLOSURES

PAPER_METRICS
UTOPIA_EVIDENCE_POINTERS
UTOPIA_EVOLUTION_INBOX_POINTERS

ASSESSMENT_RESULT = FULL_MIGRATION|PARTIAL_MIGRATION|NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

## MIGRATION_REPORT.md 最小格式

```text
MISSION
MIGRATION_HOST
DONOR_BASELINE
IMPLEMENTATION_BRANCH
HEAD_SHA

LANDING_BOUNDARY
PRESERVED_BEHAVIOR
EXPLICITLY_NOT_MIGRATED

REAL_CONSUMPTION
TEST_SUMMARY
FAILURE_REPAIR_SUMMARY
UTOPIA_EVIDENCE_POINTERS
UTOPIA_EVOLUTION_INBOX_POINTERS

MIGRATION_COMPLETE = true|false
```

## VERIFICATION_REPORT.md 最小格式

```text
MISSION
VERIFICATION_HOST
INDEPENDENT_REVIEW_FINDINGS
MIGRATION_REPORT_RECONCILIATION
SECONDARY_REPAIRS

REAL_USAGE_VERIFICATION
FAULT_RECOVERY_VERIFICATION
CI_FINAL
UTOPIA_EVIDENCE_POINTERS
UTOPIA_EVOLUTION_EPISODE_POINTER
UTOPIA_EVOLUTION_EPISODE_DIGEST
IMPLEMENTATION_CI
FINAL_BRANCH_CI

FINAL_BRANCH_SHA
MERGED_MAIN_SHA

VERIFICATION_COMPLETE = true|false
```

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **202**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| BA-001 | 4 | [打开 / Open](BA-001/README.md) |
| BA-002 | 4 | [打开 / Open](BA-002/README.md) |
| BA-003 | 3 | [打开 / Open](BA-003/README.md) |
| BA-004 | 4 | [打开 / Open](BA-004/README.md) |
| BA-005 | 5 | [打开 / Open](BA-005/README.md) |
| BA-006 | 4 | [打开 / Open](BA-006/README.md) |
| BA-007 | 4 | [打开 / Open](BA-007/README.md) |
| BA-008 | 3 | [打开 / Open](BA-008/README.md) |
| BA-009 | 4 | [打开 / Open](BA-009/README.md) |
| EM-001 | 3 | [打开 / Open](EM-001/README.md) |
| EM-002 | 4 | [打开 / Open](EM-002/README.md) |
| EM-003 | 4 | [打开 / Open](EM-003/README.md) |
| EM-004 | 4 | [打开 / Open](EM-004/README.md) |
| EM-005 | 5 | [打开 / Open](EM-005/README.md) |
| EM-006 | 5 | [打开 / Open](EM-006/README.md) |
| EM-007 | 4 | [打开 / Open](EM-007/README.md) |
| EM-008 | 3 | [打开 / Open](EM-008/README.md) |
| EM-009 | 3 | [打开 / Open](EM-009/README.md) |
| EM-010 | 3 | [打开 / Open](EM-010/README.md) |
| EM-011 | 3 | [打开 / Open](EM-011/README.md) |
| EM-012 | 3 | [打开 / Open](EM-012/README.md) |
| EM-013 | 3 | [打开 / Open](EM-013/README.md) |
| GAI-001 | 3 | [打开 / Open](GAI-001/README.md) |
| GAI-002 | 4 | [打开 / Open](GAI-002/README.md) |
| GAI-003 | 5 | [打开 / Open](GAI-003/README.md) |
| GAI-004 | 4 | [打开 / Open](GAI-004/README.md) |
| GAI-005 | 5 | [打开 / Open](GAI-005/README.md) |
| GAI-006 | 4 | [打开 / Open](GAI-006/README.md) |
| GAI-007 | 4 | [打开 / Open](GAI-007/README.md) |
| GAI-008 | 4 | [打开 / Open](GAI-008/README.md) |
| GAI-009 | 3 | [打开 / Open](GAI-009/README.md) |
| MB-001 | 3 | [打开 / Open](MB-001/README.md) |
| MB-002 | 3 | [打开 / Open](MB-002/README.md) |
| MB-003 | 3 | [打开 / Open](MB-003/README.md) |
| MB-004 | 3 | [打开 / Open](MB-004/README.md) |
| MB-005 | 3 | [打开 / Open](MB-005/README.md) |
| MB-006 | 3 | [打开 / Open](MB-006/README.md) |
| MB-007 | 3 | [打开 / Open](MB-007/README.md) |
| MB-008 | 3 | [打开 / Open](MB-008/README.md) |
| MB-009 | 3 | [打开 / Open](MB-009/README.md) |
| MB-010 | 1 | [打开 / Open](MB-010/ASSESSMENT_REPORT.md) |
| MB-011 | 1 | [打开 / Open](MB-011/ASSESSMENT_REPORT.md) |
| MB-012 | 1 | [打开 / Open](MB-012/ASSESSMENT_REPORT.md) |
| RF-001 | 3 | [打开 / Open](RF-001/README.md) |
| RF-002 | 3 | [打开 / Open](RF-002/README.md) |
| RF-003 | 4 | [打开 / Open](RF-003/README.md) |
| RF-004 | 5 | [打开 / Open](RF-004/README.md) |
| RF-005 | 4 | [打开 / Open](RF-005/README.md) |
| RF-006 | 4 | [打开 / Open](RF-006/README.md) |
| RF-007 | 4 | [打开 / Open](RF-007/README.md) |
| RF-008 | 3 | [打开 / Open](RF-008/README.md) |
| RF-009 | 3 | [打开 / Open](RF-009/README.md) |
| RF-010 | 3 | [打开 / Open](RF-010/README.md) |
| UPT-PRE-ASSISTANT | 4 | [打开 / Open](UPT-PRE-ASSISTANT/README.md) |
| en | 3 | [打开 / Open](en/ASSESSMENT_REPORT_TEMPLATE.md) |
| zh-CN | 5 | [打开 / Open](zh-CN/ASSESSMENT_REPORT_TEMPLATE.md) |

### 本目录说明 / Local documents

- [ASSESSMENT_REPORT_TEMPLATE.md](ASSESSMENT_REPORT_TEMPLATE.md)
- [DEVELOPMENT_CI_RECOVERY_2026-10-01.md](DEVELOPMENT_CI_RECOVERY_2026-10-01.md)
- [LEGACY-BRANCH-AUDIT-2026-09-30.md](LEGACY-BRANCH-AUDIT-2026-09-30.md)
- [MIGRATION_REPORT_TEMPLATE.md](MIGRATION_REPORT_TEMPLATE.md)
- [VERIFICATION_REPORT_TEMPLATE.md](VERIFICATION_REPORT_TEMPLATE.md)

<!-- DOCUMENT_NAVIGATION:END -->
