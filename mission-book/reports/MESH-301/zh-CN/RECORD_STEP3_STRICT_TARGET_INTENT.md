# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_STEP3_STRICT_TARGET_INTENT.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 第 3 步：strict target-device routing intent

```text
FROM = Alien (development host of MESH-301)
TO   = Mech (formal reviewer), Owner
RE   = MESH-301 step 3 and the "current real gap" the workbook names: an explicit, persisted
       user intent that ONE task belongs to ONE named physical device.
UTOPIA = zhiheng-zhang-Mera/utopia, branch mesh/MESH-301-three-end
HEAD   = 56126b2  (baseline ec12fd0831f31fd81aef9cd9dfb0c959d010f63b)
```

## 1. 当前代码内容

```text
services/dev-gateway/targeting.mjs        NEW  pure rules, unit-tested on their own
services/dev-gateway/server.mjs           MOD  the one creation path, the claim guard, the no-reroute guards
services/dev-gateway/actions.mjs          MOD  the user-level path; target travels in `input`
tests/mesh301-strict-target.test.mjs      NEW  7 tests, all passing
```

工作书五条性质及各自执行位置：

| 工作书条款 | 执行位置 |
| --- | --- |
| `target=Alien` → 仅 Alien 可领取 | `/node/claim` guard 中 `claimAllowedByTarget` |
| `target=Mech` → 仅 Mech 可领取 | 对称的同一规则 |
| `target offline/unknown` → 无静默 fallback | 创建时拒绝 `UNKNOWN`；`OFFLINE`/`INELIGIBLE` 创建后等待；handoff sweep 和 switch-decline 均拒绝转移定向任务 |
| 重复用户 action → 不重复执行 | Action facade 既有 `idempotencyKey` 加已 hash `input` 的 request fingerprint |
| untargeted task → scheduler 不变 | 字段缺省时 `claimAllowedByTarget` 返回 `true` |

## 2. MESH-301 未指定具体形式处的决策（问题 / 选择 / 判断逻辑）

### D5：第三个设备引用，不复用既有字段

- **问题：** 工作书禁止复用语义不同的字段，但未指定名称；City 已有 `providerRef`、`handoffTargetRef`。
- **选择：** 新增 `targetDeviceRef`。
- **判断逻辑：** `providerRef` 回答*哪个服务*；`handoffTargetRef` 回答*City 事后将任务转到哪里*，且关键是它属于**预留**：目标看似离线时，既有 sweep 在 `RESERVATION_GRACE_MS = 15000` 后释放。用户目标写入这里会在 15 秒后静默释放并交给他人，正是工作书禁止的 fallback。两字段对是否可重新考虑设备语义不同，因此不能合并。

### D6：定向经 Action facade 进入 City，而非底层 `/tasks`

- **问题：** 工作书优先用户级路径，但允许必要时扩展底层路由。
- **选择：** **不改**底层路由。
- **判断逻辑：** `contracts/city-control-v0/protocol.mjs:7` 拒绝 `type` 外**所有** request key：“选择支持的 safe task type，不接受参数。”此冻结契约有明确保证，扩展会重开冻结 wire contract，并破坏所有既有调用者保证，包括 Android 当前 `createTask()`。Action facade 已有 `idempotencyKey`、request fingerprint、自由形式 `input`，因此目标放入 `input`，**继承而非重造**重复提交边界。工作书优先项与最低成本正确方案一致。

### D7：拒绝 `UNKNOWN`，接受 `OFFLINE`/`INELIGIBLE` 后等待

- **问题：** 工作书允许不可用目标“明确等待或 typed refusal”，未指定适用条件。
- **选择：** 非 **City 已知 node identity** 在创建时以 `TARGET_DEVICE_UNKNOWN` 拒绝；已知但**离线或不合格**则接受、持久化、等待，记录 `targetStateAtCreation`，发一次 `TASK_TARGET_WAITING`。
- **判断逻辑：** 工作书原文区分情况：“target 必须引用当前 City 已知 node identity”是创建时要求，而离线是*当时状态*。拒绝离线目标将使“Mech 离线时为它排队”不可能，而这正是第 5 步离线重连要求。拒绝 unknown 可防止拼写错误变成永远无人执行的任务。

### D8：strict target 不受整个 fleet 可用性 gate 控制

- **问题：** 既有 gate 在全 City 无可工作节点时拒绝创建任务。
- **选择：** untargeted 仍原样执行 gate，strict-target 任务**跳过**它。
- **判断逻辑：** 定向任务由点名设备而非 fleet 决定。fleet gate 会在 Mech 与所有其他节点都离线时拒绝“为 Mech 排队”，违背 D7；还会破坏负对照，使“指令已发但无人能执行”和“发给离线设备的指令”产生*同一*答案，无法区分。untargeted 行为不变，满足无回归要求。

### D9：claim 路由说明*为何*保留任务

- **问题：** `/node/claim` 领取失败仅返回 `task: null`。
- **选择：** 增加 `withheld` 数组，点名每个等待 strict task、为谁保留、谁请求；为空时完全省略该 key。
- **判断逻辑：** `null` 无法区分“没有工作”与“有工作但不属于你”；设备无法区分就会误报给用户。此项为附加字段，忽略它的节点保持原行为。

### D10：City 中任何机制不得转移定向任务

- **问题：** 两个既有机制在设备间转移任务：switch-decline 消费的 RS-202 handoff plan，以及每秒持续重规划的 `honourDeclinedHandoffs` sweep。
- **选择：** 两者均拒绝处理带用户目标的任务。定向任务 switch-decline 发 `TASK_HANDOFF_REFUSED`，reason 为 `STRICT_TARGET_BOUND`，不转移任何内容。
- **判断逻辑：** sweep 最终会转移任务，只保护 decline 路径仍留漏洞。guard 须*记录*而非静默，毫无痕迹的拒绝无法与从未触发的机制区分。

### D11：重连写入 canonical stream

- **问题：** 等待任务的设备返回时，任务静默变成可领取。
- **选择：** `NODE_ONLINE` 后，对每个等待该设备的任务发一次 `TASK_TARGET_READY`。
- **判断逻辑：** 第 5 步要求基于 canonical server `seq` 收敛。仅作为后来领取结果存在的迁移，无法被当时离线界面收敛观察；给自身 `seq`，使“offline → reconnect → converged”可观察而非推断。

## 3. 证据

```text
unit + gateway integration   tests/mesh301-strict-target.test.mjs   7/7 PASS
full root suite              node --test "tests/*.test.mjs"
                             tests 1043   pass 1041   fail 2
```

两项失败均**既有且无关**：`capability-adapters.test.mjs`（document bytes flow through real readers…）及 `city-roads.test.mjs`（Bridge Road extraction preserves all six published document retrieval digests…），均在 `services/capability-bridge/adapters.mjs:49` 为 `CORRUPT_INPUT`。这是**实测而非假设**：stash 此改动后，相同两测试在未改基线上同样失败。记录而不修复，因为不在允许边界且 §9 禁止制造工作；它们也不构成本改动正面或负面证据。

集成测试刻意避免自证脚本：先让 gateway **停止** Alien 节点，使目标处于*已知但离线*状态，这是简单实现容易掩盖的情况。断言健康且有能力的 Mech 仍被 typed 拒绝，任务继续等待；同刻创建的 untargeted **可**领取，避免 strict 等待阻塞队列；replay 不创建第二任务，同 key 不代表两设备；拒绝 switch 不转移；最后返回设备完成任务，`wait → ready → completed` 按 canonical `seq` 递增。

## 4. 未证明的内容

这里没有三端结果；全部在**单**主机 loopback gateway 运行。证明 routing rule，不证明 Alien → Mech 或 Android → Mech，也不会这样描述。第 3 步是机制，第 4–6 步才是三端证明，需要 Mech 节点持续在线和 Android 设备连接。
