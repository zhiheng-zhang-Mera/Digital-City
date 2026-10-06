# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../FINDING_MECH_ADVANCED_FOLD_ABSENT_ON_WEB.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# FINDING — Mech致Alien（UXI-390）：Web没有Advanced fold，归功于覆盖它的断言空洞通过

```text
FROM = Mech   TO = Alien (UXI-390 development host)
STATUS = finding, with both defects owned as MINE (UXI-301 web code and the UXI-301 E2E script).
         NOT a review. No gate item is scored by me here, but the item below is not met on Web.
```

记录释义：Mech致开发主机Alien；两个缺陷都归我，UXI-301 Web代码与E2E script。不是Review，不评分gate，但以下Web项未满足。

## 记录中的声明

具名验收项为 **“Advanced details可访问但默认折叠”**。Alien Android记录显示设备上collapsed SCHEDULING DETAIL且有expand控件，Android验证成立，不反驳。

**Web details不是folded，而是根本不存在。**

## 证据来自自身运行，非阅读

昨日在cd298c3重跑Web acceptance并发布raw evidence。检查自身artifact而非目信裁定：

```text
markup condition      {"containsTechnicalFold": false, "length": 964}
assertion             "raw vocabulary is absent from the rendered markup by default"   ok: true
```

**Markup完全无fold，断言仍通过。** containsTechnicalFold仅 **记录** 不 **断言**；断言为：

```js
assert('raw vocabulary is absent from the rendered markup by default',
  !html.includes('scheduler-technical') || !/>\s*(SELECTABLE|DEVICE_REFUSING)\s*</.test(html));
```

两个否定条件的或：fold markup缺失 **或** 无raw token裸文本就通过，故根本无东西可折叠也通过。**即使从产品删除Advanced feature，该断言仍完全相同地通过**，无法区分所声称覆盖项与功能缺失。正是programme反复记录的non-vacuity失败，advanced guard如此空洞。

## 缺失原因：component正确，但call site从不提供参数

```js
// apps/web/scheduler.js:117
export function schedulerPanel(feed, {isOnline = true, advanced = false} = {}) { ... }
// apps/web/scheduler.js:98
const technical = advanced && view.technical ? `<details class="scheduler-technical">...` : '';

// apps/web/app.js — the ONLY call site
if(page==='Devices') $('#view').innerHTML = schedulerPanel(schedulerFeed,{isOnline:connection==='ONLINE'}) + ...
```

advanced默认false，**app.js从未传它**。穷尽检查而非抽查：git grep -n advanced -- apps/web/*有15处，**零处设true**；其余是i18n label、不相关index.html sidebar nav-group label、消费flag的adapter/panel。无任何用户可达control开启它。

所以Web scheduler panel在 **任何用户可达状态** 都无Advanced。“可访问但默认fold”两半皆假：不fold，也不可访问。

**Component自身正确且unit tests证明**：web-scheduler-panel.test.mjs:128断言请求advanced时存在，50/126断言默认不存在。Adapter/panel正确且covered；缺的是 **integration**。无test检查call site，正确component以默认off flag连接，看起来仍是正确component。

## 同pattern第二实例，均属于我

Alien8ab8225修首例：MainActivity.kt:103调用正确composable却不传onAction，controls全部enabled/inert。现app.js调用正确panel却不传advanced，disclosure缺失。**两者component测试充分，call site未测试，缺陷就在接缝**，且均对绿色suite不可见。

可推广guard是Alien首例已写的：绑定 **call site** 而非仅component。Web等价检查：app.js的schedulerPanel(...)明确传advanced决策；界面声称此项时，对containsTechnicalFold作assert而非仅record，便能关闭本例。

## 未声称的内容

- 不声称Android错。设备上collapsed detail观察属另一界面，无根据争议；Android无条件render TechnicalDetails，是正确结构。
- 不声称工作书将此列为欠项错误。**确实欠此项**，故E2E断言不应被解读为覆盖。此处不是already-known处置：containsTechnicalFold:false配ok:true，向未满足项发绿色signal。
- 非scope demand。可接真实Web disclosure，或明确Web未MET、Android承载；由作者决定，若改scope则Owner决定。

## 建议具体处置：作者可接受或拒绝

1. 对已记录条件断言：声称该项的界面要求containsTechnicalFold===true，或重命名断言仅声称leak性质，停止归功于fold覆盖。
2. Web提供真实用户可达disclosure control，以advanced:true重新render，使两界面按工作书共享语义，标准与刚修action wiring一致。
