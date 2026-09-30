---
mission_id: MB-011
sequence: 11
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
assessment_required: true
assessment_status: COMPLETE_NO_VALUE
assessment_complete: true
assessment_result: NO_VALUE
assessment_claim_host: Mech
assessment_claimed_at: 2026-09-30T15:48:08Z
assessment_branch: mission/MB-011-customs
assessment_head_sha: 82b6ac486d024efcfcc64703b58cc136b546caf9
assessment_utopia_base_sha: 756c7d760c605e33ba386e87605e078fe24b82ca
assessment_report: mission-book/reports/MB-011/ASSESSMENT_REPORT.md
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
independent_reverification_note: "Owner-directed re-verification without reusing any existing test. The assessment host's per-capability claims were re-derived from both frozen donors with fresh probes and re-proven on Utopia's live surfaces (tamper-refused manifest admission, promotion provenance against real Git history, capability-ownership refusal). The NO_VALUE verdict is independently CONFIRMED without qualification; the CU-04 deadness over-claim in section 2.4 of the report was corrected in place."
independent_reverification_record: "FORCED by host Alien under the Owner ruling response-9-30.md#R11; the record is Alien-authored VERIFICATION events in the implementation repo, never a rewriting of the assessment host's events."
provenance_merge_ruling: "response-9-30.md#R11 - Owner-directed provenance merge, overriding README line 223 for these three branches only"
provenance_merge_status: COMPLETE
provenance_merge_branch: mission/MB-011-customs
provenance_merge_sha: f22273c37af1ebff6c95d49972b5d26a222f2ed2
provenance_merged_at: 2026-09-30T16:32:02+10:00
provenance_merge_branch_retained: true
utopia_main_after_provenance_merges: d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
assessment_utopia_main_at_reverification: 756c7d760c605e33ba386e87605e078fe24b82ca
---

# MB-011 — Customs Admission Boundary 抽取价值评估 / 条件迁移

> **状态：COMPLETE_NO_VALUE（2026-09-30，Host `Mech`）。** Assessment verdict 为 `NO_VALUE`：**判断无价值，任务保留，未迁移**。按 README §2 / response-9-30 R1+R4 视为绿色完成（`migration_complete=true`、`migration_completion_basis=SKIPPED_NOT_REQUIRED`、`verification_complete=true`），未写任何实现代码，不生成 verified episode。调度器以后必须视为已完成并 skip，除非 Owner 显式 reset/reopen。

## 目标

评估 Boss/Hns admission-time 检查相对于当前 Utopia 的 manifest、promotion、capability、source/provenance 与 package admission 流程是否仍有独立价值；只把能形成真实、可复用的入境检查缺口迁到 01/01 Customs。

本 Mission 采用 **Assessment → conditional Migration → conditional Verification**：

- `FULL_MIGRATION`：donor 计划能力整体仍有独立价值，进入完整 Migration。
- `PARTIAL_MIGRATION`：仅迁移能补足 Utopia 真实缺口的子集；其余能力显式放弃并保留理由。
- `NO_VALUE`：当前 Utopia 已等价/更优覆盖，或 donor 行为已过时、错误归属、需要新增能力才能成立、没有独立 lifecycle/failure-domain 价值等；**不迁移**，向 City 报告：**“判断无价值，任务保留，未迁移”**。

`NO_VALUE` 是终态评估结果，**按当前规则视为 Migration 与 Mission 完成，但没有发生实现迁移**；任务继续保留用于 provenance / 论文素材 / 未来 Owner 重开。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

## City 归属与候选落地边界

- **City owner:** 01/01 Customs Security — Extension Admission Checks
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **候选目标路径:** `city/01-governance/01-customs-security`
- **依赖 Mission:** 无
- 真正落地前必须重新核对当前 City map；若 ownership 已变化，停止并向 City 报告，不得自行改 ownership。

## 项目书计划能力 / Planned donor capability set

- **CU-01** — manifest / schema admission validation
- **CU-02** — identity / source / provenance verification hooks at admission time
- **CU-03** — dependency / capability / permission / domain / storage declaration checks
- **CU-04** — isolation / crash-boundary / compatibility preflight
- **CU-05** — enable / disable / uninstall / rollback readiness checks before admission

## 领取时必须核对的 Utopia 当前能力

领取主机必须记录**领取时** Utopia `main` 精确 SHA 到 `assessment_utopia_base_sha`，不得只依赖本任务创建时的旧印象。至少检查：

- `city/CITY_IMPLEMENTATION_MANIFEST.json`、`city/manifest.mjs`、city tests/census 中已有结构校验。
- `city/00-foundation/01-city-core/**` 与 trust/authority/protected-surface 边界。
- `city/00-foundation/03-capability-fabric/**`、`services/capability-bridge/**` 的 registry/provider 校验。
- `apps/rooms/promotions/**`、promotion-history verifier、`DONOR.json`/provenance 读取逻辑。
- 任何当前 package/plugin/module admission、install/enable/disable/rollback 流程。

还必须搜索与计划能力语义等价但路径不同的实现、测试、registry/manifest、runtime consumer 和历史 relocation；“目标目录不存在”本身**不能**证明 Utopia 缺能力。

## 领取后必须填写的能力对照表

> 这张表必须直接更新在本 Mission 文件中，保存 compact decision truth；完整证据与过程放 `ASSESSMENT_REPORT.md` 和 Utopia 既有素材点。

| ID | 计划能力（donor） | Utopia 当前等价/相关能力 | 覆盖判定 | 决策 | 不迁/部分迁理由 | 证据 |
|---|---|---|---|---|---|---|
| CU-01 | manifest / schema admission validation | `city/manifest.mjs` `validateManifest`/`checkManifestAgainstTree`（结构、id 形状、双语、重复 id/path、lifecycle 词表、`capabilityProvider` 布尔、**canonical path 相等**、incubation room 唯一性与必需性、donor SHA；再与磁盘树互检）+ `promotions.mjs` + `capability-fabric/contracts.mjs#FABRIC_API_VERSION` + 5 份 contract schema | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR`：donor 的插件清单字段（`api_version` 相等、semver、provides/requires/conflicts 数组）在 Utopia 没有对应被准入物（无插件格式）；在确实存在的字段上 Utopia 更严 | `city/manifest.mjs`, `city/tests/manifest.test.mjs`, `promotions.mjs`, `contracts/*/schema.json` |
| CU-02 | identity / source / provenance verification hooks at admission time | `promotions.mjs` 记录并校验 `donor.repository`/`commit`/`sourcePaths`；`crossCheckPromotions` 拒绝与目录冲突或仍在上线的 room；`scripts/verify-promotion-history.mjs` 用本地 Git 历史验证每条记录的 commit 祖先与 target 存在性；每模块 `DONOR.json` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR`：donor **完全没有** provenance 校验，只用正则从用户输入拼一个 provenance 对象存下来；全基线 `createVerify`/`verifySignature`/`publicKey`/`x509`/`contentHash`/`pluginHash` 各 0 命中，17 个准入模块无 `node:crypto` | `promotions.mjs`, `verify-promotion-history.mjs`, `DONOR.json` |
| CU-03 | dependency / capability / permission / domain / storage declaration checks | `capability-fabric/registry.mjs`（注册期拒绝第二 owner 并点名双方、miss 点名 requester、revocation）；`providers.mjs`（拒绝重复身份）；`capability-bridge/registry.mjs`（moduleRefs/owner/priority/kind）；`capability-routing.mjs#eligibleCandidates`；`city/manifest.mjs` 的 domain path | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `WRONG_OWNERSHIP` + `NO_INDEPENDENT_VALUE`：capability/依赖判定已覆盖且在注册期而非 donor 的加载期；权限解析由 MB-002 DONOR.json 明确归 **MB-012**，且 donor 本身也不在准入期强制权限（`UNKNOWN_PERMISSION`/`PERMISSION_DENIED` 从未产生）；storage 声明两边都没有 | `capability-fabric/registry.mjs`, `providers.mjs`, `capability-bridge/registry.mjs`, `capability-routing.mjs` |
| CU-04 | isolation / crash-boundary / compatibility preflight | `FABRIC_API_VERSION` + descriptor 校验；`FAULT_LEVELS`（soft/degraded/fatal）与健康反应阶梯 + 有界重启预算；MB-006 `04-restart-recovery-station` 拥有真实恢复边界 | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `OBSOLETE_DONOR` + `NO_REAL_CONSUMER`：Mission 所指的隔离预检在 donor 中**根本不存在为拒绝**（`RUNTIME_KINDS` 只是声明元数据，唯一消费者是死代码 `plan.cjs` 里的建议性风险分；真实隔离发生在准入之后的子进程启动）；Codex-Boss root-recovery rollback 属 Owner sovereignty / Root Authority，本 Mission 明确禁止 | `plugin-adapters/contract.cjs`, `process/contract.cjs`, `capability-fabric/contracts.mjs`, `providers.mjs`, `04-restart-recovery-station/**` |
| CU-05 | enable / disable / uninstall / rollback readiness checks before admission | `providers.mjs`（installed/enabled/loaded/healthy 四独立事实；禁用 provider 拒绝 load，除非显式 force）；`RETIRED_LIFECYCLES` 将 PROMOTED/REJECTED room 移出活跃目录；`crossCheckPromotions` + `verify-promotion-history` 证明不存在第二份活实现；MB-006 checkpoint gate fail-closed + restart lock/ticket | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR` + `OBSOLETE_DONOR`：donor 的**活**路径（`setEnabled`/`removeOne`）只拒绝 `PLUGIN_NOT_FOUND`，无依赖检查无回滚；设计好的 readiness（pin/quarantine/rollback-before-replace/confirm）只存在于 **production-dead** 的 `plugin-install/*`（960 行，0 个 app consumer） | `plugin-manager/index.cjs`, `plugin-install/*`, `providers.mjs`, `promotions.mjs`, `04-restart-recovery-station/**` |

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
2. 从该 Utopia SHA 建立 `mission/MB-011-customs`；此时允许只有**记录/证据变更**，不得先写迁移实现。
3. 使用 Utopia 现有 event contract，以 `role=MIGRATION` 记录 `MISSION_CLAIMED`、`ATTEMPT_STARTED`、必要的 `TEST_PASS/TEST_FAIL` 等；**不得自造 eventType**。
4. 完成 donor source map + 当前 Utopia capability inventory + capability-by-capability parity/gap 对照。
5. 在 City 创建：
   - `mission-book/reports/MB-011/ASSESSMENT_REPORT.md`
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

- manifest/schema validation、identity/source verification hooks。
- dependency/capability/permission/domain/storage declarations。
- isolation/crash-boundary、enable/disable/uninstall/rollback readiness、admission preflight。

## 明确禁止 / 不属于本 Mission

- Owner sovereignty / Root Authority。
- runtime enforcement（属于 MB-012 候选边界）。
- Capability registry 本体。
- 业务域质量判断。

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
  - `Digital-City/mission-book/reports/MB-011/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 若迁移，必须证明抽出的 admission contract 稳定、独立可测，并至少有当前真实 consumer/boundary；不得为了通过门禁创造新 consumer。
- 必须证明抽取后没有重复执行 Utopia 已有 manifest/promotion/capability 检查，或清楚记录为何需要独立 Customs 层。
- Verification 主机必须与 assessment/migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Assessment/Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大 capability matrix 批准范围。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-011/VERIFICATION_REPORT.md`
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
mission-book/MB-011-customs.md
mission-book/reports/MB-011/ASSESSMENT_REPORT.md
mission-book/reports/MB-011/MIGRATION_REPORT.md      # 仅实际迁移时
mission-book/reports/MB-011/VERIFICATION_REPORT.md   # 仅实际迁移时
```

### Utopia — process / evidence

```text
.runtime/evidence/mission-book/MB-011/<run-id>/assessment/     # raw, git-ignored
data-records/evolution/inbox/mission-book/MB-011/events.jsonl # bounded structured events on branch
evidence/raw/mission-book/MB-011/assessment/                   # 仅选择性发布的非敏感有界证据
data-records/evolution/episodes/mission-book/MB-011/           # 只有实际迁移+验证后才 finalize
```

对于 `NO_VALUE`，当前 episode schema 不表示“未迁移负结果”，因此**不得伪造 verified episode**；保留 assessment branch + City Assessment Report + evidence pointers 即可。

## Claim / 主机领取记录

### Assessment Claim

- Host: **Mech**
- Claimed at: 2026-09-30T15:48:08Z
- City claim commit: `10b2267105a87dd610503a93d62793b5f12f62c1`
- Utopia baseline SHA: `756c7d760c605e33ba386e87605e078fe24b82ca`
- Assessment branch: `mission/MB-011-customs` @ `82b6ac486d024efcfcc64703b58cc136b546caf9`（保留，不 merge、不删除）
- Donor frozen baselines: `zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080`, `zhiheng-zhang-Mera/DS-Hns@eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`
- Selection basis: MB-010 closed as `NO_VALUE` (green `SKIPPED_NOT_REQUIRED`) and no eligible P0 exists, so the next lowest-sequence assessment-first Mission (MB-011) was claimed under README §3 P1A. Read-only reconnaissance only; no implementation code written.
- Assessment outcome: `NO_VALUE` — 5/5 capabilities already equivalent-or-superior in current Utopia; 0 gaps; 0 migrated. Report: [`reports/MB-011/ASSESSMENT_REPORT.md`](./reports/MB-011/ASSESSMENT_REPORT.md)

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

**本 Mission 被当作 MB-002 deferral 的具名承接方来评估，而不是以“已覆盖”草率结案。**
`city/00-foundation/03-capability-fabric/capability-fabric/DONOR.json` 明确写着 Hns
plugin/adapter/installer 平台未迁移且归 `01/01 Customs (MB-011)`。评估该 deferral 后结论
为它**不是**迁移机会：

1. **donor 最完整的准入设计是 production-dead。** `app/core/plugin-install/`
   （`plan.cjs` + `pipeline.cjs` + `records.cjs`，960 行）**0 个 app consumer**，唯一非测试
   引用者是 `scripts/install-pipeline-acceptance.cjs`；`records.cjs` 是 pin / quarantine /
   rollback 的唯一实现，因此这些 CU-05 能力随之死亡。donor **活**的 `setEnabled` /
   `removeOne` 只拒绝 `PLUGIN_NOT_FOUND`。
2. **donor 完全不做 provenance 校验**（CU-02），只用正则从用户输入拼 provenance 记录；
   全基线 `createVerify`/`verifySignature`/`publicKey`/`x509`/`contentHash`/`pluginHash`
   各 0 命中。Utopia 则用本地 Git 历史真实验证 10/10 条 promotion 记录。
3. **CU-04 的隔离预检在 donor 中不存在为拒绝**：`RUNTIME_KINDS` 只是声明元数据，唯一消费者
   是死代码里的建议性风险分；真实隔离发生在准入之后的子进程启动。
4. **权限不是 donor 的准入闸门**（`ADAPTER_UNKNOWN_PERMISSION`/`ADAPTER_PERMISSION_DENIED`
   从未产生，未授权仅记日志后放行），且权限解析按 MB-002 DONOR.json 属 **MB-012**。
5. **活着的 donor 片段等价或弱于 Utopia 现有检查**；再建一层 Customs 重复执行
   manifest/promotion/capability 检查，正是本 Mission Verification 门槛明令禁止的。
6. **Utopia 没有插件/扩展生态**：没有 `dshns.plugin/v1` 之类的被准入物；为了让 Customs
   有东西可查而新建插件平台属于 `NEW_FEATURE_DEVELOPMENT`，违反 `MIGRATION_ONLY`。

**测量证据（1904 PASS / 0 FAIL）**：bounded admission chain 13/13 PASS；
`city/test-all.mjs` 1807 pass / 0 fail / 1 skipped（共 1808）；root `tests/*.test.mjs`
84 pass / 0 fail；`verify-promotion-history.mjs` 10/10 记录验证通过。

**关于 MB-002 deferral 的说明**：`DEFERRED ... belongs to MB-011` 是未来工作的**指针**，
不是已验证的结论。把它当作假设去检验，才会得到迁移或诚实的负结果；本次是负结果——
把一个在 donor 内部都不可达的模块搬进只许迁移的 city，只会落地无人调用的代码。


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
