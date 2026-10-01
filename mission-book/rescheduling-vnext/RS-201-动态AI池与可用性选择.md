---
workbook_id: RS-201
phase: RESCHEDULING_VNEXT
sequence: 201
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-190"]
development_host: Alien
development_claimed_at: 2026-10-01T22:24:26Z
development_branch: rs/RS-201-dynamic-ai-pool
development_baseline_sha: de91f5e381e3283fd60d539bca0c1435de8f79ff
development_claim_basis: "Claimed by Alien immediately on the dependency gate opening, recorded because the timing is the point rather than an incidental detail. RS-201's only dependency is UI-190, whose completion gate required the step-7 FINAL_VISUAL_PREVIEW owner gate and the step-8 merge and UI_BASELINE_FROZEN declaration. The Owner approved the gate, the branch was merged as de91f5e and main CI 36934564790 was confirmed green on that merge head, so UI_BASELINE_FROZEN is declared and this task's dependency is satisfied. baseline_policy is CLAIM_TIME_MAIN, so the baseline is main AS OF THIS CLAIM, de91f5e381e3283fd60d539bca0c1435de8f79ff, which is the freeze merge and therefore the correct starting point: RS-201 builds on the frozen UI contract rather than on a pre-freeze tree. Claimed before any other host could take it, since the unlock makes this and RS-202 the only two claimable tasks in the whole pool."
development_host_note: "Development host is Alien (this machine). Section 3 requires the Review host to be a DIFFERENT machine, so RS-201's Review must be taken by Mech and Alien must not review its own development. Alien will not self-review any part of this task."
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/RS-201/
---

# RS-201 — 动态 AI 池与可用性选择

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 本工作书只定义任务特有 scope / dependency / acceptance；通用 claim、等待/唤醒、CI、双机独立与 merge 规则以常驻规则书为准。

## 目标
把 General AI Gateway 的 provider/model/account 从固定二选一思维扩展为动态池，并支持用户可配置、区域可用性、账号/session 可用性和显式切换选择。

## 依赖
只有 UI-190 产生 \`UI_BASELINE_FROZEN\` 后解锁。基线必须从该时点最新 Utopia main 领取。

## 核心语义
- provider/model 数量动态变化，设备数量也动态变化；
- 默认可保留无需区域特判的基础 provider，但用户可以增删可选 provider；
- Claude/Gemini 等存在区域限制的 provider 允许出现在 registry，但不可用时必须是明确 \`UNAVAILABLE\`，不能被选中；
- availability 至少区分：可用、区域不支持、未登录/凭据缺失、session 失效、服务故障、用户禁用、未知；
- “建议切换”与“自动执行切换”分离：预算/服务切换前保留显式用户选择；
- UI 只消费稳定状态；本任务不得自行添加最终页面。

## 允许修改边界
General AI registry/provider/session/availability contract、对应 runtime/adapters/tests；可新增稳定 presentation DTO/port，但不得绑定具体 UI 框架。

## 禁止修改边界
- 不改 UI design system；
- 不把某一 provider 写死为永久唯一 fallback；
- 不伪造地区支持或登录状态；
- 不因 provider 不可用就把它从 registry 永久删除。

## 施工步骤
1. 审核现有 GAI-002/003/004/005 已合并实现，明确 registry 与 runtime seams。
2. 建立动态 provider/model/account records 与用户启用/禁用语义。
3. 建立 lifecycle-aware availability probe/cache，避免 stale availability 被当成实时真相。
4. 建立“候选列表 + 不可选原因 + 用户确认”稳定输出。
5. 覆盖 provider 添加、删除、禁用、恢复、区域不支持、登录过期、临时故障、fallback 候选为空。
6. 不允许 availability 探针阻塞整个 Ask/Do 主路径；慢探针必须 bounded/degraded。

## 独立复核
另一台主机重点攻击：stale region/session、provider 删除后残留引用、availability flap、unknown 被误判 available、被禁用 provider 仍被 scheduler 选择、选择确认被绕过。

## 完成门槛
- 动态池不是固定二选一；
- 不可用 provider 仍可解释但不可选；
- 用户配置增删/启停有测试；
- availability 生命周期与失败降级有测试；
- hosted CI 全绿；
- 不包含最终 UI 设计。


## 绑定常驻规则
本任务继承 [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)。特别是：同任务 Development/Review 不得同主机；等待不独占主机；零领取必须分类；`WAITING_ELIGIBILITY` 事件唤醒优先、约 20 分钟兜底重扫；外部恢复后必须 reconciliation；CI/evidence 必须绑定 exact head；不得制造假工作或擅自扩大范围。

## Reports / evolution
- City 只保存有界结论、SHA、CI 和异常摘要。
- 调度冲突、handoff、fallback、busy/unavailable 样本按 PROCESS_DATA_POLICY 写入 Utopia evolution evidence。
