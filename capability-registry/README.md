# Capability Registry / 能力登记册

> **Status: ACTIVE / CITYWIDE / PERSISTENT CONTROL-PLANE INFRASTRUCTURE**

Human-readable documentation is maintained bilingually:

- [中文说明](./README.zh-CN.md)
- [English guide](./README.en.md)

Machine-readable sources:

- [CAPABILITY_INDEX.yaml](./CAPABILITY_INDEX.yaml) — registry index and canonical record references
- [SURFACE_INDEX.yaml](./SURFACE_INDEX.yaml) — user-surface/navigation inventory
- [CAPABILITY_RECORD_TEMPLATE.yaml](./CAPABILITY_RECORD_TEMPLATE.yaml) — required schema for new capability records
- [中文暴露矩阵](./CAPABILITY_EXPOSURE_MATRIX.zh-CN.md)
- [Exposure matrix (English)](./CAPABILITY_EXPOSURE_MATRIX.en.md)

This registry answers:

> **What capability exists, where is it implemented, what does the user actually see/control, and what exact evidence proves that state?**

Mission Book answers **what work should happen next**.  
Capability Registry answers **what the city currently has and how that capability is exposed**.

The two MUST be updated together whenever a capability is added or materially changed.

## 中文入口说明 / Chinese entry explanation

这是 ACTIVE / CITYWIDE / PERSISTENT 控制面基础设施，记录城市现有能力、真实实现位置、用户可见可控范围和精确证据，不是任务调度器。上方 README.zh-CN.md 与 README.en.md 是完整对应语言说明。机器入口分别为能力索引、用户界面索引和新记录schema；中英矩阵是人工审查视图。Mission Book 回答下一步做什么，登记册回答已经有什么及如何暴露；新增或实质修改能力时二者必须连锁更新。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

目录数量实测于2026-10-06；状态是既有文档记录，不是新运行验收。 / Directory counts measured on 2026-10-06; status reflects existing documentation rather than new runtime acceptance.

| 项目 / Item | 值 / Value |
|---|---|
| 直接子目录 / Direct subdirectories | 1 |
| 递归Markdown文档 / Recursive Markdown documents | 6 |
| 状态 / Status | ACTIVE / CITYWIDE / PERSISTENT (existing registry / 既有登记册) |
| 语言 / Language | 同文中英或明确互链语言对 / Same-file bilingual explanations or linked language pairs |

### 文档与资源导航 / Documents and resources

| 入口 / Entry | 用途 / Purpose |
|---|---|
| [CAPABILITY_EXPOSURE_MATRIX.en.md](./CAPABILITY_EXPOSURE_MATRIX.en.md) | 说明文档 / Explanatory document |
| [CAPABILITY_EXPOSURE_MATRIX.zh-CN.md](./CAPABILITY_EXPOSURE_MATRIX.zh-CN.md) | 说明文档 / Explanatory document |
| [CAPABILITY_INDEX.yaml](./CAPABILITY_INDEX.yaml) | 既有结构化索引/模板，本次未修改 / Existing structured index/template, unchanged in this documentation work |
| [CAPABILITY_RECORD_TEMPLATE.yaml](./CAPABILITY_RECORD_TEMPLATE.yaml) | 既有结构化索引/模板，本次未修改 / Existing structured index/template, unchanged in this documentation work |
| [README.en.md](./README.en.md) | 说明文档 / Explanatory document |
| [README.md](./README.md) | 说明文档 / Explanatory document |
| [README.zh-CN.md](./README.zh-CN.md) | 说明文档 / Explanatory document |
| [SURFACE_INDEX.yaml](./SURFACE_INDEX.yaml) | 既有结构化索引/模板，本次未修改 / Existing structured index/template, unchanged in this documentation work |

### 子目录 / Subdirectories

| 入口 / Entry | 递归Markdown数量 / Recursive Markdown count |
|---|---|
| [records](./records/README.md) | 1 |
