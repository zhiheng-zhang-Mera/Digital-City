---
workbook_id: CHK-101
phase: CITY_SELF_HEALTH_CHECK
sequence: 101
execution_enabled: true
status: NOT_STARTED
activation_state: OWNER_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/Alien-GPT-CHK"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
anchor_state: UNCLAIMED_RESOLVE_EXACT_SHA_AT_CLAIM
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
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: NONE_INTERNAL
backend_wiring: NOT_APPLICABLE_INTERNAL
ui_exemption_reason: "Internal bounded health checks; activation does not authorize UI changes or automatic repairs."
capability_ids: []
capability_registry_action: NOT_APPLICABLE
capability_registry_refs: []
capability_registry_sync_status: NOT_APPLICABLE
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
---

> **OWNER ACTIVATED / EXECUTION ENABLED.** 首次运行采用 bounded dry-run/read-only；依赖、正式复检与安全晋升门槛继续生效，不授权自动修复或自我修改。

# CHK-101 — Small Operational Reconciliation / 小体检

## 目标

用低成本方式发现“最近施工后刚产生的漂移”，避免把小问题积成大范围 control-plane drift。

## 检查面

### 1. Capability Registry

- 新/改 capability 是否登记；
- CAP record 路径/symbol/API 是否仍存在；
- exact verified SHA 是否过期或指错；
- implementation / wiring / reachability / intent 四层是否诚实；
- surface 路径是否仍可发现；
- INTERNAL_ONLY 是否仍合理。

### 2. Mission Book

对账：

```text
workbook frontmatter
↔ generated README
↔ MISSION_PROGRESS.json
↔ dependency state
↔ finished archive
```

检查 duplicate ID、错误 active/parked 状态、完成未归档、依赖未解锁等。

### 3. Identity / Evidence

检查：

- development/review/CI/evidence SHA 一致性；
- dependency accepted SHA ancestry；
- stale mutable ref；
- EVIDENCE_POINTER_MISMATCH；
- STALE_EXECUTION_IDENTITY；
- BASELINE_ANCESTRY_MISMATCH。

### 4. Sentinel runtime flows

只跑少量高价值路径，例如：

```text
start City
→ create task
→ route/select target
→ receive canonical state
→ complete/fail
→ UI reconciliation
```

不默认跑全套重型 E2E。

### 5. UI / Exposure

抓新增 regression：

- false affordance；
- hidden important state；
- broken entry；
- backend disconnected；
- Web/Android parity regression；
- refusal/error display mismatch。

### 6. Open findings / debt

将 Review finding 至少归为：

`OPEN / ACKNOWLEDGED_DEBT / DEFERRED_BY_DESIGN / SUPERSEDED / RESOLVED`。

### 7. Research/evolution evidence防漏

只判断最近是否出现值得保存的 G3/G4 episode、Owner intervention、reality drift、semantic integration conflict；不在小体检里开研究工程。

## 输出

```text
HEALTHY
DRIFT_FOUND
REQUIRES_RECONCILIATION
FOLLOWUP_WORKBOOK_CANDIDATE
OBSERVE_MORE
```

每个 finding 必须有 owner surface、severity、evidence pointer、recommended destination。

## 禁止

- 体检中顺手修所有问题；
- 因文档不整齐就开大重构；
- 把 transient runtime noise 直接变成永久规则。

## 完成门槛

形成 bounded health report；若需维修，只创建/建议后续正式工作项，不在本任务扩边施工。


---

语言读本 / Reading translation: [English](en/CHK-101-small-operational-reconciliation.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
