> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-002-constitution-and-core-deliberation-contracts.md)

```yaml
workbook_id: DGX-002
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 2
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
dependencies: ["DGX-001"]
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

# DGX-002 — Constitution + Decomposition / Core Deliberation Contracts

## Goal

Establish cross-domain institutional contracts and complex-request decomposition contracts, rather than a universal professional Reviewer or second scheduler.

## Minimum Constitution

- Evidence outranks votes.
- An author/executor cannot arbitrate their own dispute.
- Unresolved critical/major objections block release.
- No silent suppression of uncertainty.
- Retain minority dissent.
- Reputation affects assignment, not truth.
- No agent expands its own authority.
- High-impact/Owner-only boundaries remain Owner-controlled.
- Decomposition preserves original Owner intent and explicit constraints.
- No requirement to exchange or persist hidden chain-of-thought.

## Core data objects

`DeliberationCase / SharedFactSnapshot / ProblemGraph / ProblemNode / TaskCapsule / Participant / Claim / EvidenceRef / ResultEnvelope / Objection / Defence / Adjudication / Appeal / Dissent / ReleaseVerdict`.

### SharedFactSnapshot

Record at least:

```text
request_ref
accepted_requirements
canonical_state_refs
evidence_refs
domain_constraints
known_unknowns
snapshot_version
```

### ProblemGraph

Support at least:

```text
node_id
question_or_verification
dependencies
required_capabilities
independence_floor
input_refs
expected_output_contract
stop_condition
status_projection
```

ProblemGraph may be a DAG. New facts may lead to controlled node additions, but provenance must remain. It is a deliberation plan, not a new authority over Mission Book/task runtime.

### TaskCapsule / ResultEnvelope

TaskCapsule supplies participants with the minimum necessary context. ResultEnvelope returns:

```text
explicit_result
assumptions
evidence_refs
uncertainty
unresolved_questions
proposed_next_action
```

Do not require or retain participants' hidden chain-of-thought as an interoperability protocol.

## Prohibited

- A second task truth, scheduler or device identity.
- ProblemGraph state overriding canonical runtime state.
- Capturing hidden chain-of-thought.
- Placing JEV/Monitor on the synchronous critical path of every execution.
- Governance implementing Engineering/Medical/Research professional algorithms itself.
- Bypassing an Owner-only gate by decomposing more finely.

## Completion gate

Versioned Constitution, decomposition contract, ProblemGraph/TaskCapsule/ResultEnvelope schemas, invariant tests, authority boundary and failure semantics.
