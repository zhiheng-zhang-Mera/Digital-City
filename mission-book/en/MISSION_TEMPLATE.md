# Mission workbook template — English reading version

[Authoritative template](../MISSION_TEMPLATE.md). This reading copy is documentation; the YAML example below is not a registered workbook.

```yaml
---
workbook_id: XX-000
phase: PHASE_NAME
sequence: 0
execution_enabled: false
status: NOT_STARTED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
dependencies: []
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
owner_gate: NONE
merge_authority: false
report_path: null
---
```


# XX-000 — Workbook title

[中文模板与原始frontmatter](../MISSION_TEMPLATE.md) · [Mission Book dashboard](../README.md)

The YAML frontmatter above is preserved verbatim from the Chinese template. Its field names and enum values are shared across languages. This page translates the entire explanatory body.

> **Persistent construction rules:** [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)
> **Process-data rules:** [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)
> README is a monitoring dashboard only, not a construction specification or claim lock.

## Objective
## Confirmed background / current actual code
## Dependencies and unlock conditions
## Allowed modification boundaries
## Prohibited modification boundaries
## Task-specific construction steps
## Task-specific independent review
## Capability Exposure Decision / user entries

Record:

```text
user_exposure_class = DIRECT_CONTROL | OBSERVABLE_ADVANCED | BACKGROUND_DISCLOSED | INTERNAL_ONLY
user_exposure_surface = <where the user finds/sees/controls it>
user_exposure_nesting = L1_PRIMARY | L2_CONTEXTUAL | L3_ADVANCED | L4_TECHNICAL | NONE_INTERNAL
backend_wiring = VERIFIED | NOT_READY | NOT_APPLICABLE_INTERNAL
ui_exemption_reason = <required only for INTERNAL_ONLY>
```

DIRECT_CONTROL, OBSERVABLE_ADVANCED, and BACKGROUND_DISCLOSED require §14A evidence of entry, organization, awareness, and backend wiring. Only INTERNAL_ONLY permits full UI exemption.

## Capability Registry Chained Update

For every new/substantially modified capability, record under §14C:

```text
capability_ids = [...]
capability_registry_action = CREATE | UPDATE | BACKFILL | VERIFY_ONLY | NOT_APPLICABLE
capability_registry_refs = [...]
capability_registry_sync_status = PENDING | CANDIDATE_UPDATED | VERIFIED | NOT_APPLICABLE
```

Assess separately:

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

For direct-user/materially user-affecting capabilities, default to §14A.7 **User-Reachable Vertical Slice First**: establish the thinnest real user entry→canonical backend→observable result loop before expanding internals/UI. Never leave entries until last or substitute fake buttons for wiring.

Development Report identifies Registry candidate changes. Formal Review independently reconciles Registry claims against exact-head runtime/UI reality.

## Tests / physical-device / visual evidence

## Research / Paper Material Capture

Every workbook explicitly assesses under §14B:

```text
research_evidence_applicability = APPLICABLE | NOT_APPLICABLE
long_horizon_context_evidence = CAPTURED | NOT_OBSERVABLE | NOT_APPLICABLE
research_evidence_refs = [...]
state_identity_evidence = CAPTURED | NOT_OBSERVABLE | NOT_APPLICABLE
state_identity_evidence_refs = [...]
```

For long-running/asynchronous Agents, context pressure, compaction, resume, model/harness switch, Owner continuation, false COMPLETE, duplicates/regressions, stale state/SHA, or task-pool drain, prioritize observable evidence and record `NOT_OBSERVABLE + reason` instead of guessing missing telemetry.

After compaction/context reset/session resume/handoff, prioritize verifying reconstruction of current mission, exact branch/SHA, completed/remaining work, blocker, next action, failed paths, and acceptance gates.

For mutable branch/tag/head, exact SHA, dependency ancestry, Review/CI evidence binding, artifact/run identity, or critical-point reconciliation, also assess:

- `MUTABLE_REFERENCE_STATE_DRIFT`
- `EVIDENCE_POINTER_MISMATCH`
- `STALE_EXECUTION_IDENTITY`
- `PROVENANCE_RELATION_MISMATCH`

Record expected identity, actually resolved identity, evidence identity, provenance relation, and freshness revalidation. Branch names or “green CI” alone are not exact evidence.

Never collect/infer hidden chain-of-thought. Record only permitted explicit prompts/instructions, execution state, logs, CI/tests, timestamps, observable token/cost telemetry, Owner intervention, branch/SHA, and observable action/result.

### Research rarity / watchlist triage

Record actual signals under `RESEARCH_SIGNAL_WATCHLIST.yaml`:

```text
research_watchlist_hits = [...]
highest_research_grade_observed = NONE | G1_MATURE | G2_CROWDED | G3_SPARSE_ACTIVE | G4_RARE_SYSTEMIC
research_capture_level = MINIMAL | STANDARD | PRIORITY | MAXIMUM_BOUNDED
```

- G1/G2 cannot trigger research-only make-work.
- For G3/G4 prioritize before/after, exact evidence, timeline, Owner intervention, and replay/ablation opportunities.
- Unlisted phenomena use `UNCLASSIFIED_CANDIDATE`; never self-declare novelty.
- Refresh literature before submission; current grade determines collection budget only.

### Monitor / Decision observability

If observable by City Work Monitor/JEV or triggering retry/reroute/review/block/merge/Owner-escalation transitions, also assess:

```text
monitor_observability_evidence = CAPTURED | NOT_OBSERVABLE | NOT_APPLICABLE
monitor_observability_refs = [...]
decision_trace_evidence = CAPTURED | NOT_OBSERVABLE | NOT_APPLICABLE
decision_trace_refs = [...]
```

Prioritize observation→projection, state-transition→decision, decision source, timeout/fallback, Owner escalation, risk bubbling, and canonical-truth reconciliation. Monitor cannot become new task truth or slow unrelated work through a global synchronization barrier.

## Completion gates
## Reports / Utopia evolution records

## Binding persistent rules

This workbook inherits atomic claims, §2A immutable full-SHA baseline anchors, two-host independence, wait/wake, 20-minute fallback rescans, external reconciliation, exact-head CI/evidence, no-idle, no-make-work, integration refresh, §14A Capability Exposure & User Control Gate, §14B Long-Horizon Agent Research Evidence Gate, §14C Capability Registry Chained Update Gate, and other rules in `mission-book/CONSTRUCTION_RULES.md`. Stricter task-specific gates may be added; persistent rules cannot be weakened.
