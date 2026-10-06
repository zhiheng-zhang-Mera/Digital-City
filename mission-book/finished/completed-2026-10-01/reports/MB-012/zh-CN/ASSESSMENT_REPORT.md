# MB-012 评估报告（中文阅读译本）

> Reading translation / 阅读译本：完整历史阅读译本，不是第二份权威任务记录；不更新状态。元数据和代码证据原样保留。

```text
MISSION = MB-012
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST = Mech
CLAIM_COMMIT = 2cc352197bf98dbfefcfd9058ee9d6769a516bc9   (Digital-City main)
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080
UTOPIA_MAIN_BASELINE = zhiheng-zhang-Mera/utopia@756c7d760c605e33ba386e87605e078fe24b82ca
ASSESSMENT_BRANCH = mission/MB-012-runtime-compliance
ASSESSMENT_HEAD = d071328d8f68ba1ddd5e8a1fde11718e75fd6672
ASSESSMENT_RESULT = NO_VALUE
```

```text
PLANNED_CAPABILITIES = RC-01, RC-02, RC-03, RC-04, RC-05   (count 5)
SELECTED_GAP_CLOSURES = none
ABANDONED_CAPABILITIES_AND_REASONS =
  RC-01 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR
  RC-02 UTOPIA_SUPERIOR + OBSOLETE_DONOR
  RC-03 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR
  RC-04 OBSOLETE_DONOR + DUPLICATE_EQUIVALENT + NO_REAL_CONSUMER
  RC-05 UTOPIA_SUPERIOR
ASSESSMENT_RESULT = NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

元数据记录 Mech 迁移侧评估、领取与 donor/Utopia 冻结基线、分支及 HEAD，结果 NO_VALUE。计划 RC-01–05 共五项，gap closure 无。RC-01/03 等价重复且 donor 过时；RC-02 Utopia 更优且 donor 过时；RC-04 donor 过时、等价重复、无真实消费者；RC-05 Utopia 更优。判定无价值、任务保留、未迁移。

## 0. 领取依据

```text
P0 (verification / integration): NONE eligible.
   MB-001..MB-011 all closed; every mission branch AheadOfMain = 0 at utopia@756c7d7.
P1A (assessment-first): MB-012 is the last enabled assessment-first Mission (seq 12)
   with assessment_complete = false and an unclaimed stage.
```

领取时 P0 无可选验证/集成：MB-001–011 全关闭，utopia@756c7d7 上每条 mission branch AheadOfMain = 0。P1A 中 MB-012 是最后一个已启用 assessment-first 任务（seq 12），`assessment_complete = false` 且无人领取。

**本任务没有被简单以“已覆盖”驳回。** MB-002 的 `capability-fabric/DONOR.json` 明确将工作 deferred 给它：

```text
"Codex-Boss electron/capability/capability-broker.ts, authorization.ts and
 permission-contract.ts are NOT migrated: they are the admission/authorization seam
 owned by MB-011/MB-012."
DEFERRED: "permission and authorization resolution (MB-012 Runtime Compliance)"
```

该 deferral 说 Codex-Boss 的 capability-broker、authorization、permission-contract 没有迁移；admission/authorization seam 属 MB-011/012；permission/authorization resolution 属 MB-012 Runtime Compliance。因此 MB-012 是该 resolution 的指定 owner，按其自身价值执行评估。下文证据显示该 deferral **并非**迁移机会。

任务禁止的两个边界始终具有约束力：**Owner/Root authority source** 与**宪制 protected-surface 定义**。所以 `DEFAULT_ROOT_POLICY.rootOwner`、`ROOT_PROTECTED_MANIFEST`、`OWNER_AUTHORITY_PATHS` 仅供语境阅读，从不提出迁移；qualification/promotion control（`promotion-state.ts`、`promotion-controller.ts`）同样不在范围，仅记录语境。

## 1. 计划 donor 能力

| ID | 计划能力 | Donor 锚点 |
|---|---|---|
| RC-01 | privilege/跨域/受保护资源访问 enforcement | `electron/root-authority/protected-surface-guard.ts`、`electron/root-authority/root-authority.ts`（`enforce` → `RootDeniedError`）、`src/shared/permission.ts`（`desktopMutationGate`、`manifestAllows`）、`src/shared/guardian.ts`（`changeAllowed`）、`electron/root-authority/execution-profile.ts` |
| RC-02 | service/capability 注册 enforcement hook | `electron/capability/capability-broker.ts`、`electron/capability/authorization.ts`、`electron/capability/permission-contract.ts`、`electron/capability/integration/execution-authorization.ts`、`electron/capability/integration/boundary-inventory.ts` |
| RC-03 | authority escalation 拒绝 | `src/shared/root-authority/authority-planes.ts`（`effectiveChangeClass`、`decideAuthorityAction`）、`electron/root-authority/root-authority.ts` 具名 `refuse*` guard、`src/shared/guardian.ts` |
| RC-04 | runtime-policy 决定应用 | `.codex-boss/config/runtime-policy.json` + `.schema.json`、`electron/commander/runtime-policy.ts`、`src/shared/policy.ts`、`src/shared/network-policy.ts` |
| RC-05 | 可审计 runtime verdict/enforcement 证据 | `electron/root-authority/root-audit-ledger.ts`、`src/shared/root-authority/promotion-state.ts`、`scripts/permission-surface-report.cjs`、`electron/capability/integration/boundary-inventory.ts` |

计划能力数量 **5**。调查的 24 条 donor 路径均存在于冻结提交。

## 2. Donor 源码映射与生命周期（决定性发现）

只读调查 24 个 enforcement 模块建立三个事实。

### 2.1 交付 app 中实际 live 的拒绝路径仅五条

```text
1. desktop mutation gate            electron/commander/main-commander.ts:701
                                    (desktopMutationGate / manifestAllows, fail-closed)
2. software action manifest gate    electron/software/software-runtime.ts:88
3. Guardian-token gate              workbook-dispatch.ts:233, secret-vault-store.ts:37,
                                    self-mod-sandbox.ts:118/159
4. host-operation privilege         electron/self-evolution/host-operations.ts:149
                                    (RootAuthority DENY -> throw)
5. promotion gate Root-Surface stop electron/promotion-gate/promotion-controller.ts:202
                                    (OUT OF SCOPE: qualification/promotion control)
```

依次为 main-commander.ts:701 的 desktop mutation fail-closed gate；software-runtime.ts:88 的软件 action manifest gate；workbook-dispatch.ts:233、secret-vault-store.ts:37、self-mod-sandbox.ts:118/159 的 Guardian token gate；host-operations.ts:149 的 host-operation privilege（RootAuthority DENY → throw）；promotion-controller.ts:202 的 Root-Surface stop（qualification/promotion control **不在范围**）。Donor live enforcement 因此**很窄**；移除越界 promotion 后更窄。

### 2.2 本任务所指层从不运行

整个 `electron/capability/*` 家族**零个非测试生产调用者**：

```text
createCapabilityBroker     callers: scripts/permission-surface-report.cjs + tests
invokeThroughBroker        callers: execution-authorization.ts + report script + tests
evaluate (authorization)   callers: capability-broker.ts + report script + tests
gateAuthorizer             callers: NONE outside tests
authorizeExecution         callers: NONE outside tests
```

broker 仅报告脚本和测试调用；invokeThroughBroker 仅 execution-authorization、报告脚本、测试调用；authorization evaluate 仅 broker、报告脚本、测试调用；gateAuthorizer/authorizeExecution 无测试外调用。

决定性的装配事实：`electron/main.ts:1003` 用**无 options**的 `new ExecutionGate()`，因此 `ExecutionGateOptions.authorizer` 为 `undefined`，`execution-gate.ts` 的 `if (this.authorizer)` 永不执行。`boundary-inventory.ts` 自述多数边界为 `legacy`，仅 execution-gate 与 integration/execution-authorization 为 `mapped`；但后两者在实际交付 app 中也仅是设想，因为 gate 从未带 authorizer 构造。

### 2.3 runtime-policy 文件完全没有消费者

```text
.codex-boss/config/runtime-policy.json       parsed by: NOTHING
.codex-boss/config/runtime-policy.schema.json  validated by: NOTHING (no ajv/schema validator in the repo)
electron/commander/runtime-policy.ts         exports NOTHING; loadRuntimePolicy is
                                             module-private with zero callers
live bound is a DIFFERENT object             electron/commander/scheduler.ts:38 SchedulerPolicy.maxParallel
```

JSON 无解析者，schema 无验证者（全库没有 ajv/schema validator），runtime-policy.ts 不导出任何东西，私有 `loadRuntimePolicy` 零调用。实际 live bound 是 scheduler.ts:38 的另一对象 `SchedulerPolicy.maxParallel`。

仅有其他引用是 `electron/repro-snapshot.ts` 将该文件 SHA-256 放入 reproduction snapshot——是 hash，不是 parse——以及报告脚本将其列为 referenced。

### 2.4 Escalation 拒绝只在 CI 脚本；audit ledger 从未被读取

- `authority-planes.ts` 恰有**一个**调用者：`scripts/runtime-intelligence-diff-guard.cjs:64`。具名 `refuseSelfElevation`、`refuseOwnerIdentityChange`、`refuseDirectMainPush`、`refuseOwnerCredentialAccess`、`refuseRepositoryAdministration`、`refuseStaleShaPromotion`、`refuseArbitraryShell`、`refuseWorkspaceEscape` 及 `acceptOwnerClaim` **零生产调用者**。
- `root-audit-ledger.ts` 在 live 路径写入，但仅 `RootAuthority.history()` 读取，而它的调用者是测试。唯一到达 live surface 的 donor verdict 是 *owner-intervention* ledger（`host-status-ipc.ts:259`）。
- 完整性机制是**无密钥** SHA-256 hash chain：仅能显露朴素编辑，不是 MAC 或签名。
- **不存在密码学验证**：`electron/` 和 `src/` 中 `createVerify`、`verifySignature`、`publicKey`、`x509`、`createHmac` **0 hits**；唯一 signing 是向外的 GitHub App JWT。
- 本来 live 的文件内仍有 dead code：`assessWorkspaceChanges`（protected-surface-guard.ts:208，甚至未导出）、`autonomousCeiling`、`protectedPathFor`（root-authority.ts:341/346）、`EvolutionExecutionProfile` 三个 `assert*` 方法、`guardedGrant`、`writeRootPolicy`。

### 2.5 两个 verdict 精度缺陷（与 RC-05 相关）

`authorization.ts` 对无法解析的 **subject** 报 `reason: "unresolvable-resource"`；`execution-authorization.ts` 对未映射 execution **kind** 复用同一 reason。迁移 RC-05 的 evidence quality 必须保留这种不精确或修复它；修复不是迁移。

## 3. 领取时 Utopia 能力清单（基线 `756c7d7`）

候选目标 `city/01-governance/02-runtime-compliance` 不存在，也没有 `01-governance` 区。按 City R2，此事实本身不证明缺失；以下列出语义清单。

| 关注点 | Utopia 实现 | 类别 |
|---|---|---|
| protected-resource/containment enforcement | `city/00-foundation/01-city-core/root-authority/guard.mjs`：escape ⇒ `DENY`，protected hit ⇒ `REQUIRE_OWNER`，否则 `ALLOW`；rename **同时**分类 source/destination，delete 按 write 分类，大小写不敏感，注入 containment seam，有界 coded reason；MB-001 从 `electron/root-authority/protected-surface-guard.ts` 移植 | 迁移模块 + 测试 |
| 跨域/scope enforcement | `city/00-foundation/01-city-core/audit-ledger/guardian-gate.mjs` 的 `SCOPE_VALIDATION`：写出 granted scope 为 `FAIL`；`DESTRUCTIVE_CHANGE_CHECK`：未批准 removal 为 `FAIL` | 迁移模块 + 测试 |
| computer 副作用许可 gate | `city/10-automation/01-computer-use-runtime/backend-surface/permission.mjs` + `computer-recovery.mjs`：`COMPUTER_MUTATION_ACTIONS`、task-scoped `computer:<action>` grant，**MB-008 从同一 donor `src/shared/permission.ts` 迁移** | 迁移模块 MB-008 |
| authority/escalation gate | `guardian-gate.mjs`：每项 required check 均须**具名 verdict**才能 `ACCEPTED`；`NOT_RUN` 是 blocker 而非 pass；Owner override compliance 按词法检查。另有 task-lifecycle 的 `awaiting_release_permission`、root-authority/contracts.mjs 三值最严格决定顺序及不可变 floor table | 迁移模块 + 测试 |
| capability 注册 enforcement | `capability-fabric/registry.mjs` 注册时拒绝无名、无 owner、无描述、重复 owner（列两 owner）、priority conflict；`services/capability-bridge/registry.mjs` 解析 moduleRefs、ownership、重复 owner 拒绝、district/building kind gating | live 模块 + service |
| live invoke enforcement | `services/capability-bridge/bridge.mjs#invoke`：`CAPABILITY_NOT_FOUND` 404、`BRIDGE_PENDING` 409、`OPERATION_BLOCKED`、`BUSY` 429、`RESULT_TOO_LARGE`、`resourceLimits` worker isolation、20 s timeout、迁移 circuit breaker | live service |
| runtime-policy 应用 | `services/dev-gateway/server.mjs`：要求 apiVersion/schemaVersion 0，否则 **409**；control/node token 分离，相同拒绝启动；拒绝 `0.0.0.0`/`::`；request size limit；task ownership **403**，transition validity **409**，progress monotonicity **400**，pairing session 单次/过期/attempt-lock **410/429/403**；持久 event stream + WS | live service |
| provider-level enforcement | `capability-fabric/providers.mjs`：installed/enabled/loaded/healthy 四个独立事实，disabled 未 force 则拒绝 load，health ladder，有界 restart budget；`04-restart-recovery-station` fail-closed checkpoint gate、restart lock、checksummed ticket | 迁移模块 |
| computer-use safety gate | MB-008 `city/10-automation/01-computer-use-runtime/routing-safety`：破坏动作、focus/foreground/modal gate，secret redaction，evidence risk grading | 迁移模块 |
| 可审计 verdict | `guardian-gate.mjs`：每 check 带 `verdict`、`inspected[]`、`reasons[]`，结果带 `blocking[]` 和有界 reason count；`audit-ledger/decision-ledger.mjs` + `recovery.mjs`；gateway event stream 被 Web 消费；evolution episode 带 `inboxDigestSha256` | 迁移模块 + live service |
| client-side gate | `apps/android/.../CapabilityPolicy.kt`（`canInvokeCapability`） | live client |

已检索确认：`city/00-foundation/01-city-core/**`、`city/00-foundation/03-capability-fabric/**`、`services/capability-bridge/**`、`services/dev-gateway/**`、`city/02-engineering/01-project-foreman/**`、`city/02-engineering/02-worker-gateway/**`、`city/10-automation/**`、`apps/android/**`、`city/CITY_IMPLEMENTATION_MANIFEST.json`、`contracts/**`，并全库 grep permission、sideEffect/side-effect、protectedSurface、validateManifest、uninstall、rollback、01-governance、runtime-compliance。

值得记录：Utopia 的 `customs`/`runtime-compliance` 表述仅在 MB-002 deferral note/module header 出现；无独立 permission/authorization engine，因为 enforcement 已由 Guardian gate、fabric、gateway 本身承担。

## 4. 能力比较矩阵

| ID | Donor 能力/证据 | Utopia 等价/当前行为 | Coverage / Gap | Decision / Reason code | 证据 |
|---|---|---|---|---|---|
| RC-01 | privilege/跨域/受保护资源 enforcement；protected-surface-guard（escape DENY/hit REQUIRE_OWNER/否则 ALLOW，**3生产调用者**）；root-authority enforce 抛 RootDeniedError；desktopMutationGate/manifestAllows live；changeAllowed 在4站点 live；execution-profile assert* **仅测试** | guard 同组合规则，加 rename 双边/case-insensitive；Guardian scope/destructive check；MB-008 同 permission.ts 副作用 gate；live gateway per-route auth/binding/token separation；live bridge operation allowlist | EQUIVALENT；无实质 gap，额外 donor surface 仅测试，live 部分已有迁移/live 对应 | ABANDON / `DUPLICATE_EQUIVALENT`、`OBSOLETE_DONOR` | `root-authority/guard.mjs`、`guardian-gate.mjs`、`backend-surface/permission.mjs`、`server.mjs`、`bridge.mjs` |
| RC-02 | 注册 enforcement hook；broker 拒绝重复 capability/无描述 provider/重复 grant，authorization 默认拒绝 evaluate，permission-contract validateGrant；**全部零非测试生产调用者**；main.ts:1003 构造无 authorizer gate | fabric 注册拒绝、bridge ownership；**live** invoke：404 notfound、409 pending、OPERATION_BLOCKED、429 BUSY、RESULT_TOO_LARGE、worker resourceLimits；Android CapabilityPolicy | SUPERIOR；无 gap，donor 生产不可达，Utopia live、已测试、已消费 | ABANDON / `UTOPIA_SUPERIOR`、`OBSOLETE_DONOR` | `capability-fabric/registry.mjs`、`capability-bridge/registry.mjs`、`bridge.mjs`、`CapabilityPolicy.kt` |
| RC-03 | authority escalation 拒绝；authority-planes effectiveChangeClass 对 autonomous downgrade 抛错，decideAuthorityAction DENY（3 codes），**1 CI脚本调用者**；具名 refuse*/acceptOwnerClaim **仅测试**；changeAllowed live | Guardian 无每check具名verdict不可ACCEPTED、NOT_RUN阻塞、removal须Owner批准、override检查；task awaiting_release_permission；root contracts floor table | EQUIVALENT；无gap，donor仅CI/测试，Utopia迁移gate属性严格更强 | ABANDON / `DUPLICATE_EQUIVALENT`、`OBSOLETE_DONOR` | `authority-planes.ts`、`guardian-gate.mjs`、`task-lifecycle/contracts.mjs`、`root-authority/contracts.mjs` |
| RC-04 | runtime-policy 应用；JSON **无consumer**，schema **无validator**，runtime-policy.ts **无export**，loadRuntimePolicy零调用；live bound是另一SchedulerPolicy.maxParallel | live gateway：version409、token分离、wildcard-bind拒绝、size、ownership403、transition409、progress400、pairing410/429/403；providers生命周期/health ladder；computer-use safety；bridge circuitbreaker | SUPERIOR；无gap，计划能力不存在为live donor行为，故无可迁移物 | ABANDON / `OBSOLETE_DONOR`、`DUPLICATE_EQUIVALENT`、`NO_REAL_CONSUMER` | `runtime-policy.json`、`runtime-policy.ts`、`scheduler.ts:38`、`server.mjs`、`routing-safety/**` |
| RC-05 | audit-friendly verdict/evidence；ledger在live写但**仅测试读**；**无密钥**SHA256chain；createVerify/verifySignature/publicKey/x509/createHmac零命中；promotion-state verdict越界 | Guardian percheck verdict/inspected/reasons及blocking有界reason；decision-ledger/recovery；Web消费eventstream；verified episodes/inboxDigestSha256 | SUPERIOR；无gap，donor生成无人读取且无密码学完整性的证据，Utopia verdict天生可审计且被消费 | ABANDON / `UTOPIA_SUPERIOR` | `root-audit-ledger.ts`、`guardian-gate.mjs`、`decision-ledger.mjs`、`server.mjs`、`episodes/**` |

## 5. 判定：NO_VALUE

> **判断无价值，任务保留，未迁移**

不复制 donor 的工程理由：

1. **Deferred 层在 donor 从不运行。** broker/authorization/permission-contract/execution-authorization 零非测试生产调用者；composition root 构造无 authorizer gate，hook 无法触发。迁移会导入写得好但不可达代码，声称 working enforcement 会超出证据。
2. **RC-04 不存在 live donor 行为。** runtime-policy JSON 无解析者、唯一 reader 无 export、无schema validator，字面没有可迁移行为。
3. **RC-03 仅 CI 脚本，RC-05 ledger 从未读。** escalation 测试外仅独立 diff-guard 脚本；audit chain 无密钥，electron/src 无任何签名验证。
4. **Live 部分已迁移。** MB-008 从同 permission.ts 迁移 computer 副作用许可，MB-001 从同 donor 提交迁移 protected-surface guard、Guardian gate。
5. **Utopia enforcement live 且被消费。** 有界运行测量 bridge/gateway 在live路径拒绝，City suite（1807 tests）覆盖迁移 enforcement。
6. **第二 engine 会重复事实。** 任务自己的验证gate禁止把Core/Fabric enforcement复制成第二真源；用donor broker建 `01/02 Public Security` engine恰会如此。

**MB-002 deferral 说明**：如 MB-011，`DEFERRED ... owned by MB-012` 是指针，不是已验证发现；测试才能将其转化为迁移或诚实负结果。这里测试判明 deferred 层在自己仓库生产不可达，实际运行 enforcement 已有 Utopia 对应。

## 6. 论文/研究素材（仅测得事实）

```text
planned capability count                : 5
equivalent already present              : 2   (RC-01, RC-03)
Utopia superior                         : 3   (RC-02, RC-04, RC-05)
concrete gaps                           : 0
selected full / partial migration       : 0 / 0
abandoned                               : 5
rejection reason-code distribution      : DUPLICATE_EQUIVALENT 2, UTOPIA_SUPERIOR 3,
                                          OBSOLETE_DONOR 3, NO_REAL_CONSUMER 1
                                          (multi-code rows)
donor modules surveyed                  : 24 paths, all present at the frozen commit
                                          (8 files classified ENFORCEMENT, 10 DEFINITION,
                                          2 AUDIT/REPORTING, plus 2 config JSONs)
donor dead-code measurement              : 5 live refusal paths only;
                                          electron/capability/* = 0 non-test production callers;
                                          ExecutionGate built without an authorizer (main.ts:1003);
                                          runtime-policy JSON parsed by nothing;
                                          authority-planes 1 caller (a CI script);
                                          audit ledger read only by tests;
                                          createVerify/verifySignature/publicKey/x509/createHmac
                                          = 0 hits in electron/ and src/
source/target anchors inspected          : 24 donor enforcement paths + 12 Utopia module/
                                          service/client anchors across city/, services/,
                                          apps/android/, contracts/
parity/runtime checks PASS/FAIL          : bounded enforcement chain 19/19 PASS, 0 FAIL
                                          (including a live gateway on an ephemeral port and a
                                          live capability-bridge invoke)
                                          city/test-all.mjs 1807 pass / 0 fail / 1 skipped (of 1808)
                                          root node --test tests/*.test.mjs 84 pass / 0 fail
                                          promotion history 10/10 records verified
                                          TOTAL: 1904 PASS, 0 FAIL
assessment start (host clock)            : 2026-09-30T15:57:40Z (claim)
assessment end (host clock)              : see git commit time of assessment HEAD
implementation churn / tests / CI        : 0 product/runtime files changed; 0 new tests;
                                           no CI run required (no implementation)
```

统计：计划5，等价2（RC01/03），Utopia更优3（RC02/04/05），gap0，完整/部分迁移0/0，放弃5；多码 reason分布等价2、更优3、过时3、无consumer1。24donor路径冻结均存在，原分类计数8ENFORCEMENT、10DEFINITION、2AUDIT/REPORTING、另2configJSON原样保留。只有5live拒绝；capability零生产调用；gate无authorizer；policy无人解析；authority-planes一个CIcaller；ledger仅测试读；密码学5词零命中。检阅24donor+12Utopia module/service/client锚点。运行enforcement19/19（临时端口livegateway与livebridgeinvoke）、City1807pass/0fail/1skipof1808、root84pass/0fail、promotion10/10，总1904PASS/0FAIL。开始 `2026-09-30T15:57:40Z`；结束见assessmentHEAD时间；0产品/runtime变化、0新测试、无实现无需CI。

### 已记录问题、选择与判断

1. **三个 donor 模块明确 deferred 给此任务，看似预先承诺。** *选择*：同 MB-011，视为假设并测试。*判断*：假设失败，donor 自己 deferred 层没有生产caller。
2. **“Donor 有默认拒绝 authorization 的 broker”属实，看似足以 FULL_MIGRATION。** *选择*：每模块先建 caller graph 再判断覆盖。*判断*：判定反转；main.ts:1003 **无 options**构造gate，“mapped”boundary永不触发。只读模块不读compositionroot，会误给RC02/04 FULL_MIGRATION。
3. **范围排除 Owner/Root authority source 和宪制定义，RC01却命名 protected-resource enforcement。** *选择*：包括**enforcing机制**（guard、decisioncomposition、scopegate），排除**内容**（ROOT_PROTECTED_MANIFEST、OWNER_AUTHORITY_PATHS、rootOwner）。*判断*：符合任务forbiddenlist，记录使边界可审计。
4. **首次有界运行 out-of-range progress 拒绝为403而非400。** *判断*：**我的 probe** 错，不是Utopia；task尚未合法分配给node，ownership先拒绝，progressrule未到达。*行动*：先经迁移capabilitygate领取task再断言progress，并额外断言assignment与invalidtransition拒绝；重跑19/19PASS。*原因*：“因错误理由拒绝”正是enforcement评估不得接受的假阳性。

## 7. Utopia 素材指针

- 本地：`.runtime/evidence/mission-book/MB-012/2026-09-30-mb012-assessment-01/assessment/`（gitignored：probe、receipt、suite log、gateway/bridge state）。
- Inbox：`data-records/evolution/inbox/mission-book/MB-012/events.jsonl`（4events：MISSION_CLAIMED、ATTEMPT_STARTED、2×TEST_PASS）。
- 已发布：`evidence/raw/mission-book/MB-012/assessment/`（README.md、capability-matrix.json、bounded-enforcement.json、environment.json）。
- 不可变分支HEAD：`mission/MB-012-runtime-compliance` @ `d071328d8f68ba1ddd5e8a1fde11718e75fd6672`。

> NO_VALUE 不生成假的 verified episode；保留 assessment branch、本报告、指针。分支作为 research/provenance：**不合并、不删除**（历史规则，后文有Owner特例）。

## 8. 收口

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

**判断无价值、任务保留、未迁移**，README§2与CityR1/R4绿色完成，非失败。Scheduler须跳过已完成MB012，除非Ownerreset/reopen。

MB010/011/012均关闭，assessment-first 队列 `MB-010 → MB-011 → MB-012` **为空**；[MISSION_INDEX.md](../../../MISSION_INDEX.md) 所有enabled任务现均 `verification_complete = true`。

## 9. 跨任务说明（MB010/011/012）

三项assessment-first在同会话均NO_VALUE，同机制产生三结果，为可复用发现：

```text
A prior Mission's "DEFERRED ... belongs to MB-0NN" note is a POINTER, not a finding.
The test that resolves it is the DONOR CALLER GRAPH, not the donor file list:
  MB-010  the donor's live node logic was already migrated; the remainder was
          production-dead (TenxNodeRegistry/TenxNetworkRegistry: no main/bootstrap import)
  MB-011  app/core/plugin-install/* (960 lines) had ZERO app consumers and was the only
          pin/quarantine/rollback implementation
  MB-012  electron/capability/* had ZERO non-test production callers and the composition
          root built ExecutionGate with no authorizer; the runtime-policy JSON was
          parsed by nothing
```

先前任务“DEFERRED属于MB0NN”是指针、不是发现；决定性测试是**donor caller graph**，非文件列表。MB010 live node已迁移，余部生产不可达，Tenx两registry无main/bootstrapimport；MB011 app/core/plugin-install/* 960行零appconsumer，是唯一pin/quarantine/rollback实现；MB012 capability零生产caller，gate无authorizer、runtime-policy无parser。

两个反复出现的次要机制值得带入未来评估：

- **声明但从不产生的拒绝码**（MB011 donor17个，MB012若干）令donor看似执行更多enforcement。
- Utopia **已迁移但未消费模块**（fleetNodeStateFor、createProtectedSurfaceGuard、evaluateGuardian当前仅测试consumer）不是assessmentgap：接线不是迁移，发明consumer是NEW_FEATURE_DEVELOPMENT。此为未来Owner指示integration的长期非阻塞backlog观察，非迁移更多donor的理由。

## 9. 独立重新验证（2026-09-30，主机 `Alien`）

保留原文重复章节编号。Owner要求**不复用既有测试**重验，允许真实Android；以下方法、新证据、SHA，`NO_VALUE` **独立确认**。

### 9.1 Donor 生命周期重新推导（自写probe，冻结 `8df428ea`）

| 问题 | 结果 |
|---|---|
| 家族外import `electron/capability/{capability-broker,authorization,permission-contract,integration/execution-authorization}` | 仅两个CI脚本 `scripts/generate-test-catalogue.cjs`、`scripts/platform-certificate.cjs`，**无appimporter** |
| compositionroot如何构造ExecutionGate | `electron/main.ts:1003`：`new ExecutionGate()`，**无authorizer** |
| runtime-policy引用 | 自己的validator、repro-snapshothash、lifecycle报告清单，无处应用其决定 |

该家族无法触发：app从未import它，livegate构造无authorizer。确认。

### 9.2 Utopia 既有 enforcement，在live路径重新证明

```text
capability surface              : 7 descriptors, 5 AVAILABLE
illegal operation refusal       : invokeAdapter('presentation.theme.lab','validate') -> OPERATION_BLOCKED
oversize input refusal          : 1 MiB + 1 byte document -> INPUT_TOO_LARGE
capability ownership            : second owner of one capability refused by name
lifecycle gate                  : 32 declared modules, 32 implemented, none unimplemented
```

Surface7descriptor、5AVAILABLE；非法 `invokeAdapter('presentation.theme.lab','validate')` → OPERATION_BLOCKED；1MiB+1byte document → INPUT_TOO_LARGE；同capability第二owner按名拒绝；32declared、32implemented、无unimplemented。

**确认NO_VALUE。** Utopia实际enforcement live且正确拒绝；本任务donor层在自己仓库生产不可达，移植会建第二enforcement真源。

### 9.3 分支/SHA 跟踪

```text
utopia main at verification : 756c7d760c605e33ba386e87605e078fe24b82ca
assessment branch           : mission/MB-012-runtime-compliance @ d071328d8f68ba1ddd5e8a1fde11718e75fd6672
ahead / behind main         : 1 / 0
that one commit contains    : data-records/evolution/inbox/mission-book/MB-012/events.jsonl
                              evidence/raw/mission-book/MB-012/assessment/** (README, capability-matrix,
                              environment, bounded-*)
                              NO IMPLEMENTATION CODE
merge (at verification time) : NOT PERFORMED, by rule. README line 223 (echoed by response-9-30 R1)
                              keeps a NO_VALUE assessment branch as provenance and explicitly forbids
                              merging it, and forbids fabricating a verified implementation episode.
merge (Owner ruling R11)    : PERFORMED afterwards as a PROVENANCE merge, by explicit Owner direction:
                              response-9-30.md#R11 overrides README line 223 for these three branches only.
                              git merge --no-ff mission/MB-012-runtime-compliance
                                -> e0d9470e2a5b5479c1614071d8f43af3d1d93248  (parents f22273c, d071328), conflict-free,
                                   5 files added (events.jsonl + 4 assessment evidence files),
                                   branch retained on the remote, no implementation code involved.
merged_main_sha             : null - UNCHANGED. The field means "the SHA where this Mission's
                              implementation landed in main"; nothing was implemented, so it stays null
                              even though the provenance branch is now archived in main.
utopia main afterwards      : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e (the three provenance merges plus Alien's forced
                              NO_VALUE record on top of 756c7d76)
```

验证时main/assessment基线及ahead/behind1/0原样；唯一提交只有inbox与四assessment证据，无实现。按READMEline223（response9-30R1重述）验证时不合并，禁止伪造verifiedimplementationepisode。之后OwnerR11仅对这三分支覆盖规则，明确provenancemerge：`git merge --no-ff mission/MB-012-runtime-compliance` → `e0d9470e2a5b5479c1614071d8f43af3d1d93248`（parents f22273c、d071328），无冲突、新增5文件（inbox+四证据）、远端分支保留、无实现。之后main `d0dea7bcb66cf57edee73c67ddfb9526337dfb4e` 为基于756c7d76的三provenancemerge及Alien强制NO_VALUE记录。

本任务无migrationbranch：没有实现可合并，所以 `merged_main_sha` 仍 `null`。字段意为本任务实现落入main的SHA；R11仅归档本节probe、tampercase、dryrun等assessmentprovenance，从未迁移capability。

### 9.4 证据指针

- `.runtime/evidence/mission-book/MB-010-011-012/donor-lifecycle-probe.json`（三项donor reachability）。
- `.runtime/evidence/mission-book/MB-010-011-012/precise-claims-probe.json`。
- `.runtime/evidence/mission-book/MB-010-011-012/utopia-admission-enforcement.json`。
- `.runtime/evidence/mission-book/MB-010-011-012/real-device-node.json` 与两张截图。

语言配对 / Language pair: [原文 / Source](../ASSESSMENT_REPORT.md)
