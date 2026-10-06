# 工程书 — Utopia 助理层之前的终端收口

[English historical source / 英文历史原稿](../ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)

完整历史阅读译文，不重新激活工程书，不产生新权威字段。 / Complete historical reading translation; no activation or new authoritative fields.

> 日期2026-09-30；控制仓库zhiheng-zhang-Mera/Digital-City；实现仓库zhiheng-zhang-Mera/Utopia；Owner指定阶段：迁移收口→统一终端地基。约束裁决：[response-9-30 R12](../../completed-2026-10-01/response-9-30.md#r12--migration-only-正式结束进入-pre-assistant-product-closeout)。
> **本工作书有意在个性化助理/persona之前停止。** 本文件为inactive历史阅读译本，不重新激活原工程书或任务。

## 0. 最终目标

迁移已完成，本书只有两目标：将迁移时代冻结为不可变可审计基线；将已接受Utopia能力形成一致面向用户终端骨架。仅包含：

```text
T0  Migration closeout / freeze
T1  Rooms integrated into the normal Utopia shell
T2  Unified Action facade
T3  Deterministic Ask / Do entry
T4  Independent product acceptance + stop line
```

T0迁移收口/冻结，T1十Rooms进入正常壳，T2统一Action facade，T3确定性Ask/Do，T4独立产品验收及停止线。T4通过后停止。

最终状态：

```text
PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
```

这不是“万能终端完成”，不授权继续助理、connector、memory、proactive-agent、domain、embodiment。

## 1. 有约束力的基线真值

创建时以下已接受，不得为造工作重开。

### Digital-City / Mission Book

- MB001..009实现迁移和验证完成。
- MB010..012为NO_VALUE/SKIPPED_NOT_REQUIRED，R11下Alien独立复验。
- 每启用MB001..012 verification_complete=true。
- 三provenance分支按R11在**不含实现代码**情况下入main，原remote branches保留。
- 不得静默重开Mission；worker不得发明新donor迁移Mission。

### Utopia

R11 provenance收口后基线：

```text
UTOPIA_BASELINE_MAIN = d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
R11_MERGED_MAIN_CI   = 36678805229 PASS
UNMERGED_BRANCHES    = 0 at the recorded R11 audit
```

已接受地基：Web/Android控制面，QR/mDNS/BLE/manual pairing，node state+telemetry，Task/Activity，Capability BridgeV0.3及hardening，十RoomPackV1，restart/recovery真值，typed failures，qualified identity，有界invocation history。

要解决产品碎片化，不是donor不完整。

## 2. 范围锁

### 范围内

仅授权以下新产品工作：

1. 正常Host生命周期启动已有RoomHub。
2. Web正常壳展示已有十Rooms。
3. Android至少从受支持已认证产品路径观察Room可用性。
4. 一个规范用户Action facade适配已有backend真值。
5. Web/Android同Action真值。
6. 一个Ask/Do确定性路由已有能力。
7. 真实可见副作用确认、歧义、拒绝、失败、provenance。
8. 独立真实设备/主机验收。

### 范围外：硬停止

禁止个性化助理身份/persona/character/关系模型/助理policy；助理或私有长期memory；自主主动个人agent；LLMintentrouter；Boss/Hnsconnector；Digital-Me、Health/Quant；新Room11以上；仅为路由看似完整而发明domain能力；任意shell；扩展deferred完整desktop/browserComputerUse runtime；voice/avatar/wearable/AR/VR；cloud/publicInternet部署；iOS/HarmonyOS/Linuxclient；3DCity；GeneralLogicEngine；ThemeBuilder扩展；Customs/RuntimeCompliance重提取。

必要验收看似需要这些时，记录限制并停止该路径，不扩scope。

## 3. 工作模型

这是产品集成，非donor迁移。

```text
MODE                    = PRE_ASSISTANT_PRODUCT_CLOSEOUT
IMPLEMENTATION_REPO     = Utopia
CONTROL_REPO            = Digital-City/mission-book
NEW_DONOR_MIGRATION     = FORBIDDEN
MISSION_REOPEN          = OWNER_ONLY
NEW_ROOM                = FORBIDDEN
LLM_ROUTER              = FORBIDDEN
ASSISTANT_LAYER         = FORBIDDEN
BOSS_HNS_CONNECTORS     = DEFERRED
```

### 分支

实际最新Utopia main上建一个有界产品分支：

```text
product/upt-pre-assistant-closeout
```

创建前pull/fetch并记录exactmainSHA。main较上基线更新则用更新main，不向后reset。

### 主机角色

优先两实际主机：Implementation做T0–T3；IndependentVerification从已push分支独立检查并跑T4后merge。两机可用时应不同真实hostid；hostedCI不算host。

不是旧迁移host分离契约；第二host不可用不授权伪造证据。仅一真实host则不merge，诚实报告限制，除非Owner明确豁免。

# 4. T0 — 迁移收口与阶段冻结

T0无产品feature。

## T0.1 重证收口基线

T1前：读最新README/MISSION_INDEX/response930；按现frontmatter核MB001..012完成；无实现Mission分支aheadmain；R11三provenance为main祖先；MB010..012 merged_main_sha=null保持；跑本机实际可行当前必需CI等价gate；记录实际当前main hostedCI。

不为再造数字重跑donor assessments。

## T0.2 冻结记录

建立精简Utopia收口记录：

```text
docs/<lang>/MIGRATION_PHASE_CLOSEOUT.md
```

中英按既有规则配对。记录当前mainSHA、全部MB关闭、MB010..012负结果provenance非实现merge、当前CI、分支审计、已知非阻塞backlog、明确转产品集成。现repo release/tag惯例支持才可optional tag；无tag不阻T1。

## T0退出门

```text
MIGRATION_QUEUE_CLOSED = true
REOPENED_MISSIONS      = 0
UNMERGED_IMPLEMENTATION_MISSION_BRANCHES = 0
BASELINE_TRUTH_RECORDED = true
```

然后T1。

# 5. T1 — RoomPack接正常产品

十已接受Rooms不再独立侧产品。

## T1.1 Host生命周期

正常受支持startup同时起已有Hub。保持loopback-only；不为Android方便rawport暴露LAN；startup失败显degraded/unavailable不假ready；gracefulstop/restart不留duplicate。

## T1.2 Web集成

正常UI展示：

```text
Home
Tools / Rooms
Devices
Activity
Advanced
  Services
  Tasks
```

Home十Rooms；Tools/Rooms进已有体验；Services/Tasks仍可达但非首要心智；不将Roomdata改CityTask语义。

## T1.3 Android边界

从已认证路径显示availability/status，不直接暴露loopbackHub。T1不要求Android完整直接执行，除非已认证bridge自然提供且无新架构。

## T1必查

证明正常startup预期gateway/runtime/Hub、重复启动受控、Hubloopback、Home十房间、Tools可进、unavailable真实、Android可见无rawLAN、既有gateway/capability/rooms测试绿、规定双语docs同步。

## T1退出门

```text
ROOMS_ATTACHED_TO_NORMAL_SHELL = true
ROOM_COUNT                     = 10
NEW_ROOM_CREATED               = false
ROOM_HUB_LOOPBACK_PRESERVED    = true
```

# 6. T2 — 统一Action facade

统一用户progress/result/history，保留backend ownership。

## T2.1 规范用户模型

引入等价Action：

```text
Action
├─ actionId
├─ requestedIntent
├─ route
│  ├─ ROOM
│  ├─ CAPABILITY
│  └─ CITY_TASK
├─ backendRef
├─ target
├─ status
├─ progress
├─ resultRef
├─ error
├─ provenance
└─ timestamps
```

不加Boss/Hns routes。可遵循repo命名样式，而非完全同字段名，但保留语义。

## T2.2 Adapter规则

Action是适配facade，从不替代truth。不得Checklist转CityTask、Roomstate转capabilityinvocation、invocationid转fakeengineeringtaskid、backenderror转genericsuccess。每Action指向真实backend。

## T2.3 状态语义

至少支持真实等价：

```text
QUEUED
RUNNING
WAITING_CONFIRMATION
SUCCEEDED
FAILED
REFUSED
CANCELLED
UNAVAILABLE
```

不能从stalecache发明SUCCEEDED。

## T2.4 共享真值

Web/Android同canonicalstate。一个client建Action另一同id可识别；refresh/reconnect不第二执行；backendRef/resultRef/provenance稳定；offline/cache清楚标。无需完整T6式workspacehandoff。

## T2退出门

```text
ACTION_FACADE_CANONICAL   = true
WEB_ANDROID_ACTION_PARITY = true
BACKEND_TRUTH_PRESERVED   = true
DUPLICATE_EXECUTION_ON_REFRESH = false
```

# 7. T3 — 确定性Ask/Do

用户表达意图前不用先选Tasks/Services/Rooms。本书禁LLMrouter。

## T3.1 确定性已有routes

至少映射已有能力：

```text
read/import a document
  -> Document Intake

query recently ingested knowledge
  -> Knowledge Query

add/check a checklist item
  -> Checklist Room

save/open a bookmark
  -> Bookmarks Room

hash a file/text
  -> Hash Room

review evidence
  -> Evidence Review

run an already-supported safe node task
  -> City Task / Node
```

原块完整列文档读取导入→DocumentIntake、最近knowledge→KnowledgeQuery、checklist增查、bookmark保存打开、file/texthash、EvidenceReview、已支持safeNodeTask。措辞/locale可有界pattern/command+显式UI，不冒充openNLU。

## T3.2 歧义

多target合理时列2–3具体候选，说明做什么，等选择，不静默选破坏性/高副作用。

## T3.3 副作用确认

有意义外部副作用先到可见confirmation。拒绝保留REFUSED，不FAILED/SUCCEEDED。

## T3.4 fallback

无rule则capability/manualtarget选择，不LLM、不新capability、不任意shell。

## T3.5 client

两端同概念Ask/Do及Actionresult/history。平台可不同layout。

## T3退出门

```text
ASK_DO_WEB                 = true
ASK_DO_ANDROID             = true
DETERMINISTIC_ROUTER_ONLY  = true
LLM_ROUTER_PRESENT         = false
SIDE_EFFECT_CONFIRMATION   = true
AMBIGUITY_VISIBLE          = true
```

# 8. T4 — 独立验收

Verification先读当前main、branchdiff、既有fastpath、本书；应在读implementationreport前记录自己的finding。

## 必需真实验收

可用时一受支持Windows加一真实Android。

### A startup

一次支持Hoststart起含Hub预期services；health反真实readiness；重复受控。

### B Rooms

Home十房间；打开使用一房；Hubloopback；Android受支持认证availability。

### C Action

至少Room、Capability、CityTask/Node（node缺则诚实UNAVAILABLE）、拒绝/失败、无重复refresh/reconnect。每例稳定单id、正确backendref、真实finalstatus、result/error可见、provenance保留。

### D Ask/Do

至少DocumentIntake、KnowledgeQuery、Checklist或Bookmark、Hash、EvidenceReview、选择歧义、副作用确认、unmatchedmanualfallback。

### E 范围审计

明确证无assistant/persona、LLMrouter、Boss/Hns、新Room、任意shell、新domain。

## CI

merge前相关local绿、branchrequiredhosted绿、独立报告完成、finalHEADrequired绿；merge后mainrequired绿。不接受“CI大概可以”。

# 9. 报告与证据

## Digital-City

建立：

```text
mission-book/reports/UPT-PRE-ASSISTANT/
├─ IMPLEMENTATION_REPORT.md
└─ VERIFICATION_REPORT.md
```

这是产品集成报告，不fakeMB迁移报告。

## Utopia

沿repo证据惯例；raw/transient留ignoredruntime，仅有界非敏感acceptance提交。不造fakeMissionepisode。

# 10. Merge及停止条件

T0–T4全部pass后，独立verifiermerge产品分支main；mergedmainCIpass；City记录exactmergeSHA/run；MissionBookREADME/index记阶段结果。然后写：

```text
FINAL_STATUS = PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
```

并停止。下一阶段须**新Owner指令**。不自动Boss/Hns、PersonalWorkspace、更全跨端handoff、resident/tray、assistant/persona、后续domain；这些单独决策。

# 11. 失败处理

T任阶段不pass：保留branch/evidence；记exactfailedgate；不降要求求merge；安全则继续同授权阶段无关工作；不扩架构解blocker；FINAL_STATUS为最准确partial。

允许terminalpartial：

```text
BLOCKED_T0_BASELINE
BLOCKED_T1_ROOMS_INTEGRATION
BLOCKED_T2_ACTION_FACADE
BLOCKED_T3_ASK_DO
BLOCKED_T4_INDEPENDENT_ACCEPTANCE
```

blocker优于假完成。

# 12. 执行者精简清单

```text
[ ] Read latest Digital-City mission-book control files
[ ] Read latest Utopia main and fast-path doc
[ ] T0 prove MB-001..012 closed and branch truth clean
[ ] Record migration-phase closeout in paired Utopia docs
[ ] Create product/upt-pre-assistant-closeout from latest main
[ ] T1 integrate existing Room Hub + 10 Rooms into normal shell
[ ] T1 preserve loopback isolation and truthful availability
[ ] T2 implement canonical Action facade
[ ] T2 prove Web/Android Action parity and no duplicate execution
[ ] T3 implement deterministic Ask / Do
[ ] T3 prove ambiguity + side-effect confirmation + fallback
[ ] Prove no assistant/persona/LLM-router/Boss/Hns/new-Room scope creep
[ ] Implementation report
[ ] Independent verification on second real host when available
[ ] Final branch CI green
[ ] Merge
[ ] Merged-main CI green
[ ] Verification report + exact SHA/CI update in Mission Book
[ ] FINAL_STATUS = PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
[ ] STOP
```

原清单逐项完整保留：读双方最新控制/main/fastpath；T0关闭与branchtruth、双语closeout、最新main建产品branch；T1已有Hub十Rooms/loopback/真实可用；T2canonical及两端一致无重复；T3确定路由/歧义/确认/fallback；无scopecreep；实施报告；可用时第二真实host验证；finalbranchCI；merge；mainCI；验证报告及exactSHA/CI更新；最终标记；**STOP**。
