---
workbook_id: REX-801
phase: RESEARCH_STRENGTHENING
sequence: 801
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
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): baseline_anchor_mode=REMOTE_REF_EXACT_SHA_AT_CLAIM executed literally. `git fetch origin main` in zhiheng-zhang-Mera/utopia resolved refs/heads/main to the full SHA 0e9bea3ce739b979e582a428af8fb233045a5e75 (commit time 2026-10-05T00:23:19+11:00, 'Merge pull request #13 from zhiheng-zhang-Mera/fix/Alien-codex-host-inventory-retry'). required_ancestor_shas[0]=69a097b5394a9fece39dd11cc13f04c9b4d28bfe verified with `git merge-base --is-ancestor` -> ANCESTOR_OK. Required CI on exactly that sha, read from the Actions API and matched on headSha rather than from the generated UTOPIA_LIVE_STATUS.json: 'V0.2 checks' run 37205444427 COMPLETED SUCCESS and 'City linkage check' run 37205444385 COMPLETED SUCCESS. This is the SAME baseline SHA that WBC-602 claimed, measured again rather than carried over, so no MUTABLE_REFERENCE_STATE_DRIFT / STALE_EXECUTION_IDENTITY applies to this claim. INDEPENDENCE: WBC-601 (execution backend seam) and WBC-602 (node descriptor) are both unreviewed and unmerged, so neither is an ancestor of this baseline; REX-801 is therefore a research-layer contract built on accepted main and must not import or restate either task's new modules. Development worktree: D:/utopia-rex801 on branch rex/REX-801-experiment-manifest-registry, created from the resolved baseline SHA."
baseline_blocker: null
dependencies: []
development_host: "Mech"
development_branch: "rex/REX-801-experiment-manifest-registry"
research_evidence_applicability: "APPLICABLE"
long_horizon_context_evidence: "CAPTURED"
research_evidence_refs: ["mission-book/reports/REX-801/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: ["RS-G3-PASSIVE-EVIDENCE-PIPELINE"]
highest_research_grade_observed: G3_SPARSE_ACTIVE
research_capture_level: PRIORITY
state_identity_evidence: "CAPTURED"
state_identity_evidence_refs: ["mission-book/reports/REX-801/PAPER_MATERIAL_INDEX.md"]
development_head_sha: "8f8c521fc299d622093776615b653457d8833f96"
development_ci: "VERIFIED DEVELOPMENT HEAD: V0.2 checks run 37241196692 COMPLETED SUCCESS on headSha 8f8c521fc299d622093776615b653457d8833f96 (jobs: gateway-web success, android success), read from the Actions API and matched on headSha. INTEGRATION-READY CANDIDATE (recorded per CONSTRUCTION_RULES section 7 reconciliation after the external change of main moving from 0e9bea3ce739b979e582a428af8fb233045a5e75 to d3262ce2dd81e51a53e39e6f9add8dee650a7682): the branch was rebased onto current main and force-pushed with lease to ef89e917c0468b38ade26e666ca98c754ef8945a, conflict-free, and on that candidate the task's own acceptance was re-run and passed — 14/14 REX-801 tests, 4/4 tests/gateway.test.mjs, check-bilingual SYNCHRONIZED — plus V0.2 checks run 37241780688 COMPLETED SUCCESS on headSha ef89e917c0468b38ade26e666ca98c754ef8945a (gateway-web and android). development_head_sha remains 8f8c521 because that is the head the development evidence was produced on; WHICH head the opposite-host review verifies is the reviewer's decision, and this record deliberately does not pre-empt it. Local pre-push evidence on the verified development head: 14/14 new tests pass (9 contract conformance + 5 live-gateway); pnpm test 1251 tests / 1247 pass / 4 fail where 3 are the pre-existing host-city-launcher environmental block (a resident City holds coordination port 4389 on this host and those tests refuse to run by design) and 1 is a flaky pre-existing sandbox-build integration test (tests/theme-build-bridge.test.mjs, 32.7s under full-suite load, passes standalone at 29.5s and on re-run); city/test-all.mjs 1984 tests / 1977 pass / 7 skipped / 0 fail; apps/rooms 69/69; verify-promotion-history 10 records verified."
development_complete: true
review_host: Alien-codex
review_head_sha: "7e96a4d28f4cb701d7a0951bace69857c3228f32"
review_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37243645465"
review_complete: true
review_source_sha: "8f8c521fc299d622093776615b653457d8833f96"
capability_ids: [CAP-EXPERIMENT-MANIFEST-001]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-EXPERIMENT-MANIFEST-001.yaml"]
capability_registry_sync_status: RECONCILED
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: "VERIFIED — Web Advanced > Research imports authored JSON, validates without persistence, registers without execution, lists and inspects canonical documents; controlled browser reachability and refusal cases PASS. Fuller workflow remains REX-807."
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-801
terminal_marker: EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED
merged_main_sha: "e111eb2787e7464385b4b59e62e954ac1f5f678e"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "PR #25, integrated in the JOIN-590 closeout integration"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
---

# REX-801 — Experiment Manifest + Registry

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

建立机器可读 Experiment Manifest 与实验注册表，使每个研究问题都能绑定：

- question / hypothesis；
- topology；
- independent variables；
- dependent metrics；
- controls；
- repetitions；
- seed；
- required capabilities；
- stop conditions；
- artifact policy；
- exact software/config provenance。

## 最低 manifest

至少表达：

```text
experiment_id
question
topology
variables
metrics
repetitions
seed_policy
scenario_ref
fault_profile_ref
software_refs
research_signal_ids
research_grade_snapshot
control_plane_rule_version
authority_surfaces_if_applicable
acceptance
```

## 用户入口

属于 DIRECT_CONTROL。

必须预留稳定的 Research control contract，允许：

- list experiments；
- inspect manifest；
- create/import manifest；
- validate before run。

初期 UI 可在 Research/Advanced，不要求挤进主导航。

## Research-priority binding

Experiment Manifest 必须能显式声明其研究信号来自 `RESEARCH_SIGNAL_WATCHLIST.yaml`，尤其支持 G3/G4，而不是只写自由文本 topic。

最小要求：

- `research_signal_ids` 可为一个或多个 `RS-*`；
- `research_grade_snapshot` 记录 experiment 创建时的 G1–G4 快照；
- G4 experiment 可以记录 `authority_surfaces`、`control_plane_rule_version` 与 expected intervention/reachability state；
- grade 不是 novelty 保证，artifact export 必须保留 snapshot date；
- 未分类新现象使用 `UNCLASSIFIED_CANDIDATE`，不能由运行时 Agent 自动升级为 G4。

## 禁止

- manifest 成为第二 task database；
- 把实验描述写死成某一论文；
- 缺字段时编造默认 measurement；
- manifest 自动获得危险 fault 权限。

## Review

另一实体主机独立构造：

- malformed manifest；
- unknown capability；
- impossible topology；
- conflicting variables；
- duplicated experiment id；
- deterministic same-seed parsing。

## 素材

强制记录 schema 演化、拒绝案例、错误默认值、用户步骤、review disagreement。

## 完成门槛

- stable manifest；
- registry；
- validation；
- direct-control contract；
- opposite-host Review；
- exact-head CI；
- PAPER_MATERIAL_INDEX；
- exposure gate PASS。


---

[English reading translation / 完整英文阅读说明](./en/REX-801-experiment-manifest-and-registry.md)
