# EM-007 开发报告：远程 Sub-worker 执行与自动返回／控制

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-007 (Engineering Manager programme, task 7 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = bae579f (Digital-City main, "claim(EM-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:35:11Z
CONTROL_REVISION_AT_CLAIM= f6865b6 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-007-remote-subworker-return-control
IMPLEMENTATION_HEAD_SHA  = 3bd9f556616dbaccfd00cb4620144fdcc669baf1
BRANCH_CI                = 36730656520 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始元数据保留任务、开发主机、领取与控制版本、仓库、基线、实现分支及 SHA、CI、108 项本地测试和开发完成／禁止组件合并状态。

## 1. 交付物

`contracts/engineering-return-control-v1/` 包含 `return-control.mjs`（Remote Fabric 执行端口 facade 与测试替身、交互界面解析、返回／控制桥、上下文暂存语义）、`index.mjs`、7 项测试及根 `tests/engineering-return-control.test.mjs`。

| 必需验收项 | 测试 |
|---|---|
| V1 调度前要求已批准 `RemoteFallbackProposal` | 远程调度需要已批准提议和合格主机 |
| 仅选择满足能力且受信任的合格主机 | 同测试，`INELIGIBLE_REMOTE_HOST` |
| 保留原 job ID、owner、canonical 事实；主机仅成为执行者 | 同测试，`owner_preserved: true`、`executor_kind: 'REMOTE'` |
| state／stage／progress／events／logs／attention／result／artifact 自动返回 | 所有八通道返回当前交互界面，而非执行设备 |
| 任一授权设备可幂等转发 pause／resume／cancel／respond | 任一授权设备转发控制且只应用一次 |
| 核对 stale、late、duplicate 远程事件 | 陈旧／重复远程事件被核对而非重新应用 |
| 正常操作不需远程桌面视频或走到主机 | 所有通道返回测试的 `assertNoRemoteHostInteraction` 及公开契约标志 |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1：领取哪项任务。** 扫描没有自己的修复、也没有 Mech 可领取 Correction（Alien 正在纠正 EM-003），因此进入开发层级。按与自己 GAI 领取不同计划的平局规则选择 EM-007，且它承担第三条 EM 硬不变量。

**D2：信任与传输留在其他模块。** 适配注入的 `EngineeringRemoteExecutionPort`，公开 `owns_node_trust: false`、`owns_transport: false`、`owns_device_identity: false`、`adapts_remote_fabric_public_api: true`。工作簿把 RF 内部实现排除在外，要求 Engineering facade 而非第二套 fabric。

**D3：如何使返回路径可检查？** 每个返回 envelope 同时命名 `origin_device_ref`、`delivered_to_device_ref`，带 `requires_remote_host_interaction: false`；`assertNoRemoteHostInteraction` 拒绝 attention 返回交付到非交互界面的运行。“全部正常控制、attention 与结果自动返回面向用户／共享控制平面”容易声明难以检查，命名两个设备使误交付执行者可被发现。

**D4：控制平面跟随用户。** `resolveInteractionSurface` 优先标为 current 的设备，再回退到最近操作的已授权且在线设备；桥每次返回重新解析界面，用户运行中换设备仍保有控制，执行不随用户移动。不变量关注用户界面而非执行者。

**D5：含糊的 current 输入。** 首个测试传两个 `is_current` 设备，解析器按设备引用顺序破平局。选择拒绝并以 `INVALID_REQUEST` 命名这些声明者，同时纠正测试。两个设备声称当前交互界面是输入错误；静默破平局任意决定用户控制平面的位置，正是此计划其他契约拒绝的静默选择。

**D6：控制权威。** 解析后授权集合内任一设备可 pause／resume／cancel／respond，否则 `UNAUTHORIZED_INTERACTION_DEVICE`；按 `command_id` 仅应用一次，确认本身也返回交互界面。理由是从任一授权交互设备转发控制并幂等核对，用户也必须看见命令已落地。

**D7：事件核对。** `origin_device_ref` 非记录执行者或未知通道的事件以 `INVALID_ENVELOPE` 拒绝；序列不高于最后已应用值时核对为 `STALE_EVENT`；相同（序列，通道）不重应用；同 job 重复调度以 `DUPLICATE_EXECUTION` 拒绝。重试、重连、重复交付不得导致第二次执行或重复结果。

**D8：硬件绑定动作。** `recordPhysicalActionRequired` 记录类型化 `PHYSICAL_ACTION_REQUIRED` attention 返回，带 `fabricated_success: false`，交付到交互界面。遵循工作簿规则 10：真正硬件绑定动作诚实报告，绝不伪造成功。

**D9：上下文暂存。** 暂存条目带引用、`sha256` 摘要、有界数量、明确清理策略（默认 `AFTER_RESULT`，允许 `AFTER_CANCEL`），结果记录 `opaque_bulk_transfer: false`。要求按语义暂存所需文件／上下文，带摘要／来源及有界清理策略。

**D10：无 `schema.json`。** 与其他组件分支一致。

## 3. 测试汇总

7 项全部通过：批准／资格／owner 变更拒绝及成功调度；八返回通道均交互界面交付，带来源、无需远程交互标志与 envelope 拒绝；控制随用户移动界面而执行不动、未授权设备永不成为界面、含糊 current 拒绝；陈旧／重复事件核对与重复调度拒绝；幂等控制转发、授权设备强制和命令验证；硬件绑定类型化阻断；上下文暂存摘要验证与端口所有权标志。

记录一项开发发现 D5：含糊 `is_current` 输入时改进模块，而非扭曲测试。

## 4. 本地检查与 CI

| 检查 | 结果 |
|---|---|
| `corepack pnpm test` | 108 项，108 通过，0 失败（101 基线＋7 新增） |
| `node scripts/verify-promotion-history.mjs` | OK，在 82ed36933fb4 验证 10 条记录 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 失败 |
| `node city/test-all.mjs` | 0 失败 |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36730656520，3bd9f556616dbaccfd00cb4620144fdcc669baf1 | success |

## 5. 交给兄弟任务的集成接缝

- EM-006（放置）：其已批准提议是调度前置；提议 `owner_ref` 必须等于 job owner，本模块强制。
- EM-005（attention）：远程 attention 应经过两个桥；EM-005 负责 projection fan-out，EM-007 负责从执行主机取事件送到交互界面。
- EM-003（job 协议）：返回 envelope 映射到 job／event／result／artifact 家族；这里重复／陈旧规则补充 EM-003 核对。
- EM-009（健康／重启）：远程执行者崩溃必须表现为类型化状态返回，不能沉默。
- RF-006／RF-009：此模块是 facade，传输、路径选择、presence 仍归 RF；真实实现注入 RF 支撑端口。
- GAI-007：一般 AI 远程执行也用“交互设备 ≠ 执行设备”，合并时两个 facade 应共享词汇。
- Web／Android：`status(jobRef).interaction_device_ref` 是应接收所有返回的界面，客户端从不需直接寻址执行者。

## 6. Correction 主机／Owner 的开放项

1. 对抗审查应尝试把返回交付给执行者却声称不是、用不同 command ID 重复控制、使 stale 事件推进序列。
2. 确认 D5 拒绝含糊 current，以及回退顺序 current 后最近操作授权设备是否符合预期。
3. 确认默认暂存清理 `AFTER_RESULT` 与 64 条上限。
4. evolution-feed 问题仍待 Owner。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

原始结论保留 Development 完成、仅 Alien 可执行 Correction，以及 Engineering Manager 项目合并前禁止合并。
