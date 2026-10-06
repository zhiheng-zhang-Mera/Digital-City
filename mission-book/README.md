# Mission Book

> Capability inventory / user exposure truth: [../capability-registry/README.md](../capability-registry/README.md) — 当前施工监控看板

> 当前模式：**工作书 frontmatter 为动态权威；主页进度由生成器强制同步，不再手工维护状态统计。**  
> 控制仓库：zhiheng-zhang-Mera/Digital-City  
> 实现仓库：zhiheng-zhang-Mera/Utopia  
> Utopia 实现状态不再手工硬编码；以自动生成的 [UTOPIA_LIVE_STATUS.md](./UTOPIA_LIVE_STATUS.md) / [UTOPIA_LIVE_STATUS.json](./UTOPIA_LIVE_STATUS.json) 为准。  
> 常驻施工规则：[CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)  
> 当前过渡施工协议：[ASYNC_RELIEF_CONSTRUCTION.md](./ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)  
> 研究信号优先级：[RESEARCH_SIGNAL_WATCHLIST.yaml](./RESEARCH_SIGNAL_WATCHLIST.yaml)

## 未挂起系列主台 / Non-parked programme desk

本区集中展示已登记系列及未挂起的未来规划。**本次仅整理入口，暂不启动、领取或复检任务。** 当前工作书状态与执行开关保留；已完成系列只供查阅，未来规划不纳入活跃统计。挂起/停放系列仍见 [停放索引](./PARKED_PROGRAMMES.md)。

This desk lists registered programmes and non-parked future planning. **This change organizes navigation only; do not start, claim or review tasks.** Existing workbook states and execution flags remain unchanged. Completed programmes are references; future planning stays outside active totals. Suspended/parked programmes remain in the [parked index](./PARKED_PROGRAMMES.md).

| 系列 / Programme | 记录状态 / Recorded state | 当前安排 / Instruction |
|---|---|---|
| [Replant / MB-001~012](./finished/replant/) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Butler Assistant](./finished/completed-2026-10-01/MISSION_INDEX.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Remote Fabric](./finished/completed-2026-10-01/MISSION_INDEX.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [General AI Gateway](./finished/completed-2026-10-01/MISSION_INDEX.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Engineering Manager](./finished/completed-2026-10-01/MISSION_INDEX.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Rescheduling vNext](./finished/completed-2026-10-03/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [UI Civilization](./finished/completed-2026-10-03/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [UI × Scheduler Integration](./finished/completed-2026-10-03/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [MESH 三端互联](./finished/completed-2026-10-04/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Connection Onboarding](./finished/completed-2026-10-06/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Workbench Compatibility](./workbench-compatibility-migration/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Capability Entry Closeout](./capability-entry-closeout/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [Research Strengthening](./research-strengthening/README.md) | IN_PROGRESS | 仅导航，暂不领取 / Navigation only, do not claim |
| [City Work Monitor](./city-work-monitor-dashboard/README.md) | COMPLETE | 已完成，历史查阅 / Complete, historical reference |
| [SHOW-401 展示素材](./showcase-material-extraction/README.md) | IN_PROGRESS | 仅导航，不执行 / Navigation only, excluded from execution |
| [FR-001 — Persistent Foreman Runtime](./future-plans/FR-001-Persistent-Foreman-Runtime.md) | FUTURE / NOT ACTIVATED | 仅规划，暂不启动 / Planning only, do not start |

<!-- MISSION_PROGRESS:START -->
## 全城项目总进度 / Citywide progress (generated)

> **GENERATED VIEW — 禁止手工修改 / Do not hand-edit.** 工作书frontmatter为权威 / Workbook frontmatter is authoritative.
> 总完成以复检/验证完成计 / Total completion means completed review, verification or correction; historical stages use the same definition.
> FUTURE-only计划激活前不计入分母 / Future-only plans are excluded until formally activated as workbooks.
> 完成系列导航 / Completed programme navigation: [finished/README.md](./finished/README.md). They remain in overall totals and MISSION_PROGRESS.json.

**全城合计 / Overall: 总任务 / Tasks 89/93 · 开发 / Development 90/93 · 复检 / Review 89/93**
**当前未收口池 / Active pool: 总任务 / Tasks 19/23 · 开发 / Development 20/23 · 复检 / Review 19/23**

| 项目 / Programme | 总完成 / Complete | 开发 / Development | 复检 / Review | 状态 / Status |
|---|---:|---:|---:|---|
| [Research Strengthening](./research-strengthening/README.md) | **5/8** | **6/8** | **5/8** | IN_PROGRESS |
| [SHOW-401 展示素材](./showcase-material-extraction/README.md) | **0/1** | **0/1** | **0/1** | IN_PROGRESS |

机器镜像 / Machine-readable view: [MISSION_PROGRESS.json](./MISSION_PROGRESS.json).
<!-- MISSION_PROGRESS:END -->

## 暂停中的扩建迁移系列

完整导航见 [停放系列索引](./PARKED_PROGRAMMES.md)。

- [PCF — Personal Compute Fabric / 增强个人异构计算织网](./personal-compute-fabric/README.md) — **PARKED / NOT ACTIVATED**。25 份规划工作书（19 核心 + 6 可选），中英双语；支持版本化加深已有任务及追加子任务。执行关闭、锚点留空，不进入当前统计、不改变 Utopia 运行。扩容与激活规则见系列目录。
- [DGX — Deliberative Governance Expansion & Migration / 审议治理扩建迁移](./deliberative-governance-expansion-migration/README.md) — **PARKED / NOT ACTIVATED**。所有工作书 `execution_enabled=false`，baseline/dependency exact SHA 当前故意留空；仅在 Owner 显式激活后按当时 canonical truth 重新解析并原子锚定。本系列不计入当前活跃施工池，不得仅因目录存在而 claim。

## MESH-301 设计审计结果

[MESH-301 — 三端实机互联与相互指挥](./finished/completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md)

原草案已修正六个问题：

1. Android 不再被当成伪 worker node；当前模型 = **Alien + Mech 两个 workers，Alien Web + Mech Web + Android 三个 control clients**。
2. 删除“是否扩展 RS presentation ALLOWED_ACTIONS 才能让 Android 下指令”的假 Owner 岔路；Android 已有 City task create path，真正缺口是 strict target-device routing intent。
3. 三端同步从“同一时刻强一致”改成 canonical server event `seq` + bounded convergence。
4. 不再写死历史 LAN/IP；claim-time 重新测量 route，只要求三个 control clients 指向同一个 `cityId`。
5. 删除“Mech 既是被测端点又是 Reviewer 是否冲突”的假 Owner 岔路；端点参与不等于 authorship，仍只要求 Development / Formal Review 不同实体主机。
6. 终态标记从 `THREE_END_MESH_RUNNING` 改成 `THREE_END_MESH_E2E_ACCEPTED`。

上述设计审计问题均已在正式施工前/施工中处理。MESH-301 已完成三端实机互联、strict target-device routing、独立 Formal Review、review finding 修复、main merge 与 merged-main CI，并记录终态 `THREE_END_MESH_E2E_ACCEPTED`。

## 已完成 / 已归档

- [finished 总索引](./finished/README.md) — 所有已完成 programme 的统一历史入口；主任务栏不再重复展示 COMPLETE 项目。
- [completed-2026-10-06](./finished/completed-2026-10-06/README.md) — Connection Onboarding 4/4 已完成并登记归档；canonical JOIN-590 工作书保留原路径以保持历史链接稳定。

- [completed-2026-10-04](./finished/completed-2026-10-04/README.md) — MESH-301 + JOIN-501/502/503 component workbooks；组件 exact SHAs 已固定，历史文件不再可 claim。

## 已完成阶段 — 2026-10-03 归档

归档入口：[finished/completed-2026-10-03](./finished/completed-2026-10-03/README.md)

| 阶段 | 终态 | 归档 |
|---|---|---|
| UI 文明化 | 5/5 Development + Review complete；`UI_BASELINE_FROZEN` | [ui-civilization](./finished/completed-2026-10-03/ui-civilization/) |
| 再调度 vNext | 4/4 Development + Review complete；`RESCHEDULING_BASELINE_FROZEN` | [rescheduling-vnext](./finished/completed-2026-10-03/rescheduling-vnext/) |
| UI × 调度接线 / 收尾 | UXI-301/390/391 全部终态；`UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED` + `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` | [ui-integration](./finished/completed-2026-10-03/ui-integration/) |
| 上述阶段过程报告 | dispatch / review / zero-claim / task reports 已离开活跃面 | [reports](./finished/completed-2026-10-03/reports/) |

更早完成的 Butler Assistant / Remote Fabric / General AI Gateway / Engineering Manager 继续位于：

- [finished/completed-2026-10-01](./finished/completed-2026-10-01/)

<!-- ACTIVE_WORKBOOKS:START -->
## 当前未收口工作书 / Open workbooks (generated)

> 列出未完成复检的工作书 / Lists workbooks without completed review; status and stages come directly from frontmatter.

| ID | 项目 / Programme | 状态 / Status | 开发 / Development | 复检 / Review |
|---|---|---|:---:|:---:|
| [REX-806](./research-strengthening/REX-806-metrics-analysis-and-artifact-export.md) | Research Strengthening | IN_PROGRESS | ✅ | — |
| [REX-807](./research-strengthening/REX-807-research-control-surface-and-progressive-disclosure.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-890](./research-strengthening/REX-890-reproducibility-study-and-freeze.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [SHOW-401](./showcase-material-extraction/SHOW-401-Utopia项目展示素材提取与双Demo制作.md) | SHOW-401 展示素材 | IN_PROGRESS | — | — |

冲突以工作书为准 / Workbook frontmatter prevails on disagreement; treat the difference as homepage sync drift.
<!-- ACTIVE_WORKBOOKS:END -->

## 当前主机角色

| 主机 | 当前产品 claim | 施工模式 |
|---|---|---|
| Alien | 无 | 可作为 Hns supervisor + Codex worker host；当前仅在新工作书/Owner gate 解除后重新领取工作 |
| Mech | 无 | 可作为 Hns supervisor + Codex worker/reviewer host；当前保持事件唤醒/低成本等待，不制造新工作 |

MESH-301 已按不同实体主机完成 Development / Formal Review。后续新工作书继续遵守同样的实体主机独立性；同一主机上的 fresh critic 只能做技术诊断，不能冒充跨机正式 Review。

## 控制面仍留在活跃面的已知问题

- [CONTROL_PLANE_DUPLICATE_KEYS_MECH.md](./reports/CONTROL_PLANE_DUPLICATE_KEYS_MECH.md)
- [CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md](./reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md)
- [CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md](./reports/CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md)
- `reports/validate_frontmatter.py` 仍留在活跃面作为控制面工具。

这些记录不自动授权新的修复任务；只有 Owner、新工作书或真实 in-scope defect 才能扩大施工。

## 长期方向

当前异步减压协议是 prompt/process 层的过渡方案。未来 FR-001 的目标是把 Hns supervisor、session recovery、Review→Repair、CI/event wake-up 与 escalation ladder 真正固化成 Persistent Foreman Runtime，从而让 Owner 只保留 L3 权限/价值判断。

## Capability Registry linkage

Mission Book tracks **work execution**; `../capability-registry/` tracks **current verified capability reality**.

For every new or materially changed capability:

```text
workbook declares CAP-* + registry action
→ Development updates candidate Registry state
→ exact-head UI/backend/E2E verification
→ Formal Review reconciles Registry ↔ runtime reality
→ workbook closeout
```

The governing rules are `CONSTRUCTION_RULES.md §14A–§14C`.

A task with `CAPABILITY_REGISTRY_STALE` or `CAPABILITY_REGISTRY_REALITY_MISMATCH` is not formally closed even if implementation tests are green.
