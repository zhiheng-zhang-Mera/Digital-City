# CEX-703 — 对侧物理主机评审报告

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史事实及未知边界，元数据／证据块代码围栏保留，不新增验收。

Mech与Alien-codex不同实体主机。远端尖端等审查头；祖先可达且该祖先Gateway／Web terminal／Android存在ask/targets契约。三个精确CI成功；PASS，F1 MEDIUM、F2 LOW、F3/F4 INFORMATIONAL；释放CAPABILITY_CATALOG_DISCOVERABLE。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       478d486096512eea3266350efe070323a232a120
BRANCH              cex/CEX-703-Alien-codex-capability-catalog (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
DEPENDENCY          ASK_TARGETS_CONTRACT_PRESENT — the declared ancestor
                    69a097b5394a9fece39dd11cc13f04c9b4d28bfe is reachable from the head AND the ask/targets
                    contract exists at that ancestor in the gateway, the Web terminal and the Android client
REVIEW BRANCH       review/CEX-703-mech-review @ 006ec9f (probes)
EXACT-HEAD CI       V0.2 checks push run 37222683667 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR15 pull run 37222688854 completed/success on the same head
                    City linkage check run 37222688771 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1 MEDIUM · F2 LOW · F3, F4 INFORMATIONAL
TERMINAL MARKER     CAPABILITY_CATALOG_DISCOVERABLE released
```

## 1. 评审如何执行，以及未如何执行

本项目组迄今最小界面：11路径、118新增／23删除，完全无后端改；暴露已答复GET ask/targets。因此问题狭窄可测：目录是否真实后端列表、界面对target行为是否诚实？

```text
author suite, unmodified   tests/cex703-catalog-ui.test.mjs -> 3 tests / 3 pass / 0 fail
reviewer probes, new       tests/cex703-mech-review-probes.test.mjs -> 7 tests / 7 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 14 suites / 80 tests / 0 failures / 0 errors
```

中文对应作者原套件3／3、新评审7／7、本机Android14套件80／80零失败／错误。七中六真实浏览器对真实Gateway。无旧测试触及，diff唯一新测试，以name-status测而非假设，无放宽须补偿。

## 2. 工作书六检查与判据

| # | 要求 | 探针 | 结果 |
|---|---|---|---|
|1|新用户1–2步达目录|1＋6|连接后恰2交互、零Ask，不需先失败|
|2|数量/身份对ask/targets|1|16卡对16target，每target同后端，顺序／双向一致|
|3|不可用真值|3|全渲、disabled、后端unavailableReason；force-click零变化|
|4|选择与手动Ask不分歧|4|选卡零执行、准备input、提交带命名target规范selection，同typed Ask channel|
|5|双界面一致|7＋阅读|同payload，但availability chip不一致F1|
|6|新后端目标无需前端列表编辑|2|替换不存在前端的synthetic target，恰该一行，无第二手写漂移列表|

工作书规则判据：

```text
catalog from the backend contract, no second copy   PROBE 2: an injected target appears and nothing else does
unavailable shown but not actionable, with a reason PROBE 3
mutating / side-effect keeps confirmation           PROBE 8: a City task target creates nothing when chosen and nothing
                                                    before the existing confirmation step; the confirm step is reached
search/favourites/command palette out of scope      nothing of the kind is present in the diff
```

中文对应后端契约零副本（2仅注入target）；不可用展示不执行带原因（3）；mutating／side-effect保确认（8选City task及确认前零创建，达到confirm）；search／favourites／command palette不在diff范围。

## 3. 发现

### F1 — MEDIUM：Android将本地修改target称SAFE

AskPanel StatusChip仅读available、sideEffect，完全忽略mutating；同卡下一行对刚称SAFE的target警告“会写入本地产品数据”。真实live契约：

```text
checklist   checklist.add-item      mutating=true  sideEffect=false  available=false (room hub ECONNREFUSED)
bookmarks   bookmarks.add-bookmark  mutating=true  sideEffect=false  available=false (room hub ECONNREFUSED)
knowledge   knowledge.add-entry     mutating=true  sideEffect=false  available=false (room hub ECONNREFUSED)
```

checklist.add-item、bookmarks.add-bookmark、knowledge.add-entry均mutating true、sideEffect false、available false（Hub ECONNREFUSED）。不可用不是target属性，而是fixture临时loopback探针。作者回执unavailable5／16仅与五CITY_TASK不可用、ROOM可用一致；此配置三者available && mutating && !sideEffect，写数据却SAFE。Web targetCard分别mutating／side-effect，从不SAFE，双界面对同target风险分歧。

严重度：方向不安全、低报风险，是控制界面用户安全主张，MEDIUM；不更高因权威未丢，仍既有confirmation，矛盾同卡下三行可见。最小修TargetChoice：不可用→UNAVAILABLE、sideEffect→SIDE EFFECT、mutating→LOCAL CHANGE、否则SAFE；或Web多flag。

### F2 — LOW：Web空目录仅标题，Android解释

合法targets空时Web只有section／title，无empty、原因或Gateway无目标说明；Android同payload UtEmptyState“Gateway没有提供目标”。用户不能分空目录／渲染失败。工作书要求双界面一致、不可用／缺能力自解释。最小修渲Android已有empty。

### F3 — INFORMATIONAL：必需变更前步骤称NOT_OBSERVABLE，基线可示序列

工作书要“修复前必须先Ask失败步数”；回执before为需Ask/unmatched、exact historical NOT_OBSERVABLE。精确数量现不可测，但锚定基线可重建序列，正是数字要表达：

```text
baseline apps/web/terminal.js:359   targets are fetched only when an Ask returns UNMATCHED
baseline apps/web/terminal.js:175   the unmatched branch is the only place the list lives
baseline apps/android/.../AskPanel.kt:123-125   the unmatched branch, plus a "显示全部目标" button
```

中文对应terminal.js359仅UNMATCHED fetch targets；175 unmatched唯一列表位置；Android AskPanel123–125 unmatched再加显示全部目标。故Web需submit Ask并获unmatched，Android还额外click。工作书未定义step可能未给数；记录让读者有序列，数量基线源码推导而非测量。

### F4 — INFORMATIONAL：不可用数绑定环境，正使F1可达

回执backendSnapshot.unavailableCount5；同提交评审fixture10／16，五ROOM loopback Hub ECONNREFUSED。分类environment而非伪数；依Hub答不答，作者值自洽于答复fixture。记录因同差异让F1可达非潜在，数量应带环境。

## 4. 完成门禁独立检查

| # | 门禁 | 判定 | 依据 |
|---|---|---|---|
|1|Web直接目录|PASS|1/2/3/4/8真实browser：2交互、后端行、不可用禁、准备不执行、保确认|
|2|Android直接目录|PASS，范围声明|AskPanel分支在input上；亲跑80／80；作者online NOT_RUN、offlineCatalogDisabled true；此处未渲Compose|
|3|后端驱动|PASS|2注入恰自身，1身份双向|
|4|不假未来能力|PASS|1全行恰全后端，无FUTURE_EXPOSURE_BACKLOG|
|5|对侧Review/精确CI|PASS|本报告、37222683667／37222688854／37222688771同头success|
|6|材料索引|PASS，F3/F4|16、ROOM5/CAPABILITY6/CITY_TASK5、steps对live route验证|
|7|终端|RELEASED|CAPABILITY_CATALOG_DISCOVERABLE|

本评审对账：

```text
capability-registry/records/CAP-ASK-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      the pending-Formal-Review entry replaced by the PASSED record, with F1 named
  evidence                        reviewer probes + this report added as review refs
workbook CEX-703
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the fourteen missing template fields backfilled, exposure values transcribed from CAP-ASK-001
```

中文对应CAP-ASK-001 pending→FORMAL_REVIEW_RECONCILED，known_gaps改PASSED并命名F1，探针/报告review refs；工作书COMPLETE、review true、review_ci，回填十四模板字段，暴露值转录CAP-ASK-001。

## 5. 不作的主张

- 无Android渲染。读目录分支、亲跑80单测parser、真实Gateway确认payload；设备／模拟器无Compose，作者在线NOT_RUN。F1来自live契约及作者配置，不是截图。
- 无Hub可达运行。评审无Hub所以多五不可用；F1可达依作者count与相反配置一致，明确推断。
- 无用户研究。2步是评审真实browser交互计数，不是可用性测量；工作书前后数按F3保留。
- F1/F2未修artifact，MEDIUM／LOW最小修范围留项目组；F4由评审控制平面对账。
- 仅478d486096512eea3266350efe070323a232a120；后头需自身review；review分支是证据非候选。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
