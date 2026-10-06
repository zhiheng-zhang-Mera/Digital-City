---
workbook_id: PCF-703
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
dependency_source_workbooks: ["PCF-702","PCF-704","PCF-709","PCF-710"]
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
planned_capability_ids: ["CAP-PCF-703"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-703 — 显式阶段卸载与有限流

[English](./en/PCF-703-pipeline-offload-and-streams.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/{pipeline,stream-credit}.mjs`、`tests/pcf703-offload.test.mjs`。复用 RF RPC/EVENT/STREAM transport；不另造传输或设备发现。

## 子任务

- [ ] `compileExecutionPlan(workload, stageDefinitions)` 只接受显式、版本化、无环的执行阶段。每阶段声明输入/输出 schema、资源、权限、side effects、deadline、checkpoint 能力及 placement；不是让 LLM 自动拆分任意程序。
- [ ] stage 执行通过704 reservation和710 executor，输入走709；保存 parent task/action 与 stage/attempt 关系，canonical 归属不变。
- [ ] `openBoundedStream(plan, transport)` 实现 bytes/items 上限、credit、端到端 backpressure、取消、丢包/重连与 partial-output 策略；消费者慢时不能无限积压。
- [ ] 对搬运成本不划算、链路不稳或未授权的 offload，选择已获准的本地执行或 typed refusal，不静默改云/API。

## 验收

`node --test tests/pcf703-offload.test.mjs`：循环图/畸形 stage 拒绝；慢消费者内存有界；cancel 停止下游新工作；断链不发布半成品成功；权限变化阻止继续发内容；空/巨大输入有界。两 Windows worker 实跑 preprocess→compute→return，保留真实字节/耗时和原 task identity。Android仍仅发起/观察，不用模拟手机计算冒充 edge 验收。

输出 schema、backpressure 计数、阶段 provenance、真实跨机回执。阶段可增加，但新增状态/权限/端点必须走版本与 scope 管理。
