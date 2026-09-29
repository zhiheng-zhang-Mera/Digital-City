# 城市服务网 City Service Network — Capability Fabric

```text
STATUS = REFERENCE_IMPLEMENTATION_EXISTS
LONG_TERM_SOURCES = Codex-Boss + DS-Hns
CURRENT_REFERENCE_IMPLEMENTATION = Utopia capability-bridge v1
UTOPIA_STATUS = V0_3_ACCEPTED_HARDENED
```

## Ownership

Capability Fabric answers:

- what capability exists;
- qualified identity and owning module;
- lifecycle/availability;
- dependencies/providers;
- where/how it can be invoked;
- health/result-history references.

The long-term behavior target remains the Boss/Hns functional union.

## Current Utopia reference

Utopia V0.3 already implements:

- qualified module identity;
- restrictive lifecycle-aware availability;
- bounded operation allowlists/input/result sizes;
- durable invocation status + summary/detail history;
- restart interruption truth;
- typed errors across Web/Android;
- five accepted service adapters.

This is a **reference implementation**, not proof that every City capability has migrated.

## Boundary with 02 Worker Gateway

Capability Fabric is city-global discovery/invocation metadata.

Worker Gateway is Engineering-specific and adapts official coding/engineering providers for Hns. A coding provider may register capabilities into the Fabric, but the Fabric does not become the Engineering planner.

```text
Capability != Plugin
Plugin = one packaging/admission form for a capability provider
```
