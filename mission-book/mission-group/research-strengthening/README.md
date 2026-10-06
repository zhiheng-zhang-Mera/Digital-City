# Research Strengthening / 研究强化工程

> **状态：READY / ACTIVE PROGRAMME**
>
> 本工程把 Utopia 从“可用的个人万能终端”继续强化为一个**可做可重复实验的多设备智能软件系统研究试验台**。
>
> 目标不是再堆一个孤立功能，而是让已有的 scheduler、handoff、recovery、AI/service routing、multi-device、Rooms、Actions、Remote Fabric 与未来 Workbench 都能被：
>
> ```text
> 定义实验
> → 重复运行
> → 自动追踪
> → 故障注入
> → 回放
> → 消融
> → 统计
> → 导出研究 artifact
> ```
>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 异步减压施工：[../ASYNC_RELIEF_CONSTRUCTION.md](../../ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../../PROCESS_DATA_POLICY.md)  
> 研究素材规则：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)  
> 研究信号优先级：[../RESEARCH_SIGNAL_WATCHLIST.yaml](../../RESEARCH_SIGNAL_WATCHLIST.yaml)  
> 研究优先级策略：Research Institute `paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md`  
> 研究控制面原则：[RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md)

## 0A. 当前论文关注点优先级

REX v1 的 instrumentation 不再平均服务所有话题。

默认顺序：

```text
G4 first:
  unified repository control plane
  capability implementation→wiring→reachability→intent
  autonomy survival until Owner intervention
  control-plane reality drift

G3 second:
  user-reachable completion terminal
  passive development→research evidence pipeline
  repo-resident executable work state
  exact identity/provenance/freshness
  structured handoff with exact state
  dynamic liveness/eligibility/wake
  independent review as evidence boundary
  registry-assisted onboarding/localization
  Owner intervention taxonomy
  hierarchical risk bubbling in progressive-disclosure monitors
  edge-causal observability for handoff/retry/review/routing
  continuous observation vs event-triggered nonblocking decision
  decision escalation provenance

G2 supporting:
  context compaction
  generic execution memory
  false-success transparency
  generic async multi-agent
  cross-model review
  evolving requirements
  generic agent monitoring dashboard / topology graph / logs
```

原则：

- REX-801/802 的 schema / trace fields 应优先覆盖 G3/G4；
- G2 作为 stressor、control、covariate 或 supporting analysis；
- G1 成熟实践只在真实 failure 时留证；
- 不允许为了热门论文方向扭曲正常产品施工或制造假 workload；
- 任何投稿前重新做 literature refresh，当前 grade 只决定 evidence budget。

## 1. PhD 申请强化目标

本 programme 必须产生的不只是“又多一套代码”，而是能在申请材料里诚实支持：

- reproducible experimentation；
- empirical software engineering；
- multi-device / distributed systems evaluation；
- AI-agent / tool-use evaluation；
- fault injection / recovery / resilience；
- human intervention measurement；
- trace replay；
- ablation study；
- research artifact packaging。

完成后应能把 Utopia 描述为：

> a reproducible experimental platform for studying multi-device AI-assisted software systems, with controlled workloads, fault injection, trace replay, ablation, cross-device scheduling and automated research-artifact generation.

## 2. 架构原则

Research Fabric 不成为第二套 task truth，也不接管正常产品执行。

```text
Normal Utopia runtime
        │
        ├── canonical tasks/actions/events
        │
        └── Research & Evaluation Fabric
              ├─ Experiment Registry
              ├─ Trace / Provenance
              ├─ Scenario Runner
              ├─ Fault Injection
              ├─ Replay / Ablation
              ├─ Metrics
              └─ Artifact Export
```

研究能力读取/编排现有产品 contract；不得为了实验方便复制 scheduler、device identity、Remote Fabric 或 Action truth。

## 3. Programme 工作拆分

| ID | 工作 | 状态 | 目标 |
|---|---|---|---|
| [REX-801](REX-801-experiment-manifest-and-registry.md) | Experiment Manifest + Registry | COMPLETE | 机器可读实验问题、拓扑、变量、重复次数和 acceptance |
| [REX-802](REX-802-trace-provenance-and-metrics-foundation.md) | Trace / Provenance / Metrics Foundation | COMPLETE | 统一记录 task/action/device/provider/handoff/retry/failure/recovery/human intervention |
| [REX-803](REX-803-scenario-runner-and-repetition-engine.md) | Scenario Runner + Repetition Engine | READY | 自动执行 controlled scenario × N |
| [REX-804](REX-804-fault-injection-and-recovery-probes.md) | Fault Injection + Recovery Probes | READY | 故意制造节点/网络/provider/load/stale/duplicate 等故障并量化恢复 |
| [REX-805](REX-805-trace-replay-and-ablation.md) | Trace Replay + Ablation | WAITING_DEPENDENCIES | 同一 trace 重放并关闭 handoff/retry/backoff 等机制做消融 |
| [REX-806](REX-806-metrics-analysis-and-artifact-export.md) | Metrics + Research Artifact Export | WAITING_DEPENDENCIES | normalized dataset、tables、artifact pack、reproduction docs |
| [REX-807](REX-807-research-control-surface-and-progressive-disclosure.md) | Research Control Surface | WAITING_DEPENDENCIES | 给 Owner 最大实验掌控/知情权，但不污染普通用户主导航 |
| [REX-890](REX-890-reproducibility-study-and-freeze.md) | Reproducibility Study + Freeze | WAITING_DEPENDENCIES | 双机独立复现实验，冻结 Research Fabric v1 |

REX-801 与 REX-802 已完成并释放 accepted exact heads。REX-803 与 REX-804 现已解锁，可在文件 ownership 不冲突时双机并行；后续 REX-805/806/807/890 继续按真实前置关系保持 `WAITING_DEPENDENCIES`。所有依赖任务使用 `DEPENDENCY_SHA_UNION_AT_CLAIM` 从前置 accepted full SHAs 建精确 union baseline；不会再把 main 分支名当作依赖已落地的证明。

### REX-803 当前实测状态（Mech，2026-10-06）

```text
DEVELOPMENT   COMPLETE on exact a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df
              （本表此前写着 57d1c919，那是首轮开发 head；该 head 之后因本任务自测发现 R-1/R-2 而前移，workbook 的
              development_head_sha 是 a695bb9。此处按 workbook 事实更正。）
              branch rex/REX-803-mech-scenario-runner，PR #31
PHYSICAL      两组 controlled campaign 已在真实常驻 City 上运行，物理 Android 手机（OPPO PERM00）作为在线控制面，
              本机 reference node 执行每一次重复；回执/trace/canonical task 回读证据在
              utopia:evidence/raw/mission-book/REX-803/
GATE          PARTIAL：completion gate 要求的 Alien + Mech + Android 拓扑中，Alien 主机节点全程 offline
              （最后心跳 2026-10-05T11:15:06Z，本机每次测量均未变化），未作为 gate 通过，也未声称通过
REVIEW        PENDING，review_host = Alien（对侧物理主机）。terminal marker 未释放，merge_authority=false
AUTHOR PASS   作者两轮自测已把缺陷与修复发布为两个可采纳分支，**均未移动 review 靶点**：
              repair/REX-803-mech-receipt-order-and-close @ 07e8c3c —— 回执列表按文件名（随机 UUID）排序导致
                「最新」列表实际返回最旧三条；有界列表不披露历史总量；close() 后 start() 仍会启动新战役
              probe/REX-803-mech-two-worker-rehearsal @ 42acdc6（叠加在上者之上）—— **两 worker 拓扑演练发现
                「按种子选择 worker」这条规则从未执行**：runOnce 读 context?.workers 而路由从不设置它（拓扑在
                context.manifest.workers），于是每次重复都是无目标创建，回执里的 assignedNodeId 是「谁先领到」。
                模块注释与 PAPER_MATERIAL_INDEX 都宣称相反。单 worker 的 fixture 无法区分「规则生效」与「规则
                从未运行」，因此它躲过了 33 个探针、一轮作者对抗自测和一次对侧 review。
              两者 CI 分别为 push 37418750045（attempt 1 失败 → attempt 2 成功，两次都留档）与
              push 37420563832 SUCCESS attempt 1。
RECOMMEND     对第二项发现，作者**建议硬化 head**（虚假的可复现性声明比存储边界情况更不该留在 review 靶点上）；
              但未单方面执行——本任务已有过一次领取碰撞，靶点移动必须由 reviewer 一句话触发。
```

REX-803 的 review 必须独立制造 workbook Review 段列出的条件（重复执行、取消、重启、timeout、partial campaign、
seed reproducibility），作者自测不构成 review 证据；作者提出的攻击清单见
`reports/REX-803/DEVELOPMENT_HANDOFF.md`，reviewer 可以并且应当拒绝它、另立更严格的探针。

### 跨任务缺陷：一个不可用的文件存储可以阻止 City 启动（Mech，2026-10-06）

REX-803 的作者自测在修完自身缺陷后，把同一探针指向“City 启动期会碰到的每一个文件存储”，发现该失效形状**在 main 上仍然存活**：在应当是目录的位置放一个文件，会让 `createGateway` 直接抛错，City 连端口都不绑定。

```text
SHAPE A  在应为目录的位置放一个文件（6 个 store）
theme-packages (capability-bridge)  BRICKED EEXIST  →  已修复：65f86f9 按内容采纳本机修复（降级 + storeState/storeReason）
research (REX-801 registry parent)  BRICKED ENOTDIR →  已修复：同上
research/experiments (REX-801)      BRICKED EEXIST  →  已修复：同上
research/campaigns / monitor / research-trace                            STARTED → STARTED
RE-MEASURED 2026-10-06 on current main b06504f：同一份 harness（先跑 213f9f9 复现旧 BRICKED 列，
             再跑 4688274/b06504f）六个 SHAPE A store 全部 STARTED —— 详细表与归属证据见
             reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md 的 re-measurement 一节

SHAPE B  在应为文件的位置放一个目录（3 个 store，两个分支结果相同）
city.sqlite (canonical store)       BRICKED "unable to open database file"   <- F-1 仍开放：此处拒绝启动是**正确**的，
                                                                                缺的是可诊断的 typed 原因；
                                                                                修复 be3670b 已在 current main 之上就绪
join-requests.json (join store)     STARTED，HTTP 200 且内存中已生成审批行，但**什么都没落盘**   <- F-2 有意的静默
execution-profile.json (WBC-604)    change() 抛错，但内存 profile 已经切换   <- F-3 违反该模块自己声明的 rule 2
                                                                                （已给第三个可采纳修复分支）
```

v1 版本的表格声称有 8 个探针，实际只有 6 个（其中两行 `relative = null` 根本没埋雷，join 行的 `HTTP 400` 还是探针自身把字段名写成 `claimSecret` 造成的）。该仪器缺陷连同更正后的实测一并记录，不做静默清洗。

完整记录（两个 bricking 实例、F-1/F-2/F-3 三种不同失效模式、成对前后测、可采纳修复分支、以及三条仪器教训）见
[reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md](../../reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md)
（扫描 harness 作为可复现证据一并提交为 `reports/REX-PROGRAMME/store-shape-sweep-v2.mjs`）。
更新（2026-10-06，Mech 复测）：**两个 bricking 实例已在 current main 上关闭**——对侧主机的 CEX-790 集成提交
`65f86f9` 按**内容**采纳了本机发布的两个 store-guard 修复（`registry.mjs`、`theme-artifacts.mjs` 现以
`storeState/storeReason` 降级并附带守卫测试），本机用同一份 harness 在 `213f9f9 / 4688274 / b06504f` 三头复测确认。
**仍开放**：F-1（`city.sqlite` 拒绝启动正确、但原因未打字化，修复 `be3670b` 已在 current main 之上就绪，守卫探针 3/3）
与 F-3（profile 半切换，修复分支 `1f2f08c` 已过期，需先 rebase）。
**v3 复测（2026-10-06，Mech）**：补上第五个实例（REX-804 的 fault store）并新增「该头不构造的 store 不得读成安全启动」规则后，
`3950d47`（REX-890 若要部署就是这个头）上**五个模块级实例全部已守卫**——fault store 报
`STARTED-DEGRADED storeState=UNAVAILABLE reason=EEXIST`；已部署候选 `0261a9e` 该格为 `NOT EXERCISED`（无 fault 面）。
并且被验收头 `fe700ab` 的守卫**比当初的 `adc075e` 更严**：把文件放在 fault store 位后 City 照常启动、列表如实报降级，
而**启动故障被 typed 拒绝**（503 `FAULT_STORE_UNAVAILABLE`）；因此 `690d723` 不再等待 `adc075e`。
harness 见 `reports/REX-PROGRAMME/store-shape-sweep-v3.mjs` 与 `fault-store-start-check.mjs`。
涉及的模块均已合并进 main 且其任务（REX-801、MB-008 legacy、WBC-604）已关闭，因此本机只发布测量、修复分支与探针，
**不合并、不改 main、不触碰关闭任务的记录**。

该缺陷同时是 REX 的论文素材（§7）：重复故障注入、before/after 对照、以及一条可复用的“失效形状扫描”方法学。

### 当前可领取状态（Mech 复扫，2026-10-06）

按领取规则重扫整个 mission-book（24 个真实 workbook，模板 XX-000 除外）后的结论：**Mech 当前可领取的开发任务为 0**。

```text
READY 且未被领取                                    0
开发已完成、等待对侧主机 review                     2   (REX-803 / MON-903；作者均为 Mech，§3 禁止自审)
review 已被领取、等待判定                           2   (MON-902 → Alien 已领取；REX-804 → Mech 已给 NOT PASSED)
依赖未满足                                         5   (REX-805/806/807/890、MON-990)
对侧主机已领取未开工                                1   (SHOW-401，dev=Alien)
```

REX-805 的 `dependencies` 明确要求 `REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED`，因此它不会因为 REX-801/802 已接受而解锁。
本机可做的下一步全部落在对侧物理主机（Alien review / Alien repair）或离线的 Alien 节点上；本机不做投机性 union baseline，
也不自行制造“可领取”工作。本轮的施工因此落在**不占任务、可复用的验证与缺陷发现**上，其结果即上文两项实测。

对侧主机于 2026-10-06 15:12–15:18 重新上线（Alien-codex），完成了 CEX-790 current-main 集成（PR #33，MERGEABLE，
CI 绿），并在其中**采纳了本机发布的两个 store-guard 修复分支**（附来源标注）；同时领取了 MON-902 review。
该集成报告另记录了一条 Owner 指令：优先 CEX-790 并使其可合并，随后直接做 MON，取代此前的 REX-before-MON 排序，
SHOW 仍然排除。该指令直接授权的是 Alien 的集成与后续 MON 工作；本机据此复扫任务池，结论不变（Mech 可领取为 0）。

## 4. 双机异步施工

沿用现有 Alien / Mech：

```text
Alien Development  → Mech Formal Review
Mech Development   → Alien Formal Review
```

强制继承：

- atomic claim；
- different physical host review；
- CI / 长实验等待不占主机；
- event wake-up；
- 约 20 分钟 bounded rescan；
- fresh critic；
- Review → Repair；
- exact-head evidence；
- latest-main integration；
- no make-work。

研究任务尤其禁止“实验跑着所以主机只能等”。长 repetitions / fault campaign / CI 期间，施工主机应继续扫描其它不冲突工作。

## 5. Research Fabric 不是 Workbench 前置依赖

Alien + Mech + Android 就必须能完成 v1。

未来 Workbench 只是：

```text
additional experiment nodes / higher workload scale
```

而不是：

```text
research architecture prerequisite
```

若本 programme 因没有 Linux/Workbench 无法正常开发或验证基础 contract，即设计失败。

## 6. 用户暴露原则

本 programme 全部服从全局 `CONSTRUCTION_RULES.md` 的 **Capability Exposure Gate**。

特别地：

- experiment create/run/stop/export = 用户直接操作，必须有明确入口；
- experiment status / metrics / provenance = 用户必须可观察；
- fault injection = 高影响高级控制，不放普通主导航，但必须有显式 Research/Advanced 入口、风险说明和确认；
- raw internal trace plumbing = 可为 INTERNAL_ONLY，但必须有 exposure decision 记录；
- 普通 Utopia 用户不应被 Research controls 淹没。

详细收纳见 [RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md)。

## 7. 强制论文素材

所有 REX 任务执行 [RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)。

任何：

- 运行报错；
- test/CI fail；
- timeout；
- race；
- incorrect measurement；
- false assumption；
- Development / Review 逻辑冲突；
- fault campaign unexpected outcome；
- failed replay；
- non-reproducible result；
- before/after metrics；

都必须保存，不得在修复后清洗。

## 8. Final merge lock

现在不创建 final integration workbook。

只有 REX-801..807 全部：

- Development complete；
- opposite-host Review complete；
- exact-head CI green；
- exposure decision satisfied；
- PAPER/RESEARCH material index complete；

之后 REX-890 才能进行独立 reproduction study。

Programme terminal marker：

`RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`

该 marker 不代表所有论文问题已经回答，只代表 Utopia 已具备可靠地产生研究数据的基础设施。

## 当前回查 / Current pool recheck

**REX 系列收尾（2026-10-06，Owner 授权合并/采纳窗口）**：先用实现仓库的推送记录反查八本工作书的声明（**无一处矛盾**，方法见 `reports/REX-PROGRAMME/REX_SERIES_STATUS_RECONCILIATION_MECH.md`），再把三个**已验收**头合并进 main —— 并集 = main + `0261a9e`（REX-805，内含 REX-803 的 `8798ba9`）+ `fe700ab`（REX-804），唯一冲突点 `server.mjs` 按并集解出（campaigns/replays 与 faults 都构造、返回都暴露、teardown 两边都释放），并同时采纳三条已发布修复（`14499ad` relay 探针、`be3670b` 规范库 typed 诊断、`690d723` 的 REX-804 证据写入 hunk）。**merge head `312b627`，托管 CI run 37474155034 两个 job 全绿**；REX-801..805 套件 99/99；三面共存冒烟 v2 跑通（campaign → replay 在 fault ACTIVE 下闭合）。合并后反查：REX-801/802/803(dev+review)/804/805 全部 `in_main=True`。
**边界不变**：REX-806 仍 `IN_PROGRESS`（`review_host: null`、标记未释放，其自身内容**未**随本次进入 main），因此 REX-807/890 仍 `WAITING_DEPENDENCIES` —— **合并 ≠ 验收**。详见 `reports/REX-PROGRAMME/REX_SERIES_MERGE_MECH_2026_10_06.md`。

**Owner Gate 已打开（2026-10-07，Owner 指令）**：Owner 指示「对 REX 系列打开 Owner Gate，允许**合格的**子任务合并」。按「合格 = 自身复检已完成、标记已释放」的口径落到工作书 frontmatter：**REX-801..805 的 `merge_authority: true`**（五本都已验收且已在 main），**REX-806/807/890 保持 false**直到其复检完成——第一次把八本一律置 true 时，一致性门禁如实报出 `MERGE_AUTHORITY_BEFORE_REVIEW`（3 条），据此收紧为现在的口径。每本工作书都新增 `owner_gate_ruling_2026_10_07` 记录该裁决；**REX-806 的复检、REX-807/890 的依赖状态不因开门而改变**。

REX-803 已于 exact8798ba9 完成 Alien 对机正式验收：技术复检与三端 campaign 原始材料均核验，SCENARIO_REPETITION_ENGINE_ACCEPTED 已释放。trace metadata 保持 PARTIAL。REX-804 已于 exactfe700aba 验收。REX-805 已于 exact0261a9e 由本机复检通过并释放标记。**REX-806 开发已完成**（工作书 `development_complete: true`、head `3950d47`、托管 CI 与全量套件均已过、包 10/10 clone 校验、自查 8/8 + 11/11），**唯一未完成的一半是对侧实体主机的独立读取/重算**——§3 禁止自审，本机不能代做；该复检一旦通过，`RESEARCH_ARTIFACT_EXPORT_ACCEPTED` 释放，REX-807 与 REX-890 的依赖随即可满足。REX-807 的**领取就绪预检**（依赖闸门、claim-time union 会解析成什么、七个暴露层现在分别落在哪个头、以及开工时的工作量）见 [reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md](../../reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md)。

**REX-890 的领取就绪预检另记了一条结构性发现**（[REX-890_CLAIM_READINESS_MECH.md](../../reports/REX-PROGRAMME/REX-890_CLAIM_READINESS_MECH.md)）：它最低 study 的八项里，**「注入故障 + 恢复」今天没有现成证据**——包内第三条排除写明没有 fault receipt，且运行中的 City（候选 `0261a9e`）`GET /research/faults` 与 `GET /research/artifacts` **都是 404**（fault 控制器与导出面都在更后的头上）；**「handoff」在本代能力里不可表达**（live City `supportedScenarios=[WAIT]`，`replay.mjs:55` 对非 WAIT 或带 `faultProfileRef` 的源回 `REPLAY_CONDITION_UNAVAILABLE`），只有「routing decision」由放置决策覆盖。三条出路与其代价（部署演练 / 扩到 v2 / 记录持有人裁决）都写在预检里，本机不替记录持有人决定。SHOW 不执行，不启用 parked/new programme。以下早期段落保留为 dated history，当前权威见任务个体与正式验收报告。

REX-803 is formally accepted by Alien at exact8798ba9 after technical and three-end material review; SCENARIO_REPETITION_ENGINE_ACCEPTED is released while trace metadata remains PARTIAL. REX-804 is accepted at exactfe700aba. REX-805 can be claimed against accepted dependency heads;806/807/890 continue waiting under their workbook dependencies. SHOW and parked/new programme execution remain excluded. Earlier sections below are dated history; current authority is the workbook and formal acceptance report.


---

[English translation / 完整英文说明](en/README.md)

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 5/8 · 开发 / Development 6/8 · 复检 / Review 5/8 · `IN_PROGRESS`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [REX-801](REX-801-experiment-manifest-and-registry.md) | COMPLETE | YES | YES | YES |
| [REX-802](REX-802-trace-provenance-and-metrics-foundation.md) | COMPLETE | YES | YES | YES |
| [REX-803](REX-803-scenario-runner-and-repetition-engine.md) | COMPLETE | YES | YES | YES |
| [REX-804](REX-804-fault-injection-and-recovery-probes.md) | COMPLETE | YES | YES | YES |
| [REX-805](REX-805-trace-replay-and-ablation.md) | COMPLETE | YES | YES | YES |
| [REX-806](REX-806-metrics-analysis-and-artifact-export.md) | IN_PROGRESS | YES | NO | YES |
| [REX-807](REX-807-research-control-surface-and-progressive-disclosure.md) | WAITING_DEPENDENCIES | NO | NO | YES |
| [REX-890](REX-890-reproducibility-study-and-freeze.md) | WAITING_DEPENDENCIES | NO | NO | YES |

<!-- SERIES_DASHBOARD:END -->

### Mech 复验结果（2026-10-06，REX-804）/ Mech re-verification of REX-804

REX-804 的复验已完成，结论写入 `reports/REX-804/REVERIFICATION_REPORT.md`：

- **B1 已关闭**：f4ceae73 的 `faults.mjs` 与本人发布的修复分支逐字节一致，本人九个探针（含 P8 这个 B1 回归守卫）在 f4ceae73 与分支 tip `075ddc13` 上均 **9/9 通过**。
- f4ceae73 上那次 CI 红被归类为**作者自测的宿主调度依赖**，不是产品回归：采纳之后两个提交只改测试与证据，两 head 之间 `services/apps/contracts` 差异为**空**；本机在两侧各连续 5 次 8/8 通过。作者自行诊断并注入受控时钟修复。
- **新增阻塞性发现 B4**：该分支**无法并入当前 main**。tip 的 PR run 红而 push run 绿不是抖动——push 针对旧 base，PR 针对与新 main 的合并结果。本机在 `origin/main b06504f`（现已包含被采纳的 REX-801 store-guard 探针）与 `075ddc13` 的合并结果上确定性复现：`tests/rex801-store-guard.test.mjs` **1 pass / 1 FAIL，`ENOTDIR ... mkdir '<runtime>/research/faults'`**，而 main 单独运行为 2/2。根因是一行：`services/dev-gateway/research/faults.mjs:9` 的 `mkdirSync` 无保护，而该控制器在 City 启动期被构造——**这是 store-guard 类的第五个实例，也是最尖锐的一个**，因为同一文件里的**读**路径已为 B1 修好，而同一行的 mkdir 没修。
- **判定 `075ddc13`：NOT PASSED（B4）**；marker `FAULT_INJECTION_RECOVERY_ACCEPTED` 未释放，`review_complete` 保持 false。
- 可采纳最小修复：`repair/REX-804-mech-fault-store-guard-on-current-main` @ adc075e（= 合并结果 + 该一文件的保护构造）。修复后同合并结果上：REX-801 守卫测试 **2/2（91ms，原为 1/1 且 34 201ms）**、REX-804 四个套件 **19/19**、托管 push run **37424594316 SUCCESS attempt 1**（gateway-web 与 android 均绿，且恰是原先变红的那一步）。

REX-804 re-verification is complete; the verdict is in `reports/REX-804/REVERIFICATION_REPORT.md`. **B1 is closed** (the author's `faults.mjs` is byte-identical to this reviewer's published repair; all nine reviewer probes pass on both repaired heads, including the P8 regression guard). The interim CI red at f4ceae73 is a **host-scheduling-dependent test**, not a product regression: the two commits after the adoption change tests and evidence only, the product diff between the heads is empty, and the suite passes 8/8 five times on each head here. **New blocking finding B4:** the branch is **not mergeable into current main** - the tip's PR run is red while its push run is green because a push tests the old base and a PR tests the merge with the new main; reproduced deterministically on the local merge of `origin/main b06504f` with `075ddc13`, where the adopted REX-801 store-guard probe goes 1 pass / 1 fail with `ENOTDIR ... mkdir '<runtime>/research/faults'` against 2/2 on main alone. Root cause is the unguarded `mkdirSync` at `services/dev-gateway/research/faults.mjs:9`, constructed during City startup - the **fifth instance of the store-guard class**, and the sharpest, because the read path in the same file was repaired for B1 while the mkdir on the same line was not. **Verdict on `075ddc13`: NOT PASSED for B4**, marker unreleased. Adoptable minimum repair `repair/REX-804-mech-fault-store-guard-on-current-main` @ adc075e (the merge result plus the guarded construction): after it the guard test is 2/2 in 91 ms and hosted push run 37424594316 is terminal SUCCESS attempt 1 on the merge.



复验来源说明 / Re-verification provenance: 上述 Mech 结论针对历史 `075ddc13`，完整证据见 [REVERIFICATION_REPORT](../../reports/REX-804/REVERIFICATION_REPORT.md)（[完整中文](../../reports/REX-804/zh-CN/REVERIFICATION_REPORT.md)）；[英文阅读译本](en/README.md)保留全部复验细节。后续 [AUTHOR_REPAIR](../../reports/REX-804/AUTHOR_REPAIR_Alien.md)（[完整中文](../../reports/REX-804/zh-CN/AUTHOR_REPAIR_Alien.md)）是独立作者修复来源，不自行构成对侧宿主验收；[canonical 工作书](REX-804-fault-injection-and-recovery-probes.md)仍是当前 authority。 / The Mech verdict above concerns historical `075ddc13`; the linked report and complete Chinese reading translation preserve its evidence, and the English reading page preserves all details. The later linked author repair is a separate provenance source and does not itself establish opposite-host acceptance; the canonical workbook remains current authority.

### 当前候选交接更新 / Current candidate handoff update

REX-803 review8798ba9 exact CI全部SUCCESS，71相关测试与8独立critic探针通过；实体门槛仍NOT_RUN。常驻City实际回查确认Android/Gateway同City，Alien保存成员配置却被拒绝INSTALLATION_RETIRED，详见RESIDENT_CITY_RECHECK_Alien。REX-804 development候选fe700ab包含新main并修复Mech复验B4，19相关测试、push37424946247/PR37424951038/linkage37424951044均SUCCESS；development_complete=true，Mech对新候选的正式复验待完成。旧头075ddc1的B4 NOT_PASSED保持历史结论，不等同新头已验收。

REX-803 review8798ba9 has all exact CI runs SUCCESS,71 affected tests and8 independent critic probes passing; the physical gate remains NOT_RUN. A live recheck confirms Android/Gateway identity agreement, but Alien's saved member configuration is rejected asINSTALLATION_RETIRED. REX-804 candidatefe700ab includes new main and repairs Mech's B4 finding;19 affected tests and all three exact CI runs succeed. Development is complete for Mech's formal re-verification. The NOT_PASSED verdict on previous075ddc1 remains historical; it does not accept the new head. Canonical workbooks remain authoritative.


### REX-804 复验结论：已验收 / REX-804 re-verification: ACCEPTED

```text
ACCEPTED HEAD   fe700aba957990f93b22fd63d594ddfff7b4e243（含 current main b06504f 与原始评审靶点 f76ccf53 为祖先）
B1  CLOSED      不可读故障回执阻止 City 启动 —— 本人 P8 回归守卫在三个 head 上均通过
B4  CLOSED      同一 store-guard 形状出现在 fault controller 的无保护 mkdir —— 现已修复：构造期降级为
                storeState/storeReason、list() 披露、对不可用存储注入返回 typed 503 FAULT_STORE_UNAVAILABLE、
                普通任务不受影响。判据是在**含 current main 的 head 内部**重跑那条当初变红的探针：
                tests/rex801-store-guard.test.mjs 2/2（97ms / 51ms，原为 1/1 且 34 201ms），
                以及 pull_request run 37424951038 终态 SUCCESS —— 该 run 在 075ddc1 上正是红的。
CI              push 37424946247 / PR 37424951038 / linkage 37424951044，逐次 API 复核，均 SUCCESS attempt 1
MARKER          FAULT_INJECTION_RECOVERY_ACCEPTED 已在 fe700ab 上释放
SCOPE           明确而非暗示：Android 原生故障控制面与真机/外部 provider 恢复仍为 NOT_RUN；
                DUPLICATE_EVENT 的恢复指标结构性 NOT_MEASURED（回执带原因），本人 P6 断言的正是这个 null + 原因
REVIEWER 仪器   本轮还发现并修好了**本人自己的**探针缺陷：P6 用 durationMs 150 配 350ms 睡眠，把「多快算快」
                交给了宿主；满载下 DELAY_RESULT 计数为 0。这与本人在第一轮复验中给作者 fixture 做的分类是
                同一个缺陷类，且同样由「隔离绿 / 满载红」暴露。修复于 review/REX-804-mech-review @ 53d01a3
                （窗口 1200ms + 等待被持有的 report promise）；修后隔离 9/9 ×3、与三个重型浏览器套件并发
                13/13、全量套件中 P6 亦绿。两次状态都入档，未用修正覆盖红的一次。
报告            reports/REX-804/REVERIFICATION_REPORT.md
```

REX-804 is **ACCEPTED** at `fe700ab`: B1 (an unreadable fault receipt prevented City startup) and B4 (the same store-guard shape in the fault controller's unguarded `mkdir`, which made the branch unmergeable into current main) are both **closed**, and closed by the reviewer's own regression probes rather than by the author's suite - the B4 criterion being the exact probe that was red on the unguarded merge, re-run **inside the head that contains current main** (2/2 in 97 ms, where it was 1/1 and 34 201 ms), plus the pull_request run 37424951038 that is now terminal SUCCESS at the step that was red at 075ddc1. Three exact-head runs, read one at a time, all SUCCESS attempt 1. Marker **FAULT_INJECTION_RECOVERY_ACCEPTED released**, with scope stated rather than implied: Android native fault controls and physical/external-provider recovery remain NOT_RUN and DUPLICATE_EVENT recovery stays structurally NOT_MEASURED. This round also found and fixed **the reviewer's own** instrument defect - P6 handed "how fast is fast" to the host with a 150 ms fault window and a 350 ms sleep, failing under full-suite load with "DELAY_RESULT recorded that it was exercised (got 0)"; the same defect class the reviewer had classified in the author's fixture one round earlier, and exposed the same way by a green isolated run disagreeing with a loaded one. Fixed on `review/REX-804-mech-review @ 53d01a3` (1200 ms window, and the held report promise is awaited); both states are kept in the record.

### REX-803 三端完成闸门：已在真实 City 上跑通 / REX-803 three-end completion gate: MET on the live City

```text
WHEN        2026-10-06T08:01Z，常驻 City（已更新到 8798ba9 并保留数据目录）
BLOCKER     **不是对侧主机不在**，而是 manifest 里写了过期的身份：历次尝试都声明 alien-reference-node
            （Alien 主机 2026-10-05 用过的名字，早已离线），而同一台主机全程以规范化入会身份
            dev-8128a1ef25c5c4b7f66fc31b21705858（Alien-MERA-ALIANWARE）在线。
            这是 F8 的推广：manifest 必须声明 City **实际报告**的身份，记住的名字会腐烂。
CAMPAIGN    campaign-966cf439-7017-4bb0-88e8-981e59c18322，状态 COMPLETED (REPETITIONS_FINISHED)
            拓扑 TWO_HOST_MESH：hosts/workers = [Mech dev-031fdba6…, Alien dev-8128a1ef…]，
            controlSurface = Android PERM00 dev-be7832e35…
  run 0     MEASURED  放置 dev-031fdba6…(Mech)   task Q-be723362-…
  run 1     MEASURED  放置 dev-8128a1ef…(Alien)  task Q-f78eaee3-…   <- 由**对侧主机**执行并测得
  run 2     MEASURED  放置 dev-031fdba6…(Mech)   task Q-697aab2c-…
  summary   planned 3 / accounted 3 / measured 3 / timedOut 0 / failed 0 / terminalAccountingComplete true
            三条放置均在运行前由 runSeed 预测并与实际一致
MATERIAL    三个 canonical task 全部 COMPLETED 且带 researchRunRef；research trace 记录
            RESEARCH_CAMPAIGN_STARTED @2026-10-06T08:00:39.601Z（storageState READY，completeness PARTIAL 如实标注）；
            不可变回执 campaign-966cf439-…json 已落盘于 <runtime>/research/campaigns/
EVIDENCE    已发布可跨主机复核的匿名材料包（6 个数据文件 + 索引，含逐字节 immutable receipt、trace epoch 快照、
            PARTIAL 的 missing/dropped/clock 逐项说明与由包内文件重算的 derived checks；生成器与第二实现另置于
            payload 之外的 evidence-tools/）：
            reports/REX-803/evidence/MATERIAL_INDEX.md（+ MATERIAL_HANDOFF_MECH.md）
            早前只在本机磁盘的原始 JSON 引用同样保留：D:/utopia-chat/evidence/REX-803/…
            完整记录：reports/REX-803/THREE_END_GATE_MEASUREMENT.md
NOT CLAIMED terminal marker 未释放。REX-803 的 Formal Review 属对侧主机，作者不代为判定；本机只交付证据。
```

REX-803's three-end completion gate is **MET**: on 2026-10-06T08:01Z a controlled campaign ran on the live City (updated to `8798ba9`, data directory retained) across the Mech + Alien + Android topology, with all three repetitions measured - including the one placed on the **Alien host's** node - every canonical task COMPLETED with its `researchRunRef`, the trace recording the campaign, and the immutable receipt filed. The two-day blocker was **not** an absent host: every earlier attempt declared `alien-reference-node`, a name the Alien machine used on 2026-10-05 and which went stale, while the same host was online the whole time under its canonical enrolled identity `dev-8128a1ef…`. That is finding F8 generalised - a manifest must declare the identities the City actually reports. The terminal marker is **not** released: the Formal Review and its verdict belong to the opposite host, and this host is the author. The reviewer's one blocking condition - that the raw material existed only on this host's drive while a MEMBER session correctly refuses the owner-scoped endpoints - is now answered by a published, hash-bound package under `reports/REX-803/evidence/` (redacted raw JSON, byte-identical immutable receipt, the whole collector epoch holding the campaign, per-file SHA256, and the missing/dropped/clock reasons for `PARTIAL` recomputed from the collector's own predicate), together with the generating script and the arithmetic that re-derives each seed and placement from the package alone.

### REX-803 正式验收 / Formal acceptance

Alien 正式验收 exact8798ba9，材料38项独立检查通过，3次种子/执行节点与原始回执、canonical tasks 和 trace 对齐；trace metadata PARTIAL、未发布的全局197条原始窗口、缺失provenance和意图验证NOT_TESTED均保留。新入会身份开始于07:29，不能描述此前两天始终在线。详见 [正式验收](../../reports/REX-803/FORMAL_ACCEPTANCE_Alien.md)。

Alien accepts exact8798ba9 after38 independent material checks and three matching seed/placement/receipt/task/trace bindings. PARTIAL trace metadata, the unpublished whole197-record window, missing provenance and NOT_TESTED intent validation remain explicit. The fresh enrollment began at07:29, not two days earlier. See the formal acceptance report linked above.

### REX 集成前置测量：两个产物各自干净，合在一起不干净 / REX integration preflight: each product merges clean, together they do not

REX-803 被接受**之后**才第一次尝试集成，会把冲突留到最不方便的时候。所以先测（§11 要求集成从当时最新 main 开始，本轮从 `b06504f` 出发，用**已接受的**身份）： / Integrating for the first time only after REX-803 is accepted would surface the conflict at the worst moment, so it was measured first, from the then-latest main `b06504f`, using the **accepted** identities：

```text
8798ba9 已接受 REX-803 -> main 单独                CLEAN
fe700ab 已接受 REX-804 -> main 单独                CLEAN
两者同时 / both together                          CONFLICT x2，均在 services/dev-gateway/server.mjs
```

两处冲突都是 §11 点名的 union/superset 情形（双方互不引用：fault controller 不含 campaign，campaign 段不含 faults），已按显式并集解出并测量： / Both conflicts are the union/superset case - neither side references the other - resolved as an explicit union and measured：

```text
integration/REX-accepted-heads-mech-preflight @ 704c518   （父提交 = 两个已接受身份）
  focused  tests/rex803-*. + rex804-*.         48 pass / 0 fail（13 套件）
  full     pnpm test                          1404 pass / 3 fail / 1407（3 项为 host-city-launcher 常驻占用，N/N-3 基线）
```

**第一版测错了 head，已更正：** 它合并的是 `rex/REX-803-mech-scenario-runner`，而该 tip `a695bb9` 是已接受头 `8798ba9` 的祖先、**落后 14 个提交**，缺的正是种子/放置修复 `42acdc6`、回执顺序与关闭修复 `07e8c3c` 等。按“把任务分支合进来”的机械做法会集成一个从未被验收的头。 / The first version merged the development branch, whose tip is 14 commits behind the accepted head - missing the very repairs the accepted campaign ran.

规则（把 WBC 的 B4/F-3 规则推广到集成方向）/ the rule, generalising the WBC B4/F-3 rule to integration：

> **一条 branch 单独能进 main，不构成“多条 branch 能一起进 main”的证据。** / A branch that merges cleanly on its own is not evidence that several merge cleanly together.

> **“把任务分支合进来”不是一条集成规则。** 集成来源必须是工作书记录的那个被验收的确切提交——32 本工作书扫描中 1 项 tip 超前于已验收头（JOIN-590，多出的那个提交正是删除证据的提交）、3 项 tip 落后（MON-902/MON-903/REX-803）、1 项已验收头不在任何 ref 上（UI-000）。见 `reports/INTEGRATION_SOURCE_SWEEP_MECH.md`。 / The task branch is not the integration source: 1 accepted task's tip is ahead of its accepted head, 3 are behind, 1 accepted head is on no ref.

**REX-805 候选头现已纳入同一测量**（`4b39468`，尚未验收）：它对 main 是 **fast-forward**（main 是它的祖先，它比 main 多 15 个提交），对已接受并集 803+804 则有 server.mjs 一处 union 冲突，已按三家并集解出。`integration/REX-805-candidate-mech-preflight @ 0d8bdce`：定向 67/67，全量 1423/1426（3 项 host-city-launcher），跑后 CLEAN。**那个 fast-forward 正是“集成来源必须是接受身份”这条规则最锋利的例子：按分支名走不是多带一个提交，而是整条 main 被候选头替换。** / The REX-805 candidate is now measured too: a fast-forward onto main, one union conflict against the accepted 803+804 union, resolved as a three-way union; 67/67 focused and 1423/1426 full, clean after. The fast-forward is why the accepted-head rule matters most here.

另外，首次全量运行还出现过一个第 4 红项 `tests/relay-s1-tunnel.test.mjs:420`，**已查明是 main 自身的漂移探针**（1000 ms 窗口内第 21 个请求才 429，而探针顺序发 30 个请求；主机一忙窗口就追不上），重跑即消失、并集未改动该测试与该限流器一行。 / A fourth failure in the first full run was classified as main's own host-speed-dependent probe: it vanished on the repeat and the union touches neither the test nor the limiter.

### 顺带发现：REX-804 的测试重写了它所认证的证据 / Surfaced: REX-804's test rewrites the evidence it certifies

跑并集全量套件时发现结束后 tracked tree 是脏的，追进去是**已接受**的 REX-804 里的一处缺陷：`tests/rex804-web.test.mjs:9` 把截图写进**已提交**的证据路径 `evidence/raw/mission-book/REX-804/danger-zone.png`（正是 `PAPER_MATERIAL_INDEX.md` 引用的那份证据）。未修复 head 上实测：测试 **1 pass / 0 fail**，而 `git status` 同时显示该证据被改写（141809 → 139403 字节，取决于跑它的人的浏览器/字体/DPI/视口）。**会在你验证它时改变的证据不是证据**，且跑绿的测试把 tree 留脏，破坏复核记录依赖的 “tracked state clean after testing”。 / The union's full suite left the tree dirty: accepted REX-804's web test captures its screenshot into a committed evidence path, so a green run rewrites reviewed evidence and leaves the tree dirty.

修复复用同程序内**已有的正确先例**（REX-803 的同类测试本来就写 `.runtime/evidence/…`，`.gitignore` 第 2 行）：`repair/REX-804-mech-test-evidence-outside-repo @ 690d723`，行为断言一行未改。并入并集后在合并结果上测量： / The repair reuses the correct precedent already in this programme and changes no assertion. Measured on the merge result：

```text
integration/REX-accepted-heads-mech-preflight-with-evidence-repair @ 56b9752
  focused  tests/rex803-*. + rex804-*.         48 pass / 0 fail，跑后 CLEAN
  full     pnpm test                          1404 pass / 3 fail / 1407，跑后 CLEAN
  （未含修复的同一个并集 @ 704c518：同样 1404/1407，但跑完后 tracked state 是脏的）
```

即：**「全量绿」与「跑完全量后 tree 干净」是两件不同的事**——两种状态下测试结果完全相同，只有含修复的那个状态在结束时是干净的。本机对 REX 无合并授权（`merge_authority: false`）、也无 REX 合并窗口，修复与并集分支均为**已验证、待采纳**的提案。完整记录：`reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md`、`reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md`、`reports/INTEGRATION_SOURCE_SWEEP_MECH.md`。

### REX-805 实体开发门槛：已在真实 City 上执行 / REX-805 physical development gate: EXECUTED on the live City

作者 `7ad7d19` 把开发门槛的执行交给本机（`PHYSICAL_GATE_HANDOFF_Alien.md`）。本机按交接执行并已交回材料。 / The author handed over execution of the development gate; this host executed it and handed the materials back.

```text
WHEN        2026-10-06  两次：作者修复前 4b39468，修复后重跑 0261a9e（常驻 City，数据目录保留，身份不变）
DEPLOY      4b39468 → pid 33420；0261a9e → pid 44088；均 → City 031fdba6-e94c-4298-a095-6ff04a65481d
            部署前常驻 City 跑旧候选 8798ba9，research/replays 404；两次部署后均 200
SOURCE      campaign-966cf439-… run 1，seed 414121415，原 worker Alien（两次同一源）
REPLAY      4b39468: campaign-4a1919b0-… 落 Alien   0261a9e: campaign-cdf39b7f-… 落 Alien
ABLATION    4b39468: campaign-bad9f272-… 落 Mech    0261a9e: campaign-481a1761-… 落 Mech
            两次均：MEASURED、controlledInputsMatch=true、differences=[]、Ablation placementChanged=true
            三个 seed 一致；全部为真实执行（真实 worker、真实 canonical task 皆 COMPLETED）
NOT CLAIMED 开发完成、验收、合并权均不主张——只把门槛材料交回作者核验
EVIDENCE    reports/REX-805/evidence/（4b39468）与 reports/REX-805/evidence-repaired/（0261a9e）
            逐文件 SHA256；三份回执为 City 字节的逐字节副本；同源回执在两个包与 REX-803 包中哈希相同
RESULT      reports/REX-805/PHYSICAL_GATE_RESULT_Mech.md
```

**关于 `limits` 的更正链 / a correction chain, stated：** 本机合成源仪器曾报 `controlledInputDifferences:['limits']`；第一次实体跑（源恰好是非空 limits）看不到它，本机因此在材料索引里写成「属于合成夹具」；作者随后以 `0261a9e` 修复了空 limit 集（`{}` 与 `null` 的 canonical 差异）并加了回归测试——**证明该缺陷真实且一般**，本机那句结论下得太满，已在结果记录里改正：合成夹具触发了一个真实缺陷，而物理源没有覆盖那个分支。

### REX-805 作者交付 / Author handover

最新作者交付候选为 `0261a9ed1cec88df3ab4675623d422b37b33f270`，精确CI三项成功、独立代码复审通过。前驱4b39468的实体材料经作者63/63独立核验；最终修复针对无额外限制时的null/{}比较，真实非空限制路径的前驱材料仍是有界开发依据，不声称最终候选实体部署已观测。开发完成5/8、正式复检4/8、任务完成4/8；REX805仍IN_PROGRESS，正式review_host仍null、terminal未释放。见 [开发交付](../../reports/REX-805/DEVELOPMENT_HANDOFF.md) 和 [材料索引](../../reports/REX-805/PAPER_MATERIAL_INDEX.md)。

The author hands over exact candidate `0261a9ed1cec88df3ab4675623d422b37b33f270`, with three successful exact-head CI runs and independent code re-review. The author independently verifies the predecessor4b39468 physical packet with63/63 checks. The final fix concerns null/{} comparison without extra bounds; the measured predecessor nonempty-bound path remains a bounded development basis, not observation of final-candidate physical deployment. Development is5/8, formal review4/8 and accepted tasks4/8. REX805 remains IN_PROGRESS with review_host null and no released terminal. See the [handover](../../reports/REX-805/DEVELOPMENT_HANDOFF.md) and [material index](../../reports/REX-805/PAPER_MATERIAL_INDEX.md).

前段“limits差异属于合成夹具”的推论限于那份有maxFailures=3的实体源；作者另以真实HTTP无额外限制源复现并修复误报，不能将该推论推广到所有真实campaign。 / The earlier synthetic-fixture inference is limited to that physical source with maxFailures=3. The author separately reproduced and repaired the mismatch with a real HTTP source without extra bounds; the inference cannot extend to every real campaign.

作者追加：最终0261a9e实体重跑已获原始包63/63及普通MEMBER规范任务独立核验，前驱-only缺口由此替代；正式对侧复检仍待领取/裁决。 / Author update: final0261a9e physical repetition now has63/63 raw-packet checks and independently matched ordinary-MEMBER canonical tasks, superseding the predecessor-only gap. Formal opposite-host claim/verdict remains pending.

### REX-805 正式复检：**通过**，标记已释放 / Formal review: PASSED, marker released

```text
WHEN        2026-10-06，对侧主机 Mech 独立复检（作者 Alien，另一台物理主机，§3 满足）
HEAD        0261a9ed1cec88df3ab4675623d422b37b33f270
CLAIM       领取先于任何裁决发布：reports/REX-805/REVIEW_CLAIM_Mech.md
PROBES      本机自造 17 项，全部通过：13 项打常驻真实 City（跑的就是被审 head），4 项在被审 head 上进程内
  live      P1 空 limit 集源全链路（作者 0261a9e 修的分支）**被独立复现**：limits={} → 重放
              controlledInputsMatch=true、differences=[]；新 campaign/experiment/canonical task 均为新身份
            P2 同一源重放两次，9 个描述性字段完全一致
            P3 alternate-device 消融落第一个声明 worker，placementChanged 如实（源本就在该 worker 上 => false）
            P4/P4b 策略外机制、以及带消融控制的 REPLAY，均按名拒绝 ABLATION_UNSUPPORTED
            P5/P5b 未知源、越界 index 均按名拒绝
  inproc    P6 记录拓扑不在线 -> 409 REPLAY_TOPOLOGY_NOT_READY：**不可用条件确实不能被重放**
            P7 receipt store 不可用（目录位置是文件）时 **City 仍然启动并服务**，storeState=UNAVAILABLE
              reason=ENOTDIR，重放被打字化拒绝而非崩溃（store-guard 家族性质成立）
OBSERVATION store 不可用时 replay 的 POST 回 404 CAMPAIGN_UNKNOWN（源查找先于引擎的 REPLAY_STORE_UNAVAILABLE）；
            同一响应链已披露 storeState 与 reason，可区分 => 表述精度问题，**不构成缺陷**
OWN DEFECTS 第一轮 live 探针 8/13，五个失败**全是本机探针的缺陷**（等待谓词、过窄错误码、把
            「消融必然改变放置」当假设）；修正后 13/13，过程保留
VERDICT     PASSED on 0261a9e；未发现缺陷
MARKER      TRACE_REPLAY_ABLATION_ACCEPTED **已释放**，范围如实标注：真机渲染半边 NOT_OBSERVED
NOT CLAIMED 不行使任何产品 main 合并权；durationDeltaMs 不作因果性能结论
REPORT      reports/REX-805/REVIEW_REPORT.md；探针 reports/REX-805/REVIEW_PROBES_{LIVE,INPROCESS}_Mech.mjs
```

由此 **REX-805 完成**（工作书 `status: COMPLETE`、`review_complete: true`），主任务板随之更新：Research Strengthening **5/8**，全城 **89/93**。下一步可按依赖续接 REX-806（其依赖 REX-803/804/805 现已全部 accepted）。

### REX-806 开发交付：材料导出可生成、可独立重算 / REX-806 development handover

```text
branch / head   rex/REX-806-mech-metrics-and-export @ 3950d478e627aaa615ef69e3ac65c30da37c5ea6
baseline        e18c5c5 = claim-time union（REX-803 8798ba9 · REX-804 fe700ab · REX-805 0261a9e）
CI              94a7d24 push37451114057 SUCCESS · d7aa5d7 push37452319948 SUCCESS ·
                cd4f603 push37453769570 **FAILED**（校验器探针从作者本机绝对路径读已发布包，runner 上六项全红；
                红运行保留不覆盖）· 3950d47 push37454597004 SUCCESS attempt 1（fixture 改为测试内自建）
local full      1445 / 1442 pass / 3 fail（3 项为 host-city-launcher 常驻占用；该 head 本轮未出现负载敏感失败）
PROBES          24/24（13 模块 + 5 接口 + 6 校验器），先证伪再信任；接口探针自身错过两次（未注册 experiment、
                回执文件名不符 runner 的 campaign-<uuid>.json 模式），修正后才通过
SURFACES        GET /research/artifacts[?format=csv] 与 /research/artifacts/preview?limit=N，三条全部
                成员会话 403 RESEARCH_OWNER_REQUIRED；无源 422 ARTIFACT_NO_SOURCE
VERIFIER        scripts/verify-research-artifact.mjs：第二实现，**不 import 导出器**；对已发布包 14/14，
                并由 6 项探针证明它会失败（改指标值 / 清空原因 / 删章节 / 改时间戳 / 伪造干预计数为 0）
ARTIFACT        reports/REX-806/artifact/：18 个真实 campaign / 24 runs / 22 measured；4 项指标有值、
                23 项 NOT_MEASURED 并写明原因；逐文件 SHA256，全新 clone 校验 10/10
SELF-CHECKS     溯源交叉核对 8/8（从城市原始回执重算，非从包内）· 可复现性 11/11（钉住 generatedAt 与事件流后
                重导字节全同，含 checksums.json；负对照改 1 ms 即变红）· 记录一致性 0 error
HANDOFF         reports/REX-806/DEVELOPMENT_HANDOFF.md（列出对侧主机应独立重算的最小集合）
                + reports/REX-806/REPRODUCIBILITY_MECH.md（朴素重导只应差哪三处，已解释）
NOT CLAIMED     marker RESEARCH_ARTIFACT_EXPORT_ACCEPTED 未释放；本机不行使产品 main 合并权
```

对侧主机复检时请特别核对：`intervention_count` **不是 0**（城市记录不表达 Owner 行为，工作书要求未知不得写 0），以及 `placementMatchesSeedAlone` 的 false **恰好**只出现在 `replayMode=ABLATION` 的行上（消融政策本就要覆盖种子放置）。

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **22**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 11 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md)
- [RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)
- [REX-801-experiment-manifest-and-registry.md](REX-801-experiment-manifest-and-registry.md)
- [REX-802-trace-provenance-and-metrics-foundation.md](REX-802-trace-provenance-and-metrics-foundation.md)
- [REX-803-scenario-runner-and-repetition-engine.md](REX-803-scenario-runner-and-repetition-engine.md)
- [REX-804-fault-injection-and-recovery-probes.md](REX-804-fault-injection-and-recovery-probes.md)
- [REX-805-trace-replay-and-ablation.md](REX-805-trace-replay-and-ablation.md)
- [REX-806-metrics-analysis-and-artifact-export.md](REX-806-metrics-analysis-and-artifact-export.md)
- [REX-807-research-control-surface-and-progressive-disclosure.md](REX-807-research-control-surface-and-progressive-disclosure.md)
- [REX-890-reproducibility-study-and-freeze.md](REX-890-reproducibility-study-and-freeze.md)

<!-- DOCUMENT_NAVIGATION:END -->
