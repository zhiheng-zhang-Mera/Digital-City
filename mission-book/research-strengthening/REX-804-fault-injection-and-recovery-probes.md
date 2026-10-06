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
development_head_sha: f4ceae734d1d32a7d8950cd5872264135e6073ac
development_ci: Repair source19a420c independently adopted; focused12 PASS; new exact f4ceae7 hosted CI PENDING. Original review verdict on f76ccf5 retained; new target requires Mech re-verification.
development_complete: false
review_host: "Mech"
review_head_sha: "f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-06): the review target is the development head itself, f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5, resolved from refs/heads/rex/REX-804-Alien-codex-faults (remote tip equals that commit, exit 0). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as CONSTRUCTION_RULES section 3 requires. Run independence checks: required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe reachable from the reviewed head (git merge-base --is-ancestor exit 0) and the declared dependency REX-802 833279cae237080cca88b1b6dbc9f217027ba68f reachable (exit 0), both measured rather than assumed. Claim-time exact-head check runs re-read independently from the GitHub API for that SHA: gateway-web success (x2), android success (x2), reciprocal-contract success, all terminal. || VERDICT NOT PASSED on f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5. Nine independent reviewer probes (utopia:tests/rex804-mech-review-probes.test.mjs, branch review/REX-804-mech-review at 737c3e1602b87b18395c69757127a3b500fc54e4) reproduced the author's focused 10 PASS and additionally verified: two concurrent node-scoped faults with no cross-talk, a dead timer on an emergency-stopped fault, timer-driven expiry persisted to disk, a delayed report released by the fault's own expiry and reaching canonical truth, the owner-only boundary against an enrolled member, and restart disabling a live fault. BLOCKING FINDING B1: one unreadable fault receipt prevented the City from starting at all (createGateway threw an untyped SyntaxError), which contradicts the completion gate's requirement that normal mode with no fault active must be unaffected and the pattern already settled by the experiment registry and trace collector, which report broken records instead of failing. B2 (the failed construction leaves the opened SQLite store locked), B3 (a shapeless receipt is adopted under an undefined key and never reported), F1 (DUPLICATE_EVENT has no canonical operation to restore, so its recovery metric is structurally NOT_MEASURED), F2 (the candidate capability record uses status values outside the registry vocabulary and omits GET /api/v0/research/faults/:id) and F3 (PROVIDER_UNAVAILABLE is injected at the claim seam, not at an external provider) are recorded. A MINIMUM REPAIR (guarded receipt reading with a published `broken` list) plus its regression guards is proposed on the review branch and is NOT an accepted head: the terminal marker stays unreleased and re-verification on a repaired head with exact-head CI is required. See REVIEW_REPORT.md."
review_complete: false
review_verdict: "NOT_PASSED_RETURNED_FOR_REPAIR"
review_report_ref: "mission-book/reports/REX-804/REVIEW_REPORT.md"
review_repair_proposal_ref: "utopia:review/REX-804-mech-review@737c3e1602b87b18395c69757127a3b500fc54e4 (reviewer probes + repair, CI 37399882138 SUCCESS); utopia:repair/REX-804-mech-minimal@19a420c6725532eabb9bf4cb0b06add180f6ce4e (the same repair alone, parented on the reviewed head so the author can fast-forward; CI 37402198156 SUCCESS). Both are PROPOSALS: neither is an accepted head, and the terminal marker stays unreleased until a repaired head passes re-review."
user_exposure_class: ADVANCED_CONTROL
user_exposure_surface: RESEARCH_DANGER_ZONE
user_exposure_nesting: L3_ADVANCED
backend_wiring: "WEB_LOCALLY_VERIFIED; pending independent Review and Android parity"
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-804
terminal_marker: FAULT_INJECTION_RECOVERY_ACCEPTED
repair_head_sha: f4ceae734d1d32a7d8950cd5872264135e6073ac
repair_report_ref: mission-book/reports/REX-804/AUTHOR_REPAIR_Alien.md
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
