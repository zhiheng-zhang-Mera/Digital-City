# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../REVIEW_NOTES_MECH_PRE_GATE.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# REVIEW NOTES — Mech，UXI390 gate前working set

```text
FROM = Mech   PURPOSE = accumulate review observations while the author develops, so nothing is lost to a
                        context compaction and the review starts from evidence rather than re-reading.
STATUS = NOT A REVIEW. No gate item is scored here and none of this is a verdict.
```

Review gate为UXI390 canonical workbook的development_complete true。本文件是开放后working set，各项区分已确立与仍欠。

## A. Parity guard证明与不证明什么

android-scheduler-parity比较Kotlin ACTION_WIRING与Webscheduler.js，两边最小count防emptyparse空洞通过，deepEqual且unrouted精确{CONFIRM}。已验证逐entry一致、mutation可fail。

**证明**两面知道相同 **routes存在**；**不证明**任一面 **连接**。非guard defect，是claim边界；不能将绿parity当行为parity。

两面 **effective live sets合理分歧**，containment设计正常：

|action|Web有效行为|Android有效行为|
|---|---|---|
|CANCEL|live POSTcancel|**live CityClient.cancel**|
|CHOOSE_PROVIDER|action-row note、逐providercontrol|**row disabled**，逐provider Choose→providerChoice|
|KEEP_WAITING|live local ack，不send后rereadfeed|**disabled**，非supportedActions|
|RETRY|live POSTtasks CHECKPOINT_DEMO|**disabled**，非supportedActions|
|CONFIRM|disabled带label|disabled带label|

因此guard绿，RETRY Web提供而Android不提供，**正确**，Android不能做不可假装；guard证route agreement非behavior一致。KEEP_WAITING另一向可争：Web明确nothing to send后reread、Android禁且自timerpoll，两者可辩、Android保守，用户差别微小。记parity observation非defect。

## B. 开发期已提交findings

|item|state|
|---|---|
|MainActivity103漏onAction、routed全部enabled/inert|**CLOSED**，8ab8225 nullable后108–116wired|
|supportedActions/Choose无test、deadCHOOSE_PROVIDER trap|**CLOSED**，cd298c3删deadbranch/addwiringtest，我detached mutation验证非目信|
|**我的提案不足**|重建trap两existenceguards仍过，仅Aliensemanticfail，诊断对处方错，见mutation报告|
|Android无CHOOSE_PROVIDER|**CLOSED**，kt113providerChoice、逐rowref发送|
|guard对诚实unsupported CHOOSE_PROVIDER会FAIL|**原问题已无现实对象**，现Android真支持，{CONFIRM}正确；未来containment仍对，不算openbug|
|**Web Advanced未MET**，app.js不传默认false，缺失非fold；Android无条件TechnicalDetails已met|**FILED open**，ADVANCED_FOLD finding，两defects均我Web/E2E|
|**Web E2E fold断言空洞**，两否定或，containsTechnicalFold false却oktrue，删除feature仍过|**FILED open**，仅record未assert，不能称覆盖fold|
|**三实例正确component无caller/callsite test**：AndroidonAction已修、Webadvancedopen、switch-declined全surface无calleropen|**Review首要结构主题**，验证是什么不验证连接，两例我责任|
|**Switch offer双方向无解**：decline无caller、accept无endpoint，server166唯一switchroute|AlienFILED，我核验两半，新未建能力scope非wiring|
|**Handoff deferral前提已review否定、目标本task**：integration延期、假前提五types/WAIT6000、Alienbatches/twonodes曾声称产生条件|见ANALYSIS；我的假前提传播治理，是否再延Owner决定，不可用旧理由|

## C. Gate开放时欠的验证

针对workbook **精确development_head_sha**、§7，绝非tip：

1. uxi390-reconcile期望12/12、recorded==tip。开发期10/12仅两正常lag，非finding。
2. **Android choice往返**。3005c85声称ACHIEVED，global scan每user-actor TASK_PROVIDER_CHOSEN、每tap一新event。旧note按54445d3open已陈旧，在此改。**仍必须recordedhead测**，非怀疑，是数轮不确定项值得测；rendercontrol非closure、commitmessage非verification。
3. 精确head、两jobs hostedCI，**implementation** zhiheng-zhang-Mera/utopia，读取implementation_repo而非推断。
4. **Review主机可打开** evidence/raw/mission-book/UXI390已commit，非仅gitignored.runtime；现在有，head重查。
5. RS290contract与main字节相同，现在核验，head重查。
6. UXI301handoff **未明示** 处置，曾integration延期NOT MET，确认integration未静默变passed。

## D. 常驻约束

- §3不同物理host；开发Alien、review我，FMreview_host null。
- 自己开发任务REVIEW_COMPLETE绝不能我发布，此处不适用，但解释UXI301裁定Alien、本task我。
- Mock不可代真实E2E，deferred≠passed。
- Review工作非记录，reconcileclean仅claim前提非verdict。
