# UI-000 — 唤醒条件已达到；标记一项开放事项，Alien 不自行承担角色

[English authoritative source / 英文权威原稿](../WAKE_CONDITION_ALIEN_RECORD.md)

完整历史阅读译文，不产生新权威字段或验收结论。 / Complete historical reading translation; no new authoritative fields or acceptance verdict.

```text
HOST     = Alien        (revision host for C2 / aea8361; NOT the author of Mech's repair)
EVENT    = Mech completed the UI-000 C″ independent review
RESULT   = revision_review_result: PASS_WITH_REPAIRS   revision_review_complete: true
ALIEN'S ACT = record the outcome and flag the open item to the Owner. NOT a claim, NOT a review.
```

上方原始身份块说明：Alien 是 C2 / aea8361 的修订作者，不是 Mech 修复的作者；事件是 Mech 完成 C″ 独立复核，结果为 PASS_WITH_REPAIRS 且 revision_review_complete 为 true。Alien 仅记录结果并向 Owner 标记开放项，不领取，也不复核。

## 1. 唤醒条件已触发，以及它解锁了什么

Mech 对 C2 修订（`aea8361`，Alien 编写的产物）的独立复核在 `2978e31` 得出 `PASS_WITH_REPAIRS`，CI `36865505123` 为绿。根据 `REVISION_REVIEW_REPORT.md` §9，**已采用**产物的第二主机独立复核门已满足，UI-101..103 的依赖也满足。

**这没有解锁任何可领取任务。** 对任务池做的是完整扫描，而非抽样：仅有的未完成工作书是 UXI-301（`IN_PROGRESS`，`development_host: Mech`）和 UXI-390（`NOT_STARTED`，`dependencies: ["UXI-301"]`，仍被 Mech 的任务阻挡）。其余所有 `UI-*`、`RS-*`、`UXI-*` 都处于 `REVIEW_COMPLETE`、`*_FROZEN` 或 `PASS_WITH_REPAIRS`。所以 Alien 正在等待；这是预期状态，不是 blocker。

## 2. 开放项的准确表述

Mech 在复核中**发现并修复**了系统性对比度缺陷 R-1：三个候选中的 `--ink-3` 全部不满足 WCAG 2.1 AA（A 3.65:1、B 3.41:1、C 3.26:1，共 267 个渲染元素）。修复保持色相，调整明度，并通过 `--accent-ink` 和 `--warn` 处理两个仅 A 存在的情况。

这是 §3 允许的复核者修复。但 Mech 明确且正确地说：

> 本机不主张自己的修复已被独立确认。若后续需要第三台主机确认这些修复，请按其自身判断处理。

因此，采用的 UI 基线依赖于一项**由发现缺陷的同一主机编写**的对比度修复，而未编写修复的主机尚未测量结果。“低于 AA 的元素 267 → 0”是 Mech 自己的声明，使用 Mech 自己的仪器（`scripts/ui-000/review-mech-probes.mjs`）验证。

这不是缺陷，也不是指责。这与同一 programme 轮次中 RS-290 遇到的独立性缺口相同；当时需要 Owner 裁决，因为 §12 将角色边界保留给 Owner。这里选择记录，而非自行解决，理由如下。

## 3. 决策记录：选项确实开放，所以理由需要保留

有三个选项；推理比选择本身更重要：

1. **Alien 现在单方面验证 Mech 修复。** 这很诱人：Alien 对修复本身独立，没有编写修复，而且 Mech 明确让各主机自行判断。但拒绝立即这样做，因为 Alien **就是**被修复产物的作者；Alien 裁定“UI-000 对比度现在是否正确”，相当于主机给自己交付物的修复评分。§3 的独立性规则恰恰为防止这种情况而设，本 programme 本轮也已有一次角色边界 Owner 裁决。未经 Owner 自行承担新的第三主机复核角色，是 §12 保留的事项。
2. **将它视为新任务并领取。** 拒绝：为了让自己的工作可领取而发明工作书，正是 §9 禁止的造工作；池中并无这样的任务。
3. **记录并提交 Owner。** 选择此项。它没有成本，不丢信息，也把角色决定留在 §12 指定的位置。只要 Owner 需要，测量本身很便宜：候选是静态 CSS，检查客观（渲染元素对比度相对于 AA 比率），获派者可用独立于 Mech 的仪器一次完成。

**Alien 明确没有做的事：** 修改 `apps/web/candidates/**`、改变任一 `UI-000` 工作书字段，或对 UI-000 作出裁决。Alien 唯一行动就是本记录。

## 4. 下一次扫描的常驻状态

没有 Alien 可领取项。按 Owner 的表述，Alien 观察的唤醒条件为：

- Mech 完成 UI-000 C″：**本轮已达到**，结果记录如上；
- 新的 Owner 裁决：Alien 未知有待处理裁决，但上述选项 3 提出了一个；
- 其他依赖门打开：目前没有；UXI-390 等待 UXI-301，后者属于 Mech。

Alien 将继续按约 20 分钟间隔扫描。RS-290 已关闭，无欠项：冻结于 merge `1a5bc0e`，main CI `36964619541` 两个 job 均绿，合并树与复核头 `2f81296` 字节完全一致。
