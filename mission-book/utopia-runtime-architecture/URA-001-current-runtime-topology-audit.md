---
workbook_id: URA-001
phase: UTOPIA_RUNTIME_ARCHITECTURE
sequence: 1
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
dependencies: []
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

> **PARKED / NOT ACTIVATED.**

# URA-001 — Current Runtime Topology & Ownership Audit

## 目标

只读审计 Utopia 当前模块、入口、依赖与 canonical owner，并映射到候选 runtime role；不搬代码。

## 输出字段

```text
capability/module
current_path
canonical_owner
city_building_room
runtime_role_candidate
public_contracts
dependencies
user_surfaces
lifecycle
failure_scope
coupling_findings
reclassification_needed
code_move_needed
```

默认 `code_move_needed=false`。

## 重点对象

Butler Assistant、Remote Fabric、General AI Gateway、Engineering Manager、Monitor/JEV、Capability/Device fabrics、Rooms/Apps、外部 connectors。

## 完成门槛

得到 reality-bound runtime map，并列出真正存在的 ownership/dependency/lifecycle 冲突；不得因命名不整齐就提出搬迁。


---

语言读本 / Reading translation: [English](en/URA-001-current-runtime-topology-audit.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
