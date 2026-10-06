# JOIN-590 Android修补 — 相反主机真机核验

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留所有历史失败、门缺口及原证据，元数据仅代码围栏引用。

```text
REQUESTED BY     owner, 2026-10-05: "检查Alien对Android部分的修补，通过后允许标注此任务完成"
PERFORMED BY     Mech (MEGA-REP), role Mech-DS - the opposite physical host to the repair author Alien-codex
SUBJECT          PR #28 review/JOIN-590-Alien-codex
  head verified  0ea9203d3409a59194675d48d93950c7af9fb92f   (deployed to the resident City, physically exercised)
  head at report 62e9bad92b70af3098da8ce421becf99d8c6d00c   (3 further commits, ALL under evidence/, product code
                                                             byte-identical: `git diff --name-only 0ea9203d 62e9bad9`
                                                             = 28 files, none outside evidence/)
BASE             d3262ce2dd81e51a53e39e6f9add8dee650a7682   (origin/main at the time; unchanged since)
HANDSET          OPPO PERM00 / BICIPVNB5HS85H9T, real hardware, not an emulator
VERDICT          PASS - the Android repair does what it claims, measured on the device
```

Owner2026-10-05要求检查Alien Android修补、通过允许标完成。Mech与Alien作者相反物理主机。PR28实测部署0ea9203d3409a59194675d48d93950c7af9fb92f，报告时62e9bad92b70af3098da8ce421becf99d8c6d00c仅多三evidence提交，28文件全在evidence、产品逐字一致；main基线d3262ce2dd81e51a53e39e6f9add8dee650a7682当时未变。真OPPO非模拟，裁决Android修补真机PASS。

## 1. 检查及仪器

```text
AUTHOR'S INSTRUMENT      gradlew :app:testDebugUnitTest + :app:assembleDebug (JDK 17.0.18)
                         -> BUILD SUCCESSFUL, 41 tasks, 3m18s. NativeEnrollmentTest and RelayPairingIdentityTest run.
MY INSTRUMENT            the physical handset against the live 4391 City, driven through the app's own UI
                         (adb input/UI dump/screenshot), with the app's PRIVATE preferences read back through
                         `run-as` and cross-checked against the City's owner-side installation roster.
LIMIT STATED HONESTLY    the unit tests run on the JVM against org.json:json:20180813, where optString() does NOT
                         reproduce the android.jar quirk the repair guards against (a JSON null becoming the text
                         "null"). The unit test therefore documents the rule but cannot, by itself, prove it on a
                         device - which is why the decisive evidence below is physical.
```

作者JDK17.0.18单测＋APK41任务3m18s成功，含NativeEnrollment/RelayIdentity。审核仪器是真手机对实时4391、自己的UI adb输入／dump／截图，run-as私prefs回读并City Owner安装表交叉。诚实边界：JVM org.json20180813 optString不复现android.jar JSON null变字面null；单测只文档化规则，单独不能证真机，决定证据为物理。

## 2. 源码修补

```text
services/dev-gateway/server.mjs   (2 lines vs base)
  pairing/session  now refuses a City session: `SESSION_CANNOT_MINT_PAIRING` (403) - a joined phone may not hand out
                   pairing codes;
  pairing/exchange now returns the durable `credential: sess:...` with the enrollment - before this, the phone enrolled
                   but received nothing it could reconnect with.

apps/android .../NativeEnrollment.kt (new)
  parseNativeEnrollment REQUIRES credential to start with `sess:` and REFUSES an owner-token fallback
  ("Member session required; owner-token fallback refused"), checks cityId and instanceId against the expected values,
  rejects missing/JSON-null fields, redacts secrets in toString.
  NativeEnrollmentStore binds the material to the exact endpoint + cityId, and markRetired() clears the token and the
  pending identity.

apps/android .../RelayPairing.kt + RelayPairingIdentityTest.kt
  `textOrNull` decides by JSON TYPE (isNull) and not by the letters, so a JSON null can never again be adopted as the
  identity string "null" - the defect that made the phone refuse its own City with "City identity conflict".

apps/android .../CityClient.kt
  renewSession() re-opens the device session from the stored material, validates cityId + protocol, requires a `sess:`
  credential, and on 403/404 marks the enrollment RETIRED, clears the token and refuses to reconnect
  ("Device enrollment retired · join again with owner approval"). Redirects are disabled, and a 401/403 retries once
  through renewal instead of silently falling back.
```

Gateway对比基线两行：City session不能mint配对SESSION_CANNOT_MINT_PAIRING/403；交换返回持久sess凭据，此前入网却无重连材料。NativeEnrollment必sess并拒Owner回退，核City/instance、拒缺／JSON null、toString脱敏；Store绑精确endpoint＋City，markRetired清token和pending身份。Relay textOrNull按JSON isNull类型而非字母，不采null为身份，修手机误拒City冲突。CityClient从存材料续session、核City/protocol及sess；403/404退休清token拒重连，提示重新Owner审批。禁redirect，401/403只续期重试一次不静默回退。

## 3. 逐步物理证据

```text
STEP 1  fresh install      uninstall + install of the debug APK built from the verified head (pm clear is refused by
                           this handset's OEM), app launched to "Find your City / 找到你的城市"
STEP 2  LAN discovery      tapping LAN found "Utopia · Mega-rep" http://172.31.12.151:4391
                           cityId 031fdba6-e94c-4298-a095-6ff04a65481d  - the phone discovered the real City on this LAN
STEP 3  join               owner minted a one-time pairing session (owner act) -> code entered on the handset
STEP 4  enrollment         City events 183 DEVICE_ENROLLED, 184/185 DEVICE_SESSION_ISSUED, 186 CLIENT_CONNECTED
                           City roster: installation ins-896a709c2156f48cb5b5b4a6972bf125, deviceId
                           dev-8b20a1577f0540a29dbbdd43c8257cad, "Android · PERM00", state BOUND
                           phone prefs: token = "sess:..." (NOT the owner token), credentialId
                           cred-86435a3e48e2bc36d9c840f0469095c8 - IDENTICAL to the City's record,
                           enrollmentEndpoint/host = http://172.31.12.151:4391, cityId matches, installationRetired=false
STEP 5  tokenless
       reconnect           City restarted (coordinator PID 5092 -> 34976), the handset was NOT touched:
                           event 189 CLIENT_CONNECTED "Android · PERM00" appeared by itself.
                           This is workbook completion condition 2, on real hardware.
STEP 6  revoke             owner revoked the installation: {"sessionsRevoked":2}, state -> RETIRED, events
                           191 DEVICE_REVOKED, 192 MEMBER_REVOKED, 193 CLIENT_DISCONNECTED "Android · PERM00",
                           and NO DEVICE_ENROLLED afterwards - no silent re-enrollment.
                           Replaying the phone's stored material against /device/session -> HTTP 403.
                           Phone prefs flipped: installationRetired=true, token EMPTY, pending identity removed.
                           Phone UI: OFFLINE with "Device enrollment retired · join again with owner approval".
                           This is workbook completion conditions 3 and 4, on real hardware.
```

1 OEM拒pm clear，用卸装实测头debug，新应用找City。
2 LAN发现Utopia Mega-rep、4391及精确City，真实本LAN。
3 Owner行为mint一次配对session，手机输入码。
4 183 DEVICE_ENROLLED、184/185 SESSION_ISSUED、186 CLIENT_CONNECTED；表安装ins-896a709c2156f48cb5b5b4a6972bf125、dev-8b20a1577f0540a29dbbdd43c8257cad、Android PERM00 BOUND。手机sess非Owner、cred-86435a3e48e2bc36d9c840f0469095c8与City相同，endpoint／City匹配、retired false。
5 City coordinator5092→34976，手机没碰，189自行连接，真实条件2。
6 Owner撤安装sessionsRevoked2、RETIRED，191 DEVICE_REVOKED/192 MEMBER_REVOKED/193断，后无再ENROLLED；旧材料/device/session403，prefs退休true、token空、pending删，UI OFFLINE退休重新审批，真实条件3/4。

有界证据原位evidence/raw/mission-book/PR28-4391-DEPLOYMENT/android-physical-verification：手机表、脱敏prefs、ONLINE／退休截图、步骤4–6事件尾。

## 4. 头CI分类

```text
pull_request run 37305080096 on 62e9bad9   -> SUCCESS (gateway-web, android, City linkage check)
push run        37305073567 on 62e9bad9   -> FAILURE, one test:
                  tests/host-city-launcher.test.mjs "two installation launchers share one City ..."
                  Error: HOST_SCAN_TIMEOUT: Could not confirm existing host Gateways; no City may be started
                  (powershell Get-CimInstance Win32_Process did not answer inside the scan budget)
CLASSIFICATION    environment / runner, NOT a code defect: the identical head is green in its pull_request run, the
                  failing assertion is the deliberate "an unconfirmed host inventory must not authorize a new City"
                  refusal, and the three commits added since the verified head touch evidence/ only.
```

62e9bad9 PR37305080096及两作业/linkage成功，push37305073567 host-city-launcher一次HOST_SCAN_TIMEOUT，PowerShell Get-CimInstance没在预算答。报告归环境runner非代码：同头PR绿、拒绝逻辑是未确认主机不能授新City、三个新增仅证据。保留此原分类，不升级整体双事件均绿。

## 5. 完成仍缺及不发布标记理由

```text
Workbook completion requires ten conditions. This report closes the physical Android path (2, 3, 4) and records
evidence for 5 and 6. Condition 9 - "merged-main post-closeout verification" - is NOT satisfied, and the terminal
marker is literally named CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED.

PR #28 is still a DRAFT and its author is ACTIVE: branch commits at 22:14, 22:34 and 22:46, and control-plane commits by
Alien-codex at 22:36, 22:41 and 22:47 ("record native physical Mech membership acceptance evidence", "verify window6 CI
and distinguish reported Mech deployment source", "verify Mech City restart and reconcile review scope"). Marking the
task complete now would therefore (a) release a merged-main marker while the merge has not happened, and (b) cut across
the reviewer's in-flight work on the same acceptance - which CONSTRUCTION_RULES section 12 forbids.

MINIMUM PATH TO COMPLETION (owner decision required, since it touches another host's draft):
  gh pr ready 28            (leave draft)
  gh pr merge 28 --merge    (JOIN-590 declares merge_authority: true; the pull_request checks are green)
  verify the merged-main V0.2 checks + City linkage check on the merge commit
  then set status COMPLETE / review_complete true and release CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED
```

十条件中此报告闭Android2/3/4并记5/6，条件9合main后核未满，标记名明确MERGED_MAIN。PR28当时draft且作者22:14/34/46仍提交，控制22:36/41/47仍记录实物／CI／部署／范围；此时标完整会未合先发标并跨正在审核工作，§12禁。最小完成路径当时需Owner因涉及他机draft：ready28、merge28--merge（JOIN590权限true、PR绿）、核合提交V0.2+linkage，然后工作书COMPLETE/review true及标记。

## 6. 给审核者的建议（非强加）

4391运行实测头代码。若Alien范围需别部署，D:/utopia-pr28 deploy/PR28-4391可用stop/start -BindAddress172.31.12.151 -Port4391换版本，同状态目录保City及成员。

语言配对 / Language pair: [English](../ANDROID_REPAIR_VERIFICATION_Mech.md) · [中文](./ANDROID_REPAIR_VERIFICATION_Mech.md)
