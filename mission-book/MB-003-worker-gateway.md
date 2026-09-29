---
mission_id: MB-003
sequence: 3
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: NOT_STARTED
migration_complete: false
migration_claim_host: null
migration_claimed_at: null
migration_branch: null
migration_head_sha: null
migration_ci: null
migration_report_zh_cn: null
migration_report_en: null
verification_status: NOT_STARTED
verification_complete: false
verification_claim_host: null
verification_claimed_at: null
verification_head_sha: null
verification_ci: null
verification_report_zh_cn: null
verification_report_en: null
merged_main_sha: null
---

# MB-003 — Worker Gateway Boss/Hns Union 纯迁移

> **当前可领取：YES**

## 目标

把 Hns 为主、Boss 为补充的 Engineering provider/runtime adapter 行为迁入 02/02 Worker Gateway，保留 Skill Intake 已迁成果，不搬运 vendor 产品壳。

## Donor / 冻结基线

- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City 归属与落地边界

- **City owner:** 02/02 Worker Gateway — Engineering Provider Adapter Layer
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/02-engineering/02-worker-gateway`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- provider/runtime detect/version/capabilities/readiness。
- create/attach/start、bounded work submit、status/progress、cancel/interrupt、result/evidence。
- Hns worker/task contract、provider adapter、readiness/health；Boss provider-session/router/circuit-breaker/outcome 语义。
- unsupported-capability refusal 与 donor 中已存在的 checkpoint/resume adapter 能力。

## 明确禁止 / 不属于本 Mission

- Foreman 计划/DAG/全局调度。
- DSH/DeepSeek 专属 UI、auth/updater、billing/notifications/settings。
- City-global Capability registry 真值。
- 重写/分叉官方 Codex/DeepSeek/Claude 等完整产品。
- Skill Intake 第二份实现。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- 双语 Migration 报告已提交：
  - `docs/migration-reports/MB-003/MIGRATION_REPORT.zh-CN.md`
  - `docs/migration-reports/MB-003/MIGRATION_REPORT.en.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 每台参与主机至少用其已安装且 donor 已支持的真实 provider 完成一次 detect→submit→progress→result/unsupported 的实际路径；环境缺失则任务 BLOCKED，不得 mock pass。
- provider failure/interruption/circuit-breaker 语义可观察且错误不被改写成成功。
- 既有 Skill Intake 回归保持全绿。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- 双语 Verification 报告已提交：
  - `docs/migration-reports/MB-003/VERIFICATION_REPORT.zh-CN.md`
  - `docs/migration-reports/MB-003/VERIFICATION_REPORT.en.md`
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

1. **纯迁移**：`MODE=MIGRATION_ONLY`。只能搬运、拆分、接口适配、接线、等价重构、测试与证据化 donor 中已经存在的行为；不得新增 donor 中不存在的产品能力、策略或语义。
2. **两个独立完成状态**：`MIGRATION_COMPLETE` 与 `VERIFICATION_COMPLETE` 分开维护；前者不代表可进入 `main`。
3. **领取前先向 Digital-City main 报到**：领取主机必须先在本文件 Claim 区填写主机标识、角色、时间，并提交到 City 仓库。发生写冲突时必须重新读取最新状态并重新选任务。
4. **任务已被领取且对应阶段未完成时，其他主机必须跳过该任务**，不得抢占。
5. **同一 Mission 严格两台主机**：一台只承担 Migration，一台只承担 Verification；同一主机一旦出现在本 Mission 的任一 Claim 中，不得再次领取该 Mission 的任何角色。Hosted CI runner 不计入“参与主机”。
6. **选择顺序**：先选择 `EXECUTION_ENABLED=true` 且尚未迁移、无人领取、依赖满足的 Mission；按 `SEQUENCE` 升序。只有当前没有可领取迁移任务时，才选择已迁移但未验证、无人领取的 Mission；同样按 `SEQUENCE` 升序。
7. **Migration 分支**：迁移主机默认从目标实现仓库最新 `main` 新建 `mission/<MISSION_ID>-<slug>` 分支；迁移阶段不得合入目标仓库 `main`。City 仓库中的 Claim/状态元数据更新不受此限制。
8. **Migration 报告**：迁移主机必须在目标实现分支提交迁移施工报告，并明确记录“落地边界”：donor SHA、source→target 路径、保留行为、明确未迁内容、接口/契约、现有 UI/实际消费路径、测试、数据/错误记录、已知限制、证据位置、分支 HEAD/CI 状态。Utopia 中的非代码文档保持中英双份。
9. **Verification 必须先独立审查，后看迁移报告**：验证主机先只依据 donor、目标代码、diff、测试和运行状态完成独立 code review，并在验证报告中记录独立发现；之后才读取 Migration 报告作为二次参考。
10. **Verification 可直接维修同一迁移分支**：验证主机在对应 Migration 分支实施必要的二次维修、补测、真实 UI/使用落地验证、故障/恢复验证和证据补全，但不得扩大 Mission 功能边界。
11. **合并门禁**：验证完成后，目标实现仓库所有 required CI + 本 Mission 指定检查必须全绿，方可合入 `main`。不得用跳过/删除测试、放宽验收、修改目标语义来换绿。
12. **最终报告**：验证主机合并前/后提交 Verification 报告，记录独立审查、参考 Migration 报告后的差异、维修、真机/第二机结果、失败与恢复、CI run、最终 branch SHA、merge SHA 和证据。
13. **异常领取恢复**：自动施工者不得自行清空 Claim。若 Claim 后尚未产生任何实现提交/报告，Owner 可显式 reset；若已经产生实质工作但主机无法完成，则本 Mission 标记 `BLOCKED_OWNER_DECISION`，不得引入第三台主机偷偷接力，需由 Owner 决定是否建立 superseding Mission。
14. **不允许“为了验收而造新 UI”**：真实 UI/使用落地必须复用 Utopia 已存在的 Web/Android/Services/Tasks/Activity 等消费面或 donor 已存在的 UI 行为；若现有产品面无法消费该能力，则记录为边界/阻塞，不得把新产品功能伪装成迁移。


## Mission-specific evidence

- real provider receipts
- provider/version/readiness snapshots
- interrupt/failure receipts
- existing Skill Intake regression
