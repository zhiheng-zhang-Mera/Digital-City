> English reading translation / 英文阅读译本. The [original document](../SUSPEND-003-same-host-formal-review-substitution.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# SUSPEND-003 — Same-host Fresh Critic as Formal Review Substitute

**State:** PRESERVE_ONLY / CURRENTLY_FORBIDDEN_AS_FORMAL_REVIEW

## Research hypothesis that must be preserved
On the same physical host, using:
- Independent agents or sessions;
- A fresh-context first pass;
- Different models or review strategies;
- Independent test generation;
- Structured evidence reconciliation;

may provide strong cognitive independence for some defects.

It is worth researching in the future whether, for certain task categories, this cognitive independence can achieve assurance equivalent to cross-host Review, or provide clear value as an additional review layer.

## Why it is currently suspended
Current `CONSTRUCTION_RULES.md §3` explicitly requires:

```text
Development + Formal Review
→ different physical hosts
```

It also explicitly states that a same-host fresh critic may perform technical diagnosis only and cannot stand in for Formal Review.

Therefore, currently:
- Same-host critic = ALLOWED diagnostic;
- Same-host critic = NOT Formal Review;
- The existence of DGX/RIV files must not be used to upgrade eligibility unilaterally.

## Only legitimate path to lifting suspension
Refer this to [Review Independence v2](../../review-independence-v2/README.md) for controlled evaluation.

The current threshold may change only after RIV-990 obtains sufficient evidence, produces an explicit `CONSTRUCTION_RULES.md` migration patch, and receives Owner approval.

Until then, this document is only a hypothesis and evidence-preservation note.
