# RS-202 · 步骤 1 — 现有调度/存在性/路由实现审核与 seams

```text
任务    = RS-202 多设备并发感知与再调度
开发主机 = Alien        基线 = de91f5e（UI_BASELINE_FROZEN 后的 main）
步骤    = 施工步骤 1「审核现有 EM-010 foreman scheduler、GAI routing、Remote device/presence contracts」
```

以下结论来自对三个 seam 文件**导出面与策略常量**的实际提取，不是印象。

## 一、三层已有地基（各自规模已实测）

| 层 | 文件 | 规模 |
|---|---|---|
| 调度（EM-010 foreman） | `contracts/engineering-foreman-scheduler-v1/foreman.mjs` | 847 行 + 500 行一致性测试 |
| 设备存在性 | `contracts/remote-presence-reconnect-v1/presence.mjs` | 450 行 + 430 行一致性测试 |
| 路由/负载 | `city/00-foundation/01-city-core/fleet-routing/` | `contracts.mjs` 461 行、`adaptive-routing.mjs` 70、`capability-routing.mjs` 162、`fleet.mjs` 137 |

## 二、**已经存在、必须复用而不是重建**的东西

这一节是本次审核最重要的产出：RS-202 的大部分语义在地基上已经有词汇，重复发明会造成
第二个真相源——正是 RS-201 审核时避免掉的错误。

**并发与冲突**
- `foreman.mjs` 导出 **`scopesOverlap(left, right)`**：作用域冲突判定**已经存在**，
  「同一用户多设备并发公平性」与防止双执行应当建立在它之上。
- `ASSIGNMENT_STATES_TRANSFERABLE_ON_DROPOUT = QUEUED | ASSIGNED | RUNNING | CHECKPOINT…`
  （fleet-routing）：**设备掉线后可转移的状态集合已经定义**。

**单次执行 / 幂等**
- `presence.mjs` 的 **`PENDING_STATES = PENDING | UNKNOWN | CONFIRMED_SUCCEEDED | CONFIRMED_FAILED | EXPIRED`**
  ——「结果确认」这一语义**已经建模**，完成门槛要求的 single-execution/idempotency 可证明性
  应当挂在这里，而不是新造一套。
- `RECONCILE_OUTCOMES = RESUMED | DROPPED_EXPIRED | DROPPED_LIVE_CONTEXT_LOST | …`
  ——**设备离线恢复的对账结果已经枚举**。

**排队与分流**
- `QUEUE_POLICIES = QUEUEABLE | LIVE_ONLY`（presence）——**可排队性已经表达**。
- fleet-routing 已定义 **`ROUTE_QUEUED_HISTORY = 'queued: no eligible node'`** 与
  `ROUTE_QUEUED_NOTE = 'no eligible node'`——**「没有合格节点就排队」这条路径已经存在**，
  这正是完成门槛「不切换 provider 时仍有明确的排队/跨设备路径」的落点。
- `DROPOUT_TRANSFERRED_* / DROPOUT_REASSIGN_* / DROPOUT_FAILED_*`
  ——掉线后转移/重派/失败三种去向已经区分。

**设备状态与可达性**
- `PRESENCE_STATES` 含 **BUSY**；`REACHABLE_STATES = ONLINE | BUSY | DEGRADED`
  ——「设备忙」**已经是可达状态之一**，不需要新增。
- `FLEET_NODE_STATES = READY | DEGRADED | OFFLINE | FAILED | DISABLED`，
  另有 `FLEET_NODE_STATES_REFUSING_WORK` 与 `CANDIDATE_STATES_EXCLUDED = FAILED | DISABLED | RECOVERING`。
- 心跳分级已定义：`FLEET_HEARTBEAT_INTERVAL_MS = 5000`、`DEGRADED_AFTER_MS = 10000`、
  `OFFLINE_AFTER_MS = 30000`；presence 侧 `offline_after_ms = 60000`。

**策略旋钮（默认值已实测）**
```text
DEFAULT_FOREMAN_POLICY  = { max_workers: 4, min_workers: 1, scale_up_after_ticks: 2,
                            scale_down_immediately: true, pressure_pause_threshold: 0.9,
                            max_attempts: 3, placement: 'LOCAL_FIRST' }
DEFAULT_PRESENCE_POLICY = { offline_after_ms: 60000, default_queue_deadline_ms: 300000,
                            max_queue_deadline_ms: 3600000, max_audit_entries: 1000 }
```

**路由打分**
- fleet-routing 已有 `NEUTRAL_PRIOR`、`UTILITY_WEIGHTS`、`ADAPTIVE_POLICY_VERSION = 'adaptive-policy-1.0.0'`
  与一系列 `adaptiveXxx` / `utilityInputs` 记录构造器——**效用打分的形状已经存在**。

## 三、**真正的缺口**（逐条对照施工步骤）

| 步骤要求 | 现有状态 | 结论 |
|---|---|---|
| 当前 **session / provider 并发度**作为可解释输入 | `pressure_pause_threshold: 0.9` 只是一个**标量阈值**，没有 per-session/per-provider 并发模型 | **缺失** |
| **设备运行负荷**作为输入 | 只有标量 pressure；fleet-routing 有 `UTILITY_WEIGHTS` 可承载 | **需扩展** |
| 设备可达性 | 已有（presence/fleet 状态） | 复用 |
| policy / 用户禁用 | 用户禁用已在 RS-201 落地为 `ENABLEMENT` | **跨任务复用** |
| **提供 provider 切换选择 → 用户不切换才排队** | 无 | **缺失，且恰好是 RS-201 的接口** |
| 排队 / 跨设备备选 | `ROUTE_QUEUED_*` 已有 | 复用 |
| **bounded retry / 事件驱动优先的 re-scan** | 无（RS-201 的有界探针是**可用性探针**，不是重扫） | **缺失** |
| **anti-flap / hysteresis** | 无；仅 `scale_up_after_ticks: 2` 是弱先例 | **缺失** |

**一个关键的 seam 判断：** 步骤 3 要求「先提供 provider 切换选择，用户不切换时再进入排队/分流」。
RS-201 已经交付了 `suggestSwitch`，其返回对象恒为 `executed: false` + `requires_user_confirmation: true`，
且模块内**没有任何执行切换的函数**。所以 RS-202 不需要新建「用户选择」语义——它应当**消费**
RS-201 的稳定输出，把「建议」与「执行」之间已存在的结构性分离直接用作路由序列的一环。
这正是 RS-201 与 RS-202 作为同源兄弟任务的接口位置。

**一个必须遵守的禁止边界：** 步骤 3 说要分流到「alternate eligible device」，但禁止边界同时写着
**不跨越 Remote Fabric trust/permission**，而 `SCOPES`/`scopesOverlap` 与 remote-fabric 契约是权限归属地。
所以「eligible」只能表达为**可调度性**，绝不能顺手改写权限——完成门槛第一条
「并发压力能影响调度但不会改写权限」正是这条。

## 四、方法备注（避免重犯）

第一次定位时，递归搜索被 `.runtime/evidence/mission-book/*/frozen-*/` 下的**历史冻结快照**
污染——那些目录里含有同一批源码树的完整副本，搜索会返回大量历史重复，据此得出的 seam 图会是错的。
排除 `.runtime` 之后得到的才是上表的可信映射。这与 UI-190 中端口被旧进程占用导致读到**另一个构建**
是同一类陷阱：**先确认读到的是当前树，再下结论**。

## 五、seams 定在哪里

```text
SEAM A (并发/负荷输入)  city/00-foundation/01-city-core/fleet-routing/contracts.mjs
                        -> 在既有 UTILITY_WEIGHTS / NEUTRAL_PRIOR 形状上扩展多因子负荷，
                           不得把 CPU/GPU 单指标等同于「设备忙」（任务明文禁止）
SEAM B (权限与可调度性分离) 复用 foreman 的 scopesOverlap；只表达 eligible，不改写 trust/permission
SEAM C (路由序列)       消费 RS-201 的 suggestSwitch 作为「切换选择」环节；
                       排队走既有 ROUTE_QUEUED_*；bounded retry 新建
SEAM D (re-scan)        事件驱动优先，20 分钟仅作上限参考；不得死等
SEAM E (anti-flap)      新建 hysteresis；可借鉴 scale_up_after_ticks 的「连续 N 次」形状
```

语言配对 / Language pair: [原文 / Source](./STEP1_SEAM_AUDIT.md) · [译本 / Translation](./en/STEP1_SEAM_AUDIT.md)
