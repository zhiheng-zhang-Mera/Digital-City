# MB-002——Capability Fabric Boss/Hns联合纯迁移报告

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威状态或元数据。迁移完成不等于合并，未运行边界完整保留。

> 状态MIGRATION_COMPLETE，仅迁移阶段，未合main。迁移主机Mech，领取2026-09-29T12:02:31Z。
> City领取提交`bc2bbbdbac9ff670f2c9b3cbc93f091a7e46694b`已push Digital-City main；无写冲突，Alien已领取MB001，按序选择MB002。
> 实现分支mission/MB-002-capability-fabric；Utopia main基线`c7ef3cd1c6be0155332d03afc3607dfdbf49c205`。
> 实现`00607f8b243e166b112319b1663eebb3d763fcfc`；最终`db3ac518de1d6125e00cee1d9ff6ff7868b58336`为实现+event关闭。
> 两CI均PASS：36568159888在实现、36568734343在最终头，gateway-web/android均success。

## 1. Donor冻结基线

| Donor | SHA | 本任务职责 |
|---|---|---|
| Codex-Boss | 8df428eaa437a409368401e95194e40266b83080 | provider capability身份、broker/routing、health/discovery、稳定outcome/state模型 |
| DS-Hns | eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | capability/plugin依赖、lifecycle、adapter/compatibility、fallback/fault、health、config/lock验证 |

两冻结树fetch至.runtime/evidence/mission-book/MB-002/donor-boss与donor-hns，git忽略；全部声明对冻结树检查而非移动工作副本。D:\DS-Hns已在冻结SHA；Boss副本更晚，每被引文件均核验与冻结版本字节相同。

Utopia V0.3 capability-bridge契约、bridge服务及server是已接受参考基线，未推翻。GET capabilities每published field、invocation history、typed errors及五adapter行为不变，见第6节。

## 2. 源到目标落地边界

目标city/00-foundation/03-capability-fabric/capability-fabric，归00/03 City Service Network的Capability Registry & Discovery。

### 2.1 路径决策：真实歧义

任务写city/00-foundation/03-capability-fabric，但manifest强制city/<district>/<building>/<module>且测试固定。若把给定路径直接当module，building会名为03。选择03-capability-fabric为building、capability-fabric为module，保留ownership并遵循worker-gateway/skill-intake、knowledge-service/knowledge-core等惯例；亦符合MB001宣布city/00-foundation/01-city-core的shape。City归属未变。

### 2.2 源/目标台账

| Donor源 | 目标 | 迁移内容 |
|---|---|---|
| Hns app/core/capability-registry/index.cjs | registry.mjs | 按capability解析、priority、单owner、撤销、miss记录、有界lookup日志 |
| Hns contracts/capability.cjs | contracts.mjs | vocabulary entry形态：描述、expected providers、fallback |
| Hns plugin-manager/index.cjs | providers.mjs | 四独立生命周期问题、derived-state次序、provider拒绝隔离、unload释放全部 |
| Hns health-supervisor/index.cjs | providers.mjs | fault level→reaction阶梯、有界restart budget |
| Hns lockfile/index.cjs | lock.mjs | 严格shape、id/version set diff、absent非drift、拒绝空写、排序render |
| Boss provider-contracts.ts | contracts.mjs | provider identity、AdapterOutcome词汇、availability |
| Boss provider-outcome.ts | outcome.mjs | runtime/semantic分离、有序分类、行为轴、goal drift、evaluator revision |
| Boss provider-state.ts | contracts.mjs | WAITING_PROVIDER/PAUSED_PROVIDER/ACTIVE、显式autoResume/retryAt |
| Boss capability-router.ts | routing.mjs | ModuleState、hard eligibility、DEGRADED准入且追踪、UNKNOWN不capable |
| Boss runtime-registry.ts | routing.mjs | health折入availability；缺失/throw probe非可用 |
| Boss role-router.ts | routing.mjs | hard gate先ranking；仅可重排已批准集合 |

完整symbol/适配/分类见目标DONOR.json。

## 3. 保留行为与明确未迁

### 3.1 保留行为，由44parity测试证明

按能力名注册/解析及priority，拒绝第二owner，同owner重注册为update；requirement gate记录miss并区分REVOKED/MISSING；撤销owner所有提供项；不能说明能力的provider拒绝；有界lookup log返回copy。

四生命周期问题独立及donor derived-state顺序；disabled不能load；load幂等；throw health隔离；不可解析health为UNKNOWN不HEALTHY；reaction顺序healthy→unknown→fatal→soft→restart budget；aggregate blocked/degraded/healthy；unload重置budget。

runtime/semantic分离含十non-semantic code；成功调用内拒绝可为HARD_REFUSAL；deterministic verification/format失败优先provider信号；不可观察成功保留UNCLASSIFIED；goal drift只报告不改写；追加evaluator revisions。

autoResume由action派生而非输入，undefined retryAt省略而非0，unknown action为ACTIVE不throw。

lifecycle availability、多owner最严格胜；hard eligibility拒绝FAILED/DISABLED/RECOVERING/unknown并记录原因；DEGRADED准入且跟踪；ranking仅重排不能加，throw保确定次序。

有界invoke在任何工作前检查operation allowlist，canonical result digest，typed error保留、unknown throw变ADAPTER_UNAVAILABLE，超大RESULT_TOO_LARGE，BUSY并发界及持久中断真实记录。

严格lock version/id/owner、精确added/removed/changed set diff、absent非drift、空写拒绝、opt-in enforcement、不可解析invalid。

### 3.2 未迁及理由

| 未迁 | 理由 |
|---|---|
| Hns plugin-adapters/plugin-compat/plugin-install | 外格式准入归MB011 Customs与MB003 Worker Gateway，此处会建立第二准入seam |
| Boss capability broker/authorization/permission-contract/credential-reference | grant/permission/credential归MB012 Runtime Compliance与Customs。fabric保provider自描述及唯一invoke入口，先availability/allowlist |
| Hns config-manager | 范围内无consumer；manager config为注入plain object，schema/reject属于准入 |
| Hns30名CAPABILITIES | computer-use/ui-stability/long-term-worker/dshns等产品词汇；仅保closed vocabulary+fallback形态 |
| Boss provider-capabilities/attachment-router | 文件附件到WebAI pane为provider-window产品，而非City-global metadata |
| Boss capability-gap/improvement-loop | 持久能力缺口改进归Engineering自改进missions |
| Boss learning、commander ledger/main/scheduler/budget等 | provider planning/worker pool被任务排除 |
| Electron/DOM/product shell | 模块不触network/shell/credential |

## 4. 接口与契约

contracts.mjs导出FABRIC_API_VERSION=utopia.capability-fabric/v1；providerStateFor(action,reason,retryAt,now)返回donor ProviderStateRecord；capabilityDescriptor/input requirement/requireProviderId；RUNTIME_OUTCOMES、NON_SEMANTIC_RUNTIME_CODES、isNonSemanticRuntimeCode、runtimeOutcomeForError、recoveryActionFor；canonical/digest/FabricError/FABRIC_REASONS。

registry createCapabilityRegistry({events,now,maxLookups})提供register/revoke/revokeOwner/resolve/has/get/describe/list/capabilities/providedBy/missingRequired/recordMiss/misses/lookups/revocations/size。

providers createProviderLedger({now,maxRestarts,events,onRelease})提供register/setEnabled/load/loadAll/fault/unload/checkHealth/status/list/reactionFor/recordRestart/restartCount/aggregate/history/has/get/size；纯deriveProviderState/reactionFor/normalizeHealth/aggregateHealth。

outcome导出deriveSemanticEvaluation(input,evaluatorVersion?)、detectGoalDrift、createEvaluationRevision及SEMANTIC_OUTCOMES/OUTCOME_AXES/OUTCOME_EVALUATOR_VERSION/SCOPE_CHANGE_MARKERS。

routing createFabric({providers,lifecycleFor,now,maxInvocations,routing,emit})提供registry/registerProvider/revokeProvider/revokeOwner/descriptors/descriptorFor/capabilities/resolve/invoke/interrupt/list/get/classify/missingRequired；纯moduleStateForLifecycle/bridgeStateForLifecycles/bridgeStateFor/describeOwnership/eligibleCandidates/providerUpdateFor及MODULE_STATES/ABSENT_LIFECYCLE。

lock renderLock/parseLock/compareLock/verifyLock/writeLock/LOCK_FILE/LOCK_VERSION/LOCK_REASONS。

唯一新模块外composition root修改：bridge registry将五provider声明为ADAPTER_PROVIDERS inputs，注册真实registry，以describeOwnership派生moduleRefs/moduleLifecycles/cityLifecycle/moduleState/bridgeState。旧ADAPTERS为派生view，Web/Android已读每字段不变。

## 5. 既有UI真实消费，不建新UI

- Web Services：services.js、/services页，dropdown/operation/run/history/result detail，读取capabilities及capability-invocations。
- Android ServicesPanel：同snapshot capabilities/invocations，经同API。
- Gateway路由不变：capabilities及:id、capability-invocations及:id、POST capabilities/:id/invoke。

运行Gateway检查：

```text
planning.document.intake       AVAILABLE      ACTIVE     ops=read
planning.knowledge.query       AVAILABLE      ACTIVE     ops=query,fromDocument
engineering.skill.inspect      AVAILABLE      ACTIVE     ops=inspect,validate,catalog,archive
research.evidence.review       AVAILABLE      ACTIVE     ops=review,tamper
presentation.theme.lab         AVAILABLE      PROMOTED   ops=generate,build
city.00-foundation/03-capability-fabric/capability-fabric  BRIDGE_PENDING  PROMOTED  ops=
```

五既有能力仍AVAILABLE，planning intake read、knowledge query/fromDocument、skill inspect/validate/catalog/archive、evidence review/tamper、theme generate/build；其ACTIVE/PROMOTED原值保留。最后新City模块已描述，无invocable adapter所以诚实BRIDGE_PENDING，不隐藏。

## 6. 测试

### 6.1 44模块parity全通过

目标tests/capability-fabric.test.mjs由plain Node city/test-all发现，无新框架。断言针对donor规则而非实现形态，可对冻结donor独立查。施工发现修复两真实缺陷：compareLock对Map用Object.keys得空，静默漏added/changed，改spread keys，防composition已变却lock清洁；invoke先记录RUNNING又追加settled，残留永久RUNNING占并发并伪显示，改原位替换。

### 6.2 本机required等价门禁

| 门禁 | 命令 | 结果 |
|---|---|---|
| root | pnpm test | 58/58 |
| City | node city/test-all.mjs | 173/173 |
| Rooms | node --test apps/rooms/tests/*.test.mjs | 67/67 |
| docs | pnpm check:docs | 三对SYNCHRONIZED |
| promotion | verify-promotion-history | c7ef3cd历史10记录 |
| Windows Services | capability-windows-pilot | 26/26 |
| restart interruption | .runtime interruption-driver | PASS |
| Android unit/assemble | gradlew :app:testDebugUnitTest :app:assembleDebug | 本机NOT RUN，CI PASS，见8.1 |

pnpm经D:\Node_JS\node_modules\corepack\shims，解析固定CI版本11.19.0。

### 6.3 CI

```text
run 36568159888   head 00607f8b243e166b112319b1663eebb3d763fcfc   gateway-web success / android success
run 36568734343   head db3ac518de1d6125e00cee1d9ff6ff7868b58336   gateway-web success / android success
```

第二运行覆盖最终分支head，即Verification将审查合并的精确版本。

## 7. 数据、错误、恢复记录

- typed refusals不跨模块抛异常：CAPABILITY_NOT_FOUND、OPERATION_BLOCKED、BRIDGE_PENDING、BUSY、INVALID_INPUT、EXECUTION_TIMEOUT、ADAPTER_UNAVAILABLE、ENGINE_UNAVAILABLE、RESULT_TOO_LARGE、BUILD_STORAGE_UNAVAILABLE、GATEWAY_RESTARTED。Web真实CORRUPT_INPUT/INPUT_TOO_LARGE/CORRUPT_PDF/UNSAFE_ARCHIVE/ARTIFACT_HASH_MISMATCH均符合pilot预期。
- BUSY只计真实RUNNING，6.1缺陷曾计重复残留。
- 真实Gateway观测RUNNING→kill→restart，同invocation id为INTERRUPTED/errorCode GATEWAY_RESTARTED、digest null、available false；既不残留RUNNING也不误COMPLETED。回执.runtime/evidence/mission-book/MB-002/run-1/recovery/interruption.json。
- registry/ledger/history如donor内存；store persistence属Gateway未改，只有lock.mjs触一个文件。
- 无secret、credential或无界terminal dump记录。

## 8. 已知限制

### 8.1 Android本机toolchain不能build，非代码

两次gradlew在编译前失败：JAVA_HOME D:\Android_Studio\jbr为25.0.3；C:\Program Files\Java\jdk-26为26；唯一另JDK D:\Software\Java\jdk-26。AGP拒绝，CI用temurin21。host toolchain限制，非缺陷：git status无Android文件改，build.gradle无变化依赖，上两CI Android均通过。

### 8.2 跨客户端诚实边界

Web26/26真实端到端。Android panel本机未重跑，android pilot需ADB设备而未接。验证的是payload及Android读取capabilityId/name/bridgeState/cityLifecycle/operations/inputKind/invocationId/status/resultDigest/resultAvailable/errorCode不变，root形态测试通过。Verifier应跑CI Android，有设备再pilot。

### 8.3 provider override持久未带入

donor存override至文件，此机制3.2排除；模块无持久override，任务没要求且无Cityconsumer。

### 8.4 lock格式已知非parity

JSON取代donor YAML形态行，donor手写parser拒绝所有偏差，JSON相同strictness且避免parser漂移。version/id/owner/set diff/absent非drift/空写拒绝/排序规则保留，DONOR记录。

### 8.5 Verifier应挑战的刻意适配

1. ownership拒绝在registration而非donor resolution，当场指出错误；同owner重注册仍update。
2. manifest未列引用为NOT_IN_MANIFEST与BRIDGE_PENDING，刻意不用UNKNOWN，使caller实际写UNKNOWN仍DEGRADED。
3. provider execute由caller注入，模块不自行跑provider代码。

## 9. Utopia证据指针

raw git-ignore：

```text
.runtime/evidence/mission-book/MB-002/
├─ donor-boss/                     Codex-Boss @ 8df428e (frozen checkout)
├─ donor-hns/                      DS-Hns @ eeb57ca5 (frozen checkout)
├─ interruption-driver.mjs         restart-interruption evidence driver
└─ run-1/
   ├─ tests/capability-fabric.test.txt     44/44
   ├─ tests/windows-pilot-rows.txt         26/26 rows
   ├─ windows/runs.json + evidence.png + theme.png
   └─ recovery/interruption.json           INTERRUPTED / GATEWAY_RESTARTED
```

原目录说明：冻结boss/hns checkout、restart driver、44/44测试、26/26Windows行、runs/images、INTERRUPTED/GATEWAY_RESTARTED recovery。结构化分支：

```text
data-records/evolution/inbox/mission-book/MB-002/events.jsonl
```

全部MIGRATION/Mech事件：MISSION_CLAIMED、ATTEMPT_STARTED、OWNER_INTERVENTION（3.2范围）、CHANGE_APPLIED、TEST_PASS、RUNTIME_PASS、RECOVERY、CI_RESULT、MIGRATION_COMPLETE。无大raw logs复制至Digital-City。

## 10. 分支头与CI

mission/MB-002-capability-fabric，最终`db3ac518de1d6125e00cee1d9ff6ff7868b58336`，36568159888实现及36568734343最终头gateway-web/Android均success。未合main；merge为Verifier在所有required CI及任务门禁绿色后动作。

## 11. 文档历史说明

早先更长报告写Digital工作树，hard-reset取得并发MB001完成及Alien领取MB003时丢弃。依据已记录events、implementation commit message及证据重写；mission-book/MB-002-capability-fabric.md migration_ci保存同CI事实。重写时全部数字再对分支/CI核验，保留说明让Verifier知道文档历史。

语言配对 / Language pair: [原文 / Source](../MIGRATION_REPORT.md)
