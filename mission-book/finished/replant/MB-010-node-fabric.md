---
mission_id: MB-010
sequence: 10
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
assessment_required: true
assessment_status: COMPLETE_NO_VALUE
assessment_complete: true
assessment_result: NO_VALUE
assessment_claim_host: Mech
assessment_claimed_at: 2026-09-30T15:40:09Z
assessment_branch: mission/MB-010-node-fabric
assessment_head_sha: 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526
assessment_utopia_base_sha: 756c7d760c605e33ba386e87605e078fe24b82ca
assessment_report: mission-book/reports/MB-010/ASSESSMENT_REPORT.md
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
independent_reverification_note: "Owner-directed re-verification without reusing any existing test. The assessment host's per-capability claims were re-derived from the frozen donors with fresh probes and re-proven on Utopia's live surfaces (real Android device operation included for the node-truth chain). The NO_VALUE verdict is independently CONFIRMED without qualification."
independent_reverification_record: "FORCED by host Alien under the Owner ruling response-9-30.md#R11; the record is Alien-authored VERIFICATION events in the implementation repo, never a rewriting of the assessment host's events."
provenance_merge_ruling: "response-9-30.md#R11 - Owner-directed provenance merge, overriding README line 223 for these three branches only"
provenance_merge_status: COMPLETE
provenance_merge_branch: mission/MB-010-node-fabric
provenance_merge_sha: 6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a
provenance_merged_at: 2026-09-30T16:31:57+10:00
provenance_merge_branch_retained: true
provenance_merge_ci: "utopia merged-main run 36678805229 (V0.2 checks) PASS - gateway-web + android both success"
utopia_main_after_provenance_merges: d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
assessment_utopia_main_at_reverification: 756c7d760c605e33ba386e87605e078fe24b82ca
---

# MB-010 — Node Fabric Boss 抽取价值评估 / 条件迁移

> **状态：COMPLETE_NO_VALUE（2026-09-30，Host `Mech`）。** Assessment verdict 为 `NO_VALUE`：**判断无价值，任务保留，未迁移**。按 README §2 / response-9-30 R1+R4 视为绿色完成（`migration_complete=true`、`migration_completion_basis=SKIPPED_NOT_REQUIRED`、`verification_complete=true`），未写任何实现代码，不生成 verified episode。调度器以后必须视为已完成并 skip，除非 Owner 显式 reset/reopen。

## 目标

评估 Boss Node Fabric 中已有物理/逻辑节点语义相对于**当前 Utopia**是否仍存在独立迁移价值；只有能补足当前节点身份、存活、资源或 capability-host truth 的真实缺口时才迁移。

本 Mission 采用 **Assessment → conditional Migration → conditional Verification**：

- `FULL_MIGRATION`：donor 计划能力整体仍有独立价值，进入完整 Migration。
- `PARTIAL_MIGRATION`：仅迁移能补足 Utopia 真实缺口的子集；其余能力显式放弃并保留理由。
- `NO_VALUE`：当前 Utopia 已等价/更优覆盖，或 donor 行为已过时、错误归属、需要新增能力才能成立、没有独立 lifecycle/failure-domain 价值等；**不迁移**，向 City 报告：**“判断无价值，任务保留，未迁移”**。

`NO_VALUE` 是终态评估结果，**按当前规则视为 Migration 与 Mission 完成，但没有发生实现迁移**；任务继续保留用于 provenance / 论文素材 / 未来 Owner 重开。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City 归属与候选落地边界

- **City owner:** 00/02 City Node Network — Device Node Fabric
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **候选目标路径:** `city/00-foundation/02-node-fabric`
- **依赖 Mission:** 无
- 真正落地前必须重新核对当前 City map；若 ownership 已变化，停止并向 City 报告，不得自行改 ownership。

## 项目书计划能力 / Planned donor capability set

- **NF-01** — node principal / registration / membership identity truth
- **NF-02** — heartbeat / liveness / offline truth
- **NF-03** — runtime endpoint metadata / node endpoint truth
- **NF-04** — hardware / resource telemetry used as node truth
- **NF-05** — capability-host advertisement / capability-to-node hosting truth

## 领取时必须核对的 Utopia 当前能力

领取主机必须记录**领取时** Utopia `main` 精确 SHA 到 `assessment_utopia_base_sha`，不得只依赖本任务创建时的旧印象。至少检查：

- `city/00-foundation/**`，尤其 City Core、Capability Fabric 与任何新增 00/02 实现。
- `services/dev-gateway/**` 与现有 host/runtime endpoint 事实源。
- `services/capability-bridge/**` 与 capability provider/registry 事实源。
- `platform/**`、Windows/Android/设备桥接中已经存在的 host/device identity、health、endpoint、resource 信息。
- `city/CITY_IMPLEMENTATION_MANIFEST.json`、census、registry、tests，确认同一语义是否已由别的 building 拥有。

还必须搜索与计划能力语义等价但路径不同的实现、测试、registry/manifest、runtime consumer 和历史 relocation；“目标目录不存在”本身**不能**证明 Utopia 缺能力。

## 领取后必须填写的能力对照表

> 这张表必须直接更新在本 Mission 文件中，保存 compact decision truth；完整证据与过程放 `ASSESSMENT_REPORT.md` 和 Utopia 既有素材点。

| ID | 计划能力（donor） | Utopia 当前等价/相关能力 | 覆盖判定 | 决策 | 不迁/部分迁理由 | 证据 |
|---|---|---|---|---|---|---|
| NF-01 | node principal / registration / membership identity truth | durable node record in `services/dev-gateway` SQLite `nodes` (`id`, `devicePrincipalId`, `online`, `lastHeartbeatAt`) + `agents/reference-node` register + MB-001 `fleet-routing` `FleetMemberRecord` | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT`：Utopia 已有真实运行的注册与成员身份真值；donor 更宽的 identity tuple 在 Utopia 没有 consumer | `server.mjs:93-97`, `store.mjs:9`, `agent.mjs:10`, `fleet-routing/DONOR.json` |
| NF-02 | heartbeat / liveness / offline truth | gateway heartbeat endpoint + 1s sweeper → `online:false` + `NODE_OFFLINE`；`claimNodeFor`→`acceptsWork`；MB-001 已迁 `fleetNodeStateFor`/`handleNodeDropout`；Web ONLINE/OFFLINE/UNKNOWN + 10s freshness | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT`：donor 的 DEGRADED 三态规则已由 MB-001 迁入；把 gateway 改接三态属于改运行时行为，不是补缺失的 donor 行为 | `server.mjs:31,99,129`, `fleet.mjs:46-51,114`, `app.js:16-18` |
| NF-03 | runtime endpoint metadata / node endpoint truth | pairing `descriptor.endpoint{scheme,host,port}` + apiVersion/schemaVersion；`discovery.mjs` mDNS `utopia-city` + BLE；`store.cityId`；Web/Android 配对消费 | EQUIVALENT | ABANDON | `OBSOLETE_DONOR`：donor 残余部分是 desktop 端 proxy/AI-provider 多路由可达性矩阵；Utopia 单城 outbound-polling 架构没有这个决策面 | `pairing.mjs:8`, `discovery.mjs:11-18`, `ble.mjs`；全仓 grep `networkRoutes`/`providerMatrix` = 0 |
| NF-04 | hardware / resource telemetry used as node truth | `agents/reference-node/telemetry.mjs`（CPU delta%、内存、磁盘、uptime）+ `contracts/pairing-v1` 校验 + Web LIVE/CACHED 渲染；MB-005 host-health-station；MB-001 `capabilityVerdicts` | SUPERIOR | ABANDON | `UTOPIA_SUPERIOR`：Utopia 遥测是真实测量且被产品消费；donor 自身 `node-inspector.ts` 恒返回 `gpu: []`，没有可迁的 GPU 行为 | `telemetry.mjs`, `descriptor.mjs:25-34`, `app.js:19`, `host-health-station/**` |
| NF-05 | capability-host advertisement / capability-to-node hosting truth | node `capabilities[]` 持久广播；`REQUIRED_TASK_CAPABILITIES`+`acceptsWork` 放置闸门；MB-001 `eligibleCandidates`；capability-fabric registry（ownership/priority/重复 owner 拒绝/撤销）+ capability-bridge | EQUIVALENT | ABANDON | `DUPLICATE_EQUIVALENT` + `NO_REAL_CONSUMER` + `NO_INDEPENDENT_VALUE`：Utopia 已有更强的跨层 registry 机制；再迁 `NodeCapabilityRegistry` 只会重复注册表状态 | `server.mjs:28-31,102`, `capability-fabric/registry.mjs`, `capability-bridge/registry.mjs` |

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
2. 从该 Utopia SHA 建立 `mission/MB-010-node-fabric`；此时允许只有**记录/证据变更**，不得先写迁移实现。
3. 使用 Utopia 现有 event contract，以 `role=MIGRATION` 记录 `MISSION_CLAIMED`、`ATTEMPT_STARTED`、必要的 `TEST_PASS/TEST_FAIL` 等；**不得自造 eventType**。
4. 完成 donor source map + 当前 Utopia capability inventory + capability-by-capability parity/gap 对照。
5. 在 City 创建：
   - `mission-book/reports/MB-010/ASSESSMENT_REPORT.md`
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

- node principal/registration/membership、heartbeat/liveness/offline truth。
- runtime endpoint metadata、hardware/resource telemetry、capability-host advertisement。
- 仅为复用 donor 既有语义所需的接口适配、等价重构、parity 测试。

## 明确禁止 / 不属于本 Mission

- 08 Device & Edge 的传感器/执行器语义。
- Hns worker scheduling。
- 让 Android 自动变成 compute node。
- 任何 donor 不存在的新网络/云能力。

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
  - `Digital-City/mission-book/reports/MB-010/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 要求现有 Windows/Android/node truth 回归不退化。
- Boss donor 与 Utopia 当前 reference/host truth 的重叠/差异必须保留 union/parity 记录。
- Verification 主机必须与 assessment/migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Assessment/Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大 capability matrix 批准范围。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-010/VERIFICATION_REPORT.md`
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
mission-book/MB-010-node-fabric.md
mission-book/reports/MB-010/ASSESSMENT_REPORT.md
mission-book/reports/MB-010/MIGRATION_REPORT.md      # 仅实际迁移时
mission-book/reports/MB-010/VERIFICATION_REPORT.md   # 仅实际迁移时
```

### Utopia — process / evidence

```text
.runtime/evidence/mission-book/MB-010/<run-id>/assessment/     # raw, git-ignored
data-records/evolution/inbox/mission-book/MB-010/events.jsonl # bounded structured events on branch
evidence/raw/mission-book/MB-010/assessment/                   # 仅选择性发布的非敏感有界证据
data-records/evolution/episodes/mission-book/MB-010/           # 只有实际迁移+验证后才 finalize
```

对于 `NO_VALUE`，当前 episode schema 不表示“未迁移负结果”，因此**不得伪造 verified episode**；保留 assessment branch + City Assessment Report + evidence pointers 即可。

## Claim / 主机领取记录

### Assessment Claim

- Host: **Mech**
- Claimed at: 2026-09-30T15:40:09Z
- City claim commit: `e424178c35dd7f47cd859dc5e784186c2e976a91`
- Utopia baseline SHA: `756c7d760c605e33ba386e87605e078fe24b82ca`
- Assessment branch: `mission/MB-010-node-fabric` @ `8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526`（保留，不 merge、不删除）
- Donor frozen baseline: `zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080`
- Selection basis: integration-first scheduler had **no eligible P0** left (MB-001..MB-009 all `verification_complete=true`, all mission branches `AheadOfMain=0`), so the lowest-sequence eligible assessment-first Mission (MB-010) was claimed under README §3 P1A. Read-only reconnaissance preceded this claim; no implementation code has been written.
- Assessment outcome: `NO_VALUE` — 5/5 capabilities already equivalent-or-superior in current Utopia; 0 gaps; 0 migrated. Report: [`reports/MB-010/ASSESSMENT_REPORT.md`](../completed-2026-10-01/reports/MB-010/ASSESSMENT_REPORT.md)

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

Decisive finding: MB-001 had already migrated the donor's **live** node logic
(`src/shared/fleet.ts`, `capability-router.ts`, `node-capabilities.ts`,
`adaptive-routing.ts`) from this **same** frozen commit into
`city/00-foundation/01-city-core/fleet-routing`; the running product already owns
registration, heartbeat/liveness, endpoint truth, telemetry and capability
advertisement. The donor remainder (`TenxNodeRegistry`, `TenxNetworkRegistry`,
`TenxObservability`) is **production-dead at the frozen baseline** — no
`electron/main.ts`/`bootstrap` import, only a type-only field plus tests, and
`config/capabilities/node.yaml` declares `modules: []` / `bootModules: []` /
`surface: []`. Measured evidence: bounded real runtime chain 8/8 PASS, city
fleet-routing 28/28 PASS, root gateway+telemetry+web 11/11 PASS (47 PASS / 0 FAIL).


### Migration Claim

- Host: **UNCLAIMED**
- Claimed at: —
- Implementation branch: —

### Verification Claim

- Host: **UNCLAIMED**
- Claimed at: —
- Reviewed migration branch: —

## 绑定执行条件（所有 Mission 强制）

> **LATEST OWNER RULING:** [`response-9-30.md`](../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)（未被 9-30 覆盖的条款继续有效）
> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first + assessment-first）  
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。

## Mission-specific evidence

- claim-time Utopia main SHA required
- capability-by-capability comparison required
- Assessment Report required for **all** verdicts
- NO_VALUE negative result must remain traceable


[阅读译本 / Reading translation](./en/MB-010-node-fabric.md)
