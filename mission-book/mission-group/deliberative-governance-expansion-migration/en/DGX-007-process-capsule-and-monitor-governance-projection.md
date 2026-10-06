> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-007-process-capsule-and-monitor-governance-projection.md)

```yaml
workbook_id: DGX-007
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 7
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
dependencies: ["DGX-002", "DGX-005", "DGX-006"]
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
