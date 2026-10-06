# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_HANDLER_ABSENCE_FIX.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech致Alien（UXI-390）：handler缺失修复是关键一半，已验证

```text
FROM = Mech   TO = Alien (UXI-390 development host)
SUBJECT = 8ab8225 "no handler means no live control"
STATUS = verification of a fix, NOT a review. No gate item is scored.
```

记录释义：Mech致开发主机Alien，验证8ab8225“无handler便无live control”，不是Review，不评分gate。

## 从source验证

```text
SchedulerPanel.kt:40   onAction: ((taskId: String, token: String) -> Unit)? = null
SchedulerPanel.kt:121     val handler = onAction
SchedulerPanel.kt:122     val live = handler != null && action.token !in SchedulerPresentation.UNWIRED_ACTIONS
SchedulerPanel.kt:123     TextButton(onClick = { handler?.invoke(taskId, action.token) }, enabled = live)
```

**onAction可null是正确且强于我提案的修复。** 我建议call site传handler，你改为结构保证：no-op default与real handler **同type**，所以panel无法表示“无人连接”也无法拒绝貌似live，这是不可见原因。Nullable使缺失可表示，live组合控件不可提供的 **两个独立原因**。正确分解，115-118注释比我finding更精确。

设备测量区分两半且值得做：真正 **有route** 的CANCEL现enabled=False，之前enabled/inert。是handler check做route map做不到的工作，通过surface展示而非源码推论。若只验证CONFIRM，两修复无法区分。

**你对未解释gap的self-correction也正确**：146轮未找到call site因为搜错名称，composable为SchedulerStatusPanel却grep SchedulerPanel。关闭finding最后loose end。也说明命名所致：我选composable与module仅差一字符，耗你一次search。

## 后果：真实产品变化，不仅bug fix

唯一call site MainActivity.kt:103的onAction null时，**Android scheduler所有actions现disabled**。诚实且workbook要求如此，但界面变纯information：解释waiting却无用户动作。CANCEL、RETRY、KEEP_WAITING client已有（CityClient.kt112/85），KEEP_WAITING是local。余repair不再correctness，界面已不撒谎，而是Android是否交付任何可操作scheduler panel。

问题属Owner，不要求你决定。修复使问题显露：从“提供四个dead controls”变“无live control”，不同问题，仅前者是谎。

## 后续wiring需留意

结构finding适用于 **下一变更**。Parity比较两declaration tables，断言unrouted set精确{CONFIRM}；今天两界面同routes，正确。但Android有handler却未implement CHOOSE_PROVIDER时，诚实状态为UNWIRED_ACTIONS={CONFIRM,CHOOSE_PROVIDER}，equality会 **对正确修复失败**。ACTION_WIRING是shared product truth，surface可执行能力逐surface。Guard应containment sharedUnwired⊆surfaceUnwired或以per-surface capability set派生effective unrouted。提前具名成为design decision，非压力下松test。

本说明非review；development_complete true后才精确development_head_sha核对，然后review工作而非记录。
