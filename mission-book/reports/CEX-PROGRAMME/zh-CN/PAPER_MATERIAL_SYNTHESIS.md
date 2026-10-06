# CEX 项目组 — 论文材料综合

> 阅读译本 / Reading translation：本文件仅供中文阅读，不是第二份权威工作书／状态。原元数据、量测与命令记录保留代码围栏；不将历史未观测值升级。
>
> 按工作书要求由CEX-790生成，汇总五项入口工作书及本机执行的对侧主机评审。下面每个数值可追到具名产物，均不从摘要推断。

项目组为CAPABILITY_ENTRY_CLOSEOUT（CEX701至705，由790审计），基线为依赖联合，审计证据为utopia清单JSON／人类矩阵，评审证据为五份REVIEW_REPORT。

```text
PROGRAMME           CAPABILITY_ENTRY_CLOSEOUT (CEX-701 … CEX-705, audited by CEX-790)
AUDIT BASELINE      dependency union 5c7d46dcbf1b01259b5edaf574b620714beb40b7
AUDIT EVIDENCE      utopia:evidence/raw/mission-book/CEX-790/capability-inventory.json
                    utopia:evidence/raw/mission-book/CEX-790/CAPABILITY_ENTRY_INVENTORY.md
REVIEW EVIDENCE     mission-book/reports/CEX-70{1..5}/REVIEW_REPORT.md
```

## 1. 隐藏能力数量

```text
audit items total                                 145
EXPOSED                                           109
EXPOSED_ADVANCED                                    1
INTERNAL_PROTOCOL                                  24
CURRENT_ENTRY_GAP                                   8   (after curation: 5 registry gaps, 2 parity, 1 by design)
PARITY_GAP                                          3   (after curation: 2 real, 1 false positive)
registry records before the audit                  11
registry records after the audit                   12   (+ CAP-CAPABILITY-BRIDGE-001)
registry reality mismatches found                   1   (CAP-WORKER-POOL-AGENT-001)
```

中文对应：总145；EXPOSED109、EXPOSED_ADVANCED1、INTERNAL_PROTOCOL24、CURRENT_ENTRY_GAP8（审定为5注册缺口、2对等、1按设计）、PARITY_GAP3（审定为2真实、1假阳性）；审计前Registry11，后12（新增CAP-CAPABILITY-BRIDGE-001）；现实不匹配1（CAP-WORKER-POOL-AGENT-001）。

最终审计发现的一项**隐藏能力**是能力桥调用界面：Web／Android Services均用户可达，但无能力记录命名。隐藏指Registry意义，不是产品意义；UI存在，Registry不知。

## 2. 缺口分类：每审计项一个类型

```text
REGISTRY_GAP             5   user-reachable surface with no capability record            (capability bridge)
PARITY_GAP               2   first-class surface on one platform only, by design         (host PRIMARY/MEMBER switch)
CURRENT_ENTRY_GAP        1   deliberately unwired control                                (generic CONFIRM)
FALSE_POSITIVE           3   classifier blind spots, resolved to EXPOSED                  (ACTION_WIRING, "Action" page)
FUTURE_PRODUCT_INTEGRATION 0  no backlog capability was pulled into a first-class surface
DEPRECATED               0
```

中文对应：REGISTRY_GAP5为用户可达但无记录的能力桥；PARITY_GAP2为按设计只在一平台一级界面存在的host PRIMARY／MEMBER切换；CURRENT_ENTRY_GAP1为刻意未接线通用CONFIRM；FALSE_POSITIVE3为分类器盲点，ACTION_WIRING／Action页已转EXPOSED；FUTURE_PRODUCT_INTEGRATION0，没有把积压能力拉入一级界面；DEPRECATED0。

## 3. Web／Android 对等缺口数量

```text
workbook-declared parity gaps closed by the programme   6 of 6
  CEX-701 device recovery / rebind / clone surface      Web + Android
  CEX-702 alternate-device choice                       Web + Android
  CEX-703 capability catalogue                          Web + Android
  CEX-704 owner onboarding / admission                  Web + Android
  CEX-705 member management / messages                  Web + Android
  (counted from the routes the Android client calls, verified by the CEX-705 review PROBE 7)
remaining parity gaps after the audit                   2
  the host PRIMARY/MEMBER role switch is browser-only, by design
```

中文对应：工作书声明缺口关闭6／6。701设备恢复／重绑／克隆、702替代设备选择、703能力目录、704Owner入城／准入、705成员管理／消息均Web＋Android；数量来自Android实际调用路由，由705评审PROBE7验证。审计后剩2：主机PRIMARY／MEMBER角色切换按设计仅浏览器。

## 4. 开发发现与评审发现的缺陷

```text
BY DEVELOPMENT (retained in each workbook's failures list, not hidden)
  CEX-701  projection/model red; malformed enrolment red; same installation with wrong device red
  CEX-702  replay false-acceptance red; missing locale; navigation ticket invalidation
  CEX-703  missing parser red; layout failure beside availability; extra QR credential field red
  CEX-704  frozen harness clock INVALID; device CTRL+A input failure; share policy block
  CEX-705  projection missing model red; other-City/malformed enrolment red; malformed population red

BY OPPOSITE-HOST REVIEW (this host)
  CEX-701  F5 MEDIUM  aggregate "needs recovery" rendered as "this installation" (live city-scoped credential)
  CEX-701  F1/F2 LOW  share-failure guidance overwritten by the poll; other-surface session is a dead end
  CEX-702  F1 LOW     the workbook's mandatory handoff latency was left NOT_OBSERVABLE; measured by the review
  CEX-703  F1 MEDIUM  the Android availability chip ignores `mutating`, so a locally mutating target reads SAFE
  CEX-704  F1 LOW     the share-failure guidance is erased by the 2-second poll
  CEX-705  F1 MEDIUM  the member projection reports an offline node as connected; the same row says computeOnline false
  ALL      control-plane: 14–21 template frontmatter fields were absent from every one of the five workbooks
```

中文逐项对应：开发失败保留于每工作书失败清单，不隐藏。701投影／模型红色、畸形enrolment红色、相同installation错误device红色；702回放错误接受红色、缺locale、导航票据失效；703缺parser红色、availability旁布局失败、额外QR凭据字段红色；704冻结harness时钟INVALID、设备CTRL+A输入失败、share策略阻塞；705投影缺模型红色、其他City／畸形enrolment红色、畸形population红色。

本机对侧评审：701 F5 MEDIUM将聚合“需要恢复”渲染为“本installation”（活跃city范围凭据）；701 F1／F2 LOW分享失败引导被轮询覆盖、其他界面会话死路；702 F1 LOW必需handoff延迟留NOT_OBSERVABLE，评审测得；703 F1 MEDIUM Android可用性chip忽略mutating，本地正在修改目标显示SAFE；704 F1 LOW分享失败引导被2秒轮询清除；705 F1 MEDIUM投影将离线节点报告为connected，同一行computeOnline false；五工作书均缺14–21个模板frontmatter字段。

评审发现**三项**MEDIUM，**没有**评审改变结论：五项均释放终端标记，发现记录并按明确决定留未修复。

## 5. 值得继承的失败与修复

```text
an audit's instruments fail before its subject does
  The CEX-790 classifier first read the capability registry from the IMPLEMENTATION repo instead of the control plane,
  so eleven registered capabilities looked unregistered; and its route patterns lost the /api/v0/ prefix. Both would
  have produced a confident, wrong audit. Recorded in the development report.

a union of accepted work is not free
  Five accepted heads do not merge: an octopus merge fails on MainActivity.kt and a hand resolution twice dropped a
  function while editing a conflict block. The per-task symbol check caught it. The union was then validated by the
  five suites, the 154-test regression set, the bilingual gate and an Android build.

a reviewed head can still carry a stale verdict
  CAP-WORKER-POOL-AGENT-001 declared a pending Formal Review after WBC-603 had passed and released its marker.

a mandatory measurement left null three times
  handoff latency (CEX-702), approval latency and parity-gap count (CEX-704), message latency and parity-gap count
  (CEX-705) were all recorded NOT_OBSERVABLE in receipts even though each task's own fixture could measure them. The
  reviews measured them instead: 13 ms click-to-handoff, 8–11 ms approval round trip, 6–9 ms message delivery.
```

中文逐项对应：审计仪器比对象先失败——790分类器先从IMPLEMENTATION仓库而非控制平面读Registry，11已注册能力看似未注册；路由丢/api/v0/前缀，两者会产自信错误审计，已记开发报告。已接受工作的联合不是免费——五头octopus在MainActivity失败，手动解决两次丢函数，逐任务符号检查抓住；随后五套件、154回归、双语门禁、Android构建验证。已审头仍可带过期结论——CAP-WORKER-POOL-AGENT-001在WBC603通过并释放标记后仍称待Formal Review。必需测量三次留null——702handoff、704批准延迟／对等缺口数、705消息延迟／对等缺口数，回执全NOT_OBSERVABLE，尽管自身fixture可测；评审测得点击到handoff13 ms、批准往返8–11 ms、消息交付6–9 ms。

## 6. 用户步骤前后

```text
CEX-701  before: Settings dropped cloneFindings entirely; recovery had no UI
         after:  owner sees the typed conflict, selects the device, confirms — counted in the review at 2 interactions
CEX-702  before: no alternate-device action existed anywhere
         after:  1 navigation + 1 click (the author's own index), confirmed by the review in a real browser
CEX-703  before: capabilities were discoverable only AFTER a failed Ask (baseline terminal.js fetched targets only on
                 UNMATCHED, and the Android branch additionally required a click)
         after:  exactly 2 interactions with ZERO Ask submissions, measured by the review in a real browser
CEX-704  before: Android could only join; owner actions existed on Web only
         after:  generate / share / approve / reject reachable from 更多 → 配对, verified on the handset
CEX-705  before: City name, installations, revoke, roles, sharing and messages were Web-only
         after:  both surfaces; the review verified 6 of 6 listed features reachable from the Android routes
```

中文逐项对应：701此前Settings完全丢cloneFindings，恢复无UI；之后Owner看类型化冲突、选设备、确认，评审数2交互。702此前无替代设备动作；之后1导航＋1点击（作者索引），真实浏览器评审确认。703此前只有Ask失败后可发现能力，baseline terminal.js仅UNMATCHED抓targets，Android还要点击；之后精确2交互且ZERO Ask，真实浏览器测量。704此前Android只能加入，Owner动作仅Web；之后生成／分享／批准／拒绝可从更多→配对到达，手机验证。705此前City名、installations、撤销、角色、分享、消息仅Web；之后双界面，评审从Android路由验证6／6所列特征可达。

## 7. API → UI 字段丢失案例

```text
CEX-701  cloneFindings served by GET /device/installations and DROPPED by the Web Settings list — the defect the
         workbook's premise names; the fix surfaced the typed reason without the credential fingerprint.
CEX-702  the DTO carried no device labels, so provider rows rendered without a name; candidateLabels was added.
CEX-704  GET /pairing/info reports no short code at all, so the code a user reads on the handset cannot be checked
         against that route; the review proved the shown digits are canonical by consuming them from another client.
CEX-705  the credential fingerprint travels in every installations row while the record lists it as intentionally
         hidden; the withholding is presentation-only, the value is a sha256 handle.
CEX-790  the audit itself found the inverse case: a route family reachable from both UIs and named by no record.
```

中文逐项对应：701 GET/device/installations提供cloneFindings但Web Settings列表丢弃，正是工作书前提缺陷；修复显示类型化原因而非凭据指纹。702 DTO无设备标签，provider行无名，加入candidateLabels。704 GET/pairing/info根本不报告短码，不能用此路由核对手机数字；评审由另一客户端消费证明展示数字规范。705每installation行传凭据指纹，但记录称刻意隐藏；仅展示层隐藏，值为sha256句柄。790审计发现反向情况：双UI可达路由族无记录命名。

## 8. 调度器语义冲突

```text
CEX-702  provider choice / alternate device / keep waiting / cancel must not collapse into a generic CONFIRM.
         Verified: keep-waiting writes NOTHING at all (no switchDeclined, no event, no non-GET request), and generic
         CONFIRM stays rendered disabled with no route behind it. The audit classifies CONFIRM as CURRENT_ENTRY_GAP
         BY DESIGN, which is the honest state until a canonically identical route exists.
CEX-702  strict-target tasks must not offer a conflicting "use another device" button: verified, and the server
         refuses with TARGET_DEVICE_BOUND and mutates nothing.
```

中文逐项对应：702提供方选择／替代设备／继续等待／取消不可合成通用CONFIRM。已验证继续等待完全不写（无switchDeclined、事件、非GET），通用CONFIRM保持禁用无路由；审计归CURRENT_ENTRY_GAP BY DESIGN，在规范同语义路由存在前为诚实状态。strict-target任务不可提供冲突“使用另一设备”按钮，已验证；服务器TARGET_DEVICE_BOUND拒绝且零修改。

## 9. 真机发现（三工作书要求手机）

```text
CEX-704  10 scenarios on OPPO PERM00 (BICIPVNB5HS85H9T): generate with a canonical six-digit code and a QR bitmap,
         an ACTIVE session that never rotates (three independent proofs), the SYSTEM SHARE SHEET — which OPENS,
         CLOSING the author's declared NOT_RUN gap — consume by a second client with the device clearing its material,
         approve and reject both moving canonical truth, a 15 s TTL expiring without auto-generation, a double tap
         producing exactly one session, a code surviving background/resume, and the four legacy join controls intact.
CEX-705  9 scenarios on the same handset: owner reachability, owner rename, a session refused a rename in the UI AND
         at the server, self revoke clearing the credential from shared_prefs, cross-revoke refused on both sides,
         own-node sharing only, send/receive/receipt with a spoofed sender ignored, reconnect re-rendering canonical
         members, and a three-way Web/Android/canonical comparison. Crash and secret sweeps clean.
CEX-701  device work was the author's; the review verified the parser and contracts and read the Compose surface.
```

中文逐项对应：704 OPPO PERM00（BICIPVNB5HS85H9T）10场景：生成规范六位码与QR位图；ACTIVE会话不旋转（三独立证明）；SYSTEM SHARE SHEET实际OPENS，关闭作者NOT_RUN缺口；第二客户端消费、设备清除材料；批准／拒绝均修改规范真值；15 s TTL到期不自动生成；双击只一会话；后台／恢复码保留；四旧join控件完整。705同手机9场景：Owner可达、Owner改名、session改名在UI／服务器拒绝、自撤销清shared_prefs凭据、跨撤销双侧拒绝、仅自身节点分享、发送／接收／回执忽略伪造sender、重连重渲染规范members、Web／Android／规范三方比较；崩溃与秘密扫描干净。701设备工作为作者执行，评审验证parser／契约并读取Compose界面。

所有评审都不能关闭的一个缺口：**本机无第二实体手机**，故应用到应用消息及另一手机回执仍NOT_OBSERVED，作者索引也已如此记录。

## 10. 精确CI与测试数量

```text
CEX-701  CI 37206760171 / 37207112712 / 37207112720 all success   author 10/10  review 12/12  Android 84/84
CEX-702  CI 37213802935 / 37213840569 / 37213840571 all success   author  4/4   review 10/10  Android 82/82
CEX-703  CI 37222683667 / 37222688854 / 37222688771 all success   author  3/3   review  7/7   Android 80/80
CEX-704  CI 37216216410 / 37216246024 / 37216246022 all success   author  1/1   review 10/10  Android 84/84
CEX-705  CI 37218345150 / 37218364139 / 37218364132 all success   author  1/1   review  7/7   Android 87/87
CEX-790  union validation: five task suites 12/12, join/pairing/enrollment/gateway 154/154,
         check-bilingual SYNCHRONIZED, Android assembleDebug BUILD SUCCESSFUL 18 suites / 97 tests / 0 failures
```

中文对应：701三CI成功，作者10／10、评审12／12、Android84／84；702三成功，4／4、10／10、82／82；703三成功，3／3、7／7、80／80；704三成功，1／1、10／10、84／84；705三成功，1／1、7／7、87／87。精确运行ID逐行保留于上方。790联合验证五套件12／12、join／pairing／enrollment／gateway154／154，双语SYNCHRONIZED，Android assembleDebug BUILD SUCCESSFUL，18套件／97测试／0失败。

## 11. 本综合不作的主张

以上均不作新颖性、性能、自主生存或跨设备主张。延迟是单主机受控fixture。审计基线为依赖联合而非main；五头均未合并，无工作书授合并权威。终端 `CAPABILITY_ENTRY_BASELINE_AUDITED` 是评审结果，**不由开发释放**：工作书要求评审者独立从代码重建清单并比较两者，本机不能评审自身工作。

语言配对 / Language pair: [English](../PAPER_MATERIAL_SYNTHESIS.md) · [中文](./PAPER_MATERIAL_SYNTHESIS.md)
