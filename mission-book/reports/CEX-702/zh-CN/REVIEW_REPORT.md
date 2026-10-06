# CEX-702 — 对侧物理主机评审报告

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史事实／未观测边界，不新增验收。身份、原元数据、证据块保留代码围栏。

Mech（MEGA-REP）与作者Alien-codex（MERA-ALIANWARE）不同物理主机；远端尖端等审查头。依赖UXI391 COMPLETE、Mech评审完成，祖先可达。三个精确CI成功，PASS；F1／F5 LOW、F2／F3／F4 INFORMATIONAL，释放ALTERNATE_DEVICE_USER_CHOICE_EXPOSED。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex (MERA-ALIANWARE)
REVIEWED HEAD       3d233ff39d1e96b8a590b12f520f98c283356f25
BRANCH              cex/CEX-702-Alien-codex-alternate-device (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
DEPENDENCY          UXI-391 COMPLETE / review_host Mech / review_complete true; declared ancestor
                    ec12fd0831f31fd81aef9cd9dfb0c959d010f63b verified reachable from the head
REVIEW BRANCH       review/CEX-702-mech-review
EXACT-HEAD CI       V0.2 checks push run 37213802935 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR19 pull run 37213840569 completed/success on the same head
                    City linkage check run 37213840571 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1, F5 LOW · F2, F3, F4 INFORMATIONAL
TERMINAL MARKER     ALTERNATE_DEVICE_USER_CHOICE_EXPOSED released
```

## 1. 评审如何执行，以及未如何执行

16路径、279新增／21删除。后端schedulerChoicesFor、candidateFromNode真实行为改动、重写switch-declined；其余实质Web／Android界面。以下不取开发报告、PR、comment或作者测试标题。

```text
author suite, unmodified   tests/cex702-choice-ui.test.mjs -> 4 tests / 4 pass / 0 fail
reviewer probes, new       tests/cex702-mech-review-probes.test.mjs -> 10 tests / 10 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 15 suites / 82 tests / 0 failures / 0 errors
                                                     (SchedulerChoiceTest 2/2, host MEGA-REP)
```

中文对应作者原样4／4、新探针10／10、本机Android15套件82／82无失败／错误、SchedulerChoice2／2。两探针真实浏览器，一采精确body，所以普通UI能发decision是测得而非推断。无旧测试改动，diff仅新cex702-choice-ui，由git name-status测得，无放宽断言须补偿。自身错误假设的失败草稿记comments，因为错理由失败看似产品缺陷：

```text
asserting the unwired CONFIRM control AFTER the decision closed   it had correctly disappeared; the assertion now
                                                                  runs while a choice is still open
comparing paused-vs-enabled claim on a task already RUNNING on a  neither could claim it, so the comparison proved
different node                                                      nothing; a fresh QUEUED task is used instead
```

中文对应：decision关闭后断言未接线CONFIRM，它正确消失，改为choice仍开时检查；已在另一node RUNNING任务比较暂停／启用claim，两者都不能领取，零证明，改新QUEUED任务。

## 2. Formal Review要求与判据

| 要求 | 探针 | 结果 |
|---|---|---|
|provider选择|1|DTO索引解析真实candidate ref；可执行，记chosenProviderRef，任务unassigned重排队，界面decision关闭|
|decline→替代|2|switchDeclined、接受revision、handoffTargetRef、恰一TASK_SWITCH_DECLINED，并handoff消费|
|strict拒|3|TARGET_DEVICE_BOUND，按钮不提供，409，零修改／事件|
|无替代|4|ALTERNATE_NOT_AVAILABLE409，零修改|
|过期／离线|5|错revision409 CHOICE_STALE；渲染后离线／暂停sharing409 ALTERNATE_NOT_AVAILABLE；按当前City而非client旧观察|
|重复点击|6|同decision/revision200 replay，仅一事件／handoff；CONFIRM400 CHOICE_INVALID，无可用revision同400|
|结果回原界面|7|B领取并执行同任务，原任务真实结果，一非二，原界面仍读task/result|
|Web/Android一致|8＋阅读|浏览器精确decision ALTERNATE_DEVICE、expectedUpdatedAt服务器revision；client不重推路由；Android同feed解析userChoices，不本地计算|

四语义各自存在：换provider旧choose、同service换device新ALTERNATE_DEVICE、keep waiting本地确认、cancel既有动作。PROBE9固定可造假的keep waiting：零switchDeclined、事件、非GET，不能当decline；8固定通用CONFIRM仍渲禁用、无路由。

### 2.1 呈现契约与可执行路由：必需材料点

提交关闭关键差异。candidateFromNode现读规范逐node sharing（sharingEnabled false→DISABLED），而非总ENABLED。PROBE10真实Gateway测双向：

```text
paused device (sharingEnabled:false)   presentation: not offered, reason ALTERNATE_NOT_AVAILABLE
                                        executable: claim returns NO task for a healthy QUEUED task
re-enabled                              presentation: offered again
                                        executable: claim hands over the very task that was just created
```

中文对应暂停设备不提供、ALTERNATE_NOT_AVAILABLE，健康QUEUED claim零任务；重启sharing又提供，claim交新建同任务。此前界面可呈暂停SELECTABLE，服务器已拒任务，正是工作书差异。现双向一致，非仅双负例。

## 3. 发现

### F1 — LOW（材料）：必需handoff延迟留NOT_OBSERVABLE，评审提供

工作书必需handoff latency，开发回执未知：

```text
evidence/raw/mission-book/CEX-702/development-receipt.json
  metrics.click_to_handoff_ms  null
  metrics.click_to_result_ms   null
  metrics.unknown_reason       NOT_OBSERVABLE
```

作者明确waitedMs500合成输出、评审须独立时间，因此非诚实性缺陷。但自身受控browser test1真实click、handoff、worker可测，必需测量由评审而非开发满足。对侧物理主机PROBE11，一Windows受控fixture：

```text
switch-decline HTTP round trip      12 ms
click -> handoff accepted           13 ms
click -> final result              598 ms
canonical decline -> handoff event   4 ms   (delta between the two event timestamps the City itself stamped)
scope: ONE_PHYSICAL_WINDOWS_HOST_CONTROLLED_FIXTURE_NOT_A_PERFORMANCE_CLAIM
```

中文对应HTTP12ms、click→handoff13ms、click→结果598ms、规范decline→handoff4ms（City自身两事件时间差）。非性能主张。4ms值得继承，因为仅City时间，不依评审client。最小修界限：记录作者fixture两指标，或回执声明延迟委派review；有仪器却说unknown为缺口。

### F2 — INFORMATIONAL：注释现反对其下一行

presentation.mjs UXI391长注释旧默认前提已假：称无逐node用户disable，server仅写id／displayName／metadata／telemetry／capabilities／online／lastHeartbeatAt，只有未来获得能力才应READ。下行现读sharingEnabled，server已写且claim以n.sharingEnabled!==false强制一段时间。代码正确，注释过时且在“呈现诚实”文件陈述假规范真值。

### F3 — INFORMATIONAL：未解析service两界面fallback不同

Web candidateLabels[p.index]??ref??''用ref；Android SchedulerPanel candidateLabels.getOrNull(indexOf(provider.ref))?:Service，显示字面英文Service。未解析时Android设备名Service，Web标识符。DTO有ref、live解析，当前不可达；记录因为主题是双界面提供内容一致。

### F4 — INFORMATIONAL：Android在途guard可锁死

SchedulerPanel点击busy[taskId]=true，仅回调fence.accepts(ticket)后清。CityClient.deliver client关闭丢回调，在途switch-declined遇client消失可能该task永久禁用，与701 sticky-loading同形。未复现：未渲Compose，仅控制流阅读。

### F5 — LOW（控制平面）：缺16模板字段含全暴露／能力

相对MISSION_TEMPLATE缺user_exposure_class／surface／nesting、backend_wiring、ui_exemption_reason、四capability_*、三research-grade、monitor／decision证据。非NOT_APPLICABLE，CAP-SCHEDULER-CHOICE-001已存在并声明source workbook、class、双surface/nesting；Registry有事实，拥有工作书无声明，材料引watchlist未命名。第4节按作者记录转录对账。刻意遗漏：作者只写G2普通bug／lifecycle、G3 provenance／review-boundary／registry、G4 state/reality，所有报告／receipt无RS-ID。五类别唯一映射记ID；G2无法单ID，评审排除而非发明。最高grade／capture来自作者明确两个G4。

## 4. 完成门禁独立检查

| # | 门禁 | 判定 | 依据 |
|---|---|---|---|
|1|普通UI替代decision|PASS|8真实browser精确body|
|2|后端规范记decision|PASS|2/6 switchDeclined、revision、targetRef、一event/handoff|
|3|Web/Android看后续handoff|PASS，声明范围|7/8 Web标签与结果；Android同feed不重推，亲跑82／82；Compose未渲，作者online_click NOT_RUN|
|4|CONFIRM不误接|PASS|8禁用无路由，9等待零写|
|5|对侧Review＋精确CI|PASS|本报告、37213802935／37213840569／37213840571同头success|
|6|材料索引|PASS，F1|功能链、合成结果限定；§3提供延迟|
|7|终端|RELEASED|ALTERNATE_DEVICE_USER_CHOICE_EXPOSED|

本评审对账：

```text
capability-registry/records/CAP-SCHEDULER-CHOICE-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      the pending-Formal-Review entry replaced by the PASSED record
  evidence                        reviewer probes + this report added as review refs
workbook CEX-702
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict
```

中文对应Registry pending→FORMAL_REVIEW_RECONCILED；known_gaps待review替PASSED；加探针/报告review refs；工作书IN_PROGRESS→COMPLETE、review false→true、review_ci判定。

## 5. 不作的主张

- 无Android渲染。阅读界面、亲跑82单测parser、真实Gateway核feed；设备／模拟器未渲Compose，online_click和physical_devices_campaign仍NOT_RUN。
- 无性能主张。§3延迟仅一Windows受控fixture，不说分布／负载系统。PROBE7 waitedMs500合成，作者已声明。
- 无生产真实意图满足；intent_validation_status仍NOT_TESTED。
- F1未修artifact，review给缺测量；F2/F3/F4记录最小修复范围留项目组；F5控制平面对账。
- 仅3d233ff39d1e96b8a590b12f520f98c283356f25；后头需自身评审；review分支是证据非合并候选。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
