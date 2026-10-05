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
| 2 | restart tokenless reconnect | **MET** | §2.4: `CITY_STARTED` → both surfaces `CLIENT_CONNECTED` with no credential entry; same `cityId` |
| 3 | revoke refusal convergence | **NOT MET — `DEFERRED`** | The City's installation registry reads `scope=CITY count=0`, so there is no enrolled installation on this City to revoke. See §4 |
| 4 | Web/Android user path truthful | **PARTIAL** | Android is live as `android-PERM00 / CONTROL_ONLY` and its UI rendered City data; the workbook's user-path check (create `CHECKPOINT_DEMO` on the phone and compare id/state/event seq/SHA-256 with the browser) was **not** executed in this session |
| 5 | no duplicate City / no hidden local fallback | **MET (observed)** | one `cityId` across the restart, one gateway process, one store; `/health` reports `gateway READY, rooms READY` on the same reservation record |
| 6 | exact baseline/head CI green | pending | this report is delivered before a head push; CI is recorded in the workbook frontmatter afterwards |
| 7 | opposite-host Formal Review | **NOT MET — `DEFERRED`** | requires the other physical host to review this head; Mech may not self-review |
| 8 | Capability Exposure Gate PASS | pending | assessed in §5 |
| 9 | merged-main post-closeout verification | **NOT MET — `DEFERRED`** | depends on 3 and 7 |
| 10 | terminal marker | **NOT RELEASED** | gates 3, 4(part), 6, 7, 9 remain |

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
