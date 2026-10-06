# REX-805 — Trace Replay + Ablation Engine

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-805-trace-replay-and-ablation.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Async protocol](../../ASYNC_RELIEF_CONSTRUCTION.md) · [Research material](./RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Select a recorded run, replay inputs/scenario, and configure ablation without altering original trace: handoff off, retry off, backoff off, recovery off, alternate-device off, selected policy off.

## G3/G4 ablation candidates

Beyond existing handoff/retry/backoff/recovery, design future bounded replay/ablation to permit a feasible subset of: MissionBook persistent state on/off/reduced; structured exact-state versus summary-only handoff; identity/provenance validation on/off; dynamic wake/rescan versus naive stop/poll; independent Review/reconciliation on/off; Registry-assisted localization versus repository-only exploration; implementation-only versus reachable/intent-validated terminal; current versus bounded older/reduced/superseded rule view (safe replay only); naive Owner escalation versus rule/evidence-resolved or batched escalation; textual-merge-only acceptance versus semantic integration/reconciliation guards.

These are replay capabilities, not a requirement to implement every experiment in v1; schema cannot prohibit them. Rule/governance replay uses versioned rule snapshots only and never changes current production rules. Semantic-integration replay binds accepted source SHAs and integration SHA.

## Hard rules

Replay ≠ original run. New experiment/run IDs required. Declare external-provider nondeterminism. Do not pretend unavailable real-world conditions are deterministic replay. Record exact disabled mechanisms.

## User entry

Direct Replay/Ablation in Research, outside ordinary primary navigation.

## Review

Independently replay same trace; distinguish genuine policy-induced differences from harness drift.

## Completion gate

At least one multi-device scenario supports traceable original→replay→ablation comparison.
