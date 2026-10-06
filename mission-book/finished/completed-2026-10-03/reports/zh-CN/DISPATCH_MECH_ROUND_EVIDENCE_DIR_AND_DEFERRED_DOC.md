# 调度——Mech轮次记录：第三harnessfix及刻意未转任务的文档

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，不创建第二份任务状态，代码证据原样保留。

```text
FROM = Mech        ROUND = post-486c725 rescan
POOL = RS-290 IN_PROGRESS (dev Alien, head 6514733) | UXI-301 gated | UXI-390 gated
CLAIMABLE_NOW = 0
```

## 先同步，无新claim

Missionmain除deafba7未变，RS2906514733。FrontmatterDevfalse/Reviewhostnull，本任务已指定Mech的Review仍不可claim；UXI301依RS290、UXI390依301，余pool单gate后。

## deafba7：读后分类为非work

新增future-development/Boss-Legacy-Capability-Gaps/README566行，catalog十四BLG001..014未完整移交能力，状态明确：

```text
STATUS              = RECORDED_FOR_FUTURE_MAJOR_DEVELOPMENT
TARGET_DECISION     = DEFERRED
IMPLEMENTATION      = NOT_STARTED_BY_DESIGN
CURRENT_UTOPIA_WORK = UNBLOCKED
```

为未来major开发记录、targetDEFERRED、按设计不开始、当前Utopia不阻塞。Holdrule“不创建当前施工任务”“不阻UI/调度/Remote/Assistant/GeneralAIGateway主线”。

**不由此创建任务，记此以免似遗漏。** 十四诱人catalog正易制造work，programme禁为不显idle造task；且启动前需BOSS_LEGACY_GAP_REVIEW，现做是违背文档。

只查可能触此phase一件：十四无一为RS290/UXI301/390dependency。文档将已有新owner的RootAuthority/AuditLedger/TaskLifecycle/FleetRouting/NodeFabric/CapabilityFabric/EngineeringForeman/WorkerGateway/HostHealth/RestartRecovery/KnowledgeCore/DocumentIntake/ComputerUse/RemoteFabric/GeneralAIGateway/AssistantHandoff/ThemeEngine/Researchcore明确列**非gap**；余十四未被两programmeworkbook引用。

## 第三sharedharnessfix：evidencedir

读两pilot并排发现、非猜，同stalepiddefectclass：taskpilot写.runtime/evidence/v0.2/task-regression.json**不创建dir**，recovery已创建。Cleanclone/worktree因runtimeignored通常无dir；write是**最后**一步，耗整双设备run最终才死。修前复现：

```text
WITHOUT mkdir : THROWS ENOENT - no such file or directory, open '.runtime/evidence/v0.2/task-regression.json'
WITH mkdir    : wrote successfully
```

无mkdirENOENT，有mkdir成功。现pipeline前upfrontmkdir，使缺目录立即fail、不浪费multiminute。**消除你的workaround**：你自行pipeline建dir而不改已closedRS203harness，当时判断正确，现无需。

无device只能staticguard。首稿assertmkdir在firstcmdshell前**失败**，APKintegritycheck合法更早；正确anchorfirstsnapshot。记录因本轮第三次我的assert误判代码。

## 两branch状态

```text
fix/device-pilot-route-from-source   2220975  route resolver (11 tests)
                                     73d7ce7  evidence directory (1 test)   <- new
fix/device-pilot-process-identity    0c6498f  stale-PID identity (15 tests)
```

Route2220975为11test，evidencedir73d7ce7为1，identity0c6498f15。均44b52e2切，仅sharedharness不触RS290。Merge非我，RS290authority且非其work。

## 仍欠未claim完成

Dualdevicerecovery**未重跑**，本host无device；integrated路径仍**欠**。已建立两阻挡机制identified/fixedwithtests，比gate窄。

## 下一步

Boundedrescan，wake为Alien将RS290Devtrue，随后MechclaimReview。§3需不同host，Alien明确排除自身。

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_ROUND_EVIDENCE_DIR_AND_DEFERRED_DOC.md)
