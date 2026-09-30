# Mission Book — Integration-First Migration & Verification Queue

## 当前施工进度

> 状态图例：🟢 = 功能/阶段已接受；🔴 = 未完成、阻塞或尚未启动。领取信息以各 Mission 当前 front matter 为准。  
> \* MB-007 repair step 1 已于 2026-09-30 闭环：Owner-override finalizer contract 修复并合入（repair merge `d850d73`），verified episode `MB-007:553ab7ba1c4b0902` 已生成（sha256 `1c5742fb…`），inbox 已消费，原 `RUNTIME_FAIL/BLOCKED` 保留。下一步为 MB-008 repair step 2。  
> \* MB-008 repair step 2 **已于 2026-09-30 闭环**：价值复核 `ROUTE_B_CONTINUE`；先同步 `main`（`77b774c`）；bounded Computer-Use chain 全绿（happy path + 真实 refusal 无副作用 + 真实 miss/recovery + postcondition success，`NO_MOCK_FACTS = true`）；`RUNTIME_PASS`/`CI_RESULT`/`VERIFICATION_COMPLETE` 记录；owner-override episode `MB-008:6ae0bbd46e425c9f`（sha256 `a4b6e8fc…`）生成且 inbox 已消费；final branch CI `36663533485` PASS；merge `168182c`；merged-main CI `36663813362` PASS。Alien 的 `RUNTIME_FAIL/BLOCKED` 保留。下一步为 MB-003 repair step 3。

| 工程项目 | 迁移任务 | 迁移状态 | 验证任务 | 验证状态 |
|---|---|:---:|---|:---:|
| [MB-001 — Core OS](./MB-001-core-os.md) | Alien | 🟢 | Mech | 🟢 |
| [MB-002 — Capability Fabric](./MB-002-capability-fabric.md) | Mech | 🟢 | Alien | 🟢 |
| [MB-003 — Worker Gateway](./MB-003-worker-gateway.md) | Alien | 🟢 | Mech（repair step 3，BLOCKED_ENVIRONMENT） | 🔴 |
| [MB-004 — Project Foreman](./MB-004-project-foreman.md) | Mech | 🟢 | Alien | 🟢 |
| [MB-005 — Host Health](./MB-005-host-health.md) | Mech | 🟢 | Alien | 🟢 |
| [MB-006 — Restart Recovery](./MB-006-restart-recovery.md) | Alien | 🟢 | Mech | 🟢 |
| [MB-007 — Research Institute](./MB-007-research-institute.md) | Alien（Owner accepted） | 🟢 | Mech（repair step 1 ✅） | 🟢 |
| [MB-008 — Computer Use](./MB-008-computer-use.md) | Alien（Owner accepted） | 🟢 | Mech（repair step 2 ✅） | 🟢 |
| [MB-009 — Theme Relocation](./MB-009-theme-relocation.md) | Mech | 🟢 | Alien | 🟢 |
| [MB-010 — Node Fabric](./MB-010-node-fabric.md) | 未领取（先评估） | 🔴 | 未领取 | 🔴 |
| [MB-011 — Customs](./MB-011-customs.md) | 未领取（先评估） | 🔴 | 未领取 | 🔴 |
| [MB-012 — Runtime Compliance](./MB-012-runtime-compliance.md) | 未领取（先评估） | 🔴 | 未领取 | 🔴 |

> 本目录是 Digital-City 对已确认 City 归属迁移工作的**当前施工控制面**。  
> **Active rules = 本文件 + `response-9-30.md` + `response-9-29.md`（未被 9-30 覆盖部分）+ 各 Mission 当前 front matter / mission-specific gates。**  
> `past-rules/` 与历史报告仅用于 provenance，不得作为新任务的运行时规则来源。

## 0. 模式与边界

```text
MODE = MIGRATION_ONLY
NEW_FEATURE_DEVELOPMENT = FORBIDDEN
IMPLEMENTATION_LANDING = Utopia
CITY_REPO = mission / claim / ownership / acceptance metadata
SCHEDULER = INTEGRATION_FIRST
UNMERGED_WIP_LIMIT = 2
```

迁移只能搬运 donor 中已经存在的行为：允许抽取、拆分、接口适配、等价重构、已有消费面接线、测试与证据化；禁止把未来设计、缺失 runtime、全新 UI、全新策略或新产品能力伪装成“迁移”。

## 1. 权威来源顺序

发生冲突时按以下顺序解释：

1. Owner 的最新显式裁决：[`response-9-30.md`](./response-9-30.md)；
2. [`response-9-29.md`](./response-9-29.md) 中未被 9-30 覆盖的既有裁决；
3. 本文件的当前规则；
4. Mission 当前 front matter + mission-specific gates；
5. 当前 Utopia `main` 的事实状态；
6. Assessment / Migration / Verification Report（历史证据）；
7. [`past-rules/`](./past-rules/)（纯历史归档）。

报告中的旧 rule 编号、旧判断、旧阻塞原因不会自动覆盖后来的 Owner 裁决。

## 2. 双阶段仍然保留；部分 Mission 增加迁移前 Assessment

普通 Mission 仍有 Migration / Verification 两阶段；对于明确标记 `assessment_required=true` 的 Mission（当前为 MB-010..012），在 Migration 前增加一个**不承诺施工的价值评估门**：先比较 donor 与领取时 Utopia 最新 `main`，结果只能为 `FULL_MIGRATION / PARTIAL_MIGRATION / NO_VALUE`。Assessment Host 属于 migration-side host；若继续迁移，同一主机直接转为 Migration Host。

### Migration 完成语义

`migration_complete=true` 不再等价于“必须复制了代码”。完成必须同时记录 `migration_completion_basis`，允许三类：

- `IMPLEMENTED_COMPLETE`：Migration Host 实际迁移并留下 `MIGRATION_COMPLETE/PASS`；
- `OWNER_ACCEPTED_COMPLETE`：Migration Host 诚实记录 blocker/negative result，随后 Owner 明确裁决接受边界并声明 Migration complete；不得伪造原 Migration Host 的 PASS 事件；
- `SKIPPED_NOT_REQUIRED`：完整 Assessment 证明迁移整体无价值/已被当前 Utopia 等价或更优覆盖，因此**完全跳过实现仍视为完成**。

当 Assessment verdict 为 `NO_VALUE` 时：

```text
assessment_status = COMPLETE_NO_VALUE
assessment_complete = true
assessment_result = NO_VALUE
migration_status = SKIPPED_COMPLETE
migration_complete = true
migration_completion_basis = SKIPPED_NOT_REQUIRED
verification_status = NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete = true
merged_main_sha = null
```

City 报告仍必须写 **“判断无价值，任务保留，未迁移”**；assessment branch/报告/evidence 保留用于 provenance 和论文素材，但无需伪造 migration code、Verification 或 verified episode。

对于实际进入 Migration、或由 Owner 接受已有迁移边界的 Mission，仍保留两个独立完成状态：

- **MIGRATION_COMPLETE**：Migration Host 完成迁移、测试、报告与可要求的真实运行；不得自行合入实现仓库 `main`。
- **VERIFICATION_COMPLETE**：另一台不同实际主机完成独立审查、同步最新 `main`、维修/真实运行、双 CI、episode finalize，并由 Verification Host 合入 `main`。

同一 Mission 的 Migration Host 与 Verification Host 必须是**两个不同实际主机标识**；Hosted CI runner 不计入执行主机。

“要求两台主机都跑过”的默认解释是：**Migration Host 与 Verification Host 各自留下真实运行证据**，不再要求第三台机器或第二个 verifier。若某 Mission 明确要求额外物理设备，必须单独写在 mission-specific gate 中。

## 3. 新领取算法：Integration First

每次开始工作必须先读取 Digital-City 最新 `main`，并按以下顺序选择。

### P-1 — Owner-directed repair queue（临时最高优先级）

当前唯一授权顺序：

```text
1. MB-007 process closeout / Owner-override finalizer repair — COMPLETE
2. MB-008 verification + closeout — COMPLETE
3. MB-003 current-value reassessment + real execution-seam repair if still valuable — COMPLETE
   · value = ROUTE_B_CONTINUE; the donor execution seam migrated as `worker-runner`; two-host gate satisfied
   · episode `MB-003:5c0ab438d20476d1`; merge `756c7d7`; host separation OWNER_WAIVED under R10
```

前一步未写入 `repair_status: COMPLETE` 前，后一步不得完成 merge/finalize。允许后一步做只读侦察，但不得越序宣称完成。

每个 repair step 必须采用状态事务：

```text
City pre-state commit
→ Utopia work/evidence
→ City milestone update
→ CI/finalize/merge (or SKIPPED_COMPLETE)
→ City final closeout commit
```

如果中途失败，City 必须停在与事实一致的 `repair_status`，禁止等最后才补账。

### P0 — Verification / Integration

优先选择：

```text
execution_enabled = true
migration_complete = true
verification_complete = false
verification stage unclaimed or already claimed by this host
current host != migration_claim_host
not BLOCKED_OWNER_DECISION (unless the latest applicable Owner ruling has explicitly resolved it)
```

P0 内按以下优先级排序：

1. 已存在 substantive mission branch 且相对实现仓库 `main` 落后较多；
2. 修改共享控制面的分支；
3. sequence 升序。

以下文件/区域视为**共享控制面**，触及后自动提高 Integration 优先级：

- `city/CITY_IMPLEMENTATION_MANIFEST.json`
- `city/manifest.mjs`
- `city/tests/manifest.test.mjs`
- `services/capability-bridge/**`
- 全局 census / registry / shared contracts / promotion-history verifier

**任何 mission branch 落后实现仓库 main > 10 commits，或触及共享控制面且 main 已前进，都视为 P0 integration pressure。**

### P1A — Assessment-first Mission

只有在**没有本机可领取的 P0**时，才允许领取 assessment-first Mission：

```text
execution_enabled = true
assessment_required = true
assessment_complete = false
assessment stage unclaimed
dependencies satisfied
not BLOCKED_OWNER_DECISION
```

按 sequence 升序。领取后先创建只含过程记录/证据的 assessment branch，**不得先写实现代码**。Assessment-only branch 在没有产品/运行代码改动前不计入 substantive WIP。

Assessment verdict：

- `FULL_MIGRATION` / `PARTIAL_MIGRATION` → 同一 assessment host 原子转为 Migration Host，继续 P1B；
- `NO_VALUE` → 按 `SKIPPED_NOT_REQUIRED` 闭环：`migration_complete=true`、`verification_complete=true`，任务保留、未迁移、无需 episode，以后自动 skip，除非 Owner reopen。

### P1B — 新 Migration

只有在**没有本机可领取的 P0**时，才允许开始新的实质 Migration：

```text
execution_enabled = true
migration_complete = false
migration_completion_basis is not SKIPPED_NOT_REQUIRED
migration stage unclaimed OR reserved by this Mission's assessment host
dependencies satisfied
not BLOCKED_OWNER_DECISION
global unmerged substantive mission WIP < 2
for assessment_required missions:
  assessment_complete = true
  assessment_result in {FULL_MIGRATION, PARTIAL_MIGRATION}
```

然后按 sequence 升序。

### WIP Limit

`UNMERGED_WIP_LIMIT = 2`。

“WIP”指已经产生实质实现提交、但尚未进入实现仓库 `main` 的 Mission branch，包括等待 Verification 或等待 Owner 裁决的分支。**只有 assessment events / comparison evidence、没有实现代码变化的 assessment-only branch 不计入 WIP。** 历史遗留可暂时超过 2，但只要超过上限就冻结新的实质 Migration，直到 integration backlog 降回 2 以下。

不要为了让某台机器“有活干”而继续制造新分支。

## 4. Claim 与主机资格

- Claim 前先更新对应 Mission 文件并提交到 Digital-City `main`。
- `assessment_required=true` 的 Mission 先写 Assessment Claim；若 verdict 为 FULL/PARTIAL，同一 host 自动继承 Migration Claim，不允许另一台主机在两阶段之间竞抢。
- Assessment Claim 必须同时钉住领取时 Utopia `main` SHA；比较结论不得基于旧报告或旧目录印象。
- 写冲突 = Claim 失败，重新读取最新状态并重选。
- 已有阶段 Claim 且尚未结束时，其他主机不得抢占。
- 自动 worker 不得自行清空别人的 Claim。
- Claim 后尚无实质实现/报告时，Owner 可 reset；已有实质工作而无法继续时，进入 `BLOCKED_OWNER_DECISION` 或由 Owner 建立 superseding Mission。
- Mission Index 应尽量显示 Migration Host / Verification eligible host；但**Mission 文件 front matter 才是 Claim 真值**。

## 5. Dependency 的统一语义

除非 Mission 明确写出更弱的依赖，`dependencies satisfied` 默认表示：

> **依赖 Mission 的所需实现已经被 Verification 接受并进入目标实现仓库 `main`。**

仅有 `migration_complete=true`、但代码仍停留在未合并 branch，不默认算依赖满足。

## 6. Branch freshness 与合并策略

### Assessment-first

Assessment branch 同样从目标实现仓库**领取时最新 `main`**创建。完成 verdict 前只允许过程记录、结构化 events 和有界 research evidence；禁止先落实现代码。若 verdict 为 FULL/PARTIAL，该 branch 直接成为 Migration branch；若为 NO_VALUE，branch push 后保留为 provenance/research branch，不 merge、不删除。

### Migration

从目标实现仓库**最新 `main`**创建：

```text
mission/<MISSION_ID>-<slug>
```

Migration 阶段不合入 `main`。

### Verification / Integration

Verification Host 在开始维修和最终验证前必须重新读取最新 `main`：

- 若 mission branch 落后，**优先把最新 main merge 进 mission branch**，保留跨主机历史；默认不 force-push、不改写 Migration Host 历史。
- 先解决共享 manifest/registry/census 的并集与语义冲突，再运行 Mission-specific gate。
- 一个旧分支完成 merge 后，下一个待验分支必须**重新**基于新的 main 做同步；不得批量把多个旧分支同时按同一个旧 main 验完。

## 7. 真实消费门槛：v2

### 7.1 有等价消费面时

如果 Utopia 当前产品面已经存在与 donor 行为**语义等价**的消费 seam，Migration/Verification 必须真实走通该 seam；不得用纯 unit test 替代。

### 7.2 基础设施 / 管线模块没有等价消费面时

对于明确标记为非产品能力来源（例如 `capabilityProvider:false`）的 infrastructure / pipeline module：

- 若没有语义等价的现有 Utopia 产品消费面；
- 且接入现有 UI/服务会新增 capability、改变既有判定或跨 Building 偷接别的能力；

则**不得为了验收造新 UI / 新 capability**。此时允许：

> Verification Host 用真实、bounded、可复现的 integration chain 直接执行迁移后的模块，并记录输入、输出、failure/recovery、parity 与 evidence，作为“真实消费”门槛的满足方式。

### 7.3 关键执行能力不得借此豁免

如果 Mission 的核心产品价值本身就是**真实外部执行 seam**——例如 provider gateway、runner、device/backend execution——那么缺少真实 provider/runtime 不能用 7.2 的 bounded-chain 规则绕过。

这类 Mission 必须：

- 使用 donor 已支持的真实 provider/runtime 完成真实路径；或
- 由 Owner 授权 superseding Mission 把 donor 中 deferred 的 execution seam 一并迁入。

Mock pass 仍然禁止。

## 8. 非产品模块与 capability registry

City 级默认机制：

- 非产品能力模块可声明 `capabilityProvider:false`；
- capability enumeration 不应把这类 module 暴露成不可调用的产品 capability；
- building 可在必要时使用自己的 `kind` 覆盖 district 的默认 `kind`，由统一的 effective-kind 逻辑判断。

具体 Owner 裁决见 [`response-9-29.md`](./response-9-29.md)。

## 9. 独立 Verification

Verification Host 必须：

1. 先只看 donor、目标代码、diff、测试和运行状态，记录独立发现；
2. 再读 Migration Report 做 reconciliation；
3. 必要维修只发生在原 mission branch；
4. 不得通过删测试、跳过门禁、放宽目标语义换绿。

如果 donor 不在本机，不能把“donor 缺失导致 parity test skip”当作 parity 已通过；应明确记录缺失，并尽量重新取得冻结 donor 或把该门禁标为未验证。

## 10. 报告与 Utopia 狗粮

City 报告：

```text
mission-book/reports/MB-xxx/
├─ ASSESSMENT_REPORT.md    # assessment_required Mission 必填；所有 verdict 都保留
├─ MIGRATION_REPORT.md     # 仅实际迁移时
└─ VERIFICATION_REPORT.md  # 仅实际迁移时
```

Utopia 过程数据继续遵守 [`PROCESS_DATA_POLICY.md`](./PROCESS_DATA_POLICY.md)：

- raw evidence → `.runtime/evidence/mission-book/...`
- bounded events → `data-records/evolution/inbox/mission-book/...`
- accepted episode → `data-records/evolution/episodes/mission-book/...`

Owner 裁决发生后，下一位实际触碰对应 mission branch 的施工者应追加一个 `OWNER_INTERVENTION` 事件，引用最新适用裁决；MB-010..012 本轮引用 `Digital-City/mission-book/response-9-30.md`。

## 11. Finalize / 双 CI / Merge

### 11.1 正常实现型 Migration

```text
independent review
→ merge latest main into mission branch when needed
→ repair / real-use verification
→ implementation required CI GREEN
→ CI_RESULT PASS
→ VERIFICATION_COMPLETE PASS
→ pnpm mission:finalize (host-pass)
→ commit episode + inbox removal
→ FINAL BRANCH HEAD required CI GREEN
→ Verification Host merge main
→ City VERIFICATION_REPORT / Mission metadata
```

### 11.2 Owner-accepted Migration

若 Migration Host 曾诚实记录 `BLOCKED`，而 Owner 后续明确裁决该边界可接受并声明 Migration complete：

- 不得伪造 Migration Host 的 `MIGRATION_COMPLETE/PASS`；
- finalizer 必须支持显式 `owner-override` basis，并要求 Owner ruling + `OWNER_INTERVENTION` + 原 migration blocker；
- episode 必须保存 `migrationAcceptance.mode=OWNER_OVERRIDE` 与 ruling reference；
- Verification 仍需 independent finding、真实 bounded chain（适用时）、PASS CI 与 `VERIFICATION_COMPLETE/PASS`。

### 11.3 完全跳过

`SKIPPED_NOT_REQUIRED` 不接受任何实现代码，因此：

- 不运行 `mission:finalize`；
- 不生成假的 verified implementation episode；
- 不要求 Utopia merge；
- City Assessment Report + immutable assessment branch/evidence 即为闭环证据；
- Mission 直接 `migration_complete=true`、`verification_complete=true`。

任何实际进入 finalize 的路径都不得在 finalize 后跳过最终 branch HEAD CI。

## 12. Assessment-first 候选

MB-010..012 已由 Owner 于 2026-09-30 启用为**可自动领取的价值评估 Mission**，不再是 disabled placeholder：

- **MB-010 Node Fabric**：先比较 Boss Node Fabric 与当前 Utopia node/host/capability truth。
- **MB-011 Customs**：先比较 donor admission checks 与当前 manifest/promotion/capability/provenance checks。
- **MB-012 Runtime Compliance**：先比较 donor enforcement 与当前 City Core/Capability Fabric/runtime gates。

统一要求：

1. 先 Assessment，后决定是否迁移；
2. 必须在 Mission 文件直接填写 capability 对照表；
3. `NO_VALUE` 时向 City 明确报告“判断无价值，任务保留，未迁移”，不得写实现；同时按 `SKIPPED_NOT_REQUIRED` 将 Migration 与 Verification 标记完成；
4. `PARTIAL_MIGRATION` 只允许迁移能补足真实缺口的有界子集；
5. 所有正/负结果、parity、失败/放弃理由和可测量指标都保留为论文/工程素材；
6. Utopia 素材继续使用 `.runtime/evidence`、evolution inbox、选择性 `evidence/raw`；只有实际迁移并完成 Verification 后才生成 verified episode；完全跳过不生成 episode。

## 13. 当前 7 → 8 → 3 收口工程

绑定工程书：[`ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md`](./ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md)。

- **Step 1 — MB-007:** COMPLETE。实现、Owner-override finalizer、verified episode、repair merge 均已闭环；禁止再修改 Research Institute 实现。
- **Step 2 — MB-008:** ✅ **COMPLETE (2026-09-30)。** 价值复核 = `ROUTE_B_CONTINUE`（`main` 无 `10-automation`，且不覆盖 safety/contract 面）。分支已先同步 `main`（`77b774c`，reconciled CI `36655586918` PASS）。bounded chain 全绿：happy path / 真实 refusal（`DESTRUCTIVE_FORBIDDEN`，零 mutation，artifact 逐字节一致）/ 真实 miss（真删文件，同一真实 `facts.fileExists` 报 absent，donor postcondition `failure` kind `file`）/ recovery（donor `retry`+`RETRYABLE`、`settle stable` → `landed`，复验 `success`），`NO_MOCK_FACTS = true`。`RUNTIME_PASS` `bbf126ea…`、final `CI_RESULT` PASS `06f57c06…`、`VERIFICATION_COMPLETE` PASS `fd0225d1…`。owner-override episode `MB-008:6ae0bbd46e425c9f`（sha256 `a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e`），inbox 已消费，Alien 的 `RUNTIME_FAIL/BLOCKED` 保留（未伪造 `MIGRATION_COMPLETE`，R5）。final branch CI `36663533485` PASS（`f8f82cd`）；merge `168182c`（`--no-ff`）；merged-main CI `36663813362` PASS；merged-main 五门禁全绿 + 结构检查全 OK。**deferred runtime plane 仍未迁入**（无真实 desktop/browser/UI 自动化）。
- **Step 3 — MB-003:** ✅ **COMPLETE (2026-09-30).** 价值复核 = `ROUTE_B_CONTINUE`：`main` 的 `02-worker-gateway` 当时只有 `skill-intake`，`WG-01..08` 全缺，Route A 禁止，因此按 `response-9-29` R1 与 `response-9-30` R8 在**原 Mission 身份**下执行 §13 的 completion repair：把 deferred 的 donor 真实执行 seam 迁为 `city/02-engineering/02-worker-gateway/worker-runner`（`createRunner` → `startJob`/`killTree`/`childEnv`/`dshBin`/`nodeExecutable`，逐行等价，唯一适配是把 donor 硬编码的 `D:\` 主机路径改为注入 seam；`scheduler.js`/`gate.js`/`system.js` 仍 deferred 并记录在 `DONOR.json`）。**两台主机的真实 provider receipt 都已取得**：`Mech`（`MEGA-REP`，见 `reports/MB-003/VERIFICATION_REPORT.md` §8.3）与 `Alien`（`MERA-ALIANWARE`，`RUNTIME_PASS MB-003:b84512cd12f80735`，八项 verdict 全 true，含真实 `exit 0` 返回模型答案 `OK`），two-host gate 满足。engineering book §4.5 的真实链路随后**通过迁移后的模块本身**重跑：`PORTED_SEAM_RESOLVES_RUNTIME` / `PORTED_SUBMIT_PROGRESS_RESULT` / `PORTED_CANCEL_INTERRUPT` / `PORTED_UNSUPPORTED_REFUSAL` / `PORTED_BREAKER` 五项全 true，日志中无密钥。合并 `main` 时四处冲突全部按并集/超集解决（registry 取 main 的双方排除机制 + resolution split；census 由合并后的 manifest 重新生成并逐条一致，32 个 module；双语文档把 MB-003 作为第 8 节追加，保持配对）。**主机分离：`OWNER_WAIVED`（`response-9-30.md#R10`）** —— Verification Host 本轮无法执行收口，Owner 显式授权本 Mission 的 Migration Host 完成，条件是不得伪造历史、Mech 的事件与 `BLOCKED` finding 原样保留、episode 显式记录 `hostSeparation.mode=OWNER_WAIVED` 与各角色实际 host、且其余 verification 标准一项不降；finalizer 增加了该 waiver 路径并有 10 条新测试覆盖正例与全部拒绝情形。**结果：** episode `MB-003:5c0ab438d20476d1`（27 events，digest `694b5edb…`）；final branch CI `36671502121`、implementation CI `36671050015`、merged-main CI `36671850064` 全 PASS；merge `756c7d760c605e33ba386e87605e078fe24b82ca`。

每一步必须同步 Mission front matter、README、MISSION_INDEX 和对应 Report。

## 14. 历史规则

旧版 migration-first rule 及旧模板已归档到 [`past-rules/`](./past-rules/)。

**现役 Mission 文件不再复制完整全局规则。** Mission-specific gates 仍然有效；全局流程统一引用本文件，避免未来规则更新后十二份文件互相漂移。
