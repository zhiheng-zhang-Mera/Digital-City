---
mission_id: MB-012
sequence: 12
execution_enabled: false
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: NOT_STARTED
migration_complete: false
migration_claim_host: null
migration_claimed_at: null
migration_branch: null
migration_head_sha: null
migration_ci: null
migration_report: null
verification_status: NOT_STARTED
verification_complete: false
verification_claim_host: null
verification_claimed_at: null
verification_head_sha: null
verification_ci: null
verification_report: null
merged_main_sha: null
---

# MB-012 — Runtime Compliance Enforcement 抽取（延期/禁领）

> **当前可领取：NO — PRESET_NOT_NOW — runtime enforcement 独立抽取条件尚未满足**

## 目标

仅在 Owner 显式启用且 extraction gate 成立后，从 Boss 已有 runtime enforcement 行为抽取 01/02 Public Security；当前不得施工。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City 归属与落地边界

- **City owner:** 01/02 Public Security — Runtime Compliance Enforcement
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/01-governance/02-runtime-compliance`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- privilege/cross-domain/protected-resource access enforcement。
- service/capability registration enforcement hooks。
- authority escalation rejection。
- runtime-policy decision application 与 audit-friendly verdict。

## 明确禁止 / 不属于本 Mission

- Owner/Root authority source。
- constitutional protected-surface definition。
- domain-local policy/business state。
- qualification/promotion control。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-012/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 启用前必须证明 enforcement contract 稳定、独立可测、多边界复用且分离有真实 lifecycle/failure-domain 价值。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-012/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **UNCLAIMED**
- Claimed at: —
- City claim commit: —
- Implementation branch: —

### Verification Claim

- Host: **UNCLAIMED**
- Claimed at: —
- City claim commit: —
- Reviewed migration branch: —


## 绑定执行条件（所有 Mission 强制）

> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first v2）  
> **OWNER RULINGS:** [`response.md`](./response.md)  
> [`past-rules/`](./past-rules/) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若与 Owner 最新裁决冲突，以 `response.md` 为准。

## Mission-specific evidence

- extraction-gate evidence required before claim
