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
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步减压施工：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 研究素材规则：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)  
> 研究信号优先级：[../RESEARCH_SIGNAL_WATCHLIST.yaml](../RESEARCH_SIGNAL_WATCHLIST.yaml)  
> 研究优先级策略：Research Institute `paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md`  
> 研究控制面原则：[RESEARCH_CONTROL_SURFACE.md](./RESEARCH_CONTROL_SURFACE.md)

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
| [REX-801](./REX-801-experiment-manifest-and-registry.md) | Experiment Manifest + Registry | COMPLETE | 机器可读实验问题、拓扑、变量、重复次数和 acceptance |
| [REX-802](./REX-802-trace-provenance-and-metrics-foundation.md) | Trace / Provenance / Metrics Foundation | COMPLETE | 统一记录 task/action/device/provider/handoff/retry/failure/recovery/human intervention |
| [REX-803](./REX-803-scenario-runner-and-repetition-engine.md) | Scenario Runner + Repetition Engine | READY | 自动执行 controlled scenario × N |
| [REX-804](./REX-804-fault-injection-and-recovery-probes.md) | Fault Injection + Recovery Probes | READY | 故意制造节点/网络/provider/load/stale/duplicate 等故障并量化恢复 |
| [REX-805](./REX-805-trace-replay-and-ablation.md) | Trace Replay + Ablation | WAITING_DEPENDENCIES | 同一 trace 重放并关闭 handoff/retry/backoff 等机制做消融 |
| [REX-806](./REX-806-metrics-analysis-and-artifact-export.md) | Metrics + Research Artifact Export | WAITING_DEPENDENCIES | normalized dataset、tables、artifact pack、reproduction docs |
| [REX-807](./REX-807-research-control-surface-and-progressive-disclosure.md) | Research Control Surface | WAITING_DEPENDENCIES | 给 Owner 最大实验掌控/知情权，但不污染普通用户主导航 |
| [REX-890](./REX-890-reproducibility-study-and-freeze.md) | Reproducibility Study + Freeze | WAITING_DEPENDENCIES | 双机独立复现实验，冻结 Research Fabric v1 |

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
SHAPE A  在应为目录的位置放一个文件（6 个 store，main 213f9f9f → 修复分支 8c67bb2）
theme-packages (capability-bridge)  BRICKED EEXIST  →  STARTED        <- 第二个实例，已给可采纳修复
research (REX-801 registry parent)  BRICKED ENOTDIR →  仍 BRICKED     <- 已单独报告并给可采纳修复
research/experiments (REX-801)      BRICKED EEXIST  →  仍 BRICKED     <- 同上
research/campaigns / monitor / research-trace                            STARTED → STARTED

SHAPE B  在应为文件的位置放一个目录（3 个 store，两个分支结果相同）
city.sqlite (canonical store)       BRICKED "unable to open database file"   <- F-1 新实例：此处拒绝启动是**正确**的，
                                                                                缺的是可诊断的 typed 原因
join-requests.json (join store)     STARTED，HTTP 200 且内存中已生成审批行，但**什么都没落盘**   <- F-2 有意的静默
execution-profile.json (WBC-604)    change() 抛错，但内存 profile 已经切换   <- F-3 违反该模块自己声明的 rule 2
                                                                                （已给第三个可采纳修复分支）
```

v1 版本的表格声称有 8 个探针，实际只有 6 个（其中两行 `relative = null` 根本没埋雷，join 行的 `HTTP 400` 还是探针自身把字段名写成 `claimSecret` 造成的）。该仪器缺陷连同更正后的实测一并记录，不做静默清洗。

完整记录（两个 bricking 实例、F-1/F-2/F-3 三种不同失效模式、成对前后测、三个可采纳修复分支、以及三条仪器教训）见
[reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md](../reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md)
（扫描 harness 作为可复现证据一并提交为 `reports/REX-PROGRAMME/store-shape-sweep-v2.mjs`）。
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

详细收纳见 [RESEARCH_CONTROL_SURFACE.md](./RESEARCH_CONTROL_SURFACE.md)。

## 7. 强制论文素材

所有 REX 任务执行 [RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)。

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

REX-803: Alien已领取对机复检，PR37候选8798ba9修复后71项相关测试通过；实体campaign门槛及最终CI待验证。REX-804: Alien采纳退回修复，PR30候选f4ceae7相关12项通过，待CI及Mech复验。REX-805/806/807/890继续等待accepted依赖。

REX-803: Alien opposite-host review claimed; PR37 candidate8798ba9 passes71 affected tests, physical campaign and final CI remain pending. REX-804: Alien adopted returned repair; PR30 candidatef4ceae7 passes12 focused tests, awaiting CI and Mech re-verification. REX-805/806/807/890 remain dependency-blocked. See each workbook and REVIEW_REPORT for authority. SHOW excluded; no parked/new programme activation.
