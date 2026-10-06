# REX-806 — Metrics Analysis + Research Artifact Export

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-806-metrics-analysis-and-artifact-export.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Async protocol](../../ASYNC_RELIEF_CONSTRUCTION.md) · [Research material](./RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Export inspectable experiments:

```text
artifact/
├─ manifest
├─ environment
├─ topology
├─ raw pointers
├─ normalized dataset
├─ metrics.csv
├─ failures
├─ exclusions
├─ tables
├─ reproduction
└─ checksums
```

## Metrics

Support at least metrics backed by predecessor actual data: completion/recovery/handoff time; failure rate; intervention/retry counts; duplicate execution; measurable convergence/missing events; transitions before Owner intervention; time/steps to first intervention; constructible intervention-free survival; cause taxonomy; pre-intervention pool drain; control-plane mismatch count/reconciliation time; implementation→wiring→reachability→intent timestamps; measurable Exposure Lag/Intent Lag; experimentally supplied Registry localization/onboarding costs; high-value Owner decision count; avoidable technical escalation count; repeated clarification count; escalation→autonomy-resumed time; measurable batchable-escalation count/interruption bursts; rule activation/conflict/false-block/retirement; textually clean semantic-integration failure count; independently green components→integrated semantic failure count. Unsupported metrics use NOT_MEASURED.

### Metric interpretation guard

owner_intervention_count = 0 requires observation of the complete window with genuinely no intervention; unknown is NOT_MEASURED. Longer runs are not necessarily more autonomous: classify idle loops, duplicates, blocked polling separately. Insufficient survival samples export raw censored episodes rather than forced conclusions. G1/G2 default to supporting metrics; prioritize G3/G4 in paper-ready tables.

## Export

DIRECT_CONTROL: preview dataset, export artifact, export CSV/table-ready data, reproduction instructions. Never automatically generate exaggerated conclusions; separate statistics from paper narrative.

## Review

Reviewer independently recomputes at least one metric group from export and checks checksum/provenance.

## Completion gate

A real campaign yields a complete artifact independently readable/recomputable on another physical host.
