# REX-890 开发主机 study（Mech，2026-10-07）/ REX-890 development-host study

```text
执行者 / host      Mech-DS（MEGA-REP）
对象 / city        常驻 City 544adda1-3059-4c6f-ae7d-71ddfd0f3b8c @ 172.31.12.151:4310
                  运行 feat/city-owner-remote-operation @ d11b03d（= 4-in-1 验证绿版 + 远程操作能力）
执行设备 / devices dev-544adda130594c6fae7d71ddfd0f3b8c（Mega-rep，本机）
                   dev-1428bce5297146df88720f270af71bc3（Alien / Mera-Alianware，**实体对侧机**）
结论 / result      **开发主机这一半完成：20/20 项检查通过**，最低 study 的 8 个要素全部由两个真实 agent 产出
```

## 0. 为什么这一半现在就能做

最低 study 的"multi-device execution"用的是**普通 canonical 任务**（WAIT 场景），对侧那台机器上**更早的 agent 也会执行它**。
只有"对侧独立复现"需要新 agent 的远程操作能力。因此开发主机这一半不依赖引导，先做完全合理。

## 1. 逐要素实测（全部读自城市，不是脚本自己的信念）

```text
要素 / element              实测 / measured
multi-device execution      6 次重复真的**交替**落在两台实体机上：3 次 dev-1428bce5（Alien）、3 次 dev-544adda1（Mech）
                            assignedNodeId 逐条为 dev-1428bce5,dev-544adda1,dev-1428bce5,dev-544adda1,dev-1428bce5,dev-544adda1
one routing decision        每次重复的放置都点名了执行设备（上表即证据）；**handoff 在 v1 不可表达**（supportedScenarios=[WAIT]，
                            机制表里 handoff/retry/backoff/recovery/selected-policy 全部 supported=false），照实记录不冒充
one injected fault          fault-593bd9ed-d752-4ca6-8ebf-9841bdb30a10，kind=PROVIDER_UNAVAILABLE，注入计数 **13**
                            定向性实测：被注入设备 claim -> HTTP 503，另一台 -> HTTP 200（**只有被注入的那台被拒**）
recovery                    故障停止后实测 recoveryTimeMs = **646**；停止=HTTP 200
repetitions                 计划 6 / 计入 6 / 实测 6，terminalAccountingComplete=true
one replay                  campaign-647b74cd-b4d2-415b-ab7b-c9914fbb7697，COMPLETED，在 dev-1428bce5 上真实执行
one ablation                campaign-12c003ce-f9f9-49e1-9b80-9201aab0d1d4，COMPLETED，在 dev-544adda1 上真实执行
                            且**消融真的改变了放置**：源 run=dev-1428bce5 → 关闭 alternate-device 后=dev-544adda1
artifact export             artifact-544adda1-…-**5-campaigns**，campaigns=5 runs=15 measured=15
                            completion_time_ms = 6532（n=15）、failure_rate = 0（n=15）、duplicate_execution_count = 0（n=15）
                            独立校验器（第二实现，不 import 导出器）：**15/15 通过**
```

主 campaign：`campaign-1a4ab016-4447-4ff0-a9cb-401eddd43e7f`，state=COMPLETED，reason=REPETITIONS_FINISHED，
summary={planned 6, accounted 6, measured 6, failed 0, excluded 0, cancelled 0, interrupted 0, terminalAccountingComplete true}。

## 2. 如实记录的"未测"（不是失败，是不编造）

```text
fault detectionTimeMs = null（typed NOT_MEASURED）
  原因：PROVIDER_UNAVAILABLE 拒绝的是**认领**，不是心跳，所以那台机器从未被观察为 offline，
  检测时间在这条故障类型上**不适用**。脚本没有因为它"反正会自己填"而放松，也没有把 null 读成 0。
artifact metrics        27 项点名指标里 4 项有值、23 项 NOT_MEASURED（各自带原因），与包内 exclusions 一致。
```

## 3. 本次脚本自己的缺陷（记录，因为它一开始看起来像产品拒绝）

```text
第一次运行报 REPLAY_SOURCE_INVALID，看起来是产品的复现拒绝，实际是**我的字段错误**：
  · 启动响应把新 campaign 放在 `started.campaignId`，而列表响应把运行中的放在 `live`；
    我只读了 `live`，于是 sourceCampaignId=undefined ⇒ 城市按契约正确地拒绝了它。
  · runs 在 campaign **详情**（GET /research/campaigns/<id> → campaign.runs）里，列表回执只有摘要；
    我读了列表，得到空数组，于是"多设备"与"重复数"两项被误报为失败。
修正后 20/20。**产品在这两处都没有错**，错的是取数路径；记在这里以免下一次把它读成回归。
另有两条被实测确认的产品行为，写进脚本注释而不是靠猜：
  · 复现要求**被记录的拓扑当前仍然在线**（关掉控制面后 -> REPLAY_TOPOLOGY_NOT_READY）
  · 前一个 campaign 未终结时第二次复现 -> REPLAY_BUSY（所以消融必须等 replay 结算完）
```

## 4. 与 REX-890 完成门槛的差距（只剩一项）

```text
完成门槛                    状态
dev 主机跑代表性 study      **已完成**（本文件）
multi-device / repetitions / fault / recovery / replay / ablation / export   全部有实测证据
one handoff or routing      routing 有实测证据；handoff 在 v1 不可表达 ⇒ 需记录持有人裁决（预检 §3 的 (i)/(ii)）
opposite-host 独立复现      **未开始**，唯一剩下的前置条件：Alien 那台机器需要跑一次新 agent
                            （见 REX-890_BOOTSTRAP_HANDOFF_Mech_2026-10-07.md；城市对它没有写入代码的通道）
RESEARCH_MATERIAL_SYNTHESIS 尚不存在（等对侧复现的对比结果一起写）
RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE  **未释放**
```

## 5. 不声称的事

```text
· 不声称 REX-890 完成：对侧独立复现未发生，终标未释放。
· 不声称高可用、性能提升或因果结论：failure_rate=0 与 completion_time_ms 是**单次 study 的观测**，不是承诺；
  23 项指标 NOT_MEASURED 就是它们的边界。
· 不声称 handoff 已被覆盖：v1 无该场景，只有放置决策被测量。
· 不把本机 node 当对侧：两台设备都真实存在并各自执行，但"独立复现"要求的对侧重建/重算**尚未进行**。
```
