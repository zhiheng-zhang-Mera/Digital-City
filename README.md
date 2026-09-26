# Digital City

> **City map, registry, and integration model for the connected digital ecosystem.**

Digital-City is not a monorepo. It describes how independently maintained projects fit into one shared city.

## Canonical hierarchy

```text
City
├── City Infrastructure
├── District
│   └── Building
│       └── Room / Capability
└── Roads / Cross-domain contracts
```

- **City Infrastructure / 城市基础设施** — substrate that exists for the whole city rather than one business domain.
- **District / 功能区** — first-level domain or civic area.
- **Building / 楼栋** — a coherent institution, product, service boundary, or explicit future placeholder inside a district.
- **Room / 房间** — a capability owned by a building.
- **Road / 道路** — a stable interface, event, schema, dependency, or data flow crossing building/district boundaries.

The directory hierarchy is a city topology, not a requirement to merge source repositories.

## Directory map

| Path | Role | Mapping state |
|---|---|---|
| [00-City-Infrastructure](./00-City-Infrastructure/) | core OS, node fabric, roads, city control surface | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [01-Government-Safety](./01-Government-Safety/) | governance, qualification, admission, runtime hard-boundary enforcement | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [02-Engineering](./02-Engineering/) | construction, testing, repair, host and recovery | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [03-Residential](./03-Residential/) | digital identity / resident-facing systems | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [04-Legal-Privacy](./04-Legal-Privacy/) | privacy, legal boundaries, evidence/audit assets | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [05-Health](./05-Health/) | health, physiology, nutrition and longitudinal systems | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [06-Research](./06-Research/) | research institutes, mechanism research and academic experimentation | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [07-Finance](./07-Finance/) | quantitative, market and finance systems | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [08-Device-Edge](./08-Device-Edge/) | wearables, sensing, firmware, embodied and edge interfaces | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [09-Planning-Knowledge](./09-Planning-Knowledge/) | ideas, task planning, applications, research planning and knowledge assets | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [10-Automation](./10-Automation/) | application/task automation | STRUCTURE_READY / CONTENT_REVIEW_PENDING |
| [11-Entertainment](./11-Entertainment/) | translation, immersive media, AR/VR and media-facing experiences | STRUCTURE_READY / CONTENT_REVIEW_PENDING |

## Infrastructure layout

```text
00-City-Infrastructure/
├── Core-OS/
├── Node-Fabric/
├── Roads/
└── Control-Centre/
```

These are city-level infrastructure slots rather than normal business districts.

## Existing planned-building placeholders preserved by this migration

- [Customs Security](./01-Government-Safety/Customs-Security/)
- [Runtime Compliance / Public Security](./01-Government-Safety/Public-Security/)
- [Integrated Health Hospital](./05-Health/Integrated-Health-Hospital/)
- [Research Institute](./06-Research/Research-Institute/)
- [Entertainment Centre](./11-Entertainment/Entertainment-Centre/)

Their previous `PROJECT_NOT_CREATED` semantics remain unchanged.

## Project-mapping review

This commit intentionally separates **directory topology** from **project assignment**.

The previous registry snapshot is anchored at commit:

```text
818cc831a66d578c822e1f07b0a3b49b331fda11
```

The next phase will inspect each district/building and decide, project by project:

1. whether the project belongs in the city;
2. which district owns it;
3. whether it is a building, a component of a larger building, infrastructure, evidence, or only historical material;
4. which rooms/capabilities it exposes;
5. which roads it needs;
6. whether duplicate/legacy repositories should remain visible.

Until that review is complete, directory placement alone must not be interpreted as a final ownership decision.

## Policy scope

```text
L0  City Constitution
L1  District / Domain Charter
L2  Building / Project Policy
L3  Runtime / Experiment Rules
```

Lower-scope rules do not silently become city-wide rules.

## Repository files

- [CITY_MANIFEST.yaml](./CITY_MANIFEST.yaml) — machine-readable structural registry
- [CITY_PROTOCOL.md](./CITY_PROTOCOL.md) — city vocabulary and integration rules
- [DISTRICT_TEMPLATE.md](./DISTRICT_TEMPLATE.md) — district README template
- [BUILDING_TEMPLATE.md](./BUILDING_TEMPLATE.md) — building README template

## Current phase

```text
DIGITAL_CITY_DIRECTORY_RESTRUCTURED
PROJECT_MAPPING_REVIEW_PENDING
```

The city skeleton is now stable enough to review project contents district by district without repeatedly changing the top-level taxonomy.
