# 城市控制中心 City Control Centre — 人机控制界面 Human Control Surface

```text
STATUS = PARTIAL_FOUNDATION_EXISTS
CONTROL_UI = PROJECT_NOT_CREATED
LOGIC_ENGINE_COMPONENT = General-Logic-Engine
IMPLEMENTATION_AUTHORITY = NONE
ROLE = HUMAN_FACING_CONTROL_SURFACE + CONTROL_LOGIC_BACKEND
```

## Existing component

- **[General-Logic-Engine](https://github.com/zhiheng-zhang-Mera/General-Logic-Engine)** — registered here as the Control Centre's rule/state/explanation backend component.

Its current repository state is a **design baseline, not yet a runnable production engine**. Its typed entities, relations, events, state propagation, constraints, evidence and explanation traces fit the Control Centre's need to reason about and present city state, rules, consequences and explainable transitions.

General-Logic-Engine is **not**:

- the city authority source;
- Root Trust;
- the whole Control Centre UI;
- a mandatory broker for all city traffic;
- a replacement for domain-owned business logic.

## Missing Control Centre components

The human-facing application/shell is still not created. It may later provide:

- interactive city/building map;
- navigation and status views;
- node/device/task summaries;
- capability/permission/road visualization;
- lifecycle request surfaces;
- Owner-attention queue;
- city activity/event views;
- command submission;
- Chat / Work entry points backed by owning runtimes.

Conceptually:

```text
Human / Owner
    ↓
Control Centre UI
    ├── General-Logic-Engine (rule/state/explanation support)
    └── stable city/runtime interfaces
            ↓
      Core OS / Hns / domain buildings
```

## Boundary

The Control Centre is a thin observation/navigation/control surface plus optional reasoning/explanation support.

Authorization and durable city truth remain with the owning runtime/project. City services must continue when the Control Centre is unavailable.

## Creation condition

Create the standalone UI/control-shell project only after the post-cityization interfaces are stable enough to consume without repeated architectural rewrites.
