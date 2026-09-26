# Government — 市政厅与治理建筑

## Direct repository links

- **[Codex-Boss](https://github.com/zhiheng-zhang-Mera/Codex-Boss)** — 城市地基、运行时与治理底层
- **[Boss-Qualification-Control](https://github.com/zhiheng-zhang-Mera/Boss-Qualification-Control)** — 城市级资格与验收控制
- **[General-Logic-Engine](https://github.com/zhiheng-zhang-Mera/General-Logic-Engine)** — 可复用逻辑/规则能力

## Planned buildings — project not created

- **[Customs Security / 海关安检](./Customs-Security/)** — `PROJECT_NOT_CREATED`; future admission-only extension check.
- **[Runtime Compliance / Public Security / 公安与运行时合规](./Public-Security/)** — `PROJECT_NOT_CREATED`; future city-wide hard-boundary enforcement.

## Building role

这一建筑类型容纳**城市级治理与公共基础能力**。其中 Codex-Boss 与普通“楼栋”不同：它是城市地皮、道路与公共运行层，其他治理项目则像市政机构。

政府域只拥有真正的城市级规则。Research、Medical、Engineering 等领域规则默认留在各自 Domain Charter，不得因为“政府”这一比喻自动扩大作用域。

## Buildings and rooms

### [Codex-Boss](https://github.com/zhiheng-zhang-Mera/Codex-Boss)

**Role:** city substrate + governance runtime.

**Rooms / capabilities**

- Runtime & Orchestration — 城市运行和能力编排。
- Identity & Root Trust — Owner、machine identity、root trust 与 authority boundary。
- Capability Fabric — 能力登记、发现、路由和组合。
- Architecture Boundary — 城市结构与跨域硬边界。
- Evidence / Audit Primitive — 最小证据和审计能力。
- Policy & Permission Scope — 城市级权限与作用域边界。
- Event / Data Fabric — 跨楼栋的公共道路基础。
- Extension Lifecycle Boundary — future admission/enable/disable/uninstall contract.

Research-specific delayed learning、familiarity/fusion、dynamic association 等机制不自动属于 Boss Core；在证明为跨域公共能力前，它们留在 Research domain。

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

## Planned government facilities

### Customs Security / 海关安检

See [Customs-Security/README.md](./Customs-Security/README.md).

Conceptual action: **ADMIT**. It checks whether a new building/extension may safely enter. It is not intended to become a permanent business-logic supervisor.

### Runtime Compliance / Public Security / 公安与运行时合规

See [Public-Security/README.md](./Public-Security/README.md).

Conceptual action: **ENFORCE**. It checks city-wide hard boundaries at runtime, but it does not enforce Research/Medical/Engineering business rules unless those rules are explicitly promoted into city-wide scope.

## Roads

- **Engineering Road** ↔ DS-Hns: construction, tests, repair and migration.
- **Evidence Road** ↔ qualification/research buildings.
- **Policy Road** ↔ buildings requesting privileged or cross-domain actions.
- **Recovery Road** ↔ Hns health/restart services.
- **Admission Road** ↔ future extension lifecycle / Customs Security.

## Boundary

Boss should not absorb domain applications merely because they need shared infrastructure. Health, finance, digital-persona, device, privacy, research-methodology and entertainment logic remain in their own buildings unless a capability becomes genuinely city-wide.

Government enforcement is limited by policy scope: city-wide police cannot use one domain's charter to govern unrelated domains.
