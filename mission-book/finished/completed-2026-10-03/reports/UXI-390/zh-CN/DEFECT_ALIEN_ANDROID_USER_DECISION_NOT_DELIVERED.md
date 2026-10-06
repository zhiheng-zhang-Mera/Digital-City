# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DEFECT_ALIEN_ANDROID_USER_DECISION_NOT_DELIVERED.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DEFECT — UXI-390 / UXI-301 Android：用户决策控件没有可调用的backend

```text
FROM = Alien (UXI-390 development host)   TO = Mech (UXI-390 review host, when I declare complete)
CLASS = implementation gap on the Android surface, not a probe artefact
GATE  = UXI-301/UXI-390 require that the switch and no-switch paths REALLY EXECUTE and that the user's
        choice REALLY REACHES THE BACKEND. On Web both are driven and pass. On Android this item is NOT MET.
```

记录释义：Alien开发主机致完成后Review主机Mech；Android implementation gap，非probe artifact。Gate要求switch/no-switch **真实执行**、用户选择 **真实到backend**，Web两者drive通过；Android该项NOT MET。

## 实测症状

真实设备、真实gateway，tap前立即核验live connection：

- Panel显示Waiting for your decision、Confirm、Keep waiting、Cancel。
- Confirm label为TextView，clickable=false却 **enabled=true**；其中心恰落在 **一个** clickable android.view.View、enabled=true内。
- Probe按坐标tap **此node**，不是label。
- **所有tasks均无actor=user事件**：query City全部user-actor events，排除filter artifact；仅两user events是 **更早API-driven probes** tasks的TASK_PROVIDER_CHOSEN。
- Gateway未退出，tap后decision state **持续**。

## 通过代码读取固定机制

**Web**对此action真实调用backend：

```text
apps/web/scheduler.js:34   CHOOSE_PROVIDER -> POST /api/v0/tasks/:id/provider-choice,
                           "a real route added for this task"
```

**Android**不调用：

```text
apps/android/.../CityClient.kt:112   fun cancel(id) { ... request("tasks/$id/cancel", ...) }
```

Cancel是Android唯一实现的task action。递归搜apps/android所有.kt的provider-choice、providerChoice、switch-declined，**全无**。

SchedulerPanel action参数默认 **no-op**：

```text
SchedulerPanel.kt:40    onAction: (taskId: String, token: String) -> Unit = { _, _ -> },
SchedulerPanel.kt:107   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

因此buttons从presentation feed actions列表render，其中正确含CONFIRM，故控件真实clickable/enabled；但 **无代码路径将选择传往任何地方**。控件真实，后方wire未连接。

## 未确认的内容：防止过度声明

无法在任何Android sources找到SchedulerPanel(...) **call site**，虽设备上确实render。递归搜无invocation，无法解释；记录为我自身inspection未解缺口，不作为代码事实。不改变finding：无论如何endpoint reference缺失，user-event实测缺失独立于此。

另一残余窄且未变：input tap发送down-up pair，未证明handler响应synthetic tap。但即使handler存在且漏tap，仍没有provider-choice **route**，代码搜证明缺失。

## 对gate的含义

Android scheduler界面 **已验证render正确**：用户语言state labels、providers带原因、usable pool/busy pool/pending decision三分、Advanced默认折叠、无contract token泄漏，executor/connection loss诚实降级。**未满足** 用户决策路径：render了，却不交付。

记录为 **NOT MET** 而非passed；在未向Owner明说前，**不会** 先修再宣development complete。Android增加backend call是产品变更，非evidence fix；UXI-390余下scope须在明示此gap情况下决定。

## 重现

mission-book/reports/UXI-390/PROBE_uxi390_android_confirm2.ps1逐字发布，配PROBE_uxi390_node_b.mjs两nodes，输出UI-tree attributes、tap target、目标task events、City **全部** user-actor events。Mech可在另一host重跑并重现或反驳缺失。
