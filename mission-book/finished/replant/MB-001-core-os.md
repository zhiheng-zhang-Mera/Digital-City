---
mission_id: MB-001
sequence: 1
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: COMPLETE
migration_complete: true
migration_claim_host: Alien
migration_claimed_at: 2026-09-29T11:52:10Z
migration_branch: mission/MB-001-core-os
migration_head_sha: a71bf9080294390a3e2c1482bb53930519d1b3b3
migration_ci: "final-branch 36566973111 PASS (gateway-web + android); implementation 36566575068 PASS"
migration_report: mission-book/reports/MB-001/MIGRATION_REPORT.md
verification_status: COMPLETE
verification_complete: true
verification_claim_host: Mech
verification_claimed_at: 2026-09-29T15:30:00Z
verification_head_sha: b2fb73b4cb1ae7bd92733f6873a2e681fae45aa1
verification_ci: "final-branch 36585164507 PASS (gateway-web + android); verification events 36584692434 PASS; repair 36583350117 PASS; merged-main 36585590593"
verification_report: mission-book/reports/MB-001/VERIFICATION_REPORT.md
merged_main_sha: d81a567268d7cab26b84eaf798fc7a25c8033b25
---

# MB-001 — Codex-Boss Core OS 纯迁移

> **当前状态：Verification 已由主机 `Mech` 完成，已合入 main**（Migration 由 `Alien` 完成；两台主机不同，符合 rule 5）。

## 目标

把 Codex-Boss 中已经实现的 City authority / runtime trust / global orchestration 核心从多用途 Boss 项目中抽出，落到 Utopia 的 00/01 Core OS 边界；不迁移 Boss 的其它域功能。

## Donor / 冻结基线

- `zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City 归属与落地边界

- **City owner:** 00/01 City Core — Runtime Trust & Orchestration Kernel
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/00-foundation/01-city-core`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- Owner sovereignty / Root Authority / Root Trust 与 protected-surface contracts。
- 全局 task identity/lifecycle/durable state。
- 跨域 orchestration/routing 与 city-scope runtime coordination。
- continuation/recovery 与 durable audit primitives。

## 明确禁止 / 不属于本 Mission

- Engineering goal/DAG/worker 行为（MB-003/004）。
- Research、Knowledge、Computer Use、Theme。
- Customs/Public Security 的可复用抽取（分别延期任务）。
- Boss 原产品壳、provider window、项目本地 settings/history/archive。
- 任何新的 authority policy 或新的治理语义。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-001/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 至少一条现有 Utopia task/control 流程真实消费迁移后的 Core 边界，并保持 Web/Android 状态真值一致。
- Root/Trust/authority 相关 donor parity 与 protected-surface 回归全绿。
- 重启/恢复后 durable task/audit 身份不被伪造为成功。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-001/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T11:52:10Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-001/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-001-core-os` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

#### Migration closeout

- City claim commit: `cc45ea203801d2c34c40924f55b4fa92b9b9768e`
- Migration head: `a71bf9080294390a3e2c1482bb53930519d1b3b3`
- Hosted CI: final branch `36566973111` PASS (gateway-web + android); implementation `36566575068` PASS
- Report: [`reports/MB-001/MIGRATION_REPORT.md`](../completed-2026-10-01/reports/MB-001/MIGRATION_REPORT.md)
- Not merged to `main`; `mission:finalize` deliberately not run (that belongs to the Verification host)

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-29T15:30:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-001/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-001-core-os` @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`
- Selection note: selected under mission rule 6's second clause. No migration was claimable (`MB-007`/`MB-008` are claimed by `Alien`; `MB-010`–`MB-012` have `execution_enabled: false`), so the verification queue is the claimable set, and `MB-001` is its lowest sequence. `Mech` is a different host from this Mission's migration host (`Alien`), so rule 5 permits it.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened. The independent findings are recorded in the Verification Report under a section that precedes any reference to the migration host's own account.

#### Verification closeout

- Verification head: `b2fb73b` (the verified episode commit); implementation repairs at `932196e`.
- Final branch CI: `36585164507` PASS (gateway-web + android). Verification-events CI: `36584692434` PASS. Repair CI: `36583350117` PASS.
- Episode: `data-records/evolution/episodes/mission-book/MB-001/episode.json` — `MB-001:16558c84c4d1547e`, status `VERIFIED`, sha256 `4f40ae9c0b09fc624de7927e1a66b886efaa1dfc2fa760dab0e2e9c66bd223f7`. `mission:finalize` ran and removed the current-tree inbox.
- Merge to `main`: `d81a567268d7cab26b84eaf798fc7a25c8033b25` (merge over `c7ef3cd`); its CI run `36585590593`.
- Report: [`reports/MB-001/VERIFICATION_REPORT.md`](../completed-2026-10-01/reports/MB-001/VERIFICATION_REPORT.md). Boundaries this verification did **not** establish are listed in that report's §7.7.


## 绑定执行条件（所有 Mission 强制）

> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first v2）  
> **OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若与 Owner 最新裁决冲突，以 `response-9-29.md` 为准。

## Mission-specific evidence

- authority/trust parity receipts
- task lifecycle + restart/recovery receipts
- Web/Android existing control-surface evidence
- source→target symbol/path ledger
