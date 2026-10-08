# REX-890 引导交接：对侧主机需要先跑一次新 agent / REX-890 bootstrap handoff

作者 / author：Mech-DS（`MEGA-REP`）· 时间 / at：2026-10-07 · 目的：**把 REX-890 唯一剩下的前置条件讲清楚**

> 2026-10-07 追加（本分支头 `66bab47eff42733f71aee5395a4795b234a058f8`，push CI run 37651601378 success）：
> 除 §5 的"先换 agent"外，另有 **§5C 智能体任务通道**（对侧由 ChatGPT/codex 驱动时可直接接活），
> 已在实机城市上跑通；本轮"真的跑一次"暴露并已修的五个缺陷见 §5D。

```text
结论先行 / bottom line
  "主城 Owner 对子城的直接操作能力"已经建好并在**真实城市 + 真实节点**上跑通（本机节点已实测 COMPLETED）。
  对侧主机 Alien 目前跑的是一个**更早的 agent**，它不实现该能力的节点半边，因此：
      · 城市**不再**把远程操作派发过去（实测：任务保持 QUEUED，原因具名 NODE_MISSING_CAPABILITY:city.remote-operation.v1）
      · 要往下走，Alien 那台机器需要**跑一次包含该分支的 agent**（一次性的、只能在那台机器上做的事）
  这一步**无法由城市远程完成**，见 §4 的实测理由。
  追加：若只想让对侧的**智能体**接活，见 §5C（注册 → 领取 → 回报），无需先替换那边的 agent。
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

> 2026-10-07 追加：本节要求对侧**先换 agent**。若只想让对侧的智能体接活，**§5C 给了第二条通道**
> （智能体任务：注册 → 领取 → 回报），不必先替换那台机器上的 reference agent。两条路都可以走，
> 区别是：§5 交的是**城市能核对字节**的程序；§5C 交的是**请求与智能体自述**。

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

## 5C. 第二条通道：不必先换 agent —— 智能体任务通道（2026-10-07 追加，已在实机城市上跑通）

§5 那条路要求对侧**先换掉旧 agent**。Owner 随后指出：对侧那台机器上是 **ChatGPT / codex 在驱动**，
"跨机控制"本身就应该是能力。实测确认这是一个真实的**通道缺口**，不是替代方案：

```text
会员消息通道是**会话级**的（memberRef 只认 session 设备或 hostDeviceId），持 node 凭据的远端
智能体**读不到**；本城 installations=0，也没有成员消息。所以主城对"对侧是人/智能体在驱动"的
那类参与者，此前**没有任何通道**。新通道填的就是这个洞。
```

它交的是**请求**、收回的是**报告**，而且城市**明说自己没有验证**：每条被接受的报告都带
`acceptanceAuthority=false` 与 `AGENT_OBSERVATION_NOT_CITY_VERIFICATION`，报告还必须自带证据类别
（`OBSERVED_HERE` / `REPORTED_FROM_ELSEWHERE` / `INFERRED` / `NOT_DONE`）。

**对侧需要做的（一次性，然后按需轮询）：**

```text
1) 在那台机器上准备一个含本分支的 utopia 检出（本分支头：`feat/city-owner-remote-operation`
   @ `66bab47eff42733f71aee5395a4795b234a058f8`，push CI run 37651601378 success）。
   注意：**用一个新节点 id**（例如 dev-alien-agentjob），不要复用旧 agent 的身份——
   否则旧 agent 会先认领这条任务，用它的遗留形状回答，城市会拒绝，任务就卡在 ASSIGNED。

2) 注册（会声明 city.agent-job.v1）：
     node scripts/agent-job.mjs register --url http://172.31.12.151:4310 \
          --node-token <该机器手里的 node token> --id dev-alien-agentjob --display-name "Alien (agent-driven)"

3) 领取（**claim 会先发心跳**：城市在一个心跳超时后会认为节点离线，离线的节点永远不会被派活；
   这正是本轮实测抓到的缺陷之一，久坐的智能体应周期性 claim 或 heartbeat）：
     node scripts/agent-job.mjs claim --state-file <本机一个可写文件>
   退出码 0=拿到任务（stdout 是该任务的完整 JSON，含 jobDigest）；3=当前没有任务（**不是故障**）。

4) 智能体做完后回报（`--state-file` 里记着 jobDigest，所以跨进程也不会答错题）：
     node scripts/agent-job.mjs report --state-file <同一个文件> \
          --state SUCCEEDED --evidence OBSERVED_HERE \
          --summary-file <写好的报告> --artifact name=<本机真实文件路径>
   工件摘要是 CLI 从**真实文件字节**算的；证据类别只有智能体自己能如实声明，CLI 不会替你升级。
```

**现在城市里已经排着一条给对侧的复现任务**（owner 在 Advanced > Agent jobs 可见，也可撤回）：

```text
taskId   Q-b4b7d3c1-12d9-49c6-828e-ff7d832eeaa6
标题     Reproduce the REX-890 study on the opposite host and report inconsistencies
jobDigest dcd8172b05e53f62e72bcc0912d961528a7f3bb4045685a1452c29a204168fe4
截止     2026-10-08T16:22:54.678Z（24h；过期后不再派出，界面照实显示 expired，canonical task 状态不被改写）
定向     **不指定目标**：城市不会为一个它从未见过的身份排队任务（实测 TARGET_DEVICE_UNKNOWN，
         这是创建期硬门）。所以它等的是"任何声明了 city.agent-job.v1 的节点"——
         对侧按上面第 2 步注册后即可领取。开发主机自己的 dev-mega-agentjob 也声明了该能力，
         但本机不会再去 claim 它。
```

**本机（开发主机）在真实城市上的实测**，用于证明通道真的通（不是夹具）：

```text
注册 dev-mega-agentjob → owner 派发 → CLI claim（拿到含 jobDigest 的请求）→ 真做那件事 →
写真实证据文件 → CLI report。城市侧读回：
  task state（城市的词）   COMPLETED
  taken by                 dev-mega-agentjob
  agent state（智能体的词）SUCCEEDED · evidence=OBSERVED_HERE
  validation               valid=true · acceptanceAuthority=false ·
                           AGENT_OBSERVATION_NOT_CITY_VERIFICATION
  artifact sha256          7e8e6fc8badb96a463a9843b86a2649ef0861761dd9d18c396ba0a1c3dfe14de
                           （与独立计算出的同一文件摘要一致）
```

## 5D. 这一轮由"真的跑一次"暴露并已修的缺陷（照实记，不美化）

```text
五个，全部是测试先绿、实机才红的：
① 报告校验的闸门用了**任务的**状态去比**工作**的词汇表：agent 成功时写的是 COMPLETED，
   而闸门里那张表是 SUCCEEDED/FAILED/EXPIRED，于是**最要紧的那条路径整条绕过了校验**。
   由"把报告绑到另一个任务"的测试抓到；现按 canonical 任务词汇表判定。
② 凭据正则以 \b 结尾，而它前面的分支以 _ 结尾 —— `ghp_<token>` 永远匹配不上（真 token 后面
   一定是词字符，它要求的边界根本不存在）。现在每个前缀都写明后面必须跟多少字符。
③ 对侧 CLI 只注册、从不心跳：城市一个心跳超时后判定离线，而离线节点永远拿不到活 ——
   真实机器上这条通道会在注册后静默死掉，且**看起来和"城市没有任务"一模一样**。
   由全量套件里一个浏览器用例在负载下变红抓到（那台机器从 owner 的目标列表里掉出去了）。
   现在 claim 先心跳，并另给 heartbeat 子命令给"正在干活"的机器用。
④ 侧栏是 fixed 且**没有滚动区**，多一个导航项就把 Settings 挤到视口之外，
   而 fixed 盒子不撑高页面、无从滚动 —— 一个点不到的导航项等于不存在的控件（这是 14A 问题，
   不只是排版问题）。由 CEX701 三个用例在隔离环境下全红抓到（修好后快 7 倍）。
⑤ app.js 用 'heading.'+page.toLowerCase() 取标题，而这两个新标题写成了 camelCase，
   于是页面标题**直接显示裸 i18n key**。现改全小写，并由浏览器用例遍历**每一个**导航项守卫。
```

## 5E. 时限警告：trace 对比会随窗口滑过而变成空洞对比（2026-10-08 实测）

```text
包内 raw-pointers.json 点名 206 条 trace 指针。2026-10-08 实测同一条包、同一台城市：
  · 通过城市 API（GET /api/v0/research/trace）：**0/206** 可解析
  · 直接查城市的持久文件 research-trace/trace.jsonl：**206/206 全部仍在**
⇒ 数据没丢，**读不到**。早前一次同样的跑是 170/206；差别只是中间新增记录把旧记录挤出了保留窗口。

机制（读自代码，不是猜）：createTraceCollector({recordLimit=256, byteLimit=2097152})
  内存快照只保留**最新 256 条**；载入时 slice(-recordLimit)，超出即 retentionTruncated。
  快照如实标注 completeness=PARTIAL、retentionTruncated=true、
  counterScope=CURRENT_COLLECTOR_EPOCH_AND_RETAINED_WINDOW。文件已 1.99 MB，接近 2 MiB 轮转点。
  城市**没有说谎**，复现工具也**正确地**没有把它算作 inconsistency。

对本次交接的影响：**已修，时限约束解除。** 城市新增只读接口
`GET /api/v0/research/trace/records?ids=…[&include=records]`（Owner 专属、默认只回存在性、
单次上限 1024 个 id、坏请求 400），按 id 直接从**持久库**取记录；复现工具现在会先问窗口、
窗口答不上的按 id 去问持久库、两者取并集，并在"窗口空了且持久库也问不到"时把该要素标成
**VACUOUS 而不是通过**。修后同包同城实测：`0/206 in window + 206/206 from the durable store`，
exit 0。
仍要如实记的限制：保留窗口本身仍有界（城市照实报 PARTIAL），持久库也有 2 MiB × 一代的轮转上限
（`trace.previous.jsonl`）；只有**更早**的记录才会真正消失，且这由城市自己的 `storeTruncated` 标注。
```

## 5H. 对侧报告点名的两个输入：现在可以给了（2026-10-08 追加）

对侧（Alien）已回一轮：用黑盒夹具证明本机复现工具存在**六条 false-success** 并修复（本机已逐条核对、
原样 cherry-pick 进分支、作者署名保留），自报 `CODE_REPAIR_VERIFIED`；实体复现仍是 `NOT_RUN`，
理由是缺两个输入。补齐方式如下：

```text
① 目标城市有效的 **Owner 配置**（`{"token":"…"}` 的文件）
   **OWNER RULING 2026-10-08**：Owner 选择"带外交付 + 跑完即轮换"，**不**为此新建受限凭据能力
   （受限复现凭据是另一件产品工作，本轮未授权、未实施；见 RESEARCH_MATERIAL_SYNTHESIS.md §7）。
   本机对应文件：C:\ProgramData\Utopia\host\city\local-config.json（内含 token 与 nodeToken）
   · **要交付的那一个文件**（已在本机备好，内容只含 token 一个字段，**不含** nodeToken）：
        4in1-acceptance-2026-10-07/transport/city-owner-config.FOR-ALIEN.json      （44 B）
     请**带外**把它放到 Alien（不要贴进任何记录、提交、聊天记录）；不要提交进任何仓库。
   · 只做复现工具**不需要 node token**；若要顺带领取智能体任务（§5C）才另需它——那是**第二个**凭据、
     第二个决定，本轮不随附。
   · **如实说明这份凭据的能力范围**（读自代码）：control token 是该城的主凭据——可读城市/任务/节点/研究状态、
     建任务、发远程操作（受 allowlist 限制）、改城市名、撤设备、批准入网。**它比"只读+复现"宽得多。**
     所以处置是：**只在对侧跑这一次时给出、跑完立刻轮换**。
   · **轮换步骤（读自 main.mjs，不是臆断）**：`config.token ||= env.CITY_TOKEN || random`，随后写回
     `local-config.json`。因此：把该文件里的 `token` 换成一个新值 → 重启城市即完成轮换；
     换完之后**旧 token 立即失效**，对侧手上的那份作废（本机用旧 token 的客户端需用新 token 重连）。
   · 对侧原先的 401 `Invalid pairing token` 就是因为它手上的 local-config 属于**另一座城**。

② 本机 study 的**原始工件包**（不可用 REX-806 的旧包替换）
   **已于 2026-10-08 随分支进仓**，因此只需 fetch 本分支即可，不必手工递送文件：
       utopia evidence/raw/rex890-dev-study/artifact/          （11 个文件，文件集合固定，原始字节）
       utopia evidence/raw/rex890-dev-study/MANIFEST.sha256    （包外独立清单，覆盖全部 11 个文件）
       utopia evidence/raw/rex890-dev-study/README.md          （来源、两层校验、用法、不声称的事）
   为什么进仓：独立复现必须在**另一台**物理主机上跑，它够不到本机的磁盘；手工递一次就等于把研究结论
   绑在一个手动步骤上。字节随分支走，任何取到分支的机器输入相同。
   收包方**自己核两层**（包内 checksums.json 覆盖 10 个；包外 MANIFEST 覆盖 11 个）。
   离线后备：4in1-acceptance-2026-10-07/transport/rex890-dev-study-artifact.zip（15 785 B）。
   实测：从仓内这份跑复现工具 = 0 inconsistencies · 0 evidenceGaps · reproductionComplete true · exit 0。

拿到后（在含本分支的检出里）：
   node scripts/rex890-opposite-host-reproduce.mjs --artifact evidence/raw/rex890-dev-study/artifact \
        --city http://172.31.12.151:4310 --config <带 token 的文件> --out <输出目录> --label Mera-Alianware
   期望（对同一座城市、在修复后的工具上）：exit 0 · inconsistencies 0 · evidenceGaps 0 ·
   reproductionComplete true；有不一致就按具名条目回报。
   退出码：0=一致 · 1=有不一致（逐条具名） · 2=**工具没跑成或证据没法完整比对**（不是验收）。
```

## 6. 本文件不声称的事

```text
· 不声称 REX-890 已完成：对侧独立复现尚未发生，RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE 未释放。
· 不声称能力已跨两台真实机器验证过：目前只有**本机节点**在真实城市上跑通；对侧节点被正确拒绝。
· 不声称 allowlist 能让被列出的程序变安全：node/python/cmd 都是通用运行时，
  契约保证的是"城市永不插入 shell、永不命名未获准的路径、永不离开声明的工作区、永不无界运行、全部留痕"。
· 不声称 §2 的 workspace 放宽（C:/,D:/）是最终配置：那是发现阶段的临时放宽，正式 study 应narrow 到真实检出目录。
· **不声称智能体任务通道的报告是真的**：城市校验的是形状与"诚实"（证据类别、绑定、自洽），
  不是内容。这正是它另立一条通道、而不是复用远程操作的原因 —— 要"城市能核对的字节"用 §5C 之外的
  远程操作通道。智能体的总结在构造上不可验证，这一点写在每一份被接受的报告上。
· 不声称 §5C 那条已排队的任务会被自动完成：它等的是**对侧先注册**。在那之前它只会安静地排队，
  界面上显示"等待中"，不会给任何形式的假成功。
· 不声称 trace 对比是自动成立的：见 §5E，窗口有界、持久库也有一代轮转上限。修后本机能把 206 条指针
  逐条对上（206/206，其中 206 条来自持久库），但**对侧的**比对仍取决于对侧真的去问；工具会在
  "无从比对"时标 VACUOUS，不标通过。
```
