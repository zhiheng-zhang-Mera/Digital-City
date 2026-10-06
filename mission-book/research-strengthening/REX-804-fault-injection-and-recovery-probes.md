---
workbook_id: REX-804
phase: RESEARCH_STRENGTHENING
sequence: 804
execution_enabled: true
status: "COMPLETE"
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
development_head_sha: fe700aba957990f93b22fd63d594ddfff7b4e243
development_ci: "SUCCESS exact fe700aba957990f93b22fd63d594ddfff7b4e243: push37424946247 / PR37424951038 / linkage37424951044. Local affected19 PASS. Previous075ddc1 push37423677731 SUCCESS but PR37423681875 FAILED on current-main unavailable-store regression; merged b06504f and independently reproduced2 FAIL before directory guard and Web disclosure repair. Historical f4ceae7 clock-fixture failures retained in repair report. Mech subsequently accepted the exact head; marker released without merge authority."
development_complete: true
review_host: "Mech"
review_head_sha: "fe700aba957990f93b22fd63d594ddfff7b4e243"
review_ci: "Mech opposite physical host accepted exact fe700aba957990f93b22fd63d594ddfff7b4e243; B1/B4 closed by independent regression probes. Nine reviewer probes PASS, store-guard2 PASS; push37424946247 / PR37424951038 / linkage37424951044 terminal SUCCESS. FAULT_INJECTION_RECOVERY_ACCEPTED released. Android fault controls and physical/external-provider recovery remain NOT_RUN; DUPLICATE_EVENT recovery structurally NOT_MEASURED. See REVERIFICATION_REPORT.md final second re-verification; original negative verdicts retained in history."
review_complete: true
review_previous_verdict: "NOT_PASSED_RETURNED_FOR_REPAIR"
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
review_status: "ACCEPTED_EXACT_HEAD"
review_report: "mission-book/reports/REX-804/REVERIFICATION_REPORT.md"
review_verdict: "PASSED on fe700aba957990f93b22fd63d594ddfff7b4e243 (Mech, opposite physical host). B1 (an unreadable fault receipt prevented City startup) and B4 (the same store-guard shape in the fault controller's unguarded mkdir, which made the branch unmergeable into current main) are both CLOSED, verified by the reviewer's own regression probes rather than by the author's suite. Marker FAULT_INJECTION_RECOVERY_ACCEPTED RELEASED on this head. Scope, stated not implied: Android native fault controls and physical/external-provider recovery remain NOT_RUN, and DUPLICATE_EVENT recovery stays structurally NOT_MEASURED with the reason on the receipt."
repair_head_sha: fe700aba957990f93b22fd63d594ddfff7b4e243
repair_report_ref: mission-book/reports/REX-804/AUTHOR_REPAIR_Alien.md
review_ci_history: "\"CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-06): the review target is the development head itself, f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5, resolved from refs/heads/rex/REX-804-Alien-codex-faults (remote tip equals that commit, exit 0). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as CONSTRUCTION_RULES section 3 requires. Run independence checks: required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe reachable from the reviewed head (git merge-base --is-ancestor exit 0) and the declared dependency REX-802 833279cae237080cca88b1b6dbc9f217027ba68f reachable (exit 0), both measured rather than assumed. Claim-time exact-head check runs re-read independently from the GitHub API for that SHA: gateway-web success (x2), android success (x2), reciprocal-contract success, all terminal. || VERDICT NOT PASSED on f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5. Nine independent reviewer probes (utopia:tests/rex804-mech-review-probes.test.mjs, branch review/REX-804-mech-review at 737c3e1602b87b18395c69757127a3b500fc54e4) reproduced the author's focused 10 PASS and additionally verified: two concurrent node-scoped faults with no cross-talk, a dead timer on an emergency-stopped fault, timer-driven expiry persisted to disk, a delayed report released by the fault's own expiry and reaching canonical truth, the owner-only boundary against an enrolled member, and restart disabling a live fault. BLOCKING FINDING B1: one unreadable fault receipt prevented the City from starting at all (createGateway threw an untyped SyntaxError), which contradicts the completion gate's requirement that normal mode with no fault active must be unaffected and the pattern already settled by the experiment registry and trace collector, which report broken records instead of failing. B2 (the failed construction leaves the opened SQLite store locked), B3 (a shapeless receipt is adopted under an undefined key and never reported), F1 (DUPLICATE_EVENT has no canonical operation to restore, so its recovery metric is structurally NOT_MEASURED), F2 (the candidate capability record uses status values outside the registry vocabulary and omits GET /api/v0/research/faults/:id) and F3 (PROVIDER_UNAVAILABLE is injected at the claim seam, not at an external provider) are recorded. A MINIMUM REPAIR (guarded receipt reading with a published `broken` list) plus its regression guards is proposed on the review branch and is NOT an accepted head: the terminal marker stays unreleased and re-verification on a repaired head with exact-head CI is required. See REVIEW_REPORT.md.\" || RE-VERIFICATION (Mech, 2026-10-06): B1 CONFIRMED REPAIRED. faults.mjs at f4ceae73 is byte-identical to the reviewer's published repair branch, and the reviewer's nine probes - including P8, the B1 regression guard - pass 9/9 on f4ceae73 and 9/9 on the branch tip 075ddc13. The intermediate CI red at f4ceae73 (push 37422814239 and PR 37422819110 FAILED, 'heartbeat loss refuses only targeted heartbeats...' / Missing expected rejection at 145 ms) is classified as a HOST-SCHEDULING-DEPENDENT TEST, not a product regression: the two commits after the adoption (7af63c2, 075ddc13) change tests and evidence only - git diff services/apps/contracts between f4ceae73 and 075ddc13 is EMPTY - and tests/rex804-faults.test.mjs passes 8/8 five consecutive times on both heads on this host. NEW BLOCKING FINDING B4: the branch is NOT MERGEABLE into current main. The PR run at the tip was red while the push run at the same head was green, because a push tests the branch against its old base and a PR tests the merge with the new main. Reproduced locally on the merge of origin/main b06504f with 075ddc13: tests/rex801-store-guard.test.mjs 1 pass / 1 FAIL with ENOTDIR mkdir <runtime>/research/faults (2/2 on main alone). Root cause: services/dev-gateway/research/faults.mjs:9 called mkdirSync unguarded and the controller is constructed during City startup, so one file where <runtime>/research belongs stops the City starting - the FIFTH instance of the store-guard class and the sharpest, because the READ path in the same file had already been repaired for B1 while the mkdir on the same line was not. VERDICT ON 075ddc13: NOT PASSED for B4. Adoptable minimum repair repair/REX-804-mech-fault-store-guard-on-current-main @ adc075e (the merge result plus guarded construction; measured after it, on the same merge result: tests/rex801-store-guard.test.mjs 2 pass / 0 fail in 91 ms where it was 1/1 and 34 201 ms, and REX-804's own four suites 19 pass / 0 fail). Marker FAULT_INJECTION_RECOVERY_ACCEPTED remains UNRELEASED and review_complete stays false. See REVERIFICATION_REPORT.md."
development_ci_history: "SUCCESS exact fe700aba957990f93b22fd63d594ddfff7b4e243: push37424946247 / PR37424951038 / linkage37424951044. Local affected19 PASS. Previous075ddc1 push37423677731 SUCCESS but PR37423681875 FAILED on current-main unavailable-store regression; merged b06504f and independently reproduced2 FAIL before directory guard and Web disclosure repair. Historical f4ceae7 clock-fixture failures retained in repair report. Mech re-verification pending; terminal marker withheld."
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


---

[English reading translation / 完整英文阅读说明](./en/REX-804-fault-injection-and-recovery-probes.md)
