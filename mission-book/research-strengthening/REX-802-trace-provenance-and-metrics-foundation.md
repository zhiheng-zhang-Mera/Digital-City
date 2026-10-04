---
workbook_id: REX-802
phase: RESEARCH_STRENGTHENING
sequence: 802
execution_enabled: true
status: IN_PROGRESS
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
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
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
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-802
terminal_marker: RESEARCH_TRACE_FOUNDATION_ACCEPTED
---

# REX-802 — Trace / Provenance / Metrics Foundation

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

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
