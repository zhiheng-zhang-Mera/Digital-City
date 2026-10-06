---
workbook_id: PCF-723
phase: PERSONAL_COMPUTE_FABRIC
release_train: OPTIONAL_EXTENSION
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
dependency_source_workbooks: ["PCF-702","PCF-707","PCF-721"]
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
planned_capability_ids: ["CAP-PCF-723"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-723 — 有证据门的自适应放置研究（可选）

[English](./en/PCF-723-adaptive-placement-research.md) · [共用步骤](./EXECUTION_CONTRACT.md)

先有721的baseline数据和清楚的确定性不足，再决定是否值得做。无收益是可报告研究结论，不是伪造策略提升的理由；不因“智能”一词强制训练模型。

候选 `services/personal-compute-fabric/adaptive-policy.mjs`、`tests/pcf723-adaptive-policy.test.mjs`，接口仍为702的proposal contract。

- [ ] 选择可检验的估计校准/在线统计/轻量学习方法；分train/validation/held-out workload或时间段，防止把同trace训练又测试。
- [ ] safety shield只允许在706/708过滤后的可行集合排序；学习器不得改trust、consent、strict target、review门或费用授权。
- [ ] offline评估→shadow decision→明确Owner批准的小范围canary→可逆启用；每次policy/model版本、输入和变化原因可追溯。
- [ ] drift、低置信度、超时、输入越界、成本超限回退到已验证确定性策略，不能冻结core或静默试探用户权限。

验收包括scoped invariant tests、held-out实验、开销/收益区间和失败案例；不只报告训练集平均latency。若不值得部署，可保留研究artifact并明确未启用，不标运行能力已交付。以后更复杂bandit/RL等必须再证明增量价值和安全，不默认纳入本书。
