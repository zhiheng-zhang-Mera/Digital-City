---
workbook_id: PCF-707
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
dependency_source_workbooks: ["PCF-702","PCF-704","REX-801","REX-802"]
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
planned_capability_ids: ["CAP-PCF-707"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-707 — REX 追踪、回放与消融适配

[English](./en/PCF-707-research-trace-and-replay-adapter.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/research-adapter.mjs`、`tests/pcf707-research-adapter.test.mjs`。复用现有 REX manifest/trace collector；不复制 runner、fault authority 或 export DB。

- [ ] `toResearchEvent(pcfReceipt, context)`记录 task/action/attempt/reservation、policy与runtime版本、观测refs、决定理由、排队/搬运/执行/恢复、Owner intervention、缺失与丢弃数量。
- [ ] 提供确定性policy回放adapter及baseline/ablation开关；实验控制只能在隔离且已授权scope内生效。生产policy不能因查看报告而改变。
- [ ] schema向后兼容，字段单位一致，时钟/缺测/隐私明确；sidecar失败有界降级，不能阻断无关任务。
- [ ] 将实跑、模拟、recorded trace、counterfactual estimate分别标记；同trace不同决策的差异不等于真实性能收益。

验收：`node --test tests/pcf707-research-adapter.test.mjs`覆盖重复/乱序event、schema缺字段、collector关闭、buffer满、敏感字段、错误run/head绑定；比较启用/关闭instrumentation的实测开销。两个策略重放同输入应产出可复算差异。

本书可签收适配合同；完整 runner/fault/replay/export 实机研究终态归721，依赖 REX-803～806 accepted heads。不得把double接通写成Research Fabric完整验收。
