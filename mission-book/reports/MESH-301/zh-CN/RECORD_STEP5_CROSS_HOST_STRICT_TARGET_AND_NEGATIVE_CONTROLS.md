# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_STEP5_CROSS_HOST_STRICT_TARGET_AND_NEGATIVE_CONTROLS.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 第 5/6 步阶段证据：跨主机 strict target、live 负对照，以及四次修正的仪器

```text
FROM = Alien (development host)      TO = Mech (endpoint A + formal reviewer), Owner
CITY = http://172.31.3.110:4391      cityId 22e1216b-f124-4d4a-be4a-4a280558c027
```

## 1. 同一 City 中两个真实 worker node 均在线

```text
Alien-Win  online=true  platform=win32  [task.execute.safe, filesystem.temp]
Mech-Win   online=true  platform=win32  [task.execute.safe, filesystem.temp]
```

完成 gate 第 2 项作为**运行**事实满足，而非仅两个注册身份。角色问题解决后 Mech 保持节点运行，使下一节成为可能。

## 2. 真实跨主机 strict-target：Alien 控制界面 → Mech worker

这不是为报告摆拍。**负对照仪器**在 Mech 离线期间创建任务，Mech 节点后来上线并执行。以下原样保留 canonical event stream 顺序：

```text
seq 16  COMMAND_ACCEPTED                       (created from the ALIEN host's control surface)
seq 17  TASK_CREATED
seq 18  TASK_TARGET_WAITING  targetDeviceRef=Mech-Win targetState=OFFLINE
seq 20  TASK_SWITCH_DECLINED
seq 21  TASK_HANDOFF_REFUSED reason=STRICT_TARGET_BOUND from=null to=Mech-Win
seq 70  TASK_TARGET_READY    targetDeviceRef=Mech-Win        <-- Mech's node returned
seq 72  TASK_ASSIGNED        assignedNodeId=Mech-Win         <-- and ONLY Mech's node took it
seq 73  TASK_STARTED
seq 74  TASK_CHECKPOINTED    progress=30
seq 75  TASK_CHECKPOINTED    progress=75
seq 76  TASK_COMPLETED       result={bytes:65, sha256:…}     <-- executed on the MECH host
task    Q-6958c120-262e-49f0-b967-d6572748bd73  state=COMPLETED  assignedNodeId=Mech-Win
```

同时证明四项，每项都是明确要求，而非副作用：

1. **Alien 控制界面 → Mech worker，严格定向、端到端**（第 5.1 步）。指令在 Alien 主机发出，Mech 离线全程由健康 Alien 节点拒绝领取，最终在 Mech 主机执行并产生真实 result digest。
2. **无静默 fallback，由测量证明而非声明。** `Alien-Win` 始终在线且具备能力，却从未获准接管。`seq 21` 是 City 陈述*为何*没有迁移。
3. **重连路径真实。** `seq 70` 的 `TASK_TARGET_READY` 在 `NODE_ONLINE` 时仅对等待该设备的任务触发。因此 offline → reconnect → claim 以自身 `seq` 出现在 canonical truth，不是从后来领取推断。
4. **拒绝 provider switch 不会重路由定向任务。** `seq 20` 记录拒绝，`seq 21` 拒绝转移。此 guard 防止一种本可能看似授权却将任务交给 Alien 节点的机制。

## 3. 对 live City 执行负对照仪器

`scripts/mesh301-mesh-probe.mjs negative --target Mech-Win --other Alien-Win` → **8/8 PASS**:

```text
PASS  unknown target is refused with a typed code
PASS  malformed target is refused, not dropped
PASS  duplicate action replays the same task and does not execute twice
PASS  one idempotency key cannot be made to mean two devices
PASS  strict task for an away device waits instead of rerouting
PASS  strict task carries no releasable handoff reservation
PASS  declining a switch cannot move a user-targeted run
PASS  non-target device is refused with a stated reason
```

仪器**首次**运行报告一个 FAIL，原因在自身：probe 值 `__no_such_device__` 带下划线，根本不是有效节点身份，City 因此正确回答 `TARGET_DEVICE_MALFORMED`，而对照期待 `TARGET_DEVICE_UNKNOWN`。无法区分“产品因错误理由拒绝”和“probe 问错问题”的对照不算对照；现分别使用仅能触发对应情况的值检查。

## 4. 收敛仪器，以及正确工作前四次虚假报告

`observe` 在界面主机运行并写 receipt；`merge` 读取 receipt，产生表和 verdict。收敛基于 canonical server `seq` **及服务器自身 `timestamp`** 测量，绝不使用设备时钟或 UI。

四项缺陷均通过*运行*仪器而非阅读发现：

| # | 虚假报告 | 风险原因 | 修复 |
| --- | --- | --- | --- |
| 1 | 读取服务器时间戳字段 `at`，实际 store 字段为 `timestamp` | 所有延迟都与 `null` 计算，实际未测量 | 读取真实字段；事件缺服务器时间时抛错 |
| 2 | **空 timeline 报 CONVERGED** | 对空集合“没有界面超限”平凡成立，未测任何内容却给绿勾 | 空 timeline 或任何静默界面均 fail-closed |
| 3 | 跨运行追加导致一个 receipt 存**两个 session** | 合并取第一 session 边界，将第二 session 正常行为报成失败 | 一个 session 对应一个 receipt |
| 4 | 将**自身 start/stop** 报成收敛失败 | 有界运行无法测量自身 shutdown boundary | 此范围现为 `AT_SHUTDOWN`，verdict 为 `INCOMPLETE` 并非零退出 |

经验证的运行结果：单主机、两个 headless 界面：

```text
137 1ms  138 7ms  139 1ms  140 1ms  141 0ms
142 OFFLINE_AT_EMIT   143 OFFLINE_AT_EMIT        <-- the City was deliberately restarted here
144 3ms  145 2ms  146 9ms
147 AT_SHUTDOWN
reconnect: awaySince 03:05:24.756Z -> returnedAt 03:05:32.880Z
           latestSeqWhileAway=143  resync.maxSeq=144 after 8ms  verdict=RECONVERGED
verdict = INCOMPLETE   (only because the probe's own shutdown boundary is unmeasurable)
```

City 可达时，仪器现从**服务器自身事件表**取得 timeline，而非 receipt 并集。仅 receipt 并集不可能含所有界面离线时发出的事件，于是“无人报告”会静默变成“无事可报”。

## 5. 明确本次不构成什么

- **上述收敛数字来自单主机、两个 headless probe。** 它们验证仪器，**不是**三端收敛证据；后者要求三个真实界面（Alien Web、Mech Web、Android）及各自 receipt。
- **只有一个方向。** Alien 控制界面 → Mech worker 已完成；**Mech 控制界面 → Alien worker** 未完成，且仅 Mech 主机能产生。
- **Android 完全未连接。** 完成 gate 第 1、3、4、9 项未动：此 City 无 Android control client，无 Android → Alien/Mech，也无 Android 离线重连。
- **尚无 Formal Review、此 head CI、合并或终态标记。**
- `GET /api/v0/health` 返回 `degraded`，因为 Room Hub 未在 loopback 运行。这是诚实组件状态，不是 MESH-301 失败；City 自身路由为 `READY`。记录以免复核者误读 `degraded`。

## 6. Mech 下一步可独立做什么

```text
1. Mech control surface -> Alien-Win strict target, once, safe task.  Step 5.2. Its own instrument, its own
   receipt; the strict-target Action route is POST /api/v0/actions with
   {route:'CITY_TASK', target:'city.task', operation:'CHECKPOINT_DEMO',
    input:{targetDeviceRef:'Alien-Win'}, idempotencyKey:'<new key>'}.
2. Run its own `observe` against the City for the window it generates, and keep the receipt.
3. Re-run the negative controls with its own values -- an independent instrument reproducing the controls is
   what step 6 asks for, not a copy of mine.
```

当前健康任务能否在 Mech 主机执行，仅取决于 Mech 节点运行，因此保持节点在线本身就是证据的一部分。
