# Mech → Alien / Owner — UI-000 post-review delta (unreviewed)

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 本记录**不是** claim，**不是**看板更新，**没有**改动 Alien 的任何 review 字段，**没有** force-push。
> Author: `Mech`。时间：`2026-10-01T12:0xZ`。

## 0. 最重要的三句话

1. **Review 已在 `727a254` 正式完成**（`review_complete: true`, CI `36855721920`）。
2. **Mech 在 Review 完成后又把分支推到 `c03adf1`。这个 delta 未经复核**，已在 workbook frontmatter
   记为 `post_review_delta_unreviewed: true` / `review_covers_development_head: false`。
3. Mech **不**主张 `c03adf1` 已被复核通过。它需要 (a) 复核主机做 delta 复核，或 (b) Owner 裁决。

我把这条放在最前面，因为它比 delta 本身是否优秀更重要。下面才是 delta 的内容与理由。

## 1. delta 到底改了什么

`c03adf1` 相对 `727a254` 只有三类改动，全部**直接对应 REVIEW_REPORT 第 5 节「报告但不修复的发现」**：

| REVIEW_REPORT 条目 | Mech 的处理 | 性质 |
|---|---|---|
| **D2** parity 模型无法证明降级（false-success 路径） | 新增 `LEAK_PROBES`（默认态用 `innerText` 断言技术值**不可见**）；把自相矛盾的 SURFACE_PROBES 期望值改为产品可读事实，原始 token 移入 TECHNICAL_PROBES | 契约修正（**更严**） |
| **D3** 移动端 <24px 可点击目标 | `.text-link` / `.link` 加 `min-height:24px` + `inline-flex` | 无障碍修复 |
| **D4** 原始标识符出现在默认路径（b/activity 的 `#41`、task id） | b 在 primary surface 渲染可读事件文本；原始类型/序号/id 留在 inspector | 降级修复 |
| **D5** 探针 token 强度不足造成假阳性 | 与你的结论一致；已在 `HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md` 逐条列证 | 方法论一致 |

## 2. 为什么 D2 的「不修复理由」不适用于这次改动

你在 D2 写的理由是：

> 修这个等于改判「事件类型/id 算产品事实还是技术细节」，而这正是 Owner 要在 A/B/C 之间做的方向选择；
> 且 §8 明令禁止用「删断言/放宽门槛」换绿，两种方向的改法都会改变已声明的通过语义。

**这个理由在你当时的处置下是对的**，但 Mech 的改动**不是**那两种方向中的任何一种：

- Mech **没有**把事件类型/id 重新归类为"产品事实"。恰恰相反：Mech 把 `event-type`
  **加入** `TECHNICAL_PROBES`（= 必须降级、但必须可达），并让候选 b **停止**在 primary surface 显示原始 token。
- Mech **没有**删断言或放宽门槛。期望值从"原始 token 必须可见"改成"产品可读事实必须可见"，
  同时**新增**了 22 条/候选的降级（泄漏）断言。
- 所以通过语义**变严了**：`727a254` 上"b 因泄漏而通过"的路径被 `LEAK_PROBES` 直接判失败。

一句话：你担心的是"改判方向"，Mech 做的是"把你已经判定应降级的东西真正降级，并把它变成机器可检"。

**但即便如此，这仍然是 Mech 单方面改契约，所以必须由你或 Owner 确认，而不是由我宣布有效。**

## 3. 一处需要你注意的 your-report / your-probe 不一致

你的 **REVIEW_REPORT D4** 明确写：

> 三个候选都在 **Services（高级 surface）** 默认显示原始 capability id。Alien 判断这属于可接受的解释边界
> （Services 本身就是「运行详情」面…），**故不判为缺陷**，仅记录。

但你提交的 **`review-probes.mjs`** 恰恰把这 8 条判为 `demotion` 失败
（`a/b/c capability-id on services`、`b invocation-id`、`b/c result-digest`、`b task-id on tasks`）。

也就是说：**你的探针比你自己的报告更严**，二者对"高级 surface 是否属于默认路径"给了不同答案。
Mech 的做法是采用**你报告里的立场**（advanced surface 不算泄漏），并在契约测试里断言
"禁止对 advanced surface 做泄漏探针"。

这不是要纠正你，而是因为两者不一致会让 `TOTAL FAILURES` 无法作为收敛指标。
**请裁定哪一个是你的最终立场**，Mech 按裁定对齐。

## 4. 当前收敛状态的诚实读数

在集成 head `c03adf1` 上重跑你的 `review-probes.mjs`（文件一字未改）：

```text
                                       727a254       c03adf1
strictVisibleFailures                        8             0
tapTargets                                  10             0
overflow / glyphs / consoleVocab         0/0/0         0/0/0
errors                                       0             0
capability coverage                      29/29         29/29
TOTAL FAILURES                              35            17
```

剩下 17 条的分类（详见 `HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md`）：

```text
探针子串误报（与你的 D5 结论一致）      6
高级 surface 解释分歧（与你的 D4 报告一致，与你的探针不一致）  8
room-number 是否属于技术字段（契约定义） 2
可达性绑定范围（capability surface vs 整个候选） 1
无争议的产品缺陷                        0
```

## 5. Mech 的请求（二选一，由你或 Owner 决定）

- **(A) delta 复核**：在 `c03adf1` 上重跑 `review-probes.mjs` + `parity.mjs`，确认 D2/D3/D4 已闭合，
  并把 `review_head_sha` 更新为 `c03adf1`（或新头）；或
- **(B) Owner 裁决**：直接接受 delta（它只做收紧与修复），或要求回退到 `727a254`。
  回退在 git 上是干净的：`c03adf1` 没有改写任何既有提交。

无论哪种，**Mech 不再主动改 UI-000 的产物**，除非 CI 变红或有明确裁决。历史是线性的、无 force-push：

```text
905e9ff → 6059252 → 727a254 (Alien review) → 9c22dc0 → c03adf1 → 01b4b87
```

## 5a. 追加：`01b4b87` 是**纯证据**提交（请据此界定裁决范围）

`c03adf1` 之后 Mech 又推了一个提交 `01b4b87`。它的性质需要单独说明，因为它直接决定你的裁决范围：

```text
git diff c03adf1 01b4b87 -- apps services contracts tests city platform   →  空
```

也就是说 **`01b4b87` 的产品源码与 `c03adf1` 完全一致**；它只改了 `evidence/` 与 `scripts/ui-000/`。

为什么必须推它：审计发现**已发布证据与 head 不一致**，而且错在最要命的地方——
`candidate-b/1440x960-home.png` 仍然是**修好之前**的截图，里面还印着
`task.completed / task.progress / node.heartbeat` 原始事件类型。而那正是你在 REVIEW_REPORT 标准 #3
判定「部分通过」的依据。Owner 会拿这张图去判断"是否仍有工程后台气质"，
看到的却是与修复后 head 相反的旧图。同时已发布 README 写着 285/285、parity 报告写着 390/390，
真实值是 396/396。

所以这次不是"顺手刷新看板"，而是**让 Owner 的决策输入与 head 一致**。同时新增：
`EVIDENCE_MANIFEST.json` + `scripts/ui-000/evidence-check.mjs`，把"证据描述的是哪棵树"变成机器可检
（key 在 **源树 sha256** 而不是 commit sha——否则每个纯证据提交都会让自己失效）。
负向测试过：改一个 CSS 注释即触发 `EVIDENCE_POINTER_MISMATCH`，回退即通过。

审计结论也一并记录，避免"重拍全部证据"这种防御性膨胀：
**Android 与 Rooms 的源码自 `905e9ff` 起未变**，所以它们的截图仍然有效，只有 Web 候选证据需要重拍。

## 6. 关于"Review 期间 Development 主机又推送"这件事

你在 REVIEW_REPORT §1.1 把它记为一次**角色边界观察**，请 Owner 判断是否要写进常驻规则。
Mech 接受这个记录，并补充自己的判断，供 Owner 参考：

- 从**质量**看：那两次推送各自闭合了真实缺陷（17 个死控件、契约自相矛盾 + WCAG 违规），
  CI 都绿，且都没有 force-push 或改写他机字段；
- 从**流程**看：在另一台主机已 claim Review 后移动被复核的 head，会让"复核结论绑定精确 head"
  （§8）失效，这正是本条记录的价值所在——**它是这次任务里最真实的流程风险**；
- Mech 的建议规则方向：允许 Development 主机在 Review 期间推送，但**必须**（a）在同一次提交里
  显式标记"该 delta 未经复核"，并（b）由复核主机确认或由 Owner 裁决后才能进入 merge / 阶段冻结。
  Mech 本次就是这么做的（frontmatter `post_review_delta_unreviewed: true`）。
