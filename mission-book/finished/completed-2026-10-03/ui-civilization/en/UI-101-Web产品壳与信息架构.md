> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../UI-101-Web产品壳与信息架构.md) 的原始 frontmatter 是唯一元数据来源。

# UI-101 — Web product shell and information architecture

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). This workbook defines task-specific scope/dependency/acceptance only; persistent rules govern ordinary claims, waiting/wake, CI, independent two-host work and merging.

## Goal

Turn apps/web/** from fixed sidebar/dashboard cards/operator console into a personal universal-terminal Web shell following selected visuals.

### Mandatory UI rules

- Ordinary user interfaces must depart from dashboard/admin/terminal/developer-console appearance.
- Internal module names, IDs, routes, backendRef, provenance, schema/version and runtime paths collapse into Advanced information / Runtime details by default.
- Do not substitute stacks of uniform rounded cards for information architecture.
- Do not use ASCII/Unicode geometric symbols as the formal icon system.
- Do not migrate Web/Rooms to React/Vite/shadcn; Android stays Compose Material 3.
- Do not change existing Gateway / Action / Ask / Task / Room API / Scheduler semantics.
- Hns may autonomously download/install/replace UI/UX, Compose, browser, screenshot-comparison, accessibility and Agent Skill plugins. Plugins belong to construction tooling by default; record source/ref in reports. Do not upload secrets or make unknown plugins production runtime dependencies.

## Allowed change boundary

apps/web/** HTML/CSS/JS presentation, i18n, frontend-only UI tests. Presentation adapters if necessary, without gateway-contract changes.

## Prohibited change boundary

No services/**, contracts/**, scheduler/provider/runtime semantic changes; do not change backend responses for UI convenience.

## Construction steps

1. Primary navigation Home / Ask·Do / Tools / Devices / Activity; demote Settings/Advanced/Diagnostics.
2. Remove engineering titles WORKSPACE / ALIEN and CONTROL SURFACE from default product surface.
3. Home centers what can be done now/what is happening, rather than statistics cards.
4. Ask/Do is primary natural-language entry with clear working/needs-choice/unavailable/complete.
5. Collapse Action backendRef/provenance/raw record by default.
6. Preserve every reachable capability; beautification removes none.
7. Reusable Web design tokens/components, not page-by-page CSS patches.
8. Real browser desktop/narrow screens; screenshots Home/Ask/Tools/Action detail advanced at minimum.

## Independent review

Opposite host uses real browser for information hierarchy, keyboard/focus, narrow screen, error/offline/long text and admin-console appearance; directly repairs in-scope defects.

## Completion gates

- All old function paths reachable.
- Product-oriented primary navigation.
- Raw technical details hidden by default, expandable.
- No dominant dashboard/card stack.
- Browser acceptance/repo tests/hosted CI green.
- Visuals match UI-000 Owner choice.

## Binding persistent rules

Inherit [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md). In particular: Development and Review of one task use different physical hosts; waiting does not occupy a host; zero claims must be classified; WAITING_ELIGIBILITY prioritizes event wake with approximately 20-minute fallback rescans; external recovery requires reconciliation; CI/evidence bind exact head; no make-work or unilateral scope expansion.

## Reports / evolution

- City writes only bounded DEVELOPMENT_REPORT / REVIEW_REPORT.
- Raw screenshots, browser traces, Android physical-device evidence and failed retries remain in Utopia runtime/evidence; research-relevant structured events enter evolution under PROCESS_DATA_POLICY.
