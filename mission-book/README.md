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

<!-- MISSION_PROGRESS:START -->
## 全城项目总进度（自动同步）

> **GENERATED VIEW — 禁止手工修改本区块。** 权威来源是各工作书 frontmatter；
> 总任务完成 = 已完成复检/验证/Correction 的完整工作书。历史项目的 Correction / Verification 统一折算为“复检”。
> FUTURE-only 计划（当前 FR-001）在正式激活为工作书前不计入分母。

**全城合计：总任务 80/93 · 开发 82/93 · 复检 80/93**  
**当前未收口项目池：总任务 14/27 · 开发 16/27 · 复检 14/27**

| 项目 | 总任务完成 | 开发完成 | 复检完成 | 状态 |
|---|---:|---:|---:|---|
| [Replant / MB-001~012](./finished/replant/) | **12/12** | **12/12** | **12/12** | COMPLETE |
| [Butler Assistant](./finished/completed-2026-10-01/MISSION_INDEX.md) | **9/9** | **9/9** | **9/9** | COMPLETE |
| [Remote Fabric](./finished/completed-2026-10-01/MISSION_INDEX.md) | **10/10** | **10/10** | **10/10** | COMPLETE |
| [General AI Gateway](./finished/completed-2026-10-01/MISSION_INDEX.md) | **9/9** | **9/9** | **9/9** | COMPLETE |
| [Engineering Manager](./finished/completed-2026-10-01/MISSION_INDEX.md) | **13/13** | **13/13** | **13/13** | COMPLETE |
| [Rescheduling vNext](./finished/completed-2026-10-03/README.md) | **4/4** | **4/4** | **4/4** | COMPLETE |
| [UI Civilization](./finished/completed-2026-10-03/README.md) | **5/5** | **5/5** | **5/5** | COMPLETE |
| [UI × Scheduler Integration](./finished/completed-2026-10-03/README.md) | **3/3** | **3/3** | **3/3** | COMPLETE |
| [MESH 三端互联](./finished/completed-2026-10-04/README.md) | **1/1** | **1/1** | **1/1** | COMPLETE |
| [Connection Onboarding](./connection-onboarding/README.md) | **3/4** | **4/4** | **3/4** | CLOSEOUT |
| [Workbench Compatibility](./workbench-compatibility-migration/README.md) | **3/4** | **3/4** | **3/4** | ACTIVE |
| [Capability Entry Closeout](./capability-entry-closeout/README.md) | **5/6** | **6/6** | **5/6** | IN_PROGRESS |
| [Research Strengthening](./research-strengthening/README.md) | **2/8** | **2/8** | **2/8** | ACTIVE |
| [City Work Monitor](./city-work-monitor-dashboard/README.md) | **1/4** | **1/4** | **1/4** | IN_PROGRESS |
| [SHOW-401 展示素材](./showcase-material-extraction/README.md) | **0/1** | **0/1** | **0/1** | IN_PROGRESS |

机器可读镜像：[MISSION_PROGRESS.json](./MISSION_PROGRESS.json)。
<!-- MISSION_PROGRESS:END -->

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
## 当前未收口工作书（自动同步）

> 只列仍未完成复检/验证的工作书；状态与阶段直接来自 frontmatter。

| ID | 项目 | 状态 | 开发 | 复检 |
|---|---|---|:---:|:---:|
| [JOIN-590](./connection-onboarding/JOIN-590-merged-main-physical-acceptance-and-closeout.md) | Connection Onboarding | READY | ✅ | — |
| [WBC-604](./workbench-compatibility-migration/WBC-604-execution-profile-switch-and-hybrid-routing.md) | Workbench Compatibility | WAITING_DEPENDENCIES | — | — |
| [CEX-790](./capability-entry-closeout/CEX-790-final-exposure-audit-and-freeze.md) | Capability Entry Closeout | IN_PROGRESS | ✅ | — |
| [REX-803](./research-strengthening/REX-803-scenario-runner-and-repetition-engine.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-804](./research-strengthening/REX-804-fault-injection-and-recovery-probes.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-805](./research-strengthening/REX-805-trace-replay-and-ablation.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-806](./research-strengthening/REX-806-metrics-analysis-and-artifact-export.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-807](./research-strengthening/REX-807-research-control-surface-and-progressive-disclosure.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [REX-890](./research-strengthening/REX-890-reproducibility-study-and-freeze.md) | Research Strengthening | WAITING_DEPENDENCIES | — | — |
| [MON-902](./city-work-monitor-dashboard/MON-902-overview-graph-and-node-path-inspector.md) | City Work Monitor | IN_PROGRESS | — | — |
| [MON-903](./city-work-monitor-dashboard/MON-903-event-triggered-decision-overlay.md) | City Work Monitor | WAITING_DEPENDENCIES | — | — |
| [MON-990](./city-work-monitor-dashboard/MON-990-cross-device-monitor-acceptance-and-freeze.md) | City Work Monitor | WAITING_DEPENDENCIES | — | — |
| [SHOW-401](./showcase-material-extraction/SHOW-401-Utopia项目展示素材提取与双Demo制作.md) | SHOW-401 展示素材 | IN_PROGRESS | — | — |

若此表与工作书冲突，以工作书 frontmatter 为准，并视为 homepage sync drift。
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
