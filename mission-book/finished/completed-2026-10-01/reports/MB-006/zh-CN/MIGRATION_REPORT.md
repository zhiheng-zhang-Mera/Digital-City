# MB-006迁移报告

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威任务状态。原元数据置代码块，所有保真失败、未迁范围及真实验证要求保持。

```text
MISSION = MB-006
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = 3bb6a1c3ea80781a4912b604d388b8bf7fa4b139
DONOR_BASELINE = zhiheng-zhang-Mera/dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd
IMPLEMENTATION_BRANCH = mission/MB-006-restart-recovery
IMPLEMENTATION_HEAD = 9584b98bd9f2bacad93274c74716281c7e0b2b1e
IMPLEMENTATION_CI = 36574888667 PASS (gateway-web + android)
MIGRATION_HEAD = dab820b37ff39d1581b19dd43e75771507fb7139
MIGRATION_CI = 36575418378 PASS (gateway-web + android)
MIGRATION_COMPLETE = true
```

implementation SHA为迁移；migration head加closing event commit，仅events.jsonl。两requiredCI绿。中间d5587756的36574760625/36574754834/36574753356绿，claim52946b69的36572337586绿。第4/5节为任务未定选择记录，第5最重要：困难是fidelity非port，测试先绿后review发现下列失败。

## 1. 落地边界

新building city/02-engineering/04-restart-recovery-station，既有工程区。

| 模块 | 冻结donor源 | 测试 |
|---|---|---|
| restart-protocol | shared/protocol.ts、types.ts、plugin/request-validator.ts |36 |
| restart-lock | plugin/restart-lock.ts |10 |
| checkpoint-gate | plugin/checkpoint-gate.ts |11 |
| restart-ticket | plugin/ticket-store.ts、atomic.ts |19 |

76新测试，四DONOR均路径/适配/差异/parity/四分类，UTOPIA_EXTENSION:[]。关键保donor结构：shared为词汇/canonicalJson/port contract唯一来源，plugin引用。protocol是shared，后三模块跨边界import不重声明；定义checksum函数及state vocabulary须唯一家。ticket digest由protocol canonical定义，替inline后重新核验`sha256:c12d61303692fea8ab4ab0f238efd78bbdb6554d6c154a2e587c5f07739185762`。

保留每向量有测试，完整DONOR：

- protocol版本及mode/priority/reason/request/lock/supervisor词汇；canonical精确JSON.stringify??null、array逐项、object丢undefined、a<b比较、无空白；14self reasons；validator原ladder/refusal/detail、MAX四界128/64/64/500、trim/control chars、priority及createdAt epoch默认、requestFingerprint。新donor transcription差分32801/0mismatch。
- lock六state、十一legal edges（36pairs），原illegal transition detail及REQUESTED需id；holder仅IDLE→REQUESTED设置、→IDLE清；heldForMs、requeststate映射、有界history丢最早、任非idle release及null no-op。
- gate unbound精确答案及acknowledgeResume、available；authorized=required?safe&&completed:true；非required且unsafe才加checkpoint-not-required suffix；throw→checkpoint_threw；timeout精确port/id/budget detail，timeout<=0无限。
- ticket checksum/build/verify原六ladder顺序及detail、无第七，emptyLedger。

明确未迁：restart-manager端到端编排、bin/supervisor/full heartbeat/pid/relaunch/crashloop/safemode、audit、config resolver/defaults；全部TicketStore及atomic/read/mtime/size I/O。仅ticket document迁移，原sibling temp→fsync→rename旧或新不混合atomicity作为DONOR及ATOMICITY_CONTRACT文档保留，storage未迁。health-scheduler bridge、Windows脚本、exit/signal/launch未迁。时钟默认未迁，ticket已有nowMs、两对象注入；lock默认fixedepoch0非Date.now为明确差异。

plainserializable纯函数无fs/network/env/Date.now/random，唯一ambient为gate setTimeout，donor也ambient，造fake-timer接口会新增，实际短budget测试。

真实消费既有server Web/Android task/control：restart sweep不inline state判，调用gate、策略数据。QUEUED未开始requiredfalse→授权保queued；已开始失work且无checkpointport，donor failclosed拒，同outcome/error/event。unbound同步回答timeout0。真实Gateway/store restarttest两分支及Core同policy判定，无新UI。

## 2. 测试运行

76模块；整套root59/59、rooms67/67、city206/206、promotion10、docs/evidence/data-records同步。真实消费gateway.test的post-restart resume decision owned by migrated checkpoint gate。三fidelity加一损坏literal记录TEST_FAIL MB-006:71ea239e0c6e2ac4；repair MB-006:a22d9f115d9943bb，见5；limits见6。

## 3. 演进交接

inbox data-records/evolution/inbox/mission-book/MB-006/events.jsonl。

| 事件 | 类型 | 结果 |
|---|---|---|
| MB-006:28d31927fea95493 |MISSION_CLAIMED |INFO |
| MB-006:0bc66c175382bd0d |ATTEMPT_STARTED |INFO |
| MB-006:a6f18c389c31fc58 |CHANGE_APPLIED |INFO |
| MB-006:71ea239e0c6e2ac4 |TEST_FAIL |FAIL |
| MB-006:336d28b3d853cfa6 |RUNTIME_PASS |PASS |
| MB-006:1c1e491fc1260a46 |TEST_PASS |PASS |
| MB-006:a22d9f115d9943bb |REPAIR_APPLIED |REPAIRED |

托管settle后追加CI_RESULT/MIGRATION_COMPLETE，上方head为追加前，仅加processdata。evidence/raw没发布。gitignore run001/WORKING_STATE为port前持久note含实测inventory。

## 4. 问题、选择、判断

D1跳MB004领MB006。MB004最低unclaimed却依MB003，其迁移完但验证开放未main，rule7必须latestmain起，当前会缺Gatewayadapter。书未定依赖何时满足；保守选artifacts在main才满足，004未领、006无依赖先领，否则Foreman不能真实消费依赖。代价004等第三host，003验证需非Alien。Cityindex记录免重复。

D2 shared须单层。首port ticket复制canonical、lock重声明两个vocab、gate重声明outcome。选protocol统一、其他import，镜像donor。checksum两copy漂移会使跨moduleticket不可验而value测试看不到。代价首次building内cross-import，双docs/DONOR记。identity assertion阻deepEqual复制偷偷回来。

D3 domain四模块制造虚unavailable-awaitingbridge，选capabilityProvider:false及validation/registry skip，与MB003字节相同。设施无功能，改count只留产品污染，代价D4。

D4三mission重复governance。001/003/006同c7ef3cd改manifest/census/docs；001districtkind infrastructure，003/006moduleflag。后两registry/manifest hunks字节同可clean，manifestbody/census/docs冲突。结构性任务设计非host问题；mergeorder/Owner才能解，第三例更急。建议泛化module、退休districtkind。

D5仅gate可不发明语义消费，其余parity落地未消费。protocol请求source/mode/priority/cooldown，Utopia command只type无映射，MIGRATION_ONLY禁造。lock无exclusive restart，最近每node一task无state/persist且不同语义。ticket另一process验文档，processes.json由PowerShell restart读且commandline非checksum；Node audit比barehex，而donor sha256:前缀，采用改变comparison非重接线。代价三/四无consumer，类似001一/四、003一/三，明确保留。

D6两gate分支真使用而非decorative：未开始requiredfalse授权，已开始requiredtrue+donor UnboundCheckpointPort明确cannotverify拒。failclosed是donor规则，不是wiring常量；消费机制非新屏。

D7 donor limits原意保留不顺便修：WAITING_FOR_EXIT无限deadline且无dirtyrestart；allowForceTerminate声明验证但从未consult，原docs/README引文在DONOR带line。另STOPPED声明无路径赋值、跨restart cooldown因内存不enforce。展示这些代码未迁，非ported行为声明，供后续勿默修称迁移。

D8 pnpm无PATH，corepack11.19.0；event -- --mission错、应无额外--；summary>1000exit2，本mission一个需缩重记；Node testdir不支持，命名/glob。

## 5. 测试绿后才发现保真缺陷

验证者应细读，每项原自身测试绿。

F1 verifyTicket加第七malformed rung及Array特判。donor恰missing/nonobjectmalformed/schema/checksum/expired/wrongpid六，hash收到内容，缺/改本已checksum。新rung改donor接受文件判定。删除，测试donor：extra覆盖checksum可验，missing旧checksum→checksum，重算后→expired；表证无第七码。

F2 buildTicket新增draftguard。donor不验，newDate.toISOString坏时刻自RangeError。删除guard，测试ttl0/negative/maxinstant仍build。原理由donor会null expiresAt事实错误，所有文件已删除。

F3 gate test断言自发leniency，缺required为null/empty替text。donor六outcome required，所有path齐全，shared严格constructor才忠实。现断言拒，positive unbound齐全答案构造/freeze/六members。DONOR说明为donor declaredtype failclosed重述，非donor实际执行行为。

F4 71字符digest写盘多一字符，两run不同字符串视觉同。查length/charcode发现、长度核验写修，suite pin71总/64hex，防截断padding。所有长literal共同hazard，guard廉价。

教训：绿色只证明tests同code，不证明code同donor；均靠原源对读捕获，修复删除port新增内容。

## 6. 已知限制

1. protocol/lock/ticket无consumer，若需四全消费则迁移未完成。
2. mechanism等价重接线非UI变化，任务禁发明。
3. 001/003/006merge冲突同manifest/census/docs双机制。
4. manager/supervisor/durablestorage未迁，只contract/lock/gate/ticket，不是可用restart。实际restart需迁manager/supervisor并保D7。
5. 两declared+两gap保：hung无限wait、force从不consult在donor，当前树根本无这些行为。
6. 验证需双host真实controlledrestart/relaunch，安全时复用donor reboot不得造。迁移host未试；验证host查可用安全路径，无则BLOCKED不得simulate。
7. CI记implementation，迁移host未main。

## 7. 验证交接

仅提示不建议结论。四DONOR各边界，protocol donorlimits、ticket verdictparity/atomicity。最高三修复：ticket sixrungs/no draftguard，gate严格outcome及DONOR，比较D:\dsh-restart-donor e20fb6cc而非report。server resumeGate/sweep及gatewaytests查D5/D6消费；registry/manifest查D3flag；ARCHITECTURE§7调和；crossimport查无第二vocab/checksum声明；manifest对001/003查D4冲突。

必须不同host，Alien参与不能verification。交接head `dab820b37ff39d1581b19dd43e75771507fb7139`，Utopia mission/MB-006-restart-recovery。implementation36574888667、final36575418378、claim36572337586 PASS。迁移host未merge未finalize。

语言配对 / Language pair: [原文 / Source](../MIGRATION_REPORT.md)
