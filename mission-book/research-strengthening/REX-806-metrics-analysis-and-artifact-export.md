---
workbook_id: REX-806
phase: RESEARCH_STRENGTHENING
sequence: 806
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-803","REX-804","REX-805"]
dependency_source_shas: ["8798ba9dd37051626033ad72080b2fad3ff66149","fe700aba957990f93b22fd63d594ddfff7b4e243","0261a9ed1cec88df3ab4675623d422b37b33f270"]
development_baseline_sha: "e18c5c5350d7657cf046b7ba6bbcd888dc2a1540"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-06): baseline_anchor_mode resolved as the union of the three accepted dependency heads, which is what DEPENDENCY_SHA_UNION_AT_CLAIM requires and what main cannot stand in for. Measured: none of the accepted heads is in main (REX-803 8798ba9, REX-804 fe700ab, REX-805 0261a9e all exit non-zero for git merge-base --is-ancestor against origin/main), while the required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe is reachable from main (exit 0). Accepted REX-803 8798ba9 is already contained in accepted REX-805 0261a9e, so the union needs only main + 0261a9e + fe700ab. Construction: 0261a9e merged into main was a fast-forward; fe700ab then produced exactly one conflict in services/dev-gateway/server.mjs, the same union site the integration preflight had already measured, resolved as the union of the fault controller with the campaign and replay controllers (all three define a research controller at that point and none references another; the single return exposes campaigns and faults with a teardown releasing both). Resolved baseline (40-char): e18c5c5350d7657cf046b7ba6bbcd888dc2a1540, on branch rex/REX-806-mech-metrics-and-export, with all three accepted heads verified as ancestors of it. Dependency smoke BEFORE any REX-806 product change: node --test on the REX-803, REX-804 and REX-805 suites -> 17 suites, 68 tests, 68 pass, 0 fail. Worktree D:/utopia-rex806. Claim record published before any product change: reports/REX-806/CLAIM_REPORT.md. KNOWN PRE-EXISTING CONDITION recorded rather than silently handled: running the accepted REX-804 web suite dirties evidence/raw/mission-book/REX-804/danger-zone.png because that test writes into a committed evidence path; a repair is published and awaiting adoption (repair/REX-804-mech-test-evidence-outside-repo @ 690d723) and does not block this task."
baseline_blocker: null
dependencies: ["REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED", "REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED", "REX-805:TRACE_REPLAY_ABLATION_ACCEPTED"]
development_host: "Mech"
development_branch: "rex/REX-806-mech-metrics-and-export"
development_head_sha: "d7aa5d7503c1a2b55e71b05a17306bd8a6e5db22"
development_ci: "LOCAL + HOSTED (Mech host, COMPUTERNAME MEGA-REP, 2026-10-06): the artifact exporter, its owner-only City surfaces and 18 probes are on rex/REX-806-mech-metrics-and-export. EXACT HEADS: 94a7d24 (exporter + 13 module probes) push 37451114057 COMPLETED SUCCESS attempt 1; d7aa5d7 (owner-only surfaces + 5 surface probes) push 37452319948 COMPLETED SUCCESS attempt 1. BASELINE: claim-time union of the accepted heads REX-803 8798ba9, REX-804 fe700ab, REX-805 0261a9e -> e18c5c5, all three verified as ancestors, dependency smoke 17 suites / 68 tests / 68 pass before any product change. PROBES: 18/18 pass (13 module, 5 surface) and falsified before being trusted - a mutation fabricating an intervention count of zero turns eight module probes red, mutations to the placement policy and the run accounting turn the new ones red, and the surface probes were themselves wrong twice before they were right (an unregistered experiment, then a receipt file whose name did not match the runner's campaign-<uuid>.json pattern). SURFACES: GET /api/v0/research/artifacts (artifact + per-file checksums), ?format=csv (table-ready metrics.csv), /preview?limit=N (bounded preview); all three refuse a member session with RESEARCH_OWNER_REQUIRED and refuse with ARTIFACT_NO_SOURCE when the City holds no readable campaign. The member-refusal probe enrolls a real device and opens a real session rather than inventing a credential. REGRESSIONS: the surfaces this touches stay green (REX-803 campaign surface, REX-805 gateway, MON-990 cross-surface = 7/7). FULL SUITE on this branch 1440 tests with five failures, all classified: the three known host-city-launcher reservation failures plus two browser tests that fail under full-suite load (one projection came back empty, one replay was REFUSED by the topology readiness gate) and both pass 4/4 alone; the baseline at e18c5c5 WITHOUT this module gives 1427 tests with four failures - the same three plus the load-sensitive relay rate-limit probe this host diagnosed earlier. Different load-sensitive instruments fail on different runs under contention, and none of them comes from this work. DELIVERABLE: generated from 18 real campaigns (24 runs, 22 measured) and published at mission-book/reports/REX-806/artifact/ with per-file SHA256, verified 10/10 through a fresh clone; see reports/REX-806/DELIVERABLE.md. development_complete remains false and no marker is released."
development_complete: true
development_physical_gate_basis: "NOT_APPLICABLE - this task's completion gate is not a physical topology; it requires that a complete artifact can be generated from a set of real campaigns and independently read and recomputed by the opposite host. Generation and publication are done (18 real campaigns, 24 runs, 22 measured, per-file SHA256, fresh-clone verified 10/10); the independent recomputation is the reviewer's step and is requested explicitly in reports/REX-806/DEVELOPMENT_HANDOFF.md."
development_handoff: "mission-book/reports/REX-806/DEVELOPMENT_HANDOFF.md"
development_final_full_suite: "1445 tests / 1442 pass / 3 fail on d7aa5d7, the three being tests/host-city-launcher.test.mjs (this host's resident-City host reservation, the same three at every head this host measures). No load-sensitive failure appeared in this run on this head."
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
research_evidence_applicability: APPLICABLE
research_watchlist_hits: ["RS-G3-OWNER-INTERVENTION-TAXONOMY","RS-G3-SUPERVISION-ATTENTION","RS-G3-RULE-LIFECYCLE-DEBT","RS-G3-SEMANTIC-INTEGRATION","RS-G3-PASSIVE-EVIDENCE-PIPELINE","RS-G4-AUTONOMY-SURVIVAL","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-806
terminal_marker: RESEARCH_ARTIFACT_EXPORT_ACCEPTED
---

# REX-806 — Metrics Analysis + Research Artifact Export

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

将实验导出为可检查的：

```text
artifact/
├─ manifest
├─ environment
├─ topology
├─ raw pointers
├─ normalized dataset
├─ metrics.csv
├─ failures
├─ exclusions
├─ tables
├─ reproduction
└─ checksums
```

## Metrics

至少支持来自前序真实数据的：

- completion time；
- recovery time；
- handoff time；
- failure rate；
- intervention count；
- retry count；
- duplicate execution；
- convergence / missing event（可测时）；
- task transitions before Owner intervention；
- time / steps to first Owner intervention；
- intervention-free survival（可构造时）；
- intervention cause taxonomy；
- task-pool drain before intervention；
- control-plane reality mismatch count / reconciliation time；
- implementation→wiring→reachability→intent transition timestamps；
- Exposure Lag / Intent Lag（可测时）；
- registry-assisted localization/onboarding cost（实验提供时）；
- high-value Owner decision count；
- avoidable technical escalation count；
- repeat clarification count；
- escalation → autonomy-resumed time；
- batchable escalation count / interruption burst（可测时）；
- rule activation / conflict / false-block / retirement observations；
- textually-clean semantic integration failure count；
- independently-green components → integrated semantic failure count。

不支持的指标标 NOT_MEASURED。

### Metric interpretation guard

- `owner_intervention_count = 0` 只有明确观察到完整窗口且确实无人介入时才允许；未知必须 NOT_MEASURED；
- “运行了更久”不等于更自治，idle loop / duplicate work / blocked polling 要单独分类；
- survival curve 若样本不足，只导出原始 censored episode 数据，不强行画结论；
- G1/G2 metric 默认 supporting；G3/G4 metric 优先进入 paper-ready tables。

## 导出

DIRECT_CONTROL：

- preview dataset；
- export artifact；
- export CSV/table-ready data；
- reproduction instructions。

不得自动生成夸大结论；统计结果与论文 narrative 分离。

## Review

Reviewer 从导出包独立重算至少一组指标，并核对 checksum/provenance。

## 完成门槛

可从一组真实 campaign 生成完整 artifact，并由另一实体主机独立读取/重算。


---

[English reading translation / 完整英文阅读说明](./en/REX-806-metrics-analysis-and-artifact-export.md)
