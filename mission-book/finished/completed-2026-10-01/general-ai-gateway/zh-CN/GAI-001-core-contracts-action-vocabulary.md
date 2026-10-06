> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-001-core-contracts-action-vocabulary.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-001 — 核心契约与 Action Vocabulary

## 目标

定义可安全替换的 General AI Gateway contract layer，用 GENERAL_AI 扩展 Utopia user-level Action vocabulary，不暴露历史 product name。

## 开发范围

- 增版本化 GeneralAIRequest、InputBundle、ResultEnvelope、PartialResult、AttentionRequest、DeviceSwitchProposal、ApiSwitchProposal、EscalationReceipt、typed error contract。
- 定义 action、provider、model、account、conversation、backend execution/thread ref canonical identifier。
- 预留 GENERAL_AI 为 user-level route，不增加 BOSS route。
- 保留 ROOM/CAPABILITY/CITY_TASK 现有语义与 provenance。
- 定义 idempotency/replay rule，防 retry/reconnect 创建重复 user-level action。
- 定义 terminal/non-terminal status mapping，含 ATTENTION_REQUIRED 及诚实 unavailable/refused。
- contract transport-neutral、provider-neutral。

## 范围外

- real provider call；
- Web/API/browser 实现；
- JEV inference；
- Remote Fabric transport 实现；
- minimum schema compatibility 以外 UI redesign。

## 必须验收

- old Action route 向后兼容；
- GENERAL_AI 有稳定 typed backend/provenance ref；
- malformed/unknown route/state/version 拒绝，不猜；
- 不同 request 复用同 idempotency key 被拒绝；
- partial output 不标 Action terminal；
- schema 无 raw credential/cookie/token byte；
- repository/runtime scan 无 Boss dependency。

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
