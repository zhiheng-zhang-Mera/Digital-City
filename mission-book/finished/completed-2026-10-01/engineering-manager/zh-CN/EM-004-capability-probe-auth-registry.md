> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-004-capability-probe-auth-registry.md) 的原始 frontmatter 是唯一元数据来源。

# EM-004 — Connector Capability / Probe / Auth / Instance 注册表

## 目标

表示每设备实际有哪些 engineering worker instance、能力及可用性，不把 provider choice 硬编码于 Foreman。

## 开发范围

- 分离 ConnectorDescriptor 与 ConnectorInstance，允许同 connector type 多个 installed/running/account instance。
- 跨设备 ConnectorInstance 引用 canonical RF device identity/presence；其 CapabilityManifest 只描述 engineering-worker capability，不重复 RF transport-addressable node capability registry。
- probe() 提供 installed/version/running/attachable/readiness/device、freshness/provenance 事实。
- CapabilityManifest 包括 filesystem、shell、git、browser、vision、computer-use、checkpoint/resume、interaction 等可扩展 capability。
- typed AuthStatus 包括 READY、MISSING、EXPIRED、NEEDS_USER、REFRESHING、UNAVAILABLE、UNKNOWN。
- 分离 auth status、health、process readiness、capability support。
- 提供 dispatch/remote fallback requirement matching，但不在此选择 remote host。
- unknown capability 默认 unknown/unsupported，绝不假定 true。

## 范围外

- secret storage；
- remote trust/discovery；
- scheduling priority；
- provider-specific authentication UI。

## 必须验收

- 同 connector type 两 instance 保持独立；
- stale probe data 明确 stale，不静默 healthy；
- 仅 process live 不可推断 auth READY；
- capability mismatch 在执行前 typed refusal；
- 一个 connector probe throw/timeout 不破坏 registry；
- registry record 不保存 raw credential material。

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
