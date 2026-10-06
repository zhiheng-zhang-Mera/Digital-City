---
workbook_id: PCF-721
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 1
parent_workbook_id: null
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-705","PCF-707","PCF-713","PCF-714","PCF-715","PCF-716","PCF-724","REX-803","REX-804","REX-805","REX-806"]
dependency_source_shas: []
development_baseline_sha: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
backend_wiring: UNASSESSED
capability_ids: []
planned_capability_ids: ["CAP-PCF-721"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-721 — 受控系统实验与独立复现

[English](en/PCF-721-controlled-systems-study.md) · [研究/收口协议](RESEARCH_AND_RELEASE.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `tests/pcf721-study-contract.test.mjs`、Utopia `docs/{zh-CN,en}/pcf/study-protocol.md`、REX实际支持目录下的PCF scenario manifests；不另起实验数据库。数据位置在700/707确认后登记。

- [ ] pilot后冻结hypotheses、condition、repetitions/stopping、分析方法、硬件/缓存/网络控制和失败计数规则。比较兼容策略、capability-only、load-only与PCF，安全/授权底线相同。
- [ ] 以724的真实混合负载测量资源竞争、latency/throughput、SLO、恢复、错误拒绝/放置、人工介入和观测开销；每个trial绑定exact runtime/policy/executor/input identity。
- [ ] 用REX实际fault API注入声明范围的断联/worker crash/stale/duplicate/storage failure；分开测试controller restart与worker failover，不误称HA。
- [ ] 做受控消融和另一实体主机独立重建；展示失败/无收益/负结果，保留unknown，不删除不利样本。
- [ ] artifact pack包括manifest、sanitized dataset、脚本/命令、raw refs/digests、环境/版本、统计输出和limitations；冷暖缓存与时钟偏差处理可重现。

验收：scoped contract测试 + REX runner/fault/replay/export真实链路 + 独立复现记录。无真实runner或导出不得COMPLETE；可分离纯adapter开发但保留等待，不用simulation代替实跑。至少两种实际软件负载；眼镜/健康trace明确只是输入类型，不提供实机/临床结论。

这是研究证据组件，不授予main merge权；最终用户路径与整个核心scope由未来790验收。两worker证据不能外推数据中心规模或所有设备。
