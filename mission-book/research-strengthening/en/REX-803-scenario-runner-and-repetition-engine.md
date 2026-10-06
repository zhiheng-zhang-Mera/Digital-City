# REX-803 — Controlled Scenario Runner + Repetition Engine

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-803-scenario-runner-and-repetition-engine.md). This page translates the explanatory body only; the source workbook/report controls claims, state, SHA, CI, and gates.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Research material](./RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

```text
scenario
× N repetitions
→ bounded execution
→ run receipts
→ normalized outcomes
```

## Required support

- deterministic seed policy;
- repetitions;
- warmup / measured run distinction;
- timeout;
- stop/cancel;
- per-run exclusion reason;
- topology readiness;
- no-idle long campaign handling;
- explicit resume policy; never silently resume by default.

## User entry

DIRECT_CONTROL: choose scenario, set repetitions, start, stop, inspect progress, inspect failed/excluded runs.

## Review

Independently check duplicate execution, cancellation, restart, timeout, partial campaign, and seed reproducibility.

## Completion gate

Run at least one controlled campaign on the Alien + Mech + Android baseline topology and retain complete research trace/material.
