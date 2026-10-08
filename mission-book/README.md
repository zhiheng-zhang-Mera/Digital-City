# Mission Book / 任务书主台

工作书 frontmatter 决定任务状态、领取、依赖和验收。主台与前台导航不授予启动权限；本次只迁移目录，暂不启动、领取或复检任务。

Workbook frontmatter determines state, claims, dependencies and acceptance. Navigation grants no execution authority. This change only relocates directories; do not start, claim or review tasks.

## 前台 / Foreground

- [mission-group — 系列任务前台 / Programme foreground](./mission-group/README.md)：尚未完成的系列与保留设计；挂起系列仍保持挂起，SHOW 仍不执行；Research Strengthening 仍在此（REX-890 未开工）。 / Open programmes and retained designs; parked programmes remain parked and SHOW remains excluded from execution; Research Strengthening stays here because REX-890 has not started.
- [finished — 完成档案 / Completed archive](./finished/README.md)：所有已完成系列统一收纳，主台不逐项展开；CHK、PCF、DGX 于 2026-10-07 归入 `finished/completed-2026-10-07/`。 / Completed programmes are collected in one archive and collapsed on this desk; CHK, PCF and DGX moved into `finished/completed-2026-10-07/` on 2026-10-07.

`future-plans` 本轮不检查、不迁移、不改变内容。 / `future-plans` is not inspected, moved or changed in this round.

## 工作规则与事实 / Rules and evidence

- [常驻规则 / Standing rules](./CONSTRUCTION_RULES.md)
- [异步施工协议 / Async construction](./ASYNC_RELIEF_CONSTRUCTION.md)
- [过程数据规则 / Process-data policy](./PROCESS_DATA_POLICY.md)
- [能力与暴露记录 / Capability and exposure inventory](../capability-registry/README.md)
- [Utopia 当前记录 / Recorded Utopia status](./UTOPIA_LIVE_STATUS.md)
- [材料与报告 / Materials and reports](./reports/README.md)

## REX 当前追踪 / Current REX tracking

Research Strengthening：总任务7/8、开发7/8、复检7/8。REX-801～807 已完成、标记已释放，并在 4-in-1 整包（精确头 `185d043e`）内被接受；REX-806 后续修复 cc79923 已由 Mech 验收并合并；历史裁决保留。**REX-890 未开工**（工作书 READY、无 heads、无报告目录），programme 终态标记 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` **未释放**；本系列因此留在 `mission-group/` 且保持 `active_pool: true`。[系列任务板 / Series board](mission-group/research-strengthening/README.md)。
Research Strengthening: tasks 7/8, development 7/8, review 7/8. REX-801..807 are complete with their markers released and were accepted inside the four-series pack at exact head `185d043e`; the REX-806 follow-up cc79923 was accepted and merged by Mech and historical verdicts remain. **REX-890 has NOT started** (workbook READY, no heads, no report directory) and the programme terminal marker `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` is NOT released; the programme therefore stays in `mission-group/` with `active_pool: true`.

<!-- MISSION_PROGRESS:START -->
## 全城项目总进度 / Citywide progress (generated)

> **GENERATED VIEW — 禁止手工修改 / Do not hand-edit.** 工作书frontmatter为权威 / Workbook frontmatter is authoritative.
> 总完成以复检/验证完成计 / Total completion means completed review, verification or correction; historical stages use the same definition.
> FUTURE-only计划激活前不计入分母 / Future-only plans are excluded until formally activated as workbooks.
> 完成系列导航 / Completed programme navigation: [finished/README.md](./finished/README.md). They remain in overall totals and MISSION_PROGRESS.json.

**全城合计 / Overall: 总任务 / Tasks 134/136 · 开发 / Development 134/136 · 复检 / Review 134/136**
**当前未收口池 / Active pool: 总任务 / Tasks 8/9 · 开发 / Development 8/9 · 复检 / Review 8/9**

| 项目 / Programme | 总完成 / Complete | 开发 / Development | 复检 / Review | 状态 / Status |
|---|---:|---:|---:|---|
| [Research Strengthening](./mission-group/research-strengthening/README.md) | **8/9** | **8/9** | **8/9** | IN_PROGRESS |
| [SHOW-401 展示素材](./mission-group/showcase-material-extraction/README.md) | **0/1** | **0/1** | **0/1** | PLANNED |

机器镜像 / Machine-readable view: [MISSION_PROGRESS.json](./MISSION_PROGRESS.json).
<!-- MISSION_PROGRESS:END -->

<!-- ACTIVE_WORKBOOKS:START -->
## 当前未收口工作书 / Open workbooks (generated)

> 列出未完成复检的工作书 / Lists workbooks without completed review; status and stages come directly from frontmatter.

| ID | 项目 / Programme | 状态 / Status | 开发 / Development | 复检 / Review |
|---|---|---|:---:|:---:|
| [REX-990](./mission-group/research-strengthening/REX-990-programme-final-integration.md) | Research Strengthening | IN_PROGRESS | — | — |

冲突以工作书为准 / Workbook frontmatter prevails on disagreement; treat the difference as homepage sync drift.
<!-- ACTIVE_WORKBOOKS:END -->
