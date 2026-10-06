# MON-903 开发报告 — Mech

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；所有历史失败、旧头证据及后续纠正保留，元数据仅代码围栏引用。

```text
WORKBOOK            mission-book/city-work-monitor-dashboard/MON-903-event-triggered-decision-overlay.md
DEVELOPMENT HOST    Mech (COMPUTERNAME MEGA-REP), role Mech-DS
BRANCH              mon/MON-903-mech-decision-overlay
BASELINE (claim)    213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
                    DEPENDENCY_SHA_UNION_AT_CLAIM resolved literally: the accepted MON-901 head
                    7eb38f1b930dfe6cc13dab0e17dedee467b1254b is an ancestor of main, so the union IS main
DEPENDENCY SMOKE    node --test tests/mon901-observation.test.mjs -> 8 pass / 0 fail, before any product change
DEV HEAD            78bdd9dc873ebc257aedecf421068a1387dbec82
                    (head moved once after the first green CI: this task's own adversarial pass found D-7/M-1 and D-8/M-2
                     and both are repaired on this head)
CI (exact head)     V0.2 checks pull_request 37406286660 SUCCESS, City linkage 37406286695 SUCCESS, and push 37406282033
                    SUCCESS on RERUN after failing once on a load-sensitive browser timeout (D-9). All three read from
                    the Actions API and matched on headSha. Local full suite at this head: 1368 tests, 1363 pass; the 5
                    failures were first recorded as "inherited environment" and are CORRECTED here - 3 are this host's
                    resident-City host reservation (a genuine host condition) and 2 (capability-adapters, city-roads,
                    CORRUPT_INPUT) were this host's missing `city` install, not an environment property. See the
                    correction section of reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md.
PR                  zhiheng-zhang-Mera/utopia#32
REVIEW HOST         Alien — OUTSTANDING, not performed by this host
TERMINAL MARKER     none declared by this workbook; the workbook's completion gate is a nine-item list
MERGE AUTHORITY     false
```

开发主机Mech（MEGA-REP、Mech-DS），分支mon/MON-903-mech-decision-overlay；领取基线213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef，字面依赖联合为main，因为已接受MON-901头7eb38f1b930dfe6cc13dab0e17dedee467b1254b是main祖先。产品变更前依赖冒烟8/0。开发头78bdd9dc873ebc257aedecf421068a1387dbec82：首次绿色CI后自测发现并修复D-7/M-1、D-8/M-2而移动一次。

精确头PR37406286660及linkage37406286695 SUCCESS；push37406282033曾因负载敏感浏览器超时D-9失败，同头重跑SUCCESS，全部由Actions API匹配headSha。此头本地1368个1363通过，五失败最初称继承环境，此处纠正：三常驻城市预约是真主机条件，两capability-adapters/city-roads CORRUPT_INPUT是本机漏装city，不是环境性质；见reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md修正。PR32；作者阶段Alien审核未完成，本主机不执行；工作书没有声明终止标记，完成门为九项列表，merge_authority:false。

## 1. 实现内容

```text
services/dev-gateway/decision.mjs        the event-triggered decision overlay (rules, ladder, per-task queues, receipts)
services/dev-gateway/server.mjs          the overlay is created before the projection, notified from the canonical event
                                         path in one line, and exposed through three routes
services/dev-gateway/observation.mjs     the MON-901 projection's `decision` placeholder is filled from an injected,
                                         read-only decision snapshot (the sidecar still decides nothing)
apps/web/monitor-decisions.js            the Decision provenance page
docs/CITY_WORK_MONITOR_DECISIONS.md      bilingual summary of what it does and what it refuses to do
tests/mon903-decision.test.mjs           8 overlay probes
tests/mon903-decision-route.test.mjs     5 real-gateway probes
tests/mon903-decisions-web.test.mjs      2 browser probes
```

decision.mjs实现事件触发叠层（规则、阶梯、逐任务队列、收据）；server在投影前创建叠层，规范事件路径一行通知，并暴露三路由；observation以注入只读快照填MON-901 decision占位，sidecar仍不决策；Web Decision provenance页面；双语说明功能与拒绝事项；8叠层、5真实Gateway、2浏览器探针。

```text
GET  /api/v0/monitor/decisions          bounded decision window + metrics + the vocabularies
GET  /api/v0/monitor/decisions/<id>     one receipt
POST /api/v0/monitor/decisions          submit a trigger for a kind no canonical event expresses (owner only)
```

GET列表返回有界窗口、指标、词汇；GET/id读单收据；POST仅Owner提交无规范事件表达的触发类型。

## 2. 决策及理由（Owner规则：记录每个未指定选择）

| # | 问题 | 决定 | 理由 |
|---|---|---|---|
| D1 | 哪些事件触发 | 仅TRIGGER_SOURCES七规范类型，其余记录并忽略 | 事件而非报告触发，心跳／进度／完成／资源不得变审批 |
| D2 | 无BLOCKED规范状态 | TASK_TARGET_WAITING是阻塞规范表达；规则区分目标不在与在但仍等 | 虚构BLOCKED会造第二任务真相 |
| D3 | 审核就绪／重试请求／范围改变／合并门无规范源 | Owner路由明确提交，origin:SUBMITTED | 这些真实类型不能假装可观测，也不能丢工作书八类型中的四项 |
| D4 | 解析器输出 | 动作闭集、可选0..1置信度、≤120字符原因；其他无效 | 快速模型只给有界决策契约，自由长文不能作执行授权，代码执行 |
| D5 | 何时问模型 | 无规则时才问；有原因失败规则解决，规范记录无原因的不确定失败进入模型 | 否则所有触发规则可解、模型死代码，首版确有此缺陷 |
| D6 | Owner边界 | 范围／合并／审核／Owner候选直接升级，不问解析器 | Owner事项非推断问题，不许以自动批准扩大权限 |
| D7 | 决策是否行动 | 从不；只有任务读取器，收据appliedBy:null、application:RECORDED_ONLY | 不借自动审批扩权，不能把收据误作已行动，避免programme反复发现的虚假可操作性 |
| D8 | 队列 | 按任务、深度16、跨任务并行，规范路径不await observe | 禁城市全局屏障，带依据ABSENT_BY_CONSTRUCTION而非虚构零 |
| D9 | 置信度 | 规则confidence:null并给原因 | 确定规则非概率，数字会虚构测量 |
| D10 | 读与询问 | 成员可读，只有Owner可要求决策 | 读城市决策为团队事实，让城市表态是治理行为 |
| D11 | 界面位置 | 先独立Advanced页面，投影已带决策 | MON-902独立开发拥有City monitor面，后续折入只是呈现而非数据变更 |

## 3. 开发缺陷与发现方式

```text
D-1  RULE-LEVEL ESCALATIONS WERE RECORDED AS ORDINARY RESOLUTIONS. The non-boundary rule branch hardcoded
     `escalated: false` and dropped the rule's `escalationReason`, so REPEATED_FAILURE, RETRY_BUDGET_EXHAUSTED and
     TARGET_PRESENT_BUT_INELIGIBLE all arrived as `ownerRequired: false` with no reason - the opposite of what the rule
     layer had just decided. CAUGHT BY this task's own probe. REPAIRED: the branch honours the rule's escalation and
     records its reason.
D-2  THE MODEL STAGE WAS UNREACHABLE. Every trigger kind was resolvable by a rule, so the ladder's model and critic
     stages could never run - a seam that existed only in the comment. CAUGHT BY the probe that tried to exercise a
     resolver. REPAIRED: an ATTRIBUTABLE failure is rule-resolved while an UNEXPLAINED one (no cause in the canonical
     record) is genuinely uncertain and reaches the model, which is what "uncertain" was supposed to mean.
D-3  PROTOCOL COLLISION ON `schemaVersion`. The decision window carries its own `schemaVersion: 1`; spreading it flat
     into the response body overwrote the wire envelope's `schemaVersion: 0`, so every client rejected a 200 as a
     protocol mismatch - the browser probe saw "Decision records are unavailable" while the network log showed 200.
     CAUGHT BY the browser probe. REPAIRED: the window is nested (`body.window`), and the route test asserts both
     schema versions explicitly.
D-4  MEASUREMENT DEFECT (this task's own harness). The unit helper removed the receipt directory while a saturated
     per-task queue was still draining, and the suite reported ENOTEMPTY. The product was right; the harness raced it.
     REPAIRED: cleanup retries, the queue probe drains before teardown, and the drain result is asserted.
D-5  INSTRUMENT NOTE. `relay-s1-tunnel.test.mjs` failed once inside the full-suite run ("a sustained burst is refused
     with 429") and passes 12/12 in isolation; the same load-sensitive flake is recorded by the REX-804 author. It did
     not recur in the final full-suite run.
D-6  A BROKEN RECEIPT IS REPORTED, NOT FATAL - deliberately carried over from the REX-804 finding: this module reads
     its own receipts with a guard, publishes `broken`, and keeps serving. The probe asserts it, so the defect the
     opposite-host review found in a sibling module cannot reappear here.
D-7  AN UNUSABLE RECEIPT STORE PREVENTED THE CITY FROM STARTING (finding M-1). `createDecisionOverlay` called mkdirSync
     unguarded, so a single file sitting where `<runtime>/monitor/decisions` was supposed to be made `createGateway`
     throw with EEXIST and the City never bound its port. This is the SAME class as the REX-804 review's blocking
     finding B1 - a research-side storage problem turning into a City that will not boot - and this task's own
     adversarial pass found it in its own code one round after reviewing a sibling for it.
     CAUGHT BY  an adversarial self-test written for this round (a file at the store path), then pinned at the City
     level: the gateway must start and `/api/v0/monitor/decisions` must report `persistence: UNAVAILABLE` with a reason.
     REPAIRED: the store is created defensively; when it is unusable the overlay records decisions IN MEMORY, marks each
     one with `receiptFailure: DECISION_STORE_UNAVAILABLE`, serves them by id from the window, and reports the degraded
     state in `snapshot()` and `metrics()`. Two regression probes cover it (overlay level and City level).
D-8  A CLOSED OVERLAY BLAMED THE CALLER'S TRIGGER (finding M-2). Submitting after `close()` raised
     `DECISION_TRIGGER_INVALID`, which says the trigger was malformed when in fact the overlay was shutting down.
     CAUGHT BY  the same adversarial pass. REPAIRED: a distinct `DECISION_OVERLAY_CLOSED` with status 409, and a probe
     that asserts the code.
D-9  A LOAD-SENSITIVE BROWSER TEST FAILED THE PUSH CI ONCE (environment flake, not a product defect). On the hardened
     head the push run failed on `tests/pairing-search-web.test.mjs` -> "BLE_BOOTSTRAP search selects a peer and hands
     the code to its origin without a cross-origin POST" after 31.3s (its LAN sibling in the same file took 1.8s) while
     the PR run of the SAME head passed.
     EVIDENCE THAT IT IS THE ENVIRONMENT, not the change: the identical file passes 6/6 in isolation locally; the full
     local suite at that head is 1368 tests / 1363 pass, the failures being the host-reservation ones plus (as later
     corrected) two of this host's own missing-dependency failures rather than the "five inherited environment
     failures" first written here; the file is untouched by this task's diff (services/dev-gateway/decision.mjs and
     tests/mon903-decision.test.mjs only); and the rerun of the very job that failed COMPLETED SUCCESS on the identical
     head.
     RECORDED rather than cleaned away, and the workbook's CI field says so explicitly.
```

D-1 非边界规则分支硬编码escalated:false并丢原因，使REPEATED_FAILURE／RETRY_BUDGET_EXHAUSTED／TARGET_PRESENT_BUT_INELIGIBLE报ownerRequired:false，逆规则决定。自有探针发现，修复为遵循升级及原因。

D-2 所有类型均规则可解，模型／critic阶段不可达，接口只存在注释。尝试解析器探针发现；可归因失败规则解决，规范无原因的未解释失败真正不确定进入模型。

D-3 decision窗口schemaVersion1平铺覆盖信封0，全部客户端拒200协议不匹配；浏览器显示记录不可用而网络200。浏览器发现，改body.window嵌套，路由显式断言两版本。

D-4 自有测量夹具饱和队列排空时删收据目录，ENOTEMPTY；产品正确、夹具竞争。清理重试，队列拆卸前排空并断言结果。

D-5 relay-s1-tunnel全套一次“持续突发应429”失败，单独12/12；REX-804作者也记同负载不稳定，最终全套未再出现，属仪器说明。

D-6 损坏收据报告而不致命，有意继承REX-804发现：守卫读取、发布broken、继续服务，探针断言，使同系列相反主机发现不再此处重现。

D-7/M-1 createDecisionOverlay未守卫mkdirSync，runtime/monitor/decisions位置已有文件使createGateway EEXIST、城市不绑定端口。同REX-804审核B1研究存储阻塞启动同类，作者刚审核同系列后下一轮在自代码对抗发现。先文件路径自测，再城市级确认启动且API persistence:UNAVAILABLE带原因；修复防御建目录，不可用则内存记录、每收据receiptFailure:DECISION_STORE_UNAVAILABLE、按id从窗口读，snapshot/metrics报告降级，叠层＋城市两回归。

D-8/M-2 close后提交报DECISION_TRIGGER_INVALID，错误责怪触发格式而实际关停。同轮发现，改独立DECISION_OVERLAY_CLOSED/409并断言。

D-9 加固头push配对BLE浏览器一次31.3秒失败，同文件LAN1.8秒、同头PR成功。环境而非变更的证据：文件本地单独6/6；同头全套1368/1363，三预约加两后来纠正漏依赖，不能继续说五继承环境；此任务diff仅decision.mjs和mon903-decision测试未动失败文件；同头原失败作业重跑COMPLETED SUCCESS。失败保留，工作书CI显式说明。

## 3A. 本交付的对抗自测（2026-10-06，审核前）

相反主机审核仍待，本主机攻击审核首先关注部分。五探针：三性质成立、两缺陷已修复。

```text
HELD   a throwing canonical task reader is recorded as typed failures (DECISION_OBSERVE_FAILED, DECISION_RUN_FAILED,
       DECISION_UNHANDLED_REJECTION) and produces NO fabricated decision
HELD   retention bounds the receipt DIRECTORY as well as the window (6 decisions, limit 3 -> 3 files, truncated flag)
HELD   receipts survive a restart with identity intact, and remain readable by id
DEFECT M-1 (D-7) an unusable receipt store prevented City startup           -> repaired, two regression probes
DEFECT M-2 (D-8) a closed overlay reported the caller's trigger as invalid   -> repaired, one regression probe
```

成立：规范任务读取器抛错产生DECISION_OBSERVE_FAILED／DECISION_RUN_FAILED／DECISION_UNHANDLED_REJECTION类型失败，无虚构决策；retention同时约束目录和窗口，6决策限3→3文件及截断标记；重启后收据身份完整且按id可读。缺陷M-1存储阻启动，两个回归；M-2关闭误报触发，一回归。自测不是审核，只抬高审核底线；它让REX-804类型在本模块由自己而非相反主机发现。

## 4. 精确头测试证据

```text
node --test tests/mon903-decision.test.mjs          8 pass / 0 fail
node --test tests/mon903-decision-route.test.mjs    5 pass / 0 fail
node --test tests/mon903-decisions-web.test.mjs     2 pass / 0 fail
node --test tests/mon901-observation.test.mjs       8 pass / 0 fail   (dependency, unchanged)
npm test (whole tests/ glob)                     1365 tests: 1360 pass / 5 fail
```

叠层8/0、真实路由5/0、浏览器2/0、未变依赖8/0；历史全glob1365个1360通过5失败。

```text
capability-adapters.test.mjs  CORRUPT_INPUT in a document reader  -> reproduced identically at the baseline 213f9f9f
city-roads.test.mjs           CORRUPT_INPUT in a document reader  -> reproduced identically at the baseline 213f9f9f
host-city-launcher.test.mjs   x3 "requires a free coordination port" -> the resident City holds the host reservation
CLASSIFICATION  ENVIRONMENT / PRE-EXISTING  (not product defects, not measurement defects of this task)
```

此历史段最初将五项同REX-803归为ENVIRONMENT/PRE-EXISTING：两文档读取CORRUPT_INPUT在基线213f9f9f同样出现，三host-city-launcher因常驻城市预约／协调端口。保留原始分类及代码证据；开头明确后续两项是本主机漏装city依赖，不能由稳定基线失败推成环境性质。原文当时“不属本任务产品／测量缺陷”的历史说明不替代修正。

## 5. 逐项完成门

```text
event-triggered rather than report-triggered   MET   seven canonical sources; a probe asserts heartbeat/progress/
                                                     completion/resource/connect produce ZERO decisions
per-task queue                                 MET   keyed by task, depth-bounded, asserted
rule-first                                     MET   asserted by counting resolver invocations (0 for a rule case)
bounded decision receipt                       MET   the workbook's field list is asserted field by field
timeout/fallback                               MET   hanging, throwing, free-text and invalid resolvers each become a
                                                     typed fallback that escalates
user-visible provenance                        MET   the Decision provenance page; a browser probe opens it and reads
                                                     the pre/post state, the evidence pointer and "Applied by: nobody"
no-global-barrier evidence                     MET   structural (no lock anywhere) + a probe showing two tasks decided
                                                     in parallel + a real-gateway probe where an unrelated task
                                                     completes while another task's decision is being made
exact-head tests/CI                            MET  15 local probes green and hosted V0.2 checks 37401385199
                                                     COMPLETED SUCCESS on the exact head 1d1593df9f3370711
                                                     df7fbb735fb2ccb393e7494, re-read from the Actions API
opposite-host review                           PENDING  review_host must be Alien; not performed by this host
PAPER_MATERIAL_INDEX                           MET   mission-book/reports/MON-903/PAPER_MATERIAL_INDEX.md
```

事件而非报告触发MET：七源，心跳／进度／完成／资源／连接零决策；逐任务有界队列MET；规则优先调用次数0 MET；有界收据逐字段MET；挂起／抛错／自由文／无效解析器均类型回退升级MET；来源可见MET：浏览器读取前后状态、证据指针、无人应用；无全局屏障MET：无锁结构＋双任务并行＋真实Gateway另一任务完成；精确头测试CI历史MET，15本地及37401385199在1d1593df9f3370711df7fbb735fb2ccb393e7494成功并API回读。相反Alien审核PENDING本机不执行，素材索引MET。以上保留历史门记录，不把旧头结果提升为当前头证明。

## 6. 交给审核者的开放项

```text
O1  Opposite-host Formal Review outstanding. Points worth attacking: the trigger classification (is anything missing
    or wrongly included?), the "no barrier" claim, whether a decision can ever mutate state through any path, the
    receipt contract, and whether the metrics could flatter the reader.
O2  No resolver is configured in this City, so every uncertain case reaches the owner with RESOLVER_NOT_CONFIGURED.
    That is the honest production behaviour; a reviewer with a fixture resolver should confirm the bounded contract.
O3  `wrong auto-decision and repair` and `confidence versus final review outcome` are reported as unsupported: both
    need an independent judge, which this overlay cannot be.
O4  RESOLVED before hand-off: hosted CI is terminal SUCCESS on the exact head (run 37401385199), and the PR is #32.
F1  FINDING (recorded, not repaired): the canonical vocabulary has no BLOCKED task state and no review/merge event, so
    three of the eight trigger kinds (BLOCKED, READY_FOR_REVIEW, MERGE_READY) are expressed indirectly or must be
    submitted. A reviewer should decide whether that belongs in this workbook or in a later one.
F2  FINDING: the overlay's per-task queue is bounded at 16 and a full queue escalates immediately. The bound is a
    choice, not a measurement; no production queue depth has been observed yet.
F3  FINDING for MON-990: the decision window is surfaced on its own page today because the City monitor page belongs to
    MON-902, which is developed but not yet merged. Integration is a presentation change only.
MERGE AUTHORITY  false — this host does not merge MON-903.
```

O1 相反主机正式审核未完，应攻击触发是否缺／误含、无屏障、任何路径是否可变状态、收据契约及指标是否讨好读者。

O2 此城市未配解析器，所有不确定情况以RESOLVER_NOT_CONFIGURED升级Owner，这是诚实生产行为；审核者可用夹具验证有界契约。

O3 错误自动决策及修复、置信度对最终审核结果均unsupported，需独立裁判，叠层不能自判。

O4 交接前已解决：历史精确头托管CI37401385199终态成功，PR32。

F1 发现未修复：无BLOCKED规范状态及review/merge事件，八触发中的BLOCKED、READY_FOR_REVIEW、MERGE_READY三种间接表达或须提交；审核决定属本工作书还是以后。

F2 队列限16，满立即升级；这是选择不是测量，尚未观测生产深度。

F3 MON-990项：窗口先独立页面，City monitor属于已开发未合的MON-902，集成仅呈现变更。merge_authority:false，本机不合MON-903。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
