# 城市地基 City Foundation — 城市级共享基础设施 Citywide Shared Infrastructure

STATUS = PROJECT_FIRST_PARTIAL
PRIMARY_SOURCE_PROJECT = Codex-Boss
ADDITIONAL_DONOR = DS-Hns (bounded platform mechanics only)

## Project-first mapping

### 01 City Core
Codex-Boss is the primary existing source for Owner/Root Authority, city-wide durable task/state/event primitives, global orchestration/routing, runtime coordination and authority-aware execution gates.

DS-Hns is **not** a second City Core. Its `app/core` is Engineering-product infrastructure.

### 02 Node Fabric
Boss node/fleet/resource models may seed city Node Fabric. Hns hardware/resource telemetry may later feed it as signals, but does not own city node identity/membership truth.

### 03 Capability Fabric
A genuine Boss/Hns union:
- Boss: city/global capability-provider identity, broker/routing, authorization and compatibility semantics.
- Hns: capability-based plugin dependencies, four-state lifecycle, adapters, health/fallback, config and lockfile drift mechanics.

### 04 City Roads
Road contracts remain Digital-City architecture. Boss/Hns provide concrete runtime/provider contracts as implementation seeds.

### 05 Control Centre
Boss already provides Chat/Work, WorkBook, Provider Manager, Owner Dashboard and research/engineering status/control. Hns exposes Engineering-domain panels that should connect through stable interfaces.

## Infrastructure modules
1. [City Core](./01-城市核心(City-Core)-&-运行信任编排内核(Runtime-Trust-Orchestration-Kernel)/)
2. [Node Fabric](./02-城市节点网(City-Node-Network)-&-设备节点互联层(Device-Node-Fabric)/)
3. [Capability Fabric](./03-城市服务网(City-Service-Network)-&-能力注册发现层(Capability-Registry-Discovery-Layer)/)
4. [City Roads](./04-城市道路(City-Roads)-&-跨域语义契约(Cross-Domain-Semantic-Contracts)/)
5. [Control Centre](./05-城市控制中心(City-Control-Centre)-&-人机控制界面(Human-Control-Surface)/)

## Reference-only architecture notes

The following directory is deliberately **not** a sixth infrastructure slot and is **not** part of the City runtime contract:

- [Hardware & Network Reference](./90-硬件网络参考(Hardware-Network-Reference)-&-非约束部署参考(Non-Binding-Deployment-Reference)/) — future dual-Linux / multi-Windows / macOS / mobile topology reference and hardware-independence notes.

Its content is advisory. Current device availability and runtime evidence override the reference topology. Planned Mac/Linux/iPhone/HarmonyOS devices must not become current task prerequisites merely because they appear in that directory.

## Boundary
Union does not erase scope. Hns local registries/resource managers may donate mechanics or signals without becoming city-global truth/authority.

## 中文说明 / Chinese explanation

### 以项目为先的映射

城市地基状态为 `PROJECT_FIRST_PARTIAL`；Codex-Boss 是主要来源，DS-Hns 只提供有边界的平台机制。

1. **城市核心**：Boss 提供 Owner/Root Authority、城市级持久任务/状态/事件、全局编排与路由、运行时协调及权限感知执行门禁。Hns 的 `app/core` 是工程产品基础设施，不能成为第二个城市核心。
2. **城市节点网**：Boss 的节点、机群、资源模型可作为来源；Hns 硬件和资源遥测可提供信号，但不拥有城市节点身份或成员事实。
3. **城市服务网**：Boss 提供全局能力提供者身份、代理与路由、授权和兼容语义；Hns 提供按能力声明的插件依赖、四态生命周期、适配器、健康与回退、配置和锁文件漂移机制。
4. **城市道路**：契约仍属于 Digital-City 架构，Boss/Hns 的实际运行时和提供者契约是实现种子。
5. **城市控制中心**：Boss 已有 Chat/Work、WorkBook、Provider Manager、Owner Dashboard 和研究/工程状态控制；Hns 工程面板应通过稳定接口接入。

### 导航与边界

上方 Infrastructure modules 列出的五个链接依次对应城市核心、节点网、服务网、道路、控制中心。硬件网络参考目录是建议性文档，不是第六个基础设施模块，也不是运行时契约。当前设备和运行证据优先于未来双 Linux、多 Windows、macOS、移动设备设想；计划中的 Mac/Linux/iPhone/HarmonyOS 不会自动成为当前任务前提。功能联合保留各自范围，Hns 局部注册表和资源管理器提供机制或信号，不因此成为城市全局事实或权威。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 6 |
| 递归 Markdown 文档 / Recursive Markdown documents | 9 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_FIRST_PARTIAL` |

### 子区导航 / Subarea navigation

| 目录 / Directory | 文档 / Documents | 原记录实现状态 / Recorded implementation status |
|---|---|---|
| [01-城市核心(City-Core)-&-运行信任编排内核(Runtime-Trust-Orchestration-Kernel)](./01-%E5%9F%8E%E5%B8%82%E6%A0%B8%E5%BF%83%28City-Core%29-%26-%E8%BF%90%E8%A1%8C%E4%BF%A1%E4%BB%BB%E7%BC%96%E6%8E%92%E5%86%85%E6%A0%B8%28Runtime-Trust-Orchestration-Kernel%29/README.md) | 1 | `PROJECT_FIRST_PRIMARY_IMPLEMENTATION_SOURCE` |
| [02-城市节点网(City-Node-Network)-&-设备节点互联层(Device-Node-Fabric)](./02-%E5%9F%8E%E5%B8%82%E8%8A%82%E7%82%B9%E7%BD%91%28City-Node-Network%29-%26-%E8%AE%BE%E5%A4%87%E8%8A%82%E7%82%B9%E4%BA%92%E8%81%94%E5%B1%82%28Device-Node-Fabric%29/README.md) | 1 | `REFERENCE_IMPLEMENTATION_EXISTS` |
| [03-城市服务网(City-Service-Network)-&-能力注册发现层(Capability-Registry-Discovery-Layer)](./03-%E5%9F%8E%E5%B8%82%E6%9C%8D%E5%8A%A1%E7%BD%91%28City-Service-Network%29-%26-%E8%83%BD%E5%8A%9B%E6%B3%A8%E5%86%8C%E5%8F%91%E7%8E%B0%E5%B1%82%28Capability-Registry-Discovery-Layer%29/README.md) | 1 | `REFERENCE_IMPLEMENTATION_EXISTS` |
| [04-城市道路(City-Roads)-&-跨域语义契约(Cross-Domain-Semantic-Contracts)](./04-%E5%9F%8E%E5%B8%82%E9%81%93%E8%B7%AF%28City-Roads%29-%26-%E8%B7%A8%E5%9F%9F%E8%AF%AD%E4%B9%89%E5%A5%91%E7%BA%A6%28Cross-Domain-Semantic-Contracts%29/README.md) | 1 | `PARTIAL_VERSIONED_CONTRACTS_EXIST` |
| [05-城市控制中心(City-Control-Centre)-&-人机控制界面(Human-Control-Surface)](./05-%E5%9F%8E%E5%B8%82%E6%8E%A7%E5%88%B6%E4%B8%AD%E5%BF%83%28City-Control-Centre%29-%26-%E4%BA%BA%E6%9C%BA%E6%8E%A7%E5%88%B6%E7%95%8C%E9%9D%A2%28Human-Control-Surface%29/README.md) | 1 | `REFERENCE_PRODUCT_SURFACES_EXIST` |
| [90-硬件网络参考(Hardware-Network-Reference)-&-非约束部署参考(Non-Binding-Deployment-Reference)](./90-%E7%A1%AC%E4%BB%B6%E7%BD%91%E7%BB%9C%E5%8F%82%E8%80%83%28Hardware-Network-Reference%29-%26-%E9%9D%9E%E7%BA%A6%E6%9D%9F%E9%83%A8%E7%BD%B2%E5%8F%82%E8%80%83%28Non-Binding-Deployment-Reference%29/README.md) | 3 | `REFERENCE_ONLY_NON_BINDING` |

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
