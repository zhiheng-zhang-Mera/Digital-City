> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-011-deepseek-codex-reference-connectors.md) 的原始 frontmatter 是唯一元数据来源。

# EM-011 — DeepSeek Harness 与 Codex 参考 Connector

## 目标

用两个最直接有用的 engineering execution path 验证通用 Connector contract，不把任一产品变成 Engineering Manager core。

## 开发范围

- 经宿主可用稳定 official/process/session boundary 实现 DeepSeek Harness connector；DS-Hns source 是 donor evidence，不是必需 runtime。
- 经宿主当前支持的已安装 client/CLI/app boundary 实现 Codex connector。
- probe/version/auth/readiness/capability/start-or-attach/submit/event/control/result/health 映射到 ConnectorPort。
- backend run/session ID 保留为 provenance，同时只有一个 canonical Engineering job ID。
- unsupported provider operation 转为 typed UNSUPPORTED_CAPABILITY/ATTENTION/REFUSED。
- 产品已安装/authenticated 且无 Owner/hardware 阻塞时运行真实 host smoke。所需真实路径不可用时，记录 REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION；组件 Development/Correction 可依据 connector conformance、process double 和可用真实路径完成。绝不模拟真实 smoke 并标为 provider acceptance。
- provider-specific parsing/automation 位于 adapter boundary 下。

## 范围外

- General AI chat/Web gateway 行为；
- fork vendor UI/runtime；
- 修改 provider software internals；
- automatic cross-device placement。

## 必须验收

- 两 connector 无需 Foreman-core provider branch 即可注册；
- installed/uninstalled/auth-required state 诚实 probe；
- 组件阶段声称 real product acceptance 必须有真实 submit→progress→terminal 证据，否则精确证明延后至项目集成；
- cancel/interrupt、result correlation 使用 canonical job ID 及 backend ref；
- provider crash/session loss 成为 typed connector failure/attention，不假完成；
- DeepSeek connector 无 DS-Hns repository runtime/build dependency。

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
