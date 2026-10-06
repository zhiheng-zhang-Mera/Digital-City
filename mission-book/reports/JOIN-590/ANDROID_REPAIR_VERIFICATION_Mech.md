# JOIN-590 Android repair — physical verification by the opposite host / 异机对 Android 修补的真机复核

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

## 1. What was checked, and the instrument for each claim

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

## 2. The repair, read from the code

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

## 3. Physical evidence, step by step

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

Evidence files kept (bounded): `evidence/raw/mission-book/PR28-4391-DEPLOYMENT/android-physical-verification/`
(phone roster JSON, prefs dumps with secrets redacted, screenshots of the ONLINE state and of the retired state,
City event tails for steps 4-6).

## 4. CI classification for the head

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

## 5. What is still missing for completion, and why this report does not release the marker

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

## 6. Note for the reviewer, offered not imposed

The live 4391 City runs exactly the code of the verified head. If Alien's scope reconciliation wants a different
deployed revision, `D:\utopia-pr28` (branch `deploy/PR28-4391`) can be re-pointed with
`scripts\stop-city.ps1` + `scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391`, and the same state directory
keeps the City identity and its members.

语言配对 / Language pair: [English](./ANDROID_REPAIR_VERIFICATION_Mech.md) · [中文](./zh-CN/ANDROID_REPAIR_VERIFICATION_Mech.md)
