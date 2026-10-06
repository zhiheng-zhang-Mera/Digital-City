> English reading translation / 英文阅读译本. The [original document](../URA-004-surface-integration-and-registry-mapping.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# URA-004 — Surface Integration + Capability Registry Mapping

> **PARKED / NOT ACTIVATED.**

## Objective
Align runtime roles with user entry points, the user's right to be informed, and the Capability Registry, avoiding architectures that are correctly classified while hiding user capabilities again.

## Rules
Every App, Service, and Connector must map:

```text
runtime_role
CAP-* ids
implementation owner
backend wiring
user exposure class
surface locations
platform parity
observable health/status
owner controls
failure/refusal presentation
```

### Service
A Service need not have a top-level App UI. However, a Service affecting routing, devices, providers, cost, trust, privacy, or background behavior needs at least OBSERVABLE_ADVANCED or BACKGROUND_DISCLOSED.

### Native/System App
Follow User-Reachable Vertical Slice First. Normal user paths must genuinely connect to the canonical backend.

### Connector
Display connection state, permission and identity boundaries, and failure sources, so external unavailability is not misreported as a Utopia Core failure.

## Completion gate
No conflicting second set of states exists between runtime taxonomy and the Capability Registry / Exposure Gate.
