# Project Foreman — 工程任务编排器

```text
STATUS = PROJECT_FIRST_COMPOSITE_IMPLEMENTATION
PRIMARY_PROJECT = DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973
SECONDARY_DONOR = Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
UNION_ID = engineering-runtime-union
```

## Role
Own Engineering-domain inspection, planning, scheduling, supervision, verification, repair and closeout.

## Boss contribution
Autonomous goal/convergence loop; repo/code/world models; finding scope; independent review; verification policy/targeted tests; acceptance/final gates; git rollback; CI repair/recovery; durable progress/results/evidence; fail-closed completion.

## Hns contribution
Engineering plan/DAG; provider/worker assignment; adaptive resource scheduling; constrained task packages; isolated worktrees/file ownership; checkpoint/resume; multi-signal stall/crash detection; retry/reassignment; integration worktree; final validation; cross-volume cleanup/continuity.

## Target flow
```text
inspect → model → goal → plan/DAG → assign → execute isolated → observe/recover
→ review → targeted verify → integrate → full acceptance → evidence/result
```

No source loses a useful verified capability merely because the other has a similar implementation.

## Boundary
City-wide authority/priority, global Capability/Node truth, qualification and non-Engineering business logic stay outside.

## 中文说明 / Chinese explanation

状态为 `PROJECT_FIRST_COMPOSITE_IMPLEMENTATION`，主要来源为上述 DS-Hns 快照，次级来源为上述 Boss 快照，联合标识 `engineering-runtime-union`。工头拥有工程检查、规划、调度、监督、验证、修复和收尾。

Boss 贡献自主目标/收敛循环、仓库代码世界模型、finding 范围、独立评审、验证政策/定向测试、验收最终门禁、git 回滚、CI 修复恢复、持久进展/结果/证据与保守完成判定。Hns 贡献计划/DAG、提供者/worker 分配、自适应资源调度、受限任务包、隔离 worktree/文件所有权、检查点恢复、多信号停滞崩溃检测、重试重派、集成 worktree、最终验证和跨卷清理连续性。

目标流程为检查 → 建模 → 目标 → 计划/DAG → 分配 → 隔离执行 → 观察恢复 → 评审 → 定向验证 → 集成 → 完整验收 → 证据结果。另一来源存在相似实现，不是删除已验证有用能力的理由。城市权威/优先级、全局能力节点事实、资格及非工程业务逻辑不归此处。

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
