# RECORD — UXI-391 双机验收（两台实体主机）PASS：Alien 侧独立断言 + Mech 用自己的节点参与

```text
任务        = UXI-391 Step 6「Alien + Mech 真实双机验收」
结果        = PASS（Alien 侧 0 failures；Mech 侧独立记录见其复核产物）
时间        = 2026-10-03T01:38:34Z（本地 11:38）
HOST A      = Alien 主机，Gateway 绑定 LAN 172.31.3.110:4391
HOST B      = Mech 主机，加入我方 Gateway，使用它自己的节点 id
```

## 1. 两侧各自测到了什么（两台主机的独立记录，不是互相背书）

**Alien 侧（HOST A）逐项 PASS，其 receipt：`dualhost-host-a.json`**

```text
[PASS] node A really ran the target, and the hold is sustained   state=RUNNING assigned=dualhost-node-a progress=18
[PASS] the original surface shows the run before the handoff     面板中可见 target id（用户语言）
[PASS] the assignment survives the worker leaving                assigned 仍为 dualhost-node-a（长而诚实的窗口）
[PASS] the review host started a second device                   sawB=true
[PASS] ownership moved away from node A                          {from: dualhost-node-a, to: mech-review-b}
[PASS] the SAME task finished on the other host                  state=COMPLETED（同一个 task id）
[PASS] the result came from real execution                       {"waitedMs":6000}
[PASS] the surface was never reloaded during the acceptance      reloaded=false
[PASS] the original surface shows the finished run               TASK REGISTRY WAIT <id> COMPLETED
[PASS] no raw scheduler token leaked onto the surface
RESULT: PASS - the handoff completed across the two hosts
```

**Mech 侧（HOST B）**：它在同一次验收里上线了**它自己的两个节点** `mech-review-b`、`mech-review-c`，
并由 `mech-review-b` 接手同一 task 跑完（我方 backend 记录 `handoffFromRef=dualhost-node-a`、
`handoffTargetRef=mech-review-b`、`handoffEpoch=2`、`history=["handoff:dualhost-node-a->mech-review-b@epoch2"]`）。
**它用的是自建仪器**（不是我为它准备的脚本），这正是 §3 希望的独立测量。

## 2. 这次验收与第一次尝试的差别（两份失败/中止记录都在案）

```text
第一次：decline 在 A 仍被判为健康时发出 → planner 正确地 DIRECT → 无转移（我的 B 侧脚本缺前置 1）
第二次（本次）：前置 1 满足 → 转移真实发生；但 Mech 的节点曾在 progress=36 时离开（缺前置 2）
第三次（本次成功）：前置 1 满足、且接管节点保持存活到 COMPLETED → 全链闭合
```

## 3. 待修（本轮**故意不修**，因为会移动 Mech 正在复核的 head）

```text
1. uxi391-dualhost-b.mjs 必须在 decline 前断言「当前持有设备 online === false」（前置 1）
2. Dispatch/脚本须写明：接管节点在任务抵达 terminal 前不得退出（前置 2）
3. dualhost-host-a.json 本身尚未提交到分支——将在复核结束后的修复提交里随上述两处一起纳入
```

## 4. 证据指针与摘要

```text
Alien 侧 receipt（实现仓库，待随修复提交）：evidence/raw/mission-book/UXI-391/dualhost-host-a.json
  sha256 = e9594565187d4d284b918ef15661de4266013aac14fd543c821614fe0a756e2a
Alien 侧运行日志：D:\utopia-uxi391\.dualhost-a.log（本机，非仓库证据）
Mech 侧证据：见其复核产物（review_host = Mech，review_head_sha = 269aa96…）
```

验收后我方 backend 的真值（事件与任务记录）：`TASK_HANDOFF_TRANSFERRED` →
`TASK_ASSIGNED` → `TASK_STARTED` → `TASK_CHECKPOINTED`… → `COMPLETED`，
`result = {"waitedMs":6000}`，全城**一个任务、一次终态完成**（无重复执行、无替代任务）。

## 5. 这一步意味着什么、不意味着什么

**意味着**：`SWITCH_OFFERED → ALTERNATE_DEVICE/REMOTE_HANDOFF → A→B 所有权转移 → 同一 task id 在新持有者上跑到
terminal → 结果回到原 surface`，在**两台实体主机**上真实闭合，且双方各有独立测量。

**不意味着**：UXI-391 已完成。独立**复核结论**（`review_result`）仍是 Mech 的字段、尚未写出；
Step 7（合并 main、main CI、`REMOTE_HANDOFF_CLOSEOUT_REPAIRED`、`POST_COMPLETION_REENTRY.md`）尚未执行。


[阅读译本 / Reading translation](./en/RECORD_DUALHOST_ACCEPTANCE_PASS.md)
