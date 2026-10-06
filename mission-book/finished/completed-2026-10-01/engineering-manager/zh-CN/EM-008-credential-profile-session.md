> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-008-credential-profile-session.md) 的原始 frontmatter 是唯一元数据来源。

# EM-008 — Credential 引用与持久 Connector Profile / Session

## 目标

以 connector-neutral authentication/profile layer 替代 DeepSeek-only .env 假设，canonical/shared state 无 plaintext secret。

## 开发范围

- AuthMode 包括 API_KEY、OAUTH、DEVICE_CODE、CLI_SESSION、BROWSER_PROFILE、DESKTOP_SESSION、NONE。
- 定义 credential_ref/profile_ref/session_ref contract 和 lifecycle/freshness metadata。
- 使用中立 00-Foundation SecureHandleStorePort 管理 platform-secure credential/profile/session handle；Windows 可由 Credential Manager/DPAPI 实现。Engineering Manager 不创建第二 domain-exclusive secure-store engine。
- 迁移/桥接既有 DeepSeek key discovery，不复制 secret value 到 shared task/registry record。
- connector instance 可跨 restart 持久化获准 CLI/browser/desktop session reference。
- 通过 AuthStatus、AttentionEnvelope 呈现 missing/expired/needs-user。
- logs、reports、artifacts、diagnostic snapshot redact secret material。

## 范围外

- provider-specific login page automation；
- 普通消费者 AI account routing；
- 默认 Remote Fabric secret replication。

## 必须验收

- canonical job/connector/task state 含 handle/reference，不是 plaintext secret；
- failure test 中 logs/reports 无 secret value；
- expired session 为 EXPIRED/NEEDS_USER，不 READY；
- restart 恢复 allowed persistent profile/session reference；
- missing secure-store support 诚实降级，不 fallback 到 plaintext shared state；
- legacy DeepSeek env discovery 经 abstraction 使用，不成为 universal schema。

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
