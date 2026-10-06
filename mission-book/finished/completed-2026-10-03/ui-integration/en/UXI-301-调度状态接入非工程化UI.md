> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../UXI-301-调度状态接入非工程化UI.md) 的原始 frontmatter 是唯一元数据来源。

# UXI-301 — Scheduling state in product-oriented UI

> Normative-body translation uses the readable Git 2a319ce version, not guessed recovery of the damaged current body. Current canonical-source frontmatter remains metadata authority; only reading links are updated for the archive location.

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). This workbook defines task-specific scope/dependency/acceptance only; persistent rules govern ordinary claims, waiting/wake, CI, independent two-host work and merging.

## Goal

Connect RS-290 frozen scheduling state through adapter/ViewModel to UI-190 product shell, making why slow/can switch/was transferred/where results are understandable without exposing scheduler internals again.

## Core presentation principles

Users first see:
- Current service is responding slowly. Switch to another available model?
- This service is unavailable in your region.
- Transferred to another device; you can remain here.
- Waiting for available resources.
- Remote connection interrupted; recovery underway, task failure not yet confirmed.

Only Advanced/Diagnostics exposes provider ID/device ID/routing reason/lease/correlation/provenance details.

## Allowed change boundary

Web/Android presentation adapters, ViewModel, user copy, existing design-system components, necessary UI tests.

## Prohibited change boundary

- No RS-290 contract change.
- UI does not independently recompute provider/device selection.
- Grey unavailable provider remains unclickable.
- Do not restore old dashboard/control-panel structures for presentation convenience.

## Construction steps

1. Unified adapter maps scheduler vocabulary to user language/allowed actions.
2. Web/Android share semantics, not necessarily exact pixels.
3. Provider-choice list may show unavailable items/reasons but must make them unselectable.
4. Remote handoff progress/result/attention displayed on current device.
5. Queue/degraded/offline copy understandable and non-alarming.
6. Technical details in expandable Advanced.
7. Drive UI with real concurrency/provider-unavailable/device-busy/remote-handoff E2E, rather than only static mocks.

## Independent review

Opposite host checks engineering-style regression, unilateral frontend choices, disabled/available consistency, actual user-choice delivery to backend, continued result reception on current device.

## Completion gates

- User language for major scheduler states.
- Unavailable provider visible and unselectable.
- Real switch/no-switch paths executable.
- Remote-handoff results return to current surface.
- Web/Android real acceptance and hosted CI green.
- No raw scheduler-field leakage by default.

## Binding persistent rules

Inherit [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md). In particular: Development and Review of one task use different physical hosts; waiting does not occupy a host; zero claims must be classified; WAITING_ELIGIBILITY prioritizes event wake with approximately 20-minute fallback rescans; external recovery requires reconciliation; CI/evidence bind exact head; no make-work or unilateral scope expansion.

## Reports / evolution

- City retains only bounded conclusions, SHAs, CI and exception summaries.
- Record scheduling conflicts, handoff, fallback and busy/unavailable samples in Utopia evolution evidence under PROCESS_DATA_POLICY.


> Provenance / 来源：历史规范body来自 Git `2a319cef54c524b33c1fc514be2f15748619bc3f` 的 `mission-book/ui-integration/UXI-301-调度状态接入非工程化UI.md`；current source frontmatter仍为authority。仅迁移reading链接，不修改损坏字节或历史事实。 / Only the historical normative body is carried; current frontmatter remains authority and reading links alone are relocated.
