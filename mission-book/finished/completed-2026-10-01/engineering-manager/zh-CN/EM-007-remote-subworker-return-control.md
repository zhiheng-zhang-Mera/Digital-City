> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-007-remote-subworker-return-control.md) 的原始 frontmatter 是唯一元数据来源。

# EM-007 — Remote Sub-worker 执行、自动回传与控制

## 目标

明确批准 local-failure fallback 后，在另一 trusted device 执行同 logical Sub-worker job；正常 control、attention、result 自动返回 user-facing/shared control plane。

## 开发范围

- EngineeringRemoteExecutionPort 是 Remote Fabric semantic/public interface 上 Engineering domain adapter facade；不独立实现 node trust、transport、presence、physical-device identity。
- V1 dispatch 前要求 approved RemoteFallbackProposal。
- fallback 获批后，仅选择满足 job required capability 的 eligible trusted remote host。
- 保留原 job_id、logical owner/coordinator、canonical task truth；remote host 只成为 current executor/embodiment。
- state、stage、progress、event、log、AttentionEnvelope、result、ArtifactEnvelope 经 canonical/shared state 自动返回。
- 任一 authorized interaction device 的 pause/resume/cancel/respond control 转给 remote executor，幂等协调。
- 拒绝/协调 stale、late、duplicate remote event 及 duplicate execution attempt。
- required file/context 按语义暂存，带 digest/provenance、有界 cleanup policy。
- 正常运行不能要求 remote-desktop video 或用户走到 execution host。

## 范围外

- Remote Fabric pairing/crypto/routing internals；
- 无 user approval 的 automatic cross-device fallback；
- 正常协议使用跨设备 mouse-coordinate control。

## 强制交互不变量

```text
CONTROL PLANE follows the user.
EXECUTION PLANE may move.
REMOTE EXECUTION HOST is a compute/execution resource, not a required user terminal.
```

上述原始契约的中文等义说明：控制平面跟随用户；执行平面可以移动；远程执行宿主是计算/执行资源，不是用户必须使用的终端。

## 必须验收

- explicit approval 前不 remote dispatch；
- remote execution 不创建 duplicate canonical job；
- origin/current interaction surface 收 remote progress、attention、final result、artifact；
- interaction device 的 pause/resume/cancel 控制 remote run；
- authorized interaction device 的 remote attention reply 到达 originating worker；
- late/duplicate event 不复活 terminal、不重复 side effect；
- 底层 platform 真需 physical local action 时，job 变 typed physical-action block，不 false success。

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
