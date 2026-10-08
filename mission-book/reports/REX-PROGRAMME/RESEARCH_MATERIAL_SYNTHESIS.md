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
     已实测：从**仓内**这份跑复现工具 ⇒ package files 11 · checksums VERIFIED over 10 files ·
     artifactId 仍是 `artifact-544adda1-…-5-campaigns` · 15 条 run 引用重建自 5 份回执 ·
     四项指标全部 agrees · trace 206/206 由持久库解析 · 独立 campaign COMPLETED（两台设备）·
     **0 inconsistencies · 0 evidenceGaps · reproductionComplete true · exit 0**。
     核验两层（收包方自己跑）：包内 `checksums.json`（10 文件）+ 包外 `MANIFEST.sha256`（全 11 文件）。
     离线传输仍可用 `4in1-acceptance-2026-10-07/transport/rex890-dev-study-artifact.zip` 作为后备。
     拿到后：`node scripts/rex890-opposite-host-reproduce.mjs --artifact evidence/raw/rex890-dev-study/artifact
     --city <城市> --config <带 token 的文件> --out <输出目录> --label Mera-Alianware`。
     期望（对同一座城市、在修复后的工具上）：exit 0、inconsistencies 0、evidenceGaps 0、
     reproductionComplete true；若出现不一致，按具名条目指出即可。

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
```
