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
