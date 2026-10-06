> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-004-api-channel-consent-budget.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-004 — API 通道、明确同意与预算策略

## 目标

API 是明确 escalation/manual channel，绝非从 Web 自动 fallback。

## 开发范围

- API adapter contract 覆盖 provider/model execution、支持时 streaming、usage、typed error。
- 支持当前要求 protocol adapter，含 OpenAI-compatible、Anthropic-style、Gemini-style shape，不将 provider identity 耦合 protocol identity。
- 任一 Web→API escalation 前引入 ApiSwitchProposal。
- Budget Policy 运行/API admission 前要求 explicit user confirmation。
- user 明确 command/setting 为该 action 选择 API 时，将其作为 consent record。
- 增 bounded per-action、aggregate budget policy hook，有已知 provider/model metadata 时使用。
- provenance 记录 EscalationReceipt、consent、budget verdict。
- secret access 用 handle/reference，logs/evidence redact secret。

## 强制策略

```text
WEB failure != API permission
budget available != user consent
user consent -> budget check -> API admission
```

上述原始策略等义中文：Web 失败不等于 API permission；预算可用不等于 user consent；先 user consent，再 budget check，再 API admission。

## 必须验收

- consent 和 budget admission 前无 API network call；
- deny consent ⇒ 无 API call；
- approve consent、deny budget ⇒ 无 API call；
- 两者批准 ⇒ API run 可继续；
- explicit use API 记录为 user-directed choice；
- rate-limit/auth/provider fault 保持 typed；
- provider response 缺 usage 时保持 unknown，不是 zero；
- logs、Action provenance、reports 无 secret value。

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
