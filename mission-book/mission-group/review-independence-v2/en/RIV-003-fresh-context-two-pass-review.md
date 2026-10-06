> English reading translation / 英文阅读译本. The [original document](../RIV-003-fresh-context-two-pass-review.md) remains authoritative. This reader grants no execution or migration authority.

# RIV-003 — Fresh-context Two-pass Review Protocol

> **PARKED / NOT ACTIVATED.**

## Objective
Evaluate whether strict fresh-context review reduces the risk of anchoring reviewers to the developer's narrative or choice of tests.

## Pass A — independent reconstruction
The reviewer initially receives only:
- Accepted requirements and acceptance criteria;
- The exact candidate head;
- Canonical product and runtime context;
- Necessary test entry points.

By default, do not first read the developer's conclusion-oriented review guide, explanatory defence, or answers describing what should be observed.

The reviewer independently develops:
- A test plan;
- Risk hypotheses;
- Observed findings;
- Missing evidence.

## Pass B — evidence reconciliation
Then make available:
- The Development Report;
- Developer tests and evidence;
- Known limitations;
- Repair history.

The reviewer reconciles Pass A and Pass B, recording which conclusions changed because of newly available explicit evidence.

## Boundaries
- Do not record hidden chain-of-thought;
- Fresh context does not mean complete amnesia: necessary safety and dependency facts must still be supplied;
- This protocol does not itself grant eligibility for same-host Formal Review;
- A failure in Pass A must not be silently overwritten by the author's narrative in Pass B.

## Completion gate
Clearly define the protocol, minimum context contract, reconciliation receipt, and measurable bias indicators.
