# Reading translation / 阅读译本

[Canonical source / 权威原文](../README.md)

This page translates the explanatory body of a historical reading snapshot; generated bilingual navigation/dashboard blocks are available at the canonical source. Source SHA256: `f4311c6b31e5173d8e3d3ed0542b9519e699b64e71c815b36a9cea6a21db5a40`. Current canonical workbooks and records determine authority and state; this page grants no execution or claim authority.

本页为历史阅读快照的完整解释正文译本；已双语的生成导航/面板见权威原文。当前任务状态以canonical工作书和记录为准，本页不授予执行或领取权。

# Mission Book

> Capability inventory and user exposure truth: [capability-registry/README.md](../../capability-registry/README.md), the current construction-monitoring board.
>
> Current mode: **workbook frontmatter is the dynamic authority; the generator synchronizes homepage progress, replacing manually maintained status counts.**
> Control repository: zhiheng-zhang-Mera/Digital-City.
> Implementation repository: zhiheng-zhang-Mera/Utopia.
> Utopia implementation status is no longer manually hardcoded; use generated [UTOPIA_LIVE_STATUS.md](.././UTOPIA_LIVE_STATUS.md) / [UTOPIA_LIVE_STATUS.json](.././UTOPIA_LIVE_STATUS.json).
> Standing construction rules: [CONSTRUCTION_RULES.md](.././CONSTRUCTION_RULES.md).
> Transitional construction protocol: [ASYNC_RELIEF_CONSTRUCTION.md](.././ASYNC_RELIEF_CONSTRUCTION.md).
> Process-data rules: [PROCESS_DATA_POLICY.md](.././PROCESS_DATA_POLICY.md).
> Research signal priorities: [RESEARCH_SIGNAL_WATCHLIST.yaml](.././RESEARCH_SIGNAL_WATCHLIST.yaml).

## Non-parked programme desk

The current [main desk](../README.md#未挂起系列主台--non-parked-programme-desk) consolidates registered programmes and non-parked future planning. This navigation change does not authorize starting, claiming or reviewing work; existing states and execution flags remain unchanged. Parked programmes stay in their separate index.

## Parked expansion and migration series

See the complete [parked programme index](.././PARKED_PROGRAMMES.md).

- [PCF — Personal Compute Fabric](.././personal-compute-fabric/README.md): **PARKED / NOT ACTIVATED**. Twenty-five bilingual planning workbooks, 19 core and six optional, support versioned deepening of existing tasks and additional subtasks. Execution is disabled, anchors remain empty, and the series neither enters current statistics nor changes Utopia runtime. Expansion and activation rules are in its directory.
- [DGX — Deliberative Governance Expansion & Migration](.././deliberative-governance-expansion-migration/README.md): **PARKED / NOT ACTIVATED**. Every workbook has execution_enabled=false; baseline/dependency exact SHAs intentionally remain empty. Only explicit Owner activation permits re-resolution against then-current canonical truth and atomic anchoring. This series is outside the active pool and may not be claimed merely because its directory exists.

## MESH-301 design-audit results

[MESH-301 — Three-end physical interconnection and mutual command](.././finished/completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md)

The original draft corrected six issues:

1. Android is no longer a fictitious worker node. The model is **two workers, Alien and Mech, plus three control clients, Alien Web, Mech Web and Android**.
2. Removed the false Owner decision about extending RS presentation ALLOWED_ACTIONS to let Android issue commands. Android already has a City task-create path; the real gap was strict target-device routing intent.
3. Three-end synchronization changed from simultaneous strong consistency to canonical server event seq and bounded convergence.
4. Historical LAN/IP values are no longer fixed. Routes are remeasured at claim time; only all three control clients pointing at the same cityId is required.
5. Removed the false Owner decision about Mech being both tested endpoint and Reviewer. Endpoint participation is not authorship; Development and Formal Review still require different physical hosts.
6. The terminal marker changed from THREE_END_MESH_RUNNING to THREE_END_MESH_E2E_ACCEPTED.

These audit issues were handled before or during formal construction. MESH-301 completed three-end physical interconnection, strict target-device routing, independent Formal Review, review-finding repairs, main merge and merged-main CI, recording THREE_END_MESH_E2E_ACCEPTED.

## Completed / archived

- [Finished index](.././finished/README.md): unified historical entry for all completed programmes; COMPLETE items are no longer repeated on the main task board.
- [completed-2026-10-06](.././finished/completed-2026-10-06/README.md): Connection Onboarding is 4/4 complete and registered as archived; canonical JOIN-590 retains its path to stabilize historical links.
- [completed-2026-10-04](.././finished/completed-2026-10-04/README.md): MESH-301 plus JOIN-501/502/503 component workbooks; exact component SHAs are fixed and historical files are no longer claimable.

## Completed stages archived on 2026-10-03

Archive entry: [finished/completed-2026-10-03](.././finished/completed-2026-10-03/README.md).

| Stage | Terminal state | Archive |
|---|---|---|
| UI Civilization | 5/5 Development and Review complete; UI_BASELINE_FROZEN | [ui-civilization](.././finished/completed-2026-10-03/ui-civilization/) |
| Rescheduling vNext | 4/4 Development and Review complete; RESCHEDULING_BASELINE_FROZEN | [rescheduling-vnext](.././finished/completed-2026-10-03/rescheduling-vnext/) |
| UI × scheduler wiring / closeout | UXI-301/390/391 all terminal; UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED plus REMOTE_HANDOFF_CLOSEOUT_REPAIRED | [ui-integration](.././finished/completed-2026-10-03/ui-integration/) |
| Process reports for those stages | Dispatch, review, zero-claim and task reports left the active surface | [reports](.././finished/completed-2026-10-03/reports/) |

Earlier completed Butler Assistant, Remote Fabric, General AI Gateway and Engineering Manager remain at:

- [finished/completed-2026-10-01](.././finished/completed-2026-10-01/).

## Current host roles

| Host | Current product claim | Construction mode |
|---|---|---|
| Alien | None | May act as Hns supervisor and Codex worker host; currently reclaims work only when a new workbook or Owner gate unlocks it. |
| Mech | None | May act as Hns supervisor and Codex worker/reviewer host; currently maintains event wake and low-cost waiting, without inventing work. |

MESH-301 Development and Formal Review used different physical hosts. Subsequent workbooks retain this independence. A fresh critic on the same host may perform technical diagnosis but cannot impersonate cross-host Formal Review.

## Known control-plane issues retained on the active surface

- [CONTROL_PLANE_DUPLICATE_KEYS_MECH.md](.././reports/CONTROL_PLANE_DUPLICATE_KEYS_MECH.md).
- [CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md](.././reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md).
- [CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md](.././reports/CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md).
- reports/validate_frontmatter.py remains on the active surface as a control-plane tool.

These records do not automatically authorize new repairs. Scope may expand only through Owner instruction, a new workbook or a real in-scope defect.

## Long-term direction

The asynchronous relief protocol is a transition at the prompt/process layer. Future FR-001 aims to embody Hns supervision, session recovery, Review→Repair, CI/event wake and the escalation ladder in a Persistent Foreman Runtime, leaving Owner only L3 authority and value judgments.

## Capability Registry linkage

Mission Book tracks **work execution**; ../capability-registry/ tracks **current verified capability reality**.

For every new or materially changed capability:

```text
workbook declares CAP-* + registry action
→ Development updates candidate Registry state
→ exact-head UI/backend/E2E verification
→ Formal Review reconciles Registry ↔ runtime reality
→ workbook closeout
```

The governing rules are CONSTRUCTION_RULES.md §14A–§14C. A task with CAPABILITY_REGISTRY_STALE or CAPABILITY_REGISTRY_REALITY_MISMATCH is not formally closed even if implementation tests are green.
