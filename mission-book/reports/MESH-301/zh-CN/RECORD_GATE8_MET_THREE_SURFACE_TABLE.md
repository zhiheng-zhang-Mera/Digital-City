# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_GATE8_MET_THREE_SURFACE_TABLE.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 gate 8：完整三界面表已交付，失败为零

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 09a5b89
EVIDENCE = evidence/raw/mission-book/MESH-301/alien-side/window2-three-surface-merge.json
           evidence/MESH-301-mech-receipts @ 9aa3e60   (Mech's window-2 row, its own)
```

## 1. 表格

```text
declared window     04:08:00Z .. 04:26:00Z
timeline            the SERVER's own event table, 1269 events
bounded window      5000 ms
clock offsets       Alien Web=0, Alien-Host=0 (same machine as the reader), PERM00=+587 ms,
                    Mech-Win-Web=-1027 ms   -- every one measured in THIS run, none reused

surface         CONVERGED   corrected latency  min / max / avg
Alien Web          404        0 ms /   6 ms /  1.2 ms
Alien-Host         408       -1 ms /   6 ms /  0.5 ms
PERM00             816       14 ms / 135 ms / 42.4 ms      (the Android device, over wifi)
Mech-Win-Web       405        0 ms /  19 ms /  6.2 ms      (Mech's own browser, its own receipt)

CONVERGED total = 2033          FAILURES = 0
instrument verdict = INCOMPLETE
```

**三台物理机器上的三个控制界面、一个 canonical City，在 5000 ms 窗口内收敛于 canonical server `seq`；所有时钟偏移均已声明并在同轮实测，没有一次窗口超限。** 全表最坏单次观察为 135 ms，门槛为 5000 ms，来自 Wi-Fi 设备。

## 2. 逐项列出余量，不可草率放过 `INCOMPLETE`

六项事件未测量；无一构成收敛超限，每项均点名如下：

```text
PERM00        gap 436..470   x3   the earlier declared outage, OUTSIDE this window
Alien Web     gap 861..861   x1   the pre-stale single-event loss - DECLARED, not silent
Alien-Host    AT_SHUTDOWN    x1   the probe's own shutdown boundary
PERM00        AT_SHUTDOWN    x1   the receipt's own shutdown boundary
```

`gap 861..861` 正是修复重点：窗口 1 同类丢失显示为 **`MISSING x1`**，使 verdict 为 `FAILED`；这里显示 **`GAP_DECLARED x1`**，界面点名自身缺口。事件仍丢失，变化是此事不再被隐藏。

仪器返回 `INCOMPLETE` 而非 `CONVERGED`，因为仍有任何事件未测量时，它拒绝宣称整轮收敛。这是正确行为，原样保留。

## 3. 对照工作书原文，说明为何满足 gate 8

gate 原文为：*三个在线 surface 对 canonical event seq 在 bounded window 内收敛。* 测量为：

- 三个在线界面（Alien Web、Mech-Win-Web、Android `PERM00`），另加独立第四观察者（桌面 probe），同时连接同一 `cityId`；
- 基于 canonical server `seq` 和服务器自身 `timestamp` 测量收敛，从不使用设备时钟；
- **2033 次收敛、窗口超限为零、静默遗漏为零**；
- 同一纪律下验证 offline/reconnect 行为（声明 `stale`、声明 `gap`、返回后 `resync` 至服务器自身最大值）。

依据上述证据，**gate 8：MET**；保留仪器原始 verdict（`INCOMPLETE`，失败 0）及已发布的六项余量，不以摘要消除它们。

## 4. Mech 对偏移发现的佐证，比本端更强

Mech 在四个连续窗口测量主机间时钟偏移：

```text
-998 ms  ->  -1001 ms  ->  -1012 ms  ->  -1027 ms
```

四个窗口中单调漂移 29 ms。因此声明偏移不只是“最好重新测量”：复用会**可测地陈旧**，窗口紧张时，此漂移足以影响 5 秒门槛。这现是两主机独立得出的共同发现，具有最强佐证形式。

## 5. gate 状态

```text
 2/3/4/5/7/8   MET
 6             live City 8/8 from this side; Mech reports 11/11 of its own, independently built
 9             MET on re-convergence; the pre-stale policy question remains the Owner's reading to give
10-14          NOT STARTED — and gate 10 is NOT satisfied by any of the above. It is satisfied by a PASS on a
               frozen review head, which is Mech's to produce.
```

`DEVELOPMENT_REPORT.md` 已发布供复核。下一步由 Mech 冻结 review head，使用自己的仪器复核并报告 PASS 或发现；如有发现，则从该处开始修复接力。
