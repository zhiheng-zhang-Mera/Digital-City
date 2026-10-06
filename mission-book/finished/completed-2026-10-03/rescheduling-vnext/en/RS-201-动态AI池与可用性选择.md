> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../RS-201-动态AI池与可用性选择.md) 的原始 frontmatter 是唯一元数据来源。

# RS-201 — Dynamic AI pool and availability selection

> [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Process data policy](../../../../PROCESS_DATA_POLICY.md). This workbook defines task-specific scope/dependency/acceptance only; persistent rules govern ordinary claims, waiting/wake, CI, independent two-host work and merging.

## Goal

Expand General AI Gateway provider/model/account from fixed two-option thinking to a dynamic pool, supporting user configuration, regional availability, account/session availability and explicit switch selection.

## Dependencies

Unlock only after UI-190 produces UI_BASELINE_FROZEN. Claim baseline from latest Utopia main at that time.

## Core semantics

- Provider/model counts and device counts vary dynamically.
- May retain default basic providers needing no regional special case; users can add/remove optional providers.
- Region-restricted providers such as Claude/Gemini may remain in registry but must be explicitly UNAVAILABLE and unselectable when unavailable.
- Availability distinguishes usable, region unsupported, logged out/missing credential, invalid session, service fault, user disabled and unknown at minimum.
- Switch suggestion and automatic switching are separate; preserve explicit user choice before budget/service switching.
- UI consumes stable state only; this task cannot add final pages.

## Allowed change boundary

General AI registry/provider/session/availability contracts and corresponding runtime/adapters/tests; stable presentation DTO/port may be added without binding a UI framework.

## Prohibited change boundary

- No UI design-system change.
- No provider hard-coded as permanent sole fallback.
- No fabricated regional support/login state.
- Do not permanently remove a provider from registry because it is unavailable.

## Construction steps

1. Audit merged GAI-002/003/004/005; identify registry/runtime seams.
2. Establish dynamic provider/model/account records and user enable/disable semantics.
3. Lifecycle-aware availability probe/cache prevents stale availability posing as current truth.
4. Stable output: candidate list + unselectable reasons + user confirmation.
5. Cover add/remove/disable/recover, region unsupported, expired login, temporary fault, empty fallback candidates.
6. Availability probes cannot block all Ask/Do main flow; slow probes are bounded/degraded.

## Independent review

Opposite host attacks stale region/session, dangling references after provider deletion, availability flap, unknown misread as available, disabled provider still scheduled, bypassed selection confirmation.

## Completion gates

- Dynamic pool exceeds fixed two-option choice.
- Unavailable provider remains explainable and unselectable.
- Tests cover user add/remove/enable/disable.
- Tests cover availability lifecycle/failure degradation.
- Hosted CI all green.
- No final UI design.

## Binding persistent rules

Inherit [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md). In particular: Development and Review of one task use different physical hosts; waiting does not occupy a host; zero claims must be classified; WAITING_ELIGIBILITY prioritizes event wake with approximately 20-minute fallback rescans; external recovery requires reconciliation; CI/evidence bind exact head; no make-work or unilateral scope expansion.

## Reports / evolution

- City retains only bounded conclusions, SHAs, CI and exception summaries.
- Record scheduling conflict, handoff, fallback and busy/unavailable samples in Utopia evolution evidence under PROCESS_DATA_POLICY.
