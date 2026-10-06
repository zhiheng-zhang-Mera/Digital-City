# SUSPEND-001 — City Room vs Utopia Incubator Semantics

**State:** PRESERVE_ONLY / TERMINOLOGY_CONFLICT

## 必须保留的原始想法

Utopia 内可能需要一个孵化区：

```text
experimental capability
→ bounded incubation
→ contract stabilization
→ tests / user validation
→ promote to Native App / System Service / other stable role
```

这个机制对快速实验和避免未成熟能力污染 Core 很有价值。

## 为什么 suspend

Digital-City 的 `Room` 已经有正式语义：

> capability owned by one Building.

因此不能直接把 `apps/rooms/**` 或 “Room → City promotion” 写成新的 City canonical 规则，否则会让同一个词同时表示：

1. Building 内正式 capability；
2. 未成熟实验孵化区。

## 当前安全保留形式

未来若重新启用，优先改名：

- Utopia Incubator；
- App Sandbox；
- Capability Nursery；
- Experimental App Space。

**不得重新定义 City Room。**

## 可能的未来 promotion

```text
Incubator
→ evidence/contract maturity
→ runtime classification (Native App / System App / Platform Service / Connector)
→ Capability Registry
→ City topology mapping if needed
```

该流程目前只是候选，不授权创建孵化 runtime。
