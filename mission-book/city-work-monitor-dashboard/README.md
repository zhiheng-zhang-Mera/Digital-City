# City Work Monitor Dashboard / 全城工作监视器仪表盘

> **状态：ACTIVE / OWNER_ACTIVATED_2026-10-05**
>
> Owner 已于 2026-10-05 明确指示“启用monitor工作书”。`execution_enabled=true`；MON-901 可领取，后续工作书仍须等待其依赖的 accepted exact SHA。详见 reports/MON-901/OWNER_ACTIVATION.md。
>
> **部署落差（2026-10-06 实测，记录而非主张）/ deployment gap, measured not asserted：** 本系列 4/4 已验收，但产品**尚未进入 Utopia `main`**——`services/dev-gateway/monitor-graph.mjs`、`monitor.mjs` 与 `apps/web/monitor-*.js` 在 main 上都不存在，只有 MON-901 的 observation sidecar 进过。Owner 的优先级裁定写着「CEX-790 merge-readiness first, then MON directly」，CEX 已合入，MON 尚未。集成前置测量已完成：一次合并覆盖整条系列（MON-990 头已含 902/903/901），**纯增量、0 文件删除、仅 1 处 union 冲突**（Android 打字化拒绝路径集合），定向 80/80、全量 1431/1434。是否开启 MON 合并窗口属 Owner 决定。详见 [../reports/MON_INTEGRATION_PREFLIGHT_MECH.md](../reports/MON_INTEGRATION_PREFLIGHT_MECH.md)。 / The programme is 4/4 accepted but its product is not in main; the Owner's override puts MON next; the integration preflight is done (one merge, additive, one union conflict, 80/80 focused). Opening a MON merge window is an Owner decision.

>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 研究信号：[../RESEARCH_SIGNAL_WATCHLIST.yaml](../RESEARCH_SIGNAL_WATCHLIST.yaml)  
> Research Fabric：[../research-strengthening/README.md](../research-strengthening/README.md)

## 1. 目标

把 Utopia 的多任务、多 Agent、多设备、多模型运行态统一投影成一个 **task-centric / city-centric** 的工作监视器：

```text
City Work Monitor
  ├─ Overview graph
  ├─ Node inspector
  ├─ Path / edge inspector
  ├─ JEV observation stream
  ├─ Decision overlay
  └─ Evidence / raw diagnostics
```

首页只回答：

- 哪些任务在工作；
- 哪些任务在等待 / Review / Blocked；
- 哪台设备或哪条路径异常；
- 系统自动做了什么 decision；
- 是否存在 Owner-required 事项。

模型、provider、host 是节点属性，不是整个监视器的一级组织结构。

## 2. 核心架构决定

### 2.1 JEV = 全城 Observation Layer，不是同步 traffic cop

```text
Worker / Task / Device / Gateway
             │
             ├──────── normal work ────────→
             │
             └── bounded events → JEV Observation Layer
                                      │
                                      └→ City Work Monitor
```

JEV 可以持续观察，但不得要求所有工作先经过 JEV 才能执行。监视器或 JEV 故障不得冻结无关任务。

### 2.2 Decision = event-triggered，不是每次汇报的额外审批

正常 heartbeat、普通日志、测试进度只记录，不触发决策。

只有状态跃迁或真正需要选择的事件，例如：

```text
FAILED
BLOCKED
READY_FOR_REVIEW
RETRY_REQUESTED
RESOURCE_CONFLICT
SCOPE_CHANGE
MERGE_READY
OWNER_DECISION_CANDIDATE
```

才允许进入 Decision path。

默认决策梯：

```text
deterministic rule
    ↓ unresolved
fast lightweight model
    ↓ uncertain / high impact
strong critic / architect
    ↓ owner-only boundary
Owner
```

Decision 必须 per-task、异步、可并行、有 timeout/fallback；**禁止形成全城同步锁。**

### 2.3 Monitor 只是 projection，不是新的 task truth

权威事实继续来自 Utopia canonical task/action/event、Mission Book、Capability Registry、Git/CI/runtime evidence。

Monitor 只做：

```text
canonical truth
→ normalized projection
→ aggregation
→ UI
```

不得为了做仪表盘复制 scheduler、task state、device identity、review truth 或 capability truth。

## 3. UI 信息层级

### Level 0 — City Overview

总图采用任务图 / DAG 风格，默认只显示关键状态与风险：

```text
MB-211 ● ── Review
   │
   └─ Test

MB-212 ⚠
MB-213 ◌ waiting
```

**总图可以隐藏细节，但不得隐藏风险。**

要求：

- active warning / degraded / repeated retry 必须向上冒泡；
- 默认布局尽量稳定，不因普通状态刷新整图重排；
- 大图自动 cluster/collapse；
- edge type 可筛选，默认不同时展示所有路径类型；
- UI 看起来可以是“树”，底层数据模型必须允许 DAG / merge / handoff。

### Level 1 — Node / Path Inspector

点节点至少回答：

```text
What?      现在发生什么
Why?       为什么这样
Who/What?  谁/哪台设备/哪个 Agent 负责
What next? 下一步是什么
```

点路径/edge 至少显示：

- edge type；
- source / destination；
- trigger / reason；
- handoff / review / retry / model-switch / device-route 等语义；
- exact evidence / decision provenance；
- start/end/duration（可观察时）。

### Level 2 — Evidence / Raw Diagnostics

需要真正排错时才进入：

- logs；
- diff；
- test / CI；
- screenshot；
- exact SHA / run / artifact id；
- decision receipt；
- trace / provenance。

普通用户不应被这一层淹没。

## 4. 数据模型

底层最低抽象：

```text
Node
Edge
Event
Decision
Evidence
```

而不是把 Markdown 汇报或 UI 树本身当系统状态。

建议 Decision 最低字段：

```text
decision_id
task/workbook_id
trigger_event
pre_state
decision_source = RULE | FAST_MODEL | CRITIC | OWNER
action
confidence_if_available
decision_latency_ms_if_observable
queue_wait_ms_if_observable
timeout_or_fallback
escalation_target
post_state
evidence_refs
```

## 5. 性能与阻塞原则

1. Observation continuous；Decision event-triggered。
2. JEV / Monitor 不得拥有 global execution lock。
3. Decision queue 必须 per-task independent。
4. fast model timeout 只能暂停/降级对应 task，不得冻结全城。
5. 能由 deterministic rule 解决的情况不得为了“智能感”调用模型。
6. UI refresh 与 observation ingestion 不应改变任务执行顺序。
7. 监控数据高频 raw stream 按 PROCESS_DATA_POLICY 分层，不把 unbounded telemetry 推进 City 当前施工面。

## 6. 论文素材

本 programme 是现有 G3/G4 control-plane 主线的 observation surface 与数据来源，不默认把“做了一个 Agent dashboard”当 novelty。

重点采集：

- observation → projection latency；
- state transition → decision latency；
- decision queue wait；
- auto-resolution source（rule / fast model / critic / owner）；
- Owner interruption avoided / required；
- escalation cause；
- timeout/fallback；
- unrelated-task blocking（应为 0；未知不得填 0）；
- false-safe summary / active risk 是否正确向 overview 冒泡；
- monitor projection ↔ canonical truth drift；
- node/edge provenance completeness；
- handoff/retry/model/device path explanation completeness；
- graph size / collapsed cluster / user navigation depth（可测时）。

重点 failure labels：

```text
MONITOR_SYNC_BARRIER
MONITOR_REALITY_DRIFT
SUMMARY_HIDES_ACTIVE_RISK
EDGE_CAUSALITY_MISSING
DECISION_PROVENANCE_MISSING
DECISION_TIMEOUT_GLOBAL_IMPACT
DASHBOARD_BECOMES_SECOND_TASK_TRUTH
```

专题研究材料见 Research Institute：

`paper-materials/{zh-CN,en}/CITY_WORK_MONITOR_OBSERVATION_DECISION_2026-10-05.md`

## 7. 工作拆分

| ID | 工作 | 状态 |
|---|---|---|
| [MON-901](./MON-901-observation-model-and-jev-projection.md) | Observation model + JEV sidecar projection | COMPLETE |
| [MON-902](./MON-902-overview-graph-and-node-path-inspector.md) | Overview graph + node/path progressive disclosure | COMPLETE（reviewer 已在对侧修复 head 上验收，marker MON902_OVERVIEW_GRAPH_REVIEW_ACCEPTED） |
| [MON-903](./MON-903-event-triggered-decision-overlay.md) | Event-triggered Decision overlay + escalation provenance | IN_PROGRESS (development complete, review pending) |
| [MON-990](./MON-990-cross-device-monitor-acceptance-and-freeze.md) | Cross-device acceptance + reality reconciliation + freeze | IN_PROGRESS（开发完成，Formal Review 已由 Mech 执行：11/12 通过、marker 因 Android 半边 NOT_RUN 而未释放） |

MON-902 与 MON-903 在 MON-901 accepted 后可由不同主机并行。

### MON-902 当前实测状态（Mech / Alien，2026-10-06）

```text
DEVELOPMENT   Mech COMPLETE on exact 3a88e23f91924576178973ef46c620b20ffa2aaf (branch mon/MON-902-mech-overview-graph, PR #27)
REVIEW        Alien（对侧物理主机）已执行，判定为**返修**：独立复现 6 项失败，另有其同机 critic 发现的
              stale-open-evidence 缓存缺陷 1 项，共 7 项。作者接受全部发现，无一项是口味问题。
              review 报告：reports/MON-902/INDEPENDENT_REVIEW_Alien.md
              作者接受与教训：reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md
REPAIR        review/MON-902-Alien-20261006 @ f4988248a3316806fc2e3fa9e62864ed129fe7b3，PR #34，MERGEABLE
ACCEPTANCE    reviewer 已在其自己的修复 head 上完成验收：workbook status = COMPLETE，review_complete = true，
              review_status = ACCEPTED_EXACT_HEAD_WITH_DOCUMENTED_SURFACE_STRATEGY，
              terminal marker = MON902_OVERVIEW_GRAPH_REVIEW_ACCEPTED；CAP-MON-002 已推进到 FORMAL_REVIEW_RECONCILED
              三个 exact-head run 均为 terminal SUCCESS attempt 1（push 37414577586、PR 37414583160、linkage
              37414583135）——作者与 reviewer 各自独立逐次 API 读出，结论一致
STILL OPEN    Android 原生与真机跨设备验收 NOT_RUN，按声明策略归 MON-990；该 marker 是任务级验收，不是 programme freeze
MERGE         merge_authority false，本机未合并；验收决定由 reviewer 作出，作者不参与
```

值得入库的失败形状（作者自评）：MON-902 的任务主题就是「不要把不安全的画面显示成安全」，而作者自己的 projection 里有三条
**false-safe** 路径——`view.health` 缺失时**不产生任何风险**、completeness 元数据缺失/非法时给出平静摘要并把缺口计为 0、
已终态任务被算作「离线设备当前持有的工作」。此外 `navigation.worstSteps` 是**没有测量过的数字**（由「是否存在风险」推导），
已被 reviewer 改为 `worstSteps: null / measurementStatus: 'NOT_OBSERVABLE'`。作者原有 33 个探针全部只喂**良构输入**，
因此结构上不可能发现这些分支；reviewer 的 11 个探针正是围绕相反假设构建的。完整教训见
`reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md` 第 5 节。

### MON-903 当前实测状态（Mech，2026-10-06）

```text
DEVELOPMENT   COMPLETE on exact 78bdd9dc873ebc257aedecf421068a1387dbec82
              （本表此前写着 1d1593df，那是首次 green 的 head；该 head 之后因本任务自测发现 D-7/M-1 与 D-8/M-2
              两个缺陷而前移，workbook 的 development_head_sha 是 78bdd9d。此处按 workbook 事实更正。）
              branch mon/MON-903-mech-decision-overlay；union baseline = main 213f9f9f with MON-901 7eb38f1b inside
WIRING        GET/POST /api/v0/monitor/decisions 与 GET /api/v0/monitor/decisions/:id 已在真实 gateway 上验证；
              MON-901 投影的 decision 字段由只读快照注入；Web 页面 Advanced > Decision provenance 由真实浏览器验证
NOT DONE      无 Android 面（归 MON-990 跨设备验收）；本城未配置 resolver，因此所有不确定情形以
              RESOLVER_NOT_CONFIGURED 升级到 Owner（如实记录，不假装模型已接入）
REVIEW        CLAIMED and now REPAIRED by Alien（对侧物理主机，对作者 Mech 而言为 opposite host）；
              review_status = REPAIRED_AWAITING_EXACT_HEAD_CI，review_complete false，terminal marker 未释放，
              merge_authority=false；review 报告与证据见 reports/MON-903/INDEPENDENT_REVIEW_Alien.md 与
              PR #35（Alien 报告记录其 review head 已因 CI 反证而从 db6bfb2 前移到 9eb8275b）
AUTHOR PASS 2 作者第二轮自测（**不是 review 证据**，不改变 head/workbook/claim）：对 MON-902 review 暴露的失效类别
              做同族扫描，在本模块发现 4 项真实缺陷（有界失败日志不报丢弃条数、被队列上限拒绝的决策发布未测量的
              decisionLatencyMs: 0、metrics() 在截断样本上发布头条比率而不披露、window 未说明它跨的是触发事件），
              外加 1 项只在真实渲染时才暴露的 UI 缺陷。修复发布为 repair/MON-903-mech-honest-metrics @ 6ecc6f3
              （两个提交：先探针后修复，红跑 1 pass / 5 fail 留档），CI push 37416035100 SUCCESS attempt 1。
              报告：reports/MON-903/AUTHOR_SECOND_ADVERSARIAL_PASS.md
              该报告同时记录：对侧 review 复现的 8+2 项缺陷与本轮发现的 4 项**几乎不相交**——类别驱动的扫描只能
              找到它被给定的类别（本轮完全没有指向状态机/生命周期类缺陷，例如 UUID 排序导致删除任意回执、
              observe 绕过 close、轮询被高频渲染饿死），这是该方法的结构性局限，不能替代 review。
ADOPTABLE     作者把自身发现融入到 reviewer 的 head 之上，发布可直接采纳的合并分支
              repair/MON-903-mech-honest-metrics-on-review-head @ 10a020c3（base = 5b71389），
              CI push 37416962184 SUCCESS attempt 1，本机 1383/1386（3 项为本机常驻 City 占用）。
ADOPTED       对侧已采纳并已验收：MON-903 workbook status = COMPLETE，review_complete = true，
              review_status = ACCEPTED，terminal marker = MON903_DECISION_OVERLAY_REVIEW_ACCEPTED，
              capability registry = FORMAL_REVIEW_RECONCILED，review head = 3cd32c60（本机四项发现在其中）。
              本机复核 reviewer 的 CI 改动 --test-concurrency=2：本机 merge 分支 1386 tests / 1383 pass，
              reviewer head 3cd32c6 同为 1386 / 1383 —— 没有丢检查项。
MON-990       已因 MON-903 验收而解锁，由 Alien 在 accepted exact dependency union 上领取并完成开发
              （development_host = Alien，development_baseline_sha = 665d6c3c，development head fb042d9，PR #36）；
              **Formal Review 由 Mech（对侧物理主机）于 2026-10-06 领取并执行完毕**，详见下方 MON-990 状态块。
```

### MON-990 当前实测状态（Mech 作为 reviewer，2026-10-06）

```text
DEVELOPMENT   Alien COMPLETE on exact fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40（branch mon/MON-990-Alien-20261006，PR #36）
REVIEW        Mech 领取并执行完毕。11 个独立探针（review/MON-990-Mech-20261006 @ 14b2c7b）全部通过，
              覆盖 workbook 12 项必验中的 11 项：overview ↔ canonical 状态、node 元数据不被臆造、无原因边标记
              MISSING 且不臆造出处、回执 pre/post 状态与 canonical 实况一致、200 任务折叠视图中 FAILED 节点仍可见、
              observer 抛错时 canonical 工作继续、卡住的 resolver 只阻塞自身任务且超时被归因、Registry 与运行期对账、
              刷新不重排且过滤只改边、Web 诊断路径到精确证据**实测 3 次交互**、回执仅为建议不改任务。
VERDICT       PASS on all 12 checks；**未发现缺陷**。
MARKER        CITY_WORK_MONITOR_V1_ACCEPTED **已释放**（review_complete=true，status=COMPLETE）。
              第 9 项「Web + 当前 Android surface parity」的 Android 半边**已实测**，不再是 NOT_RUN：本机一直装有
              Temurin 17.0.18（`C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2`），用它作
              JAVA_HOME 在被审 head 上 `:app:testDebugUnitTest :app:assembleDebug` BUILD SUCCESSFUL（3m51s），
              Android 单测 118 项 0 失败（22 套件，含 MonitorProjectionTest 7/7），APK 构建成功；另有探针把**被审 head
              自己**的服务端 payload 喂给 Android projection 并被接受（31 节点 / 2 簇 / 1 回执）。
              **更正（保留而不覆盖）**：本记录此前写「本机唯一安装的 JDK 为 26，AGP 拒绝它」，这是 **reviewer 的测量
              错误**（读的是 PATH 默认值），不是本机的限制。
              范围如实标注：check 9 的**真机渲染**半边在本机 NOT_OBSERVED（adb 无设备；手持机作为 control surface
              在线但接在别的主机上），该半边的唯一证据仍是作者的真机捕获。释放理由是 reviewer 的判断（记录在
              REVIEW_REPORT.md 第 9 节），不是一次测量。
CI            被审 head 三次 run 逐次 API 复核均 SUCCESS attempt 1（push 37420061997 / PR 37420065177 /
              linkage 37420065178）；reviewer 自己的探针分支首次 head 7fffe3f **CI 失败**（run 37422163771），
              原因经分类为 **reviewer 仪器缺陷**（R1 等待面板外壳而非 data-loaded=true，与 MON-902 自身浏览器
              探针同一形状），修复于 14b2c7b（run 37422910108 SUCCESS attempt 1）；两次 run 均保留。
REPORT        mission-book/reports/MON-990/REVIEW_REPORT.md
```

MON-903 的 review 必须独立验证：触发分类是否有遗漏或错收、no-barrier 是否真的成立、是否存在任何让决策改变状态的路径、
回执契约是否完整、指标是否会美化读者。作者提出的开放项见 `reports/MON-903/DEVELOPMENT_REPORT.md` 第 6 节。

## 8. 激活条件

Owner 显式允许后，才把对应 workbook 的：

`execution_enabled: false → true`

不得仅因目录存在就自动施工。
