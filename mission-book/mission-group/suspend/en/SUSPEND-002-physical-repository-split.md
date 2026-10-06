> English reading translation / 英文阅读译本. The [original document](../SUSPEND-002-physical-repository-split.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# SUSPEND-002 — Physical Repository Split Option

**State:** PRESERVE_ONLY / NOT_CURRENT_RECOMMENDATION

## Option that must be preserved
Utopia may eventually split its single repository into multiple independent repositories, packages, or release units.

This is not a current goal, but should not be ruled out permanently.

## Why it is not being done now
Current priorities are:
- Contracts;
- Authority;
- Dependency direction;
- Lifecycle;
- Failure isolation;
- Capability Registry and user surfaces.

These can first be addressed through logical boundaries in a single repository. Physically splitting repositories now would add:
- Version coordination;
- CI and release orchestration;
- Dependency drift across repositories;
- Migration costs;
- Agent navigation overhead.

There is not yet evidence that benefits exceed costs.

## Triggers for future reevaluation
At least one real pressure must emerge:
- Different components need independent release or rollback cycles;
- Permissions or security require repository-level isolation;
- Single-repository scale has become a persistent CI bottleneck;
- Different deployment units need independent scaling or failure isolation;
- Ownership or team boundaries are stable over the long term and are in conflict;
- A public SDK or App ecosystem needs an independent version contract;
- Single-repository dependency rules can no longer prevent actual coupling.

## Principle
**Logical decoupling first; physical split only on measured benefit.**

This document authorizes no repository split.
