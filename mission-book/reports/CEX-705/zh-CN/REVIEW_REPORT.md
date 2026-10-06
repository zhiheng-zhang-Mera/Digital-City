# CEX-705 — 对侧物理主机真机评审报告

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史事实／未知边界；原元数据和证据块保留代码围栏，不新增验收。

Mech（MEGA-REP）对不同实体主机Alien-codex评审。远端尖端等审查头；依赖CITY_MEMBERS_HOST_ROLES_ACCEPTED_EXACT_SHA_REQUIRED祖先可达且该祖先Gateway成员契约存在。三精确CI成功。PASS；F1 MEDIUM、F2/F4 LOW、F3/F5/F6 INFORMATIONAL；释放ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED，限制无第二实体手机。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex (MERA-ALIANWARE)
REVIEWED HEAD       de9185a4ef8d761053c88316ec9efeca037239fb
BRANCH              cex/CEX-705-Alien-codex-native-members (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
DEPENDENCY          CITY_MEMBERS_HOST_ROLES_ACCEPTED_EXACT_SHA_REQUIRED — the declared ancestor
                    612c344f9f2b06a67b2645b4662d97750dd7c44e is reachable from the head AND the
                    api/v0/members contract it stands for is present at that ancestor in the gateway
REVIEW BRANCH       review/CEX-705-mech-review @ e0b2006 (probes)
EXACT-HEAD CI       V0.2 checks push run 37218345150 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR21 pull run 37218364139 completed/success on the same head
                    City linkage check run 37218364132 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1 MEDIUM · F2, F4 LOW · F3, F5, F6 INFORMATIONAL
TERMINAL MARKER     ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED released
                    (one limitation: no second physical handset, stated in §2)
```

## 1. 评审如何执行，以及未如何执行

10路径、380增／6删，完全无后端改，因为被暴露members契约已在接受线（依赖）。问题是权威、跨界面真值，工作书要求真机矩阵。

```text
author suite, unmodified    tests/cex705-native-members.test.mjs -> 1 test / 1 pass (a dense authority end-to-end)
reviewer probes, new        tests/cex705-mech-review-authority.test.mjs -> 7 tests / 7 pass
Android, executed here      :app:testDebugUnitTest -> 15 suites / 87 tests / 0 failures / 0 errors
                                                     (MemberManagementTest 7/7, host MEGA-REP)
physical handset            BICIPVNB5HS85H9T (OPPO PERM00, Android 12) — matrix in §2
```

中文对应作者原样1／1为密集权威端到端；新探针7／7；本机Android15套件87／87零失败／错误（MemberManagement7／7）；OPPO PERM00、Android12真机矩阵第2节。无旧测试触及，无放宽需补偿。

## 2. 真机矩阵

连接手机，对评审在host LAN自启City。九场景观察设备并对规范真值：

| # | 场景 | 判定 | 证据 |
|---|---|---|---|
|1|Owner双界面可达|VERIFIED|Settings城市与设备身份、管理员操作代表City host非此手机入网身份、installation列表/撤此安装；Devices同城全设备含全规范member|
|2|Owner改名|VERIFIED|保存CEX705-Owner-Renamed-City、规范displayName变、Web标题跟|
|3|session不能改名|双向VERIFIED|禁字段有提示、输入不改；HTTP sess403 Only the City owner can rename the City|
|4|自撤销|VERIFIED|确认→规范RETIRED，app Find your City、token清；city-connection.xml仅clientRef；旧凭据401 SESSION_UNKNOWN|
|5|session撤他拒|双向VERIFIED|仅self action，OWN_INSTALLATION一行；HTTP强撤B/C403 SESSION_CANNOT_REVOKE_OTHER，两者BOUND|
|6|sharing|VERIFIED|Owner自身node sharing true→false，session自身可翻；非自身node无控件|
|7|消息/回执|VERIFIED|sender认证actor、spoof senderDeviceId忽略；PENDING→recipient receipt→RECEIVED带receivedAt；无关member不可见，重复回执不改时间|
|8|重连|VERIFIED，F1|停City→RECONNECTING、非live缓存说明；重启全规范member、无旧installation；一个值仍错F1|
|9|Web/Android/规范比较|VERIFIED，唯一差F1|City名、四成员角色/deviceId、sharing全一致；online主张不一致|

crash buffer空，14785 logcat中FATAL EXCEPTION/ANR in/beginning of crash零匹配，app活。秘密扫描无sess/token/secret，配对token密码掩码，身份仅deviceId/nodeId。明确限制：仅一手机，第二实体phone未参与；其他member真实sess凭据HTTP驱动，作者索引也承认。

## 3. 发现

### F1 — MEDIUM：成员投影报连接，而自身node报离线

Formal Review要求Web/Android规范比较，此处失败。手机/规范同瞬实测：

```text
canonical GET /api/v0/city -> nodes: [{ id: host-a, online: false }]
                              member host-a: { online: true, computeOnline: false, nodeId: host-a, ... }
Android Devices page       -> 设备连接：在线
Web                        -> 离线 · 缓存 / UNKNOWN
```

中文对应规范nodes host-a online false；member online true、computeOnline false、nodeId host-a；Android设备连接在线；Web离线缓存/UNKNOWN。直接复现不只app观察：自身node注册后store设offline，member.online仍true，同row computeOnline false。members.mjs primary种online true，再prior.online || n.online，所以true || false无法修；同node sharingEnabled却读了。Android忠实输入，非app错，shared projection错。

定位重要：members.mjs不在本diff，是新界面暴露既有缺陷，非回归。MEDIUM因控制界面不得声称过期存活且同row相邻字段矛盾。最小修nodeId=deviceId时online从node，或null；Android已有未报告无需改。

### F2 — LOW：分享提示无条件成功

MemberManagementPanel 2xx设成功notice，但POST node/sharing还需node记录。primary sharingEnabled默认false且无node时可能toggle点击404仍说setting submitted。观察fixture未到（row根本未渲），所以潜在。最小修无node视未报告而非false，或呈拒绝非成功。

### F3 — INFORMATIONAL：Owner自身分享控件依City配置

canToggleSharing要求member.nodeId=actorRef，primary仅有ID=device的node才得nodeId。直接验证：hostDeviceId host-a且node host-a时nodeId host-a，Owner toggle允许；host device与node不同则无nodeId、不渲控件，虽server会接受动作。Android gate正确，可达依配置。委派device fixture二者不同所以看似缺feature实配置效应。

### F4 — LOW（控制平面）：缺21模板字段含全暴露/能力

同704，五exposure/authority、四capability、六research evidence、state identity/monitor/decision缺，而CAP-CITY-MEMBERS-NATIVE-001已存在声明。第4节按作者记录转录对账；watchlist五ID沿702/703/704同prose映射，歧义G2不发明。

### F5 — INFORMATIONAL：开发回执实体NOT_RUN清单过期

development receipt列rename/sharing/self-other revoke/send/two hosts未跑，但同日PHYSICAL_FOLLOWUP全部除two hosts记手机观察，独立矩阵确认。只读receipt会低估或重开闭合范围；两记录保留历史，follow-up取代。

### F6 — INFORMATIONAL：两必需材料点留null，由此提供

要求parity gap和消息交付延迟，receipt metrics.parity_gap_count/latency_ms null，均可测，PROBE6/7测：

```text
parity gap        6 features listed by the workbook / 6 reachable from the routes the Android client calls
                  (city rename, enrolled device identity, revoke, member role, sharing, message+receipt)
message latency   send HTTP 6 ms · send→recipient visible 9 ms · receipt round trip 7 ms
                  · canonical created→received 9 ms, from the City's own timestamps
scope             ONE physical Windows host, local City, NOT a performance claim
```

中文对应六feature/六路由可达（City改名、enrolled身份、revoke、role、sharing、message+receipt）；HTTP send6ms、send→recipient9ms、receipt往返7ms、规范created→received9ms仅City时间。范围一物理Windows本地City，非性能主张。

## 4. 完成门禁独立检查

| # | 门禁 | 判定 | 依据 |
|---|---|---|---|
|1|所列Android管理对等|PASS|真机1–7，六feature client路由可达（7）|
|2|权威边界|PASS|session改名403/Owner200，cross-revoke403、自200、自node分享、仅recipient回执、spoof忽略；device＋HTTP1–5|
|3|Web无回归|PASS|diff无Web，仅既有F1差非回归|
|4|对侧真机Review|PASS，范围声明|九场景，一手机无第二实体|
|5|精确CI|PASS|37218345150/37218364139/37218364132同头success|
|6|材料|PASS，F6|存在，两null由§3供|
|7|终端|RELEASED|ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED|

评审对账：

```text
capability-registry/records/CAP-CITY-MEMBERS-NATIVE-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      the pending-Formal-Review entry replaced by the PASSED record, with F1 named
  evidence                        reviewer probes + this report added as review refs
workbook CEX-705
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the twenty-one missing template fields backfilled, exposure values transcribed from the author's record
```

中文对应CAP-CITY-MEMBERS-NATIVE-001 pending→FORMAL_REVIEW_RECONCILED；known_gaps改PASSED带F1；增加探针/报告review refs；工作书IN_PROGRESS→COMPLETE、review true、review_ci，回填21字段，exposure转录作者。

## 5. 不作的主张

- 无第二实体手机；其他member真实City/session HTTP，双phone app↔app消息、第二phone回执未观察。
- 无Web session凭据运行，比较用Owner control token，非enrolled Web。
- 无soak、rotation、低内存、负载ANR，或长期重连churn。
- F1未修，members.mjs不在改动；带最小修留项目组。F2潜在，F3本质配置依赖。
- 无性能，F6仅一主机本地City。
- 仅de9185a4ef8d761053c88316ec9efeca037239fb；后头自身review；review分支是证据非候选。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
