> Current state: Owner activated execution on Alien-GPT-DGX; no main merge. Formal Review and PCF-726 integration remain pending. Original design constraints below still apply.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-004-domain-profile-adapters-and-soft-migration.md)

```yaml
workbook_id: DGX-004
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 4
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 0907309f0b8fbee2fcc0260e2a69a5582a1041b5
baseline_resolution_evidence: mission-book/reports/DGX/DGX-004.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-001", "DGX-002"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 33faba449222f2cfab108ccfe62a78f41c9743a9
development_ci: {"head_sha":"33faba449222f2cfab108ccfe62a78f41c9743a9","run_id":37573979023,"status":"IN_PROGRESS","conclusion":null}
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
development_component_commit_sha: d9d2750168050d0b4a91ae4ab192e2048b77fae0
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-001","DGX-002"]
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
> **Anchor policy:** All baseline/dependency exact SHA anchors are intentionally empty. Only after explicit Owner activation may the then-current canonical truth be resolved to full SHAs and written atomically.

# DGX-004 — Domain Profile Adapters & Soft Migration

## Goal

Connect existing Engineering, Research and Health buildings to the governance protocol through `DomainReviewProfile`, rather than moving away their professional capabilities.

## Minimum profile fields

```text
domain
task_decomposition_rules
problem_node_types
required_executor_roles
required_reviewer_roles
independence_floor
evidence_rules
validation_hooks
conflict_types
adjudication_inputs
criticality_policy
release_requirements
```

## Initial profiles

### ENGINEERING

Reuse Foreman, CI/exact SHA, fresh verifier and Formal Review.

Hard compatibility constraints:

- Current Formal Review continues to require different physical hosts.
- A same-host fresh critic may only diagnose or perform preliminary review.
- DGX independence profiles may be stricter, never looser.
- This floor may change by explicit migration only after future Review Independence v2 is formally activated and accepted.

### RESEARCH

Method / Evidence / Claim / Reproducibility and research adjudication. Problem Graph may express parallel evidence checks, alternative hypotheses and replication tasks; it must not turn paper interest into product acceptance truth.

### HEALTH

Establish the contract/seam first. Do not represent planned PK/PD/DDI capabilities as implemented clinical truth. High-risk health conclusions remain constrained by professional evidence/safety profiles.

## Migration rules

Prefer KEEP-IN-PLACE, connected by typed ports/references. EXTRACT requires empirical evidence of duplicate ownership and a minimal migration boundary.

## Completion gate

At least Engineering and Research achieve adapter conformance without duplicating canonical truth. Health honestly marks unimplemented capabilities unavailable. Adapter integration must not implicitly lower existing domain Review gates.
