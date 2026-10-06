# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_STEP4_ANDROID_STRICT_TARGETS_AND_SURFACE_IDENTITY.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 第 2/4 步：Android 是 canonical City 的真实控制界面，并严格定向 Alien 和 Mech

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
CITY = http://172.31.3.110:4391   cityId 22e1216b-f124-4d4a-be4a-4a280558c027
UTOPIA = branch mesh/MESH-301-three-end @ 4271cbf
ANDROID DEVICE = BICIPVNB5HS85H9T, model PERM00, package city.utopia.control
```

## 1. Android 设备实际做了什么：按 canonical `seq` 顺序

下面所有记录都读取自 **City 自身的事件流**，而非截图。Android 设备通过应用经过认证的 City 连接，自行发出了这三条指令。

```text
Android -> strict target Alien-Win    Q-fa5c5669-11c2-48da-a258-55414c7fe4ef
  seq 157 COMMAND_ACCEPTED
  seq 158 TASK_CREATED
  seq 159 TASK_ASSIGNED   assignedNodeId=Alien-Win
  seq 160 TASK_STARTED
  seq 161 TASK_CHECKPOINTED progress=30
  seq 162 TASK_CHECKPOINTED progress=75  sha256=a36b22b7…
  seq 163 TASK_COMPLETED   result={bytes:65, sha256:a36b22b7…}     targetStateAtCreation=ELIGIBLE

Android -> strict target Mech-Win     Q-cfc3912a-73d9-45bb-8f7a-70b2ba346911
  seq 164 COMMAND_ACCEPTED
  seq 165 TASK_CREATED
  seq 166 TASK_ASSIGNED   assignedNodeId=Mech-Win
  seq 167 TASK_STARTED
  seq 168 TASK_CHECKPOINTED progress=30
  seq 169 TASK_CHECKPOINTED progress=75  sha256=165afc45…
  seq 170 TASK_COMPLETED   result={bytes:65, sha256:165afc45…}     targetStateAtCreation=ELIGIBLE

Android -> UNTARGETED                 Q-4f6bc271-9d9e-40e9-9706-bde300f74950
  state=COMPLETED  targetDeviceRef=<absent>  assignedNodeId=Alien-Win
```

这从 Android 侧关闭了 **completion gates 4 和 7**；两个目标的任务分别落在 **两台不同的物理机器**——Alien 主机和 Mech 主机。

## 2. Android 是控制客户端，City 自己的记录证实这一点

```text
nodes            = Alien-Win, Mech-Win           <- Android is NOT among them
controlSurfaces  = android-PERM00 / PERM00       <- it is here instead
```

**Completion gate 3** 由测量满足，而非承诺：工作书禁止伪造 Android worker node，节点列表证明没有伪造。

## 3. 各界面如何彼此可见，以及设计理由（问题 / 选择 / 判断逻辑）

### D12 — 在事件流握手中声明身份，并作为事件进入 canonical truth

- **问题**：工作书要求 Android 控制客户端的 `{clientIdentity, clientDisplayName = Build.MODEL}` 进入 canonical truth，并要求三界面看见其他界面的操作。但 City 未记录究竟连接了哪些控制界面；`CLIENT_CONNECTED` 的 payload 为空。
- **选择**：界面在流握手中声明 `clientRef` + `clientLabel`；City 发出携带二者的 `CLIENT_CONNECTED`/`CLIENT_DISCONNECTED`，并在 snapshot 中报告在线 `controlSurfaces`。
- **判断逻辑**：“哪些界面已连接”正是三界面必须一致认可的事实。各界面根据自身 socket 状态私下推断，会开始产生分歧，也无法重放或审计。放入事件流便获得三界面收敛所依据的 `seq`；放入 snapshot 则无需重放历史就能读取。ANONYMOUS 界面也记录，字段为 null；省略事件会使其他界面完全看不见它，比记录它未提供信息更糟。

变更后的实测：`seq 156 CLIENT_CONNECTED {"clientRef":"android-PERM00","clientLabel":"PERM00"}`。

### D13 — 持久化引用，不持久化标签

- **问题**：二者哪个是“物理身份”，哪个是“显示名”？
- **选择**：`clientRef` 生成一次并保存在应用私有存储中；`clientLabel` 为 `Build.MODEL`。
- **判断逻辑**：Owner 命名规则允许显示名改变而物理机器不变，worker nodes 已按此实现（`mesh-node-identity.mjs`）。从型号派生 ref 会让型号承担身份职责，重命名界面便会悄然成为另一界面。持久化 ref 只需一行，并保持两个层次的真实语义。

### D14 — Web 标签可设置，因为 origin 无法区分两个浏览器

- **问题**：“Alien Web”和“Mech Web”是在两台主机加载 **同一个** canonical City 的两个浏览器；二者 `location.hostname` 相同，无法用于命名。
- **选择**：Web 界面持久化自身 ref，采用可设置的标签，默认取平台派生名称，通过 `window.utopiaWebSurface.rename(name)` 暴露。
- **判断逻辑**：只有浏览器自身能够知道它是哪一个浏览器。其他方式都是 City 猜测，在 canonical truth 中放入猜测的显示名不如诚实的默认值。界面可以重命名而不变成另一个界面，与 D13 是同一规则。

### D15 — Android 的目标选项来自 City 节点列表，“Any node”仍可选择

- **选择**：从 `snapshot.nodes` 构建 `RUN ON` 行，另加 `Any node`。
- **判断逻辑**：硬编码设备名会让界面提供 City 不认识的目标，导致原本绿色的测试因错误原因变红。保留“Any node”不是礼貌问题：只能发出定向任务的界面无法 **从该界面** 执行非定向回归检查，而 gate 7 正是该检查。

## 4. 需要交接的传输发现：`adb reverse` 无法到达这个 City

首次尝试通过 `adb reverse tcp:4391 tcp:4391` 让应用连接 `http://127.0.0.1:4391`，应用停在 `RECONNECTING`。原因在结构上，不是配置错误：**`adb reverse` 转发到主机 loopback**，而这个 City 有意绑定明确的 LAN 接口（`createGateway` 拒绝 `0.0.0.0` 正是为了避免意外暴露）。主机 loopback 无监听者，因此转发连接无处可去。`adb reverse` 需要主机侧 loopback→LAN relay，在这里只增加一个环节而无收益。

设备实测网络为 `wlan0` 上的 `172.31.3.18/16`，与 City 的 `172.31.3.110` 位于 **同一 L2 网段**。应用直接使用 LAN 地址首次就成功，因此 Android 界面通过真实 LAN 路径连接，**本证据完全未使用 `adb reverse`**。还需注意，设备执行 `ping 172.31.3.110` 丢包率 100%，但 TCP 可用：主机防火墙放行 `node.exe` 的 TCP，丢弃 ICMP。**在这对主机上，基于 ping 的可达性检查会产生假阴性**，与第 5 步报告记录的是同一类测量工具缺陷。

## 5. 本记录没有确立的结论

- **Mech Web 尚未实际测试。** 没有 Mech 主机浏览器的 receipt。这里只有 Alien 主机浏览器是候选界面，它也尚未产生 receipt。
- **仍缺少 Mech → Alien 方向**（第 5.2 步）。Alien → Mech 已完成；反向需要 Mech 主机的控制界面及 Mech 自身 receipt。
- **三界面有界收敛表尚未完成。** 收敛测量工具已通过同一主机的 headless probes 验证（第 5 步报告），但尚无三个真实界面的 receipt。Android 应用接收每个事件，因此可以产生 receipt；需要逐事件记录 `seq` + observed-at 并导出日志。这是下一项工作，也是向 Mech 交付 development report 前的最后一项。
- **当前 head 尚无 CI、无 merge、无 Formal Review、无 terminal marker。**
