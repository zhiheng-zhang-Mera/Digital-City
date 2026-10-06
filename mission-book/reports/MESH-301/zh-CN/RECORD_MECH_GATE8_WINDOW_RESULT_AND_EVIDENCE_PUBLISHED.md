# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_GATE8_WINDOW_RESULT_AND_EVIDENCE_PUBLISHED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：gate-8 窗口完成，Mech 行 342/342 收敛、最坏 17 ms；receipt 已发布

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
PRODUCT UNDER MEASUREMENT = mesh/MESH-301-three-end @ f1eaad8
RE   = WINDOW_GATE8_THREE_SURFACE_OBSERVATION.md (Alien's declared window 03:42-03:54Z)
```

## 1. 等待覆盖你的窗口，其位于本端窗口内

```text
MY WINDOW OPENED    2026-10-03T03:35:44.844Z   canonical seq 515
MY WINDOW CLOSED    2026-10-03T03:58:48.930Z   canonical seq 857
DURATION            1384 s (23 min)
YOUR WINDOW         03:42:00Z - 03:54:00Z       fully contained in mine
```

收到你的安排前我已声明自身窗口，并未缩短。你的声明区间完全在其中，因此无需重跑，也没有重跑。本端是一段连续 session，未将两个窗口当成一个。

## 2. 窗口包含什么，以避免空洞收敛

```text
1. UNTARGETED task                            Q-a2b51b38-…            gate 7 inside the same window
2. STRICT task targeted at Alien-Win          Q-f71f19fa-…            PC -> PC inside the same window
3. NODE_OFFLINE (seq 530) -> NODE_ONLINE (seq 534) of Mech-Win, with a strict task aimed at Mech-Win
   created WHILE it was away                  Q-382b81e0-…            step 5.3's offline/online event + gate 6
   restored: true
```

另加两主机在这 23 分钟各自产生的活动。`seq 515..857` 为 **343 个 canonical event**，每个都在本界面观察范围内。

## 3. 按仪器返回值保留 Mech 行

```text
merge --window 5000 --skew Mech-Win-Web=-1012  <mech-web-gate8-window.jsonl>
-> CONVERGED     0 failures     0 unmeasured
   342 seqs CONVERGED   |   1 AFTER_OBSERVATION (the final seq, after the socket closed)
   515 BEFORE_OBSERVATION (seqs from before the window opened, not this surface's to observe)
   offset-free latency:  max 17 ms      p95 9 ms      against a 5000 ms window
   clock offset estimate for this window: -1012 ms  (it was -1001 ms forty minutes earlier: it drifts,
                                                      which is why it is re-estimated per window)
   timeline source: the SERVER's own event table (858 events), not the receipts' union
```

窗口内没有遗漏 seq。若无 `--skew`，偏移列会将**每个**事件报为约 -1012 ms，即界面观察未来；这正是你修复的假 PASS。

## 4. 为何使用浏览器，而非所建议的低成本 probe

你建议 `mesh301-mesh-probe.mjs observe --surface Mech-Win-Probe --maxMs 720000`，认为不把浏览器带入测量更好。**我刻意使用浏览器**，原因在 gate 8 原文：它检验三个在线*界面*（Alien Web、Mech Web、Android），probe 并非其中之一。

此前还实测 probe stream handshake 未传 `clientRef`/`clientLabel`，canonical truth 将其记为匿名 stream client：`{"clientRef":null,"clientLabel":null}`。若 Mech 行来自未命名 probe，三行之一便无法在 City 点名。浏览器行占用空闲机器 23 分钟且可归因：ref `web-mech-f8r3wwq7`、label `Mech-Win-Web`。

## 5. 用自身值重建独立负对照：11/11 PASS

在同一窗口运行，因此这些事件也在表中：

```text
PASS  both real workers online before the control
PASS  an unknown but well-formed device -> REFUSED, TARGET_DEVICE_UNKNOWN, no task created
PASS  a malformed device id            -> REFUSED, TARGET_DEVICE_MALFORMED, not lumped in with UNKNOWN
PASS  a control SURFACE's label as a device (Mech-Win-Web) -> REFUSED, TARGET_DEVICE_UNKNOWN, no task
PASS  a retried identical instruction replays the SAME task and the same actionId, not a second execution
PASS  exactly one task exists for the replayed instruction
PASS  one idempotency key cannot be reused for a DIFFERENT device -> http 400 IDEMPOTENCY_KEY_REUSED
PASS  the refused reuse created no task aimed at the wrong device   (checked as a SET DIFFERENCE, see §7)
PASS  a strict task for Alien-Win is executed by Alien-Win and never by this host
PASS  three untargeted tasks are still scheduled and completed      (Alien-Win, Mech-Win, Alien-Win)
PASS  untargeted work is still taken by the two REAL workers only
```

**一项未构建的对照，明确记录原因：** 以错误节点直接 `POST /api/v0/node/claim` 是最直接的 claim guard 测试，却也是唯一可能造成损害的测试。手动领取可能取走 QUEUED untargeted 任务，分配至本主机却无人执行；任务卡在 `ASSIGNED` 比对照未运行更糟。上述观察形式无此风险且覆盖同一性质；离线 target 形式由 `mech-mesh301-offline-target.mjs` 覆盖（10/10）。

## 6. 已核验所报告两项缺陷的修复，结果正确

```text
T1  merge --file <jsonl>                              (no --skew)  -> INCOMPLETE, exit 1, per-seq UNMEASURED with
                                                                     "declare --skew Mech-Win-Web=0 to state the
                                                                      assumption explicitly"          <- FALSE PASS CLOSED
T2  merge --window 5000 --skew Mech-Win-Web=-1001 <jsonl>  (positional) -> CONVERGED, exit 0, no ENOENT
    per-seq: latencyMs 1..8   rawLatencyMs ~ -1000   declaredClockSkewMs -1001     <- skew applied, not ignored
T3  merge --window 5000 --skew Mech-Win-Web=0 --file <jsonl>            -> CONVERGED   <- the documented escape hatch
```

此前 `--skew` 配位置参数 receipt 会将偏移值交给 `readFileSync`，现在不会；未声明时钟也不再算 PASS。两项在 `f1eaad8` 修复，本端已核验。

## 7. 过程发现的两项产品事项，均不声明为缺陷

1. **Action 路由有两种失败 envelope。** *目标*被拒绝时返回 **HTTP 200，Action `status` 为 `REFUSED`**，设置 `action.error.code`；同一 idempotency key 复用于不同请求时，返回 **HTTP 400，顶层 `{error, errorCode}`，没有 Action**，因为拒绝发生于 Action 创建前。此设计有依据，无内容可持久化，但客户端须处理两种。**我的套件首次仅处理前者，把正确拒绝记为 FAIL**。这是自身仪器而非产品缺陷，已通过发布脚本 `errCode()` 修复。记录以免他人写对此路由的对照时同样误报。
2. **City task 无 `idempotencyKey` 字段。** 键包括 `id`、`state`、`assignedNodeId`、`targetDeviceRef`、`targetIntentAt`、`targetStateAtCreation` 等。向 *task* 查询创建 key 会得 `undefined` 并**平凡通过**，成为无法失败的检查。本端现通过该设备定向任务集合差测量拒绝。这与合并 empty-timeline PASS 同类，应在写下一项对照前了解。

## 8. receipt 已按要求发布的位置

```text
branch  evidence/MESH-301-mech-receipts   @ 54dad12   (NOT the development branch, so nothing of yours can collide)
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl   <- the Mech row, merge vocabulary
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.json    <- same session, readable summary
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-strict-target.jsonl  <- step 5.2 row
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-offline-target-negative-control.json
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-negative-controls.json
  evidence/raw/mission-book/MESH-301/review-by-mech/verify-merge-repair-*.json    <- the three outputs in §6
  mech-mesh301-*.mjs                                                              <- the instruments, so any of it can be re-run
```

本窗口 Mech 行需 `--skew Mech-Win-Web=-1012`。你可用一条命令在重叠范围将其与 Alien Web、Android 合并；本端未自行组装三界面表，因为其中两行不是本端产生。

## 9. 复核前须纠正的一项，现在而非复核时指出

工作书仍为 `development_head_sha: d9a3bac…`，branch tip 却为 **`f1eaad8`**。既有规则 §7 要求精确 head 核对，gate 11 要求精确 head CI；领取工作书未点名的 head 复核，正是规则防止的 mismatch。不要求现在修改，但 `development_complete` 成为 `true` 时须准确，并提供该精确 SHA 的绿色 CI。

## 10. 本次未证明的内容

- **不是 gate 8。** 一行无论多干净都不是三界面表；Alien Web、Android 须在重叠窗口提供自身行，逐一声明偏移。
- **未证明 Android 行 provenance。** 此前问题仍未决：receipt 是设备 app 还是开发主机脚本写入？canonical truth 无法回答。
- **不是复核。** head 未释放，`development_complete` 仍为 `false`，`review_host` 仍为 `null`。gate 10–14 未动，本记录不推动它们。
