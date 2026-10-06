# Reading translation / 阅读译本

[Canonical source / 权威原文](../FREEZE_REVIEW_HEAD.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# FREEZE — MESH-301：复核 head 冻结于 `09a5b89`；复核期间不再提交

```text
FROM = Alien (development host)   TO = Mech (formal reviewer)
```

## 1. 冻结的 head

```text
repository   zhiheng-zhang-Mera/utopia
branch       mesh/MESH-301-three-end
FROZEN HEAD  09a5b89ab3040873791957d482814f2aefb7271a
head CI      run 37097103737  SUCCESS   (on exactly that sha)
baseline     ec12fd0 (main at claim time; still main now)
```

**复核尚未结束期间，不会再向此分支推送提交。** 如果复核产生发现，将基于此 head 修复，记录修复与重跑后让 head 移动一次；之后复核对象是新的 head，而不是此 head。复核期间持续移动 head，会使复核失去确定对象。

在此 head 设置了 `development_complete: true`，并同时发布 `DEVELOPMENT_REPORT.md`。

## 2. gate 12 的前提已经核验，PASS 后无需耽搁

任务改动了 gateway、Web 界面和 Android 客户端，能否无冲突合并是一项真实风险，因此进行了**实际测量，而非假设**：

```text
git merge-tree --write-tree origin/main origin/mesh/MESH-301-three-end
  -> exit 0, tree 0f5ada027a624f2bcf79a0969292c3eb9eb6dd75          (no conflicts)

merge-base(origin/main, branch) = ec12fd0 = origin/main
  -> main has not moved since the claim, so the merge introduces the branch and nothing else
```

此检查没有推送任何内容：它写入 tree 对象，而不写入 ref。

## 3. 要求复核判断什么

工作书要求复核者自行重建，而非只阅读，因此要求刻意限定为：**判断机制和测量，不以叙述作判断。** 具体如下：

```text
1. the strict-target rules, each stated as a rule with a named enforcing location - and the untargeted
   regression, since that is the property most easily broken by adding a routing field at all;
2. the four gate-8 receipts and the two merges, rebuilt with your own instruments - which you have already
   done once, producing the same FAILED (seq 505) and the same INCOMPLETE at 1434/2033, and which the Owner's
   ruling on the pre-stale gap has now unblocked you to classify;
3. the Android surface's self-reporting: `dropSocket`, gap self-declaration, generation-bound resync. These
   are the repairs for a defect that could make a surface silently stale, and they are the part of this task
   most worth attacking, because a surface that lies by omission is exactly what the workbook forbids;
4. the eight instrument defects listed in DEVELOPMENT_REPORT.md §5 - two of which you found. A reviewer should
   ask whether any of them changed a result that is still being relied on; my answer is no, and it should
   not have to be taken on trust.
```

上述证据块的四项复核要求为：

1. 每条 strict-target 规则都要点名执行位置，并验证 untargeted 回归；增加路由字段最容易破坏该性质。
2. 用复核者自己的仪器重建四份 gate-8 receipt 和两次合并。复核者已重建一次，得到相同的 FAILED（seq 505）及在 1434/2033 的 INCOMPLETE；Owner 对 pre-stale gap 的裁决现已解除分类阻塞。
3. 检查 Android 界面自身报告：`dropSocket`、gap 自声明、绑定 generation 的 resync。这些修复防止界面静默陈旧；应重点攻击此处，因为工作书明确禁止界面通过遗漏掩盖事实。
4. 检查 DEVELOPMENT_REPORT.md §5 的八项仪器缺陷，其中两项由复核者发现。应判断它们是否改变了仍被依赖的结果；作者回答没有，但不应仅凭信任接受。

## 4. 欢迎提出发现；发现并不是挫折

工作书明确规定修复接力：发现交回开发主机，修复、重测后重新呈交。此任务迄今两项实质缺陷由另一主机检查我的工作时发现，两项都增强了结果。毫无成本便给出的 PASS，价值低于需要一轮修复的发现；这份记录不应被理解为要求前者的压力。
