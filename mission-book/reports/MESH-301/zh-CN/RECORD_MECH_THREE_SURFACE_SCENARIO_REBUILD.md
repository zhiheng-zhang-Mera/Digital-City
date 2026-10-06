# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_THREE_SURFACE_SCENARIO_REBUILD.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：用自身仪器重建三界面场景并收敛；实际运行发现自身 receipt 的两项缺陷

```text
FROM = Mech (formal reviewer)      TO = Alien (development host), Owner
REVIEW HEAD = 09a5b89ab3040873791957d482814f2aefb7271a         STATUS = gate 10 PAUSED on D-R1, unchanged
EVIDENCE = branch review/MESH-301-mech-formal-review (updated)
```

工作书复核章节要求复核主机*“用你自己的仪器重建三端同 City 的场景（不得只用开发主机的脚本）”*。Android 设备由开发主机操作，因此第三界面不能由我持有；但整个机制可以由我独立构建，现在已如此。

## 1. 自己的三个界面同时连接 canonical City

```text
surface 1   Mech-Scenario-Web-xhtb8      the product's OWN browser UI, labelled before load
surface 2   Mech-Scenario-Probe1-xhtb8   my own stream client, its own clientRef
surface 3   Mech-Scenario-Probe2-xhtb8   my own stream client, its own clientRef

controlSurfaces at the start, de-duplicated by clientRef:
  ["PERM00", "Mech-Scenario-Web-xhtb8", "Mech-Scenario-Probe1-xhtb8", "Mech-Scenario-Probe2-xhtb8"]
  of those, mine: 3 of 3
```

窗口为 canonical seq `1403..1426`，由本端生成（一个 untargeted 任务、一个 strict 定向 `Alien-Win` 任务、一个 strict 定向 `Mech-Win` 任务），观察 75 秒。

```text
                          seqs   range        offset    latency min/median/p95/max   breaches
Mech-Scenario-Web-xhtb8    24   1403..1426   -1046 ms   0 /  1 / 11 / 65 ms              0
Mech-Scenario-Probe1       23   1404..1426   -1046 ms   0 /  0 /  3 /  6 ms              0
Mech-Scenario-Probe2       22   1405..1426   -1046 ms   0 /  0 /  3 /  3 ms              0

common seq range 1405..1426 = 22 seqs   ·   missing observations: 0   ·   breaches: 0
VERDICT by the reviewer's own arithmetic (window 5000 ms): CONVERGED
```

再做交叉检查，因为单实现计算的 verdict 只是该实现的判断：我对同三份 receipt 运行共享合并工具，并逐界面声明偏移：

```text
CONVERGED   failures 0   unmeasured 0   CONVERGED 63   BEFORE_OBSERVATION 4215   AFTER_OBSERVATION 9
```

我的计算与开发主机仪器一致；这正是运行两者的目的。

## 2. 实际运行发现并修复自身工作的两项缺陷

**（a）两个 probe 共用一个 `clientRef`。** 我使用 `name.slice(-1)` 推导 ref，得到的是随机标签最后一个字符而非 probe 编号，导致两个 socket 以同一 client 连接，City 仅列出**我的三个界面中的两个**；自身场景看起来像产品故障。这与 D-R1 症状相同，但由我造成。仪器现增加 `mineListedOfThree` 检查，遇到此情况明确失败；纠正后运行报告 3/3。

**（b）我的 receipt 漏掉 `resync` 边界记录。** 共享合并工具通过该记录而非首个事件确定界面开始观察时间，因此将 1 至 1376 每个 canonical seq 当作*“在线界面从未观察 seq N”*，对实际上没有遗漏的三个界面返回 **FAILED、4128 项失败**。

我将（b）记录为自身 receipt 缺陷，**不是**合并工具缺陷。工具面对不完整 receipt 采用 fail-closed，正是本 programme 需要的行为；替代方案会将不可读边界视为“无事可报”。这意味着“词汇共享”指的是必需记录集合，而非我自身读取器恰好需要的集合；只满足作者自身读取器的 receipt 不算有效 receipt。

## 3. 新增证明与未证明事项

```text
ADDS    an independent reconstruction of "three surfaces, one City, bounded convergence" built entirely from
        the reviewer's instruments, with the verdict computed twice by two implementations.
DOES NOT replace the Android row. All three of these surfaces are on the Mech host; the Android surface is on
        wifi with a ~600 ms skew and is the development host's to drive. This strengthens gate 8's independence;
        it does not substitute for the device.
DOES NOT move gate 10. D-R1 is still open and still the one required repair.
```

## 4. 状态未变

```text
gate 10   PAUSED on D-R1 - no repair commit on mesh/MESH-301-three-end yet (tip is still 09a5b89)
gates 1-9, 11   MET
Endpoint A      resident City + worker up, visible console window, shared City shows Mech-Win online
```
