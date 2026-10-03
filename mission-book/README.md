# Mission Book — 当前施工监控看板

> 当前模式：**历史阶段已归档 → Hns/Codex 异步减压施工协议 ACTIVE → MESH-301 等待 Owner 激活**  
> 控制仓库：zhiheng-zhang-Mera/Digital-City  
> 实现仓库：zhiheng-zhang-Mera/Utopia  
> 当前 Utopia accepted baseline：`main @ ec12fd0831f31fd81aef9cd9dfb0c959d010f63b`；recorded main CI `37088960085` green。  
> 常驻施工规则：[CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)  
> 当前过渡施工协议：[ASYNC_RELIEF_CONSTRUCTION.md](./ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)

## 当前真实状态

| 项目 / 协议 | 状态 | 当前动作 |
|---|---|---|
| Hns/Codex 异步减压施工 | **ACTIVE / NORMATIVE / TRANSITIONAL** | 当前施工默认采用 Hns supervisor + Codex worker/critic/reviewer；普通技术问题不得直接升级 Owner |
| MESH-301 三端实机互联 | **DRAFT_PENDING_OWNER_APPROVAL / execution_enabled=false** | 已完成设计审计修正；唯一剩余 Owner gate = 是否激活开工 |
| Persistent Foreman Runtime / FR-001 | **FUTURE / NOT ACTIVE** | 只做未来计划记录，不抢占当前施工 |

当前没有可自动领取的产品工作书。MESH-301 未激活期间，施工池按 `TEMPORARILY_UNCLAIMABLE / WAITING_OWNER_ACTIVATION` 解释；不得把它误写成 POOL_TERMINAL，也不得为了保持主机忙而制造新任务。

## MESH-301 设计审计结果

[MESH-301 — 三端实机互联与相互指挥](./mesh-3end/MESH-301-三端实机互联与相互指挥.md)

原草案已修正六个问题：

1. Android 不再被当成伪 worker node；当前模型 = **Alien + Mech 两个 workers，Alien Web + Mech Web + Android 三个 control clients**。
2. 删除“是否扩展 RS presentation ALLOWED_ACTIONS 才能让 Android 下指令”的假 Owner 岔路；Android 已有 City task create path，真正缺口是 strict target-device routing intent。
3. 三端同步从“同一时刻强一致”改成 canonical server event `seq` + bounded convergence。
4. 不再写死历史 LAN/IP；claim-time 重新测量 route，只要求三个 control clients 指向同一个 `cityId`。
5. 删除“Mech 既是被测端点又是 Reviewer 是否冲突”的假 Owner 岔路；端点参与不等于 authorship，仍只要求 Development / Formal Review 不同实体主机。
6. 终态标记从 `THREE_END_MESH_RUNNING` 改成 `THREE_END_MESH_E2E_ACCEPTED`。

因此 MESH-301 现在只等待一项 Owner 决策：**激活 / 不激活**。

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

## 当前活跃 Mission Book 文件

- [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md) — 常驻规范；
- [ASYNC_RELIEF_CONSTRUCTION.md](./ASYNC_RELIEF_CONSTRUCTION.md) — 当前 Hns/Codex 异步减压施工协议；
- [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md) — 过程数据边界；
- [MESH-301](./mesh-3end/MESH-301-三端实机互联与相互指挥.md) — 草案，待激活；
- [FR-001 Persistent Foreman Runtime](./future-plans/FR-001-Persistent-Foreman-Runtime.md) — 未来计划，不激活。

## 当前主机角色

| 主机 | 当前产品 claim | 施工模式 |
|---|---|---|
| Alien | 无 | 可作为 Hns supervisor + Codex worker host；MESH 未激活前不制造新工作 |
| Mech | 无 | 可作为 Hns supervisor + Codex worker/reviewer host；MESH 未激活前不制造新工作 |

当 MESH-301 激活后，Development 与 Formal Review 继续使用不同实体主机；同一主机上的 fresh critic 只能做技术诊断，不能冒充跨机正式 Review。

## 控制面仍留在活跃面的已知问题

- [CONTROL_PLANE_DUPLICATE_KEYS_MECH.md](./reports/CONTROL_PLANE_DUPLICATE_KEYS_MECH.md)
- [CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md](./reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md)
- [CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md](./reports/CONTROL_PLANE_FRONTMATTER_SWEEP_MECH.md)
- `reports/validate_frontmatter.py` 仍留在活跃面作为控制面工具。

这些记录不自动授权新的修复任务；只有 Owner、新工作书或真实 in-scope defect 才能扩大施工。

## 长期方向

当前异步减压协议是 prompt/process 层的过渡方案。未来 FR-001 的目标是把 Hns supervisor、session recovery、Review→Repair、CI/event wake-up 与 escalation ladder 真正固化成 Persistent Foreman Runtime，从而让 Owner 只保留 L3 权限/价值判断。