# MON-902 — Overview Graph + Node / Path Inspector

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../MON-902-overview-graph-and-node-path-inspector.md). Source workbook/report controls state, claims, SHA, CI, and gates.

## Objective

Turn MON-901 normalized projection into Level 0 City Overview→Level 1 Node/Path Inspector→Level 2 Evidence/Technical Details.

## UI principles

### Overview

Default task-centric, never model-name-organized. Support RUNNING/WAITING/REVIEW/BLOCKED/FAILED/COMPLETE; warning/degraded/repeated-retry risk bubbling; stable layout; clustering/collapse; DAG; edge-type filters; conspicuous current Owner-required state.

### Node Inspector

Answer What/Why/Who-or-What owns it/What next.

### Path Inspector

Show edge type, source/destination, trigger/reason, observable time/duration, decision/evidence provenance, and handoff/retry/review/device-route/model-route semantic metadata.

## Prohibited

Healthy-looking overview hiding long retry/block in detail; UI trees restricting the data model to trees; 100+ nodes without collapse/clusters; complete relayout for every realtime event; deep directory mazes for ordinary diagnosis.

## Interaction budget

Target at most 2–3 interactions from overview anomaly to exact evidence. Mobile may use overview + bottom-sheet inspector; desktop may use graph + inspector + event stream.

## Research capture

```text
active_risk_present
risk_bubbled_to_overview
false_safe_summary
node_count
visible_node_count
collapsed_cluster_count
edge_count
edge_filter
layout_reflow_count_if_observable
navigation_steps_to_cause
navigation_steps_to_evidence
edge_reason_complete
owner_intervention_due_to_missing_observability
```

## Completion gate

Real task DAG projection; node/path inspector; risk bubbling; stable/collapsible layout; desktop + currently supported Android/Web surface strategy; exact-head runtime/UI evidence; opposite-host Review; PAPER_MATERIAL_INDEX.
