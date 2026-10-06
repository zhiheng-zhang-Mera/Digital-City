# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：撤回 gate-8 暂缓分类。筛选声明窗口后，其中丢失为零；此前警报来自本应先测量的推断

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
WITHDRAWS = RECORD_MECH_INDEPENDENT_GATE8_TABLE_REBUILD.md, section 3, the DEFERRED classification
MEASURED = my own independent-window2-merge.json over the merged four-observer timeline
```

## 1. 此前陈述，以及一条命令显示的事实

我曾将 gate 8 分类为 **DEFERRED**，理由是四个 `GAP_DECLARED` 事件意味着界面仍自报在线时丢失 canonical seq，因此有界收敛声明不够干净。

随后将合并 timeline 筛选到实际受测区间，查找相关状态：

```text
declared window   2026-10-03T04:08:00Z .. 04:26:00Z
entries inside it 376
entries inside it with GAP_DECLARED, MISSING or LATE, for ANY of the four observers:  ZERO
```

六个未测量条目逐项点名如下；我的论证恰恰在这里错误：

```text
seq 436, 437, 438   PERM00       inside a gap the device declared at 03:32:34Z - BEFORE window 2 opened at seq 863
seq 861             Alien Web    inside a gap the surface declared at 04:27:24Z - AFTER the declared window closed
seq 1268            Alien-Host   the probe's own shutdown boundary
seq 1269            PERM00       the receipt's own shutdown boundary
```

**六项中没有一项在测量窗口内。** 我曾断言 pre-stale 丢失在窗口内，但事实并非如此：它是会话边缘的单个 seq，属于声明区间结束后发生的 socket 断开。

## 2. 暂缓分类有两重错误，因此撤回而非换措辞重述

```text
WRONG ON THE FACTS     I claimed the pre-stale gaps were inside the window under test. They are not.
WRONG ON THE READING   I used a surface's SELF-REPORTED status to define "online", and then judged the gate
                       against my definition. The workbook defines it by the condition (5.6: an offline
                       surface need not update live, but must show stale and re-converge), not by what the
                       client believed at the moment. And requiring the client to know instantly that the
                       network died is requiring clairvoyance; requiring a server-side liveness signal would
                       be a new mechanism the workbook does not ask for, and building one to pass a gate is
                       the manufactured work the standing rules forbid.
```

**已撤回。** 按工作书原文，我认为 gate 8 为 **MET**：三台物理机器上的三个界面、一个 canonical City、基于 canonical server `seq` 测得 2033 次收敛，**窗口超限为零，声明窗口内丢失为零**。此前称“没有在线界面超过 5 秒”却仍将 verdict 阻塞，在窗口内并无实质区别；存在的区别位于窗口外。

最终 MET / NOT MET 仍只在针对冻结 review head 的 formal review 中统一陈述一次。本记录仅撤销一项本不应提出的异议。

## 3. 仍保留的事项，未改变且不扩大

```text
1. Alien-Host -1 ms   The declared skew is 0 against a minimum raw of -1, so 40 seqs in window 2 and 41 in
                      window 1 are reported at -1 ms. It is the shape of the defect we already fixed once (a
                      number that cannot be a latency, displayed in the latency column), the magnitude is 1 ms,
                      and it changes no verdict. Either declare -1 or have the merge refuse a negative latency.
                      NOT a re-run request.
2. Pre-stale boundary This is a real policy question and it remains the Owner's: should the boundary be drawn
                      by the City (server-side liveness) rather than by the client's discovery of its own
                      disconnection? What I withdraw is calling it a gate-8 blocker. It is a hardening item.
3. Android provenance Unchanged and still open: was the Android receipt written by the app on the device or by
                      a script on the development host? Gate 4's issuing-surface identity rests on it, and
                      canonical truth cannot corroborate it (no requester field).
```

## 4. 记录教训，因为这是本任务第二次出现

第一次是未命名 control surface：我把 `{"clientRef":null,"clientLabel":null}` 当作泄漏的陈旧条目，测试后才发现它是活跃匿名客户端，而且列表维护正确。这次我未先筛选到被判定区间，就将六项 `unmeasured` 当作 gate blocker。

两次警报都在仅需一条命令的测量下消失，模式相同：**用会话性质推断窗口性质。** 会话余量不是窗口余量；receipt 的剩余项列表也不是其声明区间的证据。此后我将先筛选声明区间，再描述其性质。诚实记录应是复核者先产生两次误报，再作此纠正，而非强调纠正及时。
