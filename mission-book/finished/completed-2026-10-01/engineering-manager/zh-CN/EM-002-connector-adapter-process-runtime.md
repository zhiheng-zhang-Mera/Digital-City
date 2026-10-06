> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-002-connector-adapter-process-runtime.md) 的原始 frontmatter 是唯一元数据来源。

# EM-002 — Connector 适配框架与通用托管进程运行时

## 目标

提取可复用 Hns adapter/process 思路，形成 provider-neutral Connector runtime，使新 engineering worker 通过 registration/adapter 增加，不修改 Foreman core。

## 开发范围

- 实现 detect/select/adapt/validate/standardize/unify 阶段，每 adapter 独立隔离故障。
- 定义 connector lifecycle hook 和稳定 coded failure；第三方 adapter throw/invalid output 保持为数据，不导致启动崩溃。
- 为 Node/Python/EXE/CLI worker 实现通用 managed-process transport，有界 startup、heartbeat、log capture、invoke、stop、restart budget。
- process 不感知业务，只理解 process/transport/capability declaration，不理解 Codex/Claude/DeepSeek 语义。
- permission-policy mediation：adapter 提出 capability/need，Utopia policy 决定 grant。
- 保留 provenance，显示 detection evidence、selected adapter、granted/refused permission、runtime kind。

## 范围外

- job scheduling policy；
- remote device placement；
- provider login flow；
- provider-specific prompt。

## 必须验收

- 一个 malformed connector 不阻止其他 connector 加载；
- 通用 process runtime 至少托管两个 capability 不同的 synthetic connector manifest；
- 拒绝 undeclared capability/method call；
- restart attempt 有界且有 terminal safe mode；
- logs/output 有界，caller policy 可 redact secret；
- 增加 synthetic connector 只需 registration/manifest code，不需 Foreman-core conditional。

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
