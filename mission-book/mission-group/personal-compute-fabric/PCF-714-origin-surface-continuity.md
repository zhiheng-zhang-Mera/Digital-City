---
workbook_id: PCF-714
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
dependency_source_workbooks: ["PCF-703","PCF-705"]
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
planned_capability_ids: ["CAP-PCF-714"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-714 — 发起端交互和回执连续性

[English](en/PCF-714-origin-surface-continuity.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/origin-projection.mjs`、`tests/pcf714-origin.test.mjs`；修改现有客户端adapter的范围由700/715协调。复用canonical Action/Attention和server event seq，不建立第二个通知队列真相。

- [ ] 远端执行/恢复只改变执行attempt，原task/action/origin引用不变。原端可看到进度、placement理由、结果、工件、错误与attention，并可取消或回复。
- [ ] origin离线时canonical结果继续保存；重连以seq/cursor有界追赶，gap明确reconcile，重复事件不重复结果或响铃。
- [ ] 用户在另一已授权surface查看/接管交互时复用既有assistant handoff与attention规则；不因设备切换生成新任务或共享未授权上下文。
- [ ] 取消、批准与远端完成竞态必须有单一terminal truth；late cancel不能伪称已撤回外部副作用。最近设备提醒沿用已有策略，不新增全设备广播。

`node --test tests/pcf714-origin.test.mjs`：origin断线/重连、乱序重复、设备重新绑定、授权过期、异步result与cancel、同时回应attention；未授权端拿不到结果/元数据。

实机矩阵：Alien Web、Mech Web、Android各发起一次跨worker合法任务，在原端取回结果并验证一次取消/失败；Android本身仍为control client。文档截图与backend trace绑定同一task/attempt，不用伪数据面板验收。
