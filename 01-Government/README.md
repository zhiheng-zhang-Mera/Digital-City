# Government — 市政厅与治理建筑

## Direct repository links

- **[Codex-Boss](https://github.com/zhiheng-zhang-Mera/Codex-Boss)** — 城市地基、运行时与治理底层
- **[Boss-Qualification-Control](https://github.com/zhiheng-zhang-Mera/Boss-Qualification-Control)** — 城市级资格与验收控制
- **[General-Logic-Engine](https://github.com/zhiheng-zhang-Mera/General-Logic-Engine)** — 可复用逻辑/规则能力

## Building role

这一建筑类型容纳**城市级治理与公共基础能力**。其中 Codex-Boss 与普通“楼栋”不同：它是城市地皮、道路与公共运行层，其他治理项目则像市政机构。

## Buildings and rooms

### [Codex-Boss](https://github.com/zhiheng-zhang-Mera/Codex-Boss)

**Role:** city substrate + governance runtime.

**Rooms / capabilities**

- Runtime & Orchestration — 城市运行和能力编排。
- Identity & Root Trust — Owner、machine identity、root trust 与 authority boundary。
- Capability Fabric — 能力登记、发现、路由和组合。
- Architecture Observatory / Enforcement — 城市结构观测、规则与执行。
- Evidence & Admission — 证据、资格与进入生产城市的门禁。
- Policy & Permission — 城市政策和权限边界。
- Event / Data Fabric — 跨楼栋的公共道路基础。
- **Municipal Learning & Evolution** — 经验痕迹、熟练/融合、延迟巩固、学习提案和有界结构调整。

### [Boss-Qualification-Control](https://github.com/zhiheng-zhang-Mera/Boss-Qualification-Control)

**Rooms / capabilities**

- Qualification control.
- Acceptance criteria.
- Evidence-backed promotion gates.
- Cross-version/candidate qualification support.

### [General-Logic-Engine](https://github.com/zhiheng-zhang-Mera/General-Logic-Engine)

**Rooms / capabilities**

- General logic primitives.
- Rule evaluation.
- Reusable reasoning/decision support that should not be duplicated across domain buildings.

## Roads

- **Engineering Road** ↔ DS-Hns: construction, tests, repair and migration.
- **Evidence Road** ↔ qualification/research buildings.
- **Policy Road** ↔ every building that requests privileged actions.
- **Learning Road** ↔ residents and domain buildings producing reusable experience.
- **Recovery Road** ↔ Hns health/restart services.

## Boundary

Boss should not absorb domain applications merely because they need shared infrastructure. Health, finance, digital-persona, device and privacy logic remain in their own buildings unless a capability becomes genuinely city-wide.
