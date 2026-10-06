# JOIN-590 — 最终物理接受／审核收据

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留所有历史失败、门缺口及原证据，元数据仅代码围栏引用。

```text
WORKBOOK            mission-book/connection-onboarding/JOIN-590-merged-main-physical-acceptance-and-closeout.md
TASK                JOIN-590  (Connection Onboarding merged-main physical acceptance and closeout)
EXECUTED BY         Mech (COMPUTERNAME MEGA-REP), role Mech-DS  - development host
TESTED EXACT SHA    322162e900672ccfda12f2590d3562eb81bc128e
                    = b91677d1478950feb79742f618d0c981773d5bb7 (previously accepted repair head)
                      + ec3b6f996240ca71505b3b67af12cc222d1b283a (minimal repair, cherry-picked, authorship preserved)
BRANCH              join/JOIN-590-merged-main-physical-acceptance
MERGE PR            zhiheng-zhang-Mera/utopia#29   (base main)
BASE                d3262ce2dd81e51a53e39e6f9add8dee650a7682  (origin/main; ahead 5 / behind 0)
REAL HARDWARE       OPPO PERM00 / BICIPVNB5HS85H9T  (adb: device, not an emulator)
CITY UNDER TEST     http://172.31.12.151:4391   cityId 031fdba6-e94c-4298-a095-6ff04a65481d
                    gateway started from D:/utopia-join590 @ the tested SHA, state dir C:\ProgramData\Utopia\host\city
EVIDENCE            mission-book/reports/JOIN-590/evidence/android-closed-loop/
VERDICT             PASS - the required chain holds on this exact head
TERMINAL MARKER     CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED  (released only after the merged-main
                    verification recorded in section 6)
```

Mech开发实测322162e900672ccfda12f2590d3562eb81bc128e，为旧接受b91677d1478950feb79742f618d0c981773d5bb7加未改保作者ec3b6f996240ca71505b3b67af12cc222d1b283a。PR29 base main，ahead5/behind0；真OPPO、精确Mech City、工作树及状态目录见元数据。所需链此头PASS，标记只在§6合main核后发布。

## 1. 所需链与每步实测

```text
真实 Android join → approval → enrollment → restart/reconnect → revoke → restart/reconnect refused
```

真实Android入网→审批→注册→重启／重连→撤销→重启／重连拒。

### 步骤1 — relay入网／Owner批／发凭据／双方见注册

```text
METHOD      the handset was wiped (uninstall + install of the APK built from the tested SHA), then:
            CODE panel → City address http://172.31.12.151:4391 → ticked "Remote / cross-network (relay pipe)"
            → short code field left EMPTY (the repaired head permits the pure approval path)
            NOTE ON PROOF: the pre-repair head required a non-blank code to enable the button, so a join there
            could not be attributed to the relay. Here the field is empty and no pairing session was minted at all:
            the only path that can authorise this join is the owner's approval over the relay.

PHONE       "Waiting for the owner to approve on the City (join-de3513bc07)…"
CITY        218 RELAY_PEER_CONNECTED      peer=dev-7df0f3d9c5b143228dffaa73e7f15dcb  role=joining-peer
            219 JOIN_REQUEST_CREATED      shortRef=join-de3513bc07
            request row: displayName "Android · PERM00", platform android,
                         installationHint dev-7df0f3d9c5b143228dffaa73e7f15dcb, grantsTrust=false, isIdentity=false
OWNER       POST /api/v0/join/requests/89657721-…/approve  → state APPROVED (decidedAt 2026-10-05T12:36:34Z)
CITY        220 JOIN_REQUEST_APPROVED → 221 JOIN_REQUEST_CONSUMED (full tail in city-events.json)

CREDENTIAL (the crux - asserted, not assumed)
            phone SharedPreferences token = "sess:…" (37 chars)
            token == owner credential?  FALSE      (the pre-repair head answered TRUE here)
CITY SIDE   installation ins-89b1220ec320061505dd69418d25639f, deviceId dev-7df0f3d9c5b143228dffaa73e7f15dcb,
            displayName "Android · PERM00", state BOUND, enrolledAt 2026-10-05T12:36:34.414Z,
            credentialId cred-675fa46db949cc6c7d49894079db2600
PHONE SIDE  installationId ins-89b1220ec320061505dd69418d25639f, instanceId inst-94cdc199876345cb9543bcd41c8beb1d,
            credentialId cred-675fa46db949cc6c7d49894079db2600, enrollmentEndpoint http://172.31.12.151:4391,
            cityId 031fdba6-e94c-4298-a095-6ff04a65481d, installationRetired false
            -> the SAME installation and the SAME credential on both sides: enrollment is visible to each party.
PHONE UI    ONLINE, Devices page showing live telemetry          evidence: 01-enrolled-online.png
```

卸装实测APK，从CODE填4391勾Remote relay，短码留空；旧头非空才能按钮使relay归因不明，此头无码且没mint pairing session，唯一授权为Owner relay批准。手机join-de3513bc07等，City218 peer joining、219请求、displayName Android PERM00/platformandroid、installationHint dev且grantsTrust:false/isIdentity:false。Owner2026-10-05T12:36:34Z审批、220批准221消费。

关键逐项断言：手机token sess37字符、不是Owner（旧头是）；City安装ins-89b1220ec320061505dd69418d25639f与device dev-7df0f3d9c5b143228dffaa73e7f15dcb，BOUND于12:36:34.414Z，cred-675fa46db949cc6c7d49894079db2600；手机同安装／凭据、inst-94cdc199876345cb9543bcd41c8beb1d、精确endpoint/City、retiredfalse。双方同对象可见，UI ONLINE与实时遥测、01截图。

### 步骤2 — 重启无手输凭据重连

```text
ACTION      scripts\stop-city.ps1  →  scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391
            (coordinator PID 33924 → 10984); the HANDSET WAS NOT TOUCHED and nothing was typed on it
CITY        227 CITY_STARTED → 228 NODE_ONLINE →
            229 CLIENT_CONNECTED dev-7df0f3d9c5b143228dffaa73e7f15dcb (Android · PERM00)
            the device renewed its own session from the stored material; no owner token was involved
PHONE UI    ONLINE again                                         evidence: 02-after-restart-reconnected.png
```

stop/start4391 PID33924→10984，手机没碰／没输入。227 CITY_STARTED、228 NODE_ONLINE、229同dev连接，由自身存材料续期非Owner。手机ONLINE、02截图。

### 步骤3 — 撤销后双重启仍拒，无静默恢复

```text
REVOKE      POST /api/v0/device/installations/ins-89b1220ec320061505dd69418d25639f/revoke {reason: left_by_device}
            -> {"revoked":{"installationId":"ins-89b1220…","deviceId":"dev-7df0f3d9…","sessionsRevoked":2},"scope":"CITY"}
CITY        231 DEVICE_REVOKED → 232 MEMBER_REVOKED → 233 CLIENT_DISCONNECTED  (all dev-7df0f3d9…)
            NO DEVICE_ENROLLED event follows anywhere in the log: the device does not re-enrol itself
REFUSAL     replaying the phone's own stored material (installationId + instanceId + credentialId +
            credentialSecret, read back from the device) against POST /api/v0/device/session  ->  HTTP 403
PHONE       token emptied, installationRetired=true, pending identity removed;
            UI: OFFLINE with "Device enrollment retired · join again with owner approval"
RESTART     BOTH sides were restarted again (City PID 10984 → 29048 AND the app force-stopped/relaunched):
            234 CITY_STARTED → 235 NODE_ONLINE → 236 CLIENT_CONNECTED dev-5bbb22fa… (an older, unrelated device)
            → 237 CLIENT_CONNECTED web-clrg4f8k (the Web page).  dev-7df0f3d9… NEVER REAPPEARS.
            the old material is still refused: HTTP 403;  phone still installationRetired=true with an empty token
PHONE UI    OFFLINE + "Device enrollment retired · join again with owner approval"
            evidence: 04-revoked-device-refused.png
```

撤ins reason left_by_device、sessionsRevoked2 scopeCITY；231/232/233撤设备／成员／断。后日志无ENROLLED。读手机自己完整材料重放/session403；token空、retiredtrue、pending移，OFFLINE退休文案。City10984→29048及app force-stop/relaunch，234/235启动在线、236旧无关dev-5bbb22fa、237 Web；被撤dev从不重现，材料仍403，04截图证明。

## 2. 首次阻塞与最小修复

先跑旧b91677d，链不成立，实测非猜：

```text
b91677d OBSERVED
  join/approve worked and the phone reached ONLINE, but:
    * the phone's stored token was BYTE-IDENTICAL to the City's OWNER credential
      (SHA-256 prefix 71EF027362A8 on both; `token -eq ownerToken` = True), because join.exchange releases the City's
      existing control credential on this head; and
    * NO installation was created for the join (the roster contains no row for it), so the device appears only as
      CONTROL_ONLY and there is no object a revoke could target.
  CONSEQUENCE: step 3 is not merely failing, it is IMPOSSIBLE on this head - a revoked-looking device would keep full
  owner control, which is precisely the "old identity/credential must not silently recover" requirement.
  Step 2 also "passed" for the wrong reason: the phone reconnected because it held the owner credential, not because of
  a durable per-device enrollment.
  (Also measured on this head: the relay UI demanded a non-blank short code to enable the connect button even though the
  relay path does not use the code at all.)

MINIMAL REPAIR APPLIED
  ec3b6f996240ca71505b3b67af12cc222d1b283a was cherry-picked onto b91677d, unchanged, authorship preserved:
    gateway   POST /pairing/session refuses a City session (SESSION_CANNOT_MINT_PAIRING, 403);
              the joining device receives a `sess:` member credential with a real enrollment;
    android   the client persists that enrollment in app-private storage bound to the exact City+origin, renews its own
              session, refuses an owner-token fallback, and on refusal marks the installation retired instead of silently
              recovering.
  NOTHING ELSE WAS CHANGED: no new pairing mode, no relay redesign, no UI refactor, no unrelated fix. The QR glyph
  clipping the owner excluded was left alone.
  After the repair the whole chain was re-run FROM STEP 1 on the new head - the results in section 1 are that re-run.
```

批准ONLINE却手机token逐字等Owner，双方SHA前71EF027362A8、eq true；join.exchange释放既有控制凭据。无对应安装，仅CONTROL_ONLY，无可撤对象，所以步骤3不只是失败而是此头不可能，表面撤仍全Owner。步骤2因Owner token重连是假理由通过；relay还需闲非空码。

原ec3b6f9保作者未改cherry-pick：Gateway拒成员mint／真正成员sess及入网；Android私存绑City+origin、续自身、拒Owner回退、拒绝即退休不自恢复。没新配对mode、relay重设计、UI重构、无关修；Owner排除QR裁切未动。新头从步骤1完整重跑，§1即结果。

## 3. 实测头验证

```text
node --test tests/join590-native-enrollment.test.mjs                       1/1 pass
node --test tests/join503-enrollment.test.mjs tests/join502-review-probes-v2.test.mjs
             tests/join501-review-falsification.test.mjs                15/15 pass
gradlew :app:testDebugUnitTest :app:assembleDebug (JDK 17.0.18)           BUILD SUCCESSFUL
City/APK provenance   gateway process started from D:/utopia-join590 @ 322162e…; the APK installed on the handset was
                      built from the same tree, so both halves of the chain are the tested SHA.
```

native enrollment1/1，503＋502审核＋501证伪15/15，JDK17单测构建成功。Gateway从D:/utopia-join590实测树起，手机APK同树，两半同SHA。

## 4. 原始有界可查索引

```text
evidence/android-closed-loop/city-events.json            the City's own event log for the whole run (seq 199-237)
evidence/android-closed-loop/city-join-requests.json     the join request rows incl. join-de3513bc07 and its decision
evidence/android-closed-loop/city-installations.json     the installation roster incl. ins-89b1220e… in state RETIRED
evidence/android-closed-loop/phone-prefs-after-revoke.xml the device's own storage after the revoke (secrets redacted)
evidence/android-closed-loop/01-enrolled-online.png      ONLINE on the handset after enrollment
evidence/android-closed-loop/02-after-restart-reconnected.png  ONLINE again after the City restart, phone untouched
evidence/android-closed-loop/04-revoked-device-refused.png     OFFLINE + "Device enrollment retired …" after both restarts
```

city-events全seq199–237；join请求含本次决定；installation含RETIRED；手机撤后脱敏prefs；01入网ONLINE、02City重启手机未碰ONLINE、04双重启退休OFFLINE。路径保原始证据身份，不由译本生成日志。

## 5. 工作书条件映射

```text
1  real Alien↔Mech physical onboarding run     PARTIAL BY DESIGN: the Alien Windows host was NOT available to this
                                               session; the run used the real Mech City + the real Android handset. The
                                               single-host limitation is stated rather than hidden, exactly as the
                                               claim record already recorded it as a deferred seam.
2  restart tokenless reconnect                 PASS  (section 1 step 2)
3  revoke refusal                              PASS  (section 1 step 3, incl. both-sides restart)
4  Web/Android user path truthful              PASS  (phone shows OFFLINE + the retired reason; no false ONLINE)
5  no duplicate City / no hidden local fallback PASS  (the client refuses an owner-token fallback, requires `sess:`,
                                               and never starts a City of its own)
6  exact baseline/head CI green                PASS  (section 6)
7  opposite-host Formal Review                 record: review_host Alien-codex; the review's repair is what this receipt
                                               verifies, on the opposite host to its author
8  Capability Exposure Gate PASS               recorded in the workbook (DIRECT_CONTROL, L2_CONTEXTUAL)
9  merged-main post-closeout verification      see section 6
10 terminal marker                             released in the workbook after section 6
```

1 Alien↔Mech真实拓扑PARTIAL BY DESIGN，Alien Windows此会话不可用，只真Mech＋手机、领取已记延期接口；2无输token重连PASS；3撤销含双重启PASS；4Web/Android诚实OFFLINE原因PASS；5不造City／不隐藏回退PASS要求sess拒Owner；6CI PASS§6；7review_host Alien-codex，其修补在作者相反Mech实测；8工作书记DIRECT_CONTROL L2_CONTEXTUAL；9合main§6；10随后发布标记。保留条件1单机边界。

## 6. 合并及main后核

```text
EXACT-HEAD CI    on 322162e900672ccfda12f2590d3562eb81bc128e:
                   V0.2 checks pull_request run 37311051719  completed / SUCCESS (gateway-web, android)
                   V0.2 checks push         run 37311028929  completed / SUCCESS  (after a rerun - see below)
                   City linkage check       run 37311051724  completed / SUCCESS
                 ONE PUSH-RUN FLAKE, CLASSIFIED RATHER THAN HIDDEN: the first attempt of run 37311028929 failed the test
                 "Windows Services invokes real document, knowledge, skill, evidence and theme adapters" with
                 AssertionError "late result stays in shared history, not a different view" (actual 'RUNNING',
                 expected '', i.e. a poll-timing assertion in an author-owned Services-adapter test that this change
                 does not touch). The identical head PASSED the pull_request run of the same suite, and `gh run rerun
                 --failed` then passed - so it is a load/timing flake, not a defect of this change.
MERGE            zhiheng-zhang-Mera/utopia#29, merged under this workbook's merge_authority: true, after re-fetching
                 main (origin/main was still d3262ce2…, the branch's own base, so no refresh conflict) and after the
                 acceptance evidence above had been produced on the same head.
MERGED SHA       59d3e09b1ea51c4b4024160fca1a575818077654   (origin/main now equals it)
MERGED-MAIN CI   V0.2 checks push        run 37313304172  completed / SUCCESS on 59d3e09b1ea51c4b4024160fca1a575818077654
                 City linkage check push run 37313304290  completed / SUCCESS on the same head
                 both read from the Actions API and matched on that exact head
DEPLOYED STATE   the resident 4391 City still runs the accepted tree D:/utopia-join590 @ 322162e…, whose product code is
                 the content of the merge commit; nothing was left running an untested revision.
```

322162e精确PR37311051719、push37311028929（重跑）、linkage37311051724成功。push首Services-adapter晚结果共享历史断言actualRUNNING/expected空失败，任务未碰该作者测；同头PR通过、仅失败重跑通过，原归负载／时序不稳定，不隐藏。

PR29按工作书merge_authority:true，先新fetch main仍d3262ce同base无冲突，产生上述同头证据后合。main59d3e09b1ea51c4b4024160fca1a575818077654，push37313304172及linkage37313304290 API回读同头成功。4391仍接受树322162e、产品为合提交内容，没留未测版本运行。

## 7. 明确范围外／未做

```text
- cosmetic glyph clipping of a QR button (owner excluded it)
- the pre-existing, unrelated authorization observation that a member session can decide join requests on main:
  recorded separately in reports/PR28-4391-DEPLOYMENT/PR28_FIX_VERIFICATION.md, NOT touched by this closeout
- no Android UI refactor, no new pairing mode, no relay protocol change
```

Owner排除QR按钮字形裁切；既有成员能决定join请求的无关权限观测另PR28_FIX_VERIFICATION记录、不在此收尾改；无Android UI重构、新配对mode或relay协议变化。

语言配对 / Language pair: [English](../FINAL_PHYSICAL_ACCEPTANCE_Mech.md) · [中文](./FINAL_PHYSICAL_ACCEPTANCE_Mech.md)
