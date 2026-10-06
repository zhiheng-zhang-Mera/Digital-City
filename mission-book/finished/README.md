# Mission Book — Finished / 已完成归档

> 本目录是 Mission Book 已完成 programme 的统一历史入口。  
> 主任务栏只展示未收口 programme；COMPLETE 项目仍保留在全城统计与 `MISSION_PROGRESS.json` 中，不因收起而丢失历史。

## 已完成 programme

| Programme | 完成度 | 归档入口 |
|---|---:|---|
| Replant / MB-001~012 | 12/12 | [replant](./replant/README.md) |
| Butler Assistant | 9/9 | [completed-2026-10-01](./completed-2026-10-01/MISSION_INDEX.md) |
| Remote Fabric | 10/10 | [completed-2026-10-01](./completed-2026-10-01/MISSION_INDEX.md) |
| General AI Gateway | 9/9 | [completed-2026-10-01](./completed-2026-10-01/MISSION_INDEX.md) |
| Engineering Manager | 13/13 | [completed-2026-10-01](./completed-2026-10-01/MISSION_INDEX.md) |
| Rescheduling vNext | 4/4 | [completed-2026-10-03](./completed-2026-10-03/README.md) |
| UI Civilization | 5/5 | [completed-2026-10-03](./completed-2026-10-03/README.md) |
| UI × Scheduler Integration | 3/3 | [completed-2026-10-03](./completed-2026-10-03/README.md) |
| MESH 三端互联 | 1/1 | [completed-2026-10-04](./completed-2026-10-04/README.md) |
| Connection Onboarding | 4/4 | [completed-2026-10-06](./completed-2026-10-06/README.md) |
| Workbench Compatibility | 4/4 | [archive ledger 2026-10-06](#在册但未物理搬迁--registered-in-place-2026-10-06) |
| Capability Entry Closeout | 6/6 | [archive ledger 2026-10-06](#在册但未物理搬迁--registered-in-place-2026-10-06) |

## 在册但未物理搬迁 / Registered in place (2026-10-06)

下面两个 programme 在 2026-10-06 达到 COMPLETE，但按本目录的归档规则**不强制物理搬迁**：它们的 canonical 工作书、
报告与 exact-SHA 证据被其他记录大量引用，移动路径会打断历史链接。因此在此登记，工作书保留原路径。

| Programme | 完成度 | canonical 位置 | 完成依据 |
|---|---:|---|---|
| Workbench Compatibility | 4/4 | [workbench-compatibility-migration](../workbench-compatibility-migration/README.md) | WBC-604 于 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef 合入 main，并在 owner 指令下 waived 对侧复核（见 `review_waiver_authority`） |
| Capability Entry Closeout | 6/6 | [capability-entry-closeout](../capability-entry-closeout/README.md) | CEX-790 收尾审计完成，其闭档同样由 owner 裁决 waived 对侧复核（见 `owner_ruling_2026_10_05`） |

这两个 programme 之前仍出现在主任务栏，是因为它们的收尾工作书写着 `review_complete: "true"`（带引号，被旧解析器读成字符串），
使收尾任务在统计里始终"未复检"。工具解析器于 2026-10-06 修正后，主任务栏自动把它们移出未收口池 - 这次归档登记是那一次修正的
配套动作，而不是新的事实变化。两者的 waived 复核性质已由新的记录一致性检查器以
`REVIEW_WAIVED_BY_RECORDED_AUTHORITY` 明确标注（见 `mission-book/tools/README.md`）。

## 归档规则

- Programme 只有在全部工作书完成复检/验证后才视为 `COMPLETE`。
- `COMPLETE` programme 自动从 Mission Book 主任务栏隐藏，避免当前施工面被历史项目占满。
- 历史工作书、验收记录和 exact-SHA 证据仍保留；收起只改变展示，不改变事实来源。
- 若 programme 的 canonical 工作书因历史链接、报告引用或 Git 追踪需要保留在原路径，可通过本目录的 archive ledger 登记，而不强制物理搬迁。
