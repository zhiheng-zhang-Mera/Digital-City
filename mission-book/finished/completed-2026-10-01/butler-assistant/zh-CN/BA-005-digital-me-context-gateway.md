> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../BA-005-digital-me-context-gateway.md) 的原始 frontmatter 是唯一元数据来源。

# BA-005 — Digital-Me 有范围上下文与记忆/受众网关

## 目标

让助手通过获授权上下文视图理解用户，同时执行记忆命名空间以及“知道信息不自动允许对另一受众披露”的规则。

## 开发范围

- 定义助手至 Digital-Me 有范围 read/query gateway，具备 purpose、audience、least-data 语义。
- assistant identity/persona/assistant↔user relationship state 排除在 Digital-Me canonical user identity record 外。
- 至少定义以下 memory/context namespaces：user-global canonical context、assistant-private durable memory/relationship context、project/task context、audience/channel disclosure context、device-ephemeral context。
- ContextProjection 仅选择当前 assistant、purpose、task、audience、device surface 获授权的信息。
- 提供明确 denial/unavailable/stale 行为及 audit provenance。
- private channel 中获知的信息可在授权情况下内部使用，但不自动允许在 public/shared channel 披露。

## 明确排除

- 助手直接访问数据库；
- 会话副作用重写 Digital-Me canonical user identity/preferences；
- 默认批量导出全部 Digital-Me 数据；
- 将全部 private assistant memory 复制到每 channel/device context；
- 假定助手已知信息自动允许向当前 audience 披露。

## 必须验收

- 不同助手可从同一 Digital-Me 获取不同授权 context scope。
- 拒绝 scope 时返回 typed refusal，无部分泄漏。
- assistant profile/relationship 变化绝不改变 Digital-Me canonical record。
- 未获 disclosure authorization 时，private/audience-restricted fact 不向另一 audience 呈现。
- device-ephemeral context 消失/重建不破坏 durable assistant memory。
- 测试涵盖 scope allow/deny、audience boundary、absence、stale context handling、provenance、cross-assistant isolation。

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
2. 从固定 Butler baseline 创建 `assistant/BA-005-digital-me-context-gateway`；
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

任何 worker 都不得将 `assistant/BA-005-digital-me-context-gateway` 合入 Utopia main。只有每条 BA-001..BA-009 分支通过两阶段/两宿主门槛后，才能创建项目级 merge workbook。
