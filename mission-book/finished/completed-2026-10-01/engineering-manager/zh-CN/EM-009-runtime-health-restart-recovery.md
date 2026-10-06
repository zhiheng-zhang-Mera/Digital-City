> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-009-runtime-health-restart-recovery.md) 的原始 frontmatter 是唯一元数据来源。

# EM-009 — Runtime Ownership、健康、重启与恢复

## 目标

将可复用 Hns 长期托管安全模型移入 Engineering Manager，让 connector/worker 长期运行，不授予 health monitor 破坏性 restart authority。

## 开发范围

- 按 connector/instance/worker identity 泛化 runtime ownership record，验证 stale PID/process。
- recovery 层限定 process/runtime scope。跨设备 network/session reconnect 属 Remote Fabric；process restart 仅在 domain reconciliation 与当前 task/lease validation 后执行。
- health sensing/pressure decision 与 restart execution 分离。
- 保留 HEALTHY/ELEVATED/DEGRADED/CRITICAL/UNKNOWN health 语义，有用时带 confidence/freshness。
- 实现 bounded heartbeat/liveness/readiness、restart budget、cooldown/backoff、crash-loop ladder、safe mode。
- restart 前要求 checkpoint/continuity hook，restart 后 readiness 达成才 resume。
- 防止 terminal job 在 restart 后重现于 active queue。
- restart supervisor 对 process/business 保持中立，监督 connector/worker runtime instance。

## 范围外

- Engineering job planning；
- Remote Fabric node restart；
- 非明确独立 interface 的 machine reboot policy；
- core 中 provider-specific health heuristic。

## 必须验收

- source/permission test 证明 monitor 不直接 execute restart；
- restart executor 无 authority 发明 health pressure policy；
- stale/dead ownership 不杀死复用 PID 的无关 process；
- restart budget 终止于 safe mode，不无限循环；
- required readiness/checkpoint reconciliation 后才 resume；
- terminal job recovery 后不复活；
- 一个 connector crash 不终止无关 connector/Utopia。

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
