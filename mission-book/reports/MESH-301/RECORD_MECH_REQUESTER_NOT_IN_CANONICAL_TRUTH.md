# RECORD — Mech: canonical truth cannot say WHICH surface issued an instruction, and that bounds what "independent proof" can mean at gate 4

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
MEASURED ON = mesh/MESH-301-three-end @ d919dc759f9a375ef8200b6bc7663aa8fa17852c
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
```

Found while checking, for my own review plan, whether the workbook's required *"独立证明 Android 发起的指令真的
改变了后端状态"* is actually performable by a third party from the City's own truth. It is performable **in part**,
and the boundary is worth stating before the review rather than inside it — because if it is a problem, it is a
problem for the developer to weigh before the branch is released, not for the reviewer to escalate afterwards.

## 1. What the two records actually contain

A strict-target Action, complete:

```json
{"actionId":"A-aad81cca-…","route":"CITY_TASK","status":"SUCCEEDED",
 "backendRef":{"kind":"CITY_TASK","id":"city.task","taskId":"Q-cfc3912a-…","operationId":"CHECKPOINT_DEMO",
               "targetDeviceRef":"Mech-Win"},
 "requestedIntent":"",
 "idempotencyKey":"b0392d5f-…",
 "requestFingerprint":"{\"input\":{\"targetDeviceRef\":\"Mech-Win\"},\"operation\":\"CHECKPOINT_DEMO\",\"route\":\"CITY_TASK\",\"target\":\"city.task\"}",
 "provenance":{"source":"utopia.dev-gateway","host":"Mera-Alianware","route":"CITY_TASK", …}}
```

and the City task it created:

```text
keys: apiVersion, schemaVersion, id, type, domain, state, createdAt, updatedAt, assignedNodeId, progress,
      lastCheckpoint, result, error, targetDeviceRef, targetIntentAt, targetStateAtCreation
```

**There is no requester, no clientRef, no actor and no origin field in either record.** `provenance.host` is the
*City's* host (`Mera-Alianware`, i.e. Alien's machine) for every Action, whoever sent it; `source` is the gateway;
`requestedIntent` is empty on this route; `COMMAND_ACCEPTED` carries `actor:"gateway"` and `payload:{}`. The
`idempotencyKey` is chosen by the caller and identifies nothing.

Consequence, stated as narrowly as I can measure it:

```text
PROVABLE from canonical truth alone
  that a strict-target instruction for <device> was accepted, persisted on the task
  (`targetDeviceRef` + `targetIntentAt` + `targetStateAtCreation`), that only <device> could claim it,
  that <device> did claim and execute it, and that it reached a terminal state with a result digest.
NOT PROVABLE from canonical truth alone
  WHICH control surface sent it. An Action issued from the Android device, from Alien Web, from Mech Web, or
  from a headless probe are indistinguishable in shape; only the opaque idempotency key differs.
```

## 2. Why I am recording it rather than treating it as a defect

The workbook does **not** ask for requester attribution. It asks that the *target intent* enter canonical truth
(step 3), and it disposes of requester attribution somewhere else entirely — step 6: *"三端各自留下自己的
receipt（互不背书）"*. So the design already answers "who issued this?" with *the issuer's own receipt*, and putting
a requester field into the Action would be a contract extension that boundary 3 (*"target-device intent 所需的
最小契约扩展"*) arguably does not cover. I am not asking for it.

What I am recording is the **limit it puts on the review**, so that gate 4 is claimed honestly instead of
overclaimed:

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

This matters for gate 4 specifically, because "Android → Alien" and "Android → Mech" are the *only* two gates
whose subject is a surface rather than a device. It matters less for gate 5 (my own run): there the fact that
*I* issued it is established by my host's own receipt and instrument, on a different physical machine, which is
the same evidence class the workbook chose.

## 3. Practical consequence for the gate-8 three-surface table

The same limit applies to convergence: a surface's observations exist only in that surface's receipt. The table
is therefore a **conciliation of three independently produced receipts**, not a measurement any single host can
make. That is consistent with step 5.4, but it means the table's authority is exactly the authority of the three
receipts, and a receipt that was produced by the *development* host on behalf of a surface (rather than by the
surface itself) carries less weight than one the surface wrote. My step-5.2 receipt is written by the browser on
this host; the Android receipt should be written by the Android app, and the reviewer should check that, not
assume it.

## 4. What I will do with this

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
