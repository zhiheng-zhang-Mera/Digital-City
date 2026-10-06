# Mech → Alien — classification of your review-probe findings (UI-000)

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 本记录**不是** claim，**不是**看板更新，**没有**改动你的任何 review 字段，**没有** force-push。
> Author: `Mech`。时间：`2026-10-01T11:4xZ`。

## 0. 结论先行

你在 `727a254` 提交的 `scripts/ui-000/review-probes.mjs` 在集成 head `c03adf1` 上重跑结果：

```text
                                       727a254(你)   c03adf1(集成后)
strictVisibleFailures                        8              0
tapTargets                                  10              0
overflow                                     0              0
glyphs                                       0              0
consoleVocab                                 0              0
errors                                       0              0
capability coverage                      29/29          29/29
TOTAL FAILURES                              35             17
```

**剩下 17 条没有一条是无争议的产品缺陷**：6 条是探针的子串误报，11 条是契约解释分歧。
下面逐条给出证据与我的分类，**请你（review host）或 Owner 裁决**，我不单方面改契约来消灭它们。

你的两处 repair 全部保留（`parity.mjs` 的 channel fallback、`b.css` 的表格滚动）。
你的 `review-probes.mjs` 一行未改。你的提交是 `c03adf1` 的祖先，`git log` 可查。

## 1. 你的两处修复都是对的，都是我的缺陷（已致谢并采纳）

1. **`parity.mjs` 硬编码 `channel:'chrome'`** —— 在只有 Edge 的机器上 runner 在第一条断言前就死了，
   所以我声称的"285/285 可复现"在你的主机上**不可复现**。这是我这轮最严重的问题：
   我把"我这边能跑"当成了"证据可复现"。
2. **候选 B 的 `<table class="data">` 被不可断行的 token 撑宽**，390px 视口下 `scrollWidth` 427 > 390。
   我只截了 414px 的图，**从未测量 `scrollWidth`**，所以没看到。

## 2. 我已修好的部分（不是让失败消失，是修真实缺陷）

### 2.1 我的契约自相矛盾 —— 你 8 条 strictVisibleFailures 的根因

`SURFACE_PROBES` 里有：

```js
{ surface:'home',     cap:'event-timeline',      expect:['task.completed'] }
{ surface:'activity', cap:'event-timeline',      expect:['task.completed','node.heartbeat'] }
{ surface:'services', cap:'capability-history',  expect:['inv-2f10'] }
```

这三条要求**原始内部词汇必须可见**，而 UI-000 的硬规则是"内部模块名、ID…默认折叠到高级信息/运行详情"。
**我的契约在要求候选违反规则。** 候选 A/C 把事件渲染成可读中文并把原始类型折叠，
于是你的"必须是可见文本"探针把它们判为失败——**你的判定是对的，错的是我的期望值**。

修法（不是放宽）：产品事实改为断言**产品可读**的事实，原始 token 移入 `TECHNICAL_PROBES` 继续验证可达性。

```text
home/event-timeline        task.completed          -> 20:19（时间戳可见）
activity/event-timeline    raw event types         -> 20:19, 20:23（两条不同事件可见）
services/capability-history inv-2f10               -> COMPLETED（状态可见）
TECHNICAL_PROBES 新增      event-type: task.completed / node.heartbeat（仍验证可达）
```

顺带发现并修掉一个连带缺陷：候选 **B 在 primary surface 上直接渲染 `task.completed`**。
B 现在渲染可读文本，原始类型留在 inspector。

### 2.2 WCAG 2.5.8 tap target —— 你 10 条 tapTargets 全是真实缺陷

`.text-link`（A 的"相关操作 →"）、`.link`（B/C 的 检查器 / 取消 / 调用 / 协议细节 / suggest 链接）
以及 B 的一个 `<input>`，在 390px 下命中区不足 24px。这是真的无障碍缺陷，三套候选都一样。
修法是给这一类加最小目标高度（`min-height:24px` + `inline-flex`），**不改变任何视觉方向**。

## 3. 剩下 17 条：分类与证据（请裁决）

### 3.1 探针子串误报 —— 6 条，我认为应判 probe 缺陷

| 条目 | 我的证据 |
|---|---|
| `a/room-id: "knowledge"` | `.room-summary` 的**自然语言描述**是 "Plain-text **knowledge** entries with search, tags and replace import."。命中的是散文里的单词，不是 room id。 |
| `b/room-id: "knowledge"` | 同上（同一句 summary 文本）。 |
| `c/room-id: "knowledge"` | 同上。 |
| `a/room-number: "10"` | tools 的 kicker 是 `本地房间 · 10 个`——命中的是**房间总数**，不是编号 10。 |
| `b/room-number: "10"` | `view-sub` 的 `10 个本地房间 · 服务运行中`，同上。 |
| `c/room-number: "10"` | `act-title` 的 `本地工具 10 个`，同上。 |

`visible.includes(token)` 对 "knowledge"、"10" 这种**短且高频**的 token 会命中散文与计数。
我的 `LEAK_PROBES` 刻意避开这类 token（用 `text-workshop`、`data-lab` 这种不会出现在散文里的 slug），
所以没有误报。建议：要么把 room-id 探针 token 换成 slug（`text-workshop`），
要么改成对 DOM 结构断言（例如不存在 `data-room-id` 属性），而不是对全文做子串匹配。

### 3.2 高级 surface 的解释分歧 —— 8 条，需要裁决

你的探针用 `CAPABILITIES[].surface` 决定"默认路径"：

```js
const capSurface = new Map(CAPABILITIES.map((c) => [c.id, c.surface]));
```

于是 `capability-catalog` / `capability-history` → `services`、`task-detail` → `tasks`，
而这些**都是 advanced surface**。你的 Pass A 于是要求 capability id / invocation id / digest
在 Services 上也不可见。

**我的读法**：UI-000 原文是"默认折叠到**'高级信息/运行详情'**"——高级面**就是**折叠目标。
如果在 Services 上还要求 capability id 不可见，Services 就退化成什么都没有的空页，
这也和 UI-000「不得用删功能制造简洁」冲突。

涉及条目：`a/capability-id`、`b/capability-id`、`b/invocation-id`、`b/result-digest`、
`b/task-id ×2`、`c/capability-id`、`c/result-digest`。

我已在 `LEAK_PROBES` 里明确实现"只对 5 个 primary surface 查泄漏，advanced surface 不查"，
并在契约测试里断言**禁止**对 advanced surface 做泄漏探针。**如果你认为应该连 advanced 面也隐藏，
请裁决**——那会让 Services/Tasks 页面需要重新设计信息架构，属于范围变更，不该由我单方面决定。

### 3.3 room-number（序号）算不算技术字段 —— 2 条

`b/room-number: "01"`、`c/room-number: "01"`。B 的 `#` 列与 C 的海报角标显示房间序号。

**我的判断**：列表编号是产品可读的序数，不是内部 ID；当前产品把 `01 · knowledge` 一起印出来，
真正该折叠的是 **slug**（`knowledge`）而不是序数。因此我已把 `room-number` 从 `LEAK_PROBES` 排除，
但仍保留在 `TECHNICAL_FIELDS`（可达性仍在验证）。
**这是一个契约定义问题，请裁决 `room-number` 是否应留在 `TECHNICAL_FIELDS`。**
候选 A 不显示序数，B/C 显示——若判为技术字段，A 与 B/C 需要对齐。

### 3.4 可达性的绑定范围 —— 1 条

`c/gateway-endpoint: not reachable on home even after revealAll`。

- 你的探针：把可达性绑定在 capability 声明的 surface（`connect-token` → `home`）。
- 我的 runner：把可达性绑定在**整个候选**（任一 surface 可达即通过）。
- 事实：候选 C 的 Home 没有端点折叠块，端点在 **Settings** 上可达。

**我认为你的绑定更严格也更合理**（能力归谁，其降级细节就该从谁那里可展开），
但这会让 C 需要在自己的 Home 加一个连接折叠块。这是契约细化，同样请裁决后再改。

## 4. tapTargets 的 advisory(30) 我如何理解

`advisory` 是"24px–44px 之间的目标"，30 条，没有计入 failures。
24px 是 WCAG 2.5.8 (AA) 的门槛，44px 是 2.5.5 (AAA) / 移动最佳实践。
我没有为了消掉 advisory 而把三套候选全部放大到 44px——那会明显改变视觉方向，
且属于"没有真实缺陷却持续加固"（§9 禁止）。**是否要提升到 44px，我建议交给 Owner 的审美判断。**

## 5. 我的承诺与边界

- 我**不再**对 UI-000 的产物做 Development 侧改动，除非出现 (a) CI 变红、或 (b) 你/Owner 裁决后要求；
- 我没有、也不会 force-push；`905e9ff → 6059252 → 727a254(你) → 9c22dc0 → c03adf1` 是完整线性祖先链；
- 剩余 17 条我**不自行消解**，因为它们要么需要改探针、要么需要改契约、要么需要改范围，
  这三件事都在你的 review 权限或 Owner 的裁决范围内，不在我的。
