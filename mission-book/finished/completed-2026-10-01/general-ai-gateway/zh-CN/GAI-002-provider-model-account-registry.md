> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-002-provider-model-account-registry.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-002 — Provider / Model / Account 注册表

## 目标

为 general-AI provider、model、account、channel readiness 建 provider-neutral discovery state。

## 开发范围

- 版本化 ProviderDescriptor、ModelDescriptor、ProviderAccount、capability/profile record。
- per provider/account/model 独立表示 Web/API support。
- 已验证时表示 text、image、file/document、vision、code、long-context、streaming/tool/structured-output capability fact。
- unknown capability 默认 unknown/unsupported，不假定 true。
- 一个 provider 多 account，不混淆 account identity 与 provider identity。
- 仅存 persistent browser-profile ref、credential handle，不在 shared City state 持久化 raw secret。
- 经中立 00-Foundation SecureHandleStorePort 持久化 handle，不建 General-AI-only engine 重复 Engineering credential/profile storage。
- list/query API 可供 routing 使用，不绑定单 UI。
- discovered/configured capability fact 带 freshness/source/provenance。

## 范围外

- 登录 provider；
- 执行 request；
- 为特定 task 选择 provider；
- 提取 global credential service。

## 必须验收

- multiple-account test 中 provider/model/account identity 独立；
- stale capability metadata 明确 stale/unknown；
- WEB 与 API channel readiness 可不同；
- missing model/provider/account 为 typed absence；
- canonical record 拒绝 raw secret/cookie/token material；
- synthetic provider 下 registry 有效，不硬编码 Boss-era identity。

## 共享执行规则

- 从精确冻结 GAI baseline 创建分支，不从同级 GAI 分支创建。
- Development 和 Correction 必须由不同物理宿主（Alien / Mech）执行。
- Development 推送任务分支，不合入 Utopia main。
- Correction 独立复检并直接修复同分支，也不合入 main。
- worker 不得等待同级 GAI；缺实现时用 programme README 稳定 port 和确定性 test double。
- worker 不得仅为本地测试通过而 merge/cherry-pick 同级 GAI 分支。
- hosted CI 或 external check 运行时，继续独立范围内 tests/docs/evidence 或另一合资格 task/worktree，不闲置。
- 缺 external provider / Remote Fabric 只阻塞真正需要它的验收步骤，不改写为成功，不停滞无关 GAI。
- report 用精确 task ID 放于 `mission-book/reports/${MISSION_ID}/`。
- 禁止 Boss access：不对 Codex-Boss clone/fetch/read/import/submodule/symlink/runtime call，不产生 build dependency。历史名称仅可作为 provenance 说明，执行行为必须归 Utopia 拥有并测试。

## 全局跨项目不闲置规则

本任务参与 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 定义的规范性全局 BA/RF/GAI/EM pool。

- 当时 Alien、Mech 均可用，Development 可立即领取。
- Development 绿色后 Correction 立即合资格，必须由对侧物理宿主执行。
- 普通 claim truth 只写本工作书 frontmatter/reports；README/MISSION_INDEX 不是 claim lock。
- hosted CI、real-provider login、长测试、Remote Fabric 等待不闲置宿主。保留 claim，记录精确 seam，在独立 worktree 领取另一合资格全局阶段。
- 缺 Remote Fabric 时，组件工作用稳定 RemoteExecutionPort double；真实跨设备证明属于项目集成。
- 只有新全局扫描发现无可执行 owned repair、无合资格对侧 Correction、无未领取 Development 后，宿主才停止领取。
