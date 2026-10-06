---
workbook_id: PCF-722
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
dependency_source_workbooks: ["PCF-705","PCF-712","PCF-716"]
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
planned_capability_ids: ["CAP-PCF-722"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-722 — 控制面连续性与HA（可选、独立硬门）

[English](./en/PCF-722-controller-continuity-and-ha.md) · [共用步骤](./EXECUTION_CONTRACT.md)

本任务不同于705的worker恢复和712的同控制器重启。额外前提：真实可用的控制节点、存储/复制与可验证fencing方案，以及Owner批准的故障测试范围。前提缺失不启动HA实现，更不阻塞CORE_V1。

候选 `services/personal-compute-fabric/controller-continuity.mjs`、`tests/pcf722-continuity.test.mjs`。任何canonical storage演化必须独立设计评审，不能把两个JSON目录相互复制当一致性协议。

- [ ] 先固定failure model、RPO/RTO目标、持久化/副本落后语义、谁有权提升、旧writer如何失效和恢复后如何重入；所有SLO是待验证目标。
- [ ] 双节点网络分区不能同时自升primary。可选经证明的第三仲裁/强一致lease基础设施，或保守拒绝自动提升并要求可验证人工fence；无条件时保持fail-closed。
- [ ] staged handover要drain、持久化核对、明确epoch、canary和rollback；有界同步任务/工件/凭据refs，不复制裸secret。
- [ ] 区分计划维护切换、人工fenced standby与自动failover；分别签收，不以人工流程冒充自动高可用。

`node --test tests/pcf722-continuity.test.mjs`覆盖分区、非对称断联、时钟偏差、旧leader复活、storage落后、重复promotion、fencing失效和controller+worker同时异常。自动HA标记只有真实故障与单writer证明后释放；缺substrate保持BLOCKED/NOT_RUN，文档评审不是实现完成。不得要求现在采购第三节点或双Linux。
