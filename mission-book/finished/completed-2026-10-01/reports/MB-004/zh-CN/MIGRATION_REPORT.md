# MB-004 — 项目工头Engineering并集纯迁移 — 迁移报告

[English authoritative source / 英文权威原稿](../MIGRATION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

> MIGRATION_COMPLETE，仅迁移未合main。Mech领取2026-09-29T13:12:00Z，City945092ff14bfb9b0a3323b023ec3ad5b4c5b139c已推无冲突。分支mission/MB-004-project-foreman，基线utopia c7ef3cd1c6be0155332d03afc3607dfdbf49c205，实现8a0d5d6af7fd8ac007474e8df39c802b069ab785，最终70806ad1277904c214f29f5da52cb5c7db1d90da。CI36577933078 V0.2checks在faf6f7a011ff37ea427c592773bf837411964d7c，gateway-web／android成功。

## 1. 供体／冻结基线

DS-Hns eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b主要实现规划／发现顺序、失败分类、恢复／检查点、隔离、验证、结果门；Codex-Boss8df428eaa437a409368401e95194e40266b83080并集补充§33每类预算恢复阶梯与CI修复解析／分类／规划循环。是并集非选胜者，3.4记录并列方式。

## 2. 落地边界

目标city/02-engineering/01-project-foreman/project-foreman，owner02/01 Engineering Task Orchestrator。与MB002／005同，Mission指定建筑，manifest要求三层，故建筑内同名模块。依赖MB003WorkerGateway，其City migration_complete在领取前true。

### 2.1 25模块来源账本

Hns app/engineering/**全部22加Boss src/shared三：

| 供体 | 目标 |
|---|---|
|plan.cjs|plan.mjs|
|discovery.cjs|discovery.mjs|
|adapters/index.cjs|adapters.mjs|
|failure.cjs|failure.mjs|
|episode.cjs|episode.mjs|
|autonomy.cjs|autonomy.mjs|
|checkpoint.cjs|checkpoint.mjs|
|recovery-schema.cjs|recovery-schema.mjs|
|recovery-store.cjs|recovery-store.mjs|
|locking.cjs|locking.mjs|
|mutation.cjs|mutation.mjs|
|repository.cjs|repository.mjs|
|process-identity.cjs|process-identity.mjs|
|process.cjs|process.mjs|
|context.cjs|context.mjs|
|scheduler.cjs|scheduler.mjs|
|git.cjs|git.mjs|
|cross-volume-cleanup.cjs|cross-volume-cleanup.mjs|
|verifier.cjs|verifier.mjs|
|result.cjs|result.mjs|
|supervisor.cjs|supervisor.mjs|
|index.cjs|index.mjs|
|Boss src/shared/recovery.ts|failure-recovery.mjs|
|Boss src/shared/ci-repair.ts|ci-repair.mjs|
|Boss src/shared/correction.ts|correction.mjs|

逐symbol、adapt、分类在DONOR.json。

## 3. 保留／未迁

### 3.1 保留

有界plan四不变量：修复尝试前reproduce证明；maxSteps有界、丢步骤入reasons；cursor仅每次向前一步；封闭步骤词汇。intent模板顺序即正确性；16类失败、类动作策略／有序模式；失败签名剥时间／路径／hash／数字使同失败同身份；拒盲retry／重复假设tracker；episode阶段转换；autonomy8continuation／400steps；checkpoint／verifyResume重查拒／重启／恢复、原子rename、保留界限／全腐败容忍；recovery索引拒序列回退／重复，有界自动尝试；活owner不可窃workspace单写锁；baseline文件所有权不覆盖用户未提交；plan摘要／executor兼容重放门；三验证level／freshness、kill／timeout／signal永不成功；具名result拒绝；adapter检测分数／特异顺序；process监督类别／readiness／四timeout；schedulerdeadline／backoff；context环；gitpolicy／禁命令；跨卷scratch归属／清理。

### 3.2 未迁

| 未迁 | 原因 |
|---|---|
|engineering-host.cjs|Electron shell非runtime。|
|computer-use/{processes,errors}.cjs|领域外，supervisor保注入registry，fallback最小本地按供体testhelper精确所需面。|
|sub-worker/**的worktree、FileOwnershipRegistry、filterConflicts、mergeFileChanges、权限|MB003WorkerGateway隔离；自身mutation baseline／root与locking单写已移植。|
|Boss execution-planner.ts|依赖无producer的RequirementsGraph，迁移会发明行为，延后不伪造，index不导出。|
|Boss acceptance*.ts、final-acceptance、review、verification、git-checkpoint、fleet、repo-world-model|依Bosshoststore／本树缺requirements/evidence契约，四THEME面属娱乐，延后有理由。|
|guardian、root-authority/*、tenx/*、node-capabilities、capability-graph|明确禁City全局权限／优先级／能力节点真值。|

### 3.3 遵守禁止列表

无新调度算法／worker类型／供体未实现autonomy／全局authority／CapabilityNode真值／非Engineering逻辑，常量、阈值、预算、拒绝全供体。

### 3.4 并集仍并集

failure.mjs为Hns16小写类别、动作策略、修复记忆；failure-recovery为Boss13大写、证据阶梯／每类预算／Owner升级／HNSfallback。互不import／reexport／翻译，头注明重合差异workspace／WORKSPACE、TEST对应unit+integration、BUILD对应syntax+type+compile。ci-repair经lazy命名接缝消费Boss阶梯，不拥有policy。

## 4. 接口契约

index唯一host接缝59导出。run(input)单调用episode，建立workspace／发现／baseline／有界plan／执行／鲜证据验证／报告；createEngineeringSupervisor／runEpisode循环构造。词汇EPISODE_PHASES／TRANSITIONS、FAILURE_CLASSES、CLASS_POLICY、VERIFICATION_LEVELS、PLAN_KINDS、WAKE_REASONS、OPERATIONS、CONFIDENCE、PROCESS_CLASS、READINESS、MUTATION_RESULTS、STEP_OUTCOMES、EPISODE_DEFAULTS。只读classify、deadlineState、defaultAdapters、verifyWorkspace、gitState、fingerprint、diffFingerprint、detectProject、discoverCommands、discover、computePlanDigest、validateRecoveryDescriptor、verifyResume、truncateOutput、summarizeTestOutput、collectLeaks、isTerminalPhase。构造createCheckpointStore／RecoveryStore／ResultValidator／MutationLog／ProcessSupervisor／GitController／EpisodeContext／Verifier／CrossVolumeTempRegistry／EngineeringAutonomy／RepairTracker。BossclassifyFailure、planRecovery、advanceRecovery、parseCiFailure、classifyCiFailure、planCiRepair、ciVerdict、loopOutcome、applyCorrections。

## 5. 现有消费，无UI

无新UI／route／dashboard／surface，server未动。host构造supervisor调run；6.2自身supervisor套件实际磁盘git仓库，init／真commit／dirty／fingerprint真git，经discovery／plan／mutation／checkpoint／lock／result端到端。

## 6. 测试

### 6.1 门

city586通过0失败1跳；donor146/146；supervisor23/23；root58；rooms67；docs同步；promotion10；CI36577933078双jobPASS。一localskip为主机symlink路径安全。

### 6.2 供体原测试

不依liveharness可运行套件复制到tests/donor或donor-boss，只改import，正文／标题／断言字节不变，最强机械证据：plan32、checkpoint26、verifier23/24、context13、crossvolume8、recovery-schema7、processidentity4、scenarios4、journal3、autonomy2、wiringlock1（唯一locking覆盖）、process-real1（verifier进程例）；Boss recovery-model22经node:test shim保断言。每排除DONOR具名，常因为顶层require拉刻意不迁host／fixture。

### 6.3 真实失败修复

- adapters缺口：discovery懒加载不存在adapters降空operations，所有带命令步骤丢失。移植后临时Node fixture端到端detect node、commands install/build/test/focusedTest、repair plan全六fix、reasons[]。400随机fixture×9adapter×detect/commands/artifacts=10800差分0偏差。
- 四供体测试import少一层ERR_MODULE_NOT_FOUND，反馈作者改后过。
- 清点脆弱根测试第三次破，8.2。

### 6.4 迁移owner裁决

subagent测试期待拒绝episode report.result FAILED非供体。supervisor.cjs766直传validator，result.cjs165仅COMPLETED／REFUSED；scenario FAILED是synthetic autonomy输入非报告断言。裁定result faithful，不为测试弯曲，改预期。验证者确认单行赋值。

## 7. 数据／错误／恢复

错误全供体coded及字符串：PLAN_INVALID／PLAN_STEP_INVALID／CURSOR_INVALID／CURSOR_UNVERIFIED；CHECKPOINT_MISSING／OUTSIDE_ROOT／SYMLINK／SEQUENCE_REGRESSION／SEQUENCE_CONFLICT、RECOVERY_ATTEMPTS_EXHAUSTED、CLAIM_ALREADY_OWNED／OWNER_UNKNOWN／NOT_OWNED、RECOVERY_INDEX_CORRUPT；lock held／stale／unavailable／lost，九result拒绝。恢复重查：HEAD漂移重启、workspace移动拒、世界不变恢复；自动第四尝试阻断，cursor／verified／skipped／plan摘要checkpoint，不能略验。活owner锁不窃、用户起始未提交文件不覆盖，测试固定。无秘密／凭据／无界dump，spawn仅供体git／powershell.exe身份probe。

## 8. 限制

### 8.1 唯一有意供体差异

Boss planRecovery未知类别RECOVERY_RULES[cls].inapplicable无保护TypeError，现具名error指类别，供体已知类不变。全迁移唯一有意行为变，DONOR明确供验证者知。

### 8.2 main潜伏清点第三修

两capability测试固定district[0]/[2]、length6、AVAILABLE5，新建筑三失败，同MB002／005。现at(-1)、baselinecounts、ID后缀。根因Owner关注：三独立c7ef3cd分支同修从未main，先合携入其余重复／冲突，建议独立main修。

### 8.3 清点不能抓未声明

manifest只查已声明模块，目录无entry不报，本模块手注册前隐形，现注册，建议独立修。

### 8.4 并集延后

Requirements DAG／acceptancehub延后非假，设计上部分并集：Bossfailure／CI进入，graph半未入，index如实。验证者测边界非默补。

### 8.5 两供体bug刻意重现

具名测试、Owner行为决定：supervisor boundedretry不可达，decideAfterFailure先recordAttempt后wouldBeBlind匹配刚记，首blind，retry-bounded始终block，30/60/120/300/600秒backoff不经supervisor达；CANCELLED提前return不lock.release，workspace锁留最长30min DEFAULT_STALE_AFTER_MS。DONOR另含六bug。

### 8.6 checkpoint默认repo root

无root／dir时createCheckpointStore为repo root，本地套件生成city/02-engineering/runtime/engineering/，已移除不提交。自身suite明确temporarycheckpointRoot，仅默认caller出现，DONOR记host有意覆盖。

### 8.7 Android／第二主机

本机仅JDK25／26，CI21无法build，门要第二主机经MB003真Engineeringjob，均验证者工作，Android源未动。

## 9. 证据

```text
.runtime/evidence/mission-book/MB-004/
├─ donor-hns/app/engineering/**        frozen donor copy used by the differential tests
└─ run-1/tests/
   ├─ city-tests.txt                   586 pass / 0 fail / 1 skipped
   ├─ donor-parity.txt                 146 / 146
   └─ supervisor-e2e.txt               23 / 23, including the real-git lifecycle episode
```

原树含冻结Hns工程、city586/0/1、donor146、supervisor23含真实git。分支结构化：

```text
data-records/evolution/inbox/mission-book/MB-004/events.jsonl
```

全部MIGRATION／Mech：MISSION_CLAIMED、ATTEMPT_STARTED两次、CHANGE_APPLIED、REPAIR_APPLIED、TEST_PASS、CI_RESULT、MIGRATION_COMPLETE。

## 10. HEAD／CI

分支mission/MB-004-project-foreman，实现8a0d5d6af7fd8ac007474e8df39c802b069ab785，最终70806ad1277904c214f29f5da52cb5c7db1d90da；CI36577933078在faf6f7a011ff37ea427c592773bf837411964d7c，双job成功。未合main，验证者操作。

### 10.1 两CI专属失败

首36576859825gateway两本地过测试失败，均环境非port：cross-volume suite模块层helper单卷windows-latest抛，导致整文件load失败。现解析不抛、每test具名skip，真实说明不能单卷跨卷，正文断言不动，两卷仍8/8。supervisor deadlinefloor对中途提交版本失败，现含6.4裁决版本过。单卷验证者应看skip原因再判断覆盖。

### 10.2 文档历史

本报告写后因git reset --hard追并发City提交（Alien领取MB007）丢失，从事件／commit消息／证据重写。保留来源说明及曾MB002同错，供验证者知。
