# PCF — Personal Compute Fabric / 个人异构计算织网（增强版）

> **PARKED / NOT ACTIVATED / DESIGN ONLY — 本次只登记规划，不授权施工。**
> 所有工作书 `execution_enabled: false`；实现基准、依赖 SHA、领取者和验收证据故意留空。PCF 不加入当前 `PROGRESS_MANIFEST.json`，不改变在途任务、主任务分母或 Utopia 运行行为。

[English](en/README.md) · [架构](ARCHITECTURE.md) · [施工与证据合同](EXECUTION_CONTRACT.md) · [激活与扩容](ACTIVATION_AND_EXTENSION.md) · [实验与收口](RESEARCH_AND_RELEASE.md) · [机器可读计划](PROGRAMME_MANIFEST.json)

## 定位与范围

PCF 是 WBC 的增量后继：把兼容后端、节点描述和可逆 profile，推进为**带授权约束、可解释放置、真实执行、资源保护及可恢复状态的个人多设备运行时**。眼镜、娱乐室、健康和工程助理都是应用，不成为核心的领域前提。

增强不等于一次全开。规划包含 **29 份独立工作书：23 份 CORE_V1、6 份 OPTIONAL_EXTENSION**。这个数字是设计清单，不是已启用施工统计。核心版本使用现有 Windows workers + Android control surface 验证；不等 Linux、眼镜、NPU 或双服务器到位。

**保留原 PCF-701～707 的主题；新增 700、708～724 补齐运行时和研究边界。**

## 已核对的设计输入，不是未来执行锚点

2026-10-06 读取的 City 文档快照：`28120397450574c9274b2d75a18f4f07288baea0`；Utopia main 快照：`213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`。这两个 SHA 仅用于追溯本规划的输入，**不得抄入未来 development baseline**。

输入包括 WBC、现有 `services/dev-gateway/`、节点描述合同、headless agent seam、当前施工规则和依赖同步器。接口存在、函数可单测、真实链路已接线、跨机已验收是四个不同状态；PCF-700 必须重新逐项核实，不能把 seam 当成成熟服务。

## 工作书清单

| ID | 任务 | 批次 |
|---|---|---|
| [700](PCF-700-ownership-and-reality-audit.md) | 所有权、真实调用链和兼容基线审计 | CORE_V1 |
| [701](PCF-701-live-resource-telemetry.md) | 实时资源观测、freshness、采集预算 | CORE_V1 |
| [702](PCF-702-explainable-placement.md) | 纯函数放置、成本估计和决策回执 | CORE_V1 |
| [703](PCF-703-pipeline-offload-and-streams.md) | 阶段卸载、有限流与端到端背压 | CORE_V1 |
| [704](PCF-704-admission-reservations-and-fairness.md) | 原子准入、资源预留、公平队列 | CORE_V1 |
| [705](PCF-705-recovery-and-safe-replacement.md) | 安全重放置、失败恢复、未知副作用 | CORE_V1 |
| [706](PCF-706-policy-consent-and-data-boundaries.md) | 权限、隐私、预算、local-first 策略 | CORE_V1 |
| [707](PCF-707-research-trace-and-replay-adapter.md) | REX 观测、回放、消融适配 | CORE_V1 |
| [708](PCF-708-workload-envelope-and-qos.md) | 统一工作负载合同与 QoS | CORE_V1 |
| [709](PCF-709-artifact-locality-and-cache.md) | 数据位置、工件传输和有界缓存 | CORE_V1 |
| [710](PCF-710-headless-execution-and-isolation.md) | 真实 headless executor、隔离与取消 | CORE_V1 |
| [711](PCF-711-checkpoint-and-resume-contract.md) | 显式检查点及恢复兼容合同 | CORE_V1 |
| [712](PCF-712-durable-supervision-and-fencing.md) | 常驻执行监督、持久化协调和 fencing | CORE_V1 |
| [713](PCF-713-interference-and-slo-protection.md) | 多应用干扰、SLO、协作式降级 | CORE_V1 |
| [714](PCF-714-origin-surface-continuity.md) | 发起端状态、结果和控制连续性 | CORE_V1 |
| [715](PCF-715-resource-control-and-monitor.md) | 资源控制、Monitor 投影和分层 UI | CORE_V1 |
| [716](PCF-716-unattended-deployment-and-rollback.md) | 无人值守部署、drain、升级回退 | CORE_V1 |
| [717](PCF-717-model-residency-and-serving.md) | 模型冷暖启动、驻留和推理资源 | OPTIONAL_EXTENSION |
| [718](PCF-718-linux-worker-onboarding.md) | Linux worker 接入与混合平台验收 | OPTIONAL_EXTENSION |
| [719](PCF-719-android-edge-companion.md) | 显式授权的 Android edge companion | OPTIONAL_EXTENSION |
| [720](PCF-720-accelerator-power-and-thermal.md) | GPU/NPU、功耗、热状态适配 | OPTIONAL_EXTENSION |
| [721](PCF-721-controlled-systems-study.md) | 对照实验、故障矩阵和独立复现 | CORE_V1 |
| [722](PCF-722-controller-continuity-and-ha.md) | 控制端连续性与有 fencing 的 HA | OPTIONAL_EXTENSION |
| [723](PCF-723-adaptive-placement-research.md) | 经对照证据约束的自适应放置 | OPTIONAL_EXTENSION |
| [724](PCF-724-multi-application-workload-pilots.md) | 多应用工作负载适配与并发试点 | CORE_V1 |

PCF-790 / PCF-990 **只预留为未来验收编号**，目前不创建可执行 final-merge 工作书。验收设计见 RESEARCH_AND_RELEASE。

## 推荐波次，不是必须串行

A：700 → 701 / 706 / 708。

B：702 / 704 / 709；随后 710 / 707。

C：703 / 711 / 712 / 713；随后 705。

D：714 / 715 / 716 / 724 → 721 → 满足条件后生成 PCF-790。

E：717 / 718 / 719 / 720 / 722 / 723 按预算、设备、证据分别激活；不阻塞 CORE_V1。编号不是执行顺序，依赖以工作书为准。

## 与既有系列的边界

- **WBC**：复用，不重做、不宣称真实工作台已经验收；默认 STANDARD_DEVICES 永久可用。
- **MON**：真实 UI/投影集成验收要求 MON-990 accepted exact head；不把 Monitor 设为任务执行同步锁。
- **REX**：复用实验注册、追踪、runner、故障注入、回放、导出；只扩展适配器，不造第二个研究平台。
- **FR-001**：PCF 提供执行/资源接口，Foreman 保留工程规划与 Review→Repair；不要求 Foreman 等全部可选扩展。
- **URA / DGX / RIV / CHK**：保持原停放状态。PCF 不借机重分类全城、拆仓、取消异机复核或实现治理议会。

## 不可让步

无工作台也必须可用；不增第二套 Task/Action/Attention/device/trust truth；`UNKNOWN` 不填 0；strict target 不静默改派；新增 API 费用、跨设备执行和数据外发遵循既有授权；既有 Android 只作为控制端；跨机执行的回执回到原交互端；两节点不能凭互相心跳就宣称无分裂脑的 HA。

允许增加子任务和提高复杂度，但必须遵循显式版本、所有权、预算、依赖与冻结范围规则。**复杂度可以增长，验收范围不能无限漂移。**

## Scope revision 2 / 2026-10-07 强化范围

**29 planned workbooks = 23 CORE_V1 + 6 OPTIONAL_EXTENSION; 0 activated.** 新增四书是已授权的规划增强，不是开启施工。 / Four additions are approved design work, not runtime activation.

| ID | Work | Scope |
|---|---|---|
| [PCF-725](PCF-725-execution-provider-contract-and-boundaries.md) | 执行 Provider 合同与生命周期边界 | CORE_V1 / PARKED |
| [PCF-726](PCF-726-execution-capsule-and-result-evidence.md) | 执行胶囊与结果证据封装 | CORE_V1 / PARKED |
| [PCF-727](PCF-727-engineering-connector-live-execution.md) | 工程连接器真实执行与验收 | CORE_V1 / PARKED |
| [PCF-728](PCF-728-originating-agent-remote-job-bridge.md) | 发起 Agent 远端子任务与结果回注桥 | CORE_V1 / PARKED |

### 迁入面板 / Incoming requirement history

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-01 | URA-002 — 执行 provider 的版本、能力、权限、平台、命令、存储命名空间与兼容合同 | PCF-725 | 全城 App taxonomy、App lifecycle 及非执行业务合同 |
| PCF-MIG-20261007-02 | URA-003 — 执行器的启动/退出、依赖失效、隔离、停用和回退边界 | PCF-725 | 全城依赖方向、非执行 App/service 解耦与分类 |
| PCF-MIG-20261007-03 | DGX-002 — 有界执行上下文与结构化结果/证据封装的通用底层 | PCF-726 | Constitution、语义拆题、ProblemGraph、领域证据规则、辩护和仲裁 |
| PCF-MIG-20261007-04 | FR-001 — 真实工程连接器 launch/bind/submit/events/control/result/health 验收 | PCF-727 | 工程目标规划、Review→Repair、升级梯与合并决策 |
| PCF-MIG-20261007-05 | FR-001 — 发起 Agent/会话提交远端子任务并消费结构化回执的调用桥 | PCF-728 | 业务汇总决策和无需人工转述的完整 Foreman 控制环 |
| PCF-MIG-20261007-06 | FR-001 — 执行侧常驻监督、唤醒、回执消费与 canonical 状态协调 | PCF-712 | Git/Mission Book/CI 目标观察、下一工程选择、Review→Repair |
| PCF-MIG-20261007-07 | FR-001 — 执行资源供给、可解释放置、原子准入与资源预留 | PCF-702, PCF-704 | 工程优先级、review 角色/资格需求和可选平台业务拓扑 |

[Migration history](MIGRATION_HISTORY.md) · [Machine-readable transfers](MIGRATION_MANIFEST.json)

Revision2 wave order replaces the earlier recommended order: A:700→701/706/725/726→708; B:702/704/709→710/707; C:703/711/712/713→705, and727 after its accepted dependencies; D:714/715/716→728→724→721. Optional717/718/719/720/722/723 never block the engineering path. Workbook dependencies, not numbering or parent labels, govern execution.

最小工程目标 / Minimum engineering outcome: Alien-origin Codex→Mech real executor→same originating Codex session consumes result, while independent Alien work overlaps. UI-only success is insufficient. No pooled RAM/GPU, arbitrary process takeover, automatic paid API, automatic merge or full DGX/URA/RIV/FR activation is implied.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **72**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 36 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [ACTIVATION_AND_EXTENSION.md](ACTIVATION_AND_EXTENSION.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [CHILD_WORKBOOK_TEMPLATE.md](CHILD_WORKBOOK_TEMPLATE.md)
- [EXECUTION_CONTRACT.md](EXECUTION_CONTRACT.md)
- [MIGRATION_HISTORY.md](MIGRATION_HISTORY.md)
- [PCF-700-ownership-and-reality-audit.md](PCF-700-ownership-and-reality-audit.md)
- [PCF-701-live-resource-telemetry.md](PCF-701-live-resource-telemetry.md)
- [PCF-702-explainable-placement.md](PCF-702-explainable-placement.md)
- [PCF-703-pipeline-offload-and-streams.md](PCF-703-pipeline-offload-and-streams.md)
- [PCF-704-admission-reservations-and-fairness.md](PCF-704-admission-reservations-and-fairness.md)
- [PCF-705-recovery-and-safe-replacement.md](PCF-705-recovery-and-safe-replacement.md)
- [PCF-706-policy-consent-and-data-boundaries.md](PCF-706-policy-consent-and-data-boundaries.md)
- [PCF-707-research-trace-and-replay-adapter.md](PCF-707-research-trace-and-replay-adapter.md)
- [PCF-708-workload-envelope-and-qos.md](PCF-708-workload-envelope-and-qos.md)
- [PCF-709-artifact-locality-and-cache.md](PCF-709-artifact-locality-and-cache.md)
- [PCF-710-headless-execution-and-isolation.md](PCF-710-headless-execution-and-isolation.md)
- [PCF-711-checkpoint-and-resume-contract.md](PCF-711-checkpoint-and-resume-contract.md)
- [PCF-712-durable-supervision-and-fencing.md](PCF-712-durable-supervision-and-fencing.md)
- [PCF-713-interference-and-slo-protection.md](PCF-713-interference-and-slo-protection.md)
- [PCF-714-origin-surface-continuity.md](PCF-714-origin-surface-continuity.md)
- [PCF-715-resource-control-and-monitor.md](PCF-715-resource-control-and-monitor.md)
- [PCF-716-unattended-deployment-and-rollback.md](PCF-716-unattended-deployment-and-rollback.md)
- [PCF-717-model-residency-and-serving.md](PCF-717-model-residency-and-serving.md)
- [PCF-718-linux-worker-onboarding.md](PCF-718-linux-worker-onboarding.md)
- [PCF-719-android-edge-companion.md](PCF-719-android-edge-companion.md)
- [PCF-720-accelerator-power-and-thermal.md](PCF-720-accelerator-power-and-thermal.md)
- [PCF-721-controlled-systems-study.md](PCF-721-controlled-systems-study.md)
- [PCF-722-controller-continuity-and-ha.md](PCF-722-controller-continuity-and-ha.md)
- [PCF-723-adaptive-placement-research.md](PCF-723-adaptive-placement-research.md)
- [PCF-724-multi-application-workload-pilots.md](PCF-724-multi-application-workload-pilots.md)
- [PCF-725-execution-provider-contract-and-boundaries.md](PCF-725-execution-provider-contract-and-boundaries.md)
- [PCF-726-execution-capsule-and-result-evidence.md](PCF-726-execution-capsule-and-result-evidence.md)
- [PCF-727-engineering-connector-live-execution.md](PCF-727-engineering-connector-live-execution.md)
- [PCF-728-originating-agent-remote-job-bridge.md](PCF-728-originating-agent-remote-job-bridge.md)
- [RESEARCH_AND_RELEASE.md](RESEARCH_AND_RELEASE.md)

<!-- DOCUMENT_NAVIGATION:END -->
