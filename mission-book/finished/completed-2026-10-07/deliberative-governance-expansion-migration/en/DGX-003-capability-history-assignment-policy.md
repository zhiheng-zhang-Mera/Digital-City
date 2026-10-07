> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-003-capability-history-assignment-policy.md)

```yaml
workbook_id: DGX-003
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 3
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

# DGX-003 — Capability / History / Independence Assignment Policy

## Goal

Upgrade participant selection for complex tasks from random/fixed allocation to auditable capability-based assignment. Treat independence requirements as an eligibility floor, rather than a retrospective verbal judgment.

## Scoring facts

Read existing Capability/History truth without copying its database. Support at least:

- Domain capability fit.
- Historical completion/pass rate.
- Review/adjudication uphold history.
- Evidence quality.
- Current resource/tool readiness.
- Bounded recent-failure penalty.

Scores determine who is better suited to the task; they cannot be evidence that one person's statement is truer.

## Independence Profile

Tasks/roles may require floors in these dimensions:

```text
role_authorship_independence
agent_or_session_independence
model_family_independence
host_independence
environment_independence
hardware_or_toolchain_independence
conflict_of_interest_recusal
```

Rules:

- Not every task must maximize every dimension.
- High-risk or highly disputed tasks may require multidimensional independence.
- A profile is an eligibility constraint, not a vote claiming that more models yield more truth.
- Unavailable independence services must not silently lower hard gates.
- Engineering Formal Review's current different-physical-host requirement remains the existing minimum. DGX cannot make it optional.

Engineering rules may change only if a future Review Independence v2 independently demonstrates, through migration, that other combinations provide equal or greater assurance.

## Assignment receipt

Every assignment produces a bounded receipt:

```text
task_ref
problem_node_ref
candidate_set
selected_participant
role
score_components
required_independence_profile
observed_independence_facts
rejected_or_unavailable_reason
fallback_or_escalation
```

## Completion gate

Explainable assignment, independence eligibility checks, fallback and honest escalation when no candidate is available. A scoring-service fault must not freeze ordinary low-risk tasks or lower existing domain gates.
