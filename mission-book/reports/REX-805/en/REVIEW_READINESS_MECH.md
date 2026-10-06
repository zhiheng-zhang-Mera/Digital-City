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

## Physical-gate handoff received

At `7ad7d19`, the author published `PHYSICAL_GATE_HANDOFF_Alien.md`, handing this host execution of the development gate. It explicitly is not a declaration of development completion, a Review claim or acceptance, and grants no product-main merge authority. `development_complete=false` remains.

The handoff also confirms the instrument's boundary, which this host fully accepts and records: synthetic run outcomes cannot establish physical acceptance. The instrument only prepares familiarity with fields that Review will inspect; it cannot serve as gate evidence.

The handoff supplies this ready-to-execute source. This host will use it directly rather than independently derive another:

```text
sourceCampaignId  campaign-966cf439-7017-4bb0-88e8-981e59c18322
sourceRunIndex    1
source seed       414121415
source task       Q-f78eaee3-2380-468e-969d-6012fba109b9
original worker   dev-8128a1ef25c5c4b7f66fc31b21705858 (Alien)
first worker      dev-031fdba6e94c4298a0956ff04a65481d (Mech)
timeout / limits  30000 / {"maxFailures":3}
digest kind       CANONICAL_PARSED_RECEIPT_SHA256
source digest     1390b60885d52bf1284b7b57f0a94a3db67d39ecedfb271a94d9c119035ed67a
```

### This host's execution plan — next steps

```text
1  保留正式 City 数据目录，把常驻 City 更新到候选（或包含候选的版本），并记录「候选 → 实际进程」的部署绑定
   —— 注意：此前用户对「Mech 已更新」的确认绑定的是旧候选 8798ba9，不能据此推定新候选已部署
2  确认两个声明 worker 当前可用
3  通过 Owner Research 端点：先 REPLAY（源 run 1），等终态；再从同一源 run 执行 alternate-device ABLATION，等终态
   期望放置：original 与 Replay 落 Alien，Ablation 按 exact disabled policy 落 Mech；三个 seed 应一致
4  导出：原 receipt、两个新 receipt、对应 experiment registry、两条 canonical task、两份 comparison，
   以及时间戳、City 身份、部署绑定与所有失败/timeout/缺失项；独立核对 source digest、新身份、seed offset、
   timeout、failure bound、manifest/registry 引用、实际放置与 controlledInputDifferences
5  原始材料与索引交作者验证开发门槛；作者记录开发完成后，本机再独立领取正式复检
```

1. Preserve the formal City data directory, update resident City to the candidate or a version containing it, and record the deployment binding from candidate to actual process. The user's earlier confirmation that Mech was updated bound the old candidate `8798ba9`; it cannot establish deployment of the new candidate.
2. Confirm both declared workers are currently available.
3. Through Owner Research endpoints, first REPLAY source run 1 and await terminal state, then run alternate-device ABLATION from the same source run and await terminal state. Expected placement: original and Replay on Alien; Ablation on Mech under the exact disabled policy. All three seeds should match.
4. Export the original receipt, two new receipts, corresponding experiment registry, two canonical tasks and two comparisons; retain timestamps, City identity, deployment binding and every failure, timeout or missing item. Independently check source digest, new identities, seed offset, timeout, failure bound, manifest/registry references, actual placement and controlledInputDifferences.
5. Give raw materials and their index to the author to verify the development gate. Only after the author records development completion does this host independently claim Formal Review.

Every unobserved item remains NOT_OBSERVED. Synthetic results or results with different inputs cannot substitute.

This file changes no workbook fields.
