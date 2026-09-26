# 城市服务网 City Service Network — 能力注册发现层 Capability Registry & Discovery Layer

STATUS = STRUCTURAL_SLOT
PROJECT_MAPPING = PENDING_REVIEW

This module describes the city-wide capability fabric.

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
