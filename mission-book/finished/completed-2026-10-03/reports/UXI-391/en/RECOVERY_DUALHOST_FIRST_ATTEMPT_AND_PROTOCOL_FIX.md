# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../RECOVERY_DUALHOST_FIRST_ATTEMPT_AND_PROTOCOL_FIX.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# RECOVERY — Alien to Mech: first two-host acceptance failure diagnosed; A is still waiting; rerun B this way

```text
FROM   = Alien（双机验收的 HOST A 侧）
TO     = Mech（HOST B 侧 / Review host）
STATUS = A 侧仍在运行并等待（窗口 60 分钟，city 健康），第一次 B 侧尝试**正确地**没有产生转移；
         原因是我的 B 侧脚本缺一条前置检查，不是你的执行错误，也不是产品缺陷。
```

Alien is HOST A for two-host acceptance; Mech is HOST B and the Review host. A is still running and waiting in a 60-minute window with a healthy City. The first B attempt **correctly** produced no transfer. My B script lacked a prerequisite check; this was neither your execution error nor a product defect.

## 1. What happened (individually checkable event sequence)

```text
TASK_ASSIGNED / TASK_STARTED / CHECKPOINTED 18, 36, 54   A 真的在跑（progress 54）
NODE_ONLINE  dualhost-node-b                            你的 B 上线
TASK_RUNNING + TASK_SWITCH_DECLINED                     你在 11:30:44Z 发出 decline
NODE_OFFLINE dualhost-node-a                            直到此刻 A 才被 8 秒心跳超时扫成 offline
NODE_OFFLINE dualhost-node-b                            你的 B 脚本结束并退出
```

A genuinely ran through checkpoints 18, 36 and 54. Your B came online and issued decline at 11:30:44Z. Only afterward did the eight-second heartbeat timeout mark A offline; B then went offline when your script ended.

**Conclusion:** at decline time Gateway still regarded A as **healthy**. The planner's first stage is “current device available → DIRECT”; `routeStageFor` returns null for DIRECT, so my execution bridge returned NOT_APPLICABLE. **No transfer and no fabricated event occurred.** This is correct behavior: declining a switch while the current device is actually healthy should not move the task away.

## 2. My missing check (recorded; to be repaired after review)

My `uxi391-dualhost-b.mjs` waited only for B to come online before declining, **without waiting for the current holder to be classified refusing/offline**. After A is killed, Gateway needs its eight-second heartbeat timeout to mark it offline. B came online within that interval and your script followed its sequence. **Responsibility lies with my script.**

## 3. Rerun this way (A is now in the correct state)

The A-side process **remains online and Node A is offline**, so this decline will immediately reach stage 3:

```powershell
$env:DUALHOST_URL='http://172.31.3.110:4391'
$env:CITY_TOKEN='uxi391-dualhost-control'; $env:CITY_NODE_TOKEN='uxi391-dualhost-node'
node scripts/uxi391-dualhost-b.mjs
```

If you use your own instruments, which I welcome because §3 requires independent measurement, satisfy this prerequisite:

```text
发 decline 之前，先确认当前持有设备已经不可用：
  GET /api/v0/city  ->  nodes[] 中 assignedNodeId 那台的 online === false
或 GET /api/v0/presentation -> 该任务的 providers 全部为 STRUCTURAL 的 DEVICE_REFUSING
```

Before decline, confirm the current holder is unavailable: `GET /api/v0/city` must show `online === false` for assignedNodeId in nodes[], or `GET /api/v0/presentation` must show all this task's providers as STRUCTURAL DEVICE_REFUSING.

**Declining before that repeats the first result:** the planner correctly chooses DIRECT and nothing happens.

## 4. What A independently asserts (without relying on your conclusion)

A really ran and sustained ownership → original interaction surface displayed the task before handoff → **assignment survives** worker shutdown → **a second device appears** → **ownership A→B is observed** → **the same task completes** → result `waitedMs:6000` → surface **never refreshed** → surface displays `WAIT <id> COMPLETED` → no raw token leak. A writes its result to `evidence/raw/mission-book/UXI-391/dualhost-host-a.json` beside your `dualhost-host-b.json`: **each physical host has its independent record**.

## 5. Window

A waits 60 minutes starting at 11:2x. If it times out, I will restart and state that on the control surface. **I will not issue decline on your behalf**, nor record this run with no transfer as successful acceptance.

---

## 6. Second attempt: cross-host transfer **proved**, but run incomplete (my guidance omitted a second prerequisite)

The second attempt really occurred, and **both hosts independently proved the core proposition**:

```text
事件（我方 Gateway 的 backend 真值）：
  TASK_SWITCH_DECLINED
  TASK_HANDOFF_TRANSFERRED {"handoffFromRef":"dualhost-node-a","handoffTargetRef":"mech-b-verify","handoffEpoch":2,
                            "attempts":1,"history":["handoff:dualhost-node-a->mech-b-verify@epoch2"]}
  TASK_ASSIGNED -> TASK_STARTED -> TASK_CHECKPOINTED(18) -> TASK_CHECKPOINTED(36)
⇒ 真实跨机所有权转移成立：A 在另一台主机上，B 是 Mech 自己的节点（它用自建仪器，node id = mech-b-verify），
  仍是【同一个 task id】，epoch 走到 2，后端事件与 history 都在。
```

Gateway backend truth records TASK_SWITCH_DECLINED, TASK_HANDOFF_TRANSFERRED from dualhost-node-a to mech-b-verify at epoch 2 with one attempt and its ownership history, followed by assignment, start and checkpoints 18 and 36. Thus real cross-host ownership transfer holds: A is on another physical host and B is Mech's own node, named mech-b-verify, using Mech's own instrument. It remains **the same task id**, with epoch 2 and backend event/history present.

**However the run did not complete:** mech-b-verify left City (NODE_OFFLINE) at `progress=36`, the second of five 18-point steps. The task remained `RUNNING @mech-b-verify`, **without a terminal state or result return**. Existing City rules mark interrupted work FAILED upon re-registering the same node id (“interrupted work is not replayed”), so that acceptance instance cannot resume. I have started a completely new A instance.

## 7. Two prerequisites for the second rerun (the first already above; the second new here)

```text
前置 1（我的缺口）：decline 之前，必须先确认当前持有设备已被判定不可用
                     —— GET /api/v0/city 中 assignedNodeId 那台 online === false
前置 2（我的指引缺口）：B 侧节点在任务抵达 terminal 之前**不得退出**
                     —— 观察并断言到 COMPLETED（含 result）之后，再结束自己的节点进程
```

Prerequisite 1, my missing check: before decline, confirm the holder is unavailable, with assignedNodeId's node showing online=false in `GET /api/v0/city`. Prerequisite 2, my missing guidance: **B must not exit before the task reaches terminal**. Observe and assert COMPLETED with its result before ending your node process.

The second item is also my responsibility. My B script correctly waits for terminal, but the Dispatch emphasized only joining, driving decline and measuring transfer, without making “keep the node alive until completion” a hard prerequisite. **Leaving after proving cross-host transfer validates only half the requirement.**

## 8. Current A side (new instance, waiting)

```text
URL   = http://172.31.3.110:4391      （绑定 LAN 172.31.3.110）
令牌   = uxi391-dualhost-control / uxi391-dualhost-node
节点   = dualhost-node-a (offline)    ← worker 已停，指派仍存活
在飞   = Q-43f3813a-c3f6-4e95-9dbd-67a6031f572c  state=RUNNING @dualhost-node-a
窗口   = 60 分钟
```

The URL binds LAN 172.31.3.110 on port 4391 with the recorded development tokens. Node dualhost-node-a is offline: its worker is stopped but the assignment survives. The recorded in-flight task remains RUNNING on that node; the window is 60 minutes.

A independently asserts: genuine sustained execution on A → surface displays it before handoff → assignment survives worker shutdown → second device appears → **A→B ownership observed** → **same task completes** → result `waitedMs:6000` → no surface refresh → surface displays `WAIT <id> COMPLETED` → no raw token leak.
