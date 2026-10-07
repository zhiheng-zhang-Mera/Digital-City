# Mission Book / 任务书主台

工作书 frontmatter 决定任务状态、领取、依赖和验收。主台与前台导航不授予启动权限；本次只迁移目录，暂不启动、领取或复检任务。

Workbook frontmatter determines state, claims, dependencies and acceptance. Navigation grants no execution authority. This change only relocates directories; do not start, claim or review tasks.

## 前台 / Foreground

- [mission-group — 系列任务前台 / Programme foreground](./mission-group/README.md)：尚未完成的系列与保留设计；挂起系列仍保持挂起，SHOW 仍不执行。 / Open programmes and retained designs; parked programmes remain parked and SHOW remains excluded from execution.
- [finished — 完成档案 / Completed archive](./finished/README.md)：所有已完成系列统一收纳，主台不逐项展开。 / Completed programmes are collected in one archive and collapsed on this desk.

`future-plans` 本轮不检查、不迁移、不改变内容。 / `future-plans` is not inspected, moved or changed in this round.

## 工作规则与事实 / Rules and evidence

- [常驻规则 / Standing rules](./CONSTRUCTION_RULES.md)
- [异步施工协议 / Async construction](./ASYNC_RELIEF_CONSTRUCTION.md)
- [过程数据规则 / Process-data policy](./PROCESS_DATA_POLICY.md)
- [能力与暴露记录 / Capability and exposure inventory](../capability-registry/README.md)
- [Utopia 当前记录 / Recorded Utopia status](./UTOPIA_LIVE_STATUS.md)
- [材料与报告 / Materials and reports](./reports/README.md)

## REX 当前追踪 / Current REX tracking

Research Strengthening：总任务6/8、开发6/8、复检6/8。REX-806后续修复cc79923已由Mech验收并合并；历史裁决保留。REX-807为Mech在建、未交付复检；REX-890等待前置验收。[系列任务板 / Series board](mission-group/research-strengthening/README.md)。
Research Strengthening: tasks6/8, development6/8, review6/8. Mech accepted and merged the REX-806 follow-up cc79923; historical verdicts remain. REX-807 is under Mech development and not ready for review; REX-890 awaits dependency acceptance.

<!-- MISSION_PROGRESS:START -->
## 全城项目总进度 / Citywide progress (generated)

> **GENERATED VIEW — 禁止手工修改 / Do not hand-edit.** 工作书frontmatter为权威 / Workbook frontmatter is authoritative.
> 总完成以复检/验证完成计 / Total completion means completed review, verification or correction; historical stages use the same definition.
> FUTURE-only计划激活前不计入分母 / Future-only plans are excluded until formally activated as workbooks.
> 完成系列导航 / Completed programme navigation: [finished/README.md](./finished/README.md). They remain in overall totals and MISSION_PROGRESS.json.

**全城合计 / Overall: 总任务 / Tasks 91/95 · 开发 / Development 92/95 · 复检 / Review 91/95**
**当前未收口池 / Active pool: 总任务 / Tasks 7/11 · 开发 / Development 8/11 · 复检 / Review 7/11**

| 项目 / Programme | 总完成 / Complete | 开发 / Development | 复检 / Review | 状态 / Status |
|---|---:|---:|---:|---|
| [Research Strengthening](./mission-group/research-strengthening/README.md) | **6/8** | **6/8** | **6/8** | IN_PROGRESS |
| [SHOW-401 展示素材](./mission-group/showcase-material-extraction/README.md) | **0/1** | **0/1** | **0/1** | IN_PROGRESS |
| [Personal Compute Fabric](./mission-group/personal-compute-fabric/README.md) | **1/2** | **2/2** | **1/2** | IN_PROGRESS |

机器镜像 / Machine-readable view: [MISSION_PROGRESS.json](./MISSION_PROGRESS.json).
<!-- MISSION_PROGRESS:END -->

<!-- ACTIVE_WORKBOOKS:START -->
## 当前未收口工作书 / Open workbooks (generated)

> 列出未完成复检的工作书 / Lists workbooks without completed review; status and stages come directly from frontmatter.

| ID | 项目 / Programme | 状态 / Status | 开发 / Development | 复检 / Review |
|---|---|---|:---:|:---:|
| [REX-807](./mission-group/research-strengthening/REX-807-research-control-surface-and-progressive-disclosure.md) | Research Strengthening | IN_PROGRESS | — | — |
| [REX-890](./mission-group/research-strengthening/REX-890-reproducibility-study-and-freeze.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [SHOW-401](./mission-group/showcase-material-extraction/SHOW-401-Utopia项目展示素材提取与双Demo制作.md) | SHOW-401 展示素材 | IN_PROGRESS | — | — |
| [PCF-701](./mission-group/personal-compute-fabric/PCF-701-live-resource-telemetry.md) | Personal Compute Fabric | IN_PROGRESS | ✅ | — |

冲突以工作书为准 / Workbook frontmatter prevails on disagreement; treat the difference as homepage sync drift.
<!-- ACTIVE_WORKBOOKS:END -->

## PCF 本机完整流候选 / PCF local complete-flow candidate

[施工记录与 29 本覆盖矩阵 / Development log and 29-book coverage matrix](./reports/PCF-FULL-FLOW/README.md)。

2026-10-07：按用户授权在独立分支连续进行本机全线尝试；现有任务书 claim 与历史验收不变。全系列尚未完成。完整流就绪后一次性交给对侧主机验证，不分拆单项异机验收。 / User-authorized continuous local complete-line attempt on an independent branch. Existing claims and historical acceptance remain unchanged. Programme incomplete; submit the complete flow once to the opposite host when ready, without individual physical-validation handoffs.
