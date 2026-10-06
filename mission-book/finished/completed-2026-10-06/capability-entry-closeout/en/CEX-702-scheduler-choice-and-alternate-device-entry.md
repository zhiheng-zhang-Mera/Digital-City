# CEX-702 — Scheduler user choice: decline service switch → another device

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../CEX-702-scheduler-choice-and-alternate-device-entry.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../../CONSTRUCTION_RULES.md) · [Paper material](PAPER_EVIDENCE_PROTOCOL.md)

## Objective

Make the existing backend `POST /api/v0/tasks/:id/switch-declined → userDeclinedSwitch → RS-202 ALTERNATE_DEVICE → handoff` a visible, understandable, clickable decision.

## User semantics

When scheduler genuinely has a service/provider switch decision, UI can offer Use another service/provider; Keep this service and try another device; Keep waiting; Cancel. Never replace switch-declined semantics with generic CONFIRM.

## Required implementation

### Web

Explicit alternate-device action calling existing switch-declined; subsequent REMOTE_HANDOFF display; no semantically conflicting alternate-device button for strict-target tasks; clear provider-choice/alternate-device/wait distinctions.

### Android

Same scheduler truth as Web, equivalent decision, no local routing recomputation.

## Generic CONFIRM

Remain honest-unwired unless an existing canonical backend route is discovered during construction and Formal Review proves identical semantics. Never invent routes merely to eliminate disabled buttons.

## Formal Review

Independently prove provider choice; declined switch→alternate device; strict-target refusal; no alternate available; stale/offline candidates; duplicate clicks; handoff result returning to original surface; Web/Android state consistency.

## Mandatory paper material

Record why existing backend lacked UI entry; presentation/executable-route differences; decision taxonomy; route/strict-target conflicts; handoff latency; before/after user steps; Review-discovered wrong mappings; test/CI/runtime failures.

## Completion gate

Normal-UI alternate-device decision; canonical backend record; Web and Android observe handoff; generic CONFIRM not miswired; opposite-host Review/exact-head CI; PAPER_MATERIAL_INDEX; ALTERNATE_DEVICE_USER_CHOICE_EXPOSED marker.

## Review conclusion (Mech, opposite physical host)

Formal Review PASS: `mission-book/reports/CEX-702/REVIEW_REPORT.md`. Ten independent probes cover all specified paths; two use real browsers, one captures actual request body. Author tests rerun unchanged. One LOW and four informational findings recorded, all nonblocking (the detailed F5 entry is itself labeled LOW in the source): F1 LOW paper-material: required latency was NOT_OBSERVABLE despite measurable author fixture; reviewer measured HTTP decline 12ms, click→handoff 13ms, click→result 598ms, canonical event-derived decline→handoff 4ms, limited to one physical Windows controlled fixture, not performance claims. F2 informational UXI-391 presentation.mjs comment denies per-node disable state despite adjacent correct sharingEnabled use; rationale stale. F3 informational unresolved-service labels differ: Web candidate ref versus Android Service. F4 informational Android in-flight protection clears only in fenced callback; client close could permanently disable controls, source inspection only, not reproduced. F5 LOW control-plane: sixteen absent template fields including all exposure/capability fields backfilled from CAP-SCHEDULER-CHOICE-001. Five prose watchlist classes mapped unambiguously to RS IDs; G2 ordinary bugfix left unmapped rather than inventing ID. candidateFromNode now reads canonical sharing flags already enforced by claim, closing and measuring presentation/execution mismatch in both directions.
