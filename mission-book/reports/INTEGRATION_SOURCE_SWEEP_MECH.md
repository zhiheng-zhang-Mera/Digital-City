# 集成来源扫描：任务分支不等于已验收头 / Integration-source sweep: the task branch is not the accepted head

2026-10-06，Mech-DS（`MEGA-REP`）。工具 / tool：`INTEGRATION_SOURCE_SWEEP_MECH.mjs`（本记录同目录，`node INTEGRATION_SOURCE_SWEEP_MECH.mjs <mission-book 目录> <utopia 目录>`）。

## 为什么做这个扫描 / Why

REX 集成前置测量第一版把**开发分支**当成了集成来源，测完才发现 REX-803 的接受身份在别处，且开发分支 tip 落后 14 个提交。这不是 REX 独有的情况，所以把同一个问题问遍所有记录过 reviewed head 的工作书：**到底哪个提交才是集成来源？** / The first preflight merged the development branch; the accepted REX-803 head turned out to be 14 commits ahead of it. That is unlikely to be a REX-only situation, so the same question was asked of every workbook that records a reviewed head.

## 口径 / What is measured

对每本记录了 `review_head_sha` 的工作书：该头是否已是 `origin/main` 的祖先；`development_branch` 的远端 tip 与该头的关系（相同 / 落后 / 超前 / 分叉）；若不是祖先，哪些远端 ref 还持有它。 / For each workbook with a recorded reviewed head: is it an ancestor of origin/main; what is the branch tip's relation to it; and if it is not ancestral, which refs still hold it.

**口径边界 / the boundary:** “不是 main 的祖先”**不等于**“这项工作的内容没进 main”——手工 union 可以把内容并进 main 而让该确切提交永不成祖先（JOIN-590、CEX-790 都是这样）。本扫描测的是**祖先关系**，因为那决定了那个被验收的确切头今天还能不能被 checkout 出来重新核验。 / "Not ancestral" is not "its work is missing": a manual union can land content without the exact head becoming an ancestor. The sweep tests ancestry because that decides whether the accepted head can still be checked out and re-verified.

## 结果 / Result

```text
记录过 reviewed head 的工作书 / workbooks with a recorded reviewed head   32
其中已验收 / of which accepted (review_complete=true)                    31
已验收但该头不是 main 祖先 / accepted but not ancestral to main            6
  tip 超前或分叉于已验收头 / branch tip AHEAD of or DIVERGED from it        1  -> JOIN-590
  tip 落后于已验收头 / branch tip BEHIND it                                3  -> MON-902, MON-903, REX-803
  已验收头不在任何远端 ref 上 / accepted head on NO remote ref              1  -> UI-000
```

### 1. REX-803（本轮的起因，已处理）/ the trigger, handled

```text
已验收 / accepted   8798ba9dd37051626033ad72080b2fad3ff66149   （在 origin/review/REX-803-Alien-20261006 上）
开发分支 tip         a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df （rex/REX-803-mech-scenario-runner）
关系 / relation      a695bb9 是 8798ba9 的祖先，落后 14 个提交
缺什么 / missing     种子与放置修复 42acdc6、回执顺序与关闭修复 07e8c3c、fence/cleanup ee3479d，以及两 worker 演练与
                     third-class sweep；接受身份上还有 4 个开发分支没有的测试套件
```

按任务分支集成，会集成一个从未被验收的头。前置测量已按接受身份重测：`reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md`。

### 2. JOIN-590：分支 tip 比已验收头**多一个未被评审的提交** / one unreviewed commit past the accepted head

```text
已验收 / accepted   ec3b6f9   （在 origin/review/JOIN-590-Alien-codex 上）
分支 tip           322162e   （join/JOIN-590-merged-main-physical-acceptance）
关系 / relation     分叉，tip 超前 1 个提交
该提交 / that commit  fix(JOIN-590): enroll Android members and preserve secure reconnect
                    23 files changed, 444 deletions(-) —— 其中包括删除已提交的证据文件
                    （evidence/raw/mission-book/JOIN590/round3-web-task.png 等）
```

这是本次扫描里风险最具体的一条：**如果集成方按分支名走，就会连带把“删除已提交证据”的那个未评审提交一起并进 main**。集成来源必须是 `ec3b6f9`，或由该任务的记录持有人明确说明 `322162e` 已被评审。 / The most concrete risk in this sweep: integrating by branch name would also carry an unreviewed commit that deletes committed evidence.

### 3. MON-902 / MON-903：分支 tip 落后于已验收头 / branch tips behind their accepted heads

```text
MON-902  已验收 f498824   分支 tip 3a88e23   （都不在 main 上）
MON-903  已验收 3cd32c6   分支 tip 78bdd9d   （都不在 main 上）
```

与 REX-803 同一形状：集成来源是已验收头，不是分支 tip。这两项的内容是否已通过手工 union 进入 main，本扫描不作断言（见上面的口径边界）。 / Same shape as REX-803: the source is the accepted head, not the tip. Whether their content already reached main via a manual union is not claimed here.

### 4. UI-000：被记录的已验收头不在任何 ref 上 / the recorded accepted head exists on no ref

```text
workbook      finished/completed-2026-10-03/ui-civilization/UI-000-视觉方向候选与审美门禁.md
reviewed head 6edd103（2026-10-01，"review(UI-000): delta re-verification - correct this probe's own defects"）
持有它的 ref  无（`git branch -a --contains 6edd103` 为空）
```

提交对象在本机存在，但**没有任何 ref 指向它**：一旦本机对象库丢失，这个被记录为“已完成复检”的确切头就无法再被 checkout 或核验。这是一条**记录完整性**观察，不是对 UI-000 产品的缺陷主张；它也不属于任何需要立刻修复的活跃工作书，因此只作记录、不扩大施工。 / The object exists locally but no ref holds it, so a reviewed-and-recorded head is not retrievable if this object store is lost. Recorded as a record-integrity observation only.

## 结论 / Conclusion

> **“把任务分支合进来”不是一条集成规则。** 集成来源必须是工作书里记录的那个被验收的确切提交；分支 tip 可能超前（带上未评审的提交）、落后（漏掉验收过的修复），或与它分叉。

31 项已验收任务里 1 项 tip 超前、3 项 tip 落后。这不是理论风险：REX-803 的第一版前置测量正是踩了这一条，而 JOIN-590 的那一个未评审提交恰好是删证据的提交。
