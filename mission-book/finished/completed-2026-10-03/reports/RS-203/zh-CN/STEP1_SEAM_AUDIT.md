# RS-203 步骤1seam审核（中文阅读译本）

> Reading translation / 阅读译本：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份任务状态。

> Mech Development；branchrs/RS-203-cross-device-return-recovery基于CLAIM_TIME_MAINde91f5e，同RS201/202freeze。实施前写，因为前两task都发现首要是确认已有而非旁建。

## 1. 基线亲测绿色

De91f5e逐suite读runner自己totals：

```text
general-ai-remote-execution-v1/conformance.test.mjs    19 pass  0 fail
engineering-return-control-v1/conformance.test.mjs     23 pass  0 fail
remote-presence-reconnect-v1/conformance.test.mjs      25 pass  0 fail
task-lifecycle/tests/task-lifecycle.test.mjs           11 pass  0 fail
                                                       --
                                                       78 pass  0 fail
```

**修正，Reviewhost提出且正确**：原tasklifecycle25/25、floor92均错，实际**11/floor78**。两个独立错误，第二更有教训：

1. **错path**，跑task-lifecycle/task-lifecycle.test.mjs，真实tests子目录；NodeCouldNotFind未读。
2. **Stalevariable**，循环复用$p/$f，失败extraction曾Cannotindexnullarray，正发生；印25是**上suite**残留。**当时看见却略过**是真缺陷，已观察解释掉error变publishedbaseline。

数字是证据，公开修正非静换；suitegreen、工作地基扩展结论不变。后若red表示本task破坏，非原本坏。

## 2. 已有必须复用

四可触seam有多数词汇，另造平行才defect。

**remote-execution.mjs**：EXECUTION_ROUTES LOCAL_WEB/REMOTE_DEVICE已typedcurrent/executing分离；ACTION_STATES DISPATCHED/RUNNING/**AWAITING_USER**/CANCELLED/SUCCEEDED/FAILED，terminal后三者；step3等待user已存在不得重造。EVENT_KINDS STATUS/PROGRESS/PARTIAL/ERROR/FINAL/CANCELLED是step1return词汇；另EXCLUSION_REASONS/STAGING_POLICIES/REMOTE_EXECUTION_PORT/createRemoteExecutionRouter。

**return-control.mjs**：RETURN_CHANNELS STATE/STAGE/PROGRESS/EVENT/LOG/ATTENTION/…；CONTROL_COMMANDS PAUSE/RESUME/CANCEL/**RESPOND**为confirmation；resolveInteractionSurface({ownerRef,devices})**已解析当前authorizedinteraction**，invariant2后半；createRemoteSubworkerBridge/ENGINEERING_REMOTE_EXECUTION_PORT。

**presence.mjs**：PRESENCE/REACHABLE用于disconnect；PENDING含CONFIRMED_SUCCEEDED/FAILED及RECONCILE_OUTCOMES，invariant5truthfulunknown已有；createPresenceTracker/findForbiddenAuditFields。

**Citytask-lifecycle**：advanceLifecycle(current,event)/candidateIdFor(taskId,requirements)是canonical，invariant2sharedstate。结果必须**返回此处**非secondtruth，workbook明禁。

## 3. 原测量gap，非阅读印象

四seamstep1机械搜索：

```text
correlat                                   8 hits in the seams, 38 repo-wide   -> exists
out-of-order | sequence                    39 hits in the seams                -> exists
duplicate | dedup | idempot                49 hits in the seams                -> exists
action_id                                  62 hits in the seams                -> exists
handoff                                     0 hits in the seams                -> ABSENT
provenance                                  0 hits in the seams, 409 repo-wide   -> ABSENT here
```

Correlation8/全38、ordering39、dedup49、actionid62均存在；handoff零，provenance零/全409。

两finding，A须精确因粗说会错：

**A 原判断：可修改seam无crossdeviceEXECUTIONhandoffcorrelation。** Handoff四file零，非全repo无——assistant-handoff125次，但不同domain/vocabulary/subject，assistantdutytransfer非跨devicework。原诚实意图：correlation/order/idempotency有，但无“interactiondevice非executor”的一级correlatablefact；应扩既有route/state非借assistantsemantics（后§6反驳此判断）。

**B Provenance无本seam归属。** 全409说明已存在需reuse，四file零表示step5binding尚无attach处。定位contract/bind是step5，非许可second。

## 4. 当时后续seam计划

```text
remote-execution.mjs   extend the route/action-state vocabulary with the handoff correlation and
                       the return projection; reuse ACTION_STATES and EVENT_KINDS as-is
return-control.mjs     the return channel and resolveInteractionSurface are the projection target
                       for invariant 2; RESPOND is the step-3 confirmation path
presence.mjs           the disconnected/degraded source of truth for invariant 5; do not duplicate
                       its reconciliation vocabulary
task-lifecycle         the ONE canonical state results must return into; no second truth
ONE NEW SEAM           the handoff correlation record itself, plus the ordering guard for
                       out-of-order and duplicate progress events, which finding A shows has no
                       existing home in these seams
```

Remote扩handoff/returnprojection复用action/event；returnchannel/resolveInteractionSurface为projectiontarget、RESPONDconfirmation；presence真源不重复reconciliation；taskcanonical唯一；原ONE NEW SEAM correlationrecord+orderingguard认为缺（后撤）。

## 5. 本增量未做

尚无implementation。仅baseline/reuse/measuredgap，不算六stepprogress或completeclaim。

## 6. 修正：§3A错误，方法错误更有用

实施前读module推翻中心claim，公开纠正非删。原claim没有一级split，真实remote源：

```text
line  6  header: "interaction_device_ref may differ from execution_device_ref, and switching the
                 execution host must not require the user to walk to or operate that host - so the
                 interaction device is never changed here"
line 211  proposeDeviceSwitch({ action_ref, interaction_device_ref, requirements, at })
line 240  interaction_device_ref,
line 241  execution_device_ref: interaction_device_ref,
line 246  interaction_device_unchanged: true,
line 275  interaction_device_ref,
line 276  execution_device_ref: best.device_ref,
```

Headerline6明确两device可不同、换executor不要求user走去且interaction不变；proposeDeviceSwitch211及240/241/246、275/276字段原样。Split**已一级字段**、unchanged**已assert**，header几乎workbook同句，Afalse。

**错误机制**：用**词**测**概念**，handoff0解释capability无，但repo叫deviceswitch及interaction_device_ref/execution_device_ref。Wordsearch非conceptmeasurement，零仅vocabulary证据。内部矛盾应抓：§3order39/dedup49却§4新orderingguard；REMOTE_EXECUTION_CODES已有**EVENT_OUT_OF_ORDER/LATE_EVENT_AFTER_TERMINAL**，order从未缺。

§3仅B存续且更窄：provenance0/409表示这些module未bind，但同教训，后结论前找**capability如何绑结果证据**非单词。

**计划后果**：§4ONE NEW SEAM **撤回**，会重复现有已测机制，恰违secondtasktruth禁、浪费前两task避免的工作。Step1需完整读proposal/dispatch/event重新推真正缺，不靠零word加module。

## 7. 从读而非搜重新推真正gap

看actualconnection：

```text
remote-execution.mjs   imports: (none at all - a pure module with an injected port, by design)
                       mentions 'canonical' 8x and 'authorized' 10x IN ITS OWN vocabulary
                       mentions return_control 0x and task_lifecycle 0x
return-control.mjs     imports: (none at all)
task-lifecycle         referenced only 2x across every contract in the repository
```

Remote无import纯injectedport，自身canonical8/authorized10，return_control/task_lifecycle0；returncontrol无import；tasklifecycle全contract仅2引用。

与§3相反：各module**词汇已在**；remote区别device并同actionidemitstatus/progress/partial/final/error，return知道authorizedsurface/channel。缺**连接**：无人把executionevent返回canonical再project当前authorizedsurface。这正step1canonicalexecution/handoffcorrelation+progress/resultreturn，**integrationgap非vocabularygap**。

**修正工作**：建remoteexecution→task-lifecyclecanonical→return-controlresolveInteractionSurface的return/projectionbridge，复用所有词汇，不新correlation，字段已存在且greenbaseline覆盖。比§4窄且更有根据，明确为修正后果非碰巧新plan。

语言配对 / Language pair: [原文 / Source](../STEP1_SEAM_AUDIT.md)
