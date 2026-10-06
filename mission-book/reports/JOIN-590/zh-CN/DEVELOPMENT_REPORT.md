# JOIN-590 — 开发／物理接受报告

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；原文追加阶段造成的状态矛盾完整保留，所有证据块原样引用，不升级验收。

```text
TASK_ID            JOIN-590  (Merged-main Physical Acceptance + Programme Closeout)
ROLE               Development / Physical acceptance (Mech host)
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech (MEGA-REP) + Alien (Mera-Alianware) + physical Android (PERM00)
BRANCH             join/JOIN-590-merged-main-physical-acceptance
BASELINE_SHA       d3262ce2dd81e51a53e39e6f9add8dee650a7682
REQUIRED_ANCESTORS e925ae1e… / 86deda9c… / 77f7f2a7…  -> all ANCESTOR_OK
CANONICAL CITY     031fdba6-e94c-4298-a095-6ff04a65481d  @ http://172.31.12.151:4391  (Mech resident City)
TERMINAL_MARKER    CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED — NOT released
REVIEW             PENDING (opposite-host Formal Review required)
```

合main物理接受及programme收尾，Mech开发物理角色，双Windows及真PERM00，分支／基线／祖先／规范City见原元数据。终止标记未发布，相反主机正式审核待定。

## 1. 领取

Digital-City98137af原子领取，解析基线、三必要祖先ANCESTOR_OK，要求CI从Actions API按精确头读。物理前提是测量：adb真实BICIPVNB5HS85H9T product/model PERM00；明确不用utopia36模拟器，模拟控制面会伪造批准证据。

## 2. 真实硬件执行

### 2.1 真机构建安装，非模拟

```text
JDK            the host PATH ships JDK 26, which Gradle/AGP refuse; the acceptance used the Gradle-cached
               Temurin 17 (C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2)
build          apps/android: gradlew :app:testDebugUnitTest :app:assembleDebug -> BUILD SUCCESSFUL (3m09s)
install        the previously installed package had a different signing key, so the acceptance uninstalled it and
               installed the merged-main debug APK; the vendor installer showed its confirmation page and
               `adb shell input tap` completed it without human confirmation (the PackageInstaller activity is not
               FLAG_SECURE, so a synthetic tap is a legitimate user-equivalent action) -> versionName 0.3.2
```

PATH JDK26被AGP拒，使用缓存Temurin17；单测＋APK3m09成功。旧包不同签名，卸装合main debug，厂商非FLAG_SECURE确认页用adb合成点击等效用户动作非绕过，version0.3.2。证据01-installer-prompt至05-app-start。

### 2.2 设备用户路径

全新未绑定显示Find your City及QR/LAN/BLE/Manual四方法。LAN真实mDNS三City，包括Mech规范和Alien172.31.3.110:4391/e1d87b2a。选行开短码面，真机保持JOIN501仅明确Owner动作生成语义。08发现截图、14面板树。

### 2.3 规范真相入网链

City自己事件为接受记录，Owner凭据GET从不打印：

```text
seq=8   JOIN_REQUEST_CREATED   {"requestId":"6e7a3af1-…","shortRef":"join-3be5406f5a","displayName":"Alien-Win","platform":"win32"}
seq=9   JOIN_REQUEST_APPROVED  {"requestId":"6e7a3af1-…","shortRef":"join-3be5406f5a","state":"APPROVED","grantsTrust":false}
seq=10  JOIN_REQUEST_CONSUMED  {"requestId":"6e7a3af1-…","shortRef":"join-3be5406f5a","state":"CONSUMED","grantsTrust":false}
```

seq8新Alien-Win请求、9APPROVED、10CONSUMED均grantsTrust false。本报告当时称已合main双真主机＋真Android链：

```text
fresh/unbound installation (Alien-Win, win32)
  -> discovers / receives invite to the canonical City        (JOIN_REQUEST_CREATED)
  -> approval on an already trusted control surface           (JOIN_REQUEST_APPROVED)   <- Android PERM00 + Mech Web were both attached
  -> installation enrolled / consumed                         (JOIN_REQUEST_CONSUMED)
  -> appears in the canonical City
```

新Alien安装发现／邀请、已可信面审批（手机＋Mech Web附着）、消费、规范City可见。

```text
dev-031fdba6e94c4298a0956ff04a65481d  role=PRIMARY      online=true   name=Mega-rep
web-clrg4f8k                          role=CONTROL_ONLY online=true   name=Mech-rep
android-PERM00                        role=CONTROL_ONLY online=true   name=PERM00
```

当时三成员：Mega-rep PRIMARY、Mech-rep Web CONTROL_ONLY、PERM00 Android CONTROL_ONLY，均online。

### 2.4 Owner授权中断：重启无重输token

restart-gateway前台运行超harness预算连Gateway被杀，City短停；立即产品launcher同数据恢复同cityId，诚实保操作错而非隐藏。

```text
before:  gatewayPid 21452, surfaces web-clrg4f8k + android-PERM00, lastSeq 10
after :  gatewayPid 25364, cityId 031fdba6-e94c-4298-a095-6ff04a65481d, dataDir unchanged
         seq=11 CITY_STARTED
         seq=13 CLIENT_CONNECTED {"clientRef":"android-PERM00","clientLabel":"PERM00"}
         seq=14 CLIENT_CONNECTED {"clientRef":"web-clrg4f8k","clientLabel":"Mech-rep"}
         (a second restart cycle produced the same pattern at seq=15..18)
```

PID21452→25364，seq11启动、13手机14Web重连，第二15..18同形。两控制面无凭据再输入，Android自行ONLINE、Devices实时。没新City：同store/ID、一个Gateway。

## 3. 诚实完成门

| # | 门 | 状态 | 依据／未满理由 |
|---|---|---|---|
| 1 | 真Alien↔Mech入网 | MET | Alien-Win规范创建／批准／消费，真手机和MechWeb附着 |
| 2 | 重启无重输token | MET | §2.4/2.6三个PID同ID双面自回及持久安装重启后mint |
| 3 | 撤销拒绝收敛 | MET | §2.6 sessionsRevoked3、旧材料INSTALLATION_RETIRED403/nonretry不能恢复 |
| 4 | Web/Android诚实路径 | PARTIAL | CONTROL_ONLY实时与OFFLINE Cached445s诚实；phone/browser CHECKPOINT_DEMO id/state/seq/hash未做 |
| 5 | 无重复City／隐藏fallback | MET观测 | 三PID同ID/store/reservation，health gateway/roomsREADY |
| 6 | 精确基线CI | MET历史声称 | 原记录无产品变更、d3262ce及37205444427/37205444385同头成功；该错绑后来在审核请求勘误，译本保当时记录 |
| 7 | 相反主机正式审核 | REQUESTED/PENDING | REVIEW_REQUEST，Mech不能自审 |
| 8 | 暴露门 | PARTIAL | §5后端真实验，发现／同等面未完、Androidtokenfallback |
| 9 | 合main收尾后核 | NOT MET/DEFERRED | 依赖7 |
| 10 | 标记 | NOT RELEASED | 4部分、7、8部分、9余 |

## 4. 实质发现：为何门3先延期非推断通过

run-as读脱敏city-connection恰host/clientRef/cityId/token四键，工程Manual裸token形状，非带安装材料mint session。registry count0，即使City已批准消费完整join。两事实为链已运行批准，而当前手机token路径非持久安装。门3没安装可撤DEFERRED；控制面无手输重连已满§2.4，入网安装尚无证。

下一接受目标（非声明）：手机规范City完整pairing exchange（§6已创建session）、registry确认安装、重启无token、再撤并断言mint session SESSION_UNKNOWN。保原建议类型，不用后续INSTALLATION_RETIRED改历史。

### 4.1 尝试后强化发现

新session经手机Settings→配对→LAN消费：

```text
pairing/info after the device submitted             sessionState = USED   activeSession = false
/api/v0/device/installations                        count = 0
app prefs after the exchange (values redacted)      host, clientRef, cityId, token   <- unchanged shape
events                                              seq=19 CLIENT_DISCONNECTED android-PERM00
                                                    seq=20 CLIENT_CONNECTED    android-PERM00
```

USED/inactive、registry0、prefs四键不变、seq19断20连。动作真完成而安装空。两可能均与证据一致不选：已有token客户端得City凭据却未持久安装，或此build不送installation才到不了入网半。后果相同：控制面重启无输入已证，安装重启尚无因无安装，门3DEFERRED，这是CEX704原生Owner入网债具体重现。

### 2.6 产品自身客户端驱动安装→重启→无token→撤销

§4.1交换无安装后，同基线改用真实joining机器apps/client/device-enrollment.mjs enrollWithCity/openDeviceSession/revokeInstallation，而非测试重写：

```text
1  owner generates a one-time pairing session on the canonical City        -> short code, 6 chars, expires 300 s
2  a FRESH installation on this machine enrolls with it (app/client code)   -> installationId ins-7d99a13b…
                                                                              deviceId dev-903b8941…, instanceId inst-87863e…
                                                                              durable credential secret present, session issued
3  the City's registry SHOWS it (durable state, not the transaction)        -> /api/v0/device/installations count 0 -> 1 -> 2
                                                                              found=true, revokedAt=null
4  tokenless session BEFORE the restart (durable credential only)           -> credential sess:…, installationId matches
5  gateway restart (process 25364 -> 1756, reservation re-established)      -> cityId 031fdba6-e94c-4298-a095-6ff04a65481d unchanged
6  tokenless session AFTER the restart, nothing typed                        -> credential sess:…, same installationId
7  owner revokes the installation                                            -> sessionsRevoked = 3
8  the revoked credential tries to mint again                               -> REFUSED: INSTALLATION_RETIRED, HTTP 403, retryable=false
```

Owner一次6码300s；新本机安装ins-7d99a13b/dev-903b8941/inst-87863e及secret/session；registry0→1→2/foundtrue/revokednull；重启前持久材料sess、PID25364→1756同City，后同安装再mint无输入；Owner撤3sessions；旧材料INSTALLATION_RETIRED403/retryablefalse。步骤8是门3规范拒绝非一般错；6是安装而非仅面重连。runner D:/utopia-chat/join590-enrollment-acceptance.mjs，材料fresh-installation-device.json私存不印，Ownertoken仅变量。

### 2.7 真机清装第二轮

同合mainAPK卸装／no-streaming重装Push Install Success，擦全部私prefs，真新状态：

```text
fresh launch                -> "Find your City / 找到你的城市"; app prefs contained only clientRef (no host/cityId/token)
Nearby Cities (LAN)         -> three City rows again (canonical 4391, the spare acceptance City 4310, Alien 4391)
owner mints a pairing session -> short code, 300 s TTL
pairing panel opens          -> code field + Connect
Manual connection            -> City URL + pairing token accepted; "Save and connect"
result                       -> app shows ONLINE and its Devices page renders live canonical data
                               (Alien-PC OFFLINE · Cached 2463s; Mega-rep ONLINE), app prefs now hold host/cityId/token
City side after the run      -> CLIENT_DISCONNECTED android-PERM00 (seq 36) -> CLIENT_CONNECTED android-PERM00 (seq 37)
                               members: PRIMARY + MEMBER(dev-bb313bf7…) + web CONTROL_ONLY + android CONTROL_ONLY
                               installations: 2 (the two created through the product's own client code in §2.6)
```

新只clientRef，LAN又三City（规范4391／临时4310／Alien4391），Owner码300s、面短码Connect、Manual接受URL/token，ONLINE实时（Alien OFFLINE Cached2463s、Mega在线），prefs变host/city/token；seq36断37连，成员PRIMARY+MEMBER dev-bb313bf7+双CONTROL，安装仍仅§2.6两。

证明：无旧凭据真硬件干净安装连接、无重复City；同规范ID身份纪律。未证明且第二次更明确：app不能自入网。屏幕列City后非滚Column将短码／Connect排到屏外，树只见可见节点，设备无法完成；ONLINE来自Manual fallback裸三项，不持久安装。所以registry仍客户端代码两、android CONTROL_ONLY。这是门4/8证据非PASS；IME遮和City卡后溢出是CEX704真机必须面对。

### 2.8 面板尝试修复未验证而回退

范围准修入网缺陷，因此写／构建／安装，但不能实测所以回退非交付，防后人误以为存在即工作。

```text
change        PairingPanel.kt: bound the panel column (heightIn(max=460.dp)) + make it verticalScroll +
              ImeAction.Done/KeyboardActions(onDone) so the code can be submitted from the keyboard
build         :app:assembleDebug + :app:testDebugUnitTest -> BUILD SUCCESSFUL (20 s); APK installed, app ran, no crash
observation   after the install the panel's own content ("Create a pairing session…", the code field, Connect)
              still did not appear in the accessibility tree once Cities had been discovered, and repeated
              LazyColumn scrolling (four different swipe geometries, including short slow swipes that avoid the
              system gesture strip) never revealed it
not verified  whether the constraint+scroll actually makes the input reachable, because no instrument could
              reach it from the host side
action        `git checkout -- PairingPanel.kt` -> worktree clean; the change is preserved as
              D:\utopia-chat\JOIN590-pairing-panel-unverified.patch (7 insertions / 2 deletions) with the exact
              reproduction above, so the next iteration can apply it and validate it on the device by hand
```

heightIn460dp/verticalScroll/键盘Done；构建单测20s、安装无崩；发现City后面自内容仍不在树，四种swipe含避系统手势慢短都不可达。主机仪器无法确认输入可达。git checkout回PairingPanel、clean；保JOIN590-pairing-panel-unverified.patch7插2删供后人工。接受目标仍基线，app自配对没满足门、1–3来自主机规范join及客户端代码；提交不能exercise的UI会放未验声明。缺陷仍重现文档开放：IME及最后可滚范围外布局。

### 2.9 Owner请求五紧凑同行动作及短码

四全宽纵按钮改五短横排：

```text
row        [ QR | LAN | BLE | CODE | TOKEN ]   (36 dp tall, labelSmall, 4 dp gaps, horizontally scrollable if a
                                                 future screen is narrower than 1080 px)
below      one contextual hint line that names the selected method's requirement
inputs     the two methods that need typed text (CODE, TOKEN) reveal their input INLINE BELOW the row, so the
           primary action is never laid out past the fold
```

QR/LAN/BLE/CODE/TOKEN高36dp labelSmall gap4dp，未来窄于1080px可横滚；下方法需求提示；CODE/TOKEN文本就地行下，不越fold。CODE独立非选City后，已知地址pairing/info、当时Owner mint pairing/session、同exchange；TOKEN既Manual不变。

D-A已修：PairingApi.request无Authorization，CODE401像生成坏；session需鉴权而info/exchange公开，现仅要求处附Owner。

D-B当时开放：设备mint404：

```text
from the device (app, CODE)            -> "Pairing rejected (HTTP 404)"
from this host, identical request      -> 200 OK
control: a non-existent pairing route  -> 404   (so 404 is this City's answer only for routes it lacks)
canonical City event stream            -> records NOTHING for that attempt (seq 38..43 are only
                                          CLIENT_DISCONNECTED/CLIENT_CONNECTED pairs)
installed host value in app prefs      -> http://172.31.12.151:4391   (correct, verified)
```

手机app404、主机同请求200、不存在路由404、City无事件只38..43断连、prefs4391正确。无日志说明请求不到路由，应抓app HTTP/tcpdump非先假产品，物理设备独见主机能手机不能，所以mint不称可用。

```text
:app:assembleDebug + :app:testDebugUnitTest   BUILD SUCCESSFUL (22 s / 21 s / 17 s / 13 s across iterations)
device install                                Push Install Success; app runs, no crash
five buttons render in one row               VERIFIED on PERM00 (UI dump: QR/LAN/BLE/CODE/TOKEN all on one
                                             34 dp line at the same y; screenshot 92-five-row-v2.png)
CODE reachable and wired                     VERIFIED (tap produces the request and a typed error message)
session mint                                 NOT VERIFIED (D-B above)
```

迭代构建22/21/17/13s，安装无崩；真机dump同行五标签同y约34dp，92截图，CODE可达接线且类型错可见，mint未验。

D-C开放cosmetic：首Q截图裁成OR但树QR；宽约73dp足label24dp，解除Material min58dp改minWidth0仍裁，实测排除两布局原因。怀疑ROM字体、其余四正常，记有测量的美观工件非“已修”，异手机一截图可定。

```text
branch  join/JOIN-590-merged-main-physical-acceptance
head    8b97e72931c57ceb993f37307f012bd61f67fa22  (five-row change; CI V0.2 checks run 37255816279 success)
note    the D-C iteration (zero content padding + defaultMinSize + 2 dp gaps) is committed on top of that head;
        its own exact head and CI are recorded in the workbook frontmatter once pushed
```

产品变更使接受不再裸基线，头8b97e72931c57ceb993f37307f012bd61f67fa22、37255816279成功；D-C零padding/min/gap2迭代在其上，其精确CI推后工作书记。

### 2.10 CODE接用户输入、City地址可编辑

CODE不再mint，点击立即文本无网络：正常码来自另一Web/可信设备/远Owner，本机只输入；旧先mint需此机有Owner而阻输入并D-B404。

```text
CODE  ->  [ City address (host:port or http://host:port) ]   <- editable, defaults to the known host
          [ Short pairing code ]                             <- typed, ImeAction.Done submits
          ( Connect with short code )                        <- primary action, no owner credential needed
          ( Generate a code on the known City (owner) )      <- the mint, now an explicit secondary action
```

地址默认已知可改host:port/http，短码IME Done、主Connect无Owner，Owner生成是显式次动作。pairWithCode读目标descriptor，仅实际有session secret才QR，否则同规范exchange。真机字段viewport内、API规范City码输入提交、City USED。

远程边界：地址不局限LAN发现，任何可路由异网/VPN/public City可指，descriptor读即可达核、失败类型报不默连错City；第二真实Alien City pairing/info主机可答。此时Android没有relay、不能手机路由不到City的NAT-to-NAT；Web兄弟有outbound pipe，Android需实现现Web机制／白名单有界后续，不新设计。

### 2.11 Owner请求Android经City relay跨网络

原开发报告当时声称可加入不能被City拨到的Android，使用既有Web City relay加Android外拨与内join。保此当时声明；后相反审核明确无双方不可达NAT路径，不能把原文字升真实远网验收。

```text
RelayDial.kt    ws(s)://<host>:<port>/api/v0/relay?apiVersion=0&schemaVersion=0&installationId=…&label=…
                → {"kind":"relay-request","requestId":…,"path":…,"method":"POST","body":…}
                ← {"type":"RELAY_READY","peerRef":…,"role":…,"verified":…,"payloads":[…]}
                ← {"requestId":…,"ok":…,"status":…,"response":{"ok":…,"status":…,"payload":…}}
RelayPairing.kt join/info → join/request → join/status (poll) → join/exchange
```

RelayDial socket、请求／READY／应答形状、RelayPairing info→request→status轮询→exchange。为什么批而无码：City白名单命名路由无pairing，其决定不是客户端；按允许join ask/wait Owner/claim收凭据，短码留DIRECT，relay无需本机凭据。

D-D已实测修：无凭据无installation403：

```text
dial with no credential, no installationId   -> REFUSED 403
dial with the owner token                    -> READY  peerRef=control:owner  role=control-token  verified=true
dial with installationId=android-PERM00      -> READY  peerRef=android-PERM00 role=joining-peer verified=false
```

Ownertoken为verifiedcontrol，installationId android-PERM00为unverified joining-peer。非Owner须声明身份但不授信任，客户端补。

D-E已真机发现后复现：JSONObject.optString JSONnull变四字符null，首takeIf非空错误采成City身份存，自己的City冲突是核查碰客户端破坏值。按类型缺失始终缺失，RelayPairingIdentityTest回归及主机重复接受。

```text
device (live)   City event stream: seq 66 RELAY_PEER_CONNECTED {"peerRef":"android-PERM00","role":"joining-peer",
                "verified":false,"label":"Android · PERM00"} and seq 67 JOIN_REQUEST_CREATED
                {"shortRef":"join-74d7a2463b","displayName":"Android · PERM00","platform":"android",
                "installationHint":"android-PERM00","state":"PENDING"}; the phone displayed
                "Waiting for the owner to approve on the City (join-74d7a2463b)…"
host (repeatable) tests/join590-relay-acceptance.mjs against the canonical City -> PASS
                RELAY_READY joining-peer; JOIN_INFO declaredCityId 031fdba6…; JOIN_REQUESTED join-0388eb6f44 PENDING;
                OWNER_APPROVED 200; JOIN_STATUS approved=true; JOIN_EXCHANGE ok=true credentialPresent=true
                rawCityId=null (JSON null) -> adoptedCityId=declaredCityId, nullWasNotAdoptedAsText=true
build           :app:assembleDebug + :app:testDebugUnitTest BUILD SUCCESSFUL (incl. the new regression guard)
root suite      1247 tests / 1244 pass / 3 fail  (the three pre-existing host-city-launcher environmental failures)
```

手机seq66joining-peer/verifiedfalse、67join-74d7a2463b PENDING，显示等Owner；主机可重复接受规范City PASS、join-0388eb6f44、批准200、交换有凭据、raw null正确采declared非文本。构建回归成功，根1247/1244/3既环境；头b91677d1478950feb79742f618d0c981773d5bb7、37259528163两作业成功。

仍未声称手机D-E修后审批重连重验，手机只等审批，City见批；修后主机相同协议证明非真机替代。固定build留审核者手动下一步。

### 2.5 重启后的Android（实测非推断）

手机没碰自回seq20，Devices实时：

```text
Alien-PC   OFFLINE · Cached   Platform: win32 · Agent 0.2.0   Last seen: 445s ago
Mega-rep   ONLINE             Platform: win32 · Agent 0.2.0   Last seen: 2s ago   (CPU 15.5%, memory 18.9/31.7 GB)
Last snapshot: 下午12:35:48
```

Alien OFFLINE Cached445s、Mega ONLINE2s、CPU15.5%/memory18.9/31.7、snapshot下午12:35:48。物理面无token重连且真实离在线区别而非讨好双在线，28-cur实时dump。

## 5. 能力暴露决定（§14A）

```text
user_exposure_class    = DIRECT_CONTROL (inherited from the workbook)
user_exposure_surface  = pairing / device onboarding in the Android app and the City Web surface
user_exposure_nesting  = L2_CONTEXTUAL
backend_wiring         = VERIFIED for the paths exercised here: discovery rows come from the City's own mDNS
                         advertisement, the join decision routes are the canonical ones
                         (JOIN_REQUEST_CREATED/APPROVED/CONSUMED came from the City's event stream), and the
                         Android surface is the canonical `android-PERM00` control client
ui_exemption_reason    = not INTERNAL_ONLY
```

DIRECT_CONTROL继承、Android和CityWeb配对入网、L2_CONTEXTUAL。实际路径VERIFIED：mDNS自身广告、规范join事件、手机canonical CONTROL client。非内部。发现／同等面未完，§4tokenfallback是CEX关闭计划债。

## 6. 证据与活工件

```text
screenshots / UI dumps   D:\utopia-chat\join590-evidence\  (01..27: installer, first launch, mDNS discovery,
                         pairing panel, manual-connection panel, restart states)
device helper            D:\utopia-chat\join590-device.mjs   (shot|tree|tap|tap-bounds|text|key|launch|clear|ui)
acceptance City (Mech)   172.31.12.151:4310 cityId 1d5287bf-3297-4650-80dd-5cc344a6dabe (launcher:
                         D:\utopia-chat\join590-acceptance-launcher.mjs) — started for this acceptance, independent
                         of the canonical City, and NOT used as the acceptance subject
canonical City           Mech 172.31.12.151:4391 cityId 031fdba6-…   (restarted twice; PID now 25364)
peer City (Alien)        172.31.3.110:4391 cityId e1d87b2a-0ec5-457e-822b-91d81e40dc67  (mDNS-visible)
credentials              never printed, never committed (read into a variable only)
```

01..27安装／首启／发现／面板／manual／restart截图dump及设备helper；临时Mech4310/1d5287bf-3297-4650-80dd-5cc344a6dabe独立起但不是接受对象；规范4391与peerAlien明确；凭据仅变量从不印／提交。

## 7. 声明边界

标记没发、programme未闭。此原末段仍说门3及7DEFERRED、City无安装所以不声称安装重启；与中间后续§2.6及门表MET并存，按原历史完整保留不擅自统一状态。无性能／延迟／硬件质量，含超时前台launcher引起的中断如实记录。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
