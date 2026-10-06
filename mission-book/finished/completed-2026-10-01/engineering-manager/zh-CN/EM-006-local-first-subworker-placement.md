> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-006-local-first-subworker-placement.md) 的原始 frontmatter 是唯一元数据来源。

# EM-006 — LOCAL_FIRST Sub-worker 资源与放置门槛

## 目标

Sub-worker 默认在自身/controller device 启动；仅测得本地条件使执行 blocked/unavailable 时考虑 remote execution。

## 开发范围

- 实现 LOCAL_ALLOWED、LOCAL_THROTTLED、LOCAL_BLOCKED、LOCAL_UNAVAILABLE eligibility state，带 explanation/evidence。
- 通过 interface 而非 product-name 猜测，评估本地 CPU/RAM/GPU/VRAM/thermal/battery/disk/runtime pressure 和 protected foreground workload policy。
- 大型游戏等持续高负载 protected workload，仅在 measured policy threshold 表明 worker 将实质干扰时才可能判为 local BLOCKED。
- THROTTLED 时，在 remote fallback 前降低 local worker count/concurrency/resource envelope。
- 设置 placement_policy=LOCAL_FIRST、remote_fallback=ASK_USER。
- 只在 BLOCKED/UNAVAILABLE 生成 RemoteFallbackProposal。
- 绝不只因另一机器更快、更空或 worker capacity 更大就提议 remote execution。
- 在 job provenance 记录 local eligibility reason 和任何 remote proposal。

## 范围外

- Remote Fabric dispatch；
- interface 之外 remote host ranking 实现；
- provider connector invocation；
- automatic permanent remote authorization。

## 必须验收

- LOCAL_ALLOWED 本地启动；
- LOCAL_THROTTLED 在降低 resource/concurrency policy 下仍本地运行；
- local allowed/throttled 时，更快空闲 remote machine 不触发 proposal；
- LOCAL_BLOCKED/UNAVAILABLE 每 proposal epoch 至多一个 active proposal；
- 本任务不启动 remote execution；
- eligibility state 暴露 measured reason，不仅 generic busy flag。

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
