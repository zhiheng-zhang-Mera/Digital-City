> Current state: Owner activated execution on Alien-GPT-DGX; no main merge. Formal Review and PCF-726 integration remain pending. Original design constraints below still apply.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-005-conflict-defence-and-independent-adjudication.md)

```yaml
workbook_id: DGX-005
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 5
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: d9d2750168050d0b4a91ae4ab192e2048b77fae0
baseline_resolution_evidence: mission-book/reports/DGX/DGX-005.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-002", "DGX-003", "DGX-004"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 99c5d36a402422ad2b9100648d1ccd443ce25503
development_ci: {"head_sha":"99c5d36a402422ad2b9100648d1ccd443ce25503","run_id":37574261361,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37574261361"}
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: PARTIAL
ui_exemption_reason: VERSIONED_GOVERNANCE_CONTRACT_OR_AUDIT_CONSUMED_BY_PROCESS_INSPECTOR
capability_ids: ["CAP-DGX-GOVERNANCE-001", "CAP-DGX-PROCESS-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-DGX-GOVERNANCE-001.yaml", "capability-registry/records/CAP-DGX-PROCESS-001.yaml"]
capability_registry_sync_status: CANDIDATE_PENDING_FORMAL_REVIEW
research_evidence_applicability: BOUNDED_DEVELOPMENT_OBSERVATION
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: STANDARD
state_identity_evidence: EXACT_DEVELOPMENT_HEAD
state_identity_evidence_refs: []
monitor_observability_evidence: CONTROLLED_CONFORMANCE
monitor_observability_refs: []
decision_trace_evidence: CONTROLLED_CONFORMANCE
decision_trace_refs: []
owner_gate: OWNER_AUTHORIZED_DEVELOPMENT_NO_MAIN_MERGE
merge_authority: false
report_path: mission-book/reports/DGX
development_component_commit_sha: 16bd4ffc34aa77fd5401b2f56dc3a371653b18b7
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-002","DGX-003","DGX-004"]
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
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
