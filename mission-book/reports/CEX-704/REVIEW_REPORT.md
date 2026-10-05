# CEX-704 — REVIEW REPORT (opposite physical host)

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

## 1. How this review was performed (and how it was NOT)

Eleven changed paths, 516 insertions, 2 deletions. The backend change is a small optimistic-concurrency guard on
`POST /api/v0/pairing/session`; everything else is the Android owner-onboarding surface. This workbook is unusual in
that its Formal Review section demands verification **on a real Android handset**, so the review is split in two and
both halves are stated separately rather than blended:

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

No pre-existing test file is touched (only the new file), so there is no relaxed assertion needing compensation.

## 2. The on-device matrix

Performed on the attached real handset `BICIPVNB5HS85H9T` (OPPO PERM00, Android 0.3.2 review build) against a City
gateway this review started itself on the host LAN. Ten of the workbook's scenarios, each decided by observation
rather than by reading:

| # | Scenario | Verdict | Evidence |
|---|---|---|---|
| 1 | reachability, panel visible | VERIFIED | app ONLINE; the City's own snapshot lists `android-PERM00` as a `CONTROL_ONLY` control surface; the panel renders `邀请设备加入 · <canonical City name>`, `刷新入网状态`, `生成配对码`, the fixed-while-active hint, `入网申请` and the cross-network footer |
| 2 | generate → short code + QR | VERIFIED | `配对码：438393`, `剩余 289 秒 · 使用一次`, and a 612×612 QR bitmap with `contentDescription="临时入网二维码"`. The digits are the City's canonical code for the live session, proven by **consuming the on-screen code from a different client** (HTTP 200) — `pairing/info` reports no short code at all, so the match cannot be read out of it |
| 3 | ACTIVE never rotates | VERIFIED three ways | the generate control is `enabled="false"` while live (exactly one such node); tapping it anyway left the code and the canonical session id unchanged; and the host's guarded generate answered 409 `PAIRING_STATE_CHANGED` |
| 4 | share | **VERIFIED POSITIVE** | tapping `分享邀请链接` opened the real system chooser (`ChooserActivity`, targets 便签/信息/浏览器/Edge/文件管理/蓝牙/云服务/OPPO互传) with no policy or permission refusal, and backing out left the material untouched |
| 5 | second client consume | VERIFIED (scope stated) | the consuming client was **this host**, not a second handset; exchange returned 200 and the device dropped code, QR and share control on its own next poll, re-offering generation |
| 6 | incoming approve | VERIFIED | a request created from the host appeared as `待审批` within ~4 s; tapping `批准` moved canonical PENDING → APPROVED with `decidedAt`, and a host-side approval likewise moved the device row |
| 7 | incoming reject | VERIFIED | a fresh request appeared as `待审批`; tapping `拒绝` moved canonical PENDING → REJECTED, and the row lost its decision buttons |
| 8 | expiry | VERIFIED | with a 15 s TTL, the device showed no code and no QR after expiry, offered generation again, and canonical reported `EXPIRED` — no code appeared without a tap |
| 9 | double click · background/resume | VERIFIED | two taps ~100 ms apart produced exactly one session (id and expiry stable across reads 5 s apart); after HOME → resume the same code survived with a correctly advanced countdown; a code consumed while backgrounded was gone on resume |
| 10 | existing join paths | VERIFIED present | `Scan QR`, `Nearby Cities (LAN)`, `Nearby via Bluetooth`, `Manual connection` are all rendered on the same page, and `Manual connection` still reaches the pre-existing `Connect your city` page. The commit does not touch `PairingPanel.kt` |

**The author's share gap is closed by this review, not confirmed.** The receipt records
`share_sheet: NOT_RUN_AUTO_APPROVAL_REJECTED`; on this handset the chooser opens normally. The gap that **remains
open** is `different_physical_second_device`: only one handset is attached to this host, so the consuming client was
a Windows process, exactly as the author's own index already admits.

Crash sweep: `adb logcat -b crash` empty, no `FATAL EXCEPTION`, app process alive throughout.

## 3. Findings

### F1 — LOW: the share-failure guidance can be erased before it is read

`OwnerOnboardingPanel.kt:136` writes `state.error = "无法打开分享面板，请使用短码。"` when the share intent fails, but
`OwnerOnboardingState.refresh()` reassigns `error` from the pairing reconcile on **every 2-second poll**
(`:59-63`), so the message can be wiped within ~2 s with no other user action. On this handset the chooser opened,
so the failure branch never ran and this is a **source-derived** finding, not an observed one — recorded as such.
Minimum repair: keep the share error in a field `refresh()` does not overwrite, or clear it only on the next share
attempt.

### F2 — INFORMATIONAL: a session generated on another surface is a dead end without a countdown

Device-observed: with the canonical session ACTIVE because the **host** created it, the Android panel shows no code
and no QR (the host's code appears nowhere in the UI dump) and `生成配对码` is disabled, leaving only the hint "若其他
设备已生成，请在那里分享，或等待过期后刷新". This is defensible — the secret is only ever returned to the surface
that created it, which is the right default — but an owner holding only the handset cannot act and is not told how
long the wait is. Minimum repair: render the remaining TTL in that state; no security change required.

### F3 — INFORMATIONAL: the invitation is a one-time bearer for the durable City credential

The workbook forbids sharing a durable credential, and the shared string is honest: the system chooser receives only
the invite URL (`?pair=` with the six QR fields — no control token, no `sess:` value). But the property behind it is
worth stating precisely, and this review verified it first-hand rather than repeating the receipt:

```text
POST /pairing/exchange with the on-screen short code
  -> returned credential is BYTE-IDENTICAL to the City control token
  -> that credential is accepted by GET /api/v0/city (200)
  -> replaying the same short code answers 410, so it is single use, session-bound and TTL-bounded
```

So sharing the link shares the ability to obtain the owner credential, for as long as the session lives. This is the
programme's existing pairing contract (the Web QR path does the same) rather than something CEX-704 introduced, which
is why it is recorded and not raised as a defect. Minimum improvement if the programme wants it: say so in the shared
text or next to the link.

### F4 — LOW (control plane): twenty-one template fields are absent, including every exposure and capability field

CEX-704's frontmatter omits more of `MISSION_TEMPLATE.md` than any other workbook reviewed in this programme:
all five exposure/authority fields, all four `capability_*` fields, all six research-evidence fields, and the
state-identity, monitor and decision evidence fields. As elsewhere this is not a declaration of `NOT_APPLICABLE`:
`CAP-ONBOARDING-OWNER-001` already exists, names CEX-704, and states the exposure class, the Android surface, its
nesting and the four user controls — so the registry carried the facts while the workbook that owns them declared
nothing. **Reconciled by this review** (§4), transcribing the author's own record; the watchlist ids are the five the
author's index names in prose, and the ambiguous G2 entry is again left out rather than invented.

### F5 — INFORMATIONAL: the panel itself has no test

`OwnerOnboardingTest` (4 tests) is a good test of the **lifecycle model** — unknown state does not generate, an ACTIVE
session never rotates, restored material needs a canonical match, expiry does not rotate, and a QR payload carrying an
extra secret-bearing field is rejected. Nothing tests the panel: not the decision-row rendering, not the
"another surface generated it" state (F2), not the share fallback (F1). Recorded with F1 and F2 so the next reader
knows which of those two is source-derived.


## 4. Completion gates, independently checked

| # | Gate (workbook §完成门槛) | Verdict | Basis |
|---|---|---|---|
| 1 | Android can serve as an Owner onboarding control surface | see §2 | panel mounts on the Find/Connect page; generation is guarded client-side and server-side; approve/reject read canonical `join/requests` |
| 2 | JOIN-501 lifecycle does not regress | PASS | `join501-review-falsification.test.mjs` and the rest of the 79-test join/pairing set pass; the guard is additive and the legacy unguarded generate still works |
| 3 | existing Android join does not regress | PASS (code) | the pre-existing pairing panel is still mounted unchanged underneath the new one |
| 4 | real-device opposite-host Review | PASS (scope stated) | §2: ten scenarios decided on the attached handset, including the share sheet the author declared NOT_RUN. The one honest limitation is that the consuming client was this host, not a second handset |
| 5 | exact-head CI | PASS | runs 37216216410 / 37216246024 / 37216246022, all success on the reviewed head; PR20 checks all pass |
| 6 | PAPER_MATERIAL_INDEX | PASS (with the measured additions below) | index present and unusually honest about its gaps |
| 7 | terminal marker | RELEASED | `ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED` |

### 4.1 What this half of the review decided, with evidence

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

### 4.2 Hypotheses tested and REJECTED (recorded so they are not re-opened)

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

Probe drafts that failed on my own wrong expectations are recorded in the probe comments, because each one looked
exactly like a product defect: the member-session assertion, the reversal assertion, and the repeated-reject
assertion above, plus an earlier draft that asserted `pairingSessionId === undefined` where the descriptor reports
`null` for "no session".

## 5. What this review does NOT claim

* **No optical QR scan by a second physical handset, and no second handset at all.** Only one Android device is
  attached to this host. The author's index already says the controlled second client "is not Mech/another physical
  Windows", and this review repeats that limitation rather than papering over it.
* **No system share-sheet verification.** The author's receipt records the share test as policy-blocked and not
  retried; §2 records what this review could and could not establish about it.
* **No performance claim.** The approval-latency figures are a local City on one physical host and are labelled as
  such. `approval_latency_ms` was `null/NOT_OBSERVABLE` in the development receipt and is supplied by this review
  instead.
* **No APK provenance claim.** A build of the reviewed source produced the same byte count as the receipt
  (10,500,445) but a different SHA-256, so the build is not hermetic and the match is reported as a size match only.
* This verdict covers only `d05f5a455ff535e3e065b30ec9ec74bca2dbb521`.
