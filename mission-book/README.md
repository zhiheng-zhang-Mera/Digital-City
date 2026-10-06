# Mission Book / 主任务板

任务真相来自各工作书frontmatter和reports；本页是自动统计与导航，不是领取锁。实现真相见[Utopia live status](UTOPIA_LIVE_STATUS.md)，能力真相见[Capability Registry](../capability-registry/README.md)。

Workbook frontmatter and reports govern task truth. This page supplies generated progress and navigation, not claim locking. Utopia live status tracks implementation; the Capability Registry tracks verified capabilities.

## 快速入口 / Quick navigation

| 子区 / Area | 入口 / Entry | 阅读用途 / Purpose |
|---|---|---|
| 施工规则 / Construction rules | [CONSTRUCTION_RULES](CONSTRUCTION_RULES.md) | authority、原子领取、exact SHA、对机复检 / Authority, atomic claims, exact SHA, opposite-host review |
| 当前REX池 / Existing REX pool | [Research Strengthening](research-strengthening/README.md) | 已有实验工程 / Existing research engineering |
| 当前MON池 / Existing MON pool | [City Work Monitor](city-work-monitor-dashboard/README.md) | 对机验收与冻结 / Opposite-host acceptance and freeze |
| CEX收口 / CEX closeout | [Capability Entry](capability-entry-closeout/README.md) | 合并、审计与历史 / Merge, audit and history |
| 报告证据 / Reports | [reports](reports/README.md) | 领取、修复、复检、研究索引 / Claims, repairs, reviews, research indices |
| 已完成历史 / Finished history | [finished](finished/README.md) | 归档导航，禁止重新领取 / Archive navigation, not claimable |
| 暂停计划 / Parked plans | [PARKED_PROGRAMMES](PARKED_PROGRAMMES.md) | 未经激活不得施工 / Do not execute without activation |
| 工具 / Tooling | [tools](tools/README.md) | 主板同步、依赖传播、一致性检查 / Board synchronization, dependencies, consistency |
| 过程规则 / Process rules | [data](PROCESS_DATA_POLICY.md) · [async](ASYNC_RELIEF_CONSTRUCTION.md) | 证据边界与可接取状态 / Evidence boundaries and eligibility |

Owner当前指令：只回查已有池，不启动新工作系列；SHOW继续排除。零可领取项时整理文档，不改变任务门槛。

Current Owner instruction: revisit existing pools, keep new programmes inactive and continue to exclude SHOW. Organize documentation when nothing is claimable; preserve task gates.

<!-- MISSION_PROGRESS:START -->
## 全城项目总进度 / Citywide progress (generated)

> **GENERATED VIEW — 禁止手工修改 / Do not hand-edit.** 工作书frontmatter为权威 / Workbook frontmatter is authoritative.
> 总完成以复检/验证完成计 / Total completion means completed review, verification or correction; historical stages use the same definition.
> FUTURE-only计划激活前不计入分母 / Future-only plans are excluded until formally activated as workbooks.
> 完成系列导航 / Completed programme navigation: [finished/README.md](./finished/README.md). They remain in overall totals and MISSION_PROGRESS.json.

**全城合计 / Overall: 总任务 / Tasks 87/93 · 开发 / Development 88/93 · 复检 / Review 87/93**
**当前未收口池 / Active pool: 总任务 / Tasks 17/23 · 开发 / Development 18/23 · 复检 / Review 17/23**

| 项目 / Programme | 总完成 / Complete | 开发 / Development | 复检 / Review | 状态 / Status |
|---|---:|---:|---:|---|
| [Research Strengthening](./research-strengthening/README.md) | **4/8** | **4/8** | **4/8** | IN_PROGRESS |
| [City Work Monitor](./city-work-monitor-dashboard/README.md) | **3/4** | **4/4** | **3/4** | IN_PROGRESS |
| [SHOW-401 展示素材](./showcase-material-extraction/README.md) | **0/1** | **0/1** | **0/1** | IN_PROGRESS |

机器镜像 / Machine-readable view: [MISSION_PROGRESS.json](./MISSION_PROGRESS.json).
<!-- MISSION_PROGRESS:END -->

<!-- ACTIVE_WORKBOOKS:START -->
## 当前未收口工作书 / Open workbooks (generated)

> 列出未完成复检的工作书 / Lists workbooks without completed review; status and stages come directly from frontmatter.

| ID | 项目 / Programme | 状态 / Status | 开发 / Development | 复检 / Review |
|---|---|---|:---:|:---:|
| [REX-805](./research-strengthening/REX-805-trace-replay-and-ablation.md) | Research Strengthening | IN_PROGRESS | — | — |
| [REX-806](./research-strengthening/REX-806-metrics-analysis-and-artifact-export.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-807](./research-strengthening/REX-807-research-control-surface-and-progressive-disclosure.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-890](./research-strengthening/REX-890-reproducibility-study-and-freeze.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [MON-990](./city-work-monitor-dashboard/MON-990-cross-device-monitor-acceptance-and-freeze.md) | City Work Monitor | IN_PROGRESS | ✅ | — |
| [SHOW-401](./showcase-material-extraction/SHOW-401-Utopia项目展示素材提取与双Demo制作.md) | SHOW-401 展示素材 | IN_PROGRESS | — | — |

冲突以工作书为准 / Workbook frontmatter prevails on disagreement; treat the difference as homepage sync drift.
<!-- ACTIVE_WORKBOOKS:END -->
## 历史定位 / Historical navigation

- [completed-2026-10-06](finished/completed-2026-10-06/README.md)：Connection Onboarding归档；canonical JOIN-590原路径保持稳定。 / Connection Onboarding archive; canonical JOIN-590 path stays stable.
- [completed-2026-10-04](finished/completed-2026-10-04/README.md)：MESH-301及组件验收。 / MESH-301 and component acceptance.
- [completed-2026-10-03](finished/completed-2026-10-03/README.md)：UI文明化、再调度和接线。 / UI, rescheduling and integration.
- [completed-2026-10-01](finished/completed-2026-10-01/README.md)：更早的Butler/Remote/AI Gateway/Manager历史。 / Earlier Butler, Remote, AI Gateway and Manager history.

MESH设计审计曾明确两个workers与三个control clients、严格target routing、canonical seq收敛、同City及独立主机review；其终态与merged-main证据见归档工作书，不以此导航重做验收。 / MESH design audit distinguished two workers from three control clients, strict target routing, canonical-sequence convergence, same-City identity and independent-host review. Archived workbooks hold acceptance and merged-main evidence; this navigation does not rerun acceptance.

统计口径、programme membership与状态均由PROGRESS_MANIFEST及工作书生成。普通文档迁移不得创建第二份authority。 / PROGRESS_MANIFEST and workbooks govern generated membership, counts and state. Documentation moves must not create a second authority.
