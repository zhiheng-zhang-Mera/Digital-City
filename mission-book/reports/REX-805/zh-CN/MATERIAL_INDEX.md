# REX-805 实体开发门槛材料索引 / Physical development-gate material index

> 中文阅读译本。原始[材料索引](../evidence/MATERIAL_INDEX.md)保留完整字节及证据权威。读本位于 payload 之外，不构成正式复检或验收。

执行者：Mech-DS（`MEGA-REP`），在常驻 City 上依据作者的 `PHYSICAL_GATE_HANDOFF_Alien.md` 执行。**这不是正式复检结论**：它将开发门槛的原始材料交回作者核验。

## 绑定
```text
candidate SHA     4b3946868d4083285da8a8d99eac2642890b37c4
city ID           031fdba6-e94c-4298-a095-6ff04a65481d
exported at       2026-10-06T10:02:55.657Z
source campaign   campaign-966cf439-7017-4bb0-88e8-981e59c18322  run index 1
source seed       414121415
deployment        worktree D:/utopia-rex805-candidate at the candidate SHA -> gateway pid 33420 -> City 031fdba6-e94c-4298-a095-6ff04a65481d
topology at run   workers ["dev-031fdba6e94c4298a0956ff04a65481d","dev-8128a1ef25c5c4b7f66fc31b21705858"] surfaces ["dev-be7832e35fc34b85966c3bb43a992e1d"]
```

上述原始证据逐字保留候选 SHA、City ID、导出时间、来源 campaign 与 run index 1、来源 seed 414121415、部署工作树→Gateway PID→City 绑定，以及运行时声明的两个 worker 和 Android surface。字段说明不更改任何标识或读数。

City 从候选工作树停止并重启，保留数据目录，因此保留原身份及已注册的来源 experiment 和 receipt。重启前，运行中 City 的 replay 入口返回 404（当时运行旧候选 `8798ba9`）；重启后，`research/replays` 返回 200。

## 门槛结果
| 运行 | campaign | seed | 状态 | canonical task | worker | 受控输入匹配 controlledInputsMatch | 差异 differences | 放置改变 placementChanged |
|---|---|---|---|---|---|---|---|---|
| REPLAY | `campaign-4a1919b0-d99e-4085-ac50-4600bef555b1` | 414121415 | MEASURED | `Q-422d18b5-45ed-40f5-81eb-e1cd95b4890d` | dev-8128a1ef25c5c4b7f66fc31b21705858 | true | [] | false |
| ABLATION | `campaign-bad9f272-c7e6-4b0e-aa39-7752cf47a76f` | 414121415 | MEASURED | `Q-474aca57-43cf-4231-a279-d85911cd2d56` | dev-031fdba6e94c4298a0956ff04a65481d | true | [] | true |

```text
original (source run 1)  worker dev-8128a1ef25c5c4b7f66fc31b21705858  seed 414121415
REPLAY                                                     worker dev-8128a1ef25c5c4b7f66fc31b21705858
ABLATION (alternate-device disabled)                       worker dev-031fdba6e94c4298a0956ff04a65481d
all three seeds equal                                      true
fresh identities  replay experiment replay-30b2450b-f78a-4145-af9b-e5f94e65578e (VALIDATED) / ablation experiment replay-00dbd47c-cf2c-4154-a67f-f447196f7566 (VALIDATED)
```

原始证据说明：原 run 1 与 REPLAY 的 worker 为 Alien 的 `dev-8128a1ef25c5c4b7f66fc31b21705858`；ABLATION（alternate-device disabled）使用 Mech 的 `dev-031fdba6e94c4298a0956ff04a65481d`。三个 seed 相等为 true；Replay 和 Ablation 使用各自新 experiment 身份，状态均为 VALIDATED。上表完整保留 campaign、canonical task、seed、MEASURED 状态、实际 worker、受控输入匹配、差异集合及放置是否改变。

交接预期正是这种放置：原始 run 及其 Replay 在 Alien 主机执行，Ablation 按精确 disabled policy 在 Mech 执行。实测与此一致。每项运行均作为真实 canonical task 由真实 host worker 执行到 `MEASURED`，因此这些是实体结果，而非合成结果。

## 文件
| 文件 | 字节 | sha256 | 来源 |
|---|---|---|---|
| `ablation-comparison.json` | 3568 | `9d5372798dcd1727a1630efd6b698141ae600f2741556ce943c4714c750040bc` | API 响应 / 运行日志 |
| `ablation-receipt.json` | 4047 | `8c2d028cb517e464e6c0b1effcc2e9433b5ff1bcd9fc17e377817f5f844ff8f7` | City 持有文件的逐字节副本：campaign-bad9f272-c7e6-4b0e-aa39-7752cf47a76f.json |
| `canonical-tasks.json` | 2144 | `ff55630882c672765ea20bc171975e026c5a0106ab0d44e12696ba9aec8cf4a0` | API 响应 / 运行日志 |
| `deployment-and-topology.json` | 720 | `27dcb9e961b81848cd235bc9c23fca8c8a6a26e906d9c28e30f7001b234e0a6b` | API 响应 / 运行日志 |
| `experiment-registry.json` | 19116 | `55c79bce7a550449948287919e283d24cdd0055df6783dd47866c8450277c057` | API 响应 / 运行日志 |
| `replay-comparison.json` | 3537 | `2e1f002a58aec3fd9af004109d4878a6f70101fc27a2ca11ebfd85da379cb017` | API 响应 / 运行日志 |
| `replay-receipt.json` | 3956 | `cf7047dd5fc5a3216a1c5977ccd4daf2fa036c1e5cdc26dfaef4bfdc5c4404c0` | City 持有文件的逐字节副本：campaign-4a1919b0-d99e-4085-ac50-4600bef555b1.json |
| `RUN_LOG.txt` | 1770 | `a677eb45b562d4d2ca7a21d2af6435d9e554fe26e0d584868c02f07b3e50bf60` | API 响应 / 运行日志 |
| `source-receipt.json` | 3693 | `34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669` | City 持有文件的逐字节副本：campaign-966cf439-7017-4bb0-88e8-981e59c18322.json |

回执是逐字节副本，读者可与 City 比对。来源回执**没有**被改写成合成 run：交接明确要求如此；此前构造的合成仪器也明确不作为此门槛证据。

## 对本 programme 先前记录的一处更正（原索引历史叙述）
合成来源仪器报告 `controlledInputsMatch:false` 及 `controlledInputDifferences:["limits"]`，当时记为已定位、待实体测试的发现。实体测试给出的答案是：在**真实记录**的来源上，比较报告 `controlledInputsMatch:true` 且**没有**差异。原索引据此将 `limits` 差异归属于合成夹具——其 patched run 的 limits 来自另一种推导——而不是实体记录 campaign 的 replay 属性。

### 后续已发布的自我更正边界
上段完整保留原索引当时的解释，不能当作最终缺陷结论。[实体执行结果](../PHYSICAL_GATE_RESULT_Mech.md#关于-limits更正我自己上一次的更正--correcting-my-own-correction)随后明确更正：空 limit 集的 null 与 {} 比较缺陷真实存在且具有一般性；第一次实体来源有非空 `{"maxFailures":3}`，没有覆盖该分支。因此应理解为“合成夹具触发了真实缺陷，实体来源没有覆盖它”，不能用此历史解释抹去缺陷。原 payload 保持不变。

## 未观测项
```text
not observed   the handset-rendered view of either comparison on the physical device (no adb device on this host)
not observed   any claim about duration differences as performance: the comparison reports durationDeltaMs and the
               engine itself declines a causal performance claim (causalPerformanceClaim false)
not claimed    development completion, acceptance, or any merge authority - all three belong to the author or the Owner
```

- 未观测：实体手机上两份 comparison 的实际渲染视图；此主机没有 adb 设备。
- 未观测：把 duration 差异当作性能结论。Comparison 提供 durationDeltaMs，但引擎自身拒绝因果性能主张（causalPerformanceClaim=false）。
- 未主张：开发完成、验收或任何合并权限；三者仍属于作者或 Owner 的权限范围。
