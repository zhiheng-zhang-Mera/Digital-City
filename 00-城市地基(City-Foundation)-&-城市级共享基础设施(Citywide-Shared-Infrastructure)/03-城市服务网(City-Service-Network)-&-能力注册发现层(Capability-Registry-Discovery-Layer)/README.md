# 城市服务网 City Service Network — Capability Fabric

```text
STATUS = REFERENCE_IMPLEMENTATION_EXISTS
LONG_TERM_SOURCES = Codex-Boss + DS-Hns
CURRENT_REFERENCE_IMPLEMENTATION = Utopia capability-bridge v1
UTOPIA_STATUS = V0_3_ACCEPTED_HARDENED
```

## Ownership

Capability Fabric answers:

- what capability exists;
- qualified identity and owning module;
- lifecycle/availability;
- dependencies/providers;
- where/how it can be invoked;
- health/result-history references.

The long-term behavior target remains the Boss/Hns functional union.

## Current Utopia reference

Utopia V0.3 already implements:

- qualified module identity;
- restrictive lifecycle-aware availability;
- bounded operation allowlists/input/result sizes;
- durable invocation status + summary/detail history;
- restart interruption truth;
- typed errors across Web/Android;
- five accepted service adapters.

This is a **reference implementation**, not proof that every City capability has migrated.

## Boundary with 02 Worker Gateway

Capability Fabric is city-global discovery/invocation metadata.

Worker Gateway is Engineering-specific and adapts official coding/engineering providers for Hns. A coding provider may register capabilities into the Fabric, but the Fabric does not become the Engineering planner.

```text
Capability != Plugin
Plugin = one packaging/admission form for a capability provider
```

## 中文说明 / Chinese explanation

状态为 `REFERENCE_IMPLEMENTATION_EXISTS`；长期来源是 Boss 与 DS-Hns，当前参考是 Utopia capability-bridge v1，原记录接受状态为 `V0_3_ACCEPTED_HARDENED`。服务网回答能力是否存在、合格身份和所属模块、生命周期/可用性、依赖和提供者、调用位置与方式，以及健康和历史结果引用。

Utopia V0.3 已实现合格模块身份、受生命周期约束的可用性、操作白名单与输入/结果大小限制、持久调用状态和摘要/详情历史、重启中断事实、Web/Android 类型化错误以及五个已接受适配器。这只是参考实现，不能证明所有城市能力均已迁移；长期行为目标仍是 Boss/Hns 功能联合。

服务网负责城市全局发现和调用元数据；02 Worker Gateway 面向 Hns 工程领域的官方编码/工程提供者。编码提供者可以注册能力，但服务网不成为工程规划器。能力不等同于插件；插件只是能力提供者的一种打包/准入形式。

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
