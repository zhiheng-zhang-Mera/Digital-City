> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-006-conversation-input-stream-cancel.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-006 — Conversation、InputBundle、Streaming 与取消

## 目标

conversation continuity、rich input 在 Utopia 层为 canonical，provider/device/thread detail 仅 backend ref。

## 开发范围

- canonical Utopia Conversation ID 独立于 provider/device/channel。
- provider-specific thread/session ref 为可随时间变化的 backend ref。
- InputBundle 支持 text/file/image/reference/contextRefs，有界 metadata、digest、provenance。
- logical file ref 携 origin device、transfer/staging policy，不硬编码 remote filesystem path。
- PartialResult/event stream 语义：partial text 绝非 terminal success。
- conversation/PartialResult 为 GAI domain-semantic stream；跨设备可用 RF EVENT/STREAM，但 RF transport envelope 不成为 canonical conversation/result state。
- 定义 ResultEnvelope 和 attachment/result ref。
- cancellation/reconciliation 在 execution-host/channel 变化后仍有效。
- 获准 Web session reopen、channel/device transition 后保留 conversation continuation。

## 必须验收

- backend thread/device metadata 变化时，同一 Utopia conversation 可继续；
- backend thread loss 被报告，不静默伪 continuation；
- InputBundle 验证 size/type/digest/provenance metadata；
- temporary staging metadata 有明确 cleanup policy；
- partial event ordered/versioned 且 non-terminal；
- cancel 幂等，取消后 late result 被协调，不静默接受。

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
