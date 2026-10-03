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
