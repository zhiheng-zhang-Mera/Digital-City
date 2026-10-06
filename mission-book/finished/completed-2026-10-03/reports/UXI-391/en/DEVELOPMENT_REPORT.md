# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DEVELOPMENT_REPORT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DEVELOPMENT REPORT — UXI-391 (in progress: Steps 1–4 complete; Steps 5–7 pending)

```text
HOST              = Alien（Development；本任务可由单机承担 Development）
BRANCH            = uxi/UXI-391-remote-handoff-closeout
BASELINE          = d0507b008cc4f91c494e24388c457a8decd9e559（claim-time Utopia main，未漂移）
HEAD              = 2e6b71a（本轮实现提交）
CLAIM COMMIT      = b057b2f（Digital-City）
EXACT-HEAD CI     = 尚无（Step 5 要求：development_complete 之前必须有 exact-head hosted CI success）
```

Metadata translation: Alien performs Development, which this task permits on one host. The baseline is the claim-time Utopia main, with no drift. This implementation head had no exact-head CI yet; Step 5 requires hosted CI success at the exact head before development_complete.

## Step 1 — Claim-time reconciliation (complete)

Digital-City main was `9a19221`; Utopia main was `d0507b0`, equal to the workbook value. There was no drift and no integration refresh was needed. Main CI `37020640107` succeeded. `66fa201` was **not** on main (`merge-base --is-ancestor` returned false; its diff contained 27 files, +285/−1207), so the instructions required avoiding a whole-commit cherry-pick.

## Step 2 — Correcting the premise and cleaning up the five dimensions (erratum complete; regression tests pending)

- `ERRATUM_WRONG_PREMISE_CORRECTED.md` records the correction append-only, without rewriting any historical record.
- The comment in `services/dev-gateway/presentation.mjs` claiming “an AUTOMATIC handoff is unreachable in this City, which has no switch-decline flow” was corrected in place to identify the actual blocker.
- Partial-load semantics were **unchanged**, because they were already correct: `loadFromTelemetry` reports only measured dimensions, keeps missing values missing, uses `min_observed_dimensions = 1`, and takes the maximum observed dimension as the binding pressure.
- **Still pending at this point:** regression tests proving missing ≠ 0, binding by a saturated dimension, and usability of partial measurements.

## Step 3 — Repeatable E2E with two Nodes on one host (complete, 21/21 PASS)

`scripts/uxi391-handoff-e2e.mjs` uses the isolated runtime `.runtime-uxi391-e2e`, a separate port, and a temporary data directory. Its sequence follows the workbook strictly: start only A → create **one and the same** target WAIT → assert RUNNING/assigned=A for **1.5 sustained seconds** (progress=18, not a fabricated millisecond hold) → stop A's agent while keeping Gateway and the interaction surface alive → assert that **the assignment survives dropout**, a prerequisite for a routing decision → start B only afterward → assert B has telemetry → assert **no second task** exists → invoke the real `switch-declined` flow → reach ALTERNATE_DEVICE in the planner and REMOTE_HANDOFF in presentation → **actually transfer A→B through the execution bridge** → complete the same task id on B → obtain `{"waitedMs":6000}` from real execution → observe only one task and one terminal completion across the City, with no duplicate execution → read the backend event `TASK_HANDOFF_TRANSFERRED` with `handoffEpoch:2` and history `handoff:uxi391-node-a->uxi391-node-b@epoch2`.

**Every anti-vacuity condition is asserted, not assumed:** A really ran the target; A really stopped; B came online after the assignment existed; ownership actually changed from A to B; the completed task retained its original id; and the harness read the result from the backend rather than printing a result itself.

## Step 4 — Minimal ownership-transfer implementation (complete)

Three minimal changes stay within the permitted scope: the handoff harness, the minimum bridge consuming the routing plan, and minimal state fields.

```text
1. candidateFromNode 现在显式携带 enablement
   （City 目前不持有 per-node disable 状态，故缺失即 ENABLED；注解写明：一旦 City 能表达禁用，
     这里必须改为读取该字段，且相邻回归测试会在"显式 disabled 被当成 enabled"时失败）
2. routeStageFor 重构为 routePlanFor（返回 stage + chosenDeviceRef + 完整 plan），routeStageFor 变成它的
   薄读取；并新增 routeInputsFor 供 orchestration 使用 —— 同一决策只有一个来源，杜绝第三份重建逻辑
3. 新增 services/dev-gateway/handoff.mjs：消费 plan，用 city-core 既有的 assignment-guard 执行
   {transfer}（只允许当前持有者移交、epoch 递增使旧持有者的迟到重试不再幂等）；
   switch-declined 端点记录用户意图后调用它；node/claim 端点按 handoffTargetRef/guard holder 限制领取，
   使恢复后的 A **不能**抢回已移交的任务；
   转移失败一律 REFUSED 且不改状态（绝不伪造 COMPLETED）。
   planRoute 保持 pure（executed:false），执行属 orchestration。
```

Complete translation of those implementation rules:

1. `candidateFromNode` now explicitly carries enablement. City currently has no per-node disable state, so missing means ENABLED. The comment requires reading that field once City can express disablement; the adjacent regression test must fail if an explicitly disabled candidate is treated as enabled.
2. `routeStageFor` was refactored into `routePlanFor`, returning stage, chosenDeviceRef, and the complete plan; `routeStageFor` becomes a thin reader. New `routeInputsFor` supplies orchestration, giving each decision one source and preventing a third reconstruction of the logic.
3. New `services/dev-gateway/handoff.mjs` consumes the plan and uses city-core's existing assignment guard to perform transfer. Only the current holder may transfer, and an incremented epoch makes a late retry by the old holder cease to be idempotent. The switch-declined endpoint records user intent and then invokes it. The node/claim endpoint restricts claims by handoffTargetRef/guard holder, so a recovered A **cannot** reclaim the transferred task. Every failed transfer is REFUSED without state changes; COMPLETED is never fabricated. `planRoute` remains pure (`executed:false`); execution belongs to orchestration.

Presentation adds the rule “pending transfer means REMOTE_HANDOFF,” using `handoffTargetRef` from the task record. UI neither recalculates the plan nor selects a device. Otherwise this state would exist only for the instant between recording intent and executing transfer, preventing the user from seeing what City just did.

## Steps 5–7 — Pending

```text
Step 5 回归：five task types 协议事实 / WAIT 稳定持有 / partial load / 缺失≠0 / 饱和维 binding /
        target A→B ownership / 无重复执行与重复终态 / switch offer·decline·alternate·handoff term /
        result return / Web·Android scheduler parity / root 回归；随后 exact-head hosted CI 必须 success
Step 6 双机验收：释放给 Mech 独立复核（§3 同一主机不得既开发又复核）+ Alien/Mech 真实双机 handoff 验收
Step 7 merge main + main CI + 记录 REMOTE_HANDOFF_CLOSEOUT_REPAIRED，并写 POST_COMPLETION_REENTRY.md
```

Step 5 requires regressions for the protocol facts of five task types; stable WAIT ownership; partial load; missing ≠ 0; saturated-dimension binding; target ownership A→B; no duplicate execution or terminal completion; switch offer, decline, alternate and handoff terms; result return; Web/Android scheduler parity; and the root suite. Hosted CI at the exact head must then succeed. Step 6 releases independent review to Mech (§3 forbids the same host from both developing and reviewing) and requires real Alien/Mech handoff acceptance across two hosts. Step 7 merges main, obtains main CI, records `REMOTE_HANDOFF_CLOSEOUT_REPAIRED`, and writes `POST_COMPLETION_REENTRY.md`.

## Methodology record for this round (three false negatives came from instruments, not the product)

1. A diagnostic script read `/tasks/:id` as `{task:{...}}`, but the task object is at the top level, falsely reporting “the task was never RUNNING.”
2. The E2E read presentation state as `entry.state`/`entry.routeStageRef`, but it is actually at `entry.dto.state`, falsely reporting FAIL after Gateway already reported REMOTE_HANDOFF.
3. A diagnostic script independently reconstructed alternates but omitted enablement, making **the same mistake** as the product. Its planRoute line still showed USER_DISABLED. This reinforced the root-cause category: **a field was not passed through**.

---

## Addendum: Step 5 completed in this round

```text
HEAD = b92e64cb4c6ba6a60713109aa496c8c2bf26b99a
CI   = 37073248020 success（android + gateway-web，绑定该 head）
```

Both android and gateway-web CI jobs succeeded bound to this head. New regressions in `tests/uxi391-remote-handoff-closeout.test.mjs` passed 10/10, alongside updates to existing tests:

```text
五种可请求任务类型（协议事实 + 未知类型被拒的负向控制）
缺失 load 维度 ≠ 0，且 1 维已观测即够用；全未观测 → LOAD_UNKNOWN
饱和维 binding：5 维中只有 1 维 0.95 时压力=0.95（不得被平均或当作 idle 稀释）
telemetry 诚实产出：只报已测量维度；无法测量 → null（容量不算 io 负载）
执行桥：只在 ALTERNATE_DEVICE 移动；重复请求/同设备/陈旧持有者/缺端点一律 REFUSED 且状态不变
领取限制：只有被保留的设备可领；恢复后的旧持有者不能抢回
投影：待移交 → REMOTE_HANDOFF；终态后不残留
term 与 route 对同一候选给出相同判定（本任务的核心缺陷类）
```

The full checks cover the five requestable task types and rejection of an unknown type; missing load dimensions ≠ 0, one measured dimension sufficing, and wholly unobserved load yielding LOAD_UNKNOWN; pressure=0.95 when only one of five dimensions is saturated at 0.95, with no averaging or dilution into idle; telemetry reporting measured values only and null for unmeasurable dimensions, with capacity not counted as io load; transfer only in ALTERNATE_DEVICE, with duplicate requests, same-device requests, stale holders and missing endpoints all REFUSED without state changes; claims restricted to the reserved device and no reclaim by the recovered old holder; REMOTE_HANDOFF while transfer is pending and no residual state after termination; and consistent term/route judgments for the same candidate, the core defect class here.

`eligibilityFor`'s enablement parameter was also corrected: previously it **only** used the default `'ENABLED'` and never read the candidate's own field. These are the **second and third occurrences of the same defect class** as `candidateFromNode`/`routeStageFor`. Both paths now read the same input.

**CI history retains a failure honestly:** intermediate head `2e6b71a` failed run `37072814473` because UXI-301's shape assertion still expected the old shape without enablement. The next commit updated that assertion and added a stronger guard requiring rejection of explicitly disabled candidates. Both jobs at `b92e64c` passed; the failure is not hidden.

**Local root suite:** 1030 cases, 1028 passes, two failures. Mech had already reproduced those two document-reader cases on unchanged baseline `1a5bc0e`; they do not occur in CI.

**Steps 6–7 remain pending:** Mech independent review and real two-host acceptance including UI result return → main merge and main CI → `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` and `POST_COMPLETION_REENTRY.md`.

---

## Addendum: UI result return completed (correcting the earlier outstanding item)

UI result return in the Step 6 list is **no longer outstanding**; two-host acceptance itself remains outstanding.

```text
HEAD = 8b61622f048de3032863794295e459e0e495f6d2
CI   = 37073714180 success（android + gateway-web，绑定该 head）
E2E  = 30/30 PASS
```

Both CI jobs succeeded at that head; E2E passed 30/30. E2E now drives a **real Web surface**, paired and displaying the target id **before** Node A dies. Throughout handoff, it **does not repoint to B or refresh**; a page-set marker is checked afterward so a silent refresh cannot evade detection. It stays ONLINE. After transfer, **the same page** displays `TASK REGISTRY WAIT <original task id> COMPLETED` on its task page, with **no raw scheduler token** in rendered text and no page errors.

Still neither performed nor claimed: **two-host acceptance** (this E2E still uses one physical host) and **Android surface continuity across handoff** (Web has been driven).

---

## Addendum: Step 6 two-host acceptance is executable (scripts and real LAN rehearsal)

```text
HEAD = e2a19ac63cea8fcd1713ddef31c0c25e6d1e40fb    CI = 37074158506 success（android + gateway-web）
A 侧 = scripts/uxi391-dualhost-a.mjs   演练 10/10 PASS
B 侧 = scripts/uxi391-dualhost-b.mjs   演练 16/16 PASS（含重复请求不二次转移、保留位不可被旧持有者夺回）
```

Both CI jobs succeeded. A's rehearsal passed 10/10; B's passed 16/16, including no second transfer on a duplicate request and no recovery of a reserved slot by the old holder.

**Measure before reporting:** I initially inferred that Mech could not connect from firewall profile `DefaultInboundAction=NotConfigured`. Measuring the rules instead showed existing **node.exe inbound Allow rules for TCP/UDP on any port**, disproving that inference. Stopping at the inference would have reported a nonexistent prerequisite blocker.

**Still not performed:** running both halves on this host **does not equal** acceptance across two physical hosts. Android continuity across handoff was still not driven at this point.

---

## Addendum: Android surface driven across handoff (correcting the earlier Android item)

```text
HEAD = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9    CI = 37075869218 success
脚本 = scripts/uxi391-android-handoff.ps1          结果：9/9 PASS
```

CI succeeded and `scripts/uxi391-android-handoff.ps1` passed 9/9. The App points to this run's Gateway without restarting or repointing to B. Its panel displays the in-flight run in user language. After A→B transfer, **the same App instance** shows completion in Home; a scan of 16 tokens finds **zero leaks**.

**Three script rework causes, all retained in its header:**

1. **Tap navigation proportionally, not by node:** all five label nodes have bounds `[0,0][0,0]` and are not clickable. The actual targets are the five approximately 216px bottom-bar slots.
2. **In-flight evidence need not race worker shutdown:** a `uiautomator dump` takes seconds while WAIT holds for only six seconds. That race cannot be won and **need not** be won: after A dies, the assignment survives and the task remains RUNNING.
3. **Panel and result occupy different surfaces:** Devices removes a task immediately upon completion, so asserting the result on that panel would fail even after successful transfer.

**Still owed:** acceptance across two **physical hosts**, requiring Mech.

---

## Addendum: A recurring risk blocking Step 7 was recorded and cleared

The pre-merge check found an **untracked zero-byte** `scripts/uxi391-handoff-e2e.mjs` in primary checkout `D:\A-Utopia`, created at 08:28 with the empty-file SHA-256 value. It **would block merging** because this branch adds exactly that path; Git would reject it with `untracked working tree files would be overwritten by merge`.

```text
同类现象已第三次出现，全部 0 字节、全部同名于我当时正在撰写的文件：
  1) apps/android/app/src/main/java/city/utopia/control/SchedulerPanel.kt   （早前两次）
  2) scripts/uxi391-handoff-e2e.mjs                                        （本次）
三个都出现在主检出（会话工作目录）而非我实际施工的 worktree，成因未查明，不猜。
```

This was the third occurrence of the same phenomenon: all files were zero bytes and named after the file I was then writing. The first two involved `apps/android/app/src/main/java/city/utopia/control/SchedulerPanel.kt`; this occurrence involved the handoff script. All appeared in the primary checkout, the session working directory, rather than the actual construction worktree. The cause is unestablished and is not guessed.

**Disposition:** prove it is an **empty file**, not somebody's work, before deleting it. After deletion, the primary checkout had **zero dirty entries**. The fixed **Step 7 prerequisite** is therefore to assert a clean `D:\A-Utopia` working tree before merging (`git status --porcelain` empty). Otherwise an untracked-file conflict will reject the merge. This is an **operational prerequisite**, not a style requirement.

**Measured merge preview at the time:** versus `origin/main`, the branch had `17 files changed, +1700/-20`; main was an ancestor, allowing fast-forward. It added seven scripts, one test, five evidence files, and `services/dev-gateway/handoff.mjs`, and modified `presentation.mjs`, `server.mjs`, and `gateway-presentation.test.mjs`.
