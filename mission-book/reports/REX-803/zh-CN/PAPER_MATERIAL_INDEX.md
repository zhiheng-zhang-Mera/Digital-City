# REX-803 开发证据与素材

[English source / 英文原文](../PAPER_MATERIAL_INDEX.md)。阅读译本保留全部历史及更正，当前 authority 仍为工作书/最新源报告。

开发 Mech，MEGA-REP/Mech-DS；baseline`213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`；该早期 snapshot implementation`57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1`；branch rex/REX-803-mech-scenario-runner；PR31。Alien Formal Review PENDING，SCENARIO_REPETITION_ENGINE_ACCEPTED 未释放。

## 研究对象

不是循环能否 N 次，而是真实系统可能丢失真实 work 时，**每 repetition 能否只计一次、始终解释、精确复现**。所有决定让 lost/cancelled/timed-out/interrupted 可见，不隐形。

## 决定与观察

- repetition 是真 canonical task：产品自身 creation，outcome=terminal，无 simulation，不能声明 City 未达结果或未执行工作成功。
- Seed derived 非随机 draw：纯 FNV-1a seed(campaignSeed,index)，默认 experimentId@digest，双 host 同 manifest 同序列。**2026-10-06 更正**原还称 seed 选 declared worker 令 placement 可复现，reviewed head 此声明 FALSE：runOnce 读未设置 context?.workers，规则未执行、先 claim assignedNodeId。首次双 worker 找到、单 worker 未找到；repair probe/REX-803-mech-two-worker-rehearsal，详 AUTHOR_THIRD_CLASS_SWEEP§7/ AUTHOR_TWO_WORKER_REHEARSAL。seed 序列性质独立 probe 不受影响。
- warmup 执行但不计 measurement，以名称标注不混入结果。
- 每 planned repetition 恰一 MEASURED/WARMUP/TIMEOUT/FAILED/EXCLUDED/CANCELLED/SKIPPED/INTERRUPTED，terminal accounted===planned、无双计；test 非散文证明。
- stop/timeout 触 control cleanup 真正 cancel canonical task，不只是停止观察，避免 leaked execution。
- restart 第一等 outcome：死 process RUNNING 恢复 INTERRUPTED，inflight seed 记录，recovery hook 按 ref 找 work；resume 同 campaign/seed，lost 保留不被后 run 替换；abandon 独立显式。
- manifest stopConditions bound，caller 只收紧；acceptance.minimumSuccessfulRuns 不作 stop，criterion 非 production bound。
- readiness 实时测全部 host/worker/surface，缺任何拒并点名。
- filed receipt immutable：finished campaigns/id.json 一次写，live state 随进度 overwrite 但 receipt 不改。

## 数量观察

| 观察 | 值 | 证据 |
|---|---|---|
| engine probes exact head | 12 pass/0 fail | utopia:tests/rex803-scenario-runner.test.mjs |
| real Gateway route/E2E | 4 pass/0 fail | rex803-campaign-surface.test.mjs |
| browser | 2 pass/0 fail | rex803-campaign-web.test.mjs |
| 邻近 REX801/802+WBC601..604 | 51 pass/0 fail | npm test selection |
| 全 tests glob 早期记录 | 1363 pass/5 fail，源当时分类 inherited-environment | 下表历史及后续 development 更正保留 |
| settled run:trace | 1:1，canonicalRefs.taskRef 指 real task | route test |
| resume accounting | 无双计、保留 interrupted | restart test |

### Mech+Android physical campaign（2026-10-06）

| 观察 | 值 | evidence/raw/mission-book/REX-803 证据 |
|---|---|---|
| 常驻 campaign | 2，campaign-96b56dc0…/b0ebb3af…，均 COMPLETED | physical-campaign-receipt.json |
| 每 campaign repetitions | 4planned=1warmup+3measured，terminalAccountingComplete true | 同上 |
| canonical tasks | 每 campaign4WAIT 全 COMPLETED，各有 researchRunRef | physical-canonical-tasks.json |
| trace receipt | 每 settled1，real task，latencyMs 约 7.0–7.1s | physical-run-receipts.json |
| seeds | 各异 derived，campaign1 275013131/276690950/278368569 | receipt |
| seed identity | mech-android-canonical-repetition-r2@b872f35c85a66fc1d9304d5cf0b7be2f，32hex | receipt |
| control surface | OPPO PERM00 ADB，dev-be7832e3…，controlOnline true | physical-live-topology.json/android-control-surface-online.png |
| Owner page | campaign/durations/task ids、无 measurement 空区解释、两 filed receipts | physical-campaign-live-surface.png/physical-surface-observation.json |
| Alien | 全程 OFFLINE，lastHeartbeat2026-10-05T11:15:06Z | physical-pre-state.json |

latency 为单 host wall-clock，主要 node polling cadence，**非 performance claim**，无 comparison/speed-up/efficiency 声明。

## 失败与 defects（保留不清洗）

| 阶段 | 观察 | 分类 | 处理 |
|---|---|---|---|
| Resume | repetition0 双 row，accounting 貌似可信却 false | 产品，自身 test | 已有 row 视 accounted |
| Trace | dimensions.deviceRef 非法，collector 报告失败但不 throw，0receipt/期望 3 | 产品，route test | 改 canonicalRef |
| Unknown limit | madeUp:1 接受丢弃，拼错 bound 貌似生效 | 产品，refusal test | 按名拒 |
| Surface identity | 首 browser TOPOLOGY_NOT_READY，ref 需猜 | 产品 gap | GET/page 披露 live 词汇 |
| Finished stop | 仍比较 campaignId 令 stale409 非 stopped:false | 产品 stop test | 仅 RUNNING guard |
| Browser fixture | 第 N 及以后都 fail，预期 1 得 3 | MEASUREMENT_DEFECT | fixture 修，产品正确 |
| capability-adapters/city-roads | document CORRUPT_INPUT | 源早期 ENVIRONMENT/PRE-EXISTING 分类保留 | baseline213f9f9f D:/utopia-wbc604 同现；DEVELOPMENT_REPORT 后来更正缺 city install |
| host-city-launcher3 | free coordination port，拒干扰 active City | ENVIRONMENT | resident 占 reservation |
| physical1 seed | entire manifest JSON | D7 仅 real hardware 找到 | hash/shape/same-seed 测试 |
| Android topology identity | name gate 无法满足 native device id | F8 reality drift | Kotlin line/observed ref 记录，未修 |
| Owner form | warmup0 typed 但 actual1 | F10 LOW | totals 真实，交 REX807 |
| adversarial | receipt store LIST ENOTDIR R1；external cancel FAILED R2 | 自发现产品 | degraded/reported、CANCELLED reason；两个 guard |
| 本机 draft 记录 | CI 抄前任务 pattern unread IDs 称 push failed | RECORD DEFECT | per-run API 最后写、未 commit；§3Y |
| 同 shape 三例 | REX804 B1 startup、MON903 M1 log read、REX803 R1 list | 同 host sibling 重复 shape | 三处 degrade、typed reason、serve、probe |

## Claim collision

Alien5baee25 11:45:02 先、Mech1acdc10 11:46:24 覆盖；Alien82acb5a11:56:16 对账 Mech 归属、转 REX804。labels DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE/MUTABLE_REFERENCE_STATE_DRIFT。Alien 候选 `cae38b22bfb6c1050221aa4aa3e51844e3ec6e47` 保留 design 不 merge；继承 real task 及 task 上 run ref 两个 design 明确给 Reviewer。cost 一 discard candidate，无 duplicate merge、不丢 evidence。

## 研究适用性

```text
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
state_identity_evidence: CAPTURED
```

RS-G3-IDENTITY-PROVENANCE：seed 注册 doc 短 hash、receipt/run ref 绑 task。RS-G3-DYNAMIC-LIVENESS：start 实时 refs readiness、Android 跨 restart 无需 repair 重连。RS-G3-PASSIVE-EVIDENCE-PIPELINE：正常 live 开发 run 产 receipt/trace/task reread。RS-G3-OWNER-INTERVENTION-TAXONOMY：stop/resume/abandon 显式 typed。RS-G4-REALITY-DRIFT：claim surface 未可达、research 无法学习必需 identity、Android 按名称 gate 但 runtime device id。最高 G4_RARE_SYSTEMIC，MAXIMUM_BOUNDED；无 performance/novelty/autonomy 声明。

## Physical gate

```text
GATE      workbook requires >= 1 controlled campaign on the Alien + Mech + Android topology
MEASURED  at development end: alien-reference-node online=FALSE (last heartbeat 2026-10-05T11:15:06Z); the resident
          City was restarted from this branch and the physical Android handset was re-enrolled and connected
RAN       Mech + Android, two controlled campaigns, full receipts and trace (see the table above)
STATUS    PARTIAL / BLOCKED ON PHYSICAL TOPOLOGY (the Alien host), not on code. Not claimed as the workbook gate.
```

## Pending

Alien Formal Review 必验 repeat/cancel/restart/timeout/partial/seed；Alien physical half 全程 offline；Android campaign surface 刻意不做、归 REX807；merge_authority false。

## 最新 exact-source outcome（supersede 此前 snapshot）

```text
IMPLEMENTATION  a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df
CI              measured per run on that head: push 37407868473 attempt 1 SUCCESS, pull_request 37407871700 attempt 1
                SUCCESS, linkage 37407871716 attempt 1 SUCCESS - no run failed on this head
PHYSICAL        two controlled campaigns on the live City with the Android handset connected as the control surface
SELF-TEST       adversarial pass before review: two defects found and repaired (R-1 store degradation, R-2 outside
                cancellation classification), two properties held (accounting at 10,000 planned runs; canonical truth
                untouched by a store failure)
REVIEW          PENDING (Alien) — not performed, not claimed
MARKER          SCENARIO_REPETITION_ENGINE_ACCEPTED NOT released
```
