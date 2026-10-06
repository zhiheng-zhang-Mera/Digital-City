# REX-805 — Trace Replay + Ablation Engine

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-805-trace-replay-and-ablation.md). Current frontmatter and authoritative reports determine status, claims, exact SHAs, CI and gates. This reading page does not copy or supersede live task metadata.
>
> [Standing rules](../../../CONSTRUCTION_RULES.md) · [Async protocol](../../../ASYNC_RELIEF_CONSTRUCTION.md) · [Research material](RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Allow selection of a recorded run, replaying its inputs/scenario and configuring ablation without altering the original trace:

- handoff off;
- retry off;
- backoff off;
- recovery off;
- alternate-device off;
- selected policy off.

## G3/G4 ablation candidates

Beyond existing handoff/retry/backoff/recovery, the design must allow future bounded ablation/replay to cover at least a feasible subset of these mechanisms:

- MissionBook persistent work state on/off, or a reduced view;
- structured exact-state handoff versus summary-only handoff;
- exact identity/provenance validation on/off;
- dynamic wake/rescan classification versus naive stop/poll;
- independent Review/evidence reconciliation on/off;
- Capability Registry-assisted localization versus repository-only exploration;
- implementation-only terminal versus user-reachable/intent-validated terminal;
- current rule set versus a bounded older/reduced/superseded rule view, only where safe replay is possible;
- naive Owner escalation versus rule/evidence-resolved or batched escalation policy;
- textual-merge-only acceptance versus semantic integration/reconciliation guards.

These are replay capabilities. V1 need not implement every experiment at once, but its schema must not prohibit them.

Rule-lifecycle/governance-policy replay may use only versioned rule snapshots; it must not change current production rules for an experiment. Semantic-integration replay must bind source accepted SHAs and the integration SHA.

## Hard rules

- Replay is not the original run.
- Replay requires new experiment/run ids.
- Declare when external-provider determinism cannot be guaranteed.
- Do not present an unavailable real-world condition as deterministic replay.
- Ablation must record the exact disabled mechanism.

## User entry

Provide Replay/Ablation directly on the Research page, outside ordinary primary navigation.

## Review

Independently replay the same trace. Check whether result differences come from real policy changes rather than harness drift.

## Completion gate

At least one multi-device scenario must complete a traceable original → replay → ablation comparison.
