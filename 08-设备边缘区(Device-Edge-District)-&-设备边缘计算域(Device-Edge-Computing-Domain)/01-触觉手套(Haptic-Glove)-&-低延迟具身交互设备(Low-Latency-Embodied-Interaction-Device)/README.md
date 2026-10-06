# Haptic Glove — 触觉手套 / 低延迟具身交互设备

```text
STATUS = EXISTING_DEVICE_FIRMWARE_EXPERIMENT_NOT_PRODUCTION_QUALIFIED
REPOSITORY = https://github.com/zhiheng-zhang-Mera/My_VR_Glove
SOURCE_BRANCH = master
SOURCE_SNAPSHOT = 0775f593daa915d8d9f393f2665d3193c289e09c
PLATFORM = ESP32 / PlatformIO
```

## Role

Provide a device-side hand/haptic interaction endpoint for VR/embodied systems.

## Existing capability cluster

- single-pass linear serial decoding;
- non-blocking/ring-buffer style serial I/O;
- low-latency ESP32-oriented control path;
- high-rate servo haptic output (repository target: 250 Hz);
- proportional software power-budget limiting/"soft fuse";
- hardware pin/baud configuration through firmware.

## Boundary

This is device firmware, not the VR application, world model or City automation planner.

The high-rate servo mode is explicitly experimental and hardware-dependent; City mapping does not claim thermal/electrical safety or production qualification.

---

# 中文完整说明：触觉手套／低延迟具身交互设备

状态 `EXISTING_DEVICE_FIRMWARE_EXPERIMENT_NOT_PRODUCTION_QUALIFIED`；仓库 https://github.com/zhiheng-zhang-Mera/My_VR_Glove ；来源分支 `master`；快照 `0775f593daa915d8d9f393f2665d3193c289e09c`；平台 ESP32／PlatformIO。

## 角色
为 VR／具身系统提供设备端手部／触觉交互端点。

## 既有能力群
- 单遍线性串口解码；
- 非阻塞／环形缓冲式串口 I/O；
- 面向 ESP32 的低延迟控制路径；
- 高频舵机触觉输出（仓库目标为 250 Hz）；
- 比例式软件功率预算限制／“软保险丝”；
- 通过固件配置硬件引脚／波特率。

## 边界
这是设备固件，不是 VR 应用、世界模型或城市自动化规划器。高频舵机模式明确属于实验且依赖硬件；城市映射不声称已验证热／电气安全或生产资格。

## 快速信息与导航 / Quick facts and navigation

目录与文档数量于 2026-10-06 在本工作树实测；实现状态沿用文档记录，不代表重新验证产品运行时。 / Directory and document counts were measured in this worktree on 2026-10-06; implementation status is retained from the document and is not a fresh product-runtime validation.

| 项目 / Item | 实测值或记录值 / Measured or recorded value |
| --- | --- |
| 子目录（递归）/ Subdirectories (recursive) | 0 |
| Markdown 文档（递归，含本页）/ Markdown documents (recursive, including this page) | 1 |
| 实现状态 / Implementation status | `EXISTING_DEVICE_FIRMWARE_EXPERIMENT_NOT_PRODUCTION_QUALIFIED` |
| 本轮验证范围 / Validation scope | 文档、导航与语言配对；运行时未重测 / Documents, navigation and language pairing; runtime not retested |

### 导航 / Navigation

- [上级区说明 / Parent district](../README.md)
- 本页含完整英文及中文说明。 / This page contains complete English and Chinese explanations.
