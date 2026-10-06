# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_OFFLINE_TARGET_CONTROL_AND_SUPERVISOR_V2.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：端点 A 可有意离线并恢复，自身 worker 上 offline-target 对照复现 10/10

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
MEASURED ON = mesh/MESH-301-three-end @ d919dc759f9a375ef8200b6bc7663aa8fa17852c
```

## 0. 声明中断窗口，以便归因其中异常

```text
NODE_OFFLINE  Mech-Win   seq 493   2026-10-03T03:33:53.273Z
NODE_ONLINE   Mech-Win   seq 497   2026-10-03T03:34:11.013Z      total absence ~18s
```

该窗口内若 Alien 看到 `Mech-Win` 异常，来自此对照而非故障。提前声明而非让对方自行发现，因为 Owner 要求两主机避免互相干扰。

## 1. 常驻 supervisor v2：自动重启与控制文件

两项变更来自准备复核时遇到的自身 v1 缺陷：

- **v1 没有重启。** worker 子进程退出后，端点 A 会离线直到人发现。端点 A 在线本身属于任务证据，因此“worker 正在运行”此前依赖运气。v2 用有界 backoff 恢复子进程，放弃时**不再沉默**：打印重启预算耗尽，而非静默循环；永远循环却不报告的 supervisor 与没有 supervisor 是同类失败。
- **v1 无法让 worker 离线后恢复。** 工作书负对照要求目标设备真正离线，而本主机仅可控制自身 worker。v1 意味着终止进程却无法恢复，将不可恢复中断伪装为对照。v2 读取 `.runtime/mesh301-resident-control.json`：`{"shared":"down"}` *有意*停止 shared-City worker（不触发重启循环），`{"shared":"up"}` 恢复。文件位于被 Git 忽略的 `.runtime/`，无凭据。

窗口已重启为 v2，任何依赖它的工作开始前先核验：

```text
visible console          title "Utopia City - Mech-Win (resident)"   HasWindow=True
local City               listening 172.31.12.151:4391
shared City              Alien-Win:true, Mech-Win:true
node identity after the bounce   1 node matching "Mech": id=Mech-Win principal=Mech-Win displayName=Mech-Win
```

最后一行重要：worker 停止重启后不得以**第二个**身份返回。本次没有：仍一个 `Mech-Win`、相同 principal。重复节点会静默破坏所有人的 gate 2（两个不同真实 worker）。

## 2. 自身仪器对自身 worker 运行 offline-target 对照

`mech-mesh301-offline-target.mjs` 由本端依据工作书要求编写，并非开发主机 `negative` probe 的副本。**10/10 PASS：**

```text
PASS  Mech-Win is online before the control
PASS  the City marks Mech-Win offline after the worker is stopped          (online=false after 10199ms)
PASS  a strict task for an AWAY device is created, not refused             (action QUEUED, taskId Q-f49b261a-…)
PASS  the task carries the target and records the target state at creation  (targetStateAtCreation=OFFLINE)
PASS  the online device Alien-Win does NOT take a task strictly targeted at the away device
                                                                           (assignedNodeId=null for 15s while Alien-Win was online)
PASS  canonical truth says WHY nothing moved (TASK_TARGET_WAITING with the target state)
PASS  Mech-Win returns to canonical truth as online                        (online=true after 3064ms)
PASS  ONLY the returning device claims and finishes it                     (assignedNodeId=Mech-Win, COMPLETED, sha256 c7f5c0ed…)
PASS  TASK_TARGET_READY fires on the device return, before the claim       (ready seq 498, assigned seq 499)
PASS  the Alien-Win node never claimed it anywhere in the timeline
```

原样保留 canonical truth：

```text
seq 494 COMMAND_ACCEPTED   {}
seq 495 TASK_CREATED       {}
seq 496 TASK_TARGET_WAITING {"targetDeviceRef":"Mech-Win","targetState":"OFFLINE","reason":"TARGET_DEVICE_OFFLINE"}
seq 498 TASK_TARGET_READY   {"targetDeviceRef":"Mech-Win"}
seq 499 TASK_ASSIGNED       {"state":"ASSIGNED","assignedNodeId":"Mech-Win"}
seq 500 TASK_STARTED        {"state":"RUNNING"}
seq 501 TASK_CHECKPOINTED   30
seq 502 TASK_CHECKPOINTED   75   sha256 c7f5c0edce9e942c22505ed2b2d174442a1d1aa344a89685760fb065c720502e
seq 503 TASK_COMPLETED       100  {"bytes":65,"sha256":"c7f5c0ed…","cleaned":true}
```

`seq 497` 的 `NODE_ONLINE` 使 `seq 498` 成为可能，且不在任务自身 event thread 中；应记录，因为因果链来自 *City 级*而非 task 级事件。

这在**另一主机、另一主机 worker、自身仪器**上独立复现 Alien 记录的情况（离线设备 strict task 等待而不重路由），符合工作书复核章节。但仍**不是**针对已复核 head 的证据，因为尚未释放复核 head；它是在复核依赖仪器前证明仪器可用。

## 3. 未证明的内容

- **不是 Android 离线重连（gate 9）。** 后者要求 Android 设备离线恢复，本次是 Windows worker。证据相邻，gate 不同。
- **不是有界收敛。** 对照测量状态迁移而非观察延迟；时钟偏移仪器在自身第 5.2 步 receipt 中。
- **不是复核 verdict。** head 尚未释放，`development_complete` 仍为 `false`。

## 4. 带入复核的低严重度发现，提前记录避免意外

`services/dev-gateway/server.mjs` 与 `pairing.mjs` **硬编码** `displayName: 'Utopia · Alien'`。因此 Alien canonical City 与本端常驻 City 使用同一名称介绍自身：

```text
SHARED(Alien)  cityId 22e1216b-…  displayName "Utopia · Alien"
LOCAL(Mech)    cityId 0841938e-…  displayName "Utopia · Alien"
```

这是外观问题，**不是** MESH-301 失败：身份是不同的 `cityId`，第 2 步只要求三端读取*同一个* `cityId`。记录因为人并排读取两 City 快照可能合理误认同一 City，而“连接哪个 City”是整个任务关键。不要求改动，只指出可能误导处。

## 5. 决策

```text
MECH-D7   Restart the resident window to land a supervisor upgrade, rather than take the worker away under a
          supervisor that cannot put it back. The outage risk of the restart was smaller and better understood
          than the outage risk of a control I could not reverse.
MECH-D8   Keep the offline window as short as the control allows (~18s) and declare its exact seq bounds in
          mission-book immediately, because the other host is working against the same City right now and an
          unexplained NODE_OFFLINE on their side would cost them time.
MECH-D9   Put the restore in a `finally` block that runs unconditionally and re-checks the node's own state,
          instead of trusting the happy path. A control failure must not become an endpoint outage.
MECH-D10  Verify that a stop/restart does not produce a SECOND node identity, because "two distinct real
          workers" is gate 2 and a duplicate would corrupt it silently.
```

## 6. 证据

```text
mech-mesh301-offline-target.mjs                                   the instrument (mine)
evidence/raw/mission-book/MESH-301/review-by-mech/mech-offline-target-negative-control.json
.runtime/tmp/mesh301-resident-city.mjs                            supervisor v2 (auto-restart + control file)
.runtime/mesh301-resident-control.json                            the control file (git-ignored, no credential)
```

仍保留本主机，理由同前：`mesh/MESH-301-three-end` 只有一个开发 owner，将复核者原始证据混入，会造成 Owner 要求避免的跨主机 head 冲突。

## 7. 本记录时端点 A 状态

```text
Mech-Win worker        online in the shared canonical City, heartbeat current
Mech-Win-Web surface   exercised at step 5.2; not left connected (a surface that is left open for no reason is
                       noise in controlSurfaces, and §5 of my previous record showed those entries are counted)
resident City          up on 172.31.12.151:4391, visible console window, desktop shortcut re-launches it
local worker           online in the resident City as well
```
