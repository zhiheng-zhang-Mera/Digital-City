---
workbook_id: PCF-708
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
dependency_source_workbooks: ["PCF-700"]
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
planned_capability_ids: ["CAP-PCF-708"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-708 — 工作负载合同、QoS 与重试语义

[English](en/PCF-708-workload-envelope-and-qos.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `contracts/personal-compute-fabric-v1/workload.mjs`、`tests/pcf708-workload.test.mjs`。`normalizeWorkload(canonicalTask, extension)`只扩展执行需求，不创建第二个Task，也不把Android control principal提升为worker。

- [ ] 定义版本化WorkloadEnvelope和ExecutionAttempt，保留taskId/actionId/origin、targetDeviceRef；声明executor/input/output、能力、平台、资源、dataScope、consent、deadline和retrySafety。
- [ ] QoS只分INTERACTIVE / SOFT_DEADLINE / BATCH / BACKGROUND；deadline超时策略是拒绝/降级/继续中的显式选择，不预设50ms硬实时保证。
- [ ] 将side-effect-free、idempotent-keyed、checkpoint-resumable、non-retryable、unknown-effect作为独立明确能力；checkpoint支持不能靠worker自称推导。
- [ ] legacy任务缺扩展字段保持原行为；未知schema版本、单位冲突、畸形资源需求与未经验证的特权请求typed拒绝。字段大小/嵌套深度有界。

`node --test tests/pcf708-workload.test.mjs`：旧task往返保持identity和语义；providerRef/handoffTargetRef不被当strict target；空/负/无限资源、过去deadline、未知enum、伪control-worker能力、超大payload均正确处理。

交付consumer兼容表、版本升级/降级fixture、隐私脱敏规则及用户可理解的任务类别文案（最终接线715）。可增加workload class，但不得加入行业业务数据为核心必填项。
