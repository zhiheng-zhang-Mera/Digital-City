# CEX-701 — 对侧物理主机评审报告

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书／状态；历史事实及未观测边界保持原意。原报告有分隔符及中文引文编码损坏；可由清晰英文判定者译出，原证据块逐字保留，不猜无法恢复字符。

评审Mech（MEGA-REP），与作者Alien-codex不同物理主机。远端分支头等审查头；JOIN503 COMPLETE、review_host Mech、review_complete true，祖先可达。三个精确CI均成功；结论PASS，F1/F2控制平面LOW、F5 MEDIUM、F6/F7/F8 LOW、F3/F4/F9 INFORMATIONAL；释放DEVICE_RECOVERY_ENTRY_ACCEPTED。

```text
REVIEWER            Mech (MEGA-REP) 鈥?opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       a24c04401308b11548626239e8ca1f9b4276bbdf
BRANCH              cex/CEX-701-Alien-codex-device-recovery (remote tip equals the reviewed head)
BASELINE            40e18db4a6cf5bba1490181a473bc62e681edb8a
DEPENDENCY          JOIN-503 COMPLETE / review_host Mech / review_complete true; declared ancestor
                    77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f verified reachable from the head
REVIEW BRANCH       review/CEX-701-mech-review @ e83edd8 (probes)
EXACT-HEAD CI       V0.2 checks push run 37206760171 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR14 pull run 37207112712 completed/success on the same head
                    City linkage check run 37207112720 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1, F2 LOW (control plane) 路 F5 MEDIUM 路 F6, F7, F8 LOW 路 F3, F4, F9 INFORMATIONAL
TERMINAL MARKER     DEVICE_RECOVERY_ENTRY_ACCEPTED released
```

## 1. 评审如何执行，以及未如何执行

18改动路径、278新增／13删除。后端仅host-preflight.mjs一函数；实质为Web恢复界面、Android恢复界面、两回执。以下不取自开发报告、PR正文、comment或作者测试标题。

```text
author suite, unmodified   tests/cex701-recovery-ui.test.mjs + tests/host-preflight.test.mjs
                           -> 10 tests / 10 pass / 0 fail / 0 skipped
reviewer probes, new       tests/cex701-mech-review-probes.test.mjs -> 12 tests / 12 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 15 suites / 84 tests / 0 failures / 0 errors
                                                     (DeviceRecoveryTest 4/4, host MEGA-REP)
related regression         gateway/host/device/enrollment/identity/recovery set -> 196 tests
                           / 193 pass / 3 fail (all three are the known environmental launcher cases, 搂5)
```

中文对应：作者原套件10／10无失败／跳过；新评审探针12／12；本机Android15套件／84测试／0失败／错误，DeviceRecovery4／4；相关回归196／193／3，三为已知环境launcher（第5节）。12探针中两真实浏览器对真实Gateway读DOM，单测不能建立“用户可完成恢复”。不同于WBC603，无旧断言放宽；host-preflight.test纯增6／删0，由git diff --name-status与实际差异测得，非因文件新而假设。自身错误假设导致失败草稿记comments，不静默修：

```text
hand-written capability list / wrong table name   probe defects, not product defects
```

手写能力列表／错误表名为探针缺陷，非产品。

## 2. 工作书七场景及实际判据

Formal Review要求**构造**七场景；均真实Gateway从零建，两还驱自身浏览器界面。

| # | 场景 | 证据 | 结果 |
|---|---|---|---|
|1|UNBOUND重装|PROBE1|state UNBOUND、deviceId null、rebind.required true；身份准入但无逻辑device|
|2|合法rebind|1、8浏览器|Owner选原device、勾明确确认、提交，原dev上BOUND；无第二逻辑device|
|3|错误proof|3|缺失、null、字符串、空kind、无形proof均403 rebind_proof_required，保持UNBOUND无半应用；有proof同调用成功|
|4|clone|4、14|同指纹两instance→REUSED_CREDENTIAL命名双方，均不删除；两正常enrolment cloneFindings空，无 blanket alarm|
|5|session重绑他installation|5、5b|他／自身均403 SESSION_CANNOT_REBIND，恢复为Owner动作；session enroll同拒|
|6|自撤销|5|200、OWN_INSTALLATION、RETIRED，合法离城不影响他人|
|7|Owner撤他|5|200、CITY、target RETIRED|
|附|真实浏览器|8、9|Owner端到端恢复；member得可执行Owner指导，无恢复权威|

五禁令证据：

```text
no second device registry        the recovery module is presentation only; PROBE 1 asserts no extra logical device
                                 appears, and the surface builds its choices from canonical members/installations
no bypassing the rebind proof    PROBE 3: five malformed proofs refused by name with no state change
no auto-delete on a clone        PROBE 4 and PROBE 8: both the original and the clone fixture survive a recovery
no durable credential in the FE  PROBE 8: after a successful recovery, neither sessionStorage nor localStorage holds
                                 any installation secret - only the credential the page was opened with
no session->owner promotion      PROBE 5, PROBE 5b: rebind, cross-revoke and enroll are all refused for a session,
                                 and the member payload contains no other installation at all
```

中文对应：无第二device registry，模块仅展示，PROBE1无多逻辑device，choices从规范members／installations；不绕proof，PROBE3五畸形按名拒零状态；clone不自动删，4／8原与clone均存；前端无持久installation secret，8恢复后sessionStorage／localStorage仅打开页使用的凭据；session不提升Owner，5／5b拒rebind／cross-revoke／enroll，member无其他installation。

## 3. 测试并拒绝的假设（防重开）

被拒假设也为证据；这些四项最可能找出问题，原文也记录第五项：

```text
"the UI gate is the only barrier against moving a bound installation"
  REJECTED. Rebinding a BOUND installation onto a DIFFERENT logical device answers 403 `already_bound` with a detail
  naming the current binding, and the row is unchanged. The API is a barrier in its own right. (PROBE 11)

"the owner can brick the City through the revoke path"
  REJECTED. The City host has its own hostDeviceId but is NOT an installation in the revocable list, so
  /device/installations cannot retire it. Revoking every listed installation leaves health, /city and task creation
  at 200. The workbook's "safe revoke path" holds structurally, not by UI politeness. (PROBE 12)

"a City with no other bound installation leaves an unsubmittable recovery form"
  REJECTED. In the minimal case - one UNBOUND installation and nothing else - the select still offers the host's own
  logical device from city.members, so recovery is possible and the form is never a dead end with no explanation.

"cloneFindings discloses a usable credential"
  REJECTED. credentialFingerprint is sha256(secret) - a non-reversible comparison handle - and the secret never
  appears in any listing or UI. Measured in the payload and in the browser. (F3 records a wording consequence only.)

"the Android parser reads a field the server does not send"
  REJECTED. The store row carries a nested rebind:{required}, but the API row is projected with a top-level
  `rebindRequired` boolean; the Android parser reads the API shape, verified against a real payload.
```

完整中文对应：UI不是唯一防移动BOUND屏障，重绑其他device403 already_bound，detail原绑定、row不变（11）；Owner不能撤销路径砖化City，hostDeviceId非可撤installation，撤完health／city／task200，安全结构保障非UI礼貌（12）；仅一UNBOUND无他installation时select仍从city.members给host逻辑device，表单非无说明死路；cloneFindings无可用credential，fingerprint=sha256(secret)不可逆比较句柄，payload／browser无secret（F3仅措辞后果）；Android parser不读服务器未发字段，store嵌套rebind.required由API顶层rebindRequired，parser读API形状并对真实payload验证。

## 4. 发现

### F1 — LOW（控制平面）：缺十四模板字段，含本任务全部暴露字段

相对MISSION_TEMPLATE.md，frontmatter缺：

```text
user_exposure_class  user_exposure_surface  user_exposure_nesting  backend_wiring  ui_exemption_reason
research_watchlist_hits  highest_research_grade_observed  research_capture_level
state_identity_evidence  state_identity_evidence_refs
monitor_observability_evidence  monitor_observability_refs  decision_trace_evidence  decision_trace_refs
```

本任务是Capability Entry Closeout，主题是将既有服务器身份生命周期置于用户可达界面，§14A要求工作书记暴露类别／界面／嵌套／接线；这比研究工作书更关键。材料索引引五watchlist和G4_RARE_SYSTEMIC／MAXIMUM_BOUNDED，但工作书无声明，无法对账。本评审第5节按作者已验证CAP-IDENTITY-001（DIRECT_CONTROL、Web L2_CONTEXTUAL、Android L3_ADVANCED、backend_wiring_status VERIFIED）及当前watchlist转录对账。未加自身判断，只将作者事实移至模板字段。

### F2 — LOW（控制平面）：必需修前／后用户步骤数无记录

工作书明确要求修前／后用户路径长度（中文引文原有编码损坏）。已搜索未找：

```text
mission-book/reports/CEX-701/*.md                      no step/path count
utopia evidence/raw/mission-book/CEX-701/*.json        scenarios listed, no path length
utopia data-records/.../CEX-701/events.jsonl           seven events, no path length
git grep -i "step count|clicks|姝ユ暟" at the reviewed head   no relevant hit
```

中文对应：报告无步骤／路径数；JSON只场景无长度；events七事件无长度；grep无相关命中。这是使核心主张可检查的测量。前提是API有字段UI丢弃、rebind无正常UI，即exposure lag；索引记录调查却未量路径变化。读者无法知改善多少，项目组EXPOSURE_LAG=T(reachability_verified)−T(implementation_complete)材料依此类计数。未在此修复，发明会伪造；最小修是作者记录Settings丢finding时之前路径及选设备→确认→提交后路径，注明在哪界面计数。

### F3 — INFORMATIONAL：Registry措辞比实际API严格

CAP-IDENTITY-001 intentionally_hidden_information列credential fingerprint，但GET installations每行含credentialFingerprint／credentialId；仅UI隐藏。sha256(secret)非泄露缺陷，而是措辞后果：“hidden”对presentation真、wire假；防后读者误当不提供保证。

### F4 — INFORMATIONAL：不改变任何东西的rebind仍接受重录

already_bound拒移动BOUND（11），但指定自身当前device200并重写proof。UI只UNBOUND／rebindRequired才表单，不会提供；caller已Owner，只有proof重录。guard不对称：保完整性，不保审计轨迹。

### F5 — MEDIUM：Android问聚合问题，却以单数作答

DeviceRecovery.kt:8对凭据scope返回全installations any UNBOUND／required；:20渲“本installation需恢复，要求Owner在Web选原device批准，再重连”。app不能识别自身，CityClient.kt:32 clientRef=android-＋Build.MODEL，非服务器installation ID。真实Android用City control token，GET返回scope CITY全roster（1实测），其他UNBOUND令本手机声称自身需恢复；工作书看本installation要求被答为City。方向安全，过报并引Owner而非隐藏，因此不阻塞要求真实可执行入口的gate。最小修存enrollment installation ID问该行，或不用单数、命名被报告installation。

### F6 — LOW：若设备runtime无值，多个字段会制造值

DeviceRecovery.kt:13保护displayName／deviceId免optString把JSON null变字面null，正是JOIN590身份冲突同平台陷阱。installationId／state／errorCode／error／clone.reason无guard，因此null会成名／状态／clone理由null，后者DeviceRecoveryPanel:31,44对无冲突payload渲安全警告。诚实可达边界：当前Gateway不发这些null，API投rebindRequired并总发code／reason，故潜在、来自schema变化／不同Gateway，非本服务器。已有Actions.kt:13 textOrNull惯用法新parser应使用；Android源无NOT_OBSERVABLE，明确未知无表示。最小修全部字符串经has／isNull、状态明确unknown附原因。

### F7 — LOW：权威拒绝显示连接故障，服务器code被替换

CityClient.kt:73非2xx除capabilities／invocations路径外抛仅error普通异常；后两路径:68–71带code/status typed异常。row从异常类合成errorCode，所以此路由403 SESSION_CANNOT_REBIND成INVOCATION_UNAVAILABLE、httpStatus null；DeviceRecovery:22显示“状态无法读取，检查连接”，把权威决定当连接。403／404不可分、technical details显示服务器未发code。当前control token很少拒，影响小；row早于提交，但新界面首次依赖此区别。最小修像capability路径保errorCode／status。

### F8 — LOW：新单测不能因看似测试的理由失败

DeviceRecoveryTest前测试contains owner，但recoveryMessage四分支全有Owner，任何输入都真。测试3指纹断言检查函数从不接收字符串缺失。无payload含JSON null，真实UNBOUND displayName／deviceId null两guard未测，删除仍全通过。套件用org.json:json:20180813（build.gradle:18–20，android.jar stub），optString null返空串，设备返null，恰验证F6不可现实现。测试4 ownerSettingsUrlNeverSharesCredentialsOrUnsafeUrls是真测试，固定真实拒绝。

### F9 — INFORMATIONAL：Android两展示细节

when(page)无Settings标题，MainActivity:100头“Connect your city”，panel自身Device recovery， cosmetic。解析owner flag全app无use-site，所以Owner／member逐字节相同指导，Owner被要求找Owner，member得需Owner自身credential的Web链接。

## 5. 完成门禁独立检查

| # | 门禁 | 判定 | 依据 |
|---|---|---|---|
|1|Web恢复完整|PASS|类型clone无指纹、明确状态／proof重绑／安全撤销；8真实浏览器端到端|
|2|Android真实可执行入口|PASS，记录F5|More→Settings→Device recovery MainActivity135；状态／冲突／无凭据Owner-Web深链／重连；亲跑84／84。入口真实，但答City非自身|
|3|clone不再静默丢弃|PASS|API有，Owner渲理由，member刻意空，假例清（4、14）|
|4|rebind／revoke权威无回归|PASS|3、5、5b、11、12，join503及相关集|
|5|开发／对侧Review|PASS，本报告|12探针＋2浏览器＋作者原套件|
|6|精确CI绿色|PASS|37206760171／37207112712／37207112720同头success|
|7|材料索引完整|PASS，记录F2|有场景／日志，必需步骤缺|
|8|终端标记|RELEASED|DEVICE_RECOVERY_ENTRY_ACCEPTED|

本评审Registry对账原记录：

```text
capability-registry/records/CAP-IDENTITY-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      "Opposite physical-host Formal Review pending" replaced by the PASSED record
  evidence                        reviewer probes + this report added as review refs
workbook CEX-701
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the fourteen missing template fields backfilled (F1)
```

中文对应：CAP-IDENTITY-001 pending formal→FORMAL_REVIEW_RECONCILED；known_gaps对侧待评替换PASSED；新增探针／报告review refs。工作书IN_PROGRESS→COMPLETE、review_complete false→true、review_ci判定；回填十四字段F1。

## 6. 回归与失败分类

```text
related set (17 files)   196 tests / 193 pass / 3 fail
  host-city-launcher.test.mjs x3   ENVIRONMENTAL, not attributable here: a resident City holds the coordination port
                                   on this host and the tests refuse to disturb it rather than fail on a defect.
                                   The same three fail on the reviewed head's unrelated runs and are documented in
                                   this programme's earlier reviews.
  everything else                  PASS, including join503-enrollment.test.mjs (the declared dependency),
                                   host-preflight.test.mjs and cex701-recovery-ui.test.mjs
```

中文对应：17文件196／193／3；host-city-launcher三ENVIRONMENTAL、不能归本改，常驻City占协调端口，测试拒扰而非产品缺陷，本头其他无关运行同失败并记录早评审。其余含join503依赖、host-preflight、recovery全部PASS。

后端仅Windows inventory扫描；PROBE10固定冷timeout完整重试一次（两观察都更新，不只失败半边）；持续timeout恰两尝试HOST_SCAN_TIMEOUT；非timeout即HOST_SCAN_FAILED；失败scan抛错不返空host，因为空host授权启第二City。

## 7. 本评审不主张的内容

- 无实体Android使用。读取Compose、亲跑84单测parser、真实Gateway核API形状；OPPO离线是作者观察。在线／原生恢复NOT_RUN，工作书仅因可执行指导允许，该指导为评审验证而非原生恢复。F5–F8来自阅读／树外parser执行，Compose未渲。
- Android单测不接受为null处理证据：不同org.json、无null payload。两guard靠parser对live shape阅读验证；F6设备后果为潜在而非观察失败，无模拟器／设备运行。
- 无用户路径测量，F2缺计数，不补不声称exposure-lag。
- 无意图验证，intent_validation_status NOT_TESTED；确认界面存在／可达／行为，不确认生产真实Owner意图满足。
- F1/F2未在审查artifact修；F1在控制平面对账，F2留作者测量。
- 结论仅a24c04401308b11548626239e8ca1f9b4276bbdf；后头需自身评审；review/CEX-701-mech-review为证据，非合并候选。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
