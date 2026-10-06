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
dependencies: ["URA-001", "PCF-725"]
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
spec_revision: 2
migrated_scope_refs: ["PCF-MIG-20261007-01"]
migrated_scope_ownership: DESTINATION_PCF_ONLY
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

## 2026-10-07 子项迁出 / Requirement transfer

以下迁出项不再由本书实现或重复验收；本书只消费PCF版本化合同和证据，未列出的原目标、约束与完成门槛继续保留。源文字描述相同概念时仅作领域扩展/消费要求，不构成第二个实现owner。迁出不是完成，也不激活本书。

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-01 | URA-002 — 执行 provider 的版本、能力、权限、平台、命令、存储命名空间与兼容合同 | PCF-725 | 全城 App taxonomy、App lifecycle 及非执行业务合同 |

[PCF迁入与完整映射](../personal-compute-fabric/MIGRATION_HISTORY.md)

URA仍定义全城App/service合同与分类；其中执行provider的manifest、lifecycle/failure foundation复用PCF-725，只写App级扩展与映射测试。PCF不反向依赖URA，不能把本系列整体freeze设为PCF前置。
