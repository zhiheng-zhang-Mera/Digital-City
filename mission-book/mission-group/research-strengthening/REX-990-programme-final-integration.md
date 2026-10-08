---
workbook_id: REX-990
phase: RESEARCH_PROGRAMME_FINAL_INTEGRATION
sequence: 990
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main", "refs/heads/feat/city-owner-remote-operation"]
required_ancestor_shas: ["db6b6f9dbba1266d6783774d659d4eef912929ff", "0e63c2a0ca723f7d8d0b6ad41abff33bee2ea744", "4cd4d09988ae7a3f4a425854db07a4131e5921d5"]
dependency_source_workbooks: ["REX-801", "REX-802", "REX-803", "REX-804", "REX-805", "REX-806", "REX-807", "REX-890"]
dependency_source_shas: ["7e96a4d28f4cb701d7a0951bace69857c3228f32", "833279cae237080cca88b1b6dbc9f217027ba68f", "8798ba9dd37051626033ad72080b2fad3ff66149", "fe700aba957990f93b22fd63d594ddfff7b4e243", "0261a9ed1cec88df3ab4675623d422b37b33f270", "12e3d3bf868575a8e3cda983733a3186cb59da27", "17271f04829877ee56668221afeda5fbd35f66e8", "0e63c2a0ca723f7d8d0b6ad41abff33bee2ea744"]
development_baseline_sha: "1b09a9d9de5cc655ea122c50d4308135b03936fb"
baseline_resolution_evidence: "Owner authorized programme final work after the REX-890 terminal marker was released. Fetched main db6b6f9 and feature 0e63c2a; created isolated branch from main, merged the exact feature without conflicts at 1b09a9d9. Feature already contains the accepted four-series integration head 4cd4d099. Dependency smoke was executed as the combined intent/operation/job/UXI regression (36/36) and existing operation/job/rebuild browser regression (11/11); detailed red/green logs retained. Planning commit predates the product implementation. Full ancestor union is verified before closeout."
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED", "REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED", "REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED", "REX-805:TRACE_REPLAY_ABLATION_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED", "REX-807:RESEARCH_CONTROL_SURFACE_ACCEPTED", "REX-890:RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE"]
development_host: "Alien-GPT / Mera-Alianware"
development_branch: "feat/rex-programme-final-android-intent-20261008"
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: "WEB_ADVANCED + ANDROID_ADVANCED + ASK_DO + CLI"
user_exposure_nesting: L4_TECHNICAL
backend_wiring: UNASSESSED
ui_exemption_reason: null
capability_ids: ["CAP-CITY-REMOTE-OPERATION-001", "CAP-CITY-AGENT-JOB-001"]
capability_registry_action: UPDATE_EXISTING
capability_registry_sync_status: PENDING_REVIEW
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: NOT_OBSERVABLE
research_evidence_refs: ["mission-book/reports/REX-990/PAPER_MATERIAL_INDEX.md"]
owner_gate: NONE
owner_merge_authorization: "Owner explicitly requested Android, natural-language entry and programme integration on a new cloud branch, and merge to main after functional/user-operation verification. Owner then approved the written design: 按方案直接执行，不再分阶段确认. No additional staged design, plan, or merge permission is requested; verification requirements remain."
merge_authority: false
report_path: mission-book/reports/REX-990
terminal_marker: RESEARCH_PROGRAMME_FINAL_INTEGRATED
terminal_marker_released: false
---

# REX-990 — Android、自然语言入口与 programme final integration

[常驻规则](../../CONSTRUCTION_RULES.md) · [英文读本](en/REX-990-programme-final-integration.md)

在新云端分支补齐两条 Owner 能力的 Android 原生入口与中英文 Ask/Do 草稿流程，完成 REX programme 集成、实体操作验证、exact-head hosted CI 与独立技术复核，再按本次 Owner 授权合并 main。既有 REX-890 的批准范围和历史失败保持原样。

验收逐项对应 Utopia `docs/superpowers/specs/2026-10-08-rex-programme-final-design.md` 与 `docs/superpowers/plans/2026-10-08-rex-programme-final.md`：默认关闭与真实成员拒绝、必填参数、严格设备目标、编辑/断线后重新确认、幂等、真实进度/输出/失败、停止、Agent claim/report/collection 权限语义、手机用户操作、既有四系列回归和合并后验证。未观测的主机或运行结果不得填写 PASS。

Development、实体验证和独立复核尚在执行，当前不释放终标。
