# Mission Book — 当前施工监控看板

> 当前模式：**UI 文明化 → 再调度 vNext → UI/调度最终接线**  
> 控制仓库：zhiheng-zhang-Mera/Digital-City  
> 实现仓库：zhiheng-zhang-Mera/Utopia  
> 实体施工主机：**Alien + Mech**  
> 当前 Utopia 基线：`main @ e7c498f5acd86da324a45c3278219c8daa612561`  
> **常驻施工规则：** [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)  
> 过程数据规则：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)  
> 历史完成任务：[finished/completed-2026-10-01/](./finished/completed-2026-10-01/)

> **本 README 只做监控看板。** 任务领取、等待/唤醒、CI、双机分工、合并等规范统一读取 `CONSTRUCTION_RULES.md`；README 不作为 claim lock 或施工规则来源。

## 当前施工看板

| 工程项目 | 任务池 | 当前状态 | 施工 | 独立复核 | 下一门禁 |
|---|---|---|---:|---:|---|
| UI 文明化 | UI-000, UI-101..103, UI-190 | **ACTIVE** | **1/5** | **1/5** | **C′ 待 Mech 独立复核**（Owner 已裁决方向：C 主题 + HUD 紧凑化）→ UI-101..103 → UI-190 `UI_BASELINE_FROZEN` |
| 再调度 vNext | RS-201..203, RS-290 | **LOCKED** | **0/4** | **0/4** | UI-190 完成后解锁 |
| UI × 调度接线 | UXI-301, UXI-390 | **LOCKED** | **0/2** | **0/2** | RS-290 `RESCHEDULING_BASELINE_FROZEN` 后解锁 |

## 主机监控

| 主机 | 当前任务 | 角色 | 状态 | 等待分类 / 唤醒条件 |
|---|---|---|---|---|
| Alien | UI-000 修订 | Development | REVISION_DEV_COMPLETE | 产物 `c8b5cf5` 已推、CI `36862052788` 绿；按 §3 需 **Mech** 独立复核 C′，Alien 不得自审 |
| Mech | — | Review | **可领取** | 独立复核 `UI-000` 修订头 `c8b5cf5`（`revision_review_host_required: Mech`）。见 [Owner 裁决记录](./reports/UI-000/OWNER_STYLE_RULING.md) |

> `WAITING_ELIGIBILITY`、`STRUCTURALLY_INELIGIBLE`、`GLOBAL_EXTERNAL_BLOCK`、`POOL_TERMINAL` 的定义与重扫规则见 [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)。
> Alien 的零领取分类历史见 [零领取记录](./reports/DISPATCH_ALIEN_ZERO_CLAIM_2026-10-01.md)（§8 的 `GLOBAL_EXTERNAL_BLOCK` 已由 Owner 裁决解除）。

## 当前工作书

### UI 文明化
- [UI-000 — 视觉方向候选与审美门禁](./ui-civilization/UI-000-视觉方向候选与审美门禁.md)
- [UI-101 — Web 产品壳与信息架构](./ui-civilization/UI-101-Web产品壳与信息架构.md)
- [UI-102 — Android 产品壳与信息架构](./ui-civilization/UI-102-Android产品壳与信息架构.md)
- [UI-103 — Rooms 统一视觉与嵌入体验](./ui-civilization/UI-103-Rooms统一视觉与嵌入体验.md)
- [UI-190 — 跨端视觉审查与 UI 基线冻结](./ui-civilization/UI-190-跨端视觉审查与UI基线冻结.md)

### 再调度 vNext
- [RS-201 — 动态 AI 池与可用性选择](./rescheduling-vnext/RS-201-动态AI池与可用性选择.md)
- [RS-202 — 多设备并发感知与再调度](./rescheduling-vnext/RS-202-多设备并发感知与再调度.md)
- [RS-203 — 跨设备执行回传与降级恢复](./rescheduling-vnext/RS-203-跨设备执行回传与降级恢复.md)
- [RS-290 — 调度契约回归与基线冻结](./rescheduling-vnext/RS-290-调度契约回归与基线冻结.md)

### UI × 调度最终接线
- [UXI-301 — 调度状态接入非工程化 UI](./ui-integration/UXI-301-调度状态接入非工程化UI.md)
- [UXI-390 — 双机最终产品验收与收口](./ui-integration/UXI-390-双机最终产品验收与收口.md)

## 最近已完成阶段

| 阶段 | 结果 | 归档 |
|---|---|---|
| Butler Assistant + Remote Fabric + General AI Gateway + Engineering Manager | 41/41 两阶段完成，4/4 programme 合并完成 | [completed-2026-10-01](./finished/completed-2026-10-01/) |

## 最终目标

`UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`
