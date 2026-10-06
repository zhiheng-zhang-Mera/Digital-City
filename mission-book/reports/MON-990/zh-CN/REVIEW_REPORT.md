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


## 2026-10-06正式复检更新：以下取代上方历史待验收裁决

上方保留的是此前 Android NOT_RUN、标记未释放的历史译文。规范原报告现已修正§5、§7并新增§9，完整新增正文如下；当前状态以原工作书及本次正式复检为准。

### 5. 第9检查的 Android 部分：纠正工具链声明后实测

先纠正：旧报告称本机只有 JDK26，不能构建 Android。这是复检者测量错误，不是主机限制；只查看PATH中的java就推断没有别的JDK。Temurin17.0.18一直已安装于：

```text
C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\java.exe
openjdk version "17.0.18" 2026-01-20   (Temurin-17.0.18+8)
```

判断一台主机能做什么，要查找工具，不能只读PATH首项。这与报告其他位置四次记录的测量方法错误同类，且此次由复检者造成。

精确复检版本 fb042d9 的 Android 实测：

```text
build + unit tests   JAVA_HOME=<the JDK 17 above> gradlew :app:testDebugUnitTest :app:assembleDebug
                     BUILD SUCCESSFUL in 3m 51s
                     118 Android unit tests, 0 failures, 0 errors, across 22 suites
                     including MonitorProjectionTest 7/7 — the Android-side projection contract
                     app-debug.apk 10 668 669 bytes
parity probe         the Android projection was fed the reviewed head's OWN server payloads — captured from a gateway
                     running that head, not from a fixture — and accepted and interpreted them:
                       graph      cityId f2fb48c9…, health COMPLETE, nodes 31, visible 1, clusters 2, authoritative false
                       decisions  1 receipt, appliedBy null, application RECORDED_ONLY
                     PARITY reviewed-head=fb042d9 nodes=31 visible=1 clusters=2 receipts=1 -> ACCEPTED
```

该路径对就是检查9：Android在 CityClient.kt235/237读取 monitor/graph?collapse=24 和 monitor/decisions?limit=50，与Web相同。探针让Android读取本版本真实服务输出，导出一致视图，包括两个重要不变量：折叠不能隐藏携带风险的节点；receipt不能谎称已执行（MonitorProjection.kt40/59）。

仍未观察的是手机渲染本身。复检主机重新执行adb devices仍为空，手机在City中作为control surface在线但连接到另一主机。作者手机实拍仍是渲染侧唯一证据，正如§3所述。

检查9两半现由非作者复检者在同一版本通过执行验证：Web由R1/R6真实浏览器计数；Android由构建、118单测与live-payload parity probe。因此从NOT_RUN变为PASS，同时明确“本机手机渲染NOT_OBSERVED”。此披露方式与REX804在物理部分NOT_RUN下释放标记一致。此前拒绝仅凭源码升级判断仍有效；改变的是如今证据已通过执行，而非只读源码。

### 7. 当前判定

```text
DEFECTS FOUND          none, across eleven independently manufactured checks
REPRODUCED             the author's exact-head CI (three runs, per-run read) and the author's test COUNT (1425)
NOT REPRODUCED         the author's zero-failure run (3 host-reservation failures here) and every handset measurement
REVIEW STATE           review_complete true (was false only because check 9's Android half was measured NOT_RUN)
```

十一项独立制造检查没有发现缺陷；逐项复现作者精确CI三项和测试数量1425。未复现作者零失败（此处三项主机reservation失败）及全部手机测量。review_complete现为true；此前false仅因为第9项Android部分测为NOT_RUN。

### 9. 释放标记及其判断依据

报告原先建议“安装JDK17/21以运行Android测试，再复检第9项”。其实工具一直可用，却被复检者错误测成不存在（§5）。执行该补救后，剩余判断是：复检主机仍未观察手机实际渲染时是否可以释放标记。

选择及理由原证据块保留：

```text
CHOSEN      release CITY_WORK_MONITOR_V1_ACCEPTED, with the rendered-handset half disclosed as NOT_OBSERVED on this host
NOT CHOSEN  keep it withheld until a handset is attached to THIS host, or until the Owner rules

GROUNDS
  1  check 9's substance is that both surfaces present the same canonical truth with the same invariants; both halves are
     now verified BY EXECUTION at the same reviewed head, by a reviewer who is not the author - the Web half with a real
     browser (R1/R6), the Android half by a successful build, 118 passing unit tests and a probe that fed the head's OWN
     server payloads to the Android projection (31 nodes, 2 clusters, 1 receipt accepted)
  2  the unobserved part is a rendering seam on a device that is not attached to this host, not a code seam; the
     programme already releases markers with disclosed physical NOT_RUNs (REX-804 did exactly that one round earlier)
  3  withholding on the device alone would be the "空等 external seam" the construction rules tell a host not to do,
     and it would leave the task open on a limitation of the reviewer's own hardware
DISCLOSED   handset-rendered parity is NOT_OBSERVED here; the only evidence for it is the author's capture (section 3),
            and this release does not claim otherwise
REVERSIBLE  the release rests on measurements that can be re-taken; if either the build, the unit suite or the
            live-payload probe fails at this head on another host, this verdict is wrong and should be corrected
```

选择：释放CITY_WORK_MONITOR_V1_ACCEPTED，明确该主机手机渲染NOT_OBSERVED。未选择：等待手机连接此主机，或等待Owner裁决。

依据1：检查9实质是两端展示相同规范事实及不变量；同版本非作者已通过执行验证Web（真实浏览器R1/R6）和Android（成功构建、118单测、31nodes/2clusters/1receipt的本版本真实载荷投影）。依据2：未观察部分是未连接设备的渲染seam，不是代码seam；系列此前已有带披露物理NOT_RUN的验收（REX804）。依据3：仅因设备等候属于常驻规则要求避免的空等external seam，会把任务卡在复检主机硬件限制上。

明确披露：该主机手机渲染parity NOT_OBSERVED，唯作者§3实拍作证，释放不声称其他。可逆：测量能重跑；若其他主机在同版本构建、单测或live-payload probe失败，裁决应纠正。

复检者明确这是判断而不是测量。没有merge，没有修改产品main，作者分支与PR36原样保留。
