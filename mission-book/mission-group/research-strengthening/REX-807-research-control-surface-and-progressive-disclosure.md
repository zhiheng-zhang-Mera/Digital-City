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
baseline_blocker: null
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED"]
development_host: "Mech"
development_branch: "rex/REX-807-mech-research-control-surface"
development_head_sha: "e07e1cb6ef85dde74babf08c6c1352246f8e799e"
development_ci: "THREE heads, every failure kept with its cause. (1) b06e978fb1c6578305ba485445992d3a1d82913f: run 37546655667 gateway-web failed on ONE pre-existing browser test (tests/rex803-campaign-web.test.mjs) while this commit was purely additive - classified as a load-sensitive flake on five measured grounds and confirmed by the same head re-running green. (2) 05ca33e015387149dded134e493b5bc46a8cea1e: run 37548550930 gateway-web failed TWO ACCEPTED browser tests (CEX790 degraded-store and the REX-801 Web Research flow) and this one WAS my fault - the first wiring of research.js dropped the #research-vocabulary disclosure the suite waits for, moved the storage-unavailable sentence out of #research-list where the suite reads it, and referenced a deleted esc() helper so show() threw 'esc is not defined' and left every control disabled. My own shape test missed it because its stubs defeated the page's identity check. (3) e07e1cb6ef85dde74babf08c6c1352246f8e799e: run 37549643362 completed/success (gateway-web and android green) after restoring the vocabulary disclosure, rendering the storage sentence in BOTH the alert and the list, restoring the escaper, and making the S8 harness faithful (memoised nodes so the render path really runs and its post-conditions are asserted). Local on the final head: rex807 8/8, the accepted rex801 research UI suite 3/3, adjacent web suites green, EIGHT source mutations all caught with byte-identical restoration - including N8, which replays that exact regression."
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

## 2026-10-07 增量 2（页面真正渲染这一层；含一次**我造成的真实回归**）

```text
research.js 重建为用视图模型渲染：顶部可见告警（存储不可用/坏记录/排除项/未测量指标/未结清运行，都带原因）、
直接控制区展开、实验列表以 question 作主标签且标识符仅作属性、Runs/Metrics 用用户语言、Technical details 折叠
并含「未归位字段」清单；页面同时读 registry 与 live run。research-surface.js 新增 `researchMarkup`，
使「形状」可在无浏览器下断言。
第一次接线（05ca33e）打坏了**已被验收**的 REX-801 界面契约（删掉 `#research-vocabulary`、移走 `#research-list` 里的
存储不可用句、并引用了已删除的 `esc()` ⇒ show() 抛错 ⇒ 控件全 disabled），CI 失败两个既有浏览器用例；
**我自己的形状测试没抓住**（stub 每次返回新对象 ⇒ 页面身份检查不过 ⇒ show() 未执行）。
发现方式：本地直接跑被验收的 `tests/rex801-research-ui.test.mjs` + 真实浏览器调试脚本打印 `pageerror: esc is not defined`。
修复：词汇披露归位、存储句两处都写（告警 + 列表）、恢复 esc；**S8 容器改为 memoise 节点**使渲染路径真的执行并可断言
后置条件，新增突变 N8 复现该回归 —— 现在 **8 处突变全部变红**。最终 head e07e1cb：CI run 37549643362 两 job 全绿；
本地 rex807 8/8、rex801 研究界面 3/3、相邻 web 套件绿。
```

## 2026-10-07 增量 1（组件范围：分层视图模型 + 守卫，当时尚未接线）

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
