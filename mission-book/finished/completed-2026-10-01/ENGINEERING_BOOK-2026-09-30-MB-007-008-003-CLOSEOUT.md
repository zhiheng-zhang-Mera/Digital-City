# Engineering Book — Mission 7 → 8 → 3 Closeout Repair

**Date:** 2026-09-30  
**Owner order:** **MB-007 → MB-008 → MB-003**  
**Control plane:** `zhiheng-zhang-Mera/Digital-City/mission-book`  
**Implementation repo:** `zhiheng-zhang-Mera/utopia`

> 本工程书是一次**收口修补**，不是新一轮防御性扩张。目标是让事实、代码、证据、finalizer 与 City 状态一致，并尽快清空 7/8/3 backlog。  
> 禁止为了“全绿”伪造历史、扩大 Mission 边界、补 donor 中不存在的能力、增加新 UI/capability、重写已经接受的实现。

---

## 0. 起始快照

工程书创建时：

- Digital-City main: `f616ddcb48413bc59fc9e8e661e5e0472da9b0f9`
- Utopia main: `cb8e0bd77ccf0864cf0af50b4624f2f556b6b279`
- MB-007: 已 Verification COMPLETE 并 merge 到 Utopia main；缺 verified episode。
- MB-008: Migration Owner-accepted；Verification 已由 Mech claim，尚未 closeout。
- MB-003: Migration complete；Verification 被真实 provider execution seam 阻塞。

**执行每一步前必须重新读取两个仓库最新 main 与 Mission front matter；不得把本快照当运行时真值。**

---

# 1. 绝对规则

## 1.1 顺序

```text
STEP 1 — MB-007
  ↓ only after repair_status=COMPLETE
STEP 2 — MB-008
  ↓ only after repair_status=COMPLETE
STEP 3 — MB-003
```

后一步允许只读侦察，但不得越序 finalize / merge / 宣称完成。

## 1.2 City 状态事务

每一步都必须：

```text
A. City pre-state commit
B. Utopia work + evidence
C. City milestone update
D. final CI / finalize / merge OR SKIPPED_COMPLETE
E. City final closeout commit
```

至少同步：

- 对应 `MB-xxx-*.md` front matter；
- Mission 正文 closeout/repair 段；
- `mission-book/README.md` 进度表；
- `mission-book/MISSION_INDEX.md`；
- 对应 Assessment/Migration/Verification Report。

失败时必须把 City 停在真实状态，例如 `repair_status: BLOCKED`，不能等最后才补账。

## 1.3 合法的 Migration completion basis

```text
IMPLEMENTED_COMPLETE
OWNER_ACCEPTED_COMPLETE
SKIPPED_NOT_REQUIRED
```

**完整比较后决定完全不迁，也算完成。**

但 `SKIPPED_NOT_REQUIRED` 只能用于：

- 当前 Utopia 已等价/更优覆盖；
- donor 行为已无独立价值；
- 迁入只会制造重复/错误 ownership；
- migration-only 下没有值得保留的 gap。

它不能用于掩盖“仍然有价值但环境缺失”的 blocker。

## 1.4 禁止伪造历史

- 不得给 Alien 补写它当时没有发出的 `MIGRATION_COMPLETE/PASS`。
- 原 `RUNTIME_FAIL/BLOCKED` 必须留在历史和 episode/report。
- Owner override 必须显式引用 City ruling。

---

# STEP 1 — MB-007 process closeout

## 2.1 City pre-state

先更新：

```yaml
repair_sequence: 1
repair_status: IN_PROGRESS
migration_completion_basis: OWNER_ACCEPTED_COMPLETE
```

同时明确：

- implementation 已接受；
- Verification 已接受；
- 已 merge Utopia main；
- **唯一 repair scope = Owner-override finalizer contract + verified episode**。

不得重迁 Research Institute。

## 2.2 Utopia repair branch

从执行时最新 main 建：

```text
repair/MB-007-owner-override-finalize
```

修改：

```text
scripts/finalize-mission-episode.mjs
contracts/evolution/mission-episode-v1.schema.json
对应 tests
```

增加：

```text
--migration-acceptance host-pass|owner-override
--owner-ruling <City ruling ref>
```

默认仍为 `host-pass`，不能破坏既有 Mission。

### owner-override 必须验证

1. migration-side 存在真实 `BLOCKED` event；
2. Verification Host 存在 `OWNER_INTERVENTION`；
3. intervention 可定位到指定 Owner ruling；
4. 存在 independent `VERIFIER_FINDING`；
5. final verification `CI_RESULT=PASS`；
6. 存在 `VERIFICATION_COMPLETE=PASS`；
7. migration host != verification host。

episode 增加可审计字段，例如：

```json
{
  "migrationAcceptance": {
    "mode": "OWNER_OVERRIDE",
    "ownerRuling": "Digital-City/mission-book/response-9-29.md#R6",
    "migrationBlockerEventId": "...",
    "ownerInterventionEventId": "..."
  }
}
```

### 测试至少覆盖

- old host-pass happy path；
- owner-override happy path；
- 无 migration blocker → FAIL；
- 无 Owner ruling → FAIL；
- ruling/intervention 不匹配 → FAIL；
- 无 verifier finding → FAIL；
- final CI 非 PASS → FAIL；
- same host → FAIL。

## 2.3 用真实 MB-007 inbox 重放

使用 main 上已有：

```text
data-records/evolution/inbox/mission-book/MB-007/events.jsonl
```

Owner basis：

```text
Digital-City/mission-book/response-9-29.md#R6
```

不得新造 Alien PASS。

生成：

```text
data-records/evolution/episodes/mission-book/MB-007/episode.json
```

删除 inbox，提交 episode，跑最终 branch CI。

## 2.4 Merge + City closeout

必须满足：

```text
finalizer tests PASS
required Utopia checks PASS
episode generated
inbox removed
final branch CI PASS
repair branch merged
merged-main CI PASS
```

然后 City：

```yaml
repair_status: COMPLETE
episode: data-records/evolution/episodes/mission-book/MB-007/episode.json
```

在 MB-007 Verification Report 追加 repair appendix：

- finalizer repair SHA；
- episode digest；
- final CI；
- repair merge SHA；
- 原 blocker 保留。

**City final closeout commit 完成后才进入 Step 2。**

---

# STEP 2 — MB-008 Verification / conditional skip

## 3.1 City pre-state

确认：

```yaml
MB-007 repair_status: COMPLETE
```

再更新 MB-008：

```yaml
repair_sequence: 2
repair_status: IN_PROGRESS
verification_status: CLAIMED
verification_claim_host: Mech
migration_completion_basis: OWNER_ACCEPTED_COMPLETE
```

## 3.2 先重新判断当前价值

不要直接把旧 branch 往 main 塞。

比较：

- frozen donors；
- MB-008 migration branch；
- **post-MB-007-repair Utopia main**；
- 当前 Windows/platform/services/capability surfaces。

### Route A — 整体已无价值

只有当计划能力整体已被当前 Utopia 等价/更优覆盖，或迁入只会制造重复/错误 ownership，允许：

```yaml
migration_status: SKIPPED_COMPLETE
migration_complete: true
migration_completion_basis: SKIPPED_NOT_REQUIRED
verification_status: NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete: true
repair_status: COMPLETE
merged_main_sha: null
```

报告必须写：

> **判断无价值，任务保留，未迁移**

旧 branch 保留 provenance，不 merge，不生成假的 episode。

### Route B — 仍有价值

继续以下施工。

## 3.3 Sync current main

在 `mission/MB-008-computer-use` 上 merge 最新 main。

要求：

- 保留 MB-007 finalizer repair；
- manifest / registry / census 做 union；
- 不 force push；
- merge commit 后再跑依赖 HEAD 的 promotion-history 检查。

## 3.4 Verification

按 `response-9-30.md#R7`：

- 不要求 Alien 追溯补跑旧 bounded action；
- Mech 必须真实执行 donor-supported desktop/file/shell/UI bounded chain；
- 必须验证 postcondition；
- 至少一个 refusal / permission / error path；
- 至少一个 recovery / stabilization path；
- 不扩张 deferred runtime plane；
- 不造新 UI/capability。

先独立 review，再读 Migration Report。

## 3.5 Owner-override finalize

记录 `OWNER_INTERVENTION`，引用：

```text
Digital-City/mission-book/response-9-29.md#R7
Digital-City/mission-book/response-9-30.md#R7
```

CI PASS + `VERIFICATION_COMPLETE/PASS` 后：

```text
pnpm mission:finalize ...   --migration-acceptance owner-override   --owner-ruling Digital-City/mission-book/response-9-29.md#R7
```

生成 episode → 删除 inbox → final branch CI → merge main → merged-main CI。

## 3.6 City closeout

创建/更新：

```text
mission-book/reports/MB-008/VERIFICATION_REPORT.md
```

最终：

```yaml
verification_status: COMPLETE
verification_complete: true
repair_status: COMPLETE
verification_head_sha: <final>
verification_ci: <runs>
merged_main_sha: <merge>
episode: <path>
```

同步 README / MISSION_INDEX。

---

# STEP 3 — MB-003 reassessment + real execution seam

## 4.1 City pre-state

确认：

```text
MB-007 repair_status = COMPLETE
MB-008 repair_status = COMPLETE
```

然后：

```yaml
repair_sequence: 3
repair_status: IN_PROGRESS
```

## 4.2 先比较，不默认迁旧分支

比较：

- DS-Hns frozen donor；
- Codex-Boss frozen donor；
- `mission/MB-003-worker-gateway`；
- post-MB-008 Utopia main；
- 当前 Foreman / capability fabric / runtime services / provider surfaces。

### Route A — 整个 MB-003 已无价值

如果当前 main 已等价/更优覆盖：

```yaml
migration_status: SKIPPED_COMPLETE
migration_complete: true
migration_completion_basis: SKIPPED_NOT_REQUIRED
verification_status: NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete: true
repair_status: COMPLETE
merged_main_sha: null
```

报告：

> **判断无价值，任务保留，未迁移**

旧 branch 不 merge。

### Route B — 仍有价值

real execution seam 是硬门槛。

## 4.3 Probe 两台实体主机

在写代码前记录：

```text
Alien provider/runtime inventory
Mech provider/runtime inventory
donor-supported provider availability
version/readiness
real execution possibility
```

允许安装/启用**官方且 donor 已支持**的 runtime/provider；不得写 mock provider。

若仍无 real path，但 MB-003 仍有价值：

```yaml
repair_status: BLOCKED
verification_status: BLOCKED_ENVIRONMENT
```

向 City 报告并停止。此时**不能**用 SKIPPED_COMPLETE 掩盖环境 blocker。

## 4.4 Reconcile original branch

在原 Mission identity 下继续：

```text
mission/MB-003-worker-gateway
```

merge 最新 main，不 force push。

只允许补 frozen donor 已有的：

- provider/runner execution seam；
- runtime registry/supervisor wiring；
- spawn/lifecycle/result/evidence；
- donor 已有 interruption/cancel/failure behavior。

禁止：

- planner；
- vendor UI；
- 新 provider protocol；
- mock pass；
- unrelated cleanup。

## 4.5 Real gate

必须真实完成：

```text
detect
→ submit
→ progress
→ result OR honest unsupported
```

并验证：

- provider failure/interruption；
- circuit breaker；
- cancel/interrupt（donor 支持时）；
- error 不改写 success；
- Skill Intake / gateway regressions 全绿。

## 4.6 Finalize + merge

MB-003 已有 Migration Host 的真实 `MIGRATION_COMPLETE/PASS`，因此使用正常：

```text
--migration-acceptance host-pass
```

完成：

```text
independent finding
real execution evidence
CI_RESULT PASS
VERIFICATION_COMPLETE PASS
mission:finalize
episode commit
final branch CI
merge main
merged-main CI
```

## 4.7 City closeout

最终：

```yaml
verification_status: COMPLETE
verification_complete: true
repair_status: COMPLETE
verification_head_sha: <final>
verification_ci: <runs>
merged_main_sha: <merge>
episode: <path>
```

更新现有 MB-003 Verification Report，保留最初 “no provider” blocker + 后续真实解决路径。

---

# 5. 论文 / 工程素材

每一步自然产生的数据都保存，不为论文制造额外失败：

- donor/source SHA；
- claim-time / repair-time main SHA；
- stale branch ahead/behind；
- conflict count / type；
- capability overlap/gap matrix；
- rejected approaches / reason codes；
- test counts；
- CI run IDs；
- runtime fail/recovery；
- Owner intervention；
- migration completion basis；
- files/lines changed（有意义时）；
- episode digest；
- NO_VALUE negative result。

沿用：

```text
Digital-City/mission-book/reports/MB-xxx/
Utopia/.runtime/evidence/mission-book/...
Utopia/data-records/evolution/inbox/mission-book/...
Utopia/evidence/raw/mission-book/...      # bounded/non-sensitive only
Utopia/data-records/evolution/episodes/... # actual accepted implementation only
```

---

# 6. 总验收

工程书完成的唯一合法终态：

```text
MB-007 repair_status = COMPLETE
AND
MB-008 repair_status = COMPLETE
AND
MB-003 repair_status = COMPLETE
```

MB-008 / MB-003 的 COMPLETE 可以来自：

```text
verified implementation + episode + merge
OR
SKIPPED_NOT_REQUIRED with evidence-backed NO_VALUE
```

但 MB-003 若“仍有价值、只是没有真实 provider 环境”，必须停在 BLOCKED。

7 → 8 → 3 全部闭环后，调度器才回到 MB-010 → MB-011 → MB-012 assessment-first 队列。
