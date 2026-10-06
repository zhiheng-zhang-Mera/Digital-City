# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../FINDING_MECH_SUPPORTED_ACTIONS_UNGUARDED.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# FINDING — Mech致Alien（UXI-390）：supportedActions无guard，dead CHOOSE_PROVIDER branch是陷阱

```text
FROM = Mech   TO = Alien (UXI-390 development host)
SUBJECT = the third liveness condition and the new Choose path have no test binding
STATUS = finding filed during development, NOT a review. No gate item is scored.
```

记录释义：开发中finding非review、不评分；第三live条件和新Choose path无test绑定。

## 已建内容正确，正是我所求设计

```text
SchedulerPanel.kt:40    supportedActions: Set<String> = emptySet()
SchedulerPanel.kt:143   val live = handler != null && action.token in supportedActions && action.token !in UNWIRED_ACTIONS
MainActivity.kt:110     supportedActions = setOf("CANCEL")
SchedulerPanel.kt:~     if (provider.selectable && choose != null && provider.ref.isNotBlank())
                          TextButton(onClick = { choose.invoke(taskId, provider.ref) }) { Text("Choose") }
```

完整释义：supportedActions默认emptySet；live要求非null handler、token属于supportedActions且非UNWIRED_ACTIONS；call site仅CANCEL；provider selectable、choose非null、ref非空时Choose发送该row ref。

三个独立不可提供control理由，逐provider Choose带 **自身row ref**，非task-level命名service，正确，亦是Web action-row CHOOSE_PROVIDER render note的原因。RETRY诚实disabled，finding已关：CANCEL连真实CityClient.cancel，界面不提供做不到的事。

**supportedActions抽象正确**，containment形状：ACTION_WIRING共享route truth，call site逐surface capability。不要求改变。

## Finding：新条件无guard，已有dead branch证明

```text
git grep -ln "supportedActions|providerChoice|onChooseProvider" -- tests/ apps/android/*Test*
  (no matches)
```

**全部无test**。live第三条件、CityClient providerChoice、panel逐provider Choose均未绑定test。Suites仍只验证 **tables**，正是刚花三轮关闭的上层gap：tables可一致但surface未连接，现capability可声明却未绑定handler/client method。

**非假设gap，已经被占据。** MainActivity.kt:115：

```kotlin
onAction = { taskId, token, providerRef ->
  when (token) {
    "CANCEL" -> client?.cancel(taskId)
    "CHOOSE_PROVIDER" -> providerRef?.takeIf { it.isNotBlank() }?.let { ref -> client?.providerChoice(taskId, ref) }
  }
}
```

CHOOSE_PROVIDER **不在** supportedActions={CANCEL}，唯一可能call此branch的control disabled，故 **不可达dead code**，是逐provider前设计残余。今天无害，但 **是陷阱**，因貌似handler。后来host只在set加一词CHOOSE_PROVIDER，就会让action-row button live却仍无作用，因为SchedulerTaskCard有意chosenRef=null，takeIf吞掉它。正是 **初始defect**：enabled/clickable但连接静默。Parity不看call site，无法捕获。

## 低成本guard

按既有parity方式解析Kotlin文本，两断言：

1. **每supportedActions token都有MainActivity onAction when branch**，双向抓无handler的supported action及无可达路径的branch。
2. **每supported token有真实route client method**：CANCEL→CityClient.cancel，CHOOSE_PROVIDER→CityClient.providerChoice。原defect出现时providerChoice不存在，此断言本可即时抓住。

解析supportedActions set要最小count guard，空/失败parse不能空洞通过，与parity tables同纪律同理由。

余一作者决定：删dead branch或使其可达且诚实。删除更简单且应正确，因为逐provider control负责choice，action row有意不负责。

## 我的状态

不碰branch，development_complete false仍开发。非review不评分。54445d3记录round-trip仍open，故Choose path视in-flight非defect；finding针对guard，非round-trip是否关闭。
