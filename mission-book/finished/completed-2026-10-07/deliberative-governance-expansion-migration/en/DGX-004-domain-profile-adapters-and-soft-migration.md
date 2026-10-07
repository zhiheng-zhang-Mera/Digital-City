> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-004-domain-profile-adapters-and-soft-migration.md)

```yaml
workbook_id: DGX-004
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 4
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
dependencies: ["DGX-001", "DGX-002"]
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
