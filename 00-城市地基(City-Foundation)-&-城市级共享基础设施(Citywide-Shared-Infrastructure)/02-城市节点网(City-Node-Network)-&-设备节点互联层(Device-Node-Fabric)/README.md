# 城市节点网 City Node Network — 设备节点互联层 Device Node Fabric

STATUS = STRUCTURAL_SLOT
PROJECT_MAPPING = PENDING_REVIEW
CURRENT_IMPLEMENTATION_SOURCE = Codex-Boss
FUTURE_EXTRACTION = PRESET_NOT_NOW

Shared city infrastructure for authorized device/node identity, registration, membership, liveness, hardware/resource advertisement, capability-host advertisement and cross-device presence/coordination contracts.

## Future extraction preset

The long-term design allows Node Fabric to be extracted from Codex-Boss, but **not before its internal boundary is stable**.

Candidate material to extract from Boss includes:

- node/device identity contracts below Owner/Root authority;
- node registry and membership;
- heartbeat, liveness and node-state derivation;
- hardware/resource probing and advertisement;
- node capability-host advertisement;
- node discovery and runtime endpoint metadata;
- generic cross-device presence/coordination contracts.

Current Boss seed surfaces include `src/shared/tenx/node.ts`, the membership/liveness portions of `src/shared/tenx/fleet.ts`, `src/shared/node-capabilities.ts`, and generic node profile/telemetry contracts.

## Must stay outside the extraction

- Owner / Root Trust and constitutional authority;
- city-wide authority policy;
- Hns worker scheduling, engineering queues and resource budgeting;
- domain-specific task execution policy.

Task scheduling **using** a node is not the same thing as Node Fabric itself.

## Extraction gate

A separate package/repository/service becomes justified only when Node Fabric is independently testable, exposes a stable public contract, no longer depends on Boss-private state, and gains a real lifecycle/failure-domain benefit from separation.
