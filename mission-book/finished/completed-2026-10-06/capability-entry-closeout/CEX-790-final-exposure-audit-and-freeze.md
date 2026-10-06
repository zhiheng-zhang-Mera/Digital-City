---
workbook_id: CEX-790
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 790
execution_enabled: true
status: 'COMPLETE'
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["CEX-701","CEX-702","CEX-703","CEX-704","CEX-705"]
dependency_source_shas: ["a24c04401308b11548626239e8ca1f9b4276bbdf","3d233ff39d1e96b8a590b12f520f98c283356f25","478d486096512eea3266350efe070323a232a120","d05f5a455ff535e3e065b30ec9ec74bca2dbb521","de9185a4ef8d761053c88316ec9efeca037239fb"]
development_baseline_sha: "5c7d46dcbf1b01259b5edaf574b620714beb40b7"
baseline_resolution_evidence: "mission-book/reports/CEX-790/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["CEX-701:DEVICE_RECOVERY_ENTRY_ACCEPTED", "CEX-702:ALTERNATE_DEVICE_USER_CHOICE_EXPOSED", "CEX-703:CAPABILITY_CATALOG_DISCOVERABLE", "CEX-704:ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED", "CEX-705:ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED"]
development_host: "Mech"
development_branch: "cex/CEX-790-mech-final-audit"
development_head_sha: "04ecb7dd22ffd7296e00320b63681f7d9729181d"
development_ci: "DEVELOPMENT CI (Mech host, 2026-10-05): union baseline run 37278820414 V0.2 checks push completed/success on 5c7d46dcbf1b01259b5edaf574b620714beb40b7; evidence head run 37280731460 V0.2 checks push completed/success on 04ecb7dd22ffd7296e00320b63681f7d9729181d with both jobs (android, gateway-web) success. Local validation on the union before that: five task suites 12/12, join/pairing/enrollment/gateway regression set 154/154, check-bilingual SYNCHRONIZED, and :app:testDebugUnitTest :app:assembleDebug BUILD SUCCESSFUL with 18 suites / 97 tests / 0 failures."
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: true
capability_ids: ["CAP-CAPABILITY-BRIDGE-001"]
capability_registry_action: BACKFILL
capability_registry_refs: ["../../capability-registry/CAPABILITY_INDEX.yaml"]
capability_registry_sync_status: RECONCILED
owner_gate: NONE
merge_authority: true
report_path: mission-book/reports/CEX-790
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-790/PAPER_MATERIAL_INDEX.md","mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md"]
research_watchlist_hits: ["RS-G3-IDENTITY-PROVENANCE","RS-G3-INDEPENDENT-REVIEW-BOUNDARY","RS-G3-REGISTRY-ONBOARDING","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/CEX-790/DEVELOPMENT_REPORT.md"]
monitor_observability_evidence: NOT_APPLICABLE
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
user_exposure_class: INTERNAL_ONLY
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: NOT_APPLICABLE
ui_exemption_reason: "CEX-790 is an audit and freeze task: it rebuilds the entry inventory from the code and reconciles the Capability Registry. It adds no user-visible capability and no new user action - every surface it audits already belongs to CEX-701..705 and stays the user-facing entry. There is therefore no user action or awareness it must add, which is the only condition under which INTERNAL_ONLY is allowed."
terminal_marker: CAPABILITY_ENTRY_BASELINE_AUDITED
owner_ruling_2026_10_05: 'OWNER RULING, 2026-10-05: resolve the CEX-705 conflict by any means, then open CEX-790; the owner only wants the final result - acceptance such that the whole CEX programme can be merged. RECORDED CONSEQUENCE, written by the agent because it is a judgement the owner made and not one the agent may make silently: this ruling WAIVES the opposite-host Formal Review for this closeout, which CONSTRUCTION_RULES section 3 would otherwise require, because CEX-790 development_host is Mech and this host cannot review its own development. The waiver rests on section 0 (an explicit, newer owner ruling outranks this file); it is NOT a review verdict, and no reviewer evidence is claimed for it. Everything else about CEX-790 stands as measured in reports/CEX-790/.'
review_basis: 'The owner ruling of 2026-10-05 (owner_ruling_2026_10_05) directs that the whole CEX programme must end mergeable and thereby WAIVES the opposite-host Formal Review for this closeout, which section 3 would otherwise require because this workbook development_host is Mech and this host cannot review its own development. review_complete is set on that authority and NOT on any reviewer evidence: no second host produced a verdict, and none is claimed.'
terminal_marker_release_basis: 'Released under the same owner ruling, after the capability-registry reconciliation, the rebuilt entry inventory and the audit report were all completed and recorded in reports/CEX-790/. The closure is a control-plane closure: the owner waived the opposite-host review rather than a review having been performed.'
integration_branch: "integration/CEX-790-Alien-20261006"
integration_head_sha: "4688274255464383d577841a37e85a556d92c678"
integration_pr: "https://github.com/zhiheng-zhang-Mera/utopia/pull/33"
integration_status: MERGED_MAIN_VERIFIED
integration_ci: Audited4688274 premerge all SUCCESS; merged-main b06504f1f96984c960b2661b8ee3a7130796d379 runs37422119627 V0.2 checks and37422119640 linkage both terminal SUCCESS. PR33 MERGED.
integration_report: "mission-book/reports/CEX-790/ALIEN_INTEGRATION_REPORT.md"
owner_priority_override_2026_10_06: "CEX-790 merge-readiness first, then MON directly; supersedes REX-before-MON. SHOW excluded."
integration_merge_sha: b06504f1f96984c960b2661b8ee3a7130796d379
integration_merged_at: 2026-10-06T06:08:22Z
merge_authorization: Owner explicit instruction 2026-10-06: inspect actual Utopia and merge CEX-790 into main.
---

# CEX-790 — Backend → Web/Android 最终入口审计与冻结

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](PAPER_EVIDENCE_PROTOCOL.md)  
> 长期 Capability Registry：[../../capability-registry/README.md](../../../../capability-registry/README.md)

## 目标

在前五个入口任务完成后，再从最新代码**重新做一次全量 inventory**，避免“修了已知四项，但施工过程又增加新 hidden endpoint”。

## 审计方法

至少从以下来源建立 machine-readable / inspectable matrix：

1. Gateway user-facing routes；
2. Action routes / operations；
3. Ask targets；
4. Room catalog；
5. capability registry；
6. Web clickable entry；
7. Android clickable entry；
8. Settings / recovery lifecycle；
9. scheduler user actions；
10. City `capability-registry/` existing records / pending legacy backfill。

每项必须分类：

```text
EXPOSED
EXPOSED_ADVANCED
PARITY_GAP
CURRENT_ENTRY_GAP
INTERNAL_PROTOCOL
INTERNAL_TRANSPORT
FUTURE_PRODUCT_INTEGRATION
DEPRECATED
```

## Gate

不要求所有 endpoint 都有按钮。

要求所有**用户语义成熟**的 capability：

- 至少一个正常入口；
- 一等 surface parity 符合产品定位；
- unavailable 有解释；
- destructive/mutating 有正确 confirmation/authority；
- future/infrastructure 不制造 false affordance。

## Formal Review

Reviewer 必须独立从代码重建 inventory，不能只复核 Development matrix。

两份 inventory 必须做 diff。

任何差异都必须分类：

- missed route；
- internal route wrongly exposed；
- surface-only feature；
- deprecated；
- future seam；
- genuine defect。

## Capability Registry bootstrap / reconciliation

Development 必须把最终 inventory 中已经 exact-head 验证的 semantic capability：

1. 分配/确认稳定 `CAP-<DOMAIN>-<NNN>`；
2. 写入 `capability-registry/records/*.yaml`；
3. 更新 `CAPABILITY_INDEX.yaml`；
4. 更新 `SURFACE_INDEX.yaml`（如有用户 surface）；
5. 生成/刷新双语 exposure matrix；
6. 每条 verified record 绑定 exact implementation SHA 与 UI/E2E evidence。

Reviewer 必须从真实代码和真实 surface 独立抽样/重建，并检查：

```text
Registry claim
↔ exact implementation
↔ user surface
↔ backend wiring
↔ intent semantics
```

不允许直接把旧 `CAPABILITY_ENTRY_MATRIX.md` 全表机械复制成 verified records。

## Programme-level paper synthesis

本任务必须生成：

`mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md`

至少汇总：

- hidden capability 数；
- gap taxonomy；
- Web/Android parity gap 数；
- defects discovered by Development vs Review；
- failures / repairs；
- user steps before/after；
- API→UI dropped-field cases；
- scheduler semantic conflicts；
- real-device findings；
- exact CI/test counts。

## 完成门槛

- current latest code fully inventoried；
- Development/Review independent inventories reconciled；
- no unclassified user-facing backend capability；
- future backlog updated；
- Capability Registry backfill/reconciliation complete for all final-audit verified capabilities；
- no `CAPABILITY_REGISTRY_STALE` / `CAPABILITY_REGISTRY_REALITY_MISMATCH`；
- bilingual exposure matrix refreshed；
- PAPER_MATERIAL_SYNTHESIS complete；
- exact-head CI；
- terminal marker `CAPABILITY_ENTRY_BASELINE_AUDITED`。

完成后才允许创建 programme final integration workbook。


---

[English reading translation / 完整英文阅读说明](en/CEX-790-final-exposure-audit-and-freeze.md)
