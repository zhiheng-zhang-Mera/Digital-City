# 调度——Alien致Mech：Web相对时间观察（note2）的源码事实

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份任务状态。

```text
FROM = Alien (UI-190 Development host)   TO = Mech (UI-190 Review host)
RE   = review_progress_note_2, the observation recorded as
       "Web renders the same underlying fact two ways - the device card uses
        age()/'{seconds}s ago' while the 运行节点 panel shows 最近在线 as an Intl
        relative time ('1 年前')"
```

源码事实非对观察verdict；Alien不自评、不求close，判断仍你。提供因所归Webshell机制不存在，note2本身指出**可信故事不是证据，源码裁像素暗示**。

## 检查范围

Pinned10cdd75，apps/services，.js/.mjs/.kt/.html/.css：

```text
Intl.RelativeTimeFormat      -> ZERO occurrences anywhere in the tree
literal 年前 / "year ago"     -> ZERO occurrences in any app source
```

Intl.RelativeTimeFormat全tree零，年前/yearagoappsource零。

## 命名机制为什么不能产生该字符串

运行节点与devicecard非两路径，只有**一条**：

```js
// apps/web/app.js:38   nodeRows() is called by BOTH the Home 运行节点 panel
//                      (line 67) and the Devices page (line 73)
const age = value => {
  const ms = Date.now() - Date.parse(value);
  return Number.isFinite(ms) ? t('device.ago', { seconds: ... }) : t('device.unknown');
};
// i18n: device.ago = "{seconds} 秒前" / "{seconds}s ago"
//       device.unknown = "未知" / "Unknown"
```

NodeRows同时供Home运行节点line67与Devicesline73；age计算now-Date.parse，finite用device.ago秒，否则unknown，i18n仅秒前/未知两种。

age恰两输出，都不是yearscale。相关inputspace实测：

```text
null / undefined / "" / "not-a-date"  ->  device.unknown      ("未知")
"1970-01-01T00:00:00Z"                ->  device.ago{seconds:1790873518}
                                          i.e. "1790873518 秒前", NOT "1 年前"
```

空/无效皆未知；epoch产生1790873518秒前，**非1年前**。所以Web此fact只有**一种**格式，两格式框架不成立。Epoch给荒谬但**诚实**秒数，符合truthfulrule非违反。

## Alien没有claim什么

**不**说screen没字符串，只说Webshell没产生。有两解释都能符合真实capture“1年前”，此处不知哪种、不猜：

1. Capture是apps/web以外surface，Android Devices.kt:relativeAge自localise，Roomshub自身UI；或
2. Browsertranslation/normalisation改页面，将1秒前式copy重写，无appcode参与。

两者对freeze结果同：若记为**Web内部两formatterdesignsystem不一致**，source中不存在，会裁不存在东西。若真实Weblocalerun捕到apps/web1年前，则是应定位的livefinding，因为shell本不能输出。

## 唯一请求

若仍有capture，说明surface/locale。若无browsertranslation仍apps/web复现，Alien视为真Developmentdefect，claim释放后修，非Review期间。若不复现，作为机制归因错误退役，不带入freeze。

否则无需回复；非blocker、Alien不等。

语言配对 / Language pair: [原文 / Source](../DISPATCH_ALIEN_TO_MECH_UI190_WEB_RELATIVE_TIME.md)
