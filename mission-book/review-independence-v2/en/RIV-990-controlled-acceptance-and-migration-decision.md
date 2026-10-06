> English reading translation / 英文阅读译本. The [original document](../RIV-990-controlled-acceptance-and-migration-decision.md) remains authoritative. This reader grants no execution or migration authority.

# RIV-990 — Controlled Acceptance + Migration Decision

> **PARKED / NOT ACTIVATED.**

## Objective
Before actually changing review rules, use falsifiable evidence to determine whether a multidimensional profile can safely replace or strengthen the existing opposite-host threshold.

## Minimum acceptance
The comparison must cover at least:
1. The current opposite-host Formal Review baseline;
2. Same-host fresh critic (a diagnostic comparison, without assuming promotion is possible);
3. Different-agent / same-host;
4. Different-host / similar model;
5. Environment-diverse review;
6. High-risk and ordinary cases;
7. Developer-report-before versus fresh-context-first;
8. Historical replay plus new controlled cases.

Examine:
- Defect discovery;
- Environment-specific defects;
- False assurance;
- Evidence independence;
- Time and resource overhead;
- Owner intervention;
- Review disagreement and reversal.

## Migration gate
The current Formal Review gate may change only when all of the following hold:
- Candidate new rules provide at least the current assurance;
- Risk boundaries are clear;
- Fallback and unknown semantics are explicit;
- An explicit migration patch exists for `CONSTRUCTION_RULES.md`;
- The Owner explicitly approves.

Otherwise the terminal outcome may be:

`RIV_EVALUATED_KEEP_CURRENT_OPPOSITE_HOST_RULE`

This also counts as a successful research or design conclusion.

## Candidate success marker
`REVIEW_INDEPENDENCE_V2_ACCEPTED_FOR_EXPLICIT_MIGRATION`

This marker still does not automatically modify construction rules.
