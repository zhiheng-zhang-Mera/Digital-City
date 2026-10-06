> Reading translation / 阅读译本. Full historical English reading, not a new verdict, claim or authority record. Original evidence blocks remain literal and the canonical source governs recorded status.

[Canonical source](../REPLAY_FIXTURE_FEASIBILITY_MECH.md)

# REX-805 Replay Chain: Review-Instrument Feasibility

2026-10-06, Mech-DS (`MEGA-REP`). Target: `integration/REX-805-candidate-mech-preflight @ 0d8bdce`, a union containing REX-805 candidate `4b39468`.

## Why

The preceding same-City smoke established that replay needs a MEASURED source run with `taskRef` and seed-derived `assignedNodeId`. A bare in-process City has no executor, producing TIMEOUT and rejected replay. Review must be able to exercise this chain, or REX-805's core replay/ablation-comparison capability cannot be observed.

This report proves the review instrument works; it is not a review verdict.

## Method: construct the precondition, not evidence

```text
1  让 City 自己写出一份**真实**回执（真实 context、真实 manifestIdentity、真实 campaignSeed、真实 scenarioId）
   ——run 是 TIMEOUT，因为本机没有执行者：这恰恰是要补的前提
2  只把 **run** 改成真实 worker 会产生的形态：state=MEASURED、measured=true、warmup=false，
   result={taskRef: <City 自己创建的那条 canonical task 的真实 id>, state:COMPLETED,
           assignedNodeId: workers[seed % workers.length]}   <- 复现放置规则，而不是随手挑一个节点
3  重新注册节点让被记录的拓扑在当前**在线**（见下），然后 POST /api/v0/research/replays
4  GET /api/v0/research/replays/:campaignId 取比较结果
```

1. Let City write a genuine receipt with real context, manifestIdentity, campaignSeed and scenarioId. The run is TIMEOUT because no executor exists locally; that is the missing precondition.
2. Change only the run into the shape a real worker would produce: state=MEASURED, measured=true, warmup=false; result references the actual canonical task ID City created, COMPLETED state and `workers[seed % workers.length]` as assignedNodeId. Reproduce placement rules rather than arbitrarily choosing a node.
3. Reregister nodes so recorded topology is currently online, then POST `/api/v0/research/replays`.
4. GET `/api/v0/research/replays/:campaignId` for comparison.

Every receipt byte except the run outcome originates from City. Constructing preconditions and constructing evidence are different; this tool does only the former.

## Result

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

REPLAY returned 200, started campaign `campaign-b1dee2a5-…`, RUNNING, replay schemaVersion 1/mode REPLAY. COMPARE returned 200 with state, campaignId, sourceRunRef, mode, disabledMechanisms, controlledInputsMatch, controlledInputDifferences, original, replayed, expectedTarget, placementChanged, durationDeltaMs, causalPerformanceClaim, determinism and nondeterministicConditions.

Replaying the same source twice produced no differences across nine descriptive fields; the engine reports `CONTROL_INPUTS_ONLY` determinism. ABLATION returned 200, mode ABLATION, disabledMechanisms `['alternate-device']`, expectedTarget `fx-worker`, placementChanged=true. The source used fx-alternate; disabling alternate-device selection should use fx-worker, so the ablation mechanism is observable. REPLAY and ABLATION both fully exercised on a City without executors using a real receipt plus the supplemented run.

## Located finding: controlledInputsMatch can falsely report false

The first successful run reported controlledInputsMatch=false with limits as the difference. This round located it sufficiently for handoff to Review:

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

Measured source/replay receipt limits are byte-identical `{}`; stopConditions, timeout and repetitions also match. Located at `research/replay.mjs:108`: persisted `replay.limits` is compared with a recomputed object through `check('limits', replay.limits, limits(expectedManifest, selectedLimits(source)))`. Gateway injects this limits function: campaignLimits at `server.mjs:679`, with the same function used by HTTP startup at `server.mjs:1177`.

Inference: when the persisted shape differs from recomputation, comparison reports a controlled-input difference that does not actually exist between source and replay. The false report is conservative: it says different rather than equal. Nonetheless it makes controlledInputsMatch unreliable as a comparability signal. Boundary: this round did not fully derive campaignLimits' exact return shape for requested={}; only measurement and location are claimed, not a conclusive root-cause attribution.

This is not a flaw in the tool, but something the tool exposed. Making input equality a readable field lets its own trustworthiness be checked. Review should retest using a physically recorded source receipt; real campaigns also start through HTTP, so they likely trigger the same behavior. That likelihood remains an inference.

## Measured engine source requirements, directly usable in Review

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

- Source campaign must be terminal: COMPLETED/STOPPED/FAILED, with context.experimentId and runs[].
- Registered experiment must be VALIDATED, identity(original) must match context.manifestIdentity, and normalized manifests must agree.
- Run index unique; state observable; warmup=false; measured agrees with state; seed equals runSeed(campaignSeed, index+offset); result.taskRef exists; assignedNodeId equals replayTarget(context, seed).
- campaignSeed is a string; timeout is 1..3600000; scenarioId is a string.
- Preflight requires recorded topology to be live now. NOT_READY is always refused: unavailable conditions cannot be deterministically replayed. An already RUNNING campaign or non-READY receipt store also causes refusal.
- Registered nodes without heartbeats go offline during each 30-second wait, so reregister before every replay. Registering only once caused the second replay and ablation to fail REPLAY_TOPOLOGY_NOT_READY; the tool was changed to refresh every time.
- v1 supports only REPLAY and exact alternate-device ablation. Ablation requires a disableable alternate selection: at least two declared workers and actual alternate selection during execution.

Especially note `assignedNodeId === replayTarget(context, seed)`: source placement and seed must be self-consistent; arbitrarily fabricated placement is refused. This extends REX-803's seed rule and is directly usable as a review assertion.

## Instrument

`REPLAY_FIXTURE_FEASIBILITY_MECH.mjs`, beside this report. Run from the union branch's worktree:

```powershell
node REPLAY_FIXTURE_FEASIBILITY_MECH.mjs
```

It writes only a temporary directory, changes no workbook fields and edits no union-branch code.

## External seam

REX-805 development_complete remains false and review_host remains null. The opposite host has no new commit after `a524e1c`. This host has not claimed Review, which follows author handover. It used the interval to prepare an instrument: record the real remaining external seam and continue feasible work rather than idle.
