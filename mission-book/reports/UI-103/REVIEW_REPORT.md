# UI-103 — Rooms 统一视觉与嵌入体验 · REVIEW REPORT

> 常驻规则：[../../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)
> 工作书：[../../ui-civilization/UI-103-Rooms统一视觉与嵌入体验.md](../../ui-civilization/UI-103-Rooms统一视觉与嵌入体验.md)
> Review Host：`Alien`（Development Host 为 `Mech`，§3 双机独立成立）
> 复核结论头：`dcde3afe958577a470ee6a0e6f08e819c9d0d19f`　CI：`36871415675` success
> 复核对象：`399a1c118fa0016e7f30ce8f0e3ba01917b39db1`（Mech 的 Development 头）

## 1. 复核方式：自写探针，不复用作者工具

§3 禁止用「重复作者自己的测试」来签字。因此本轮新增
`scripts/ui-103/review-alien-probe.mjs`，它**不是** `scripts/ui-103/verify-hub.mjs` 的改写，而是对着
工作书原文与实际页面写的，并把**真实对比度算术**放在首位——这是本项目上一次复核用事实证明
「没有对比度检查的探针会把系统性 WCAG AA 失败放过去」之后必须补上的一课。

探针逐文本节点计算：相对亮度 → 向上遍历祖先求实际背景色 → 按元素字号/字重取正确阈值
（4.5:1；大号文本 3:1）。

## 2. 结论（`399a1c1`，全部实测）

```text
十间房间全部真实挂载          nodes 23–58，controls 4–21，无 error banner
WCAG AA 对比度失败            0（十间房间全部）
默认路径上的开发工具文案       无（无 127.0.0.1 / .runtime-rooms/ / ROOM PACK / LOCAL ·）
几何字符当图标                无
横向溢出                     1440 无；390 抽测三间无
页面错误                     无
repo 套件                    854/854
rooms 套件                   69/69
hosted CI                    36871415675 success（android + gateway-web）
```

**0 对比度失败**这一点独立确认了：UI-000 C2 复核期间做出的 AA 修复被**真正带进了 hub**，
而不是停在候选面。这正是「一次修复必须在每个下游重新验证」的实例。

**结论：Review 通过，无需修复。**

## 3. 一次必须记录的方法论事故：探针差点冤枉了作者

本探针**第一次运行**报告每间房间都泄漏 `ROOM PACK` / `LOCAL ·` / `127.0.0.1`，且没有任何对比度数据。

**那是错的。** 原因：我启动的 hub 以 `EADDRINUSE` 失败——上一轮会话遗留的一个
`apps/rooms/hub/server.mjs` 仍占着 4320 端口（已定位 PID 并终止）。因此探针读到的是**另一个构建**。

处置：
1. 定位并终止占用进程；
2. 从 UI-103 的 worktree 重新启动 hub；
3. **先验证被服务的样式表确实是复核对象**（必须含有 C2 token `8b82a8` 与 `c6f24e`）再取结论；
4. 只有这一次的运行结果被采信。

记录理由：如果我把第一次结果报上去，就是对 Mech 工作的**假指控**——而我在 UI-000 阶段刚刚批评过
别人的探针会产生假阳性。**复核工具必须能证明它在看被复核的那个产物**；这一条本轮补上了。

## 4. 上游遗留：`pending_seam` 不属于本任务

UI-103 的 frontmatter 记录了一条 `pending_seam`：

> `apps/web` 的 `terminal.js` 房间 iframe 必须给 hub URL 追加 `?embedded=1`；机制由 Rooms 侧提供并验证，
> **消费端属 UI-101**。

该接缝在 `apps/web`，超出 UI-103 边界，**本报告不对它背书**。Alien 已在 UI-101 分支上把它作为后续增量
处理（`deferred != passed`）。

## 5. 披露

- 未修改任何 UI-103 产品代码——本轮确实没有发现需要修复的缺陷；
- 未改写 Mech 的 Development 字段；未 force-push；
- 390px 只抽测了 knowledge / data-lab / checklist 三间（其余七间为 1440 全量），属**抽样**而非全覆盖，
  如实标注；
- 探针只做读操作与截图，不写入 hub 数据。
