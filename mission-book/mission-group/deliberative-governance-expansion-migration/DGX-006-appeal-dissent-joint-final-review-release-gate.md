---
workbook_id: DGX-006
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 6
execution_enabled: true
status: DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW
activation_state: OWNER_ACTIVATED_SINGLE_BRANCH_DEVELOPMENT
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: 16bd4ffc34aa77fd5401b2f56dc3a371653b18b7
baseline_resolution_evidence: mission-book/reports/DGX/DGX-006.md
anchor_state: PROVISIONAL_DEVELOPMENT_ACCEPTED_DEPENDENCIES_PENDING
dependencies: ["DGX-005"]
development_host: Alien
development_branch: Alien-GPT-DGX
development_head_sha: e5a03dae02ca341d6d23565735e6cd6c3edc27d9
development_ci: {"head_sha":"e5a03dae02ca341d6d23565735e6cd6c3edc27d9","run_id":37579270778,"status":"COMPLETED","conclusion":"success","url":"https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37579270778"}
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
development_component_commit_sha: a34a65556fbbd2e8d2c90a267e84ed19b8234171
development_candidate_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
formal_acceptance_state: WHOLE_SERIES_SECOND_HOST_NOT_RUN
external_dependency_state: PCF_726_REQUIRED_SCHEMA_SLICE_IMPLEMENTED_SERIES_REVIEW_PENDING

dependency_source_workbooks: ["DGX-005"]
review_execution_scope: WHOLE_SERIES_SECOND_PHYSICAL_HOST
per_workbook_acceptance_gate: SUSPENDED_BY_OWNER_FOR_SERIES_DEVELOPMENT
owner_ruling_ref: mission-book/reports/DGX/OWNER_SERIES_RULING.md
series_evidence_ref: mission-book/reports/DGX/series-evidence/SERIES_EVIDENCE.json
---

> **OWNER ACTIVATED 2026-10-07.** Alien-GPT-DGX 单分支开发；禁止合并 main。旧版逐本依赖验收暂停；第二机统一验收整个系列，运行时安全与 release 独立性门槛仍保留。
> **Anchor policy:** 初始 Utopia main 已按 full SHA 固定。按 Owner 单分支裁决进行内部候选开发；正式 accepted dependency anchors 仍待独立 Review，不能以开发提交冒充。

# DGX-006 — Appeal / Dissent / Joint Final Review & Release Gate

## 目标

在 Integrated Candidate 形成后，把结果发回所有实际参与者做 scoped final review，并提供有界申诉/少数意见机制。

Final review 消费的是**显式结果、证据、accepted assumptions、unresolved uncertainty 与 integration delta**，不要求共享或复现任何隐藏 chain-of-thought。

## Final reviewer verdict

```text
APPROVE
APPROVE_WITH_MINOR_NOTES
REQUEST_CHANGES
BLOCK
```

每个 verdict 必须声明 review scope、checked claims/evidence 与 unresolved objection severity。

## Release semantics

不是要求所有 Agent 对所有内容完全同意，而是：

- 无未解决 Critical；
- 无未解决 Major factual/safety/correctness objection；
- 对应领域责任 reviewer 的必需 gate 已 PASS；
- independence floor 已满足；
- dissent 可保留但不得被静默删除；
- integration 没有把子任务结果扩写成证据不支持的更强结论。

重大 REQUEST_CHANGES/BLOCK → 返回 Integration；Owner-only 边界 → Owner。

## Appeal

申诉必须新增证据、指出 procedure violation 或具体 factual error；不得无限循环。次数/升级阈值在激活时由 policy 明确。

## 完成门槛

有界终审、无无限 consensus loop、release receipt 可审计；参与者不同意不等于自动阻塞，但 Critical/Major 未解决问题不得被多数票覆盖。

语言配对 / Language pair: [English reading](en/DGX-006-appeal-dissent-joint-final-review-release-gate.md)
