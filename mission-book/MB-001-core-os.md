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
verification_status: CLAIMED
verification_complete: false
verification_claim_host: Mech
verification_claimed_at: 2026-09-29T15:30:00Z
verification_head_sha: null
verification_ci: null
verification_report: null
merged_main_sha: null
---

# MB-001 — Codex-Boss Core OS 纯迁移

> **当前可领取：Verification 已由主机 `Mech` 领取**（Migration 由 `Alien` 完成；`Alien` 不得再领取本 Mission 任何角色）。

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
- Report: [`reports/MB-001/MIGRATION_REPORT.md`](./reports/MB-001/MIGRATION_REPORT.md)
- Not merged to `main`; `mission:finalize` deliberately not run (that belongs to the Verification host)

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-29T15:30:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-001/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-001-core-os` @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`
- Selection note: selected under mission rule 6's second clause. No migration was claimable (`MB-007`/`MB-008` are claimed by `Alien`; `MB-010`–`MB-012` have `execution_enabled: false`), so the verification queue is the claimable set, and `MB-001` is its lowest sequence. `Mech` is a different host from this Mission's migration host (`Alien`), so rule 5 permits it.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened. The independent findings are recorded in the Verification Report under a section that precedes any reference to the migration host's own account.


## 绑定执行条件（所有 Mission 强制）

1. **纯迁移**：`MODE=MIGRATION_ONLY`。只能搬运、拆分、接口适配、接线、等价重构、测试与证据化 donor 中已经存在的行为；不得新增 donor 中不存在的产品能力、策略或语义。
2. **两个独立完成状态**：`MIGRATION_COMPLETE` 与 `VERIFICATION_COMPLETE` 分开维护；前者不代表可进入 `main`。
3. **领取前先向 Digital-City main 报到**：领取主机必须先在本文件 Claim 区填写主机标识、角色、时间，并提交到 City 仓库。发生写冲突时必须重新读取最新状态并重新选任务。
4. **任务已被领取且对应阶段未完成时，其他主机必须跳过该任务**，不得抢占。
5. **同一 Mission 严格两台主机**：一台只承担 Migration，一台只承担 Verification；同一主机一旦出现在本 Mission 的任一 Claim 中，不得再次领取该 Mission 的任何角色。Hosted CI runner 不计入“参与主机”。
6. **选择顺序**：先选择 `EXECUTION_ENABLED=true` 且尚未迁移、无人领取、依赖满足的 Mission；按 `SEQUENCE` 升序。只有当前没有可领取迁移任务时，才选择已迁移但未验证、无人领取的 Mission；同样按 `SEQUENCE` 升序。
7. **Migration 分支**：迁移主机默认从目标实现仓库最新 `main` 新建 `mission/<MISSION_ID>-<slug>` 分支；迁移阶段不得合入目标仓库 `main`。City 仓库中的 Claim/状态元数据更新不受此限制。
8. **Migration 报告**：迁移主机必须把快速施工报告提交到 `Digital-City/mission-book/reports/<MISSION_ID>/MIGRATION_REPORT.md`，并明确记录“落地边界”：donor SHA、source→target 路径、保留行为、明确未迁内容、接口/契约、现有 UI/实际消费路径、测试、数据/错误记录摘要、已知限制、Utopia 证据指针、分支 HEAD/CI 状态。City 不保存大体量原始运行日志。
9. **Verification 必须先独立审查，后看迁移报告**：验证主机先只依据 donor、目标代码、diff、测试和运行状态完成独立 code review，并在验证报告中记录独立发现；之后才读取 Migration 报告作为二次参考。
10. **Verification 可直接维修同一迁移分支**：验证主机在对应 Migration 分支实施必要的二次维修、补测、真实 UI/使用落地验证、故障/恢复验证和证据补全，但不得扩大 Mission 功能边界。
11. **合并门禁**：验证完成后，目标实现仓库所有 required CI + 本 Mission 指定检查必须全绿，方可合入 `main`。不得用跳过/删除测试、放宽验收、修改目标语义来换绿。
12. **最终报告**：验证主机把最终报告提交到 `Digital-City/mission-book/reports/<MISSION_ID>/VERIFICATION_REPORT.md`，记录独立审查、参考 Migration 报告后的差异、维修、真机/第二机结果、失败与恢复、CI run、最终 branch SHA、merge SHA 和 Utopia 证据指针。
13. **异常领取恢复**：自动施工者不得自行清空 Claim。若 Claim 后尚未产生任何实现提交/报告，Owner 可显式 reset；若已经产生实质工作但主机无法完成，则本 Mission 标记 `BLOCKED_OWNER_DECISION`，不得引入第三台主机偷偷接力，需由 Owner 决定是否建立 superseding Mission。
14. **不允许“为了验收而造新 UI”**：真实 UI/使用落地必须复用 Utopia 已存在的 Web/Android/Services/Tasks/Activity 等消费面或 donor 已存在的 UI 行为；若现有产品面无法消费该能力，则记录为边界/阻塞，不得把新产品功能伪装成迁移。
15. **Utopia 过程狗粮为强制施工数据**：领取后、实质施工前以及每个有意义的 change/test/runtime failure/recovery/Owner intervention/verifier finding/repair/CI/completion 节点，必须在 Mission implementation branch 使用 Utopia `pnpm mission:event -- ...` 追加结构化事件。大体量现场证据写入 `.runtime/evidence/mission-book/<MISSION_ID>/<run-id>/`；只有跨主机确有需要的有界非敏感证据才选择性发布到 `evidence/raw/mission-book/<MISSION_ID>/`。
16. **Episode 收口与双 CI**：Verification 主机先让实现代码 required CI 全绿并记录 `CI_RESULT=PASS`、`VERIFICATION_COMPLETE=PASS`，再运行 Utopia `pnpm mission:finalize -- ...` 生成 verified episode 并移除当前树 inbox；提交该纯数据收口后，**最终 branch HEAD 必须再次跑 required CI 并全绿**才允许 merge。City Verification Report 同时记录 implementation CI、final branch CI、episode path/digest 与最终 merge SHA。


## Mission-specific evidence

- authority/trust parity receipts
- task lifecycle + restart/recovery receipts
- Web/Android existing control-surface evidence
- source→target symbol/path ledger
