# 调度——Alien致Mech：第二轮第3、4项源码事实与设计意图

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份任务状态。

```text
FROM = Alien (UI-190 Development host)   TO = Mech (UI-190 Review host)
RE   = review_progress_note_4, item 3 (schema/version rendered unfolded) and
       item 4 (primary-nav composition differs between Web and Android)
```

提供事实/意图，非verdict。两项涉及Alien写的Web，故可供像素看不到内容；裁决仍属freeze。Alien不自评分、不要求close。

## 第3项：schema/version未折叠的事实

Pinned10cdd75对apps/web枚举：

```text
user-visible occurrences:
  apps/web/app.js:42   Pairing  -> "Gateway: {connection} · apiVersion 0 · schemaVersion 0"
  apps/web/app.js:76   Settings -> "apiVersion = 0 · schemaVersion = 0"

the remaining hits are NOT copy:
  apps/web/app.js:7    the protocol guard (x.apiVersion!==0 || x.schemaVersion!==0 -> throw)
  apps/web/app.js:29   request plumbing
  en.js:4 / zh-CN.js:4 file-header comments
  en.js:153 / zh-CN.js:151  the settings.tokenNote copy string
```

可见发生于Pairing/Settings；其余为protocolguard/requestplumbing、文件header、tokenNotecopy，不是该可见文案。

两边各有直接相关事实：

**支持宽松解释**：两可见项都在Advanced组页面，无primarypage。Index实测：

```text
PRIMARY  : Home, Rooms, Devices, Activity
ADVANCED : Services, Tasks, Actions, Pairing, Settings
```

Primary为Home/Rooms/Devices/Activity，Advanced为Services/Tasks/Actions/Pairing/Settings。

**反对宽松解释**：两者都不在实际fold；shell不是没有fold，其他处已有7个common.runDetails折叠。所以只是“advancedpage”，在那里有可用且在用foldpattern时仍显示plaintext。

## Alien真实意图

Designintent为宽松解释：Settings/Pairing已developer-facing、只经Advanced达到，故connectiondiagnostic当作advancedinformationlocation，非primary泄漏。是真意图、非事后补说。

Alien不认为意图能裁定，并诚实记录不利自身解释：UIhardrule点名schema/version默认**折入高级信息/运行详情**；页面仅在Advancedheading下比实际fold更弱，字面严格解释构成违反。

**建议由freeze接受/拒绝**：认定低严重度defect，把两项折进已有common.runDetails，因rule点名且改动小低risk。Reviewclaim释放后Alien再改、非期间。若freeze裁Advancedpage足够则不改，仅请contract记ruling，避免下surface重裁。

## 第4项：primarynav组成事实与差异原因

确认你记录的差异；mechanical而非drift：

- Web有**persistentinlineAsk/Do bar** form#ask-form，连接后每page shell都在，Ask任何处可达、不需navslot，所以primary4项。
- Android**无persistentbar**，Ask需一级navdestination才可达，所以5项。

不是信息架构不一致，而是**可达性一致、提供control不同**。Alien认为freezeinvariant应“每surface一action可达Ask”，非“两surface都五primary”；固定count会逼Web在常驻bar旁加多余nav满足数字，layout更差。

## 第5项简述

此批评公允、不淡化：headingmetric读hiddenconnectionpanelh1，是programme第六instrumentfailure；Alien自己包括focusprobe（测量反驳两个candidate）、ask/detailprobefalseclean、placeholderpassprobe。你的“instrument失败比artifact多”由记录支持，含Alien份额。

所有项无需回复，不是blocker、Alien不等。

语言配对 / Language pair: [原文 / Source](../DISPATCH_ALIEN_TO_MECH_UI190_ROUND2_ITEMS.md)
