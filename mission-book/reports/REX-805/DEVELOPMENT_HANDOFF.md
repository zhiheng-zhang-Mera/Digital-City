# REX-805 开发交付 / Development handover

作者 / Author: Alien · 日期 / Date: 2026-10-06 · 精确候选 / Exact candidate: `0261a9ed1cec88df3ab4675623d422b37b33f270` · [PR38](https://github.com/zhiheng-zhang-Mera/utopia/pull/38).

## 交付判定 / Handover decision

作者宣告开发完成并交付正式对侧复检，**不释放验收 terminal，也不授权产品 main 合并**。交付依据包括最终候选的 CI、真实 Gateway 回归和独立代码复审，以及前驱 `4b39468` 的已核验实体 original→Replay→Ablation。最后一次改动仅修复无额外限制时 null/{} 的比较误报；实体材料中两次运行均有 maxFailures=3，走的是此前已实测的非空限制路径。这里明确采用这份有界前驱材料作为开发门槛依据，**不声称实体运行已部署或执行最终候选**。正式 reviewer 应在最终候选上重新核对其独立探针和部署绑定，必要时重跑实体比较后才能裁决。

The author declares development complete and hands it over for opposite-host formal review, **without releasing the acceptance terminal or granting product-main merge authority**. The evidence combines final-candidate CI, real Gateway regressions and independent code review with independently checked physical original→Replay→Ablation on predecessor `4b39468`. The final change only repairs null/{} comparison for absent extra bounds; both physical runs have maxFailures=3 and exercised the already measured nonempty-bound path. This bounded predecessor material is explicitly the physical basis for the development gate. **It does not establish deployment or physical execution of the final candidate.** Before a verdict, the formal reviewer must recheck its independent probes and deployment binding at the final candidate and rerun physical comparison where needed.

## 最终代码检查 / Final implementation checks

- 精确 push `37446455570`、PR `37446461188`、linkage `37446461192` 均 COMPLETED SUCCESS，逐次 API 核对 headSha；两个 V0.2 Android 和 Gateway/Web jobs 均成功。
- 本地精确版本完整套件 1413 / 1410 PASS / 3 ENV_FAIL；三项均为常驻正式 City 占用主机预约时 launcher 的显式拒绝，不删除失败也不停联机服务。代码工作树及远端 PR/分支精确版本一致且干净。
- 核心/Gateway/种子 18/18 PASS；真实 HTTP 无限制回归先 RED（2通过1失败）再 GREEN。独立 critic 18/18，另自建探针确认 null/{} 同义，而新增 maxFailures、wallClockMs、minSuccessfulRuns 仍报告真实 limits 差异。此前六项 Important 修复保留完整历史。
- 本地 Android 构建从前驱启动，21 suites / 111 tests / 0 failures / 0 errors；新修复未改 Android 来源。APK 构建不证明手机新安装或手持渲染验收。

- Exact push `37446455570`, PR `37446461188` and linkage `37446461192` all completed successfully, with individually checked headSha; both V0.2 Android and Gateway/Web jobs succeed.
- The exact local full suite has 1413 tests, 1410 passes and three environment failures: explicit launcher refusals while the formal resident City occupies its reservation. Failures remain recorded and the connected service remains running. The code worktree is clean and remote PR/branch heads match.
- Core/Gateway/seed tests pass 18/18. The real HTTP unbounded regression went from RED (two passes, one failure) to GREEN. Independent critic tests pass 18/18; its own probe confirms null/{} equivalence while added maxFailures, wallClockMs and minSuccessfulRuns remain real limits differences. The preceding six Important repairs retain their history.
- The local Android build started at the predecessor and passed 21 suites / 111 tests with no failures or errors. The final repair changes no Android source. An APK build does not prove a fresh phone installation or rendered-handset acceptance.

## 实体材料的独立核验 / Independent physical-material verification

[材料](evidence/MATERIAL_INDEX.md)及[63项独立核验](independent-material-checks-Alien.json)：九文件原始字节长度/hash 均符合索引，源 receipt 与 REX-803 原材料逐字相同，重新推导种子和规范解析 digest；两条新任务、registry/manifest 身份、限制、种子、exact disabled policy、比较及落点互相对应。不调用产品引擎来证明产品自己的比较。首次核验工具把 registry API envelope 当作内部 record，触发 KeyError；工具改为读取明确的 experiment 字段后才产生最终63/63结果，原材料未改。

The [packet](evidence/MATERIAL_INDEX.md) and [63 independent checks](independent-material-checks-Alien.json) confirm all nine indexed file lengths/hashes, byte equality with the REX-803 source receipt, independently derived seed/canonical digest, and corresponding new tasks, registry/manifest identities, limits, exact disabled policy, comparisons and placements. Verification does not invoke the product engine to certify its own comparison. The first verification tool mistook a registry API envelope for an internal record and raised KeyError; only after explicitly reading its experiment field did the final 63/63 result exist. Raw material was unchanged.

2026-10-06T10:07:17.586Z，Alien 使用官方 MEMBER 会话独立读取正式 City，`Q-422d18b5-45ed-40f5-81eb-e1cd95b4890d`（Replay/Alien）与 `Q-474aca57-43cf-4231-a279-d85911cd2d56`（Ablation/Mech）均 COMPLETED，researchRunRef 与发布材料一致。这证明规范任务存在及状态，不是独立远程 PID→源码审计。

At 2026-10-06T10:07:17.586Z, Alien independently read the formal City through an official MEMBER session. `Q-422d18b5-45ed-40f5-81eb-e1cd95b4890d` (Replay/Alien) and `Q-474aca57-43cf-4231-a279-d85911cd2d56` (Ablation/Mech) were completed, with researchRunRef matching the packet. This verifies canonical task existence and state, rather than independently attesting remote process-to-source identity.

## 保留的边界 / Retained boundaries

实体包部署绑定仍为4b39468，最终0261a9e实体执行尚未观测；phone comparison rendering 为 NOT_OBSERVED，intent validation 为 NOT_TESTED。当前进程软件来源的 lineage 字段仍为 null，源 manifest refs 不是当前进程证明。WAIT 是 v1 支持范围，其余机制/未快照文件和故障条件按明确错误拒绝；duration delta 不代表因果性能。Mech 材料中“limits差异仅属合成夹具”的宽泛推论须收窄：本次有 maxFailures=3 的实体源确实没有差异，但 Alien 已通过真实 HTTP 无额外限制的 campaign 复现并修复误报。两种观测适用条件不同，均保留。

The packet remains bound to deployment 4b39468; final 0261a9e physical execution is unobserved. Phone comparison rendering is NOT_OBSERVED and intent validation is NOT_TESTED. Lineage current-process software identity remains null: source manifest references do not attest the current process. V1 supports WAIT; other mechanisms and unsnapshotted file/fault conditions are explicitly refused. Duration deltas do not establish causal performance. Mech's broad inference that the limits difference belongs only to a synthetic fixture is narrowed: this physical source with maxFailures=3 indeed has no mismatch, while Alien reproduced and repaired the mismatch using a real HTTP campaign without extra bounds. Both observations retain their distinct conditions.
