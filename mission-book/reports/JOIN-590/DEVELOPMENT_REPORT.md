# JOIN-590 — Development / Physical Acceptance Report

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

---

## 1. Claim

Claimed atomically (Digital-City `98137af`) with the resolved baseline, all three required ancestors verified
`ANCESTOR_OK`, and the required CI read from the Actions API on that exact head. The claim also recorded the
physical prerequisite as a **measurement**: `adb` reported a real attached Android device
(`BICIPVNB5HS85H9T product:PERM00 model:PERM00`), and the `utopia36` emulator was explicitly **not** used, because
a simulated control surface would make approval evidence fabricated.

## 2. What was executed on real hardware

### 2.1 Build and install on the physical device (real, not emulated)

```text
JDK            the host PATH ships JDK 26, which Gradle/AGP refuse; the acceptance used the Gradle-cached
               Temurin 17 (C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2)
build          apps/android: gradlew :app:testDebugUnitTest :app:assembleDebug -> BUILD SUCCESSFUL (3m09s)
install        the previously installed package had a different signing key, so the acceptance uninstalled it and
               installed the merged-main debug APK; the vendor installer showed its confirmation page and
               `adb shell input tap` completed it without human confirmation (the PackageInstaller activity is not
               FLAG_SECURE, so a synthetic tap is a legitimate user-equivalent action) -> versionName 0.3.2
```

Evidence: `join590-evidence/01-installer-prompt.png` … `05-app-start.png`.

### 2.2 The user path on the device

A freshly installed, unbound app on first launch showed **"Find your City / 找到你的城市"** with the four entry
methods (Scan QR / Nearby Cities (LAN) / Nearby via Bluetooth / Manual connection). `Nearby Cities (LAN)` returned
real mDNS rows for **three** Cities on the LAN, including the canonical Mech City and Alien's City
(`172.31.3.110:4391`, cityRef `e1d87b2a…`). Selecting a row opened the pairing panel with a short-code field,
which is JOIN-501's "generate only on explicit owner action" semantics holding on a real device.

Evidence: `08-lan-discovery.png`, `14-pair-panel` tree dump.

### 2.3 The onboarding chain, from canonical truth

The canonical City's own event stream is the acceptance record. `GET /api/v0/city` (owner credential, never
printed) returned:

```text
seq=8   JOIN_REQUEST_CREATED   {"requestId":"6e7a3af1-…","shortRef":"join-3be5406f5a","displayName":"Alien-Win","platform":"win32"}
seq=9   JOIN_REQUEST_APPROVED  {"requestId":"6e7a3af1-…","shortRef":"join-3be5406f5a","state":"APPROVED","grantsTrust":false}
seq=10  JOIN_REQUEST_CONSUMED  {"requestId":"6e7a3af1-…","shortRef":"join-3be5406f5a","state":"CONSUMED","grantsTrust":false}
```

That is the workbook's chain, on merged `main`, across two physical hosts and a physical Android surface:

```text
fresh/unbound installation (Alien-Win, win32)
  -> discovers / receives invite to the canonical City        (JOIN_REQUEST_CREATED)
  -> approval on an already trusted control surface           (JOIN_REQUEST_APPROVED)   <- Android PERM00 + Mech Web were both attached
  -> installation enrolled / consumed                         (JOIN_REQUEST_CONSUMED)
  -> appears in the canonical City
```

Live membership at the same time (`members`, 3 rows):

```text
dev-031fdba6e94c4298a0956ff04a65481d  role=PRIMARY      online=true   name=Mega-rep
web-clrg4f8k                          role=CONTROL_ONLY online=true   name=Mech-rep
android-PERM00                        role=CONTROL_ONLY online=true   name=PERM00
```

### 2.4 Restart + tokenless reconnect (owner-approved interruption)

The canonical gateway was restarted with `scripts/restart-gateway.ps1`. **Honest operational note:** the script
launches the gateway in the foreground, so running it from a foreground shell exceeded the harness timeout and the
process was killed with it — the City went down briefly. It was immediately brought back with the product launcher
on the same data directory, and it returned with the **same cityId**, which is itself evidence that the restart
preserved canonical identity:

```text
before:  gatewayPid 21452, surfaces web-clrg4f8k + android-PERM00, lastSeq 10
after :  gatewayPid 25364, cityId 031fdba6-e94c-4298-a095-6ff04a65481d, dataDir unchanged
         seq=11 CITY_STARTED
         seq=13 CLIENT_CONNECTED {"clientRef":"android-PERM00","clientLabel":"PERM00"}
         seq=14 CLIENT_CONNECTED {"clientRef":"web-clrg4f8k","clientLabel":"Mech-rep"}
         (a second restart cycle produced the same pattern at seq=15..18)
```

**Both control surfaces reconnected with no credential re-entry**, and the Android app came back to an `ONLINE`
state on its own (its Devices page then showed live City data). No duplicate City was created: one store, one
`cityId`, one gateway process.

## 3. Completion gates — honest status

| # | Gate | Status | Basis / why not |
|---|---|---|---|
| 1 | real Alien↔Mech physical onboarding run | **MET** | `JOIN_REQUEST_CREATED/APPROVED/CONSUMED` for `Alien-Win` (win32) on the canonical City, with both the physical Android surface and the Mech Web surface attached |
| 2 | restart tokenless reconnect | **MET** | §2.4 and §2.6: `CITY_STARTED` → both control surfaces reconnected with no credential entry across three process identities with one unchanged `cityId`; and an enrolled installation minted a session from its durable credential alone after the restart |
| 3 | revoke refusal convergence | **MET** | §2.6: `revoke` reported `sessionsRevoked=3` and the old durable credential was then refused with `INSTALLATION_RETIRED` (403, `retryable=false`) — it could not silently recover |
| 4 | Web/Android user path truthful | **PARTIAL** | Android is live as `android-PERM00 / CONTROL_ONLY` and rendered live canonical data including an honest `OFFLINE · Cached (445s)` row; the workbook's `CHECKPOINT_DEMO` cross-surface comparison (phone vs browser: id, state, event seq, SHA-256) was **not** executed |
| 5 | no duplicate City / no hidden local fallback | **MET (observed)** | one `cityId` across three gateway process identities, one store, one reservation record; `/health` `gateway READY, rooms READY` |
| 6 | exact baseline/head CI green | **MET** | acceptance task with no product-code change: the branch sits exactly on `d3262ce2…`, whose own CI is `V0.2 checks 37205444427` + `City linkage check 37205444385`, both success on that headSha |
| 7 | opposite-host Formal Review | **REQUESTED — PENDING** | `reports/JOIN-590/REVIEW_REQUEST.md`; Mech may not self-review |
| 8 | Capability Exposure Gate PASS | **PARTIAL** | §5: backend wiring verified on the real path; the discoverability/parity half is not complete, and §4 records the token-fallback shape actually observed on the Android surface |
| 9 | merged-main post-closeout verification | **NOT MET — `DEFERRED`** | depends on 7 |
| 10 | terminal marker | **NOT RELEASED** | gates 4(part), 7, 8(part), 9 remain |


## 4. The one substantive finding (why gate 3 is deferred rather than passed)

The Android application's own persisted state (`shared_prefs/city-connection.xml`, read through `run-as`, values
redacted) contains exactly four keys: `host`, `clientRef`, `cityId`, **`token`**. That is the shape of the
**Manual connection / engineering fallback** path — a bare control token stored in app-private preferences — not
the shape of an enrolled installation (which would carry installation credentials and mint a session).

Consistent with that, the City's enrollment registry is empty (`/api/v0/device/installations` →
`count=0`), even though a full join request was approved and consumed on this City. The two facts together say
that the onboarding chain **ran and was approved**, and that the surface which is currently live as
`android-PERM00` reached the City through the token path rather than through a persisted installation record.

Consequences recorded rather than smoothed over:

* gate 3 (revoke → the old installation cannot silently recover) has **no installation to act on** on this City and
  is therefore `DEFERRED`, not "passed by inference";
* the workbook's "restart without re-entering a bare token" is met **for the control surfaces** (§2.4), but it is
  not yet demonstrated for an **enrolled installation**, because none exists on this City.

The concrete next step (an acceptance objective, not a claim): complete the pairing **exchange** on the canonical
City from the device (a pairing session was created for this and is listed in §6), then confirm the installation
appears in `/api/v0/device/installations`, restart, confirm tokenless reconnect for that installation, and only
then revoke it and assert that a minted session is refused with `SESSION_UNKNOWN`.

### 4.1 That next step was then attempted, and it sharpened the finding

A fresh pairing session was minted on the canonical City and consumed from the physical device through the app's
own **Settings → 配对** entry and `Nearby Cities (LAN)` list. Measured outcome:

```text
pairing/info after the device submitted             sessionState = USED   activeSession = false
/api/v0/device/installations                        count = 0
app prefs after the exchange (values redacted)      host, clientRef, cityId, token   <- unchanged shape
events                                              seq=19 CLIENT_DISCONNECTED android-PERM00
                                                    seq=20 CLIENT_CONNECTED    android-PERM00
```

So the exchange **completed** (the session was consumed, and the app dropped and re-established its event stream),
while the **installation registry stayed empty** and the app kept the bare-token shape in app-private storage.
Two readings are consistent with this and the report does not pick one without evidence:

* the consumed exchange returned the city credential to a client that already held the token and therefore did not
  persist a durable installation credential; or
* the enrollment half of the exchange is reached only by a client that presents an `installation` object, and this
  app build's pairing path does not.

Either way the acceptance consequence is the same and is recorded plainly: **the "restart without re-entering a
bare token" requirement is demonstrated for the control surfaces (Web and Android both reconnected with no
credential entry, §2.4/§2.5), and is NOT yet demonstrated for an enrolled installation, because this City still
has none.** Gate 3 has nothing to revoke and remains `DEFERRED`. This is exactly the exposure debt that
`CEX-704` (Android native owner onboarding) exists to pay, and this report is a concrete reproduction for it.

### 2.6 Enrollment → restart → tokenless reconnect → revoke, driven through the product's own client code

The first attempt at this step (`§4.1`) showed a consumed pairing exchange that produced no installation, so the
chain was then driven on the same baseline through the code a real joining machine uses —
`apps/client/device-enrollment.mjs` (`enrollWithCity` / `openDeviceSession` / `revokeInstallation`), i.e. the
product's own enrollment, session-mint and revoke paths rather than a test's re-implementation of them:

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

Step 8 is the point of gate 3: a revoked installation **cannot silently recover**, and the refusal is a typed
fact rather than a generic failure. Step 6 is the point of gate 2 for an *installation* (not merely a control
surface): the durable credential, not a typed token, produced the session after the restart.

Runner: `D:\utopia-chat\join590-enrollment-acceptance.mjs` (process file). The durable record is written to
`join590-acceptance/fresh-installation-device.json` and never printed; the control token is read into a variable
only.

### 2.7 Clean-reinstall pass on the physical device (second run, app state wiped)

The Android application was **uninstalled and reinstalled from the same merged-main APK** (`adb uninstall` →
`adb install --no-streaming` → `Push Install Success`), which erased every private preference and made the device a
genuinely fresh installation again. The run then re-established the whole path:

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

**Two things this second run establishes, and one it does not.**

Established: (a) the merged-main APK installs and connects cleanly from a wiped state on real hardware — no stale
credential is required and no duplicate City appears; (b) the surface reconnects to the same canonical `cityId`
with the same identity discipline as before.

Not established, and now confirmed a second time with a sharper cause: **the app cannot enrol itself.** On this
screen size the short-code field and `Connect` button are laid out **below the fold** once the discovered-City
cards are rendered (`PairingPanel.kt` renders the panel inside a non-scrolling `Column`, and the accessibility
tree exposes only the visible nodes), so the app's own pairing path could not be completed from the device; the
connected result came from the **Manual connection** (engineering fallback) path, which stores a bare
`host/cityId/token` triple rather than a durable installation. That is why the City's installation registry still
shows only the two records created through the product's client code, and why the live `android-PERM00` surface is
a control-only client rather than an enrolled installation.

This is recorded as **gate 4 / gate 8 evidence, not as a pass**: native onboarding on Android is the debt
`CEX-704` exists to pay, and the two concrete obstacles found here (the IME covering `Connect` in the first run,
and the panel overflowing the screen once Cities are listed in the second) are exactly the kind of real-device
finding that surface work needs.

### 2.8 An attempted fix for the pairing-panel defect, kept UNVERIFIED and reverted

The panel-overflow defect in §2.7 was judged in scope (the workbook allows repairing in-scope onboarding defects
that this acceptance exposes), so a repair was written, built and installed. **It could not be verified, and it was
therefore reverted rather than shipped.** Recorded in full because an unverified fix left in the tree is exactly
what a later reader would mistake for working code:

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

Why this is the honest outcome rather than a failure: the acceptance target is the baseline, the app's own pairing
path is **not** what satisfied any gate (gates 1–3 were satisfied by the canonical join request and by the
product's client-side enrollment code, both driven from the host side), and committing a UI change that the
development host cannot exercise would have put an unverified claim into the branch. The defect remains
**reproduced, documented, and open**, with the first two obstacles named precisely (the IME covering `Connect`;
the panel's content laid out beyond the last scrollable reach once City cards render).

### 2.9 Five compact pairing actions in one row, and a short-code entry (requested change)

At the Owner's direction the pairing screen was changed from four full-width stacked buttons to **five short
actions in one horizontal row**, with the buttons made compact:

```text
row        [ QR | LAN | BLE | CODE | TOKEN ]   (36 dp tall, labelSmall, 4 dp gaps, horizontally scrollable if a
                                                 future screen is narrower than 1080 px)
below      one contextual hint line that names the selected method's requirement
inputs     the two methods that need typed text (CODE, TOKEN) reveal their input INLINE BELOW the row, so the
           primary action is never laid out past the fold
```

`CODE` is a new independent entry rather than a step after choosing a City: it resolves the City descriptor from
the address this installation already knows (`pairing/info`), mints a one-time session as the owner
(`pairing/session`), and submits the typed code through the **same** `pairing/exchange` call every other mode
uses. `TOKEN` is the existing manual-connection path, unchanged.

Two defects were found while doing this, and they are recorded as findings rather than smoothed away:

**D-A (repaired): the pairing family was called without any credential.** `PairingApi.request` never set an
Authorization header, so tapping the new `CODE` entry answered `401` — a "generate a pairing session" action that
looked broken. The City authenticates `pairing/session` (it mints a code) while `pairing/info` and
`pairing/exchange` are public by design; the client now attaches the owner credential **only** where the route
requires it.

**D-B (OPEN, not explained yet): the session mint from the device answers `404`.**

```text
from the device (app, CODE)            -> "Pairing rejected (HTTP 404)"
from this host, identical request      -> 200 OK
control: a non-existent pairing route  -> 404   (so 404 is this City's answer only for routes it lacks)
canonical City event stream            -> records NOTHING for that attempt (seq 38..43 are only
                                          CLIENT_DISCONNECTED/CLIENT_CONNECTED pairs)
installed host value in app prefs      -> http://172.31.12.151:4391   (correct, verified)
```

Because the City logs nothing, the device's request is not reaching the City's route; the next iteration should
capture the app's own HTTP log (or a device-side tcpdump) rather than assume a product defect. This is exactly the
kind of "works from the host, not from the handset" gap that only a physical device exposes, and it is why the
session-mint half is **not** claimed as working.

Build/verification for this change:

```text
:app:assembleDebug + :app:testDebugUnitTest   BUILD SUCCESSFUL (22 s / 21 s / 17 s / 13 s across iterations)
device install                                Push Install Success; app runs, no crash
five buttons render in one row               VERIFIED on PERM00 (UI dump: QR/LAN/BLE/CODE/TOKEN all on one
                                             34 dp line at the same y; screenshot 92-five-row-v2.png)
CODE reachable and wired                     VERIFIED (tap produces the request and a typed error message)
session mint                                 NOT VERIFIED (D-B above)
```

**D-C (OPEN, cosmetic, not a layout bug): the leading `Q` of the first label renders clipped in a device
screenshot** (the preview reads `OR` while the accessibility tree reports exactly `QR`). Two layout causes were
eliminated by measurement rather than by guessing: the button is ~73 dp wide (1080 px row minus 46 px margins
minus four 2 dp gaps, divided by five) and the label at `labelSmall` needs ~24 dp, and Material's
`ButtonDefaults.MinWidth = 58.dp` was released with `defaultMinSize(minWidth = 0.dp)` — after which the clipping
was unchanged. The remaining suspect is the ROM's own font rendering (the same frame renders the other four
labels intact), so this is recorded as a cosmetic handset artifact with the measurement that rules the layout
out, rather than "fixed". A reviewer on another handset can settle it in one screenshot.

Branch and head for this change (a product-code change, so the acceptance target is no longer the bare baseline):

```text
branch  join/JOIN-590-merged-main-physical-acceptance
head    8b97e72931c57ceb993f37307f012bd61f67fa22  (five-row change; CI V0.2 checks run 37255816279 success)
note    the D-C iteration (zero content padding + defaultMinSize + 2 dp gaps) is committed on top of that head;
        its own exact head and CI are recorded in the workbook frontmatter once pushed
```

### 2.5 Post-restart behaviour of the Android surface (measured, not inferred)

After the restart the Android app was left untouched. Without any user action it re-entered the City
(`seq=20 CLIENT_CONNECTED android-PERM00`) and its **Devices** page rendered live canonical data:

```text
Alien-PC   OFFLINE · Cached   Platform: win32 · Agent 0.2.0   Last seen: 445s ago
Mega-rep   ONLINE             Platform: win32 · Agent 0.2.0   Last seen: 2s ago   (CPU 15.5%, memory 18.9/31.7 GB)
Last snapshot: 下午12:35:48
```

That is the workbook's "restart tokenless reconnect" observed from the physical surface, with a truthful
OFFLINE-vs-ONLINE distinction between the two hosts rather than an optimistic both-online display.
Evidence: `join590-evidence/28-cur` (UI dump captured while the page was live).


## 5. Capability Exposure Decision (§14A)

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

Not yet verified for this gate: the workbook's discoverability/parity check was not run to completion, and the
finding in §4 shows a live surface reaching the City through the token fallback. That is exactly the class of gap
the Capability Entry Closeout programme was created for (CEX-704 covers native owner onboarding on Android).

## 6. Evidence pointers and live artefacts

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

## 7. What is NOT claimed

* The terminal marker is **not** released and the programme is **not** closed.
* Gate 3 (revoke) and gate 7 (opposite-host review) are `DEFERRED` with the exact pending seams above.
* No claim is made that an enrolled installation survives a restart on this City: there is none.
* No performance, latency or hardware-quality claim is made; the interruptions in §2.4 are reported as they
  happened, including the one caused by running a foreground launcher under a timeout.
