# City Work Monitor: Observation–Decision Layering and Research Evidence — 2026-10-05

> Status: **ACTIVE PAPER-MATERIAL TOPIC / CONSERVATIVE NOVELTY**
>
> Purpose: define research questions and evidence for the Utopia City Work Monitor, city-wide JEV observation layer, task DAG, node/path inspection, and event-triggered Decision layer.
>
> Important: **an agent dashboard/topology graph/log viewer by itself is treated as G2.** Priority questions concern long-horizon autonomy, escalation, causal observability, and reconciliation across truth surfaces.

## 1. System hypothesis

~~~text
canonical Utopia truth
   ├─ task/action/event
   ├─ device/worker
   ├─ review/CI/evidence
   └─ capability/runtime state
          ↓
JEV observation sidecar
          ↓
normalized Node / Edge / Event
          ↓
City Work Monitor
          ↓
event-triggered Decision receipt
~~~

Constraints:

- Observation is continuous.
- Decision is event-triggered.
- Decision is per-task and asynchronous.
- The monitor is a projection, not a second task truth.
- JEV/Decision must never become a city-wide synchronization lock.
- The overview may hide detail, but must not hide active risk.

## 2. Conservative grading

### G2 — Generic agent monitor/dashboard

Includes agent trees, topology graphs, session logs, node-status cards, generic observability UI, and generic progressive disclosure.

Collect ordinary telemetry; do not treat these alone as novelty.

### G3-A — Hierarchical risk bubbling

Question: can a system compress a complex execution graph into an overview without hiding active risk?

Candidate failures:

~~~text
SUMMARY_HIDES_ACTIVE_RISK
FALSE_SAFE_OVERVIEW
DEGRADED_STATE_NOT_BUBBLED
~~~

### G3-B — Edge-causal observability

Node state explains what is true now; an edge/path should explain why work moved here.

Capture handoff reason, retry trigger, review transition, device/model route, source/destination, and evidence/decision provenance.

### G3-C — Observation / Decision decoupling

Question: can continuous observation be separated from lightweight decisions triggered only by meaningful state transitions, increasing autonomy without creating another synchronization bottleneck?

Compare:

~~~text
always-synchronous decision
vs
event-triggered per-task decision
~~~

Measure task wall-clock time, decision queue wait, unrelated-task blocking, timeout/fallback, and recovery time.

### G3-D — Decision escalation provenance

Decision ladder:

~~~text
RULE
→ FAST_MODEL
→ CRITIC
→ OWNER
~~~

The question is not simply which model is smarter. Measure which events are resolved by rules, fast models, critics, or genuine Owner boundaries, including latency, incorrect decisions, repeated escalation, and time to resume autonomy.

This links directly to RS-G3-SUPERVISION-ATTENTION.

## 3. Support for existing G4 topics

This topic **does not create a new standalone G4**.

It primarily instruments:

- G4-A Unified Repository Control Plane;
- G4-C Project-level Autonomy Survival;
- G4-D Multi-truth Control-plane Reality Drift.

The monitor adds another observable truth surface:

~~~text
Mission Book
Capability Registry
Git
CI / Review evidence
runtime
UI / City Work Monitor projection
~~~

The research question is not merely whether a UI becomes stale, but whether projection drift causes a wrong next action, unnecessary Owner attention, or a false-safe overview.

## 4. Suggested structured fields

~~~text
workbook_id
task_id
canonical_event_id
event_type
event_time
observed_at
projected_at
projection_latency_ms
node_count
visible_node_count
collapsed_cluster_count
edge_count
edge_type
active_risk_present
risk_bubbled_to_overview
false_safe_summary
edge_reason_complete
edge_evidence_refs
decision_id
decision_trigger_event
decision_source
decision_action
decision_confidence_if_available
decision_queue_wait_ms
decision_latency_ms
decision_timeout
decision_fallback
escalation_reason
owner_intervention_required
owner_intervention_class
autonomy_resumed_at
time_to_autonomy_resume_ms
unrelated_task_blocking
monitor_reality_drift
reconciliation_action
navigation_steps_to_cause
navigation_steps_to_evidence
~~~

Use NOT_OBSERVABLE + reason when data is unavailable.

## 5. Candidate metrics

- Projection Lag.
- Decision Latency.
- Auto-resolution Rate with source distribution.
- Owner-required Rate.
- False-safe Summary Rate.
- Edge Provenance Completeness.
- Monitor Reality Drift Rate.
- Unrelated-task Blocking Incidents.

A desirable value such as zero blocking must never be recorded as 0 unless it was actually measured.

## 6. Natural evidence opportunities

Prefer passive evidence from normal work:

- JEV slow/disconnected while tasks continue;
- fast-model timeout;
- concurrent decisions across tasks;
- repeated retry;
- graph growth and clustering;
- handoff path explanation;
- monitor/runtime drift;
- Owner forced into raw logs because observability is insufficient;
- Owner locating an issue directly through risk bubbling.

Only explicit REX workbooks may authorize deliberate fault injection or ablation.

## 7. Place in the paper story

This is best used as instrumentation and empirical evidence for the larger control-plane story, for example:

> Persistent control state is insufficient if operators and successor agents cannot observe causally meaningful state transitions without turning observability into a synchronous control bottleneck.

Refresh the literature before submission. Current grades control evidence budget; they are not first-ever claims.
