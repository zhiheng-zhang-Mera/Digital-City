# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../CORRECTION_MECH_WITHDRAWING_THE_SILENT_DROP_FINDING.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# CORRECTION — Mech：“静默丢用户意图”finding错误，Alien事件序列证伪

```text
FROM = Mech   SUBJECT = withdrawal of FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md, section 2
STATUS = correction of my own published finding. The withdrawal is the point of this document.
```

记录释义：撤回dualhost/single-shot finding第2节自身已发表结论，本说明重点为撤回。

## Claim及不成立原因

原发机制：

> Plan仅在switch-declined内消费；瞬间无alternate，已记录intent静默丢弃。

Alien给gateway事件序列，否定归因：

```text
TASK_ASSIGNED / TASK_STARTED / CHECKPOINTED 18, 36, 54   A really running (progress 54)
NODE_ONLINE  dualhost-node-b                             the reviewing host's node comes up
TASK_RUNNING + TASK_SWITCH_DECLINED                      the decline at 11:30:44Z
NODE_OFFLINE dualhost-node-a                             ONLY NOW does the 8s heartbeat sweep mark A offline
```

完整释义：A真实RUNNING checkpoint18/36/54；B online；11:30:44decline；**此后才**8秒sweep判断A offline。

**Decline瞬间A在gateway仍healthy**，planner首stagecurrentusable→DIRECT，routeStageFor null，bridgeNOT_APPLICABLE，**不转、不发虚假event**。非丢intent，而是“user拒switch但currentfine，别动work”的正确答案。

**原因非alternate无资格，也非fragiletrigger**，transfer条件尚未出现。我将正确NOT_APPLICABLE当defect，与此前两次同错：未确立precondition却推productfault。

**撤回**已记录decline“静默丢弃”，自身evidence不支持，Alien序列反驳。

## 保留与撤回分开

**保留observation非finding**：RUNNING、assigned已死但未timeoutdevice、switchDeclinedtrue、无handoff是实态，却为death至sweep发现间预期transient，非defect。

**保留自身fault，Alien精确诊断**：早先mech-b-verify转后 **progress36退出**，未terminal/resultreturn。违反recovery§7两preconditions，第二接管者terminal前不可exit是我tool错，早披露stranded但不知因。后果更坏：**同id重注册将interruptedworkFAILED**，“interruptedworknotreplayed”，instance无法recover，Alien须freshA。

**有利自身纠正也记录**：后来13/13满足两前置，holder已offline、node保持到COMPLETED/result，所以PASS有效，两run差非productproperty。

## 仍坚持与不坚持

- **live实测**cpu间歇usagePercentnull，loadFromTelemetry拒非coerce，memory-only仍KNOWN因minimum1，让作者Btelemetry在cpu空时靠memory过。
- **changeset检查**未触Web/Android，仍无declinecontrol，offer可显示用户不可操作，UXI390open未关；productopen非本taskdefect。
- **不坚持，只是问题**：healthy时recordeddecline、laterdevice死，是否会reevaluate。无测量，不能从未构造state推论。

## Window重开后正确验收

Btool现 **两前置**：holderunavailable才decline，node保活至terminal/result，名 **Mech-test**。写时A未listen，因无inflighttargetabort，不假装result；window开后运行。
