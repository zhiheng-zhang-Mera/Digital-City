# REX-805 复检就绪测量（尚未领取）/ Review readiness measurement — NOT claimed

2026-10-06，Mech-DS（`MEGA-REP`）。**本文件不是领取记录，也没有做出任何裁决。** 它记录的是“现在能不能领”，以及为什么还不能。 / This is not a claim and contains no verdict. It records whether the review can be claimed now, and why not yet.

## 结论 / Conclusion

```text
技术前提已满足 / technical preconditions MET
  分支 tip == 工作书声明的 development head      4b3946868d4083285da8a8d99eac2642890b37c4（相等，实测）
  依赖可达 / dependency ancestry                 REX-802 833279ca、REX-803 8798ba9d、required 69a097b5 三者
                                                 `git merge-base --is-ancestor` 均 exit 0
  精确头 CI / exact-head CI                      逐条 API 复核（见下），push 与 PR 两条均 COMPLETED SUCCESS
                                                 linkage 亦 SUCCESS
流程前提**未**满足 / process precondition NOT met
  development_complete: false —— 作者尚未宣告开发完成
  reports/REX-805/ 下只有 CLAIM_REPORT.md 与 DEVELOPMENT_CHECKPOINT.md，**还没有交付记录**
=> 因此本机**不领取**这次复检。领取在开发闸门关闭、作者交付之后再发。
```

## 精确头 CI（逐条读取，不采信概述）/ exact-head CI, read per run

```text
V0.2 checks          push           37440884928   COMPLETED SUCCESS attempt 1
V0.2 checks          pull_request   37440891856   COMPLETED SUCCESS attempt 1
City linkage check   pull_request   37440891872   COMPLETED SUCCESS attempt 1
```

该 head 上还有一条**更新的** push 运行正在进行（37441941363，`in_progress`）——它不改变上表，但说明分支可能再次移动；领取时会重新核对 tip 与声明头是否仍然相等。 / A newer push run for this head is in progress; the tip will be re-checked at claim time in case the branch moves again.

## 独立复现作者的数字 / The author's numbers, reproduced independently

领取之前先把作者记录的数字在本机独立测一遍——这是 reviewer 的第一件事，也不需要先领取（它是测量，不是裁决）。 / Before claiming, the author's recorded numbers were measured independently on this host: a measurement, not a verdict.

```text
作者记录 / author's record     Local full 1412 / 1409 PASS / 3 ENV_FAIL (resident City)
本机实测 / measured here @4b39468
  focused  tests/rex805-*.test.mjs（4 套件）        19 pass / 0 fail
  full     pnpm test                              1412 tests / 1409 pass / 3 fail
  3 项失败均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），跑后 tracked state CLEAN
=> 总数、通过数、失败数、以及失败的身份，逐项一致
```

**这不是复检结论**：正式的复检要在领取之后，用本机自己制造的探针做，而不是复跑作者的套件。这里确认的只是“作者记录的数字在本机能站住”。 / This is not the review verdict: the formal review comes after the claim and uses probes this host manufactures, not a re-run of the author's suite. What is confirmed here is only that the author's recorded numbers hold up on this host.

## 当前可领取的工作 / What is currently claimable

```text
REX-805            开发未宣告完成（development_complete: false），不领取
REX-806/807/890    WAITING_DEPENDENCIES
SHOW-401           IN_PROGRESS，但已被 Owner 优先级裁定排除：
                   CEX-790 工作书 owner_priority_override_2026_10_06 =「CEX-790 merge-readiness first,
                   then MON directly; supersedes REX-before-MON. SHOW excluded.」
其余 NOT_STARTED 工作书（CHK/DGX/PCF/RIV/URA/XX）不在活跃池，未激活
=> 本机当前唯一的前进方向就是 REX-805 的复检，闸门一关即领
```

## 为什么这件事值得单独记一笔 / Why this is recorded separately

REX-805 的**集成**前置测量在同一轮完成，并且发现了一件对复检直接相关的事：该候选头对 main 是 **fast-forward**（main 是它的祖先，它比 main 多 15 个提交）。也就是说，这个候选头一旦被接受并被机械地“按分支名”合并，**整条 main 会被它替换**，而不是追加一个提交。复检时因此必须把“被审的确切头”钉在工作书记录的那个 SHA 上，而不是名字上——这正是 `reports/INTEGRATION_SOURCE_SWEEP_MECH.md` 记录的那一类陷阱，本案是它最锋利的形式。 / The integration preflight found that this candidate fast-forwards onto main, so a branch-name merge would replace main wholesale. The review must pin the exact accepted SHA, not the branch name.

## 闸门关闭后本机会做什么 / What this host will do once the gate closes

```text
1  重新 fetch，确认 review_host 仍为 null、tip 仍等于工作书声明的头（原子领取：先读后写，同一步推送）
2  发布 REVIEW_CLAIM_Mech.md：领取时间的测量（远端 tip、依赖祖先、精确头 CI 逐条、union baseline）
3  制造本机自己的探针（不复用作者套件）：replay 的确定性、ablation 比较、receipt 边界、
   “不可用条件不得被重放”这一拒绝路径、以及 store 不可用时的打字化拒绝
4  在有设备/工具链的真实条件下测量重放与实体对比；无法测量的部分如实标注 NOT_RUN，不当作通过
```

**仪器已就绪 / the instrument is ready：** 第 3 步里最难的「replay 链路」已经打通并证明可用——见
`REPLAY_FIXTURE_FEASIBILITY_MECH.md`（在同无执行者的 City 上，用真实回执 + 只补过的 run 跑通了
`POST /research/replays` 与 `GET /research/replays/:id` 的比较，比较字段 14 项）。那一步同时查明引擎对源的
**逐条前置条件**（放置必须等于 `replayTarget(context, seed)`、被记录拓扑必须当前在线等），复检可直接把这些
当作断言，而不必重新发现。 / The hardest probe of step 3 is already proven workable, and the engine's exact source
preconditions are measured and can be used directly as assertions.

**外部缝仍在 / the external seam remains：** REX-805 `development_complete=false`、`review_host=null`，作者自
`a524e1c` 后无新提交。本机继续按「记录真实外部缝、不空等」行事：领取要等交付，期间只做能在交付前完成的事。
/ The review stays unclaimed until the author hands over.

本文件不改变任何工作书字段。 / This file changes no workbook field.
