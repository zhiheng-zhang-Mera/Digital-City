# REX-805 replay 链路：复检仪器可行性 / Replay chain: review-instrument feasibility

2026-10-06，Mech-DS（`MEGA-REP`）。对象：`integration/REX-805-candidate-mech-preflight @ 0d8bdce`（含候选 REX-805 `4b39468` 的并集）。 / On the union branch that carries the REX-805 candidate.

## 为什么做 / Why

上一轮的同城冒烟查明：replay **需要一个 `MEASURED` 的源 run**（带 `taskRef` 与按种子推导出的 `assignedNodeId`），而裸进程内的 City 没有任何执行者，所以跑出来的 run 是 `TIMEOUT`，replay 被拒。复检必须能跑通这条链路，否则 REX-805 的核心能力——重放与消融比较——就无法被观测。 / The smoke found that a replay needs a MEASURED source run, and a bare City cannot produce one. Without a workable way to reach the chain, the task's core capability cannot be observed at all.

本记录**不是复检结论**，而是把复检要用的仪器先做出来并证明它可用。 / This is instrument feasibility, not a review verdict.

## 方法：只补前提，不造证据 / Manufacture the precondition, not the evidence

```text
1  让 City 自己写出一份**真实**回执（真实 context、真实 manifestIdentity、真实 campaignSeed、真实 scenarioId）
   ——run 是 TIMEOUT，因为本机没有执行者：这恰恰是要补的前提
2  只把 **run** 改成真实 worker 会产生的形态：state=MEASURED、measured=true、warmup=false，
   result={taskRef: <City 自己创建的那条 canonical task 的真实 id>, state:COMPLETED,
           assignedNodeId: workers[seed % workers.length]}   <- 复现放置规则，而不是随手挑一个节点
3  重新注册节点让被记录的拓扑在当前**在线**（见下），然后 POST /api/v0/research/replays
4  GET /api/v0/research/replays/:campaignId 取比较结果
```

除 run 的结果之外，回执里每个字节都来自 City 自己。**造前提与造证据是两件事**，这个工具只做前者。 / Every byte except the run's outcome is the City's own.

## 结果 / Result

```text
REPLAY   status=200  started.campaignId=campaign-b1dee2a5-…  state=RUNNING
         replay={schemaVersion:1, mode:'REPLAY', …}
COMPARE  status=200  keys = state, campaignId, sourceRunRef, mode, disabledMechanisms,
         controlledInputsMatch, controlledInputDifferences, original, replayed, expectedTarget,
         placementChanged, durationDeltaMs, causalPerformanceClaim, determinism,
         nondeterministicConditions
DETERMINISM 同一源重放两次，在 9 个描述性字段上差异 = **无**；引擎自报 determinism='CONTROL_INPUTS_ONLY'
ABLATION     status=200；比较 mode=ABLATION、disabledMechanisms=['alternate-device']、
             expectedTarget='fx-worker'、**placementChanged=true**
             —— 源 run 放在 fx-alternate，关掉交替设备选择后应落在 fx-worker：消融机制**可被观测**
FEASIBLE     在没有执行者的 City 上，用「真实回执 + 补过的 run」完整跑通 REPLAY 与 ABLATION 两种模式
```

## 一处已定位的发现：`controlledInputsMatch` 会被误报为 false / A located finding

第一次跑通时就注意到比较结果把 `controlledInputsMatch` 报成 **false**、差异项是 `limits`。本轮把它查到了可以交付给复检的程度： / The first working run reported `controlledInputsMatch:false` with `controlledInputDifferences:['limits']`. This round located it.

```text
实测 / measured   源回执与重放回执的 limits **逐字节相同**（都是 {}），stopConditions / timeout / repetitions 亦相同
定位 / located    research/replay.mjs:108
                  check('limits', replay.limits, limits(expectedManifest, selectedLimits(source)));
                  —— 即把**持久化的** replay.limits 与一个**重新计算**的对象比较；这个 `limits` 由 gateway 注入
                  （server.mjs:679 注入 campaignLimits，HTTP 启动路径在 server.mjs:1177 用的是同一个函数）
推断 / inference  当持久化对象的形状与重算结果不同时，比较就会报出一个源与重放**并不存在**的受控输入差异
方向 / direction  这个误报方向是**保守**的：它声称不一致，而不是声称一致；但它使 controlledInputsMatch 作为
                  「这两次执行可比吗」的信号不再可靠
边界 / boundary   重算对象的确切形状（campaignLimits 在 requested={} 下的返回值）本轮**没有**完全推导出来，
                  所以这里只写「已实测 + 已定位」，不写结论性的根因归属
```

**这不是本次工具的问题**，而是被这次工具照出来的：仪器把「受控输入是否一致」做成了一个可读字段，于是它自己的这个维度是否可信，就能被检查了。复检时用**物理记录的**源回执再测一次即可定性（真实 campaign 也是走 HTTP 启动路径，因此很可能同样触发）。 / Not a flaw in this instrument - it is what the instrument made visible. The review should re-test with a physically recorded source.

## 引擎对源的要求（实测，复检直接可用）/ What the engine requires of a source

```text
源必须是终态 campaign（COMPLETED/STOPPED/FAILED），带 context.experimentId 与 runs[]
注册的 experiment 必须 VALIDATED，且 identity(original) 与 context.manifestIdentity 相符，manifest 规范化后一致
run：index 唯一、state 可观测、warmup=false、measured 与 state 一致、
     seed === runSeed(campaignSeed, index+offset)、result.taskRef 存在、
     **assignedNodeId === replayTarget(context, seed)**（放置必须与种子推导一致）
campaignSeed 为字符串、timeout 1..3600000、scenarioId 为字符串
preflight：**被记录的拓扑必须在“现在”是活的**（NOT_READY 一律拒：不可用条件不可确定性重放）；
          已有 campaign 正在 RUNNING 或 receipt store 非 READY 也会拒
          —— 实测细节：无心跳的注册节点会在**每次 30 秒等待**里掉线，所以**每一次** replay 之前都要重新注册；
          最初只注册一次，第二次 replay 与 ablation 都被 REPLAY_TOPOLOGY_NOT_READY 拒（工具因此改成每次刷新）
模式：v1 只支持 REPLAY 与「精确的 alternate-device 消融」；消融要求源具有可禁用的交替设备选择
     （声明 ≥2 workers 且运行期确实选中过交替设备）
```

**注意 `assignedNodeId === replayTarget(context, seed)` 这一条**：它意味着源回执里的放置与种子必须是自洽的——伪造一个「随手挑的节点」会被拒。这条规则本身就是 REX-803 那条种子规则的延伸，复检可以直接把它当断言用。 / The placement must agree with the seed-derived target, so a source whose placement and seed disagree is refused.

## 工具 / The instrument

`REPLAY_FIXTURE_FEASIBILITY_MECH.mjs`（本记录同目录），在并集分支的 worktree 里跑： / Published beside this record; run from a worktree of the union branch:

```powershell
node REPLAY_FIXTURE_FEASIBILITY_MECH.mjs
```

它只写临时目录，不碰任何工作书字段，也不改并集分支的一行代码。 / It writes only to a temp dir.

## 外部缝 / The external seam

REX-805 的 `development_complete` 仍为 **false**、`review_host` 仍为 **null**，对侧主机自 `a524e1c` 之后没有新提交。因此本机**仍未领取**复检（领取在作者交付之后），把这段时间用来把复检仪器准备好——这正是「只剩真实外部缝时，记录它并继续做能做的事，而不是空等」。 / The author's handover is the only remaining seam; the review is still unclaimed and this round built its instrument instead of idling.
