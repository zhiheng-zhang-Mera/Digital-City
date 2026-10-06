> Reading translation / 阅读译本. Full historical English reading, not a new verdict, claim or authority record. Original evidence blocks remain literal and the canonical source governs recorded status.

[Canonical source](../UNION_COEXISTENCE_SMOKE_MECH.md)

# Three-Way REX Union: Same-City Coexistence Smoke

2026-10-06, Mech-DS (`MEGA-REP`). Target: `integration/REX-805-candidate-mech-preflight @ 0d8bdce`, the union of main, accepted REX-803, accepted REX-804 and candidate REX-805.

## Why

The union exists so one City can run the campaign surface, fault controller and replay engine together. Green individual suites prove each product runs, not coexistence within one process. The union wires all three controllers into the same construction point.

## Established by measurement

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

All three surfaces are live simultaneously: campaigns GET returns 200 with WAIT, CREATE_TEMP_ARTIFACT, HASH_TEMP_ARTIFACT, DELETE_TEMP_ARTIFACT and CHECKPOINT_DEMO scenarios; replays GET returns 200 with 16 mechanisms; faults GET returns 200 with HEARTBEAT_LOSS/PROVIDER_UNAVAILABLE and other kinds, READY store, broken=[].

A real REX-803 campaign `campaign-b34b9cf1-…` reached COMPLETED in this union City. A real REX-804 PROVIDER_UNAVAILABLE fault `fault-ddd32ea1-…` was ACTIVE on faulted-worker and injected before the campaign. Thus 803 and 804 genuinely coexisted in the same running City.

## Not established, and exact reason

```text
campaign -> replay 的完整链路 **未跑通** / the campaign-to-replay chain did NOT complete
  replay 被拒：422 REPLAY_SOURCE_INVALID "source run inputs, seed or execution identity are not fully observable"
  逐条检查源回执后定位到两条不满足 / two source conditions fail:
    run.result.taskRef present            ×
    assignedNodeId in manifest workers    ×
  因为该 run 的 state 是 **TIMEOUT、measured=false**——裸进程内的 City 里没有任何执行者去跑那条 canonical WAIT
  任务。这不是并集的缺陷：同一个 campaign 在常驻 City 上（有真实 host worker 执行）产生的是 MEASURED run。
```

The full campaign-to-replay chain did not complete. Replay returned 422 REPLAY_SOURCE_INVALID, saying source inputs, seed or execution identity were not fully observable. Receipt inspection found two missing conditions: result.taskRef and assignedNodeId in manifest workers. The run is TIMEOUT/measured=false because bare in-process City has no executor for its canonical WAIT task.

This is not a union defect: the same campaign on resident City with a real host worker yields a MEASURED run. This is directly useful for REX-805 Review: replay requires a measured source with taskRef/assignedNodeId. An executor-less City cannot produce one. Review must either use a City with an executor or directly drive replay with a constructed measured receipt. This precondition had not previously been recorded.

## Contract facts measured along the way

```text
拓扑 / topology      任何拓扑都要求 **至少一个活动的 control surface**；裸 gateway 没有，需要真实客户端连接
                     （复检时用浏览器连上即可，正如真实三端 campaign 用浏览器与手持机做 surface）
清单 / manifest      softwareRefs 必须是字符串 `<component>@<40位十六进制SHA>`；对象或短 SHA 都会被
                     MALFORMED_SOFTWARE_REF 拒
故障 / fault         durationMs 上限 **30000**；nodeId 必须 **[a-zA-Z0-9-]{1,80}**；
                     confirmation 必须恰为 `FAULT:<kind>:<nodeId>`；目标节点在注入瞬间必须 **online**
                     （注册后不发心跳的节点几秒内就会离线，所以故障要在注册后立刻注入）
```

So Review need not rediscover them:

- Every topology needs at least one active control surface. A bare gateway has none; connect a real client. A browser suffices for Review, like the browser/handheld surfaces in real three-end campaigns.
- Manifest softwareRefs must be strings `<component>@<40-character hexadecimal SHA>`. Objects and short SHAs are refused with MALFORMED_SOFTWARE_REF.
- Fault durationMs maximum is 30000; nodeId matches `[a-zA-Z0-9-]{1,80}`; confirmation is exactly `FAULT:<kind>:<nodeId>`; target must be online at injection. Registered nodes without heartbeats go offline within seconds, so inject immediately after registering.

## Instrument

`UNION_COEXISTENCE_SMOKE_MECH.mjs`, beside this report. Use the union branch's worktree as working directory because the script imports `./services/dev-gateway/server.mjs` by relative path:

```powershell
node UNION_COEXISTENCE_SMOKE_MECH.mjs
```

Every step asserts; failure identifies the broken surface. It modifies nothing and changes no workbook fields.
