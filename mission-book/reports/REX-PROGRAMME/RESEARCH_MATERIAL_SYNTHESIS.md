# REX-890 研究素材汇总 / REX-890 RESEARCH MATERIAL SYNTHESIS

```text
汇总者 / compiled by   Mech-DS（MEGA-REP）
时间 / at              2026-10-08
对象 / city            常驻 City 544adda1-3059-4c6f-ae7d-71ddfd0f3b8c @ 172.31.12.151:4310
代码 / code            utopia feat/city-owner-remote-operation @ 00989b6e67bcc99ce6b45133529458bbe0575fe1
                       push CI 37650519705（通道）、37651601378（CLI 以真命令运行）、本头（投递回执）
研究包 / package       4in1-acceptance-2026-10-07/rex890-dev-study/artifact（11 文件，checksums 覆盖 10 个）
结论 / bottom line     **素材已齐备且逐条可追；对侧独立复现仍未发生**，因此
                       RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE **未释放**，REX-890 **未收口**。
```

## 0. 这份文件是什么、不是什么

```text
是      一份**素材汇总**：把 REX-890 已经产出、且每条都带证据指针的东西集中列出，
        并明确标出哪些主张**尚未**被建立。它回答的是"现在能拿什么去做论文"，
        不是"这个研究已经完成"。
不是    · 不是验收结论：对侧主机没有跑过，本文件任何一格都不能读成"已验证"。
        · 不是替代品：真正的验收证据是**对侧主机**的复现报告，见 §6。
        · 不是"零不一致"的自我表扬：§5 记录了一项本轮新测到的、会削弱 trace 对比的事实。
纪律     凡未观测者一律 NOT_OBSERVABLE / NOT_RUN 并写明原因；不填零、不推断、不代替对侧宣布结论（§3 禁自审）。
```

## 1. 被检验的主张（必须可证伪）

```text
C1  一个受控的多设备研究过程，其**结果**能从城市持有的工件包中被**独立重建并重算**，
    而不必相信产出者的叙述。               —— 判据：重算值与包内 metrics.csv 逐项一致
C2  重建必须真的来自城市，而不是读包里的数据集。 —— 判据：篡改包内 dataset 后**重算值不动**（证伪脚本 B）
C3  不一致必须**能被区分**："指标不一致"与"字节不一致"是两件事。 —— 判据：证伪脚本 A 与 C
C4  复现者要能在**自己的机器上**再执行一次，而不是只读数字。 —— 判据：独立 campaign 真跑
C5  跨机通道存在且只做它声称的事：给程序就执行程序（可核对字节），给智能体就交请求收自述（不可核对）。
C6  未测的指标必须是 NOT_MEASURED 且带原因，而不是零。
```

## 2. 素材清单（路径 + 事实）

```text
工件包      4in1-acceptance-2026-10-07/rex890-dev-study/artifact/
            11 文件：manifest · metrics.csv · normalized-dataset.json · raw-pointers.json ·
            checksums.json · reproduction.json · topology.json · environment.json ·
            exclusions.json · failures.json · tables.json
            2026-10-08 独立复核：checksums.json 覆盖的 10 个文件 **10/10 逐字节一致**
包自述      artifact-544adda1-…-5-campaigns：campaigns=5 · runs=15 · measured=15
            4 项有值：completion_time_ms=6532(n=15) · failure_rate=0(n=15) ·
                      duplicate_execution_count=0(n=15) · convergence_missing_event_count=0(n=15)
            23 项 NOT_MEASURED，各自带原因（如 retry_count 不做重复次数、recovery_time_ms 无故障回执）
            3 项 exclusion；包自己写明的复现步骤 5 步
开发主机    4in1-acceptance-2026-10-07/rex890-dev-study/artifact/ 的产出过程：
study       dc/mission-book/reports/REX-PROGRAMME/REX-890_DEV_STUDY_Mech_2026-10-07.md（20/20）
复现工具    utopia scripts/rex890-opposite-host-reproduce.mjs（按包内 reproduction.json 执行，不读报告）
证伪工具    utopia scripts/rex890-falsify-reproduction.mjs（4/4 通过）
本轮复跑    D:\utopia-chat\4in1-acceptance-2026-10-07\rex890-repro-2026-10-08\opposite-host-reproduction.json
通道能力    dc/capability-registry/records/CAP-CITY-REMOTE-OPERATION-001.yaml（给程序）
            dc/capability-registry/records/CAP-CITY-AGENT-JOB-001.yaml（给智能体）
交接        dc/mission-book/reports/REX-PROGRAMME/REX-890_BOOTSTRAP_HANDOFF_Mech_2026-10-07.md
```

## 3. 已确立的事实（每条都指得出处）

### 3.1 开发主机 study：最低 study 的 8 个要素全部由两个**真实 agent** 产出

```text
multi-device execution   6 次重复真的交替落在两台实体机上（各 3 次），assignedNodeId 逐条可查
one routing decision     每次放置都点名执行设备（handoff 在 v1 不可表达，照实记录，不冒充）
one injected fault       fault-593bd9ed-…，kind=PROVIDER_UNAVAILABLE，注入计数 13
                         定向性：被注入设备 claim→HTTP 503，另一台→HTTP 200（只有被注入的那台被拒）
recovery                 recoveryTimeMs=646（读自城市，不是脚本自算）
repetitions              计划 6 / 计入 6 / 实测 6，terminalAccountingComplete=true
one replay               campaign-647b74cd-… COMPLETED，在 dev-1428bce5 上真实执行
one ablation             campaign-12c003ce-… COMPLETED，在 dev-544adda1 上真实执行，
                         且**消融真的改变了放置**（源 dev-1428bce5 → 消融后 dev-544adda1）
artifact export          artifact-544adda1-…-5-campaigns；独立校验器（第二实现，不 import 导出器）**15/15**
未测                     fault detectionTimeMs=null（typed NOT_MEASURED，理由：该故障拒绝的是认领而非心跳）
```

### 3.2 复现工具：2026-10-08 在本机对**常驻城市**复跑（exit 0，0 inconsistencies）

```text
包完整性     VERIFIED over 10 files
重建         从 5 份回执重建出 15 条 run 引用（包声明 15）；每条都带
             receipt 指针 + canonical task 引用 + taskState=COMPLETED + 真实 assignedNodeId
重算         completion_time_ms=6532(n=15) · failure_rate=0(n=15) · duplicate=0 · convergence_missing=0
比对         四项**全部 agrees**；每条有值指标都带 provenance；包声明的 3 项 exclusion 本机也不主张
canonical    task 指针 22/22 仍存在于城市；run→task 连接 15/15 仍可解析
独立执行     campaign-2c6001e0-68… COMPLETED，6 条 run 全部 MEASURED，逐条落在两台实体机上
权威声明     authority = "REPRODUCTION_EVIDENCE_ONLY"（工具自己拒绝冒充验收）
```

**必须说清的一点**：这一次是通过工具在本机（开发主机，`--label Mega-rep`）跑的，用于证明**工具与素材仍然可用**。
工具名字里有 "opposite-host"，但**这一次不是对侧复现**，不能当作 §C1 的验收证据。见 §6。

### 3.3 证伪：不通过的检查不算检查

```text
A  改 completion_time_ms **并刷新校验和**（于是包自洽）
   ⇒ 工具 exit 1 且逐条具名；与此同时包仍然通过它自己的 checksum 校验
   ⇒ 证明"指标不一致"与"字节不一致"能被区分
B  **只**改包内 normalized-dataset.json 并刷新校验和
   ⇒ 重算值**不动**（仍 6532），0 inconsistencies、exit 0
   ⇒ 证明工具是**从城市重建**数据集，而不是读包里那一份
C  改 metrics.csv 但**不刷新**校验和 ⇒ exit 1，packageIntegrity=BROKEN 并具名到文件
工具自身也错过一次（篡改正则漏 multiline 标志 ⇒ 两次替换静默无效 ⇒ 误把工具报成失败），已修并复跑 4/4。
```

### 3.4 两条跨机通道（能力本身也是研究素材）

```text
(a) 给程序   CAP-CITY-REMOTE-OPERATION-001（DIRECT_CONTROL，WEB）
             无 shell 的声明式 argv、按名 allowlist、工作区受限、有界、审计、默认关闭、typed 拒绝，
             回执由城市按同一份冻结 operation 复核 ⇒ 字节可核对
(b) 给智能体 CAP-CITY-AGENT-JOB-001（DIRECT_CONTROL，WEB+CLI）
             提交 / 查询 / 取消 / 回收 / **消耗回执**；报告必须自带证据类别，
             且每条被接受的报告都带 acceptanceAuthority=false + AGENT_OBSERVATION_NOT_CITY_VERIFICATION；
             凭据按**键名**先拒（记录不是秘密仓库）
             2026-10-08 在**实机城市**上真跑通一整轮：
               注册 dev-mega-agentjob → owner 派发 Q-1ca5c39f-… → CLI claim → 真做那件事 →
               写真实证据文件 → CLI report → 城市读回 COMPLETED / SUCCEEDED+OBSERVED_HERE /
               valid=true·acceptanceAuthority=false / 工件 sha256 与独立计算一致
```

## 4. 方法学：这些数字为什么是**可复核**的，而不是被相信的

```text
每一个数字都能被第三方重新走一遍，且路径是**声明式**的：
  · 包自己写明复现步骤（reproduction.json 的 5 步），工具执行的是它，不是读报告
  · 重建是**连接**出来的：回执 run 按 result.taskRef 接到 canonical task；指针随包发布（raw-pointers.json）
  · 重算是**按包声明的定义**做的（中位数/比率/重复归属/缺失计数），不是复述导出器的实现
  · 每个工件带 sha256；包整体带 checksums.json；工具自己声明 authority=REPRODUCTION_EVIDENCE_ONLY
  · 不可测就写 NOT_MEASURED + 原因（23/27 项如此），并且**拒绝**用 0 顶替未知窗口
  · 检查本身会被证伪（§3.3），包括"改包但不动城市"与"改包并刷新校验和"两种
```

## 5. 本轮新发现：**trace 数据比 trace 读窗口活得久**（会削弱 trace 对比这一要素）

```text
事实 A（可复核）  包内 raw-pointers.json 点名 206 条 trace 指针（形如 trace:<uuid>）。
                 2026-10-08 实测：
                   · 通过城市 API（GET /api/v0/research/trace）：**0/206** 可解析
                   · 直接查城市**持久文件** research-trace/trace.jsonl：**206/206 全部仍在**
                 ⇒ 数据没丢，**读不到**。
事实 B（机制）    createTraceCollector({recordLimit=256, byteLimit=2097152})
                 · 内存/快照只保留**最新 256 条**；载入时 slice(-recordLimit)，超出即 retentionTruncated
                 · 快照自己如实标注 completeness=PARTIAL、retentionTruncated=true、
                   counterScope=CURRENT_COLLECTOR_EPOCH_AND_RETAINED_WINDOW
                 · 文件 1.99 MB 已接近 2 MiB 上限，即将轮转为 trace.previous.jsonl（仍只保留一代）
事实 C（前后对比）同一条包、同一台城市：早前一次跑 **170/206** 可解析；本轮 **0/206**。
                 差别不是代码，而是**中间新增的记录把旧记录挤出了保留窗口**。
事实 D（工具行为）工具因此写出 traceRecords{presentInCityTrace:0, cityTruncated:true,
                 cityCompleteness:PARTIAL}，且**不**把它算作 inconsistency——
                 因为城市没有声称自己完整。这条判断是对的。
后果              工作书点名的"对比 trace/provenance"这一要素，在窗口滑过之后会变成**空洞对比**：
                 它仍会给出 0 inconsistencies，但那是"无从比对"，不是"比对通过"。
```

**这不是本轮引入的缺陷，也不是城市在说谎**；城市明确标注了 PARTIAL。它是"包与城市对保留期的约定不一致"：
包把 206 条指针当作可长期解析的引用发布，而城市只提供最新 256 条的读窗口、且**没有按 id 取记录或分页回溯的接口**。
对 REX-890 的影响必须写在明处，见 §6。已有的三条出路（择一即可，需 Owner 决定）：

```text
1  对侧在**窗口尚未滑过**时跑（即 study 之后尽快）——最简单，但把结论绑在时间上，必须写明
2  对侧在有权限时**直读持久文件** trace.jsonl 做对比（数据在，需城市宿主访问权）
3  城市新增"按 id 取 trace 记录 / 回溯分页"的读接口（真正的产品缺口，属新工作）
```

## 6. 未确立的事（**不得**读成已完成）

```text
NOT RUN   对侧主机（Alien / Mera-Alianware）的**独立复现**：未发生。
          城市里已为它排好一条不指定目标的复现任务 Q-b4b7d3c1-12d9-49c6-828e-ff7d832eeaa6
          （digest dcd8172b…，24h）；它等的是"任何声明了 city.agent-job.v1 的节点"。
          §C1/C4 的对侧验收因此**未建立**。
NOT RUN   两条通道都**未在两台真实机器之间**验证过：能力 (a)(b) 只在"真实城市 + 本机节点"上跑通，
          对侧节点被正确拒绝（具名 NODE_MISSING_CAPABILITY），这不是验收。
NOT RUN   trace 对比这一要素：见 §5，目前只能给出"无从比对"，**不得**记为通过。
NOT 释放  终标 RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE 未释放、未满足、不可主张。
禁自审    §3：对侧的结论只能由对侧宣布。本文件不代替对侧写任何结论，也不预写它的措辞。
NOT 验收  本文件 authority=SYNTHESIS_OF_EXISTING_MATERIAL，本身不是任何一项的验收证据。
```

**final gate 的当前状态**：study（本机）✅ · 复现工具与证伪 ✅ · 工件包完整可复核 ✅ ·
**对侧独立复现 ❌（未发生）** · exact-head CI ✅ · exposure gate ✅（两条能力各有记录）⇒ **未满足**。

## 7. 唯一剩下的动作

```text
对侧（Alien）按 dc/mission-book/reports/REX-PROGRAMME/REX-890_BOOTSTRAP_HANDOFF_Mech_2026-10-07.md
的 §5 或 §5C 二选一跑一次：
  §5   换用含本分支的 reference agent ⇒ 城市把排队操作派过去（交的是**程序**，字节可核对）
  §5C  用 scripts/agent-job.mjs register/claim/report 接活（交的是**请求**，回收**自述**）
跑完把报告交回；在收到之前，REX-890 不收口、终标不释放。
**并请注意 §5 的时限**：若走 §5C 且想要 trace 对比有效，应在窗口滑过前跑，或改走 §5 的直读文件路线。
```

## 8. 变更历史

```text
2026-10-08  首版：汇总素材、逐条标注证据与未建立项；新增 §5 的 trace 读窗口发现（本轮实测）。
```
