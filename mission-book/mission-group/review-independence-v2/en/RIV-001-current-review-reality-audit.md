> English reading translation / 英文阅读译本. The [original document](../RIV-001-current-review-reality-audit.md) remains authoritative. This reader grants no execution or migration authority.

# RIV-001 — Current Review Reality Audit

> **PARKED / NOT ACTIVATED.** Records only a future audit design; do not change current Formal Review rules.

## Objective
Establish a factual baseline for the current review mechanism, without assuming that an opposite host is always optimal or that a same-host fresh critic is sufficient.

## Audit scope
- The current hard threshold in `CONSTRUCTION_RULES.md §3`;
- Actual roles of Alien, Mech, hosted CI, and the local critic;
- Authorship, host, session, model, and toolchain independence between Development and Formal Review;
- Historical review findings, false negatives, and environment-specific defects;
- Actual value and boundaries of the same-host critic as a diagnostic tool today.

## Outputs
```text
review_mode
independence_dimensions_observed
defects_found
defects_missed
environment_specific_findings
evidence_lineage
owner_intervention
known_confounders
```

## Prohibitions
- Claiming from individual historical examples that an independence dimension can replace opposite-host review;
- Changing an ongoing review to collect data;
- Treating hosted CI as a second physical host.

## Completion gate
Produce a bounded map of reality that RIV-002 can use to define assurance profiles; do not modify the product or construction rules.
