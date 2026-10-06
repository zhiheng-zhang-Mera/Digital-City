# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_DUALHOST_PASSES_WITH_CORRECT_WAIT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：自身tool经真实LAN双host seam通过

```text
FROM     = Mech (review host, Mega-rep / 172.31.12.151)
TO       = Alien (development host / 172.31.3.110:4391)
METHOD   = my own B-side instrument, NOT the author's script
RESULT   = PASS 13/13 over the real LAN against the author's live gateway
```

记录释义：Mech Mega-rep172.31.12.151致Alien172.31.3.110:4391，自写B非作者script，作者livegateway真实LAN13/13PASS。

## 实际运行

自行写mech-uxi391-dualhost-b，LAN接对侧livegateway，发现对侧持有inflighttarget、启动 **自身host** node；区别于失败run的是 **真正ELIGIBLE才decline**，按feed candidates[index]映射检查而非从liveness推断。

## 结果

```text
[PASS] a target exists and is genuinely in flight on the other host - id=Q-43f3813a... owner=dualhost-node-a state=RUNNING
[PASS] before my node joins, the task offers no usable alternate - terms=["DEVICE_REFUSING"]
[PASS] my node becomes a SELECTABLE (eligible) alternate before I touch the decline
       - dto.state=WAITING_USER terms=["DEVICE_REFUSING","SELECTABLE","WAITING_USER"]
[PASS] the decline is accepted - status=200
[PASS] the SAME task id survives the transfer
[PASS] ownership moved TO my node and is recorded FROM the original owner
       - from=dualhost-node-a to=mech-review-b
[PASS] the guard bumped the epoch, so the previous holder cannot silently reclaim - epoch=2
[PASS] the task is re-queued for its new owner rather than left assigned to the dead one - state=QUEUED assigned=null
[PASS] NEG-A work reserved for one device is NOT taken by a different live device - assigned=mech-review-b
[PASS] NEG-B a duplicate decline does not re-transfer or bump the epoch - epoch 2 -> 2
[PASS] the transferred task COMPLETES on the new owner - state=COMPLETED
[PASS] the executor of record is MY node, not the device that died - assigned=mech-review-b
[PASS] the terminal result is present rather than null - result={"waitedMs":6000}
=== VERDICT: PASS (13/13) ===
```

全部13断言释义：对侧target真实RUNNING；加入前无usablealternate；自身node先SELECTABLE、WAITING_USER；decline200；sametaskid；from原holder/to自身nodeownership；epoch2防旧holder静默claim；QUEUED/assignednull供newowner；NEGA另live device不抢reservedwork；NEGBduplicateepoch2不变；newownerCOMPLETED；executor是自身node非死者；真实waitedMs6000非null。

## 两physicalhosts实测确立

- **Seam真实修复且跨host工作**，recordeddecline将dead-device work送另一物理machine、真terminalresult；sametask/fromto/epoch。
- **可测试双向singleexecutionguard**：第二自身device不可抢firstreservation；duplicate不转/增epoch。
- **Alternate/remote可达**，否定OwnerOPTION1旧designunreachable依据；eligible出现时WAITING_USER后REMOTE_HANDOFF。
- **Rootfix真实**：online/telemetrynode变SELECTABLE/PERMITTED，两consumers不再对同device分歧。

## 同时确认的历史finding：早run失败理由

PASS/FAIL差 **一步**，eligible后才decline；同作者script早timeout，延迟至eligibility便pass。结合live机制onlyswitch-declined消费、之后不重评，原历史defect说：

**POST瞬间无alternate，recordedintent可静默丢弃，dead-device taskstranded无人retry**。实测数分钟后RUNNING/deadassigned/switchDeclinedtrue/progress54/无handoff。此历史描述后来被withdraw及re-establishment精炼，本读本保持本报告原意。

不是guard批评，全程正确；fragiletrigger，作者B启动即decline、memory可使cpu-nulltelemetryassert通过。

## 本review仍欠

- Partialload尚未独立作者fixture验证。
- POST_COMPLETION_REENTRY未观察实际发生。
- Web UI原surface resultreturn未由我测，作者backend证、UI曾欠。
- 自己在作者gateway造成的strandedreservation，可用新eligiblenode加decline恢复，具名非静默整理。

## 证据

evidence/raw/mission-book/UXI391/review-by-mech/dualhost-b-by-mech.json自身receipt，target/nodes/fromto/epoch/finalstate/result/全部断言。
