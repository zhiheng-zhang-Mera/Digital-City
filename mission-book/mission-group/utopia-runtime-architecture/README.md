# URA — Utopia Runtime Architecture / Utopia 运行时分层

> **状态：PARKED / NOT ACTIVATED**
>
> 本系列记录 Utopia 内部运行时分类与逻辑解耦设计。当前只做未来工作书设计：**不拆仓、不移动代码、不改变已验收能力、不进入主任务统计。**
>
> 本目录不加入 `PROGRESS_MANIFEST.json`；所有工作书 `execution_enabled=false`。

## 目标

为 Utopia 建立与 Digital-City 拓扑**正交**的产品运行时 taxonomy：

```text
Core primitives
  ↑
Platform / System Services
  ↑
System Apps / Native Apps
  ↑
Connectors / Adapters to external software
```

候选依赖原则：

```text
Apps
→ Public Contracts
→ Platform Services
→ Core
```

不得形成反向业务依赖，除非有明确 extension/callback contract。

## 分类

### Core

只保留真正跨产品的 runtime primitive，例如 task/state/event、identity/trust、IPC、permission、device/capability discovery、recovery 等。

### Platform / System Service

为多个 App/设备/Agent 提供持续能力，但自身不是用户业务产品，例如 Gateway、Engineering orchestration、Remote Fabric 等候选。

### System App

系统自带、面向 Owner 的一等应用/控制面，例如 Monitor 类产品面。

### Native App

**逻辑可独立，体验内嵌 Utopia。** 通过稳定 App Contract 使用系统能力；不是把所有业务塞进 Core，也不是松散脚本。

### Connector / Adapter

对接第三方或外部既有产品/协议，不拥有 Utopia 核心业务真相。

## 与 City vocabulary 的边界

Digital-City 的 District / Building / Room / Road 描述**城市拓扑与能力所有权**；URA 的 Core / Service / App / Connector 描述**Utopia 产品运行时角色**。两套分类可以交叉映射，但不得互相覆盖。

尤其：City `Room` 已有正式含义，不在本系列中把它改成“孵化房”。

## 工作系列

| ID | 工作 | 状态 |
|---|---|---|
| URA-001 | Current Runtime Topology & Ownership Audit | PARKED |
| URA-002 | Runtime Taxonomy + App Contract | PARKED |
| URA-003 | Dependency / Lifecycle / Failure Boundaries | PARKED |
| URA-004 | Surface Integration + Capability Registry Mapping | PARKED |
| URA-990 | Soft Reclassification Acceptance & Freeze | PARKED |

## 迁移原则

```text
classify first
→ define contracts
→ add boundary tests
→ reclassify docs/registry
→ move code only when measured coupling/ownership/lifecycle benefit exists
```

当前默认：**single Utopia repo remains acceptable**。物理拆仓属于 suspend 中保留的未来选项，不是本系列默认目标。


---

语言读本 / Reading translation: [English](en/README.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **12**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 6 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [URA-001-current-runtime-topology-audit.md](URA-001-current-runtime-topology-audit.md)
- [URA-002-runtime-taxonomy-and-app-contract.md](URA-002-runtime-taxonomy-and-app-contract.md)
- [URA-003-dependency-lifecycle-failure-boundaries.md](URA-003-dependency-lifecycle-failure-boundaries.md)
- [URA-004-surface-integration-and-registry-mapping.md](URA-004-surface-integration-and-registry-mapping.md)
- [URA-990-soft-reclassification-acceptance-and-freeze.md](URA-990-soft-reclassification-acceptance-and-freeze.md)

<!-- DOCUMENT_NAVIGATION:END -->
