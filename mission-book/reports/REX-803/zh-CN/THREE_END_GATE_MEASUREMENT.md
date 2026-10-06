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


## 为什么第三个身份一直未加入，以及消除原因的工具

每次门槛测量都以 City 拒绝 TOPOLOGY_NOT_READY、具名 alien-reference-node 为唯一缺失身份结束。三轮看似宿主不愿出现，但实际原因更窄且可修复。

```text
the shipped reference node authenticates with CITY_NODE_TOKEN   agents/reference-node/main.mjs:2
the node token is a secret held by the City's own host          <runtime>/local-config.json
the programme forbids writing secrets into records              CONSTRUCTION_RULES / PROCESS_DATA_POLICY
=> there was NO CHANNEL by which the second physical host could obtain the credential it needs
```

阻塞的是凭证交付，等待不会改变。City 已包含消除秘密传输的机制，缺少的是利用它的 joiner：

```text
pairing/info, pairing/exchange        PUBLIC routes, no node token and no version header required
a consumed owner-minted short code    ENROLLS the caller and returns a `sess:` credential scoped to its own device
the auth preamble                     returns early for a session bearer, so a session suffices for node/*
assertOwnNode                         still confines a member to its OWN node identity - no authority is widened
the reference agent                   already accepts a credentialProvider instead of a static token
```

feat/mech-join-worker-without-node-token @ c19da18 的 scripts/join-worker.mjs 只做这件事：消费短码，成为 member，使用 session credential 运行 reference worker，跨重启记住 device identity。tests/join-worker.test.mjs 使用真实子进程证明：owner 发码，独立进程消费，City 列出身份 ONLINE 且具有 eligible worker 所需 execution capabilities；杀进程后离线。若 build 有本任务 campaign route，City 将其算作 campaign worker；其他 build 明确断言 404，而非跳过。CI V0.2 push 37428348788 COMPLETED SUCCESS attempt 1，head c19da18，gateway-web/android 均绿。

对侧宿主仅需执行一次，不传输秘密：

```text
on the City host   POST /api/v0/pairing/session with the owner credential  -> a short code
                   read the node identity the joiner prints, and declare it in the experiment manifest
on the joining host
                   CITY_URL=http://<city-host>:4310 node scripts/join-worker.mjs --code <shortCode> \
                     --name "alien reference node"
```

探针自己的两个初稿也错误，按项目惯例保留并修复，而非掩盖：第一稿让 unhandled rejection 中止进程，捕获输出的 caller 什么也看不到，这是最不可诊断的失败；第二稿在 2000 ms heartbeat timeout 下等待 2800 ms，结果取决于最后 heartbeat 的位置。这是项目第四次记录“窗口勉强覆盖性质”的缺陷，已提交探针给予真实余量。

**这不关闭门槛，也不记录为已经关闭。** 仍需 Alien 自己 node 在 City 在线，并运行三端 topology campaign；改变的是，现在只差一个命令和一个短码。

## 门槛已满足 — live City实测，2026-10-06T08:01Z

完成门槛要求Alien＋Mech＋Android基础拓扑至少一受控campaign及完整研究trace，现已运行。原稿认为持续阻塞原因并非Alien主机本身。

### 阻塞是manifest旧身份，而非缺席主机

```text
City reports, live, before the run
  dev-031fdba6e94c4298a0956ff04a65481d  Mega-rep                ONLINE   <- this host
  dev-8128a1ef25c5c4b7f66fc31b21705858  Alien-MERA-ALIANWARE    ONLINE   <- THE ALIEN HOST, live all along
  dev-be7832e35fc34b85966c3bb43a992e1d  Android PERM00          live control surface
  alien-reference-node                  Alien-PC                OFFLINE  <- last heartbeat 2026-10-05T11:15:06Z
```

早期每次声明Alien在2026-10-05使用的alien-reference-node，该身份不在线，City正确拒绝TOPOLOGY_NOT_READY。原稿同时写同主机在dev-8128a1ef25c5c4b7f66fc31b21705858下在线，并声称“此前两天一直在场”。这是F8泛化：manifest须声明City实际报告身份，记忆名称会过期。这里保留该历史判断，末尾明确正式评审更正边界，不将“始终在线”视为已证实。

### 运行

```text
City build       8798ba9dd37051626033ad72080b2fad3ff66149   (the REX-803 review candidate; the resident City was
                                                            restarted onto it for this acceptance, data retained)
experiment       rex803-three-end-live-8798ba9dd370   status VALIDATED
manifest         topology TWO_HOST_MESH
                 hosts/workers [dev-031fdba6…, dev-8128a1ef…]
                 controlSurfaces [dev-be7832e35…]     softwareRefs exact 8798ba9…
campaign         POST /api/v0/research/campaigns  ->  200  campaign-966cf439-7017-4bb0-88e8-981e59c18322
seed             rex803-three-end-live-8798ba9dd370-acceptance   (placement predicted BEFORE the run from runSeed)
```

```text
run 0  MEASURED  seed 397343796  assigned dev-031fdba6… (Mech)   task Q-be723362-5e83-4806-8d24-ffd0a60a16b2
run 1  MEASURED  seed 414121415  assigned dev-8128a1ef… (Alien)  task Q-f78eaee3-2380-468e-969d-6012fba109b9
run 2  MEASURED  seed 430899034  assigned dev-031fdba6… (Mech)   task Q-697aab2c-da4a-4e8b-9918-ab2174e47593

summary  planned 3  accounted 3  measured 3  timedOut 0  failed 0  cancelled 0  skipped 0
         terminalAccountingComplete true          state COMPLETED  reason REPETITIONS_FINISHED
```

run1由Alien节点执行且MEASURED，分配匹配运行前预测规则，正是两worker演练发现未生效、此build修复的性质。三个任务／种子／计数／终态精确保留于原块。

### 材料经检查，而非仅声称

```text
canonical tasks   all three COMPLETED in the City, each carrying researchRunRef
                  campaign-966cf439-7017-4bb0-88e8-981e59c18322:<index> and assignedNodeId as above
research trace    RESEARCH_CAMPAIGN_STARTED recorded at 2026-10-06T08:00:39.601Z; 195 records; storageState READY;
                  completeness PARTIAL, which is stated rather than rounded up
immutable receipt campaign-966cf439-7017-4bb0-88e8-981e59c18322.json (3 693 bytes) filed under
                  <runtime>/research/campaigns/, written once at completion
evidence file     D:/utopia-chat/evidence/REX-803/three-end-live-2026-10-06T08-01-01-831Z.json
                  (live topology, both identity checks, registration, campaign POST, the pre-run placement
                  prediction, the terminal live state and the full receipt)
```

三个canonical任务COMPLETED且researchRunRef绑定；trace记录campaign开始，作者当时195记录、READY、PARTIAL不升级；不可变3693字节receipt完成时一次写；本地证据含拓扑、身份、注册、POST、预预测、终态及全receipt。

### 此事确定与未确定什么

```text
SETTLES      the physical half of the completion gate: a controlled campaign ran on the Mech + Alien + Android
             topology with every repetition measured and the material filed.
DOES NOT     release the terminal marker. REX-803's Formal Review belongs to the opposite host, its verdict is theirs,
             and this host is the author. The evidence is handed over; the acceptance decision is not made here.
DOES NOT     claim a second host's hardware beyond what the City recorded: the Alien worker node heartbeated and
             completed a canonical task, and nothing beyond that is asserted about that machine.
```

确定物理半门：三端受控campaign各重复测量且材料归档；作者不释放terminalmarker，不作对机FormalReview判定；只声称City记录Alienheartbeat／完成任务，不扩展机器硬件事实。

residentCity为验收重启到8798ba9并保数据目录，cityId／store／enrollment保持。恢复文档命令为在目标worktree scripts/stop-city.ps1，然后scripts/start-city.ps1 -BindAddress 172.31.12.151 -Port4391。

## 已发布正式验收对历史判断的边界说明

以上保留作者原阶段文字和证据，不重新判断。依据[FORMAL_ACCEPTANCE_Alien.md](../FORMAL_ACCEPTANCE_Alien.md)，正式评审接受8798ba9dd37051626033ad72080b2fad3ff66149并释放SCENARIO_REPETITION_ENGINE_ACCEPTED，但新Alien enrollment始于2026-10-06T07:29:19.058Z，不能描述为此前两天始终在线；早期离线／退休身份仍保留。195记录计数源于早期作者报告，Alien MEMBER不能读Ownertrace，不能归为Alien独立观测。独立原始核验范围是已发布campaign epoch52记录，197全窗是作者envelope声明，trace仍PARTIAL。候选绑定来自receipt／manifest和Owner更新，非远程PID源码审计；APK构建非手机新安装证明，capture偏差非跨host同步／网络benchmark。Web reachability PARTIAL、intent NOT_TESTED、原生Android campaign UI属REX807，均不由本译文升级。
