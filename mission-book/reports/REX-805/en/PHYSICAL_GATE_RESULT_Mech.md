> English reading translation / 英文阅读译本. The [source](../PHYSICAL_GATE_RESULT_Mech.md) remains authoritative; this reader grants no completion, review, acceptance, or merge authority.

# REX-805 Physical development-gate execution result

Executor: Mech-DS (`MEGA-REP`). Basis: `PHYSICAL_GATE_HANDOFF_Alien.md` (author commit `7ad7d19`).

**This is not a review verdict or a development-completion declaration.** This file hands the development gate's raw materials back to the author for verification. Development completion and formal review remain separate claims belonging to the author and this host respectively.

## Two executions: before and after the author's repair
After the first execution, the author pushed `0261a9e` (“Compare empty replay limit sets consistently with runner receipts”) and bound the gate to that head. Therefore, **the gate was run again on the repaired candidate**. Both sets of raw materials remain preserved, each bound to its own candidate.

| Execution | Candidate | Source run | REPLAY | ABLATION | Materials |
|---|---|---|---|---|---|
| First | `4b39468` | campaign-966cf439…:1 | campaign-4a1919b0… on Alien, `controlledInputsMatch=true`, differences `[]` | campaign-bad9f272… on Mech, `placementChanged=true` | [evidence/](../evidence/MATERIAL_INDEX.md) |
| Second | `0261a9e` (repaired) | Same as above | campaign-cdf39b7f… on Alien, `controlledInputsMatch=true`, differences `[]` | campaign-481a1761… on Mech, `placementChanged=true` | [evidence-repaired/](../evidence-repaired/MATERIAL_INDEX.md) |

Both executions have consistent outcomes: all three seeds are equal (414121415), placement matches the handoff's expectation (original run and Replay on Alien, Ablation on Mech), neither comparison has controlled-input differences, and both runs execute on real host workers through to `MEASURED`.

## About `limits`: correcting my own previous correction
In the first physical material index, I wrote that the synthetic fixture's `controlledInputDifferences:['limits']` **belonged to the synthetic fixture rather than being a property of physically recorded campaigns**. The author's subsequent repair shows that **this conclusion was too strong**:

```text
修复 / the repair    services/dev-gateway/research/replay.mjs
                     - check('limits', replay.limits, limits(expectedManifest, selectedLimits(source)));
                     + check('limits', replay.limits??{}, limits(expectedManifest, selectedLimits(source))??{});
  原因 / cause       runner 把「没有 limit 集」持久化为 {}，而 Gateway 的 limits() 对同一集合返回 null，
                     canonical({}) !== canonical(null) —— 空 limit 集必然被报成受控输入差异
  复现 / reproduced  作者同时加了回归测试：HTTP 启动、limits 持久化为 {} 的 campaign，重放后必须
                     controlledInputsMatch=true、differences=[]
```

The evidence above records the repair in `services/dev-gateway/research/replay.mjs`: normalize both compared limit sets with `??{}`. The cause is that the runner persists an absent limit set as `{}`, while the Gateway's `limits()` returns null for the same set. Because `canonical({}) !== canonical(null)`, an empty limit set was necessarily reported as a controlled-input difference. The author also added a regression test: a campaign started through HTTP whose limits persist as `{}` must report `controlledInputsMatch=true` and `differences=[]` after replay.

**The defect was therefore real and general** (any campaign with an empty limit set triggers it). My first physical source simply happened to have nonempty limits (`{"maxFailures":3}`) and did not exercise that branch. The correct statement is: **my synthetic fixture triggered a real defect, while my physical source did not cover it**. The earlier “belongs to the fixture” statement erased a real finding; this corrects it.

## Deployment
```text
第一次 / first   candidate 4b39468 → gateway pid 33420 → City 031fdba6-e94c-4298-a095-6ff04a65481d
第二次 / second  candidate 0261a9e → gateway pid 44088 → 同一 City（数据目录保留，身份不变）
部署前 / before  常驻 City 跑旧候选 8798ba9，research/replays 404；两次部署后均 200
拓扑 / topology  两个声明 worker + Android surface 在两次重启后都自动重连，无需人工干预
```

The first deployment binds candidate 4b39468 to Gateway PID 33420 and City 031fdba6-e94c-4298-a095-6ff04a65481d. The second binds candidate 0261a9e to PID 44088 and the same City, retaining the data directory and identity. Before deployment, the resident City ran old candidate 8798ba9 and research/replays returned 404; after both deployments it returned 200. Both declared workers and the Android surface automatically reconnected after both restarts, without manual intervention.

## NOT observed
```text
手持机上的渲染视图（本机无 adb 设备）——留作 NOT_OBSERVED，不以任何间接证据替代
durationDeltaMs 不作因果性能结论（引擎自身 causalPerformanceClaim=false）
开发完成、验收、合并权：均不主张
```

The handset-rendered view remains NOT_OBSERVED because this host has no adb device; no indirect evidence substitutes for it. durationDeltaMs establishes no causal performance conclusion: the engine itself records causalPerformanceClaim=false. Development completion, acceptance, and merge authority are not claimed.

## Handback
Materials are published as **raw JSON plus indexes**, with per-file SHA256. All three receipts are byte-for-byte copies of bytes written by the City. The source receipt can be cross-checked against the City; the copy in both packages has the same SHA256, also matching the REX-803 material package. The author should verify the development gate against these materials and record development completion. This host then independently claims formal review.
