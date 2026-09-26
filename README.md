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
| [02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)](./02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)/) | engineering and operations domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)](./03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)/) | digital identity and agent domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)](./04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)/) | legal/privacy governance domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)](./05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)/) | health data/service domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)](./06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/) | research experimentation domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)](./07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)/) | financial/quantitative domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)](./08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)/) | device and edge-computing domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)](./09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)/) | planning and knowledge-management domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)](./10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)/) | automation execution domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)](./11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)/) | media and immersive-interaction domain | STRUCTURE_READY / CONTENT_REVIEW_PENDING |

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

## Project-mapping review

Directory topology and project assignment remain separate.

The pre-restructure registry is preserved historically. The next phase reviews each module/project and decides:

1. whether it belongs in the city;
2. which district/building owns it;
3. whether it is infrastructure, a building, building component, evidence, or historical asset;
4. which rooms/capabilities it exposes;
5. which roads it requires.

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
PROJECT_MAPPING_REVIEW_PENDING
```
