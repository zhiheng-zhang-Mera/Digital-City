# Mission Book — 当前施工监控看板

> 当前模式：**UI 文明化 → 再调度 vNext → UI/调度最终接线（收口中）**  
> 控制仓库：zhiheng-zhang-Mera/Digital-City  
> 实现仓库：zhiheng-zhang-Mera/Utopia  
> 实体施工主机：**Alien + Mech**  
> 当前 Utopia 基线：`main @ 1a5bc0ee825c681636b9611efa2163f458c0a76f`（RS-290 冻结合并）  
> **常驻施工规则：** [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)  
> 过程数据规则：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)  
> 历史完成任务：[finished/completed-2026-10-01/](./finished/completed-2026-10-01/)

> **本 README 只做监控看板。** 任务领取、等待/唤醒、CI、双机分工、合并等规范统一读取 `CONSTRUCTION_RULES.md`；README 不作为 claim lock 或施工规则来源。
>
> **本轮更新（2026-10-02T10:47Z，Alien，随 Owner 裁决一并提交）：** 上一版看板停留在「UI 文明化 ACTIVE 1/5、再调度 vNext LOCKED」的旧状态，与实测不符。下表全部按工作书 frontmatter 与 `git ls-remote` 实测重写，不沿用记忆中的状态。
>
> **步骤 5 更新（2026-10-02T11:05Z，Alien）：** UXI-390 的 Owner 极简视觉包**已交付**——Web Home / Ask / Tools / 一个真正打开的 Room / 一个 provider 决策态，Android Home / Ask / Rooms，全部真机或真浏览器实拍共 8 张，另有 2 份 capture receipt（含逐图 SHA-256 与拍摄时可见文本）。图片在实现仓库，City 只存索引：见 [FINAL_VISUAL_PREVIEW_PACKAGE.md](./reports/UXI-390/FINAL_VISUAL_PREVIEW_PACKAGE.md)。实现头 `149a4c14b596b92f04fab6269eca1dcb7727303f`，其 hosted CI run `36998342105` 已 **completed success（android + gateway-web 双绿）**，因此 `development_complete = true`，任务**已释放给 Review**（§3：复核必须由 Mech 担任，Alien 不得自审）。
>
> **最终接受（2026-10-02T14:35Z，Alien）：** UXI-390 已按工作书第 7 步并入 Utopia `main`（合并提交 `d0507b0`，`--no-ff`，父提交 `1a5bc0e` + reviewed head `6a82e35`），合并树与 reviewed head **逐字节一致**；**main hosted CI `37020640107` 双 job 全绿**。门项 6（你的目视裁决）、7（main CI）、8（终态标记 `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`）全部达成。**仍未达成且不被接受所修复的**：门项 3 的 remote handoff 子项保持 NOT MET（你选项 1 裁决所接受的延期）。
>
> **目视门更新（2026-10-02T11:20Z，Alien）：** Owner 对这 8 张实拍作出 **`FINAL_VISUAL_ACCEPTANCE` 通过**裁决，**未要求修改**——门项 6 由 NOT MET 转为 **MET**。**但这不等于验收完成**：独立复核（Mech）、步骤 7 合并 + main CI、终态标记仍未完成。同时清理了本地废弃文件（51 个已关闭任务的 worktree，实测约 4.6 GB；明细见裁决记录）。

## 当前施工看板

| 工程项目 | 任务池 | 当前状态 | 施工 | 独立复核 | 下一门禁 |
|---|---|---:|---:|---:|---|
| UI 文明化 | UI-000, UI-101..103, UI-190 | **COMPLETE** | **5/5** | **5/5** | 无 —— `UI_BASELINE_FROZEN` 已宣告 |
| 再调度 vNext | RS-201..203, RS-290 | **COMPLETE** | **4/4** | **4/4** | 无 —— `RESCHEDULING_BASELINE_FROZEN` 已宣告，merge `1a5bc0e`，main CI `36964619541` 双 job 绿 |
| UI × 调度接线 | UXI-301, UXI-390 | **COMPLETE（阶段已接受）** | **2/2** | **2/2** | 无 —— **Mech 复核 PASS**（`6a82e35`，含必做修复 C-1/C-2 的确认）→ **步骤 7 已合并** `d0507b0`（`--no-ff`，合并树与 reviewed head 逐字节一致）→ main CI `37020640107` 双绿 → **终态标记已宣告** |

计数口径：**施工** = `development_complete: true` 的任务数，**独立复核** = `review_complete: true` 的任务数，逐工作书读取 frontmatter 而非推断。**全部 11 本工作书现均为 true/true**，池中无未完成任务。

## 主机监控

| 主机 | 当前任务 | 角色 | 状态 | 等待分类 / 唤醒条件 |
|---|---|---|---|---|
| Alien | — （阶段已收口） | Development | **DONE** | 阶段完成：UXI-390 开发交付 → 必做修复 C-1/C-2 应用（`6a82e35`）→ 步骤 7 合并（`d0507b0`）→ main CI 双绿 → 终态标记宣告。Alien 全程未复核自身产出。 |
| Mech | — （阶段已收口） | Review | **DONE（PASS）** | 认领 `13:05:47Z`（前置 13/13 对账）→ 独立核验 8 个门项 → verdict `REVIEW_COMPLETE — PASS WITH REQUIRED REPAIRS` → 作者修复后**在设备上确认并升级为 PASS**（`6a82e35`，`review_ci: 37019678027`）。它还主动关闭了自己声明的边界（独立测量 Android 失败+恢复 6/6、设备卡降级 7/7）。 |

## Owner 裁决记录（本阶段）

| 裁决 | 结论 | 记录 |
|---|---|---|
| UXI-390 远程 handoff（`ALTERNATE_DEVICE`）延期 | **选项 1：维持延期，理由更正为「City 不发布五维负载向量，未测量负载按设计不可作为备选」；门项保持明确 NOT MET；冻结的 RS-290 契约不变。** 选项 2（City 开始发布真实负载向量 + 界面接通拒绝切换路径）属**新产品能力 = 新任务**，本轮不启动 | [RECORD_ALIEN_UXI390_OWNER_RULING_OPTION1.md](./reports/UXI-390/RECORD_ALIEN_UXI390_OWNER_RULING_OPTION1.md) |
| UXI-390 最终目视门（`FINAL_VISUAL_ACCEPTANCE`） | **通过**：Owner 对步骤 5 的 8 张实拍（Web Home/Ask/Tools/打开的 Room/provider 决策态、Android Home/Ask/Rooms）裁决通过，**未要求修改**。**门项 6 由 NOT MET 转为 MET**；但独立复核、步骤 7 合并与终态标记仍未完成 | [RECORD_ALIEN_UXI390_OWNER_VISUAL_RULING_PASSED.md](./reports/UXI-390/RECORD_ALIEN_UXI390_OWNER_VISUAL_RULING_PASSED.md) |

## Alien 零领取分类（§5）

| 轮次 | 分类 | 结构原因 | 记录 |
|---|---|---|---|
| 197 | `5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY` | 池中唯一未完成任务 UXI-390 由 Alien 持有，其剩余步骤一为 Owner 裁决（已解除）、一为 Mech 复核（§3 禁止自审）；其余 10 个工作书与 `finished/` 归档全部终态 | [ZERO_CLAIM_ALIEN_ROUND197_SECTION_5_1.md](./reports/ZERO_CLAIM_ALIEN_ROUND197_SECTION_5_1.md) |
| 198 | `5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY` | 条件已变化并记在这里：UXI-390 **开发完成并释放 Review**（`development_complete = true`，head `149a4c1`，CI 双绿），复核按 §3 只能是 **Mech** 的，Alien 不得自审；池中其余任务与 `finished/` 归档全部终态。唤醒条件：**Mech 完成复核** 或 **Owner 给出 FINAL_VISUAL_ACCEPTANCE 裁决**（材料已就绪，见交付包） | [FINAL_VISUAL_PREVIEW_PACKAGE.md](./reports/UXI-390/FINAL_VISUAL_PREVIEW_PACKAGE.md) |

> `WAITING_ELIGIBILITY`、`STRUCTURALLY_INELIGIBLE`、`GLOBAL_EXTERNAL_BLOCK`、`POOL_TERMINAL` 的定义与重扫规则见 [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)。
> Owner gate 归 `5.1` 而非 `5.3`：§5.1 第 110 行把「Owner gate 解除」明确列为可解锁施工的事件（沿用 Mech 对 UI-190 Owner gate 的同一推理）。

## 控制面已知缺陷

| 缺陷 | 范围 | 本轮状态 |
|---|---|---|
| 工作书正文 GBK 双重编码（仓库内不可读） | **UI-102、RS-290、UXI-301** | **未修复，故意不修**：三者均已关闭，其中 RS-290 已冻结、UXI-301 已按具体字节复核；单方面改写已关闭、已按字节复核的记录等同篡改他机记录。发现与不修理由见 [Mech 报告](./reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md) |
| 同上 | **UXI-390** | **已修复**：该文件作者即 Alien，损坏进入 Alien 自己的领取 commit `1199229`，故在复核之前修复。正文按 Owner 原始修订 `2a319ce` **逐字恢复**，并以探针证明「53/53 行只是丢字节、无正当编辑」，frontmatter 除本轮 3 个新键外逐字节不变。见 [修复脚本](./reports/UXI-390/REPAIR_uxi390_workbook_body_encoding.mjs)、[探针](./reports/UXI-390/PROBE_uxi390_workbook_encoding.mjs) |
| 校验器只校验结构、不校验文本完整性 | `reports/validate_frontmatter.py` | 建议增补「双重编码」检测（Mech 报告 §7）；本轮**未改**，属控制面工具变更，留待 Owner |

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

| 阶段 | 结果 | 归档 / 依据 |
|---|---|---|
| Butler Assistant + Remote Fabric + General AI Gateway + Engineering Manager | 41/41 两阶段完成，4/4 programme 合并完成 | [completed-2026-10-01](./finished/completed-2026-10-01/) |
| UI 文明化（UI-000 / 101 / 102 / 103 / 190） | 5/5 施工与复核完成，`UI_BASELINE_FROZEN` | 工作书见上 |
| 再调度 vNext（RS-201 / 202 / 203 / 290） | 4/4 施工与复核完成，`RESCHEDULING_BASELINE_FROZEN`，`main @ 1a5bc0e` | 工作书见上 |

## 最终目标

`UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`

**状态：已宣告**（2026-10-02T14:35Z）。依据：reviewed head `6a82e35` 经 Mech `REVIEW_COMPLETE — PASS`、Owner `FINAL_VISUAL_ACCEPTANCE` 通过；步骤 7 合并提交 `d0507b0` 的 main CI `37020640107` 双 job 绿。
