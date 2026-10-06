> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../UI-190-跨端视觉审查与UI基线冻结.md) 的原始 frontmatter 是唯一元数据来源。

# UI-190 — Cross-surface visual review and UI baseline freeze

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). This workbook defines task-specific scope/dependency/acceptance only; persistent rules govern ordinary claims, waiting/wake, CI, independent two-host work and merging.

## Goal

Integrate UI-101/102/103, perform independent cross-surface UI Critic loops/function regression/phase freeze. Freeze product shell + information architecture + design system, rather than final scheduling interaction.

### Mandatory UI rules

- Ordinary user interfaces must depart from dashboard/admin/terminal/developer-console appearance.
- Internal module names, IDs, routes, backendRef, provenance, schema/version and runtime paths collapse into Advanced information / Runtime details by default.
- Do not substitute stacks of uniform rounded cards for information architecture.
- Do not use ASCII/Unicode geometric symbols as the formal icon system.
- Do not migrate Web/Rooms to React/Vite/shadcn; Android stays Compose Material 3.
- Do not change existing Gateway / Action / Ask / Task / Room API / Scheduler semantics.
- Hns may autonomously download/install/replace UI/UX, Compose, browser, screenshot-comparison, accessibility and Agent Skill plugins. Plugins belong to construction tooling by default; record source/ref in reports. Do not upload secrets or make unknown plugins production runtime dependencies.

## Construction steps

1. Integration branch from latest Utopia main then; merge three reviewed UI branches with explicit union of function/presentation in conflicts.
2. Unified tokens, terms, icons, state colors, spacing; Web/Android/Rooms must not become three brands.
3. At least two screenshot → independent critic → automatic repair → screenshot rounds. Same context cannot both assign final visual score and unconditionally accept its implementation.
4. Critic checks dashboard feel, card stacking, technical-term leakage, primary-navigation overload, unclear primary action, cross-surface discontinuity, mobile crowding, accessibility.
5. Regress reachability of Ask/Action/Rooms/Devices/Services/Tasks/Activity/Pairing/Settings.
6. Real Web browser, physical Android, representative Room screenshots.
7. Only after critic passes deliver concise visual package; Owner may give directional attractive/unattractive judgment. Phase does not generally require final 100% visual polishing.
8. After pass merge Utopia main, record exact SHA/CI, set UI_BASELINE_FROZEN, automatically unlock RS-201/202.

## Completion gates

- UI-101..103 Development+Review complete.
- At least two independent visual repair rounds.
- All key old functions reachable.
- Unified Web/Android/Rooms design contract.
- Repo/Android/Rooms/relevant CI green.
- Main merge and main CI green.
- UI_BASELINE_FROZEN.

## Binding persistent rules

Inherit [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md). In particular: Development and Review of one task use different physical hosts; waiting does not occupy a host; zero claims must be classified; WAITING_ELIGIBILITY prioritizes event wake with approximately 20-minute fallback rescans; external recovery requires reconciliation; CI/evidence bind exact head; no make-work or unilateral scope expansion.

## Reports / evolution

- City writes only bounded DEVELOPMENT_REPORT / REVIEW_REPORT.
- Raw screenshots, browser traces, Android physical-device evidence and failed retries remain in Utopia runtime/evidence; research-relevant structured events enter evolution under PROCESS_DATA_POLICY.
