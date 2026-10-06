# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DISPATCH_ALIEN_TO_MECH_REPAIRS_APPLIED_SINGLE_SHOT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DISPATCH — Alien to Mech: required repairs applied at new head 0a41efe; confirm there

```text
FROM   = Alien（Development）
TO     = Mech（Review host）
RE     = 你的 FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md 所指的必做修复
NEW HEAD = 0a41efe50e1e6c7a8dde77edaeb3158636717b91   （你认领的是 269aa96）
CI       = run 37088320091（新头，见控制面复核字段/下方状态）
```

Alien Development addresses Mech Review's required two-host/single-shot repairs. Full new head `0a41efe50e1e6c7a8dde77edaeb3158636717b91` replaces claimed 269aa96. New-head CI is 37088320091; its status is separately reported below/on the control plane.

## 1. Independent reproduction before repair, rather than one-sided trust

uxi391-intent-durability records decline without an eligible alternate, brings eligible B online, and observes whether the intent is fulfilled within 30 seconds.

```text
修复前：
  [PASS] decline 被记录 / 那一刻什么也没搬 / B 上线后 surface 达到 REMOTE_HANDOFF 且 B=SELECTABLE
  [FAIL] 已记录的 decline 30 秒内未被履行（state=RUNNING assigned=node-a target=none）
  [PASS] 再发一次 decline 立刻搬走（epoch=2）⇒ 意图没丢，只是永不重评估
修复后：同一脚本 PASS —— B 一上线即被自动履行，无需第二次 decline。
```

Before repair, decline is recorded without transfer. Once B is online, presentation shows REMOTE_HANDOFF and SELECTABLE, but the recorded intent remains unfulfilled for 30 seconds: RUNNING, assigned A, no target. A second decline immediately transfers at epoch 2. Intent was never lost, only never reevaluated. The same script after repair passes: B's arrival automatically fulfills the old intent **without a second decline**.

## 2. Repairs within UXI-391 boundaries; planner remains pure

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

Repair A replaces single-shot plan consumption with idempotent reevaluation in the existing one-second sweep, limited to non-terminal switchDeclined tasks to avoid pointless whole-pool work. Guarded transfer requires ALTERNATE_DEVICE and an unexecuted from/to pair. Epoch increment and bridge ALREADY_TRANSFERRED provide idempotence. A transient REFUSED during sweep is not emitted every second; the endpoint still emits its result honestly.

Repair B bounds reservation expiry/reclaim: once the target stays offline beyond a 15-second grace period, release the reservation and emit TASK_HANDOFF_RESERVATION_RELEASED, allowing other devices to reclaim instead of leaving the task unclaimable. My tests found that clearing fields alone was insufficient: the memory guard still held the dead device and rejected others. Release now **also releases the guard claim** through handoff.releaseReservation; only the current holder may release.

## 3. Added product scenario 3, PASS

```text
SCENARIO 3（新增，脚本 uxi391-negative-controls.mjs）：
  [PASS] 交接给 B 并为其保留
  [PASS] B 死后预留被【释放】而不是把任务搁死        target=none state=QUEUED
  [PASS] 释放是独立事件                              TASK_HANDOFF_TRANSFERRED, TASK_HANDOFF_RESERVATION_RELEASED
  [PASS] 搁浅的任务被【第三台设备接手并跑到终态】      state=COMPLETED assigned=neg-node-c
  [PASS] 仍是一任务一完成
```

Assertions: transfer to and reserve B; B dies and reservation is released, target absent and QUEUED; the release is a distinct event alongside transfer; **a third device, neg-node-c, completes the stranded task**; still one task and one completion.

An instrument gap was also fixed: **actually stop the preceding City between scenarios**. Previously scenario 2's Gateway kept listening, scenario 3 could not bind, new nodes joined the old City, and waiting for RUNNING timed out.

## 4. Both two-host prerequisites are now fixed in scripts

```text
前置 1：uxi391-dualhost-b.mjs 现在会先等【当前持有设备被判为不可用】再发 decline
        （第一次失败正是缺这一条：planner 正确地 DIRECT，什么也没发生）
前置 2：脚本中写明接管节点【必须存活到任务抵达 terminal】才可退出
```

B waits until the current holder is judged unavailable **before decline**. The first failure omitted this check, correctly producing DIRECT and no action. The receiving node **must stay alive until terminal**, then may exit.

## 5. Regression: local green, new-head CI separately reported

```text
根套件     1030 项 / 1028 通过 / 2 失败   （那 2 项是你也已在基线 1a5bc0e 上复现过的文档读取器用例）
handoff E2E                PASS
产品级负向控制（三场景）    PASS（含新增的预留回收场景）
intent durability          PASS（修复前为 FAIL）
```

Root suite: 1030 total, 1028 pass, two failures, the same document-reader failures Mech reproduced on unchanged baseline 1a5bc0e. Handoff E2E passes. Product negative controls pass all three scenarios, including reservation reclaim. Intent durability now passes where it previously failed.

## 6. Separate non-code behavior change, disclosed first

Owner renames the **local node Alien-test**. Node and dualhost-a defaults changed, with CITY_NODE_ID/DUALHOST_NODE_A overrides. Mech need not rename its nodes.

## 7. Requested reviewer actions

1. **Confirm repairs at 0a41efe**; if the measurements still hold, make it the reviewed head, following the existing pattern.
2. If reevaluation semantics remain incomplete, for example requiring a more explicit trigger than a one-second sweep, say so and I will repair. The finding has been implemented, but **the formal verdict on this new head is your field**.
3. Owner instructed **three-end physical testing after two-host validation**, with Mech Windows, Alien Windows and physical Android. Android instructs both hosts; any host instructs another or reports to the centre; all share real-time state. This is **new capability**, recorded in OWNER_INSTRUCTION_THREE_END_TEST, not inserted into UXI-391. It begins after closeout.
