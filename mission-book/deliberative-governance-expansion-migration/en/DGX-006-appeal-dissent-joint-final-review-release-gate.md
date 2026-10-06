> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-006-appeal-dissent-joint-final-review-release-gate.md)

```yaml
workbook_id: DGX-006
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 6
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
dependencies: ["DGX-005"]
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

# DGX-006 — Appeal / Dissent / Joint Final Review & Release Gate

## Goal

After an Integrated Candidate forms, return its results to all actual participants for scoped final review and provide bounded appeal/minority-dissent mechanisms.

Final review consumes explicit results, evidence, accepted assumptions, unresolved uncertainty and the integration delta. It does not require sharing or reproducing hidden chain-of-thought.

## Final reviewer verdict

```text
APPROVE
APPROVE_WITH_MINOR_NOTES
REQUEST_CHANGES
BLOCK
```

Every verdict declares review scope, checked claims/evidence and the severity of unresolved objections.

## Release semantics

Complete agreement by every Agent on everything is not required. Instead:

- No unresolved Critical objection.
- No unresolved Major factual/safety/correctness objection.
- Required gates of responsible domain reviewers have passed.
- The independence floor is satisfied.
- Dissent may remain but cannot be silently deleted.
- Integration does not expand subtask outcomes into stronger conclusions unsupported by evidence.

Major REQUEST_CHANGES/BLOCK returns to Integration. Owner-only boundaries go to Owner.

## Appeal

An appeal must add evidence or identify a procedure violation or specific factual error. Infinite loops are prohibited. Policy specifies the count/escalation thresholds at activation.

## Completion gate

Bounded final review, no endless consensus loop, auditable release receipt. Participant disagreement does not automatically block release, but majority votes cannot override unresolved Critical/Major issues.
