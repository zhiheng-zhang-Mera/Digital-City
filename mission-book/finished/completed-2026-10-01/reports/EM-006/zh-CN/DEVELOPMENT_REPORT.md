# EM-006 开发报告：本地优先的 Sub-worker 放置门槛

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-006 (Engineering Manager programme, task 6 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 6e6cbce (Digital-City main, "claim(EM-006): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:12:24Z
CONTROL_REVISION_AT_CLAIM= 73e5cc0 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-006-local-first-subworker-placement
IMPLEMENTATION_HEAD_SHA  = 2894e8da9d95f54dbb568d8acc510b91bdeae4fb
BRANCH_CI                = 36727765139 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始元数据逐字保留任务、开发阶段、Mech 主机、领取提交与时间、控制版本、仓库、基线、实现分支及 SHA、CI、本地测试和完成／禁止组件分支合并的状态。

## 1. 交付物

`contracts/engineering-placement-v1/` 包含 `placement.mjs`（测量契约、本地放置评估、远程回退提议／批准、能力排序、本地尝试门槛、速度字段防护）、`index.mjs`（公共接口与保证）、8 项测试套件以及根 `tests/engineering-placement.test.mjs`。

| 必需验收项 | 测试 |
|---|---|
| 首先尝试本地主机 | 健康本地主机应使用本地并发；远程调度前必须记录本地尝试 |
| 单凭远程更快或负载更低不得触发回退 | 更快或负载更低的远程主机本身永远不触发回退 |
| 远程回退需要测量所得阻断决定与用户明确批准 | 远程回退必须有测量原因和用户明确批准 |
| 提议回退前降低本地并发 | 资源压力先降低本地并发，之后才考虑远程回退 |
| 资格成立后才按能力匹配而非速度排序 | 只有回退理由成立后才按能力匹配排序候选 |
| 用户受保护的前台负载优先 | 受保护前台工作负载阻断本地主机，而非挤占用户工作 |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1：领取哪项任务。** 最新扫描未发现自己的修复任务，也没有可领取的另一主机 Correction（Alien 正在纠正 RF-003），因此使用未领取 Development 层级。按与自己 BA 领取任务不同计划的平局规则选择 EM-006，同时它承担该计划第二条硬不变量。

**D2：门槛依据什么决定？** 选项：（a）设备描述；（b）“忙碌”这样的形容词；（c）有类型的测量记录。选择（c），带 `observed_at` 和 `source`，每个决定以 `evidence` 返回实际使用的测量。远程回退仅可因测量确认的本地阻断而提议，所以未经测量的意见不得产生提议，而且决定必须能事后审计。缺失或不合理测量（可用内存为零、`max < 1`）返回 `LOCAL_UNAVAILABLE`，绝不假定资源空闲。

**D3：决定顺序。** 先判断受保护前台负载（`LOCAL_BLOCKED`，用户自己的工作优先于 Sub-worker），再判断不可测容量（`LOCAL_UNAVAILABLE`），然后压力导致并发降为单 worker（`LOCAL_THROTTLED`、`remote_fallback_eligible: false`），再进行压力下的余量削减，最后 `LOCAL_ALLOWED`。不变量明确要求提议远程前先削减本地工作，因此限流主机不得获得回退资格；忙碌但仍可运行不是把工作移出机器的理由。

**D4：如何强制“更快不是理由”？** 三道独立防护：（1）`proposeRemoteFallback` 拒绝非 `LOCAL_BLOCKED`／`LOCAL_UNAVAILABLE` 的本地决定，返回 `REMOTE_FALLBACK_NOT_JUSTIFIED`；（2）拒绝未标记自身 `remote_fallback_eligible` 的决定；（3）携带速度／空闲／优先级排序字段的候选直接以 `SPEED_IS_NOT_A_REASON` 拒绝，而非忽略。静默忽略 `speed_rank` 会使调用者误以为排序被考虑，直接拒绝使规则可见。排序函数随后仅按能力匹配与主机引用排序，提议记录 `ranked_by_speed: false`。

**D5：批准。** 提议固定 `requires_user_approval: true`；批准必须带非空 `approvedBy` 和时间，结果记录 `approved_by`、`scope: 'CURRENT_JOB'`、`local_attempted_first: true`、`owner_preserved: true`。V1 要求用户明确批准；移动执行不移动逻辑 owner，与 EM-001／EM-003 已建立的分离一致。

**D6：本地尝试证据。** `assertLocalFirstAttempted` 拒绝没有 `scope: 'LOCAL'` 尝试记录的调度，并报告是否先降低并发。不变量关注行为而非提议形状；没有本地尝试记录的远程调度无法区别于跳过本地主机。

**D7：测量是输入，不是探针。** 模块不执行 OS 探测，也不导入任何内容；主机适配器提供测量。相同任务在不同主机应能不依赖机器进行测试，且 OS 特定探测明确不在组件范围内。

**D8：无 `schema.json`。** 与其他计划分支一致。

## 3. 测试汇总

8 项全部通过：健康本地放置与测量证据；压力降低并发且回退不合格（CPU、worker 池满、内存路径），限流提议被拒；受保护前台工作负载在 GPU 受保护且 worker 正运行时阻断，但全屏应用本身不阻断；不可测主机返回 `LOCAL_UNAVAILABLE`，拒绝错误百分比、布尔、未知字段、错误时间和无效策略；核心不变量——健康本地主机遇到空闲高速远程仍拒绝回退，即使回退合理也拒 `speed_rank`／`idle_percent`；测量原因和批准要求，包括拒 `measured_reason: 'FASTER'` 与 `requires_user_approval: false`；资格之后按能力匹配且主机引用顺序确定；本地尝试门槛及其限流报告。

## 4. 本地检查与 CI

| 检查 | 结果 |
|---|---|
| `corepack pnpm test` | 109 项、109 通过、0 失败（101 基线＋8 新增） |
| `node scripts/verify-promotion-history.mjs` | OK，在 82ed36933fb4 验证 10 条记录 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 失败 |
| `node city/test-all.mjs` | 0 失败 |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36727765139，2894e8da9d95f54dbb568d8acc510b91bdeae4fb | success |

## 5. 交给兄弟任务的集成接缝

- EM-002（连接器运行时）：测量来自主机适配器；`workers.running`／`workers.max` 应反映运行时自身实例数，而不是另一计数器。
- EM-004（注册表）：候选 `capability_refs` 应由注册表解析，让这里按已验证能力而非声明排序。
- EM-007（远程 Sub-worker 返回控制）：`approveRemoteFallback` 产生交给 EM-007 的放置结果；`owner_preserved` 与 EM-007 在结果返回交互界面时必须维持的保证相同。
- EM-010（队列／worker 池）：`concurrency` 是池的本地预算，必须遵守 `LOCAL_THROTTLED`，不能只最大化吞吐量。
- RF-009／presence 与 EM-007：远程候选需要真实在线状态；本模块有意只接收候选输入，从不发现候选。
- Web／Android：用户批准提示应由 `proposal.measured_evidence` 驱动，问题应是“你的主机因……被阻断”，而不是“另一台机器更快”。

## 6. Correction 主机／Owner 的开放项

1. 对抗审查应尝试从限流或未经测量的决定到达远程回退、通过防护未列出的字段名夹带排序，以及伪造本地尝试后远程调度。
2. 确认 D3 阈值（`cpu_block_percent: 92`、`memory_block_percent: 90`、`reduce_concurrency_to: 1`）作为平台策略，或是否应归 owner 可编辑策略。
3. 确认没有运行 worker 时受保护 GPU 是否也应阻断；目前只在 worker 正运行时阻断。
4. evolution-feed 问题仍待 Owner 决定。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

原始结论：Development 完成；Correction 必须由 Alien 而非 Mech 执行；Engineering Manager 项目合并前禁止合并。
