---
workbook_id: PCF-717
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
dependency_source_workbooks: ["PCF-709","PCF-710","PCF-713"]
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
planned_capability_ids: ["CAP-PCF-717"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-717 — 模型驻留、冷暖启动与推理资源（可选）

[English](en/PCF-717-model-residency-and-serving.md) · [共用步骤](EXECUTION_CONTRACT.md)

激活额外门：实际可用且已授权的local inference runtime、模型工件/许可与可测资源。缺GPU不影响CORE_V1；CPU验收不得宣传GPU结果。

候选 `services/personal-compute-fabric/model-residency.mjs`、`tests/pcf717-model-residency.test.mjs`。GAI仍拥有provider/channel、模型选择与API预算，PCF只管理执行资源和驻留事实。

- [ ] 版本化model/runtime/quantization/accelerator兼容；工件经709校验，下载/新增provider需授权。
- [ ] 冷启动、权重、workspace/KV cache、并发请求的内存需求与观测分离；admission考虑已驻留/已预留，不只看GPU个数。
- [ ] 有界warm pool、eviction、idle timeout、OOM处置、取消和request isolation；用户上下文/KV不得跨任务越权复用。
- [ ] routing考虑cold/warm与数据位置，禁止为了cache hit跨越隐私或付费门。

`node --test tests/pcf717-model-residency.test.mjs`覆盖OOM、并发装载、半下载、错误版本、驱逐在用模型、取消、残留上下文和GPU不可用。真实模型至少验证cold/warm latency、结果与内存测量；mock只验合同。新支持设备/量化方案可追加child，不把全部LLM框架变成必需。
