---
workbook_id: REX-804
phase: RESEARCH_STRENGTHENING
sequence: 804
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-802"]
dependency_source_shas: ["833279cae237080cca88b1b6dbc9f217027ba68f"]
development_baseline_sha: 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
baseline_resolution_evidence: mission-book/reports/REX-804/BASELINE.md
baseline_blocker: null
dependencies: ["REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED"]
development_host: Alien
development_branch: rex/REX-804-Alien-codex-faults
development_head_sha: f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5
development_ci: "37397799729 and 37397794253 COMPLETED SUCCESS at exact head f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5; gateway-web and android SUCCESS; linkage 37397800050 SUCCESS"
development_complete: true
review_host: "Mech"
review_head_sha: "f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-06): the review target is the development head itself, f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5, resolved from refs/heads/rex/REX-804-Alien-codex-faults (remote tip equals that commit, exit 0). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as CONSTRUCTION_RULES section 3 requires. Run independence checks: required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe reachable from the reviewed head (git merge-base --is-ancestor exit 0) and the declared dependency REX-802 833279cae237080cca88b1b6dbc9f217027ba68f reachable (exit 0), both measured rather than assumed. Claim-time exact-head check runs re-read independently from the GitHub API for that SHA: gateway-web success (x2), android success (x2), reciprocal-contract success, all terminal. Review scope to be manufactured per the workbook Review section, including at least one fault probe the author did not use: a fault targeted at a node that becomes ineligible while the fault is active, a second injection attempted while a first is stopped-but-not-yet-expired, normal-mode non-interference, safety bounds and refusal paths observed rather than trusted, and runtime/UI/registry reconciliation. Claim record: mission-book/reports/REX-804/REVIEW_CLAIM_Mech.md. VERDICT PENDING - not yet performed."
review_complete: false
user_exposure_class: ADVANCED_CONTROL
user_exposure_surface: RESEARCH_DANGER_ZONE
user_exposure_nesting: L3_ADVANCED
backend_wiring: "WEB_LOCALLY_VERIFIED; pending independent Review and Android parity"
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-804
terminal_marker: FAULT_INJECTION_RECOVERY_ACCEPTED
---

# REX-804 — Fault Injection + Recovery Probes

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

在安全边界内故意制造：

- worker stop/crash；
- heartbeat loss/stale；
- network disconnect；
- provider unavailable；
- high CPU/RAM pressure（有可靠方法时）；
- delayed result；
- duplicate/reordered event；
- credential/session expiry；
- retry/recovery trigger。

量化 detection / recovery / duplication / intervention。

## 用户暴露

属于 ADVANCED_CONTROL。

必须放 Research → Advanced / Danger Zone，不得进入普通主导航。

要求：

- 明确作用对象；
- 明确影响；
- explicit confirmation；
- bounded duration；
- emergency stop；
- 恢复状态可观察。

## 安全

不得：

- 破坏宿主系统；
- 删除用户数据；
- 关闭不可恢复外部资源；
- 对公共网络做攻击型注入；
- 在没有确认的情况下执行高影响 fault。

## Review

Reviewer 必须独立设计至少一个作者没用过的 fault probe，并验证失败分类和恢复指标。

## 完成门槛

至少 4 类 fault 可控、可停止、可记录、可恢复；产品正常模式无 fault 时不得受影响。
