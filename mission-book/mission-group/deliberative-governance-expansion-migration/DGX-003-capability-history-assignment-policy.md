---
workbook_id: DGX-003
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 3
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 457599947a66e6621b26ff4b434c53cc9c468c58
baseline_resolution_evidence: mission-book/reports/DGX/DGX-003.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-001", "DGX-002"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 6fe6e85b51f3e067dc67405c8e01a93e89dca1b4
development_ci: {"head_sha":"6fe6e85b51f3e067dc67405c8e01a93e89dca1b4","run_id":37577646603,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37577646603"}
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: PARTIAL
ui_exemption_reason: VERSIONED_GOVERNANCE_CONTRACT_OR_AUDIT_CONSUMED_BY_PROCESS_INSPECTOR
capability_ids: ["CAP-DGX-GOVERNANCE-001", "CAP-DGX-PROCESS-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-DGX-GOVERNANCE-001.yaml", "capability-registry/records/CAP-DGX-PROCESS-001.yaml"]
capability_registry_sync_status: CANDIDATE_PENDING_FORMAL_REVIEW
research_evidence_applicability: BOUNDED_DEVELOPMENT_OBSERVATION
long_horizon_context_evidence: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: STANDARD
state_identity_evidence: EXACT_DEVELOPMENT_HEAD
state_identity_evidence_refs: []
monitor_observability_evidence: CONTROLLED_CONFORMANCE
monitor_observability_refs: []
decision_trace_evidence: CONTROLLED_CONFORMANCE
decision_trace_refs: []
owner_gate: WHOLE_SERIES_SECOND_HOST_REVIEW_PENDING_NO_MAIN_MERGE
merge_authority: false
report_path: mission-book/reports/DGX
development_component_commit_sha: 0907309f0b8fbee2fcc0260e2a69a5582a1041b5
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: WHOLE_SERIES_SECOND_HOST_NOT_RUN
external_dependency_state: PCF_726_REQUIRED_SCHEMA_SLICE_IMPLEMENTED_SERIES_REVIEW_PENDING

dependency_source_workbooks: ["DGX-001","DGX-002"]
review_execution_scope: WHOLE_SERIES_SECOND_PHYSICAL_HOST
per_workbook_acceptance_gate: SUSPENDED_BY_OWNER_FOR_SERIES_DEVELOPMENT
owner_ruling_ref: mission-book/reports/DGX/OWNER_SERIES_RULING.md
series_evidence_ref: mission-book/reports/DGX/series-evidence/SERIES_EVIDENCE.json
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。旧版逐本依赖验收暂停；第二机统一验收整个系列，运行时安全与 release 独立性门槛仍保留。
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

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

语言配对 / Language pair: [English reading](en/DGX-003-capability-history-assignment-policy.md)
