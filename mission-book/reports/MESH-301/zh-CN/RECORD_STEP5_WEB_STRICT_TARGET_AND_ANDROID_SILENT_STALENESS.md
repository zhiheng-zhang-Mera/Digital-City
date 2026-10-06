# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_STEP5_WEB_STRICT_TARGET_AND_ANDROID_SILENT_STALENESS.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 第 5 步：Web 可 strict-target，Android 却丢失一个事件而未声明

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ d919dc7
```

## 1. Web 控制界面现可发出严格定向的 safe task

这是边界 #2 缺失的部分，也是**解除 Mech 阻塞**的内容：反方向（第 5.2 步，Mech → Alien）须由 Mech 主机控制界面发出。

```text
apps/web: a target selector beside Run, built from the City's OWN node list ('Any node' preserved)
          Run submits POST /api/v0/actions with the target inside `input`, so the existing
          request fingerprint covers it - one key cannot mean two devices, replay does not re-execute
```

通过 `scripts/mesh301-web-surface.mjs` 驱动 Alien 主机真实浏览器实测：

```text
seq 266 CLIENT_CONNECTED {"clientRef":"web-798a9fal","clientLabel":"Alien Web"}
seq 267 COMMAND_ACCEPTED          <- issued by the BROWSER
seq 268 TASK_CREATED
seq 269 TASK_ASSIGNED  assignedNodeId=Mech-Win
seq 270 TASK_STARTED
seq 271 TASK_CHECKPOINTED progress=30
seq 272 TASK_CHECKPOINTED progress=75
seq 273 TASK_COMPLETED result={bytes:65, sha256:3a6c5918…}   targetStateAtCreation=ELIGIBLE
seq 274 CLIENT_DISCONNECTED / seq 275 CLIENT_CONNECTED       <- the deliberate offline/reconnect
```

因此已演示“Web / Android 发起 strict-target safe task 的最小交互”的 Web 部分；界面也在 canonical truth 声明自身身份（D12/D14）。

## 2. 两真实界面的 FAILED 收敛运行，以及为何失败有价值

发出六个任务期间，`Alien Web`（Alien 主机真实浏览器）与 `PERM00`（真实 Android 设备）观察同一 canonical stream。相对于服务器自身 5000 ms 窗口，**每个已测 seq 均收敛**：浏览器 0–3 ms；Android 在声明并校正 592 ms 时钟偏移后为 13–78 ms。但运行仍因两项问题返回 **FAILED**；两项发现均比一次 PASS 更有价值。

### FAILURE 1：仪器自身缺陷（已修复）

```
seq 279 Alien Web: reconnected without re-reading the server; re-convergence is not evidenced
```

脚本的 `reconnected` 记录带 `observedAt`，`resync` 却没有，因此 `merge` 看不到界面刚完成的重新收敛，并正确拒绝假设它发生。现已修复。这是通过实际运行而非阅读发现的**第五**项仪器缺陷，与第四项同类：因自身原因失败的仪器，与不会失败的仪器一样无用，两者都会使复核者不再信任输出。

### FAILURE 2：Android 界面的真实缺陷（未决，未修复）

```
seq 233 PERM00: online surface never observed seq 233
```

Android receipt 覆盖 `192..322`，**恰好缺一个** seq：`233`。精确诊断如下：

```text
resync records     192 (session start), 234
stale records      NONE
reconnected records NONE
```

234 的第二个 `resync` 仅在 socket 重开时写入，因此 socket **确实**离开后返回，但 receipt **没有 `stale`、也没有 `reconnected`**。这导致工作书明确禁止的情况：**界面能丢失事件，却不记录自身离线**；该时刻 receipt 声称“在线并观察”，实际两者都不是。可静默陈旧的界面比诚实离线更糟，因为下游无法分辨。

此轮未修复，也刻意不掩盖：根因尚未确定，因此当前 Android receipt 不能作为收敛证明，运行 verdict 保持 **FAILED**。仪器完成职责，捕获遗漏而非以平均数消除它。

## 3. 完成 gate 状态

```text
 2  two real workers online ................. MET
 3  Android not a fake worker ............... MET
 4  Android strict-targets Alien and Mech ... MET
 5  Alien <-> Mech mutual strict target ..... HALF: Alien Web -> Mech-Win DONE (seq 267-273). The Mech host
                                                   now HAS the tool for the reverse; it needs Mech to press it.
 6  negative controls fail-honest ........... live City 8/8; reviewer must rebuild independently
 7  untargeted unregressed .................. MET
 8  three surfaces converge in the window ... NOT MET. Two REAL surfaces measured (browser + Android device);
                                                   Mech Web absent, AND the Android miss above must be resolved
                                                   before any convergence claim is honest.
 9  Android offline/reconnect re-converges ... NOT MET (same finding as 8)
10-14 Formal Review / CI / merge / marker / re-entry .... NOT STARTED
```

## 4. Mech 所需的确切行动

```text
1. open the Web surface against http://172.31.3.110:4391, name it (localStorage 'utopia.clientLabel', or
   window.utopiaWebSurface.rename('Mech Web')), pick Alien-Win in the target selector, press Run
   -> that single action closes step 5.2 AND supplies the third surface for gate 8;
2. run scripts/mesh301-mesh-probe.mjs observe on the Mech host for the window it generates, and keep both
   receipts; and
3. rebuild the negative controls with its own values - step 6 asks for independent instruments, so Mech's
   are the review, not a duplicate of mine.
```
