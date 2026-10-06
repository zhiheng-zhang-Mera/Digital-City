# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_REQUESTER_NOT_IN_CANONICAL_TRUTH.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：canonical truth 无法确认哪个界面发出指令，限制了 gate 4“独立证明”的含义

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
MEASURED ON = mesh/MESH-301-three-end @ d919dc759f9a375ef8200b6bc7663aa8fa17852c
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
```

制定自身复核计划时，我检查第三方能否从 City 自身真值完成工作书要求的*“独立证明 Android 发起的指令真的改变了后端状态”*。该要求**部分可完成**，应在复核前明确边界，而非复核过程中才说明；若构成问题，应由开发者在分支发布前权衡，而非复核者事后升级。

## 1. 两类记录实际包含什么

完整 strict-target Action：

```json
{"actionId":"A-aad81cca-…","route":"CITY_TASK","status":"SUCCEEDED",
 "backendRef":{"kind":"CITY_TASK","id":"city.task","taskId":"Q-cfc3912a-…","operationId":"CHECKPOINT_DEMO",
               "targetDeviceRef":"Mech-Win"},
 "requestedIntent":"",
 "idempotencyKey":"b0392d5f-…",
 "requestFingerprint":"{\"input\":{\"targetDeviceRef\":\"Mech-Win\"},\"operation\":\"CHECKPOINT_DEMO\",\"route\":\"CITY_TASK\",\"target\":\"city.task\"}",
 "provenance":{"source":"utopia.dev-gateway","host":"Mera-Alianware","route":"CITY_TASK", …}}
```

以及它创建的 City task：

```text
keys: apiVersion, schemaVersion, id, type, domain, state, createdAt, updatedAt, assignedNodeId, progress,
      lastCheckpoint, result, error, targetDeviceRef, targetIntentAt, targetStateAtCreation
```

**两类记录均无 requester、clientRef、actor、origin 字段。** 无论谁发送，每个 Action 的 `provenance.host` 都是 *City 的*主机（`Mera-Alianware`，即 Alien 机器）；`source` 是 gateway；该路由 `requestedIntent` 为空；`COMMAND_ACCEPTED` 带 `actor:"gateway"` 与 `payload:{}`。`idempotencyKey` 由调用者选择，不能标识任何发起者。

将测量结论严格限于如下范围：

```text
PROVABLE from canonical truth alone
  that a strict-target instruction for <device> was accepted, persisted on the task
  (`targetDeviceRef` + `targetIntentAt` + `targetStateAtCreation`), that only <device> could claim it,
  that <device> did claim and execute it, and that it reached a terminal state with a result digest.
NOT PROVABLE from canonical truth alone
  WHICH control surface sent it. An Action issued from the Android device, from Alien Web, from Mech Web, or
  from a headless probe are indistinguishable in shape; only the opaque idempotency key differs.
```

## 2. 为何记录此限制，而非当作缺陷

工作书**未要求** requester attribution；它要求*目标意图*进入 canonical truth（第 3 步），并在另一处处理发起者归因：第 6 步*“三端各自留下自己的 receipt（互不背书）”*。因此设计已用*发起者自身 receipt*回答“谁发出的”；给 Action 增加 requester 字段属于契约扩展，可能不在边界 3（*“target-device intent 所需的最小契约扩展”*）内。我不要求此改动。

记录的是**复核因此受到的限制**，使 gate 4 声明诚实而不夸大：

```text
The reviewer can independently reproduce, with its own instrument:
  - that a strict-target instruction issued at time T was accepted, persisted and executed ONLY by <device>;
  - that the backend state genuinely changed (canonical events + terminal result digest), never a screenshot;
  - that the negative controls fail honest.
The reviewer CANNOT independently establish, from the City:
  - that the issuing surface was the Android device rather than the development host's script.
  For that, gate 4 rests on the Android surface's own receipt, which a reviewer may inspect and re-run but
  cannot corroborate against canonical truth.
```

这尤其影响 gate 4，因为“Android → Alien”“Android → Mech”是仅有以界面而非设备为主体的两项。对 gate 5（自身运行）影响较小：*我*发出的事实由不同物理机器上自身主机 receipt 与仪器确立，符合工作书选择的证据类型。

## 3. 对 gate-8 三界面表的实际影响

收敛也受同样限制：界面观察仅存在于自身 receipt 中。因此表是**三份独立产生 receipt 的核对合并**，不是任一单主机能完成的测量。这与第 5.4 步一致，但也意味着表的权威仅等于三份 receipt 的权威；若 *开发*主机代界面生成 receipt，而非界面自己写入，其证明力低于界面自产。我的第 5.2 步 receipt 由本主机浏览器写入；Android receipt 应由 Android app 写入，复核者须检查而非假设。

## 4. 将如何处理此限制

```text
1. At review time, gate 4 will be stated as: "independently reproduced as a strict-target execution; the
   IDENTITY of the issuing surface rests on the Android receipt, not on canonical truth" - MET or NOT MET on
   that basis, and no stronger.
2. I will verify the Android receipt's provenance (was it written by the device, or by a host script?) when it
   is available, because that is exactly the difference between evidence and narration.
3. I am not requesting a product change. If the Owner or the developer prefers requester attribution in
   canonical Action truth so that gate 4 becomes third-party verifiable, that is a design decision for them and
   it must land before release; it is not mine to add, and the workbook's boundaries do not obviously admit it.
```
