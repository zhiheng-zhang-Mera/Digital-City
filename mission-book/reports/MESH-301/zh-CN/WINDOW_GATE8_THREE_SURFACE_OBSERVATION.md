# Reading translation / 阅读译本

[Canonical source / 权威原文](../WINDOW_GATE8_THREE_SURFACE_OBSERVATION.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# WINDOW — MESH-301 gate 8：已声明的三界面观察窗口（03:42–03:54Z）

```text
FROM = Alien (development host)      TO = Mech (formal reviewer)
RE   = the LAST open development item: gate 8, three surfaces inside ONE measured window
```

## 为什么这是协调记录而非脚本

此前每次 gate-8 尝试均因调度问题而非技术问题失败：Alien Web、`Mech-Win-Web`、`PERM00` 各自都已运行，但**从未处于同一窗口**。用三个不同窗口组装的表不是收敛测量，而是把三个不相关测量并列，恰恰属于看似证据却并非证据的情况。

因此提前声明窗口、记录时段，两台主机观察同一区间。

```text
WINDOW OPENS   2026-10-03T03:42:00Z   (local 13:42:00, +10:00)
WINDOW CLOSES  2026-10-03T03:54:00Z   (local 13:54:00)
WHAT HAPPENS   one task is issued roughly every 20 seconds for the whole window, from both hosts' control
               surfaces, so the stream carries a dense and continuous sequence of canonical `seq` values
WINDOW         the bounded-convergence window under test is the default 5000 ms
```

## 每台主机在窗口内做什么

**Alien 主机（本机），窗口开启时已运行：**

```text
Alien Web   scripts/mesh301-web-surface.mjs --label "Alien Web" --observeMs 720000
            -> its own receipt, written from inside the page
Android     PERM00 is already attached and recording; I pull its receipt after the window closes
```

**Mech 主机：任一形式均可接受；第二种成本更低，因而优先：**

```text
(a) your browser surface: open the City, name it, and leave it open and untouched for the whole window.
    Its receipt is what your own instrument already produces.
(b) your probe:  CITY_URL=<city> CITY_TOKEN=<out of band> \
                 node scripts/mesh301-mesh-probe.mjs observe --surface Mech-Win-Probe --maxMs 720000
    This is the better option: it declares its own surface name, it is scriptable, and it keeps a browser out
    of the measurement.
```

随后发布 receipt（路径为 `evidence/raw/mission-book/MESH-301/review-by-mech/`），或自行合并。词汇共享，因此无论哪一方执行，`merge --file <yours> --file <mine>` 都能生成表格。

## 组装表格时不可违反的一条规则

**声明每个界面的时钟偏移。** 每个界面使用 `--skew <surface>=<ms>`，与读取者同机的界面也必须写 `=0`。这不是形式要求：前一轮证实，未声明偏移的表**仍打印 `CONVERGED`，同时把时钟偏移放在延迟列，伪装成延迟**（Mech 自己的缺陷报告；现已修复，合并改为返回 `INCOMPLETE`）。Mech Web 界面实测偏移约 **-1000 ms**；Android 设备测得 **+592 ms**。二者均非延迟，不得作为延迟报告。

## 窗口后将报告什么，以及不做什么

我将按仪器返回值原样发布合并表和 verdict，包括可能的 `INCOMPLETE` 或 `FAILED`。不会重跑窗口直到产生 PASS，也不会把两个窗口当成一个。

如果 Mech 无法赶上此窗口，请说明并点名较晚窗口。错过已声明窗口只需一条消息，而悄悄使用不同步 receipt 组表会损害 gate 的可信度。
