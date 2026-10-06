# MON-901 — Observation Model + JEV Sidecar Projection

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../MON-901-observation-model-and-jev-projection.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Programme](./README.md)

## Objective

Build thinnest real observation foundation:

```text
canonical Utopia runtime truth → bounded event adapter → JEV observation layer
→ normalized Node / Edge / Event projection → observable monitor state
```

## Strong constraints

JEV is sidecar/observer, never a synchronous mandatory execution path. No duplicate scheduler/task/device/provider/review/capability truth. Failure cannot block unrelated work. Raw high-frequency telemetry follows PROCESS_DATA_POLICY layers. No new hidden reasoning capture. First slice shows at least one real active task, owner/host, state, evidence pointer.

## Minimum data model

Node, Edge, Event, Evidence. Decision may remain schema seam for MON-903.

## Observation scope

Reuse canonical events for task claims/transitions, worker/host binding, review, test/CI summaries, wait/retry/recovery, handoff, existing model/provider switches, Owner escalation, evidence refs. Dashboard convenience cannot create second state machines.

## Performance gate

Verify tasks continue with disconnected observer, unrelated tasks are not synchronously blocked by slow observer, measurable projection lag is recorded, and dropped/missing events honestly exposed without false realtime claims.

## Research capture

```text
event_source
canonical_event_id
observed_at
projected_at
projection_latency_ms
drop_or_gap
reconciliation_result
monitor_reality_drift
unrelated_task_blocking
```

Unknown fields use NOT_OBSERVABLE.

## Development / Review

Development updates Registry candidate. Formal Review independently validates exact-head runtime: projection is not task truth; sidecar failure freezes no tasks; projection matches canonical runtime; observed risk retains exact pointers.

## Completion gate

Bounded projection contract, one actual task node/edge/event projection, no-global-barrier evidence, opposite-host Review, exact-head CI, Registry candidate/reconciliation, PAPER_MATERIAL_INDEX.

## Review conclusion (Mech, opposite physical host)

Formal Review PASS: `mission-book/reports/MON-901/REVIEW_REPORT.md`. Six independent probes `utopia:tests/mon901-mech-review-probes.test.mjs` cover all four required checks; author tests rerun unchanged. Two nonblocking findings: F1 LOW completeness.continuous is hardcoded and contradicts computed historyGap in a full continuous window; F2 INFORMATIONAL state_identity_evidence claims CAPTURED with no refs, backfilled by reviewer. No user-visible surface verified; graph/inspector belongs to MON-902.
