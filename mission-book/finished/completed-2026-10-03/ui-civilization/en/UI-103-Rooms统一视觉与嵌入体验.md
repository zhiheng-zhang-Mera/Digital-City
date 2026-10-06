> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../UI-103-Rooms统一视觉与嵌入体验.md) 的原始 frontmatter 是唯一元数据来源。

# UI-103 — Unified Rooms visuals and embedding

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). This workbook defines task-specific scope/dependency/acceptance only; persistent rules govern ordinary claims, waiting/wake, CI, independent two-host work and merging.

## Goal

Make Room Hub and ten Rooms feel part of Utopia, rather than suddenly embedding black/cyan local developer tools.

### Mandatory UI rules

- Ordinary user interfaces must depart from dashboard/admin/terminal/developer-console appearance.
- Internal module names, IDs, routes, backendRef, provenance, schema/version and runtime paths collapse into Advanced information / Runtime details by default.
- Do not substitute stacks of uniform rounded cards for information architecture.
- Do not use ASCII/Unicode geometric symbols as the formal icon system.
- Do not migrate Web/Rooms to React/Vite/shadcn; Android stays Compose Material 3.
- Do not change existing Gateway / Action / Ask / Task / Room API / Scheduler semantics.
- Hns may autonomously download/install/replace UI/UX, Compose, browser, screenshot-comparison, accessibility and Agent Skill plugins. Plugins belong to construction tooling by default; record source/ref in reports. Do not upload secrets or make unknown plugins production runtime dependencies.

## Allowed change boundary

apps/rooms/** presentation: Hub shell, shared CSS/tokens, client UI markup. Room API/store/data semantics unchanged.

## Prohibited change boundary

- No Room persistence/API change.
- No separate CSS copy for every Room.
- LOCAL · 127.0.0.1/runtime file paths not default product information.
- No frontend framework for Web alignment.

## Construction steps

1. Rooms tokens follow UI-000 visual direction.
2. Hub navigation/titles/status/content align with main Utopia.
3. High-quality Knowledge Room pilot, then shared primitives spread to remaining Rooms.
4. Preserve individual Room task character, not identical cards everywhere.
5. Reduce product discontinuity in Web iframe; standalone tab remains complete.
6. Local/debug information in Advanced/Diagnostics.
7. Real-browser coverage of Knowledge, Checklist, Data Lab and Focus at minimum.

## Independent review

Opposite host checks shared styles for regressions across Rooms, long lists/tables/textarea, light/dark backgrounds, iframe scroll, discoverable yet unobtrusive local-only safety notices.

## Completion gates

- Hub matches Web/Android visual language.
- Four representative Room types lack serious regression.
- Ten Room basic tests green.
- Ordinary interface no longer developer-tool style.
- Hosted CI/Room tests green.

## Binding persistent rules

Inherit [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md). In particular: Development and Review of one task use different physical hosts; waiting does not occupy a host; zero claims must be classified; WAITING_ELIGIBILITY prioritizes event wake with approximately 20-minute fallback rescans; external recovery requires reconciliation; CI/evidence bind exact head; no make-work or unilateral scope expansion.

## Reports / evolution

- City writes only bounded DEVELOPMENT_REPORT / REVIEW_REPORT.
- Raw screenshots, browser traces, Android physical-device evidence and failed retries remain in Utopia runtime/evidence; research-relevant structured events enter evolution under PROCESS_DATA_POLICY.
