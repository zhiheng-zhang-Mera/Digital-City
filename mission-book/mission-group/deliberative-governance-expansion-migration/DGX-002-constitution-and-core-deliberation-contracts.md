---
workbook_id: DGX-002
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
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
dependencies: ["DGX-001"]
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

# DGX-002 — Constitution + Decomposition / Core Deliberation Contracts

## 目标

建立跨域制度合同与复杂请求拆分合同，而不是万能专业 Reviewer 或第二套 scheduler。

## 最低 Constitution

- evidence > vote；
- author/executor cannot arbitrate own dispute；
- critical/major unresolved objection blocks release；
- no silent uncertainty suppression；
- minority dissent retained；
- reputation affects assignment, not truth；
- no agent self-expands authority；
- high-impact/owner-only boundary remains Owner-controlled；
- decomposition must preserve original Owner intent and explicit constraints；
- no hidden chain-of-thought exchange or persistence requirement。

## 核心数据对象

`DeliberationCase / SharedFactSnapshot / ProblemGraph / ProblemNode / TaskCapsule / Participant / Claim / EvidenceRef / ResultEnvelope / Objection / Defence / Adjudication / Appeal / Dissent / ReleaseVerdict`。

### SharedFactSnapshot

至少记录：

```text
request_ref
accepted_requirements
canonical_state_refs
evidence_refs
domain_constraints
known_unknowns
snapshot_version
```

### ProblemGraph

最低支持：

```text
node_id
question_or_verification
dependencies
required_capabilities
independence_floor
input_refs
expected_output_contract
stop_condition
status_projection
```

ProblemGraph 可以是 DAG；发现新事实后允许受控增补节点，但必须保留 provenance。它是 deliberation plan，不是 Mission Book/task runtime 的新权威。

### TaskCapsule / ResultEnvelope

TaskCapsule 向参与者提供最小必要上下文；ResultEnvelope 返回：

```text
explicit_result
assumptions
evidence_refs
uncertainty
unresolved_questions
proposed_next_action
```

不得要求或保存参与者隐藏 chain-of-thought 作为互操作协议。

## 禁止

- 新建第二套 task truth / scheduler / device identity；
- ProblemGraph 状态覆盖 canonical runtime state；
- 捕获隐藏 chain-of-thought；
- 把 JEV/Monitor 放到所有执行的同步 critical path；
- 让 Governance 自己实现 Engineering/Medical/Research 专业算法；
- 通过“分解得更细”绕过 Owner-only gate。

## 完成门槛

版本化 Constitution + decomposition contract + ProblemGraph/TaskCapsule/ResultEnvelope schema + invariant tests + authority boundary + failure semantics。

语言配对 / Language pair: [English reading](en/DGX-002-constitution-and-core-deliberation-contracts.md)
