# REX-804 对侧 Formal Review——Mech

[English source / 英文原文](../REVIEW_REPORT.md)。阅读译本保留历史 verdict，当前事实以工作书与最新源报告为准。原证据代码块逐字保留。

```text
REVIEWER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
DEVELOPER           Alien (different physical host) — the workbook records development_host=Alien
REVIEWED HEAD       f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (branch rex/REX-804-Alien-codex-faults)
REVIEW BRANCH       review/REX-804-mech-review @ 737c3e1602b87b18395c69757127a3b500fc54e4
CLAIM               mission-book/reports/REX-804/REVIEW_CLAIM_Mech.md (published before any verdict)
VERDICT             NOT PASSED on the reviewed head — returned for repair of finding B1
TERMINAL MARKER     FAULT_INJECTION_RECOVERY_ACCEPTED  NOT RELEASED
MERGE AUTHORITY     none
```

## 1. 独立性及领取时测量

development_host Alien、Reviewer Mech 不同实体主机，非 self-review。verdict 前独立重测而非相信作者：

```text
remote tip of rex/REX-804-Alien-codex-faults == f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (exit 0)
required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe reachable   (git merge-base --is-ancestor, exit 0)
declared dependency REX-802 833279cae237080cca88b1b6dbc9f217027ba68f reachable   (exit 0)
exact-head check runs re-read from the GitHub API: gateway-web success (x2), android success (x2),
    reciprocal-contract success — all terminal success
```

## 2. 能复现与不能复现

| 项目 | 作者声明 | Reviewer 实测 |
|---|---|---|
| rex804-faults.test.mjs | focused pass | 8 pass/0 fail |
| rex804-gateway.test.mjs | focused pass | 1 pass/0 fail |
| rex804-web.test.mjs | focused pass | 1 pass/0 fail |
| focused 合计 | 10 PASS | 10 PASS 复现 |
| 完整 local suite/S1 relay timing | 作者报告 | 本 Review 未重跑，超仪器范围，verdict 不依赖 |
| physical-host/external-provider recovery | 未测 | 本次也未测，是缺失不是零 |
| Android controls | 显式 seam | 确认 diff 中不存在 Android fault surface |

## 3. 独立仪器（被审 head 九 probe）

utopia:tests/rex804-mech-review-probes.test.mjs 专门攻击作者测试未覆盖内容：

```text
P1  TWO faults live at once on two different nodes: each acts only on its own node and its own operation, and stopping
    one leaves the other ACTIVE.                                            -> VERIFIED CORRECT
P2  A new fault on the same node immediately after an emergency stop, then wait past the STOPPED fault's original
    expiry: the stopped fault stays STOPPED (its timer is dead) and the live one stays ACTIVE.  -> VERIFIED CORRECT
P3  Expiry persisted to the RECEIPT FILE by the timer itself, with no API read in between.       -> VERIFIED CORRECT
P4  A delayed report released by the fault's OWN EXPIRY (not by a manual stop) and reaching canonical truth, with
    recovery attributed.                                                                            -> VERIFIED CORRECT
P5  Owner-only boundary measured with an ENROLLED MEMBER credential, plus typed refusals over HTTP (confirmation
    mismatch, duration bound, unknown key, unknown class, unknown target, unknown id).               -> VERIFIED CORRECT
P6  The four-class matrix read FROM DISK: startable, stoppable, recorded, exercised, and recovery measured or
    honestly absent.                                                            -> VERIFIED, with finding F1
P7  A receipt left ACTIVE by a dead process: disabled on the next start, persisted as INTERRUPTED/PROCESS_RESTART,
    and the fault is not in force.                                                                    -> VERIFIED CORRECT
P8  An unreadable fault receipt present at start.                              -> FINDING B1 (blocking)
P9  A receipt that is valid JSON but has no fault identity.                    -> FINDING B3
```

## 4. Findings

### B1——BLOCKING：单个不可读 receipt 阻止整个 City 启动

```text
OBSERVED   createFaultController iterated every fault-*.json in its directory and called JSON.parse without a guard, so
           a single unreadable file made createGateway throw a raw SyntaxError (no code, no status, no typed refusal).
           Measured directly: "RESULT: createGateway THREW -> SyntaxError Expected property name or '}' in JSON at
           position 1" with the City never binding its port.
TRIGGER    honestly bounded: the module writes through temp+rename, so the routine torn write is NOT the expected
           cause. An external edit, a disk fault, a foreign tool, or a future format change is.
WHY BLOCKING (a) the workbook's own completion gate says the product in normal mode with no fault active must not be
           affected, and with a broken receipt the product does not run at all;
           (b) the same programme already settled this pattern twice: the experiment registry reports `broken` files
           and keeps serving, and the trace collector degrades to PARTIAL instead of failing. This new module is the
           only one in the family that turns a bad record into a dead City.
           (c) the failure is untyped, so a supervisor cannot even classify it.
```

### B2——同一路径遗留已打开 store

new Store(dir)打开 city.sqlite 后 construction 抛错却未 close；清理 runtime 时观测 EBUSY unlink city.sqlite。B1 后果，同修复可消除，但仍记录：启动失败不应遗留半开 store 妨碍下一次。

### B3——无形状 receipt 无 identity 被采纳而未披露

fault-<uuid>.json 无 faultId 却以 undefined 键进入 map，list 返回匿名 row、没有 broken channel；同 B1 错误 record 误表示，较小 blast radius。

### F1——四类中一类不可能获得测量 recovery

recoveryTimeMs 只归因 heartbeat/claim/report；DUPLICATE_EVENT 无 canonical operation 可恢复，指标结构性永久 NOT_MEASURED。reason 而非 0 是诚实，但“量化恢复”只覆盖三类。留作者/REX-806 判断重复 observation recovery 定义是否有意义。

### F2——candidate Registry vocabulary drift

CAP-RESEARCH-FAULTS-001.yaml 使用 CAPABILITY_INDEX.yaml 词汇外值：implementation_status CANDIDATE、backend_wiring_status LOCALLY_VERIFIED、user_reachability_status WEB_VERIFIED_ANDROID_PENDING、intent_validation_status PENDING_FORMAL_REVIEW；漏 GET/api/v0/research/faults/:id。其余 path/symbol/nesting/exposure/evidence 与 runtime 一致。

### F3——类名

PROVIDER_UNAVAILABLE 在 node execution-CLAIM seam，不对外部 provider API；UI 明确说明，未隐藏，但名称范围较实际 fault 宽。

### Reviewer 自身仪器缺陷

P7 初稿通过 gateway 建 fault 后 close，产品正确记 PROCESS_CLOSE，probe 却期待 PROCESS_RESTART 失败。产品正确，probe 错误。改为直接写 crashed-process receipt；按证据协议§4 留 Reviewer error rate。

## 5. Reviewer 修复提案（非 accepted head）

只加 reader guard，最小修复：

```text
CHANGE  services/dev-gateway/research/faults.mjs — construction now validates each receipt file by name and shape,
        collects anything it cannot use into a `broken` list (UNREADABLE_RECEIPT / RECEIPT_SHAPE_MISMATCH /
        RECEIPT_REWRITE_FAILED), and never throws. `list()` publishes `broken`, exactly as the experiment registry does.
BRANCH  review/REX-804-mech-review @ 737c3e1602b87b18395c69757127a3b500fc54e4
        V0.2 checks 37399882138 COMPLETED SUCCESS (reviewer probes + the repair together, 18/18 locally)
GUARDS  P8 and P9 are the regression guards; the author's own 10 focused tests still pass unmodified alongside them
NOT DONE  the reviewer did NOT change the fault semantics, the routes, the UI, or any other file.
```

### 5A. 作者自身 line 上的可采纳最小修复

避免从 review branch 抽取，同变更发布在 parent 就是 author reviewed head 的分支，只包含 repair 与两个 regression guard：

```text
BRANCH   repair/REX-804-mech-minimal @ 19a420c6725532eabb9bf4cb0b06add180f6ce4e
PARENT   f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (the reviewed head - a fast-forward for the author's branch)
CHANGE   1 file: services/dev-gateway/research/faults.mjs (the reader guard)
        1 file added: tests/rex804-receipt-guard.test.mjs (the two probes named above)
CI       V0.2 checks 37402198156 COMPLETED SUCCESS on 19a420c6725532eabb9bf4cb0b06add180f6ce4e
LOCAL    11/11 in one run (2 guards + the author's 8 unit probes + the author's 1 gateway probe)
STATUS   PROPOSED, NOT ACCEPTED. Adopting it is the author's act (or the owner's ruling); the reviewer's verdict stays
         NOT PASSED on f76ccf53 until a repaired head is re-reviewed, and no terminal marker is released by this branch.
```

## 6. Verdict

`f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5` **NOT PASSED**，B1 违反工作书 completion gate。FAULT_INJECTION_RECOVERY_ACCEPTED 不释放、review_complete=false。作者修复或采纳提案后，repaired head exact CI green，Reviewer 在该 head 重跑 probes 并重新 verdict。

## 7. 测量诚实说明

```text
The reviewed head's CI was green and independently re-read (section 1). The REVIEW BRANCH's own CI is now terminal
SUCCESS: V0.2 checks run 37399882138 COMPLETED SUCCESS on 737c3e1602b87b18395c69757127a3b500fc54e4 (the reviewer's
probes plus the minimum repair). An earlier commit of that branch (f7c10f2f0767198c0dcff00808b71150ea160c09) had a
queued run which was CANCELLED as superseded: the first commit of the branch was amended to restore the AUTHOR's
evidence screenshot, which running the author's web test had overwritten. That screenshot was restored rather than
re-attributed.
```
