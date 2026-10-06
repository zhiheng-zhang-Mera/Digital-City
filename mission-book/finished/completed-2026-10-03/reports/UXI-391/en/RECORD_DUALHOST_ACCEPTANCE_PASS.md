# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../RECORD_DUALHOST_ACCEPTANCE_PASS.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# RECORD — UXI-391 acceptance on two physical hosts PASS: Alien assertions and Mech's own nodes

```text
任务        = UXI-391 Step 6「Alien + Mech 真实双机验收」
结果        = PASS（Alien 侧 0 failures；Mech 侧独立记录见其复核产物）
时间        = 2026-10-03T01:38:34Z（本地 11:38）
HOST A      = Alien 主机，Gateway 绑定 LAN 172.31.3.110:4391
HOST B      = Mech 主机，加入我方 Gateway，使用它自己的节点 id
```

Record translation: step6 real Alien+Mech acceptance, Alien zero failures, independent Mech record in its review artifacts; 2026-10-03T01:38:34Z/local11:38. Alien Gateway LAN172.31.3.110:4391; Mech joins using its own node identity.

## 1. Independent measurements on both hosts, not endorsements

**Alien HOST A passes each item, receipt dualhost-host-a.json**:

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

Full assertions: A genuinely runs target RUNNING/assigned dualhost-node-a/progress18; original surface shows target before handoff in user language; assignment survives worker leaving; review host's second device appears; ownership moves A→mech-review-b; same task completes on other host; actual result waitedMs6000; original surface never reloads; it displays TASK REGISTRY WAIT id COMPLETED; no raw scheduler token leaks. PASS across hosts.

**Mech HOST B** brings its **own two nodes**, mech-review-b/c. B takes over same task and finishes; backend handoffFromRef A, target B, epoch2, history handoff:A->B@epoch2. **Its own instrument**, not my prepared script, is section3's intended independence.

## 2. Difference from first attempt: failures/abort retained

```text
第一次：decline 在 A 仍被判为健康时发出 → planner 正确地 DIRECT → 无转移（我的 B 侧脚本缺前置 1）
第二次（本次）：前置 1 满足 → 转移真实发生；但 Mech 的节点曾在 progress=36 时离开（缺前置 2）
第三次（本次成功）：前置 1 满足、且接管节点保持存活到 COMPLETED → 全链闭合
```

Full translation: first decline while A still healthy, planner correctly DIRECT/no transfer, B script missing precondition1. Second precondition1 satisfied, real transfer, but Mech node left at progress36, missing precondition2. Third success satisfies1 and keeps receiver alive until COMPLETED, closing full chain.

## 3. Pending repairs, deliberately not applied because they would move Mech's review head

```text
1. uxi391-dualhost-b.mjs 必须在 decline 前断言「当前持有设备 online === false」（前置 1）
2. Dispatch/脚本须写明：接管节点在任务抵达 terminal 前不得退出（前置 2）
3. dualhost-host-a.json 本身尚未提交到分支——将在复核结束后的修复提交里随上述两处一起纳入
```

Full translation: dualhost-b must assert current holder online===false before decline; dispatch/script must require receiver stays until terminal; host-a receipt not yet committed, to accompany both repairs after review.

## 4. Evidence pointers and digest

```text
Alien 侧 receipt（实现仓库，待随修复提交）：evidence/raw/mission-book/UXI-391/dualhost-host-a.json
  sha256 = e9594565187d4d284b918ef15661de4266013aac14fd543c821614fe0a756e2a
Alien 侧运行日志：D:\utopia-uxi391\.dualhost-a.log（本机，非仓库证据）
Mech 侧证据：见其复核产物（review_host = Mech，review_head_sha = 269aa96…）
```

Alien receipt pending repair commit is implementation evidence/raw/mission-book/UXI-391/dualhost-host-a.json, exact SHA256 retained above; local .dualhost-a.log is **not repository evidence**; Mech artifacts bound to review_hostMech/review_head269aa96….

Backend truth after acceptance: TASK_HANDOFF_TRANSFERRED→TASK_ASSIGNED→TASK_STARTED→TASK_CHECKPOINTED…→COMPLETED, result waitedMs6000; **one task, one terminal completion**, no duplicate execution/substitute task.

## 5. Meaning and limits

**Establishes** actual two-physical-host closure: switch→alternate/remote→A/B ownership→same task terminal on newholder→result originalsurface, with independent records on both sides.

**Does not mean UXI391 complete**. Review result remains Mech's unwritten field; step7 mainmerge/mainCI/REMOTE_HANDOFF_CLOSEOUT_REPAIRED/POST_COMPLETION_REENTRY not executed.
