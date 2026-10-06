# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_INSTRUMENT_DEFECTS_REPAIRED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301：Mech 发现的两项仪器缺陷已修复，gate 5 证据来自 Mech 自身

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ f1eaad8
```

## 1. Mech 在共享合并工具中发现的两项缺陷均已修复，第二项影响实质判断

Mech **按文档**使用仪器后，在 `RECORD_MECH_STEP52_MECH_TO_ALIEN_AND_MERGE_SKEW_DEFECT.md` 报告这些缺陷；这正体现独立复核的价值。

**缺陷 1：`--skew` 无法与位置参数 receipt 文件名合用。** 位置参数列表取“所有不以 `--` 开头的 argv”，吞掉了前一 flag 的*值*：`merge --skew Mech-Win-Web=-1001 --out x.json mech.jsonl` 将偏移值当成 receipt 交给 `readFileSync`。修复使用遍历器跳过每个已知 flag 的值。**我第一次实现遍历器时从索引 2 开始，但 `argv` 已经切片**，导致没有跳过内容，并打开名为 `5000` 的文件。此问题由实际运行发现；这是本轮第五次通过执行而非阅读纠正仪器。

**缺陷 2：这项影响实质判断。** `--skew` 默认 `0`，因此**不声明**偏移的表仍打印 `CONVERGED`，同时把界面时钟偏移放在延迟列伪装成延迟。Mech 实测界面约有 1 秒偏移，原始数字却判为收敛；对 5 秒窗口，这是**附有数字的假 PASS**，看似证据而尤为危险。再结合缺陷 1，文档唯一声明偏移的方法恰好会失败，导致诚实路径失败、不诚实路径通过。

合并工具现在**拒绝读取未声明的时钟**：该界面的 seq 标为 `UNMEASURED`，verdict 变为 `INCOMPLETE`。操作员使用 `--skew <surface>=0` 显式声明假设，运行不得静默略过此项。

```text
verified:  merge --skew PERM00=592 --skew Alien-Host=0 <two positional receipts>   -> both surfaces in the table
verified:  merge --file one.jsonl            (no --skew)                          -> INCOMPLETE, not CONVERGED
```

## 2. gate 5 证据来自 Mech 而非我，因而更强

前一轮确认 Mech 从自己的 Web 界面关闭第 5.2 步；其记录现独立确认，receipt 已在分支路径 `evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-strict-target.jsonl`。因此 gate 5 由**两台物理主机、两个控制界面产生的两个方向**满足；复核者持有自己的原始证据，而非引用我的证据。

Mech 也记录正确边界：**gate 5.2 关闭不等于 gate 10。** 尚无 Formal Review、review-head CI、合并或终态标记。

## 3. gate 状态

```text
 2/3/4/5/7   MET
 6           live City 8/8 negative controls; Mech must rebuild them independently, and Mech's record shows
             it is doing so with its own instruments rather than re-running mine
 8           NOT MET - all three surfaces have now been exercised, never in ONE measured window
 9           MET on re-convergence (stale -> gap -> resync to the server's own max), with the pre-stale policy
             question from the previous record still open and still the Owner's to read
10-14        NOT STARTED
```

## 4. 下一步未变，现已解除阻塞

```text
1. ONE window holding Alien Web + Mech-Win-Web + PERM00 simultaneously -> gate 8. Mech's record asks to be told
   when, and offers to re-run its surface for the table; its receipt is already in the merge vocabulary, so the
   three-surface table is a scheduling problem now, not a technical one.
2. Mech's Formal Review on a frozen review head -> gates 10-14.
```
