# REX-890 引导交接：对侧主机需要先跑一次新 agent / REX-890 bootstrap handoff

作者 / author：Mech-DS（`MEGA-REP`）· 时间 / at：2026-10-07 · 目的：**把 REX-890 唯一剩下的前置条件讲清楚**

```text
结论先行 / bottom line
  "主城 Owner 对子城的直接操作能力"已经建好并在**真实城市 + 真实节点**上跑通（本机节点已实测 COMPLETED）。
  对侧主机 Alien 目前跑的是一个**更早的 agent**，它不实现该能力的节点半边，因此：
      · 城市**不再**把远程操作派发过去（实测：任务保持 QUEUED，原因具名 NODE_MISSING_CAPABILITY:city.remote-operation.v1）
      · 要往下走，Alien 那台机器需要**跑一次包含该分支的 agent**（一次性的、只能在那台机器上做的事）
  这一步**无法由城市远程完成**，见 §4 的实测理由。
```

## 1. 已建成的东西（本轮）

```text
utopia 分支   feat/city-owner-remote-operation
  68ca42b     能力本体：契约 + 城市侧派发/日志 + 节点侧执行 + 界面（23 项测试）
  d11b03d     只把远程操作交给**自称实现了节点半边**的节点（见 §3 的实测缺陷）
契约          contracts/city-remote-operation-v1/operation.mjs
城市路由      POST /api/v0/actions (route CITY_TASK, operation OWNER_REMOTE_OPERATION)
              GET  /api/v0/node/operations（仅 Owner）
节点能力标记  city.remote-operation.v1（由 agents/reference-node 在 register 时声明）
DC 注册       capability-registry/records/CAP-CITY-REMOTE-OPERATION-001.yaml（DIRECT_CONTROL）
```

## 2. 在真实城市上的实测（不是测试夹具）

```text
城市          运行 feat/city-owner-remote-operation，绑定 172.31.12.151:4310
              CITY_REMOTE_OPERATION=1
              CITY_REMOTE_OPERATION_ALLOWLIST=node,git,corepack
              CITY_REMOTE_OPERATION_WORKSPACES=C:/,D:/   ← 发现阶段刻意放宽，见 §5

本机节点 Mega-rep（本构建的 agent）
  声明能力     task.execute.safe, filesystem.temp, city.remote-operation.v1
  派发结果     COMPLETED / exitCode 0 / stdout "live-ok win32" / truncated false
  城市复核     receipt.valid = true, acceptanceAuthority = false

对侧节点 Alien（更早的 agent）
  声明能力     task.execute.safe, filesystem.temp
  派发结果     state=QUEUED，waitingBecause = "NODE_MISSING_CAPABILITY:city.remote-operation.v1"
              → 城市**没有**把任务交给它，也没有伪造成功
```

## 3. 本轮由真实部署暴露并已修的缺陷（记录，不美化）

```text
第一次真机派发（修复前）：
  城市把 OWNER_REMOTE_OPERATION 交给了 Alien；Alien 的旧 agent 走到它的 legacy 分支，
  回了一个 {bytes, operation:"OWNER_REMOTE_OPERATION", cleaned:true} —— 一个**看起来合理、
  但它从未被问过的问题**的答案。
  城市拒绝了它：cityVerdict = {valid:false, code:"RECEIPT_OPERATION_MISMATCH"}。
  这是契约在正常工作（节点回执不是权威，城市用自己派发的那一份复核），
  但 **Owner 本不该能把它发出去** —— 真正的错是"该目标合格"这句话：
  当时资格判定对**所有任务类型**用同一份能力清单，于是一台健康但没实现某任务类型的机器看起来是合格的。

修复（d11b03d）：
  · 任务类型可以声明"节点必须实现什么"（services/dev-gateway/node-task-capabilities.mjs）
  · 该规则在**两个时刻**都被询问：派发时（classifyTarget，让 Owner 在发出前就知道）
    与认领时（execution backend，节点永远不会拿到它做不了的工作）
  · TARGET_DEVICE_INELIGIBLE 现在**具名缺什么**（detail: NODE_MISSING_CAPABILITY:…）；
    原因码不变，detail 是新增的
  · 不合格目标**不是拒绝**：Action 照常创建并 WAITING（具名设备从不被悄悄换掉，
    那台机器也可能被更新），但原因在 /node/operations 与页面上都看得见
```

## 4. 为什么这一步不能由城市远程完成（实测理由）

```text
Alien 上那个旧 agent 只认这些任务类型：WAIT / CREATE_TEMP_ARTIFACT / HASH_TEMP_ARTIFACT /
DELETE_TEMP_ARTIFACT / CHECKPOINT_DEMO。
其中唯一会写文件的是 CREATE_TEMP_ARTIFACT，而它的内容是**由 task id 决定的固定串**：
  platform/windows/filesystem.mjs  create(id) → "Utopia real task artifact\n" + id + "\n"
⇒ 城市对该机器**没有任何写入代码的通道**。远程操作能力本身也需要对侧先有它 —— 这是引导问题，
   不是产品缺陷：任何"从零接管一台机器"的能力都必须先在目标机上落地一次。
```

## 5. 需要谁做什么（唯一的动作）

```text
在 Alien 那台机器上（Mera-Alianware），把 agent 从包含 feat/city-owner-remote-operation 的检出启动一次：
  1) 让那台机器有一个 utopia 检出，且包含 d11b03d（或之后的头）
  2) 从该检出运行 reference node agent，指向本城：
       node agents/reference-node/main.mjs   （具体入口按其现有启动方式，token/URL 沿用现有配置）
  3) 该 agent 注册时会声明 city.remote-operation.v1；城市随即把已排队的操作派给它

完成后的自动行为（无需再改任何东西）：
  · 之前在 Alien 上排队的那条操作会被它认领并执行
  · 之后所有远程操作都可直接派到 Alien
  · 若那台机器仍跑旧 agent，城市会继续具名说明缺什么，而不是给出任何形式的"假成功"
```

## 6. 本文件不声称的事

```text
· 不声称 REX-890 已完成：对侧独立复现尚未发生，RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE 未释放。
· 不声称能力已跨两台真实机器验证过：目前只有**本机节点**在真实城市上跑通；对侧节点被正确拒绝。
· 不声称 allowlist 能让被列出的程序变安全：node/python/cmd 都是通用运行时，
  契约保证的是"城市永不插入 shell、永不命名未获准的路径、永不离开声明的工作区、永不无界运行、全部留痕"。
· 不声称 §2 的 workspace 放宽（C:/,D:/）是最终配置：那是发现阶段的临时放宽，正式 study 应narrow 到真实检出目录。
```
