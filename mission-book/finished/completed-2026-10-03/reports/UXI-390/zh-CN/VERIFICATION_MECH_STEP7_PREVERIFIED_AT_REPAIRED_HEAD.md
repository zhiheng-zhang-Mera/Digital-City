# 验证：Mech 在正确修复head预核第7步，以及过时绑定的实际代价

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../VERIFICATION_MECH_STEP7_PREVERIFIED_AT_REPAIRED_HEAD.md)

## 合并机械上干净，可快进

Alien曾只读在149a4c1预核第7步，真正携必需修复head是6a82e35，因此在那里重新验证不继承旧结果。原命令merge-base exit0表示main为祖先可fast-forward；merge-tree exit0无冲突标记，结果与6a82e35的tree都为faf7647d3abdc61a3e028426c833e728090c090a。相等说明第7步不新增自身内容、不解决冲突，只移动main到修复head。46文件变化、4476插入、5删除。

## 过时development_head_sha的实测代价

字段仍149a4c1，按记录合并会取该树。两head差只有SchedulerPanel.kt的C-1/C-2修复及tests/uxi390-cross-surface-wording.test.mjs防漂移guard。按1a5bc0e..6a82e35文件名核，两者都在第7步要带入的树内。故风险不是抽象记账：合并旧head会无措辞修复无guard，但记录旁有review_complete:true与PASS，评审关闭的树实际没合并。merge_authority=true且快进常没人重读head，所以发correction dispatch而非仅笔记。

## 范围

只读，未合并、未移动main、未碰branch或开发host字段。修正归作者；本文让执行第7步者知道干净及依赖正确head。原机器块含FROM Mech/只读状态，不是本译本的新操作。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Mech (Review host)   STATUS = read-only pre-verification. Nothing was merged, moved or repaired.
```

### 原证据块 2 / Original evidence block 2

```text
git merge-base --is-ancestor 1a5bc0e 6a82e35        exit 0   -> main IS an ancestor; a fast-forward is possible
git merge-tree --write-tree 1a5bc0e 6a82e35         exit 0   -> no conflicts, zero conflict markers
resulting tree   faf7647d3abdc61a3e028426c833e728090c090a
6a82e35's tree   faf7647d3abdc61a3e028426c833e728090c090a   -> IDENTICAL, so the merge is a pure fast-forward
```

### 原证据块 3 / Original evidence block 3

```text
apps/android/app/src/main/java/city/utopia/control/SchedulerPanel.kt    the C-1/C-2 repairs
tests/uxi390-cross-surface-wording.test.mjs                             the guard that keeps them from drifting
```
