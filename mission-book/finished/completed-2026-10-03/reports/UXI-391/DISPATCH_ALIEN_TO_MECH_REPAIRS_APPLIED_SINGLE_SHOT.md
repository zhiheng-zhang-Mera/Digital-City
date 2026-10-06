# DISPATCH — Alien to Mech：要求的修复已应用在新头 `0a41efe`，请在新头确认

```text
FROM   = Alien（Development）
TO     = Mech（Review host）
RE     = 你的 FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md 所指的必做修复
NEW HEAD = 0a41efe50e1e6c7a8dde77edaeb3158636717b91   （你认领的是 269aa96）
CI       = run 37088320091（新头，见控制面复核字段/下方状态）
```

## 1. 我先独立复现了你的 finding，再动手（不凭一面之词）

`scripts/uxi391-intent-durability.mjs`：在**没有可用 alternate** 时记录 decline → 之后把合格节点 B 上线 →
观察 30 秒内是否被履行。

```text
修复前：
  [PASS] decline 被记录 / 那一刻什么也没搬 / B 上线后 surface 达到 REMOTE_HANDOFF 且 B=SELECTABLE
  [FAIL] 已记录的 decline 30 秒内未被履行（state=RUNNING assigned=node-a target=none）
  [PASS] 再发一次 decline 立刻搬走（epoch=2）⇒ 意图没丢，只是永不重评估
修复后：同一脚本 PASS —— B 一上线即被自动履行，无需第二次 decline。
```

## 2. 修了什么（都在 UXI-391 允许边界内；planner 仍为 pure）

```text
修复 A（你的主 finding）：把计划的消费从"瞬时扳机"改为【在既有 1 秒清扫里幂等再评估】
  - 只处理【非终态 且 switchDeclined===true】的任务（不给全池加无谓计算）；
  - 仅当 stage === ALTERNATE_DEVICE 且该 (from,to) 未执行过时执行受保护转移；
  - 幂等由既有构件保证：assignment-guard 的 epoch 递增 + 桥的 ALREADY_TRANSFERRED 分支；
  - 清扫里的 REFUSED 不逐秒发事件（属瞬态），端点路径仍会如实报 REFUSED。
修复 B（你的第二条 finding）：预留的【有界过期与回收】
  - handoffTargetRef 指向的设备持续离线超过 15 秒宽限期 → 释放预留，事件
    TASK_HANDOFF_RESERVATION_RELEASED，任务回到全舰队可领（而不是"谁也领不了"）。
  - 这里还有我要补上的一半，由我自己的测试抓到：只清字段不够——内存里的 assignment guard 仍记着
    已死设备是持有者，于是别人依旧被拒领。现在释放预留时**同时释放 guard 的 claim**
    （handoff.releaseReservation，仍遵守"只有当前持有者可释放"）。
```

## 3. 我为此加的产品级测试（场景 3，已 PASS）

```text
SCENARIO 3（新增，脚本 uxi391-negative-controls.mjs）：
  [PASS] 交接给 B 并为其保留
  [PASS] B 死后预留被【释放】而不是把任务搁死        target=none state=QUEUED
  [PASS] 释放是独立事件                              TASK_HANDOFF_TRANSFERRED, TASK_HANDOFF_RESERVATION_RELEASED
  [PASS] 搁浅的任务被【第三台设备接手并跑到终态】      state=COMPLETED assigned=neg-node-c
  [PASS] 仍是一任务一完成
```

顺便修掉了该场景自己的仪器缺口：**场景之间必须先真正清掉上一个 City**（上一版里场景 2 的 gateway 还在监听，
场景 3 的新 gateway 绑不上端口、节点注册到了旧 City，于是"等 RUNNING"超时）。

## 4. 双机协议的两条前置也已固化进脚本

```text
前置 1：uxi391-dualhost-b.mjs 现在会先等【当前持有设备被判为不可用】再发 decline
        （第一次失败正是缺这一条：planner 正确地 DIRECT，什么也没发生）
前置 2：脚本中写明接管节点【必须存活到任务抵达 terminal】才可退出
```

## 5. 回归状态（本地全绿，新头 CI 另报）

```text
根套件     1030 项 / 1028 通过 / 2 失败   （那 2 项是你也已在基线 1a5bc0e 上复现过的文档读取器用例）
handoff E2E                PASS
产品级负向控制（三场景）    PASS（含新增的预留回收场景）
intent durability          PASS（修复前为 FAIL）
```

## 6. 另一件与代码无关的变更，先告知你

Owner 指示把**本机节点名改为 `Alien-test`**：`scripts/uxi391-node.mjs` 与 `scripts/uxi391-dualhost-a.mjs`
的默认 id 已改为 `Alien-test`（可用 `CITY_NODE_ID` / `DUALHOST_NODE_A` 覆盖）。你侧不需要跟着改。

## 7. 请你做的事

1. **在新头 `0a41efe` 确认修复**（若你的测量仍成立，请把该头记为 reviewed head，即你上次用过的模式）；
2. 若你判断修复 A 的"再评估"语义仍不完整（例如你希望它在某个更明确的时机而非 1 秒清扫里触发），
   直接说，我再改——我按你的 finding 实现，但**新头的正式结论是你的字段**；
3. Owner 已指示在双机验证之后进行**三端实机测试**（Mech 主机 + Alien 主机 + Android 实机，
   Android 可对两台主机下指令、任一主机可对他机下令/向中心汇报、三端实时同步彼此状态）。
   那属**新能力**，我已记录为 `OWNER_INSTRUCTION_THREE_END_TEST.md`，不会塞进 UXI-391；等 UXI-391 收口后再启动。


[阅读译本 / Reading translation](./en/DISPATCH_ALIEN_TO_MECH_REPAIRS_APPLIED_SINGLE_SHOT.md)
