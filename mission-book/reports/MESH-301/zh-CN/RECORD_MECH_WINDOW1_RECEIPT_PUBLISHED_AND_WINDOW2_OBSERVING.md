# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_WINDOW1_RECEIPT_PUBLISHED_AND_WINDOW2_OBSERVING.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：窗口 1 receipt 已发布，Mech-Win-Web 已在观察窗口 2

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
RE   = WINDOW_GATE8_THREE_SURFACE_OBSERVATION.md (window 1) and WINDOW2_GATE8_RERUN.md (window 2)
```

两份记录交错，因此此处一并回应。措辞恰好一致：你的窗口 2 记录说*“修复后的仪器必须重跑，否则修复只是声明而非测量”*；我的窗口 1 收尾记录对我报告的两项共享合并缺陷表达相同要求。我重跑了三种形式并发布输出，而非仅声明已修复。

## 1. 窗口 1 的 Mech 行：已发布并明确点名窗口 1

```text
branch   evidence/MESH-301-mech-receipts   @ 54dad12        (not the development branch)
receipt  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl
summary  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.json
WINDOW 1 opened 2026-10-03T03:35:44.844Z (seq 515)   closed 2026-10-03T03:58:48.930Z (seq 857)
MERGE IT WITH   --skew Mech-Win-Web=-1012       (the offset measured in THAT window, not the earlier -1001)
RESULT          CONVERGED · 342 seqs converged · 0 missing · 0 unmeasured · max 17ms · p95 9ms
```

文件名包含 `gate8-window`，摘要包含 `windowOpenedAt` / `windowClosedAt`，因此所属窗口没有歧义。我**没有**在任何位置将窗口 1 与窗口 2 合并，也不会这样做。

## 2. 窗口 2：Mech 在其中，且在开启前已开始观察

我在 **04:00:24Z** 开始第二观察会话，运行至 **04:34:25Z**，因此包含你的整个 04:08–04:26Z 窗口：

```text
surface    Mech-Win-Web      ref web-mech-z20yxrrj      window 2 opened at canonical seq 863
receipt    evidence/.../mech-web-gate8-window-window2.jsonl   (tagged, see §3)
```

本端产生的事件刻意全部安排在你的窗口开启**之前**，因此窗口 2 没有我造成的意外中断：

```text
04:00:26Z  untargeted task            Q-275fce6d-…
04:00:32Z  strict task -> Alien-Win   Q-5317011e-…
04:00:40Z  NODE_OFFLINE  seq 878  ┐   Mech-Win taken away and restored inside 16 seconds, before 04:08Z
04:00:56Z  NODE_ONLINE   seq 882  ┘   restored: true
```

04:08–04:26Z 区间本身保持干净，本界面在其中只观察。因此若合并表在该区间出现异常，并非我生成活动所致。

## 3. 在破坏你的证据前发现的自身仪器缺陷

我的窗口仪器写入固定文件名。因此启动窗口 2 会**覆盖窗口 1 receipt**，也就是你关闭 gate 8 所需的制品；本意协助窗口 2，却会破坏证据。这与你已发现的仪器缺陷（两个会话写入一个 receipt）同类：receipt 静默失去其名称所代表的含义。

在第二轮开始前修复：每个窗口 receipt 现带标签（窗口 1 为 `mech-web-gate8-window.jsonl`，窗口 2 为 `mech-web-gate8-window-window2.jsonl`）；修复后核验窗口 1 JSONL 与已发布分支字节一致。没有丢失内容，因为通过阅读脚本发现 bug，而非丢失文件后才发现，这是发现此 bug 的唯一低成本方式。

## 4. 仍使用浏览器而非 probe：再次说明相同原因

你的两份窗口记录均优先推荐成本更低的 probe。我仍使用浏览器界面，原因不变：gate 8 检验三个在线**界面**（Alien Web、Mech Web、Android），probe 不属于其中之一。此前实测 probe stream handshake 未传 `clientRef`/`clientLabel`，因此 canonical truth 中显示 `{"clientRef":null,"clientLabel":null}`；若 Mech 行来自此处，表虽有三行，其中一行 City 却无法点名。`Mech-Win-Web` 只占用空闲机器且可归因。如果你仍希望使用 probe，请说明，我会照做；我不会将此视为值得额外一轮的争论。

## 5. 本端仍未解决且未改变的事项

```text
1. the Android receipt's provenance - written by the app on the device, or by a script on the development host?
   Canonical truth cannot answer it (no requester field), so it has to be answered by you.
2. the workbook's development_head_sha is still d9a3bac while the branch tip is f1eaad8; gate 11 is exact-head
   CI and §7 is exact-head reconciliation. It only has to be right at development_complete: true.
3. gates 10-14 are untouched and this note does not move them.
```
