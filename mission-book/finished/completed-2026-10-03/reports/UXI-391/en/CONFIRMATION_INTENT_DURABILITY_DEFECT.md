# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../CONFIRMATION_INTENT_DURABILITY_DEFECT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# CONFIRMATION — Alien independently reproduces Mech's finding: recorded user intent is never reevaluated

```text
FROM   = Alien（开发主机，自己的仪器）
RE     = Mech 的 FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md
STATUS = 独立确认，不是背书。缺陷成立，机制与我复现的一致。
```

Complete translation: Alien Development host uses its own instrument for Mech's dual-host/single-shot finding. Independent confirmation, not endorsement: defect is real and mechanism matches my reproduction.

## 1. My reproduction: scripts/uxi391-intent-durability.mjs, port4395, independent City

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

Complete result translation: PASS decline is recorded without an available alternate, switchDeclined=true. PASS no transfer then, handoffTargetRef none, genuinely no destination. Node B subsequently comes online and reports telemetry; DTO REMOTE_HANDOFF, provider1 SELECTABLE/selectabletrue. PASS an eligible alternate now exists so intent could be fulfilled. FAIL the recorded decline remains unfulfilled for30seconds of polling: RUNNING, assigned intent-node-a, no target. PASS sending another decline immediately transfers to intent-node-b, epoch2.

**Two measured conclusions**:

1. **Reachability is sound**: eligible alternate immediately gives presentation REMOTE_HANDOFF.
2. **Trigger fires only once**: plan consumed only inside switch-declined route; if no eligible alternate then, **nobody ever revisits recorded intent**. Second decline succeeds, proving **intent never lost, only never reevaluated**. Not data loss; a guard attached to a nonrecurring trigger.

## 2. Mech's second finding, reservation without expiry/reclaim, also confirmed

handoffTargetRef reserves for named device, claimAllowed refuses others. **If that device later dies, nobody can claim**. Mech deliberately disclosed a live sample: three candidates DEVICE_REFUSING, task RUNNING, target dead device.

## 3. Repair design, deliberately NOT implemented this round because it would move Mech's review head

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

Full design translation: Repair A, core: replace momentary plan consumption with idempotent reevaluation. In existing one-second gateway sweep, recalculate plans for each nonterminal task with switchDeclined===true. Execute guarded transfer iff stage ALTERNATE_DEVICE and that from/to/epoch not already executed. Existing assignment-guard epoch increments and bridge ALREADY_TRANSFERRED/REFUSED provide idempotence. Process only switchDeclined tasks to avoid unnecessary pool-wide computation undersection9. Repair B, accompanying: expiry/reclaim reservation. If reserved device goes offline, or reservation exceeds bounded deadline, clear it so other eligible devices can take over and A replans next evaluation. Debounce with bounded deadline rather than immediate reclaim to avoid amplifying node flapping. Both within allowed boundaries2 minimal routing-plan consumption bridge and3 minimal protected-reclaim/CAS-lease state fields.

## 4. Sequence and boundaries

- **Wait for Mech review conclusion**, currently FINDING notverdict, then implementA/B and turn reproduction into regression that must become green.
- This round's script/receipt **not yet committed to implementationbranch** because that movesreviewhead; include with two pending harness fixes inrepaircommit.
- Do **not** declareReview PASS myself; review_result/review_complete belong toMech.
