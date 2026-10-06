# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../OWNER_INSTRUCTION_THREE_END_TEST.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# RECORD — Owner instruction: three-end physical testing, Mech Windows + Alien Windows + physical Android

```text
FROM   = Owner（直接指令，2026-10-03）
时点   = 双机验证完成之后（该前置现已满足：Alien 10/10 PASS，Mech 用自己的节点参与）
状态   = 指令已记录；范围与工作量已评估；**尚未开工**——UXI-391 自身的收口（复核结论 + Step 7）先行
```

This direct Owner instruction was recorded on 2026-10-03, after two-host validation, now fulfilled by Alien's 10/10 and Mech's own participating node. The instruction is recorded and its scope/workload assessed, but **work has not started**: UXI-391 Review and Step 7 closeout come first.

## 1. Original Owner requirements, item by item

1. **Rename this host's node Alien-test**, already implemented in §3.
2. After two-host validation, test **three machines**: Mech Windows, Alien Windows and **physical Android**, controlled by Alien and connected through Android Studio.
3. All three **actually run tests/verification**. Android must **intervene in the whole system and instruct both hosts**; either host may instruct another or report tasks to the centre; each device knows in real time what the others are doing.

## 2. Existing state and gaps: measure first, without rebuilding existing capabilities

**Already present**, through UXI-301/390/391:

```text
- 一个 City（Gateway）就是中心：节点注册/心跳/领取/汇报、任务状态、事件流、presentation feed 都在这里；
- 三端都能作为【客户端】连同一个 City：Web 面、Android 面（已实测：真机 + adb reverse + 会话预置）；
- "另一个设备在做什么"已有数据来源：/api/v0/events（含 TASK_*/NODE_*/HANDOFF 事件）+ /api/v0/city（节点在线态）
  + /api/v0/presentation；Android 的 Activity 页与 Web 的 Activity 页已在渲染事件时间线；
- 跨机所有权转移已实测可用（A→B、同一 task id、epoch 递增、结果回到原 surface）。
```

City's Gateway is the centre for node registration, heartbeat, claiming and reporting, task state, events and presentation feed. All three endpoints can be **clients of one City**: Web and Android are already measured, including a physical phone, adb reverse and a preconfigured session. Other devices' activity is available through /api/v0/events, including TASK_*/NODE_*/HANDOFF events, /api/v0/city for node presence, and /api/v0/presentation. Android and Web Activity pages already render the event timeline. Cross-host ownership transfer has been measured: A→B, same task id, incremented epoch, result returning to the original surface.

**Explicit gaps requiring actual work:**

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

1. **Real connectivity to one shared City:** Android currently uses adb reverse/loopback while Mech uses LAN. Mutual three-end visibility needs Android directly connected to the LAN City, or an externally reachable Gateway, plus pairing-token distribution.
2. **Targeted commands:** tasks currently use “whoever can do it claims it,” without directing a command to a particular host. Add minimal targeting, such as target node ref with Gateway-side directed dispatch/refusal reasons, without bypassing planner semantics.
3. **Android as command source:** currently only CANCEL is wired to the backend on the physical phone. Commands to both hosts need action/entry wiring under the frozen RS-290 ALLOWED_ACTIONS contract; additional actions require a contract-level decision.
4. **Real-time synchronization:** the WebSocket event stream exists. Android and Web must subscribe to one channel and show who executes which task, its state and its result, rather than each polling its own snapshot.
5. **Consistent simultaneous three-end observation:** evidence must show the same event sequence/time stamp consistently across three surfaces.

## 3. Local node rename implemented

```text
scripts/uxi391-node.mjs      : id 默认 = CITY_NODE_ID 环境变量 或 'Alien-test'
scripts/uxi391-dualhost-a.mjs: 节点 A 默认 = DUALHOST_NODE_A 环境变量 或 'Alien-test'
显示名默认跟随 id（可用 CITY_NODE_DISPLAY_NAME / 第二个参数覆盖）。
```

scripts/uxi391-node.mjs defaults its id to CITY_NODE_ID or Alien-test. scripts/uxi391-dualhost-a.mjs defaults Node A to DUALHOST_NODE_A or Alien-test. Display name follows id unless overridden by CITY_NODE_DISPLAY_NAME or the second argument. Subsequent local nodes therefore display **Alien-test**. Mech retains its independently chosen names, previously mech-review-b and others.

## 4. Suggested progression, requiring Owner confirmation

This is **new capability**, outside UXI-391's remote-handoff closeout-repair boundaries, which forbid reopening UI, major contracts or new protocols. **Do not insert it into UXI-391.** The proposal is:

```text
A. 你在 mission-book 下新建一本工作书（建议 id：MESH-3END / UXI-392），写明三端目标、验收与边界；
   —— 或者
B. 你授权我在 mission-book 下起草该工作书（按 MISSION_TEMPLATE + CONSTRUCTION_RULES），再由你 review 后生效；
```

A: Owner creates a new workbook under mission-book, suggested id MESH-3END / UXI-392, specifying three-end objectives, acceptance and boundaries. Or B: Owner authorizes me to draft it under MISSION_TEMPLATE and CONSTRUCTION_RULES, effective after Owner Review.

**Owner chose B:** the draft [MESH-301](../../../../completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md) has execution_enabled:false and status:DRAFT_PENDING_OWNER_APPROVAL, awaiting approval. Either option must **first complete UXI-391 closeout**: Mech verdict → repair confirmation → Step 7 merge, REMOTE_HANDOFF_CLOSEOUT_REPAIRED and POST_COMPLETION_REENTRY. Owner explicitly said after two-host validation; shared-City three-end connectivity depends on UXI-391 making handoff and result return real.
