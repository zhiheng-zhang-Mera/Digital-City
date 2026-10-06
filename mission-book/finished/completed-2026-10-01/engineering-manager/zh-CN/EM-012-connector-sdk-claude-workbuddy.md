> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-012-connector-sdk-claude-workbuddy.md) 的原始 frontmatter 是唯一元数据来源。

# EM-012 — Connector SDK 与 Claude Code / WorkBuddy 扩展路径

## 目标

让未来 engineering-agent support 成为有界 adapter 工作，用额外 provider family 验证 SDK 形态，不让 unavailable software 阻塞整个 core。

## 开发范围

- 围绕 ConnectorPort、managed-process/其他支持 transport，封装 connector authoring helper/schema/validation/test harness。
- 提供 probe/auth/capability/lifecycle/job/control/result/health、fault isolation conformance test。
- development/acceptance host 有支持的 local interface 时增加 Claude Code、WorkBuddy adapter module。
- 某 optional product 不可用时，其 module 保持 disabled/unproven，记录 REAL_PROVIDER_ACCEPTANCE_PENDING，不虚构 installation/behavior。
- optional adapter absence 不阻塞 startup 或无关 connector。
- 文档说明如何不改 core registry/Foreman logic 增加未来 provider。

## 范围外

- 要求每 named provider 安装在每宿主；
- 必须抓取 undocumented private data；
- core 中 provider-specific policy。

## 必须验收

- synthetic 第三 connector 不修改 core 即通过 SDK conformance harness；
- adapter exception/timeout 隔离；
- optional provider absence 是 typed disabled/unavailable；
- 声称 real Claude Code/WorkBuddy acceptance 必须含 real host evidence；
- 增 adapter 不改变 EngineeringManagerPort 或 scheduling core；
- SDK docs 说明 minimum connector method、capability/auth 语义、test expectation。

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
