# Verification Report — MB-002

```text
MISSION = MB-002
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-002-capability-fabric
MIGRATION_HEAD = db3ac518de1d6125e00cee1d9ff6ff7868b58336
FINAL_BRANCH_SHA = 63acf7af029357ca8ad85939a23dc9ab46e06f85
FINAL_BRANCH_CI = PASS — run 36586312554 (V0.2 checks) on 63acf7af029357ca8ad85939a23dc9ab46e06f85
MERGED_MAIN_SHA = 83ea44e02274f8d5bcbe866d339a5cd703839e9b
VERIFICATION_COMPLETE = true
```

- **Verification claim:** 2026-09-29T14:44:07Z, City claim commit `8c4d214a9287a346e9b4b8060f82e7c5e1c6d695`.
- **Rule 5:** migration host `Mech`, verification host `Alien` — different hosts.
- **Rule 9 order:** the independent review below was written and recorded as events *before* `reports/MB-002/MIGRATION_REPORT.md` was opened. The report is only referenced in the reconciliation section.

---

## 1. 独立审查 / Independent review

> 本节在阅读 Migration Report 之前记录。审查对象只有：冻结 donor、目标代码、diff、测试与运行状态。

### 1.1 审查范围 / Scope

| 项目 | 值 |
| --- | --- |
| 迁移分支 | `mission/MB-002-capability-fabric` @ `db3ac518de1d6125e00cee1d9ff6ff7868b58336` |
| merge-base with `main` | `c7ef3cd1c6be0155332d03afc3607dfdbf49c205` |
| 迁移实现 commit | `00607f8b243e166b112319b1663eebb3d763fcfc` |
| Donor | `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`、`DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b` |
| 新模块 | `city/00-foundation/03-capability-fabric/capability-fabric/`（7 个 `.mjs` + `DONOR.json` + 2 个测试文件） |
| 组合根改动 | `services/capability-bridge/registry.mjs` |

### 1.2 Code / diff findings

- **F1 — 派生化简被重写，但迁移只证明了被覆盖的部分。**
  `registry.mjs` 把 availability 派生从旧的内联表达式迁到新 fabric 的
  `describeOwnership` / `bridgeStateForLifecycles`。迁移测试覆盖的是 manifest
  当前的真实组合，而派生函数是**组合敏感**的（lifecycle 元组长度 1–3）。
  结论：等价性在 diff 上看起来成立，但没有被证明。
- **F2 — descriptor 增加了四个字段。** `moduleState`、`owner`、`priority`、
  `fallback`。逐个核对消费方后确认是**纯增量**：Web `apps/web/services.js`
  与 Android `ServicesPanel.kt` / `CapabilityPolicy.kt` 按 key 读取
  `capabilityId`、`name`、`bridgeState`、`cityLifecycle`、`operations`、
  `inputKind`、`resultDigest`、`errorCode`、`status`，没有任何一方做整对象比较或
  key 计数。
- **F3 — 被改动的旧测试是重新定界，不是放宽。** `tests/capability-registry.test.mjs`、
  `tests/capability-adapters.test.mjs`、`city/tests/manifest.test.mjs` 三处把
  写死的绝对条数改成相对于 baseline 的增量，断言强度未降低（见 §3.2）。
- **F4 — 调用路径没有被消费。** `services/capability-bridge/bridge.mjs`
  **没有**被本次迁移改动，它仍然持有自己的一套 invocation 实现
  （`workers.size>=2 → BUSY 429`、`>3*1024*1024 → RESULT_TOO_LARGE`、
  重启时的 `INTERRUPTED` / `GATEWAY_RESTARTED`、`degraded` Set）。
  fabric 提供的是同一套 invocation 契约的**第二份实现**，两者之间没有任何
  cross-check。这是 `main` 上真实的漂移风险，但**不是**本 Mission 边界内的缺陷：
  Mission 只要求迁移 donor 已存在行为并保留现有 qualified identity / availability /
  bounded invocation / typed error 行为，未要求把 bridge 的调用路径改成消费 fabric。
- **F5 — `composedProviders(manifest, adapters)` 忽略 `manifest` 参数**，
  并且永远返回 `version:null`。与 donor 行为一致，属于既有状态，记录备查。

### 1.3 Donor parity findings

- Boss 侧：provider/multi-owner registry（按 capability id 解析、按 priority 排序、
  拒绝两个 owner 认领同一 capability、owner 撤销时回收其全部 capability）、
  broker/routing、稳定 outcome/state 模型。
- Hns 侧：capability/plugin dependency、lifecycle、adapter/compatibility、
  fallback/fault、health、config/lockfile verification。
- 两侧都在新模块的 44 个测试里有对应场景，且 `DONOR.json` 记录了
  `mission` 块与 `incubationRooms`。

### 1.4 Runtime / use findings

- 五个 bridged services 的历史/当前验收向量在分支上全绿。
- 真实消费面：Web `apps/web/services.js` 渲染 `city.capabilities` 卡片，
  显示 `bridgeState · cityLifecycle`，并且**只有** `bridgeState === 'AVAILABLE'`
  时才启用 Run；Android `ServicesPanel.kt` 渲染同一数组为下拉框，显示同样两个字段，
  并经 `CapabilityPolicy.canInvokeCapability(connection, bridgeState, busy)
  = ONLINE && AVAILABLE && !busy` 把关。两侧对 availability 的判定规则一致，
  result/error 来自同一批 invocation 记录（`resultDigest` / `errorCode` /
  `invocationId` / `status`），history 是同一份 `invocations` 列表。
- **初始产品面观察（记为观察，不是阻断）**：分支上 manifest 多了一个模块，
  且该模块位于 `00-foundation`，于是 capability 列表从 5 条变成 6 条，
  多出的一条是**永远不可调用**的 `BRIDGE_PENDING` 条目。Web 与 Android 都会
  显示它，并且两端的 Run 都保持禁用，因此不是"为了验收造新 UI"，但它确实改变了
  Web/Android 上可见的服务清单。

### 1.5 Initial verdict

**PASS-with-observations.** 迁移边界正确、donor 映射可追溯、既有行为保留、
测试没有被放宽。但 §1.2 F1 的等价性没有证据，必须先补一个独立的 oracle 测试才能
接受"availability 行为未变"这一论断（§3.1）。§1.4 的产品面增加需要与 `main` 上
已验收的规则对齐（§5）。

---

## 2. 对照 Migration Report / Reconciliation

> 本节记录**读完** `MIGRATION_REPORT.md` 之后与独立发现之间的差异。

### 2.1 确认一致 / Confirmed

- 落地边界：`city/00-foundation/03-capability-fabric/capability-fabric`，
  district `00-foundation`、building `03-capability-fabric`、module `capability-fabric`。
- 44 个 parity 测试覆盖 Boss provider/broker 与 Hns lifecycle/fallback/compat 两侧。
- 报告自己发现并修复的两个缺陷（`compareLock` 迭代 Map 的 key 而不是 value；
  `RUNNING` 行重复）与我的 diff 复核一致。
- 报告的 §4 只声称改动了**组合根 registry**，从未声称改动了调用路径 —— 与 F4 一致。
- `capabilityProvider:false` 在本 Mission 中**没有**被使用，报告也没有声称使用过。

### 2.2 差异 / Differences

| 编号 | 差异 | 判定 |
| --- | --- | --- |
| D1 | 报告没有证明它重写的那条派生规则。 | 由本主机补测（§3.1），**差异已消除**。 |
| D2 | 报告 §8.5 adaptation 2 写"manifest 未命名的 module ref 派生 `cityLifecycle: 'NOT_IN_MANIFEST'` 与 `bridgeState: 'BRIDGE_PENDING'`"。 | **描述有误，行为正确。** `'NOT_IN_MANIFEST'` 是 fabric 默认 `lifecycleFor` 返回 `undefined` 时的分支；**实际** `registry.mjs` 传入的是 `moduleRef => index.get(moduleKey(moduleRef))?.lifecycle ?? 'UNAVAILABLE'`，所以未命名引用派生 `'UNAVAILABLE'` → `DEGRADED`，与迁移前规则一致，且 `tests/capability-registry.test.mjs` 仍断言 `DEGRADED`。`ABSENT_LIFECYCLE` 从活跃 registry **不可达**。 |
| D3 | 报告没有标注 descriptor **列表**从 5 条变成 6 条。 | 见 §1.4 与 §5：作为观察记录，并在合并时按 `main` 已验收规则消除。 |

### 2.3 边界一致性 / Boundary

报告的"明确未迁"清单与本主机的 diff 复核一致：provider planning/worker pool、
Customs admission 与 runtime enforcement、Skill Intake 的第二份拷贝都没有出现。
`perception.ts` 未被搬运，与 MB-008 survey 的重复风险提示相反 —— 已在 MB-008 报告中
记录为边界判定。

---

## 3. 二次维修与验证 / Secondary repair & verification

### 3.1 维修 R1 —— 补一条独立 oracle parity 测试

新增 `city/00-foundation/03-capability-fabric/capability-fabric/tests/v03-derivation-parity.test.mjs`
（3 个用例）。做法：

1. 把 merge-base `c7ef3cd1` 上 `services/capability-bridge/registry.mjs` 的**旧派生表达式**
   原样转录为测试内的 oracle，而不是调用新代码。
2. 穷举 lifecycle 元组：长度 1–3 × 6 种 lifecycle × 有/无 adapter 两种状态，
   共 **516** 个组合。
3. 断言新 `bridgeState` 与 `cityLifecycle` 与 oracle **逐组合相等**。
4. 第三个用例显式记录**唯一**一处分歧：`moduleRefs` 为空时旧规则给 `'MIXED'`、
   新规则给 `'UNAVAILABLE'`。该输入从活跃 registry 不可达（adapter 与 module 描述
   都至少带一个 ref），因此不影响已验收行为，但必须被写下来而不是被隐藏。

这条测试用的是**等价性**断言而不是某个具体值的断言：值断言会放过一份漂移的拷贝。

### 3.2 被改动测试的复核 / Modified-test review

| 文件 | 迁移改动 | 判定 |
| --- | --- | --- |
| `tests/capability-registry.test.mjs` | 绝对条数 → baseline 相对 | 未放宽：`baseline+1` 与"两个 building 的重复模块名必须得到不同 qualified id"两条断言都保留。 |
| `tests/capability-adapters.test.mjs` | `catalog.length===6` → `baseline.length+1` | 未放宽：AVAILABLE 条数仍要求与 baseline 相等。 |
| `city/tests/manifest.test.mjs` | census 列表新增一条 | 未放宽：`EXPECTED_MODULES` 仍是硬编码普查，且要求每个条目在树上有真实代码。 |

没有任何测试被跳过、删除或改成 `todo`。

### 3.3 验收矩阵 / Acceptance matrix

**分支 `d0052d029f769ecbe1b7e8279fafb7aa93510ef2`（含 R1）：**

| 检查 | 结果 |
| --- | --- |
| `pnpm test` | **58 / 58** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| `node city/test-all.mjs` | **176 / 176**（capability-fabric 目录 **47 / 47**，含 R1 的 3 条） |
| `node scripts/verify-promotion-history.mjs` | 10 条记录 OK |
| `pnpm check:docs` | docs / evidence / data-records 三对 **SYNCHRONIZED** |

**合并后 `main` `83ea44e02274f8d5bcbe866d339a5cd703839e9b`：**

| 检查 | 结果 |
| --- | --- |
| `pnpm test` | **61 / 61**（MB-001 带来 3 条新用例） |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |
| `node city/test-all.mjs` | **276 / 276**，共 29 个测试文件 |
| `node scripts/verify-promotion-history.mjs` | 10 条记录 OK |
| `pnpm check:docs` | 三对 **SYNCHRONIZED** |

### 3.4 真实消费 / Real use

- Web：`apps/web/services.js`（卡片显示 `bridgeState · cityLifecycle`，Run 由
  `bridgeState==='AVAILABLE'` 把关）。
- Android：`ServicesPanel.kt`（下拉框 + 同一对字段）、`CapabilityPolicy.kt`
  （`ONLINE && AVAILABLE && !busy`）、`CapabilityPolicyTest.kt`、
  `CapabilityRequestExceptionTest.kt`（`INPUT_TOO_LARGE/413`、`OPERATION_BLOCKED/400`、
  `BRIDGE_PENDING/409`、`CAPABILITY_NOT_FOUND/404`、`INVALID_INPUT/400`、`OFFLINE`、
  `INVOCATION_UNAVAILABLE`、`INTERRUPTED/COMPLETED` 的接受规则）。
- 诚实说明：跨端一致性由**源码审查 + 客户端单测（CI 中真实执行 `:app:testDebugUnitTest`）**
  建立，本主机**没有**运行 Android 模拟器做端上点击验证。

### 3.5 故障 / 恢复

`bridge.mjs` 的 `interrupt()`、`GATEWAY_RESTARTED` 与 `degraded` 行为未被本次迁移触碰，
其既有测试保持通过；fabric 侧的新增覆盖集中在注册/撤销/优先级/owner 回收。

---

## 4. Utopia verified episode

- Implementation CI used by `mission:finalize`: **`36585852227`** (V0.2 checks) on
  `d0052d029f769ecbe1b7e8279fafb7aa93510ef2` — `gateway-web` success、`android` success。
- Episode path: `data-records/evolution/episodes/mission-book/MB-002/episode.json`
- Episode ID: **`MB-002:f859fd8391837e33`**
- Inbox SHA-256 digest: `0779d9c364af3f99e8a84ed98ce8525545d488366dbc33b06df41dbafc71127a`
- Closeout commit: `63acf7af029357ca8ad85939a23dc9ab46e06f85`（纯数据：episode + 移除
  `data-records/evolution/inbox/mission-book/MB-002/events.jsonl`）
- Episode 内容：`status=VERIFIED`、19 个事件、2 个 `VERIFIER_FINDING`、
  2 个 repair、1 个 owner intervention。

## 4.1 事件流 / Event stream (19)

| 角色 | 主机 | 类型 | 结果 |
| --- | --- | --- | --- |
| MIGRATION | Mech | MISSION_CLAIMED / ATTEMPT_STARTED / OWNER_INTERVENTION / CHANGE_APPLIED | INFO |
| MIGRATION | Mech | TEST_PASS | PASS |
| MIGRATION | Mech | CI_RESULT | PASS |
| MIGRATION | Mech | RUNTIME_PASS | PASS |
| MIGRATION | Mech | RECOVERY | PASS |
| MIGRATION | Mech | CI_RESULT | PASS |
| MIGRATION | Mech | MIGRATION_COMPLETE | PASS |
| VERIFICATION | Alien | MISSION_CLAIMED / ATTEMPT_STARTED | INFO |
| VERIFICATION | Alien | VERIFIER_FINDING（F1–F5） | INFO |
| VERIFICATION | Alien | REPAIR_APPLIED（R1） | REPAIRED |
| VERIFICATION | Alien | VERIFIER_FINDING（对照 Migration Report） | INFO |
| VERIFICATION | Alien | TEST_PASS | PASS |
| VERIFICATION | Alien | RUNTIME_PASS | PASS |
| VERIFICATION | Alien | CI_RESULT | PASS |
| VERIFICATION | Alien | VERIFICATION_COMPLETE | PASS |

---

## 5. 合并与冲突裁决 / Merge and conflict resolution

`main` 在验证期间前进了 8 个提交（MB-001 已由 Mech 验证并合入）。合并
`mission/MB-002-capability-fabric` → `main` 产生 **7 个**冲突，全部是共享控制面文件，
属于结构性冲突。裁决原则：**保留两侧真正成立的不变量，不为了绿而放宽任何一侧。**

| 文件 | 裁决 |
| --- | --- |
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | 并集：保留 MB-001 的 district 级 `"kind": "infrastructure"`，并把 `03-capability-fabric` building 追加进 `00-foundation`。合并后 11 个 module，两侧一条不缺。 |
| `services/capability-bridge/registry.mjs` | 并集：保留 **MB-001 的 infrastructure district 过滤器** 与 `DISTRICT_KINDS`，同时保留 MB-002 的 fabric-backed 注册与 `ADAPTERS` 兼容别名，默认参数用 `ADAPTER_PROVIDERS`。 |
| `tests/capability-adapters.test.mjs` | 并集：同时保留 MB-001 的绝对条数断言与 MB-002 的 baseline 相对断言（两者同时成立，严格更强）。 |
| `tests/capability-registry.test.mjs` | 并集：保留 MB-001 的 qualified-identity 精确断言 + MB-002 的 census 无关形式 + 跨 building 重名必须得到不同 id 的断言。 |
| `city/tests/manifest.test.mjs` | 保留 MB-001 的 `EXPECTED_MODULES` 命名与"按 id 定位 fixture"的写法，census 追加新模块；"同一 room 被两个 module 认领"的用例合并为**按 id 定位 + 从声明读取 room**，同时满足两侧注释。 |
| `city/docs/{en,zh-CN}/ARCHITECTURE.md` | 目录树并集：`01-city-core/` 改为分支节点，新增 `03-capability-fabric/` 作为 `00-foundation` 的最后一个子节点。双语结构保持配对。 |

**关键结果：** 合并后 capability descriptor **恰好 5 条、全部 `AVAILABLE`**，
`capability-fabric` **不再**作为不可调用条目出现在 Web/Android 清单上 —— 因为
`00-foundation` 是 `infrastructure` district，被 MB-001 已验收的过滤器排除。
§1.4 / D3 的产品面变化在合并结果中**不再存在**，已验收的 V0.3 消费面被精确保留。

**边界声明：** 上述裁决没有扩大 Mission 功能边界，也没有放宽任何验收；恰好相反，
它把 MB-002 分支上一处会改变产品面的副作用收回到了 `main` 已验收的规则之内。

---

## 6. 最终门禁 / Final gate

| 门禁 | 状态 | 证据 |
| --- | --- | --- |
| 五个 bridged services 历史/当前向量全部通过 | PASS | `pnpm test` 61/61（合并后）、58/58（分支） |
| ≥1 Boss provider/broker parity | PASS | 新模块 44 个测试中的 registry/routing/outcome 场景 |
| ≥1 Hns lifecycle/fallback/compat parity | PASS | 新模块 44 个测试中的 lifecycle/adapter-compat 场景 |
| 全 lifecycle 组合派生等价 | PASS | R1 oracle 测试，516 个组合，1 处不可达分歧已记录 |
| Web 与 Android 一致 | PASS | §3.4（源码审查 + 客户端单测，未跑模拟器） |
| 验证主机 ≠ 迁移主机 | PASS | Mech / Alien |
| 先独立审查后读 Migration Report | PASS | §1 先记录，§2 后对照（事件流可证） |
| 维修只在同一 Mission 分支 | PASS | 仅 `d0052d0` 增加一个测试文件 |
| 未跳过/删除测试、未放宽验收 | PASS | §3.2 |
| required CI 全绿 | PASS | 分支 `36585852227`、最终 HEAD `36586312554`、Android 作业 success |
| 由验证主机合并到 `main` | PASS | `83ea44e02274f8d5bcbe866d339a5cd703839e9b` |
| Episode 收口 + 双 CI（规则 16） | PASS | 见 §4 与上表两条 CI |

**结论：PASS。**

---

## 7. 遗留观察（非本 Mission 阻断项）/ Carry-forward observations

1. **同一 invocation 契约的两份实现（F4）。** `bridge.mjs` 与 fabric 各自实现了
   并发上限、结果大小上限与中断语义，且没有 cross-check。本次迁移按边界只搬运了
   库，没有改调用路径。建议 Owner 决定是否建立一条 binding 测试把两者钉在一起，
   否则 `main` 上这两份实现可以各自漂移。
2. **`ABSENT_LIFECYCLE` 从活跃 registry 不可达（D2）。** 行为正确（未命名引用仍派生
   `DEGRADED`），但 fabric 的这条分支没有任何生产调用者；若后续有调用者传入
   不带 `?? 'UNAVAILABLE'` 的 `lifecycleFor`，行为会与迁移前不同。
3. **`composedProviders(manifest, adapters)` 忽略 `manifest` 且 `version` 恒为 `null`（F5）。**
   与 donor 一致，属既有状态，记录备查。
4. **跨端一致性的验证深度。** 本 Mission 的一致性由源码审查 + 客户端单测建立，
   未经 Android 模拟器端上验证；若后续 Mission 需要端上证据，应单独安排。
5. **迁移报告 D2 的描述性错误**已在本报告更正；报告作者若复用该措辞，需按实际
   `lifecycleFor` 回退值改写。

---

## 8. 证据指针 / Evidence pointers

- 迁移报告：`mission-book/reports/MB-002/MIGRATION_REPORT.md`
- 实现分支：`zhiheng-zhang-Mera/utopia` `mission/MB-002-capability-fabric`
- 分支 CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36585852227>
- 最终 HEAD CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36586312554>
- Episode：`data-records/evolution/episodes/mission-book/MB-002/episode.json`（`MB-002:f859fd8391837e33`）
- 合并提交：`83ea44e02274f8d5bcbe866d339a5cd703839e9b`
- 现场工作记录：`D:\A-Utopia\.runtime\evidence\mission-book\MB-002\run-001\WORKING_STATE.md`
