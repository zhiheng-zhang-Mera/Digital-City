---
workbook_id: RS-201
phase: RESCHEDULING_VNEXT
sequence: 201
execution_enabled: true
status: NOT_STARTED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-190"]
development_host: null
development_branch: null
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


## 双机领取与并发规则
- Development 与独立 Review 必须由不同实体主机完成。
- claim 后使用独立 branch/worktree；hosted CI、长测试或外部 provider 等待不独占主机。
- 未满足 dependencies 时不得先写未定义的集成逻辑；空闲主机领取同阶段其他可执行任务。
- 普通组件任务不得直接合并 Utopia main；阶段冻结工作书负责 union、回归、CI 与 main merge。

## Reports / evolution
- City 只保存有界结论、SHA、CI 和异常摘要。
- 调度冲突、handoff、fallback、busy/unavailable 样本按 PROCESS_DATA_POLICY 写入 Utopia evolution evidence。
