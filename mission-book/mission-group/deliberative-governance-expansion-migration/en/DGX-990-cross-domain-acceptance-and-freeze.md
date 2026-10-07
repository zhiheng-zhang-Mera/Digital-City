> Current state: Owner activated execution on Alien-GPT-DGX; no main merge. Formal Review and PCF-726 integration remain pending. Original design constraints below still apply.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-990-cross-domain-acceptance-and-freeze.md)

```yaml
workbook_id: DGX-990
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 990
execution_enabled: true
status: DEVELOPMENT_CANDIDATE_WAITING_DEPENDENCIES
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 954065e5b96c8daf8d0c234095459f3ab5ba87b9
baseline_resolution_evidence: mission-book/reports/DGX/DGX-990.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-003", "DGX-004", "DGX-005", "DGX-006", "DGX-007"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 33faba449222f2cfab108ccfe62a78f41c9743a9
development_ci: {"head_sha":"33faba449222f2cfab108ccfe62a78f41c9743a9","run_id":37573979023,"status":"IN_PROGRESS","conclusion":null}
development_complete: false
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
development_component_commit_sha: 7194d37682a4d87b9e102ab5d791bd3dcf9df656
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-003","DGX-004","DGX-005","DGX-006","DGX-007"]
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
> **Anchor policy:** All baseline/dependency exact SHA anchors are intentionally empty. Only after explicit Owner activation may the then-current canonical truth be resolved to full SHAs and written atomically.

# DGX-990 — Cross-domain Acceptance & Freeze

## Goal

Independently accept DGX v2 across domains, roles and hosts where necessary, then freeze institutional contracts.

## Required scenarios

1. Engineering: decompose a complex request into a Problem DAG, with independent development, verification, conflict handling and final review.
2. Research: multi-role objection/rebuttal/evidence adjudication.
3. Health-style professional query: available evidence/reviewer seams may be used, but an unimplemented clinical simulator must not be impersonated.
4. Conflict-free fast path.
5. Both sides wrong / MORE_EVIDENCE_REQUIRED.
6. Owner-only escalation.
7. Isolated execution under one Shared Fact Snapshot and structured ResultEnvelope integration.
8. DGX-003 independence-profile eligibility/fallback.
9. DGX-005 fresh-context Pass A to Pass B reconciliation.
10. Unrelated tasks do not freeze when Governance/Monitor is unavailable.
11. Honest reconciliation when Problem Graph conflicts with canonical task truth.
12. Process Capsule neither hides active risks nor overloads the Owner.
13. No DGX adapter lowers Engineering's current opposite-host Formal Review floor.

## Freeze conditions

Every prerequisite workbook completes Development, independent Review and exact-head evidence. The capability/ownership map reconciles with runtime reality.

If Review Independence v2 has not independently passed acceptance by then, Engineering Formal Review continues to use the canonical rules in force. DGX freeze cannot preemptively relax those gates.

Candidate terminal marker:

`DELIBERATIVE_GOVERNANCE_V2_CROSS_DOMAIN_ACCEPTED`.

This marker certifies validation of governance/decomposition/adjudication protocols only. It does not mean all domain professional models are implemented or Review Pool v2 is effective.
