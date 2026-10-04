# Research Strengthening / 研究强化工程

> **状态：READY / ACTIVE PROGRAMME**
>
> 本工程把 Utopia 从“可用的个人万能终端”继续强化为一个**可做可重复实验的多设备智能软件系统研究试验台**。
>
> 目标不是再堆一个孤立功能，而是让已有的 scheduler、handoff、recovery、AI/service routing、multi-device、Rooms、Actions、Remote Fabric 与未来 Workbench 都能被：
>
> ```text
> 定义实验
> → 重复运行
> → 自动追踪
> → 故障注入
> → 回放
> → 消融
> → 统计
> → 导出研究 artifact
> ```
>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步减压施工：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 研究素材规则：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)  
> 研究控制面原则：[RESEARCH_CONTROL_SURFACE.md](./RESEARCH_CONTROL_SURFACE.md)

## 1. PhD 申请强化目标

本 programme 必须产生的不只是“又多一套代码”，而是能在申请材料里诚实支持：

- reproducible experimentation；
- empirical software engineering；
- multi-device / distributed systems evaluation；
- AI-agent / tool-use evaluation；
- fault injection / recovery / resilience；
- human intervention measurement；
- trace replay；
- ablation study；
- research artifact packaging。

完成后应能把 Utopia 描述为：

> a reproducible experimental platform for studying multi-device AI-assisted software systems, with controlled workloads, fault injection, trace replay, ablation, cross-device scheduling and automated research-artifact generation.

## 2. 架构原则

Research Fabric 不成为第二套 task truth，也不接管正常产品执行。

```text
Normal Utopia runtime
        │
        ├── canonical tasks/actions/events
        │
        └── Research & Evaluation Fabric
              ├─ Experiment Registry
              ├─ Trace / Provenance
              ├─ Scenario Runner
              ├─ Fault Injection
              ├─ Replay / Ablation
              ├─ Metrics
              └─ Artifact Export
```

研究能力读取/编排现有产品 contract；不得为了实验方便复制 scheduler、device identity、Remote Fabric 或 Action truth。

## 3. Programme 工作拆分

| ID | 工作 | 状态 | 目标 |
|---|---|---|---|
| [REX-801](./REX-801-experiment-manifest-and-registry.md) | Experiment Manifest + Registry | READY | 机器可读实验问题、拓扑、变量、重复次数和 acceptance |
| [REX-802](./REX-802-trace-provenance-and-metrics-foundation.md) | Trace / Provenance / Metrics Foundation | READY | 统一记录 task/action/device/provider/handoff/retry/failure/recovery/human intervention |
| [REX-803](./REX-803-scenario-runner-and-repetition-engine.md) | Scenario Runner + Repetition Engine | WAITING_DEPENDENCIES | 自动执行 controlled scenario × N |
| [REX-804](./REX-804-fault-injection-and-recovery-probes.md) | Fault Injection + Recovery Probes | WAITING_DEPENDENCIES | 故意制造节点/网络/provider/load/stale/duplicate 等故障并量化恢复 |
| [REX-805](./REX-805-trace-replay-and-ablation.md) | Trace Replay + Ablation | WAITING_DEPENDENCIES | 同一 trace 重放并关闭 handoff/retry/backoff 等机制做消融 |
| [REX-806](./REX-806-metrics-analysis-and-artifact-export.md) | Metrics + Research Artifact Export | WAITING_DEPENDENCIES | normalized dataset、tables、artifact pack、reproduction docs |
| [REX-807](./REX-807-research-control-surface-and-progressive-disclosure.md) | Research Control Surface | WAITING_DEPENDENCIES | 给 Owner 最大实验掌控/知情权，但不污染普通用户主导航 |
| [REX-890](./REX-890-reproducibility-study-and-freeze.md) | Reproducibility Study + Freeze | WAITING_DEPENDENCIES | 双机独立复现实验，冻结 Research Fabric v1 |

REX-801 与 REX-802 可双机并行。后续任务统一为 `WAITING_DEPENDENCIES`，并使用 `DEPENDENCY_SHA_UNION_AT_CLAIM` 从前置 accepted full SHAs 建精确 union baseline；不会再把 main 分支名当作依赖已落地的证明。

## 4. 双机异步施工

沿用现有 Alien / Mech：

```text
Alien Development  → Mech Formal Review
Mech Development   → Alien Formal Review
```

强制继承：

- atomic claim；
- different physical host review；
- CI / 长实验等待不占主机；
- event wake-up；
- 约 20 分钟 bounded rescan；
- fresh critic；
- Review → Repair；
- exact-head evidence；
- latest-main integration；
- no make-work。

研究任务尤其禁止“实验跑着所以主机只能等”。长 repetitions / fault campaign / CI 期间，施工主机应继续扫描其它不冲突工作。

## 5. Research Fabric 不是 Workbench 前置依赖

Alien + Mech + Android 就必须能完成 v1。

未来 Workbench 只是：

```text
additional experiment nodes / higher workload scale
```

而不是：

```text
research architecture prerequisite
```

若本 programme 因没有 Linux/Workbench 无法正常开发或验证基础 contract，即设计失败。

## 6. 用户暴露原则

本 programme 全部服从全局 `CONSTRUCTION_RULES.md` 的 **Capability Exposure Gate**。

特别地：

- experiment create/run/stop/export = 用户直接操作，必须有明确入口；
- experiment status / metrics / provenance = 用户必须可观察；
- fault injection = 高影响高级控制，不放普通主导航，但必须有显式 Research/Advanced 入口、风险说明和确认；
- raw internal trace plumbing = 可为 INTERNAL_ONLY，但必须有 exposure decision 记录；
- 普通 Utopia 用户不应被 Research controls 淹没。

详细收纳见 [RESEARCH_CONTROL_SURFACE.md](./RESEARCH_CONTROL_SURFACE.md)。

## 7. 强制论文素材

所有 REX 任务执行 [RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)。

任何：

- 运行报错；
- test/CI fail；
- timeout；
- race；
- incorrect measurement；
- false assumption；
- Development / Review 逻辑冲突；
- fault campaign unexpected outcome；
- failed replay；
- non-reproducible result；
- before/after metrics；

都必须保存，不得在修复后清洗。

## 8. Final merge lock

现在不创建 final integration workbook。

只有 REX-801..807 全部：

- Development complete；
- opposite-host Review complete；
- exact-head CI green；
- exposure decision satisfied；
- PAPER/RESEARCH material index complete；

之后 REX-890 才能进行独立 reproduction study。

Programme terminal marker：

`RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`

该 marker 不代表所有论文问题已经回答，只代表 Utopia 已具备可靠地产生研究数据的基础设施。
