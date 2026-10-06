> Reading translation / 阅读译本. Full historical English reading, not a new verdict, claim or authority record. Original evidence blocks remain literal and the canonical source governs recorded status.

[Canonical source](../REVIEW_READINESS_MECH.md)

# REX-805 Review Readiness Measurement — Not Claimed

2026-10-06, Mech-DS (`MEGA-REP`). This is neither a claim record nor a verdict. It records whether Review is claimable now and why it is not yet.

## Conclusion

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

Technical preconditions are met: branch tip equals declared development head `4b3946868d4083285da8a8d99eac2642890b37c4`, measured. REX-802 `833279ca`, REX-803 `8798ba9d` and required `69a097b5` all pass `git merge-base --is-ancestor` with exit 0. Each exact-head CI run was API-checked: push and PR COMPLETED SUCCESS; linkage SUCCESS.

Process precondition is not met: development_complete=false; the author has not declared completion. REX-805 reports contain only CLAIM_REPORT.md and DEVELOPMENT_CHECKPOINT.md, not a delivery record. Therefore this host does not claim Review; claim follows closure of the development gate and author handover.

## Exact-head CI, read run by run

```text
V0.2 checks          push           37440884928   COMPLETED SUCCESS attempt 1
V0.2 checks          pull_request   37440891856   COMPLETED SUCCESS attempt 1
City linkage check   pull_request   37440891872   COMPLETED SUCCESS attempt 1
```

A newer push run on this head, 37441941363, is in_progress. It does not change the table but signals the branch may move again; claim-time measurement will recheck tip against the declared head.

## Author's numbers independently reproduced

Before claiming, independently measure the author's recorded numbers on this host. This first reviewer activity needs no claim: it is measurement, not verdict.

```text
作者记录 / author's record     Local full 1412 / 1409 PASS / 3 ENV_FAIL (resident City)
本机实测 / measured here @4b39468
  focused  tests/rex805-*.test.mjs（4 套件）        19 pass / 0 fail
  full     pnpm test                              1412 tests / 1409 pass / 3 fail
  3 项失败均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），跑后 tracked state CLEAN
=> 总数、通过数、失败数、以及失败的身份，逐项一致
```

Author recorded 1412 total / 1409 PASS / 3 ENV_FAIL from resident City. This host at `4b39468` measured four rex805 focused suites, 19 pass / 0 fail; full pnpm test, 1412 / 1409 / 3. All three failures are host-city-launcher tests because resident City occupies host reservation; tracked state clean after running. Total, pass count, fail count and failure identity agree item by item.

This is not Review's verdict. Formal Review follows claim and uses independently manufactured probes rather than rerunning author suites. Only the reproducibility of the author's numbers on this host is established here.

## Currently claimable work

```text
REX-805            开发未宣告完成（development_complete: false），不领取
REX-806/807/890    WAITING_DEPENDENCIES
SHOW-401           IN_PROGRESS，但已被 Owner 优先级裁定排除：
                   CEX-790 工作书 owner_priority_override_2026_10_06 =「CEX-790 merge-readiness first,
                   then MON directly; supersedes REX-before-MON. SHOW excluded.」
其余 NOT_STARTED 工作书（CHK/DGX/PCF/RIV/URA/XX）不在活跃池，未激活
=> 本机当前唯一的前进方向就是 REX-805 的复检，闸门一关即领
```

REX-805 development is not declared complete, so no claim. REX-806/807/890 are WAITING_DEPENDENCIES. SHOW-401 is IN_PROGRESS but excluded by Owner priority override: CEX-790 merge-readiness first, then MON directly; supersedes REX-before-MON; SHOW excluded. Other NOT_STARTED CHK/DGX/PCF/RIV/URA/XX workbooks are outside the active pool and unactivated. This host's only progression is REX-805 Review, to be claimed when its gate closes.

## Why record this separately

Same-round integration preflight established a Review-relevant fact: candidate head fast-forwards onto main, which is its ancestor, with 15 additional commits. Once accepted, mechanically merging by branch name would replace main's tip with the candidate line, rather than append a single commit. Review must therefore pin the exact workbook-recorded SHA, not the name. This is the trap in `reports/INTEGRATION_SOURCE_SWEEP_MECH.md`, in its sharpest form here.

## Actions after the gate closes

```text
1  重新 fetch，确认 review_host 仍为 null、tip 仍等于工作书声明的头（原子领取：先读后写，同一步推送）
2  发布 REVIEW_CLAIM_Mech.md：领取时间的测量（远端 tip、依赖祖先、精确头 CI 逐条、union baseline）
3  制造本机自己的探针（不复用作者套件）：replay 的确定性、ablation 比较、receipt 边界、
   “不可用条件不得被重放”这一拒绝路径、以及 store 不可用时的打字化拒绝
4  在有设备/工具链的真实条件下测量重放与实体对比；无法测量的部分如实标注 NOT_RUN，不当作通过
```

1. Fetch again; confirm review_host remains null and tip still equals declared head. Atomic claim reads then writes and pushes in the same step.
2. Publish REVIEW_CLAIM_Mech.md with claim-time remote tip, dependency ancestry, per-run exact-head CI and union baseline measurements.
3. Build this host's own probes, not author suites: replay determinism, ablation comparison, receipt boundaries, refusal of unavailable-condition replay and typed refusal when store is unavailable.
4. Measure replay versus physical behavior with available real devices/toolchains. Unmeasurable portions stay NOT_RUN, not passed.

**Instrument ready:** step 3's hardest replay chain works, as shown by `REPLAY_FIXTURE_FEASIBILITY_MECH.md`. On the same executor-less City, a real receipt with only the run supplemented exercised POST /research/replays and GET /research/replays/:id comparison, with 14 comparison fields. It also measured each source precondition, including placement equal to replayTarget(context, seed) and topology currently online. Review can use these directly as assertions rather than rediscover them.

**External seam remains:** development_complete=false and review_host=null; no author commit after `a524e1c`. Continue recording the true external seam without idling: wait for delivery to claim, and do only work feasible before it.

This file changes no workbook fields.
