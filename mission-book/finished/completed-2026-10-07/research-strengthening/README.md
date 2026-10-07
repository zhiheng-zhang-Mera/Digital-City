# Research Strengthening — archived workbooks / 研究强化工程归档工作书

本目录收纳 **REX-801～REX-807** 七本已完成并已验收的工作书及其 `en/` 阅读译本。

This directory holds the seven completed and accepted workbooks **REX-801 through REX-807** together with their `en/` reading mirrors.

```text
WHEN        2026-10-07
FROM        mission-book/mission-group/research-strengthening/
TO          mission-book/finished/completed-2026-10-07/research-strengthening/
METHOD      git mv（14 个文件：7 本工作书 + 7 个 en/ 阅读译本）/ git mv of 14 files
```

## 搬迁不改变任何判定 / The relocation changes no verdict

- 搬迁只移动文件位置。**没有**任何工作书的 frontmatter 被改动：`status`、`development_complete`、`review_complete`、`review_host`、`development_head_sha`、`review_head_sha`、`terminal_marker`、`merge_authority` 全部保持搬迁前的值。
- 本目录不产生新的验收、复检、豁免或合并权。完成与否仍以每本工作书自己的 frontmatter 与 `mission-book/reports/REX-80x/` 证据为准；这些报告的路径没有变化。
- 各 REX 任务的终态标记（如 `EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED`、`RESEARCH_ARTIFACT_EXPORT_ACCEPTED`、`RESEARCH_CONTROL_SURFACE_ACCEPTED`）在搬迁前已由各自的异机复检释放，搬迁既不新增也不撤销任何标记。

The move changes file locations only. **No** workbook frontmatter was edited: `status`, `development_complete`, `review_complete`, `review_host`, `development_head_sha`, `review_head_sha`, `terminal_marker` and `merge_authority` keep their pre-move values. This directory creates no new acceptance, review, waiver or merge authority. Completion is still that of each workbook's own frontmatter and its unchanged `mission-book/reports/REX-80x/` evidence, and the per-task terminal markers were released by their own opposite-host reviews before the move.

## 未归档的一本 / The workbook that was not archived

**REX-890（Reproducibility Study + Freeze）没有搬迁**，仍留在 `mission-book/mission-group/research-strengthening/`：它**尚未开工**（`status: READY`、`development_complete: false`、`review_complete: false`、`merge_authority: false`），programme 终态标记 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` **未释放**。把一本开放工作书移进 `finished/` 会让它从生成的开放工作书列表里消失，那是隐藏工作而不是收口，因此只有这七本被搬走。

**REX-890 (Reproducibility Study + Freeze) was not moved** and remains in `mission-book/mission-group/research-strengthening/`: it has **not started** (`status: READY`, `development_complete: false`, `review_complete: false`, `merge_authority: false`) and the programme terminal marker `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` is **not released**. Moving an open workbook into `finished/` would drop it out of the generated open-workbook list, which hides work rather than closing it, so only these seven were relocated.

## 相关入口 / Related entry points

- Programme board（仍是本系列的权威入口）/ programme board, still the series entry point: [Research Strengthening / 研究强化工程](../../../mission-group/research-strengthening/README.md)
- Open workbook / 开放工作书: [REX-890](../../../mission-group/research-strengthening/REX-890-reproducibility-study-and-freeze.md)
- Archive index / 档案索引: [finished/README.md](../../README.md)

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **16**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 8 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [REX-801-experiment-manifest-and-registry.md](REX-801-experiment-manifest-and-registry.md)
- [REX-802-trace-provenance-and-metrics-foundation.md](REX-802-trace-provenance-and-metrics-foundation.md)
- [REX-803-scenario-runner-and-repetition-engine.md](REX-803-scenario-runner-and-repetition-engine.md)
- [REX-804-fault-injection-and-recovery-probes.md](REX-804-fault-injection-and-recovery-probes.md)
- [REX-805-trace-replay-and-ablation.md](REX-805-trace-replay-and-ablation.md)
- [REX-806-metrics-analysis-and-artifact-export.md](REX-806-metrics-analysis-and-artifact-export.md)
- [REX-807-research-control-surface-and-progressive-disclosure.md](REX-807-research-control-surface-and-progressive-disclosure.md)

<!-- DOCUMENT_NAVIGATION:END -->
