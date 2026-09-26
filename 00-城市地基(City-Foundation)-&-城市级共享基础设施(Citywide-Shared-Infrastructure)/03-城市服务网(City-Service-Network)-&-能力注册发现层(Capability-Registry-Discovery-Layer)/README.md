# 城市服务网 City Service Network — 能力注册发现层 Capability Registry & Discovery Layer

STATUS = STRUCTURAL_SLOT
PROJECT_MAPPING = PENDING_REVIEW
CURRENT_IMPLEMENTATION_SOURCE = Codex-Boss
FUTURE_EXTRACTION = PRESET_NOT_NOW

This module describes the city-wide Capability Fabric.

It answers:

- what capabilities currently exist;
- which building/service/resident/device provides them;
- version and compatibility metadata;
- requested permissions and dependencies;
- discovery and provider selection;
- invocation contract references;
- availability/health references.

## Important boundary

```text
Capability != Plugin
Plugin = one packaging / extension / admission form for a capability provider
```

Capabilities may be native services, building APIs, device capabilities, resident abilities, external connectors, or plugins.

Node Fabric owns node/device presence and runtime-host facts. Capability Fabric may reference eligible hosts, but it does not own device identity or transport truth.

## Future extraction preset

The long-term design allows Capability Fabric to be extracted from Codex-Boss, but it should first become a clean internal subsystem.

Candidate material to extract includes:

- capability identity and manifest model;
- capability/provider registry;
- provider mapping and discovery;
- version/dependency/compatibility metadata;
- capability broker boundary;
- plugin/provider registration and lifecycle contracts;
- generic credential-reference and least-privilege invocation boundary;
- capability availability/health references.

Current Boss seed surfaces include `electron/capability/**`, `config/capabilities/**`, `config/capability-modules.json`, `src/shared/provider-capabilities.ts`, and generic provider/capability contracts.

## Must stay outside the extraction

- Owner / Root Trust as the source of authority;
- constitutional permission policy;
- domain business state;
- domain-specific capability implementations;
- node/device identity truth owned by Node Fabric.

## Extraction gate

A separate package/repository/service becomes justified only after the boundary is independently testable, multiple city domains consume it through a stable public contract, Boss-private-state dependencies are removed, and separation provides a real independent upgrade/failure-domain benefit.
