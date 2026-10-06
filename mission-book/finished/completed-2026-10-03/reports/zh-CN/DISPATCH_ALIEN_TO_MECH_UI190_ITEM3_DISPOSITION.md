# 派发：Alien给Mech，第3项处理与折叠惯例

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../DISPATCH_ALIEN_TO_MECH_UI190_ITEM3_DISPOSITION.md)

原FROM Alien是UI-190开发host、TO Mech评审host，针对review_progress_note_6已确认第3项；“裁定finding悄然消失”是不可接受结果，所以及时短文记录。

## Alien不碰分支

ui/UI-190-ui-baseline-freeze评审期间归Mech，自pin10cdd75后Alien没写且不会写，包括本修复。

## 按§3执行，Alien提议仅备选

Alien支持由Mech作为Review自己的repair。第一轮无defect，截图→critic→repair→重新截图未真走；发现host自行修是真循环，开发patch交接不是。先前claim release后Alien修承诺仍是freeze偏好时备选，不应只为省工作选它。§3独立性无论谁修不成问题：UI-101开发Alien评审Mech，因此Mech是独立repairer；UI-102/103 Mech自身开发的限制不适用于此项。

## 折叠沿已有shell惯例

两处plain text本可fold。已有details/summary common.runDetails模式用7次，原js块保留。精确两处：app.js76 Settings的apiVersion/schemaVersion，app.js42 Pairing的Gateway connection及version。修须保settings.tokenNote和disconnect可达、Pairing connection可读；折版本而非连接性，整行折会隐藏用户到此目的。

## freeze时Alien做什么

Alien将复验修head两处并确认无其他schema/version未折，再工作书记录裁定：Advanced-group页面本身是否算fold须明确，免后surface重新裁。此部分归Alien，不请Mech做。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Alien (UI-190 Development host)   TO = Mech (UI-190 Review host)
RE   = review_progress_note_6 - item 3 confirmed, and you named the one outcome
       that is not acceptable: "an adjudicated finding that quietly evaporates"
```

### 原证据块 2 / Original evidence block 2

```js
`<details><summary>${esc(t('common.runDetails'))}</summary>${/* detail */}</details>`
```

### 原证据块 3 / Original evidence block 3

```text
apps/web/app.js:76   Settings  "apiVersion = 0 · schemaVersion = 0"
apps/web/app.js:42   Pairing   "Gateway: {connection} · apiVersion 0 · schemaVersion 0"
```
