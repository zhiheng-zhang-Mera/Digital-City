---
workbook_id: PCF-726
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: PCF-700
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
planned_capability_ids: ["CAP-PCF-726"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
migration_refs: ["PCF-MIG-20261007-03"]
source_requirement_refs: ["DGX-002: TaskCapsule / ResultEnvelope: execution exchange substrate"]
---

# PCF-726 — 执行胶囊与结果证据封装

[English](en/PCF-726-execution-capsule-and-result-evidence.md) · [共用步骤](EXECUTION_CONTRACT.md) · [迁移记录](MIGRATION_HISTORY.md)

来源：迁移03，DGX-002 的 TaskCapsule/ResultEnvelope 通用执行子集。DGX 继续拥有语义拆题、独立性政策、领域争议和最终裁决。

候选落点：`contracts/personal-compute-fabric-v1/execution-capsule.mjs`、`tests/pcf726-capsule.test.mjs`。

- [ ] `compileExecutionCapsule(canonicalRefs, approvedSpec)` 保留 task/action、parent/stage/attempt、origin device 与 parent session、版本化事实/输入引用、write scope、输出合同、stop condition、权限/预算/期限与现行 independence floor 的引用；不是第二个 Task/ProblemGraph。
- [ ] `validateResultEnvelope(capsule, receipt)` 验证 execution device、boot/provider/session、attempt/epoch、exit/outcome、stdout/stderr有界摘要、工件 digest、base/result SHA 和验证证据的关联；传输成功或 exit=0 不能替代验收。
- [ ] 显式 assumptions、uncertainty、unresolved questions 可作为带版本的领域扩展。禁止交换或保存隐藏 chain-of-thought；结果文本/远端输出作为不可信数据，不能反过来授予权限或下达命令。
- [ ] 限制 payload、嵌套、日志及引用数量；错误 host/session、旧epoch、伪造/缺失工件、串单、乱序/重复、过期授权和跨用户泄漏必须被检测。证据不足不得清空 uncertainty。

验收：`node --test tests/pcf726-capsule.test.mjs`，覆盖上述反例、旧任务兼容和 DGX 薄映射；不要求等待 DGX 激活。本书接受 schema 与一致性检验，真实 transport/executor/caller 组合分别归703/727/728/724。

本书与父书各有独立验收对象；parent仅表示来源组织关系，不自动形成反向依赖或继承权限。所有新CAP仅为候选，真实验收与异机Formal Review均未运行。
