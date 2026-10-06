# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../CORRECTION_ALIEN_ANDROID_UNWIRED_ACTION.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# CORRECTION — Android缺陷是UI诚实性，不是缺失功能

```text
FROM = Alien (UXI-390 development host)
RE   = DEFECT_ALIEN_ANDROID_USER_DECISION_NOT_DELIVERED.md, and round 146's workbook field
STATUS = round 146's framing is PARTLY WRONG and is corrected here. The finding survives; its
         description does not.
```

记录释义：Alien UXI-390开发主机，纠正DEFECT报告及第146轮workbook field；原framing部分错，finding仍在但描述需改。

## 错在哪里

第146轮“Android用户决策无backend call”定位CityClient缺provider-choice。**对实际tap的control，这framing错误**。未读design intent就从症状推缺陷，正是programme已记录十次错误，我再次犯。

## 设计实际要求

Web有明确wiring map，CONFIRM **有意无route**：

```text
apps/web/scheduler.js:44   CANCEL:          {kind: 'backend', route: 'cancel'}
apps/web/scheduler.js:45   RETRY:           {kind: 'backend', route: 'create'}
apps/web/scheduler.js:46   KEEP_WAITING:    {kind: 'local',   route: null}
apps/web/scheduler.js:47   CHOOSE_PROVIDER: {kind: 'backend', route: 'providerChoice'}
apps/web/scheduler.js:48   CONFIRM:         {kind: 'unwired', route: null}
apps/web/scheduler.js:37   *  CONFIRM -> NO ROUTE EXISTS YET, so it is rendered disabled and labelled
                              rather than as a button
apps/web/scheduler.js:78   if (wiring.kind === 'unwired') {
apps/web/scheduler.js:79     return `<button ... disabled aria-disabled="true"
                                        data-scheduler-unwired="${...}">`
```

完整释义：CANCEL后端cancel，RETRY后端create，KEEP_WAITING local无route，CHOOSE_PROVIDER后端providerChoice，CONFIRM unwired无route；无route应disabled、带label而非可操作button，代码与marker原样见证据。

所以 **Web** 的CONFIRM为 **disabled、带label、不可操作** 元素，说明尚未接线。对无route action这是诚实处置，符合不可将不可用项呈为actionable规则。

**因此tap无user-actor event是正确行为。** 无route，backend无可记录内容。第146轮以event缺失证明delivery gap是症状推断，被design intent否定。

## 真正fault

Android **无等价处置**。Kotlin递归搜unwired、NO ROUTE、action-wiring map全无；feed每action都render live control：

```text
SchedulerPanel.kt:107   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

设备上CONFIRM测得clickable=true、enabled=true，故Android把按设计无route、**无法工作**的action当成 **enabled/tappable**，Web同action disabled且自解释。

**故为UI honesty，非missing feature**：同无route action的呈现语义分歧，Android误表可用。比146轮更精确、证据更充分、更符合工作书禁令。

亦是Android对providers已遵守的 **同不变量**：UI tree及no-op已证明不可用provider非interactive，provider正确却action等价情形错误。

## 第146轮哪些保留、哪些撤回

**保留且独立成立**：Android仅cancel，无provider-choice/switch-declined；Web CHOOSE_PROVIDER真实POST /api/v0/tasks/:id/provider-choice。这 **是真gap**，因为CHOOSE_PROVIDER **有** backend route而Android无法call。但不是所tap控件，146轮混淆二者。

**撤回**：静默CONFIRM tap证明delivery failure，未证明。

**仍未解释，仍归自身inspection gap而非代码事实**：未找到SchedulerPanel(...)call site，设备却render。

## 两候选修复，使下一决定明确

1. **镜像Web诚实性**：Android action-wiring map含同unwired kind，无route actions disabled且带label。小client-side、无contract变更，按工作书两界面共享语义。
2. **接通Android缺失的支持actions**：CHOOSE_PROVIDER provider-choice、RETRY/CANCEL，使可工作控件真正工作。同为client-side，用已有routes。

不是替代方案，诚实终态需两者。1修defect，2关CHOOSE_PROVIDER gap；均无需改RS-290 contract，在允许Android presentation-adapter边界内。

## 不做什么

未明示前不先修再declare complete，也不要求workbook已有答案的scope ruling：UXI-390第2步明示acceptance host可commit发现的fixes。值得Owner决定的仅是否同时吸收2与1，或像remote-handoff一样将CHOOSE_PROVIDER具名延后。

Reproduction未变：PROBE_uxi390_android_confirm2.ps1配PROBE_uxi390_node_b.mjs。
