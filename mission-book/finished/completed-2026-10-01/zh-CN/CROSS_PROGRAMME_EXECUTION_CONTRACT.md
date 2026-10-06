> 中文阅读译本 / Chinese reading translation。原始[说明文档](../CROSS_PROGRAMME_EXECUTION_CONTRACT.md)仍是状态和历史规则的权威来源；本译本不授予领取、执行或迁移权限。

# 跨项目异步执行契约 / Cross-Programme Execution Contract

本文件对 Butler Assistant（BA）、Remote Fabric（RF）、General AI Gateway（GAI）与 Engineering Manager（EM）具有**规范性效力**。如果任务局部说明与本契约冲突，以本契约为准，除非 Owner 明确记录了更新的裁决。

## 1. 重置状态
- Alien = AVAILABLE。
- Mech = AVAILABLE。
- 本契约采用时，BA/RF/GAI/EM 尚未正式开始。
- 因此，每个组件分支均使用同一个冻结的 Utopia 基线：`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`。
- **不存在第二真实主机等待条件。**
- 四个 Development 池全部立即开放。

## 2. 单一全局组件任务池
41 个组件任务组成同一个调度池：

`BA-001..009 + RF-001..010 + GAI-001..009 + EM-001..013`。

主机不得仅因上一个 programme 当前没有立即可执行阶段就等待。

资格：
- Development 在未被领取且尚未完成时可领取。
- Correction 只能在 Development 已通过检查并完成后领取，且只能由另一实体主机领取。
- 主机不得修正自己完成的 Development。
- 对于主机已经持有的阶段，CI 失败或回归转为 ACTIONABLE_OWNED_REPAIR。

领取优先级：
1. ACTIONABLE_OWNED_REPAIR；
2. ELIGIBLE_CORRECTION_BY_OTHER_HOST；
3. UNCLAIMED_DEVELOPMENT_ANY_PROGRAMME。

当选项等价时，优先选择与主机上一项领取不同的 programme，以尽早暴露接缝；但不得为了公平而闲置。

## 3. 原子领取协议
动态真相只存在于目标任务工作书的 frontmatter 及其报告中。README 与 MISSION_INDEX 是仪表盘，不是锁。

领取提交只能更新目标阶段的字段（按需更新状态、主机、时间、分支）。推送或更新必须为 fast-forward。如果另一主机赢得竞争、推送被拒绝：
1. 获取当前 Digital-City main；
2. 重新评估全局池；
3. 领取下一个符合资格的阶段。

不得强制推送领取记录，也不得等待另一主机释放无关任务。

## 4. 防空闲执行
在等待 CI、长时间测试、provider 检查、外部登录或其它不需要持续占用 CPU 的条件时，领取项可以继续保持持有。此类等待**不保留实体主机**。

主机必须：
- 保留正在等待的领取项；
- 使用独立 worktree/branch 做其它工作；
- 立即领取另一个符合资格的全局阶段；
- 等待项变为可行动时返回处理。

只有重新扫描全局池确认以下条件全部成立，主机才停止领取组件工作：
- 没有可行动的已持有修复；
- 没有符合资格的 Correction；
- 没有未领取的 Development。

此状态为 `GLOBAL_COMPONENT_POOL_DRAINED`。

## 4.1 资格感知静默与有界重扫
一次没有可领取工作的扫描，只回答**“这台主机现在能领取什么？”**。如果尚有未完成阶段或资格可能随时间变化，它**不能**证明全局池已达到终态。

每个 dispatcher，以及未来使用异步任务池的 City 工程书，都必须在停止前对零领取结果分类：

1. `TEMPORARILY_UNCLAIMABLE`
   - 存在未完成工作；
   - 当前主机并非因结构性限制而被禁止参与所有未来工作；
   - 另一主机完成工作、CI/provider 完成、领取竞争、阶段转换或集成 gate 可能使工作稍后具备资格；
   - 动作：停放而不忙轮询，默认约 **20 分钟**后重新进入全局扫描。如果已有实测证据支持其它节奏，工作书可以调整间隔。

2. `STRUCTURALLY_INELIGIBLE`
   - 所有未完成工作都因稳定机制而禁止此主机参与，例如 Development/Correction 主机分离、权限、必需设备或硬件能力、身份、安全策略或明确 Owner 限制；
   - 动作：记录精确原因并释放主机。在约束 gate 变化前无需周期重扫。

3. `GLOBAL_EXTERNAL_BLOCK`
   - 所有原本相关的阶段都依赖内部工作无法诚实满足的 typed 外部条件，例如账户计费、必需硬件不可用或 Owner/provider 动作；
   - 动作：保留精确阻塞并释放主机。不得为了避免闲置而制造代码或积累无法核验的 head。

4. `POOL_TERMINAL`
   - 所有阶段都已按工作书的完成语义达到终态；
   - 只有这一类别可以解释为正常的全局池排空或完成。

未来工作书必须提供的零领取遥测：

```text
pool_incomplete
claimable_now
potentially_claimable_later
structural_ineligibility_reason
global_external_blocker
rescan_after
terminal_reason
```

对 `TEMPORARILY_UNCLAIMABLE`，默认有界重入节奏为 20 分钟。在任务池仍未完成且未来获得资格仍有可能时，主机可以反复重扫。这是低频活性机制，不是忙等循环。

促成本规则的失败事件之论文与 dogfood 证据保存在研究院论文材料库及 Utopia 论文证据中，标识为 `ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01`。

## 4.2 外部状态回填与证据指针校验
外部系统可以在没有 Digital-City 提交的情况下改变状态：被阻塞的 CI run 可重跑、provider 可恢复、批准可到达，或先前不可用的设备可恢复。因此，**任务 frontmatter 是 canonical 调度状态，但它所引用的外部证据变化后，不得继续保持陈旧状态**。

以下时点必须执行 reconciliation：
- typed 全局外部阻塞被报告已恢复后立即执行；
- 在恢复后解释零领取扫描之前；
- 声明 programme 组件池已排空之前；
- 创建 programme merge/integration 工作书之前；
- 作出任何最终或终态项目声明之前。

对每个完成依赖外部 run 或证据引用的阶段，reconciliation 必须核验实时权威来源，并同时绑定以下三项：

```text
recorded task branch == evidence head_branch
recorded task head   == evidence head_sha
required terminal state == evidence conclusion/status
```

规则：
1. 精确记录 head 上的成功实时 run，可以关闭陈旧外部阻塞字段，无需改变实现历史。
2. 属于其它分支或任务的 run，即使通过，也是 `EVIDENCE_POINTER_MISMATCH`，不能满足该阶段。
3. 历史阻塞或失败 run 保留在报告和证据中；当前 frontmatter 反映当前调度真相。
4. 仪表盘只在任务级 reconciliation 完成后重新计算，永远不能当作领取锁。
5. Reconciliation 仅修复元数据和控制面。不得仅为了让控制面显得当前而制造产品代码变更。
6. 无法查询外部来源时，保留最后已核验状态并报告 `RECONCILIATION_SOURCE_UNAVAILABLE`；不得猜测。

必需的 reconciliation 遥测：

```text
reconciliation_started_at
external_recovery_source
stale_task_count
stale_blocker_count
evidence_pointer_mismatch_count
repaired_task_ids
recovery_to_reconciliation_lag
authoritative_source_refs
reconciliation_completed_at
```

促成本规则的事件之论文与 dogfood 证据，以 `CONTROL_PLANE_STATE_RECONCILIATION_LAG_2026-10-01` 保存在 Digital-City 研究院及 Utopia 证据存储中。

## 5. 外部依赖
组件任务不得因未完成的 sibling programme 而阻塞。

对于缺少的 sibling 实现，使用稳定端口或契约，以及 deterministic test double。真实外部证明（远端多设备路径、provider 登录、可选第三方软件、硬件绑定动作）在条件可用时机会性执行；不可用时诚实记录，并延后至 programme 集成。

延后不等于成功。报告必须指出精确的待完成接缝。

## 6. Canonical 功能归属
| 关注点 | Canonical owner |
|---|---|
| task/action/attention 身份及 canonical 生命周期 | Shared Task/Action Core |
| 实体和逻辑设备身份、信任、presence、可达性、transport | Remote Fabric |
| transport 层带版本的设备 capability 寻址 | Remote Fabric |
| assistant 身份、记忆和上下文投影、embodiment 语义、handoff | Butler Assistant |
| general-AI provider/model/account/channel/conversation 语义 | General AI Gateway |
| engineering job/connector/worker/result/artifact 语义 | Engineering Manager |
| 安全 credential/profile/session handle 存储 primitive | neutral 00-Foundation SecureHandleStorePort |
| policy decision contract | Shared Core policy contract；BA 提供 AssistantPolicy；RF 在目标端重新验证并执行 |

规则：
- BA DeviceEmbodiment 引用 canonical RF `device_id`，不创建竞争性的实体设备身份。
- EM ConnectorInstance 和 GAI remote endpoint 在跨设备时引用 RF 设备身份和 presence。
- RF capability registry 描述可由 transport 寻址的节点能力；EM connector 能力及 GAI provider/model 能力仍留在领域 registry。
- BA/GAI/EM 领域事件可由 RF RPC/EVENT/STREAM 承载，但 RF envelope 不成为 canonical 领域事件模型。
- GAI 和 EM 可公开领域专用 RemoteExecutionPort facade，但它们必须适配 RF public API，而非建立独立 transport。
- GAI 和 EM 只共享中立的 secure-handle primitive，不共享彼此的 provider/connector registry。
- Canonical Attention 状态及 fan-out 真相仍归 shared Core；领域模块创建 typed attention；RF 提供 presence/delivery；通知策略可以过滤投影。

## 7. 收尾合并工作书同样是异步阶段
某 programme 的组件池排空后，可立即创建它的 merge 工作书，无需等待其它三个池全部排空。

每个 merge 工作书：
1. 从当时的 Utopia main 开始；
2. 将该 programme 已修正分支集成为显式 union/superset；
3. 保留其它 programme 已合并的工作；
4. 在等待外部接缝前运行全部独立测试和 CI；
5. 若真实外部接缝不可用，记录 `INTEGRATED_WAITING_EXTERNAL_SEAM` 并释放主机返回全局池；
6. 最终合并前立即再次从当时的 Utopia main 刷新；
7. 刷新后重跑必需验收和 CI。

BA 与 RF 对 GAI/EM 没有硬终态依赖。GAI/EM 的最终真实跨设备 E2E 可能要求已验收 RF，但仅最终 E2E gate 等待；组件工作与独立集成不等待。

## 8. 终态条件
实体主机必须持续领取可执行工作，直到全局组件池排空。此后，继续领取符合资格的 programme 集成或修复阶段。

正常终态目标：

`ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN`。

如果每个剩余阶段都需要真正无法代理完成的外部 Owner/硬件/provider 动作，报告：

`GLOBAL_POOL_DRAINED_WITH_TYPED_EXTERNAL_OWNER_ACTION`

并给出精确阻塞。不得把此状态转成成功，也不得仅为避免报告它而制造额外内部工作。
