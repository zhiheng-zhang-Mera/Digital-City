# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../OWNER_INSTRUCTION_THREE_END_TEST.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# RECORD — Owner instruction: three-end physical test, Mech Windows + Alien Windows + physical Android

```text
FROM   = Owner（直接指令，2026-10-03）
时点   = 双机验证完成之后（该前置现已满足：Alien 10/10 PASS，Mech 用自己的节点参与）
状态   = 指令已记录；范围与工作量已评估；**尚未开工**——UXI-391 自身的收口（复核结论 + Step 7）先行
```

Full record translation: direct Owner instruction2026-10-03, after dual-host validation, now fulfilled by Alien10/10 and Mech's own participating node. Instruction recorded, scope/workload assessed, **not started**: UXI-391's review/step7closeout comes first.

## 1. Original Owner requirements, item by item

1. **Rename this host's node Alien-test**, already implemented, section3.
2. After dual-host validation, test **three machines**: Mech Windows host, Alien Windows host, and **physical Android** controlled by Alien/connected through AndroidStudio.
3. All three **actually run** tests/verification: Android can **intervene in the whole system and instruct both hosts**; either host can instruct another/report tasks to the centre; every device knows in realtime what others are doing.

## 2. Existing state and gaps: measure first, do not rebuild what exists

**Already present**, UXI301/390/391 outcomes:

```text
- 一个 City（Gateway）就是中心：节点注册/心跳/领取/汇报、任务状态、事件流、presentation feed 都在这里；
- 三端都能作为【客户端】连同一个 City：Web 面、Android 面（已实测：真机 + adb reverse + 会话预置）；
- "另一个设备在做什么"已有数据来源：/api/v0/events（含 TASK_*/NODE_*/HANDOFF 事件）+ /api/v0/city（节点在线态）
  + /api/v0/presentation；Android 的 Activity 页与 Web 的 Activity 页已在渲染事件时间线；
- 跨机所有权转移已实测可用（A→B、同一 task id、epoch 递增、结果回到原 surface）。
```

Full translation: City Gateway is centre for registration/heartbeat/claim/report/taskstate/events/presentation. All three can beclients of one City, Web andAndroid already measured on physical device plus adb reverse/preseeded session. Other-device activity available through events TASK/NODE/HANDOFF, city nodeonline, presentation. Android/Web Activity already render timeline. Cross-host ownership transfer measured A→B, same taskid, increasing epoch, result returned to originalsurface.

**Explicit gaps**, actual work needed:

```text
1. 三端【共用同一个 City 的真实连通】：现在 Android 走 adb reverse(loopback)，Mech 走 LAN；
   要做"三端互相看得见"，需要 Android 直连 LAN 上的 City（或反向由 gateway 对外可达），并解决配对令牌分发；
2. 【定向指令】：现在任务是"谁能干谁领"，没有"把这条指令发给某台指定主机"的语义；
   需要最小的 targeting 机制（例如 target node ref + gateway 侧的定向派发/拒绝理由），
   并保持 planner 的既有语义不被绕过；
3. 【Android 作为指令源】：真机上目前只有 CANCEL 接了后端；Android 要能"对两台主机下指令"，
   需要动作/入口接线（受冻结的 RS-290 契约 ALLOWED_ACTIONS 约束，新增动作属契约级决定）；
4. 【实时同步】：三端需要一个统一的实时通道（WebSocket 事件流已有），Android 与 Web 都要订阅并展示
   "其他设备在做什么"（谁在执行哪条任务、状态如何、结果如何），而不是各自轮询各自的快照；
5. 【三端同时在线的一致性观测】：同一时刻三端视野一致的证据（同一事件序号/时间戳在三个 surface 上一致）。
```

Full translation: 1 realshared-City connectivity: Android currently adb reverse loopback, Mech LAN; mutual visibility needs Android directLAN or externally reachablegateway, plus pairing-token distribution. 2 targeted instruction: currently whoever can execute claims, no designatedhost instruction; minimal targeting, e.g.targetnoderef/gateway targeted dispatch/refusal, without bypassing planner. 3 Android instructionsource: currently only CANCEL backendwired; twohost instructions need entry/action wiring under frozenRS290 ALLOWED_ACTIONS, additions requirecontract-level decision. 4 realtime sharedchannel: WebSocketstream exists; Web/Android subscribe/show who executes whichtask, state/result, rather than separate snapshotpolling. 5 simultaneousthree-end consistent-observation evidence, sameeventseq/timestamp across threesurfaces.

## 3. Local node rename implemented

```text
scripts/uxi391-node.mjs      : id 默认 = CITY_NODE_ID 环境变量 或 'Alien-test'
scripts/uxi391-dualhost-a.mjs: 节点 A 默认 = DUALHOST_NODE_A 环境变量 或 'Alien-test'
显示名默认跟随 id（可用 CITY_NODE_DISPLAY_NAME / 第二个参数覆盖）。
```

Full translation: uxi391-node defaultid CITY_NODE_ID or Alien-test; dualhost-a defaultA DUALHOST_NODE_A or Alien-test. Displayname followsid unless CITY_NODE_DISPLAY_NAME/secondargument overrides.

Subsequent localnodes therefore appear as **Alien-test**. Mech keeps its independently built names, previously mech-review-b etc.

## 4. Suggested progression, requiring Owner confirmation

This is **new capability**, outsideUXI391 remote-handoff closeout-repair boundaries, which forbid reopeningUI/majorcontract/newprotocol. **Do not insert intoUXI391**. Proposal:

```text
A. 你在 mission-book 下新建一本工作书（建议 id：MESH-3END / UXI-392），写明三端目标、验收与边界；
   —— 或者
B. 你授权我在 mission-book 下起草该工作书（按 MISSION_TEMPLATE + CONSTRUCTION_RULES），再由你 review 后生效；
```

Full translation: A Owner createsnewworkbook, suggestedMESH-3END/UXI-392, statingtargets/acceptance/boundaries; or B Owner authorisesAlien draft underMISSION_TEMPLATE+CONSTRUCTION_RULES, effectiveafterOwnerreview.

**Owner choseB**: draft [MESH-301](../../../../completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md), execution_enabledfalse/statusDRAFT_PENDING_OWNER_APPROVAL, waitingapproval. Under eitheroption, **firstfinishUXI391 closeout**: Mechverdict→repairconfirmation→step7merge+REMOTE_HANDOFF_CLOSEOUT_REPAIRED+POST_COMPLETION_REENTRY. Owner explicitly says afterdual-hostvalidation, andshared-City threeendconnectivity depends onUXI391 makinghandoff/resultreturn real.
