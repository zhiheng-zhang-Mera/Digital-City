> English reading translation / 英文阅读译本. The [original document](../URA-990-soft-reclassification-acceptance-and-freeze.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# URA-990 — Soft Reclassification Acceptance & Freeze

> **PARKED / NOT ACTIVATED.**

## Objective
Verify that runtime taxonomy and contracts clarify boundaries without extensively dismantling Utopia, then freeze the v1 classification.

## Required tests
1. Core does not depend on specific business apps;
2. At least one Platform Service can be used by two higher-level consumers through a public contract;
3. At least one Native App achieves logical independence with embedded UX;
4. Connector failures do not contaminate Core truth;
5. Disabling or crashing an App does not bring down unrelated capabilities;
6. The Capability Registry agrees with runtime reality and user surfaces;
7. Single-repository boundary tests prevent obvious reverse dependencies;
8. No code moves without demonstrated benefit are required merely to tidy classifications.

## Freeze outcomes
Allowed:
- `UTOPIA_RUNTIME_ARCHITECTURE_V1_ACCEPTED`
- `CLASSIFICATION_ACCEPTED_CODE_MOVES_DEFERRED`
- `KEEP_CURRENT_STRUCTURE_NO_MEASURED_BENEFIT`

The latter two may also be successful conclusions.

## Boundary
URA-990 does not automatically authorize a physical repository split.
