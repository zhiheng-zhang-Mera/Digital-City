# 集成来源扫描：任务分支不等于已验收头 / Integration-source sweep: the task branch is not the accepted head

2026-10-06，Mech-DS（`MEGA-REP`）。工具 / tool：`INTEGRATION_SOURCE_SWEEP_MECH.mjs`（本记录同目录，`node INTEGRATION_SOURCE_SWEEP_MECH.mjs <mission-book 目录> <utopia 目录>`）。

## 为什么做这个扫描 / Why

REX 集成前置测量第一版把**开发分支**当成了集成来源，测完才发现 REX-803 的接受身份在别处，且开发分支 tip 落后 14 个提交。这不是 REX 独有的情况，所以把同一个问题问遍所有记录过 reviewed head 的工作书：**到底哪个提交才是集成来源？** / The first preflight merged the development branch; the accepted REX-803 head turned out to be 14 commits ahead of it. That is unlikely to be a REX-only situation, so the same question was asked of every workbook that records a reviewed head.

## 口径 / What is measured

对每本记录了 `review_head_sha` 的工作书：该头是否已是 `origin/main` 的祖先；`development_branch` 的远端 tip 与该头的关系（相同 / 落后 / 超前 / 分叉）；若不是祖先，哪些远端 ref 还持有它。 / For each workbook with a recorded reviewed head: is it an ancestor of origin/main; what is the branch tip's relation to it; and if it is not ancestral, which refs still hold it.

**口径边界 / the boundary:** “不是 main 的祖先”**不等于**“这项工作的内容没进 main”——手工 union 可以把内容并进 main 而让该确切提交永不成祖先（JOIN-590、CEX-790 都是这样）。本扫描测的是**祖先关系**，因为那决定了那个被验收的确切头今天还能不能被 checkout 出来重新核验。 / "Not ancestral" is not "its work is missing": a manual union can land content without the exact head becoming an ancestor. The sweep tests ancestry because that decides whether the accepted head can still be checked out and re-verified.

## 结果 / Result

```text
记录过集成来源的工作书 / workbooks with a recorded integration source   32
其中已验收 / of which accepted (review_complete=true)                    31
来源头不在 main 上 / the source head is not in main                       5
  按分支名集成会带进未评审提交 / integrating by branch name would add unreviewed commits   0
  分支 tip 落后于来源头 / branch tip BEHIND the source head                3  -> MON-902, MON-903, REX-803
  来源头不在任何远端 ref 上 / source head on NO remote ref                  1  -> UI-000
```

## 更正：第一版把 JOIN-590 报错了 / Correction: the first version got JOIN-590 wrong

第一版只读 `review_head_sha`，于是把 JOIN-590 报成“分支 tip 比已验收头多一个未评审提交、该提交还删除了证据”。**这是错的，而且错在工具，不在仓库**：JOIN-590 的工作书同时记录了两个字段：

```text
accepted_head_sha   322162e900672ccfda12f2590d3562eb81bc128e   <- 真正被接受、而且**已经在 main 上**的头
review_head_sha     ec3b6f996240ca71505b3b67af12cc222d1b283a   <- 更早一轮 review 的头
merged_main_sha     59d3e09b1ea51c4b4024160fca1a575818077654
```

`322162e` 是 `origin/main` 的祖先，工作书里 `exact_head_ci` 正是它的 CI 运行号，`physical_acceptance` 也是写在这个头上的。所以第一版报告的“风险”其实是**我的读数口径造成的假发现**——和本系列反复记录的那类仪器缺陷同源：探针用错了字段，然后把结果说成被测量对象的性质。

工具已修正为：优先取 `accepted_head_sha`，没有才退回 `review_head_sha`，并在输出里标明用的是哪个字段；同时把“分支 tip 自己是否已在 main 上”与“来源头是否在 main 上”分开判定——只有在**按分支名集成会移动 main 到一个记录里没写过的提交**时，才标记为风险。修正后该项计数为 **0**。

### 1. REX-803（本轮的起因，已处理）/ the trigger, handled

```text
已验收 / accepted   8798ba9dd37051626033ad72080b2fad3ff66149   （在 origin/review/REX-803-Alien-20261006 上）
开发分支 tip         a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df （rex/REX-803-mech-scenario-runner）
关系 / relation      a695bb9 是 8798ba9 的祖先，落后 14 个提交
缺什么 / missing     种子与放置修复 42acdc6、回执顺序与关闭修复 07e8c3c、fence/cleanup ee3479d，以及两 worker 演练与
                     third-class sweep；接受身份上还有 4 个开发分支没有的测试套件
```

按任务分支集成，会集成一个从未被验收的头。前置测量已按接受身份重测：`reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md`。

### 2. JOIN-590：**不是风险**（第一版报错了，见上）/ not a risk - see the correction above

```text
集成来源 / source  322162e（工作书 accepted_head_sha）——已是 origin/main 的祖先
分支 tip          322162e，与来源头相同
该提交 / that commit  fix(JOIN-590): enroll Android members and preserve secure reconnect
                    它确实删除了 444 行（含已提交的证据文件），但**它是被记录、被验收、且已在 main 上的提交**，
                    工作书 exact_head_ci 与 physical_acceptance 都写在这个头上
```

按分支名集成在这里是**正确**的做法，因为 tip 就是来源头。第一版把它当成风险，是因为我只读了 `review_head_sha`（更早一轮 review 的头）。教训与本节目的仪器缺陷同源：**读错字段产生的假发现，比没有发现更贵**，因为它会被当成仓库的问题去追。 / Integrating by branch name is correct here, because the tip IS the recorded source head. The first version called it a risk because it read only `review_head_sha` - an earlier review round.

### 3. MON-902 / MON-903：分支 tip 落后于来源头 / branch tips behind their source heads

```text
MON-902  来源头 f498824（review_head_sha）  分支 tip 3a88e23   （都不在 main 上）
MON-903  来源头 3cd32c6（review_head_sha）  分支 tip 78bdd9d   （都不在 main 上）
```

与 REX-803 同一形状：集成来源是工作书记录的那个头，不是分支 tip。这两项的内容是否已通过手工 union 进入 main，本扫描不作断言（见上面的口径边界）。 / Same shape as REX-803: the source is the recorded head, not the tip. Whether their content already reached main via a manual union is not claimed here.

### 4. UI-000：被记录的来源头不在任何 ref 上 / the recorded source head exists on no ref

```text
workbook      finished/completed-2026-10-03/ui-civilization/UI-000-视觉方向候选与审美门禁.md
source head   6edd103（2026-10-01，"review(UI-000): delta re-verification - correct this probe's own defects"）
持有它的 ref  无（`git branch -a --contains 6edd103` 为空）
```

提交对象在本机存在，但**没有任何 ref 指向它**：一旦本机对象库丢失，这个被记录为“已完成复检”的确切头就无法再被 checkout 或核验。这是一条**记录完整性**观察，不是对 UI-000 产品的缺陷主张；它也不属于任何需要立刻修复的活跃工作书，因此只作记录、不扩大施工。 / The object exists locally but no ref holds it, so a reviewed-and-recorded head is not retrievable if this object store is lost. Recorded as a record-integrity observation only.

## 结论 / Conclusion

> **“把任务分支合进来”不是一条集成规则。** 集成来源必须是工作书里记录的那个头；分支 tip 可能落后（漏掉验收过的修复），或与它分叉。

31 项已验收任务里 **3 项 tip 落后**（MON-902/MON-903/REX-803）、**1 项来源头不在任何 ref 上**（UI-000）、**0 项会因按分支名集成而带进未评审提交**。这不是理论风险：REX-803 的第一版前置测量正是踩了这一条。 / Of 31 accepted tasks: 3 tips are behind, 1 source head is on no ref, and 0 would add unreviewed commits if integrated by branch name. The REX-803 preflight walked straight into the first of those.


---

语言读本 / Reading translation: [English](en/INTEGRATION_SOURCE_SWEEP_MECH.md). 本文件保留原始状态与证据权威 / This source remains authoritative for status and evidence.
