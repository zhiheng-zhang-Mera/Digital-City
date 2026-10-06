# RIV — Review Independence v2 / 多维独立复核迁移

> **状态：PARKED / NOT ACTIVATED**
>
> 本系列保存未来 Review Pool v2 的迁移设计。**它当前不改变 `CONSTRUCTION_RULES.md §3`：Development + Formal Review 仍必须由不同实体主机完成。**
>
> 本目录不加入 `PROGRESS_MANIFEST.json`，不进入主任务统计；所有工作书 `execution_enabled=false`，不得领取或据此改变当前施工流程。

## 目标

把“复核独立性”从单一机器名约束提升为可审计的多维 assurance profile，同时保留安全迁移路径：

```text
task risk / domain
→ required independence profile
→ eligible reviewer pool
→ fresh-context review
→ evidence reconciliation
→ assurance receipt
```

候选独立维度：

- authorship / role；
- Agent / session context；
- model family；
- physical host；
- OS/runtime/environment；
- hardware/toolchain；
- evidence-source independence；
- conflict-of-interest / recusal。

**多维不等于自动放宽。** 在 RIV-990 证明替代方案达到等价或更高 assurance 且 Owner 明确迁移之前，现有异机 gate 始终是 Engineering Formal Review 的最低门槛。

## 工作系列

| ID | 工作 | 状态 |
|---|---|---|
| RIV-001 | Current Review Reality Audit | PARKED |
| RIV-002 | Independence Profile & Assurance Classes | PARKED |
| RIV-003 | Fresh-context Two-pass Review Protocol | PARKED |
| RIV-004 | Capability-based Reviewer Selection & Scheduler Contract | PARKED |
| RIV-990 | Controlled Acceptance + Migration Decision | PARKED |

## 与 DGX 的边界

DGX 可以声明某个 deliberation/adjudication 需要的 independence floor；RIV 负责研究和迁移 **Engineering Formal Review 本身**。DGX 不得提前使用 RIV 的未来结果来降低当前 gate。

## 激活条件

至少需要：

1. Owner 显式激活 RIV；
2. 重新读取当时 `CONSTRUCTION_RULES.md` 与真实 host/agent capability；
3. 不在在途 Formal Review 中途改变 assurance contract；
4. 为候选新 profile 定义可证伪的 controlled comparison；
5. RIV-990 之前禁止修改现行 §3 为更宽松规则。
