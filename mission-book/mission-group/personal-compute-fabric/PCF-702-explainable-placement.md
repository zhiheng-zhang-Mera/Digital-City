---
workbook_id: PCF-702
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: null
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-701","PCF-706","PCF-708"]
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
planned_capability_ids: ["CAP-PCF-702"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-702 — 可解释放置与成本估计

[English](en/PCF-702-explainable-placement.md) · [共用步骤](EXECUTION_CONTRACT.md)

新增候选 `services/personal-compute-fabric/{placement,cost-model}.mjs` 与 `tests/pcf702-placement.test.mjs`。消费701/706/708；产出纯 `planPlacement(...) -> PlacementProposal`。对 WBC helper 做兼容映射，不另设 claim/scheduler authority。

## 子任务

- [ ] 可行性过滤先于排序：信任/授权/dataScope、strict target、平台/能力、硬资源需求、freshness 和 isolation capability；unknown 硬需求须重测或诚实拒绝，不能猜满足。
- [ ] 成本分解为排队、输入搬运、冷启动、执行、结果返回；保存估计区间、样本来源、模型版本与缺测状态。无校准证据时用保守规则，不制造预测精度。
- [ ] 确定性初版支持固定优先、capability-only、load-only 与 composite；稳定 tie-break。保存所有可行候选与脱敏拒绝原因，proposal 有 policy/state/observation refs 和期限。
- [ ] placement proposal 只能交704准入；准入前重验资源与授权，防止看上去可用但已经被抢占。

## 反例与验收

`node --test tests/pcf702-placement.test.mjs`：最快节点无授权仍拒绝；strict target 离线不改投；缺 VRAM 不当0也不当充足；同输入同版本同选择；相同 freeSlots 不代表相同性能；大量候选有界；更旧 proposal 被版本检查拒绝。对两真实 worker 保存可重算决策与观察快照，不以单测证明性能提升。

UI 的 What/Why/候选拒绝原因进入715 task inspector；元数据不得泄漏敏感输入。复杂策略增补需要独立 baseline/ablation，学习型策略归723。

## 2026-10-07 规格强化 / Specification revision 2

迁入07中的执行供给/placement 子项，FR只提供工程优先级与资格需求。过滤真实 executor readiness、当前授权与输入位置，不凭“设备在线”选择 Codex。默认保持既有 local-first；跨机帮忙需明确本次或限定范围授权，不为追求更快自动改预算。记录两主机分别可承担的并行子任务，不把“整项搬到Mech”描述为双机协同。

详见 [迁移与单一所有权](MIGRATION_HISTORY.md)。本修订不授予施工、预算、远端执行或合并权限。
