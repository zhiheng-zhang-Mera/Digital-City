# MON-990 对侧主机Formal Review — Mech

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史与未知边界，原证据块代码围栏保留，不新增验收。

Mech MEGA-REP与Alien MERA-ALIANWARE异实体。exact fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40/PR36、review branch7fffe3f；claim先于判定。十一自行构造check PASS、NO DEFECT FOUND；V1 marker未释放，check9 Android此处NOT_RUN；无merge authority。

```text
REVIEWER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
DEVELOPER           Alien (physical host MERA-ALIANWARE) — the workbook records development_host=Alien
REVIEWED HEAD       fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40   (branch mon/MON-990-Alien-20261006, PR #36)
REVIEW BRANCH       review/MON-990-Mech-20261006 @ 7fffe3f
CLAIM               mission-book/reports/MON-990/REVIEW_CLAIM_Mech.md (published before any verdict)
VERDICT             PASS on the eleven mandatory checks this reviewer manufactured; NO DEFECT FOUND
TERMINAL MARKER     CITY_WORK_MONITOR_V1_ACCEPTED — NOT RELEASED: check 9's Android half is NOT_RUN here
MERGE AUTHORITY     none
```

## 1. 领取测量

claim记录判定前review_host null、remote/dev same，902f4988248/9033cd32c60/main213f9f9祖先；逐次Actions匹配headSha：

```text
push          37420061997  COMPLETED SUCCESS attempt 1
pull_request  37420065177  COMPLETED SUCCESS attempt 1
linkage       37420065178  COMPLETED SUCCESS attempt 1
```

push37420061997/PR37420065177/linkage37420065178 SUCCESS attempt1。Mech非author Alien不同physical满足§3非self-review。

## 2. 评审仪器与实测

review分支新发明11probe，审查head全通过。非重跑author：R3/4/7/8/10用author fixture无input测projection；R1/2/5/6/9/11真实route/browser；11resolver永不答，因为不能挂fixture不能测timeout。

| # | 工作书检查 | 评审probe | 结果 |
|---|---|---|---|
|1|overview/规范task|R4/6建真FAILED读graph/browser|PASS|
|2|node owner/host/model|R7无metadata不得发明|PASS|
|3|edge真实event理由|R8无reason→MISSING/incomplete，无假evidence|PASS|
|4|receipt实际transition|R9 pre/post同store|PASS|
|5|risk不藏失败|R4 200task一FAIL折24，risk node visible、activeRisk true/falseSafe false|PASS|
|6|JEV/monitor坏无关task|R2 observer抛graph typed500，create200、decision仍cityId|PASS|
|7|timeout仅target|R11 never resolver timeout归RESOLVER_TIMEOUT/escalate非发明，无关task自身rule resolved|PASS|
|8|Registry/runtime/UI|§4|PASS|
|9|Web/Android parity|WebR1/6验，Android§5未跑|NOT_RUN|
|10|collapse/filter/stable|R10同结构同reflowKey、filter改draw edges不visible nodes；4collapse|PASS|
|11|diagnosis2–3交互exact|R6实数Monitor→risk node→evidence＝3，panel规范record含自身fail code|PASS|
|12|无第二task truth|R5 appliedBy null/RECORDED_ONLY、canonical byte-identical|PASS|

另攻击programme四次失败属性“缺信息仍safe”，此处成立：R1坏decision store明确非calm空；R3缺coverage WINDOW_INCOMPLETE、unobserved.tasks null非0；R4/7/8。

## 3. 作者数量不能复现部分

```text
author's claim      "Local full suite 1425 PASS / 0 FAIL / 0 SKIP"
reviewer's measure  tests 1425   pass 1422   fail 3
```

中文作者1425PASS/0FAIL/0SKIP，review1425/1422/3。count精确复现，0fail未复现；三差是实测host条件非分歧。host-city-launcher独跑1pass/3fail Requires a free local host reservation，常驻City占预留；本session每已测head同三。environment非defect，记不平均掉。作者phone Android/Web、2/3tap及3click handset、source blob/APK SHA256都是作者证据。review独复WebcountR6，未复phone§5。

## 4. Registry对账

```text
CAP-MON-001  GET /api/v0/monitor                       route exists; exposure BACKGROUND_DISCLOSED with
                                                       user_reachability_status PARTIAL, which is honest -
                                                       the raw observation view is deliberately not a surface
CAP-MON-002  GET /api/v0/monitor/graph?edges=&collapse= route exists and accepts both parameters, range-checked
                                                       (collapse 1..4096, a bad value is a typed 400)
CAP-MON-003  GET /api/v0/monitor/decisions              all three operations exist and answer: the list returns
             GET /api/v0/monitor/decisions/:id         200 with cityId, the single-receipt route answers a typed
             POST /api/v0/monitor/decisions            404 DECISION_NOT_FOUND for an unknown id, and the POST
                                                       refuses a City session on the owner-guarded path
all three    last_verified_full_sha fb042d9b…          equals the reviewed head
```

完整中文对应001 monitor route存在BACKGROUND_DISCLOSED/reachPARTIAL诚实，raw view刻意非surface；002graph接受edges/collapse、collapse1..4096、bad typed400；003list200 cityId、unknown single typed404 DECISION_NOT_FOUND、POST owner guard拒City session；三last_verified SHA等head。每route live请求非source推。首grep报single decisions route缺，因regex非path===，live反证scan错/registry对；programme第五仪器方法自信错答案，保记。

## 5. check9未跑范围与实测理由

要求Web+currentAndroid合理parity；Web验，Android本host不可验，按序两理由：

```text
no device      C:\Users\15601\AppData\Local\Android\Sdk\platform-tools\adb.exe devices  ->  empty list
               (the handset that serves this City as a control surface is not attached over adb here)
no toolchain   gradlew :app:testDebugUnitTest with the only installed JDK (26) fails with
               "FAILURE: Build failed with an exception. * What went wrong: 26"
               i.e. the Android Gradle Plugin rejects Java 26; only JDK 26 is installed on this host
```

中文adb devices空，City控制phone不挂adb；唯一JDK26下gradlew单测失败What went wrong26，AGP拒Java26、只装26。

辅助证据明确不替代：结构audit Android用graph collapse24/edges、decisions limit50，同Web，渲同risk code/level/evidenceRef；MonitorProjection.kt40甚至有R4服务端不变量“交付node set不得含ACTIVE/WATCH risk但node不在”。这是source-level parity论据；check要observed，仍NOT_RUN不升级。

## 6. 自身仪器缺陷记录，不重push抹去

首probe branch CI fail保留；覆red会使review只证自身：

```text
review branch, first head 7fffe3f   push 37422163771  FAILED (gateway-web)
  "MON990 review R1 ... AssertionError: the decision store is unusable and the surface says only:
   DECISIONS THE CITY RECORDED ..."
review branch, fixed head 14b2c7b    push 37422910108  SUCCESS attempt 1, jobs android and gateway-web both success
```

中文first7fffe3f push37422163771 FAILED gateway-web R1只读mount标题；fixed14b2c7b push37422910108 SUCCESS attempt1双job。原因review wait非product：#monitor-decisions mount即data-loaded false，本地读时projection已来、CI未。改等data-loaded true（product state marker区分shell/projection），R1 assertion未变，只wait错；后本地三连11／11。

此为programme第六instrument error、第三完全同形，902browser和此review均CI异local pass暴露。可定codebase规则：browser probe等产品自身state marker，不等多状态共存element。

## 7. 判定

```text
DEFECTS FOUND          none, across eleven independently manufactured checks
REPRODUCED             the author's exact-head CI (three runs, per-run read) and the author's test COUNT (1425)
NOT REPRODUCED         the author's zero-failure run (3 host-reservation failures here) and every handset measurement
MARKER                 CITY_WORK_MONITOR_V1_ACCEPTED is NOT released. The workbook permits it only when runtime/UI
                       reconciliation is satisfied, and one of its twelve mandatory checks is unverified by the
                       reviewer. Releasing it would mean accepting the author's physical capture as review evidence,
                       which this reviewer's own claim record says it will not do.
REVIEW STATE           review_complete stays false for the same reason. This is not a rejection: the review found no
                       defect and the author has nothing to repair.
REMEDY                 attach an Android device over adb on the review host (or install JDK 17/21 so the Android unit
                       tests can run), then re-run check 9; or the Owner may rule that the author's physical capture
                       is acceptable evidence for this one check, which is an Owner decision and not a reviewer one.
```

完整中文对应十一独立check无defect；复作者三exactCI和COUNT1425；未复0fail（3host reservation）及所有phone测量。CITY_WORK_MONITOR_V1_ACCEPTED不释放，workbook仅runtime/UI满足允许，十二mandatory之一review未验，释放即把author physical capture当review证据，违反自身claim。review_complete仍false，非拒绝，无author repair。办法review host adb接Android（或装JDK17/21跑单测）再check9；或Owner裁author capture此一check可接受，是Owner而非reviewer决定。

无merge/main改，author branch/PR36原样保留。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
