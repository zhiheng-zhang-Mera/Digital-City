> Current state: all eight development workbooks complete on Alien-GPT-DGX; whole-series second-host review pending. Old per-workbook acceptance gates are suspended for this development only. No main merge.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-002-constitution-and-core-deliberation-contracts.md)

```yaml
workbook_id: DGX-002
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 2
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 3833751c1a075142f82d91c7be07910eccbcdfdb
baseline_resolution_evidence: mission-book/reports/DGX/DGX-002.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-001", "PCF-726"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 6fe6e85b51f3e067dc67405c8e01a93e89dca1b4
development_ci: {"head_sha":"6fe6e85b51f3e067dc67405c8e01a93e89dca1b4","run_id":37577646603,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37577646603"}
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
owner_gate: WHOLE_SERIES_SECOND_HOST_REVIEW_PENDING_NO_MAIN_MERGE
merge_authority: false
report_path: mission-book/reports/DGX
spec_revision: 2
migrated_scope_refs: ["PCF-MIG-20261007-03"]
migrated_scope_ownership: DESTINATION_PCF_ONLY
development_component_commit_sha: 457599947a66e6621b26ff4b434c53cc9c468c58
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: WHOLE_SERIES_SECOND_HOST_NOT_RUN
external_dependency_state: PCF_726_REQUIRED_SCHEMA_SLICE_IMPLEMENTED_SERIES_REVIEW_PENDING

dependency_source_workbooks: ["DGX-001","PCF-726"]
review_execution_scope: WHOLE_SERIES_SECOND_PHYSICAL_HOST
per_workbook_acceptance_gate: SUSPENDED_BY_OWNER_FOR_SERIES_DEVELOPMENT
owner_ruling_ref: mission-book/reports/DGX/OWNER_SERIES_RULING.md
series_evidence_ref: mission-book/reports/DGX/series-evidence/SERIES_EVIDENCE.json
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
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

## 2026-10-07 authoritative subscope transfer

The listed execution-only requirements are MIGRATED OUT, not completed. Their sole implementation/acceptance owner is the destination PCF workbook; this source consumes its versioned contract/evidence. Remaining original domain requirements and gates are retained. Any earlier prose naming the same objects is a domain extension or consumption requirement, not duplicate ownership. No activation is granted.

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-03 | DGX-002 — Bounded execution context and structured result/evidence exchange substrate | PCF-726 | Constitution, semantic decomposition, ProblemGraph, domain evidence rules, defence and adjudication |

TaskCapsule/ResultEnvelope become thin domain extensions overPCF-726. DGX retains semantic meaning, domain evidence, independence/recusal and governance verdicts. The generic execution envelope and bounded/correlated result substrate have one PCF owner. PCF must not depend on DGX.
