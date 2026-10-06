# MON-990 — Cross-Device Monitor Acceptance & Freeze

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../MON-990-cross-device-monitor-acceptance-and-freeze.md). This page translates explanatory body only; source workbook/report controls claims, state, SHA, CI, and gates.

## Objective

After MON-901/902/903 acceptance, independently reconcile and perform cross-device acceptance of the complete City Work Monitor, then freeze v1.

## Mandatory checks

1. Overview state ↔ canonical task state.
2. Node owner/host/model metadata ↔ runtime truth.
3. Edge reason ↔ real handoff/retry/review/routing event.
4. Decision receipt ↔ actual state transition.
5. Risk bubbling does not hide active failures.
6. Unrelated tasks continue when JEV/monitor is unavailable.
7. Decision timeout affects only the target task.
8. Capability Registry ↔ runtime/UI.
9. Reasonable parity between Web and the current Android surface.
10. Large graph collapse/filter/stable layout.
11. Normal diagnosis reaches exact evidence within 2–3 interactions.
12. No second task truth.

## Research closeout

Output `mission-book/reports/MON-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`, summarizing at least observation/projection latency, decision latency, auto-resolution distribution, Owner interruption, false-safe summary, monitor reality drift, blocking incidents, edge provenance completeness, reviewer falsification, and replay/ablation candidates.

## Terminal marker

`CITY_WORK_MONITOR_V1_ACCEPTED`

Record only after exact-head CI, opposite-host Review, runtime/UI reconciliation, Registry reconciliation, and paper-material indexing are all satisfied.
