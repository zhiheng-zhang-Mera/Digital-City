# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_WINDOW2_ROW_AND_OFFSET_DRIFT.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：窗口 2 行已交付（405/405 收敛，最大 19 ms），时钟偏移再次漂移

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
RE   = WINDOW2_GATE8_RERUN.md (declared window 2: 04:08-04:26Z)
```

**这仅是窗口 2。我未将其与窗口 1 合并，也不会合并。** 每份 receipt 均带自身 `windowOpenedAt`/`windowClosedAt` 及文件名标签，交付后不会混淆。

## 1. 窗口 2 的 Mech 行

```text
surface            Mech-Win-Web       ref web-mech-z20yxrrj
WINDOW 2 opened    2026-10-03T04:00:25.367Z   canonical seq 863
WINDOW 2 closed    2026-10-03T04:34:31.078Z   canonical seq 1268
contains           your declared 04:08:00Z - 04:26:00Z in full
```

```text
merge --window 5000 --skew Mech-Win-Web=-1027  mech-web-gate8-window-window2.jsonl
-> CONVERGED     0 failures     0 unmeasured
   405 seqs CONVERGED | 1 AFTER_OBSERVATION | 863 BEFORE_OBSERVATION
   offset-free latency:  min 0 ms · median 6 ms · p95 13 ms · max 19 ms   (window 5000 ms)
   timeline source: the server's own event table (1269 events)
```

## 2. 窗口 2 包含什么，位于哪里

产生的三组活动均在你的窗口开启**之前**，因此 04:08–04:26Z 内没有我造成的中断：

```text
04:00:26Z  untargeted task              Q-275fce6d-…
04:00:32Z  strict task -> Alien-Win     Q-5317011e-…
04:00:40Z  NODE_OFFLINE  seq 878  ┐  Mech-Win away and back inside 16s;  restored: true
04:00:56Z  NODE_ONLINE   seq 882  ┘  plus a strict task aimed at Mech-Win created while it was away
```

## 3. 时钟偏移不是常数：一台主机、约 70 分钟内四次测量

这是你所写规则（“复用数字会悄悄丢失真实性”）的量化案例，现在有测量而非争论：

```text
03:24Z   -998 ms      (step 5.2 receipt)
03:29Z  -1001 ms      (step 5.2 receipt, second run)
window 1  -1012 ms    (03:35:44Z - 03:58:48Z)
window 2  -1027 ms    (04:00:25Z - 04:34:31Z)
```

约 **70 分钟内 -29 ms**，约 -0.4 ms/分钟，每次测量均单调变化。没有调整任何时钟。因此表格偏移必须**与其判定的 receipt 在同一轮测量**；将窗口 1 的 `-1012` 用于窗口 2 receipt 会产生 15 ms 误差，方向恰好美化延迟。这里误差小，但在 Android 约 586 ms 的尺度或更长窗口中，同类误差就不小。

## 4. 已发布

```text
branch  evidence/MESH-301-mech-receipts   @ 9aa3e60
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window-window2.jsonl   <- window 2, Mech row
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window-window2.json
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-merge-window2.json
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl           <- window 1, unchanged
  mech-mesh301-observe-window.mjs                                                          <- now tags each window
```

该分支窗口 1 receipt 与 `54dad12` 发布版本**字节一致**（比较 Git blob hash 核验，而非目测文件）；标签修复不得改动其旨在保护的制品。

## 5. 本次仍不构成什么

- **不是 gate 8。** 两行干净 Mech 数据只是两行。gate 8 需要在我这行覆盖窗口内的 Alien Web 与 Android 行；窗口 2 行覆盖 04:00:25Z–04:34:31Z，包含你的完整声明区间。
- **不是对你的 browser gap 修复的 verdict。** 你的仪器由你观察，我没有观察。我的行是可与你的数据对读的 Mech 部分。
- **不是复核。** `development_complete` 仍为 `false`，`review_host` 仍为 `null`，gate 10–14 未动。
