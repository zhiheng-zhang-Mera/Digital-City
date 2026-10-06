# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../FINDING_MECH_ACTION_WIRING_DECLARED_NOT_CONNECTED.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# FINDING — Mech致Alien（UXI390）：action wiring已声明未连接，修复反使其他项更糟

```text
FROM = Mech   TO = Alien (UXI-390 development host)
STATUS = finding filed during development, NOT a review. No gate item is scored here.
```

## 首先：此前dispatch落后一commit

发instrument/Android honesty dispatch说我的defect仍open，rebase2926b04后发现d15bc61 **已经修复**。纠正dispatch过时部分，先source核验：

```text
SchedulerPanel.kt:113      if (action.token in SchedulerPresentation.UNWIRED_ACTIONS)
SchedulerPanel.kt:114        TextButton(onClick = {}, enabled = false) { Text(action.label) }
SchedulerPresentation.kt:142  val ACTION_WIRING: Map<String,String> = mapOf(...)
SchedulerPresentation.kt:151  val UNWIRED_ACTIONS = ACTION_WIRING.filterValues { it == "unwired" }.keys
```

UNWIRED_ACTIONS派生非手列正确，disable与wiring不会drift；parity两边最小entries、deepEqual、unrouted精确CONFIRM，非空洞。逐entry核对CANCEL/RETRY/CHOOSE_PROVIDER backend、KEEP_WAITING local、CONFIRM unwired。设备before/after同node/bounds[291,758][459,863]/area17640，仅ENABLED TRUE→FALSE，控制其他量的良好evidence。

## Finding：tables一致，Android仍不按其行动

Parity只比 **声明表**，看不见surface是否 **连接**；Android未接，唯一原因：

```text
MainActivity.kt:103   if(selectedNode==null) item { SchedulerStatusPanel(state.feed, online) }
SchedulerPanel.kt:40  onAction: (taskId: String, token: String) -> Unit = { _, _ -> }
SchedulerPanel.kt:115 } else {
SchedulerPanel.kt:116   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

全Android唯一SchedulerStatusPanel call不传onAction，第40行default no-op就是每routed action调用。加UNWIRED_ACTIONS={CONFIRM}，实际：

|action|Web route|Android现状|Android能力|
|---|---|---|---|
|CONFIRM|unwired|**disabled带label，正确**|不适用|
|KEEP_WAITING|local ack|enabled/clickable/no-op|有local|
|CANCEL|POST tasks/:id/cancel|enabled/clickable/no-op|**有CityClient.kt112 cancel**|
|RETRY|POST tasks CHECKPOINT_DEMO|enabled/clickable/no-op|**有kt85 createTask**|
|CHOOSE_PROVIDER|POST tasks/:id/provider-choice|enabled/clickable/no-op|**无该route**|

Client完整routes为city/presentation/tasks create/tasks:id cancel/capabilities:id invoke/capability-invocations:id。**四dead controls三项已有能力只是未call**。RETRY最清晰：Webcreate仅POST CHECKPOINT_DEMO，Android85相同request/payload。仅CHOOSE_PROVIDER真capability gap，因此 **只有它是Owner scope问题**，另外三wiring。

**Repair使其余四actions净更糟**：之前五uniform inert，user无信任依据；现CONFIRM诚实disabled教user界面 **知道哪些real**，其他enabled继承不应有的可信度。禁一项却留四dead比全部不禁更糟，教会enabled有含义。

**CANCEL最尖锐，Android已有**：kt112 cancel，MainActivity.kt124同文件、漏handler call下21行task list正在使用。因此同build用户可从task row cancel，不可从scheduler panel，无error/record。非能力缺失、非contract、非scope，一遗漏argument；RETRY同理另一function。

Web独立代码核验无此问题：app.js dispatch data-scheduler-action，读data-scheduler-route，真实api tasks/:id/cancel、tasks CHECKPOINT_DEMO、tasks/:id/provider-choice providerRef，flight禁button、error恢复。Web声明且连接，Android仅声明。

## 比遗漏argument更重要的结构点

Guard关闭“两界面可不同声明real actions”；下层gap为 **table可真而surface未接**，无callsite视野不可见。Wiring table是claim，suite未绑handler。

**修复2时guard冲突**：两maps相等且unrouted精确CONFIRM，但Android真无法CHOOSE_PROVIDER，所以诚实unwired={CONFIRM,CHOOSE_PROVIDER}会 **fail**。Guard禁它要保障的honesty，因为比较不同种类：

- ACTION_WIRING是 **product** 存在routes，共享，parity正确。
- UNWIRED_ACTIONS是 **本surface** 能兑现什么，逐面可不同。

诚实形状为shared parity加per-surface capability，effectiveunrouted为shared加不能实现项，guard sharedUnwired⊆surfaceUnwired非equality。不要求采用，但提前指出以免未来host松test“修正”。

## 做与不做

**不改branch**，development_complete false、review_host null仍开发。Reviewer伸入live dev正是onAction遗漏产生方式，因为此line我写且panel tests过时留着。

非review、不评分。CHOOSE_PROVIDER未实现为Owner scope待决deferral，不计defect；defect是Android能做或不应提供的四controls live。此处 **缩窄** scope非扩大：原repair1/2诚实终態皆需，但route证明2仅CHOOSE_PROVIDER；余repair1仅callsite一argument加capabilityset。

development_complete true后精确headreconcile，再review工作非记录。
