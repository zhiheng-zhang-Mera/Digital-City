---
mission_id: MB-XXX
sequence: 999
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

# MB-XXX — Mission title

> 新 Mission 只有在“donor 已经存在对应行为”且 Owner 决定进入迁移队列后，才可把 `execution_enabled` 改为 true。

## 目标
## Donor / 冻结基线
## City 归属与落地边界
## 允许迁移的既有行为
## 明确禁止 / 不属于本 Mission
## Migration 完成门槛
## Verification 完成门槛
## Claim / 主机领取记录
## Mission-specific evidence


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

