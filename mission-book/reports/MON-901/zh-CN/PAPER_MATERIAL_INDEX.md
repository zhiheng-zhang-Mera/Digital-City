# MON-901 论文材料索引

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态；保留历史和未知边界，不新增验收。

证据候选：观察/决策分离及有界规范真值投影。不从构造monitor推性能或novelty。

- Utopia tests/mon901-observation.test.mjs：实际API lifecycle、在途monitor隔离、坏reader/cancel、有界人口/overflow、删规范历史、共享flight、保stale。
- Utopia .runtime/evidence/mission-book/MON-901/canary-receipt.json：City767ac781-8073-492b-972a-d5397ba43f58、taskQ-e8738c51-bd44-4e6b-b04e-1a561f57ebe5、RUNNING→COMPLETED、规范task/event ID及source pointer；受控report，非硬件执行。
- raw red/reviewer-red/green、初全量失败保留；hash receipt绑定最终candidate，避免自引用证据commit。
- 观察规范窗口有canonical_event_id/observed_at/projected_at/sample-projection latency/drop-gap；task owner/review/CI/model-switch/escalation无源NOT_OBSERVABLE。在途reader/cancel受控实验unrelated-task-blocking=false，非生产性能。
- monitor_reconciliation_result CONTROLLED_CANONICAL_MATCH；graph/nav/UI NOT_RUN（902）；decision latency/provenance NOT_APPLICABLE（903）；对侧物理review NOT_RUN。
- 最高grade NONE_PENDING_FORMAL，仅watchlist observation/decision decoupling候选。model tokens、托管/跨设备时间、端到端ingestion latency unknown/null。

最终绑定7eb38f1b930dfe6cc13dab0e17dedee467b1254b，push37242446183及PR37242505126 SUCCESS；root1255／1255、raw SHA256 a0e2f6db35c61cf6d46f1f601fc803281caca9c7af13ce06ea9a813a39ab4505。早期fail/partial历史保留；物理Formal Review NOT_RUN。

## 对侧物理主机评审扩展（Mech，MEGA-REP）

以上作者陈述保历史，仅一点取代。

不同主机Mech在精确7eb38f1b930dfe6cc13dab0e17dedee467b1254b Formal Review PASS。新utopia:tests/mon901-mech-review-probes.test.mjs、review/MON-901-mech-review at d68afa225d3f6abb9ba93583745b305e9705fddc，真实Gateway6／6，作者原样8／8＋4／4。重测37242446183 push、37242505126 PR24、37242505131 reciprocal同头SUCCESS。范围实查无旧测试改，无放宽需补偿。回执hash验证：canary SHA25618003d74374c869ea9325d5a77bcf51b8ec88df0831cdda1d6b68f14df43514a与已提交blob再算同；receipt physicalDevices NOT_RUN、executor CONTROLLED_PROTOCOL_REPORT_NOT_HARDWARE_BENCHMARK，因此前NOT_RUN准确，非review填缺。

两发现不阻：F1 LOW completeness.continuous硬编码constant，完整连续窗口historyGap=false但continuous=false，保守且文档化，具名consumer902会假alarm。F2 INFORMATIONAL state_identity_evidence CAPTURED refs空；review验材料补pointer。拒绝假设ref160-char截断不可达（node ID≤80、displayName≤100、join name≤64、generated ID≤40），不记缺陷。同实体Windows受控fixture，无user surface/跨device/性能。见 [REVIEW_REPORT.md](./REVIEW_REPORT.md)。

证据哈希逐值保留：已提交 canary-receipt.json 的声明 SHA256 `18003d74374c869ea9325d5a77bcf51b8ec88df0831cdda1d6b68f14df43514a` 由提交 blob 复算一致；收据仍记 physicalDevices NOT_RUN、executor CONTROLLED_PROTOCOL_REPORT_NOT_HARDWARE_BENCHMARK，审核未补成硬件实测。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
