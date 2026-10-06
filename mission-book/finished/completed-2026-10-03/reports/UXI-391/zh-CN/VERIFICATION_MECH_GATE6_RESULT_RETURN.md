# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_GATE6_RESULT_RETURN.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：gate6PASS，result返回原surface

```text
FROM = Mech (review host)   GATE = 6, "the result returns to the original surface"
TREE = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9
RESULT = PASS 9/9, in a real browser on the real page
```

记录释义：Mechreview、完整tree如原块，真实browser/page9/9PASS，gate6originalsurface。

## 测什么，为何须UItest

UIclaim不能backendreadback满足。一个pageinstance配对、留Devices，观察inflight，device死、alternate上、decline、transfer/complete，**同page无reload无转指othernode须显示finishedresult**。

## 结果

```text
[PASS] the ORIGINAL surface shows the run IN FLIGHT before anything is disturbed
[PASS] the surface FOLLOWS the device loss rather than staying frozen
[PASS] PRECONDITION 1 satisfied: the holder is judged unavailable before the decline
[PASS] the decline is accepted (driven by API, because NO surface control can send it) - status=200
[PASS] ownership moved to the live alternate while the page stayed open - from=mech-ui-a to=mech-ui-b epoch=2
[PASS] the transferred task COMPLETED on the alternate - result={"waitedMs":6000}
[PASS] GATE 6: the SAME page instance (never reloaded, never re-pointed) shows the completed result
[PASS] no raw RS-290 scheduler token leaks into the final rendered page - 22 tokens searched, none found
[PASS] no page errors during the whole gate-6 journey
=== PASS (9/9) ===
```

九断言释义：原surface先inflight；跟随loss非冻结；holderunavailable前置1；decline200经API因 **无surfacecontrol**；page开时A→Bepoch2；alternateCOMPLETED/waitedMs6000；**同未reload/未repointpage显示完成**；22tokens零leak；全过程零pageerrors。

截图原pageTaskRegistry显示WAIT Q-40f00d9a-362d-4936-af45-9ca322781434 **COMPLETED**，本runmech-ui-a→b交接task，result回user原来看的surface。

同registry另行 **FAILED**，是我abort gate6task，具名非裁图：中断device重注册使workFAILED，“interruptedworknotreplayed”，与Alien不能resume我旧case理由同规则。是tool故障可见后果非productfault。

## 自身两重复class faults

1. **Locale**：首run等ONLINE超时20秒，UI其实 **在线**，follow navigator.language，本hostEdge默认zhCN。Product正确、assertEnglish假定。Page固定enUS使后续Englishassert有意义。
2. **再次前置1**：kill2.5秒后decline，但gateway8秒heartbeat超时前仍healthy，plannerDIRECT，**正确不转**、wait超时。独立命中Alien前置第二次，证真正条件非scriptdetail。

均我toolfault，修而非绕过，非product；本review第三次negative属自身precondition。

## 未确立

**Decline仍须API驱动**。UXI391未触Web/Android产品code，无surfacecontrolcall，offer可render用户不能action。AlienUXI390finding本task未关，记productopen非UXI391defect，关闭需productdecision。

## 证据

mission-book/reports/UXI391/review-by-mech/gate6-result-return.json及gate6-1-in-flight.png、gate6-2-result-returned.png（sha2566e7880c9386473d2…）。
