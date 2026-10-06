# MON-903 — Event-Triggered Decision Overlay

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../MON-903-event-triggered-decision-overlay.md). Source workbook/report controls state, claims, SHA, CI, and gates.

## Objective

Add observable, traceable Decision layer for transitions **without making every report synchronous approval**.

```text
observation → state-transition candidate → Rule
↓ unresolved
Fast model
↓ uncertain/high-impact
Critic
↓ owner boundary
Owner
```

## Trigger principles

Ordinary heartbeat/progress/logs trigger no Decision. Candidates: failed/repeated failure, blocked, retry/reroute/reassign request, ready for review, resource conflict, scope change, merge/release gate, Owner-decision candidate.

## Nonblocking requirements

Per-task queues; no global mutex/approval lock; deterministic rules first; bounded model-timeout fallback; timeout/high risk pauses at most current task; service failure freezes no unrelated tasks.

## Decision receipt

At least:

```text
decision_id
trigger_event
pre_state
source = RULE | FAST_MODEL | CRITIC | OWNER
action
confidence_if_available
queue_wait_ms_if_observable
decision_latency_ms_if_observable
timeout/fallback
escalation_reason
evidence_refs
post_state
```

Fast models output only bounded decision contracts; free-form long prose is not execution authorization.

## Owner boundary

Cost thresholds, external publication, data deletion, permissions/security, irreversible actions, explicit value preferences, and architectural scope expansion retain existing Owner gates. No authority expansion through automatic approval.

## Research capture

Quantify rule/fast-model/critic-resolved versus owner-required; auto-resolution rate; Owner interruption count/cause; escalation quality/repeated clarification; decision latency; queue wait; timeout; unrelated-task effects; wrong decisions/repair; confidence versus final Review when tools truly expose it; autonomy resumption after escalation.

## Completion gate

Event- rather than report-triggered; per-task queue; rule-first; bounded receipts; timeout/fallback; user-visible provenance; no-global-barrier evidence; exact-head tests/CI; opposite-host Review; PAPER_MATERIAL_INDEX.
