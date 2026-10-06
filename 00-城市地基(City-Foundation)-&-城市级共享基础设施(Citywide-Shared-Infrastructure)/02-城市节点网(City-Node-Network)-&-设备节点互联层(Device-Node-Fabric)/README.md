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

## 中文说明 / Chinese explanation

状态为 `REFERENCE_IMPLEMENTATION_EXISTS`。长期主要来源是 Boss，当前参考实现是上述 Utopia 快照的 dev-gateway 与 reference-node。节点网拥有 Owner/Root 之下获授权运行/计算节点的身份、注册成员关系、心跳存活离线事实、运行端点元数据、硬件资源遥测与通告，以及能力宿主通告。Utopia 已实现有边界的注册、心跳、遥测、能力列表和离线检测。

节点网回答“哪个获授权运行/计算节点在线”；08 设备边缘区回答“有哪些物理传感/执行能力”。Windows PC 可以是节点，VR 手套属于设备能力；手机当前可以只是控制客户端，只有明确通告可执行能力后才可能成为节点。Hns 可把工程工作调度到节点，但工作队列和资源政策不属于节点网。Boss 的物理拆分是可选工作，不能阻塞 Utopia 参考产品。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `REFERENCE_IMPLEMENTATION_EXISTS` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
