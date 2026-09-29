# 城市节点网 City Node Network — Device Node Fabric

```text
STATUS = REFERENCE_IMPLEMENTATION_EXISTS
LONG_TERM_PRIMARY_SOURCE = Codex-Boss
CURRENT_REFERENCE_IMPLEMENTATION = Utopia dev-gateway + reference-node
UTOPIA_SNAPSHOT = 393f3b89a9c4fae61be1e431c4bcd47fee945e88
```

## Ownership

Node Fabric owns authorized **runtime/computing node presence**:

- node/device principal identity below Owner/Root authority;
- registration and membership;
- heartbeat/liveness/offline truth;
- runtime endpoint metadata;
- hardware/resource telemetry and advertisement;
- capability-host advertisement.

Utopia already implements a bounded reference version: node registration, heartbeat, telemetry, capability lists and offline detection.

## Boundary with 08 Device & Edge

```text
Node Fabric = “which authorized runtime/compute node is present?”
08 Device & Edge = “which physical sensor/actuator capability exists?”
```

A Windows PC can be a Node. A VR glove is a Device capability. A phone may be only a control client today and become a Node later only if it explicitly advertises executable capabilities.

## Boundary with Hns

Hns may schedule Engineering work **onto** nodes, but worker queues/resource policy are not Node Fabric ownership.

Physical extraction from Boss is optional and must not block Utopia reference-product progress.
