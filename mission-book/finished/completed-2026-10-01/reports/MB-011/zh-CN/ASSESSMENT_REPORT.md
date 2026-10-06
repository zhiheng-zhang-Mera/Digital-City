# MB-011 评估报告（中文阅读译本）

> Reading translation / 阅读译本：完整历史阅读版本，原文是权威记录；不创建第二份任务元数据、不更新历史状态。元数据与代码证据原样保留。

```text
MISSION = MB-011
ROLE = MIGRATION_SIDE_ASSESSMENT
HOST = Mech
CLAIM_COMMIT = 10b2267105a87dd610503a93d62793b5f12f62c1   (Digital-City main)
DONOR_BASELINES = zhiheng-zhang-Mera/Codex-Boss@8df428eaa437a409368401e95194e40266b83080
                  zhiheng-zhang-Mera/DS-Hns@eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
UTOPIA_MAIN_BASELINE = zhiheng-zhang-Mera/utopia@756c7d760c605e33ba386e87605e078fe24b82ca
ASSESSMENT_BRANCH = mission/MB-011-customs
ASSESSMENT_HEAD = 82b6ac486d024efcfcc64703b58cc136b546caf9
ASSESSMENT_RESULT = NO_VALUE
```

```text
PLANNED_CAPABILITIES = CU-01, CU-02, CU-03, CU-04, CU-05   (count 5)
SELECTED_GAP_CLOSURES = none
ABANDONED_CAPABILITIES_AND_REASONS =
  CU-01 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR
  CU-02 UTOPIA_SUPERIOR
  CU-03 DUPLICATE_EQUIVALENT + WRONG_OWNERSHIP + NO_INDEPENDENT_VALUE
  CU-04 DUPLICATE_EQUIVALENT + OBSOLETE_DONOR + NO_REAL_CONSUMER
  CU-05 UTOPIA_SUPERIOR + OBSOLETE_DONOR
ASSESSMENT_RESULT = NO_VALUE
NO_VALUE_CANONICAL_RESULT = 判断无价值，任务保留，未迁移
```

元数据记录 Mech 的迁移侧评估、领取提交、Boss/Hns 冻结基线、Utopia main、评估分支及 HEAD。计划 CU-01–05 五项能力，未选 gap closure；CU-01 等价重复/过时，CU-02 更优，CU-03 等价重复/所有权错误/无独立价值，CU-04 等价重复/过时/无消费者，CU-05 更优/过时。评估结果 NO_VALUE：判断无价值、任务保留、未迁移。

## 0. 领取依据

```text
P0 (verification / integration): NONE eligible.
   MB-001..MB-010 all closed; every mission branch AheadOfMain = 0 at utopia@756c7d7.
P1A (assessment-first): MB-011 is the next lowest-sequence enabled assessment-first
   Mission (seq 11) with assessment_complete = false and an unclaimed stage.
```

P0 无可选验证/集成：MB-001–010 全关闭，各 mission branch 对 utopia@756c7d7 的 AheadOfMain=0。P1A：MB-011 是下一项 sequence 最小（11）、已启用 assessment-first、assessment_complete=false、无人领取的任务。

**本任务没有被简单以“已覆盖”驳回。** MB-002 的 `city/00-foundation/03-capability-fabric/capability-fabric/DONOR.json` 明确记录 Hns plugin/adapter/installer 平台是*有意未迁移*，并指定 owner：

```text
"The Hns plugin/adapter/installer platform is deliberately NOT migrated: plugin-adapters
 (format detection, adapter registry, compatibility), plugin-compat, plugin-install,
 config-manager and the permission/host layers belong to 01/01 Customs (MB-011),
 01/02 Runtime Compliance (MB-012) and 02/02 Worker Gateway (MB-003)."
DEFERRED: "plugin/adapter format detection and the adapter registry (MB-011 Customs)"
          "permission and authorization resolution (MB-012 Runtime Compliance)"
```

Plugin-adapters 的格式检测、adapter registry、兼容性，plugin-compat、plugin-install、config-manager、permission/host 层属于 MB-011 Customs、MB-012 Runtime Compliance、MB-003 Worker Gateway；具体 deferred 格式检测/registry 给 MB-011、permission/authorization 给 MB-012。MB-011 因而是 deferred admission 层的*具名* owner，按自身价值评估。下文证明该 deferral **不是**迁移机会。

## 1. 计划 donor 能力

任务指定两个 donor、五个 capability ID。Donor 无字面叫 `customs` 的模块；映射通过阅读冻结树建立。

| ID | 计划能力 | Donor 锚点 |
|---|---|---|
| CU-01 | manifest/schema admission 验证 | Hns `app/core/contracts/plugin.cjs`（validateManifest、validatePlugin、normalizeManifest），`app/core/plugin-adapters/contract.cjs`（validateAdapter、standardizeManifest、validateAdapterOutput），`app/core/plugin-adapters/process/contract.cjs`（validateProcessManifest）；Boss `electron/platform/capability-manifest.ts`、`config/capabilities/*.yaml` |
| CU-02 | admission 时 identity/source/provenance 验证 hook | Hns `app/core/plugin-install/pipeline.cjs`（normalizeSource）、`app/core/plugin-install/records.cjs`；Boss `scripts/city-ledger-provenance.cjs` + `config/city-ledger-provenance.json` |
| CU-03 | dependency/capability/permission/domain/storage 声明检查 | Hns `app/core/plugin-manager/index.cjs#loadOne`、`app/core/contracts/plugin.cjs#normalizePermissions`、`app/core/plugin-adapters/contract.cjs`（PERMISSIONS、resolvePermissions）、`app/core/plugin-compat/deps.cjs`；Boss `electron/security/permission-manifest.ts` |
| CU-04 | isolation/crash-boundary/compatibility preflight | Hns `app/core/plugin-adapters/contract.cjs`（RUNTIME_KINDS、standardizeRuntime）、`app/core/plugin-adapters/process/contract.cjs`、`app/core/plugin-compat/index.cjs` + `worker.cjs`；Boss `electron/root-recovery/rollback-controller.ts` |
| CU-05 | admission 前 enable/disable/uninstall/rollback readiness | Hns `app/core/plugin-manager/index.cjs`（setEnabled、removeOne）、`app/core/plugin-install/plan.cjs`、pipeline.cjs、records.cjs |

计划能力数量 **5**。

## 2. Donor 源码映射与生命周期（决定性发现）

只读调查冻结 `eeb57ca` 的17个 Hns admission 模块，得到决定本任务的两个事实。

### 2.1 完整 admission 设计在生产不可达

```text
app/core/plugin-install/plan.cjs       232 lines   ADMISSION-INPUT, advisory only, produces NO refusal
app/core/plugin-install/pipeline.cjs   464 lines   ADMISSION state machine - ZERO app consumers
app/core/plugin-install/records.cjs    264 lines   readiness state        - dead with pipeline
                                       ---------
                                       960 lines   unreachable from app/
```

plan.cjs 232行：ADMISSION-INPUT、仅建议、不产生拒绝；pipeline.cjs464行：admission状态机、零app消费者；records.cjs264行：readiness状态，随pipeline失活；总960行从app不可达。

唯一非测试 importer 是 `scripts/install-pipeline-acceptance.cjs`；`app/plugin-host.cjs` 从未引用。records 是 pin/quarantine/rollback **唯一**实现，故 CU-05 这些功能也随其不可达。Donor *live* 等价物弱得多：

```text
plugin-manager.install()    -> validatePlugin + duplicate check only
plugin-manager.setEnabled() -> refuses only PLUGIN_NOT_FOUND; no consumer-impact analysis
plugin-manager.removeOne()  -> refuses only PLUGIN_NOT_FOUND; no dependent check, no rollback
```

install仅validatePlugin+duplicatecheck；setEnabled仅拒PLUGIN_NOT_FOUND、不做consumer impact；removeOne仅拒PLUGIN_NOT_FOUND、不查dependent、无rollback。

### 2.2 已声明但从不产生的拒绝码

以下常量存在，但全库没有产生它们：

```text
ADAPTER_FAULT_CODES.{UNKNOWN_PERMISSION, PERMISSION_DENIED}
LOAD_REASONS.IMPORT_FAILED
COMPAT_LOAD_REASONS.IMPORT_FAILED
PROCESS_FAULT_CODES.{BAD_MANIFEST, NO_COMMAND, COMMAND_ESCAPES, HANDSHAKE_REFUSED, RESTART_LIMIT, PORT_NOT_REPORTED}
BRIDGE_FAULT_CODES.{HANDSHAKE_FAILED, NOT_ACTIVATED}
INSTALL_FAULT_CODES.{NO_ADAPTER, ALREADY_INSTALLED}
```

代码保留ADAPTER未知许可/拒绝许可、LOAD/COMPAT导入失败、PROCESS的BAD_MANIFEST/NO_COMMAND/COMMAND_ESCAPES/HANDSHAKE_REFUSED/RESTART_LIMIT/PORT_NOT_REPORTED、BRIDGE握手失败/未激活、INSTALL无adapter/已安装等原样常量。

精确后果：

- **Permission不是admissiongate。** resolvePermissions计算granted/refused/unknown，admission仅记录adapter-permissions-incomplete后仍准入（plugin-adapters/index.cjsL165–175）。plugin-manager.loadOne完全不读permissions。
- **API-version拒绝以错误文字regex分类**：`code = /api_version/.test(reason) ? LOAD_REASONS.API_INCOMPATIBLE : LOAD_REASONS.MANIFEST_INVALID`。
- **Requirementcycle不拒绝。** orderPlugins检测并返回cycles，loadAll每cycle发MANIFEST_INVALIDfault但仍尝试有序entries。
- **缺失packagepeer报告而不拒绝**：cordis-structure.auditPeers→peers.missing，在deadcode中risk+3及degradationnote。

### 2.3 没有provenance验证或密码学验证

冻结基线全库：

```text
createVerify 0 hits    verifySignature 0    publicKey 0    x509 0
contentHash 0          pluginHash 0
node:crypto import:  NONE of the 17 surveyed admission modules
```

createVerify、verifySignature、publicKey、x509、contentHash、pluginHash均0；17模块均不importnode:crypto。

pipeline从**用户字符串regex**构造provenance{kind,repo,path,branch,dir}，records持久化。无处检查remote、author、releasemanifest、registry、hash、signature。最接近pin的是app/extensions/mega/store/installer.cjs按`/^[0-9a-f]{7,40}$/i`验证revision并gitfetch--depth1；那是Git自身content addressing，不是Hns验证。Adapter层node:crypto仅出现一次，process/transport.cjsL230每次启动localhostsockettoken，是runtimechannel auth，不是pluginprovenance。

### 2.4 没有isolation/crash-boundarypreflight

RUNTIME_KINDS诚实声明enforcement/isolation：in-process→advisory/none，isolated-process→process-boundary/process，managed-process→protocol/process，declarative→declared-only/none，remote→protocol/network；standardizeRuntime将其盖在manifest。**无处据此拒绝admission**；没有路径读enforcement/isolation并返回refusal。唯一decision消费者是plugin-install/plan.cjs::assessRisk（in-process权重8），仅建议，自身也不可达（§2.1）。

*修正（2026-09-30，Alien，独立重验§9.1）*：早稿“deadcode”易被理解为整个plugin-adapters树不可达，实际不是。声明RUNTIME_KINDS、定义validateAdapter/standardizeManifest/validateAdapterOutput/PERMISSIONS的contract.cjs被**live**app/plugin-host.cjs加载；后者被app/desktop-main.cjs及app/runtime/host.cjsrequire。它确实拒绝：未知permission词汇、畸形adaptermanifest、adapterfault code均抛具名错误。它**不**做的是因isolationmetadata拒绝。NO_VALUE应基于“无人消费isolation decision”，以及“Utopia没有可由该preflight准入的plugin/adapter平台”（下文第6点），不能夸大deadness。真实crashboundary在**准入后、activation时**：plugin-compat/index.cjs+worker.cjs（隔离child，20sbound），bridge/host.cjs+bridge/child.cjs；COMPAT_UNSUPPORTED_API在决定准入后的**child内**决定。

确实存在一个结构preflight：adapters/native-hns.cjs和process/contract.cjs的**pathcontainment**；entry/command解析出plugindir则拒绝。

## 3. 领取时Utopia能力清单（`756c7d7`）

候选`city/01-governance/01-customs-security`及01-governance区不存在；manifest仅列00-foundation、02-engineering、06-research、09-planning-knowledge、10-automation。CityR2规定这本身不证明缺失，以下是语义清单。

| 关注点 | Utopia实现 | 类别 |
|---|---|---|
| Citymanifestadmission | city/manifest.mjs loadManifest/validateManifest/checkManifestAgainstTree：schemaVersion、district/building/module ID形状、双语text、duplicateid/path、lifecycle词汇、capabilityProviderboolean、**canonicalpathequality**、incubationroom唯一及implemented必需、donorrepository+gitSHA；implemented⇔directoryexists交叉核验 | livemodule+13tests |
| Room/incubationadmission | apps/rooms/hub/manifest.mjs：ROOM_LIFECYCLES、RETIRED_LIFECYCLES、metadatacontract；apps/rooms/docs/en/INCUBATION_POLICY.md | liveregistry+policy |
| Promotionadmission/provenance | apps/rooms/hub/promotions.mjs normalizePromotionRecord：status必须PROMOTED，acceptedRoomCommit/promotedAtCommit/donor.commit必须gitSHA，targetCityPath在city/；crossCheckPromotions：room已知、不再active、lifecyclePROMOTED、target匹配manifest | livemodule |
| Promotionprovenance验证 | scripts/verify-promotion-history.mjs：accepted/promotedcommit上gitcat-file-e，两次merge-base--is-ancestor，promoted:target和HEAD:targetcat-file-e，退役incubator不得有liveimplementation | liveverifier |
| 每模块provenance | 每迁移模块旁DONOR.json：repository、commit、sourcePaths、portedFiles、adaptation、knownDifferences、parityvectors、classification | liverecord |
| Capability所有权/声明admission | fabricregistry注册时拒重复owner且列两owner，miss列requester，revocation；contracts的FABRIC_API_VERSION/capabilityDescriptor/FABRIC_REASONS；bridge registry moduleRefs解析、owner、priority、district/buildingkind+capabilityProvider:falsegate | livemodule+service |
| Providerreadiness | providers.mjs installed/enabled/loaded/healthy四独立事实，拒重复identity，disabled未force拒load，healthladder、有界restartbudget | livemodule |
| Capability硬eligibility | fleet-routing/capability-routing.mjs eligibleCandidates排FAILED/DISABLED/RECOVERING并给reason，记录missingcapabilities，明确准入DEGRADED | MB-001迁移模块 |
| Restart/rollbackreadiness | MB-006 city/02-engineering/04-restart-recovery-station/*：protocol、具声明transitionedge的lock、fail-closedcheckpointgate、expiry/pid/schema/checksum阶梯的checksummedticket | 迁移模块 |
| Contractschema | contracts/capability-bridge-v1、city-control-v0、pairing-v1、city-roads/document-knowledge-v1、evolution/mission-event-v1+mission-episode-v1 | livecontract+conformancetest |
| Protectedsurface | city/00-foundation/01-city-core/root-authority，**明确不在本任务范围** | MB-001迁移模块 |

已检索确认city/CITY_IMPLEMENTATION_MANIFEST.json、city/manifest.mjs、city/tests/manifest.test.mjs、city/00-foundation/01-city-core/**、city/00-foundation/03-capability-fabric/**、services/capability-bridge/**、apps/rooms/promotions/**、apps/rooms/hub/**、scripts/verify-promotion-history.mjs、contracts/**，并全库grepapi_version、semver、provides、conflicts、validateManifest、validatePlugin、permission、uninstall、rollback、01-governance、customs。

值得记录：Utopia的customs仅出现于MB-002deferral和其module header（为何不属01Customsadmissionboundary）；没有api_version/semverpluginmanifestvalidator，也没有permission或state-namespaceownershipadmission。

## 4. 能力比较矩阵

| ID | Donor能力/证据 | Utopia等价/当前行为 | Coverage/Gap | Decision/Reasoncode | 证据 |
|---|---|---|---|---|---|
| CU-01 | manifest/schema：validateManifest查idpattern、semver、api_versionequal、capability array、boolean、fault_level、permissionarray；validateAdapter/standardizeManifest；processmanifest查argv、closedtransport、numeric一致、containment；Bosscapabilitymanifest查interfacegraph、duplicateprovide、required∩optional | City查结构/ID/lifecycle/canonicalpath/room唯一/donorSHA并tree交叉核验；promotionrecord验证；fabricAPI与descriptor；5contractschema | EQUIVALENT；donorplugin format字段没有Utopia准入artifact，因无plugin format；现有字段Utopia更严，canonicalpath+treecheck无donor类似 | ABANDON / DUPLICATE_EQUIVALENT、OBSOLETE_DONOR | city/manifest.mjs、city/tests/manifest.test.mjs、promotions.mjs、contracts/*/schema.json |
| CU-02 | identity/source/provenancehook；normalizeSource从**用户输入regex**记录provenance，records持久化，**完全无验证**，无hash/signatureprimitive | Promotioncarrydonorrepository/commit/sourcePaths并**验证**；crossCheck拒catalog不一致或room仍服务；historyverifier对localGit验证每recordancestry/targetexists；每moduleDONOR | SUPERIOR；无gap，donor仅记录无验证可迁移；Utopia记录并验证 | ABANDON / UTOPIA_SUPERIOR | promotions.mjs、verify-promotion-history.mjs、DONOR.json |
| CU-03 | dependency/capability/permission/domain/storage；loadOne仅load时requires_capabilities；conflicts仅比**已加载**pluginID；optional未读；peer报不拒；**permission非gate**（UNKNOWN_PERMISSION/PERMISSION_DENIED从不产生） | Fabric**注册时**拒第二owner、miss列requester、区分optional；providers拒duplicateidentity；bridge解析moduleRefs/ownership/priority/kind；eligibleCandidates硬eligibility；City拥有domainpath | EQUIVALENT；两子项非gap：MB-002DONOR明确permission/authorization属**MB-012**且donor非gate；storage两者均无 | ABANDON / DUPLICATE_EQUIVALENT、WRONG_OWNERSHIP、NO_INDEPENDENT_VALUE | capability-fabric/registry.mjs、providers.mjs、capability-bridge/registry.mjs、capability-routing.mjs |
| CU-04 | isolation/crash/compatpreflight；RUNTIME_KINDS仅metadata、无人据此拒，risk仅deadplan；api_version是真gate；真实isolation为**准入后**childspawn；两adapter有containment | FABRIC_API_VERSION+descriptor兼容准入；faultlevelsoft/degraded/fatal、healthladder、restartbudget；MB-006拥有真实recoveryboundary | EQUIVALENT；命名preflight在donor**不构成拒绝**；迁移会为Utopia不存在平台导入pluginprocessisolation，造consumer是newcapability；Bossrootrollback属Owner/Root主权，明确禁止 | ABANDON / DUPLICATE_EQUIVALENT、OBSOLETE_DONOR、NO_REAL_CONSUMER | plugin-adapters/contract.cjs、process/contract.cjs、capability-fabric/contracts.mjs、providers.mjs、04-restart-recovery-station/** |
| CU-05 | enable/disable/uninstall/rollback准入readiness；live setEnabled/removeOne仅拒PLUGIN_NOT_FOUND，无dependent/rollback；设计pin/quarantine/rollback-before-replace/confirm仅**生产不可达**plugin-install960行0appconsumer | Providers四事实独立、disabled未force拒load；RETIRED_LIFECYCLES移除promoted/rejectedactivecatalog；crosscheck/history证无第二liveimplementation；MB-006gatefailclosed，lock/ticket拥有rollbackreadiness | SUPERIOR；无gap，live donor弱于现有Utopia，设计检查是deadcode | ABANDON / UTOPIA_SUPERIOR、OBSOLETE_DONOR | plugin-manager/index.cjs、plugin-install/*、providers.mjs、promotions.mjs、04-restart-recovery-station/** |

## 5. 判定：NO_VALUE

> **判断无价值，任务保留，未迁移**

不复制donor的正确工程理由：

1. **完整admission设计用户不可达。** plugin-install状态机是pin/quarantine/rollbackreadiness/explicitconfirmation唯一出处，零appconsumer。将dead设计搬入MIGRATION_ONLY不是迁移workingbehavior。
2. **Donor不验证provenance，CU-02无可迁移行为。** 用户regex记对象即止；Utopia每promotion都记录**并**对real Git history验证。
3. **CU-04preflight不存在拒绝。** metadata声明但无路径读以拒绝（§2.4）；真实isolation为Utopia无plugin平台的postadmissionspawn。声明模块live且拒其他东西，故理由是*无isolation decisionconsumer*，非*deadcode*。
4. **Permission越界且从未成gate。** MB-002指定MB-012；独立事实为donorpermissioncode从不产生，未获grant仅log仍准入。
5. **Live片段等价或弱于Utopia检查。** Manifest、promotionprovenance、capability ownership、enable/disablereadiness均已实现/测试/消费；Customs重复执行恰违反本任务gate：“必须证明抽取后没有重复执行Utopia已有manifest/promotion/capability检查”。
6. **无可准入consumer。** Utopia单位是Citymodule/incubatorRoom，不是dshns.plugin/v1、dshns.adapter/v1、dshns.process/v1package。为Customs造plugin平台是MIGRATION_ONLY禁止的NEW_FEATURE_DEVELOPMENT。

**MB-002deferral说明**：它指定MB-011未来拥有Hns平台，但只是未来*占位符*、非已验证发现。本评估验证并关闭：Utopia没有consumer，donor最完整部分自身也不可达。Deferred到某Mission不等于证明价值，诚实结果NO_VALUE，非落入不可调用代码的迁移。

## 6. 论文/研究素材（仅实测）

```text
planned capability count                : 5
equivalent already present              : 3   (CU-01, CU-03, CU-04)
Utopia superior                         : 2   (CU-02, CU-05)
concrete gaps                           : 0
selected full / partial migration       : 0 / 0
abandoned                               : 5
rejection reason-code distribution      : DUPLICATE_EQUIVALENT 3, UTOPIA_SUPERIOR 2,
                                          OBSOLETE_DONOR 3, NO_REAL_CONSUMER 2,
                                          WRONG_OWNERSHIP 1, NO_INDEPENDENT_VALUE 1
                                          (multi-code rows)
donor modules surveyed                  : 17 DS-Hns admission modules (343/421/363/260/416/330/
                                          453/273/442/217/309/205/232/464/264/190/550 lines)
                                          + Codex-Boss capability-manifest.ts (17622 B),
                                          permission-manifest.ts (2003 B),
                                          rollback-controller.ts (8887 B)
donor dead-code measurement              : plugin-install/* = 960 lines, 0 app consumers
                                          17 declared-but-never-produced refusal codes
                                          createVerify/verifySignature/publicKey/x509/
                                          contentHash/pluginHash = 0 hits each
source/target anchors inspected          : 17 donor admission modules + 2 Codex-Boss admission
                                          files + 2 donor capability configs; Utopia: 12
                                          module/service/verifier/contract anchors across
                                          city/, apps/rooms/, services/, scripts/, contracts/
parity/runtime checks PASS/FAIL          : bounded admission chain 13/13 PASS, 0 FAIL
                                          city/test-all.mjs 1807 pass / 0 fail / 1 skipped (of 1808)
                                          root node --test tests/*.test.mjs 84 pass / 0 fail
                                          promotion history 10/10 records verified
                                          TOTAL: 1904 PASS, 0 FAIL
assessment start (host clock)            : 2026-09-30T15:48:08Z (claim)
assessment end (host clock)              : see git commit time of assessment HEAD
implementation churn / tests / CI        : 0 product/runtime files changed; 0 new tests;
                                           no CI run required (no implementation)
```

计划5、等价3（CU-01/03/04）、更优2（CU-02/05）、gap0、full/partial0/0、放弃5；多码reason分布等价3、更优2、过时3、无consumer2、wrongownership1、无独立价值1。17Hns模块行数343/421/363/260/416/330/453/273/442/217/309/205/232/464/264/190/550；Bosscapabilitymanifest17622B、permissionmanifest2003B、rollbackcontroller8887B。Deadplugininstall960行0consumer，17从不产生refusal code，六密码学词均0。检阅17模块+2Bossadmissionfile+2donorconfig及12Utopia锚点。Boundedadmission13/13，City1807/0/1of1808，root84/0，promotion10/10，原报告TOTAL1904/0保留。开始2026-09-30T15:48:08Z，结束见HEAD时间，0产品/runtime变化、0新test、无实现无需CI。

### 问题、选择、判断

1. **两个donor，能力名均不字面对应。** *选择*：按语义映射五ID到两冻结树，不按目录；记录重叠。*判断*：Hns拥有plugin/adapteradmission，Boss拥有capabilityinterfacegraph/permissionmanifest；两者均评估、均无gap。
2. **MB-002明确deferral看似承诺。** *选择*：视为待测假设而非价值证据，明确测试（§0/5）。*判断*：占位符测试才能成为迁移或诚实负结果；这里是负结果。
3. **Donor“有X”不等于“运行X”。** *选择*：每项先建caller graph再判coverage。*判断*：反转判定；最完整plugininstall从app不可达，多个refusal code只声明，permissiongate记后准入。不读caller graph会误给CU-05/01FULL_MIGRATION。
4. **首次probe的CU-03namelesscapabilitycode与预期不同。** *判断*：行为正确，descriptor factory先抛INVALID_INPUT，registryNAMELESS未到；probe断言拒绝而非具体code。记录不平滑，因为未来consumer须知由哪层拒绝。

### 保留的负结果观察

- **Deferral债务不是迁移价值。** 旧DEFERREDbelongsMB0NN是指针、非发现；连续MB-010/011发现余部已覆盖或dead；检测靠caller graph非filelist。
- **已声明拒绝码是评估陷阱。** live模块十个code从不产生，计为enforcement也会反向夸大CU-01/03/04覆盖，令donor似乎拒不存在拒绝项。
- **两个donor可严格弱于target。** Utopia对real Git验证，donor用户regex只记不验；“有provenance module”不是执行验证证据。
- **无district不等于无capability。** City无01-governance，但CU-01–05所问admission均在别处存在/消费；按目录会误产新buildingFULL_MIGRATION。

## 7. Utopia素材指针

- 本地.runtime/evidence/mission-book/MB-011/2026-09-30-mb011-assessment-01/assessment/（gitignoredHnsapp/corezip/extraction、probe、receipt、suitelog）。
- Inbox data-records/evolution/inbox/mission-book/MB-011/events.jsonl，4events：MISSION_CLAIMED、ATTEMPT_STARTED、2×TEST_PASS。
- 已发布evidence/raw/mission-book/MB-011/assessment/：README.md、capability-matrix.json、bounded-admission.json、environment.json。
- 不可变分支mission/MB-011-customs @ `82b6ac486d024efcfcc64703b58cc136b546caf9`。

> NO_VALUE不造verifiedepisode，保留branch/report/pointers；research/provenancebranch**不合并、不删除**（历史规则，后文Owner特例）。

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

判断无价值、任务保留、未迁移，README§2/CityR1/R4绿色完成，非失败。Scheduler视MB-011完成并跳过，除非Owner明确reset/reopen。

## 9. 独立重新验证（2026-09-30，Alien）

Owner要求**不复用既有测试**重新验证，允许真实Android操作；以下方法、新证据、SHA。NO_VALUE**独立确认**。

### 9.1 Donor生命周期重新推导（自写probe，冻结8df428ea/eeb57ca）

| 问题 | 结果 |
|---|---|
| importapp/core/plugin-install | **无** |
| 调createInstallPipeline/normalizeSource | **无**（moduleexport但不invoke） |
| plugin-adaptersconsumer | liveapp/plugin-host.cjs，被app/desktop-main.cjsrequire；以及deadplugininstallfile |

决定性claim对CU-02/05admission state 机成立：**零consumer**。细化：CU-04plugin-adapters从livepluginhost可达，refusal不是deadcode；仍NO_VALUE理由是**Utopia无Customs可准入plugin/adapter平台**，移植preflight会落入不可调用代码。

### 9.2 对真实manifest篡改重新证明现有admission

本轮全新编写，每case修改realmanifest须真实拒绝，未篡改control仍须pass，排除blanketrefusal：

```text
duplicate district                       -> refused: "duplicate district 00-foundation"
module path not equal to its identity    -> refused: "module project-foreman path must be city/…"
unknown lifecycle                        -> refused: "lifecycle PRODUCTION is not a city lifecycle"
unknown district kind                    -> refused: "district 00-foundation kind sandbox is not a city district kind"
non-boolean capabilityProvider           -> refused: "capabilityProvider must be a boolean"
control (untampered manifest)            -> accepted
```

Duplicate区、modulepath不等identity、unknownlifecycle、unknowndistrictkind、nonbooleancapabilityProvider分别拒绝，未篡改accepted，原message保留。另live路径promotion对real Git验证10record，fabric**拒同capability第二owner**，具名reason `verify.duplicate.owner is already owned by provider.a`。

**确认NO_VALUE。** Utopia已live执行并拒绝manifestadmission、provenance验证、capability ownership；donoradmission设计在两仓库均无consumer。

### 9.3 分支/SHA跟踪

```text
utopia main at verification : 756c7d760c605e33ba386e87605e078fe24b82ca
assessment branch           : mission/MB-011-customs @ 82b6ac486d024efcfcc64703b58cc136b546caf9
ahead / behind main         : 1 / 0
that one commit contains    : data-records/evolution/inbox/mission-book/MB-011/events.jsonl
                              evidence/raw/mission-book/MB-011/assessment/** (README, capability-matrix,
                              environment, bounded-*)
                              NO IMPLEMENTATION CODE
merge (at verification time) : NOT PERFORMED, by rule. README line 223 (echoed by response-9-30 R1)
                              keeps a NO_VALUE assessment branch as provenance and explicitly forbids
                              merging it, and forbids fabricating a verified implementation episode.
merge (Owner ruling R11)    : PERFORMED afterwards as a PROVENANCE merge, by explicit Owner direction:
                              response-9-30.md#R11 overrides README line 223 for these three branches only.
                              git merge --no-ff mission/MB-011-customs
                                -> f22273c37af1ebff6c95d49972b5d26a222f2ed2  (parents 6e9781c, 82b6ac4), conflict-free,
                                   5 files added (events.jsonl + 4 assessment evidence files),
                                   branch retained on the remote, no implementation code involved.
merged_main_sha             : null - UNCHANGED. The field means "the SHA where this Mission's
                              implementation landed in main"; nothing was implemented, so it stays null
                              even though the provenance branch is now archived in main.
utopia main afterwards      : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e (the three provenance merges plus Alien's forced
                              NO_VALUE record on top of 756c7d76)
```

验证时main/branch冻结及aheadbehind1/0；唯一提交含inbox+四assessment证据、无实现。验证时按READMEline223及response9-30R1**未合并**，禁止假verifiedimplementationepisode。之后OwnerR11仅覆盖这三branch：`git merge --no-ff mission/MB-011-customs` → `f22273c37af1ebff6c95d49972b5d26a222f2ed2`，parents6e9781c/82b6ac4，无冲突新增5file，远端branch保留无实现。之后main `d0dea7bcb66cf57edee73c67ddfb9526337dfb4e`（三provenancemerge+Alien强制NO_VALUE，基于756c7d76）。

无migrationbranch，无实现可合并，故merged_main_sha始终null；字段意为本任务实现落入main的SHA。R11归档仅本节probe/tampercase/dryrunassessmentprovenance，绝非迁移capability。

### 9.4 证据指针

- .runtime/evidence/mission-book/MB-010-011-012/donor-lifecycle-probe.json（三项donorreachability）。
- .runtime/evidence/mission-book/MB-010-011-012/precise-claims-probe.json。
- .runtime/evidence/mission-book/MB-010-011-012/utopia-admission-enforcement.json。
- .runtime/evidence/mission-book/MB-010-011-012/real-device-node.json 与两张设备截图。

语言配对 / Language pair: [原文 / Source](../ASSESSMENT_REPORT.md)
