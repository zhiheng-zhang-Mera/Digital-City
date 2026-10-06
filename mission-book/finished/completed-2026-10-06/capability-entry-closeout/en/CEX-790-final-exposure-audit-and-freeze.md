# CEX-790 — Final Backend → Web/Android entry audit and freeze

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../CEX-790-final-exposure-audit-and-freeze.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../../CONSTRUCTION_RULES.md) · [Paper material](PAPER_EVIDENCE_PROTOCOL.md) · [Capability Registry](../../../../../capability-registry/README.md)

## Objective

After five entry tasks complete, **rebuild full inventory from latest code**, avoiding new hidden endpoints added while known gaps were repaired.

## Audit method

Build machine-readable/inspectable matrix from Gateway user-facing routes, Action routes/operations, Ask targets, Room catalog, capability registry, Web clickable entries, Android clickable entries, Settings/recovery lifecycle, scheduler user actions, and City capability-registry existing records/pending legacy backfill. Classify every item:

```text
EXPOSED
EXPOSED_ADVANCED
PARITY_GAP
CURRENT_ENTRY_GAP
INTERNAL_PROTOCOL
INTERNAL_TRANSPORT
FUTURE_PRODUCT_INTEGRATION
DEPRECATED
```

## Gate

Not every endpoint needs a button. Every **mature user-semantic** capability needs normal entry, first-class parity consistent with positioning, unavailable explanation, correct destructive/mutating confirmation/authority, and no future/infrastructure false affordances.

## Formal Review

Independently rebuild from code, not only check author matrix. Diff both inventories; classify every difference: missed route, internal route wrongly exposed, surface-only feature, deprecated, future seam, genuine defect.

## Capability Registry bootstrap / reconciliation

For final exact-head-verified semantic capabilities: assign/confirm stable CAP-<DOMAIN>-<NNN>; write capability-registry/records/*.yaml; update CAPABILITY_INDEX.yaml and applicable SURFACE_INDEX.yaml; generate/refresh bilingual exposure matrix; bind each verified record to exact implementation SHA plus UI/E2E evidence.

Reviewer independently samples/rebuilds actual code/surfaces and checks Registry claim↔exact implementation↔user surface↔backend wiring↔intent semantics. Never mechanically copy old CAPABILITY_ENTRY_MATRIX.md as verified records.

## Programme-level paper synthesis

Generate `mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md`: hidden-capability count, gap taxonomy, Web/Android parity count, Development versus Review defects, failures/repairs, before/after user steps, API→UI dropped fields, scheduler semantic conflicts, physical findings, exact CI/test counts.

## Completion gate

Latest-code complete inventory; independent inventories reconciled; no unclassified user-facing backend ability; future backlog updated; Registry backfill/reconciliation for all verified final-audit capabilities; no CAPABILITY_REGISTRY_STALE or CAPABILITY_REGISTRY_REALITY_MISMATCH; refreshed bilingual exposure matrix; complete PAPER_MATERIAL_SYNTHESIS; exact-head CI; CAPABILITY_ENTRY_BASELINE_AUDITED marker. Only then create programme final integration workbook.
