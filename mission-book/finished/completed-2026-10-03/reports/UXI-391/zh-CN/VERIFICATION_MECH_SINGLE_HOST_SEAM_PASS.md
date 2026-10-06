# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_SINGLE_HOST_SEAM_PASS.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：单host seam17/17PASS，含四负控

```text
FROM = Mech (review host)   TREE = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9
INSTRUMENT = mech-uxi391-handoff.mjs   (mine; not the author's script)
RESULT = PASS 17/17
```

记录释义：Mech Review，完整tree原块，自身mech-uxi391-handoff非作者script，17/17PASS。

## 为何运行，以及修复自身旧尝试

初版 **transfer处abort**，因decline前未确立holder unavailable。Alien recovery具名前置1，我gate6又遇一次。加入后同tool全seam完成。

方法意义：**failed/passed仅差前置**，最干净展示该条件真正有效非script细节。

## 结果

```text
[PASS] TWO distinct devices are online - mech-a:true, mech-b:true
[PASS] a WAIT task is created
[PASS] the task is RUNNING and assigned before anything is disturbed - state=RUNNING assigned=mech-a
[PASS] NEG-1 no transfer occurs without a recorded decline
[PASS] NEG-2 with its device dead the task stays NON-TERMINAL rather than being failed or faked
[PASS] the run is never COMPLETED while no device executed it
[PASS] PRECONDITION 1: the holder is judged UNAVAILABLE before the decline
[PASS] the decline is accepted and recorded as user intent - status=200
[PASS] the SAME task id is preserved across the transfer
[PASS] ownership is RECORDED: from=mech-a to=mech-b
[PASS] the transferred task is re-queued for its new owner - state=QUEUED assigned=null
[PASS] NEG-3 a DUPLICATE decline does not transfer again or move the epoch - epoch 2 -> 2
[PASS] NEG-4 the RECOVERED original holder does not re-take work that has moved away - assigned=mech-b
[PASS] the transferred task REACHES a terminal state - COMPLETED
[PASS] it COMPLETED rather than failed, so the transfer really delivered the work - result={"waitedMs":6000}
[PASS] the terminal result is REAL
[PASS] the executor of record is the ALTERNATE, not the device that died - assigned=mech-b
=== PASS (17/17) ===
```

全部17断言完整释义：两distinct devices在线；创建WAIT；扰动前RUNNING/assignedmech-a；NEG1无recordeddecline不transfer；NEG2holder死task仍nonterminal不fake/fail；无人execute不COMPLETED；前置1holderUNAVAILABLE；decline200且intent记录；transfer保持sametaskid；frommech-a/tomech-b ownership记录；QUEUED/assignednull供newowner；NEG3duplicate不再次transfer/epoch2不变；NEG4恢复原holder不抢回已移work；到terminalCOMPLETED；非FAILED而真交付waitedMs6000；terminalresult真实；executor alternate非deadholder。

四負控尤其具名：无intent不转、deadholdernonterminal、duplicateinert、**恢复**原holder不能takeback，末项双执行guard实测非假定。

自身断言诚实说明：completedAt undefined，check靠或条件result通过，故真实terminal **由payload非timestamp** 确立，不称timestamp存在。

## 关闭项

Gates **3单机双nodeE2E、4真实ownershiptransfer、5sametask在otherdevice终结** 由 **自身tool** 核验，另加crosshost13/13、UIresultreturn9/9。

## 未结项

- Gate7crosshost已13/13一次，改node名 **Mech-test** 重跑待开发主机window，当前关闭。
- 9/10/11/12依step7，UXI391尚未执行。
- Gate12board已确立，无需再test：**无otherexecutableworkbook**，全其他reviewcomplete/frozen/final，XX000templateenabledfalse。要求结果 **typedzero-claim**，分类非claim。

## 证据

handoff-verification.json，mission-book/reports/UXI391/review-by-mech，task/nodes/from/to/epoch/finalstate/result/17results。
