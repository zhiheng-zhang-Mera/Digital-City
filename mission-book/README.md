# Mission Book — 当前施工监控看板

> 当前模式：**历史阶段已归档 → MESH-301 COMPLETE → SHOW-401 素材提取进行中 + Connection Onboarding + Workbench Compatibility + Capability Entry Closeout ACTIVE**  
> 控制仓库：zhiheng-zhang-Mera/Digital-City  
> 实现仓库：zhiheng-zhang-Mera/Utopia  
> Utopia 实现状态不再手工硬编码；以自动生成的 [UTOPIA_LIVE_STATUS.md](./UTOPIA_LIVE_STATUS.md) / [UTOPIA_LIVE_STATUS.json](./UTOPIA_LIVE_STATUS.json) 为准。  
> 常驻施工规则：[CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)  
> 当前过渡施工协议：[ASYNC_RELIEF_CONSTRUCTION.md](./ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)

## 当前真实状态

| 项目 / 协议 | 状态 | 当前动作 |
|---|---|---|
| Hns/Codex 异步减压施工 | **ACTIVE / NORMATIVE / TRANSITIONAL** | 当前施工默认采用 Hns supervisor + Codex worker/critic/reviewer；普通技术问题不得直接升级 Owner |
| MESH-301 三端实机互联 | **COMPLETE / THREE_END_MESH_E2E_ACCEPTED** | 已完成 Alien Development + Mech Formal Review + main merge + merged-main CI；当前无可继续领取的 MESH 工作 |
| SHOW-401 项目展示素材提取 | **IN_PROGRESS / execution_enabled=true** | 录制主 Demo + handoff 技术 Demo + 3 张截图 + 结果表 + 套磁/项目页核心文案；严禁修改 Utopia 产品代码 |
| Connection Onboarding / JOIN-501..503 | **READY / execution_enabled=true** | 复用已完成 Remote Fabric，把新 PC 入城从 URL/token 手工连接优化为 nearby discovery + approval + enrollment + automatic reconnect；临时配对码只允许主动生成，ACTIVE 期间固定到消费/过期 |
| Workbench Compatibility / WBC-601..604 | **ACTIVE / execution_enabled=true** | additive compatibility migration：STANDARD_DEVICES 保持当前 Windows 默认；预埋 WORKER_POOL / HYBRID backend、node capability/resource 与 headless agent seam；无 Workbench 环境必须完整可用 |
| Capability Entry Closeout / CEX-701..790 | **ACTIVE / execution_enabled=true** | 补齐“后端已实现但用户无入口/难发现”的前端最后一公里；当前重点 = rebind/clone、alternate-device choice、能力目录、Android onboarding/member 管理 parity；所有任务强制留论文素材索引 |
| Persistent Foreman Runtime / FR-001 | **FUTURE / NOT ACTIVE** | 只做未来计划记录，不抢占当前施工 |

MESH-301 的产品施工已经完成。Owner 当前同时保留 **SHOW-401** 非产品素材提取工作、**Connection Onboarding** 产品优化 programme、**Workbench Compatibility Migration** 基础设施兼容 programme，以及 **Capability Entry Closeout** 前端能力入口补全 programme。JOIN-501/502/503 只允许在已完成的 Remote Fabric 上做 pairing/onboarding/integration 优化，不得复活 RF-001..010 或重写 transport/trust 基础设施。WBC-601..604 只允许做 additive execution compatibility：当前 STANDARD_DEVICES / Windows 双机路径必须保持默认可用，Workbench/Linux 不得成为启动依赖；WBC-601 与 WBC-602 可并行，WBC-603/604 必须遵守依赖解锁。CEX-701..705 只允许把已经成熟的 backend/API/action 变成可发现、可完成的用户路径，不得把 General AI / Butler Assistant / Engineering Manager 等尚未形成完整 runtime/product route 的 future seam 伪装成可用按钮；CEX-790 负责最终 backend→Web/Android 独立双线审计。所有 CEX 任务按 `capability-entry-closeout/PAPER_EVIDENCE_PROTOCOL.md` 强制保存 runtime error、test/CI failure、逻辑冲突、repair 前后数据与 opposite-host finding 的论文素材索引。SHOW-401 仍只能运行/观察已接受的 Utopia，不得修改 Utopia tracked source/test/docs；其只读边界不得被其它 programme 借用或突破。UI-190 / UXI-390 的 Owner 视觉 gate 与 XX-000 disabled placeholder 仍保持原状态。

## MESH-301 设计审计结果

[MESH-301 — 三端实机互联与相互指挥](./mesh-3end/MESH-301-三端实机互联与相互指挥.md)

原草案已修正六个问题：

1. Android 不再被当成伪 worker node；当前模型 = **Alien + Mech 两个 workers，Alien Web + Mech Web + Android 三个 control clients**。
2. 删除“是否扩展 RS presentation ALLOWED_ACTIONS 才能让 Android 下指令”的假 Owner 岔路；Android 已有 City task create path，真正缺口是 strict target-device routing intent。
3. 三端同步从“同一时刻强一致”改成 canonical server event `seq` + bounded convergence。
4. 不再写死历史 LAN/IP；claim-time 重新测量 route，只要求三个 control clients 指向同一个 `cityId`。
5. 删除“Mech 既是被测端点又是 Reviewer 是否冲突”的假 Owner 岔路；端点参与不等于 authorship，仍只要求 Development / Formal Review 不同实体主机。
6. 终态标记从 `THREE_END_MESH_RUNNING` 改成 `THREE_END_MESH_E2E_ACCEPTED`。

上述设计审计问题均已在正式施工前/施工中处理。MESH-301 已完成三端实机互联、strict target-device routing、独立 Formal Review、review finding 修复、main merge 与 merged-main CI，并记录终态 `THREE_END_MESH_E2E_ACCEPTED`。

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
- [MESH-301](./mesh-3end/MESH-301-三端实机互联与相互指挥.md) — `COMPLETE / THREE_END_MESH_E2E_ACCEPTED`；
- [SHOW-401 项目展示素材提取](./showcase-material-extraction/SHOW-401-Utopia项目展示素材提取与双Demo制作.md) — `IN_PROGRESS`，非产品只读运行任务；
- [Connection Onboarding](./connection-onboarding/README.md) — `READY`；JOIN-501/502/503 为产品连接体验优化，复用已验收 Remote Fabric；
- [JOIN-501](./connection-onboarding/JOIN-501-pairing-session-lifecycle-and-display.md) — 临时配对码显式生成 + ACTIVE 固定显示直到消费/过期；
- [JOIN-502](./connection-onboarding/JOIN-502-nearby-pc-discovery-and-owner-approval.md) — nearby PC discovery + existing trusted endpoint approval；
- [JOIN-503](./connection-onboarding/JOIN-503-device-enrollment-and-tokenless-reconnect.md) — 首次登记后 routine reconnect 不再要求手输 bare token；
- [Workbench Compatibility Migration](./workbench-compatibility-migration/README.md) — `ACTIVE`；保持 STANDARD_DEVICES/Windows 为默认可用基线，预埋未来 Worker Pool / Hybrid 切换；
- [WBC-601](./workbench-compatibility-migration/WBC-601-execution-backend-contract-and-standard-default.md) — `READY`；包装现有 execution path 为 STANDARD_DEVICES backend，第一阶段不得改变调度结果；
- [WBC-602](./workbench-compatibility-migration/WBC-602-node-role-capability-resource-descriptor.md) — `READY`；建立 additive Node Role / Capability / Resource descriptor 与 legacy defaults；
- [WBC-603](./workbench-compatibility-migration/WBC-603-worker-pool-and-headless-node-agent-seam.md) — `WAITING_DEPENDENCIES`；待 WBC-601/602 accepted 后建立 dormant Worker Pool + headless agent seam；
- [WBC-604](./workbench-compatibility-migration/WBC-604-execution-profile-switch-and-hybrid-routing.md) — `WAITING_DEPENDENCIES`；待 WBC-603 accepted 后建立 STANDARD / WORKER_POOL / HYBRID 可逆切换；
- [Capability Entry Closeout](./capability-entry-closeout/README.md) — `ACTIVE`；修复已存在能力的入口/可发现性/跨 surface parity，禁止 fake future capability；
- [Capability Entry Matrix](./capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md) — 当前 backend→Web/Android 入口分类与差距；
- [Paper Evidence Protocol](./capability-entry-closeout/PAPER_EVIDENCE_PROTOCOL.md) — CEX programme 强制论文素材留存规则；
- [CEX-701](./capability-entry-closeout/CEX-701-device-recovery-rebind-and-clone-surface.md) — `READY`；rebind / reinstall recovery + clone finding 用户闭环；
- [CEX-702](./capability-entry-closeout/CEX-702-scheduler-choice-and-alternate-device-entry.md) — `READY`；拒绝切 provider → 改用另一设备的可执行用户选择；
- [CEX-703](./capability-entry-closeout/CEX-703-capability-catalog-discoverability.md) — `READY`；直接查看 Utopia 全部当前可执行能力；
- [CEX-704](./capability-entry-closeout/CEX-704-android-onboarding-owner-actions-parity.md) — `READY`；Android join approval + pairing generation/share；
- [CEX-705](./capability-entry-closeout/CEX-705-android-member-device-management-parity.md) — `READY`；Android City/device/member/sharing/message 管理 parity；
- [CEX-790](./capability-entry-closeout/CEX-790-final-exposure-audit-and-freeze.md) — `WAITING_DEPENDENCIES`；前五项完成后独立重建 backend→surface inventory 并冻结入口基线；
- [Future Exposure Backlog](./capability-entry-closeout/FUTURE_EXPOSURE_BACKLOG.md) — General AI / Assistant / Engineering Manager / Android interactive Rooms / Workbench UI 等明确延后项；
- [FR-001 Persistent Foreman Runtime](./future-plans/FR-001-Persistent-Foreman-Runtime.md) — 未来计划，不激活。

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