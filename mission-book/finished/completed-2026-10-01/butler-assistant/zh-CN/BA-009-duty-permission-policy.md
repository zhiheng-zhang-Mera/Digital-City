> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../BA-009-duty-permission-policy.md) 的原始 frontmatter 是唯一元数据来源。

# BA-009 — 职责、权限与主动性策略

## 目标

定义每助手责任与可主动程度，确保 task handoff、persona、device embodiment 绝不能制造 authority。

## 开发范围

- assistant duties/role scope 是由助手拥有的可配置 policy。
- 定义 proactivity level 与 notification/initiative boundary。
- assistant request 映射到既有 Action/Core permission check，不绕过。
- 将 AssistantPolicy 贡献到 Shared Core policy contract，不创建第二 global policy engine；Remote Fabric 后续在 target device 重新验证/执行同一 effective decision。
- effective permission 是 Owner/User policy、assistant permission/duty policy、current device capability/authorization、task/action grant 的交集。
- handoff、executor/device change、reconnect、capability change 后必须重算 permission。
- execution lease 证明哪个 executor 可执行，但自身不授予 policy 禁止的 capability。
- 多助手共用同 Digital-Me/context source 可有不同 duties/policies。

## 明确排除

- 仅因 personality/profile 声称就授予 permission；
- 将 Root/Core authority 移入助手；
- 自主扩张到新 capability；
- handoff 时复制原助手 permission 给 recipient；
- 用 execution lease 代替 Owner/User policy 或 device capability。

## 必须验收

- 两助手共用授权 user context，可有不同 duties/proactivity。
- out-of-duty request 被拒绝/委派，不改变底层 permission。
- duties change 独立于 Digital-Me canonical data。
- handoff 到低权限助手仍保持低权限，payload 不提升权限。
- executor 迁至缺 required capability 的设备时，即使 task owner 获授权，仍阻止 action。
- 测试覆盖 allowed、denied、confirmation-required、proactive-notification、handoff、reconnect、capability-loss 边界。

## 规范性权限方程

执行 action 时，实现必须执行等价于：

`EffectivePermission = User/OwnerPolicy ∩ AssistantPolicy ∩ DeviceCapability ∩ TaskActionGrant`

有效 execution lease 是额外 execution-safety 前提；它**不是** permission 来源。

## 强制分布式助手架构契约

本任务必须保持以下全部项目不变量：

1. **一个逻辑身份，多个设备化身。** 连接同一助手的多个设备是一个逻辑助手的投影，不是之后再同步的独立心智。
2. **一份权威持久状态，多个上下文投影。** 共享/权威状态可包含已提交身份/profile 引用、持久助手↔用户关系状态、已提交 memory 引用、task graph、commitment、checkpoint、causal/event log。实时 token context、临时推理、暂存 plan draft、未提交 inference、device/UI transient state 仍只属于本地化身，除非通过带类型 commit/update 明确提升。
3. **前台绑定不是任务所有权。** 每设备至多一个前台助手，但前台切换本身不转移、取消、暂停或重建 task ownership 或后台执行。
4. **所有权不是执行。** task 可区分逻辑 owner/coordinator 与当前 executor。任何外部可见或改变状态的副作用，都必须由权威 task/version state、execution lease、idempotency/action key 共同守卫。
5. **交接绝不隐式转移 authority。** handoff 可转移责任、checkpoint/evidence、引用，但绝不转移 permission 或 capability grant。接收助手/设备必须根据当前 policy 和 capability 重算有效权限。
6. **本地状态是缓存，不是 authority。** disconnect/restart/reconnect 后，化身必须重新获取权威 task/binding state，并在恢复副作用前重新验证 lease。
7. **知道信息不等于有披露 authority。** 某 scope/audience 已知信息并不自动允许在另一范围释放。context projection 在输出前必须执行 memory/audience/privacy scope 检查。

这是验收约束，不是可选未来增强。

## 项目门槛

Pre-Assistant foundation gate 已 **OPEN**。Butler 项目共同 baseline 固定于 Utopia main：

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

当时本任务可立即领取。必须从该精确 baseline 创建分支，保持 BA-001..BA-009 可独立集成。

## 开发阶段

Development Host 必须：
1. 在 City 领取此阶段；
2. 从固定 Butler baseline 创建 `assistant/BA-009-duty-permission-policy`；
3. 仅实现此有界范围及上述强制架构契约；
4. 增加正例与负例测试，包括与本任务有关的并发/恢复测试；
5. 推送并运行相关 GitHub CI；
6. 编写 DEVELOPMENT_REPORT.md，记录精确文件、测试、失败/修复、branch/head、CI；
7. 仅在绿色时标记 development_complete。

不得合入 Utopia main。

## 修正阶段

Correction Host 必须是另一物理宿主，独立检查已推送开发分支中相关 architecture、state consistency、concurrency、permission/privacy、lifecycle、recovery、stale state、duplicate side effect、false success 缺陷。

Correction 是修复任务，不是被动验证。每个已发现范围内缺陷都必须直接在同一分支修复，并有 regression test。跨子项目问题必须在本任务 local contract/guard 修复，并记录供最终集成，不复制另一 BA 实现。

推送修正后的 head，运行相关 GitHub CI，编写 CORRECTION_REPORT.md；仅在绿色时标记 correction_complete。

## 两宿主门槛

最终合并资格要求：
- Development Host != Correction Host；
- branch history/evidence 证明 Alien 和 Mech 均参与；
- development_complete = true；
- correction_complete = true。

## 全局跨项目不闲置规则

本任务参与 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 定义的规范性全局 BA/RF/GAI/EM 池。

- 当时 Alien 和 Mech 均可用，本任务可立即领取。
- 普通 claim truth 只写入本工作书 frontmatter 和 reports，不通过 README/MISSION_INDEX 串行化领取。
- Development 和 Correction 在本任务分支仍由对侧宿主分别执行。
- 等待 hosted CI、长测试或外部条件时，保留 claim，释放物理宿主，在独立 worktree 领取另一个有资格的全局阶段。
- RF/GAI/EM 同级实现缺失绝不阻塞有界 Butler 工作；使用稳定 interface/test double，记录 integration seam。
- 只有新扫描四项目后发现既无可执行 owned repair、无合资格对侧 Correction、也无未领取 Development，宿主才停止领取。

## 合并锁

任何 worker 都不得将 `assistant/BA-009-duty-permission-policy` 合入 Utopia main。只有每条 BA-001..BA-009 分支通过两阶段/两宿主门槛后，才能创建项目级 merge workbook。
