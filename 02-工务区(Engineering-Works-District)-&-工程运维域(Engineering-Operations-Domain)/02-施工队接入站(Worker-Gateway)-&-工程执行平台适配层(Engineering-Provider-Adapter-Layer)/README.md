# Worker Gateway — 工程执行平台适配层

```text
STATUS = PROJECT_FIRST_COMPOSITE_IMPLEMENTATION
PRIMARY_PROJECT = DS-Hns
ADDITIONAL_DONOR = Codex-Boss
UTOPIA_PROMOTED_MODULE = skill-intake
```

## Role
Translate official engineering-agent/runtime products into a bounded Foreman-facing execution contract.

### Hns foundations
Official DSH integration; process/plugin/provider adapters; worker/task contracts; worker pool; Skill Intake; provider capabilities; readiness/health.

### Boss foundations
Web/API/Codex/local runtime adapters; role-router/provider-session registry; provider capability/profile/state/outcome models; circuit-breaker/health semantics; bounded dispatch/interruption/recovery.

## Target provider contract
Detect/version/capabilities/readiness; create/attach/start; submit bounded work; status/progress; cancel/interrupt; result/evidence; unsupported-capability refusal; optional checkpoint/resume.

Prefer official vendor software and stable process/API boundaries over forked vendor UI/runtime/auth/updaters.

## Boundary
Gateway does not own the Engineering plan, city-global registries, Node identity, provider reasoning or city-wide authorization.

## 中文说明 / Chinese explanation

状态为 `PROJECT_FIRST_COMPOSITE_IMPLEMENTATION`；主来源 DS-Hns，额外来源 Boss，Utopia 已提升模块为 `skill-intake`。接入站把官方工程代理/运行时产品转换为有边界、面向工头的执行契约。

Hns 基础包括官方 DSH 集成、进程/插件/提供者适配、worker/任务契约、worker pool、Skill Intake、提供者能力及就绪健康。Boss 基础包括 Web/API/Codex/本地运行适配、角色路由/提供者会话注册、能力画像状态结果模型、熔断健康语义及有边界派发中断恢复。

目标契约覆盖检测版本能力就绪、创建附加启动、提交受限工作、状态进展、取消中断、结果证据、拒绝不支持能力及可选检查点恢复。优先官方软件和稳定进程/API 边界。接入站不拥有工程计划、全局注册表、节点身份、提供者推理或城市授权。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_FIRST_COMPOSITE_IMPLEMENTATION` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
