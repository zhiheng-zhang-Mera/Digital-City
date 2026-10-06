[English source / 英文原稿](../CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md)

> 历史阅读译本：数字、结论及未修复状态绑定原报告时点，不代表2026-10-06的当前盘点。 / Historical reading view: counts, conclusions and unrepaired status belong to the original report, not the current inventory.

# 控制面完整性扫描 — 严格解析每份工作簿frontmatter

```text
PERFORMED BY = Mech, before the RESCHEDULING_BASELINE_FROZEN freeze
METHOD       = PyYAML with a STRICT mapping constructor that REJECTS duplicate keys
               (mission-book/reports/validate_frontmatter.py)
SCOPE        = all 266 markdown files under mission-book/
RESULT       = the entire ACTIVE construction surface is clean; all 9 problems are in the archive
```


## 为什么做这项检查

刚修复我在UI-000和UI-101引入的frontmatter重复键后，应继续核查是否还有结构损坏。用`^key:`正则扫描会漏掉异常空格写法或子映射内的重复键，所以采用真正的解析器，并用拒绝重复键的constructor。它还覆盖我在本项目亲自遇到的其他错误：未闭合引号值、被吞掉的字段头和UTF-8 BOM。

## 结果

```text
scanned 266 markdown files
  valid frontmatter : 63
  no frontmatter    : 194
  PROBLEMS          :  9        <- all nine under finished/
```


活动区零问题。ui-civilization/、rescheduling-vnext/、ui-integration/的每份工作簿，以及reports/的每份报告，均可解析为有效YAML且无重复键。这是冻结所需的实质结果：即将冻结的控制面结构规范。

## 归档九项问题：报告而未修复

五份不是有效UTF-8，约位置27有无效continuation byte：

```text
finished/completed-2026-10-01/reports/BA-005/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/EM-002/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/EM-005/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/GAI-003/CORRECTION_REPORT.md
finished/completed-2026-10-01/reports/RF-005/CORRECTION_REPORT.md
```


四份在第12行、第95列有YAML错误：值内未加引号的“冒号＋空格”被YAML当作嵌套映射：

```text
finished/replant/MB-002-capability-fabric.md
finished/replant/MB-004-project-foreman.md
finished/replant/MB-005-host-health.md
finished/replant/MB-009-theme-relocation.md
      ... 243e166b112319b1663eebb3d763fcfc: gateway-web success, android s ...
```


我有意报告而不修复。§0把finished/限定为追溯用途，用于回看旧规则与仪表盘，而非持续维护；§9把施工限定为工作簿范围、Owner裁定、范围内真实缺陷或现有契约最小修复。重写归档记录不属于其中任何一种。它与UI-000／101修复不同：没有活动领取真值受到影响，finished/不参与领取、复检或冻结。修改理由在于历史追溯保真，应交由Owner决定，而不是单方重写历史文件。

实际影响有边界：严格解析器无法读取这些损坏字段，因此不能依赖九份文件的frontmatter；周边说明完整，且没有当前任务依赖它们。

## 与先前发现一致

UI-000／101的重复键由我引入，现已修复。这轮扫描本应在修复之前执行，结果确认问题局限于我改动的两份文件，并非系统性问题。如实记录先后顺序：检查又一次在损坏之后发生，与BOM和CRLF锚点问题相同。

## Validator已提交，可重复执行

对mission-book/运行`mission-book/reports/validate_frontmatter.py`，只要有frontmatter结构错误就以非零退出；因此它可成为今后冻结前的门禁，不再只是一次性检查。这个工具本能在UI-000／101重复键提交前发现它们。
