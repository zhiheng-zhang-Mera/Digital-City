---
mission_id: MB-002
sequence: 2
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: MIGRATION_COMPLETE
migration_complete: true
migration_claim_host: Mech
migration_claimed_at: 2026-09-29T12:02:31Z
migration_branch: mission/MB-002-capability-fabric
migration_head_sha: db3ac518de1d6125e00cee1d9ff6ff7868b58336
migration_ci: PASS — run 36568159888 (V0.2 checks) on 00607f8b243e166b112319b1663eebb3d763fcfc: gateway-web success, android success; the event-stream follow-up HEAD db3ac518de1d6125e00cee1d9ff6ff7868b58336 carries its own branch run
migration_report: mission-book/reports/MB-002/MIGRATION_REPORT.md
verification_status: NOT_STARTED
verification_complete: false
verification_claim_host: null
verification_claimed_at: null
verification_head_sha: null
verification_ci: null
verification_report: null
merged_main_sha: null
---

# MB-002 — Capability Fabric Boss/Hns Union 纯迁移

> **当前可领取：Verification 可领取**（Migration 阶段由主机 `Mech` 已完成且 CI 全绿，分支**未合入 main**；等待一台与 `Mech` 不同的主机领取 Verification）

## 目标

在不推翻 Utopia V0.3 已验收 Capability Bridge 的前提下，把 Boss/Hns 中已经实现且属于 city-global Capability Fabric 的可复用行为迁入 00/03。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- 现有 Utopia V0.3 Capability Bridge 作为已验收 reference baseline

## City 归属与落地边界

- **City owner:** 00/03 City Service Network — Capability Registry & Discovery
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/00-foundation/03-capability-fabric`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- Boss 的 capability/provider registry、broker/routing、provider health/discovery 与稳定 outcome/state 模型。
- Hns 的 capability/plugin dependency、lifecycle、adapter/compatibility、fallback/fault、health、config/lockfile verification 中 city-global 可复用部分。
- 保留现有 qualified identity、availability、bounded invocation/history/typed error 行为。

## 明确禁止 / 不属于本 Mission

- Engineering provider planning/worker pool（02/01/02）。
- Customs admission 与 runtime enforcement。
- Skill Intake 已 ACTIVE 的实现不得复制第二份。
- 扩大 operation allowlist、权限或网络暴露。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-002/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 现有五个 Utopia bridged services 的历史/当前验收向量全部保持通过。
- 至少覆盖一个 Boss provider/broker 场景和一个 Hns lifecycle/fallback/compat 场景的 donor parity。
- Web 与 Android 对 availability/result/error/history 的 digest/状态保持一致。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-002/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T12:02:31Z
- City claim commit: `bc2bbbdbac9ff670f2c9b3cbc93f091a7e46694b` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-002-capability-fabric` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Migration HEAD: `db3ac518de1d6125e00cee1d9ff6ff7868b58336` (implementation commit `00607f8b243e166b112319b1663eebb3d763fcfc` + the event-stream closeout commit)
- Migration CI: **PASS** — run `36568159888` (`V0.2 checks`) on `00607f8b243e166b112319b1663eebb3d763fcfc`: `gateway-web` success, `android` success. The follow-up event commit carries its own run on the same branch.
- Migration Report: [`reports/MB-002/MIGRATION_REPORT.md`](./reports/MB-002/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.

### Verification Claim

- Host: **UNCLAIMED** (must be a host other than `Mech`)
- Claimed at: —
- City claim commit: —
- Reviewed migration branch: —


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

- V0.3 regression matrix
- Boss provider/broker parity
- Hns lifecycle/fallback parity
- cross-client result/error/history evidence
