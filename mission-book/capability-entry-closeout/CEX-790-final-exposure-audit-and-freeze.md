---
workbook_id: CEX-790
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 790
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["CEX-701","CEX-702","CEX-703","CEX-704","CEX-705"]
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
dependencies: ["CEX-701:DEVICE_RECOVERY_ENTRY_ACCEPTED", "CEX-702:ALTERNATE_DEVICE_USER_CHOICE_EXPOSED", "CEX-703:CAPABILITY_CATALOG_DISCOVERABLE", "CEX-704:ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED", "CEX-705:ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
capability_ids: []
capability_registry_action: BACKFILL
capability_registry_refs: ["../../capability-registry/CAPABILITY_INDEX.yaml"]
capability_registry_sync_status: PENDING
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-790
terminal_marker: CAPABILITY_ENTRY_BASELINE_AUDITED
---

# CEX-790 — Backend → Web/Android 最终入口审计与冻结

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)  
> 长期 Capability Registry：[../../capability-registry/README.md](../../capability-registry/README.md)

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
