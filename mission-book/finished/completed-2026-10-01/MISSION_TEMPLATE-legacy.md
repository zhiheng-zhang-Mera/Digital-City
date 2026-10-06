---
mission_id: MB-XXX
sequence: 999
execution_enabled: false
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: NOT_STARTED
migration_complete: false
migration_completion_basis: null
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
repair_sequence: null
repair_status: null
repair_reason: null
---

# MB-XXX — Mission title

> 新 Mission 只有在 donor 已经存在对应行为且 Owner 决定进入队列后，才可把 `execution_enabled` 改为 true。  
> `migration_complete=true` 必须同时设置 `migration_completion_basis`：`IMPLEMENTED_COMPLETE | OWNER_ACCEPTED_COMPLETE | SKIPPED_NOT_REQUIRED`。完整评估后决定完全不迁时，使用 `SKIPPED_NOT_REQUIRED`，并同步 `verification_complete=true` / `verification_status=NOT_REQUIRED_SKIPPED_COMPLETE`。

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

> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first v2）  
> **LATEST OWNER RULING:** [`response-9-30.md`](./response-9-30.md)  
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](./response-9-29.md) where not superseded  
> [`past-rules/`](./past-rules/) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的 mission-specific gates 与当前 front matter 继续有效；若与 Owner 最新裁决冲突，以最新日期 response 为准。


[阅读译本 / Reading translation](./en/MISSION_TEMPLATE-legacy.md)
