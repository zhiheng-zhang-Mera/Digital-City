---
workbook_id: REX-803
phase: RESEARCH_STRENGTHENING
sequence: 803
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-801","REX-802"]
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-803
terminal_marker: SCENARIO_REPETITION_ENGINE_ACCEPTED
---

# REX-803 — Controlled Scenario Runner + Repetition Engine

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

支持：

```text
scenario
× N repetitions
→ bounded execution
→ run receipts
→ normalized outcomes
```

## 必须支持

- deterministic seed policy；
- repetitions；
- warmup / measured run distinction；
- timeout；
- stop/cancel；
- per-run exclusion reason；
- topology readiness；
- no-idle long campaign handling；
- resume policy 明确，不默认偷偷续跑。

## 用户入口

DIRECT_CONTROL：

- choose scenario；
- set repetitions；
- start；
- stop；
- inspect progress；
- inspect failed/excluded runs。

## Review

独立检查重复执行、取消、重启、timeout、partial campaign、seed reproducibility。

## 完成门槛

可在 Alien + Mech + Android 基础拓扑运行至少一组 controlled campaign，并留下完整 research trace/material。
