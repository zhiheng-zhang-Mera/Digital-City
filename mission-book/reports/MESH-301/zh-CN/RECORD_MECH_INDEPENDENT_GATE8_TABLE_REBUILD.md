# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_INDEPENDENT_GATE8_TABLE_REBUILD.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：从原始 receipt 重建两张 gate-8 表，精确复现 verdict；gate 8 当时取决于裁决而非测量

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
RE   = alien-side/window1-*.jsonl, window2-*.jsonl and their merges (branch mesh/MESH-301-three-end @ 5611e4b)
```

不是为你的报告签字背书：我读取**原始 receipt**，加入**自己的行**，自行计算偏移并运行合并，然后比较。

## 1. 重建精确复现原表

```text
WINDOW 1   files: window1-alien-host + window1-alien-web + window1-android-perm00 + my mech-web-gate8-window
           skews: Alien-Host=0  Alien Web=0  PERM00=586  Mech-Win-Web=-1012
MY VERDICT      FAILED      failures 1     CONVERGED 1434
YOUR VERDICT    FAILED      failures 1     CONVERGED 1434
SAME FAILURE    seq 505  "Alien Web: online surface never observed seq 505"

WINDOW 2   files: window2-alien-host + window2-alien-web + window2-android-perm00 + my window-2 row
           skews: Alien-Host=0  Alien Web=0  PERM00=587  Mech-Win-Web=-1027
MY VERDICT      INCOMPLETE  failures 0     CONVERGED 2033   GAP_DECLARED 4
YOUR VERDICT    INCOMPLETE  failures 0
```

verdict、失败项、收敛数量均相同。第三方从原始 receipt 重建表并得到同一答案的可复现性，使其成为证据而非截图；现在已满足。（我的 `unmeasured` 为 416，你的为 415；多一项是自身行的 shutdown boundary，不影响判断。）

## 2. 窗口 2 逐界面的四行

```text
surface        n     min  median  p95   max    negatives
Alien Web      404    0      1      3     6       0
Alien-Host     408   -1      0      2     6      40
PERM00         816   14     22    119   135       0
Mech-Win-Web   405    0      6     13    19       0
                                  window under test: 5000 ms
```

两项应仔细读取：

- **我的行与自身单界面合并结果精确到毫秒一致**：405 seq，本次最大 19 ms，另一处亦为 19 ms，使用不同调用、不同文件集合计算。两条路径内部一致。
- **`Alien-Host` 带 40–41 项负延迟。** 这不是延迟，而是该界面的声明偏移低了 1 ms。不变量为 `declared offset <= min(raw)`，其余界面均满足（`Alien Web` 0 <= 0，`PERM00` 586 <= 602，本端 -1012 <= -1012）。`Alien-Host` 原始最小值 **-1**，却声明 0，因此窗口 2 的 40 seq、窗口 1 的 41 seq 被报为 -1 ms。大小不重要，形式正是双方已修复过的风险：不可能是延迟的数字出现在延迟列，且合并 `latency <= window` 检查接受它。可声明 `Alien-Host=-1`（所有延迟 >= 0），或让合并拒绝负延迟。**不要求重跑**，它不改变任何 verdict，也不要求另开窗口。

## 3. gate 8 当时真正取决于什么，而非测量

窗口 2 表因两个原因 `INCOMPLETE`，两者均**不是**界面窗口超限：

```text
4   GAP_DECLARED   events lost between the network dying and the socket's close firing - declared by the
                   surface after your R1 repair, where window 1 lost one of these SILENTLY (seq 505, FAILED)
2   AT_SHUTDOWN    the probe's own start/stop boundary, which a bounded run cannot measure
34  OFFLINE_AT_EMIT  emitted while a surface was provably offline
0   LATE           no online surface breached the 5 s window anywhere in either window
```

因此 Owner 须回答的正是此前已升级的问题，本端不会代答：**界面认为自身在线，却在任何陈旧信号出现前丢失事件时，该界面是否“在有界窗口内收敛”？**

```text
READING A (workbook 5.6 read by behaviour) an offline surface need not update live; it must show stale and
          re-converge. The gap is declared, the surface re-synced to the server's max seq, and no online
          surface breached the window  ->  gate 8 is MET.
READING B (workbook 5.5 read strictly)    a surface that reports itself ONLINE is an online surface; the lost
          seqs were emitted while it claimed to be online, so it did not converge on them  ->  gate 8 is NOT MET
          until the boundary is the City's to draw (a server-side liveness signal) rather than the client's.
```

因此**本复核对 gate 8 的分类为 DEFERRED，既不是 MET，也不是 NOT MET**；按既有规则，暂缓不是 PASS。在 head 冻结前记录，区别在于依据证据判定 gate 8，还是悄悄选一种读法并称其为测量。

## 4. 已确立与未确立的事项

```text
ESTABLISHED  both gate-8 tables are reproducible by a third party from the raw receipts; the window-1 silent
             miss is real, is the only failure, and your repair converts it to a declared gap in window 2;
             no online surface breached 5 s in either window; my row is in both tables and agrees with itself.
NOT          gate 8's verdict, which is the Owner's ruling in section 3.
NOT          anything about gates 10-14. development_complete is still false and review_host is still null.
NOT          the Android receipt's provenance (app on the device, or a script on your host) - still open, and
             still the one part of gate 4 that canonical truth cannot corroborate.
```

## 5. 已发布

```text
branch  evidence/MESH-301-mech-receipts @ 1d2b159
  evidence/raw/mission-book/MESH-301/review-by-mech/independent-window1-merge.json
  evidence/raw/mission-book/MESH-301/review-by-mech/independent-window2-merge.json
  ... plus window 1's row, window 2's row, the negative controls and the verification of your merge repair
```

任何人可对开发分支已有 receipt 重跑第 1 节两条命令，得到相同两个 verdict；这正是发布输入而非仅结论的目的。
