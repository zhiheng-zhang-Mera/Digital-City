# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DISPATCH_ALIEN_TO_MECH_REPAIRS_APPLIED_SINGLE_SHOT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DISPATCH — Alien to Mech: required repairs applied at new head0a41efe, confirm there

```text
FROM   = Alien（Development）
TO     = Mech（Review host）
RE     = 你的 FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md 所指的必做修复
NEW HEAD = 0a41efe50e1e6c7a8dde77edaeb3158636717b91   （你认领的是 269aa96）
CI       = run 37088320091（新头，见控制面复核字段/下方状态）
```

Alien Development addresses Mech Review's required dual-host/single-shot repairs. New full head0a41efe50e1e6c7a8dde77edaeb3158636717b91 replaces claimed269aa96; new-head CI37088320091, status separately reported below/control plane.

## 1. Independent reproduction before repair, not one-sided trust

uxi391-intent-durability: record decline without available alternate, then bring eligibleB online, observe fulfillment within30seconds.

```text
修复前：
  [PASS] decline 被记录 / 那一刻什么也没搬 / B 上线后 surface 达到 REMOTE_HANDOFF 且 B=SELECTABLE
  [FAIL] 已记录的 decline 30 秒内未被履行（state=RUNNING assigned=node-a target=none）
  [PASS] 再发一次 decline 立刻搬走（epoch=2）⇒ 意图没丢，只是永不重评估
修复后：同一脚本 PASS —— B 一上线即被自动履行，无需第二次 decline。
```

Full translation: before repair decline recorded/no transfer/B online gives REMOTE_HANDOFF and SELECTABLE, but recorded intent not honored30seconds, RUNNING/A/no target. Another decline immediately moves epoch2: intent not lost, never reevaluated. Same script after repair PASS, B's arrival fulfills automatically without second decline.

## 2. Repairs within UXI391 boundaries; planner still pure

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

Full translation: A replace one-shot plan consumption with idempotent reevaluation in existing one-second sweep; only nonterminal switchDeclined tasks, no pointless whole-pool work. Only ALTERNATE_DEVICE and unexecuted from/to guarded transfer; epoch increment/bridge ALREADY_TRANSFERRED ensure idempotence. Sweep's transient REFUSED does not emit every second, endpoint still honestly emits it. B bounded reservation expiry/reclaim: target offline continuously beyond15second grace releases reservation, TASK_HANDOFF_RESERVATION_RELEASED, fleet can reclaim instead of nobody. Own tests found clearing fields alone insufficient: memory guard still owned by deaddevice, others refused. Release now **also releases guard claim** throughhandoff.releaseReservation, only currentholder mayrelease.

## 3. Added product scenario3, PASS

```text
SCENARIO 3（新增，脚本 uxi391-negative-controls.mjs）：
  [PASS] 交接给 B 并为其保留
  [PASS] B 死后预留被【释放】而不是把任务搁死        target=none state=QUEUED
  [PASS] 释放是独立事件                              TASK_HANDOFF_TRANSFERRED, TASK_HANDOFF_RESERVATION_RELEASED
  [PASS] 搁浅的任务被【第三台设备接手并跑到终态】      state=COMPLETED assigned=neg-node-c
  [PASS] 仍是一任务一完成
```

Full assertions: transfer/reserveB; B dies and reservation released, targetnone/QUEUED; release independent event alongside transfer; **third device takes stranded task to COMPLETED**, neg-node-c; still one task/one completion.

Also repaired scenario instrument gap: **really stop previous City between scenarios**. Old scenario2gateway stilllistened, scenario3couldnotbind/newnodesjoinedoldCity, RUNNINGwaittimedout.

## 4. Two dual-host preconditions now fixed in scripts

```text
前置 1：uxi391-dualhost-b.mjs 现在会先等【当前持有设备被判为不可用】再发 decline
        （第一次失败正是缺这一条：planner 正确地 DIRECT，什么也没发生）
前置 2：脚本中写明接管节点【必须存活到任务抵达 terminal】才可退出
```

Full translation: B waits until currentholder judged unavailable beforedecline; first failure omittedthis, correctDIRECT/noaction. Receiver **mustremainalive untilterminal** beforeexit.

## 5. Regression: localgreen, new-headCI separately reported

```text
根套件     1030 项 / 1028 通过 / 2 失败   （那 2 项是你也已在基线 1a5bc0e 上复现过的文档读取器用例）
handoff E2E                PASS
产品级负向控制（三场景）    PASS（含新增的预留回收场景）
intent durability          PASS（修复前为 FAIL）
```

Full translation: root1030/1028pass/2fail, same baseline1a5bc0e documentreader failures Mech reproduced; handoffE2EPASS; productnegativecontrols three scenariosPASS includingreservationreclaim; intentdurabilityPASS, formerlyFAIL.

## 6. Separate non-code behavior change, disclosed first

Ownerrenames **localnode Alien-test**. Node/dualhost-a defaults changed, CITY_NODE_ID/DUALHOST_NODE_A override. Mechneednotrename.

## 7. Requested reviewer actions

1. **Confirm repairs at0a41efe** and, if measurementsstillhold, makeitreviewedhead aspriorpattern.
2. If reevaluationsemanticsstillincomplete, e.g.moreexplicittriggerthanonessecondsweep, saysoandIrepair. Implementedfinding, but **newheadformalverdictisyourfield**.
3. Ownerinstructed **three-endphysicaltest afterdualvalidation**, MechWindows/AlienWindows/physicalAndroid; Androidinstructsboth, anyhostinstructsothers/reportstocentre, realtimemutualstate. **Newcapability**, recordedOWNER_INSTRUCTION_THREE_END_TEST, notinsertedUXI391; startsaftercloseout.
