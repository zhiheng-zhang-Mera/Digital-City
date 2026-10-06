> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-003-web-channel-persistent-session.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-003 — Web 优先通道与持久 Session

## 目标

Web 是默认 General AI execution channel，持久 provider/account browser profile，并诚实报告 login/session state。

## 开发范围

- provider-neutral WebChannel adapter contract：health、open/restore、execute、observe partial/final output、cancel、close/recover。
- Web execution 绑定 provider/account browser-profile ref，不用 ephemeral window；persistent handle 经中立 00-Foundation SecureHandleStorePort 解析。
- 在 Utopia host restart 后持久化/恢复获准 profile/session state，不复制 raw cookie 到 City state。
- 检测 READY、AUTH_REQUIRED、RATE_LIMITED、PAGE_CHANGED、BUSY/GENERATING、DOWN/UNKNOWN 和等价 typed state。
- provider-specific page knowledge 留在 Web adapter 下，经 interface 复用已验收通用 Computer Use/browser/DOM primitive，不重新实现 remote mouse logic。
- 支持 conversation/thread ref capture、reopen hook。
- Development 中，真实配置 Web provider 已可用且无 Owner/hardware 阻塞时执行真实路径。real login/provider access 不可用时记录 REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION；组件 Development/Correction 可经 contract、adapter、deterministic integration test 完成。GAI programme terminal merge state 前仍必须有真实 provider proof。

## 范围外

- API execution；
- Remote Fabric transport；
- automatic API fallback；
- 正常 execution mode 必须 remote-desktop streaming。

## 必须验收

real provider access 不可用时，以下 component acceptance 可用 deterministic provider adapter；真实 provider proof 是 programme-integration gate，不得虚构。

- default execution channel 为 WEB；
- provider/platform 允许时，persistent login/profile 经获准 restart/reopen 保留；
- expired login 为 AUTH_REQUIRED，不 SUCCESS；
- page/selector drift 为 PAGE_CHANGED/UNAVAILABLE，不编造 output；
- cancel 诚实协调 Web run；
- provider-specific adapter failure 不破坏另一 provider/account；
- 不访问 Boss profile、process、endpoint、repository。

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
