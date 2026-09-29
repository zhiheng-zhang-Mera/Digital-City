# 城市控制中心 City Control Centre — Human Control Surface

```text
STATUS = PARTIAL_EXISTING_SURFACES
IMPLEMENTATION_AUTHORITY = DISTRIBUTED_PARTIAL
LOGIC_ENGINE_COMPONENT = General-Logic-Engine
LOGIC_ENGINE_STATE = DESIGN_BASELINE_NOT_YET_RUNTIME
LOGIC_ENGINE_SNAPSHOT = 66e93b3351672f109dbfc5760f90316ee9163b4b
```

## Existing Boss control surfaces

Codex-Boss contributes Chat/Work, WorkBook, Provider Manager, Owner Dashboard, Research/Engineering status/control and evidence/result/history surfaces.

## Engineering-domain surfaces

Hns exposes queue/worker/plugin/skill/Computer-Use/health/restart/settings surfaces. These remain Engineering-owned interfaces; the Control Centre may compose them without taking their authority.

## General Logic Engine component

[General-Logic-Engine](https://github.com/zhiheng-zhang-Mera/General-Logic-Engine) is retained here as the **rule/state/explanation backend design component**.

Its designed capability cluster is:

```text
typed Entity / Relation / State / Event / Rule / Constraint / Evidence
→ timeline + event activation
→ rule evaluation
→ constraint resolution
→ state propagation
→ uncertainty/evidence state
→ explanation trace / what-if branch
```

It is currently **design-only**: no runnable engine, performance evidence or cross-domain validation exists yet.

Domain adapters may later expose Quant/Health/etc. semantics to the engine, but those domains keep ownership of their data and rules.

## Boundary

General Logic Engine is not Root Trust, not City Core, not the whole Control Centre UI and not a mandatory broker for all City traffic.
