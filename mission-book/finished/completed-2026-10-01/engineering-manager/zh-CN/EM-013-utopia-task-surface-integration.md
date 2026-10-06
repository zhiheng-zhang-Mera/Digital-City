> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-013-utopia-task-surface-integration.md) 的原始 frontmatter 是唯一元数据来源。

# EM-013 — Shared Task Core 与 Utopia 工程控制面集成

## 目标

将 Engineering Manager 作为 canonical shared task/action 之上的 Utopia capability 暴露，让用户在实际使用设备监督本地/远程 engineering work。

## 开发范围

- ENGINEERING job 绑定 Shared Task Core canonical task/action state；Engineering Manager 取得 execution responsibility/lease，不另建 competing canonical truth。
- 经现有 Utopia Web/Android pattern 暴露 submit/status/progress/stage/attention/control/result/artifact view。
- current executor connector/device 与 logical owner/coordinator 分开显示。
- 渲染 LocalEligibility、RemoteFallbackProposal，需 explicit approval，不自动选更快 remote machine。
- ATTENTION_REQUIRED 从 canonical shared Attention state 渲染，集成 recent-device notification/ring projection；不另建 Engineering-global attention database。
- remote job control/result 保持在 current/shared Utopia surface，不让用户导航至 execution host。
- Advanced/debug provenance 暴露 connector/backend/device/branch/commit/test/error ID，不泄密。
- user-visible success 只来自 terminal accepted EngineeringResult。

## 范围外

- Assistant persona UI；
- General AI provider conversation UI；
- 除使用 public state 之外 Remote Fabric pairing UI。

## 必须验收

- Web/Android 观察同 canonical Engineering job，不重复执行；
- foreground/interaction device 可不同于 execution device；
- remote fallback 需 explicit approval，local allowed/throttled work 保持本地；
- remote progress/attention/result/artifact 出现在 interaction/shared surface；
- 首 attention acknowledgement 协调所有 device projection；
- authorized non-execution device 的 pause/resume/cancel 到达同 job；
- blocked/attention-required/unavailable/failed backend 时 UI 不报告 success；
- product/debug surface 无 raw secret。

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
