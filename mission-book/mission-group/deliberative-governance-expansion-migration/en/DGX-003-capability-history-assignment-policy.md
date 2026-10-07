> Current state: all eight development workbooks complete on Alien-GPT-DGX; whole-series second-host review pending. Old per-workbook acceptance gates are suspended for this development only. No main merge.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-003-capability-history-assignment-policy.md)

```yaml
workbook_id: DGX-003
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 3
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 457599947a66e6621b26ff4b434c53cc9c468c58
baseline_resolution_evidence: mission-book/reports/DGX/DGX-003.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-001", "DGX-002"]
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
development_component_commit_sha: 0907309f0b8fbee2fcc0260e2a69a5582a1041b5
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: WHOLE_SERIES_SECOND_HOST_NOT_RUN
external_dependency_state: PCF_726_REQUIRED_SCHEMA_SLICE_IMPLEMENTED_SERIES_REVIEW_PENDING

dependency_source_workbooks: ["DGX-001","DGX-002"]
review_execution_scope: WHOLE_SERIES_SECOND_PHYSICAL_HOST
per_workbook_acceptance_gate: SUSPENDED_BY_OWNER_FOR_SERIES_DEVELOPMENT
owner_ruling_ref: mission-book/reports/DGX/OWNER_SERIES_RULING.md
series_evidence_ref: mission-book/reports/DGX/series-evidence/SERIES_EVIDENCE.json
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
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
