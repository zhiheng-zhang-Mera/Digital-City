# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../REVIEW_FINDING_MECH_CROSS_SURFACE_COMPARISON.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# REVIEW FINDING — Mech：同scheduler state的Web/Android像素跨面比较

```text
FROM = Mech (Review host)   GATE ITEM = 5, "Web/Android/Rooms visually consistent"
METHOD = direct comparison of two captures of the SAME state, plus a source confirmation of each divergence
WEB    = Alien's step-5 capture 05-web-provider-state.png, 1440x900, sha256 e9d3f3420877...
ANDROID= my capture android-panel-devices-360dp.png, 360dp, sha256 91bf81aa0d7d...
```

记录释义：Mech reviewer，gate5三面视觉一致；直接比同状态两captures并source确认分歧。Web作者step5 provider1440x900、Android我的360dp，hash见原块。

两图都executor kill后建work，相同条件比较，非将不同state当相同。

## 先说明一致内容：gate5大部分

Header WHY THINGS ARE WAITING、state Running in a reduced state、body当前service慢是否换/部分依赖未知、provider不可用因不接新work一致；尤其 **诚实控件**，两面Cancel accent live、Choose another service grey。工作书关注语义跨平台存活。

## C-1本task归因：同disclosure两名称

```text
Web     apps/web/i18n/en.js:55      "scheduler.advanced.summary": "Technical detail"     -> "Technical detail"
Android SchedulerPanel.kt:167       TechnicalDetails(rows, title = "Scheduling detail")  -> "SCHEDULING DETAIL"
```

Web来自i18n Technical detail，Android **硬编码** Scheduling detail/SCHEDULING DETAIL。同disclosure异名，仅一个可翻译，违panel header“same words”规则，在 **UXI301/390我代码** 非继承。

## C-2本task归因：Web解释disabled choice，Android不解释

```text
Web     i18n/en.js:59   "scheduler.action.nothingToSwitchTo": "nothing available to switch to"
        -> renders  "Choose another service · nothing available to switch to"
Android SchedulerPresentation.kt has no equivalent string
        -> renders  "Choose another service"   (greyed, with no reason)
```

完整释义：Web Choose another service·nothing available to switch to；Android无等价string，仅grey Choose another service无reason。

数轮建立disabled须说明WHY pattern，Web做、Android没。Android上方provider row已有reason，故action自身copy分歧非信息丢失，但同语义不同render。

## C-3早先记录、现精炼：task id布局

Web1440px在state row右对齐Q-f987c542-122f-4f18-875b-9ffbf7bf4313可放，360dp同code折 **四行** 撞state。SchedulerPanel.kt86-88同Row无widthconstraint，纯宽度函数。**Layout属UXI301，rawid惯例属冻结baseline**，1a5bc0e自身tasks也render ids。

## C1/C2根因属baseline非本task

```text
apps/android has NO strings.xml and NO getString(R.string...) in its Kotlin   (grep: empty)
```

**Android靠硬编码Kotlin而非stringsresources本地化**，两面同words只靠人从i18n手抄literal，单边改即drift。这解释C1并预测C2和UtopiaComponents.kt243展开/收起，非三无关疏漏。Architecture属冻结UI190，修复是baseline决定非UXI390repair，但本task surfaces暴露漂移。

## 对gate5评分影响：留verdict而非本说明

三面一致 **大体满足**，states/copy/reasons/live-disabled一致，**两名称级分歧归本task** C1/C2、一narrow layout C3本task在baseline惯例上。MET与否由review verdict判断，本处有意不判。

无任何repair；三项都低成本，不触RS290contract。
