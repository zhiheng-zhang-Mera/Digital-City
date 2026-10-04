---
workbook_id: REX-806
phase: RESEARCH_STRENGTHENING
sequence: 806
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-803","REX-804","REX-805"]
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
dependencies: ["REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED", "REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED", "REX-805:TRACE_REPLAY_ABLATION_ACCEPTED"]
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
research_watchlist_hits: ["RS-G3-OWNER-INTERVENTION-TAXONOMY","RS-G3-SUPERVISION-ATTENTION","RS-G3-RULE-LIFECYCLE-DEBT","RS-G3-SEMANTIC-INTEGRATION","RS-G3-PASSIVE-EVIDENCE-PIPELINE","RS-G4-AUTONOMY-SURVIVAL","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-806
terminal_marker: RESEARCH_ARTIFACT_EXPORT_ACCEPTED
---

# REX-806 — Metrics Analysis + Research Artifact Export

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

将实验导出为可检查的：

```text
artifact/
├─ manifest
├─ environment
├─ topology
├─ raw pointers
├─ normalized dataset
├─ metrics.csv
├─ failures
├─ exclusions
├─ tables
├─ reproduction
└─ checksums
```

## Metrics

至少支持来自前序真实数据的：

- completion time；
- recovery time；
- handoff time；
- failure rate；
- intervention count；
- retry count；
- duplicate execution；
- convergence / missing event（可测时）；
- task transitions before Owner intervention；
- time / steps to first Owner intervention；
- intervention-free survival（可构造时）；
- intervention cause taxonomy；
- task-pool drain before intervention；
- control-plane reality mismatch count / reconciliation time；
- implementation→wiring→reachability→intent transition timestamps；
- Exposure Lag / Intent Lag（可测时）；
- registry-assisted localization/onboarding cost（实验提供时）；
- high-value Owner decision count；
- avoidable technical escalation count；
- repeat clarification count；
- escalation → autonomy-resumed time；
- batchable escalation count / interruption burst（可测时）；
- rule activation / conflict / false-block / retirement observations；
- textually-clean semantic integration failure count；
- independently-green components → integrated semantic failure count。

不支持的指标标 NOT_MEASURED。

### Metric interpretation guard

- `owner_intervention_count = 0` 只有明确观察到完整窗口且确实无人介入时才允许；未知必须 NOT_MEASURED；
- “运行了更久”不等于更自治，idle loop / duplicate work / blocked polling 要单独分类；
- survival curve 若样本不足，只导出原始 censored episode 数据，不强行画结论；
- G1/G2 metric 默认 supporting；G3/G4 metric 优先进入 paper-ready tables。

## 导出

DIRECT_CONTROL：

- preview dataset；
- export artifact；
- export CSV/table-ready data；
- reproduction instructions。

不得自动生成夸大结论；统计结果与论文 narrative 分离。

## Review

Reviewer 从导出包独立重算至少一组指标，并核对 checksum/provenance。

## 完成门槛

可从一组真实 campaign 生成完整 artifact，并由另一实体主机独立读取/重算。
