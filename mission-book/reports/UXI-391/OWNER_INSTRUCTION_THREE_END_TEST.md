# 记录 — Owner 指令：三端实机测试（Mech 主机 + Alien 主机 + Android 实机）

```text
FROM   = Owner（直接指令，2026-10-03）
时点   = 双机验证完成之后（该前置现已满足：Alien 10/10 PASS，Mech 用自己的节点参与）
状态   = 指令已记录；范围与工作量已评估；**尚未开工**——UXI-391 自身的收口（复核结论 + Step 7）先行
```

## 1. Owner 的原始要求（逐条）

1. **本机节点名称修改为 `Alien-test`** —— **已落实**（见 §3）；
2. 双机验证完成后进行**三机测试**：
   - Mech 主机（Windows 版）
   - Alien 主机（Windows 版）
   - Alien 控制、Android Studio 连接的**安卓实机**（Android 版）
3. 三端**实际运行**测试与验证，要求：
   - **Android 机可以实际干预整个系统，对两台主机下指令**；
   - **任意一台主机可以对其他主机下达指令 / 向中心进行任务汇报**；
   - **所有设备都能实时同步知道别的设备在做什么**。

## 2. 现状与差距（先量清，避免把"已有"当成"要造"）

**已经有的**（UXI-301/390/391 的成果）：

```text
- 一个 City（Gateway）就是中心：节点注册/心跳/领取/汇报、任务状态、事件流、presentation feed 都在这里；
- 三端都能作为【客户端】连同一个 City：Web 面、Android 面（已实测：真机 + adb reverse + 会话预置）；
- "另一个设备在做什么"已有数据来源：/api/v0/events（含 TASK_*/NODE_*/HANDOFF 事件）+ /api/v0/city（节点在线态）
  + /api/v0/presentation；Android 的 Activity 页与 Web 的 Activity 页已在渲染事件时间线；
- 跨机所有权转移已实测可用（A→B、同一 task id、epoch 递增、结果回到原 surface）。
```

**明确缺的**（这才是本任务要做的）：

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

## 3. 本机节点改名（已落实）

```text
scripts/uxi391-node.mjs      : id 默认 = CITY_NODE_ID 环境变量 或 'Alien-test'
scripts/uxi391-dualhost-a.mjs: 节点 A 默认 = DUALHOST_NODE_A 环境变量 或 'Alien-test'
显示名默认跟随 id（可用 CITY_NODE_DISPLAY_NAME / 第二个参数覆盖）。
```

因此本机以后跑节点，在 City 里出现的名字就是 **`Alien-test`**；Mech 侧沿用其自建节点名（它此前用的是 `mech-review-b` 等）。

## 4. 我建议的推进方式（需你确认一句）

这是**新能力**，不属于 UXI-391「remote handoff 收尾修复」的允许边界（该工作书明确禁止重开 UI/契约大改与新增协议），
因此**不应塞进 UXI-391**。建议：

```text
A. 你在 mission-book 下新建一本工作书（建议 id：MESH-3END / UXI-392），写明三端目标、验收与边界；
   —— 或者
B. 你授权我在 mission-book 下起草该工作书（按 MISSION_TEMPLATE + CONSTRUCTION_RULES），再由你 review 后生效；
```

无论 A 或 B，我都会**先完成 UXI-391 的收口**（Mech 复核结论 → 修复确认 → Step 7 合并 + `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` + `POST_COMPLETION_REENTRY.md`），
因为 Owner 指令本身写的是"双机验证完成后"进行三机测试，而三机测试所需的"三端同 City 连通"也依赖 UXI-391 已把 handoff/结果回流这条链路做实。
