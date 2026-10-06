> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../UI-102-Android产品壳与信息架构.md) 的原始 frontmatter 是唯一元数据来源。

# UI-102 — Android product shell and information architecture

> Normative-body translation uses the readable Git 2a319ce version, not guessed recovery of the damaged current body. Current canonical-source frontmatter remains metadata authority; only reading links are updated for the archive location.

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). This workbook defines task-specific scope/dependency/acceptance only; persistent rules govern ordinary claims, waiting/wake, CI, independent two-host work and merging.

## Goal

Replace current nine-entry NavigationBar + universal Panel + Text list with a real mobile personal terminal; retain Kotlin/Compose/Material 3.

### Mandatory UI rules

- Ordinary user interfaces must depart from dashboard/admin/terminal/developer-console appearance.
- Internal module names, IDs, routes, backendRef, provenance, schema/version and runtime paths collapse into Advanced information / Runtime details by default.
- Do not substitute stacks of uniform rounded cards for information architecture.
- Do not use ASCII/Unicode geometric symbols as the formal icon system.
- Do not migrate Web/Rooms to React/Vite/shadcn; Android stays Compose Material 3.
- Do not change existing Gateway / Action / Ask / Task / Room API / Scheduler semantics.
- Hns may autonomously download/install/replace UI/UX, Compose, browser, screenshot-comparison, accessibility and Agent Skill plugins. Plugins belong to construction tooling by default; record source/ref in reports. Do not upload secrets or make unknown plugins production runtime dependencies.

## Allowed change boundary

apps/android/** Compose presentation/theme/icons/resources/UI state adapters/UI tests. CityClient/DTO may organize reads for presentation adapters without semantic changes.

## Prohibited change boundary

- No gateway-behavior change.
- No client rederivation of status/route.
- No new cross-platform framework.
- Do not remove Rooms/Actions/Services/Tasks entries for design.

## Construction steps

1. Reduce nine bottom entries to 3–5 mobile primary entries; advanced functions go to secondary/overflow/details.
2. Real Utopia MaterialTheme: ColorScheme/Typography/Shapes/Spacing/Icon language.
3. Replace universal Panel syntax with few semantic components: hero/tool row/activity row/status chip/device surface/technical details.
4. Prioritize Home/Ask/Tools; clear Devices/Activity entries.
5. Action/Ask engineering fields default to expandable technical details.
6. Cover loading/offline/unavailable/confirmation/ambiguity/success/failure.
7. Android Studio + at least one physical Android for portrait acceptance; check common narrow widths/font scaling.

## Independent review

Opposite host attacks bottom-bar overflow, crowded text, touch targets, IME, rotation/recomposition state, default Material-template appearance, duplicate information, long-ID leakage, real-device legibility.

## Completion gates

- Ordinary users no longer face nine primary entries.
- Main action obvious on phone.
- Compose theme/component hierarchy established.
- Real-device screenshots free of engineering-console style.
- Android unit/build and hosted CI green.
- Function/state truth consistent with Web.

## Binding persistent rules

Inherit [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md). In particular: Development and Review of one task use different physical hosts; waiting does not occupy a host; zero claims must be classified; WAITING_ELIGIBILITY prioritizes event wake with approximately 20-minute fallback rescans; external recovery requires reconciliation; CI/evidence bind exact head; no make-work or unilateral scope expansion.

## Reports / evolution

- City writes only bounded DEVELOPMENT_REPORT / REVIEW_REPORT.
- Raw screenshots, browser traces, Android physical-device evidence and failed retries remain in Utopia runtime/evidence; research-relevant structured events enter evolution under PROCESS_DATA_POLICY.


> Provenance / 来源：历史规范正文来自 Git `2a319cef54c524b33c1fc514be2f15748619bc3f` 的 `mission-book/ui-civilization/UI-102-Android产品壳与信息架构.md`。仅承载该历史 body；当前 canonical source frontmatter 为 metadata authority。原链接只按当前 finished 归档目录迁移，不改变规则或历史事实。 / This reading copy carries only that historical normative body. Current canonical frontmatter remains metadata authority. Reading links are relocated for the current finished archive, without changing rules or historical facts.
