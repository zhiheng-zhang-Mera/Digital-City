# Research Control Surface — Organization principles

[中文原文](../RESEARCH_CONTROL_SURFACE.md)

Research capabilities need strong control without turning the ordinary Utopia home page into a laboratory dashboard.

## Progressive disclosure

```text
Primary Product UI
    ↓
Research entry / Advanced
    ↓
Experiments
    ├─ Create / Run / Stop
    ├─ Scenario
    ├─ Metrics
    ├─ Replay
    └─ Export
          ↓
Danger Zone / Advanced Controls
    └─ Fault Injection
          ↓
Diagnostics
    └─ raw trace / IDs / exact config
```

## Exposure levels

### DIRECT_CONTROL

Directly operable: create experiment; start/pause/stop; choose scenario; repetitions; replay; export artifact. Place in the Research page's main action area.

### ADVANCED_CONTROL

Operable but infrequently presented: fault injection, destructive cleanup, advanced seed/config override, experimental transport faults. Place in Advanced/Danger Zone with explicit confirmation.

### OBSERVABLE

Users must see current run, progress, topology, failures, retries, handoffs, recovery, metrics, exclusions, provenance, and artifact status. Show user-language summaries by default and collapse technical identifiers.

### INTERNAL_ONLY

Examples: collector internal buffers and heartbeat packets. Complete UI absence is allowed only when there is genuinely no user decision/awareness value; record a `UI_EXEMPT_INTERNAL_ONLY` justification in the workbook.

## Principle

> **Maximize user control and awareness while avoiding visual and operational overload.**

Use hierarchy, context, collapsing, search, and advanced panels to solve overload; do not hide operable capabilities.
