> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../BA-004-multi-assistant-handoff.md) 的原始 frontmatter 是唯一元数据来源。

# BA-004 — 多助手在线、切换与明确交接

## 目标

允许多个 assistant identity 在线，同时使前台切换与真正责任转移成为分离、明确、抗冲突的操作。

## 开发范围

- 保持多个 Assistant Core 在线。
- 切换单设备前台助手，不使切出助手在其他设备离线，也不默认改变 task ownership。
- 为逻辑 ownership/coordinator responsibility 真正转移定义明确 TaskHandoff。
- handoff package 字段包括 task identity/version、current owner/coordinator、checkpoint、commitment、artifact/evidence、blocker、executor/lease 引用、required capability、audience/privacy scope。
- ownership change 成为权威前，要求 recipient acknowledgement/acceptance。
- 重算 recipient permission/capability，不转移切出助手 grant。
- 支持完整助手替换/离线：可转移责任必须明确交接、完成、按 policy 暂停或由 Owner 取消。

## 明确排除

- 单设备前台切换时自动转移全部 global task；
- handoff 复制 permission/device grant、lease、action approval；
- 单设备交互 session 两个活动前台助手；
- 仅因 persona 或 foreground binding 变化丢失/重启 task；
- 无权威 acknowledgement 就将文字交接摘要视为 ownership change。

## 必须验收

- 手机前台 A→B 时，若 A 仍在线，其无关 global/background task 继续运行且仍归 A。
- 没有责任转移的切换立即发生，handoff 为零。
- 真正责任转移产生 machine-readable handoff、recipient permission/capability 重估、已确认 takeover、唯一权威新 owner。
- 被拒绝/过期 handoff 不改变原权威 owner。
- 除非 execution policy 要求，不仅因 coordinator/owner 改变而重启 executor。
- A 完全离线/替换时，若必须转移责任尚未解决，拒绝最终 shutdown，除非 Owner 明确取消/暂停。

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
2. 从固定 Butler baseline 创建 `assistant/BA-004-multi-assistant-handoff`；
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

任何 worker 都不得将 `assistant/BA-004-multi-assistant-handoff` 合入 Utopia main。只有每条 BA-001..BA-009 分支通过两阶段/两宿主门槛后，才能创建项目级 merge workbook。
