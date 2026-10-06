# Verification Report — MB-004

```text
MISSION = MB-004
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-004-project-foreman
MIGRATION_HEAD = 70806ad1277904c214f29f5da52cb5c7db1d90da
FINAL_BRANCH_SHA = 4ae80785696eac1ca077a45a4a5507d3802b3995
FINAL_BRANCH_CI = PASS — run 36590188621 (V0.2 checks) on 4ae80785696eac1ca077a45a4a5507d3802b3995
MERGED_MAIN_SHA = 0eed05b58c126a70224cb4757ba12f76bbe4d4b7
VERIFICATION_COMPLETE = true
```

- **Verification claim:** 2026-09-29T15:02:33Z, City claim commit `7d0569d4e68618721fdcb9e4a7c36c1cc7caa46a`.
- **Rule 5:** migration host `Mech`, verification host `Alien` — different hosts.
- **Rule 9 order:** the independent review in §1 was written and recorded as events *before*
  `reports/MB-004/MIGRATION_REPORT.md` was opened. §2 is the reconciliation.
- **⚠ One gate clause is NOT exercised and is flagged to the Owner in §6.1.** Nothing about it was faked.

---

## 0. 任务选择 / Why MB-004

Selection was re-made against the latest Digital-City `main` immediately before claiming, as rule 3
requires. No migration task remained claimable (`MB-010`/`MB-011`/`MB-012` are
`execution_enabled: false`; `MB-001` and `MB-002` were fully complete), so selection fell to the
migrated-but-unverified set by `SEQUENCE` ascending: `MB-003` verification was already claimed by
`Mech` (rule 4 → skip), and `MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and rule 13.
`MB-004` is the lowest-sequence eligible mission.

---

## 1. 独立审查 / Independent review

> 本节在阅读 Migration Report 之前记录。审查对象只有：冻结 donor、目标代码、diff、测试与运行状态。

### 1.1 审查范围 / Scope

| 项目 | 值 |
| --- | --- |
| 迁移分支 | `mission/MB-004-project-foreman` @ `70806ad1277904c214f29f5da52cb5c7db1d90da` |
| merge-base with `main` | `c7ef3cd1c6be0155332d03afc3607dfdbf49c205` |
| 规模 | 54 文件、22 039 行新增；目标模块 26 个 `.mjs`（25 个移植模块 + `DONOR.json`）、21 个测试文件 |
| Donor | `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`（22 模块）、`Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`（3 模块） |
| 目标路径 | `city/02-engineering/01-project-foreman/project-foreman` |

### 1.2 Code / diff findings

- **F1 — 交付状态下 5 条 donor 差分 parity 测试根本没有运行。**
  模块 19 个测试文件共 458 用例，交付状态为 452 pass / 0 fail / **6 skipped**。其中 5 条 skip
  的原因是差分测试在 `.runtime/evidence/mission-book/MB-004/donor-hns` 找不到 donor checkout
  （`tests/adapters-autonomy.test.mjs:86-88`、`tests/plan-parity.test.mjs:58-59`）。也就是说，
  迁移报告里"最强证据"的那批 parity 断言，在任何干净主机上都不会执行。
- **F2 — MB-004 没有任何运行时/真实消费证据。** `scripts/` 下没有 pilot，`.runtime/evidence/mission-book/MB-004/`
  没有运行输出，`evidence/raw/mission-book/MB-004/` 不存在。唯一的"真实进程"覆盖来自一条 donor 派生用例
  （`tests/donor/engineering-process-real.test.mjs`，跑 `process.execPath -e ...`）。而本 Mission 的
  Verification 门槛明确要求真实 Engineering job 并**禁止仅用单元测试替代**。
- **F3 — "通过 MB-003 Worker Gateway"这一句在本分支无法执行。** 本分支只有 wave-1 的
  `skill-intake`；MB-003 的 `provider-adapter/`、`provider-resilience/`、`worker-task-contract/`
  只存在于 `origin/mission/MB-003-worker-gateway`（其验证由 `Mech` 持有且当时未完成，规则 5 禁止
  `Alien` 触碰）。而且本移植与它**零耦合**：全模块搜索
  `worker-gateway|skill-intake|capability-bridge|02-worker-gateway` 命中 0 次，依赖只有 `node:` 内建与
  相对 `.mjs`。
- **F4 — 两处"故意保留的 donor 缺陷"是真的被保留并被测试钉住的，不是被藏起来的。**
  - 取消的 episode 泄漏 workspace lock：`tests/supervisor.test.mjs:390-408` 断言
    `result === 'CANCELLED'` **并且** `runtime/engineering/workspace.lock` 仍然存在，注释写明
    "谁要'修好'它就会让这条测试大声失败"。
  - bounded-retry 分支不可达：`tests/supervisor.test.mjs:414-450` 断言 `retry-parked` 事件数为 **0**、
    `result === 'BLOCKED'`、`repairRounds === 0`，并在注释里指明这是 donor `supervisor.cjs` 的行为。
- **F5 — 唯一的故意分歧已直接对 donor 复核。** donor `Codex-Boss src/shared/recovery.ts:366` 取出
  `RECOVERY_RULES[cls]` 后，在 `:369` 直接解引用 `rule.inapplicable[step]`，无任何守卫，未知 class 就是
  未捕获的 `TypeError`。移植体（`failure-recovery.mjs:413-416`）恰好只加了一条
  `if (!rule) throw`。分歧确实只有一个。
- **F6 — 完成门禁没有被削弱。** 移植体 `result.mjs:184` 与 donor `result.cjs:165` 是同一个表达式
  `verdict: failed.length === 0 ? 'COMPLETED' : 'REFUSED'`，`REFUSAL_REASONS` 集合一致，没有引入
  `FAILED` 判定。
- **F7 — 延期清单是诚实的。** `index.mjs` 并**未**再导出 Boss 的 requirements-driven Execution DAG
  与 acceptance-hub 家族，文件头写明了原因（本树没有 `RequirementsGraph` 生产者）。
- **F8 — 本分支重写了共享 capability 测试，若整体采用会弱于当时的 `main`。** 与 MB-002 分支一样，
  它把绝对计数改成 census 相对、把 `districts[0]/[2]` 改成 `at(-1)`；但 `main`（MB-001 之后）已带有
  **按 id 定位**的 qualified-identity 精确断言。合并时必须是并集而非整体采用。
- **F9 — manifest 与 census 改动是纯增量。** 增加 1 个 building、1 个 module（donor `DS-Hns @ eeb57ca5`，
  22 个 source path）与 census 中 1 行；没有修改任何既有条目。

### 1.3 Donor parity findings

- DS-Hns 侧 22 个模块全部移植；Codex-Boss 侧 3 个（`recovery.ts`、`ci-repair.ts`、`correction.ts`）。
- 两个 union 半边保持为 union 而非赢家：`failure.mjs`（16 个小写 class + 修复记忆）与
  `failure-recovery.mjs`（13 个大写 class + 每 class 预算阶梯），互不导入、互不翻译。
- `DONOR.json` 记录了 8 个 donor bug、5 类 PORT_ADAPTATION、7 项 DEFERRED。

### 1.4 Runtime / use findings

- 分支上唯一可用的真实运行是 donor 派生的一条用例；端到端真实 job 证据缺失（F2）。
- **消费面**：本 Mission 未新增 UI/路由/面板（`services/dev-gateway/server.mjs` 未被触碰），
  宿主消费方式即 `run({workspace, goal, contract, ...})`。

### 1.5 Initial verdict

**PASS-with-required-evidence.** 移植本体是忠实的：分歧唯一且已复核、两处 donor 缺陷被如实保留并钉住、
完成门禁未变、延期边界诚实。缺的是运行时证据（F2）与 MB-003 网关条款的裁决（F3）。两者都在 §3 与 §6.1
处理。

---

## 2. 对照 Migration Report / Reconciliation

### 2.1 确认一致 / Confirmed

| 报告主张 | 复核结果 |
| --- | --- |
| §2/§2.1 落地边界与 25 条 source→target 映射 | 与 diff 逐条一致 |
| §6.1 全 city 套件 586 pass / 0 fail / 1 skipped | **实测完全一致**（本主机补上 donor 后 587 用例，586 pass / 0 fail / 1 skipped） |
| §6.4 `result.mjs` 必须报 `REFUSED` 而非 `FAILED` | **独立复核通过**（F6），移植体与 donor 逐行一致 |
| §8.1 唯一故意分歧 | **独立对 donor 复核通过**（F5） |
| §8.5 两处 donor 缺陷 | **独立复核通过**（F4），且都是断言缺陷本身而非断言"已修复" |
| §8.4 延期清单不是遗漏 | **独立复核通过**（F7） |
| §10.1 单卷主机上 cross-volume 套件应 skip 而非 fail | 观测一致；本机剩余的 1 条 skip 是 `EPERM` symlink 用例，属环境限制且有具名原因 |
| §8.7 本机无法构建 Android、真实 job 是验证主机的活 | 与本次分工一致 |

### 2.2 差异 / Differences

| 编号 | 差异 | 判定 |
| --- | --- | --- |
| D1 | 报告 §9 把 `.runtime/evidence/mission-book/MB-004/donor-hns/**` 与 `run-1/tests/*.txt` 列为证据指针，但那些是**另一台主机上的 git-ignored 文件**。交付分支上它们不存在。 | 由此产生 F1 —— 最强的差分 parity 断言在干净主机上静默 skip。已由 R1 在本机补齐并**实际执行**。建议：这类差分测试要么携带一个可复现的 donor 获取脚本，要么把"donor 缺席"记为 `TEST_FAIL` 而不是 skip。 |
| D2 | 报告 §8.2 已经指出"同一个修复现在独立存在于三条 mission 分支上，最先合并的那条带走它，另两条会重复或冲突"，并建议在 `main` 上单独修一次。 | 一致，且本次合并证实了该预测：MB-004 分支的版本与 `main`（MB-001/MB-002 之后）再次冲突。裁决见 §5。 |
| D3 | 报告未提及：合并 MB-004 会让 Web/Android 的 capability 列表**从 5 条变成 6 条**，多出的一条是永不
可调用的 `city.02-engineering/01-project-foreman/project-foreman`（`BRIDGE_PENDING`）。 | **真实的产品面变化**，见 §6.2。MB-002 之所以没有这个问题，是因为它的模块落在 `infrastructure` district 被过滤掉；`02-engineering` 是 `domain` district，MB-001 建立的过滤器不覆盖它。 |

### 2.3 边界一致性 / Boundary

"明确未迁"与复核一致：`app/sub-worker/**`（归 MB-003）、`app/engineering-host.cjs`、Computer-Use 域、
City-wide authority 与 Capability/Node global truth 均未出现。`process.mjs` 没有移植
`app/computer-use/{processes,errors}.cjs`，而是保留 donor 的注入式 registry seam 并回退到最小本地 registry，
与报告 §3.2 一致。

---

## 3. 二次维修与验证 / Secondary repair & verification

### 3.1 维修 R1 —— 让差分 parity 测试真正运行

在 `.runtime/evidence/mission-book/MB-004/donor-hns` 建立指向冻结 donor 克隆 `D:\DS-Hns-donor` 的
目录联接（junction）。已核对 `git rev-parse HEAD` = `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`，
与冻结基线完全一致；`.runtime/` 被 git 忽略，因此**分支内容零改动**。效果：5 条原本被跳过的差分测试
全部执行并通过：

```text
✔ the adapter port agrees with the donor module for every adapter and fixture
✔ the autonomy port agrees with the donor module decision by decision
✔ the episode port agrees with the donor module transition by transition
✔ the failure module agrees with the donor module field by field
✔ the discovery module agrees with the donor module field by field
```

### 3.2 维修 R2 —— 真实端到端运行时 pilot

新增 `scripts/mb004-foreman-pilot.mjs`（与仓库既有的 20 个 `scripts/*-pilot.mjs` 同一模式）。
它用**真实**进程驱动真实入口点：真实 scratch git 仓库、真实 `node --test` 子进程、真实 git 指纹、
真实 workspace lock、真实 mutation journal 与 ownership 规则、真实 checkpoint/recovery store、
真实 result gate。证据写入
`.runtime/evidence/mission-book/MB-004/run-001/foreman-runtime-pilot.json`。

| 阶段 | 结果 |
| --- | --- |
| 1 真实工程 job | **COMPLETED**；6 步；补丁真实落到磁盘文件；事后真实套件 exit 0；5 个 checkpoint；phase trail `INITIALIZING→DISCOVERING→PLANNING→TESTING→EDITING→TESTING→VERIFYING` |
| 2 优雅中断 | **CANCELLED**（第 2 步）；checkpoint 可读，cursor `nextStepIndex=1`、已验 `template:reproduce:1`；**workspace lock 被留下**（donor 缺陷 2 的真实复现）；再恢复该 episode 被拒绝：`a terminal episode cannot be made active by a checkpoint write` |
| 3 进程杀死 + 恢复 | pilot **杀死了一个活着的 episode**（其自身 checkpoint 已验 `template:reproduce:1` 与 `template:patch:3`，seq 6），留下 stale lock；携带**原 episode id** 与显式 `stealStaleLock` 恢复后 **COMPLETED**，只走 **4 步**（完整运行为 6 步），且 phase trail **跳过了 EDITING**——因为它没有重做已验证的工作。这就是 continuation 而非 restart。 |
| 4 所有权拒绝 | 用户正未提交地编辑契约要改的那个文件时，episode 以 **REFUSED** 结束（原因：`the required tests did not pass`、`an unresolved critical failure remains`），用户字节**原样保留** |

阶段 3 顺带确证了三条 donor 恢复协议：恢复描述符必须携带**原** episode id（否则
`EPISODE_ID_MISMATCH`）；被遗弃的 workspace lock 默认**不会**被抢占，必须由恢复方显式
`contract.stealStaleLock`；以及一个**终态** episode 不能被 checkpoint 复活——即只有"被遗弃的运行"可恢复，
"被优雅取消的运行"不可恢复。

### 3.3 验收矩阵 / Acceptance matrix

**分支 `5ef0b2c7bbf7f24b5eb4a32d2cc5c7faa59c2af6`：**

| 检查 | 结果 |
| --- | --- |
| 全 city 套件 `node city/test-all.mjs` | **587 用例 / 586 pass / 0 fail / 1 skipped** |
| 模块套件（19 文件，含 donor） | **458 用例 / 457 pass / 0 fail / 1 skipped** |
| `pnpm test` | **58 / 58** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| `node scripts/verify-promotion-history.mjs` | 10 条记录 OK |
| `pnpm check:docs` | docs / evidence / data-records 三对 **SYNCHRONIZED** |

**合并后 `main` `0eed05b58c126a70224cb4757ba12f76bbe4d4b7`（含同时落地的 MB-006）：**

| 检查 | 结果 |
| --- | --- |
| `pnpm test` | **62 / 62** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| `node city/test-all.mjs` | **810 用例 / 809 pass / 0 fail / 1 skipped** |
| `node scripts/verify-promotion-history.mjs` | 10 条记录 OK |
| `pnpm check:docs` | 三对 **SYNCHRONIZED** |

### 3.4 真实消费 / Real use

- 宿主消费面即 `run()` 单一入口（`index.mjs` 132 行，导出 59 项）；**未新增任何 UI/路由/面板**，
  `services/dev-gateway/server.mjs` 未被触碰。符合规则 14。
- 诚实说明：本主机**未**运行 Android 模拟器，Android 侧未涉及（迁移未改 Android 源码）；
  CI 的 `android` 作业为 success。

### 3.5 故障 / 恢复

见 §3.2 阶段 2/3。恢复语义为"重新核对"而非"盲信"：`verifyResume` 的 refuse/restart/resume 判定、
plan digest 门禁与 executor 兼容门禁都在移植体内，并有 donor 测试覆盖。

---

## 4. Utopia verified episode

- Implementation CI used by `mission:finalize`: **`36588931173`** on
  `5ef0b2c7bbf7f24b5eb4a32d2cc5c7faa59c2af6` — `gateway-web` success、`android` success。
- Episode path: `data-records/evolution/episodes/mission-book/MB-004/episode.json`
- Episode ID: **`MB-004:d5d6498644ddb928`**
- Inbox SHA-256 digest: `0ace61003f823fff70f5f13bee446b20767b0caba2f1d0d8a609be06cbeead65`
- Closeout commit: `4ae80785696eac1ca077a45a4a5507d3802b3995`（纯数据：episode + 移除
  `data-records/evolution/inbox/mission-book/MB-004/events.jsonl`）
- Episode 内容：`status=VERIFIED`、18 个事件、3 个 `VERIFIER_FINDING`、2 个 repair、
  2 个 `ATTEMPT_STARTED`、3 个 `TEST_PASS`、2 个 `RUNTIME_PASS`、0 个 owner intervention。

## 4.1 事件流 / Event stream (18)

| 角色 | 主机 | 类型 | 结果 |
| --- | --- | --- | --- |
| MIGRATION | Mech | CHANGE_APPLIED / ATTEMPT_STARTED | INFO |
| MIGRATION | Mech | REPAIR_APPLIED | REPAIRED |
| MIGRATION | Mech | TEST_PASS | PASS |
| MIGRATION | Mech | CI_RESULT | PASS |
| MIGRATION | Mech | MIGRATION_COMPLETE | PASS |
| VERIFICATION | Alien | MISSION_CLAIMED / ATTEMPT_STARTED | INFO |
| VERIFICATION | Alien | VERIFIER_FINDING（F1–F4） | INFO |
| VERIFICATION | Alien | VERIFIER_FINDING（F5–F9） | INFO |
| VERIFICATION | Alien | REPAIR_APPLIED（R1） | REPAIRED |
| VERIFICATION | Alien | TEST_PASS（R1 复核） | PASS |
| VERIFICATION | Alien | RUNTIME_PASS（真实 job） | PASS |
| VERIFICATION | Alien | RUNTIME_PASS（中断/恢复） | PASS |
| VERIFICATION | Alien | VERIFIER_FINDING（MB-003 网关条款） | INFO |
| VERIFICATION | Alien | TEST_PASS（隔离与完成门禁） | PASS |
| VERIFICATION | Alien | CI_RESULT | PASS |
| VERIFICATION | Alien | VERIFICATION_COMPLETE | PASS |

---

## 5. 合并与冲突裁决 / Merge and conflict resolution

`main` 在本次验证期间前进了两次：先有 MB-002 的验证合并（`83ea44e`），随后 MB-006 的验证合并
（`ce33792`）落地。合并产生 **3 个**冲突，全部是共享控制面文件。

| 文件 | 裁决 |
| --- | --- |
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | **自动合并成功**：16 个 module（MB-006 的 4 个 + MB-004 的 1 个 + 既有 11 个），无冲突 |
| `city/tests/manifest.test.mjs` | 保留 `main` 的 `EXPECTED_MODULES` 命名与其 MB-001/002/003/006 行，按**声明顺序**插入 MB-004 行；注释同步更新 |
| `tests/capability-adapters.test.mjs` | 保留 `main` 的按 id 定位 fixture 与 AVAILABLE 不变量；**删去**绝对总数断言 `catalog.length === 6` |
| `tests/capability-registry.test.mjs` | 保留 `main`（MB-001/MB-002 之后）的**更强**版本：精确的 qualified capabilityId 断言 + census 相对计数 + 跨 building 重名必须得到不同 id |

**关于删掉 `catalog.length === 6`：** 这不是为了变绿而放宽，而恰恰是三个 Mission 共同诊断出的脆弱点。
该断言只在"写下它那一刻的 census"下成立；每声明一个新 module 都会新增一条 descriptor，因此它在
MB-002 与 MB-004 上都必然失效（实测 `=== 6` 在合并后实际为 7）。保留下来的断言是它**更强**的替代：
`catalog.length === baseline.length + 1`（"只多出 future 这一条"）、
`AVAILABLE === 5`（五个 adapter 全部不受影响）、以及 AVAILABLE 相对 baseline 相等。迁移报告 §8.2 与
MB-002 报告 §8.2 都建议的正是这个方向。

**合并后实测：** descriptor 6 条、AVAILABLE 5 条。

---

## 6. 最终门禁 / Final gate

| 门禁 | 状态 | 证据 |
| --- | --- | --- |
| 真实 Engineering job，从 inspect/plan 到 result/evidence，禁止仅用单元测试 | **PASS** | §3.2 阶段 1 |
| 至少一次受控中断/恢复验证 checkpoint/continuation | **PASS** | §3.2 阶段 2/3（杀死活进程 → 4 步续跑完成） |
| 隔离/worktree/文件所有权不得被弱化 | **PASS** | §3.2 阶段 4；ownership 规则真实拒绝并保住用户内容 |
| final acceptance 不得被弱化 | **PASS** | F6：`COMPLETED`/`REFUSED` 与 donor 逐行一致 |
| 验证主机 ≠ 迁移主机 | **PASS** | Mech / Alien |
| 先独立审查后读 Migration Report | **PASS** | §1 先记录，§2 后对照（事件流可证） |
| 维修只在同一 Mission 分支 | **PASS** | R1 仅本机 git-ignored 证据；R2 增加 1 个 pilot 脚本，未改任何生产文件 |
| 未跳过/删除测试、未放宽验收 | **PASS** | §3.3；5 条 skip 被消除为真实执行，剩余 1 条为具名环境限制 |
| required CI 全绿 | **PASS** | 分支 `36588931173`、最终 HEAD `36590188621`，两作业 success |
| 由验证主机合并到 `main` | **PASS** | `0eed05b58c126a70224cb4757ba12f76bbe4d4b7` |
| Episode 收口 + 双 CI（规则 16） | **PASS** | §4 与上表两条 CI |

### 6.1 ⚠ 未执行的门禁条款 / Gate clause NOT exercised

> 门槛原文：*"通过 MB-003 Worker Gateway 跑一次真实 Engineering job，从 inspect/plan 到
> result/evidence，禁止仅用单元测试替代。"*

- **做到的**：真实 Engineering job 本身已完整跑通（§3.2 阶段 1），并非单元测试替代。
- **没做到的**：这次 job **没有**经由 MB-003 Worker Gateway 路由。
- **为什么**：MB-003 的网关模块（`provider-adapter`、`provider-resilience`、`worker-task-contract`）
  只存在于 `origin/mission/MB-003-worker-gateway`；截至本次施工，MB-003 **未合入 `main`**，其验证由
  `Mech` 持有，规则 5 禁止 `Alien` 触碰。且本移植与网关**零耦合**（F3）：网关提供的是 provider
  runtime 层（`web`/`codex`/`api`/`local`），而 Foreman 通过自己的 `process.mjs` 执行。要把二者接起来，
  必须新写一份两侧 donor 都没有的胶水层，而 `MODE=MIGRATION_ONLY` 明确禁止发明行为。
- **本主机的选择**：用真实运行满足该条款的**实质**（真实 job、真实进程、真实证据），**不伪造**路由，
  并把该条款显式上报 Owner。没有引入未验证的姊妹 Mission 代码，也没有为通过验收而扩大边界。
- **Owner 可选项**：(a) 接受"真实 job + 零耦合"作为该条款的等价满足；
  (b) 待 MB-003 合入 `main` 后，安排一次范围受限的**后续检查**，在两者共存的 `main` 上验证路由；
  (c) 立 superseding Mission。本报告不预设结论。
- **补充（本报告写入时的最新事实）：** MB-003 的 Verification 现已被标记为
  **`BLOCKED_OWNER_DECISION`**（`MISSION_INDEX.md` 第 3 行），即其网关短期内**不会**合入 `main`。
  因此上面的选项 (b) 实际上依赖于 Owner 先裁决 MB-003；这一条款与 MB-003 的阻塞被同一个决定卡住。

### 6.2 ⚠ 跨 Mission 观察 —— 合并后产品面增加一个不可调用条目

合并 MB-004 后，Web/Android 读取的 `city.capabilities` **从 5 条变为 6 条**：

```text
planning.document.intake, planning.knowledge.query, engineering.skill.inspect,
research.evidence.review, presentation.theme.lab,
city.02-engineering/01-project-foreman/project-foreman   ← 新增，BRIDGE_PENDING，永远不可调用
```

两端行为一致且诚实（Web 卡片显示 `bridgeState · cityLifecycle`，Run 按钮禁用；
Android 经 `CapabilityPolicy.canInvokeCapability` 同样禁用），因此这不是"为验收造新 UI"。
但它确实改变了已验收的消费面，且与 MB-001 在 `registry.mjs` 里写下的理由相冲突：

> *"…a kernel module would appear on the Web and Android capability lists as an 'unavailable'
> capability awaiting a bridge — which would advertise something that by design has no product
> operation."*

MB-002 没有这个问题，因为它的模块落在 `infrastructure` district `00-foundation` 而被 MB-001 的
`DISTRICT_KINDS` 过滤器排除。MB-004 的模块落在 `domain` district `02-engineering`，**不**被该过滤器
覆盖，于是必然作为一条不可调用 descriptor 出现在产品面上。

**本主机没有自行"修复"它**，因为那需要修改 `registry.mjs` 的目标语义或给 manifest 增加新字段，
两者都超出 MB-004 的边界（规则 10/11）。**建议 Owner 决定**是否建立一个统一的机制
（例如模块级 `capabilityProvider: false`，或把 building 标记为非 capability 来源），
使"非产品能力模块"不再出现在 capability 列表上；该决定应作用于 City 级注册表，而不是逐 Mission 打补丁。

---

## 7. 遗留观察 / Carry-forward observations

1. **差分 parity 测试依赖机器本地 donor（D1）。** 交付状态下它们静默 skip。建议要么让测试能自行获取
   冻结 donor，要么把"donor 缺席"记为失败而不是 skip，否则"parity"证据在别的机器上等于不存在。
2. **优雅取消不可恢复，只有被遗弃的运行可恢复（§3.2 阶段 2/3）。** 终态 episode 不能被 checkpoint
   复活，这是 donor 语义；宿主若想"取消后稍后续跑"，必须改用被遗弃运行 + `stealStaleLock` 的路径。
3. **`main` 上的 capability census 脆弱性（D2）。** 三份独立修复现已随 MB-002 与 MB-004 的合并进入
   `main`；后续 Mission 只要新增 domain-district 模块，仍会改变 descriptor 总数（§6.2）。这是同一个
   根因的两个表现，值得一次性治理。
4. **`catalog.length === 6` 这类绝对断言应停止使用。** 三个 Mission 各自踩过一次；本次合并已把
   `main` 上的该断言替换为其相对形式。
5. **未跑 Android 模拟器。** 本 Mission 未触碰 Android 源码，CI 的 android 作业 success，但端上点击级
   证据不存在。

---

## 8. 证据指针 / Evidence pointers

- 迁移报告：`mission-book/reports/MB-004/MIGRATION_REPORT.md`
- 实现分支：`zhiheng-zhang-Mera/utopia` `mission/MB-004-project-foreman`
- 实现 CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36588931173>
- 最终 branch HEAD CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36590188621>
- 运行时 pilot（分支内）：`scripts/mb004-foreman-pilot.mjs`
- 运行时证据（git-ignored）：`.runtime/evidence/mission-book/MB-004/run-001/foreman-runtime-pilot.json`
- 现场工作记录（git-ignored）：`.runtime/evidence/mission-book/MB-004/run-001/WORKING_STATE.md`
- Episode：`data-records/evolution/episodes/mission-book/MB-004/episode.json`（`MB-004:d5d6498644ddb928`）
- 合并提交：`0eed05b58c126a70224cb4757ba12f76bbe4d4b7`

语言配对 / Language pair: [原文 / Source](./VERIFICATION_REPORT.md) · [译本 / Translation](./en/VERIFICATION_REPORT.md)
