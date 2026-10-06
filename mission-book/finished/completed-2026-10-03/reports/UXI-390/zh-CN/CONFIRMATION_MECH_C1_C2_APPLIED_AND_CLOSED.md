# 确认：Mech在6a82e35实屏验证C-1/C-2已应用关闭

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../CONFIRMATION_MECH_C1_C2_APPLIED_AND_CLOSED.md)

## 在finding实际层面确认

finding是同语义两surface不同，所以源码正确不足，须像早先诚实affordance一样看pixels。360dp、6a82e35 APK、设备读hash F0E1CDDD…，panel现TECHNICAL DETAIL原SCHEDULING DETAIL、Choose another service · nothing available to switch to原bare label。旧文字不在，22-token sweep净，PASS4/4。原metadata reviewed完整6a82e35a2c5c40db426f815056bac6fda4c6806d、REVIEW_COMPLETE PASS（先前required repairs现done），只保历史。

## 读diff而非commit message核作者做法

C-2组合label/reason且用Web同anySelectable，未Android发明新规则重造分歧。C-1照Web language pack逐字title。新增跨surface guard期望从Web语言包读取，Web变Android未变会fail。

## 通过mutation验证guard能失败

恢复旧title、去reason组合、改anySelectable规则、换一个reason词均guard fail，文件restore git clean。title反例还证明精准而非全局substring禁；作者记初版错抓自己的解释comment，符合天真check预期假阳性。

## 新head重跑

三个UXI-390 guard加UXI-301 contract 11/11；Web E2E10/10，fold PRESENT/COLLAPSED且UIchoice真达backend；root1019、1017pass、2fail，较前恰多2新guard，fail同已有document-reader pair。故修不回归，增长有解释。

## 未解决项

Android仍无strings.xml/getString(R.string...)，literal不可翻译，parity依guard非shared resources。是frozen baseline架构决定非UXI-390修。作者自发写code comment，归因和评审一致、落正确处。

## 证据

mission-book/reports/UXI-390/mech-review/android-repair-confirmed.json、android-repair-confirmed-360dp.png；diff6a82e35、guard tests/uxi390-cross-surface-wording.test.mjs。原英文机测措辞块逐字保留，中文说明不替换产品字符串。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Mech (Review host)   REVIEWED HEAD NOW = 6a82e35a2c5c40db426f815056bac6fda4c6806d
VERDICT = REVIEW_COMPLETE - PASS   (was PASS WITH REQUIRED REPAIRS; the repairs are done and confirmed)
```

### 原证据块 2 / Original evidence block 2

```text
TECHNICAL DETAIL                                            (was SCHEDULING DETAIL)
Choose another service · nothing available to switch to      (was the bare label)
```

### 原证据块 3 / Original evidence block 3

```text
[GUARD FAILS - load-bearing] C-1: revert the disclosure title to the old wording
[GUARD FAILS - load-bearing] C-2: drop the reason composition
[GUARD FAILS - load-bearing] C-2: invent a different anySelectable rule
[GUARD FAILS - load-bearing] C-2: replace one reason word with another
file restored, git clean
```
