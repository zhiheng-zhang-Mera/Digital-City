# REX-890 — Independent Reproducibility Study + V1 Freeze

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-890-reproducibility-study-and-freeze.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../../CONSTRUCTION_RULES.md) · [Async protocol](../../../../ASYNC_RELIEF_CONSTRUCTION.md) · [Research material](../../../../mission-group/research-strengthening/en/RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Development host runs a representative multi-device study first. Another physical host cannot merely read reports: reconstruct from artifact/manifest, execute independently, recompute key metrics, compare trace/provenance, identify discrepancies, and reproduce again after repair.

## Minimum study

Multi-device execution; one handoff/routing decision; one injected fault; recovery; repetitions; one replay; one ablation; artifact export.

## Final material

Generate `mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`, summarizing experiment/run counts, failure/exclusion counts, defect taxonomy, Review-only findings, reproducibility delta, measured metrics, unresolved limitations, potential paper directions.

## Final gate

Only successful opposite-host independent reproduction, exact-head CI green, and user exposure gate PASS permit `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`. Only then may the programme final integration workbook be created.

## Opposite-host review, 2026-10-08

Alien-GPT / Mera-Alianware independently reproduced the self-contained B package from clean exact head `0e63c2a0ca723f7d8d0b6ad41abff33bee2ea744`: exit 0, zero inconsistencies and evidence gaps, all six independent runs completed on Alien and Mech. Exact-head CI 37731833084 succeeded. Independent Web Advanced + CLI exposure review is complete; the Owner explicitly approved exposure PASS and closeout. The canonical workbook is COMPLETE and RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE is released. Programme final integration remains separate. See `mission-book/reports/REX-890/REVIEW_REPORT.md` and `EXPOSURE_REVIEW_ALIEN.md`.
