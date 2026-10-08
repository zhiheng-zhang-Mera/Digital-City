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
**trace 注**  本节那次实测是 206/206（持久库）。**当天稍后同一包同一城市变成 0/206**——保留期滚过了那批记录，
             详见 §5I。这一行是**带日期的实测**，不是持续成立的性质；引用它时必须连 §5I 一起引。
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
包把 206 条指针当作可长期解析的引用发布，而城市只提供最新 256 条的读窗口。

**已修（2026-10-08，同一轮内）**：城市新增**按 id 从持久库取记录**的只读接口
`GET /api/v0/research/trace/records?ids=…[&include=records]`（Owner 专属、默认只回存在性、单次上限 1024 个 id、
坏请求是 400 而不是 500），它**只回答被问到的 id**，并明确 `storeScope=DURABLE_TRACE_FILES`。
复现工具改为：窗口能答的先用窗口，窗口答不上的**按 id 去问持久库**，两者取并集；
并把"窗口空了、持久库也问不到"标成 **VACUOUS**（无从比对），不再让 0/206 看起来像比对通过。

```text
修前（同一包、同一城市、同一天）：0/206 in window，工具报 0 inconsistencies
修后：0/206 in the retained window, **+206 resolved from the durable store = 206/206**，
      0 inconsistencies，exit 0
⇒ trace/provenance 这一要素现在是**真的比对过**的，而不是"无从比对"。
⇒ 保留窗口仍然是有界的（城市照实报 PARTIAL）——修的是"读不到"，不是"保留期"。
```

对 final gate 的影响：原先"对侧必须在窗口滑过前跑"的**时限约束已解除**；现在对侧任何时候跑，
都能把 206 条指针逐条对上（数据在持久库里）。残余限制只有：持久库仍有 2 MiB × 一代的轮转上限
（`trace.previous.jsonl`），更早的记录才会真正消失——这一点仍由城市自己的 `storeTruncated` 如实标注。

**另一条如实记录的残余限制（本轮实测，未证明为丢记录）**：城市关闭时给 trace 落盘的是**有界预算**
（`researchTrace.close(100)`，即最多等 100 ms）。因此 `close()` 返回**不等于**"已经落盘"。
在全量负载下本机两次见到 Windows 拒绝删除临时目录（`ENOTEMPTY`，即关闭返回时仍有句柄未释放），
出在**测试清理**处、且断言本身全部通过。这**不足以**断定发生过 trace 记录丢失（未观测到计数缺口），
但足以说明：若要把"关闭前的最后若干条"当作研究素材，必须在关闭前显式 `flush` 并检查其返回值，
而不是假定关闭已经落盘。

## 5F. 对侧已回一轮：它找出并修掉了本机工具的六条 false-success，本机又修掉它引入的一条 false-inconsistency

```text
这是工作书点名的那一步（"指出不一致 → 修复后再复现"）**第一次真的发生**，而且是双向的。

对侧（Alien / Mera-Alianware，作者 Alien-codex）在基线 2d56f27 上做了代码验证，用**真实 CLI 黑盒 + 临时
HTTP/WS 夹具**（不是实体城市，报告里也这么写）证明本机的复现工具存在**六条"证据不全却 exit 0"的路径**，
并修复为 7/7：
  ① 包里有数字、重算为 null      → 修前 `agrees`/exit 0；修后具名不一致/exit 1
  ② 必需指标行整行缺失           → 修前只记 note/exit 0；修后具名不一致/exit 1
  ③ 已测指标值非数字             → 修前 `agrees`/exit 0；修后具名不一致/exit 1
  ④ 独立 campaign 是 FAILED      → 修前 attempted=true/exit 0；修后终态不一致/exit 1
  ⑤ 独立 campaign 少了重复次数   → 修前 exit 0；修后重复/设备证据不一致/exit 1
  ⑥ trace 窗口空且持久库读不到   → 修前**只记 VACUOUS note、仍 exit 0**；修后记 evidenceGap、
                                    reproductionComplete=false、**exit 2**
另新增：重建 run 总数与包声明比对；缺失证据保持"不可验证"，不伪造成数据不一致。

**本机逐条核对，六条都成立**（其中 ⑥ 尤其打脸：我在自己的提交信息里刚写过"无从比对 ≠ 比对通过"，
却没有把它写进退出码）。已把该修复**原样 cherry-pick 进本分支，作者署名保留**（0907b12 / Alien-codex）。

然后本机把修复后的工具**对真实城市**跑了一遍，得到一条它自己引入的 **false-inconsistency**：
  `independent runs without completed measured device evidence`
而它指的那 6 条 run 全是 `state:"MEASURED"`、`measured:true`、各自带真实 `assignedNodeId`。
根因：**两种词汇表被混用**——回执里的 run 是 `MEASURED`，canonical task 的状态在下一层 `result.state`（`COMPLETED`）；
那条检查却问 run 要 `COMPLETED`，于是**每一条健康 run 都被判为不一致**。
（与本分支早先修过的"拿任务状态去比工作词汇表"是同一类错误。）
为什么它的用例抓不到：它的夹具给 run 写的是 `state:'COMPLETED'` 且没有 `result.state`——**夹具不像真东西，
测试就不可能失败**。已修：run 与 task 各按自己的词判定；夹具改成真实回执形状；并新增一条反向用例
（run 的 task 未完成 → 必须非零）。
修后同包同城实测：`inconsistencies: 0`、`evidenceGaps: 0`、`reproductionComplete: true`、exit 0，
独立 campaign COMPLETED（6 次重复、两台设备）、trace 206/206 由持久库解析。

⇒ 材料意义上：**复现工具的"0 inconsistencies"现在是被证伪过的**（正例可过、六条拒绝路径各自为红、
词汇表两侧都钉住），而不是一个不会失败的检查。
```

## 5G. 跨机能力是**系统级**的，不绑死这两台主机（Owner 要求，已做成受检属性）

```text
审计结果（先查后说）：能力本体**本来就没有主机绑定**——contracts/ services/ apps/ agents/ 里
没有部署设备 id、没有主机名、没有主机地址，机器名只出现在解释性注释里。
真正存在的绑定在**验证工具**里，已修：
  · scripts/rex890-falsify-reproduction.mjs 原先把 City 地址与检出路径写死成一台主机的值，
    于是"证明工具会失败"实际上只对写它时那两台机器成立。现在全部是入参/环境变量，
    缺一个就**具名拒绝（exit 2）且不跑任何用例**——比"因为没地方跑而报告未被证伪"要诚实。

已做成**受检属性**（tests/capability-host-independence.test.mjs，3 项；两侧都做过证伪）：
  · 源码侧：能力表面不得含部署身份，也不得用 hostname 比较来做任何决定；
    任务类型→能力的词表必须是**带版本的能力名**（如 city.agent-job.v1），不是机器名。
  · 行为侧（agent-job）：**三个** id 与任何部署无关的节点（node-alpha/bravo/charlie）各领一条任务；
    并有**反例控制**——一个同样任意命名、但**没有声明该能力**的健康节点，必须**什么都拿不到**。
    若资格是按名字或名录决定的，它就会被当成 worker。
  · 行为侧（远程操作）：两个任意 id 的 agent、各自工作区、各自被点名、各自真的跑一个程序，
    并断言"被点名的那个才是真的执行者"。
为什么是三个而不是两个：两个是这套部署的形状，而这里要保护的恰恰是"两个并不特殊"。

残余（如实）：CHK 与 DGX 两个**别的系列**的验证脚本仍以 `hostname()==='mera-alianware'` 判断
"哪台是开发主机"（scripts/chk-second-host.mjs、scripts/verify-dgx-series.mjs），
以及 scripts/export-research-artifact.mjs 仍有写死的 City 地址。它们不属于本能力，
改它们会削弱那两套独立性守卫，因此**记录而不在本分支改**，建议各自单独立项。
```
## 5H. 一条"被误判成负载"的真缺陷：页面每 4 秒、且**每个城市事件**都会重画（2026-10-08 修）

```text
现象   两条 Owner 界面的浏览器用例在**全量套件下**偶发 "element is not visible"，隔离跑就绿。
       前几轮我一直把它记成"负载敏感的环境因素"——**记错了**。
机制   app.js 的 `refresh()` 结尾调用 `render()`，而 `refresh()` 由 4 秒定时器**和每一条 WebSocket 事件**
       触发。于是整个页面在 Owner 使用期间被反复重建；重建会把 `<details>` 的 open 状态和**焦点**丢掉。
       实测后果：Owner 打开危险区、把闸门要求的那句确认**正在输入**，区域在他手底下合上了——
       控件还在、还对，但**够不到**。在派发闸门上，这就是"Owner 确认了"与"Owner 无法确认"的区别。
为什么像 flake   负载只改变"4 秒那次 tick 落在测试中间"的概率，不改变缺陷本身。
修复   apps/web/view-persistence.js：把打开状态放进**视图状态**并重新发成属性；重建前记下焦点字段与光标位置、
       重建后恢复（且**只**恢复本视图自己的字段——重建不许把焦点从页面别处抢回来）。两条界面都改。
证据   tests/web-surface-rebuild-persistence.test.mjs：**不等定时器**，而是制造一次**真实城市事件**
       （建一个任务 ⇒ WebSocket 推送 ⇒ refresh ⇒ render），并且只统计**整页重建**
       （观察 `#view` 的直接子节点变化，视图自己刷行不算）。要求：区域仍开着、输入还在、字段可见且仍聚焦、
       光标停在原处。已证伪：撤掉修复 ⇒ SURFACE-PERSIST 1 以
       "a rebuild must not close a region the owner opened" 变红。
一条自省   该用例最初把光标位置写成手算的偏移量，结果**败在自己的算术上**——测试也会以"看起来像缺陷"的方式出错。
       改成"重建前后必须一致"之后才是它该测的性质。
```

## 5I. **包比它所指向的城市状态活得更久**：trace 保留期已把那 206 条挤出去了（2026-10-08 当天实测）

```text
同一天、同一包、同一城市，三次实测：
  2026-10-08 约 11:45   窗口 0/206 + 持久库 **206/206** ⇒ 该要素当时**真的比对过**
  2026-10-08 约 12:16   窗口 0/206 + 持久库 **0/206**  ⇒ 保留期已滚过那批记录
  机制（磁盘实测）      trace.previous.jsonl 正好 **2 097 096 B**（= byteLimit 2 MiB），trace.jsonl 272 683 B；
                       窗口仍是 256 条、城市自己报 completeness=PARTIAL / retentionTruncated=true。
  追因                  **本机当天为验证工具而反复复现**，每次写入 22+ 条 trace 记录，把 study 的 206 条
                       挤出了"当前 + 上一代"这个有界保留（这就是它自己的仪器造成的损耗，照实记）。
  能否找回              查过城市备份 previous-city-20261007-194534：其 trace 最新记录为 2026-10-07T08:39:32Z，
                       而 study 的记录在 13:45Z 之后 ⇒ **备份里 0/206**；城市两代里也 0/206。
                       ⇒ 就本机可达的存储而言，**那 206 条记录已经真的没了**，无法补写进包。

这条事实的重要性不在"少了一条证据"，而在它是一句关于**可复现性**的普适结论：
  **一个工件包可以把指针发布得比它所指向的城市状态活得更久。** 包发布 206 条 trace 指针时，
  没有声明这些指针的有效期；城市的 trace 保留是有界的；于是"随时可复现"这个隐含承诺是有期限的，
  而期限**没有写在包里**。

工具因此改进（不是掩盖）：gap 现在**具名原因**，三种成因区分开——
  TRACE_STORE_UNREADABLE / TRACE_RETENTION_PASSED_THE_POINTERS / TRACE_RECORDS_PARTLY_MISSING，
  并带上城市自己的 `cityTruncated` 与 `cityCompleteness`。当前实测 gap =
  `{reason: TRACE_RETENTION_PASSED_THE_POINTERS, listed: 206, resolvable: 0, cityTruncated: true, cityCompleteness: PARTIAL}`
  ⇒ `reproductionComplete: false`、**exit 2**。**不会被读成"通过"，也不会被读成工具故障。**

对 final gate 的直接影响（必须由 Owner 决定，见 §7）：
  工作书要求对侧"对比 trace/provenance"。就**这一份包**而言，该要素**已不可能完成**——
  不是对侧不努力，而是记录已不在任何可达存储里。
  可选的出路：(1) 接受这一条**具名且已解释**的 gap，其余各项完整可比；
              (2) 另做一次 study，并在**导出时把 trace 记录一并写进包**（否则同样会过期）；
              (3) 城市侧把 trace 保留做长（更大的 byteLimit / 多代保留），但这**救不回**已经滚掉的记录。
```

## 6. 未确立的事（**不得**读成已完成）

> 2026-10-08 追加：对侧的**流程在开发主机上彩排过**（全新 clone + 无依赖 + 交付的凭据文件 + 原样命令
> ⇒ 0 inconsistencies / evidenceGaps 0 / reproductionComplete true / exit 0），
> 但那**只证明流程可用**，产物 label=Mega-rep-procedure-rehearsal、hostname=Mega-rep，
> **不能**当作对侧独立复现的证据。把工具修好、把流程彩排通，都不等于独立性成立。

```text
已发生（对侧自己声明的）  对侧已做**代码验证**：用黑盒夹具证明本机工具六条 false-success 并修复（见 §5F），
                        自报 `CODE_REPAIR_VERIFIED`，并明确写了"这些是测试，不是实体城市证据"。
                        这是**它对自己那份工作的结论**，本机只核对代码与复跑，不替它宣布更多。
NOT RUN   **实体独立复现**：仍未发生。对侧报告的原话是 `PHYSICAL_REPRODUCTION_NOT_RUN`，
          并列出了它缺的两个输入：① 目标城市有效的 Owner 配置（它的 local-config 属于另一座城，请求得 401）；
          ② 本机 study 的**原始包**（不在它取到的 Git 树里）。
          它没有注册节点、没有 claim、没有 report、没有替换常驻 agent —— 与"未发生"一致。
          城市里仍排着那条不指定目标的复现任务 Q-b4b7d3c1-12d9-49c6-828e-ff7d832eeaa6。
NOT RUN   两条通道**未在两台真实机器之间**验证过：能力 (a)(b) 只在"真实城市 + 本机节点"上跑通。
NOT 释放  终标 RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE 未释放、未满足、不可主张。
禁自审    §3：对侧的结论只能由对侧宣布。本文件不代替对侧写任何结论，也不预写它的措辞；
          同理，本机对复现工具的凭证（§5F 的六条）也已由对侧独立复核过一轮。
NOT 验收  本文件 authority=SYNTHESIS_OF_EXISTING_MATERIAL，本身不是任何一项的验收证据。
```

**final gate 的当前状态**：study（本机）✅ · 复现工具与证伪 ✅（且已被对侧证伪过一轮，§5F）·
工件包完整可复核 ✅ · **对侧实体独立复现 ❌（未发生）** · exact-head CI ✅ · exposure gate ✅
（两条能力各有记录，且已做成**受检的**主机无关属性，§5G）⇒ **未满足**。

## 6B. 工作书点名要的最终素材内容（逐项，全部读自实测；缺项就写缺）

### 6B.1 experiment / run / failure 计数

```text
包内（study 本体，随分支进仓）   5 campaigns · 15 runs · 15 measured · failures.json 为空（0 失败）
城市到今天 2026-10-08 全量        **29 份 campaign 回执**（receiptWindow total=29 limit=50 truncated=false）
  状态      28 COMPLETED · **1 REFUSED**
  逐项汇总  计划 159 · 计入 153 · 实测 153 · warmup 0 · timedOut 0 · failed 0
            · excluded 0 · cancelled 0 · skipped 0 · interrupted 0
  对账      159 − 153 = 6，正是那份 REFUSED 的 6 条计划——**它一条都没跑，所以一条都没计**，
            且它 terminalAccountingComplete=false（29 份里**只有它**为 false）。
            ⇒ 拒绝被如实报成拒绝，**没有**被写成"零失败的成功"。
  那份拒绝  campaign-6425e1be-0a46-4fec-a942-cb1a01742bca · reason=**TOPOLOGY_NOT_READY**
            · planned 6 / accounted 0 · 未声称完成
  场景      29 份全部是 WAIT（研究系列 v1 的 supportedScenarios 只有 WAIT，见 §3.1 的实测记录）
  说明      这 29 份包含开发主机自己的 study 5 份 + 此后每一次独立复现各 1 份（含本机彩排）。
            **包内 5 份才是 study 本体**；29 份是城市当前的全量，两者不要混读。
```

### 6B.2 defect taxonomy（按"这是谁的错"分类，不按严重度）

```text
产品缺陷（真缺陷，全部已修，每条都有"没修就变红"的测试）
  · 派发资格对所有任务类型用同一份能力清单 ⇒ 旧 agent 被派了它从未被问过的问题（d11b03d）
  · 报告闸门拿**任务**状态比**工作**的词汇表 ⇒ agent 成功那条路径整条绕过校验（712d919 的同类，见 §0G-1①）
  · 凭据正则 `\b` 结尾 ⇒ 真实 `ghp_` token 永不匹配
  · 对侧 CLI 只注册不心跳 ⇒ 一个心跳超时后通道静默死掉，且看起来像"城市没任务"
  · CLI 入口守卫在 Windows 下 **什么都不做却退出 0**
  · 固定侧栏无滚动区 ⇒ 多一个导航项就让末条导航不可点
  · 页面标题 key 大小写不符 ⇒ 标题渲染成裸 i18n key
  · **每次城市事件/每 4 秒整页重建** ⇒ Owner 正在输入的危险区在他手底下合上（§5H）
  · **作业记录只对 `inputs` 扫凭据形状**：`instruction` / `purpose` / `title` / `expect` 都会被持久化却不扫
    ⇒ 把 token 写进指令就被**接受并存在城市记录里**（实机实测坐实；f0295bc 修为四字段同治，具名拒绝）
  · **两条跨机通道的开关只存在于环境变量**：`local-config.json` 不存、reservation 的 `startup` 记录里也没有，
    而 `restart-gateway.ps1` 只重放那份记录 ⇒ **按官方方式重启会把两条通道静默关掉**，
    对侧的请求会被当成"owner 从没打开过"而拒绝（05ae385：记录带上 + 脚本重放 + 整来回断言）
  · 契约头注释说 bounds 是 **"clamped"**，代码却是**具名拒绝** ⇒ 调用方会按一个不存在的保证去设计（3bc1bbf，注释缺陷）
测量/工具缺陷（错的是检查本身，不是被测对象；全部已修）
  · 复现工具**六条 false-success**：证据不全却 exit 0（对侧找到并修，见 §5F）
  · 该修复引入**一条 false-inconsistency**：拿 run 的 MEASURED 去比 task 的 COMPLETED（本机对真实城市找到并修）
  · 该修复的**夹具不真实**（run 写成 COMPLETED、无 result.state）⇒ 测试不可能失败
  · 证伪脚本篡改正则漏 multiline ⇒ 两次替换静默无效，却把工具报成失败
  · dev-study 脚本取数路径 2 处（读 list 而非 detail；读 started 而非 live）⇒ 把字段错误误报成产品拒绝
  · 全仓测试清理竞态：Windows `rm` 遇仍打开的句柄 ENOTEMPTY（**118 处 / 52 文件**，本轮只修自己的 2 处）
  · study 仪器把**故意跳过**记成 FAIL（城市里有排队作业时定向性探针故意不跑）⇒ 假报 20/21；改记 NOT_RUN
  · 复现测试与 launcher 测试把**环境前置条件不满足**当失败：脏工作树、活动城市占着协调位 ⇒ 假红；
    改记 NOT RUN + 原因（CI 干净检出/无驻留城市，门照旧真跑）
  · 我的对侧监视器**连错三次**，每次都是"信号分不清它要检测的东西"：
    ① 与**布防瞬间**的在线集合做差，而对侧当时正好在线 ⇒ 它回来永远不触发；
    ② 任何节点上线都算"进入" ⇒ **我重启自己的城市**会被报成对侧进入（实测只差一轮就误报）；
    ③ `gh api` 对不存在的文件把 **404 的 JSON 正文打到 stdout 并 exit 1**，而判据是"有输出就算存在"
    ⇒ 假报 **"对侧结论已到"**，还把报错文本当 SHA 打出来。现判据 = 调用成功 **且** 输出是 40 位十六进制
    ④ 加"远端分支"监视后，**本机自己的推送**被报成"对侧进入"（`feat/city-owner-remote-operation` 与 `dc main`
    都是本机在推）⇒ 现在把本机自己的分支排除在判据之外，只作为备注列出。
    **四次都是同一个形状：监视器分不清"它要检测的东西"与"它自己造成的东西"。** 这条比任何单次修复都值得记。
  · **五份实机探针都把结果写在自己旁边**（也就是写进检出里）⇒ **每次运行都把工作树弄脏**，
    而复现工具把**脏工作树**如实记为 evidence gap ⇒ exit 2。最刺眼的是那次**只读预检**：
    它被设计成"在复现**之前**跑 30 秒"，却会让紧随其后的复现因为树脏而失败 —— **我自己给的顺序建议本身是陷阱**。
    已改为结果默认写到系统临时目录、`--out` 才落盘；实测五份探针仍全绿（21/21 · 9/9 · 8/8 · 12/12 · 7/7）且工作树保持干净，
    并加了一条守卫："任何探针不得默认把结果写进检出"。**这也是同一个形状**：仪器改变了它正在测的东西
    （对复现而言，工作树就是被测对象的一部分）。
  · live-probe 自己的 row 投影漏掉审计字段 ⇒ 健康的城市被报成"审计缺失"（新加 7 条检查时第一版 20/21）
外部故障（与产品无关）
  · GitHub Git Operations 事件：utopia 与 Digital-City **两个仓库同时**被服务端 500 拒绝推送
    （Request ID DDC5:C6B1:238983:2FA600:6AC679C6，16:56Z；读操作与 API 正常）；第 4 轮重试两个仓库同时成功
  · CI runner 负载造成的假红：同一个**只加证据文件、零代码改动**的头 `0033c12` 两次失败，且**两次失败的用例不同**
    （先 `mon901-observation` 的 ENOTEMPTY 清理竞态，后 `JOIN-501` 32.0s 与 `REX807 S11` 47.0s 两个长浏览器用例）；
    第 3 次重试同头**全绿**。分类为环境（不是产品缺陷），并把"判为负载"这一步本身做成**可证伪**的：
    无代码改动而重试成功，正是负载预测的结果，也正是"证据文件引入缺陷"会否证的结果
先存缺陷（**未修**，记录在案，属历史）
  · 编码损坏：UTF-8 被当 CP936 解码后再存回（utopia 15 文件 + DC 6 份文档）；`origin/main` 与本分支签名相同
我自己的错（照实记）
  · 把"整页重建丢状态"**误判**成"负载敏感的环境因素"，连续几轮这么记（§5H 已纠正）
  · 曾把 mojibake **二次损坏**带进 server.mjs（经 PowerShell 管道），提交前用非 ASCII 集合比对发现并修回
  · 复现工具把软件身份**写死**成 185d043e 并在城市回执里渲染 `exact:true`，而实际跑的是别的头（§本轮修复，已修）
  · **为验证工具而反复复现，把 study 的 206 条 trace 记录挤出了有界保留**（§5I）——
    不是别人的错，是这台机器的仪器损耗；已如实记录，并让工具把这种 gap **具名**而不是含糊报"不完整"
  · **把短 SHA 扩写成"完整 40 位 SHA"写进能力登记**（编造）：发现后立刻用 `git rev-parse HEAD` 的真实输出替换。
    这条列在这里而不是删掉，因为"只认从 git/CI 输出粘贴的完整 SHA"正是本系列自己的纪律
  · 改记录时**两次用"替换"代替"追加"**，把已有条目删掉（每次都恢复）；一次还留下 JSON 尾逗号语法错误
    （用解析器定位后修好）。教训：改记录前先看条目边界，改完必须解析一次
产品/包设计缺陷（**未修**，属新工作）
  · 工件包发布 206 条 trace 指针，却**没有声明这些指针的有效期**；城市的 trace 保留有界
    ⇒ "随时可复现"的隐含承诺有期限，而期限没写在包里（§5I）。方向：导出时把 trace 记录**一并写进包**，
      或让包声明 `pointerLifetime`（并让复现方知道何时必须重导）
  · **无目标的 AGENT_JOB 任何声明了该能力的节点都能领，而 `/node/claim` 只能传节点 id、不能传任务 id**
    ⇒ 一次例行 claim 就可能把对侧的交接请求吃掉。本轮**操作上**已消除（那条作业改为严格指向对侧设备，
    实测 `targetDeviceRef = dev-1428bce5…`、`targetStateAtCreation = OFFLINE`），但**产品侧仍是缺口**：
    在没有"只能由某台机器领"的机制前，"发给某一台机器"这件事只能靠创建时就指名，而指名又要求那台机器**已经注册过**
    （`TARGET_DEVICE_UNKNOWN`）。方向：让 claim 能指名任务，或给作业一个"只有目标节点可领"的显式模式。
  · **"记录里不该有凭据" 与 "不抹历史" 在这里直接冲突**：修复前写入的两条作业记录仍带（**假的**）凭据形状，
    撤销作业并不抹掉记录。本轮选择**列出来**而不是删除，并把冲突本身记进登记 known_gaps
  · **导出器与列表视图共用同一个有界回执窗口**（`receiptLimit` 默认 50，实测城市 `total 52 / limit 50 /
    truncated true`）：窗口一满，**导出就整体拒绝**（`RECEIPT_WINDOW_TRUNCATED` —— 诚实，但导出功能事实上不可用），
    而列表视图只显示窗口内的条目。**真正的解法是分页或按 id 读**（复现工具本来就是按 id 取每条 campaign 的，
    所以它**不受窗口影响**：41/41 照读），**不是把窗口调大** —— 调大只是把同一个问题推后。
    这是"有界读窗口"在本系列里的**第二个实例**（第一个是 trace：数据在、读不到）。
```

### 6B.3 review-only findings（要人判断，不是改代码能解决的）

```text
1  trace 读窗口 vs 包的保留期约定：已加"按 id 从持久库取记录"的只读接口（0/206 → 206/206），
   但持久库仍有 2 MiB × 一代轮转上限；更早的记录会真的消失。要不要延长保留期是策略决定。
2  复现主机**必然持有 owner 级凭据**（复现要读整份研究状态并自己发起 campaign）。
   Owner 已裁决"带外交付 + 用完轮换"；"只能读+复现、不能管理"的受限凭据仍是缺口（新授权面）。
3  全仓测试清理竞态 118 处 / 52 文件：一次机械修复即可，但会动 50 个与本能力无关的文件 ⇒ 宜单独立项。
4  编码损坏 15 文件 + 6 份：属先存历史，修它会把无关文件塞进本分支；建议单独立项（CP936 逆变换 + `?` 丢字节处人工判定）。
5  CHK / DGX 两个系列的验证脚本仍以 `hostname()==='mera-alianware'` 判断"哪台是开发主机" ⇒
   与本系列已做成受检属性的主机无关性不一致；改它们会削弱那两套独立性守卫，宜各自立项。
6  **两条跨机通道的 exposure gate 要 Owner 亲自给 PASS**：两份能力登记的 `evidence.review_refs` **仍是空的**，
   而 §3 禁止自审。本机已把 §14A.5 五字段、六项独立检查各自指向的证据、以及"仍未建立"的事项汇成
   `reports/REX-890/EXPOSURE_GATE_PACKET.md`；**要不要 PASS、以及 PASS 的措辞，是人来决定的**。
7  **claim 不能指名任务**：现在"发给某一台机器"只能靠创建时指名，而指名要求那台机器**已经注册过**
   （`TARGET_DEVICE_UNKNOWN`）；在它注册之前，请求只能是无目标的，任何有能力节点都能领。
   要不要把 claim 改成可指名任务、或引入"只有目标节点可领"的作业模式，改的是调度与授权语义 ⇒ 宜 Owner 判断。
8  **凭据历史残留怎么处理**：修复前写入的两条记录仍带（假的）凭据形状。删除会违背"不抹历史"，
   保留会让"作业记录不是秘密仓库"这句话带上一个例外。本机选择**保留 + 具名列出**，把取舍交给人。
9  **有界回执窗口该调大还是该分页**：导出器与列表视图共用 `receiptLimit`（默认 50），窗口一满导出就整体拒绝。
   调大窗口只是推后；分页/按 id 读才是解法（复现工具已经这么做，所以它不受影响）。
   要不要给导出器加一条分页/按 id 的读路径，是**新工作**，且会改变导出产物的完备性论证 ⇒ 宜 Owner 判断。
10 **登记里有 10 条 evidence 引用在它们自己的锚定头上取不到**（可重跑：`capability-registry/tools/audit_evidence_refs.py`）：
   20 份记录、140 条引用，**全部 20 个 `last_verified_full_sha` 都能解析**（没有悬空 SHA），
   但 10 条引用按 `git show <sha>:<path>` **取不到** —— 其中 **9 条文件确实存在过**（评审分支上的产物；
   工具会点名加入它的那个提交，例如 CEX-703 的 `006ec9f`），只是没有进入被锚定的那个提交；
   另 1 条指向 `.runtime/...`（未跟踪目录，机上已不在）。
   **为什么值得记**：读者按记录去取证据会失败，这是"引用了就再也查不到"的同一类缺陷。
   **为什么本轮只测量、不改**：要改的是别的系列（CEX / MON / REX-802）的记录，把引用改成"在加入它的提交上可达"
   或把这些 probe 合进主线，是跨系列决定；按本系列对 mojibake、118 处清理竞态的同一条纪律，宜单独立项。
   补一条方法教训：这个审计的**第一版**是问工作树，于是把 8 条**本来没问题**的引用报成悬空
   —— 因为它们在被锚定的头上、只是不在我当前检出的分支上。测量对象选错，和复现时选错树是同一个错误。
11 **导航门比的是工作树，不是已提交状态**（本轮实测踩到）：`sync_documentation_navigation.py --check` 只比对
   工作树里的生成物与源文件，所以当一次提交只 `git add` 了某个子目录、把重新生成的
   `docs/DOCUMENTATION_INVENTORY.json` 留在工作树未提交时，门依旧报 **0 drift**，而 **origin 上 README 与
   inventory 已经不一致**（本轮就是这样，最后是 `git status` 那一行把它暴露出来的）。
   ⇒ 生成物与源码"本地一致"不等于"已提交一致"；给这类门加一条"生成物是否已提交"的检查是可用但会碰 git 状态的新工作。
   本轮的处置：补一个只含 inventory 的提交（`a9ff085`），并在提交信息里写明它是被上一提交落下的。
   **同一个坑在下一轮又踩了一次，换了个工具**：登记审计（`audit_evidence_refs.py`）是在**本地仓**里解析引用的，
   所以一个**只存在于本地、还没推**的头会让它通过 —— 而记录里写的正是那个头。
   ⇒ 一般化的教训：**"本地能解析"与"远端能解析"是两件事**，凡是把某个 head 写进记录的地方，
   都要先确认那个 head 已在远端；两个工具（导航门、登记审计）都缺这一条检查，而两次都是 `git status` 那一行救的场。
```

### 6B.4 reproducibility delta（哪些能复现、哪些不能；逐条）

```text
可以复现（本机与仓内包上实测）
  · 4 项指标：从城市重建数据集后重算 = 包内声明（6532 / 0 / 0 / 0，n=15）
  · canonical task 指针 22/22 仍存在；run→task 连接 15/15 仍可解析
  · trace 206/206：**经"按 id 取记录"的读接口**才成立；此前只能 0/206（数据在、读不到）——见 §5
    **但这条有时效**：同一天稍后同一包同一城市已变成 **0/206**（保留期滚过那批记录）——见 §5I。
    ⇒ "能否复现 trace"取决于**何时**复现，而包的指针**没有声明有效期**。
  · 独立复现者可**自己再跑一个 campaign**（本机每次复现都跑，逐条落在两台真实设备上）
不能／受限（必须写明，否则会被读成"完全可复现"）
  · 包内 **23 / 27 项指标是 NOT_MEASURED**，各带原因；本机**也不主张**它们可测
  · detectionTimeMs 在该故障类型上不适用（拒绝的是认领不是心跳），typed NOT_MEASURED，不是 0
  · `softwareRefs` 是**声明的**引用，不是本机观测到的实现身份（provenance 里 `refSemantics` 写明需外部验证）
  · 原始控制面已消失：复现方必须**自建**并声明自己的 surface（工具这么做了，且声明这是新 run 不是重放）
  · **设备身份必须仍然存在**：包声明两台设备，任一台不在线，其任务 WAITING ⇒ campaign 到不了 COMPLETED
  · **城市状态已增长**：此刻重新导出会得到不同的 artifactId 与不同字节 ⇒ "原始包"只能靠随分支传输，不能靠重新导出
  · 两条跨机通道**未在两台真实机器之间**验证过（能力只在本机节点上跑通）
  · **更正（2026-10-08 最终包）**：本节数字读自**旧包**（11 文件 / 15 run / trace 206）。当前随分支的是
    **B 包**（`evidence/raw/rex890-studies/2026-10-08-B/artifact/`，13 文件）：205 run · canonical 214/214 ·
    run→task 205/205 · trace 243/243（**包自含**，不再问城市）· 0 inconsistencies · exit 0。
    旧包**保留**，因为它证明了"包可以活得比它所指向的城市状态更久"——删掉它就等于抹掉这条教训。
  · **两套实机探针已随分支进仓**（仪器 + 结果，可重跑）：
    `evidence/raw/capability-city-remote-operation/live-probe.mjs` → **21/21**（声明式派发真实执行、
    点名节点一致、`shell:false`、收据被复核且 `acceptanceAuthority=false`、**把 `;` 当一个 argv 元素**、
    上界**具名拒绝**、超时真杀（`timedOut`，durationMs 1555）、输出按声明的 4096 **截断**、审计行带 purpose/argv/cwd）；
    `evidence/raw/capability-city-agent-job/credential-probe.mjs` → **9/9**（四个被持久化字段全部具名拒绝、
    每次拒绝都不建任务、只提到 token 文件仍接受、探针新建记录不带该形状）。
    **实机读到"默认关闭"**：两条能力的 exposure 描述符都报 `defaultEnabled:false`，而 `config.enabled:true`
    —— 城市自己说"默认关、现在开是因为 owner 打开了"，且描述符里的 `capabilityId` 与登记 id 一致。
  · **城市现在跑的是已验证代码**：2026-10-08 14:5x 重启（cityId 不变、两条通道仍 enabled、自身 agent 在线、
    待领作业跨重启存活、reservation 的 `startup` 记录现在带 4 个开关）。**重启配方此前不存在**，现已记录。
  · **对侧那条待领作业已从"无目标"改为严格指向对侧设备**：少了一条"任何有能力节点都能领走"的不确定性。
  · **仍然不能**（逐条，别读成"已经完全可复现"）：
    - **一台主机上的 owner 操作另一台主机**：仍未跑。21/21 那次点的是**同一台物理机器上**的节点
      （`assignedNodeId` = 本机 deviceId），所以"跨物理主机"这句话**还没有**测量支撑。
    - **对侧机器上的 agent 作业**：仍未发生（对侧须自己先 `register`，这是城市侧代做不了的 bootstrap）。
    - **claim → report**在**重启后的**城市上**未重测**：`/node/claim` 只能传节点 id、不能传任务 id，
      而城市里排着对侧那条作业 ⇒ 拿节点凭据去 claim 就可能**把它吃掉**。本机因此**故意不做**这次测量
      （这条取舍本身就是"测量会改变被测对象"的例子）。更早一轮在**同一座城市**上已实机验证过这条链。
      **但"消耗回执"这一步不需要 claim**：它是对**已有报告**的幂等读，所以**已重测 8/8**（回执写明
      `ACKNOWLEDGEMENT_NOT_VERIFICATION` / `AGENT_OBSERVATION_NOT_CITY_VERIFICATION`、`agentConsumption=false`、
      **`reportDigest` 由本机按合同规范化独立重算并与回执一致**（`c00c016b…`）、重复取回同一回执（digest 与时间相同）、
      换一条 note 被 409 `CONSUMPTION_ALREADY_RECORDED` 拒绝、且取回**没有改动**作业与存储的报告）。
    - **包的 41 份回执仍然全部可读，即使城市的有界回执窗口已经截断**：实测窗口 `total 52 / limit 50 / truncated true`，
      包里最旧的两条已不在窗口**列表**里 —— 但复现工具是**按 id 取每条 campaign 回执**的，
      所以 41/41 照读（205 run · 214/214 · 205/205 · trace 243/243 · **0 inconsistencies · 0 evidenceGaps**）。
      教训与 trace 那次相同：**有界窗口是"读"的边界，不是"存"的边界**；判据要按 id 取，不要依赖列表。
      **更晚一次只读预检（同日）**：窗口已长到 `total 54 / limit 50`，包里有 **4 条**落在列表之外（早先是 2 条——
      每做一次彩排就多一份回执）。预检（`evidence/raw/rex890-studies/2026-10-08-B/readiness-check.mjs`，7/7）
      把这件事**报出来**而不是判失败：同一份预检里 41/41 按 id 全部读到、205 run 与包声明一致、205 个 canonical task 全在
      —— 也就是说"窗口在长"与"这条路仍然可用"可以同时成立，而只有按 id 读才让它们同时成立。
    - **独立 campaign 需要包里声明的两台设备都在线**：实测（干净树）城市按名拒绝
      `TOPOLOGY_NOT_READY`，`missing: [dev-1428bce5…]`。所以复现**必须从被声明的那台设备上跑**、
      且它的 agent 要在线；这也意味着"在别的机器上替对侧跑"做不到。
    - **owner-only**：由套件证明（member 既不能派发也不能读操作日志），**不是**实机 member 会话证明；
      为它去实机注册一个 member 设备会改变**对侧复现要读并对齐的那个名单**，所以没做。
    - **默认关闭**：实机读到描述符 `defaultEnabled:false`，但"开关关掉时一切都按名拒绝"这条只在套件里跑过
      （实机验证它需要把城市的开关关掉再开——那会动到对侧要用的环境，不值得）。
```

### 6B.5 potential paper directions（**候选方向，不是主张**）

```text
· "谁说的"必须与"什么被验证"分开：同一份记录里，城市的词（QUEUED/RUNNING/COMPLETED）与参与者自述的词
  （SUCCEEDED + 证据类别）分块呈现，且每条被接受的报告带 acceptanceAuthority=false。
· **false-success 与 false-inconsistency 的对称性**：同一个检查既可能漏报（六条）也可能误报（一条）；
  两者都只能由"对真实对象的运行"暴露。推论：夹具若不像真东西，测试就**不可能失败**。
· 检查的**自证伪**是必要条件：本系列的证据链包含 4/4 包篡改证伪、六条拒绝路径、一条词汇表反例。
· **有界读窗口**：数据完整性与"可读性"是两件事（206/206 在磁盘上、0/206 在接口上）。
· **空洞对比**：0 inconsistencies 可能意味着"比过了"，也可能意味着"无从比对"；
  区分它们需要把"缺证据"变成与"不一致"不同的、非零的出口（本工具用 VACUOUS + exit 2）。
· 跨机能力的**主机无关性**可以被做成受检属性：源码守卫（不得含部署身份/不得按 hostname 决策）
  + 任意命名节点的行为测试 + 反例控制（同样任意命名但未声明能力的节点必须拿不到活）。
· **拒绝也要计入账**：一份 REFUSED 的 campaign（planned 6 / accounted 0 / terminalAccountingComplete=false）
  比"零失败"更能说明账本是诚实的。
```

## 7. 唯一剩下的动作

```text
对侧要跑**实体**独立复现，只差两个输入（它自己在报告 §"尚需输入"里点名）：
  ① 目标城市有效的 **Owner 配置**（形如 {"token":"…"} 的文件路径）——它手上的 local-config 属于另一座城，
     请求得 HTTP 401 `Invalid pairing token`。
     **OWNER RULING 2026-10-08**：Owner 选择**带外交付 + 跑完即轮换**，**不**为此新建"受限复现凭据"能力
     （后者改的是城市授权模型，属新工作；本轮未授权、未实施、也不假装它存在）。
     已备好的交付文件（只含 token 一个字段，**不含** nodeToken）：
     `4in1-acceptance-2026-10-07/transport/city-owner-config.FOR-ALIEN.json`（44 B，带外传，不入任何仓库）。
     **如实的范围说明**：control token 是该城**主凭据**——可读城市/任务/节点/研究状态、建任务、发远程操作
     （受 allowlist 限制）、改名、撤设备、批准入网；**比"只读+复现"宽得多**。因此给一次、用完即轮换：
     把 `local-config.json` 的 `token` 换成新值并重启城市（机制读自 main.mjs：`config.token ||=` 后写回），
     旧 token 随即失效。
     分工是刻意的：**能公开的输入自动化**（工件包随分支走），**需要授权的输入留给人并限时**。
     若要"只能读+复现、不能管理"的凭据，那是一件独立的产品工作（新授权面 + 自己的 §14A 暴露决定 +
     一组"越权必须被拒"的反例测试），本轮**未**做。
  ② 本机 study 的**原始工件包**（不能用 REX-806 的旧包替换）。
     **已随分支进仓**（2026-10-08）：`utopia evidence/raw/rex890-dev-study/artifact/`（11 文件，文件集合固定），
     旁边是**包外**的独立清单 `evidence/raw/rex890-dev-study/MANIFEST.sha256`（11 条，放在包外以免改动
     包自身的文件集合），并有 `README.md` 写明来源、两层校验与用法。
     为什么放进仓库而不是手工递送：独立复现必须在**另一台**物理主机上跑，而它够不到我磁盘上的文件；
     手工递一次就把研究结论绑在一个手动步骤上，这恰是"系统级能力"的反面。**提交进分支的字节会随分支走**，
     任何取到该分支的机器拿到的都是同一份输入。
     已实测（2026-10-08 当天的彩排）：从**仓内**这份跑复现工具 ⇒ package files 11 ·
     checksums VERIFIED over 10 files · artifactId 仍是 `artifact-544adda1-…-5-campaigns` ·
     15 条 run 引用重建自 5 份回执 · 四项指标全部 agrees · 独立 campaign COMPLETED（两台设备）·
     0 inconsistencies。**但 trace 那一项当天稍后已从 206/206 变成 0/206**（§5I）⇒
     现在跑的实际期望是 **exit 2 + 一条具名 gap**，不再是 exit 0。详见下面"期望（更正）"。
     核验两层（收包方自己跑）：包内 `checksums.json`（10 文件）+ 包外 `MANIFEST.sha256`（全 11 文件）。
     离线传输仍可用 `4in1-acceptance-2026-10-07/transport/rex890-dev-study-artifact.zip` 作为后备
     （那是**旧包**，只作后备；下面这条命令请用新包，否则期望值会读错）。
     **先跑只读预检**（不建任务、不起 campaign；结果默认写系统临时目录，不弄脏检出）：
     `node evidence/raw/rex890-studies/2026-10-08-B/readiness-check.mjs --artifact <包> --city <城市> --config <token 文件>`
     —— 本机实测 **7/7**（checksums 12 · MANIFEST 13 · 包自带 trace 243=243 · 41 个 campaign 按 id 全可读=205 run ·
     205 个 canonical task 全在）；它还会**报告**回执窗口（实测 `total 54 / limit 50 / truncated`）。
     拿到后：`node scripts/rex890-opposite-host-reproduce.mjs
     --artifact evidence/raw/rex890-studies/2026-10-08-B/artifact
     --city <城市> --config <带 token 的文件> --out <输出目录> --label Mera-Alianware`。
     **期望（2026-10-08 最终，取代下面这条"更正"）**：`inconsistencies 0` · `evidenceGaps 0` ·
     `reproductionComplete true` · **exit 0**。
     为什么期望值又从"exit 2 + 具名 gap"改回来：旧包指向的 trace 记录被城市**有界**保留滚过去了（§5I），
     当时 exit 2 是诚实的；新包 **B 自带**它所指的记录（`trace-records.jsonl` + `trace-coverage.json`，
     listed 243 / captured 243，两个文件都在包内 `checksums.json` 里），复现因此**不再**取决于城市还剩多少保留期。
     下面那条历史**保留**，因为它记录了"能否复现 trace 曾经取决于何时复现"这个事实。
     若出现**不一致**（inconsistencies > 0）或**新的具名 gap**，请原样带回，不要自行解释成失败或通过。

     **③ 本机 study 的仪器本身也已在仓内**（`scripts/rex890-dev-study.mjs`，2026-10-08 `911bdf8`）：
     参数化（`--city` / `--out` / `--config` / `--checkout` / `--repetitions`），凭据取自 `--config` 文件或
     `CITY_TOKEN`（不再取自任何一台机器的绝对路径），软件身份**观测自检出**、观测不到就具名拒绝，
     故意跳过记为 NOT_RUN 而不是失败。所以对侧不只能复现**包**，也可以自己**再跑一遍 study**。

**并请 Owner 在两件事上给一个裁决**（都影响 final gate，且都不是对侧能决定的）：

> **OWNER RULING 2026-10-08（已裁决，并已执行完毕）**
> (a) trace 要素选 **(B)**：**另做一次 study，并在导出时把 trace 记录一并写进包** ——
>     这是唯一能让该要素**完整**满足的路。**已完成**：
>     · 使能件：包输出 `trace-records.jsonl`（按 eventId 排序，同证据两次导出字节相同）与
>       `trace-coverage.json`（listed/captured/source），覆盖按构造成立，两文件进 `checksums.json`；
>       复现工具会读它并**分开计数**（城市=当前状态 / 包=导出时的副本）。守卫与证伪见 §6B.2。
>     · **新 study 已跑**：**21/21**，8 要素齐备（含定向性实测 503 vs 200、recovery 901ms、
>       replay COMPLETED、ablation COMPLETED **且真的改变了放置**）；导出
>       `artifact-544adda1-…-41-campaigns`（41 campaigns / 205 runs / 205 measured），独立校验器 15/15。
>     · **新包已随分支进仓**：`evidence/raw/rex890-studies/2026-10-08-B/artifact/`（13 文件；
>       `trace-coverage.json` listed **243** / captured **243**；包外 13 条 `MANIFEST.sha256`）。
>     · 开发主机实测（干净检出、**零安装**）：checksums 12/12 · 205 run 重建自 41 回执 · 四项指标全 agrees ·
>       canonical **214/214** · run→task **205/205** · trace **243/243** · 独立 campaign COMPLETED（两台设备）·
>       software 观测自检出 ⇒ **0 inconsistencies · 0 evidenceGaps · reproductionComplete true · exit 0**。
>     · 旧包**保留**（它的 trace 丢失是本程序学到的事实，删掉等于抹掉教训）。
>     ⇒ **对侧现在的期望值回到 `exit 0 / 0 gaps / complete true`**，且这一次是**结构上**成立的：
>       包自含它所指的记录，不再取决于城市保留期还剩多少。
> (b) exposure gate PASS：Owner **亲自审阅两份登记后给结论**（不由本机自审；DC 侧确认没有 14A 自动检查器）。

走哪条通道都可以（§5 换 reference agent，或 §5C 用 scripts/agent-job.mjs 注册→领取→回报）。
**实体复现的结果由对侧宣布**；在它宣布之前，REX-890 不收口、终标不释放。
```

## 8. 变更历史

```text
2026-10-08  首版：汇总素材、逐条标注证据与未建立项；新增 §5 的 trace 读窗口发现（本轮实测）。
2026-10-08  追加 §5F：对侧回了一轮代码验证（六条 false-success 已修，本机另修一条它引入的
            false-inconsistency），复现工具的"0 inconsistencies"因此第一次被真正证伪过。
            追加 §5G：跨机能力做成**受检的**主机无关属性；§6 区分"对侧已做代码验证"与
            "实体复现仍未发生"；§7 给出对侧仍缺的两个输入与传输包路径。
2026-10-08  追加 §5H（整页重建丢状态的真缺陷）与 §6B：把工作书点名的最终素材内容**逐项**补齐——
            实验/运行/失败计数（读自城市当前全量：29 份回执、28 COMPLETED、1 REFUSED、
            计划 159/计入 153/实测 153、0 失败，且拒绝那份 terminalAccountingComplete=false）、
            defect taxonomy（按"谁的错"分四类 + 我自己的两次错）、review-only findings、
            reproducibility delta（能复现什么、**不能**复现什么，逐条）、potential paper directions。
            凡未测/未发生者一律写 NOT_MEASURED / NOT RUN，并保留原因。
2026-10-08  追加 §5I 之后的收尾：§7 的复现命令**改指 B 包**（原命令指向旧包，会读到错误的期望值——
            这是本文档自身的缺陷：**指令指向了一个 trace 已失效的包**），期望值回到 exit 0；
            并记明 study **仪器本身已随分支进仓**（`911bdf8`）。§6B.4 末尾加"更正"指向 B 包的数字。
            代码侧另修两处**不是产品缺陷**的红：故意跳过/环境不满足被当成失败（study 仪器、
            复现测试的脏树前置条件、host-city launcher 的"活动城市"前置条件）。
2026-10-08  study 仪器进仓（`911bdf8`）+ 前置条件如实记为 NOT RUN（`a3078e8`）。
2026-10-08  仪器自身四处缺陷修完（`de7e91b`）：实验 id 只用日期导致同一天**无法重跑**（HTTP 409
            `IMMUTABLE_MANIFEST`，城市拒得对——manifest 确实变了）；记录只在 phase 6 写，中途停下就
            **磁盘上什么都没有**；关掉控制面后立刻 `process.exit()` 在 Windows 上触发 libuv 原生断言
            （`0xC0000409`，不是报告）；城市不可达时以未捕获异常堆栈死掉。现在：任何结局都留
            `dev-study.json` + `dev-study.log`，不可达城市在**创建/注册任何东西之前**具名拒绝，
            并有一个"拒绝注册实验的 fixture 城市"把这条路径钉住。
            **CI**：`de7e91b` 全绿（run `37718959850`，conclusion success）；上一个头 `a3078e8` 的
            run `37718096755` 第 1 次因 `CAJ-WEB 2` 10.1s `TimeoutError` 失败、第 2 次（attempt 2）
            全绿 —— 该用例与本轮改动**无关**（`803c18d..a3078e8` 未触及任何 web/agent-job 文件），
            本机单跑 27.3s 通过：判为**环境（负载）**，不是产品缺陷。
2026-10-08  **实测**：对侧要跑的那条路（B 包 + 当前城市）在本机干净检出上 = `0 inconsistencies` ·
            `evidenceGaps 0` · `reproductionComplete true` · **exit 0**；同时发现**现在重新导出会 exit 1**
            （`RECEIPT_WINDOW_TRUNCATED`，城市 50 份回执、窗口截断最旧 1 份）——按包复现不受影响，
            这正是"包必须随分支走"的原因。已写进 §7 与交接书。
2026-10-08  上一条的**原始报告已随分支进仓**（`3143260`）：
            `utopia evidence/raw/rex890-studies/2026-10-08-B/DEV-REHEARSAL-opposite-host-reproduction.de7e91b.json`
            （123,914 B，sha256 `340C57A7…`，与生成时逐字节相同）。**为什么补这一步**：该结论此前只在
            §8 里引用了一个 `%TEMP%` 路径，而临时目录会被清掉 —— 那等于把一句"引用了就再也查不到"的结论
            写进记录，与本程序学到的"指针不能活得比证据久"是同一个错误。旁边 README 列出该读哪几个字段，
            并写明**这是彩排，不是对侧的裁决**。
2026-10-08  开发侧收口一轮（REX-890 标为开发完成、看板 rex 8/8 开发、`reports/REX-890/` 建成但**故意不建**
            `REVIEW_REPORT.md`）。随后把两条通道**实机验证**并修掉两个真缺陷：
            ①**凭据可以进记录**——作业记录只扫 `inputs`，而 `instruction`/`purpose`/`title`/`expect` 都会被持久化
            （实机坐实：写进 instruction 被接受并存下；`f0295bc` 修为四字段同治，新增 `JOB_CREDENTIAL_REFUSED`）；
            ②**开关活不过重启**——4 个通道开关只在环境变量里，reservation 的 `startup` 记录不存、
            `restart-gateway.ps1` 不重放（`05ae385` 修，并把整来回做成断言）。同一次动作里把城市**重启到已验证代码**
            （cityId 不变、两通道仍 enabled、待领作业跨重启存活），凭据缺陷**实机复证 9/9**，
            通道 (a) 实机探针 **21/21**（含上界具名拒绝、超时真杀、输出按声明截断、审计行字段）。
            §6B.2 按"谁的错"补入这些条目（含我自己的三处：编造 SHA、两次替换代替追加、监视器三次假信号），
            §6B.3 补入 exposure gate / claim 不能指名任务 / 凭据历史残留三项**要人判断**的事，
            §6B.4 补入"仍然不能"的逐条（跨物理主机未跑、claim 链重启后未重测及其原因）。
2026-10-08  对侧那条待领作业从**无目标**改为**严格指向对侧设备**（`Q-85be5da7-…`，内容逐字节相同，
            旧条 CANCELLED 保留）：因为无目标的 AGENT_JOB 任何有能力节点都能领，而 `/node/claim` 只能传节点 id
            —— 一次例行 claim 就可能吃掉对侧的交接请求。这也是本机**故意不做** claim 型实机探针的原因。
```
