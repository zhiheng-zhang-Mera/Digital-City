# Capability Exposure Matrix / 能力暴露矩阵（中文）

> 状态：**BOOTSTRAP VIEW**
>
> 本表是人工审查视图，不是机器权威源。权威结构化状态来自 `CAPABILITY_INDEX.yaml` 与 `records/*.yaml`。

## 当前迁移状态

历史能力入口数据目前主要位于：

- `mission-book/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`

它将作为 bootstrap source，由 CEX programme（尤其 CEX-790）逐步回填至长期 Registry。

在回填完成前，不复制未经重新验证的旧结论，以免制造新的 stale registry。

## 人工审查列

长期生成/维护本表时至少包括：

| Capability ID | 能力 | Implementation | Backend wiring | User reachable | Intent valid | Exposure class | Web | Android | Other | Last verified SHA | Gap |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Review 重点

人工审查优先找：

- `COMPLETE + MISSING`：代码完成但用户找不到；
- `VERIFIED wiring + MISMATCH intent`：链路通了但语义不对；
- 某平台 VERIFIED、同级平台 MISSING 的 parity gap；
- Registry 写有入口但实际找不到的 reality mismatch；
- 长期没有 exact SHA/evidence 刷新的 stale record。
