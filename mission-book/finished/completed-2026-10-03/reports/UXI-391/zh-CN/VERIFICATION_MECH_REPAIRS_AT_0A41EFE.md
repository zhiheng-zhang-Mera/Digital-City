# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_REPAIRS_AT_0A41EFE.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：0a41efe新head自身tool核验两必修

```text
FROM = Mech (review host)   REVIEWED HEAD MOVES TO 0a41efe50e1e6c7a8dde77edaeb3158636717b91
RE   = the two residuals I recorded as OPEN (DISPATCH_ALIEN_TO_MECH_REPAIRS_APPLIED_SINGLE_SHOT.md)
RESULT = PASS 9/9, then reproduced 9/9 again on a second run with a different task id
```

记录释义：reviewhead移动完整0a41efe，如原块；两OPENresidual，9/9PASS，另taskid第二次重复9/9。

## Head为何移动

Repair使branch前移，UXI301/390已确立模式 **repaired成为reviewed**，review_head_sha0a41efe；269aa96checks尽可能新head重申。

## A：recordeddecline现重评

```text
[PASS] setup: the decline is recorded while NO alternate exists at all
[PASS] (negative) with no alternate present, the sweep does NOT invent a destination
[PASS] REPAIR A: the recorded decline is honoured AUTOMATICALLY once an alternate becomes eligible
       - target=Mech-test-b epoch=2 from=Mech-test-a, and NO SECOND DECLINE WAS SENT
[PASS] the same task id, ownership recorded from the original holder
[PASS] idempotency: repeated sweep evaluations do NOT transfer again or bump the epoch - 2 -> 2
```

全部五断言释义：无alternate记录decline；负控sweep不发明目的地；eligible后 **自动履行，无第二decline**，Mech-test-a→bepoch2；sametask与originalownership；重复sweep不转、不增epoch2。

后二值得具名，若每秒retrytransfer可重复epoch/转移，现幂等 **实测非设计推论**。无destination不发明负控抓过急repair。

## B：deadreservation释放，含guardhold

```text
[PASS] a reservation whose device died is RELEASED rather than stranding the task - target=null state=QUEUED
[PASS] the release is a DISTINCT recorded event
[PASS] a THIRD device takes the released task and runs it to terminal
       - state=COMPLETED assigned=Mech-test-c result={"waitedMs":6000}
[PASS] still one task and one completion
```

四断言释义：deadreserveddevice释放targetnull/QUEUED，独立event，**thirddevice** Mech-test-c接并COMPLETED/waitedMs6000，一task一completion。

Wire事件全文，因为首run截断使有歧义：

```text
CITY_STARTED, NODE_ONLINE, COMMAND_ACCEPTED, TASK_CREATED, TASK_ASSIGNED, TASK_STARTED, NODE_OFFLINE,
TASK_RUNNING, TASK_SWITCH_DECLINED, TASK_HANDOFF_TRANSFERRED, TASK_CHECKPOINTED,
TASK_HANDOFF_RESERVATION_RELEASED, TASK_COMPLETED
```

RESERVATION_RELEASED确实distinct、thirddevice终结。**须重跑才確立**：首check rawJSONmatch过，却names只打印八项，是重复truncateddetail歧义。两run9/9、第二不同task，是真repeat非复述。

**独立确认作者新增**：只清target不够，memoryguard仍deadowner拒别人；现在也releaseclaim，我thirddevice run证明。

## 新headCI由我核验非读field

```text
run 37088320091   headSha 0a41efe50e1e6c7a8dde77edaeb3158636717b91
                  branch uxi/UXI-391-remote-handoff-closeout   completed / success
                  gateway-web: success (pnpm test, promotion-history, rooms tests, city test-all, check:docs)
                  android:     success (testDebugUnitTest + assembleDebug)
```

完整释义：37088320091精确0a41efe/branch，completed success；gatewayweb含pnpmtest/promotionhistory/rooms/citytestall/checkdocs成功；Android unit+assemble成功。

## 属作者而非我一记录项

§7reconcile **11/13**，两fail同因FMdevelopment_head_sha仍269aa96、development_ci旧run。**实质无问题**，newheadrun存在精确绑定且绿。与UXI390authorlag同；记录不改作者field，reviewer改即coauthor。

## Ledger影响

两OPEN现 **CLOSED**，自身tool。1–8newhead仍MET，8新head重核；9–12待step7。

## 证据

mission-book/reports/UXI391/review-by-mech/repair-verification-by-mech.json。
