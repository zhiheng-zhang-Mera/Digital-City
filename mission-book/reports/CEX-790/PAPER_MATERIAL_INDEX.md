# CEX-790 paper material index

Audit material: the difference between an entry inventory rebuilt from code and a registry that was believed to
describe it. No performance or novelty conclusion is drawn from performing an audit.

- Machine-readable inventory: `utopia:evidence/raw/mission-book/CEX-790/capability-inventory.json` — 145 items across
  the ten sources the workbook names, each with its class and the rule that produced it.
- Human matrix and curated exceptions: `utopia:evidence/raw/mission-book/CEX-790/CAPABILITY_ENTRY_INVENTORY.md` —
  eleven gap candidates curated line by line (5 REGISTRY_GAP, 2 PARITY_GAP, 3 FALSE_POSITIVE, 1 BY_DESIGN).
- Union baseline construction and its validation: `mission-book/reports/CEX-790/CLAIM_RECORD.md` — a five-head union
  that no automated merge could produce, validated by 12 task tests, 154 regression tests, the bilingual gate and an
  Android build (18 suites / 97 tests / 0 failures).
- Registry reconciliation: `CAP-WORKER-POOL-AGENT-001` reconciled from a stale pending-review claim to
  `FORMAL_REVIEW_RECONCILED`; `CAP-CAPABILITY-BRIDGE-001` created for the user-reachable surface that no record named;
  `CAPABILITY_INDEX.yaml` and the previously empty `SURFACE_INDEX.yaml` regenerated; both language versions of
  `CAPABILITY_EXPOSURE_MATRIX` populated from an empty template into a 12-row table.
- Instrument failures retained, because they are the reusable finding: the classifier first read the registry from the
  implementation repo instead of the control plane (eleven registered capabilities looked unregistered) and lost the
  `/api/v0/` prefix from route patterns; two drafts of the union resolution dropped a function while editing a
  conflict block, which the per-task symbol check caught.
- Programme synthesis: `mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md`.
- Unknowns kept unknown: the audit read code and contracts, not user surfaces, so every backfilled record keeps
  `intent_validation_status: NOT_TESTED`; no user surface was driven, and no device was used, by CEX-790.
- Chronology: the union baseline is not `main`, none of the five dependency heads is merged, and no workbook grants
  merge authority. `CAPABILITY_ENTRY_BASELINE_AUDITED` is a review outcome and remains unreleased by development.

语言配对 / Language pair: [English](./PAPER_MATERIAL_INDEX.md) · [中文](./zh-CN/PAPER_MATERIAL_INDEX.md)
