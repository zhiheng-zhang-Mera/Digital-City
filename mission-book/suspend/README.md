# Suspend / 冻结保留区

> **状态：NON-EXECUTABLE / NON-CANONICAL / PRESERVE-ONLY**
>
> 本目录用于保存“现在不应进入正式架构或施工规则，但未来可能需要重新评估、因此不能丢失”的设计、假设和替代方案。
>
> **保存 ≠ 接受；记录 ≠ 授权；存在文件 ≠ 可领取任务。**

## 硬规则

- 本目录不是 Mission programme；
- 不进入 `PROGRESS_MANIFEST.json`；
- 文件不得使用 `execution_enabled=true`；
- 不创建 implementation branch；
- 不作为 Utopia 当前行为、City canonical architecture 或施工规则的 authority；
- 与 `CONSTRUCTION_RULES.md` 冲突时，永远以现行规则为准；
- 任何内容离开 suspend 前，必须重新做 reality audit，并显式选择目标去向：DGX / RIV / URA / future-development / active Mission Book / reject。

## 当前保留

| 文件 | 原因 |
|---|---|
| [SUSPEND-001](./SUSPEND-001-city-room-vs-utopia-incubator.md) | “Room=孵化房”与 City 已有 Room 正式语义冲突 |
| [SUSPEND-002](./SUSPEND-002-physical-repository-split.md) | 物理拆仓未来可能有价值，但当前没有收益证据 |
| [SUSPEND-003](./SUSPEND-003-same-host-formal-review-substitution.md) | 同机 fresh critic 替代 Formal Review 与现行异机硬门槛冲突 |

## 解冻条件

每个 suspended item 至少需要：

1. 当前事实重新测量；
2. 与现有 canonical owner/规则做 conflict check；
3. 明确为什么“现在”比当初更适合启用；
4. 给出最小迁移路径与回滚；
5. Owner 显式裁决；
6. 若涉及 Review/安全/权限，先完成对应独立 acceptance。
