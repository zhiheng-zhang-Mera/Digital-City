# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_GATE8_FOUR_OBSERVER_TABLE.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 gate 8：四观察者表，以及距离 PASS 仍缺的确切事项

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 5611e4b
EVIDENCE = evidence/raw/mission-book/MESH-301/alien-side/**  (my receipts + both merge results)
           evidence/MESH-301-mech-receipts @ 54dad12         (Mech's rows, its own)
```

## 1. 窗口 1：完整表，三台物理机器上的四个观察者

```text
declared window   03:42:00Z .. 03:54:00Z   (Mech's own window 03:39Z..03:59Z overlapped it)
timeline          the SERVER's own table, 1268 events
skews declared    Alien Web=0, Alien-Host=0 (same machine as the reader), PERM00=586 (measured that run),
                  Mech-Win-Web=-1012 (Mech's own measurement, not mine)

Alien Web      CONVERGED x345   OFFLINE_AT_EMIT x5   MISSING x1
Alien-Host     CONVERGED x342
PERM00         CONVERGED x405   OFFLINE_AT_EMIT x33  GAP_DECLARED x3
Mech-Win-Web   CONVERGED x342                                          <- Mech's row, zero misses

CONVERGED total = 1434        VERDICT = FAILED
  FAIL seq 505 Alien Web: online surface never observed seq 505
```

此表具备 gate 要求的全部条件：**三台物理机器上的三个控制界面（Alien Web、Mech-Win-Web、Android `PERM00`）加一个独立桌面 probe，在 5000 ms 窗口内收敛于 canonical server `seq`；每项时钟偏移都已声明并在同一轮实测。** 按 Mech 自己的记录，其行收敛 **342/342**，最坏 17 ms。

**verdict 仍为 FAILED**：1434 项中一项 seq 失败，因为仪器不会将静默遗漏约去。这是正确解释，也是本记录不宣称 gate 已满足的原因。

## 2. 窗口 2：修复后重跑及其证明

仪器修复后若不重跑，修复仍只是**声明**。因此窗口 2（04:08–04:26Z、54 个任务，Mech 界面也在其中）在 browser gap 修复生效后重跑我的三个观察者：

```text
Alien Web    CONVERGED x404   GAP_DECLARED x1   OFFLINE_AT_EMIT x1      MISSING x0
Alien-Host   CONVERGED x408
PERM00       CONVERGED x816   GAP_DECLARED x3   OFFLINE_AT_EMIT x33     MISSING x0

CONVERGED total = 1628        VERDICT = INCOMPLETE  (no failure; only declared gaps and one shutdown boundary)
```

`seq 861` 与窗口 1 导致 `FAILED` 的丢失类型完全相同，现在变为 `GAP_DECLARED`：界面点名缺口，而非静默遗漏。**`MISSING x1` 变成 `GAP_DECLARED x1`，verdict 从 FAILED 变成 INCOMPLETE。** 这就是两轮的全部区别，说明修复起作用。

## 3. 距离 gate 8 仍缺什么

仅一项：**Mech 的窗口 2 行。** Mech 已发布 receipt（`evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl`）覆盖**窗口 1**（`seq 515..857`、343 个事件、`serverMaxSeq=857`），在窗口 1 结束处停止，不能用于窗口 2。Mech 记录称其界面从 `04:00:24Z` 起观察，可覆盖窗口 2；但该事件流尚不是已经发布的文件。

因此待补的是一个文件，而非测量工作：

```text
window-2 Mech-Win-Web receipt  ->  merge --window 5000 \
  --skew "Alien Web=0" --skew "Alien-Host=0" --skew "PERM00=587" --skew "Mech-Win-Web=<its own measured>" \
  window2-alien-web.jsonl window2-alien-host.jsonl window2-android-perm00.jsonl <mech window-2 receipt>
```

如果返回无失败，则 gate 8 在同一声明窗口内全部三界面的干净运行上满足；若仍失败，必须如实保留发现。

## 4. gate 状态

```text
 2/3/4/5/7   MET
 6           live City 8/8 from my side; Mech reports 11/11 independent negative controls of its own
 8           NOT MET, and precisely one file away from being decidable. Four observers converged 1434 times
             in one declared window; the single FAILED seq is repaired and the repair is verified in window 2
 9           MET on re-convergence; the pre-stale policy question is still the Owner's reading to give
10-14        NOT STARTED
```

仪器现在在一个窗口中生成了 gate 所描述的测量，却因一个界面静默丢失一个事件而拒绝 PASS。这两项事实须一起记录：测量充分，但门槛尚未通过。
