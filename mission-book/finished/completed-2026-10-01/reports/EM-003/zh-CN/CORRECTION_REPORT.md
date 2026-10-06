# EM-003纠错报告——Engineering Job / Event / Result / Artifact协议

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威元数据或纠错记录。代码证据逐字保留，未验证边界不升级。

```text
MISSION              = EM-003 (Engineering Manager programme, task 3 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-003-job-result-artifact-protocol.md
CLAIM_COMMIT         = 975f7c7 (Digital-City main, claim of EM-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:30:15Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8c16cfc266a9869ace2c059f7959322282285663
DEVELOPMENT_CI       = 36721305141-success-both-required-jobs
CORRECTION_BRANCH    = engineering-manager/EM-003-job-result-artifact-protocol
CORRECTION_HEAD_SHA  = ffbdbce981d7dd5d8a556231e658f9cc522a31b9
BRANCH_CI            = 36731144219 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = EM-003 22 pass, root 123 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 8c16cfc2, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

任务为Engineering Manager第3/13项CORRECTION，Alien纠错、Mech开发；claim975f7c7、2026-09-30T14:30:15Z；组件基线/开发头/纠错full SHA及CI均原块保留。本地22 EM测试、root123、rooms69、city1801、promotion及双语同步。组件分支禁止merge，所以未合并；CORRECTION_COMPLETE:true。

## 1. 独立审查方法

两次review；任何审查前把被审版本导出至字节验证的不可变路径，指示reviewer只能import该export：

```text
D:\A-Utopia\.runtime\evidence\mission-book\EM-003\frozen-8c16cfc\contracts\engineering-job-v1\
  envelopes.mjs            match=True
  reconcile.mjs            match=True
  index.mjs                match=True
  tests/conformance.test.mjs match=True
```

envelopes/reconcile/index/conformance四文件match=True。第四次采用此隔离，再次有价值：reviewer最高严重D1作者未发现，当其仍审查时作者已push八缺陷修复。按机制而非报告者合并发现；共同机制一次命名，单方发现说明。用alien-verify-repair与repair2重放原复现共63全PASS，不只新regression。

## 2. 十三个确认缺陷，均修复

| ID | 发现者 | 严重性 | 机制 | 修复 |
|---|---|---|---|---|
| C1 | 双方 | high | key in spec接受Object.prototype名字 | own-key及Reflect.ownKeys |
| C2 | reviewer | high | record.state决定final，100%事件终态但result null | recorded result决定final |
| C3 | 作者 | high | applyEvent忽略job_version，旧incarnation操作当前job | STALE_JOB_VERSION |
| C4 | reviewer | med-high | 浅freeze，ref/ids/provenance可改 | deep freeze |
| C5 | 作者+reviewer | medium | result/artifact幂等仅caller指定ref | 比内容 |
| C6 | 双方 | medium | record可无result出生终态，无依据成功 | creation拒绝 |
| C7 | 作者 | low/med | duplicate无持久痕迹 | 记录一次、重放幂等 |
| C8 | 双方 | low/med | 验证前sort，裸TypeError | 先验batch shape |
| C9 | reviewer | low/med | changed_files/tests/controller_decisions无界 | 像兄弟字段有界 |
| C10 | reviewer | low/med | cyclic/deep裸RangeError | cycle-safe及迭代depth |
| C11 | 作者 | low/med | ISO只形态，不可能时刻合法 | calendar round-trip |
| C12 | reviewer | low | 非enumerable自有额外字段准入 | Reflect.ownKeys，归C1 |
| C13 | 作者 | low | DUPLICATE_EVENT却无审计 | 归C7 |

### C1 high——Object.prototype所有名字都变成契约字段

checkShape扫Object.keys却key in spec，冻结object literal沿prototype提供constructor/toString/valueOf/hasOwnProperty/isPrototypeOf/__proto__等12名字，每层接受；普通transport却拒绝。

```text
own key "constructor": admitJob.admitted=true errors=0
own key "transport"  : admitJob.admitted=false  (control)
nested result.git own "constructor"      -> validateResultEnvelope ok=true
nested event.source own "toString"       -> validateEventEnvelope ok=true
nested artifact.provenance own "valueOf" -> validateArtifactEnvelope ok=true
createJobRecord accepts it; record.job.constructor = {"rf":"STREAM"}
```

同七兄弟契约缺陷类，但孔在名字扫描而非value读取；presence用Object.hasOwn，继承值不能满足required，reviewer亦确认无prototype pollution。这是shape孔而非pollution。工作簿不允许RF envelope替代Engineering canonical；作者用非prototype的transport测试看似严密，但transport_neutral对12名字不成立。改Object.hasOwn(spec,key)，Reflect.ownKeys亦堵C12非enumerable。

### C2 high——终态宣布使无证据job最终化

reviewer发现，是作者所找失败的反向。100%事件合法可终态，工作簿仅禁partial结束；applyEvent设终态，applyResult随后按state拒绝诚实result。

```text
applyEvent(state=SUCCEEDED, progress_percent=100) -> record.state SUCCEEDED, record.result null
jobSummary -> is_terminal true, terminal_status null, acceptance null
applyResult(that record, the real result) -> TERMINAL_JOB_IS_FINAL: already succeeded with undefined
```

得到SUCCEEDED却无tests/acceptance/result且永不能登记，绕过result成功需证据规则。现record.result!==null才final：宣布展示terminal_status:null，真实result可入并决定终态；登记后final仍原语义。宣布SUCCEEDED而证据FAILED则记FAILED，证据胜宣布。

### C3 high——旧job版本事件操作当前job

applyEvent未比较version，只Math.max。sequence只在version内单调，旧版本较大sequence被用。

```text
record at job_version 2, state RUNNING
stale v1 event, sequence 9, state QUEUED  -> applied=true  -> state QUEUED  (walked backwards)
stale v1 event, sequence 10, state FAILED -> applied=true  -> state FAILED (running job terminated)
```

v2 RUNNING被v1 seq9 QUEUED倒退、seq10 FAILED结束。STALE_JOB_VERSION作为ignored decision非exception并记record，因reordering transport不应让replay像fault。reviewer独立否定相邻疑点：version无法倒退重新打开terminal，Math.max单调且先terminal检查；保留负结果。

### C4 med-high——只顶层不可变

Object.freeze留job/event_ids/artifacts/ignored_events可写；改job_ref接收别job事件；push event_ids假duplicate抑制真实事件；改artifact provenance.device_ref改变报告，破来源保证。createJobRecord/nextRecord使用cycle-safe deepFreeze，全部生成record每层冻结。

### C5 medium——ref而非内容决定幂等

applyResult仅result_ref，attachArtifact仅artifact_ref。

```text
applyResult(rewritten result, same result_ref) -> applied=false reason=DUPLICATE_RESULT
   (record keeps SUCCEEDED/PASS against a valid FAILED payload)
attachArtifact(changed artifact, same artifact_ref) -> applied=false reason=DUPLICATE_ARTIFACT
   (digest, kind and size differ; the envelope even carries the digest)
```

同ref改FAILED仍被DUPLICATE_RESULT，留SUCCEEDED/PASS；同artifact ref改digest/kind/size也被DUPLICATE_ARTIFACT。注释同result无操作、不同拒绝，却分不出。现比canonical content，同ref不同载荷TERMINAL_JOB_IS_FINAL/INVALID_ARTIFACT，detail说明非重放。

### C6 medium——无result可出生终态

双方从job envelope终态及event终态发现。create SUCCEEDED给is_terminal true、result_ref/terminal_status/acceptance全null，真实result不可用。admission表示开始，因此creation拒绝terminal；只有要求证据的result路径真正确定终态。

### C7/C13 low-med——duplicate无审计

模块声称ignored记why，但duplicate返原record，持久状态分不出一次/两次，late却记录。现duplicate及原因记一次；不能每次都记，否则record replay-sensitive。再应用严格no-op。

### C8 low-med——验证前sort

reconcileEvents先left.sequence，null抛裸TypeError，只2+元素才出现，单元素看正常，故作者首probe漏而reviewer发现。

```text
reconcileEvents(record, [null])        -> EngineeringJobError INVALID_EVENT
reconcileEvents(record, [null, null])  -> TypeError: Cannot read properties of null (reading 'sequence')
```

现先验batch、error指出index，comparator total，相同id比相等而非双向1。

### C9 low-med——三个result数组无界

warnings32、evidence_refs64、context_refs64、operations64，changed_files/tests/controller_decisions却5000各ok并全存。现共同objectArray双侧guard，分别256/128/32，与textArray一致。

### C10 low-med——循环/深envelope栈溢出

findRawSecretFields递归攻击者数据，没visited/depth，cyclic admitJob裸RangeError Maximum call stack size exceeded。现WeakSet cycle-safe，四validator均迭代envelopeDepthExceeded，MAX_ENVELOPE_DEPTH32。迭代避免检查自身overflow，正常error channel报告而非吞掉。

### C11 low-med——ISO只查拼写

同先修RF003 D1及GAI002 C7。2026-13-45T99:99:99Z regex过却NaN，2026-02-30T00:00:00.000Z静默March2。现calendar round-trip。这里无ordering/freshness依赖，影响是接受不可能timestamp，不夸大为stale-state。

## 3. 调和reviewer声明

- D1接受修复，为作者未发现最强项，按record.result gate建议实施。
- D3接受deep freeze。
- D9同作者C7/C13，只修一次。
- D4 Object.keys与Object.hasOwn不一致接受，用Reflect.ownKeys统一。
- 被证伪疑点按原文保留为负结果，避免后续重复：prototype名key在value路径修前证伪，own enumerable拒绝、non-enumerable structuredClone丢弃；继承值满足required；undefined与null碰撞；equal-sequence不确定；job_version重开；jobSummary泄露mutable view。
- Claim2仍成立，reviewer找NaN/undefined/100.5等partial变terminal无结果；Claim1成立，Claim5对诚实输入成立，不让merge workbook误说保证失败。

## 4. 刻意不修及边界

1. 无result宣布终态可持续。C2后100%event终态且result不来仍terminal/result null，summary terminal_status及result_ref null可见。作者D7允许full-progress terminal；全面拒绝超工作簿“partial不终态”边界且破合法shape，留Owner。
2. ignored_events/event_ids计数仍无界，既存，限制会改工作簿审计shape，记不修。
3. secret scan查key形态非value，benign key下raw secret不检；开发只声明secret-shaped field refusal，value scan属开发范围。
4. 保_id/_ref豁免，password_id不flag；与GAI002跨契约一致，其为Owner明确carry-forward。
5. 无新thrown code。同ref改result用TERMINAL_JOB_IS_FINAL detail，artifact用INVALID_ARTIFACT，STALE_JOB_VERSION仅ignored reason非exception；加行为不加抛出词汇。
6. 无真实RF transport/cross-device，未端到端信任/传输，仅envelope guard测试。按工作簿typed pending seam，不当成功。

## 5. 测试与CI

作者9/9原样通过，无测试编码缺陷无需改。套件9→22，每负断言配合法邻居：constructor拒绝/clean准入；announced非final/result final；stale ignored/current applies；cyclic拒绝/shallow准入；257files拒绝/256接受。重放原复现repair32/32、repair2 31/31。

```text
node --test tests/*.test.mjs                -> 123 pass, 0 fail  (101 baseline + 22)
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 8c16cfc2)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

本地root123=101baseline+22，rooms69，city1801/0fail/7skip，promotion10记录at8c16cfc2，三双语同步。实现CI36731144219在engineering-manager/EM-003-job-result-artifact-protocol @ffbdbce，gateway-web及Androidsuccess。

## 6. 未明定决策：问题/选择/理由

1. 旧incarnation throw/静默drop/记理由？选择STALE_JOB_VERSION ignored记record，因工作簿reconcile容忍transport乱序，throw会误成runtimefault。
2. state还是result最终化？选已记录result；SUCCEEDED需acceptance PASS规则附result，event只是宣布。stategate曾无证据终态且永久丢证据，所以不能gate。
3. 改result为何旧TERMINAL_JOB_IS_FINAL非新码：job确已final，问题不是recorded payload replay，detail明说，无新词汇。
4. duplicate只记一次使审计可见重放且再应用不改record，两目标兼得。
5. 256/128/32未明限，选同既有64/32风格宽上限，要求双侧bound而非具体数，export供Owner裁定。
6. depth32深于canonical需要，扫描攻击者数据须限depth；迭代自身不溢出，递归bound可能溢出。
7. deep freeze比defensive copies：copy仍使持ref caller修改live record，freeze消缺陷类而非实例。
8. 未Android/Computer-Use观察，工作簿如验收需允许，但纯protocol无device界面，没观察没启动Studio，保授权已授事实。
9. admitJob仍宽容terminal文档，createJobRecord拒绝terminal，因为document可描述完成job，而record出生为开始。

## 7. 诚实记录作者错误

- probe1用单元素malformed batch，不调用sort，险误不可复现；probe2两元素确认，reviewer独立发现。
- 完全漏C2，发现修C6出生终态后停早一步，没测validator合法event变体。
- 加array bound时删VERSION spec插两无意义constant，node --check因语法合法没发现，runtime会失败；同turn、任何test前恢复。记录语法检查抓不到的滑误。
- pool scanner !row.dev对NOT_STARTED字符串false，低估未领取开发；首扫因Mech PowerShell BOM漏六工作簿。均修，scanner对不可达warn不静默丢。
- notes把RF003 merge key列141，冻结实际139，已改notes。

## 8. 结果

13机制缺陷全部修复，paired regression及原复现重放。未缩测试关闭缺陷、未改作者测试；第4节五候选修复/边界刻意不做并记录理由。任务无需设备观察，实际没有。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/engineering-manager/EM-003-job-result-artifact-protocol.md
```

原记录CORRECTION_COMPLETE:true，control book已更新。

语言配对 / Language pair: [原文 / Source](../CORRECTION_REPORT.md)
