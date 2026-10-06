# Mission Book tooling / 任务书工具

[Full English / 完整英文](./README.md) · [Mission Book / 任务总览](../README.md)

五个无需第三方依赖的小型 Python 工具。工作书 YAML frontmatter 始终是事实来源。四个任务状态工具只修改 `mission-book/`；文档导航工具另生成 `docs/` 的导航和总量清单，以及系列快速面板，不改变任务授权或验收。

```text
sync_dependency_state.py           将已接受的精确依赖head传播到未领取工作书；--check 在漂移时失败
sync_mission_progress.py           重新生成主看板README.md与MISSION_PROGRESS.json；--check 在漂移时失败
sync_utopia_status.py              刷新联动记录中的Utopia实时状态区块
check_record_consistency.py        检查三处记录漂移；发现ERROR时退出码为1
sync_documentation_navigation.py   生成双语导航、系列快速面板和docs/DOCUMENTATION_INVENTORY.json；--check在漂移时失败
test_check_record_consistency.py   检查器测试，覆盖必须捕获的漂移
```

从仓库根目录（`dc/`）运行：

```bash
python mission-book/tools/sync_dependency_state.py --check
python mission-book/tools/sync_mission_progress.py
python mission-book/tools/check_record_consistency.py
python mission-book/tools/test_check_record_consistency.py
python mission-book/tools/sync_documentation_navigation.py
python mission-book/tools/sync_documentation_navigation.py --check
```

## 自动运行位置

文档导航是独立维护命令，目前不属于工作流步骤。语言存在标签仅帮助检查，不证明翻译完整。保留原始编码字节和历史 `NOT_RUN`、失败结果；配对阅读副本不提供新的授权。

`.github/workflows/sync-mission-progress.yml` 在 `mission-book/` 任意修改后运行：

```text
1  检查器自身测试                   python mission-book/tools/test_check_record_consistency.py
2  记录一致性门槛                   python mission-book/tools/check_record_consistency.py（ERROR时退出1）
3  依赖传播（PR：--check；main：reconcile）
4  进度重新生成；main上提交同步结果
```

步骤1、2最先运行且只读取记录；记录自相矛盾会在重新生成或提交之前令运行失败。不得让重新生成掩盖需要人工阅读的finding。`main` 自动提交只添加 `mission-book`；仓库根目录忽略 `__pycache__/`，测试产生的字节码不会进入提交。

## 一致性检查器的用途

Mission Book在三处记录同一状态：主看板、programme看板，以及工作书自己的frontmatter和 `reports/<ID>/`。施工结果的可信度取决于三处是否一致。在此工具之前没有工具检查一致性；促成它的两个缺陷都于2026-10-06人工发现：

- 已领取且开发完成的工作书仍写 `status: READY`；领取修改了归属字段却没改状态词。
- CI字段声称对应head的push和pull-request运行均为绿，但逐run读取Actions API发现push运行失败。

检查器此后能机械捕获第一类缺陷。它输出类型化代码，不自动修复，也不访问网络。

## 范围规则与原因

大量误报会让检查器被忽略，因此以下三个范围规则是有意设计：

1. **两代工作书。** 声明 `baseline_policy` / `baseline_anchor_mode` 的记录属于当前programme schema并接受完整检查。旧记录（`mission_id`、`project_baseline_sha`、`development_status`，主要在 `finished/completed-2026-10-01/`）按自己的语义检查，不额外改动。
2. **只按记录声明的字段检查。** 字段出现之前创建的记录不受该字段约束；只有声明 `terminal_marker` 的工作书，缺少该值才算错误。
3. **历史为warning，漂移为error。** `finished/` 下或状态词表明终态的记录，短SHA/不存在的 `reports/<ID>/` 目录属于历史问题；在途记录的同类finding是error，返回非零退出码。

工作书可声明 `record_exceptions: [CODE, ...]` 豁免某条规则；finding仍输出为 `EXCUSED`，不会隐藏。**Owner豁免收口**依赖明确authority：记录 `review_waiver_authority` 或任意 `owner_ruling*` 字段的工作书可在没有 `review_host` 时设置 `review_complete: true`；检查器输出 `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` 并指明字段，使读者始终知道未进行独立复检。

## 工具现在规范化处理的历史坑

- **加引号的boolean仍为boolean。** `CEX-790` 和 `WBC-604` 曾写 `review_complete: "true"`。解析器返回字符串，使下游所有 `is True` 检查（包括 `sync_dependency_state.py` 的接受传播）将已接受任务视为未复检。三个解析器现在先去引号再分类，检查器仍报 `QUOTED_BOOLEAN_FIELD`，使源记录写法也得到修正。
- **非ASCII文件和PowerShell 5.1。** 本主机Windows PowerShell 5.1使用非UTF-8控制台代码页，MON-902合并时 `Get-Content` / `Set-Content` 往返损坏中文locale pack。Mission Book及实现文本应由UTF-8感知工具编辑，或整文件写入。
- **字符串带引号正常。** `development_ci` 是句子；检查器只报告boolean/null拼写问题。

## 检查器不能做的事

它不能判断CI/Review声明是否**真实**，只能检查记录内部一致性及head是否具有精确identity格式。确认某run确实在该head成功，需要逐run重新读取Actions API，这是Reviewer的职责，也是上述过度声明CI的发现方式。完全一致的记录仍可能错误；Reviewer独立重新测量负责发现这种错误。
