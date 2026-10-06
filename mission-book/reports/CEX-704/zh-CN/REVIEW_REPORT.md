# CEX-704 — 对侧物理主机评审报告

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史事实／未观测边界，原元数据与证据围栏保留，不新增验收。

Mech（MEGA-REP）对Alien-codex不同实体主机评审；远端尖端等审查头。JOIN501/502/503 COMPLETE且review true，三祖先可达。三精确CI成功；PASS；F1 LOW、F4控制平面LOW、F2/F3/F5 INFORMATIONAL；释放ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED，限制为无第二实体手机消费。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex (MERA-ALIANWARE)
REVIEWED HEAD       d05f5a455ff535e3e065b30ec9ec74bca2dbb521
BRANCH              cex/CEX-704-Alien-codex-native-owner-onboarding (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
DEPENDENCY UNION    JOIN-501 / JOIN-502 / JOIN-503 all COMPLETE with review_complete true; all three declared
                    ancestors e925ae1…, 86deda9…, 77f7f2a… verified reachable from the reviewed head
REVIEW BRANCH       review/CEX-704-mech-review @ 6934fc1 (probes)
EXACT-HEAD CI       V0.2 checks push run 37216216410 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR20 pull run 37216246024 completed/success on the same head
                    City linkage check run 37216246022 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1 LOW · F4 LOW (control plane) · F2, F3, F5 INFORMATIONAL
TERMINAL MARKER     ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED released
                    (with the one limitation stated in §2: no second physical handset was consumed)
```

## 1. 评审如何执行，以及未如何执行

11路径、516增／2删，后端仅POST pairing/session小型乐观并发guard，其余Android Owner入城界面。Formal Review特别要求实体Android，所以评审拆两半分别声明，不混：

```text
author suite, unmodified       tests/cex704-native-owner.test.mjs -> 1 test / 1 pass
reviewer probes, new           tests/cex704-mech-review-probes.test.mjs   (guarded generation) 5/5
                               tests/cex704-mech-review-authority.test.mjs (admission authority) 5/5
JOIN regression, executed here 16 join/pairing/enrollment files -> 79 tests / 79 pass / 0 fail
Android, executed here         :app:testDebugUnitTest -> 15 suites / 84 tests / 0 failures / 0 errors
                                                      (OwnerOnboardingTest 4/4, host MEGA-REP)
                               :app:assembleDebug -> SUCCESS, app-debug.apk 10,500,445 bytes
repo gates, executed here      check-bilingual -> docs / evidence / data-records all SYNCHRONIZED
physical handset               BICIPVNB5HS85H9T (OPPO PERM00) — matrix in §2
```

中文对应作者原样1／1；guard五探针5／5、准入权威5／5；16 join/pairing/enrollment文件79／79；本机Android15套件84／84零失败／错误，OwnerOnboarding4／4；assembleDebug SUCCESS、APK10500445字节；双语docs/evidence/data-records全SYNCHRONIZED；实体OPPO矩阵第2节。无旧测试触及，只有新文件，无放宽须补偿。

## 2. 真机矩阵

OPPO PERM00／BICIPVNB5HS85H9T，Android0.3.2 review build，对评审自启host LAN City Gateway。十场景由观察而非阅读判定：

| # | 场景 | 判定 | 证据 |
|---|---|---|---|
|1|可达／面板|VERIFIED|ONLINE，规范snapshot列android-PERM00 CONTROL_ONLY；邀请设备加入＋规范City名、刷新、生成、ACTIVE固定提示、申请、跨网footer|
|2|生成码/QR|VERIFIED|438393，剩289秒一次，612×612位图contentDescription临时入网二维码；另一client消费屏幕码HTTP200证明规范，pairing/info无短码无法直接核|
|3|ACTIVE不旋转|三路VERIFIED|唯一generate enabled false，强tap码/session不变，host guard409 PAIRING_STATE_CHANGED|
|4|share|VERIFIED POSITIVE|分享邀请链接开真ChooserActivity：便签/信息/浏览器/Edge/文件/蓝牙/云/OPPO互传；无policy/permission拒，退出材料不变|
|5|第二client消费|VERIFIED，范围声明|本Windows host非第二手机；200，设备下次poll清码/QR/share并重新可生成|
|6|批准|VERIFIED|host请求约4s待审批；点击PENDING→APPROVED带decidedAt；host侧批准也改设备row|
|7|拒绝|VERIFIED|新请求待审批；点击PENDING→REJECTED，row失decision按钮|
|8|到期|VERIFIED|15s TTL后无码/QR，重新可生成，规范EXPIRED；不tap无新码|
|9|双击/背景恢复|VERIFIED|约100ms两tap恰一session，5s两读取ID/expiry稳；HOME恢复同码倒计时推进；背景被consume恢复后无码|
|10|旧join|VERIFIED存在|Scan QR/LAN/Bluetooth/Manual同页；Manual仍到旧Connect your city；提交不触PairingPanel|

作者share缺口由评审关闭，而非确认。回执share_sheet NOT_RUN_AUTO_APPROVAL_REJECTED，本机chooser正常开。仍未关闭different_physical_second_device：仅一手机，消费为Windows进程，作者索引亦承认。crash logcat空，无FATAL EXCEPTION，app全程活。

## 3. 发现

### F1 — LOW：share失败指导可未读即清

OwnerOnboardingPanel136 share intent失败写“无法打开分享面板，请使用短码”，State.refresh59–63每2s pairing reconcile重赋error，约2s无其他动作即清。此手机chooser开，失败分支未跑，所以源码推导非观察。最小修独立字段不被refresh覆，或下次share才清。

### F2 — INFORMATIONAL：他界面生成session成无倒计时死路

设备观察host创建ACTIVE，手机无码/QR（dump无host码）、生成禁，仅“若其他设备已生成，请在那里分享，或等待过期后刷新”。secret只返创建界面正确默认，可辩护；但只持手机Owner无法行动也不知等多久。最小修此状态TTL，无安全变化。

### F3 — INFORMATIONAL：invite是持久City凭据一次性bearer

工作书禁共享持久凭据，字符串诚实：chooser仅invite URL（pair参数六QR字段，无control token或sess值）。背后性质需精确，本评审亲验：

```text
POST /pairing/exchange with the on-screen short code
  -> returned credential is BYTE-IDENTICAL to the City control token
  -> that credential is accepted by GET /api/v0/city (200)
  -> replaying the same short code answers 410, so it is single use, session-bound and TTL-bounded
```

中文对应屏幕码exchange返回credential逐字节同City control token，GET city200；同码replay410，单次、session/TTL有界。分享链接在session寿命内分享取得Owner credential能力。是既有项目组/Web QR契约，非704引入，所以记录非缺陷。若项目组愿改，最小改善共享文本/旁明确。

### F4 — LOW（控制平面）：缺21模板字段含全暴露/能力

比本组其他工作书缺更多MISSION_TEMPLATE：五exposure/authority、四capability、六research evidence、state identity/monitor/decision。非NOT_APPLICABLE，CAP-ONBOARDING-OWNER-001存在、命名704、class/Android surface/nesting/四控件；Registry有事实、拥有工作书未声明。第4节按作者记录转录对账；watchlist五ID由作者prose，歧义G2排除不发明。

### F5 — INFORMATIONAL：面板本身无测试

OwnerOnboardingTest四项是良好lifecycle模型测试：unknown不生成、ACTIVE不旋转、恢复材料需规范匹配、expiry不旋、QR多secret字段拒。无panel测试：decision row、他界面生成F2、share fallback F1均无。与F1/F2一起记，让读者知何者源码推导。

## 4. 完成门禁独立检查

| # | 门禁 | 判定 | 依据 |
|---|---|---|---|
|1|Android Owner入城控制|见§2|Find/Connect挂载，client/server guard生成，approve/reject读规范join/requests|
|2|JOIN501不回归|PASS|review-falsification及79集合，guard新增，旧无guard仍可生成|
|3|旧Android join不回归|PASS，代码|旧pairing panel原样挂下方|
|4|真机对侧Review|PASS，范围声明|十场景含作者NOT_RUN share；消费本机非第二手机|
|5|精确CI|PASS|37216216410/37216246024/37216246022审查头成功，PR20全pass|
|6|材料索引|PASS，下方测量增加|存在且尤其诚实记缺口|
|7|终端|RELEASED|ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED|

### 4.1 本半评审判定及证据

```text
guarded generation is a real barrier         8 simultaneous guarded generates -> exactly one 200, seven 409, and the
                                             surviving session is the one that was accepted
a live session is FIXED                       all four terminal expectations refused with the same typed reason
                                             (PAIRING_STATE_CHANGED), so guessing a different state cannot rotate
unknown state is refused by name              PAIRING_STATE_INVALID for ACTIVE / idle / DRAINING / "" / "USED "
the guard is additive                         a request without expectedSessionState still generates (legacy path);
                                             that legacy path CAN still rotate, which is why the guard exists
material is bound to City/host/credential     OwnerOnboardingState hashes the triple and DROPS stored material when
                                             the hash changes
material is dropped when canonical disagrees  reconcile() requires canonicalState ACTIVE + the same session id +
                                             unexpired, otherwise the material is invisible and generation is offered
requests come from canonical truth only       approve/reject call the existing join routes; no second approval store
a failed poll cannot fabricate an empty list   joinsError is set and requests become null, so the panel says
                                             "not read yet" rather than showing an empty list
approval latency (workbook paper point)       MEASURED here: 8-11 ms HTTP round trip, 9-16 ms until the owner sees
                                             the decision, local City on one physical host, not a performance claim
```

完整中文对应：八并发guard恰一200七409，存活session为接受者；ACTIVE固定，四terminal expectation同PAIRING_STATE_CHANGED拒，猜状态不旋转；未知ACTIVE/idle/DRAINING/空/USED尾空按名PAIRING_STATE_INVALID；guard新增、无expected仍旧生成可旋，正是guard理由。State哈希City/host/credential三元组，改变丢存材料；reconcile需规范ACTIVE、同session、未过期，否则不可见重新提供生成。请求仅旧join路由，无第二批准store；poll失败joinsError、requests null，panel“未读取”非空列表。批准延迟8–11ms HTTP、9–16ms Owner可见，一主机本地City非性能。

### 4.2 攻击并拒绝的假设（防重开）

```text
"the persisted pairing secret can leave the device through cloud backup"
  REJECTED. AndroidManifest.xml declares android:allowBackup="false", so the plain-SharedPreferences file
  owner-pairing-temp is not included in Auto Backup. The material is short-lived (gateway TTL), scoped by a
  City/host/credential hash, and dropped on any mismatch. No finding.

"the expiry countdown and expiry transition are frozen"
  REJECTED. MainActivity keeps `now` in a mutableStateOf refreshed every 1000 ms, and the panel reads it during
  composition, so both the countdown and the expiry transition follow wall time.

"the Android parser expects a payload shape the server does not send"
  REJECTED, measured against a live City rather than assumed: the server returns exactly the six QR fields the
  parser whitelists (v, host, city, session, expires, secret), a six-digit shortCode ("665418" observed),
  descriptor.endpoint {scheme,host,port}, and an inviteUrl that is one URL-encoding layer above the QR payload -
  which is exactly what the one-decode equality check expects. The author's fixtures match the real shape.

"a member session must not decide admissions"
  REJECTED, and this one corrected my own probe: join.approve documents the opposite on purpose ("an already trusted
  device deciding is the whole point"), and what the route refuses is an ANONYMOUS caller. The probe now pins the
  real contract.

"a later reject must not reverse a recorded approval"
  REJECTED: join.reject accepts PENDING **or** APPROVED, so an uncollected invitation may be reversed. The invariant
  that matters - a closed state machine - holds and is asserted instead: approve-after-reject is 409.

"a repeated reject is refused as terminal"
  REJECTED: a repeated reject is an idempotent 200 no-op while a repeated approve is a 409. The asymmetry is real,
  changes nothing, and is recorded rather than asserted away.
```

完整中文对应：持久pair secret不能云backup外流，Manifest allowBackup=false，plain prefs owner-pairing-temp不进Auto Backup；短TTL、三元hash范围、任一不匹配清，无finding。倒计时/到期不冻结，MainActivity now mutable每1000ms、compose读，跟wall time。parser不期待server未发shape，live测六白名单v/host/city/session/expires/secret、六位665418、endpoint scheme/host/port、invite比QR多一URL编码层，正好一次decode等检查，作者fixture吻合。member不能批准是假假设，join.approve刻意已信任device可decide，仅匿名拒，纠正自身探针固定真契约。后reject不可逆approved也假，reject接受PENDING或APPROVED，未消费invite可逆；关键closed state machine、approve-after-reject409被断言。重复reject非terminal拒，幂等200 no-op，重复approve409，不对称真实零变，记录不强断消除。

错误预期失败草稿记probe comments，因为都似产品缺陷：member、逆转、重复reject，以及早草稿把无session descriptor null断为undefined。

## 5. 本评审不主张

- 无第二实体手机光学QR scan，根本无第二手机，仅一Android连接。作者已说受控第二client非Mech/另一实体Windows，评审重复限制不粉饰。
- **无系统share-sheet验证。** 作者回执记策略阻塞且未重试；§2记录本评审可/不可建立内容。（此项与原报告§2的VERIFIED POSITIVE措辞存在内在不一致；译本保留两处原意，不自行裁决或改事实。）
- 无性能。批准延迟一主机本地City，开发approval_latency_ms null/NOT_OBSERVABLE，review供测量。
- 无APK溯源。审查源构建同10500445字节不同SHA256，非hermetic，只报告尺寸匹配。
- 仅d05f5a455ff535e3e065b30ec9ec74bca2dbb521。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
