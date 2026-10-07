> Current state: all eight development workbooks complete on Alien-GPT-DGX; whole-series second-host review pending. Old per-workbook acceptance gates are suspended for this development only. No main merge.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-007-process-capsule-and-monitor-governance-projection.md)

```yaml
workbook_id: DGX-007
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 7
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: a34a65556fbbd2e8d2c90a267e84ed19b8234171
baseline_resolution_evidence: mission-book/reports/DGX/DGX-007.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-002", "DGX-005", "DGX-006"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 6fe6e85b51f3e067dc67405c8e01a93e89dca1b4
development_ci: {"head_sha":"6fe6e85b51f3e067dc67405c8e01a93e89dca1b4","run_id":37577646603,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37577646603"}
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: WEB_GOVERNANCE
user_exposure_nesting: L0_CAPSULE_L1_INSPECTOR_L2_EVIDENCE
backend_wiring: PARTIAL
ui_exemption_reason: null
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
development_component_commit_sha: 14a23267d3d720c25884cc217891229cee292af2
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: WHOLE_SERIES_SECOND_HOST_NOT_RUN
external_dependency_state: PCF_726_REQUIRED_SCHEMA_SLICE_IMPLEMENTED_SERIES_REVIEW_PENDING

dependency_source_workbooks: ["DGX-002","DGX-005","DGX-006"]
review_execution_scope: WHOLE_SERIES_SECOND_PHYSICAL_HOST
per_workbook_acceptance_gate: SUSPENDED_BY_OWNER_FOR_SERIES_DEVELOPMENT
owner_ruling_ref: mission-book/reports/DGX/OWNER_SERIES_RULING.md
series_evidence_ref: mission-book/reports/DGX/series-evidence/SERIES_EVIDENCE.json
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
> **Anchor policy:** All baseline/dependency exact SHA anchors are intentionally empty. Only after explicit Owner activation may the then-current canonical truth be resolved to full SHAs and written atomically.

# DGX-007 — Process Capsule + Monitor Governance Projection

## Goal

Whenever the Owner receives a formal complex-task result, show a compressed explicit process, validation and decision trail without forcing the Owner to become a manual reviewer.

Correction in this round: no longer use “compressed chain of thought.” Process Capsule shows auditable decomposition, assignment, evidence, conflict and decision. It neither shows, infers nor saves hidden chain-of-thought.

## L0 — Process Capsule, returned with results by default

Show at least:

- Owner request / accepted scope.
- Problem Graph decomposition summary.
- Participants / roles.
- Assignment basis and independence floor.
- Structured node outcomes.
- Material conflicts.
- Adjudication outcomes.
- Validation performed.
- Residual uncertainty.
- Final release-gate state.

## L1 — Deliberation Inspector

On demand, expand Claim, Evidence, Objection, Defence, provisional-versus-final adjudication summary and dissent.

## L2 — Technical Evidence

On demand, inspect exact SHA, CI/tests, sources/citations, artifacts, decision receipts, timestamps and snapshot/version references.

## Privacy and cognitive-load boundaries

Do not display/save hidden chain-of-thought. Do not push routine heartbeats, repeated logs, every token or unused drafts to the Owner by default.

## Monitor boundary

Reuse City Work Monitor projection/progressive disclosure. Governance projection is not a new task truth; Monitor/JEV failure cannot block unrelated execution.

Problem Graph may project as a DAG in Monitor, but its node state cannot override canonical runtime/task state. Conflicts must display a reconciliation warning.

## Completion gate

At least one conflict-free case and one conflict/adjudication case generate accurate Process Capsules, traceable from L0 to exact evidence. Without reading hidden reasoning, the Owner understands how work was decomposed, who did it, why, the evidence and the uncertainty.
