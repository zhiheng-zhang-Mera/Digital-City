> English reading translation / 英文阅读译本. The [original document](../RIV-004-capability-based-reviewer-selection.md) remains authoritative. This reader grants no execution or migration authority.

# RIV-004 — Capability-based Reviewer Selection & Scheduler Contract

> **PARKED / NOT ACTIVATED.**

## Objective
Define the eligibility and scheduling contract for a future Reviewer Pool: tasks declare assurance requirements and the scheduler selects from eligible candidates, rather than permanently hard-coding reviewer names.

## Inputs
```text
task/domain/risk
required_review_capabilities
required_independence_profile
candidate reviewer facts
host/environment/tool availability
conflict/recusal facts
```

## Outputs
```text
eligible_candidates
selected_reviewer
selection_basis
unmet_independence_dimensions
fallback
escalation
```

## Rules
- Eligibility precedes ranking;
- Capability fit cannot compensate for a missing hard independence requirement;
- If no candidate is currently eligible, report WAITING_ELIGIBILITY honestly; do not self-sign on the same host;
- The future scheduler consumes only canonical Capability/History truth, without duplicating the registry;
- Selection failure must not freeze tasks unrelated to that review.

## Completion gate
Produce a contract that can integrate with Foreman and the Capability Registry; leave the current §3 unchanged.
