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
development_head_sha: "b06e978fb1c6578305ba485445992d3a1d82913f"
development_ci: "HEAD b06e978fb1c6578305ba485445992d3a1d82913f: V0.2 checks run 37546655667 completed/FAILURE on the first attempt - gateway-web failed on exactly one test and it was NOT this increment's: tests/rex803-campaign-web.test.mjs 'REX803 web: the owner runs a real campaign and every repetition without a measurement shows its reason' (16.8s). Classification, with the evidence rather than an assumption: this commit is purely additive (git show --stat = two new files, +292 lines, no existing file modified); the failing name belongs to a pre-existing browser-driven suite; the SAME head re-ran green on both jobs; that suite passes standalone locally 2/2 twice; and the same test name failed earlier in this session inside a local full-suite parallel run at 38s, so its load sensitivity predates and is independent of this run. Recorded as a load-sensitive web-suite flake and kept as red-then-green rather than written up as a pass. Local evidence on this head: tests/rex807-surface.test.mjs 7/7; adjacent web suites (terminal shell 15, i18n, scheduler adapter) green; seven source mutations each turn the REX-807 suite red with byte-identical restoration."
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

## 2026-10-07 增量 1（组件范围：分层视图模型 + 守卫，**尚未接线**）

```text
现状实测（baseline 12e3d3b）：apps/web/research.js 是扁平技术面板（manifest JSON textarea + 仅验证/登记 +
原样 JSON 打印）—— 能用，但要读标识符与完整配置；没有分层、没有用户语言摘要、raw id 直接进主标签。
增量 1 交付 apps/web/research-surface.js（**纯视图模型**）把四个暴露等级变成**数据**：
  DIRECT_CONTROL（创建/开始/停止/重放/导出，默认展开）· ADVANCED_CONTROL（故障注入在折叠的危险区且**必须确认**，
  确认语要求输入 campaign id）· OBSERVABLE（运行/进度/指标/排除项，用户语言）· INTERNAL_ONLY（不进 UI）。
两条规则写进模型而不是指望渲染层：**重要的不许藏**（存储不可用/坏记录/排除项/未测量指标/未结清运行都成为
visible alert 并带原因）；**标识符折叠但不删除**（完整 manifest/运行记录进 collapsed 技术层；本视图未归位的
payload 字段列为 unmapped 并写明，网关新增字段因此可见而不是消失）。
测试 tests/rex807-surface.test.mjs 7 项，逐条对应工作书「必须验证」；**7 处源码突变全部被抓住**并按字节还原。
未完成：**尚未接线**（research.js 仍渲染旧面板）、Advanced/Technical 交互细节、Android 观察面。
详细记录见 reports/REX-807/DEVELOPMENT_REPORT.md。
```


---

[English reading translation / 完整英文阅读说明](en/REX-807-research-control-surface-and-progressive-disclosure.md)
