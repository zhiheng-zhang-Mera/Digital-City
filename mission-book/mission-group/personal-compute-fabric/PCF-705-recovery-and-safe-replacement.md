---
workbook_id: PCF-705
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
dependency_source_workbooks: ["PCF-703","PCF-711","PCF-712"]
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
planned_capability_ids: ["CAP-PCF-705"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-705 — 故障恢复与安全重放置

[English](en/PCF-705-recovery-and-safe-replacement.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/recovery.mjs`、`tests/pcf705-recovery.test.mjs`。消费显式checkpoint和712 fencing，适配现有 handoff/recovery，不重定义 canonical task lifecycle。

## 子任务

- [ ] `planRecovery(attemptFacts, policy, targetFacts)` 区分 retry-safe、checkpoint-resumable、non-retryable、SIDE_EFFECT_UNKNOWN；不得把任何 FAILED 都重跑。
- [ ] 对允许的恢复创建新attempt，保持task/action/origin。检查数据位置、executor/schema/model兼容、目标资格、consent、retry budget及冷却期。
- [ ] 搬迁收益必须覆盖传输/冷启动/丢弃工作成本；加入hysteresis避免两台机器来回抖动。strict-target任务不因掉线而自动换目标。
- [ ] 旧worker晚到结果由fence拒绝；副作用未知先核验或隔离，必要attention带事实和范围，不承诺通用exactly-once。

## 验收

`node --test tests/pcf705-recovery.test.mjs`：commit前/后失联、旧结果晚到、checkpoint损坏、不兼容executor、授权撤销、重复recovery事件、反复负载摆动、strict target离线。允许恢复的任务最终结果与原始输入契约一致；不允许的任务保持诚实拒绝/等待，不假成功。

双机真断链/进程崩溃的安全样本，保存same taskId、不同attempt/fence、恢复时间及重复副作用检查。不是VM/live-process migration，也不是控制器HA。恢复策略、暂停/取消、剩余不确定性由714/715展示。
