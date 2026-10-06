> English reading translation / 英文阅读译本. The [original document](../URA-001-current-runtime-topology-audit.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# URA-001 — Current Runtime Topology & Ownership Audit

> **PARKED / NOT ACTIVATED.**

## Objective
Perform a read-only audit of Utopia's current modules, entry points, dependencies, and canonical owners, mapping them to candidate runtime roles; do not move code.

## Output fields
```text
capability/module
current_path
canonical_owner
city_building_room
runtime_role_candidate
public_contracts
dependencies
user_surfaces
lifecycle
failure_scope
coupling_findings
reclassification_needed
code_move_needed
```

The default is `code_move_needed=false`.

## Priority subjects
Butler Assistant, Remote Fabric, General AI Gateway, Engineering Manager, Monitor/JEV, Capability/Device fabrics, Rooms/Apps, and external connectors.

## Completion gate
Produce a runtime map bounded by observed reality, listing actual ownership, dependency, and lifecycle conflicts. Do not propose migration merely because names are inconsistent.
