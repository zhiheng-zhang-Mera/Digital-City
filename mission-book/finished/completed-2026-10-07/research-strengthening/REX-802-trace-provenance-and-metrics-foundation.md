---
workbook_id: REX-802
phase: RESEARCH_STRENGTHENING
sequence: 802
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/REX-802/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: []
development_host: Alien-codex
development_branch: rex/REX-802-Alien-codex-trace-foundation
development_head_sha: "833279cae237080cca88b1b6dbc9f217027ba68f"
development_ci: "V0.2 checks run 37211053490 COMPLETED SUCCESS on exact 833279cae237080cca88b1b6dbc9f217027ba68f; gateway-web and android success"
development_complete: true
review_host: "Mech"
review_head_sha: "833279cae237080cca88b1b6dbc9f217027ba68f"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, 833279cae237080cca88b1b6dbc9f217027ba68f, resolved from refs/heads/rex/REX-802-Alien-codex-trace-foundation (remote tip equals that commit). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. The workbook declares no dependencies and no dependency_source_workbooks, so no dependency union needs re-verifying, but it does declare required_ancestor_shas [69a097b5394a9fece39dd11cc13f04c9b4d28bfe]; the reviewer verified that ancestor is reachable from the reviewed head (git merge-base --is-ancestor exit 0) rather than assuming it. Claim-time exact-head CI, re-measured by the reviewer before any verdict: V0.2 checks push run 37211053490 completed/success on the reviewed head (jobs android success, gateway-web success); PR17 pull run 37211470934 completed/success; City linkage check pull run 37211470918 completed/success (reciprocal-contract pass). Review scope to be independently manufactured per the workbook Review section: missing, duplicate and out-of-order events, a stale clock, restart, a partial trace and collector failure, plus proof that collector failure does not drag down Utopia product operation. || VERDICT PASS on the reviewed head. Exact-head CI re-measured by the reviewer: V0.2 checks push run 37211053490 completed/success on 833279cae237080cca88b1b6dbc9f217027ba68f (jobs android success, gateway-web success); PR17 pull run 37211470934 completed/success on the same head; City linkage check run 37211470918 completed/success (reciprocal-contract). Reviewer instruments: eleven independent probes written for this review (utopia tests/rex802-mech-review-probes.test.mjs 8/8 and tests/rex802-mech-review-web.test.mjs 3/3, branch review/REX-802-mech-review at f94967e) which MANUFACTURE the seven conditions this workbook demands - missing, duplicate and out-of-order events, a stale clock, restart, partial trace and collector failure - plus a storage whose load and append never settle, proving the collector cannot slow or block real City work. Author suite rerun unmodified 12/12 + 6/6. Android executed here: :app:testDebugUnitTest 83/83 on 15 suites and :app:assembleDebug SUCCESS (app-debug.apk 10500445 bytes; the byte count matches the author receipt but the SHA-256 does not, and no hermetic-build claim is made). Repo gates executed here: check-bilingual SYNCHRONIZED and browser-relay 18/18. Four findings recorded, none blocking: F1 LOW (completeness is a constant PARTIAL for every recording the Gateway can produce while a bare empty collector reads COMPLETE, so the field is inverted relative to usefulness and its reason is only legible inside folded raw JSON), F2 LOW (after a restart the snapshot run id over-claims a window that still holds the previous epoch run id), F3 LOW control plane (eight template fields were absent, including all four capability fields, while CAP-RESEARCH-TRACE-001 already existed; backfilled from the verified record by this review), F4 LOW test fidelity (the Android unit tests substitute org.json:json for android.jar, whose optString null semantics differ from the device, so the load-bearing 'null' guards are correct but uncovered). Failure classification is stated in section 5 of the report, including three environmental and two flake failures that also occur at the baseline or in isolation. Terminal marker RESEARCH_TRACE_FOUNDATION_ACCEPTED released by this review. See reports/REX-802/REVIEW_REPORT.md."
review_complete: true
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/REX-802/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: ["RS-G3-IDENTITY-PROVENANCE","RS-G3-DYNAMIC-LIVENESS","RS-G3-OWNER-INTERVENTION-TAXONOMY","RS-G3-RULE-LIFECYCLE-DEBT","RS-G3-SUPERVISION-ATTENTION","RS-G3-SEMANTIC-INTEGRATION","RS-G4-AUTONOMY-SURVIVAL","RS-G4-REALITY-DRIFT","RS-G3-PASSIVE-EVIDENCE-PIPELINE"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/REX-802/PAPER_MATERIAL_INDEX.md"]
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: RESEARCH_RUN_DETAILS
user_exposure_nesting: L4_TECHNICAL
backend_wiring: VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: true
report_path: mission-book/reports/REX-802
capability_ids: ["CAP-RESEARCH-TRACE-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-RESEARCH-TRACE-001.yaml"]
capability_registry_sync_status: RECONCILED
monitor_observability_evidence: NOT_APPLICABLE
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
terminal_marker: RESEARCH_TRACE_FOUNDATION_ACCEPTED
merged_main_sha: "e111eb2787e7464385b4b59e62e954ac1f5f678e"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "PR #17, integrated in the JOIN-590 closeout integration"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
owner_gate_ruling_2026_10_07: "OWNER GATE OPEN for the REX series (owner instruction this session): QUALIFIED sub-tasks may merge, i.e. those whose own review is complete and whose marker is released. merge_authority is set true on REX-801..805 (all accepted and now in main) and stays false on REX-806/807/890 until their reviews complete - acceptance, the opposite-host review and the markers are unchanged, and section 3 still forbids self-review. Recorded by Mech-DS."
---

# REX-802 — Trace / Provenance / Metrics Foundation

> 常驻规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

建立统一 Research Trace，把已有 canonical truth 用 provenance 绑定起来。

至少覆盖：

- experiment/run；
- task/action；
- device/node；
- provider/model/channel（存在时）；
- route/handoff；
- retry/backoff；
- failure；
- recovery；
- Owner intervention；
- timing；
- resource observation；
- Git/config refs；
- research signal id / grade snapshot；
- authority surface / truth source；
- task eligibility / zero-claim classification；
- wake condition / wake event / rescan reason；
- exact implementation/review/CI/evidence identity；
- Capability Registry state（涉及 capability 时）；
- user reachability / intent state（涉及 user capability 时）；
- Owner intervention reason taxonomy；
- task transition count；
- autonomous span until intervention。

## G3/G4 trace priorities

Trace schema 必须优先支持以下 longitudinal questions，而不是只做 generic telemetry：

1. **Autonomy survival**
   - autonomous run start；
   - successful task transitions；
   - first required Owner intervention；
   - intervention reason；
   - pool drained / blocked / interrupted。

2. **Dynamic liveness**
   - eligibility state；
   - TEMPORARILY_UNCLAIMABLE / STRUCTURALLY_INELIGIBLE / GLOBAL_EXTERNAL_BLOCK / POOL_TERMINAL；
   - wake trigger；
   - bounded re-scan；
   - no-idle task switch。

3. **Reality drift**
   - Mission Book state；
   - Capability Registry state；
   - Git exact state；
   - CI/review evidence state；
   - runtime/UI observed state；
   - mismatch / reconciliation。

4. **Exact continuation**
   - predecessor/successor agent/model/host；
   - exact SHA / dependency truth；
   - handoff artifact；
   - resumed next action；
   - rediscovery/repeated-work signal。

5. **Rule lifecycle / governance debt**
   - rule/section id + exact City rule SHA；
   - source failure that introduced it；
   - supersession/conflict/retirement；
   - false blocking / stale guidance；
   - observed task where the rule changed outcome。

6. **Owner attention / escalation quality**
   - intervention category；
   - batchable / avoidable；
   - bounded diagnosis completed before escalation；
   - repeated root cause；
   - escalation→autonomy-resumed duration。

7. **Semantic integration**
   - accepted source SHAs；
   - integration SHA；
   - component CI/review state；
   - semantic invariant violation after clean merge；
   - registry/runtime/user-intent drift。

缺字段时必须 `NOT_OBSERVABLE + reason`，不得把 missing 当 0。

## 硬规则

- 不复制 canonical task/action truth；
- trace 可以引用，不可改写产品状态；
- clock source / timestamp semantics 必须记录；
- missing measurement = unknown，不得填 0；
- raw → normalized 的 transformation 必须可复查。

## 用户暴露

属于 OBSERVABLE_ADVANCED。

用户至少能看到：

- 正在记录什么；
- 当前 run；
- failures；
- metrics availability；
- provenance；
- trace completeness / missing fields。

raw ids 可折叠到 Technical Details。

## Review

独立制造：

- missing event；
- duplicate event；
- out-of-order event；
- stale clock；
- restart；
- partial trace；
- collector failure。

证明 collector 失败不会拖死 Utopia 产品运行。

## 完成门槛

trace schema + collector + normalized view + user observability + review/CI/material index 全部满足。

## 复核结论（Mech，对侧物理主机）

Formal Review PASS，详见 `mission-book/reports/REX-802/REVIEW_REPORT.md`。十一项独立探针逐条人为制造本工作书
Review 章节要求的 missing / duplicate / out-of-order / stale clock / restart / partial trace / collector failure，
并额外用"永不返回"的存储证明采集器不构成产品执行屏障；作者测试套件未经修改地重跑。四项发现均不阻塞且未修复：
F1（LOW）`completeness` 对网关能产生的一切记录恒为 PARTIAL，而空采集器反而报 COMPLETE，且其成因只存在于折叠的
原始 JSON；F2（LOW）重启后快照 runId 覆盖了仍含上一 epoch 记录的窗口；F3（LOW，控制面）工作书原有八项模板字段
缺失（含全部四项 capability 字段），而 `CAP-RESEARCH-TRACE-001` 已存在，由本次复核依已核记录回填并对账为
`FORMAL_REVIEW_RECONCILED`；F4（LOW，测试保真度）Android 单测以 `org.json:json` 替换 android.jar，二者对 JSON null
的 `optString` 语义不同，故设备侧真正起作用的 `"null"` 守卫正确但未被测试覆盖。一项委派仪器以"测试用 jar"为据
得出该守卫为死代码的结论，已按 INVALID_INSTRUMENT 记录（对已发布应用不成立）。全量回归失败项已在报告中逐项分类：
三项为环境性、一项在基线同样失败、一项为负载敏感抖动、两项归因于复核方浏览器带来的套件组成负载。本轮未渲染任何
实体设备界面、未观测 experiment/provider/model/autonomy，不作性能声明；Android 在线渲染仍为 NOT_RUN。


---

[English reading translation / 完整英文阅读说明](en/REX-802-trace-provenance-and-metrics-foundation.md)
