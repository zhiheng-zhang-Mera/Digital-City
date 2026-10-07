> Current state: Owner activated execution on Alien-GPT-DGX; no main merge. Formal Review and PCF-726 integration remain pending. Original design constraints below still apply.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-001-governance-ownership-audit-and-capability-map.md)

```yaml
workbook_id: DGX-001
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 1
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
baseline_resolution_evidence: mission-book/reports/DGX/DGX-001.md
anchor_state: EXACT_SHA_ANCHORED
dependencies: []
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
backend_wiring: CONTRACT_CONFORMANCE_ONLY
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
development_component_commit_sha: 3833751c1a075142f82d91c7be07910eccbcdfdb
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
> **Anchor policy:** All baseline/dependency exact SHA anchors are intentionally empty. Only after explicit Owner activation may the then-current canonical truth be resolved to full SHAs and written atomically.

# DGX-001 — Governance Ownership Audit & Capability Map

## Goal

Perform a soft reclassification audit of existing cross-domain capabilities without moving code. In addition to governance capabilities, audit canonical ownership of the primitives needed for cognitive decomposition and integration. Produce machine-readable and human-readable Governance Capability Maps:

```text
capability
canonical_owner
governance_role
execution_role
domain_profile
consumer_refs
duplication_or_conflict
migration_required
```

## Required audit subjects

Shared Task Core, Capability Fabric, JEV/Monitor, Guardian/compliance, Engineering Foreman/verifier, Research Review/adjudicator, Health evidence/simulation seams, GAI triage and Owner gates, plus:

- Request decomposition / planner.
- Shared Fact Snapshot.
- Problem Graph / DAG representation.
- Task Capsule.
- Structured Result / Evidence Envelope.
- Participant capability/history facts.
- Independence / recusal facts.

## Key audit questions

1. Which primitives already come from existing Task/Event/Evidence infrastructure?
2. Which are merely governance schemas and need no new runtime service?
3. Could Problem Graph incorrectly duplicate Mission Book / scheduler truth?
4. Where are the canonical owners of capability/history/independence facts?
5. Which existing reviewer/critic/adjudicator capabilities need only adapters rather than migration?
6. Is there a drift risk from storing the same concept separately in Engineering, Research and DGX?

## Hard constraints

- Default to `migration_required=false`.
- Separate DOMAIN_REVIEW from GOVERNANCE_REVIEW.
- Separate DOMAIN_ADJUDICATOR from GOVERNANCE_ADJUDICATOR.
- Problem Graph must not become a second runtime task truth.
- Do not copy history/reputation/independence facts into a private DGX database.
- Propose migration only when there is duplicate implementation, cross-domain institutional semantics, or clearly incorrect canonical ownership.
- This workbook must not change the current different-host Formal Review gate.

## Completion gate

Produce the ownership map, conflict list, KEEP/REFERENCE/EXTRACT classification, owner map of cognitive-orchestration primitives and inputs to subsequent workbooks. No product behavior may change.
