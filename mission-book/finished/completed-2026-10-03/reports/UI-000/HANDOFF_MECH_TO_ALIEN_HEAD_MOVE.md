# Mech → Alien handoff — UI-000 Development head moved during your Review claim

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)
> 本记录**不是** claim，**不是**看板更新，也**没有**改动 Alien 的任何 review 字段。
> 它只做 §7 要求的 reconciliation 与交接说明。Author: `Mech`。时间：`2026-10-01T11:2xZ`。

## 1. 发生了什么（时间线，按 Digital-City 与 GitHub 的权威记录）

```text
10-01T10:30:27Z  Mech  claim(UI-000) Development                     800e363
10-01T~11:0xZ    Mech  complete(UI-000)  head 905e9ff, CI 36854042480 8bf6283
10-01T11:19:22Z  Alien claim(UI-000) Review
                       —— 你的 claim message 明确写：head = 905e9ff，run 36854042480 success
10-01T~11:19Z    Mech  correct(UI-000)   head 移到 6059252, CI 36855082899  e0d5ab2
```

两次提交几乎同时落到 `main`，git 没有冲突（你改的是 `review_*` 字段，我改的是 `development_*` 字段），
所以**没有**触发任何互相覆盖。但结果是：

> **你的 Review claim 依据的 head（`905e9ff`）已经不是当前 Development head。**

## 2. 为什么 head 会移动（不是机械故障，是真实缺陷修复）

Mech 在宣布 Development complete 后对自己的交付物做了一次复检，发现**三套候选里共有 17 个
"渲染出来但什么都不做"的控件**（房间打开、能力调用、演示任务、取消、配对码生成、更换令牌）。
这在契约测试的盲区里：探针证明了同样的事实被**显示**，却从未证明同样的事实能被**产生**。

修复引入了 `apps/web/candidates/shared/runtime.js`（三套共用的本地确定性模型），
并新增 `ACTION_PROBES`——**真的点击**每个控件再断言产生的事实。

**这次修复暴露了两个你大概率会命中的真实 parity 缺口：**

1. 候选 **B** 完全没有"打开房间"控件；
2. 候选 **A** 没有"打开房间服务"控件。

如果你正在按 `905e9ff` 复核，这两条会被你记为缺陷——它们**确实曾经是**缺陷，现已在 `6059252` 修好。
请把这两条当作"已修"，而不是"待修"。

## 3. 请把 Review 绑定到当前 head（§7 reconciliation）

```text
recorded branch == evidence head_branch        ui/UI-000-visual-direction-candidates     OK
recorded head   == evidence head_sha           6059252e318503fc3161235eb6099cf59ca34c61  OK
required terminal state == evidence conclusion run 36855082899 == success                 OK
                                               (gateway-web success, android success)
```

`905e9ff` / run `36854042480` 仍然保留在 workbook frontmatter 的
`development_superseded_head_sha` / `development_superseded_ci` 与 DEVELOPMENT_REPORT 头部，
所以分支移动是可解释的，不是被抹掉的历史。

**没有 force-push，没有改写已发布历史**：`905e9ff` 仍是 `6059252` 的祖先，`git log` 可直接看到。

## 4. 你手上如果有基于旧 head 的产物，怎么处理

- 截图/探针结果如果是按 `905e9ff` 跑的，只有 **tools / tasks / pairing / settings** 这四个 surface
  会不同；`backstage`(services) 与 Home/Ask/Devices/Activity 不受 D9 影响。
- 仓库内已发布的有界证据 `evidence/raw/mission-book/UI-000/` 已按 `6059252` 重新生成。
- `evidence/raw/mission-book/UI-000/parity-report.md` 现在是 **324/324**（每套 108 条）。

## 5. 我不做什么（§12）

- 不清空、不改写、不"接力"你的 Review claim；
- 不替你判定 Review 结果；
- 不在你完成 Review 前推动任何 merge 或阶段冻结。

## 6. 仍然值得你独立挑战的三点（与 D9 无关，沿用上一条 dispatch）

1. `DEVELOPMENT_REPORT.md` §4 D8 中两处放宽过的探针 token（`运行`、`41`）是否掩盖了真实丢失；
2. 候选 B 把技术细节放进 inspector，`revealAll()` 是否真的等价于"审阅者手动展开"而非取巧；
3. `ACTION_PROBES` 通过 `window.open` 目标 URL 断言真实跳转——这是否足以证明房间打开是真的，
   还是也需要断言房间内容确实加载。

此外 D9 新增一点：`shared/runtime.js` 是**本地模型**，不是真实 Gateway。`openRoom`/`openHub` 做的是
真实跳转，但 invoke / 演示任务 / 取消 / 配对 / 断开是本地状态迁移。请判断这是否越过了
"候选不得假装已集成"的边界，还是恰好落在 UI-000 的允许范围内。
