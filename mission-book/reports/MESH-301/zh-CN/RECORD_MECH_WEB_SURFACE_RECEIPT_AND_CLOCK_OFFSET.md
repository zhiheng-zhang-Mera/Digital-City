# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_WEB_SURFACE_RECEIPT_AND_CLOCK_OFFSET.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：Mech Web 是活跃控制界面，其收敛 receipt 暴露时钟偏移陷阱

```text
FROM = Mech (endpoint A / formal reviewer)   TO = Alien (development host), Owner
CLOSES THE GAP ALIEN NAMED: "Mech Web has not been exercised - there is no receipt from a browser on the Mech
host", and the Mech side of the three-surface convergence table.
```

## 1. Mech Web 现为 canonical City 的真实控制界面

读取 City 自身快照，而非截图：

```text
controlSurfaces BEFORE  [{"clientRef":"android-PERM00","clientLabel":"PERM00"}]
controlSurfaces AFTER   [ android-PERM00 / PERM00,
                          {"clientRef":"web-y8yvunie","clientLabel":"Mech-Win-Web"} ]
nodes                   Alien-Win, Mech-Win          (Android is still NOT a node - gate 3 holds)
```

因此，**Mech 主机上的**浏览器使用自身标签连接 canonical City；标签由界面选择：`window.utopiaWebSurface.rename('Mech-Win-Web')`，改名后 `clientRef` 稳定，符合 D13/D14 要求的身份分层。

## 2. 收敛 receipt 及生成过程的陷阱

在 **app 加载前**包装 `WebSocket` 捕获自身 live stream，因此记录界面实际接收内容，而非后来轮询看到的内容：

```text
seq=256 COMMAND_ACCEPTED  server=03:24:00.313Z  observed=03:23:59.315Z  raw=-998ms
seq=257 TASK_CREATED      server=03:24:00.313Z  observed=03:23:59.316Z  raw=-997ms
seq=258 TASK_ASSIGNED     server=03:24:00.587Z  observed=03:23:59.589Z  raw=-998ms
seq=259 TASK_STARTED      server=03:24:00.591Z  observed=03:23:59.595Z  raw=-996ms
seq=260 TASK_CHECKPOINTED server=03:24:00.600Z  observed=03:23:59.602Z  raw=-998ms
seq=261 TASK_CHECKPOINTED server=03:24:01.811Z  observed=03:24:00.813Z  raw=-998ms
seq=262 TASK_COMPLETED    server=03:24:03.026Z  observed=03:24:02.028Z  raw=-998ms
```

**每个原始数字约 −998 ms：界面似乎在服务器发出事件之前整整一秒就观察到事件。** 这是不可能的，因此常数部分是**两主机时钟偏移**，并非延迟。将这些数字作为“收敛”报告会构成伪造测量，所以：

```text
clock offset estimated by minimum delay (the fastest event bounds the offset):  -998ms
OFFSET-FREE latencies:  0.0, 1.0, 0.0, 2.0, 0.0, 0.0, 0.0 ms
=> UPPER BOUND on this surface's convergence:  2.0 ms        jitter: 2.0 ms
```

**相对于工作书 5 秒窗口，结果远离边界**：Mech Web 在毫秒内收敛。但发现重点是方法，而非数字：

> **MESH-301 要求收敛基于 canonical server `seq`，而非比较三台机器时钟；这是必要但非充分条件。** 收敛*表*仍需要各界面每个事件的 observed-at，来自**三个不同的时钟**。这对主机偏移约 1 秒，因此用界面本地时间减服务器时间戳，会使一台主机延迟为负、另一台被放大，输出却未必明显异常。必须**逐界面估计并减去偏移**；本 receipt 记录估计而非隐藏。估计使用最小延迟论证（最快事件界定偏移），它是明确声明的**估计**。

这与 programme 持续记录的缺陷同类：仪器报告数字，却不具备使数字有意义的前提。该问题原本会进入交接前最后制品——三界面表。

## 3. 两项自身错误：假设结构而非读取结构

1. **`window.utopiaWebSurface.ref/label` 是函数**，非值（`ref:webClientRef,label:webClientLabel`）。当属性读取会得到 `undefined`，导致首份 receipt 完全没有身份。
2. **stream message 将事件嵌套**为 `{apiVersion, schemaVersion, event:{seq,type,taskId,timestamp}}`，另有裸 `{type:'REFRESH'}` keepalive。首个 parser 在顶层寻找 `seq`/`taskId`，因此报告**零**个带序列事件。我很容易将其写成“界面不接收带序列事件”的产品声明，但实际上是自身解析错误。
3. 另有较小的第三项：标签须在 **app 连接前**设置，因为界面在连接时声明身份；之后改名不会重新注册。首次运行注册为 `Web · Win32`。

## 4. 本次未证明的事项

- **Mech → Alien strict-target 方向（第 5.2 步）仍缺失。** 此轮只运行普通 untargeted 任务以提供观察事件，**没有** strict-target 任何目标，因此未关闭该项。
- **其他两个界面须各自产生 receipt。** 三界面表需要三份 receipt；本份只是其中之一，刻意作为 receipt，而非对其余两端的声明。
- **不是复核 verdict。** 任务仍开发中（`development_complete: false`），尚未领取复核；此处不判定任何 gate。
