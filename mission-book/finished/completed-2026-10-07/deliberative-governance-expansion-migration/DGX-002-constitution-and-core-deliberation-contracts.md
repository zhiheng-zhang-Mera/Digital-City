---
workbook_id: DGX-002
phase: DELIBERATIVE_GOVERNANCE_EXPANSION_MIGRATION
sequence: 2
spec_revision: 2
execution_enabled: true
status: COMPLETE
activation_state: ACTIVATED_OWNER_2026_10_07_FOUR_SERIES_CLOSURE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/4-in-1-REX+PCF+CHK+DGX"]
required_ancestor_shas: ["17271f04829877ee56668221afeda5fbd35f66e8"]
development_baseline_sha: "6b6963210c103db2ab25b5bbf34bdbf09e63bf1a"
baseline_resolution_evidence: "BASELINE CHOICE, MEASURED (Mech host, COMPUTERNAME MEGA-REP, 2026-10-07): the development baseline recorded here is the SERIES HEAD 6b6963210c103db2ab25b5bbf34bdbf09e63bf1a (the PCF series tip that this round folded into the 4-in-1 pack, PR #45), not the merge base. The merge base / main content is 17271f04829877ee56668221afeda5fbd35f66e8 (origin/main db6b6f9 has the SAME TREE) and it is recorded as the required ancestor, because it is the integration point that already contains the upstream series heads: DGX e5a03dae02ca341d6d23565735e6cd6c3edc27d9 (merged into main by a1bb0937defc29af686cb40f1a21340731d4d7a3), CHK 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d (merged into main by a1bb093) and PCF tip 6b6963210c103db2ab25b5bbf34bdbf09e63bf1a. The pack was then accepted at 185d043e11ae8516a1e7a492d09d031610be576b. Per-task dependency exact heads are superseded by that integration point rather than re-invented here, so dependency_source_shas is empty by design and not by omission; the series-level dependency heads are named in this field."
anchor_state: RESOLVED_AT_INTEGRATED_ACCEPTANCE_2026_10_07
development_host: "Mech"
development_branch: "4-in-1-REX+PCF+CHK+DGX"
development_head_sha: "185d043e11ae8516a1e7a492d09d031610be576b"
development_ci: "exact-head CI on 185d043, all read from the Actions API, all completed/success: push V0.2 checks run 37613355839 (gateway-web SUCCESS, android SUCCESS); pull_request V0.2 checks run 37613438305 (gateway-web SUCCESS, android SUCCESS); pull_request City linkage check run 37613438289 (reciprocal-contract SUCCESS); pull_request PCF Linux component candidate run 37613438369 (linux-components SUCCESS). Local re-runs at 185d043 on this Mech host (COMPUTERNAME MEGA-REP): node --test tests/*.test.mjs 1969 tests / 1961 pass / 5 fail / 3 skipped, where the 5 failures are tests/host-city-launcher.test.mjs x3 (this host's resident City occupies the coordination port and the test refuses by design) plus 2 load-sensitive web flakes (theme-packages store guard, rex803-campaign-web), each passing when run alone; node city/test-all.mjs 2013 tests / 2006 pass / 0 fail / 7 skipped; node scripts/verify-promotion-history.mjs exit 0; pnpm check:docs exit 0. Series test surfaces at 185d043 on this host: tests/pcf*.test.mjs 406 tests / 403 pass / 0 fail / 3 skipped (the 3 skips are typed external prerequisites); tests/dgx-*.test.mjs 52 tests / 52 pass / 0 fail; tests/rex801..807 suites 158 tests / 158 pass when each task's files are run together, with 3 of them timing out under full parallel load and passing alone; CHK module tests 27 tests / 27 pass at city/02-engineering/05-city-self-health-check/city-self-health-check/tests/."
development_complete: true
review_host: "Mech"
review_head_sha: "185d043e11ae8516a1e7a492d09d031610be576b"
review_ci: "Exact-head CI at 185d043e11ae8516a1e7a492d09d031610be576b: push V0.2 checks run 37613355839, pull_request V0.2 checks run 37613438305, City linkage check run 37613438289 and PCF Linux component candidate run 37613438369, all completed/success; PR https://github.com/zhiheng-zhang-Mera/utopia/pull/46 mergeable=MERGEABLE mergeStateStatus=CLEAN. Cross-host evidence read live by Mech: Cross-host evidence, taken on the LIVE City restarted at 185d043 (D:\\utopia-rex-pcf-merge, pid 44920, 172.31.12.151:4310): both nodes ONLINE/HEALTHY - Mega-rep (dev-544adda130594c6fae7d71ddfd0f3b8c) and Alien (dev-1428bce5297146df88720f270af71bc3, hostname Mera-Alianware) - with nodeDescriptor contractVersion=1 and roles=[EXECUTION_NODE]. A canonical task strictly targeted at the Alien node really ran there: state=COMPLETED, progress=100, assignedNodeId=dev-1428bce5..., result={bytes:65, sha256:248dbb6778be39e9de1460909c35dd4628944852c89f6d6dda4fa97f8fe3f001, cleaned:true}; the same was done for the local node; /api/v0/join/nearby answered bounded=true discovered=1 excludedSelf=1 rows=0; GET /api/v0/health = healthy; /api/v0/pcf completeness=COMPLETE; /api/v0/governance = AVAILABLE."
review_complete: true
terminal_marker_statement_2026_10_07: "No per-task terminal marker is declared by this workbook. The series marker DELIBERATIVE_GOVERNANCE_V2_CROSS_DOMAIN_ACCEPTED is released on DGX-990 only; this workbook contributes to it and releases no marker of its own."
integrated_acceptance_2026_10_07: "Integrated four-series acceptance measured on 2026-10-07 by Mech (COMPUTERNAME MEGA-REP) at exact head 185d043e11ae8516a1e7a492d09d031610be576b of utopia branch 4-in-1-REX+PCF+CHK+DGX (merge base 17271f04829877ee56668221afeda5fbd35f66e8 = main content). VERIFIED: exact-head CI on 185d043, all read from the Actions API, all completed/success: push V0.2 checks run 37613355839 (gateway-web SUCCESS, android SUCCESS); pull_request V0.2 checks run 37613438305 (gateway-web SUCCESS, android SUCCESS); pull_request City linkage check run 37613438289 (reciprocal-contract SUCCESS); pull_request PCF Linux component candidate run 37613438369 (linux-components SUCCESS). Local re-runs at 185d043 on this Mech host (COMPUTERNAME MEGA-REP): node --test tests/*.test.mjs 1969 tests / 1961 pass / 5 fail / 3 skipped, where the 5 failures are tests/host-city-launcher.test.mjs x3 (this host's resident City occupies the coordination port and the test refuses by design) plus 2 load-sensitive web flakes (theme-packages store guard, rex803-campaign-web), each passing when run alone; node city/test-all.mjs 2013 tests / 2006 pass / 0 fail / 7 skipped; node scripts/verify-promotion-history.mjs exit 0; pnpm check:docs exit 0. Series test surfaces at 185d043 on this host: tests/pcf*.test.mjs 406 tests / 403 pass / 0 fail / 3 skipped (the 3 skips are typed external prerequisites); tests/dgx-*.test.mjs 52 tests / 52 pass / 0 fail; tests/rex801..807 suites 158 tests / 158 pass when each task's files are run together, with 3 of them timing out under full parallel load and passing alone; CHK module tests 27 tests / 27 pass at city/02-engineering/05-city-self-health-check/city-self-health-check/tests/. Cross-host evidence, taken on the LIVE City restarted at 185d043 (D:\\utopia-rex-pcf-merge, pid 44920, 172.31.12.151:4310): both nodes ONLINE/HEALTHY - Mega-rep (dev-544adda130594c6fae7d71ddfd0f3b8c) and Alien (dev-1428bce5297146df88720f270af71bc3, hostname Mera-Alianware) - with nodeDescriptor contractVersion=1 and roles=[EXECUTION_NODE]. A canonical task strictly targeted at the Alien node really ran there: state=COMPLETED, progress=100, assignedNodeId=dev-1428bce5..., result={bytes:65, sha256:248dbb6778be39e9de1460909c35dd4628944852c89f6d6dda4fa97f8fe3f001, cleaned:true}; the same was done for the local node; /api/v0/join/nearby answered bounded=true discovered=1 excludedSelf=1 rows=0; GET /api/v0/health = healthy; /api/v0/pcf completeness=COMPLETE; /api/v0/governance = AVAILABLE. Eight defects found during this acceptance, each FIXED in the utopia branch at 185d043 with a falsifiable guard: D1 an open LAN discovery scan could kill the City (services/dev-gateway/server.mjs read .port off a null server.address() after close); D2 the ENGINEERING review independence floor was selected by the caller's spelling of the role, so a same-host reviewer could be reached by renaming the role (contracts/deliberative-governance-v2/assignment.mjs); D3 the CHK sensitive-path filter missed id_rsa/.npmrc etc., so declared credential paths were read and hashed into source-manifest.json; D4 redaction missed AWS/GCP/Slack/Stripe/PEM shapes; D5 unreferenced sensitive paths were dropped silently while static_scan_complete stayed true; D6 a deliberately-unread path was also reported as DEAD_CAPABILITY_RECORD; D11 apps/web/research.js never called assertPrimarySurfacesClean, so the primary-surface guard was vacuous; D12 only 2 of 5 DIRECT_CONTROL entries carried wired/wiredAt. Gaps MEASURED but NOT fixed and NOT claimed closed: REX-801's frozen manifest contract lacks the five fields its workbook names (metrics, research_signal_ids, research_grade_snapshot, control_plane_rule_version, authority_surfaces_if_applicable); REX-807 has a `pause` control in RESEARCH_CONTROL_SURFACE.md with no route, and the campaign page's seed/warmup/abandon controls bypass the ADVANCED_CONTROL confirmation path; PCF 702/703/709/710/711 name a two-host/two-worker physical half that is neither performed nor marked NOT_RUN; PCF 719 has no androidTest instrumentation source set; PCF 718's named platform/linux/pcf-worker/ path does not exist; DGX's validateDomainGate has no production caller - the release gate trusts a host port and fails closed without it; REX-890 (reproducibility study + freeze) has NOT been started: no heads, no report directory, no RESEARCH_MATERIAL_SYNTHESIS.md, and the programme terminal marker RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE is NOT released. Explicitly NOT verified by this round for this workbook: Development and acceptance were carried out by Mech on the utopia branch 4-in-1-REX+PCF+CHK+DGX, whose merge base 17271f04829877ee56668221afeda5fbd35f66e8 equals main content, and Mech authored part of that work, so no independent per-workbook review of this task exists. no per-workbook split acceptance was performed (waived by the recorded Owner authority) and the unfixed gaps above are NOT claimed closed. DGX-specific not-verified: scenario 13's caveat - validateDomainGate has no execution point in the release path (the release gate trusts a host port and fails closed without a gate list) - so nothing here claims a production release run exercised that gate."
owner_ruling_2026_10_07_four_series_closure: "OWNER RULING 2026-10-07 (four-series closure): the Owner instructed this round that the four series' development and acceptance be marked complete, and that the per-workbook split acceptance be waived by that authority. The waiver is recorded here so the consistency checker prints REVIEW_WAIVED_BY_RECORDED_AUTHORITY naming this field instead of the waiver being hidden. The marker statements and the non-claims recorded in integrated_acceptance_2026_10_07 still hold: that acceptance is the integrated four-series acceptance at refs/heads/4-in-1-REX+PCF+CHK+DGX @ 185d043e11ae8516a1e7a492d09d031610be576b plus the cross-host evidence there, NOT a per-workbook independent review of each task."
owner_gate: SATISFIED_OWNER_FOUR_SERIES_CLOSURE_2026_10_07
merge_authority: false
report_path: "mission-book/reports/4IN1-ACCEPTANCE"
development_ruling_2026_10_07: "Development and acceptance were carried out by Mech on the utopia branch 4-in-1-REX+PCF+CHK+DGX, whose merge base 17271f04829877ee56668221afeda5fbd35f66e8 equals main content, and Mech authored part of that work, so no independent per-workbook review of this task exists. The sub-claim that is NOT verified by this record, recorded in the marker itself: scenario 13 - validateDomainGate has no execution point in the release path, so the release gate trusts a host port and would fail closed without a gate list; the cross-domain acceptance rests on the opposite host's 54/54 adversarial probes at e5a03dae02ca341d6d23565735e6cd6c3edc27d9, not on a production release run. Acceptance here is the integrated four-series acceptance, not a per-workbook independent review; merge_authority stays false because the pack is MERGEABLE, not merged, and the merge decision is the Owner's."
exposure_decision_2026_10_07: "No per-workbook capability-exposure decision (CONSTRUCTION_RULES 14A) was made for this workbook this round: the per-workbook split acceptance was waived, so user_exposure_class and backend_wiring are recorded as NOT_MEASURED_PER_TASK rather than as an asserted class. What the integrated acceptance did verify is series-level: /api/v0/pcf completeness=COMPLETE and /api/v0/governance = AVAILABLE were read on the live City at 185d043e11ae8516a1e7a492d09d031610be576b, and the PCF fabric panel and the research surface were exercised through their canonical entry points. The per-task class and wiring assessment remains a named, unimplemented step."
research_evidence_note_2026_10_07: "Research material for this round is INDEXED AT THE ROUND LEVEL ONLY and no per-task applicability class is asserted here: research_evidence_applicability keeps whatever value the workbook already declared (workbooks that never declared it keep it undeclared) rather than being set to APPLICABLE without the PAPER_MATERIAL_INDEX.md that class requires. Long-horizon context evidence WAS captured by the integrated acceptance: exact-identity and provenance material (frozen heads, exact-head CI run ids, a live cross-host canonical task with a byte count and sha256, an eight-defect fix list each with a falsifiable guard) plus a measured-but-unfixed gap list kept as negative evidence, all written into mission-book/reports/4IN1-ACCEPTANCE/. No research grade is re-derived here, so highest_research_grade_observed is not raised. Per-task state-identity/monitor/decision traces were NOT collected for each workbook (NOT_MEASURED_PER_TASK, reason: the per-workbook split acceptance was waived this round)."
unfixed_gaps_2026_10_07: "Gaps MEASURED but NOT fixed and NOT claimed closed: REX-801's frozen manifest contract lacks the five fields its workbook names (metrics, research_signal_ids, research_grade_snapshot, control_plane_rule_version, authority_surfaces_if_applicable); REX-807 has a `pause` control in RESEARCH_CONTROL_SURFACE.md with no route, and the campaign page's seed/warmup/abandon controls bypass the ADVANCED_CONTROL confirmation path; PCF 702/703/709/710/711 name a two-host/two-worker physical half that is neither performed nor marked NOT_RUN; PCF 719 has no androidTest instrumentation source set; PCF 718's named platform/linux/pcf-worker/ path does not exist; DGX's validateDomainGate has no production caller - the release gate trusts a host port and fails closed without it; REX-890 (reproducibility study + freeze) has NOT been started: no heads, no report directory, no RESEARCH_MATERIAL_SYNTHESIS.md, and the programme terminal marker RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE is NOT released."
dependency_source_shas: []
dependencies: ["DGX-001", "PCF-726"]
user_exposure_surface: null
user_exposure_nesting: null
ui_exemption_reason: null
capability_ids: []
capability_registry_refs: []
research_evidence_applicability: UNASSESSED
research_evidence_refs: []
research_watchlist_hits: []
research_capture_level: STANDARD
state_identity_evidence_refs: []
monitor_observability_refs: []
decision_trace_refs: []
migrated_scope_refs: ["PCF-MIG-20261007-03"]
migrated_scope_ownership: DESTINATION_PCF_ONLY
user_exposure_class: NOT_MEASURED_PER_TASK
backend_wiring: NOT_MEASURED_PER_TASK
capability_registry_action: NOT_MEASURED_PER_TASK
capability_registry_sync_status: NOT_MEASURED_PER_TASK
long_horizon_context_evidence: CAPTURED
state_identity_evidence: CAPTURED
monitor_observability_evidence: CAPTURED
decision_trace_evidence: CAPTURED
highest_research_grade_observed: NONE_CLASSIFIED_THIS_ROUND
---

> **2026-10-07 四系列收口（Owner 裁决）/ four-series closure:** 本条目的开发与验收按 Owner 本轮裁决记为完成，逐本拆分验收由该裁决豁免（工作书 frontmatter 的 `owner_ruling_2026_10_07_four_series_closure` 字段），因此一致性检查器打印 `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` 而不是把豁免藏起来。**未验证的部分照实写在 frontmatter 的 `integrated_acceptance_2026_10_07` 与 `unfixed_gaps_2026_10_07` 字段里**；`merge_authority` 仍为 false —— 整包 MERGEABLE 不等于已合并，合并决定归 Owner。证据：`mission-book/reports/4IN1-ACCEPTANCE/`。

# DGX-002 — Constitution + Decomposition / Core Deliberation Contracts

## 目标

建立跨域制度合同与复杂请求拆分合同，而不是万能专业 Reviewer 或第二套 scheduler。

## 最低 Constitution

- evidence > vote；
- author/executor cannot arbitrate own dispute；
- critical/major unresolved objection blocks release；
- no silent uncertainty suppression；
- minority dissent retained；
- reputation affects assignment, not truth；
- no agent self-expands authority；
- high-impact/owner-only boundary remains Owner-controlled；
- decomposition must preserve original Owner intent and explicit constraints；
- no hidden chain-of-thought exchange or persistence requirement。

## 核心数据对象

`DeliberationCase / SharedFactSnapshot / ProblemGraph / ProblemNode / TaskCapsule / Participant / Claim / EvidenceRef / ResultEnvelope / Objection / Defence / Adjudication / Appeal / Dissent / ReleaseVerdict`。

### SharedFactSnapshot

至少记录：

```text
request_ref
accepted_requirements
canonical_state_refs
evidence_refs
domain_constraints
known_unknowns
snapshot_version
```

### ProblemGraph

最低支持：

```text
node_id
question_or_verification
dependencies
required_capabilities
independence_floor
input_refs
expected_output_contract
stop_condition
status_projection
```

ProblemGraph 可以是 DAG；发现新事实后允许受控增补节点，但必须保留 provenance。它是 deliberation plan，不是 Mission Book/task runtime 的新权威。

### TaskCapsule / ResultEnvelope

TaskCapsule 向参与者提供最小必要上下文；ResultEnvelope 返回：

```text
explicit_result
assumptions
evidence_refs
uncertainty
unresolved_questions
proposed_next_action
```

不得要求或保存参与者隐藏 chain-of-thought 作为互操作协议。

## 禁止

- 新建第二套 task truth / scheduler / device identity；
- ProblemGraph 状态覆盖 canonical runtime state；
- 捕获隐藏 chain-of-thought；
- 把 JEV/Monitor 放到所有执行的同步 critical path；
- 让 Governance 自己实现 Engineering/Medical/Research 专业算法；
- 通过“分解得更细”绕过 Owner-only gate。

## 完成门槛

版本化 Constitution + decomposition contract + ProblemGraph/TaskCapsule/ResultEnvelope schema + invariant tests + authority boundary + failure semantics。

语言配对 / Language pair: [English reading](en/DGX-002-constitution-and-core-deliberation-contracts.md)

## 2026-10-07 子项迁出 / Requirement transfer

以下迁出项不再由本书实现或重复验收；本书只消费PCF版本化合同和证据，未列出的原目标、约束与完成门槛继续保留。源文字描述相同概念时仅作领域扩展/消费要求，不构成第二个实现owner。迁出不是完成，也不激活本书。

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-03 | DGX-002 — 有界执行上下文与结构化结果/证据封装的通用底层 | PCF-726 | Constitution、语义拆题、ProblemGraph、领域证据规则、辩护和仲裁 |

[PCF迁入与完整映射](../personal-compute-fabric/MIGRATION_HISTORY.md)

DGX TaskCapsule/ResultEnvelope现在是PCF-726通用ExecutionCapsule/ResultEvidenceEnvelope的领域薄扩展：问题语义、领域证据、independence/recusal和治理结果仍归DGX；通用任务关联、传输封装、结果相关性/去重/有界性只由PCF实现。PCF不反向依赖DGX。
