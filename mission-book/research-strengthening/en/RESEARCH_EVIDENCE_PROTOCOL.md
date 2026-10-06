# Research Evidence Protocol — Mandatory material retention

[中文原文](../RESEARCH_EVIDENCE_PROTOCOL.md)

> **Status: ACTIVE / NORMATIVE FOR REX PROGRAMME**
>
> Turn both Research Fabric development and its experimental data into reviewable evidence for future papers, artifacts, and PhD research statements.

## 1. Retain both material classes

### A. Engineering-process material

Command/runtime errors; test/CI failures; browser/Android/Windows failures; race/timeout/stale state; incorrect assumptions; design conflicts; Development/Review disagreement; rejected designs; measurement-tool defects; repair before/after; exact SHA/configuration.

### B. Experimental material

Experiment manifest; topology; independent/dependent variables; seed; repetition index; software/config SHA; device/provider/model identity; start/end timestamps; task/action/event refs; latency; retry; handoff; failure/recovery; Owner intervention; resource observations; outcome; exclusion reason; normalized row; artifact digest.

## 2. Storage layers

### Raw runtime

`Utopia/.runtime/evidence/mission-book/<REX-ID>/<run-id>/` stores complete local git-ignored raw evidence.

### Selected shared evidence

`Utopia/evidence/raw/mission-book/<REX-ID>/` accepts only bounded, non-sensitive, reviewable failing/passing pairs, structured receipts, experiment samples, fault campaign results, timing tables, review falsification, replay diffs, and screenshots.

### Evolution events

Use the existing event contract; do not invent eventType.

### City research index

Each task requires `Digital-City/mission-book/reports/<REX-ID>/PAPER_MATERIAL_INDEX.md`. Programme closeout requires `Digital-City/mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`.

## 3. Do not retain only successful experiments

Every campaign preserves successful, failed, and excluded runs plus infrastructure and measurement failures. Exclusions require machine-readable reasons; do not delete data because it looks bad.

## 4. Classify measurement defects independently

Errors from harness, clock, trace collector, parser, stale logs, or replay driver are `MEASUREMENT_DEFECT`, not product defects; never silently repair them away.

## 5. Quantitative minimum

Record numbers when measurable; “improved/faster/stable” alone is unacceptable. Examples: completion_time_ms, recovery_time_ms, handoff_time_ms, owner_intervention_count, retry_count, failure_rate, duplicate_execution_count, lost_event_count, convergence_time_ms, successful_runs/total_runs. Missing/unmeasurable metrics use `NOT_MEASURED + reason`, never fabricated 0.

## 6. Defect chain

Preserve the complete chain for valuable defects where possible:

```text
OBSERVATION → REPRODUCTION → ROOT CAUSE → REPAIR
→ REGRESSION GUARD → OPPOSITE-HOST VERIFICATION
```

## 6A. Long-Horizon Agent Context Lifecycle

Long-running/asynchronous Agent construction within REX, or experiments studying autonomy, also follows `mission-book/CONSTRUCTION_RULES.md §14B`. Prioritize compaction/context-reset/resume trigger and timing; harness-exposed token/context occupancy; task phase/semantic boundary; authoritative state before/after compaction; summary/checkpoint ref; external Mission Book/report/exact SHA/CI refs; reconstruction errors; Owner intervention; duplicate/regression work; false completion; stale-state/SHA errors; measurable autonomous span/successful transitions.

Research Institute definitions: `paper-materials/{zh-CN,en}/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md`. Unexposed data uses `NOT_OBSERVABLE + reason`, never guesses. Evidence is observable execution state/behavior only: **never request, infer, or save hidden chain-of-thought/private reasoning**.

## 6B. State Identity, Provenance & Freshness

For long-horizon Agents, concurrent construction, resume/compaction, handoff, CI/Review evidence, or branch movement, observe external-state identity/provenance/freshness beyond §6A.

```text
MUTABLE_REFERENCE_STATE_DRIFT
EVIDENCE_POINTER_MISMATCH
BASELINE_ANCESTRY_MISMATCH
STALE_EXECUTION_IDENTITY
PROVENANCE_RELATION_MISMATCH
```

Prioritize:

```text
expected_identity
observed_symbolic_ref
resolved_identity_at_use
evidence_identity
required_ancestor_or_dependency_refs
critical_transition
freshness_revalidation_event
mismatch_detected
consequence_if_not_detected
reconciliation_action
owner_intervention_required
```

Compare more than branch versus SHA:

```text
L0 conversational symbolic state
L1 persistent mutable symbolic refs
L2 immutable exact identity
L3 immutable identity + provenance/dependency
L4 immutable identity + provenance + critical-point revalidation
```

Check whether compaction/summary degrades exact SHA, run ID, artifact digest, task ID, claim owner, or dependency SHA into vague symbolic state. Topic: `paper-materials/{zh-CN,en}/LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md`. Mutable Git branches themselves are not novelty; the research concerns temporal drift, evidence binding, and reliable recovery in long-horizon Agents.

## 6C. Capability Exposure Gap & Registry

Whenever REX changes capabilities or studies Agent software-development workflows, observe these states separately:

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

Priority failure labels:

```text
IMPLEMENTED_BUT_UNREACHABLE
VISIBLE_BUT_NOT_WIRED
VISIBLE_WRONG_SEMANTICS
DISCOVERABILITY_GAP
SURFACE_PARITY_GAP
CAPABILITY_REGISTRY_STALE
CAPABILITY_REGISTRY_REALITY_MISMATCH
DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE
```

When measurable retain:

```text
capability_id
implementation_completed_at
first_surface_available_at
reachability_verified_at
intent_validated_at
user_steps_to_reach
owner_intervention_count
rework_required
duplicate_implementation_detected
registry_reconciliation_result
exact_implementation_sha
ui_or_e2e_evidence_ref
```

Candidate metric: `Exposure Lag = T(reachability_verified) - T(implementation_complete)`. Later controlled studies distinguish implementation-first, UI-shell-first, and user-reachable thin vertical slice first; also compare with/without durable Capability Registry. Topic: `paper-materials/{zh-CN,en}/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md`. Classic vertical-slice/discoverability practices are not novelty; study Agentic implementation-to-exposure gaps, Registry effects, rework, and Owner intervention.

## 6D. Research Priority Triage

Not every measurable phenomenon is an equal paper opportunity. Authority: `mission-book/RESEARCH_SIGNAL_WATCHLIST.yaml`.

```text
G1_MATURE → MINIMAL
G2_CROWDED → STANDARD
G3_SPARSE_ACTIVE → PRIORITY
G4_RARE_SYSTEMIC → MAXIMUM_BOUNDED
```

### Current G3 priorities

Repository-resident executable work state; exact identity/provenance/freshness; structured exact-continuation handoff; dynamic liveness/eligibility/wake; independent Review as state/evidence boundary; Registry-assisted onboarding/localization; naturalistic Owner-intervention taxonomy; user-reachable completion as termination; passive normal-development→research evidence.

### Current G4 priorities

Unified repository-native control plane; capability implementation→wiring→reachability→intent; autonomy survival until Owner intervention; MissionBook/Registry/Git/CI/UI reality drift.

### REX data requirements

G3/G4 campaigns add where possible to normal manifests:

```text
research_signal_id
research_grade_snapshot
control_plane_rule_version
before_state
after_state
authority_surfaces
event_order
exact SHA/run/artifact ids
agent/model/harness
owner_intervention
task_transition_count
handoff/resume state
wake/eligibility state
user_reachability state
conflicting_truths
independent_review_result
ablation_or_replay_candidate
```

Unobservable fields use `NOT_OBSERVABLE + reason`. G1/G2 cannot create extra workloads for papers. G3/G4 instrumentation is bounded; dedicated fault injection/controlled ablation requires explicit REX workbook authorization. Strategy snapshot: `paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md`. Grades indicate collection priority only; refresh literature before submission.

## 6E. City Work Monitor / Observation–Decision

For JEV, City Work Monitor, task graphs, transition decisions, automatic retry/reroute/escalation in REX or ordinary work, distinguish:

```text
system truth → observed event → projected monitor state
→ decision trigger → decision source → resulting state transition
```

UI-visible state is not ground truth; trace it back to canonical event/state/evidence. Prioritize:

```text
canonical_event_id
observed_at
projected_at
projection_latency_ms
active_risk_present
risk_bubbled_to_overview
false_safe_summary
node_count
edge_count
edge_type
edge_reason_complete
decision_id
decision_source
decision_queue_wait_ms
decision_latency_ms
decision_timeout_or_fallback
escalation_reason
owner_intervention_required
autonomy_resumed_after_decision
unrelated_task_blocking
monitor_reality_drift
navigation_steps_to_cause
navigation_steps_to_evidence
```

Candidate metrics: Projection Lag, Decision Latency, Auto-resolution Rate, Owner-required Rate, Repeated-escalation Rate, False-safe Summary Rate, Edge Provenance Completeness, Monitor Reality Drift Rate, Unrelated-task Blocking Incidents.

Generic dashboard/topology/logs alone are G2 support. G3 priorities: hierarchical risk bubbling, edge-causal observability, continuous observation versus event-triggered nonblocking decision, decision escalation provenance. These may measure existing G4 unified-control-plane/autonomy-survival/multi-truth-drift stories but **do not automatically create new G4 novelty**. Topic: `paper-materials/{zh-CN,en}/CITY_WORK_MONITOR_OBSERVATION_DECISION_2026-10-05.md`.

## 7. Completion gate

No REX task completes while missing DEVELOPMENT_REPORT, REVIEW_REPORT, PAPER_MATERIAL_INDEX, required evolution events, exact-head CI, exposure-decision evidence, or required experiment/raw pointers. REX-890 generates programme synthesis of paper-usable methodology, failure taxonomy, and quantitative findings.
