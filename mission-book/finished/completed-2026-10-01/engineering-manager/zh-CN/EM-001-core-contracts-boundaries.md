> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-001-core-contracts-boundaries.md) 的原始 frontmatter 是唯一元数据来源。

# EM-001 — 核心契约与工程所有权边界

## 目标

定义可安全替换的 Engineering Manager contract，在 provider-specific 工作进入前明确 Foreman / Worker Gateway / Shared Task Core 边界。

## 开发范围

- 增加版本化 EngineeringManagerPort、ConnectorPort、ConnectorRegistryPort、EngineeringRemoteExecutionPort contract。
- 定义 canonical engineering job、connector instance、execution host、owner/coordinator、executor、lease/reference identifier。
- 预留 ENGINEERING 为 product/task semantic route，不将 HNS/CODEX/CLAUDE/WORKBUDDY 暴露为顶层 task ownership route。
- City/Shared Task Core 保持 canonical task truth；Engineering Manager 仅存储/拥有 contract 允许的 Engineering execution state、checkpoint、evidence、connector runtime state。
- 定义 submit/control/result 的 idempotency/replay/version rule，防止 retry/reconnect 重复 job 或副作用。
- 记录与 General AI Gateway、Butler Assistant、Remote Fabric、City-wide authorization 的分离。

## 范围外

- provider-specific process invocation；
- Remote Fabric 实现；
- UI redesign；
- credential storage 实现。

## 必须验收

- 不重新定义既有 ROOM/CAPABILITY/CITY_TASK/GENERAL_AI 语义；
- unknown version/state/route 被拒绝，不猜测；
- owner/coordinator 与 current executor 是独立字段；
- Engineering Manager 不能成为第二 canonical City task 数据库；
- core contract 不要求 provider product name；
- canonical contract 无 raw secret/cookie/token field。

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
