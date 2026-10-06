---
workbook_id: REX-890
phase: RESEARCH_STRENGTHENING
sequence: 890
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-801","REX-802","REX-803","REX-804","REX-805","REX-806","REX-807"]
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED", "REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED", "REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED", "REX-805:TRACE_REPLAY_ABLATION_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED", "REX-807:RESEARCH_CONTROL_SURFACE_ACCEPTED"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L4_TECHNICAL
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-890
terminal_marker: RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE
---

# REX-890 — Independent Reproducibility Study + V1 Freeze

> 常驻规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

Development host 先用 Research Fabric 运行一个代表性 multi-device study。

另一实体主机不能只读报告，必须：

1. 从 artifact / manifest 重建；
2. 独立执行；
3. 重算关键 metrics；
4. 对比 trace/provenance；
5. 指出不一致；
6. 修复后再复现。

## 最低 study

至少包含：

- multi-device execution；
- one handoff or routing decision；
- one injected fault；
- recovery；
- repetitions；
- one replay；
- one ablation；
- artifact export。

## 最终素材

必须生成：

`mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md`

并总结：

- experiment count；
- run count；
- failure/exclusion count；
- defect taxonomy；
- Review-only findings；
- reproducibility delta；
- measured metrics；
- unresolved limitations；
- potential paper directions。

## Final gate

只有 opposite-host 独立 reproduction 成功、exact-head CI green、用户 exposure gate PASS，才能记录：

`RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`

随后才允许创建 programme final integration workbook。


---

[English reading translation / 完整英文阅读说明](en/REX-890-reproducibility-study-and-freeze.md)
