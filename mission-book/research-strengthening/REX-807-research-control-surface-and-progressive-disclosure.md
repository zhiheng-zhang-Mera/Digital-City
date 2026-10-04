---
workbook_id: REX-807
phase: RESEARCH_STRENGTHENING
sequence: 807
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED"]
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
report_path: mission-book/reports/REX-807
terminal_marker: RESEARCH_CONTROL_SURFACE_ACCEPTED
---

# REX-807 — Research Control Surface + Progressive Disclosure

## 目标

把 Research Fabric 暴露给 Owner，同时不让普通产品 UI 视觉过载。

遵循 [RESEARCH_CONTROL_SURFACE.md](./RESEARCH_CONTROL_SURFACE.md)。

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
