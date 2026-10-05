---
workbook_id: MON-901
phase: CITY_WORK_MONITOR
sequence: 1
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: "d3262ce2dd81e51a53e39e6f9add8dee650a7682"
baseline_resolution_evidence: "mission-book/reports/MON-901/CLAIM_RECORD.md"
dependencies: []
development_host: Alien-codex
development_branch: mon/MON-901-Alien-codex-observation
development_head_sha: "7eb38f1b930dfe6cc13dab0e17dedee467b1254b"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37242446183"
development_complete: true
review_host: "Mech"
review_head_sha: "7eb38f1b930dfe6cc13dab0e17dedee467b1254b"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, 7eb38f1b930dfe6cc13dab0e17dedee467b1254b, resolved from refs/heads/mon/MON-901-Alien-codex-observation. INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. The workbook has no dependencies and no required_ancestor_shas, so no dependency union needs re-verifying; the baseline it was built from is recorded as d3262ce2dd81e51a53e39e6f9add8dee650a7682. The exact-head review CI is re-measured by the reviewer and recorded before any verdict, together with the reviewer own instruments for the four checks this workbook names (projection is not task truth; JEV sidecar failure does not freeze tasks; projection matches canonical runtime; an observed risk leaves an exact evidence pointer). || VERDICT PASS on the reviewed head. Exact-head CI re-measured by the reviewer: V0.2 checks push run 37242446183 completed/success on 7eb38f1b930dfe6cc13dab0e17dedee467b1254b (jobs android success, gateway-web success); PR24 pull run 37242505126 completed/success on the SAME head; City linkage check pull run 37242505131 completed/success (reciprocal-contract success). Reviewer instruments: six independent probes written for this review (utopia tests/mon901-mech-review-probes.test.mjs, branch review/MON-901-mech-review at d68afa225d3f6abb9ba93583745b305e9705fddc) 6/6 pass against a real gateway, plus the author suite unmodified (tests/mon901-observation.test.mjs 8/8, tests/gateway.test.mjs 4/4). Scope was checked, not assumed: NO pre-existing test file is modified by this commit, so unlike WBC-603 there is no relaxed assertion needing independent compensation. The author evidence receipt was hash-verified, not trusted: SHA-256 of the committed canary-receipt.json equals the declared 18003d74374c869ea9325d5a77bcf51b8ec88df0831cdda1d6b68f14df43514a. Two findings recorded, neither blocking: F1 LOW (completeness.continuous is a hardcoded constant inside the computed completeness object, so a complete contiguous window reports historyGap=false together with continuous=false; real, but conservative and documented - minimum repair boundary is to derive it or move it out of completeness), F2 INFORMATIONAL (state_identity_evidence CAPTURED with empty refs; the reviewer verified the substantiating material and supplied the pointer). No user-visible surface was exercised and no physical-worker or performance result is claimed; MON-902 owns the graph/inspector UI. See reports/MON-901/REVIEW_REPORT.md."
review_complete: true
user_exposure_class: BACKGROUND_DISCLOSED
user_exposure_surface: City Work Monitor
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: VERIFIED
ui_exemption_reason: null
capability_ids: ["CAP-MON-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-MON-001.yaml"]
capability_registry_sync_status: RECONCILED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/MON-901/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: []
highest_research_grade_observed: NONE
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/MON-901/PAPER_MATERIAL_INDEX.md"]
monitor_observability_evidence: CONTROLLED_CANONICAL_MATCH
monitor_observability_refs: ["mission-book/reports/MON-901/PAPER_MATERIAL_INDEX.md"]
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/MON-901
merged_main_sha: "e111eb2787e7464385b4b59e62e954ac1f5f678e"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "PR #24, integrated in the JOIN-590 closeout integration"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
---

# MON-901 — Observation Model + JEV Sidecar Projection

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> Programme：[README.md](./README.md)

## 目标

建立 City Work Monitor 的最薄真实 observation 基础：

```text
canonical Utopia runtime truth
→ bounded event adapter
→ JEV observation layer
→ normalized Node / Edge / Event projection
→ observable monitor state
```

## 强约束

- JEV 是 sidecar/observer，不是所有执行的同步必经路径；
- 不复制 scheduler/task/device/provider/review/capability truth；
- monitor failure 不得阻断无关 task；
- raw high-frequency telemetry 按 PROCESS_DATA_POLICY 分层；
- 不引入新的 hidden reasoning capture；
- first slice 必须能从真实 runtime state 显示至少一个 active task、owner/host、state 与 evidence pointer。

## 最低数据模型

```text
Node
Edge
Event
Evidence
```

Decision 可先保留 schema seam，由 MON-903 接入。

## 观测范围

优先复用已有 canonical events，覆盖：

- task claim/state transition；
- worker/host binding；
- review；
- test/CI summary；
- wait/retry/recovery；
- handoff；
- model/provider switch（如果 canonical truth 已存在）；
- Owner escalation；
- evidence refs。

不得因为 dashboard 需要方便字段就悄悄创建第二套状态机。

## 性能门

至少验证：

- observer disconnected 时任务继续运行；
- observer slow 时无关任务不被同步阻塞；
- projection lag 可测则记录；
- dropped/missing event 可被诚实暴露，不伪造“实时”。

## Research capture

重点记录：

```text
event_source
canonical_event_id
observed_at
projected_at
projection_latency_ms
drop_or_gap
reconciliation_result
monitor_reality_drift
unrelated_task_blocking
```

未知字段写 NOT_OBSERVABLE。

## Development / Review

Development 需更新 Capability Registry candidate。Formal Review 必须从 exact-head runtime 独立验证：

1. Monitor projection 不成为 task truth；
2. JEV sidecar failure 不冻结任务；
3. projection 与 canonical runtime 对得上；
4. observed risk 能留下 exact evidence pointer。

## 完成门槛

- bounded projection contract；
- 至少一个真实 task 的 node/edge/event projection；
- no-global-barrier evidence；
- opposite-host review；
- exact-head CI；
- Registry candidate/reconciliation；
- PAPER_MATERIAL_INDEX。

## 复核结论（Mech，对侧物理主机）

Formal Review PASS，详见 `mission-book/reports/MON-901/REVIEW_REPORT.md`。六项独立探针
（`utopia:tests/mon901-mech-review-probes.test.mjs`）逐条覆盖本工作书开发章节要求复核的四件事，
作者测试套件未经修改地重跑。两项发现已记录且均不阻塞：F1（LOW）`completeness.continuous` 为硬编码常量，
与相邻的计算字段 `historyGap` 在完整连续窗口下相互矛盾；F2（INFORMATIONAL）`state_identity_evidence` 声明
CAPTURED 但引用为空，指针由复核方补入。本轮未验证任何用户可见界面；graph/inspector UI 属 MON-902。
