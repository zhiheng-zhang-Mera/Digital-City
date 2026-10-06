> English reading translation / 英文阅读译本. The [source document](../INTEGRATION_SOURCE_SWEEP_MECH.md) remains authoritative for historical facts, status, and evidence. This reader grants no additional task, acceptance, merge, or deployment authority.

# Integration-source sweep: the task branch is not the accepted head

2026-10-06, Mech-DS (`MEGA-REP`). Tool: `INTEGRATION_SOURCE_SWEEP_MECH.mjs`, alongside this record; invoke `node INTEGRATION_SOURCE_SWEEP_MECH.mjs <mission-book directory> <utopia directory>`.

## Why this sweep was performed
The first REX integration preflight treated the **development branch** as the integration source. Only after measurement did it emerge that REX-803's accepted identity was elsewhere, and the development branch tip was 14 commits behind. This is not necessarily unique to REX, so the same question was asked of every workbook that records a reviewed head: **which commit is actually the integration source?**

## What is measured
For every workbook recording `review_head_sha`: whether that head is already an ancestor of `origin/main`; how the remote tip of `development_branch` relates to it (identical / behind / ahead / diverged); and, if it is not ancestral, which remote refs still hold it.

**Measurement boundary:** “not an ancestor of main” **does not mean** “the contents of this work are missing from main.” A manual union can integrate the contents while that exact commit never becomes an ancestor (JOIN-590 and CEX-790 both work this way). This sweep measures **ancestry**, because it determines whether that exact accepted head can still be checked out and re-verified today.

## Result
```text
记录过集成来源的工作书 / workbooks with a recorded integration source   32
其中已验收 / of which accepted (review_complete=true)                    31
来源头不在 main 上 / the source head is not in main                       5
  按分支名集成会带进未评审提交 / integrating by branch name would add unreviewed commits   0
  分支 tip 落后于来源头 / branch tip BEHIND the source head                3  -> MON-902, MON-903, REX-803
  来源头不在任何远端 ref 上 / source head on NO remote ref                  1  -> UI-000
```

## Correction: the first version got JOIN-590 wrong
The first version read only `review_head_sha`, so it reported JOIN-590 as “the branch tip adds one unreviewed commit beyond the accepted head, and that commit also deletes evidence.” **That was wrong, and the error was in the tool, not the repository**: JOIN-590's workbook records both fields:

```text
accepted_head_sha   322162e900672ccfda12f2590d3562eb81bc128e   <- 真正被接受、而且**已经在 main 上**的头
review_head_sha     ec3b6f996240ca71505b3b67af12cc222d1b283a   <- 更早一轮 review 的头
merged_main_sha     59d3e09b1ea51c4b4024160fca1a575818077654
```

`322162e` is an ancestor of `origin/main`; the workbook's `exact_head_ci` is its CI run number, and `physical_acceptance` is recorded on that same head. The first version's “risk” was therefore **a false finding caused by my measurement definition**—the same instrument-error class repeatedly recorded in this programme: the probe read the wrong field and then described its result as a property of the measured subject.

The tool now prefers `accepted_head_sha`, falling back to `review_head_sha` only when absent, and labels which field it used in its output. It also separately determines whether the branch tip itself is already on main and whether the source head is on main. A risk is flagged only when **integrating by branch name would move main to a commit not recorded in the records**. After correction, this count is **0**.

### 1. REX-803 (the trigger this round, handled)
```text
已验收 / accepted   8798ba9dd37051626033ad72080b2fad3ff66149   （在 origin/review/REX-803-Alien-20261006 上）
开发分支 tip         a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df （rex/REX-803-mech-scenario-runner）
关系 / relation      a695bb9 是 8798ba9 的祖先，落后 14 个提交
缺什么 / missing     种子与放置修复 42acdc6、回执顺序与关闭修复 07e8c3c、fence/cleanup ee3479d，以及两 worker 演练与
                     third-class sweep；接受身份上还有 4 个开发分支没有的测试套件
```

Integrating the task branch would integrate a head that was never accepted. The preflight has been remeasured on the accepted identity: `reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md`.

### 2. JOIN-590: **not a risk** (incorrectly reported in the first version; see above)
```text
集成来源 / source  322162e（工作书 accepted_head_sha）——已是 origin/main 的祖先
分支 tip          322162e，与来源头相同
该提交 / that commit  fix(JOIN-590): enroll Android members and preserve secure reconnect
                    它确实删除了 444 行（含已提交的证据文件），但**它是被记录、被验收、且已在 main 上的提交**，
                    工作书 exact_head_ci 与 physical_acceptance 都写在这个头上
```

Integrating by branch name is **correct** here because the tip is the source head. The first version called it a risk because I read only `review_head_sha` (the head from an earlier review round). The lesson is the same instrument-error lesson: **a false finding produced by reading the wrong field costs more than no finding**, because people pursue it as a repository problem.

### 3. MON-902 / MON-903: branch tips behind their source heads
```text
MON-902  来源头 f498824（review_head_sha）  分支 tip 3a88e23   （都不在 main 上）
MON-903  来源头 3cd32c6（review_head_sha）  分支 tip 78bdd9d   （都不在 main 上）
```

The same shape as REX-803: the integration source is the workbook's recorded head, not the branch tip. This sweep does not assert whether the contents of these two items have already reached main through a manual union; see the measurement boundary above.

### 4. UI-000: the recorded source head exists on no ref
```text
workbook      finished/completed-2026-10-03/ui-civilization/UI-000-视觉方向候选与审美门禁.md
source head   6edd103（2026-10-01，"review(UI-000): delta re-verification - correct this probe's own defects"）
持有它的 ref  无（`git branch -a --contains 6edd103` 为空）
```

The commit object exists locally, but **no ref points to it**. If this local object database is lost, the exact head recorded as having completed re-review can no longer be checked out or verified. This is a **record-integrity** observation, not a defect claim about the UI-000 product. It is also not an active workbook needing immediate repair, so it is recorded without expanding construction scope.

## Conclusion
> **“Merge the task branch” is not an integration rule.** The integration source must be the head recorded in the workbook; the branch tip may lag behind it (omitting accepted repairs) or diverge from it.

Of 31 accepted tasks, **3 tips lag behind** (MON-902/MON-903/REX-803), **1 source head is on no ref** (UI-000), and **0 would introduce unreviewed commits by integrating by branch name**. This is not merely theoretical: the first REX-803 preflight encountered precisely this problem.
