# Mission Book — Finished / 完成系列档案

本目录统一收纳已完成系列及历史任务。主台收起这些系列，但总体统计、正式判定、Owner 豁免和精确 SHA 仍保留。

This archive collects completed programmes and historical workbooks. The main desk collapses these programmes; overall totals, formal verdicts, Owner waivers and exact SHAs remain retained.

## 已完成系列 / Completed programmes

| 系列 / Programme | 完成 / Complete |
|---|---:|
| [Replant / MB-001~012](replant/) | 12/12 |
| [Butler Assistant](completed-2026-10-01/MISSION_INDEX.md) | 9/9 |
| [Remote Fabric](completed-2026-10-01/MISSION_INDEX.md) | 10/10 |
| [General AI Gateway](completed-2026-10-01/MISSION_INDEX.md) | 9/9 |
| [Engineering Manager](completed-2026-10-01/MISSION_INDEX.md) | 13/13 |
| [Rescheduling vNext](completed-2026-10-03/README.md) | 4/4 |
| [UI Civilization](completed-2026-10-03/README.md) | 5/5 |
| [UI × Scheduler Integration](completed-2026-10-03/README.md) | 3/3 |
| [MESH 三端互联](completed-2026-10-04/README.md) | 1/1 |
| [Connection Onboarding](completed-2026-10-06/README.md) | 4/4 |
| [Workbench Compatibility](completed-2026-10-06/workbench-compatibility-migration/README.md) | 4/4 |
| [Capability Entry Closeout](completed-2026-10-06/capability-entry-closeout/README.md) | 6/6 |
| [City Work Monitor](completed-2026-10-06/city-work-monitor-dashboard/README.md) | 4/4 |
| [City Self Health Check](completed-2026-10-07/city-self-health-check/README.md) | 5/5 |
| [Personal Compute Fabric](completed-2026-10-07/personal-compute-fabric/README.md) | 29/29 |
| [Deliberative Governance Expansion](completed-2026-10-07/deliberative-governance-expansion-migration/README.md) | 8/8 |
| [Research Strengthening](completed-2026-10-07/research-strengthening/README.md)（REX-801～807 已归档；REX-890 仍在前台 / archived; REX-890 remains in the foreground） | 7/8 |

## 本轮物理归档 / Physical archival in this round

WBC、CEX、MON、Connection Onboarding 与 MESH 的在册系列目录此前已移入 `finished/completed-2026-10-06/`；旧说明中的“保留原路径”是登记阶段，不能代表迁移后的目录状态。

The registered WBC, CEX, MON, Connection Onboarding and MESH directories already reside in `finished/completed-2026-10-06/`. Earlier statements about retaining original paths described the registration stage, not the relocated layout.

CHK、PCF、DGX 三系列的在册目录已移入 `finished/completed-2026-10-07/`，manifest 改为 glob 新路径并置 `active_pool: false`。完成以原工作书的验收记录为准：三系列在 utopia 分支 `4-in-1-REX+PCF+CHK+DGX` 的精确头 `185d043e11ae8516a1e7a492d09d031610be576b` 上完成整包验收，逐本拆分验收由 Owner 2026-10-07 裁决豁免。验收证据：`reports/4IN1-ACCEPTANCE/`。

**REX（Research Strengthening）本轮部分归档**：REX-801～807 七本已完成并由对侧实体主机复检接受，于 2026-10-07 用 `git mv` 迁入 [`completed-2026-10-07/research-strengthening/`](completed-2026-10-07/research-strengthening/)（含各自的 `en/` 阅读译本）；manifest 的 `rex` 条目因此并列携带归档路径与前台路径两个 glob，`readme` 仍指向前台的 programme board。搬迁只移动文件位置，不新增也不撤销任何判定：工作书 frontmatter、报告路径与各任务终态标记都保持原样。**REX-890 刻意留在前台**：它**尚未开工**（`development_complete: false`、`review_complete: false`），programme 终态标记 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` **未释放**——把一本开放工作书移进 `finished/` 会让它从生成的开放工作书列表里消失，那是隐藏工作而不是收口，因此 manifest 保持 `active_pool: true`。

The registered CHK, PCF and DGX directories now reside in `finished/completed-2026-10-07/`, with manifest globs following the new paths and `active_pool: false`. Their acceptance is the integrated four-series acceptance at exact head `185d043e11ae8516a1e7a492d09d031610be576b` of the utopia branch `4-in-1-REX+PCF+CHK+DGX`, with the per-workbook split acceptance waived by the Owner's 2026-10-07 ruling; the evidence is in `reports/4IN1-ACCEPTANCE/`. **REX is archived in part this round:** REX-801..REX-807 are complete and accepted by the opposite physical host, and on 2026-10-07 the seven workbooks and their `en/` reading mirrors were relocated with `git mv` into [`completed-2026-10-07/research-strengthening/`](completed-2026-10-07/research-strengthening/); the `rex` manifest entry therefore carries both the archive glob and the foreground glob, and its `readme` still points at the foreground programme board. The relocation moves file locations only and adds or withdraws no verdict - workbook frontmatter, report paths and per-task terminal markers are unchanged. **REX-890 deliberately stays in the foreground:** it has not started (`development_complete: false`, `review_complete: false`) and the programme terminal marker `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` is not released, so moving it into `finished/` would drop an open workbook out of the generated open-workbook list - hiding work rather than closing it - and the manifest keeps `active_pool: true`.

## 保留的验收历史 / Retained acceptance history

WBC-604 在 `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef` 合入产品 main，Owner 豁免见 `review_waiver_authority`。CEX-790 的 Owner 裁决见 `owner_ruling_2026_10_05`。旧解析器曾将引号中的 `review_complete: "true"` 当作字符串；修正后两系列计入完成，检查器以 `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` 记录豁免。本轮搬迁没有新增或替代复检。

WBC-604 merged into product main at `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`; its Owner waiver remains recorded in `review_waiver_authority`. CEX-790's ruling remains in `owner_ruling_2026_10_05`. The former parser treated quoted `review_complete: "true"` as a string; the correction counted both programmes as complete, with `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` preserving their waivers. This relocation adds or replaces no review.

## 归档规则 / Archive rules

- 完成以原工作书的复检、验证或授权豁免为准。 / Completion follows canonical review, verification or authorized waiver records.
- 完成系列只在档案展开，仍计入全城历史统计。 / Completed programmes expand in the archive and remain in citywide historical totals.
- 目录迁移不激活任务、不授予领取或产品合并权。 / Relocation activates no tasks and grants no claim or product-merge authority.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **992**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| completed-2026-10-01 | 455 | [打开 / Open](completed-2026-10-01/README.md) |
| completed-2026-10-03 | 309 | [打开 / Open](completed-2026-10-03/README.md) |
| completed-2026-10-04 | 14 | [打开 / Open](completed-2026-10-04/README.md) |
| completed-2026-10-06 | 48 | [打开 / Open](completed-2026-10-06/README.md) |
| completed-2026-10-07 | 123 | [打开 / Open](completed-2026-10-07/README.md) |
| completed-2026-10-08 | 7 | [打开 / Open](completed-2026-10-08/README.md) |
| en | 1 | [打开 / Open](en/README.md) |
| replant | 33 | [打开 / Open](replant/README.md) |

### 本目录说明 / Local documents

- [READING_TRANSLATION_PROVENANCE.md](READING_TRANSLATION_PROVENANCE.md)

<!-- DOCUMENT_NAVIGATION:END -->
