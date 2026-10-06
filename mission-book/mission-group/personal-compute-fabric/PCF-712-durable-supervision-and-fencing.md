---
workbook_id: PCF-712
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
dependency_source_workbooks: ["PCF-704","PCF-710"]
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
planned_capability_ids: ["CAP-PCF-712"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-712 — 常驻执行监督、持久化协调与 fencing

[English](en/PCF-712-durable-supervision-and-fencing.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/{supervisor,canonical-state-adapter}.mjs`、`tests/pcf712-supervision.test.mjs`。`reconcileExecution(canonicalSnapshot,observations)`只提出执行生命周期动作；FR保留工程目标、review/repair与技术仲裁。

- [ ] 事件订阅加有界reconcile timer，幂等处理重放/丢失事件；无工作时低成本等待，不生成假任务。
- [ ] 在既有canonical owner下持久化reservation/attempt/commit-token关系。若Store需要补原子写/版本检查，单写者seam明确并覆盖故障注入，不能另写PCF task DB。
- [ ] 每次holder变化递增fence epoch；start/report/result commit全部检验attempt与epoch。持久化失败不得先执行后假记账。
- [ ] crash/restart后核对canonical task、实际worker/boot、未决预留和回执；不确定副作用交705处理，不按timeout推断已停止。

`node --test tests/pcf712-supervision.test.mjs`：写前/写中/写后崩溃、重复事件、旧worker仍活着、旧epoch晚到、启动双supervisor、存储不可写、事件流中断、空池等待。只允许一个有效canonical写者；无法确认权威时fail-closed。验证restart不泄漏reservation、不重复提交结果。

真实常驻循环不依赖Owner打开聊天页；本书不做无人值守安装（716），不做双控制器HA（722），不自动启动Hns/Codex新工程。Supervisor健康与recovery问题归715可见。
