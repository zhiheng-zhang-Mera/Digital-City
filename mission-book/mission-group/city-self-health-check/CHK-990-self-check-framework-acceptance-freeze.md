---
workbook_id: CHK-990
phase: CITY_SELF_HEALTH_CHECK
sequence: 990
execution_enabled: true
status: IN_PROGRESS
activation_state: OWNER_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: OWNER_SERIES_DEVELOPMENT_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/Alien-GPT-CHK"]
required_ancestor_shas: ["cc799234e7daa3d8ccfde5673b9d07ccb2376742"]
dependency_source_shas: []
development_baseline_sha: cc799234e7daa3d8ccfde5673b9d07ccb2376742
baseline_resolution_evidence: mission-book/reports/CHK/CLAIM.json
anchor_state: CLAIMED_EXACT_SHA_WITH_OWNER_SERIES_OVERRIDE
dependencies: ["CHK-101", "CHK-201", "CHK-301", "CHK-401"]
development_host: Mera-Alianware
development_branch: Alien-GPT-CHK
development_head_sha: 672d6ce32019dae33cbde11f91e8bbe58e958ad8
development_ci: IN_PROGRESS https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37577880475; not completion evidence
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: NONE_INTERNAL
backend_wiring: NOT_APPLICABLE_INTERNAL
ui_exemption_reason: "Internal bounded health checks; activation does not authorize UI changes or automatic repairs."
capability_ids: ["CAP-CITY-SELF-CHECK-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-CITY-SELF-CHECK-001.yaml"]
capability_registry_sync_status: CANDIDATE_PENDING_WHOLE_SERIES_REVIEW
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
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CHK
dependency_source_workbooks: ["CHK-101","CHK-201","CHK-301","CHK-401"]
baseline_blocker: null
owner_series_development_override: 2026-10-07_ALL_CHK_DEVELOPMENT_BEFORE_WHOLE_SERIES_SECOND_HOST_REVIEW
independent_series_review: NOT_RUN
---

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.

> **OWNER ACTIVATED / EXECUTION ENABLED.** 首次运行采用 bounded dry-run/read-only；依赖、正式复检与安全晋升门槛继续生效，不授权自动修复或自我修改。

# CHK-990 — Self-Check Framework Acceptance & Freeze

## 目标

在未来正式启用周期体检前，验证 CHK 不会成为第二套 scheduler、无限审计负担或自动自改权限。

## 必测

1. 小体检能在 bounded scope 内完成；
2. 大体检能从 runtime/code 反向发现至少一种 Registry/architecture drift；
3. 健康报告与修复施工严格分离；
4. PARKED/suspend 不会误进入 active truth；
5. Self Cognition 能表达 UNKNOWN/NOT_MEASURED，而不是猜测；
6. Self Diagnosis 保持多假设与缺证据；
7. Case Record 不覆盖历史判断；
8. Boss BLG reconciliation 能输出 SUPERSEDED/KEEP 等非迁移结论；
9. Evolution Candidate 不自动获得 execution authority；
10. candidate 能正确路由到 REX/RIV/URA/DGX/其它 Mission；
11. promotion/rollback authority 明确；
12. CHK 自身开销可测且不会长期占用施工主机。

## Freeze outcome

候选：

`CITY_SELF_HEALTH_CHECK_V1_ACCEPTED`

只有通过 CHK-990 后，才允许把小/大/季度体检变成真正周期运行机制。

即使通过，也不自动创建定时任务；调度频率与执行主机需另行显式启用。


---

语言读本 / Reading translation: [English](en/CHK-990-self-check-framework-acceptance-freeze.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
