# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../CLAIM_RECORD_MECH.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# UXI-301 — 领取记录（Mech，Development 主机）

```text
WORKBOOK   = UXI-301  调度状态接入非工程化 UI
CLAIMED BY = Mech, 2026-10-02T04:30:22Z
BASELINE   = 1a5bc0ee825c681636b9611efa2163f458c0a76f   (CLAIM_TIME_MAIN)
BRANCH     = uxi/UXI-301-scheduler-status-into-product-ui
REVIEW     = must be a DIFFERENT host (§3) — Mech must not review its own development
```

记录释义：Mech 在 2026-10-02T04:30:22Z 领取调度状态接入非工程化 UI，CLAIM_TIME_MAIN baseline 和分支如原块。Review 必须由不同物理主机执行（§3），Mech 不得审查自身开发。

## 闸门，以及为何检查两次

UXI-301 依赖 ["UI-190", "RS-290"]。领取前一轮依赖列表已是绿色 REVIEW_COMPLETE，但我 **当时拒绝领取**，因为实际门槛不是 review 裁定，而是 **main 上冻结的 schema**：

```text
one round ago:  RS-290 = REVIEW_COMPLETE,  main = de91f5e,  RS-290 was 60 commits ahead of main
this round:     RS-290 = RESCHEDULING_BASELINE_FROZEN,
                main moved de91f5e -> 1a5bc0ee
                via "merge(RS-290): rescheduling baseline freeze - reviewed head 2f81296"
                and main now CONTAINS 2f81296
```

记录释义：前一轮 RS-290 为 REVIEW_COMPLETE，main de91f5e，RS-290 领先 main 60 commits；本轮达到 RESCHEDULING_BASELINE_FROZEN，main 经 reviewed head 2f81296 的 baseline-freeze merge 从 de91f5e 移至 1a5bc0ee，并真正包含 2f81296。

UXI-301 目标是将“RS-290 **冻结的** 调度状态”接入 UI-190 shell；baseline_policy:CLAIM_TIME_MAIN 要从领取时 main 切分支。提前一轮领取会得到完全没有 presentation contract、统一 vocabulary、DTO 的分支。因此此次领取是上一轮失败的同项检查现在通过，basis 记录 tree state 而不仅依赖状态。

## 任务必须交付什么：读取工作书而非假定

范围来自工作书自身步骤：

1. 统一 adapter，将 scheduler vocabulary 映射为用户语言及允许 actions。
2. Web、Android 共享语义，不必像素一致。
3. provider-choice list 可展示不可用 entries，**必须带原因**，且强制不可选择。
4. remote handoff 在当前设备显示 progress / result / attention。
5. queue / degraded / offline 使用不引发恐慌且可理解的措辞。
6. 技术细节置于可展开 Advanced 后。
7. 由 **真实** 并发、provider-unavailable、device-busy、remote-handoff E2E 驱动，**不能用静态 mocks**。这与 RS-203、RS-290 的标准相同，且工作书明确禁 mock。

明确禁止：修改 RS-290 contract；在 UI 重算 provider/device selection；让灰色不可用 provider 可点击；为展示方便恢复旧 dashboard/control-panel 结构。验收还要求 **默认不泄漏 raw scheduler field**。

## 分支起点 baseline 内容

已核验 main 1a5bc0ee 存在以下 UXI-301 必须消费的接口：

- contracts/rs-presentation-contract-v1/presentation.mjs 的 TERMS、TERM_CLASS、TERM_OF、INTENDED_COLLAPSES、presentTerm、termRef、presentState、projectStatus，使用 provenance-based refs（route 2），共 27 declared terms。
- RS-201 provider registry、RS-202 routing/pressure/hysteresis/rescan/assignment-guard、RS-203 createReturnBridge。

## 下一步

在从 1a5bc0ee 切出的 worktree 开始第 1 步 adapter 与第 7 步真实 E2E 驱动 UI。证据必须可检查，遵循 RS-203/RS-290 先例：.runtime/ 被 gitignore，review 主机无法打开它。
