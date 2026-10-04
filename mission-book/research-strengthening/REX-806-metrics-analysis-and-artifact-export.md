---
workbook_id: REX-806
phase: RESEARCH_STRENGTHENING
sequence: 806
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
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
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-806
terminal_marker: RESEARCH_ARTIFACT_EXPORT_ACCEPTED
---

# REX-806 — Metrics Analysis + Research Artifact Export

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
- convergence / missing event（可测时）。

不支持的指标标 NOT_MEASURED。

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
