---
workbook_id: PCF-706
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
planned_capability_ids: ["CAP-PCF-706"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-706 — 策略、同意与数据域

[English](en/PCF-706-policy-consent-and-data-boundaries.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `contracts/personal-compute-fabric-v1/policy.mjs`、`services/personal-compute-fabric/policy.mjs`、`tests/pcf706-policy.test.mjs`。`resolveEffectivePolicy(request, authorityFacts)`引用既有trust、GAI budget和Attention，不造新凭据库或审批数据库。

## 子任务

- [ ] 版本化端点allowlist、workload范围、有效期、预算、fallback和revocation；数据域明确ORIGIN_DEVICE_ONLY / TRUSTED_PERSONAL_FABRIC / APPROVED_CLOUD。
- [ ] 继承local-first、显式跨设备确认、Web/API切换门。可保存Owner明确的有界预授权，不能把一次同意扩大到任意设备/未来所有任务。更快的节点不能绕过授权。
- [ ] 对dispatch、artifact transfer、executor start、result publish重验同意；拒绝cause可追溯，敏感值脱敏。策略未配置或不一致时保守fail-closed，legacy默认不改变。
- [ ] 明确硬约束冲突解释与可逆opt-out；不得以高级设置覆盖身份/权限硬门。费用上限的单位、币种/计量和剩余额度不可混淆。

## 验收

`node --test tests/pcf706-policy.test.mjs`：过期/撤销/别的task的consent无效；ORIGIN_DEVICE_ONLY不能发给另一私人PC；网内设备不自动受信任；许可元数据不能伪造授权；零/未知预算不触发付费；多请求竞争额度仍不越界；日志无secret。

直接控制的同意/拒绝/撤销和sharing策略必须经715真实UI接线后才作为用户能力发布；后台拒绝由714回到原端。可增domain profile但不加入诊断/投资等专业决策逻辑。
