# REX-804 研究素材索引

[English source / 英文原文](../PAPER_MATERIAL_INDEX.md)。阅读译本保留源报告历史快照，不改变当前工作书 authority。

实现候选 `9b68d4f7054bb911c484340532cc3b5ae9ed47ac`；baseline`213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`。

- Utopia evidence/raw/mission-book/REX-804/development-receipt.json：有界 classes/scope、保留 RED 失败与显式 unknown。
- danger-zone.png：真实 Web Owner 确认/拒绝/stop 面。
- tests/rex804-faults.test.mjs：temporal measurement attribution、expiry 存储隔离、restart/stop。
- tests/rex804-gateway.test.mjs：真实 heartbeat offline/recovery、execution-claim failure、delayed report、duplicate observation 对比单次 canonical completion、无关 target/health controls。
- tests/rex804-web.test.mjs：真实可见 control→canonical activation、emergency stop。
- data-records/evolution/inbox/mission-book/REX-804/events.jsonl：未 verified evolution evidence，非 policy 或 accepted learning。
- raw .runtime/evidence/mission-book/REX-804/{focused-green,full-tests}.log：初始 relay timing failure 保留。

失败链：未使用历史 fault 获得后来自然 detection/recovery→deterministic falsification→要求 active exercised causal window→regression PASS→opposite-host 确认 NOT_RUN。

失败链：expiry receipt 写错误在 canonical commit 之后逃逸→storage failure 证伪→先移除 injection 并 contain persistence error→regression PASS→opposite-host 确认 NOT_RUN。

信号：有界观测/runtime control truth、measurement error、显式 Owner 授权、capability wiring/reachability、无关任务 nonblocking 边界。物理 host/provider 恢复、autonomous span、tokens、cross-host causal latency 均 NOT_MEASURED；无 novelty/性能声明。

数字/trace artifact：utopia:evidence/raw/mission-book/REX-804/controlled-probe.json，source`9b68d4f7054bb911c484340532cc3b5ae9ed47ac`，packaging head `ef11bb7a160b1388b234b63215207d56d3f51950`。含 canonical heartbeat detection963ms、首次恢复请求 22/24/7ms、duplicate observations3、显式 null。Packaging 不等于 accepted research result。
