# PCF 架构与合同设计

[English](en/ARCHITECTURE.md) · [总索引](README.md)

## 1. 推荐方案与排除项

选择 **WBC 之上的增量资源执行服务**，而不是重写 OS、重新建立任务数据库，或直接引入 Kubernetes/Ray 集群作为启动前提。第三方后端可以后续经 adapter 接入，但不是本计划的强制依赖。先做确定性策略、真实调用链和可复现实验；有证据后才做学习型策略。

数据流：`App/Agent → canonical Action/Task → WorkloadEnvelope → effective policy → observations + estimates → placement proposal → atomic admission → WBC backend → authorized executor → canonical result → origin surface`。

这不是 DGX 的语义问题分解。PCF 的 pipeline 只描述显式可执行阶段、数据和依赖，不负责生成医学/研究结论，不共享模型隐藏推理。

## 2. 所有权

| 事实/动作 | 唯一权威 | PCF 能做什么 |
|---|---|---|
| Task/Action/Attention、状态转移 | 现有 City core | 通过既有合同提交提案和回执 |
| device/installation identity、信任、传输 | Remote Fabric / 既有注册系统 | 引用 identity 与认证 transport |
| provider/model/channel/付费确认 | GAI | 携带约束、引用已授予的批准 |
| 工程目标、代码审查、Review→Repair | Engineering Manager / FR | 提供合格资源与执行 attempt |
| 资源观测、放置提案、预留 | PCF | 有界辅助状态；与 canonical task/version 绑定 |
| 实验、故障权限、回放/导出 | REX | 新场景和 schema adapter |
| 用户总览 | Monitor / 现有产品 UI | 可丢弃的投影，不持有任务真相 |

运行时源码候选目录：`contracts/personal-compute-fabric-v1/`、`services/personal-compute-fabric/`；保留 `services/dev-gateway/execution-backend/` 和 `services/headless-node-agent/` 所有权。路径在 PCF-700 核实冻结，不因本文件存在就创建源码。

## 3. 最小共享类型

**ResourceObservation**：nodeRef、installationRef、bootId、sequence、observedAt、receivedAt、TTL、source、unit、value、presence、freshness、quality。CPU/RAM/disk 为核心；GPU/VRAM/network/power/thermal 按可测能力添加。`KNOWN | UNKNOWN | UNSUPPORTED` 与 `FRESH | STALE | UNKNOWN` 正交。估计单列，不冒充测量；未知不填 0；过期不是物理容量为 0。

**WorkloadEnvelope**：canonical taskId/actionId、originSurfaceRef、workloadKind、versioned executorRef、input ArtifactRefs、requiredCapabilities、platformConstraints、resourceMinima、QoS、deadline、privacyScope、consentRef、retrySafety、checkpointContractRef。保留现有 `targetDeviceRef`；不可用 providerRef 或 handoffTargetRef 偷运新放置意图。QoS = `INTERACTIVE | SOFT_DEADLINE | BATCH | BACKGROUND`，不承诺未经测量的硬实时。

**EffectivePolicy**：policyVersion、allowedEndpointRefs、dataScope、budgetGrantRef、expiry、revocationVersion、localFirst、allowedFallbacks、resourceQuota、foregroundProtection。数据域明确区分 `ORIGIN_DEVICE_ONLY | TRUSTED_PERSONAL_FABRIC | APPROVED_CLOUD`；“本地”不能含混地代表整城或任意局域网。

**PlacementProposal**：decisionId、taskId、canonicalStateVersion、policyVersion、observationRefs、候选可行性/拒绝原因、chosenNodeRef、executionPlanRef、估计区间及来源、validUntil。只提案、不 claim。排序之前完成资格、信任、授权、数据边界及 strict-target 过滤；硬约束不能由软评分覆盖。

**ReservationReceipt**：reservationId、attemptId、taskId、nodeRef、resourceVector、ownerEpoch、expiresAt、stateVersion、commitToken。多请求同时抢一份资源必须只有一个成功；重试幂等。逻辑预留不是 OS 强制隔离，不能把二者混写。

**AttemptReceipt**：attemptId、same taskId/actionId、placementDecisionId、reservationId、executorVersion、inputDigest、fenceEpoch、progress/result/error、sideEffectState。重试产生新 attempt，不产生第二份 canonical task truth。

**CheckpointRef / ArtifactRef**：opaque artifactId、contentDigest、schema/executor/model compatibility、origin task/attempt、dataScope、authorizedLocations、size、expiry。引用和元数据也遵守隐私；内容摘要不是权限证明。

## 4. 关键接口（候选，由 700 冻结兼容映射）

| 所属任务 | 接口 | 必须性质 |
|---|---|---|
| 701 | `observeResources(sample, context) -> ResourceObservation` | 有界、版本化、缺测诚实 |
| 706 | `resolveEffectivePolicy(request, authorityFacts) -> EffectivePolicy | Refusal` | 不创建信任/预算授权 |
| 708 | `normalizeWorkload(canonicalTask, extension) -> WorkloadEnvelope` | legacy task 不受影响 |
| 702 | `planPlacement({workload, observations, policy, estimates}) -> PlacementProposal` | 纯函数、稳定 tie-break |
| 704 | `admit(proposal, expectedVersion) -> ReservationReceipt | Refusal` | 经 canonical owner 串行化/事务提交 |
| 709 | `resolveArtifact(ref, principal, destination) -> TransferPlan | Refusal` | 检查元数据/内容权限与位置 |
| 710 | `executeAttempt(envelope, reservation, controls) -> AttemptReceipt` | 真实执行、最小权限、有界取消 |
| 711 | `validateCheckpoint(ref, targetEnvironment) -> ResumeDecision` | 不兼容则拒绝，不假恢复 |
| 712 | `reconcileExecution(canonicalSnapshot, observations) -> ProposedActions` | crash-safe、epoch fencing |

现有 Store 未证明具备跨服务原子语义之前，不可把这张表当成它已经支持事务。V1 可使用已有 canonical owner 下的单写者串行化并补持久化原语；不能用独立 PCF 数据库伪造原子 claim。

## 5. 安全与恢复语义

授权按 dispatch、input transfer、executor start 和 result publish 四处重验；撤销不能仅影响下一次 UI 刷新。跨设备不等于跨信任域授权。现有 local-first、API 人工确认和严格目标都保留；预授权只在 Owner 明确给出的对象/预算/期限内有效。

lease 超时只表示可疑，不证明旧执行已停止。epoch fencing 阻止旧 attempt 再提交 canonical 状态；它不自动撤销已发生的外部副作用。任务必须区分可安全重试、可从 checkpoint 恢复、不可自动重试，以及 `SIDE_EFFECT_UNKNOWN`。最后一种先隔离/核验，不能宣称通用 exactly-once。

只迁任务或显式检查点，不承诺任意进程/GUI/VM 实时迁移。迁移需要兼容 executor、可用输入、授权、收益超过搬运成本、冷却期和 retry budget。strict target 的恢复仍留在指定目标，除非获得新的授权。

## 6. 并发、多应用与持续服务

Admission 先于执行，队列有上限；大任务不能永久饿死小任务，小任务也不能无限挤掉后台工作。资源预留同时考虑实际可用量、已有预留和观测过期。interactive/foreground 保护通过配额、准入、协作式降级和有支持的 preemption 实现，不随意杀游戏或系统进程。

Offload 使用显式阶段和数据边；流有 bytes/items 上限、credit/backpressure、deadline、取消、断链处理。模型上下文、缓存和患者/个人数据不得因共享加速器而跨用户/应用泄漏。

PCF-712 只监督执行生命周期，不接管 FR 的工程语义；PCF-716 可做到无浏览器/无交互登录会话的无人值守运行。控制器故障在 V1 应 fail-closed 并诚实报告；worker 故障恢复不等于控制面 HA。

## 7. UI 与能力登记

放置理由、资源状态进入 task/device detail；sharing、drain、profile、限额和授权是用户可操作项；原始 telemetry/epoch/trace 放 Technical Details。高风险和 unknown 向总览冒泡。沿用正常 Web/Android 控制端，不造必须看 console 的日常路径。

每份工作书声明候选 CAP ID、代码/接口/用户入口/证据所有权。新增计划不写入“已实现” inventory。组件可先按明确合同边界复核，但此时只标 component evidence；所有未完成 UI/接线 seam 必须保持禁用并归入 release 必需验收，不能把库测试当用户路径已完成。全局 exposure gate 始终优先。

## 8. 外部参考边界

Ray placement-group 文档说明资源组合原子预留属于既有系统机制；Android ADPF 文档说明热/功耗能力依赖设备支持。本计划不把通用预留、调度、重试或热管理命名成新颖贡献，也不因此强制引入这些框架。

- https://docs.ray.io/en/latest/ray-core/scheduling/placement-group.html
- https://developer.android.com/stories/games/lineagew-adpf

研究贡献需围绕个人多设备约束、真实干扰、授权连续性和故障恢复的可检验证据重新提出；投稿前刷新文献。
