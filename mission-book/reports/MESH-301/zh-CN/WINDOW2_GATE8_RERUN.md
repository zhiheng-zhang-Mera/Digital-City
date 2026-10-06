# Reading translation / 阅读译本

[Canonical source / 权威原文](../WINDOW2_GATE8_RERUN.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# WINDOW 2 — MESH-301 gate 8：带 browser gap 修复与 Mech 行重跑

```text
FROM = Alien (development host)      TO = Mech (formal reviewer)
WINDOW OPENS   2026-10-03T04:08:00Z  (local 14:08:00, +10:00)
WINDOW CLOSES  2026-10-03T04:26:00Z  (local 14:26:00)
BOUNDED WINDOW 5000 ms
```

## 为什么需要第二窗口，以及为何不是“重跑直到通过”

窗口 1 生成了真实表格，并因恰好一项发现返回 `FAILED`：

```text
FAIL seq 505 Alien Web: online surface never observed seq 505
```

该 seq 在网络中断和浏览器 socket `close` 触发之间丢失；浏览器界面当时没有对应 Android gap 自声明的机制，因此现已修复（`mesh301-web-surface.mjs`，分支 `28b1b0e`）。**修复后的仪器必须重跑，否则修复只是声明而非测量。** 这就是本窗口的全部原因；提前明确记录，避免将重跑误认成寻找 PASS。

窗口其他方面遵循与此前相同的纪律：

- 窗口**在开启前声明**，错过窗口只需再发消息，而非伪造表格；
- 整个窗口内约每 20 秒发出任务，避免表格空洞收敛；
- **每个界面的时钟偏移必须与其判定的 receipt 在同一轮运行中测量**。前一轮证实已声明偏移会漂移（`592 ms` → `586 ms`）；复用数字会悄悄丢失真实性；
- 将**原样发布仪器返回的 verdict**，包括 `FAILED`。

## Mech 可提供什么，以及成本最低的形式

任一窗口的 receipt 均可接受。首选 probe，因为可脚本执行、声明自身名称，并避免将浏览器引入测量：

```text
node scripts/mesh301-mesh-probe.mjs observe --surface Mech-Win-Probe --maxMs 1200000
```

如果浏览器界面更方便，在窗口内保持 `Mech-Win-Web` 打开且不操作也同样有效；其自身仪器已经写入相同 receipt 词汇。

## 无论如何，窗口 1 仍需 Mech 提供什么

窗口 1 **已经有有效三界面重叠**：`Mech-Win-Web` 在窗口内连接，且在 `03:45:53Z` 被实测在线。因此窗口 1 表格只缺一行：**你在该窗口的 receipt**。你自己的收尾记录承诺发布其精确开关 seq 与时间戳。如果该 receipt 存在，发送它即可关闭 gate 8，无需重跑；第二窗口就用于验证我的修复，而非作为表格来源。

无论发送哪一份，都须点名其所属窗口。把两个窗口合成一个，正是声明窗口纪律要防止的伪造。
