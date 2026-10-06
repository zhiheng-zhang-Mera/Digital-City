# Owner Response / Mission Report Decisions

**Date:** 2026-09-30  
**Scope:** Digital-City `mission-book` reports through MB-009  
**Authority:** This file records the Owner rulings requested by Migration / Verification reports. These rulings are active unless superseded by a later Owner response.

---

## R1 — MB-003 Worker Gateway: real provider gate

**Report:** `reports/MB-003/VERIFICATION_REPORT.md` §6  
**Decision:** **DO NOT WAIVE THE REAL-PROVIDER GATE. AUTHORISE A SUPERSEDING EXECUTION-SEAM MISSION.**

MB-003 的核心价值就是 Worker Gateway 的真实 provider execution。当前迁移体已经有 adapter/contracts/resilience，但 donor 的真实 runner/provider execution seam 被 deferred；因此不能把 bounded unit/integration chain 当作真实 detect→submit→progress→result 路径。

裁决：

1. MB-003 继续保持 `verification_status: BLOCKED_OWNER_DECISION`，当前 branch **不得 merge main**。
2. 不接受 mock provider、不接受“结构完整即可”。
3. 授权后续建立一个 superseding / completion Mission，范围仅限**迁入 donor 已存在的真实 provider/runner execution seam**并与 MB-003 接通，不得借机新增 planner、vendor UI 或新的 provider 语义。
4. 新 Mission 分配主机时，先 probe 两台实体主机的 donor-supported provider/runtime；**把具备真实可执行环境的主机保留给 Verification**，另一台负责 Migration。
5. superseding Mission 完成真实 provider 路径后，再决定 MB-003 是由该 Mission supersede-close，还是回到原 branch 完成最终 Verification；不得提前宣称 MB-003 complete。

---

## R2 — MB-004 §6.1: Foreman 未经过 MB-003 路由

**Report:** `reports/MB-004/VERIFICATION_REPORT.md` §6.1  
**Decision:** **ACCEPT THE EXISTING REAL JOB + ZERO-COUPLING RESULT AS SUFFICIENT FOR MB-004.**

MB-004 已真实执行 Engineering job、checkpoint/continuation、ownership refusal 与 result/evidence；两侧 donor 在当时没有可合法迁移的 glue seam，把 Foreman 强行接进未合并的 MB-003 反而会发明行为。

因此：

- MB-004 的既有 `COMPLETE / COMPLETE` 不重开；
- “必须通过 MB-003 路由”这一历史条款不再作为 MB-004 blocker；
- 等 MB-003/superseding execution seam 最终进入 main 后，可以做一次**非阻塞 smoke/integration check**，但它不是 MB-004 acceptance 的追补条件。

---

## R3 — MB-004 §6.2: 非产品模块进入 capability list

**Report:** `reports/MB-004/VERIFICATION_REPORT.md` §6.2  
**Decision:** **ACCEPT `capabilityProvider:false` AS THE CITY-LEVEL MECHANISM.**

非产品能力来源的 module 不应仅因为位于 `domain` district 就自动出现在 Web/Android capability surface。

裁决：

- module-level `capabilityProvider:false` 是正式 City mechanism；
- capability registry/enumeration 必须尊重它；
- 不要求每个 Mission 自己打特殊补丁；
- 当前 Utopia main 已采用该机制，视为该 Owner decision 的实现。

MB-004 当时出现的 Project Foreman `BRIDGE_PENDING` 暴露问题视为**已解决的历史观察**。

---

## R4 — MB-005 / MB-006: “two hosts” wording

**Reports:**  
- `reports/MB-005/VERIFICATION_REPORT.md` §6.1  
- `reports/MB-006/VERIFICATION_REPORT.md` §5.2

**Decision:** **ACCEPT READING 1.**

“两个主机 / 两台主机分别运行”的默认含义是：

> 同一 Mission 的 Migration Host 与 Verification Host 是两个不同实际主机，并且各自留下该 Mission 要求的真实运行证据。

不要求第三台机器，也不要求第二个 Verification Host。

因此 MB-005、MB-006 的现有完成状态成立，不需要追加一台机器重跑。

未来若某项验证真的需要“两台额外物理设备同时参与”，必须在 mission-specific gate 中明确写出，不再用模糊的“两台主机”表达。

---

## R5 — MB-005 `bandKeyOf` donor bug

**Report:** `reports/MB-005/VERIFICATION_REPORT.md` §7.2  
**Decision:** **PRESERVE IT IN THE MIGRATION; DO NOT FIX IT INSIDE MB-005.**

该行为是冻结 donor 的真实语义，MB-005 在 `MIGRATION_ONLY` 下照搬并用测试钉住是正确的。

裁决：

- 不重开 MB-005；
- 不在 migration branch 中修复；
- 将其视为**非阻塞 donor defect / post-migration backlog**；
- 若 Utopia 后续真实产品使用证明该行为需要修正，另开普通 bugfix / semantic-change 工作，不再称为 donor migration。

---

## R6 — MB-007 Research Institute: product-consumption gate

**Report:** `reports/MB-007/MIGRATION_REPORT.md` §4 D1  
**Decision:** **ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN VERIFICATION.**

已确认：

- 五个 module 已迁移；
- parity / required CI 已绿；
- `capabilityProvider:false` 保证产品 capability surface 未被伪造扩张；
- Utopia 当前不存在语义等价的现有产品 seam；
- 为了满足旧 gate 新增 Web/Android capability 会违反 migration-only 边界。

因此采用 v2 规则：

> 对没有等价现有消费面的 infrastructure/pipeline module，Verification Host 可使用真实、bounded、可复现的研究链路直接执行迁移模块，作为真实消费证据。

**Owner hereby declares MB-007 Migration complete.**  
Verification 必须由不同于 Alien 的主机执行，并在开始时先同步最新 Utopia main、重新复核 parity / known differences / bounded chain。

---

## R7 — MB-008 Computer Use Runtime: product-consumption gate

**Report:** `reports/MB-008/MIGRATION_REPORT.md` §5  
**Decision:** **ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN VERIFICATION.**

MB-008 已实际测得 `NO_VERDICT_IDENTICAL_SEAM`，候选 seam 存在量化语义反例；强行接线会新增产品行为或改变现有判定。

因此与 MB-007 相同：

- 不新增 UI；
- 不新增 capability 只为过 gate；
- 不把别的 Building 的 module 偷接进来；
- 允许 Verification Host 通过真实 bounded Computer-Use chain 直接验证迁移模块的 contract/safety/recovery/postcondition 行为。

**Owner hereby declares MB-008 Migration complete.**

注意：这项豁免不等于“Computer Use 已成为完整可用产品 runtime”。报告已明确 runtime plane 未全部迁入；Verification 只能验证本 Mission 声明的迁移边界，不能把 deferred 能力写成已完成。

---

## R8 — MB-009 building-level `kind`

**Report:** `reports/MB-009/VERIFICATION_REPORT.md` §5.4  
**Decision:** **ACCEPT BUILDING-LEVEL `kind` AS A CITY-LEVEL MECHANISM.**

正式接受：

- district 提供默认 `kind`；
- building 可显式覆盖；
- `buildingKind(district, building)` / 等价单一判定点负责 effective kind；
- `00-foundation` 可以整体是 `infrastructure`，同时 `05-control-centre` 作为 `domain` capability building；
- 不重划当前 ownership，不建立 superseding Mission。

MB-009 已完成并进入 main，不重开。

---

## R9 — “MB-009 will be the third mission blocked by product-consumption gate”

**Source:** MB-007/008 报告与旧 `MISSION_INDEX.md` 的前瞻性描述  
**Decision:** **HISTORICAL / SUPERSEDED.**

MB-009 最终存在真实 Theme capability consumption，并已完成 Migration + Verification + merge。旧文本只是当时尚未验证时的预测，不再作为当前状态。

---

## R10 — Historical index observations / non-blocking backlog

以下不是当前 Mission blocker，统一分类：

| Observation | Owner response |
|---|---|
| `tests/capability-adapters.test.mjs` 绝对 `catalog.length === 6` | **RESOLVED on current main**；继续使用相对 census + 绝对 adapter invariant |
| Project Foreman 被枚举成不可调用 capability | **RESOLVED** by `capabilityProvider:false` |
| `checkManifestAgainstTree` 看不见未声明目录 | **OPEN BACKLOG**；待当前 integration backlog 清理后独立修 |
| `DONOR.json` 顶层 / `donors[]` 两种形状 | **OPEN BACKLOG**；先定义兼容 reader/schema，再迁移历史记录 |
| Mission Index 无法直观看 host eligibility | **RESOLVED AT RULE LEVEL**；v2 要求 Index 尽量显示 eligible host，但 Claim 真值仍在 Mission front matter |
| promotion hub 不携带 relocation current path | **NON-BLOCKING**；继续以 manifest / DONOR.json 为当前位置真值 |
| promotion verifier 读 HEAD 而非 worktree | **NON-BLOCKING UX ISSUE**；可单独改善提示 |
| Windows shell `pwsh` 不在 PATH | **ENVIRONMENT NOTE**；该环境使用 `powershell.exe` |
| registry/adapter 改动后 stale gateway 仍服务旧内存表 | **OPERATIONS NOTE**；真实消费验证前必须确认相关服务已重启到目标 HEAD |

---

## Immediate scheduling effect

本 Owner response 生效后：

1. **禁止新开 MB-010/011/012**；它们仍 disabled。
2. **MB-007 与 MB-008 由 BLOCKED → Migration COMPLETE / Verification OPEN。**
3. **MB-003 继续 BLOCKED**，等待 authorised superseding execution-seam Mission。
4. 当前调度采用 `README.md` v2 的 **integration-first + WIP limit 2**。
5. 任何下一位实际触碰 MB-003/007/008 branch 的 worker，先记录一次 `OWNER_INTERVENTION` event，引用本文件，再执行后续工作。

语言配对 / Language pair: [English reading](./en/response-9-29.md)
