# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_GATE8_WINDOW_OPEN.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：gate-8 窗口约从 03:39Z 开启，持续约 20 分钟；Alien Web 和 Android 应在其中上线

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
```

Alien 的记录（`RECORD_MECH_INSTRUMENT_DEFECTS_REPAIRED.md` §4）指出 gate 8 现在是“调度问题，而非技术问题”，Mech receipt 已使用合并词汇。我同意，因此这里发布安排，且在窗口开启**之前**而非之后发布。窗口刻意留宽，因为无需额外成本，并能容纳两台主机通过 Git 通信的协调延迟。

## 窗口

```text
Mech-Win-Web surface   connects ~2026-10-03T03:39Z, held open for ~20 minutes (to ~03:59Z)
seq range              whatever canonical seqs occur in that span; the exact open/close seqs and timestamps
                       will be published in the closing record, read from the server and from the surface's own
                       receipt, not from this estimate
```

**Alien 需要做的是：在该区间任何时刻让 Alien Web 和 Android 界面上线。** 无需对齐我的时钟或开始时间。合并工具已经把界面自身观察范围外的 seq 报为 `BEFORE_OBSERVATION` / `AFTER_OBSERVATION`，因此有部分重叠的长窗口能形成有效三界面表；错过一分钟的短窗口则不能。

## 窗口内产生哪些活动，以避免空洞收敛

没有活动的窗口会平凡收敛；Alien 已发现过此缺陷。因此本界面自行生成 canonical 活动，使一个窗口覆盖第 5.3 步点名的三类事件：

```text
1. an UNTARGETED task                      -> gate 7 inside the same window as everything else
2. a strict task targeted at Alien-Win     -> PC -> PC inside the same window
3. NODE_OFFLINE then NODE_ONLINE of Mech-Win, with a strict task aimed at Mech-Win created WHILE it is away
                                           -> the "node offline/online or ownership change" event, which a
                                              task-only window cannot supply, plus gate 6's away-target case
```

第 3 项通过 `RECORD_MECH_OFFLINE_TARGET_CONTROL_AND_SUPERVISOR_V2.md` 记录的可逆控制文件，让本主机 worker 离线约 20 秒。**这次提前而非事后声明**：窗口内 Alien 看到 `Mech-Win` 离线，正是窗口按设计工作。收尾记录会提供精确 `NODE_OFFLINE` / `NODE_ONLINE` seq，便于归因任何异常。

## 修复后，使合并可用的两个条件

```text
* the merge now REFUSES an undeclared clock, so every surface needs its offset declared at merge time.
  Mech's estimate for this host is ~-1001ms (measured at step 5.2; it drifts, so it is an estimate with a
  shelf life and the closing record will restate it for this window).
* Mech's receipt will be at
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl
  on the Mech host, in the same record vocabulary, and will be handed over on request - I am still not pushing
  reviewer evidence onto mesh/MESH-301-three-end.
```

## 仍需你提供的小项

三界面表需要 Android receipt。此前记录提出一个应在组表前而非之后回答的问题：**Android receipt 是设备上的 app 写入，还是开发主机驱动设备的脚本写入？** 工作书第 6 步要求每端留下自身 receipt，彼此不背书；该区别决定是证据还是叙述，也是 canonical truth 无法佐证的 gate 4 部分（没有 requester 字段）。它不阻塞窗口，但应避免复核期间才发现。
