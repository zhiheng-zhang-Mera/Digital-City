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
| [00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure)](./00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure)/) | citywide shared infrastructure | PROJECT_FIRST_PARTIAL / BOSS_PRIMARY |
| [01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)](./01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/) | governance and security domain | PROJECT_FIRST_REVIEWED_PARTIAL / QUALIFICATION_CONTROL |
| [02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)](./02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)/) | engineering and operations domain | PROJECT_FIRST_REVIEWED / HNS+HEALTH+RESTART |
| [03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)](./03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)/) | digital identity and agent domain | PROJECT_FIRST_REVIEWED / DIGITAL_ME |
| [04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)](./04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)/) | legal/privacy governance domain | STRUCTURAL_EMPTY_BY_DESIGN |
| [05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)](./05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)/) | health data/service domain | PROJECT_FIRST_PARTIAL / PARAMA+DRUG_SIMULATOR |
| [06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)](./06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/) | research experimentation domain | STRUCTURE_READY / IMPLEMENTATION_PARTIAL |
| [07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)](./07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)/) | financial/quantitative domain | PROJECT_FIRST_REVIEWED / QUANT_ULTRA |
| [08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)](./08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)/) | device and edge-computing domain | PROJECT_FIRST_PARTIAL / VR_GLOVE |
| [09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)](./09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)/) | planning and knowledge-management domain | IMPLEMENTATION_PARTIAL / RUNTIME_KNOWLEDGE_ONLY |
| [10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)](./10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)/) | automation execution domain | PROJECT_FIRST_PARTIAL / COMPUTER_USE+AUTO_GAME_BOT |
| [11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)](./11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)/) | media and immersive-interaction domain | PARTIAL_PROJECT_CONTRIBUTIONS / NO_PROMOTED_DOMAIN_MODULE |

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

- [Customs Security](./01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/01-海关安检(Customs-Security)-&-扩展准入检查(Extension-Admission-Checks)/) — logical admission gate; a standalone service is not required by default.
- [Runtime Compliance / Public Security](./01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/02-公安监管(Public-Security)-&-运行时合规执行(Runtime-Compliance-Enforcement)/) — logical enforcement gate; extraction remains conditional.

No empty district/building is a blocker for Utopia product usability.

## Future work routing and lifecycle boundary

Digital-City no longer treats every new idea as a future City module.

Every new software, paper, hardware or mixed project MUST first be classified by **where the work naturally belongs**, not by which City district could eventually consume it.

### Route A — Utopia-native capability

Use this route only when the new work is primarily a capability of the Utopia product itself.

Default birth place:

```text
Utopia
└── apps/rooms
    └── incubating room / local product room
```

Lifecycle:

```text
LOCAL_PRODUCT or INCUBATING
        ↓
working local product
        ↓
tests + real/local acceptance
        ↓
ACCEPTED_LOCAL
        ↓
is this a reusable City capability?
        ├─ no  → remain LOCAL_PRODUCT
        └─ yes → PROMOTION_CANDIDATE
                    ↓
              City placement review
                    ↓
                 PROMOTED
```

Rules:

- Do not create a City Building/Module first and then search for implementation.
- A useful personal tool may remain a Utopia `LOCAL_PRODUCT` forever.
- Promotion means the capability has a stable City owner and acceptance boundary.
- After promotion, do not maintain two live implementations merely because the incubator once existed.
- Keep donor provenance, promotion records and Git history even when the live incubator retires.

### Route B — independent software / paper / hardware project

Independent work starts and remains in its **own normal repository**.

Examples:

- a standalone software product;
- a research/paper project;
- firmware / electronics / CAD / device work;
- a mixed software + hardware project.

The project follows ordinary development practice:

```text
project repo
├── normal source / paper / firmware / tests / docs
└── .utopia-history/
    └── learning evidence for Utopia
```

`.utopia-history/` is an observation/learning side channel. It is **not** the project's active instruction surface and must not redefine normal project architecture.

Recommended shape:

```text
.utopia-history/
├── README.md
├── episodes/
├── decisions/
├── failures/
├── acceptances/
└── project-summary.json
```

Prefer structured, inspectable records such as:

- project/episode goal;
- attempted approach;
- relevant change/ref;
- failure category;
- repair;
- test / CI outcome;
- interruption / resume;
- Owner intervention;
- final acceptance;
- cost/time/resource metadata when useful;
- source commit / artifact / evidence references.

Do **not** treat the folder as a permanent dump of raw terminal logs, hidden model reasoning, credentials or secrets.

### Learning boundary

Utopia may learn from an independent project from **day one**, without owning that project.

```text
Independent project
   ├─ commits / PRs / Issues
   ├─ execution receipts
   ├─ tests / CI
   ├─ failures / repairs
   ├─ Owner interventions
   └─ acceptance
            ↓
      .utopia-history
            ↓
      Utopia Experience / Evolution feed
```

Critical rule:

> **Learning evidence is not instruction inheritance.**

A historical workaround, failed attempt or old decision in `.utopia-history/` must not automatically become a current project rule.

Current project truth still comes from the repository's active code, current docs/instructions, accepted issues/PRs and current task context.

### Project closeout — Capability Harvest Review

Independent projects are **not** progressively dismantled into City modules during normal development by default.

At project closeout, or earlier only when a clearly reusable capability has multiple real consumers, run a **Capability Harvest Review**.

Ask:

1. Is this capability useful outside the source project?
2. Does it already have at least one additional real consumer or a concrete Utopia/City consumer?
3. Is its contract stable enough to separate?
4. Does independent testing improve clarity?
5. Does it have a meaningfully different lifecycle/failure/security boundary?
6. Would extraction reduce duplication rather than create maintenance debt?

Possible result:

```text
NO_EXTRACTION
```

is a normal and preferred outcome when reuse is not justified.

If extraction is justified:

```text
project-local capability
        ↓
extraction candidate
        ↓
Utopia Room / sandbox incubation
        ↓
independent acceptance / replay
        ↓
City ownership review
        ↓
promotion
```

Do **not** jump directly from “worked once in Project A” to “City shared capability.”

### Paper-specific rule

A paper or research project remains a paper/project artifact.

Its experiments, failed hypotheses, source selection, evidence handling, claim revisions and reviewer-response history may feed Utopia learning.

Only **reusable research mechanisms** may later graduate into 06 Research.

The paper itself is not a City Building merely because it produced useful methodology.

### Hardware-specific rule

Hardware/firmware/CAD remains in its own project repository.

Utopia may learn from flashing failures, protocol revisions, latency/power measurements, sensor drift, recovery and physical acceptance.

Only stable reusable device contracts/adapters should later graduate into 08 Device & Edge.

### Discussion routing rule

When opening a new design/discussion, classify it before proposing City placement:

```text
Is this primarily a Utopia-native capability?
  YES → apps/rooms incubation first

Is this an independent software / paper / hardware project?
  YES → independent repo + .utopia-history side channel

Is a reusable capability already proven?
  NO  → do not create a City module

Has a stable reusable capability emerged?
  YES → harvest → Utopia incubation/sandbox → qualification → City promotion
```

This rule prevents three recurring errors:

1. **premature City admission** — creating Buildings for ideas that are still ordinary projects;
2. **development contamination** — allowing Utopia learning history to become project instructions;
3. **unqualified promotion** — extracting project code directly into City without a reuse/acceptance gate.

### Stable responsibility model

```text
Project repository = birthplace and normal development truth
Digital-City       = capability ownership / registry / boundaries
Utopia             = product terminal + incubator + experience learner
.utopia-history    = learning evidence side channel, not authority
```

The previous project-first inventory work remains valid historical classification. Future work should use the routing model above by default.

See [PROJECT_REVIEW.md](./PROJECT_REVIEW.md) for the completed repository inventory, [COMPOSITE_UNIONS.md](./COMPOSITE_UNIONS.md) for overlap-union rules, and [CITY_CAPABILITY_GAP_REVIEW.md](./CITY_CAPABILITY_GAP_REVIEW.md) for the post-inventory conflict cleanup and product-priority result.

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

At the 2026-09-29 snapshot, Utopia already has accepted Web/Android product surfaces, a V0.3 capability bridge/hardening baseline, promoted City modules, and an accepted Room Pack. The generic Theme Engine is architecturally owned by **00/05 Control Centre** even though its current Utopia code path still carries historical `city/11` placement.

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
PROJECT_INVENTORY_REVIEW_COMPLETE
PROJECT_REVIEW_MODE = PROJECT_FIRST_DECOMPOSITION
UTOPIA_IMPLEMENTATION_TRACKING_ACTIVE
DIGITAL_ME_PROJECT_DECOMPOSITION = RECORDED
CODEX_BOSS_PROJECT_DECOMPOSITION = RECORDED
DS_HNS_PROJECT_DECOMPOSITION = RECORDED
PARAMA_HEALTH_PROJECT_DECOMPOSITION = RECORDED
DRUG_SIMULATOR_PROJECT_DECOMPOSITION = RECORDED
QUANT_ULTRA_PROJECT_DECOMPOSITION = RECORDED
QUALIFICATION_HEALTH_RESTART_LOGIC_AUTOMATION_DEVICE = RECORDED
ML_QUANT_DONOR_REVIEW = RECORDED
OWNER_EXCLUDED_PROJECTS = RECORDED
SUPERSEDED_AND_COURSEWORK_PROJECTS = RESOLVED
DEPRECATED_PROJECT_EXCLUSIONS = RECORDED
BOSS_HNS_OVERLAP_UNIONS = RECORDED
PROJECT_INVENTORY_REVIEW = COMPLETE
CITY_CAPABILITY_GAP_REVIEW = COMPLETE
THEME_OWNERSHIP = 00/05_CONTROL_CENTRE
UTOPIA_REFERENCE_SPINE = NODE+CAPABILITY+CONTROL
NEXT_PHASE = UTOPIA_UNIVERSAL_PERSONAL_TERMINAL_FAST_PATH
```
