---
workbook_id: REX-807
phase: RESEARCH_STRENGTHENING
sequence: 807
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-801","REX-806"]
dependency_source_shas: ["7e96a4d28f4cb701d7a0951bace69857c3228f32","12e3d3bf868575a8e3cda983733a3186cb59da27"]
development_baseline_sha: "12e3d3bf868575a8e3cda983733a3186cb59da27"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-07): baseline_anchor_mode is DEPENDENCY_SHA_UNION_AT_CLAIM and the declared sources are REX-801's accepted head 7e96a4d28f4cb701d7a0951bace69857c3228f32 and REX-806's accepted head 12e3d3bf868575a8e3cda983733a3186cb59da27. MEASURED, not assumed: origin/main IS 12e3d3b (the accepted REX-806 repair head was merged into main under the owner gate; runs 37542958872 and 37542958826 both green), and git merge-base --is-ancestor confirms BOTH dependency heads are ancestors of main (7e96a4d2 exit 0, 12e3d3b exit 0), as is the required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe (exit 0). The dependency union is therefore main itself and no union construction was needed - a direct consequence of the REX-806 merge, recorded so the claim does not read as an unverified shortcut. Branch rex/REX-807-mech-research-control-surface starts from that head. Prerequisites re-read before claiming: this workbook's own preflight reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md, the control-surface specification RESEARCH_CONTROL_SURFACE.md and the research evidence protocol. Boundaries unchanged: no purchase, no system service, no running-profile change, no remote execution, and merge_authority false (the REX owner gate grants merging only to qualified tasks and REX-807 is not accepted yet)."
baseline_resolution_evidence: null
baseline_blocker: null
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED"]
development_host: "Mech"
development_branch: "rex/REX-807-mech-research-control-surface"
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
report_path: mission-book/reports/REX-807
terminal_marker: RESEARCH_CONTROL_SURFACE_ACCEPTED
owner_gate_ruling_2026_10_07: "OWNER GATE OPEN for the REX series (owner instruction this session): QUALIFIED sub-tasks may merge, i.e. those whose own review is complete and whose marker is released. merge_authority is set true on REX-801..805 (all accepted and now in main) and stays false on REX-806/807/890 until their reviews complete - acceptance, the opposite-host review and the markers are unchanged, and section 3 still forbids self-review. Recorded by Mech-DS."
---

# REX-807 — Research Control Surface + Progressive Disclosure

> 常驻规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

把 Research Fabric 暴露给 Owner，同时不让普通产品 UI 视觉过载。

遵循 [RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md)。

## 最低入口

一个清晰但次级的：

```text
Research / Experiments
```

入口。

里面分层：

- Experiments；
- Runs；
- Metrics；
- Replay / Ablation；
- Export；
- Advanced Fault Injection；
- Technical Details。

## 必须验证

- 普通 Home / Ask / Devices 不被 research controls 淹没；
- Research 功能不靠 console/API 才能使用；
- high-impact fault controls 不误触；
- raw IDs 默认折叠；
- errors / exclusions / incomplete metrics 对用户可见；
- Web 为完整控制面；Android 至少能观察 run/status/critical attention，完整 authoring parity 可记录 future backlog。

## Review

Formal Reviewer 用普通用户路径寻找隐藏入口、假按钮、过度折叠、信息不足和视觉过载。

## 完成门槛

直接控制、知情、危险操作隔离、技术详情折叠均满足全局 Capability Exposure Gate。


---

[English reading translation / 完整英文阅读说明](en/REX-807-research-control-surface-and-progressive-disclosure.md)
