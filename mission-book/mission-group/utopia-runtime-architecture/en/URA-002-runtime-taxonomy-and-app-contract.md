> English reading translation / 英文阅读译本. The [original document](../URA-002-runtime-taxonomy-and-app-contract.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# URA-002 — Runtime Taxonomy + App Contract

> **PARKED / NOT ACTIVATED.**

## Objective
Freeze minimum classification rules for Core / Platform Service / System App / Native App / Connector and define a unified App Contract.

## Minimum App Contract contents
```text
app/service identity + version
required capabilities
requested permissions
public commands/actions/events
storage namespace
device/platform requirements
lifecycle install/enable/disable/update/uninstall/rollback
failure/isolation semantics
surface declarations
observability hooks
compatibility/version contract
```

## Native App principles
“Logically external, with the experience embedded”:
- Business logic stays outside Core;
- Users enter through normal Utopia product entry points;
- Typed contracts provide access to platform capabilities such as tasks, devices, AI, and storage;
- App crashes or disabling must not damage unrelated Core functionality;
- Apps can be tested separately and, if necessary, independently versioned in the future.

## Completion gate
A taxonomy decision table, App Contract schema, and mapping rules for City topology and the Capability Registry.
