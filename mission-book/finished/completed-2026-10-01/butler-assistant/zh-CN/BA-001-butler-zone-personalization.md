> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../BA-001-butler-zone-personalization.md) 的原始 frontmatter 是唯一元数据来源。

# BA-001 — 管家专区与个性化契约

## 目标

建立独立 Butler & Companion Zone 身份/配置边界，与 Digital-Me 用户数据完全分离，确保 profile/persona 状态不会意外变为 permission 或 authority。

## 开发范围

- 定义 AssistantIdentity、AssistantProfile 为可替换、由助手拥有的持久状态。
- 预留版本化个性化端口，支持名称/称呼、声音、character/avatar 外观、personality、duties/role、companion/relationship mode、未来扩展字段。
- 支持多个已保存助手身份/profile，以及多个身份同时在线。
- 定义无法修改 Digital-Me 的 import/export/reset 语义。
- profile schema 规则禁止在 personality/profile 字段嵌入 permission grant、execution lease、action authority。
- 助手↔用户 relationship configuration 限定于助手身份，不视作 canonical user identity。

## 明确排除

- 完整 voice synthesis engine；
- avatar rendering engine；
- 将 Digital-Me 复制到 assistant profile；
- 硬编码单一 companion personality；
- 因 profile/personality 自称能力而授予 capability。

## 必须验收

- 更改、重置、切换 assistant profile 不触碰 Digital-Me。
- 未知未来 profile attribute 可版本化/扩展，不损坏 schema。
- 两助手身份可同时拥有不同 profile 和 relationship mode。
- import/export 拒绝嵌入 permission grant、executor lease、malformed authority field。
- 测试证明 profile isolation、reset、version validation、safe default，以及 personalization 不导致 authority escalation。

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
2. 从固定 Butler baseline 创建 `assistant/BA-001-butler-zone-personalization`；
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

任何 worker 都不得将 `assistant/BA-001-butler-zone-personalization` 合入 Utopia main。只有每条 BA-001..BA-009 分支通过两阶段/两宿主门槛后，才能创建项目级 merge workbook。
