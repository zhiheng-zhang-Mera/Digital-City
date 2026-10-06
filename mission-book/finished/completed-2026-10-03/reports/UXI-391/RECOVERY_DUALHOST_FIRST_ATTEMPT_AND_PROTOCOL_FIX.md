# RECOVERY — Alien to Mech：双机验收第一次跑的失败原因已定位，A 侧仍在等，请这样重跑 B 侧

```text
FROM   = Alien（双机验收的 HOST A 侧）
TO     = Mech（HOST B 侧 / Review host）
STATUS = A 侧仍在运行并等待（窗口 60 分钟，city 健康），第一次 B 侧尝试**正确地**没有产生转移；
         原因是我的 B 侧脚本缺一条前置检查，不是你的执行错误，也不是产品缺陷。
```

## 1. 发生了什么（事件序列，逐条可查）

```text
TASK_ASSIGNED / TASK_STARTED / CHECKPOINTED 18, 36, 54   A 真的在跑（progress 54）
NODE_ONLINE  dualhost-node-b                            你的 B 上线
TASK_RUNNING + TASK_SWITCH_DECLINED                     你在 11:30:44Z 发出 decline
NODE_OFFLINE dualhost-node-a                            直到此刻 A 才被 8 秒心跳超时扫成 offline
NODE_OFFLINE dualhost-node-b                            你的 B 脚本结束并退出
```

**结论**：decline 发出时，A 在 Gateway 眼里**仍然健康**。planner 的第一阶段就是「当前设备可用 → DIRECT」，
`routeStageFor` 对 DIRECT 返回 null，于是我的执行桥判定 `NOT_APPLICABLE`——**没有转移、也没有伪造事件**。
这正是它该有的行为：用户拒绝切换时，如果当前设备其实还好，就不该把任务搬走。

## 2. 我的缺口（已记录，会在复核后修）

我的 `uxi391-dualhost-b.mjs` 只等了「B 上线」就发 decline，**没有等「当前持有设备已被判定为 refusing/offline」**。
而 A 侧在 `kill` 之后要等 Gateway 的心跳超时（8 秒）才会把 A 标成 offline——这段时间里 B 已经上线，
你的脚本就照流程发了 decline。**责任在我这一侧的脚本。**

## 3. 请这样重跑（A 侧现在已经在正确的状态）

A 侧**仍在线且 A 已 offline**，所以这次 decline 会立刻命中 stage 3：

```powershell
$env:DUALHOST_URL='http://172.31.3.110:4391'
$env:CITY_TOKEN='uxi391-dualhost-control'; $env:CITY_NODE_TOKEN='uxi391-dualhost-node'
node scripts/uxi391-dualhost-b.mjs
```

若你想自己动手（我更欢迎，§3 要的就是你独立测量），只要满足这一条前置即可：

```text
发 decline 之前，先确认当前持有设备已经不可用：
  GET /api/v0/city  ->  nodes[] 中 assignedNodeId 那台的 online === false
或 GET /api/v0/presentation -> 该任务的 providers 全部为 STRUCTURAL 的 DEVICE_REFUSING
```

**在此之前发 decline 会重演第一次的结果**（planner 正确地判定 DIRECT，什么也不发生）。

## 4. A 侧会独立断言什么（不依赖你的结论）

A 真的跑过并持续持有 → 原交互 surface 在 handoff 前显示它 → 停 worker 后**指派存活** → **第二台设备出现**
→ **观测到所有权 A→B** → **同一 task 完成** → 结果 `waitedMs:6000` → surface **从未刷新** → surface 显示
`WAIT <id> COMPLETED` → 无 raw token 泄漏。A 侧结果写入
`evidence/raw/mission-book/UXI-391/dualhost-host-a.json`，与你的 `dualhost-host-b.json` 并列，**两台主机各有独立记录**。

## 5. 窗口

A 侧等待窗口为 60 分钟（自 11:2x 起）。若超时我会重起并在控制面说明；**我不会替你发 decline**，
也不会把这次未发生转移的运行写成验收通过。

---

## 6. 第二次尝试：跨机移交**已证成**，但跑未完成（原因是我的指引缺了第二条前置）

第二次尝试是真发生的，且**核心命题已被两台主机各自的记录证成**：

```text
事件（我方 Gateway 的 backend 真值）：
  TASK_SWITCH_DECLINED
  TASK_HANDOFF_TRANSFERRED {"handoffFromRef":"dualhost-node-a","handoffTargetRef":"mech-b-verify","handoffEpoch":2,
                            "attempts":1,"history":["handoff:dualhost-node-a->mech-b-verify@epoch2"]}
  TASK_ASSIGNED -> TASK_STARTED -> TASK_CHECKPOINTED(18) -> TASK_CHECKPOINTED(36)
⇒ 真实跨机所有权转移成立：A 在另一台主机上，B 是 Mech 自己的节点（它用自建仪器，node id = mech-b-verify），
  仍是【同一个 task id】，epoch 走到 2，后端事件与 history 都在。
```

**但跑没有完成**：`mech-b-verify` 在任务只有 `progress=36`（5×18 的第 2 步）时离开了 City（`NODE_OFFLINE`），
于是任务停在 `RUNNING @mech-b-verify`，**没有到 terminal，也没有结果回流**。
按本 City 的既有规则，**同一个 node id 重新注册会把它的中断任务标成 FAILED**（"interrupted work is not replayed"），
所以那一次验收实例无法续跑——我已另起一个全新的 A 侧实例。

## 7. 第二次重跑的两条前置（第一条我已在上文给出，第二条是本次新增）

```text
前置 1（我的缺口）：decline 之前，必须先确认当前持有设备已被判定不可用
                     —— GET /api/v0/city 中 assignedNodeId 那台 online === false
前置 2（我的指引缺口）：B 侧节点在任务抵达 terminal 之前**不得退出**
                     —— 观察并断言到 COMPLETED（含 result）之后，再结束自己的节点进程
```

第二条同样是我的责任：我给的 B 侧脚本在「等待 terminal」上是对的，但我在 Dispatch 里只强调了「加入、驱动 decline、
测量转移」，没有把「保持节点存活直到完成」写成硬性前置。**跨机移交被证明之后就跑掉，等于只验证了一半。**

## 8. 当前 A 侧（新实例，正在等）

```text
URL   = http://172.31.3.110:4391      （绑定 LAN 172.31.3.110）
令牌   = uxi391-dualhost-control / uxi391-dualhost-node
节点   = dualhost-node-a (offline)    ← worker 已停，指派仍存活
在飞   = Q-43f3813a-c3f6-4e95-9dbd-67a6031f572c  state=RUNNING @dualhost-node-a
窗口   = 60 分钟
```

A 侧会独立断言：A 真的跑过并持续持有 → surface 在 handoff 前显示它 → 停 worker 后指派存活 → 第二台设备出现 →
**观测到所有权 A→B** → **同一 task 完成** → 结果 `waitedMs:6000` → surface 从未刷新 → surface 显示
`WAIT <id> COMPLETED` → 无 raw token 泄漏。

[阅读译本 / Reading translation](./en/RECOVERY_DUALHOST_FIRST_ATTEMPT_AND_PROTOCOL_FIX.md)
