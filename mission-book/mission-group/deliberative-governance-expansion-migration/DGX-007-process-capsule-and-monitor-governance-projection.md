---
workbook_id: DGX-007
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 7
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: a34a65556fbbd2e8d2c90a267e84ed19b8234171
baseline_resolution_evidence: mission-book/reports/DGX/DGX-007.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-002", "DGX-005", "DGX-006"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: 6fe6e85b51f3e067dc67405c8e01a93e89dca1b4
development_ci: {"head_sha":"6fe6e85b51f3e067dc67405c8e01a93e89dca1b4","run_id":37577646603,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37577646603"}
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: WEB_GOVERNANCE
user_exposure_nesting: L0_CAPSULE_L1_INSPECTOR_L2_EVIDENCE
backend_wiring: PARTIAL
ui_exemption_reason: null
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
development_component_commit_sha: 14a23267d3d720c25884cc217891229cee292af2
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: WHOLE_SERIES_SECOND_HOST_NOT_RUN
external_dependency_state: PCF_726_REQUIRED_SCHEMA_SLICE_IMPLEMENTED_SERIES_REVIEW_PENDING

dependency_source_workbooks: ["DGX-002","DGX-005","DGX-006"]
review_execution_scope: WHOLE_SERIES_SECOND_PHYSICAL_HOST
per_workbook_acceptance_gate: SUSPENDED_BY_OWNER_FOR_SERIES_DEVELOPMENT
owner_ruling_ref: mission-book/reports/DGX/OWNER_SERIES_RULING.md
series_evidence_ref: mission-book/reports/DGX/series-evidence/SERIES_EVIDENCE.json
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。旧版逐本依赖验收暂停；第二机统一验收整个系列，运行时安全与 release 独立性门槛仍保留。
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

# DGX-007 — Process Capsule + Monitor Governance Projection

## 目标

让 Owner 每次收到正式复杂任务结果时都能看到**压缩后的显式过程、验证与决策链**，但不被迫做人肉 reviewer。

> 本轮矫正：不再使用“压缩后的思考链”表述。Process Capsule 展示可审计的 decomposition / assignment / evidence / conflict / decision，不展示、推断或保存隐藏 chain-of-thought。

## L0 — Process Capsule（默认随结果返回）

至少显示：

- Owner request / accepted scope；
- Problem Graph decomposition summary；
- participants / roles；
- assignment basis + independence floor；
- structured node outcomes；
- material conflicts；
- adjudication outcomes；
- validation performed；
- residual uncertainty；
- final release-gate state。

## L1 — Deliberation Inspector

按需展开 Claim / Evidence / Objection / Defence / provisional-vs-final adjudication summary / dissent。

## L2 — Technical Evidence

按需查看 exact SHA、CI/test、source/citation、artifact、decision receipt、timestamps、snapshot/version refs 等。

## 隐私与认知负担边界

不得显示/保存隐藏 chain-of-thought；不得把 routine heartbeat、重复日志、每个 token、未采用草稿默认推给 Owner。

## Monitor 边界

复用 City Work Monitor 的 projection/progressive disclosure；Governance projection 不是新的 task truth，Monitor/JEV 故障不能阻塞无关执行。

Problem Graph 可以在 Monitor 中投影为 DAG，但其节点状态不得覆盖 canonical runtime/task state；冲突时必须显示 reconciliation warning。

## 完成门槛

至少一个无冲突案例和一个有冲突/仲裁案例能生成准确 Process Capsule，并能从 L0 追到 exact evidence；Owner 不需要阅读隐藏推理即可理解“怎么拆、谁做、为什么、证据是什么、哪里不确定”。

语言配对 / Language pair: [English reading](en/DGX-007-process-capsule-and-monitor-governance-projection.md)
