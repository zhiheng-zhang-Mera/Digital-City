# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_GATE8_WINDOW_RUN_AND_TABLE.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 gate 8：声明窗口已运行，三个界面重叠；表因一项发现 FAILED

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 28b1b0e
```

## 1. 窗口已运行，重叠经过测量而非假设

```text
Alien's declared window   03:42:00Z .. 03:54:00Z
Mech's declared window    ~03:39Z    .. ~03:59Z          (published in RECORD_MECH_GATE8_WINDOW_OPEN.md)
overlap                   yes, and observed live: at 13:45:53 local (03:45:53Z) the City reported
                          android-PERM00 / PERM00,  web-p35glw68 / Alien Web,
                          probe-alien-host / Alien-Host,  web-mech-f8r3wwq7 / Mech-Win-Web
canonical stream          857 events by the end; a task issued every ~20 s for the whole window, so the table
                          cannot converge vacuously (the defect found once already)
```

Mech 对合并的解释正确且应保留：界面只需与窗口**重叠**，不必完全匹配，因为自身范围外的 seq 已报为 `BEFORE_OBSERVATION` / `AFTER_OBSERVATION`。宽窗口无需额外成本，并容纳两主机通过 Git 通信的协调延迟。

## 2. 本主机三个观察来源的表格，原样保留仪器 verdict

```text
surfaces   Alien Web (browser), Alien-Host (desktop probe), PERM00 (Android device)
window     5000 ms
timeline   taken from the SERVER's own table (857 events)
skews      Alien Web=0, Alien-Host=0  (same machine as the reader),  PERM00=586 ms  (measured this run)

Alien Web    CONVERGED x345   OFFLINE_AT_EMIT x5   MISSING x1
Alien-Host   CONVERGED x342
PERM00       CONVERGED x405   OFFLINE_AT_EMIT x33  GAP_DECLARED x3

VERDICT = FAILED
  FAIL seq 505 Alien Web: online surface never observed seq 505
```

两件事同时为真且均重要：

- **收敛测量本身充分**：两台物理主机上的三个独立观察者提供 1092 次测量，全部在 5 秒窗口内；Android 界面现记录**零**静默遗漏（`GAP_DECLARED` 覆盖三项缺口，均来自此前中断且位于窗口外）。
- **gate 未满足**，因为 verdict 为 FAILED，真实未观察的一个 seq 就是失败。仪器拒绝将 `MISSING x1` 忽略为零，表明它正确工作。

## 3. 唯一发现：另一界面上的同类缺陷

`seq 505` 在网络中断与浏览器 socket `close` 触发之间发出，当时尚无陈旧信号。这正是 Android app 已修复的 R1 类型；浏览器界面没有对应 Android gap 自声明的机制，因此合并只能将其称为 `MISSING`。

已在 `mesh301-web-surface.mjs` 修复：页面现比较连续 `seq`，与 Android app 一样写入 `gap`。**重点是 parity，不是单个 seq**：若三界面采用三种自报告标准，收敛表就不成立。

## 4. 应独立记录的第二发现：已声明时钟偏移会过时

```text
PERM00 skew measured in the previous round   592 ms
PERM00 skew measured this round              586 ms
```

偏移会**漂移**，一次声明后复用的数字会逐渐失真，并在延迟列中静默漂移。因此任何表必须声明**与其判定 receipt 同轮实测**的偏移，本表正如此。Mech 的 `--skew` 缺陷与此发现是从两方向揭示同一风险：仪器不得呈现未经刚刚核验的假设。

## 5. gate 8 仍缺的确切内容

**Mech 行。** `Mech-Win-Web` 在窗口内，但 receipt 文件不在此 checkout。Mech 记录表示会在收尾记录发布从服务器*及*界面自身 receipt 读取的精确开关 seq。receipt 到达后即可作为第四行合并，无需重跑：

```text
node scripts/mesh301-mesh-probe.mjs merge --window 5000 \
  --skew "Alien Web=0" --skew "Alien-Host=0" --skew "PERM00=586" --skew "Mech-Win-Web=<measured>" \
  alien-web.jsonl alien-host.jsonl android-perm00.jsonl mech-web-window.jsonl
```

## 6. gate 状态

```text
 2/3/4/5/7   MET
 6           live City 8/8; Mech reproduced the offline-target control 10/10 on its own worker and made
             endpoint A reversible, which is its own instrument rather than mine
 8           NOT MET - all three overlapped one window for the first time, the table resolved 1092
             observations inside the window, and the verdict is FAILED on one seq that is now repaired.
             A re-run with the browser fix, plus Mech's row, is what closes it.
 9           MET on re-convergence; the pre-stale policy question remains the Owner's to read
10-14        NOT STARTED
```

此轮的诚实结论：**调度问题已解决，表仍需完成一项修复后的核验才完整**；报告为 FAILED，而非附脚注的 PASS。
