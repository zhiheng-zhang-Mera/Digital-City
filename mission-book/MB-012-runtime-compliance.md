---
mission_id: MB-012
sequence: 12
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
assessment_required: true
assessment_status: NOT_STARTED
assessment_complete: false
assessment_result: null
assessment_claim_host: null
assessment_claimed_at: null
assessment_branch: null
assessment_head_sha: null
assessment_utopia_base_sha: null
assessment_report: null
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

# MB-012 — Runtime Compliance Enforcement 抽取价值评估 / 条件迁移

> **当前可领取：YES — ASSESSMENT_FIRST。**  
> 自动施工机可以领取，但**领取不等于必须迁移**。领取后先比较冻结 donor 与领取时 Utopia 最新 `main`；只有存在可证实、值得补足的缺口时才允许继续迁移。

## 目标

评估 Boss runtime enforcement 相对于当前 Utopia City Core、Capability Fabric、Worker Gateway 与运行时服务已经存在的权限/边界执行是否仍有独立价值；只迁移能补足真实 runtime enforcement 缺口的部分。

本 Mission 采用 **Assessment → conditional Migration → conditional Verification**：

- `FULL_MIGRATION`：donor 计划能力整体仍有独立价值，进入完整 Migration。
- `PARTIAL_MIGRATION`：仅迁移能补足 Utopia 真实缺口的子集；其余能力显式放弃并保留理由。
- `NO_VALUE`：当前 Utopia 已等价/更优覆盖，或 donor 行为已过时、错误归属、需要新增能力才能成立、没有独立 lifecycle/failure-domain 价值等；**不迁移**，向 City 报告：**“判断无价值，任务保留，未迁移”**。

`NO_VALUE` 是终态评估结果，不代表 Migration 完成；任务继续保留用于 provenance / 论文素材 / 未来 Owner 重开。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City 归属与候选落地边界

- **City owner:** 01/02 Public Security — Runtime Compliance Enforcement
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **候选目标路径:** `city/01-governance/02-runtime-compliance`
- **依赖 Mission:** 无
- 真正落地前必须重新核对当前 City map；若 ownership 已变化，停止并向 City 报告，不得自行改 ownership。

## 项目书计划能力 / Planned donor capability set

- **RC-01** — privilege / cross-domain / protected-resource access enforcement
- **RC-02** — service / capability registration enforcement hooks
- **RC-03** — authority escalation rejection
- **RC-04** — runtime-policy decision application
- **RC-05** — audit-friendly runtime verdict / enforcement evidence

## 领取时必须核对的 Utopia 当前能力

领取主机必须记录**领取时** Utopia `main` 精确 SHA 到 `assessment_utopia_base_sha`，不得只依赖本任务创建时的旧印象。至少检查：

- `city/00-foundation/01-city-core/**` 的 runtime trust / authority / protected-surface enforcement。
- `city/00-foundation/03-capability-fabric/**` 与 `services/capability-bridge/**` 的 registration/provider boundaries。
- `city/02-engineering/01-project-foreman/**`、`02-worker-gateway/**` 及其他当前 runtime dispatch/execution gates。
- `city/CITY_IMPLEMENTATION_MANIFEST.json`、registry/census 与 shared contracts。
- 当前真实 Windows/Android/service runtime 中已有 privilege/domain/resource rejection 和 audit verdict 路径。

还必须搜索与计划能力语义等价但路径不同的实现、测试、registry/manifest、runtime consumer 和历史 relocation；“目标目录不存在”本身**不能**证明 Utopia 缺能力。

## 领取后必须填写的能力对照表

> 这张表必须直接更新在本 Mission 文件中，保存 compact decision truth；完整证据与过程放 `ASSESSMENT_REPORT.md` 和 Utopia 既有素材点。

| ID | 计划能力（donor） | Utopia 当前等价/相关能力 | 覆盖判定 | 决策 | 不迁/部分迁理由 | 证据 |
|---|---|---|---|---|---|---|
| RC-01 | privilege / cross-domain / protected-resource access enforcement | 领取时填写 | 领取时填写：NONE / PARTIAL / EQUIVALENT / SUPERIOR | 领取时填写：MIGRATE / PARTIAL / ABANDON | 领取时填写 | 领取时填写 |
| RC-02 | service / capability registration enforcement hooks | 领取时填写 | 领取时填写：NONE / PARTIAL / EQUIVALENT / SUPERIOR | 领取时填写：MIGRATE / PARTIAL / ABANDON | 领取时填写 | 领取时填写 |
| RC-03 | authority escalation rejection | 领取时填写 | 领取时填写：NONE / PARTIAL / EQUIVALENT / SUPERIOR | 领取时填写：MIGRATE / PARTIAL / ABANDON | 领取时填写 | 领取时填写 |
| RC-04 | runtime-policy decision application | 领取时填写 | 领取时填写：NONE / PARTIAL / EQUIVALENT / SUPERIOR | 领取时填写：MIGRATE / PARTIAL / ABANDON | 领取时填写 | 领取时填写 |
| RC-05 | audit-friendly runtime verdict / enforcement evidence | 领取时填写 | 领取时填写：NONE / PARTIAL / EQUIVALENT / SUPERIOR | 领取时填写：MIGRATE / PARTIAL / ABANDON | 领取时填写 | 领取时填写 |

### 推荐理由码

- `DUPLICATE_EQUIVALENT`：Utopia 已语义等价覆盖。
- `UTOPIA_SUPERIOR`：Utopia 当前实现更完整/更适合现架构。
- `OBSOLETE_DONOR`：donor 行为已过时或只为旧架构服务。
- `WRONG_OWNERSHIP`：能力应属于其他 building/domain，不应在本 Mission 重复迁移。
- `NEW_FEATURE_REQUIRED`：要成立必须创造 donor 中不存在的新能力，违反 migration-only。
- `NO_INDEPENDENT_VALUE`：拆出后没有独立 lifecycle / failure-domain / reuse 价值。
- `NO_REAL_CONSUMER`：当前没有真实消费边界，且为验收造 consumer 会扩大产品能力。
- `GAP_CLOSURE`：存在可证实缺口，donor 子能力可直接补足。
- `PARTIAL_GAP_CLOSURE`：只有 donor 的一个有界子集值得迁移。

不得仅凭“donor 中存在代码”判定值得迁移。

## Assessment 领取与执行流程

1. 在 Digital-City `main` 更新本文件：
   - `assessment_status: IN_PROGRESS`
   - `assessment_claim_host` / `assessment_claimed_at`
   - 当前 Utopia `main` SHA → `assessment_utopia_base_sha`
2. 从该 Utopia SHA 建立 `mission/MB-012-runtime-compliance`；此时允许只有**记录/证据变更**，不得先写迁移实现。
3. 使用 Utopia 现有 event contract，以 `role=MIGRATION` 记录 `MISSION_CLAIMED`、`ATTEMPT_STARTED`、必要的 `TEST_PASS/TEST_FAIL` 等；**不得自造 eventType**。
4. 完成 donor source map + 当前 Utopia capability inventory + capability-by-capability parity/gap 对照。
5. 在 City 创建：
   - `mission-book/reports/MB-012/ASSESSMENT_REPORT.md`
6. 写出唯一 verdict：`FULL_MIGRATION | PARTIAL_MIGRATION | NO_VALUE`。
7. 把 assessment branch push，并记录 `assessment_branch` / `assessment_head_sha` / `assessment_report`。

### NO_VALUE 收口

若 `assessment_result: NO_VALUE`：

- **禁止修改 Utopia 产品/运行代码。**
- 更新：
  - `assessment_status: COMPLETE_NO_VALUE`
  - `assessment_complete: true`
  - `migration_status: NOT_REQUIRED_NO_VALUE`
  - `migration_complete: false`
  - `verification_status: NOT_REQUIRED_NO_MIGRATION`
  - `verification_complete: false`
- City 报告必须显式写：**判断无价值，任务保留，未迁移**。
- assessment branch 保留为研究/provenance 分支，**不 merge、不删除**；City 报告记录 immutable HEAD。
- 调度器以后必须把该状态视为终态并 skip，除非 Owner 显式 reset/reopen。

### FULL / PARTIAL 继续施工

若 verdict 为 `FULL_MIGRATION` 或 `PARTIAL_MIGRATION`：

- assessment host 自动成为本 Mission 的 Migration Host，不重新竞抢；
- `migration_claim_host = assessment_claim_host`；
- `migration_branch = assessment_branch`；
- 只有 capability matrix 中标记 `MIGRATE/PARTIAL` 的行允许进入实现；
- `PARTIAL_MIGRATION` 必须把放弃项及理由带入 Migration Report，禁止施工时悄悄扩大范围。

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

仅当 Assessment verdict 为 `FULL_MIGRATION` 或 `PARTIAL_MIGRATION` 时适用：

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- 只迁移 capability matrix 批准的行为；未批准项不得顺手搬入。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-012/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 若迁移，必须证明 enforcement contract 独立可测、多边界可复用，且分离带来真实 lifecycle/failure-domain 价值。
- 必须证明没有把 City Core / Capability Fabric 已有 enforcement 复制成第二套真值。
- Verification 主机必须与 assessment/migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Assessment/Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大 capability matrix 批准范围。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-012/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## 论文 / 研究素材必须保留

Assessment 无论结果如何都要保存**真实负结果与正结果**，禁止只留下成功迁移部分。至少记录：

- donor baseline SHA、Utopia claim-time main SHA、assessment branch HEAD；
- 计划 capability 数量；
- Utopia 已等价覆盖数量、Utopia 更优数量、真实 gap 数量；
- 选择完整迁移 / 部分迁移 / 放弃的 capability 数量；
- 每个放弃项的 reason code；
- source/target files、contract/test/runtime anchors 的检查范围；
- parity / runtime 检查的 pass/fail、失败原因与修复（若发生）；
- 若实际迁移：变更文件数、测试变化、CI、真实消费、failure/recovery、最终差异；
- 若 NO_VALUE：为什么“什么都不搬”比复制 donor 更正确，这本身作为 negative-result / architecture-selection evidence；
- 只记录可测量事实；不得为了论文制造测试次数、耗时或指标。

## 素材保存位置

继续使用已经设计好的位置：

### Digital-City — compact truth / decision

```text
mission-book/MB-012-runtime-compliance.md
mission-book/reports/MB-012/ASSESSMENT_REPORT.md
mission-book/reports/MB-012/MIGRATION_REPORT.md      # 仅实际迁移时
mission-book/reports/MB-012/VERIFICATION_REPORT.md   # 仅实际迁移时
```

### Utopia — process / evidence

```text
.runtime/evidence/mission-book/MB-012/<run-id>/assessment/     # raw, git-ignored
data-records/evolution/inbox/mission-book/MB-012/events.jsonl # bounded structured events on branch
evidence/raw/mission-book/MB-012/assessment/                   # 仅选择性发布的非敏感有界证据
data-records/evolution/episodes/mission-book/MB-012/           # 只有实际迁移+验证后才 finalize
```

对于 `NO_VALUE`，当前 episode schema 不表示“未迁移负结果”，因此**不得伪造 verified episode**；保留 assessment branch + City Assessment Report + evidence pointers 即可。

## Claim / 主机领取记录

### Assessment Claim

- Host: **UNCLAIMED**
- Claimed at: —
- City claim commit: —
- Utopia baseline SHA: —
- Assessment branch: —

### Migration Claim

- Host: **UNCLAIMED**
- Claimed at: —
- Implementation branch: —

### Verification Claim

- Host: **UNCLAIMED**
- Claimed at: —
- Reviewed migration branch: —

## 绑定执行条件（所有 Mission 强制）

> **LATEST OWNER RULING:** [`response-9-30.md`](./response-9-30.md)  
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](./response-9-29.md)（未被 9-30 覆盖的条款继续有效）  
> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first + assessment-first）  
> [`past-rules/`](./past-rules/) 仅为历史归档，不具运行时约束力。

## Mission-specific evidence

- claim-time Utopia main SHA required
- capability-by-capability comparison required
- Assessment Report required for **all** verdicts
- NO_VALUE negative result must remain traceable
