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
