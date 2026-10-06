> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-010-foreman-scheduler-dag-worker-pool.md) 的原始 frontmatter 是唯一元数据来源。

# EM-010 — Foreman Queue / DAG / Resource Scheduling / Worker Pool

## 目标

在 connector 之上保留 Hns project-foreman 的有用 execution machinery：queue、dependency scheduling、isolated write、resource adaptation、可审计 convergence。

## 开发范围

- 实现 ordered/scheduled Engineering queue 和 durable job lifecycle，不依赖单 connector product。
- DAG node 支持 depends_on、write_scope、acceptance test；只运行 dependency satisfied 工作。
- concurrent writer 使用 isolated worktree/file ownership/conflict ceiling；报告 conflict，不自动合并不安全重叠。
- 保持 hardware/runtime resource ceiling 和带 hysteresis 的 adaptive worker count。
- 同 code path 支持 one-worker serial mode。
- connector selection 受 capability/readiness/auth 和 LOCAL_FIRST placement contract 约束。
- 集成 checkpoint/resume、stall/crash signal、bounded retry/reassignment、integration validation，不覆盖 Shared Task Core authority。
- 暴露可检查 queue/task/worker metric 和 evidence。

## 范围外

- Remote Fabric 实现；
- provider-specific prompt；
- City-wide project priority policy；
- worker 静默重设计架构。

## 必须验收

- 独立 DAG node 可并发，dependency/order constraint 保持；
- 两 writer 不同时不安全地写同 protected file/scope；
- resource pressure 缩减/暂停新工作，不把 completed work 错判失败；
- one-worker mode 使用同 lifecycle/acceptance path；
- retry/reassignment 不重复 terminal result 或 external side effect；
- scheduler 用 ConnectorPort/capability，不 provider-name conditional；
- controlled restart 后 queue 可 resume。

## 共享异步执行规则

- 从精确冻结 Engineering Manager baseline 创建分支，不从同级 EM 分支创建。
- Development 和 Correction 必须由不同物理宿主（Alien / Mech）执行。
- Development 推送任务分支，不合入 Utopia main。
- Correction 独立复检并直接修复同分支，也不合入 main。
- worker 绝不能等待同级 EM 任务；缺实现时使用 programme README 中稳定 port 和确定性 test double。
- worker 绝不能仅为本地测试通过而 merge/cherry-pick 同级 EM 分支。
- 等待 hosted CI、长本地测试、external login、provider check 时，继续独立范围内 tests/docs/evidence 或另一合资格 task/worktree，不闲置。
- 缺 Remote Fabric 或第三方 engineering software 不可用，只能阻塞真正外部验收步骤；记作 typed pending seam，不改写为成功，不停滞无关 EM 任务。
- report 按精确 task ID 放在 `mission-book/reports/${MISSION_ID}/`。
- DS-Hns 仅可按本项目描述的固定 donor 读取。复用实现成为带 provenance 的 Utopia-owned code；Utopia 不得取得对 DS-Hns repository 的 build/runtime dependency。
- Codex-Boss 不在范围内，本项目绝不能 clone、fetch、open、read、query、import、link、submodule、symlink 或调用它。

## 全局跨项目不闲置规则

本任务参与 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 定义的规范性全局 BA/RF/GAI/EM pool。

- 当时 Alien 和 Mech 均可用，Development 可立即领取。
- Development 绿色即有资格 Correction，必须由对侧物理宿主执行。
- 普通 claim truth 只写本工作书 frontmatter/reports；README/MISSION_INDEX 是 dashboard，不是 lock。
- hosted CI、长本地测试、provider check、Remote Fabric 等待绝不闲置设备。保留 claim，使用独立 worktree 领取另一合资格全局阶段。
- 缺 Remote Fabric 或 optional provider software，用稳定 port/double 和明确 deferred integration seam 表示；组件工作不等待。
- 只有新扫描 BA/RF/GAI/EM，确认无可执行 owned repair、无合资格对侧 Correction、无未领取 Development 后，宿主才停止领取。
