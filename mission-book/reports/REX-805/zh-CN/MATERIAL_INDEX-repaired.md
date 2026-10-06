# REX-805 实体开发门槛材料索引 / Physical development-gate material index

> 中文阅读译本。原始[材料索引](../evidence-repaired/MATERIAL_INDEX.md)保留完整字节及证据权威。读本位于 payload 之外，不构成正式复检或验收。

执行者：Mech-DS（`MEGA-REP`），在常驻 City 上依据作者的 `PHYSICAL_GATE_HANDOFF_Alien.md` 执行。**这不是正式复检结论**：它将开发门槛的原始材料交回作者核验。

## 绑定
```text
candidate SHA     0261a9ed1cec88df3ab4675623d422b37b33f270
city ID           031fdba6-e94c-4298-a095-6ff04a65481d
exported at       2026-10-06T10:13:14.436Z
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
| REPLAY | `campaign-cdf39b7f-f6ff-4ddf-b611-4139f64c57d5` | 414121415 | MEASURED | `Q-bb06cb49-8cf4-498a-999b-77dd399a3a33` | dev-8128a1ef25c5c4b7f66fc31b21705858 | true | [] | false |
| ABLATION | `campaign-481a1761-1b5d-440d-a5a0-1743599b512a` | 414121415 | MEASURED | `Q-c2681877-d9a7-43b7-a127-1ead05e6edcb` | dev-031fdba6e94c4298a0956ff04a65481d | true | [] | true |

```text
original (source run 1)  worker dev-8128a1ef25c5c4b7f66fc31b21705858  seed 414121415
REPLAY                                                     worker dev-8128a1ef25c5c4b7f66fc31b21705858
ABLATION (alternate-device disabled)                       worker dev-031fdba6e94c4298a0956ff04a65481d
all three seeds equal                                      true
fresh identities  replay experiment replay-ed2c6feb-56d9-4e75-8140-6504727012da (VALIDATED) / ablation experiment replay-db5f006c-aa4f-4612-b361-5721732f01f7 (VALIDATED)
```

原始证据说明：原 run 1 与 REPLAY 的 worker 为 Alien 的 `dev-8128a1ef25c5c4b7f66fc31b21705858`；ABLATION（alternate-device disabled）使用 Mech 的 `dev-031fdba6e94c4298a0956ff04a65481d`。三个 seed 相等为 true；Replay 和 Ablation 使用各自新 experiment 身份，状态均为 VALIDATED。上表完整保留 campaign、canonical task、seed、MEASURED 状态、实际 worker、受控输入匹配、差异集合及放置是否改变。

交接预期正是这种放置：原始 run 及其 Replay 在 Alien 主机执行，Ablation 按精确 disabled policy 在 Mech 执行。实测与此一致。每项运行均作为真实 canonical task 由真实 host worker 执行到 `MEASURED`，因此这些是实体结果，而非合成结果。

## 文件
| 文件 | 字节 | sha256 | 来源 |
|---|---|---|---|
| `ablation-comparison.json` | 3566 | `177f137886e74cf6c5ae4abad23b0c0b1d90b826ff2bb61a35707582c5a7b84e` | API 响应 / 运行日志 |
| `ablation-receipt.json` | 4047 | `732c0d12c8fceebb9693c2f2d38eef04539d8f0f35a687c27092213dfc7a2b60` | City 持有文件的逐字节副本：campaign-481a1761-1b5d-440d-a5a0-1743599b512a.json |
| `canonical-tasks.json` | 2144 | `7e5a737dc37fe9b0c199b9d4fab646d9574c149a40aa73e825679943ea967a2d` | API 响应 / 运行日志 |
| `deployment-and-topology.json` | 720 | `e2631def2cdeeef31161b009043594f9414077316d9df9b9d0ee6a49fa2c18c5` | API 响应 / 运行日志 |
| `experiment-registry.json` | 19116 | `98ceb88979ff3d0266453be7b1ff10da972cbbe564a53ad2f47be91601271d44` | API 响应 / 运行日志 |
| `replay-comparison.json` | 3537 | `c3148523f0f5191a82b7b75a055255fbca6fdbd9d27bccd81cbd86406c82b7c3` | API 响应 / 运行日志 |
| `replay-receipt.json` | 3956 | `f74f725a564bbda21c15068f7e27319f42d28e74dcc2a974592893eef127f34f` | City 持有文件的逐字节副本：campaign-cdf39b7f-f6ff-4ddf-b611-4139f64c57d5.json |
| `RUN_LOG.txt` | 1770 | `a0b6fcb8bfa00c5f78c24e355b6878cf8b4d18502a0745f044ed98e797213a44` | API 响应 / 运行日志 |
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

## 来源记录的差异边界
本索引原代码块仍写 Gateway PID 33420；同次第二执行的结果报告写 PID 44088。读本保留两份历史记录，不自行改写或推断哪一读数正确。原索引中文标题含乱码，本读本依据其完整可读英文解释翻译，不猜测损坏字符。
