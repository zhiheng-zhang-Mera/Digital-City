---
mission_id: MB-012
sequence: 12
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
assessment_required: true
assessment_status: COMPLETE_NO_VALUE
assessment_complete: true
assessment_result: NO_VALUE
assessment_claim_host: Mech
assessment_claimed_at: 2026-09-30T15:57:40Z
assessment_branch: mission/MB-012-runtime-compliance
assessment_head_sha: d071328d8f68ba1ddd5e8a1fde11718e75fd6672
assessment_utopia_base_sha: 756c7d760c605e33ba386e87605e078fe24b82ca
assessment_report: mission-book/reports/MB-012/ASSESSMENT_REPORT.md
migration_status: SKIPPED_COMPLETE
migration_complete: true
migration_completion_basis: SKIPPED_NOT_REQUIRED
migration_claim_host: null
migration_claimed_at: null
migration_branch: null
migration_head_sha: null
migration_ci: null
migration_report: null
verification_status: NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete: true
verification_claim_host: null
verification_claimed_at: null
verification_head_sha: null
verification_ci: null
verification_report: null
merged_main_sha: null
independent_reverification_host: Alien
independent_reverified_at: 2026-09-30
independent_reverification_result: NO_VALUE_CONFIRMED
independent_reverification_note: "Owner-directed re-verification without reusing any existing test; real Android device operation used for MB-010. The assessment branch is 1 ahead / 0 behind main and that single commit is assessment provenance only, so nothing is merged per response-9-30 R1."
assessment_utopia_main_at_reverification: 756c7d760c605e33ba386e87605e078fe24b82ca
---

# MB-012 — Runtime Compliance Enforcement 抽取价值评估 / 条件迁移

> **状态：COMPLETE_NO_VALUE（2026-09-30，Host `Mech`）。** Assessment verdict 为 `NO_VALUE`：**判断无价值，任务保留，未迁移**。按 README §2 / response-9-30 R1+R4 视为绿色完成（`migration_complete=true`、`migration_completion_basis=SKIPPED_NOT_REQUIRED`、`verification_complete=true`），未写任何实现代码，不生成 verified episode。调度器以后必须视为已完成并 skip，除非 Owner 显式 reset/reopen。

## 目标

评估 Boss runtime enforcement 相对于当前 Utopia City Core、Capability Fabric、Worker Gateway 与运行时服务已经存在的权限/边界执行是否仍有独立价值；只迁移能补足真实 runtime enforcement 缺口的部分。

本 Mission 采用 **Assessment → conditional Migration → conditional Verification**：

- `FULL_MIGRATION`：donor 计划能力整体仍有独立价值，进入完整 Migration。
- `PARTIAL_MIGRATION`：仅迁移能补足 Utopia 真实缺口的子集；其余能力显式放弃并保留理由。
- `NO_VALUE`：当前 Utopia 已等价/更优覆盖，或 donor 行为已过时、错误归属、需要新增能力才能成立、没有独立 lifecycle/failure-domain 价值等；**不迁移**，向 City 报告：**“判断无价值，任务保留，未迁移”**。

`NO_VALUE` 是终态评估结果，**按当前规则视为 Migration 与 Mission 完成，但没有发生实现迁移**；任务继续保留用于 provenance / 论文素材 / 未来 Owner 重开。

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
| RC-01 | privilege / cross-domain / protected-resource access enforcement | `root-authority/guard.mjs`（escape⇒`DENY`、protected⇒`REQUIRE_OWNER`、rename 两侧、大小写不敏感、注入式 containment seam、有界编码理由）；`guardian-gate.mjs` 的 `SCOPE_VALIDATION` + `DESTRUCTIVE_CHANGE_CHECK`；MB-008 已从**同一** donor `src/shared/permission.ts` 迁入 computer side-effect 权限闸门（`backend-surface/permission.mjs`、`computer-recovery.mjs`）；活 gateway 的 per-route 鉴权 + 绑定/token 分离；活 bridge 的 operation allowlist | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR`：donor 的 live 权限闸门在 Utopia 都有已迁或活的对应物；donor 多出的部分（`execution-profile` 的 assert* 方法、具名 `refuse*` guards）是 test-only | `root-authority/guard.mjs`, `guardian-gate.mjs`, `backend-surface/permission.mjs`, `server.mjs`, `bridge.mjs` |
| RC-02 | service / capability registration enforcement hooks | `capability-fabric/registry.mjs`（注册期拒绝 nameless/ownerless/undescribed/重复 owner 并点名双方/priority 冲突）；`capability-bridge/registry.mjs` ownership；**活** `bridge.mjs#invoke`（`CAPABILITY_NOT_FOUND` 404、`BRIDGE_PENDING` 409、`OPERATION_BLOCKED`、`BUSY` 429、`RESULT_TOO_LARGE`、worker `resourceLimits`）；Android `CapabilityPolicy` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR` + `OBSOLETE_DONOR`：donor 的注册期强制**生产不可达**（`createCapabilityBroker`/`invokeThroughBroker`/`evaluate`/`gateAuthorizer`/`authorizeExecution` 非测试调用者为 0，且 `main.ts:1003` 以**无 options** 构造 `ExecutionGate`，authorizer 钩子永不触发）；Utopia 的对应物是活的、被测试和真实 invoke 路径消费的 | `capability-fabric/registry.mjs`, `capability-bridge/registry.mjs`, `bridge.mjs`, `CapabilityPolicy.kt` |
| RC-03 | authority escalation rejection | `guardian-gate.mjs`：未给**每个必需检查**一个具名 verdict 时 `ACCEPTED` 不可达；`NOT_RUN` 是 blocker 而非 pass；移除需 Owner 批准；override 合规按词法校验。另 `task-lifecycle` 的 `awaiting_release_permission`、`root-authority/contracts.mjs` 的三值最严判定序 + 不可变 floor 表 | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR`：donor 的 `authority-planes.ts` 只有 **1 个调用者，且是 CI 脚本**（`scripts/runtime-intelligence-diff-guard.cjs:64`），具名 `refuse*` guards 与 `acceptOwnerClaim` 是 test-only；Utopia 已迁的 Guardian gate 强制的是更强的性质 | `authority-planes.ts`, `guardian-gate.mjs`, `task-lifecycle/contracts.mjs`, `root-authority/contracts.mjs` |
| RC-04 | runtime-policy decision application | 活 gateway 的运行时策略执行：协议版本不符 **409**、token 分离、拒绝 `0.0.0.0`/`::` 绑定、请求大小上限、任务归属 **403**、状态迁移 **409**、progress 单调性 **400**、pairing 会话一次性/过期/尝试锁 **410/429/403**；`providers.mjs` 生命周期 + 健康阶梯；computer-use routing-safety 安全闸门；bridge 熔断 | SUPERIOR | ABANDON | `OBSOLETE_DONOR` + `DUPLICATE_EQUIVALENT` + `NO_REAL_CONSUMER`：计划能力在 donor 中**根本不存在为活行为**——`.codex-boss/config/runtime-policy.json` 无任何消费者，`runtime-policy.ts` 不导出任何东西且 `loadRuntimePolicy` 零调用者，仓库里没有 JSON-Schema 校验器，活的 bound 是另一个对象（`SchedulerPolicy.maxParallel`）。没有可迁的 donor 行为 | `runtime-policy.json`, `runtime-policy.ts`, `scheduler.ts:38`, `server.mjs`, `routing-safety/**` |
| RC-05 | audit-friendly runtime verdict / enforcement evidence | `guardian-gate.mjs` 的每个 check 携带 `verdict` + `inspected[]` + `reasons[]`，结果携带 `blocking[]` 与有界理由数；`decision-ledger.mjs` + `recovery.mjs`；gateway 事件流被 Web UI 消费；verified evolution episode 带 `inboxDigestSha256` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR`：donor 的 Root audit ledger 在活路径上**写入但不被读取**（只有 `RootAuthority.history()` 读，其调用者是测试），且其完整性机制是**无密钥** SHA-256 链（不是 MAC 也不是签名；`electron/`+`src/` 中 `createVerify`/`verifySignature`/`publicKey`/`x509`/`createHmac` 全部 0 命中）；Utopia 的 verdict 天然审计友好且被真实消费 | `root-audit-ledger.ts`, `guardian-gate.mjs`, `decision-ledger.mjs`, `server.mjs`, `episodes/**` |

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
  - `migration_status: SKIPPED_COMPLETE`
  - `migration_complete: true`
  - `migration_completion_basis: SKIPPED_NOT_REQUIRED`
  - `verification_status: NOT_REQUIRED_SKIPPED_COMPLETE`
  - `verification_complete: true`
- City 报告必须显式写：**判断无价值，任务保留，未迁移**，并注明该 NO_VALUE 按规则视为绿色完成。
- assessment branch 保留为研究/provenance 分支，**不 merge、不删除**；City 报告记录 immutable HEAD。
- 调度器以后必须把该状态视为已完成并 skip，除非 Owner 显式 reset/reopen。

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

- Host: **Mech**
- Claimed at: 2026-09-30T15:57:40Z
- City claim commit: `2cc352197bf98dbfefcfd9058ee9d6769a516bc9`
- Utopia baseline SHA: `756c7d760c605e33ba386e87605e078fe24b82ca`
- Assessment branch: `mission/MB-012-runtime-compliance` @ `d071328d8f68ba1ddd5e8a1fde11718e75fd6672`（保留，不 merge、不删除）
- Donor frozen baseline: `zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080`
- Selection basis: MB-010 and MB-011 both closed as `NO_VALUE` (green `SKIPPED_NOT_REQUIRED`) and no eligible P0 exists, so the last lowest-sequence assessment-first Mission (MB-012) was claimed under README §3 P1A. Read-only reconnaissance only; no implementation code written.
- Assessment outcome: `NO_VALUE` — 5/5 capabilities already equivalent-or-superior in current Utopia; 0 gaps; 0 migrated. Report: [`reports/MB-012/ASSESSMENT_REPORT.md`](./reports/MB-012/ASSESSMENT_REPORT.md)

### Assessment closeout (NO_VALUE)

```text
assessment_status          = COMPLETE_NO_VALUE
assessment_complete        = true
assessment_result          = NO_VALUE
migration_status           = SKIPPED_COMPLETE
migration_complete         = true
migration_completion_basis = SKIPPED_NOT_REQUIRED
verification_status        = NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete      = true
merged_main_sha            = null
```

**本 Mission 被当作 MB-002 deferral 的具名承接方来评估。** MB-002 的
`capability-fabric/DONOR.json` 明确写 `Codex-Boss electron/capability/capability-broker.ts,
authorization.ts and permission-contract.ts ... owned by MB-011/MB-012`，DEFERRED 列表写
`permission and authorization resolution (MB-012 Runtime Compliance)`。对该 deferral 的检验结论是
它**不是**迁移机会：

1. **被 defer 的那一层在 donor 里从不运行。** `electron/capability/*` 的
   `createCapabilityBroker` / `invokeThroughBroker` / `evaluate` / `gateAuthorizer` /
   `authorizeExecution` 非测试生产调用者**全为 0**，且 `electron/main.ts:1003` 以
   **无 options** 构造 `ExecutionGate`，authorizer 钩子永不触发——连代码自称 `mapped` 的边界
   在发布应用里也是aspirational。
2. **RC-04 的能力在 donor 中不存在为活行为。** `.codex-boss/config/runtime-policy.json`
   无任何消费者；`runtime-policy.ts` 不导出任何东西、`loadRuntimePolicy` 零调用者；仓库里没有
   JSON-Schema 校验器；活的 bound 是另一个对象（`SchedulerPolicy.maxParallel`）。
3. **RC-03 是 CI 脚本专用、RC-05 的 ledger 从不被读取。** `authority-planes.ts` 只有 1 个
   调用者（`scripts/runtime-intelligence-diff-guard.cjs:64`），具名 `refuse*` guards 是 test-only；
   Root audit ledger 只被测试读，完整性机制是**无密钥** SHA-256 链，`electron/`+`src/` 中
   `createVerify`/`verifySignature`/`publicKey`/`x509`/`createHmac` 全部 0 命中。
4. **活着且确实执行的部分已经迁过。** MB-008 从本 Mission 点名的**同一份**
   `src/shared/permission.ts` 迁入了 computer side-effect 权限闸门；MB-001 从同一 donor commit
   迁入了 protected-surface guard 与 Guardian gate。
5. **Utopia 的执行是活的且被消费的。** 真实 bounded 运行实测 bridge 与 gateway 在活路径上拒绝
   （`CAPABILITY_NOT_FOUND`/`OPERATION_BLOCKED`/409/401/403/400/409 + wildcard bind 拒绝）。
6. **第二套执行引擎会制造第二份真值**，正是本 Mission Verification 门槛明令禁止的。

**范围边界（已遵守）**：Owner/Root authority source 与 constitutional protected-surface definition
只读作背景，从未提议迁移；`promotion-state.ts` / promotion-controller 属 qualification/promotion
control，同样仅供参考。

**测量证据（1904 PASS / 0 FAIL）**：bounded enforcement chain 19/19 PASS（含活 gateway 临时端口
与活 capability-bridge invoke）；`city/test-all.mjs` 1807 pass / 0 fail / 1 skipped（共 1808）；
root `tests/*.test.mjs` 84 pass / 0 fail；`verify-promotion-history.mjs` 10/10。

**队列状态：MB-010 → MB-011 → MB-012 的 assessment-first 队列已全部闭环，队列为空。**
`MISSION_INDEX.md` 中所有 enabled Mission 现在都 `verification_complete = true`。


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
