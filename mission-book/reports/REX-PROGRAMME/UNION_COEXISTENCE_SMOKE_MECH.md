# REX 三产物并集：同城共存冒烟 / Three-way REX union: coexistence smoke

2026-10-06，Mech-DS（`MEGA-REP`）。对象是 `integration/REX-805-candidate-mech-preflight @ 0d8bdce`——main + 已接受 REX-803 + 已接受 REX-804 + 候选 REX-805 的并集。 / The three-way union branch.

## 为什么要做 / Why

并集存在的理由，就是让**同一个 City** 同时跑 campaign 面（REX-803）、fault controller（REX-804）与 replay engine（REX-805）。三个产物各自的套件都绿，但那证明的是「各自能跑」，不是「装在一个进程里还能一起跑」——而并集恰好把三个控制器塞进了同一处构造点。 / The suites prove each product works, not that the three coexist in one process with the wiring the union gave them.

## 已经证实 / Established, measured

```text
一个 City 上三个面同时在线 / all three surfaces live in one City
  GET /api/v0/research/campaigns   200  scenarios=WAIT,CREATE_TEMP_ARTIFACT,HASH_TEMP_ARTIFACT,DELETE_TEMP_ARTIFACT,CHECKPOINT_DEMO
  GET /api/v0/research/replays     200  16 个机制 / 16 mechanisms
  GET /api/v0/research/faults      200  kinds=HEARTBEAT_LOSS,PROVIDER_UNAVAILABLE,… storeState=READY broken=[]
真实 campaign + 真实 fault 共存 / a real campaign and a real fault at once
  REX-803  campaign campaign-b34b9cf1-… state=COMPLETED（同城、由并集 City 跑出）
  REX-804  fault fault-ddd32ea1-… kind=PROVIDER_UNAVAILABLE node=faulted-worker status=ACTIVE（在 campaign 之前注入）
  => 803 与 804 两个面在同城运行期确实共存
```

## 没有证实，以及精确原因 / Not established, with the exact reason

```text
campaign -> replay 的完整链路 **未跑通** / the campaign-to-replay chain did NOT complete
  replay 被拒：422 REPLAY_SOURCE_INVALID "source run inputs, seed or execution identity are not fully observable"
  逐条检查源回执后定位到两条不满足 / two source conditions fail:
    run.result.taskRef present            ×
    assignedNodeId in manifest workers    ×
  因为该 run 的 state 是 **TIMEOUT、measured=false**——裸进程内的 City 里没有任何执行者去跑那条 canonical WAIT
  任务。这不是并集的缺陷：同一个 campaign 在常驻 City 上（有真实 host worker 执行）产生的是 MEASURED run。
```

**这是一条对 REX-805 复检直接有用的操作前提**：replay 需要一个**已测量的**源 run（带 `taskRef` 与 `assignedNodeId`），因此在没有真实执行者的 City 上无法制造可重放的源。复检时要么在有执行者的 City 上跑，要么用**构造的**已测量回执直接驱动 replay engine。这个前提此前不在任何记录里。 / A replay needs a MEASURED source run, so a City without an executing worker cannot produce a replayable source. The REX-805 review must either use a City with an executor or drive the engine with a fabricated measured receipt.

## 顺带测出的契约事实 / Contract facts measured along the way

复检时不必再重新踩一遍 / so the review does not rediscover them:

```text
拓扑 / topology      任何拓扑都要求 **至少一个活动的 control surface**；裸 gateway 没有，需要真实客户端连接
                     （复检时用浏览器连上即可，正如真实三端 campaign 用浏览器与手持机做 surface）
清单 / manifest      softwareRefs 必须是字符串 `<component>@<40位十六进制SHA>`；对象或短 SHA 都会被
                     MALFORMED_SOFTWARE_REF 拒
故障 / fault         durationMs 上限 **30000**；nodeId 必须 **[a-zA-Z0-9-]{1,80}**；
                     confirmation 必须恰为 `FAULT:<kind>:<nodeId>`；目标节点在注入瞬间必须 **online**
                     （注册后不发心跳的节点几秒内就会离线，所以故障要在注册后立刻注入）
```

## 工具 / The instrument

`UNION_COEXISTENCE_SMOKE_MECH.mjs`（本记录同目录）。它需要一个该并集分支的 worktree 作为工作目录（脚本按相对路径 import `./services/dev-gateway/server.mjs`），跑法： / Published beside this record; run it from a worktree of that union branch:

```powershell
node UNION_COEXISTENCE_SMOKE_MECH.mjs
```

脚本对每一步都断言，失败会指出是哪个面坏了；它不修改任何东西，也不改变任何工作书字段。 / Every step asserts and a failure names the surface that broke.
