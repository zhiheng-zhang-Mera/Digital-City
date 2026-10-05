# CEX-705 — REVIEW REPORT (opposite physical host, real device)

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

## 1. How this review was performed (and how it was NOT)

Ten changed paths, 380 insertions, 6 deletions — **no backend change at all**, because the members contract this task
exposes already exists in the accepted line (the declared dependency). The interesting questions are therefore
authority and cross-surface truth, and the workbook demands a **real-device** matrix.

```text
author suite, unmodified    tests/cex705-native-members.test.mjs -> 1 test / 1 pass (a dense authority end-to-end)
reviewer probes, new        tests/cex705-mech-review-authority.test.mjs -> 7 tests / 7 pass
Android, executed here      :app:testDebugUnitTest -> 15 suites / 87 tests / 0 failures / 0 errors
                                                     (MemberManagementTest 7/7, host MEGA-REP)
physical handset            BICIPVNB5HS85H9T (OPPO PERM00, Android 12) — matrix in §2
```

No pre-existing test file is touched, so there is no relaxed assertion needing compensation.

## 2. The on-device matrix

Performed on the attached handset against a City this review started itself on the host LAN. Nine scenarios, each
decided by observation on the device and cross-checked against canonical truth:

| # | Scenario | Verdict | Evidence |
|---|---|---|---|
| 1 | owner reachability, both surfaces | VERIFIED | Settings card `城市与设备身份` with the authority line `城市管理员控制 · 操作代表城市主机，不代表这部手机的入网身份`, the install list and `撤销此安装`; Devices page `同城所有设备` with every canonical member |
| 2 | owner rename | VERIFIED | saved `CEX705-Owner-Renamed-City`; canonical `displayName` changed; the Web title followed |
| 3 | session cannot rename | VERIFIED **both ways** | the field is disabled with `入网会话不能重命名城市…`, typing into it changed nothing, AND driving the server directly with a `sess:` credential answered 403 `Only the City owner can rename the City` |
| 4 | self revoke | VERIFIED | confirmation dialog → canonical `RETIRED`, app returned to `Find your City` with the token cleared, and `shared_prefs/city-connection.xml` retained only `clientRef`. The retired credential then answers 401 `SESSION_UNKNOWN` |
| 5 | revoke another, refused for a session | VERIFIED **both ways** | the app renders the self action only, because a session's install list is `OWN_INSTALLATION` with one row; forced at HTTP, revoking B and C each answered 403 `SESSION_CANNOT_REVOKE_OTHER` and both stayed BOUND |
| 6 | sharing toggle | VERIFIED | the owner's own node flipped canonical `sharingEnabled true→false`; a session flipped its own; no sharing control renders for a node that is not the client's own |
| 7 | send / receive / receipt | VERIFIED | canonical sender is the authenticated actor (a spoofed `senderDeviceId` is ignored); PENDING → recipient's receipt → RECEIVED with `receivedAt`; an unrelated member cannot see the message; duplicate receipt does not rewrite the time |
| 8 | reconnect | VERIFIED (F1 recorded) | City stopped → `RECONNECTING` + `Cached information · connection is not live` + `离线缓存 · 连接城市后才能进行操作。`; restarted → the app re-rendered all canonical members with no stale installation row. **One value stayed wrong, and it is F1** |
| 9 | Web / Android canonical-truth comparison | VERIFIED (F1 is the only divergence) | City name, the four members with their roles and deviceIds, and every sharing flag agree across app, canonical truth and Web. The **online** claim does not |

Crash sweep: `logcat -b crash` empty, 0 of 14,785 logcat lines match `FATAL EXCEPTION|ANR in|beginning of crash`, and
the app process stayed alive. Secret sweep: no `sess:`/token/secret match in logcat, the pairing token is
password-masked, and the identity details show only deviceId/nodeId.

**Limitation, stated rather than papered over:** only one handset is attached, so a second **physical** phone was
never a participant. The other City members were driven with real `sess:` session credentials over HTTP, which is
exactly what the author's own index already admits.

## 3. Findings

### F1 — MEDIUM: the member projection can report a device as connected while its own node says offline

The workbook's Formal Review demands a Web/Android canonical-truth comparison, and this is where it fails. Measured at
one instant, on the handset and in canonical truth:

```text
canonical GET /api/v0/city -> nodes: [{ id: host-a, online: false }]
                              member host-a: { online: true, computeOnline: false, nodeId: host-a, ... }
Android Devices page       -> 设备连接：在线
Web                        -> 离线 · 缓存 / UNKNOWN
```

Reproduced directly rather than only observed through the app: with the host's own node registered and then set
offline in the canonical store, the member row keeps `online: true` while `computeOnline` in the very same row flips
to `false`. The cause is in `services/dev-gateway/members.mjs` — the primary row is seeded with `online: true` and the
node pass merges with `online: prior?.online || n.online`, so `true || false` can never be corrected — while
`sharingEnabled` from the same node record **is** taken. The Android surface faithfully renders what it is given, so
the app is not at fault: the shared projection is.

**Framing matters here:** `members.mjs` is **not** in this commit's diff, so this is a pre-existing defect that
CEX-705's new surface makes visible, not a regression. It is recorded as MEDIUM because a stale liveness claim is
exactly the kind of thing a control surface must not assert, and because the row contradicts itself one field over.

**Minimum repair boundary:** derive `online` from the node record when `nodeId === deviceId`, or emit `null` — the
Android surface already prints `未报告` for an absent flag, so the client needs no change.

### F2 — LOW: the sharing notice reports success unconditionally

`MemberManagementPanel` sets a success notice on a 2xx response, but `POST /api/v0/node/sharing` also requires a node
record to exist. A primary row whose `sharingEnabled` is false by default but which has no node row would render a
toggle whose tap answers 404 while the UI says the setting was submitted. **Not reached in the observed fixture** (the
row did not render at all there), so this is latent and recorded as such. Minimum repair: treat absence of a node
record as "not reported" rather than `false`, or surface the refusal instead of a success notice.

### F3 — INFORMATIONAL: whether the owner's own sharing control appears depends on City configuration

`canToggleSharing` requires `member.nodeId === actorRef`, and the primary member row only gains a `nodeId` when a node
record exists whose id equals that device. Verified directly: with `hostDeviceId = host-a` and a node registered as
`host-a`, the row carries `nodeId: host-a` and the owner's toggle is allowed; when the City's host device and its node
id differ, the row has no `nodeId` and no control renders even though the server would accept the action. The Android
gate is correct; its reachability is configuration-dependent. Recorded because the delegated device run's fixture had
them differ and therefore saw no control, which reads like a missing feature rather than a configuration effect.

### F4 — LOW (control plane): twenty-one template fields are absent, including every exposure and capability field

The same omission as in the CEX-704 close-out: all five exposure/authority fields, all four `capability_*` fields, all
six research-evidence fields, and the state-identity, monitor and decision evidence fields are missing, while
`CAP-CITY-MEMBERS-NATIVE-001` exists and states them. **Reconciled by this review** (§4) by transcribing the author's
own record; the watchlist ids are the five the author's index names through the same prose mapping used in the
CEX-702/703/704 close-outs, and the ambiguous G2 entry is again left out rather than invented.

### F5 — INFORMATIONAL: the development receipt's "physical NOT RUN" list is stale

`development-receipt.json` records `physical_not_run: [rename, sharing toggle, self/other revoke, outbound send, two
physical hosts]`, but the same-day `mission-book/reports/CEX-705/PHYSICAL_FOLLOWUP.json` records every one of those
**except** the two-physical-hosts item as observed on the handset, and this review's own independent matrix confirms
them. A reader of the receipt alone would under-credit the device work and could re-open already-closed ground. Both
records are retained as chronology; the follow-up supersedes.

### F6 — INFORMATIONAL: two mandatory paper points were left null and are supplied here

The workbook requires a parity-gap count and message delivery latency; the receipt records
`metrics.parity_gap_count: null` and `metrics.latency_ms: null`. Both are measurable, so this review measured them
(PROBE 6, PROBE 7):

```text
parity gap        6 features listed by the workbook / 6 reachable from the routes the Android client calls
                  (city rename, enrolled device identity, revoke, member role, sharing, message+receipt)
message latency   send HTTP 6 ms · send→recipient visible 9 ms · receipt round trip 7 ms
                  · canonical created→received 9 ms, from the City's own timestamps
scope             ONE physical Windows host, local City, NOT a performance claim
```

## 4. Completion gates, independently checked

| # | Gate (workbook §完成门槛) | Verdict | Basis |
|---|---|---|---|
| 1 | Android management parity for the listed features | PASS | §2 items 1–7 on the handset; the six features are reachable from the routes the client calls (PROBE 7) |
| 2 | authority boundaries preserved | PASS | rename 403 for a session and 200 for the owner, cross-revoke 403, self-revoke 200, sharing own-node only, receipt recipient-only, spoofed sender ignored — each verified on the device AND at HTTP (PROBE 1–5) |
| 3 | Web regression none | PASS | no Web file is in the diff; the Web/Android comparison found only the pre-existing F1 divergence, which is not a regression |
| 4 | opposite-host real-device Review | PASS (scope stated) | §2: nine scenarios decided on the attached handset; no second physical phone was available |
| 5 | exact-head CI | PASS | runs 37218345150 / 37218364139 / 37218364132, all success on the reviewed head |
| 6 | PAPER_MATERIAL_INDEX | PASS (F6 recorded) | index present; the two null metrics are supplied by §3 F6 |
| 7 | terminal marker | RELEASED | `ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED` |

Registry reconciliation performed by this review:

```text
capability-registry/records/CAP-CITY-MEMBERS-NATIVE-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      the pending-Formal-Review entry replaced by the PASSED record, with F1 named
  evidence                        reviewer probes + this report added as review refs
workbook CEX-705
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the twenty-one missing template fields backfilled, exposure values transcribed from the author's record
```

## 5. What this review does NOT claim

* **No second physical handset.** Only one is attached; the other members were real City members driven by real
  session credentials over HTTP. App↔app messaging between two phones is NOT observed, and neither is a receipt
  arriving on a second phone.
* **No Web session-credential run.** The Web comparison used the owner control token; the Web surface was not driven
  as an enrolled session.
* **No soak, rotation, low-memory or ANR-under-load behaviour**, and no long-running reconnect churn.
* **F1 is not repaired here.** It lives in `members.mjs`, which this commit does not touch; the finding is recorded
  with its minimum repair boundary and left to the programme. F2 is latent and F3 is configuration-dependent by
  nature.
* **No performance claim.** The latency figures in F6 are a local City on one physical host and are labelled as such.
* This verdict covers only `de9185a4ef8d761053c88316ec9efeca037239fb`. A later head needs its own review, and
  `review/CEX-705-mech-review` is review evidence, not a merge candidate.
