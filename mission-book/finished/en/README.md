# Reading translation / 阅读译本

[Canonical source / 权威原文](../README.md)

This page translates the explanatory body of a historical reading snapshot; generated bilingual navigation/dashboard blocks are available at the canonical source. Source SHA256: `53cfb148b30f71b9087170d7c8cedc591bc855f5b0edc42dde4cc319c8592996`. Current canonical workbooks and records determine authority and state; this page grants no execution or claim authority.

本页为历史阅读快照的完整解释正文译本；已双语的生成导航/面板见权威原文。当前任务状态以canonical工作书和记录为准，本页不授予执行或领取权。

# Mission Book — Finished archive

> This directory is the unified historical entry for completed Mission Book programmes. The main task board shows only programmes not yet closed. COMPLETE programmes remain in citywide statistics and MISSION_PROGRESS.json; hiding them does not discard history.

## Completed programmes

| Programme | Completion | Archive entry |
|---|---:|---|
| Replant / MB-001~012 | 12/12 | [replant](.././replant/README.md) |
| Butler Assistant | 9/9 | [completed-2026-10-01](.././completed-2026-10-01/MISSION_INDEX.md) |
| Remote Fabric | 10/10 | [completed-2026-10-01](.././completed-2026-10-01/MISSION_INDEX.md) |
| General AI Gateway | 9/9 | [completed-2026-10-01](.././completed-2026-10-01/MISSION_INDEX.md) |
| Engineering Manager | 13/13 | [completed-2026-10-01](.././completed-2026-10-01/MISSION_INDEX.md) |
| Rescheduling vNext | 4/4 | [completed-2026-10-03](.././completed-2026-10-03/README.md) |
| UI Civilization | 5/5 | [completed-2026-10-03](.././completed-2026-10-03/README.md) |
| UI × Scheduler Integration | 3/3 | [completed-2026-10-03](.././completed-2026-10-03/README.md) |
| MESH three-end interconnection | 1/1 | [completed-2026-10-04](.././completed-2026-10-04/README.md) |
| Connection Onboarding | 4/4 | [completed-2026-10-06](.././completed-2026-10-06/README.md) |
| Workbench Compatibility | 4/4 | [archive ledger 2026-10-06](#registered-in-place-2026-10-06) |
| Capability Entry Closeout | 6/6 | [archive ledger 2026-10-06](#registered-in-place-2026-10-06) |

## Registered in place (2026-10-06)

The following two programmes reached COMPLETE on 2026-10-06. Archive rules **do not require physical relocation**: other records extensively reference their canonical workbooks, reports and exact-SHA evidence, and moving them would break historical links. Therefore this ledger registers them while workbooks retain their original paths.

| Programme | Completion | Canonical location | Completion basis |
|---|---:|---|---|
| Workbench Compatibility | 4/4 | [workbench-compatibility-migration](../../workbench-compatibility-migration/README.md) | WBC-604 merged into main at `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`; Owner instructed waiver of opposite-host Review, see review_waiver_authority. |
| Capability Entry Closeout | 6/6 | [capability-entry-closeout](../../capability-entry-closeout/README.md) | CEX-790 closeout audit completed; Owner likewise waived opposite-host Review for closing the archive, see owner_ruling_2026_10_05. |

These programmes previously remained on the main board because their closeout workbooks used quoted `review_complete: "true"`, interpreted as a string by the old parser. Statistics therefore continually treated them as unreviewed. After the tool parser was corrected on 2026-10-06, the main board automatically removed them from the unclosed pool. This archive registration accompanies that correction, rather than introducing new facts. The new record-consistency checker explicitly labels both waivers REVIEW_WAIVED_BY_RECORDED_AUTHORITY; see mission-book/tools/README.md.

## Archive rules

- A programme is COMPLETE only after every workbook finishes review/verification.
- COMPLETE programmes automatically hide from the main Mission Book task board, preventing historical projects from filling the current construction surface.
- Historical workbooks, acceptance records and exact-SHA evidence remain. Hiding changes presentation only, not factual sources.
- If historical links, report references or Git tracking require canonical workbooks to retain their original paths, register them in this directory's archive ledger without mandatory physical relocation.
