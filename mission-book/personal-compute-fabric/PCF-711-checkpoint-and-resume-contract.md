---
workbook_id: PCF-711
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
dependency_source_workbooks: ["PCF-708","PCF-709","PCF-710"]
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
planned_capability_ids: ["CAP-PCF-711"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-711 — 显式检查点与恢复兼容性

[English](./en/PCF-711-checkpoint-and-resume-contract.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `contracts/personal-compute-fabric-v1/checkpoint.mjs`、`services/personal-compute-fabric/checkpoints.mjs`、`tests/pcf711-checkpoints.test.mjs`。`validateCheckpoint(ref,targetEnvironment)`扩展现有checkpoint-gate，不替代它的拒绝语义。

- [ ] 定义provider显式save/restore能力、原task/attempt/inputDigest、schema、executor/runtime/model版本、完成stage、待提交输出和副作用状态。
- [ ] 检查点发布采用可校验的完整工件，partial/write-failed不可见为可恢复；generation/digest与授权传给709。
- [ ] restore必须检查目标平台/依赖/模型/数据域兼容。升级后不兼容应拒绝或走已测试migration，不根据文件存在猜可恢复。
- [ ] 为真实分块CPU任务提供中断→恢复→最终digest一致的例子；明确不可序列化的GUI/外部会话/供应商隐藏推理不能自动恢复。

`node --test tests/pcf711-checkpoints.test.mjs`：半写、损坏、错task、旧input、错executor/model、未完成外部副作用、权限撤销、重复restore；已提交结果不能二次提交。对两个真实worker分别保存/读取兼容工件，记录实际节约/浪费的工作量，不夸称任意进程迁移。

resume-support、拒绝理由、checkpoint位置/版本须在715技术详情可追溯，敏感内容不显示。新增checkpoint provider可作为child，不扩大所有任务必须支持的范围。
