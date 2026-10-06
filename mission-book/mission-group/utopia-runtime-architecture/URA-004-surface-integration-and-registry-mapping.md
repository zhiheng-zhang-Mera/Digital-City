---
workbook_id: URA-004
phase: UTOPIA_RUNTIME_ARCHITECTURE
sequence: 4
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
dependencies: ["URA-002", "URA-003"]
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

# URA-004 — Surface Integration + Capability Registry Mapping

## 目标

把 runtime role 与用户入口/知情权/Capability Registry 对齐，避免“架构分类正确但用户能力再次藏起来”。

## 规则

每个 App/Service/Connector 必须映射：

```text
runtime_role
CAP-* ids
implementation owner
backend wiring
user exposure class
surface locations
platform parity
observable health/status
owner controls
failure/refusal presentation
```

### Service

不一定有顶级 App UI，但影响 routing/device/provider/cost/trust/privacy/background behavior 的 Service 至少需要 OBSERVABLE_ADVANCED 或 BACKGROUND_DISCLOSED。

### Native/System App

遵守 User-Reachable Vertical Slice First；正常用户路径必须真实接 canonical backend。

### Connector

必须显示连接状态、权限/身份边界、失败来源，避免把外部不可用误报成 Utopia 核心故障。

## 完成门槛

runtime taxonomy 与 Capability Registry/Exposure Gate 之间没有第二套冲突状态。


---

语言读本 / Reading translation: [English](en/URA-004-surface-integration-and-registry-mapping.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
