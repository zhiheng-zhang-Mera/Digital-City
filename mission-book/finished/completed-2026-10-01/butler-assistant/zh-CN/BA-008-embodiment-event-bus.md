> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../BA-008-embodiment-event-bus.md) 的原始 frontmatter 是唯一元数据来源。

# BA-008 — 设备化身事件总线、执行租约与重连安全

## 目标

助手多个设备化身的同时输入/输出经过同一权威状态机，防止 split-brain execution 和重复副作用。

## 开发范围

- embodiment input/output event envelope 携带 assistant、device/source、audience、task、causal/version、action correlation。
- 这是 Assistant domain-semantic bus；跨设备 delivery 经 Remote Fabric RPC/EVENT/STREAM 适配，Remote transport envelope 绝不替代 canonical Assistant event model。
- 为 exclusive 或 externally-visible side effect 定义 execution lease，含 holder/executor identity、task/action scope、lease version、expiry/renewal 语义。
- 重试副作用必须有 idempotency/action key，避免 duplicate event 导致 duplicate external action。
- 对 authoritative task state 而非 live local plan 串行化冲突命令或使用 version。
- 拒绝 stale/replayed event 或使其幂等。
- reconnect reconciliation：取得 authoritative task/binding state，使旧 lease 无效/重验证，协调 local intent，然后才恢复。
- 输出路由到适合化身，不广播 private response 或重复副作用。

## 明确排除

- 独立 device planner 各自作为 authority；
- destructive state 不做 task/version 检查而用 last-writer-wins；
- 每 private response 广播到每 device；
- reconnect 后仅凭 stale local lease/cache 恢复 external side effect；
- 两设备对同 action 同时持有效 exclusive execution authority。

## 必须验收

- 两设备矛盾命令不执行两种不兼容 exclusive side effect。
- 同 exclusive action scope 同时至多一个有效 execution lease。
- 相同 idempotency/action key 的 retry/replay 不重复 external side effect。
- lease expiry/revocation/reassignment 权威且可由 event/task state 观察。
- disconnect/restart 后，authority 和 lease 重验证前 stale local work 不恢复 side effect。
- output routing 尊重 device availability、相关 foreground binding、audience/privacy scope、causal task state。

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
2. 从固定 Butler baseline 创建 `assistant/BA-008-embodiment-event-bus`；
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

任何 worker 都不得将 `assistant/BA-008-embodiment-event-bus` 合入 Utopia main。只有每条 BA-001..BA-009 分支通过两阶段/两宿主门槛后，才能创建项目级 merge workbook。
