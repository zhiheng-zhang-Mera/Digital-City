# REX-890 领取就绪预检 / Claim-readiness preflight — Mech

作者 / author: Mech-DS（`MEGA-REP`）· 时间 / at: 2026-10-06 · 对象：系列最后一个任务 / the series' terminal task

```text
被测对象 / measured   utopia @ b06504f（origin/main）· REX-806 头 3950d478e…（含全部已验收 REX 头）
                      · 常驻 City 172.31.12.151:4391（运行已验收候选 0261a9e）
边界 / boundary       **只读预检**：不领取 REX-890、不改它的工作书字段、不建它的报告目录、不合并、不部署
```

## 0. 为什么现在做 / Why now

REX-890 的完成门槛要求「opposite-host 独立 reproduction 成功」，而它的最低 study 里有两项（**注入故障 + 恢复**、以及 **handoff**）在本机已知的 v1 能力里**没有现成证据**。把这件事在有人领取**之前**量清楚，比让领取者在施工中途发现要便宜得多——这也是本系列记录缺陷而不是隐藏缺陷的同一条纪律。 / REX-890's gate requires an opposite-host reproduction, and two of its minimum-study elements have no evidence in v1. Measuring that before anyone claims it is cheaper than discovering it mid-task.

## 1. 门槛原文对照 / The gate, as written

```text
最低 study 必须包含    multi-device execution · one handoff or routing decision · one injected fault · recovery
                       · repetitions · one replay · one ablation · artifact export
opposite host 必须     从 artifact/manifest 重建 · 独立执行 · 重算关键 metrics · 对比 trace/provenance
                       · 指出不一致 · 修复后再复现（**不能只读报告**）
最终素材               mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
                       （experiment/run/failure 计数、defect taxonomy、review-only findings、reproducibility delta、
                         measured metrics、unresolved limitations、potential paper directions）
最终标记               RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE（需 opposite-host 复现成功 + exact-head CI 绿 +
                       用户 exposure gate PASS）；此前不得创建 programme final integration workbook
```

## 2. 逐项实测：今天有什么、缺什么 / Element by element, measured

```text
要素 / element                 今天的状态 / state now                              证据或缺口（实测）
multi-device execution        有，但目前只体现为放置 / placement                     REX-806 包 24 行落在 2 个 device（20 / 4）
one handoff or routing        只有 routing（放置决策），**没有 handoff**              live City `GET /research/replays` -> supportedScenarios=[WAIT]；
                                                                                    replay.mjs:55 对 scenarioId!=='WAIT' 或带 faultProfileRef 的源
                                                                                    回 REPLAY_CONDITION_UNAVAILABLE；
                                                                                    **routing 这一半已有独立证据**：放置策略本身按城市原始回执
                                                                                    复算 6/6（REX-806 的 PLACEMENT_RECOMPUTE_CITY_MECH.py）
one injected fault + recovery **没有** / absent                                      包内 `exclusions.json` 第三条（what = "fault and recovery
                                                                                    metrics"，why = "no fault receipt is present in the provided
                                                                                    sources"）；live City `GET /research/faults` -> **404**
                                                                                    （fault 控制器由 fe700ab 引入，运行中的 0261a9e 不含该分支；
                                                                                    fe700ab 已在 3950d47 内）
repetitions                   有                                                     18 个 campaign / 24 runs / 22 measured / 2 warmup
one replay                    有                                                     11 次重放（dataset 里 7 行 REPLAY + 4 行 ABLATION）
one ablation                  有                                                     4 行；seed-only 偏离**恰**出现在消融行（两种实现都验过）
artifact export               有                                                     reports/REX-806/artifact（10 文件 + checksums；clone 校验 10/10）
trace / provenance 对比        有材料                                                  rawPointers：receipts 18 · canonicalTasks 26 · traceRecords 176 ·
                                                                                    experiments 17；另有 PROVENANCE_CROSSCHECK 8/8
opposite-host 独立复现         未开始                                                 REX-806 工作书 review_host 仍为 null
RESEARCH_MATERIAL_SYNTHESIS    尚不存在（路径已由工作书指定）                            reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
```

**另有一条部署事实**（对 REX-807 的 Export/Danger 两节同样有效）：运行中的 City 是候选 `0261a9e`，它**既没有** fault 控制器，**也没有** REX-806 的 artifact 导出面（`GET /research/artifacts` 同样是 404）。REX-806 的包是**用 REX-806 checkout 里的 CLI 打那台 City 的 campaign 路由**生成的，所以包存在并不代表 City 上有导出面。 / Deployment fact: the resident City runs 0261a9e, which serves neither the fault controller nor the artifact surface; the package was produced by the CLI talking to that City's campaign routes.

## 3. 因此 REX-890 的「注入故障」有三个选项，且这是**待决定项** / Three options, and the choice is not this host's

本机**不替领取者决定**，只把代价写清： / The cost of each, stated rather than decided:

```text
A  部署含 fault 控制器的候选（最小：3950d47 已含 fe700ab），在 City 上真实注入一次故障并观察恢复，
   把它与同期 campaign receipt 配对；包里仍会保留那条 fault/recovery 排除（exporter v1 有意只读 campaign 范围），
   因此 study 的故障证据来自 fault receipt 集本身，而不是 artifact
   代价：一次部署 + 一次故障演练；不需要改产品代码
B  把 exporter / replay 扩到能承载 fault receipt（即 v1 之后的 v2 范围决定：replay 需要快照 fault 条件）
   代价：产品改动 + 新工作书或明确的范围裁决；超出已验收的 REX 头
C  由记录持有人裁决：最低 study 的「one injected fault」以 fault 控制器的 receipt 与恢复观测满足，
   不要求它出现在 campaign 回执或 artifact 里；并把该裁决写进 REX-890 工作书
同样需要裁决的还有「one handoff」：v1 只支持 WAIT 场景，**handoff 在本代能力里不可表达**，
除非 (i) 认定「routing decision」已由放置决策满足（包内有 SEEDED_WORKER_SELECTION 与策略钉定两种规则），
或 (ii) 新建 handoff 场景（产品工作，超出已验收头）。
```

**本机的建议（不是决定）**：先走 A + 对 handoff 走 (i)，并把两处判断写进工作书；若记录持有人要求 handoff 场景本身，则应把它记为 REX 系列的**新增范围**，而不是塞进 REX-890 的完成门槛。 / Suggested, not decided: option A plus treating the placement decision as the routing decision, with both judgements recorded in the workbook.

### 3.1 A 到底是不是「部署演练」？——已实测 / Is option A only a deployment exercise? Measured

「能力是否存在」不能靠读代码回答，所以本机写了一个**只在临时目录里起一个 City** 的探针
（[`rex890-fault-and-artifact-feasibility.mjs`](./rex890-fault-and-artifact-feasibility.mjs)，不碰常驻 City、不碰它的数据目录与凭据），
在两个头上跑同一份： / A probe that starts one City in a temp directory, run against two heads with the identical file:

```text
HEAD UNDER TEST  3950d47（REX-806 union head，含 fault 控制器与 artifact 导出面）
  PASS  artifact surface is deployed (typed 422, not 404)        HTTP 422 ARTIFACT_NO_SOURCE
  PASS  artifact preview answers the same way                    HTTP 422
  PASS  [non-discriminating] research surface refuses node cred   HTTP 401
  PASS  a fault can be injected on this head                     HTTP 200 fault-73c3602c-…
  PASS  the fault is targeted: faulted node fails, other does not target=503 other=200
  PASS  recovery is observable after the stop                    stop=200 recovered=200
  PASS  the receipt exposes the fault with metrics               status=STOPPED injected=1 detection=null recovery=6
  PASS  fault and artifact surfaces coexist on one City           artifacts=422 fault detail=200
  8/8 feasibility checks pass                                    exit=0

CONTROL  0261a9e（今天实际部署在 City 上的候选）
  FAIL  artifact surface is deployed                             HTTP 404
  FAIL  artifact preview answers the same way                    HTTP 404
  PASS  [non-discriminating] research surface refuses node cred   HTTP 401
  FAIL  a fault can be injected on this head                     HTTP 404
  FAIL  fault-dependent checks were skipped, not passed           targeting/recovery/receipt/coexistence 在此头无法测量
  1/5 feasibility checks pass                                    exit=1
```

**结论**：REX-890 的「注入故障 + 恢复」在**已存在但未部署**的头上是可执行的，包括定向性（只有被注入的节点失败）、
可观测恢复、以及故障回执上的 metrics；**选项 A 是部署演练，不是产品缺口**。反过来，今天 City 上确实是 404 ——
两个头用同一份探针给出不同结果，这才是这条证据的分量所在。 / Option A is a deployment exercise rather than a product gap; the same probe distinguishes the two heads, which is what gives the measurement its weight.

**一条必须自己先踩的诚实细节**：探针在注入后 2 秒内就 stop，因此 `detectionTimeMs` 保持**未测**（回执里带 typed
`missingReasons`），只有 `recoveryTimeMs` 有值——**「不知道就不写数」的规则在故障回执内部同样成立**，探针没有因为
「反正它会自己填」而放松断言。若要 study 里拿到 detection 值，必须让故障持续超过 heartbeat 超时并等待离线被观测。 / The probe stopped the fault before the heartbeat timeout, so `detectionTimeMs` stayed NOT_MEASURED with a typed reason while recovery was measured: the honesty rule holds inside the fault receipt too.

**探针自己的两个缺陷（记录在案）**：① 它最初只读 `error.code`，而 City 的错误有两种形状（老路由是字符串、新路由是对象），
于是把一个**正常工作的导出面**报成失败；② 它在控制头（没有 fault 路由）上假设故障一定存在，于是抛异常中断——正是它本应
描述的那个头。两者都已修正，且在§3.1 的探针里带着注释保留。另有一条**非区分性检查**（研究面拒绝节点凭据）在两个头上都
通过，因此它**永远不能**被引用为「故障面存在」的证据，标签里已写明。 / Two of the probe's own defects are recorded (error shape; assuming a fault exists), plus one check labelled non-discriminating because it passes on both heads.

### 3.2 端到端演练：一个全新的 City 能不能产出可验证的材料包 / End-to-end rehearsal on a brand-new City

上面测的是「能力存在」。真正要回答的是**整条链**能不能跑通，所以本机写了一个演练
（[`rex890-study-rehearsal.mjs`](./rex890-study-rehearsal.mjs)，临时目录 + 临时端口 + 一次性凭据，**完全不碰常驻 City**）：
新建 City → 两个执行节点 → 登记实验 → 跑一个 6 次重复的 campaign → 注入一次故障并观察恢复 → **用真正的 CLI 导出**
→ 用独立的包内校验器验证。**13/13 通过**： / The rehearsal runs the whole chain on a City that did not exist a minute earlier - fresh City, two execution nodes, experiment registration, a 6-repetition campaign, a real fault injected and recovered, export by the real CLI, verification by the independent verifier:

```text
PASS  a fresh City starts and answers the owner            HTTP 200
PASS  two execution nodes are online                        worker-a:true worker-b:true
PASS  the experiment registers / the campaign starts         HTTP 200 / HTTP 200（6 runs）
PASS  the campaign settles                                  state=COMPLETED
PASS  the City holds a receipt for the campaign             receipts=1
PASS  both workers did real work (multi-device placement)    workers that claimed: worker-b, worker-a
PASS  a fault can be injected in this City                   HTTP 200
PASS  the fault is targeted: only the faulted worker refused faulted=503 other=200
PASS  recovery is observable after the stop                  stop=200 recovered=200
PASS  the fault receipt records what was observed            status=STOPPED injected=1 detection=null recovery=4
PASS  the real exporter CLI produces a package               exit=0 · 1 campaign / 6 runs / 6 measured / 4 项有值 / 23 NOT_MEASURED
PASS  the independent verifier accepts the produced package  14/14 independent checks pass
```

产出的包又用本记录区的**第三种实现**（Python，27 项）复核：**27/27**。它是**另一座 City**的包，因此这条同时证明
校验器不是为那一份包量身定做的。 / The produced package also passes the 27-check Python implementation - and it comes from a different City, which shows the checker is not tailored to one package.

### 3.3 演练量出的「怎么写 study」规则（对领取者直接有用）/ What the rehearsal measured about writing the study

```text
1  manifest 的 workers 必须是 hosts 的子集，且 SINGLE_CITY 的 maxHosts = 1
   => 两个 worker 的 study **不能**声明 SINGLE_CITY；正确写法是 TWO_HOST_MESH + hosts=workers=[两个 device ref]
   （本机实测：SINGLE_CITY + 2 hosts 被回 TOPOLOGY_IMPOSSIBLE；hosts=[city] + workers=[a,b] 被回
     「worker a is not one of the declared hosts」；常驻 City 里 18 个真实回执用的正是 TWO_HOST_MESH）
2  每次 run 只创建一个 task，且**按放置结果指定给某一台 worker**，所以驱动端要对每个 worker 都发起 claim，
   拿到 task 的那个再报 RUNNING -> COMPLETED；run 是**串行**的，下一个 task 在上一个终态后才出现
3  故障注入若安排在 campaign 进行中并落在**被指定的那台** worker 上，会合法地卡住该 run——
   这本身是一个值得单独做的实验，不该和「能不能产出材料包」混在一次里
4  宿主型阻塞陷阱：City 跑在父进程里时，**不能用 spawnSync 去调 CLI**——spawnSync 阻塞父进程事件循环，
   子进程对 City 的 HTTP 请求永远等不到响应（实测连续三次 ETIMEDOUT）；改用异步 spawn 即通
```

**本机演练自身的缺陷也记录在案**：① 在驱动循环里调用 `record()`，同一条检查刷了几百行、把前面的阶段全埋了；
② 在循环里反复 stop 同一个故障；③ 用 spawnSync 调 CLI 造成自锁（见第 4 条）；④ 把两个 worker 写进 `hosts` 而
`topology` 写 SINGLE_CITY。四条都在脚本注释里，因为它们正是这份评审材料想记录的那类错误：**探针/工装与自己的假设一致，就不算证据**。 / Four defects of the rehearsal itself are kept in its comments.

## 4. 领取时该跑的清单 / The checklist a claimant should run

```text
1  确认 REX-801..807 七个标记全部释放，并取**每个任务的 accepted SHA**（不是 dev 头、不是分支名）
2  用 accepted SHA 建 union baseline，逐条实测祖先关系；预计 union = main ∪ REX-807 accepted head，
   而后者应已包含 REX-806 的并集（3950d47 已含 REX-803/804/805 三个已验收头）
3  依赖冒烟：研究系列 26 个套件（rex801 4 / rex802 2 / rex803 8 / rex804 5 / rex805 4 / rex806 3）
4  部署一个**含 fault 控制器与 artifact 导出面**的候选（否则 §3 的 A 无法执行，City 上会见到 404）
5  先跑代表性 study，再导出 artifact；导出前确认 City 上 `GET /research/replays` 的 supportedScenarios 与
   本次 study 的场景一致（本机实测为 [WAIT]）
6  产出 RESEARCH_MATERIAL_SYNTHESIS.md 的八项内容；opposite-host 复现必须由另一实体主机执行（§3 禁止自审）
```

## 5. 本预检没有做 / NOT done here

```text
· 没有领取 REX-890，没有改它的工作书字段，没有创建 reports/REX-890/
· 没有部署任何候选，没有在 City 上注入故障（因此 §2 的「故障」缺口是**读代码 + 读 404**得到的，不是演练结果）
· 没有主张 REX-890 无法完成：本预检说的是**今天没有现成证据**，三条出路都写在 §3
· 没有替记录持有人做 (A)/(B)/(C) 与 handoff 的裁决
```

---

语言读本 / English reading: [en/REX-890_CLAIM_READINESS_MECH.md](en/REX-890_CLAIM_READINESS_MECH.md)
