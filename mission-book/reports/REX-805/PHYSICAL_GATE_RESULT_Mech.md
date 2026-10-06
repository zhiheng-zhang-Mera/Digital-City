# REX-805 实体开发门槛执行结果 / Physical development-gate execution result

执行者 / executor: Mech-DS（`MEGA-REP`）· 依据 / per: `PHYSICAL_GATE_HANDOFF_Alien.md`（作者 `7ad7d19`）
时间 / at: 2026-10-06T09:58:53Z · 材料索引 / materials: [`evidence/MATERIAL_INDEX.md`](./evidence/MATERIAL_INDEX.md)

**这不是复检结论，也不是开发完成声明。** 本文件把开发门槛的原始材料交回作者核验；开发完成与正式复检仍分别属于作者与本机的独立领取。 / Not a review verdict and not a completion declaration: this hands the gate's raw materials back for the author to verify.

## 部署 / Deployment

```text
候选 / candidate    4b3946868d4083285da8a8d99eac2642890b37c4（worktree D:/utopia-rex805-candidate）
部署绑定 / binding  候选 worktree → gateway pid 33420 → City 031fdba6-e94c-4298-a095-6ff04a65481d
数据目录保留 / data dir retained   City 身份、已注册源 experiment 与源回执均保留
部署前 / before     常驻 City 跑的是旧候选 8798ba9，research/replays 返回 404（与用户此前「Mech 已更新」的绑定一致）
部署后 / after      research/replays 返回 200；research/faults 仍 404（本候选含 803+805，不含 REX-804，符合预期）
拓扑 / topology     两个声明 worker 均在线：Mech dev-031fdba6…、Alien dev-8128a1ef…；Android surface
                    dev-be7832e3… 亦在线（City 重启后两端自动重连，无需人工干预）
```

## 门槛结果 / Gate result

源 / source：`campaign-966cf439-…` run index **1**，seed **414121415**，原 worker **Alien**。

| run | campaign | seed | state | canonical task | worker | controlledInputsMatch | differences | placementChanged |
|---|---|---|---|---|---|---|---|---|
| REPLAY | `campaign-4a1919b0-…` | 414121415 | MEASURED | `Q-422d18b5-…` | Alien | **true** | **[]** | false |
| ABLATION | `campaign-bad9f272-…` | 414121415 | MEASURED | `Q-474aca57-…` | **Mech** | **true** | **[]** | **true** |

```text
三个 seed 一致             414121415 = 414121415 = 414121415 ✓
放置与预期一致             原 run 与 Replay 落 Alien；Ablation 在 disabled=['alternate-device'] 下落 Mech ✓
新身份                     replay experiment replay-30b2450b…（VALIDATED）
                           ablation experiment replay-00dbd47c…（VALIDATED）
两次运行均为真实执行        两条 canonical task 都是 COMPLETED，由两台真实 host worker 执行
```

**两条比较的 `controlledInputDifferences` 都是空数组**——这一点顺带**更正了本机上一轮的记录**：合成源仪器当时报出 `['limits']`，而真实记录的源没有这条差异。因此那条差异属于合成夹具（补过的 run 与另一路推导出的 limits），不是物理记录 campaign 的重放属性。更正写在索引里，不在原记录上覆盖。

## 未观测 / NOT observed

```text
手持机上的渲染视图（本机无 adb 设备）——留作 NOT_OBSERVED，不以任何间接证据替代
durationDeltaMs 不作因果性能结论（引擎自身 causalPerformanceClaim=false）
开发完成、验收、合并权：均不主张
```

## 交回 / Handback

材料已按作者要求以**原始 JSON + 索引**形式发布（含逐文件 SHA256；三份回执均为 City 写入字节的逐字节副本，源回执可与 City 交叉核对——它与 REX-803 材料包里的同一份回执 SHA256 相同）。请作者据此核验开发门槛并记录开发完成；随后本机再独立领取正式复检（探针已在 `REVIEW_READINESS_MECH.md` 与 `REPLAY_FIXTURE_FEASIBILITY_MECH.md` 中就绪）。 / Raw JSON plus an index with per-file SHA256; the receipts are byte copies. The author verifies the gate and records completion; this host then claims the formal review independently.
