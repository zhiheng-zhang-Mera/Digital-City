> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-008-health-resilience-degradation.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-008 — 健康、韧性与诚实降级

## 目标

提供适合 Web-first General AI 的 channel/provider/account health、retry/circuit behavior、fault isolation，不导入 Engineering ownership。

## 开发范围

- provider、account、model、WEB channel、API channel 的 typed health/readiness。
- 分离 availability、health、auth state、rate limit、budget state。
- 真正 transient technical failure 使用 bounded retry/backoff/circuit。
- 无 idempotency/reconciliation 时不 retry destructive/ambiguous action。
- AUTH_REQUIRED/USER_ACTION_REQUIRED 为 human-blocked，不是 auto-retry loop。
- Web failure 可触发 another-device proposal 或保持 unavailable，不静默触发 API。
- 一个 provider/account/channel failure 不影响无关 provider 或 Utopia local capability。
- 适用时 copying/refactoring 已验收 Utopia-owned code 复用语义，不让 General AI 运行时依赖 02 Engineering Worker Gateway namespace。

## 必须验收

- transient technical failure 遵 bounded retry/circuit policy；
- auth/human attention 不假装 technical retry success 自动 resume；
- stale health 可区别于 healthy；
- circuit state 有范围，不让单 provider/account/channel 全局切断 AI；
- General AI outage 下 Rooms/City Tasks/其他独立 Utopia surface 仍可用；
- resilience code 不存在 automatic API escalation。

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
