---
workbook_id: DGX-003
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 3
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
dependencies: ["DGX-001", "DGX-002"]
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
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: []
capability_registry_action: UNASSESSED
capability_registry_refs: []
capability_registry_sync_status: UNASSESSED
research_evidence_applicability: UNASSESSED
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: STANDARD
state_identity_evidence: UNASSESSED
state_identity_evidence_refs: []
monitor_observability_evidence: UNASSESSED
monitor_observability_refs: []
decision_trace_evidence: UNASSESSED
decision_trace_refs: []
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

> **PARKED / NOT ACTIVATED.** 本工作书当前只冻结设计边界；不得 claim、不得施工、不得据此创建 Utopia 产品分支。  
> **Anchor policy:** 所有 baseline / dependency exact SHA 当前故意留空。只有 Owner 显式激活后，才按当时最新 canonical truth 解析 full SHA 并原子写入。

# DGX-003 — Capability / History / Independence Assignment Policy

## 目标

把复杂任务的参与者选择从随机/固定分配升级为可审计的 capability-based assignment，同时把**独立性要求作为 eligibility floor**，而不是事后口头判断。

## 评分事实

评分读取既有 Capability/History truth，不复制数据库。至少支持：

- domain capability fit；
- historical completion/pass rate；
- review/adjudication uphold history；
- evidence quality；
- current resource/tool readiness；
- bounded recent-failure penalty。

评分仅决定**谁更适合承担任务**，不得成为“谁说的更真”的证据。

## Independence Profile

任务/角色可以声明以下维度中的必要 floor：

```text
role_authorship_independence
agent_or_session_independence
model_family_independence
host_independence
environment_independence
hardware_or_toolchain_independence
conflict_of_interest_recusal
```

规则：

- 不是所有任务都必须把每个维度拉满；
- 高风险/高争议任务可以要求多维独立；
- profile 是 eligibility constraint，不是“模型越多越真”的投票机制；
- independence service unavailable 时，不得静默降级硬门槛；
- 当前 Engineering Formal Review 的 **different physical host** 要求仍是现行最低门槛，DGX 不能把它改成可选项。

未来若 Review Independence v2 通过独立迁移证明其它组合可达到等价/更高 assurance，才允许修改 Engineering 规则。

## Assignment receipt

每次 assignment 产生 bounded receipt：

```text
task_ref
problem_node_ref
candidate_set
selected_participant
role
score_components
required_independence_profile
observed_independence_facts
rejected_or_unavailable_reason
fallback_or_escalation
```

## 完成门槛

可解释分配、独立性 eligibility 检查、fallback、无可用候选时诚实升级；不得因评分服务故障冻结普通低风险任务，不得降低既有领域 gate。
