---
workbook_id: REX-805
phase: RESEARCH_STRENGTHENING
sequence: 805
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-802","REX-803"]
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
dependencies: ["REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED", "REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
research_evidence_applicability: APPLICABLE
research_watchlist_hits: ["RS-G3-EXEC-WORK-ARTIFACT","RS-G3-IDENTITY-PROVENANCE","RS-G3-STRUCTURED-HANDOFF","RS-G3-DYNAMIC-LIVENESS","RS-G4-UNIFIED-CONTROL-PLANE","RS-G3-USER-REACHABLE-TERMINAL"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-805
terminal_marker: TRACE_REPLAY_ABLATION_ACCEPTED
---

# REX-805 — Trace Replay + Ablation Engine

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

允许选择一个已记录 run，重放其输入/场景，并在不篡改原始 trace 的前提下配置消融：

- handoff off；
- retry off；
- backoff off；
- recovery off；
- alternate-device off；
- selected policy off。

## G3/G4 ablation candidates

除已有 handoff/retry/backoff/recovery 外，设计时必须允许未来 bounded ablation / replay 覆盖至少这些机制中的可行子集：

- MissionBook persistent work state on/off or reduced view；
- structured exact-state handoff vs summary-only；
- exact identity/provenance validation on/off；
- dynamic wake/re-scan classification vs naive stop/poll；
- independent review/evidence reconciliation on/off；
- Capability Registry-assisted localization vs repository-only exploration；
- implementation-only terminal vs user-reachable/intent-validated terminal。

这些是 replay capability，不要求 v1 一次实现所有实验；但 schema 不得把它们封死。

## 硬规则

- replay ≠ original run；
- replay 必须新 experiment/run id；
- 不保证外部 provider 完全确定性时必须声明；
- 不能把 unavailable real-world condition 伪装成 deterministic replay；
- ablation 必须记录 exact disabled mechanism。

## 用户入口

Research 页面直接提供 Replay / Ablation，不放普通主导航。

## Review

同一 trace 独立重放；检查结果差异是否来自真实 policy 变化而不是 harness drift。

## 完成门槛

至少一个 multi-device scenario 能完成 original → replay → ablation 的可追溯比较。
