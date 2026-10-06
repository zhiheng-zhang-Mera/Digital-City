# 硬件网络参考 Hardware & Network Reference

STATUS = REFERENCE_ONLY_NON_BINDING  
SNAPSHOT_DATE = 2026-10-01

## 定位 / Scope

本目录保存 Digital-City 的**未来硬件与网络参考架构**，供后续设计、工程书、设备接入、验收与故障恢复讨论时参考。

**它不是当前实现契约，也不是强制代码架构。**

本目录不得被解释为：

- 当前可用设备清单；
- 任务领取资格的默认硬门禁；
- merge / CI / acceptance 的强制前置条件；
- 采购要求；
- 要求 Utopia、Remote Fabric、Engineering Manager 或其他项目必须按此拓扑实现；
- 要求未来硬件型号、操作系统数量、服务器数量与本文完全一致。

后续实现可以根据真实设备、成本、实验结果、平台限制和项目复杂度采用更简单或不同的方案。

> **Current runtime truth beats reference architecture.**
>
> 当前设备事实、运行时 capability registry、任务报告和实际验收结果，优先级永远高于本目录的未来参考设计。

## 当前可用设备事实 / Current Available Device Reality

截至 2026-10-01，当前已确认可用于施工/验收的设备仍然只有：

| 设备 | 当前平台 | 当前角色 |
|---|---|---|
| Alien | Windows | 可施工；Windows 适配/验收；Android 开发与桥接验收 |
| Mech | Windows | 可施工；Windows 适配/交叉验收；Android 相关施工/复验 |
| Android physical device ×1 | Android | 当前唯一已确认移动真机验收设备 |

**当前不存在、或尚未登记为可用施工/验收资源：**

- Linux Server A；
- Linux Server B；
- Mac；
- iPhone；
- HarmonyOS 真机；
- 其他未来计划设备。

因此，任何当前工程书都**不得因为这些未来设备不存在而阻塞**。

## 文件

- [FUTURE_TOPOLOGY.md](./FUTURE_TOPOLOGY.md) — 双 Linux + 多 Win/Mac + 多移动终端的未来参考拓扑。
- [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) — 后续开发时值得注意、但不应直接变成硬编码要求的原则。

## 参考使用规则 / How to Use This Reference

未来工程可以：

- 借鉴 capability-based routing；
- 借鉴双 Linux 冗余与 clean-room verifier 思路；
- 借鉴 Windows / macOS / mobile 的平台专属适配边界；
- 借鉴离线继续施工、恢复后 replay 的降级策略；
- 借鉴硬件升级不应传播到 City Core 的分层方式。

但任何规则若要成为真正的硬门禁，必须在对应项目中经过：

1. 当前真实需求确认；
2. 最小实现验证；
3. 明确 owner / failure boundary；
4. 单独的工程决策或验收规则落地。

**Reference ≠ requirement.**

## English explanation / 英文说明

### Scope and snapshot

This directory stores a future hardware/network reference for later design, engineering workbooks, device admission, acceptance and recovery discussions. Its recorded status remains `REFERENCE_ONLY_NON_BINDING`, with snapshot date 2026-10-01. It is neither a current implementation contract nor a mandatory code architecture.

It is not an available-device inventory, a default task-claim eligibility gate, a merge/CI/acceptance prerequisite, a procurement instruction, or a requirement that Utopia, Remote Fabric, Engineering Manager or any other project use this topology. Future models, OS counts and server counts need not match. Actual devices, cost, experiments, platform constraints and project complexity may justify a simpler or different implementation. Current device facts, runtime capability registry, task reports and acceptance results always take precedence.

### Device facts recorded on 2026-10-01

| Device | Platform | Recorded role |
|---|---|---|
| Alien | Windows | Engineering work; native Windows adaptation/acceptance; Android development and bridge acceptance |
| Mech | Windows | Engineering work; Windows adaptation/cross-acceptance; Android-related work and retesting |
| One physical Android device | Android | Only mobile physical acceptance device confirmed in this snapshot |

Linux Server A/B, Mac, iPhone, physical HarmonyOS and other planned devices did not exist or were not registered as available resources in that snapshot. Their absence must not block current workbooks. This is a dated record, not a fresh device availability check.

### Navigation

- [Future topology / 未来拓扑](./FUTURE_TOPOLOGY.md): advisory dual-Linux, multiple Windows/macOS and mobile topology.
- [Development notes / 开发注意事项](./DEVELOPMENT_NOTES.md): future engineering principles that should not become hardcoded requirements automatically.

Future work may borrow capability routing, dual-Linux redundancy and clean-room verification, platform-specific adapter boundaries, offline continuation/replay, and layering that keeps hardware upgrades out of City Core. A genuine hard gate requires confirmed current demand, minimum implementation validation, explicit ownership/failure boundaries, and a separate engineering decision or acceptance rule. Reference does not equal requirement.

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 3 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `REFERENCE_ONLY_NON_BINDING` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) — 中文与英文说明 / Chinese and English explanations.
- [FUTURE_TOPOLOGY.md](./FUTURE_TOPOLOGY.md) — 中文与英文说明 / Chinese and English explanations.
- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
