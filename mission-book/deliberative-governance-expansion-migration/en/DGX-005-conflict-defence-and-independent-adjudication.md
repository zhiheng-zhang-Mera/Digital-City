> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-005-conflict-defence-and-independent-adjudication.md)

```yaml
workbook_id: DGX-005
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 5
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
dependencies: ["DGX-002", "DGX-003", "DGX-004"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: []
capability_registry_action: UNASSESSED
capability_registry_refs: []
capability_registry_sync_status: UNASSESSED
research_evidence_applicability: UNASSESSED
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: STANDARD
state_identity_evidence: UNASSESSED
state_identity_evidence_refs: []
monitor_observability_evidence: UNASSESSED
monitor_observability_refs: []
decision_trace_evidence: UNASSESSED
decision_trace_refs: []
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
```

> **PARKED / NOT ACTIVATED.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
> **Anchor policy:** All baseline/dependency exact SHA anchors are intentionally empty. Only after explicit Owner activation may the then-current canonical truth be resolved to full SHAs and written atomically.

# DGX-005 — Conflict / Defence / Fresh-context Independent Adjudication

## Goal

Implement structured discovery of material conflicts, defence by both sides and independent third-party adjudication. Reduce the risk that earlier narratives anchor the adjudicator.

## Conflict taxonomy

Support at least FACT / METHOD / INTERPRETATION / EXECUTION / REQUIREMENT.

## Defence contract

Each party may submit:

```text
claim
supporting_evidence_refs
assumptions
critique_of_alternative
what_evidence_would_change_my_mind
confidence_if_available
```

Withdrawal, partial acceptance and merging are allowed. Do not force an Agent to defend its original proposal at all costs.

## Fresh-context two-pass adjudication

### Pass A — independent reconstruction

Initially supply the adjudicator with:

- Accepted requirement / question.
- Shared Fact Snapshot.
- Canonical evidence.
- A neutral conflict statement.

Do not yet supply the parties' lengthy defence/rebuttal.

The adjudicator independently reconstructs:

- Material facts.
- Missing evidence.
- Candidate interpretations.
- Provisional objections.
- Conditions requiring more evidence.

### Pass B — reconciliation

Then open the parties' defence/rebuttal, reconcile it with Pass A and form the final verdict.

Record:

```text
pass_a_findings
new_information_from_defence
changed_findings
unchanged_findings
final_verdict
evidence_refs
```

Do not record hidden chain-of-thought.

## Adjudicator independence

The adjudicator must not have participated in the original implementation of the disputed portion. Prioritize evidence, not reputation or vote count. DGX-003 declares and validates the independence profile.

Minimum verdicts:

`A_ACCEPTED / B_ACCEPTED / MERGED / BOTH_REJECTED / MORE_EVIDENCE_REQUIRED / OWNER_REQUIRED`.

## Boundary

This two-pass protocol is an independence mechanism for governance adjudication. It does not automatically replace Engineering Formal Review. Formal code/product Review remains governed by current domain rules.

## Completion gate

No silent conflict overwrite; traceable adjudication provenance; demonstrable Pass A / Pass B information boundaries; no fabricated certainty when evidence is missing.
