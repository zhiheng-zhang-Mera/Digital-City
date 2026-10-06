> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-009-utopia-surface-integration.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-009 — Utopia Ask/Do、Action 与 Web/Android 集成

## 目标

经现有 Utopia product model 暴露 General AI Gateway，不另建平行 AI application shell。

## 开发范围

- 用 GAI-001 contract 将 GENERAL_AI 加入 product Action facade。
- 扩展 Ask/Do，让 unmatched/AI-intended request 在 deterministic/local routing 后进入 GAI routing。
- provider/channel/device detail 显示为 provenance/advanced state，不强迫用户先选择 backend class。
- 渲染 Web-first execution、DeviceSwitchProposal、ApiSwitchProposal、Budget verdict、ATTENTION_REQUIRED、partial output、cancellation、final result。
- GAI AttentionRequest 投影入 canonical shared Attention state/fan-out，不创建 GAI-only notification database/device-presence service。
- Web/Android 保持同 canonical Action/history truth。
- 不暴露 Boss/Hns route，使用语义 GENERAL_AI、现有/未来 ENGINEERING boundary。
- remote execution 时 current interaction device 仍为 UI endpoint。
- Tasks/Services/Rooms backend truth 分离，本层仅 facade/integration。

## 必须验收

- deterministic local command routing 与原先完全相同；
- 普通 AI request 可产生 GENERAL_AI Action；
- current-device Web flow 是默认可见路径；
- remote-device proposal/confirmation 不使用户离开 current device；
- remote result 在 originating/shared Action surface 出现；
- API proposal explicit confirmation，执行前显示 budget outcome；
- 授权时 Web/Android 均可对同 Action cancel/control；
- Advanced/debug view 保留真实 provider/channel/device/backend ID 和 error；
- backend unavailable/attention-required/failed 时任何 UI path 不声称 success。

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
