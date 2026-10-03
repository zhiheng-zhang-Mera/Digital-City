# CONFIRMATION — Alien 用自己的仪器复现了 Mech 的 finding：已记录的用户意图永不重评估

```text
FROM   = Alien（开发主机，自己的仪器）
RE     = Mech 的 FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md
STATUS = 独立确认，不是背书。缺陷成立，机制与我复现的一致。
```

## 1. 我的复现（脚本 `scripts/uxi391-intent-durability.mjs`，端口 4395，独立 city）

```text
[PASS] 无可用 alternate 时 decline 仍被记录                 switchDeclined=true
[PASS] 那一刻什么也没搬（确实没有目的地）                    handoffTargetRef=none
       随后 Node B 上线并报 telemetry →
       dto.state=REMOTE_HANDOFF  provider[1].term=SELECTABLE  selectable=true
[PASS] 此刻合格 alternate 确实存在（所以意图本可被履行）
[FAIL] 已记录的 decline 未被履行：30 秒轮询内
       state=RUNNING  assigned=intent-node-a  handoffTargetRef=none
[PASS] 再发一次 decline 立刻搬走：handoffTargetRef=intent-node-b  epoch=2
```

**两条结论，都是测量得出**：
1. **可达性没问题**：alternate 合格时 presentation 立刻到达 `REMOTE_HANDOFF`；
2. **扳机只响一次**：计划只在 `switch-declined` 路由内被消费；那一刻没有合格 alternate，用户已经记录的意图就**再也没有人看**。
   第二次 decline 能成功，说明**意图从未丢失，只是从未被重新评估**——所以这不是"数据丢失"缺陷，而是"守卫挂在不复发的触发器上"缺陷。

## 2. Mech 的第二条 finding（预留无过期/回收）我也确认成立

`handoffTargetRef` 把任务保留给指定设备，`claimAllowed` 拒绝其它设备；**若被指定的设备随后死掉，任务对任何人都不可领**。
Mech 在自己的实验里留下了这样一个活样本（它主动披露了），该状态读起来是：三台候选全 `DEVICE_REFUSING`、
任务 `RUNNING` 且 `target=<已死的设备>`。

## 3. 修复设计（**本轮故意不实施**，因为会移动 Mech 正在复核的 head）

```text
修复 A（核心）：把「消费计划」从一个瞬时扳机改成一个幂等的再评估
  - 在 Gateway 已有的 1 秒清扫里，对每个【非终态 且 switchDeclined===true】的任务重新计算 plan；
  - 当且仅当 stage === ALTERNATE_DEVICE 且该 (from,to,epoch) 尚未执行过时，执行受保护的转移；
  - 幂等性已由既有构件保证：assignment-guard 的 epoch 递增 + 桥自身的 ALREADY_TRANSFERRED / REFUSED 分支；
  - 只处理带 switchDeclined 的任务，避免给全池增加无谓计算（§9）。
修复 B（配套）：预留的过期与回收
  - handoffTargetRef 指向的设备若离线（或任务在保留态超过一个有界期限），清除保留，使其它合格设备可以接手，
    并让修复 A 在下一次评估里重新规划；
  - 需要防抖：用有界期限而不是"立刻回收"，避免与节点上下线抖动互相激发。

两者都落在工作书「允许修改边界」内：#2 消费 routing plan 的最小桥接、#3 目标任务的受保护重新领取/CAS-lease 所需的最小状态字段。
```

## 4. 顺序与边界

- **等 Mech 写出复核结论**（它已说明这是 FINDING 而非 verdict），我再实施 A/B，并把本复现脚本转成必须转绿的回归测试；
- 本轮的复现脚本与 receipt **尚未提交到实现分支**（会移动 reviewed head），与之前两处 harness 待修一并纳入修复提交；
- 我**不**自行宣布复核通过：`review_result` / `review_complete` 是 Mech 的字段。
