# Control Dashboard — 城市操作台

```text
STATUS = PROJECT_NOT_CREATED
REPOSITORY = NOT_CREATED
IMPLEMENTATION_AUTHORITY = NONE
ROLE = HUMAN_FACING_CONTROL_SURFACE
```

## Role

Control Dashboard is the planned human-facing operation surface for Digital-City.

Its purpose is to provide one place to inspect and operate the wider ecosystem without turning the dashboard itself into a new source of city authority.

Conceptually:

```text
Human / Owner
    ↓
Control Dashboard
    ↓
digital-city-core-os / DS-Hns / domain buildings
```

## Planned capabilities

- interactive city/building map;
- building and extension status;
- lifecycle actions such as register / enable / disable / restart / upgrade / rollback / uninstall;
- Hns worker / construction status;
- CI, health, dependency and recovery summaries;
- capability / permission / road visualization;
- Owner-attention queue for the small number of actions that genuinely require Owner approval;
- Chat / Work entry points backed by the appropriate runtime rather than implemented inside the dashboard.

## Boundary

The dashboard is a **thin control client**.

It must not become:

- a second Boss / city core;
- an independent source of authorization truth;
- a duplicate city-state database;
- a new policy engine;
- a replacement for domain-specific governance.

The dashboard may display state and submit requests or commands, but authorization and durable city truth stay with the owning runtime/project.

## Dependency direction

Preferred future dependency:

```text
Control Dashboard
    -> consumes stable city/runtime interfaces

digital-city-core-os
DS-Hns
domain buildings
    -X-> must not depend on the dashboard to operate
```

The city should remain operable without the dashboard.

## Creation condition

Do not create a standalone implementation repository until the post-cityization interfaces are stable enough for a UI to consume without repeated architectural rewrites.

Until then this directory is documentation-only and must not be treated as an active dependency.
