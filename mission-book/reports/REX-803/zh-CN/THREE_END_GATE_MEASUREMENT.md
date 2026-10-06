# REX-803 三端完成门槛——实测状态（Mech，2026-10-06T02:25Z）

[English source / 英文原文](../THREE_END_GATE_MEASUREMENT.md)。阅读译本不改变当前工作书 authority。

工作书要求至少一组 controlled campaign 在 Alien+Mech+Android 基础 topology 运行并保留完整 research trace/material。这里记录 live City 实测，而非假设。

## 已执行

在运行 REX-803 head57d1c919 的常驻 City 注册三端 experiment，严格声明 City 报告的 identity，然后尝试 campaign：

```text
EXPERIMENT   mech-alien-android-two-host-repetition     status VALIDATED     registeredAt 2026-10-06T02:25:20.802Z
TOPOLOGY     TWO_HOST_MESH   ("two physical hosts, each running a real worker, sharing one canonical City")
HOSTS        dev-031fdba6e94c4298a0956ff04a65481d   (this host's reference node, online)
             alien-reference-node                    (the Alien host's node - OFFLINE)
WORKERS      the same two
SURFACES     dev-be7832e35fc34b85966c3bb43a992e1d   (physical Android handset OPPO PERM00, controlOnline)
SOFTWARE     utopia@57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1
REPETITIONS  3 (+1 warmup), seed policy PER_REPETITION, base seed 20261006
ATTEMPT      POST /api/v0/research/campaigns {experimentId, scenarioId: WAIT, repetitions: 3, warmup: 1}
RESULT       HTTP 409  TOPOLOGY_NOT_READY
```

City 拒绝原文：

```json
{"apiVersion":0,"schemaVersion":0,"error":"TOPOLOGY_NOT_READY","errorCode":"TOPOLOGY_NOT_READY",
 "detail":{"state":"NOT_READY","missing":["alien-reference-node"],
           "workers":["dev-031fdba6e94c4298a0956ff04a65481d"],
           "surfaces":["dev-be7832e35fc34b85966c3bb43a992e1d"],
           "identitySemantics":"CANONICAL_LIVE_REFS"}}
```

当时 GET/api/v0/city 节点状态：

```text
alien-reference-node                        online=FALSE   lastHeartbeatAt 2026-10-05T11:15:06.977Z
dev-031fdba6e94c4298a0956ff04a65481d         online=True    (this host)
dev-e1d87b2a0ec5457e822b91d81e40dc67         online=FALSE
```

## 结论

```text
GATE STATUS   PARTIAL / BLOCKED, and now blocked by exactly ONE NAMED IDENTITY rather than by an assumption.
BLOCKER       alien-reference-node is offline. It is the only declared identity the City cannot offer, and the refusal
              says so with the live worker and surface list it CAN offer.
WHAT IS DONE  Mech + Android was exercised end to end (two campaigns, see the sibling evidence files in
              utopia:evidence/raw/mission-book/REX-803/), and the three-end experiment is now REGISTERED, so the run
              is a single command once the Alien host's node is online.
WHAT IS NOT   The Alien half of the topology has never been online during this task (last heartbeat
              2026-10-05T11:15:06Z, before REX-803 development began). No three-end campaign result is claimed.
HOW TO RUN    with the Alien node online, POST /api/v0/research/campaigns
              {"experimentId":"mech-alien-android-two-host-repetition","scenarioId":"WAIT","repetitions":3,"warmup":1}
              and read the receipt at GET /api/v0/research/campaigns/<campaignId>.
```

## 证据文件

```text
this file                                        mission-book/reports/REX-803/THREE_END_GATE_MEASUREMENT.md
the same measurement as machine-readable JSON    local runtime artifact
                                                 D:/utopia-chat/evidence/REX-803/three-end-gate-attempt.json
                                                 (not committed to the implementation repo, because adding it would move
                                                 the reviewed head 57d1c919 and invalidate its recorded exact-head CI)
```

这不是门槛通过；是当前门槛的实测 blocker。代码块保留原始 SHA、节点、时间、命令、NOT_READY 拒绝及未完成边界。

## 对侧回来后重测（Mech，2026-10-06T04:2xZ）

2026-10-06T04:12Z–04:18Z 对侧 control-plane 再次活跃：Alien-codex 两个 Digital-City commit 包含 CEX-790 current-main integration、MON-902 review claim。此时条件已不同于“另一主机不在”，因此重新测量而非假设不变：

```text
EXPERIMENT   mech-alien-android-two-host-repetition     status VALIDATED     replayed true (same registration, re-validated)
ATTEMPT      POST /api/v0/research/campaigns {experimentId, scenarioId: WAIT, repetitions: 3, warmup: 1}
RESULT       HTTP 409  TOPOLOGY_NOT_READY   missing: ["alien-reference-node"]
NODES        alien-reference-node                  online=FALSE   lastHeartbeatAt 2026-10-05T11:15:06.977Z  (UNCHANGED)
             dev-031fdba6e94c4298a0956ff04a65481d online=True    lastHeartbeatAt 2026-10-06T04:22:12.061Z  (this host)
             dev-e1d87b2a0ec5457e822b91d81e40dc67 online=FALSE
```

新信息是区别而非拒绝：对侧主机存在并在 control-plane 施工，但 reference node 未加入 City。剩余 blocker 不是主机 availability 或调度，而是 City 点名的一个 identity 需上线。应加入 alien-reference-node，而非“等 Alien”；experiment 保持 registered/validated，节点出现后仍只需一个 POST。
