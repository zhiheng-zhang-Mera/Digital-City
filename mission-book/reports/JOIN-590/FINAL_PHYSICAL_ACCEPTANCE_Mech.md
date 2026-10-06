# JOIN-590 — final physical acceptance / review receipt / 终验收据

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

## 1. The chain that had to pass, and what was measured at each step

```text
真实 Android join → approval → enrollment → restart/reconnect → revoke → restart/reconnect refused
```

### Step 1 — Android relay join → owner approve → credential issued → enrollment visible on both sides

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

### Step 2 — restart → reconnect with no manual token/credential entry

```text
ACTION      scripts\stop-city.ps1  →  scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391
            (coordinator PID 33924 → 10984); the HANDSET WAS NOT TOUCHED and nothing was typed on it
CITY        227 CITY_STARTED → 228 NODE_ONLINE →
            229 CLIENT_CONNECTED dev-7df0f3d9c5b143228dffaa73e7f15dcb (Android · PERM00)
            the device renewed its own session from the stored material; no owner token was involved
PHONE UI    ONLINE again                                         evidence: 02-after-restart-reconnected.png
```

### Step 3 — revoke → restart/reconnect refused, with no silent recovery

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

## 2. The blocker that was found, and the minimal repair

The chain was FIRST run on the previously accepted head `b91677d1478950feb79742f618d0c981773d5bb7`, where it did **not**
hold. Measured, not assumed:

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

## 3. Verification on the tested head

```text
node --test tests/join590-native-enrollment.test.mjs                       1/1 pass
node --test tests/join503-enrollment.test.mjs tests/join502-review-probes-v2.test.mjs
             tests/join501-review-falsification.test.mjs                15/15 pass
gradlew :app:testDebugUnitTest :app:assembleDebug (JDK 17.0.18)           BUILD SUCCESSFUL
City/APK provenance   gateway process started from D:/utopia-join590 @ 322162e…; the APK installed on the handset was
                      built from the same tree, so both halves of the chain are the tested SHA.
```

## 4. Evidence index (raw, bounded, checkable)

```text
evidence/android-closed-loop/city-events.json            the City's own event log for the whole run (seq 199-237)
evidence/android-closed-loop/city-join-requests.json     the join request rows incl. join-de3513bc07 and its decision
evidence/android-closed-loop/city-installations.json     the installation roster incl. ins-89b1220e… in state RETIRED
evidence/android-closed-loop/phone-prefs-after-revoke.xml the device's own storage after the revoke (secrets redacted)
evidence/android-closed-loop/01-enrolled-online.png      ONLINE on the handset after enrollment
evidence/android-closed-loop/02-after-restart-reconnected.png  ONLINE again after the City restart, phone untouched
evidence/android-closed-loop/04-revoked-device-refused.png     OFFLINE + "Device enrollment retired …" after both restarts
```

## 5. Completion conditions of the workbook, mapped

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

## 6. Merge and merged-main verification

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

## 7. Explicitly out of scope / not done

```text
- cosmetic glyph clipping of a QR button (owner excluded it)
- the pre-existing, unrelated authorization observation that a member session can decide join requests on main:
  recorded separately in reports/PR28-4391-DEPLOYMENT/PR28_FIX_VERIFICATION.md, NOT touched by this closeout
- no Android UI refactor, no new pairing mode, no relay protocol change
```

语言配对 / Language pair: [English](./FINAL_PHYSICAL_ACCEPTANCE_Mech.md) · [中文](./zh-CN/FINAL_PHYSICAL_ACCEPTANCE_Mech.md)
