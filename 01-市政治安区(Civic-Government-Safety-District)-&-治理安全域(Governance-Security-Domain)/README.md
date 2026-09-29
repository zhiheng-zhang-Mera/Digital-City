# 市政治安区 Civic Government & Safety District — Governance & Security Domain

STATUS = PROJECT_FIRST_PARTIAL

This district contains qualification, admission and runtime hard-boundary enforcement. City Core itself remains in 00.

## Existing independent project
**Boss-Qualification-Control** remains an independent qualification/real-soak/attestation/promotion control plane.

## Customs / ADMIT — Boss ∪ Hns donor target
The admission target takes a functional union:

**Boss:** permission manifests, plugin contracts, requested permissions/capabilities, authority boundaries, city lifecycle/admission semantics.

**Hns:** plugin manifest validation, adapter detection, compatibility checks, install/enable/load lifecycle, declared dependencies/fallbacks and lockfile drift verification.

Hns contributes admission mechanics; Boss supplies city authority semantics.

## Runtime Compliance / ENFORCE
Primarily a Boss-derived city function:
- privilege/cross-domain/protected-resource enforcement;
- service/capability registration enforcement;
- authority-escalation rejection;
- city-wide runtime-policy application;
- audit-friendly verdicts.

Hns local execution guards and contract-validation/fault-isolation patterns may contribute implementation techniques, but do not become city-wide police authority.

## Boundary
```text
00 Core: authority facts
01 Governance: admit/enforce using those facts
```
Domain-quality rules stay in their domains.
