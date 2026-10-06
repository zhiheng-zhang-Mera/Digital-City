---
workbook_id: URA-003
phase: UTOPIA_RUNTIME_ARCHITECTURE
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
dependencies: ["URA-001", "URA-002", "PCF-725"]
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
migrated_scope_refs: ["PCF-MIG-20261007-02"]
migrated_scope_ownership: DESTINATION_PCF_ONLY
---

> **PARKED / NOT ACTIVATED.**

# URA-003 — Dependency / Lifecycle / Failure Boundaries

## 目标

在不物理拆仓的前提下先建立逻辑边界。

## 候选依赖方向

```text
Native/System Apps
→ Public Contracts
→ Platform/System Services
→ Core primitives
```

允许通过显式 event/callback/extension point 回流；禁止 Core import 具体业务 App 实现。

## 必须定义

- authority boundary；
- startup/shutdown order；
- dependency failure behavior；
- retry/timeout/circuit-breaker where relevant；
- data/storage ownership；
- version compatibility；
- app/service disable/uninstall semantics；
- crash containment；
- migration/rollback；
- test seam。

## 单仓原则

monorepo/single-repo 内仍可以通过 package/module boundary、contract tests、dependency lint、runtime registration 建立独立性。物理 repo split 只有在独立发布/部署/权限/CI/生命周期收益被证明时再讨论。

## 完成门槛

形成可机器检查的 dependency/lifecycle rule proposal 与最小 boundary tests。


---

语言读本 / Reading translation: [English](en/URA-003-dependency-lifecycle-failure-boundaries.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.

## 2026-10-07 子项迁出 / Requirement transfer

以下迁出项不再由本书实现或重复验收；本书只消费PCF版本化合同和证据，未列出的原目标、约束与完成门槛继续保留。源文字描述相同概念时仅作领域扩展/消费要求，不构成第二个实现owner。迁出不是完成，也不激活本书。

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-02 | URA-003 — 执行器的启动/退出、依赖失效、隔离、停用和回退边界 | PCF-725 | 全城依赖方向、非执行 App/service 解耦与分类 |

[PCF迁入与完整映射](../personal-compute-fabric/MIGRATION_HISTORY.md)

URA仍定义全城App/service合同与分类；其中执行provider的manifest、lifecycle/failure foundation复用PCF-725，只写App级扩展与映射测试。PCF不反向依赖URA，不能把本系列整体freeze设为PCF前置。
