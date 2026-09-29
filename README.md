# Digital City

> **City map, registry, and integration model for the connected digital ecosystem.**

Digital-City is not a monorepo. It describes how independently maintained projects fit into one shared city.

## Directory naming convention

Every directory uses the same bilingual dual-name format:

```text
编号-隐喻中文(English-Metaphor)-&-实际中文(English-Technical-Type)
```

The left side is the human-facing city metaphor. The right side states the real architectural type.

## Canonical hierarchy

```text
City
├── City Infrastructure
├── District
│   └── Building
│       └── Room / Capability
└── Roads / Cross-domain contracts
```

- **City Infrastructure / 城市基础设施** — substrate shared by the whole city.
- **District / 功能区** — first-level domain or civic area.
- **Building / 楼栋** — a coherent institution/product/service boundary or an explicit future placeholder.
- **Room / 房间** — a capability owned by a building.
- **Road / 道路** — a stable cross-boundary semantic contract.

## Directory map

| Path | Architectural meaning | Mapping state |
|---|---|---|
| [00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure)](./00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure)/) | citywide shared infrastructure | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)](./01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/) | governance and security domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)](./02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)/) | engineering and operations domain | STRUCTURE_READY / IMPLEMENTATION_PARTIAL |
| [03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)](./03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)/) | digital identity and agent domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)](./04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)/) | legal/privacy governance domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)](./05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)/) | health data/service domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)](./06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/) | research experimentation domain | STRUCTURE_READY / IMPLEMENTATION_PARTIAL |
| [07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)](./07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)/) | financial/quantitative domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)](./08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)/) | device and edge-computing domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)](./09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)/) | planning and knowledge-management domain | STRUCTURE_READY / IMPLEMENTATION_PARTIAL |
| [10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)](./10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)/) | automation execution domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)](./11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)/) | media and immersive-interaction domain | STRUCTURE_READY / IMPLEMENTATION_PARTIAL |

## 00 infrastructure layout

```text
00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure)/
├── 01-城市核心(City-Core)-&-运行信任编排内核(Runtime-Trust-Orchestration-Kernel)/
├── 02-城市节点网(City-Node-Network)-&-设备节点互联层(Device-Node-Fabric)/
├── 03-城市服务网(City-Service-Network)-&-能力注册发现层(Capability-Registry-Discovery-Layer)/
├── 04-城市道路(City-Roads)-&-跨域语义契约(Cross-Domain-Semantic-Contracts)/
└── 05-城市控制中心(City-Control-Centre)-&-人机控制界面(Human-Control-Surface)/
```

The five infrastructure slots answer different questions:

- **Core** — who owns runtime authority, trust, identity and orchestration?
- **Node Fabric** — which authorized device/node exists and what runtime resources can it expose?
- **Capability Fabric** — what can the city do, who provides the capability, and how is it discovered/registered?
- **City Roads** — what stable semantic contracts cross boundaries?
- **Control Centre** — how does the human observe, navigate and submit control requests?

Capability Fabric is deliberately broader than “plugins”: plugins are one packaging/admission form for capabilities, not the city capability model itself.

## Preserved planned-building placeholders

- [Customs Security](./01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/01-海关安检(Customs-Security)-&-扩展准入检查(Extension-Admission-Checks)/)
- [Runtime Compliance / Public Security](./01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/02-公安监管(Public-Security)-&-运行时合规执行(Runtime-Compliance-Enforcement)/)
- [Integrated Health Hospital](./05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)/01-综合医院(Integrated-Health-Hospital)-&-综合健康服务平台(Integrated-Health-Service-Platform)/)
- [Research Institute](./06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/)
- [Entertainment Centre](./11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)/01-娱乐中心(Entertainment-Centre)-&-媒体沉浸交互平台(Media-Immersive-Interaction-Platform)/)

Their `PROJECT_NOT_CREATED` semantics remain unchanged.

## Project-first review strategy

City review now starts from **existing GitHub repositories**, not from empty city modules.

The binding flow is:

```text
Existing repository
  → recover original/current functional intent
  → decompose into capability clusters
  → place each cluster in the appropriate City district/building/room
  → define only the Roads actually required by those clusters
  → create a new placeholder only if a real required capability remains ownerless
```

A repository is therefore an **implementation/source asset**, not automatically one Building. One repository may contribute modules to several districts; one Building may also be backed by several repositories. Physical code movement is a separate later decision.

See [PROJECT_REVIEW.md](./PROJECT_REVIEW.md) for the repository-driven review queue and the completed Digital-Me decomposition.

## Project-mapping review

Directory topology and project assignment remain separate.

The pre-restructure registry is preserved historically. The next phase reviews each module/project and decides:

1. whether it belongs in the city;
2. which district/building owns it;
3. whether it is infrastructure, a building, building component, evidence, or historical asset;
4. which rooms/capabilities it exposes;
5. which roads it requires.

## Implementation tracking

Digital-City remains the canonical **planning, ownership and boundary map**. Runtime code does not live here.

**[Utopia](https://github.com/zhiheng-zhang-Mera/Utopia)** is the current product/reference implementation and active landing zone for qualified city modules. Code temporarily living in Utopia does **not** transfer permanent architectural ownership to Utopia.

At the 2026-09-29 snapshot, Utopia has promoted modules in districts **02 Engineering, 06 Research, 09 Planning & Knowledge and 11 Entertainment**. Product-level Android/Web control surfaces also exist, while Utopia's own README still marks V0.2 overall acceptance as incomplete pending real-camera QR acceptance.

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for the bound implementation snapshot and the Digital-City ↔ Utopia distinction.

## Policy scope

```text
L0  City Constitution
L1  District / Domain Charter
L2  Building / Project Policy
L3  Runtime / Experiment Rules
```

## Repository files

- [CITY_MANIFEST.yaml](./CITY_MANIFEST.yaml) — machine-readable structural registry
- [CITY_PROTOCOL.md](./CITY_PROTOCOL.md) — city vocabulary and integration rules
- [DISTRICT_TEMPLATE.md](./DISTRICT_TEMPLATE.md) — district README template
- [BUILDING_TEMPLATE.md](./BUILDING_TEMPLATE.md) — building README template

## Current phase

```text
DIGITAL_CITY_BILINGUAL_DIRECTORY_SCHEMA
PROJECT_MAPPING_REVIEW_IN_PROGRESS
PROJECT_REVIEW_MODE = PROJECT_FIRST_DECOMPOSITION
UTOPIA_IMPLEMENTATION_TRACKING_ACTIVE
DIGITAL_ME_PROJECT_DECOMPOSITION = RECORDED
NEXT_PROJECT_REVIEW = SELECT_EXISTING_REPOSITORY
```
