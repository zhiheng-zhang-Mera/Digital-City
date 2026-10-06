# MB-010 评估报告（中文阅读译本）

> Reading translation / 阅读译本：完整历史阅读译本；原报告为权威记录，不创建第二份任务元数据，不更新历史状态。证据代码块原样保留。

```text
MISSION = MB-010
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST = Mech
CLAIM_COMMIT = e424178c35dd7f47cd859dc5e784186c2e976a91   (Digital-City main)
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080
UTOPIA_MAIN_BASELINE = zhiheng-zhang-Mera/utopia@756c7d760c605e33ba386e87605e078fe24b82ca
ASSESSMENT_BRANCH = mission/MB-010-node-fabric
ASSESSMENT_HEAD = 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526
ASSESSMENT_RESULT = NO_VALUE
```

```text
PLANNED_CAPABILITIES = NF-01, NF-02, NF-03, NF-04, NF-05   (count 5)
SELECTED_GAP_CLOSURES = none
ABANDONED_CAPABILITIES_AND_REASONS =
  NF-01 DUPLICATE_EQUIVALENT
  NF-02 DUPLICATE_EQUIVALENT
  NF-03 OBSOLETE_DONOR
  NF-04 UTOPIA_SUPERIOR
  NF-05 DUPLICATE_EQUIVALENT + NO_REAL_CONSUMER + NO_INDEPENDENT_VALUE
ASSESSMENT_RESULT = NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

上述元数据记录迁移侧评估主机 Mech、领取提交、冻结 donor 与 Utopia 基线、评估分支及 HEAD。计划 NF-01–05 五项能力，没有选定 gap closure；NF-01/02 等价重复、NF-03 donor 过时、NF-04 Utopia 更优、NF-05 等价重复且无真实消费者/独立价值。结果 `NO_VALUE`，判断无价值、任务保留、未迁移。

## 0. 领取依据

选择遵循 [MISSION_INDEX.md](../../../MISSION_INDEX.md) 及 [README.md](../../README.md) §3。

```text
P0 (verification / integration): NONE eligible.
   MB-001..MB-009 all have verification_complete = true.
   Every mission branch measured AheadOfMain = 0 against utopia@756c7d7
   (MB-001..MB-009 all merged; the only branch with unmerged commits was the
   pre-mission mech/knowledge-room-k0, which is not a Mission branch and is 192
   commits behind main).
P1A (assessment-first): MB-010 is the lowest-sequence enabled assessment-first
   Mission with assessment_complete = false and an unclaimed assessment stage.
```

领取时 P0 没有可选验证/集成：MB-001–009 均 `verification_complete = true`，对 utopia@756c7d7 测得所有 mission branch 的 AheadOfMain = 0，均已合并。唯一含未合并提交的 `mech/knowledge-room-k0` 是前任务分支，并非 Mission 分支，落后 main 192 提交。P1A 中，MB-010 是 sequence 最小、已启用 assessment-first、`assessment_complete = false` 且评估阶段无人领取的任务。

`UNMERGED_WIP_LIMIT` 不阻止本次领取：纯评估分支没有实质实现提交，故不计入 WIP。

## 1. 计划 donor 能力

任务命名“Boss Node Fabric”能力集。Donor **没有字面叫 `node-fabric` 的模块**；它映射到 node/fleet/identity 家族。映射通过阅读冻结树建立，不能按目录名猜测。

| ID | 计划能力 | 定位到的 donor 锚点 |
|---|---|---|
| NF-01 | node principal / 注册 / 成员身份事实 | `src/shared/tenx/node.ts`（`NodeIdentity`）、`electron/tenx/node-identity-registry.ts`（`TenxNodeRegistry`、`emptyAdvertisement`）、`electron/node/node-capability-registry.ts`、`src/shared/tenx/fleet.ts`（`FleetMemberRecord`） |
| NF-02 | heartbeat / 活性 / 离线事实 | `src/shared/tenx/node.ts`（`heartbeat`、`rederiveState`）、`src/shared/fleet.ts`（`nodeStateFor`、`detectDropouts`、`FLEET10_*`）、`electron/tenx/login-health.ts` |
| NF-03 | runtime endpoint 元数据 / node endpoint 事实 | `src/shared/tenx/network.ts`（`NodeNetworkReport`、`ProviderMatrixRow`、`effectiveNetworkState`）、`electron/tenx/network-registry.ts`（`TenxNetworkRegistry`、`selectRoute`）、`electron/tenx/provider-matrix.ts`、`electron/tenx/host-adapter.ts` |
| NF-04 | 作为 node 事实的硬件/资源 telemetry | `electron/runtime-intelligence/node-profiler.ts`、`src/shared/runtime-intelligence/node-profile.ts`、`electron/runtime-intelligence/node-telemetry-log.ts`、`src/shared/node-capabilities.ts`（`NodeProbeData`）、`electron/node/node-inspector.ts` |
| NF-05 | capability-host 广告 / capability 到 node 的承载事实 | `src/shared/tenx/node.ts`（`NodeCapabilityFlags`、`NodeCapabilityAdvertisement`、`canAcceptWork`）、`src/shared/fleet.ts`（`capabilityInventory`）、`electron/node/node-capability-registry.ts` |

计划能力数量 = **5**。

## 2. 领取时 Utopia 能力清单（基线 `756c7d7`）

决定性事实：**MB-001 已从同一个冻结基线迁移 donor 自己的 node 逻辑。** `city/00-foundation/01-city-core/fleet-routing` 的 `DONOR.json` 记录如下：

```text
repository = zhiheng-zhang-Mera/Codex-Boss
commit     = 8df428eaa437a409368401e95194e40266b83080
sourcePaths = src/shared/fleet.ts, src/shared/capability-router.ts,
              src/shared/node-capabilities.ts, src/shared/adaptive-routing.ts
```

下列实现语义等价；路径不同于任务候选 `city/00-foundation/02-node-fabric`（该路径**不存在**），但按 City R2，仅路径缺失不能证明能力缺失。

| 关注点 | Utopia 实现 | 类别 |
|---|---|---|
| node 注册/成员身份 | `services/dev-gateway/server.mjs` 的 `POST /api/v0/node/register` → `services/dev-gateway/store.mjs` 的 `nodes` 持久行：`id`、`devicePrincipalId`、`displayName`、`metadata.platform`、`agentVersion`、`capabilities`、`online`、`lastHeartbeatAt` | live service |
| node agent 侧 | `agents/reference-node/agent.mjs` 的 `register`/`heartbeat`/`claim`/`report` 循环，`agents/reference-node/runner.mjs` | live runtime |
| heartbeat/活性/离线 | `server.mjs` heartbeat endpoint + 1 s sweeper，`heartbeatTimeout` 默认 8000；置 `online:false` 并发出 `NODE_OFFLINE`；`claimNodeFor` → `acceptsWork` | live service |
| heartbeat 年龄推导（donor 规则） | `fleet-routing/fleet.mjs` 的 `fleetNodeStateFor`、`handleNodeDropout`，从 donor `src/shared/fleet.ts` 原样移植 | 迁移模块 MB-001 |
| 自检判定（donor 规则） | `fleet-routing/capability-routing.mjs` 的 `capabilityVerdicts`、`probeNodeStateFor`、`eligibleCandidates`，从 donor `src/shared/node-capabilities.ts` / `capability-router.ts` 原样移植 | 迁移模块 MB-001 |
| runtime endpoint 事实 | `services/dev-gateway/pairing.mjs` 的 `descriptor()`：`endpoint{scheme,host,port}`、apiVersion/schemaVersion；`services/dev-gateway/discovery.mjs` 的 mDNS `utopia-city` + BLE；`platform/windows/ble.mjs`；`store.cityId` | live service |
| 硬件/资源 telemetry | `agents/reference-node/telemetry.mjs`：`observedAt`、`cpu.usagePercent`、`memory.usedBytes/totalBytes`、`disk.used/free/total`、`uptimeSeconds`；`platform/windows/telemetry.mjs` | live runtime |
| telemetry 契约验证 | `contracts/pairing-v1/descriptor.mjs` 的 `validateTelemetry` | contract |
| host 压力/健康 | `city/02-engineering/03-host-health-station/host-health-station`（MB-005） | 迁移模块 |
| capability-host 广告/承载决定 | node 记录上的 `capabilities[]`；`REQUIRED_TASK_CAPABILITIES` + `claimNodeFor` + `acceptsWork`；`fleet-routing/capability-routing.mjs` 的 `eligibleCandidates` | live service + 迁移模块 |
| city capability registry/所有权 | `city/00-foundation/03-capability-fabric/capability-fabric/registry.mjs`、`services/capability-bridge/registry.mjs`：`moduleRefs`、owner、priority、重复 owner 拒绝、撤销 | 迁移模块 + service |
| 产品消费者 | `apps/web/app.js` 的 `nodeRows`/`nodeBadge`/`nodeState`/`fresh`/`metrics`：设备卡，ONLINE/OFFLINE/UNKNOWN，10 s 新鲜度窗口的 LIVE/CACHED telemetry；`GET /api/v0/city`、`GET /api/v0/nodes`、`/api/v0/events/stream` | live UI |

已检索确认的证据锚点：`city/00-foundation/**`、`services/dev-gateway/**`、`services/capability-bridge/**`、`platform/**`、`city/CITY_IMPLEMENTATION_MANIFEST.json`、`tests/gateway.test.mjs`、`tests/telemetry.test.mjs`、`tests/web-v02.test.mjs`、`scripts/device-telemetry-pilot.mjs`；另全库 grep `NodeIdentity`、`devicePrincipalId`、`NetworkReport`、`providerMatrix`、`networkRoutes`、`effectiveNetworkState`、`lastHeartbeatAt`、`NODE_OFFLINE`、`observedAt`。

值得保留的全库结果：除 donor extraction 外，Utopia 中 `NodeIdentity`、`NetworkReport`、`providerMatrix`、`networkRoutes`、`effectiveNetworkState` **均零次出现**，即 donor 的 TenX route/proxy registry 完全没有 Utopia 对应物。

## 3. 能力比较矩阵

| ID | Donor 能力与证据 | Utopia 等价/当前行为 | Coverage 与 Gap | Decision / Reason code | 证据 |
|---|---|---|---|---|---|
| NF-01 | node principal/注册/成员身份；`tenx/node.ts` `NodeIdentity`、`TenxNodeRegistry.register/ensureNodeId/deregister`、`FleetMemberRecord.joinedAt` | SQLite 持久 node 记录，稳定 `id`/`devicePrincipalId`，成员 `online`，重新注册 invalidation；MB-001 已移植 `FleetMemberRecord` | EQUIVALENT；donor 更丰富身份元组 `deviceType`/`os`/`arch`/`bossVersion` 无 Utopia 字段，但 Utopia 已记录/展示 `metadata.platform` + `agentVersion`，额外元组无消费者 | ABANDON / `DUPLICATE_EQUIVALENT` | `server.mjs:93-97`、`store.mjs:9`、`agent.mjs:10`、`fleet-routing/DONOR.json` |
| NF-02 | heartbeat/活性/离线；`heartbeat`、`rederiveState`（12 s/30 s）、`controllerNodeStateFor`（10 s/30 s）、`detectDropouts` | live heartbeat endpoint + 1 s sweeper → `online:false` + `NODE_OFFLINE`；`claimNodeFor`→`acceptsWork`；已迁移 `fleetNodeStateFor`/`handleNodeDropout`；Web ONLINE/OFFLINE/UNKNOWN + 10 s freshness | EQUIVALENT；无实质 gap。Gateway runtime 二值 online/offline，donor 三态 DEGRADED 区间已作为纯 `fleetNodeStateFor` 存在；将它接入会改变 runtime 行为，并非迁移缺失 donor 行为 | ABANDON / `DUPLICATE_EQUIVALENT` | `server.mjs:31,99,129`、`fleet.mjs:46-51,114`、`app.js:16-18` |
| NF-03 | runtime endpoint/node endpoint；`NodeNetworkReport`、`TenxNetworkRegistry`、`ProviderMatrixRow`、`host-adapter.ts` | Utopia 已拥有 endpoint 语义：pairing `descriptor.endpoint{scheme,host,port}` + apiVersion/schemaVersion、mDNS `utopia-city` + BLE discovery、`cityId`，供 Web/Android 配对消费 | EQUIVALENT；donor 剩余部分是每个 node 的 **proxy/AI-provider route + reachability matrix**（`direct/system-proxy/user-proxy/regional-proxy/provider-proxy`）。Utopia 为单 city gateway + 向外轮询 agent 架构，没有此概念 | ABANDON / `OBSOLETE_DONOR` | `pairing.mjs:8`、`discovery.mjs:11-18`、`ble.mjs`、repo grep 0 hits |
| NF-04 | 硬件/资源 telemetry node 事实；`node-profiler.ts` 309 行、`node-profile.ts` 246 行、`node-telemetry-log.ts`、`NodeProbeData` | live sampler：CPU delta %、memory、disk、uptime，contract 验证，在注册/heartbeat 发送并存储，Web live/cached 展示；完整 MB-005 host-health station；MB-001 `capabilityVerdicts` 移植 | SUPERIOR；donor 自己从未观察 `gpu`（`node-inspector.ts` 为 `gpu: []`），故没有可迁移 GPU 行为 | ABANDON / `UTOPIA_SUPERIOR` | `telemetry.mjs`、`descriptor.mjs:25-34`、`app.js:19`、`host-health-station/**` |
| NF-05 | capability-host 广告/承载事实；`NodeCapabilityFlags`、`NodeCapabilityAdvertisement`、`capabilityInventory`、`NodeCapabilityRegistry` | node 持久广告 `capabilities[]`；placement gate `REQUIRED_TASK_CAPABILITIES` + `acceptsWork`；`eligibleCandidates`；city fabric 的所有权/优先级/重复拒绝/撤销；bridge descriptor | EQUIVALENT；剩余价值是 `NodeCapabilityRegistry` 的持久形状，但 Utopia 已由另一 donor 的更强 fabric registry + bridge 覆盖，迁移会重复 registry 状态 | ABANDON / `DUPLICATE_EQUIVALENT`、`NO_REAL_CONSUMER`、`NO_INDEPENDENT_VALUE` | `server.mjs:28-31,102`、`capability-fabric/registry.mjs`、`capability-bridge/registry.mjs` |

## 4. Donor 生命周期发现（决定性的负结果）

Donor node fabric 未迁移余部在冻结基线中**生产不可达**。在冻结提交上用只读 `git grep` 验证：

```text
git grep TenxNodeRegistry  @8df428e -> definition + a TYPE-ONLY field in
                                       electron/tenx/observability.ts + tests
git grep TenxNetworkRegistry @8df428e -> same shape
git grep TenxObservability @8df428e -> consumed only by tests/unit/tenx-phase-10r.test.ts
git grep "tenx/" @8df428e -- electron/main.ts electron/bootstrap/ electron/host/ -> NO MATCHES
config/capabilities/node.yaml @8df428e -> node capability declares
                                          modules: []  bootModules: []  surface: []
docs/city/OWNER_CONTINUOUS_CONSTRUCTION_LEDGER.md CC-076 -> records the retirement of
                                          production-dead host-status/tenx modules
```

`TenxNodeRegistry`、`TenxNetworkRegistry` 仅有定义、observability 的 TYPE-ONLY 字段与测试；`TenxObservability` 仅被 `tests/unit/tenx-phase-10r.test.ts` 使用。生产 main/bootstrap/host 无 `tenx/` 命中；node capability 声明空 modules、bootModules、surface。CC-076 记录已退役的生产不可达 host-status/tenx 模块。

Donor **实际 live** 的路径恰是已迁移的那些：

```text
electron/node/node-capability-registry.ts  constructed in electron/main.ts:750
electron/node/node-inspector.ts#inspectDevice  used by bootstrap/host-status-ipc.ts, host/doctor.ts
src/shared/node-capabilities.ts#capabilityVerdicts/nodeStateFor  <- the logic, already in Utopia
```

`node-capability-registry` 在 `electron/main.ts:750` 构造；`inspectDevice` 被 bootstrap/host-status-ipc 与 host/doctor 使用；逻辑 `capabilityVerdicts/nodeStateFor` 已在 Utopia。因此 donor live node 行为由 MB-001 消费；未迁移余部是前瞻/仅测试代码，自己的生产仓库从未构造它。

## 5. 判定：NO_VALUE

> **判断无价值，任务保留，未迁移**

此处不复制 donor 是正确工程选择，理由逐项如下：

1. **Live 半部已迁移。** MB-001 从**同一冻结提交**移植 `fleet.ts`、`capability-router.ts`、`node-capabilities.ts`、`adaptive-routing.ts` 到 `city/00-foundation/01-city-core/fleet-routing`，记录 parity vector list 并保留 donor 缺陷。再放到新 `02-node-fabric` 会令同一语义有第二 owner，正是依赖/所有权规则要防止的重复。
2. **产品已拥有并运行余下功能。** 注册、heartbeat、活性/离线、telemetry、广告均由 `services/dev-gateway` + `agents/reference-node` + `apps/web` 端到端实现/消费；由真实有界运行确认，而非只读代码（§6）。
3. **未迁移余部生产不可达。** Donor 自己在测试外从不构造 `TenxNodeRegistry`/`TenxNetworkRegistry`；node capability manifest 无 modules、boot modules、surface。复制会把失活前瞻设计导入 `MIGRATION_ONLY` City。
4. **NF-03 剩余关注点不属本架构。** 多路 proxy/provider reachability 事实服务于需在区域限制下选择可用 AI provider 路由的 desktop app。Utopia 单 city gateway 无此决定，造出它及消费者就是明确禁止的 `NEW_FEATURE_DEVELOPMENT`。
5. **无独立生命周期/失败域价值。** 余部要么是 Utopia 已有逻辑的持久 registry wrapper，要么是无消费者的纯函数/route matrix；拆分只会增加没有独立失败边界的模块。

## 6. 论文/研究素材（仅测得事实）

```text
planned capability count                : 5
equivalent already present              : 4   (NF-01, NF-02, NF-03, NF-05)
Utopia superior                         : 1   (NF-04)
concrete gaps                           : 0
selected full / partial migration       : 0 / 0
abandoned                               : 5
rejection reason-code distribution      : DUPLICATE_EQUIVALENT 3, UTOPIA_SUPERIOR 1,
                                          OBSOLETE_DONOR 1, NO_REAL_CONSUMER 1,
                                          NO_INDEPENDENT_VALUE 1
                                          (multi-code on NF-05)
source/target anchors inspected         : 16 donor files (line counts 30..309) + 1 donor
                                          capability manifest + 1 donor fixture subset
                                          (68 files extracted read-only via git archive);
                                          18 donor tests/unit/tenx-phase-*.test.ts exist;
                                          Utopia: 13 module/service/UI anchors across
                                          city/00-foundation, services/dev-gateway,
                                          services/capability-bridge, agents,
                                          platform, apps/web, contracts
parity/runtime checks PASS/FAIL         : bounded runtime chain 8/8 PASS
                                          city fleet-routing suite 28/28 PASS, 0 FAIL
                                          root gateway+telemetry+web suites 11/11 PASS, 0 FAIL
                                          TOTAL: 47 PASS, 0 FAIL
assessment start (host clock)           : 2026-09-30T15:40:09Z (claim)
assessment end (host clock)             : see git commit time of assessment HEAD
implementation churn / tests / CI       : 0 product/runtime files changed; 0 new tests;
                                          no CI run required (no implementation)
```

统计解释：计划 5，等价已存在 4（NF-01/02/03/05），Utopia 更优 1（NF-04），具体 gap 0，完整/部分迁移 0/0，放弃 5。Reason code 多标签分布：等价重复 3、更优 1、过时 donor 1、无消费者 1、无独立价值 1（NF-05 多码）。检阅 16 donor 文件（30–309 行）、1 capability manifest、1 fixture subset；经只读 git archive 提取 68 文件；18 donor `tests/unit/tenx-phase-*.test.ts` 存在；Utopia 跨 foundation/services/agents/platform/Web/contracts 的 13 锚点。运行链 8/8、fleet-routing 28/28、root gateway+telemetry+Web 11/11，总 47 PASS / 0 FAIL。评估开始为主机时钟 `2026-09-30T15:40:09Z`（领取），结束见 assessment HEAD 提交时间。0 产品/runtime 文件变化，0 新测试，无实现故无需 CI。

### 真实有界运行链（8/8 PASS）

在临时 loopback port 的 live `createGateway()` 与 live `startAgent()` reference node 上运行，无 mocks、无 stubbed facts。

| 步骤 | 结果 | 观察 |
|---|---|---|
| NF-03 runtime endpoint 元数据 | PASS | `{scheme:http, host:127.0.0.1, port:58093}` |
| NF-01 注册/成员身份 | PASS | `{id, devicePrincipalId, displayName "MB-010 probe node", agentVersion "0.2.0", metadata.platform "win32"}` |
| NF-05 capability-host 广告 | PASS | `["task.execute.safe","filesystem.temp"]` |
| NF-04 实测 telemetry | PASS | `{cpu.usagePercent 9.0732, memory 17044938752/34066345984, disk used/free/total, uptimeSeconds 664451.125}` |
| NF-04 首样本诚实 null | PASS | 样本 #1 为 `{cpu:{usagePercent:null}}`，sampler 拒绝伪造 delta |
| NF-02 活性在线 | PASS | `{online:true, lastHeartbeatAt}` |
| NF-02 heartbeat 停止后离线 | PASS | 停止 agent，`heartbeatTimeout` 2500 ms 后 `{online:false}` |
| NF-02 dropout 记录 | PASS | 真实 `NODE_OFFLINE` event，`seq 3` |

### 已记录的问题与判断

*问题*：第一次有界运行因 `cpu.usagePercent` 为 `null` 报 NF-04 FAIL。*判断*：是**我的 probe** 缺陷，不是 Utopia 缺陷。`createTelemetrySampler` 以计数器 delta 算 CPU，第二样本前诚实返回 `null`；自身测试要求 counter reset 不伪造 load。*行动*：修正 probe，(a) 等过 3000 ms sampler interval 再断言实测 CPU；(b) 将首样本诚实 `null` 单独断言为正属性。重跑 8/8 PASS。*记录原因*：首样本 `null` 是未来消费者必须预期的真实属性，误报 Utopia 失败会导致评估假阴性。

### 为研究保留的负结果观察

- Mission 的“计划能力集”可能命名 donor 自己从未接入生产的子系统；靠目录名/代码存在会误判 `FULL_MIGRATION`。读其 construction site（`main.ts`/`bootstrap`）和 capability manifest 后，判定反转。
- 同一 Utopia 的不同 donor 在不同层完成同类工作：DS-Hns 的 fabric + bridge 拥有 *city* capability 所有权，Boss 的 fleet-routing 拥有 *node* eligibility；所以 NF-05 已优于 donor 单一 `NodeCapabilityRegistry`。
- NF-04 的 `UTOPIA_SUPERIOR` 依据测量而非措辞；donor 自己的 `node-inspector.ts` 总报告 `gpu: []`，“更丰富 donor 硬件事实”的假设经阅读不成立。

## 7. Utopia 素材指针

- 本地原始：`.runtime/evidence/mission-book/MB-010/2026-09-30-mb010-assessment-01/assessment/`（git-ignored：donor subset zip 与提取、probe 脚本、receipt、suite log）。
- Evolution inbox：`data-records/evolution/inbox/mission-book/MB-010/events.jsonl`（5 events：`MISSION_CLAIMED`、`ATTEMPT_STARTED`、2 × `TEST_PASS`；保留原文计数）。
- 已发布有界证据：`evidence/raw/mission-book/MB-010/assessment/`（`README.md`、`capability-matrix.json`、`bounded-node-truth.json`、`environment.json`）。
- 评估分支不可变 HEAD：`mission/MB-010-node-fabric` @ `8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526`。

> NO_VALUE 不生成假的 verified episode；保留 assessment branch、本报告及 evidence pointers。分支保留为 research/provenance branch：**不合并、不删除**（本段历史规则，后文记录 Owner 特例）。

## 8. 收口

```text
assessment_status          = COMPLETE_NO_VALUE
assessment_complete        = true
assessment_result          = NO_VALUE
migration_status           = SKIPPED_COMPLETE
migration_complete         = true
migration_completion_basis = SKIPPED_NOT_REQUIRED
verification_status        = NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete      = true
merged_main_sha            = null
```

**判断无价值，任务保留，未迁移**，按 README §2、City R1/R4 是绿色完成，不是失败状态。Scheduler 须视 MB-010 为完成并跳过，除非 Owner 明确 reset/reopen。

## 9. 独立重新验证（2026-09-30，主机 `Alien`）

Owner 指令：**不复用任何既有测试**重新验证此任务，允许真实 Android 操作。以下记录方法、新证据、SHA 跟踪；`NO_VALUE` **得到独立确认**。

### 9.1 Donor 生命周期重新推导（自写 probe，冻结 donor `8df428ea`）

| 问题 | 结果 |
|---|---|
| 任何地方 `new TenxNodeRegistry(` / `new TenxNetworkRegistry(` | **零构造点** |
| `electron/main.ts`、`electron/bootstrap/`、`electron/host/` 内 `tenx/` | **无命中** |
| import tenx 家族的文件 | **无** |
| 报告列出的 live 路径 | `node-capability-registry` 在 `electron/main.ts` 构造；`inspectDevice` 被 `bootstrap/host-status-ipc.ts` 和 `host/doctor.ts` 使用 |

未迁移余部无法从 donor 自己的 composition root 到达；可到达 node 逻辑恰是 MB-001 已移植部分，确认。

### 9.2 真实 Android 设备验证

真实 `PERM00`（Android 12，`172.31.3.18`）通过 app 自己的 `utopia://pair` descriptor，经 LAN 与 live City gateway（`172.31.3.110:4310`）配对，随后实际操作。无 mock，未使用仓库 pilot/test。

| 判定 | 新证据 |
|---|---|
| NF-01 注册/身份 | 设备 node list 展示 `Alien-PC`、platform `win32`、Agent `0.2.0`、`task.execute.safe` + `filesystem.temp` |
| NF-02 heartbeat/活性 | live node 展示 `ONLINE`；stale node 展示 `OFFLINE · Cached` 与 `Last seen` |
| NF-04 telemetry | 设备展示 `CPU: 25.9%`、`Memory: 18.4 GB / 31.8 GB` |
| NF-04 数值一致性 | gateway `telemetry.memory.usedBytes = 19740823552` → 18.4 GB，**精确**等于设备；stale node `17790050304` → 16.6 GB |
| NF-05 广告 | Services 展示 `Document Intake` 为 `AVAILABLE · ACTIVE` 及 operation surface |
| 设备消费持久历史 | 手机展示四次 `presentation.theme.lab` `COMPLETED` invocation；ID 来自早先真实调用，是跨会话历史而非 fixture |

截图：`.runtime/evidence/mission-book/MB-010-011-012/device-devices-view.png`、`device-services-view.png`。

**判定：确认 `NO_VALUE`。** 无 live、未覆盖的 donor node-fabric 行为可迁移：产品已端到端拥有/消费 node 事实，余部在 donor 自身生产不可达。

### 9.3 分支/SHA 跟踪

```text
utopia main at verification : 756c7d760c605e33ba386e87605e078fe24b82ca
assessment branch           : mission/MB-010-node-fabric @ 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526
ahead / behind main         : 1 / 0
that one commit contains    : data-records/evolution/inbox/mission-book/MB-010/events.jsonl
                              evidence/raw/mission-book/MB-010/assessment/** (README, capability-matrix,
                              environment, bounded-*)
                              NO IMPLEMENTATION CODE
merge (at verification time) : NOT PERFORMED, by rule. README line 223 (echoed by response-9-30 R1)
                              keeps a NO_VALUE assessment branch as provenance and explicitly forbids
                              merging it, and forbids fabricating a verified implementation episode.
merge (Owner ruling R11)    : PERFORMED afterwards as a PROVENANCE merge, by explicit Owner direction:
                              response-9-30.md#R11 overrides README line 223 for these three branches only.
                              git merge --no-ff mission/MB-010-node-fabric
                                -> 6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a  (parents 756c7d7, 8380c38), conflict-free,
                                   5 files added (events.jsonl + 4 assessment evidence files),
                                   branch retained on the remote, no implementation code involved.
merged_main_sha             : null - UNCHANGED. The field means "the SHA where this Mission's
                              implementation landed in main"; nothing was implemented, so it stays null
                              even though the provenance branch is now archived in main.
utopia main afterwards      : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e (the three provenance merges plus Alien's forced
                              NO_VALUE record on top of 756c7d76)
```

验证时 Utopia main、评估分支、ahead/behind 1/0、仅有 provenance 文件且无实现均按原证据保留。验证时未合并，README line 223 与 response-9-30 R1 禁止合并 NO_VALUE provenance 或伪造 verified implementation episode。之后 Owner R11 **仅针对这三个分支**覆盖该规则，指示 provenance merge：`git merge --no-ff mission/MB-010-node-fabric` → `6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a`（parents `756c7d7`、`8380c38`），无冲突，新增 5 文件（events.jsonl + 4 assessment evidence files），远端分支保留，无实现代码。之后 main `d0dea7bcb66cf57edee73c67ddfb9526337dfb4e` 包含三次 provenance merge 及 Alien 强制 NO_VALUE 记录，基于 `756c7d76`。

本任务不存在可合并实现的 migration branch，所以 `merged_main_sha` 保持 `null`。字段表示“本任务实现落入 main 的 SHA”；R11 归档到 main 的仅是 assessment provenance——本节报告的 probe、tamper case、dry-run，从未迁移 capability。原文再次强调：`merged_main_sha` 保持 `null`；归档的是测试、dry-run、probe 的 provenance，不是迁移能力。

### 9.4 证据指针

- `.runtime/evidence/mission-book/MB-010-011-012/donor-lifecycle-probe.json`（三项 donor reachability）。
- `.runtime/evidence/mission-book/MB-010-011-012/precise-claims-probe.json`。
- `.runtime/evidence/mission-book/MB-010-011-012/utopia-admission-enforcement.json`。
- `.runtime/evidence/mission-book/MB-010-011-012/real-device-node.json` 与两张设备截图。

语言配对 / Language pair: [原文 / Source](../ASSESSMENT_REPORT.md)
