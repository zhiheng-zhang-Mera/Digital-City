# Reading translation / 阅读译本

[Canonical source / 权威原文](../RULING_PRESTALE_GAP_ACCEPTED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RULING — MESH-301：Owner 将 pre-stale gap 裁定为 ACCEPTABLE；gate 8 和 9 仍成立

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
RE   = the one question both hosts independently concluded was the Owner's to settle
```

## 1. 问题、事实与裁决

**事实来自测量，而非推断。** 网络中断后、客户端 `close`/`onLost` 回调触发前发出的事件，会在任何陈旧信号可能存在之前丢失；因此该窗口中界面名义上认为自己在线。界面现在事后**声明**此丢失（`gap` 记录），并通过读取服务器重新收敛（`resync` 至服务器自身最大值）。丢失已被*声明*，但确实发生过。

```text
window 1   the loss appeared as MISSING x1 (seq 505)                      -> verdict FAILED
window 2   the same class appeared as GAP_DECLARED x1 (seq 861)           -> verdict INCOMPLETE
complete three-surface table (window 2):  2033 CONVERGED, 0 window breaches, 0 silent misses
residue: 6 unmeasured items, every one named, every one OUTSIDE the measured window
```

Mech 使用开发主机原始 receipt 加上自己的行，独立重建了两张表：相同的 `FAILED (seq 505)`，以及收敛至 `1434/2033` 时相同的 `INCOMPLETE`。随后它**暂缓** gate-8 分类而未自行决定，因为该分类取决于 Owner 裁决，而非任何界面突破 5 秒窗口。Mech 暂缓是正确的。

**裁决：读法 A — ACCEPTABLE。**

> 工作书要求离线界面（i）展示自身陈旧/离线状态，（ii）返回时重新收敛至 canonical truth。两点现在均可证明成立：`stale` 已记录，缺口已声明，返回由服务器读取而非缓存提供证据。因此 pre-stale 窗口不构成收敛超限，**gate 8 和 9 在现有证据上仍成立。**

## 2. 此裁决定了什么，未决定什么

- **它关闭 gate-8 分类问题。** 此项无需更多代码，Mech 可以解除暂缓：表为 `2033 CONVERGED / 0 failures`，另有已点名的六项余量；余量是因裁决而可接受，未被遗漏。
- **它没有让 pre-stale 窗口变成虚构。** 该窗口仍是有界、已声明、由客户端报告的丢失。备选读法 B 使用服务器端存活信号，让 City 在漏掉 heartbeat 时划定边界，而非让客户端报告自身缺席；这里将其记录为此裁决**未选择**的更强设计。它保留为未来增量，不会悄悄丢弃：如果只把这样的决定记为一个绿勾，就会丢失“可接受”与“不是缺陷”之间的区别。
- **它不涉及 gate 10–14。** gate 10 要求 Mech 主机对冻结的复核 head 给出 PASS；此裁决不提供该 PASS。

## 3. 裁决后的任务状态

```text
 2/3/4/5/6/7/8/9   MET
10  Formal Review PASS on a frozen review head ...... the reviewer's to give
11  exact review-head CI PASS ...................... follows the freeze
12  main merge + merged-main CI .................... follows the PASS
13  THREE_END_MESH_E2E_ACCEPTED .................... follows the merge
14  post-completion re-entry ....................... follows the terminal marker
```

开发在 `09a5b89` 交接，`development_complete: true`，且 `DEVELOPMENT_REPORT.md` 已发布。下一步由 Mech 执行，目前阻塞已经解除。
