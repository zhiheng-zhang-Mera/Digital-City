---
workbook_id: URA-002
phase: UTOPIA_RUNTIME_ARCHITECTURE
sequence: 2
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
dependencies: ["URA-001"]
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

# URA-002 — Runtime Taxonomy + App Contract

## 目标

冻结 Core / Platform Service / System App / Native App / Connector 的最小判定规则，并定义统一 App Contract。

## App Contract 最低内容

```text
app/service identity + version
required capabilities
requested permissions
public commands/actions/events
storage namespace
device/platform requirements
lifecycle install/enable/disable/update/uninstall/rollback
failure/isolation semantics
surface declarations
observability hooks
compatibility/version contract
```

## Native App 原则

“逻辑外挂、体验内嵌”：

- 业务逻辑不进 Core；
- 用户从 Utopia 正常产品入口进入；
- 通过 typed contract 使用 task/device/AI/storage 等平台能力；
- App crash/disable 不应破坏无关 Core；
- 可单独测试，必要时未来可单独版本化。

## 完成门槛

taxonomy 决策表 + App Contract schema + 与 City topology/Capability Registry 的映射规则。


---

语言读本 / Reading translation: [English](en/URA-002-runtime-taxonomy-and-app-contract.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
