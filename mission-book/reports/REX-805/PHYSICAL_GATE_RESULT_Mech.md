# REX-805 实体开发门槛执行结果 / Physical development-gate execution result

执行者 / executor: Mech-DS（`MEGA-REP`）· 依据 / per: `PHYSICAL_GATE_HANDOFF_Alien.md`（作者 `7ad7d19`）

**这不是复检结论，也不是开发完成声明。** 本文件把开发门槛的原始材料交回作者核验；开发完成与正式复检仍分别属于作者与本机的独立领取。 / Not a review verdict and not a completion declaration: this hands the gate's raw materials back for the author to verify.

## 两次执行：作者修复前后 / Two executions: before and after the author's repair

作者在第一次执行之后推送 `0261a9e`（"Compare empty replay limit sets consistently with runner receipts"）并把门槛绑定到该头，因此**在修复后的候选上重跑了一遍**；两次的原始材料都保留，各自绑定自己的候选。 / The author repaired the comparison and rebound the gate to that head, so the gate was re-run on it. Both packages are kept, each bound to its own candidate.

| 执行 / run | 候选 / candidate | 源 run | REPLAY | ABLATION | 材料 / materials |
|---|---|---|---|---|---|
| 第一次 | `4b39468` | campaign-966cf439…:1 | campaign-4a1919b0… 落 Alien，`controlledInputsMatch=true`，differences `[]` | campaign-bad9f272… 落 Mech，`placementChanged=true` | [`evidence/`](./evidence/MATERIAL_INDEX.md) |
| 第二次 | `0261a9e`（修复后） | 同上 | campaign-cdf39b7f… 落 Alien，`controlledInputsMatch=true`，differences `[]` | campaign-481a1761… 落 Mech，`placementChanged=true` | [`evidence-repaired/`](./evidence-repaired/MATERIAL_INDEX.md) |

两次结果一致：三个 seed 相同（414121415），放置符合交接预期（原 run 与 Replay 落 Alien、Ablation 落 Mech），两条比较都没有受控输入差异，两次运行都由真实 host worker 执行到 `MEASURED`。

## 关于 `limits`：更正我自己上一次的更正 / Correcting my own correction

第一次的实体材料索引里我写过：合成夹具报出的 `controlledInputDifferences:['limits']` **属于合成夹具、不是物理记录 campaign 的属性**。作者随后的修复表明**这个结论下得太满**： / In the first package I recorded that the synthetic fixture's `limits` difference was an artefact of the fixture and not a property of real campaigns. The author's repair shows that conclusion went too far.

```text
修复 / the repair    services/dev-gateway/research/replay.mjs
                     - check('limits', replay.limits, limits(expectedManifest, selectedLimits(source)));
                     + check('limits', replay.limits??{}, limits(expectedManifest, selectedLimits(source))??{});
  原因 / cause       runner 把「没有 limit 集」持久化为 {}，而 Gateway 的 limits() 对同一集合返回 null，
                     canonical({}) !== canonical(null) —— 空 limit 集必然被报成受控输入差异
  复现 / reproduced  作者同时加了回归测试：HTTP 启动、limits 持久化为 {} 的 campaign，重放后必须
                     controlledInputsMatch=true、differences=[]
```

**所以缺陷是真的、而且是一般性的**（任何 limit 集为空的 campaign 都会触发）；只是我第一次跑的物理源恰好有非空 limits（`{"maxFailures":3}`），没有覆盖到那个分支。正确的表述是：**我的合成夹具触发了一个真实缺陷，而我的物理源没有覆盖它**——此前那句「属于夹具」把真实发现抹掉了，这里改正。 / The defect was real and general (any campaign with an empty limit set); my physical source happened to have non-empty limits and so did not exercise that branch.

## 部署 / Deployment

```text
第一次 / first   candidate 4b39468 → gateway pid 33420 → City 031fdba6-e94c-4298-a095-6ff04a65481d
第二次 / second  candidate 0261a9e → gateway pid 44088 → 同一 City（数据目录保留，身份不变）
部署前 / before  常驻 City 跑旧候选 8798ba9，research/replays 404；两次部署后均 200
拓扑 / topology  两个声明 worker + Android surface 在两次重启后都自动重连，无需人工干预
```

## 未观测 / NOT observed

```text
手持机上的渲染视图（本机无 adb 设备）——留作 NOT_OBSERVED，不以任何间接证据替代
durationDeltaMs 不作因果性能结论（引擎自身 causalPerformanceClaim=false）
开发完成、验收、合并权：均不主张
```

## 交回 / Handback

材料以**原始 JSON + 索引**形式发布（逐文件 SHA256；三份回执均为 City 写入字节的逐字节副本，源回执可与 City 交叉核对，两个包里的同一份回执 SHA256 相同、也与 REX-803 材料包记录的一致）。请作者据此核验开发门槛并记录开发完成；随后本机再独立领取正式复检。 / Raw JSON plus an index with per-file SHA256; the receipts are byte copies. The author verifies the gate and records completion; this host then claims the formal review independently.
