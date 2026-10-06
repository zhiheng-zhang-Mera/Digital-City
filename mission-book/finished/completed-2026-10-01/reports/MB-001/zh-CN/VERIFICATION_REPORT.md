# MB-001 — Codex-Boss Core OS 验证报告（中文阅读译本）

> Reading translation / 阅读译本：完整历史阅读版本，原报告为权威记录；不更新旧状态、不创建第二份任务元数据，代码证据保持原样。
> 历史报告头状态：**IN PROGRESS**；验证主机Mech；领取2026-09-29T15:30:00Z；迁移主机Alien（按规则5不同）。
> 审查迁移分支mission/MB-001-core-os @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`。报告后文的完成/合并记录也完整保留。

## 0. 规则9次序（先读）

验证主机**先**从donor、target code、diff、tests、runtime独立审查并写发现，**之后**才读MigrationReport。本文按该次序：§1–5写时未打开reports/MB-001/MIGRATION_REPORT.md或迁移主机叙述；§6首次咨询，记录独立发现而报告未说者、以及报告声明而独立审查无法确认者。

## 1. 验证对象

任务将Boss多用途项目的Cityauthority/runtime trust/global orchestration core迁至Utopia00/01CityCore。Donor Boss @ `8df428eaa437a409368401e95194e40266b83080`，任务目标city/00-foundation/01-city-core。

# A部分——独立审查（§2–5）

仅从donor、branch diff、代码、运行runtime写成；**直到§6才打开**MigrationReport。

## 2. 分支实际内容

审查mission/MB-001-core-os @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`；对声明basec7ef3cd，**41文件、+6189/−17**。CityCore下四module：

| Module | 自身DONOR.json来源 |
|---|---|
| root-authority | Boss src/shared/authority/root-trust contract、guardian.ts |
| task-lifecycle | Bossglobaltaskidentity/lifecycle/durablestate |
| audit-ledger | Bossdecisionledger、guardiangate、recoveryprimitive |
| fleet-routing | src/shared/fleet.ts、capability-router.ts、node-capabilities.ts、adaptive-routing.ts |

另city/manifest.mjs、Citymanifest、两ARCHITECTURE、bridgeregistry、**services/dev-gateway/server.mjs**、tests/gateway.test.mjs和missionevent stream。

## 3. 独立发现

### 3.1 审查版本requiredgate通过——确认

本主机在brancha71bf90运行：pnpmtest **60/60**，nodecity/test-all.mjs **229/229**，node--testapps/rooms/tests/*.test.mjs **67/67**。

### 3.2 目标路径与MB-002/004/005须同样解读——非缺陷

任务路径不是完整city/<district>/<building>/<module>；branch解读district00-foundation、building01-city-core及四下属module，保留manifestinvariant。每module有flatprovenance district/building/cityPath。与MB-002/004/005一致，是全队列一致解释非局部方便。

### 3.3 Gateway接线保持行为——确认，已自行检查

Server将inlineclaimpredicate换成迁移Core调用：

```diff
-const ready=n.online&&n.capabilities.includes('task.execute.safe')&&n.capabilities.includes('filesystem.temp');
+const ready=acceptsWork(claimNodeFor(n),{requiredCapabilities:REQUIRED_TASK_CAPABILITIES});
```

等价性通过代码非测试确认：

- REQUIRED_TASK_CAPABILITIES=['task.execute.safe','filesystem.temp']，与inline两capability字节相同。
- claimNodeFor映射n.online?'READY':'OFFLINE'。
- acceptsWork若state属于FLEET_NODE_STATES_REFUSING_WORK则拒，contracts.mjs:49定义FAILED/DISABLED/OFFLINE，故OFFLINE恰等同!n.online拒绝。
- 随后requiredCapabilities.every(...)，同conjunction。

因此offline无论广告均拒，缺任何一capability拒，其余accept。**等价且接线明确允许**：forbiddenlist未禁gateway修改，MIGRATION_ONLYallowance明确“接线”真实有界消费；未引入禁止的新authoritypolicy。

**小发现**：新gatewaytest以同一待测acceptsWork计算coreSays预期，并**本地重写**两capability list。断言循环，不能检测错误REQUIRED_TASK_CAPABILITIES（testcopy也得同样错）。但runtime半部真实有价值：real gateway/registration/claim/response，完整capableplacement、partial拒绝、silentoffline且work QUEUED。建议importconstant而非重写，并对fixed expected response断言，不对acceptsWork断言。

### 3.4 Provenanceledger存在且可追溯——确认

每module有DONOR.json。Fleet inspectedrepositoryzhiheng-zhang-Mera/Codex-Boss、commit8df428e…、四sourcePaths精确命名donor、逐donorpathportedFilesmap、**10PARITY**可观察rulevector、**6PORT_ADAPTATION**、**7DEFERRED**。

DEFERRED诚实非装饰：provider/fleetruntime、heartbeattransport、connectionregistry、assignment/checkpointpersistence、schedulingloop/retrytimer、providerbrandautomation、learnedreranker/profilestore、nodestatemachinetransition/costaccounting均真实缺失且明确声明。

**小发现**：ledger是顶层repository/commit/sourcePaths的**flat**shape，MB-002/004/005用donors[]。均可读且内部一致，但按一种shape写的机器reader不读另一种；更多Mission落地前值得统一。

### 3.5 独立审查无法确认者

- **Donorparity是声明，非由构造证明。** Prosevector无MB-005compiledfrozen那样differential。已验证port tests，未逐行证明Boss8df428e等价；需冻结tree+differential或symbolcomparison。
- **七DEFERRED是boundaryclaim。** 若其一支撑“至少一个既有task/control真实消费Core”，则消费浅于措辞。§3.3唯一可见真实消费很窄：node claimpredicate。
- 本轮未端到端执行**重启后的durableidentity**，对应“重启/恢复后durabletask/audit身份不被伪造成功”。

## 4. 规则9状态

§3先于读迁移report写定；本文没有读迁移叙述后改独立finding；§6明确差异。

## 5. 本主机运行gate

Mech从cleanmission/MB-001-core-os checkout，在读报告前执行§3.1；数字是独立测量非确认对方table。

写§6时Afinding未修订。读后补跑两requiredgates，见§6.8，作为Acoveragegap公开，而非重写finding。

# B部分——对照迁移报告（§6）

## 6. 独立审查与MigrationReport协调

§1–5已写并提交City后才首次打开：claim835c7db、independentreview03c9f75。以下comparison非rewrite。

### 6.1 报告结构

迁移报告331行：§0MIGRATIONstatus，§1landingboundary，§2test/runtime，§3evolutionhandoff，§4D1–D10，§5verifierhint，§6knownlimit，§7handoff。按missionbookconstructionorder；与队列通常不同，§4为实质内容，十named decision各含choice/reason/cost，恰是rule9secondreading所需；因此多为收敛非修正。

### 6.2 独立审查发现但报告未说者

1. **报告未将§6.3knownlimit联系“task lifecycle+restart/recoveryreceipt”要求。** §1/D1明确不迁electron/state-core/**及node:sqlite，并列已知限制，却不指出所需receipt在哪里。实际在早于本任务的产品consumer server.mjs，除了claimpredicate不改。Gateway接受work前有两恢复行：

```js
   for(const t of store.list('tasks'))if(!terminal.includes(t.state)&&t.state!=='QUEUED')
     change(t,'FAILED',{error:'Gateway restarted during execution; create a new task to retry safely.'});
   for(const n of store.list('nodes'))store.put('nodes',{...n,online:false});
   ```

它们将非terminal且非QUEUED task标FAILED并说明重启期间执行应新建task安全重试；全部nodeoffline。Reregistration也failinflight而非replay（`'Node re-registered; interrupted work is not replayed.'`）。正是gate要求的durableidentity不伪造成功；gatewaytest在同dir真实close/recreate验证。诚实协调与最初怀疑相反：deferral**没**令阈值不可满足；由**现产品边界**满足，donorpersistence仍deferred。报告只归limit低估，两方先前未命名存续receipt。此修正用于criteria，不改§3.5donorpersistence未exercised，而补它找的Missionreceipt。
2. **§2/3指向branch/本主机不可读的host-local材料。** Androidlog.runtime/mb001-android-build.log，donorsurvey.runtime/evidence/mission-book/MB-001/run-001/donor-survey/DONOR-SURVEY-REPORT.md 73KB及四read-only script。Runtime按rule15gitignored，本机没有MB-001目录，Mech交付四任务仅002/004/005/009。D1所称完整transitiveclosure证明runtimeleaf的survey**不可独立查验**。报告坦承未发布evidence/raw/mission-book/MB-001，大材料留本地；events证据多数空array或D路径。因此跨host仅branch+reports可验证；rule15第二句可辩护，但boundaryreason依未archive73KBdocument。
3. **Par强度报告本身不证明。** §1称原样抄classifierfuzz约93000cases、**0divergence**。Branch/repo无harness或fuzzstring文件，也不说所在，原声明不可核验。**本主机重建证据**（§6.9），从frozen donor复现0divergence，重建harness留evidencedir。
4. **§3说7event，branch实际9。** 报告早于两closingprocess写。MIGRATION_HEADinbox含TEST_PASS/RUNTIME_PASS/CI_RESULTPASS36566575068/MIGRATION_COMPLETE。报告预告HEAD为append前，因此仅提示读者，非记录矛盾。
5. **两globalcountrepair之一与描述不符。** D8称unavailable.length/catalog.lengthscope到modulerefs；tree adapters.test:31仍整manifestcatalog.length===6，registry.test:40仍全catalogAVAILABLElength===5。重要的idanchor/scoping确已落地：registry:13按qualifiedcapabilityId不按districtindex，:31–41直接检查infrastructurekindexclusion，故去districtorder依赖的**意图**满足。但第二repair描述夸大；按D8末句要求核查记录。
6. **未提及的hardening后果。** Utopia供requiredcapabilitiesdata、test本地重写，所以新consumptiontest对此循环。报告列Realconsumption未注明；runtime真实，是teststrength问题非迁移缺陷。

### 6.3 报告声明与独立确认状态

| 声明 | 独立审查后状态 |
|---|---|
| root60/60、rooms67/67、City229/229 | **确认**，§3.1先于§6测量 |
| promotion10、docsSYNCHRONIZED | **确认**，但只§6后，见§6.8 |
| 四module99，18/11/28/42 | **未重推**，与TEST_PASSbreakdown一致 |
| migrationAndroidgreen、APK10488900B | **被覆盖**：本主机从零构建§6.9，testDebugUnitTest/assembleDebugSUCCESS、41/41task、21/21unit、APK10320163B |
| fuzz约93000、0divergence | **独立复现**，不同scale、冻结源，50000patterns/350000pathverdict0divergence |
| donorclosure30file288509B、target30file | 合理但**未重推**；四DONOR声明11source/11ported，“30”是closure非source count，未给计数rule |
| Gateway字节同/等价 | **从代码独立确认**非test，§3.3 |
| consumption证明gateway与Core同意 | **半确认**，确调用acceptsWork但agreement循环 |
| migrationcomplete true、未merge、未finalize | **确认**missionfile/branch |
| ClusterB仅lifecycle、durable未迁 | **Donor层确认**，不代表Missionrestartgate无receipt，见6.2.1 |

### 6.4 无提示也一致之处

报告§6声明A/B/D无product consumer（D4）、root authority机制无active policy（D6）、B仅lifecycle（D1）、evidence/coordinationledger越界（D1）。独立从diff/DONOR/tests同结论。**A发现无须修订，报告这些声明无须修正**；指定优先攻击“三module无consumer”正确，也是任务最弱部分。

Provenance检查完全匹配：

- 四DONOR均同repositorycommit，module/cityPath/district/building；root/task/audit/fleet sourcePaths **3/1/3/4**匹配§1donorlist。
- Fleet **10PARITY/6PORT_ADAPTATION/1UTOPIA_EXTENSION/7DEFERRED**，与§3.4及§5“一compositionhelper”一致；root **0UTOPIA_EXTENSION**，符合“三module无”。
- 四DEFERRED共命名D1/§1每boundary，代码无矛盾：无node:sqlite、node:child_process、module entry可达fs/network。

### 6.5 分歧与开放判断

1. **消费窄，范围理解不同但结论同。** 报告§1/2gatewayrewiring，独立只确认node claimplacement由fleet拥有，无别接线。Gate还要求Web/Androidstatetruth一致；双方均没展示*client*状态，仅HTTPplacement，非UI。原AndroidUP-TO-DATE无inputchange只是“不受影响”，不证consumer。作为criteria**openjudgement**记录，报告诚实披露§6.5有利。
2. **30file与byte-identical副词。** D8/event对behavior用字节同、§1引用fuzz；独立读两predicate确认语义等价，未也无法确认任何字节同。文字强于可查，底层claim仍通过。
3. **CI_RESULTtargetRef是implementation8a7fe21非MIGRATION_HEAD。** Missionmigrationhead a71bf90，hosted36566973111final/36566575068implementation，与§0归因一致。读者对比会见两SHA，报告正确解释。
4. **D8repair描述**见6.2.5，是唯一细节tree不符，描述缺陷非code。

### 6.6 对A部分净影响

A无撤回，只有诚实逆向修正6.2.1。A未确认durableidentity，B起先似乎Missiongap；再读server对gate发现相反：现产品已实现/测试，receipt存在只不在迁移module。§3.5关于**donorpersistence**仍正确；变化是推论，放criteria非改A。

报告增加A仅从代码推知的**理由**：D3为何修gatewayfreeze正确非越界，D5为何foundationinfrastructure，D2mission-derivedincubationidentity，D7candidate-gate跨B/D。四项均与代码及MIGRATION_ONLY一致，D3独立§3.3已同解。

### 6.7 读后独立重跑gate（记录）

verify-promotion-history在a71bf90按localGit核验10record；pnpmcheck:docs的docs/evidence/data-records均PAIR_STATUS=SYNCHRONIZED。

### 6.8 公开Acoveragegap

A先跑三behavioralsuite，**未**在读前跑promotion/docs，两者§6.7通过。不改Acodefinding（两gate不影响且没fail），公开次序、不假装全gate先跑。Rule11需全部requiredCI/Missionchecks绿色且本host亲测。

### 6.9 协调后的验证工作

三项报告没做/不能查的本host工作，使repair/criteria依测量非对方叙述：

- **从冻结donor重建parity。** gh认证可clone，导出十MB-001donor file到.runtime/evidence/mission-book/MB-001/run-1/donor/baseline/，写两harness：

| Harness | 结果 |
|---|---|
| donor-parity-check.mjs，closed set/bound/threshold | **11/11**：fleet5000/10000/30000ms，五nodestate及仅FAILED/DISABLED/OFFLINE拒，六assignmentstate，§35六stateorder，candidateIdFor NULjoin sortedrequirementsha256truncated16，八ledgerbound2000/10/200/2000/50/2000/2000/200，outcome/source/§36check/failureclass/severity词汇，frozeninertmanifest **91protected path同顺序**，5escape/10hitreasonbudget及每donorcode |
| donor-grammar-differential.mjs，CODEOWNERS行为 | **50000/50000pattern、350000/350000path**与donor字面组regex一致，**8/8parse**；parseCodeownersLine、parseCodeownersPatterns、codeownersPatternToRegExp双方**同canonical token stream**，仅忽略两个已声明String(...)/??''widening |

此关闭§3.5第一点在唯一可differentialcluster：从donor复现0divergence，50000非93000，harness留档非未archive。本质仍**grammar**，另三cluster行为parity仍prose，但paritycheck现验证其closed set/bound。

- **Restartreceipt。** Gatewaytest真taskRUNNING20%时关闭gateway，同store真实restart：同taskID、FAILED**绝不COMPLETED**、progress20、restartreason、全部nodeoffline、stalenode拒新work、TASK_FAILED追加原history后非替换，见7.2。
- **Consumptiontest不再循环。** ExportREQUIRED_TASK_CAPABILITIES，对实际HTTPfixedexpectation，含只有**两capability都required**才passcase；mutation减为一使新testfail，旧会pass，见7.2。

第四项非repair、是host能力：**能**Androidbuild/unit但需JDK17。默认26与StudioJBR25.0.3令Gradle8.14.3embeddedKotlin在build scriptJavaVersion.parse抛IllegalArgumentException:25.0.3，配置前失败。用D:\GDPR-Refine\.tools\jdk-17.0.20.1+1从零成功，41/41执行非UP-TO-DATE，21/21unit，APK10320163B，logrun-1/android/。

## 6.10 本host修复版本932196e的gate

| Gate | Result |
|---|---|
| pnpmtest | **61/61**，新restart前60 |
| Citytestall | **229/229** |
| Rooms | **67/67** |
| Promotion | 932196e验证10record |
| Docs | 三类SYNCHRONIZED |
| AndroidtestDebugUnitTest/assembleDebug | **BUILD SUCCESSFUL**，41/41task，21/21unit |
| Hosted36583350117 gateway-web+android | **两job success** |

## 7. 验证criteria、维修与收尾

### 7.1 九项完成gate逐一判定

| # | Gate | 判定 | 证据 |
|---|---|---|---|
| 1 | 既有task/control真实消费Core并保持Web/Androidstatetruth | **Gateway满足；client仅论证未执行** | 每node claim调用fleetacceptsWork，§6.10真gateway完整nodeplacement、partial/offline拒且QUEUED。Web/Android同endpoint与CityControlv0envelope（contracts/city-control-v0/protocol.mjs），Android从零unitgreen。**未执行**Web/Androidclient驱live gateway，需device/emulator；rule14不造surface伪证，明确边界 |
| 2 | Root/Trust/authorityparity与protectedsurfaceregression全绿 | **MET** | §6.10green，§6.9两harness验证closed set、91path顺序、5/10budget、全CODEOWNERSgrammar |
| 3 | restart/recoverydurabletask/audit不伪success | **MET，有明确receipt** | server重启failinflight，originalmessage保留代码；全部offline、reregister不replay；真restarttest查ID/progress及failurejournal追加原history |
| 4 | 验证与迁移host不同 | **MET** | Alien/Mech，rule5 |
| 5 | 先独立发现再读report | **MET** | City03c9f75提交A后才读，§6首次 |
| 6 | 同missionbranchrepair，不扩boundary | **MET** | 两repair同branch；旧behaviorreceipt、旧test去循环、export旧constant；无新capability/policy/surface |
| 7 | requiredCI及missiongate全绿 | **截至当时MET** | 五local、Androidfresh、932196e hosted36583350117双success；rule16finalize后需**第二**final HEADgreen，7.4记录 |
| 8 | Verification Hostmerge目标main | **PENDING** | Finalizecommit/CI后执行，后文记mergeSHA |
| 9 | CityVerificationReport提交 | **IN PROGRESS** | 本报告；missionfilefields同Citycloseoutcommit更新 |

### 7.2 允许的维修

Rule10允许同branch必要secondrepair、extra test、evidencecompletion，不许扩功能。两repair均符合：

1. **消费test去循环**，gatewaytest/server：旧acceptsWork+本地copyexpected检测不了错误constant；现在export旧constant并以**fixedexpectedHTTP**断言：partial不claim且QUEUED，full被放到同work，busy不给secondtask，silent拒且work QUEUED/unassigned。Coreagreement用exportpolicy防silentdrift；每断言**新增或加强**，无删/skip/relax。Mutation单capability新fail旧pass证有效。
2. **Restartreceipt**新test“an interrupted task is never falsified as success across a gateway restart”，只执行既有behavior、services无新增代码；正是missiontask lifecycle+restart receipt要求。

生产behavior仅export已有constant不改，其余旧新tests均pass，suite60→61。

### 7.3 本主机失败及处理

按rule8/15记录真实失败非干净叙事：

| 失败 | 处理 |
|---|---|
| JDK26/JBR25.0.3使Gradle8.14.3Kotlin编译script时IllegalArgumentException25.0.3，配置前Androidfail | 找第三JDK17 D:\GDPR-Refine\.tools\jdk-17.0.20.1+1，从零成功；host限制非branchdefect |
| 对方Androidlog/73KBsurvey本机无 | Rule15host-local，独立clone、写parityharness、重build |
| 写parityharness三次自致失败，donorTSextraction吃return annotation、CODEOWNERScorpus错expected | 修harness不weakening；donorregex用自身literal，按donorrule**纠正**expected：无ownerpattern不grant |
| Adaptertest:31整manifestlength6仍在而D8说scoped | 6.2.5记录描述差；不修既有其他suite，前行有module IDanchor，repair无关assert超7.2允许；另变更处理 |

无gate跳过、test弱化、未绿标绿。

### 7.4 Rule16收尾

顺序：branch932196e/hosted36583350117实现green；dogfoodappendCI_RESULTPASS、VERIFICATION_COMPLETEPASS；mission:finalize生成verifiedepisode并移current inbox；data-onlycloseoutcommit；final HEAD再requiredCI必须green；再merge main，后文SHA及episodepath/digest。

### 7.5 最终记录

```text
MISSION = MB-001
ROLE = VERIFICATION
HOST = Mech
CLAIM_COMMIT = 835c7db
INDEPENDENT_REVIEW_COMMIT = 03c9f75
RECONCILIATION_COMMIT = 17b6497
REPAIR_SHA = 932196e4bcd0
REPAIR_CI = 36583350117 PASS (gateway-web + android)
VERIFICATION_EVENTS_SHA = 8349b61  (TEST_PASS + CI_RESULT)
VERIFICATION_EVENTS_CI = 36584692434 PASS (gateway-web + android)
VERIFICATION_COMPLETE_EVENT_SHA = a8e996373cff0e0256fab72262e0ad9fcc315123
EPISODE_SHA = b2fb73b4cb1ae7bd92733f6873a2e681fae45aa1
EPISODE_FILE = data-records/evolution/episodes/mission-book/MB-001/episode.json
EPISODE_ID = MB-001:16558c84c4d1547e
EPISODE_SHA256 = 4f40ae9c0b09fc624de7927e1a66b886efaa1dfc2fa760dab0e2e9c66bd223f7
EPISODE_STATUS = VERIFIED
FINAL_BRANCH_CI = 36585164507 PASS (gateway-web + android) at b2fb73b
MERGED_MAIN_SHA = d81a567268d7cab26b84eaf798fc7a25c8033b25
MERGE_CI = 36585590593
CITY_REPORT = mission-book/reports/MB-001/VERIFICATION_REPORT.md
```

Episode由九verification event生成，最后VERIFICATION_COMPLETEPASS在finalverificationCI_RESULTPASS后append，符合finalizer；inbox移除、data-onlyb2fb73bcommit。FinalHEADb2fb73b再CI36585164507双green后merge，rule16。Maind81a567为c7ef3cd上的mergecommit（base未动无冲突）；五gate在mergedtree重跑全pass，mergeCI36585590593。

### 7.6 证据指针

主机本地gitignored：

- .runtime/evidence/mission-book/MB-001/run-1/donor/baseline/：Boss8df428e导出十file；donor/Codex-Boss/clone。
- run-1/donor-parity-check.mjs+.log，11/11。
- run-1/donor-grammar-differential.mjs+.log，50000pattern/350000verdict/8parse，0divergence。
- run-1/android/：JDK25/26失败、JDK17成功buildlog、APK、JUnitXML。

跨hostbranch/CI：mission/MB-001-core-os b2fb73b已merge，diff/两repair/episode；hosted36583350117、36584692434、36585164507branch与36585590593main；data-records/evolution/episodes/mission-book/MB-001/episode.json；本报告提交Digital-Citymain。

### 7.7 本验证**没有**建立的内容

使acceptance依真实boundary：

1. **Client未驱live gateway。** 消费gate在gateway满足、共享client contract，但此host没Web/Android连接live gateway，无emulator/devicepairing，rule14不造surface伪证。
2. **Donorparity验证closed set/bound/CODEOWNERSgrammar**对冻结源；**未**验证task lifecycle/auditledger/余fleet的behavior，这些仍DONORvector（§3.5）。
3. **三module仍无product consumer**（D4）。MIGRATION_ONLY允许、报告声明，但若期待四cluster全production use，会不同意complete。
4. **Adaptertest:31整manifestcount仍在**（6.2.5），main其他suite仍无通用census-relativefix；只在本任务diff触及处存在。

语言配对 / Language pair: [原文 / Source](../VERIFICATION_REPORT.md)
