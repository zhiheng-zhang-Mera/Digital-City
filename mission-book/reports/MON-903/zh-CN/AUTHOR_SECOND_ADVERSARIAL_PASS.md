# MON-903 — 作者第二次对抗检查（Mech，2026-10-06）

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留作者自测与相反主机审核的边界，元数据仅代码围栏引用。

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for MON-903
TARGET              the author's own development head 78bdd9dc873ebc257aedecf421068a1387dbec82 — UNCHANGED
BRANCH              repair/MON-903-mech-honest-metrics @ 6ecc6f3cd4b6d3dd1df32d0cba2c27e49098cdaa
                    (parent = 78bdd9d, two commits: probes alone, then the repair)
WHAT THIS IS        an AUTHOR SELF-TEST. It is not review evidence, it does not replace the opposite host's
                    verdict, and it releases no marker. The reviewer's claim at 78bdd9d is preserved exactly:
                    the workbook is untouched and the head did not move.
WHY IT EXISTS       the opposite-host review of the SIBLING task MON-902 reproduced seven defects in code by the
                    same author in the same programme. This programme has now recorded four times that a defect
                    found by review does not propagate to its siblings unless somebody deliberately looks. So
                    the classes were re-probed here on purpose.
```

作者 Mech（MEGA-REP、Mech-DS）自测未改变目标开发头78bdd9dc873ebc257aedecf421068a1387dbec82。repair/MON-903-mech-honest-metrics 在6ecc6f3cd4b6d3dd1df32d0cba2c27e49098cdaa，父为78bdd9d，先探针后修复两提交。这是作者自测，不是审核证据、不取代相反主机裁决、不发布标记。审核领取目标及工作书未动。同作者同programme的MON-902相反主机审核重现七缺陷；programme已四次记录已知缺陷不会自动传播至同系列，故有意重测相同类型。

## 1. 继承的类型及发现

类型来自作者对MON-902审核的总结（reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md第5节）。每探针说明失败含义，修复前记录红色运行：

```text
red run on 78bdd9d (probes only)     tests 6   pass 1   fail 5
```

六测试1通过5失败。

| 类型 | 发现 | 78bdd9d实测症状 |
|---|---|---|
| L1 截断数据当完整 | F-S1 有界失败日志 | 记录24失败，snapshot.failures只有16；唯一失败键failures，无丢弃数。metrics.resolverFailures同样静默16；安静与损坏叠层呈相同负载 |
| L3 未测数字 | F-S2 队列满拒绝 | per-task上限拒绝的DECISION_QUEUE_FULL发布decisionLatencyMs:0，但decide从未运行；同MON-902虚构worstSteps:2下一轮异模块同类 |
| L1 | F-S3 指标面 | 9决策、retentionLimit5，metrics.decisions仅5，无retainedLimit／retentionTruncated／窗口说明。snapshot却披露retained5 limit5 truncatedtrue；标题自动解决率把截断样本说成全部 |
| L1 | F-S4 发布窗口 | firstSeq10,lastSeq100来自恰好触发的两事件，不说明且无规范高水位，看似规范流连续跨度 |
| L4 仅良构输入 | F-S2 UI部分 | 决策表未守卫decisionLatencyMs，单改模块会空单元格；用可达负载渲染真实组件才发现 |

## 2. 修复与提交顺序

```text
COMMIT 1  test(mon903): the six probes, added BEFORE the fix        -> red run 1 pass / 5 fail, recorded
COMMIT 2  fix(mon903): report truncated and unmeasured data         -> green run 6 pass / 0 fail
```

第一提交先加六探针，记录1通过5失败；第二修复，6通过0失败。顺序很重要：programme曾记录坏树上通过的回归探针（重复症状而非缺陷），也记录表宣称比实际多两陷阱的扫描。未见失败的探针不构成证据，因此红色运行属于历史而非仅宣称。

```text
services/dev-gateway/decision.mjs
  failuresDropped counts what the bounded log discarded; published by snapshot() and metrics()
  the queue-full receipt carries decisionLatencyMs: null + decisionLatencyReason, and no longer claims 0
  metrics() publishes retained / retainedLimit / retentionTruncated / windowNote, and latencySamples plus
  latencyNotObservable so the mean cannot hide how many decisions it excluded
  window states it spans TRIGGER events, counts observed and trigger events, and names the canonical
  high-water mark as NOT_OBSERVABLE with the reason rather than omitting the field
apps/web/monitor-decisions.js
  the latency and queue-wait cells render NOT_MEASURED when the value is not a finite number
  the panel raises the truncation note beside the rate, and the dropped count beside the failure list
apps/web/i18n/{en,zh-CN}.js
  one new key (dec.failuresDropped) in both packs; check-bilingual reports every pair SYNCHRONIZED
```

decision.mjs：failuresDropped计有界日志丢弃并由snapshot/metrics发布；队列满收据延迟null并带decisionLatencyReason，不再声称0；metrics披露retained／retainedLimit／retentionTruncated／windowNote以及latencySamples／latencyNotObservable，均值不隐藏排除数量；window明确跨度是TRIGGER事件、计算观测及触发数，并以NOT_OBSERVABLE及原因命名规范高水位而非省字段。monitor-decisions.js 非有限延迟和等待显示NOT_MEASURED，率旁显示截断说明、失败列表旁显示丢弃数。两语言各新增dec.failuresDropped，双语检查全部SYNCHRONIZED。

## 3. 测量

```text
NEW PROBES       6/6 on the repair; the same 6 give 1 pass / 5 fail on 78bdd9d (recorded above)
MON-903 + MON-901 suites   24/24
web-i18n + decision panel   9/9
decisions browser suite     2/2
full suite       1371/1374   the 3 failures being this host's resident-City host reservation, which is a real
                             property of this host and not of the change
CI (exact head)  V0.2 checks push run 37416035100 COMPLETED SUCCESS (attempt 1) on 6ecc6f3, jobs gateway-web and
                 android both success; read per-run from the Actions API and matched on headSha
```

新探针修复6/6，同六在78bdd9d为1/5；MON-903＋901为24/24、双语＋决策面板9/9、浏览器2/2，全套1371/1374，三失败为本主机常驻城市预约，非变更性质。精确6ecc6f3头push37416035100第一次COMPLETED SUCCESS，gateway-web/android都成功，Actions API逐运行匹配headSha。全套采用本主机此前修正：曾另报的两失败是自己漏装city依赖，不是环境性质；此处先按ci.yml完成两安装再测。

## 4. 相反主机发现而本轮没发现的项目

检查期间审核者发布 [独立审核](./INDEPENDENT_REVIEW_Alien.md)。审核重现八红探针加轮询饥饿及Gateway Action两探针；本轮发现四项。集合几乎不相交，暴露本文倡导方法的局限。

| 审核者发现 | 本类型扫描是否检查 |
|---|---|
| OWNER_REQUIRED／AWAIT_OWNER_*误计自动解决，率错误而非未披露 | 否。本轮只查率是否披露窗口F-S3，不查率是否正确；同面审核发现更严重 |
| UUID排序删除任意收据而非最老 | 否。readdirSync/filter/sort按decision-随机UUID排序，注释却说oldest first；错误删除谓词不是虚假安全摘要或未测数，继承类型未指向它 |
| observe绕过close | 否，生命周期缺陷 |
| 队列满丢规范证据及持久失败 | 部分。本轮F-S2发现未测延迟，审核发现evidenceRefs和receiptFailure缺失 |
| 规范在线不合资格目标丢状态 | 否 |
| critic成功丢早先超时指标 | 否 |
| 轮询关闭打开的来源、保留恢复错误、不可用存储不可见、高频渲染饿死两秒轮询 | 否，生命周期／稳健性类型 |

记录教训是对本次反复依赖扫描方法的反证：类型驱动扫描只找给定类型，结构上只限这些。programme模块已有原套件、作者对抗、有意形态扫描、相反主机审核四种检查；形态扫描最便宜也最窄，是审核补充而非替代。替代者会持续说“全找到了”而审核者再找十项。

审核还拒绝绿色push作为充分条件，发现自己审核头PR因继承Services导航失败，修复、移头并保留失败运行。它比本扫描更重，理应如此。

## 5. 与审核头协调及可采纳合并

双方改同两函数，将本分支融合到审核分支，发布可直接采纳合并而非第二冲突分支：

```text
adoptable   repair/MON-903-mech-honest-metrics-on-review-head @ 10a020c3a02fd3c4be7b85ba8208313af71dcc0d
            base = review/MON-903-Alien-20261006 @ 5b71389   (the reviewer's latest)
            brings = repair/MON-903-mech-honest-metrics @ 6ecc6f3   (this pass, four findings + six probes)
CI          V0.2 checks push run 37416962184 COMPLETED SUCCESS (attempt 1), jobs android and gateway-web both success
LOCAL       1386 tests, 1383 pass, 3 fail — all three this host's resident-City host reservation
```

可采纳repair/MON-903-mech-honest-metrics-on-review-head头10a020c3a02fd3c4be7b85ba8208313af71dcc0d，基于审核最新5b71389，带本轮6ecc6f3四发现六探针；push37416962184第一次成功，两作业成功；本地1386、1383通过、3主机预约失败。

发布前逐项核验“互补”：审核头拒绝行延迟仍0、noteFailure静默丢条、metrics无窗口披露、window仅firstSeq/lastSeq。联合保留双方意图：拒绝收据保留审核者evidenceRefs/receiptFailure并停止声称延迟；Owner分类修复与本轮窗口披露共存。作者仍未动工作书、头、审核领取及标记，审核目标不在其脚下移动，采纳由审核者决定。

## 6. 本主机核验采纳而非假设

审核者以合并本主机提交采纳，核验是结构性的而非仅看diff：

```text
reviewer's head   3cd32c60d8e9beb9df961e6b7ff193a3f69ec224  (review/MON-903-Alien-20261006)
its history       contains 10a020c (this host's merge), 6ecc6f3 (the repair) and aa371d6 (the probes)
field presence    failuresDropped, windowNote, TRIGGER_EVENTS, decisionLatencyReason, latencyNotObservable all present
rejected row      decisionLatencyMs: null + decisionLatencyReason, checked in the reviewer's own file
```

审核头3cd32c60d8e9beb9df961e6b7ff193a3f69ec224，历史含10a020c合并、6ecc6f3修复、aa371d6探针；五字段failuresDropped／windowNote／TRIGGER_EVENTS／decisionLatencyReason／latencyNotObservable都在，审核文件拒绝行延迟null且有原因。

审核者把根测试脚本改为node --test --test-concurrency=2 tests/*.test.mjs，称限制浏览器套件并发不丢检查。实际核验而非照读，因为CI静默跳测正是不易察觉缺陷：

```text
this host's merge branch  1386 tests  1383 pass  3 fail
reviewer's head 3cd32c6   1386 tests  1383 pass  3 fail
```

本合并和审核3cd32c6均1386个、1383通过、3失败，数量和失败相同，限并发没丢测试，两边三失败都为本机常驻城市预约。本主机曾记录浏览器断言只在全套负载失败、单独通过，限并发直接针对该仪器类型。

审核者随后接受该头，本主机如实记录结果：

```text
MON-903 workbook    status COMPLETE; review_complete true; review_status ACCEPTED
                    terminal marker MON903_DECISION_OVERLAY_REVIEW_ACCEPTED
                    capability registry FORMAL_REVIEW_RECONCILED
review head         3cd32c60d8e9beb9df961e6b7ff193a3f69ec224 — the head that contains this host's four findings
MON-990             unlocked by the acceptance and claimed by Alien, not by this host
```

工作书COMPLETE、review_complete true、ACCEPTED；终止标记MON903_DECISION_OVERLAY_REVIEW_ACCEPTED、注册FORMAL_REVIEW_RECONCILED；接受头含本主机四发现。MON-990由接受解锁并由Alien领取，而非本机。作者不据此声称自己审核：四发现贡献给相反主机运行、拥有并结束的审核；可窄义实测陈述的是提交在接受头且字段存在。

## 7. 本轮结束时任务池

```text
claimable development work for Mech                0
new programme surfaced this round                  deliberative-governance-expansion-migration (DGX-001..007, DGX-990)
DGX state                                          every workbook NOT_STARTED with execution_enabled: false
MON-990                                            unlocked by MON-903's acceptance, claimed by Alien on the
                                                   accepted exact dependency union
```

Mech可领取开发工作0；本轮出现DGX-001..007、DGX-990 deliberative-governance-expansion-migration，各工作书NOT_STARTED且execution_enabled:false。MON-990由MON-903接受解锁，Alien在精确接受依赖联合领取。DGX停放不供领取；programme激活须Owner把false改true，未启用不许任何主机领取。本轮未在其上构建，本主机未打开DGX文件。

## 8. 本检查改变与未改变内容

```text
CHANGES        nothing about MON-903's status, head, workbook, review claim or marker. The branch is published for
               adoption, exactly like the store-guard repairs, because moving the head under a claimed review would
               invalidate the reviewer's claim.
DOES NOT       count as review evidence, does not pre-empt or answer the opposite host's verdict, and does not claim
               the reviewer's own pass found any of these.
DEPENDS ON     nothing in the reviewer's branch; the four findings were measured on 78bdd9d from this host alone.
```

不改变MON-903状态／头／工作书／审核领取／标记。像存储守卫修复一样发布待采纳分支，移动已领取审核下的头会使其领取失效。不计审核证据、不预判或回答相反主机裁决、不声称审核者自己的检查发现这些。四项在78bdd9d由本机独立测得，不依赖审核分支。

值得保留的观测：四发现中F-S1／F-S2与刚在MON-902审核发现的同系列同类完全一致——有界样本说成完整、未测数字；MON-903自己的24/24套件修复前后都通过，无法发现。逐模块审核找到一例，逐类型探测持续找到其余。

语言配对 / Language pair: [English](../AUTHOR_SECOND_ADVERSARIAL_PASS.md) · [中文](./AUTHOR_SECOND_ADVERSARIAL_PASS.md)
