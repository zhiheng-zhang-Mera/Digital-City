> Current state: Owner activated execution on Alien-GPT-DGX; no main merge. Formal Review and PCF-726 integration remain pending. Original design constraints below still apply.

> Reading translation / 阅读译本. The source is authoritative. This reading creates no task status or activation authority. Original metadata is quoted below, not active frontmatter.

[Canonical source](../DGX-006-appeal-dissent-joint-final-review-release-gate.md)

```yaml
workbook_id: DGX-006
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 6
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 16bd4ffc34aa77fd5401b2f56dc3a371653b18b7
baseline_resolution_evidence: mission-book/reports/DGX/DGX-006.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-005"]
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
development_component_commit_sha: a34a65556fbbd2e8d2c90a267e84ed19b8234171
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: NOT_RUN
external_dependency_state: PCF_726_ACCEPTED_SHA_UNAVAILABLE

dependency_source_workbooks: ["DGX-005"]
```

> **OWNER ACTIVATED / DEVELOPMENT CANDIDATE.** This workbook freezes design boundaries only. Do not claim, construct or create a Utopia product branch from it.
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
