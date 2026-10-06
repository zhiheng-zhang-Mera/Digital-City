> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-007-device-aware-remote-execution.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-007 — 设备感知的远程执行与结果回传

## 目标

允许更适合的 trusted device 执行 General AI Web task，用户仍留在当前 interaction device。

## 核心不变量

```text
REMOTE DEVICE = EXECUTION RESOURCE
NOT = A REQUIRED USER TERMINAL

interactionDevice may differ from executionDevice.
Changing execution host MUST NOT require the user to walk to or operate that host.
```

原始不变量等义中文：远程设备是执行资源，不是必须使用的用户终端；interactionDevice 可不同于 executionDevice；更换 execution host 绝不要求用户走到或操作该 host。

## 开发范围

- RemoteExecutionPort 作为已验收 Remote Fabric public API 上 GAI domain adapter facade，不独立实现 trust/transport、presence、device identity。
- current-device Web healthy 时优先使用。
- 按 presence/readiness、provider/account Web readiness、session/conversation availability、load、network/freshness、required input locality/capability 对已知 alternate endpoint 排序。
- discovery/ranking 不以发 duplicate AI request 作 probe。
- 生成 DeviceSwitchProposal；V1 向另一设备 dispatch 前 user confirmation。
- remote execution host 接收一个 canonical actionId。
- status、progress、partial output、final result、typed error、AttentionRequest 回 originating/shared Action surface。
- 任何查看 Action 的 authorized device 可 cancellation/control。
- 经 InputBundle ref、cleanup policy 支持 semantic remote file staging。
- hardware-bound authentication 可需 physical interaction，必须显示 ATTENTION_REQUIRED，不 false success。
- 正常 mode 传 semantic RPC/event/stream data，不强制 full remote-desktop video。

## Remote Fabric 不阻塞规则

若已验收 Remote Fabric code 未在 frozen baseline，分支 development/correction 使用稳定 RemoteExecutionPort、deterministic transport double。这是诚实 component test，不是真 remote transport proof。**最终 GAI merge workbook 必须通过已验收 compatible Remote Fabric API 执行真实 two-device execution，programme 才能到 terminal state。**

## 必须验收

- remote dispatch 后 local interaction device 不变；
- execution host 不创建 duplicate Action；
- remote progress/partial/final/error 均关联同 actionId；
- remote cancel 有效，late/duplicate event 拒绝/协调；
- stale/offline remote endpoint 不选为 healthy；
- V1 DeviceSwitchProposal confirmation 前不 execution；
- ATTENTION_REQUIRED 返回 interaction device。

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
