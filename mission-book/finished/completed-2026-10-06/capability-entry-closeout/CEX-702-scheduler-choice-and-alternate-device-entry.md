---
workbook_id: CEX-702
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 702
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["ec12fd0831f31fd81aef9cd9dfb0c959d010f63b"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/CEX-702/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["REMOTE_HANDOFF_CLOSEOUT_REPAIRED"]
development_host: Alien-codex
development_branch: cex/CEX-702-Alien-codex-alternate-device
development_head_sha: "3d233ff39d1e96b8a590b12f520f98c283356f25"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37213802935"
development_complete: true
review_host: "Mech"
review_head_sha: "3d233ff39d1e96b8a590b12f520f98c283356f25"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, 3d233ff39d1e96b8a590b12f520f98c283356f25, resolved from refs/heads/cex/CEX-702-Alien-codex-alternate-device (remote tip equals that commit). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. DEPENDENCY, verified rather than assumed: this workbook declares the dependency REMOTE_HANDOFF_CLOSEOUT_REPAIRED and required_ancestor_shas [ec12fd0831f31fd81aef9cd9dfb0c959d010f63b]; the reviewer confirmed UXI-391, the remote handoff closeout, is COMPLETE with review_host Mech and review_complete true, and that ec12fd0831f31fd81aef9cd9dfb0c959d010f63b is reachable from the reviewed head (git merge-base --is-ancestor exit 0). Claim-time exact-head CI measured before any verdict: V0.2 checks push run 37213802935 completed/success on the reviewed head; PR pull run 37213840569 completed/success on the same head; City linkage check run 37213840571 completed/success (reciprocal-contract). || VERDICT PASS on the reviewed head. Exact-head CI re-measured by the reviewer: V0.2 checks push run 37213802935 completed/success on 3d233ff39d1e96b8a590b12f520f98c283356f25 (jobs android success, gateway-web success); PR19 pull run 37213840569 completed/success on the same head; City linkage check run 37213840571 completed/success (reciprocal-contract). Reviewer instruments: ten independent probes written for this review (utopia tests/cex702-mech-review-probes.test.mjs, branch review/CEX-702-mech-review at ad835f2) 10/10 pass, covering every proof the workbook Formal Review section names - choose provider, decline switch to alternate device, strict target refusal, no alternate available, stale and offline candidate, duplicate click, handoff result returning to the original surface, and Web/Android state agreement - with two probes driving a real browser and one capturing the exact request body the page sends. Author suite rerun unmodified 4/4. Android executed here: :app:testDebugUnitTest 82/82 across 15 suites (SchedulerChoiceTest 2/2). No pre-existing test file is touched, so there is no relaxed assertion needing compensation. Findings, none blocking: F1 LOW paper material (the workbook mandatory handoff latency is recorded in the development receipt as NOT_OBSERVABLE although the authors own controlled browser fixture could measure it; this review measures it instead - 12 ms HTTP decline, 13 ms click to handoff, 598 ms click to result, and 4 ms canonical decline to handoff derived only from the City own event timestamps, scoped to one physical Windows host and not a performance claim), F2 INFORMATIONAL (the UXI-391 comment in presentation.mjs still argues that this City keeps no per-node disable state and that the field would have to be read only should the City gain that ability, directly above the line that now reads sharingEnabled - the code is right and the argument above it is obsolete), F3 INFORMATIONAL (the Web falls back to the candidate ref for an unresolved service while Android falls back to the literal word Service, so the two surfaces would name it differently if the ref ever failed to resolve), F4 INFORMATIONAL (the Android in-flight guard is cleared only inside a fenced callback, so a request in flight when the client closes can leave the control disabled; a reading of the control flow, not reproduced). Reconciled: the presentation now reads the canonical sharing flag and the executable claim path already enforced it, so the presentational versus executable divergence the workbook asks to be recorded is CLOSED in both directions and measured. Five of the worksheets template fields were absent and are backfilled by this review; research_watchlist_hits names the five watchlist ids the authors own category prose maps to unambiguously (RS-G3-IDENTITY-PROVENANCE, RS-G3-INDEPENDENT-REVIEW-BOUNDARY, RS-G3-REGISTRY-ONBOARDING, RS-G4-CAPABILITY-STATE, RS-G4-REALITY-DRIFT) and deliberately omits the ambiguous G2 ordinary bugfix entry rather than invent an id. Android online interaction, physical pairing, distributed execution and cross-region relay remain NOT_RUN; intent validation remains NOT_TESTED. Terminal marker ALTERNATE_DEVICE_USER_CHOICE_EXPOSED released by this review. See reports/CEX-702/REVIEW_REPORT.md."
review_complete: true
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-702
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: SCHEDULER_TASK_CHOICE
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: VERIFIED
ui_exemption_reason: null
capability_ids: ["CAP-SCHEDULER-CHOICE-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-SCHEDULER-CHOICE-001.yaml"]
capability_registry_sync_status: RECONCILED
research_watchlist_hits: ["RS-G3-IDENTITY-PROVENANCE","RS-G3-INDEPENDENT-REVIEW-BOUNDARY","RS-G3-REGISTRY-ONBOARDING","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
monitor_observability_evidence: NOT_APPLICABLE
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
terminal_marker: ALTERNATE_DEVICE_USER_CHOICE_EXPOSED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-702/PAPER_MATERIAL_INDEX.md"]
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/CEX-702/CLAIM_RECORD.md"]
merged_main_sha: "e111eb2787e7464385b4b59e62e954ac1f5f678e"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "integrated in the JOIN-590 closeout integration"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
---

# CEX-702 — Scheduler 用户选择：拒绝切服务 → 改用另一设备

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](PAPER_EVIDENCE_PROTOCOL.md)

## 目标

把后端已经存在的：

```text
POST /api/v0/tasks/:id/switch-declined
→ userDeclinedSwitch
→ RS-202 ALTERNATE_DEVICE
→ handoff
```

变成用户真正可见、可理解、可点击的决策。

## 用户语义

当 scheduler 确实处于 service/provider switch decision 时，UI 应能表达：

```text
[ Use another service/provider ]
[ Keep this service and try another device ]
[ Keep waiting ]
[ Cancel ]
```

不得把 `switch-declined` 偷换成 generic `CONFIRM`。

## 必须实现

### Web

- 有明确 alternate-device action；
- action 调用现有 `switch-declined`；
- subsequent state 能展示 REMOTE_HANDOFF；
- strict-target task 不提供语义冲突的“改用另一设备”按钮；
- provider choice / alternate device / keep waiting 区分清楚。

### Android

- 与 Web 使用同一 scheduler truth；
- expose equivalent user decision；
- 不由 Android 本地重新算 routing。

## Generic CONFIRM

当前 `CONFIRM` 继续保持 honest-unwired，除非施工期间发现已有 canonical backend route 且经 Formal Review 证明语义完全一致。

不得为了消除 disabled button 伪造 route。

## Formal Review

独立证明：

- choose provider 路；
- decline switch → alternate device 路；
- strict target refusal；
- no alternate available；
- stale/offline candidate；
- duplicate click；
- handoff result returns to original surface；
- Web/Android state一致。

## 论文素材强制点

记录：

- 为什么 backend path 存在但 UI 没入口；
- presentation contract 与 executable route 的差异；
- user decision taxonomy；
- route conflict / strict-target conflict；
- handoff latency；
- before/after user steps；
- Review 发现的错误映射；
- test/CI/runtime failure。

## 完成门槛

- alternate-device decision 可从正常 UI 发出；
- backend canonical truth 记录该决定；
- Web + Android 都能看到后续 handoff；
- generic CONFIRM 不被误接线；
- opposite-host Review + exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `ALTERNATE_DEVICE_USER_CHOICE_EXPOSED`。

## 复核结论（Mech，对侧物理主机）

Formal Review PASS，详见 `mission-book/reports/CEX-702/REVIEW_REPORT.md`。十项独立探针覆盖本工作书 Formal Review
章节要求的全部证明：选择 provider、拒绝切换并改用另一设备、strict target 拒绝、无可用替代设备、过期/离线候选、
重复点击、handoff 结果回到原界面、Web/Android 状态一致；其中两项驱动真实浏览器，一项捕获页面实际发出的请求体。
作者测试套件未经修改地重跑。一项 LOW 与四项 informational，均不阻塞。F1（LOW，论文素材）任务书强制要求的 handoff
延迟在开发收据中被记为 NOT_OBSERVABLE，而作者自有受控浏览器夹具本可测量，本次复核代为测量：HTTP 拒绝 12ms、
点击→handoff 13ms、点击→结果 598ms，以及仅由城市自身事件时间戳推导的 canonical decline→handoff 4ms，范围限定为单台
物理 Windows 主机的受控夹具、非性能声明。F2（informational）`presentation.mjs` 中 UXI-391 注释仍主张"本城市没有
按节点的禁用状态、日后具备时才需读取该字段"，而紧邻其下的代码已在读 `sharingEnabled`——代码正确、其上论证已过时。
F3（informational）未解析服务时 Web 回退到候选 ref，Android 回退到字面词 `Service`，两界面命名会不一致。
F4（informational）Android 的 in-flight 保护只在围栏回调内清除，客户端关闭时可导致控件永久禁用（仅代码走读，
未复现）。F5（LOW，控制面）工作书本有十六项模板字段缺失，含全部暴露字段与全部 capability 字段，而
`CAP-SCHEDULER-CHOICE-001` 已存在，已由本次复核依该记录回填；作者材料仅以散文列出观察清单类别而无 `RS-` id，
其中五项可无歧义映射并已记录，G2 "ordinary bugfix" 一项无法唯一映射，故明确留空而不臆造 id。本次改动把呈现与
可执行真值对齐：`candidateFromNode` 现读 canonical 共享标志，而领取路径本已据此拒绝，故工作书要求记录的
"呈现契约与可执行路由差异"已在两个方向上都关闭并被测量。



---

[English reading translation / 完整英文阅读说明](en/CEX-702-scheduler-choice-and-alternate-device-entry.md)
