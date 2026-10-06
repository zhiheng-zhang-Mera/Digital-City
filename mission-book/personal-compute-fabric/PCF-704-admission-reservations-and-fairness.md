---
workbook_id: PCF-704
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
planned_capability_ids: ["CAP-PCF-704"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-704 — 原子准入、预留和公平队列

[English](./en/PCF-704-admission-reservations-and-fairness.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/{admission,reservations,fair-queue}.mjs`、`tests/pcf704-admission.test.mjs`。公开 `admit(proposal, expectedVersion)`、`releaseReservation(receipt)`；数据原子性由既有 canonical owner 承担，不在另一个 Task DB 上做假 CAS。

## 子任务

- [ ] 明确资源向量与可用/已预留量；candidate预估不等于reservation。实现幂等准入、TTL、取消释放、拒绝原因以及并发CAS/单写者等价语义。持久恢复接712。
- [ ] 多阶段/多资源请求采用有界 all-or-nothing 预留或显式 staged acquire；禁止长期 hold-and-wait 死锁。V1不强求跨机器分布式事务。
- [ ] 有界队列、per-app配额、公平轮转/aging、优先级和 deadline refusal；“提高交互优先级”不能无限饿死后台。
- [ ] 检查准入时的 policy/revocation/state/telemetry版本。估计过期应重算而不是用旧 freeSlots 强行启动。

## 验收

`node --test tests/pcf704-admission.test.mjs`：两个并发请求抢最后一份资源只有一个成功；重复admit不重复扣账；失败/取消/过期无泄漏；旧版本拒绝；容量不足不部分占死；持续小任务下大任务按声明策略获得机会或明确拒绝；queue full显式披露。

真实双机施加有界竞争，比较观测、reservation与实际执行占用。逻辑配额不宣称OS隔离；隔离证明归710。UI展示queue理由/配额/等待与拒绝，集中交715。
