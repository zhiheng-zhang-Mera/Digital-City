# Capability Entry Closeout / 能力入口补全工程

> **状态：READY / ACTIVE PROGRAMME**
>
> 本工程针对一个明确问题：**Utopia 已经实现了后端能力、API、状态机或运行路径，但普通用户在 Web / Android 前端没有直接入口、入口极难发现，或生命周期在最后一步断掉。**
>
> 本工程不以“多做功能”为目标，而以 **backend capability → discoverable user entry → complete user lifecycle** 为验收标准。
>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步减压施工：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 本工程论文素材协议：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)  
> 当前能力入口矩阵：[CAPABILITY_ENTRY_MATRIX.md](./CAPABILITY_ENTRY_MATRIX.md)  
> 明确延后项：[FUTURE_EXPOSURE_BACKLOG.md](./FUTURE_EXPOSURE_BACKLOG.md)

## 1. Owner 目标

解决以下类别的问题：

```text
backend semantics exists
        ↓
API / action route exists
        ↓
tests / runtime path exists
        ↓
BUT
        ↓
user cannot discover / invoke / complete it from normal UI
```

本 programme 必须区分三类情况：

1. **CURRENT ENTRY GAP** — 后端已经成熟，应立即补用户入口；
2. **SURFACE PARITY GAP** — Web 已能操作，但 Android 等一等 control surface 尚未补齐；
3. **FUTURE PRODUCT INTEGRATION** — 只有 contract / infrastructure，真正 runtime/product route 尚未完成；不得为了“有按钮”制造假入口。

## 2. 审计基线

本工程创建时曾使用 `codex/city-members-host-roles` 作为**历史发现来源**来盘点尚未合入 main 的能力，但它是可移动 branch，**不得作为任何施工 baseline 或验收证据**。

从本轮 control-plane reconciliation 起：

- 每个 CEX workbook 只认自己的 `required_ancestor_shas`；
- claim 时从 remote candidate ref 解析 full 40-character SHA；
- 只有 ancestry guard 全部满足才允许写入 `development_baseline_sha`；
- CEX-705 因 City Members / Host Roles 尚未形成 accepted exact SHA，保持 WAITING，不允许直接锚定开发 branch。

### Claim-time 基线规则

施工主机不得机械地从旧 main 开工。

每次 claim 必须：

1. 比较 Utopia `main` 与当前最新活跃产品分支；
2. 若 `codex/city-members-host-roles` 已合入 main，则从最新 main 开始；
3. 若仍未合入且目标功能只存在于该超集分支，则从该分支最新 exact head 建任务 branch，并记录 `development_baseline_ref/head`；
4. 若出现更新的功能超集分支，必须先做 scope reconciliation，证明其是 superseding product truth；
5. 不允许从落后基线“重新实现”已经存在的新功能。

最终 integration 仍必须按常驻规则从**当时最新 main**开始做 union / rebase / conflict reconciliation。

## 3. 当前确认的入口缺口

| 类别 | 能力 | 后端现状 | Web | Android | 本 programme |
|---|---|---|---|---|---|
| Current | device reinstall / rebind | route + identity lifecycle 已存在 | 无直接入口 | 无 | CEX-701 |
| Current | clone detection / credential conflict | API 已返回 cloneFindings | fetched but dropped | 无 | CEX-701 |
| Current | provider switch declined → alternate device | `switch-declined` + handoff 已存在 | 无正常动作入口 | 无 | CEX-702 |
| Current | capability catalog / “Utopia 能做什么” | `/ask/targets` 已存在 | Ask 失败后才出现 | Ask 失败后才出现 | CEX-703 |
| Parity | owner approve/reject join | API + Web 已存在 | 有 | 无 | CEX-704 |
| Parity | generate/share pairing session | API + Web 已存在 | 有 | Android 主要只有 join path | CEX-704 |
| Parity | City name / enrollment / revoke | API + Web Settings 已存在 | 有 | Settings 偏旧 | CEX-705 |
| Parity | member roles / sharing / messaging | API + Web 已存在 | 有 | 无 | CEX-705 |

## 4. 工作拆分

| ID | 工作 | 状态 | 目标 |
|---|---|---|---|
| [CEX-701](./CEX-701-device-recovery-rebind-and-clone-surface.md) | Device Recovery / Rebind / Clone Surface | READY | 把设备恢复与 clone finding 变成用户可完成的 Settings 流程 |
| [CEX-702](./CEX-702-scheduler-choice-and-alternate-device-entry.md) | Scheduler Choice / Alternate Device Entry | READY | 暴露“不要切服务，改用另一设备”路径；不滥用 generic CONFIRM |
| [CEX-703](./CEX-703-capability-catalog-discoverability.md) | Capability Catalog / Discoverability | READY | 让用户无需先 Ask 失败即可查看 Utopia 能做什么 |
| [CEX-704](./CEX-704-android-onboarding-owner-actions-parity.md) | Android Onboarding Owner Actions | READY | Android 补 join approval + pairing generation/share |
| [CEX-705](./CEX-705-android-member-device-management-parity.md) | Android Member / Device Management | WAITING_DEPENDENCIES | 等待 City Members / Host Roles accepted exact SHA 后再施工 |
| [CEX-790](./CEX-790-final-exposure-audit-and-freeze.md) | Final Exposure Audit / Freeze | WAITING_DEPENDENCIES | 再做一次 backend→surface 全量对账并冻结入口基线 |

CEX-701..705 可在文件 ownership 不冲突时双机并行；CEX-790 必须等待前五项全部 Development + opposite-host Formal Review 完成。

## 5. 双机异步防阻塞模式

本工程继续使用既有 Alien / Mech 双实体主机模式：

```text
Alien Development  → Mech Formal Review
Mech Development   → Alien Formal Review
```

并完整继承：

- atomic claim；
- 不同实体主机独立复核；
- CI / 长测试等待不占主机；
- event wake-up + 约 20 分钟 bounded re-scan；
- Review → Repair 自动回接；
- zero-claim typed classification；
- no make-work；
- exact-head CI / evidence；
- latest-main integration refresh。

本工程不得因为“前端入口”看似简单就降低独立复核要求。入口缺陷往往只在真实页面/真实设备上出现，Formal Review 必须主动寻找**“后端有，但用户实际点不到 / 点了走错语义 / 按钮存在但不生效”**的反例。

## 6. 强制论文素材留存

本工程所有任务都必须执行 [PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)。

最低要求不是只保存成功结果，而是保存：

- 每次真实运行报错；
- test / CI failure；
- browser / Android page-level failure；
- stale state / race / timing anomaly；
- 设计假设与 runtime truth 冲突；
- Web / Android 行为不一致；
- Development / Formal Review 结论冲突；
- rejected approach；
- repair 前后对比；
- latency / retry / convergence / resource / test-count 等可量化数据；
- Owner intervention；
- 最终 exact-head / merged-main acceptance。

**失败不能被“修掉后顺便删掉”。** 论文最有价值的往往正是 defect → diagnosis → repair → independent verification 这一段。

## 7. 范围保护

允许：

- 给已存在、稳定的 backend capability 补直接入口；
- 把已有 API / Action route 接到前端；
- 改善发现性与正常用户路径；
- Web / Android surface parity；
- 必要的最小 DTO / presentation adapter；
- 为入口闭环补测试、E2E、真实设备证据。

禁止：

- 为了做按钮重写 backend ownership；
- 重写 Remote Fabric / Shared Task Core / Engineering Manager / General AI Gateway；
- 把只有 contract、没有 runtime 的 future capability 伪装成可用产品；
- 新造第二套 device registry / scheduler / task truth；
- 为“UI 完整”擅自引入新的危险权限或长期 secret；
- 把 debug endpoint 机械做成按钮。

## 8. Final merge lock

现在**不创建 final merge workbook**。

只有 CEX-701..705 均满足：

- Development complete；
- opposite-host Formal Review complete；
- exact-head CI green；
- required Web/Android real-surface evidence complete；
- `PAPER_MATERIAL_INDEX.md` 完整；
- 无 unresolved Owner gate；

才允许 CEX-790 完成最后审计，然后创建 integration workbook。

最终 terminal marker：

`CAPABILITY_ENTRY_BASELINE_EXPOSED_AND_AUDITED`

该 marker 只表示**当前已成熟能力的入口完整性**，不表示 FUTURE_EXPOSURE_BACKLOG 中的 runtime 尚未完成项目已经产品化。
