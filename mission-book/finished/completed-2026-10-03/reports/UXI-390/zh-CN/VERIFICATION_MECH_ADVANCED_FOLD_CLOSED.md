# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_ADVANCED_FOLD_CLOSED.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：40bd118 已关闭 Advanced-fold finding，修复强于我的提案

```text
FROM = Mech   SUBJECT = closure of FINDING_MECH_ADVANCED_FOLD_ABSENT_ON_WEB.md
BOUND TREE = 40bd11811c2170446e14335d10aa3ba1f66d31f7   (verified by git rev-parse, not by ref name)
STATUS = verification of a fix. NOT a review. No gate item scored by me.
```

记录释义：Mech验证FINDING_MECH_ADVANCED_FOLD_ABSENT_ON_WEB关闭；tree由git rev-parse确认非ref名，完整SHA见证据。是修复验证，非Review，不评分gate。

## 前后使用同一记录字段

Finding为我自身E2E断言在fold缺失时 **空洞通过**，最清晰证据是同字段前后值：

```text
at cd298c3   containsTechnicalFold: false   markup length  964   assertion "raw vocabulary absent" ok: true
at 40bd118   containsTechnicalFold: true    markup length 1349   10 of 10 assertions pass
```

false配ok:true是缺陷；true配通过suite是修复，记录条件与断言现一致。

## 修复比我所求更完整

我建议要求containsTechnicalFold===true或重命名断言停止声称覆盖fold。Alien两者都做，且增加我未要求的另一半。单空洞断言改为三个，正确分解“**可访问但默认折叠**”；这是两个性质，我只论证第一个：

```js
assert('the technical fold is PRESENT, not absent', html.includes('scheduler-technical'));
assert('the technical fold is COLLAPSED by default', /<details class="scheduler-technical"(?![^>]*\bopen\b)/.test(html));
assert('no bare raw scheduler token is rendered', !/>\s*(SELECTABLE|DEVICE_REFUSING)\s*</.test(html));
```

中间是我漏掉的：默认fold须存在且 **未打开**，negative lookahead固定open属性不存在。我的版本会接受永久展开，满足可访问却违反默认折叠。**Alien既关闭我发现的项，也关闭相邻漏项**，本任务第二次对侧修复更完整。

真实wiring而非表面修饰：app.js现传advanced:true，即schedulerPanel(schedulerFeed,{isOnline:connection==='ONLINE',advanced:true})，Devices页原生details可由用户访问。这是第三实例“正确component、无caller”通过call-site wiring关闭。

## 本运行确立与未确立的内容

- **确立**：40bd118的 **Web** Advanced项满足，覆盖断言现在能失败：fold缺失或展开都打破它。此前另外七断言仍通过，无回归。
- **未确立**：Android相关任何新结论；它一直通过无条件render TechnicalDetails正确承载此项。也非review verdict；review仍须自行发现问题。

原始证据同目录EVIDENCE_MECH_web-e2e_at_40bd118.json。与此前相同，**未** commit harness自身output path，因为它写tracked evidence/raw/mission-book/UXI-301/web-e2e.json，会覆盖UXI-301已review PASS记录，正是此前clobber风险。Branch未改，worktree丢弃。

## 三实例pattern持续统计

| # | 实例 | 状态 |
|---|---|---|
| 1 | Android未传onAction | **CLOSED**，8ab8225+cd298c3，mutation验证 |
| 2 | Web未传advanced | **CLOSED**，40bd118，本处重跑acceptance验证 |
| 3 | switch-declined无caller，accept无endpoint | **OPEN**，已提交，待Owner scope决定 |
