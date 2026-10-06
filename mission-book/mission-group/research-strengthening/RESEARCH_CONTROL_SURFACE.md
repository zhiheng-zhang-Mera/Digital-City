# Research Control Surface / 研究控制面收纳原则

研究能力需要强控制权，但不能让普通 Utopia 首页变成实验室仪表盘。

## Progressive disclosure

```text
Primary Product UI
    ↓
Research entry / Advanced
    ↓
Experiments
    ├─ Create / Run / Stop
    ├─ Scenario
    ├─ Metrics
    ├─ Replay
    └─ Export
          ↓
Danger Zone / Advanced Controls
    └─ Fault Injection
          ↓
Diagnostics
    └─ raw trace / IDs / exact config
```

## 暴露等级

### DIRECT_CONTROL

必须直接操作：

- create experiment；
- start / pause / stop experiment；
- choose scenario；
- repetitions；
- replay；
- export artifact。

放 Research 页面主操作区。

### ADVANCED_CONTROL

必须可操作但不应频繁出现：

- fault injection；
- destructive cleanup；
- advanced seed/config override；
- experimental transport fault。

放 Advanced / Danger Zone，并明确确认。

### OBSERVABLE

必须知情：

- current run；
- progress；
- topology；
- failures；
- retries；
- handoffs；
- recovery；
- metrics；
- exclusions；
- provenance；
- artifact status。

默认显示用户语言摘要，technical identifiers 折叠。

### INTERNAL_ONLY

例如 trace collector 内部 buffer、heartbeat packet 等。

只有真正没有用户决策/知情价值时才可完全不在 UI 中出现，并必须在工作书记录 `UI_EXEMPT_INTERNAL_ONLY` 理由。

## 原则

> **在不造成视觉和操作过载的前提下，给予用户最大的掌控权与知情权。**

解决 overload 的手段是**分层、上下文、折叠、搜索与高级面板**，不是把可操作能力藏起来。


---

[English translation / 完整英文说明](en/RESEARCH_CONTROL_SURFACE.md)
