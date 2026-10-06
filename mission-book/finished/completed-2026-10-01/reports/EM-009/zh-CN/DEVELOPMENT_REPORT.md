# EM-009 开发报告——运行时所有权与健康／重启／恢复

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-009 (Engineering Manager programme, task 9 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 679cdf6 (Digital-City main, "claim(EM-009): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:19:05Z
CONTROL_REVISION_AT_CLAIM= 1ffce00 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-009-runtime-health-restart-recovery
IMPLEMENTATION_HEAD_SHA  = 6ae1aea8833a15a11512642113810d8de0e83d75
BRANCH_CI                = 36736326499 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

`contracts/engineering-runtime-supervisor-v1/` 包含 `supervisor.mjs`（健康监控器、所有权注册表、重启监督器、队列协调及健康阶梯映射）、`index.mjs`、7 项测试套件，以及根入口 `tests/engineering-runtime-supervisor.test.mjs`。

| 验收要求 | 测试与证明 |
|---|---|
| 源码／权限测试证明监控器不能直接重启 | `authority is split…`：监控器键恰好是 `sense/decidePressure/policy/readings`，没有 `restart/kill/spawn/signal/terminate/execute`；工厂源码片段扫描证明不发送进程信号、不引用监督器 |
| 重启执行器不能自行创造健康压力策略 | 同一测试：没有 `setThresholds/setPolicy/decidePressure/sense`；即使形状完美的手造决策也为 `PRESSURE_REQUIRED`，只有签发监控器可担保；非监控器产出的读数不能变为压力 |
| 陈旧／死亡所有权不终止 PID 被复用的无关进程 | `a stale or reused pid is never signalled`：启动标记不同为 `PID_REUSED`，不存在为 `STALE_OWNERSHIP`，令牌错误为 `NOT_THE_OWNER`，均记录零信号 |
| 重启预算耗尽进入安全模式，而非无限循环 | `the restart budget ends in safe mode instead of an infinite loop`：冷却／退避拒绝，恰好 `max_restarts` 次信号，然后终态 `SAFE_MODE`，长时间等待后仍拒绝 |
| 仅在所需检查点／就绪协调后恢复运行 | `resume happens only after a checkpoint and a readiness confirmation`：`CHECKPOINT_REQUIRED`、`CHECKPOINT_FAILED`，重启后保持 `SUSPENDED` 直到确认就绪 |
| 恢复不复活终态作业 | `a terminal job does not resurrect after recovery`：`dropped_terminal_jobs`，畸形终态列表拒绝而非视为空 |
| 单连接器崩溃不终止无关连接器／Utopia | `one crashed connector never terminates unrelated connectors`：`untouched: ['worker:2']`、`other_instances_terminated: []`，只向不健康 PID 发信号 |
| 广义连接器／实例／worker 所有权及陈旧 PID 校验，仅进程／运行时范围 | `createOwnershipRegistry` 使用 instance_ref＋owner_token＋pid＋process_start_marker；`validate()` 返回类型化 reason，模块无网络／会话职责 |
| 健康语义含置信度／新鲜度 | `the contract is strict, frozen, and honest about stale observations`：陈旧存活证据或低置信度均为 UNKNOWN，都不能推动重启 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——领取哪个任务。** 新扫描没有本机负责修复，也没有 Mech 可领取 Correction；Alien 持有 BA-004、EM-004、BA-006、EM-008、GAI-004、RF-004 Correction。前次 GAI-004 使平局规则排除 GAI，选择 EM-009：它接续 EM-008 的重启／恢复部分，持久会话引用必须有人恢复；EM-010 调度器／worker 池和 EM-013 集成都需要不会杀死健康 worker 的监督器。

**D2——一个模块还是三个权限主体。** 选项：(a) 同时感知的监督器；(b) 同时重启的监控器；(c) 所有权、监控器、监督器三个对象，监控与监督明确不能执行对方职责。选择 (c)，因为验收列表由禁止条款组成，只有接口能力缺失才能测试禁止。断言监控器公开键恰好四个感知操作，并扫描工厂源码没有信号调用。

**D3——如何从结构上防止监督器创造压力，而非仅靠说明。** 初版只检查决策形状（kind、policy_ref、decided_at、thresholds）；测试立即发现形状正确的手造对象能通过。选择监控器私有保存实际签发的压力决策集合，并公开符号键签发器 `PRESSURE_ISSUER` 供监督器验证。符号不进入 `Object.keys`，感知接口仍恰好四操作，来源不可伪造；仅形状检查永远不能区分真实决策与仿造物。后文仍保留对公开符号能否被取得的审查问题。

**D4——隔离复用 PID。** 所有权记录携带进程启动标记；活 PID 标记不同即 `PID_REUSED`，拒绝且不发信号。PID 会回收，验收明确要求不得杀死复用 PID 的无关进程。测试替身记录每个信号，因此断言是“外部进程收到零信号”，而非仅“代码返回错误”。

**D5——安全顺序。** 压力来源、安全模式、预算、冷却、所有权、检查点等所有前提均在发信号前求值，拒绝重启完全无副作用。部分执行重启比拒绝更糟；结果记录 `process_signalled`，调用者可证明实际发生了哪种情况。

**D6——重启不等于恢复运行。** 重启后实例进入 `SUSPENDED`，除非就绪钩子确认已经回来；钩子缺失也挂起。验收要求只在必要就绪／检查点协调后恢复，默认“假定回来了”就是项目持续指出的假成功。结果分别记录 `restarted` 和 `resumed`，避免混淆。

**D7——健康词汇。** 发布五值压力阶梯 `HEALTHY/ELEVATED/DEGRADED/CRITICAL/UNKNOWN`，以及 `mapToRegistryHealth()`，映射到 EM-004 的四值 `HEALTHY/DEGRADED/UNHEALTHY/UNKNOWN`。工作簿要更丰富的压力语义，注册表已经发布四值健康事实；公开映射保留一项投影规则，避免两个项目报告不一致。

**D8——陈旧和低置信度证据。** 存活时刻早于 `stale_after_ms`、探测失败或置信度低于策略下限都产生 `UNKNOWN`，它绝不产生压力。旧或未经证明的证据不能转换为破坏性操作。安全模式测试曾长时间等待，使崩溃循环读数陈旧并正确抑制压力；随后测试改为模拟实时探测。

**D9——终态作业复活。** `reconcileQueue` 删除权威状态已终结的作业，畸形 `terminal` 参数抛类型化错误，不能当空列表。验收要求终态作业不得回来；把坏列表静默读成“无作业终结”恰是复活路径，必须明确拒绝。

**D10——范围。** 仅进程／运行时恢复，不做网络／会话重连、机器重启或提供商启发式，监督器对连接器／worker 类型中立。遵循工作簿排除项，跨设备重连仍归 Remote Fabric，并记录为集成接口。

**D11——不提供 `schema.json`。** 与其他组件分支一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| `contracts/engineering-runtime-supervisor-v1/supervisor.mjs` | 新增监控器、所有权、监督器、协调及健康映射 |
| `contracts/engineering-runtime-supervisor-v1/index.mjs` | 新增公开接口 |
| `contracts/engineering-runtime-supervisor-v1/tests/conformance.test.mjs` | 新增 7 项一致性测试 |
| `tests/engineering-runtime-supervisor.test.mjs` | 新增根入口（仓库测试 101 → 108） |

未修改 City／Core 文件、清单或文档，合并保持增量添加。

## 4. 测试汇总、失败与修复

7 项测试。原文概述称首次四项失败，其中一项真正涉及安全的缺陷、三项需修正期望；原文下列逐项分类为两项缺陷、两项期望，此差异保留。

1. **缺陷：** 正确形状的手造压力决策获得重启权限，所有权检查只是偶然以 `NOT_THE_OWNER` 拒绝。用符号键签发器修复（D3）；测试断言伪造决策为 `PRESSURE_REQUIRED`，公开监控接口仍四操作。
2. **缺陷：** `reconcileQueue` 对畸形 `terminal` 抛原始 `TypeError`。改为类型化 `INVALID_INSTANCE` 拒绝（D9），因为静默当空会复活作业。
3. **期望：** 安全模式测试推进时钟却固定 `last_liveness_at`，长等后读数陈旧，正确不产生压力。探测替身改为随观测时刻更新，模拟实时进程；模块原行为正确（D8）。
4. **期望：** 恢复测试同一时刻重启两次，正确触发冷却。测试按退避推进时钟，符合真实崩溃循环。

## 5. 本地检查与 CI

| 检查 | 原报告结果 |
|---|---|
| `node --test tests/*.test.mjs` | 108 项，108 通过，0 失败（101 基线＋7 新增） |
| `node --test apps/rooms/tests/*.test.mjs` | 69 通过，0 失败 |
| `node city/test-all.mjs` | 1801 通过，0 失败 |
| `node scripts/verify-promotion-history.mjs` | OK，在 82ed36933fb4 验证 10 条记录 |
| `node scripts/check-bilingual.mjs` | 文档、证据、数据记录 `PAIR_STATUS = SYNCHRONIZED` |
| 6ae1aea8833a15a11512642113810d8de0e83d75 上 GitHub CI 36736326499 | success |

## 6. 交给同级任务的集成接口

- **EM-008（凭据／配置／会话持久化）：** `exportPersistentRefs()`／`restore()` 是恢复的数据部分；本模块重启前检查点钩子应取得快照，就绪钩子重新验证恢复引用。双方都不应扩大至对方职责。
- **EM-004（进程／认证／健康注册表）：** `RUNTIME_STATES` 覆盖其进程状态，健康映射把压力阶梯投影到四种健康事实。`pid_ref` 应包括所有权记录的 PID 与启动标记，不能只有 PID。
- **EM-002（连接器适配器／进程运行时）：** 进程端口 `signal` 是唯一运行时接触点，启动器可实现而不公开其他能力。
- **EM-010（foreman 队列／DAG／worker 池）：** `reconcileQueue` 是队列恢复门禁，调度前必须协调恢复队列，否则终态作业可能回来。
- **EM-007／RF-006（远端子 worker 返回、路径管理）：** 监督器不负责网络／会话重连；远端重连不能建模为本地重启，远端返回也不能以本地就绪钩子为门禁。
- **GAI-008（健康／韧性／如实降级）：** 压力阶梯和“UNKNOWN 不能证明破坏性操作合理”规则可直接复用；GAI 应消费投影而非另定义词汇。
- **Owner 问题（不变）：** 演进动态是否记录组件阶段事件。

## 7. Correction 主机待处理项

1. 对抗审查尝试：取得公开的监控器签发符号后手造决策（必须明确判断是否应模块私有）；把 A 实例决策重放到 B（已覆盖，仍值得重测）；检查点成功但信号失败；就绪钩子抛错；重复 `claim()` 以新 PID 覆盖所有权。
2. 确认 D6 缺少就绪钩子则挂起、D8 陈旧／低置信度证据绝不产生压力是预期解释。
3. 确认 `PRESSURE_ISSUER` 是否应公开，或应模块私有并通过监督器构造时取得的闭包由监控器内部执行签发验证。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
