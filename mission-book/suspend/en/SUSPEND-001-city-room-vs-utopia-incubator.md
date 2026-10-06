> English reading translation / 英文阅读译本. The [original document](../SUSPEND-001-city-room-vs-utopia-incubator.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# SUSPEND-001 — City Room vs Utopia Incubator Semantics

**State:** PRESERVE_ONLY / TERMINOLOGY_CONFLICT

## Original idea that must be preserved
Utopia may need an incubation area:

```text
experimental capability
→ bounded incubation
→ contract stabilization
→ tests / user validation
→ promote to Native App / System Service / other stable role
```

This mechanism has value for rapid experiments and preventing immature capabilities from contaminating Core.

## Why it is suspended
Digital-City's `Room` already has formal semantics:

> capability owned by one Building.

Therefore, `apps/rooms/**` or “Room → City promotion” cannot directly become new City canonical rules: doing so would make the same term mean both:
1. A formal capability inside a Building;
2. An immature experimental incubation area.

## Current safe form of preservation
If reactivated in the future, prefer renaming it:
- Utopia Incubator;
- App Sandbox;
- Capability Nursery;
- Experimental App Space.

**Do not redefine City Room.**

## Possible future promotion
```text
Incubator
→ evidence/contract maturity
→ runtime classification (Native App / System App / Platform Service / Connector)
→ Capability Registry
→ City topology mapping if needed
```

This process remains only a candidate and does not authorize creation of an incubation runtime.
