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
  1) 让那台机器有一个 utopia 检出，且包含 f419b43（或之后的头）
  2) 从该检出运行 reference node agent，指向本城：
       node agents/reference-node/main.mjs   （具体入口按其现有启动方式，token/URL 沿用现有配置）
  3) 该 agent 注册时会声明 city.remote-operation.v1；城市随即把已排队的操作派给它

完成后的自动行为（无需再改任何东西）：
  · 之前在 Alien 上排队的那条操作会被它认领并执行
  · 之后所有远程操作都可直接派到 Alien
  · 若那台机器仍跑旧 agent，城市会继续具名说明缺什么，而不是给出任何形式的"假成功"
```

## 5A. 对侧复现的工具已经就绪（2026-10-07 追加）

开发主机的 study 已经跑完（见 `REX-890_DEV_STUDY_Mech_2026-10-07.md`，20/20），复现工具也已写好并**在本机冒烟跑通**：

```text
工具   utopia scripts/rex890-opposite-host-reproduce.mjs（分支 feat/city-owner-remote-operation @ f419b43）
它执行的是**包自己写明的复现步骤**（包内 reproduction.json），不是读报告：
  ① 用包自己的 checksums 校验包完整性      ④ 按包声明的定义**重算**四项指标并与 metrics.csv 比对
  ② 从 City 重建 normalized dataset         ⑤ 确认每条 NOT_MEASURED 都带有声明的原因
     （把每条回执 run 按 result.taskRef ⑤ 挂上**本机自己的**控制面（TWO_HOST_MESH 至少需要一个）
      接到自己的 canonical task 上）        ⑥ 跑一个**独立** campaign（这一项读报告的人做不出来）
  ③ 与包版本比对

本机冒烟结果（对同一台 City 跑，用于证明工具本身可用）：
  包完整性 VERIFIED（10 文件）· 从 5 份回执重建出 15 条 run 引用（包声明 15）
  completion_time_ms=6532 (n=15) · failure_rate=0 · duplicate_execution_count=0 · convergence_missing_event_count=0
  四项**全部一致** · 每条已测指标都带 provenance · 独立 campaign 6 次重复在两台设备上 COMPLETED
  ⇒ 0 inconsistencies，exit 0

对侧正式复现的命令（在 Alien 的检出里跑；token 用**文件**传，不进城市的操作记录）：
  node scripts/rex890-opposite-host-reproduce.mjs \
       --artifact <Alien 上那份包目录> --city http://172.31.12.151:4310 \
       --config <Alien 上的 {"token":"..."} 文件> --out <输出目录> --label Mera-Alianware
  退出码 0 = 复现一致；1 = 有不一致（逐条具名）；2 = 工具未能运行（**不是**验收）

工具自己的四个缺陷（先踩后修，全部记录在提交信息里，因为每一个起初都像产品拒绝）：
  包文件名猜错（metrics.json/dataset.json 实为 metrics.csv/normalized-dataset.json）·
  请求体多包了一层（城市以 12 个 missing field 正确拒绝）· experimentId 超长（契约有权拒绝）·
  结束时 process.exit 触发 libuv 崩溃（改为 exitCode 让句柄自然收敛）
```

## 5B. 这个工具的"0 inconsistencies"凭什么算数（2026-10-07 追加）

一个不会失败的检查不是检查。所以工具自带一份**证伪脚本**：`scripts/rex890-falsify-reproduction.mjs`
（@ 008c4c4），它造出被篡改的包，要求复现工具**拒绝**它们。**4/4 通过**：

```text
A  改了 completion_time_ms 并**刷新校验和**（于是包自洽）
   ⇒ 复现工具 exit 1 且逐条具名；**于此同时包仍然通过自己的 checksum 校验**
   ⇒ 说明这条发现来自"指标不一致"，不是"哈希不一致"——两者必须能区分
B  **只**改包里的 normalized-dataset.json 并刷新校验和
   ⇒ 重算出来的指标**不动**（仍 6532），0 inconsistencies、exit 0
   ⇒ 这是最关键的一条：证明工具是**从城市重建** dataset，而不是读包里那一份
C  改了 metrics.csv 但**不刷新**校验和
   ⇒ exit 1，packageIntegrity=BROKEN，且具名 "checksum for metrics.csv"
```

trace/provenance 的对比（工作书点名的那一项）也做实了：

```text
canonical task 指针   22/22 仍存在于城市          run→task 连接   15/15 仍可解析
trace 指针            170/206 仍在该城市的实时 trace 里
                      —— **不算作不一致**，因为城市自己报 completeness=PARTIAL（dropped=0），
                         没有声称"什么都没丢"。只有"城市说自己完整、而指针缺失"才会被判为不一致。
每条重建出的 run 引用都同时带有回执指针与 canonical task 引用
```

证伪脚本自己也错过一次，照实记：它最初的两条篡改正则**漏了 multiline 标志**，于是两次替换静默什么都没做，
脚本却把**复现工具**报成失败——一次"没有发生的证伪"比没有证伪更糟，已修并复跑为 4/4。

## 6. 本文件不声称的事

```text
· 不声称 REX-890 已完成：对侧独立复现尚未发生，RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE 未释放。
· 不声称能力已跨两台真实机器验证过：目前只有**本机节点**在真实城市上跑通；对侧节点被正确拒绝。
· 不声称 allowlist 能让被列出的程序变安全：node/python/cmd 都是通用运行时，
  契约保证的是"城市永不插入 shell、永不命名未获准的路径、永不离开声明的工作区、永不无界运行、全部留痕"。
· 不声称 §2 的 workspace 放宽（C:/,D:/）是最终配置：那是发现阶段的临时放宽，正式 study 应narrow 到真实检出目录。
```
