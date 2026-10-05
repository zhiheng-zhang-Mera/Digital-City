# CEX-701 鈥?REVIEW REPORT (opposite physical host)

```text
REVIEWER            Mech (MEGA-REP) 鈥?opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       a24c04401308b11548626239e8ca1f9b4276bbdf
BRANCH              cex/CEX-701-Alien-codex-device-recovery (remote tip equals the reviewed head)
BASELINE            40e18db4a6cf5bba1490181a473bc62e681edb8a
DEPENDENCY          JOIN-503 COMPLETE / review_host Mech / review_complete true; declared ancestor
                    77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f verified reachable from the head
REVIEW BRANCH       review/CEX-701-mech-review @ e83edd8 (probes)
EXACT-HEAD CI       V0.2 checks push run 37206760171 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR14 pull run 37207112712 completed/success on the same head
                    City linkage check run 37207112720 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1, F2 LOW (control plane) 路 F5 MEDIUM 路 F6, F7, F8 LOW 路 F3, F4, F9 INFORMATIONAL
TERMINAL MARKER     DEVICE_RECOVERY_ENTRY_ACCEPTED released
```

## 1. How this review was performed (and how it was NOT)

Eighteen changed paths, 278 insertions, 13 deletions. The backend change is one function in
`services/dev-gateway/host-preflight.mjs`; the substance is presentation 鈥?a Web recovery surface, an Android
recovery surface, and the two receipts. Nothing below is taken from the development report, the PR body, a comment or
an author test title.

```text
author suite, unmodified   tests/cex701-recovery-ui.test.mjs + tests/host-preflight.test.mjs
                           -> 10 tests / 10 pass / 0 fail / 0 skipped
reviewer probes, new       tests/cex701-mech-review-probes.test.mjs -> 12 tests / 12 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 15 suites / 84 tests / 0 failures / 0 errors
                                                     (DeviceRecoveryTest 4/4, host MEGA-REP)
related regression         gateway/host/device/enrollment/identity/recovery set -> 196 tests
                           / 193 pass / 3 fail (all three are the known environmental launcher cases, 搂5)
```

**Two of the twelve probes drive a real browser** against a real gateway and read the rendered DOM, because "the user
can complete recovery" is not something a unit test can establish.

**Unlike WBC-603, no existing assertion was relaxed.** One pre-existing test file is touched,
`tests/host-preflight.test.mjs`, and it is **purely additive** 鈥?6 insertions, 0 deletions 鈥?so there is no weakened
check that would need independent compensation. That was measured (`git diff --name-status` plus the diff itself),
not assumed from the file being new.

Probe drafts that failed on my own wrong assumption are recorded in comments rather than quietly fixed:

```text
hand-written capability list / wrong table name   probe defects, not product defects
```

## 2. The seven scenarios the workbook requires, and what actually decided each

The Formal Review section names seven scenarios the reviewer must **construct**. Each was built from scratch against a
real gateway; two were additionally driven through the product's own browser surface.

| # | Scenario | Probe / evidence | Result |
|---|---|---|---|
| 1 | UNBOUND reinstall | PROBE 1 | `state=UNBOUND`, `deviceId=null`, `rebind.required=true`; the reinstall is admitted with an identity and NO logical device |
| 2 | legitimate rebind | PROBE 1, PROBE 8 (browser) | owner selects the original device, ticks the explicit confirmation, submits; state becomes `BOUND` on the original `dev-鈥; no second logical device is created |
| 3 | wrong proof | PROBE 3 | absent, `null`, string, empty-`kind` and shapeless proofs all 鈫?403 `rebind_proof_required`, and the installation is left `UNBOUND` (no half-apply). The same call WITH proof succeeds, so the refusal is about the proof |
| 4 | clone finding | PROBE 4, PROBE 14 | same fingerprint on two instances 鈫?`REUSED_CREDENTIAL` naming both; **neither device is removed**. FALSE case: two ordinary enrolments produce `cloneFindings: []`, so the detector is not a blanket alarm |
| 5 | session rebinding another installation | PROBE 5, PROBE 5b | 403 `SESSION_CANNOT_REBIND` 鈥?for another installation and for its own, because recovery is the owner's act. `device/enroll` from a session is likewise refused |
| 6 | self revoke | PROBE 5 | 200, `scope=OWN_INSTALLATION`, state `RETIRED`; leaving the City is legitimate and affects nobody |
| 7 | owner revoke another installation | PROBE 5 | 200, `scope=CITY`, target `RETIRED` |
| 鈥?| a real browser flow | PROBE 8, PROBE 9 | owner completes a recovery end to end; a member is given actionable owner guidance and no recovery authority |

The workbook's five prohibitions, each with where it was decided:

```text
no second device registry        the recovery module is presentation only; PROBE 1 asserts no extra logical device
                                 appears, and the surface builds its choices from canonical members/installations
no bypassing the rebind proof    PROBE 3: five malformed proofs refused by name with no state change
no auto-delete on a clone        PROBE 4 and PROBE 8: both the original and the clone fixture survive a recovery
no durable credential in the FE  PROBE 8: after a successful recovery, neither sessionStorage nor localStorage holds
                                 any installation secret - only the credential the page was opened with
no session->owner promotion      PROBE 5, PROBE 5b: rebind, cross-revoke and enroll are all refused for a session,
                                 and the member payload contains no other installation at all
```

## 3. Hypotheses tested and REJECTED (recorded so they are not re-opened)

A rejected hypothesis is evidence, and these four were the attacks most likely to have found something:

```text
"the UI gate is the only barrier against moving a bound installation"
  REJECTED. Rebinding a BOUND installation onto a DIFFERENT logical device answers 403 `already_bound` with a detail
  naming the current binding, and the row is unchanged. The API is a barrier in its own right. (PROBE 11)

"the owner can brick the City through the revoke path"
  REJECTED. The City host has its own hostDeviceId but is NOT an installation in the revocable list, so
  /device/installations cannot retire it. Revoking every listed installation leaves health, /city and task creation
  at 200. The workbook's "safe revoke path" holds structurally, not by UI politeness. (PROBE 12)

"a City with no other bound installation leaves an unsubmittable recovery form"
  REJECTED. In the minimal case - one UNBOUND installation and nothing else - the select still offers the host's own
  logical device from city.members, so recovery is possible and the form is never a dead end with no explanation.

"cloneFindings discloses a usable credential"
  REJECTED. credentialFingerprint is sha256(secret) - a non-reversible comparison handle - and the secret never
  appears in any listing or UI. Measured in the payload and in the browser. (F3 records a wording consequence only.)

"the Android parser reads a field the server does not send"
  REJECTED. The store row carries a nested rebind:{required}, but the API row is projected with a top-level
  `rebindRequired` boolean; the Android parser reads the API shape, verified against a real payload.
```

## 4. Findings

### F1 鈥?LOW (control plane): fourteen template fields are absent, including every exposure field this task is about

Relative to `MISSION_TEMPLATE.md`, CEX-701's frontmatter omits:

```text
user_exposure_class  user_exposure_surface  user_exposure_nesting  backend_wiring  ui_exemption_reason
research_watchlist_hits  highest_research_grade_observed  research_capture_level
state_identity_evidence  state_identity_evidence_refs
monitor_observability_evidence  monitor_observability_refs  decision_trace_evidence  decision_trace_refs
```

This matters more here than in a research workbook. CEX-701 **is** a Capability Entry Closeout: its whole subject is
moving an existing server-side identity lifecycle into a user-reachable surface, and 搂14A requires the exposure class,
surface, nesting and backend-wiring decision to be recorded in the workbook. Meanwhile `PAPER_MATERIAL_INDEX.md`
cites five watchlist signals and a `G4_RARE_SYSTEMIC` / `MAXIMUM_BOUNDED` classification that the workbook itself
never declares, so nothing in the workbook lets a reader reconcile the two.

**Reconciled by this review** (搂5), transcribing the values from the author's own verified registry record
`CAP-IDENTITY-001` (which already states `DIRECT_CONTROL`, a Web surface at `L2_CONTEXTUAL`, an Android surface at
`L3_ADVANCED`, `backend_wiring_status: VERIFIED`) and from the current watchlist. The reviewer supplied no new
judgement of its own; it moved the author's declared facts into the field the template requires, and says so here.

### F2 鈥?LOW (control plane): the mandatory before/after user-path step counts are recorded nowhere

The workbook's 璁烘枃绱犳潗寮哄埗鐐?explicitly requires: "淇鍓嶇敤鎴疯矾寰勬鏁帮紱淇鍚庣敤鎴疯矾寰勬鏁? 鈥?the before and after
length of the user's path. Searched and not found:

```text
mission-book/reports/CEX-701/*.md                      no step/path count
utopia evidence/raw/mission-book/CEX-701/*.json        scenarios listed, no path length
utopia data-records/.../CEX-701/events.jsonl           seven events, no path length
git grep -i "step count|clicks|姝ユ暟" at the reviewed head   no relevant hit
```

This is the one measurement that makes the capability's core claim checkable. The premise is "API 宸叉湁瀛楁浣?UI 涓㈠純"
plus "rebind 鏃犳甯?UI" 鈥?that is an *exposure lag* claim, and the index records the investigation
("Web fetch receives cloneFindings but Settings drops it; no normal rebind entry") without quantifying the path that
changed. A reader cannot tell how much the fix improved the user's path, and the programme's own exposure-gap
material (`EXPOSURE_LAG = T(reachability_verified) 鈭?T(implementation_complete)`) depends on exactly this kind of
count. **Not repaired here**, because inventing step counts would fabricate the measurement; the minimum repair is
for the author to record the before path (what a user had to do when Settings dropped the findings) and the after
path (select device 鈫?confirm 鈫?submit) with the surface they were counted on.

### F3 鈥?INFORMATIONAL: the registry is stricter in wording than the API is in fact

`CAP-IDENTITY-001` lists `"credential fingerprint"` under `intentionally_hidden_information`, but every
`GET /api/v0/device/installations` row carries `credentialFingerprint` and `credentialId`. Only the UIs withhold
them. The value is `sha256(secret)`, so this is not a disclosure defect 鈥?it is a wording consequence: "hidden" is
true of the presentation and false of the wire. Recorded so a later reader does not treat the registry field as a
withholding guarantee it does not make.

### F4 鈥?INFORMATIONAL: a rebind that changes nothing is still accepted and re-recorded

`already_bound` refuses to **move** a bound installation (PROBE 11), but a rebind naming the installation's **own**
current device answers 200 and rewrites the recorded proof. The UI never offers this (the form appears only for
`UNBOUND`/`rebindRequired`), the caller must already be the owner, and no state changes beyond the re-recorded proof.
Recorded because the guard is asymmetric: it protects integrity, not the audit trail.

### F5 鈥?MEDIUM: the Android surface asks an aggregate question and answers it in the singular

`DeviceRecovery.kt:8` computes `needsRecovery = installations.any { it.state == "UNBOUND" || it.required }` over
**whatever the credential's scope returned**, and `DeviceRecovery.kt:20` renders that as *"This installation needs
recovery. Ask the City owner to choose the original device and approve recovery in Web Settings, then reconnect
here."* The app cannot identify itself: its only self-identity is `clientRef = "android-" + Build.MODEL`
(`CityClient.kt:32`), which is not a server installation id.

This is the live Android path, not a corner: the Android client pairs with the City **control token**, so
`GET /api/v0/device/installations` answers `scope: "CITY"` with the whole roster (PROBE 1 measured exactly that).
One other UNBOUND installation anywhere in the City therefore makes this phone announce that *its own* installation
needs recovery. Workbook requirement 1 鈥?"鐪嬭鏈畨瑁呮槸鍚﹂渶瑕?recovery" 鈥?is answered for the City, not for this device.

The direction is the safe one (it over-reports and pushes the user toward the owner rather than hiding a real
recovery), which is why it does not block the gate: the gate asks for a real actionable entry, and the entry is real.
Minimum repair: persist the installation id returned at enrollment and scope the question to that row, or stop using
the singular 鈥?name the installation whose state is being reported.

### F6 鈥?LOW: several Android fields would fabricate a value where the device runtime has none

`DeviceRecovery.kt:13` guards `displayName` and `deviceId` against Android's `optString` returning the four-character
string `"null"` for a JSON null 鈥?the very trap that produced the JOIN-590 "City identity conflict" on this same
platform. `installationId`, `state`, `errorCode`, `error` and `cloneFindings[].reason` have **no** such guard, so on
the device runtime a JSON null in any of them becomes the literal text `"null"`: an installation named `null`, a
state `null`, or 鈥?worst 鈥?a clone reason of `null` that renders the security warning
(`DeviceRecoveryPanel.kt:31,44`) for a payload that reported no conflict at all.

**Reachability, stated honestly:** the shipped Gateway never sends those fields as null (the API projects
`rebindRequired` and always emits a `code`/`reason`), so today this is latent 鈥?reachable from a schema change or a
different Gateway implementation, not from the reviewed server. The package already contains the device-safe idiom
the new parser should have used (`Actions.kt:13` `textOrNull`), and `NOT_OBSERVABLE` appears nowhere in the Android
sources, so an explicitly unknown state has no representation. Minimum repair: route every string through
`has`/`isNull` and give the state an explicit unknown value with a reason.

### F7 鈥?LOW: an authority refusal reaches the user as a connection fault, with the server's code replaced

`CityClient.kt:73` handles a non-2xx by throwing a plain error carrying only `error` for every route except
`capabilities/` and `capability-invocations/` (which throw a typed exception with code and status, `:68-71`). The
`row()` wrapper then synthesises `errorCode` from the exception class, so for this route a 403
`SESSION_CANNOT_REBIND` arrives as `errorCode: "INVOCATION_UNAVAILABLE"` with `httpStatus` null, and
`DeviceRecovery.kt:22` renders *"Installation state could not be read. Check the connection鈥?* for what is an
authority decision. 403 and 404 are indistinguishable, and the technical-details block shows a code the server never
sent. Practical impact today is small (this client holds the control token, so it is rarely refused), and the
underlying `row()` behaviour predates this commit 鈥?recorded because the new surface is its first consumer to depend
on the distinction. Minimum repair: preserve `errorCode`/`status` on this route as the capability path already does.

### F8 鈥?LOW: the new Android unit tests cannot fail for the reason they appear to test

`DeviceRecoveryTest.kt` asserts `recoveryMessage(state).contains("owner")` in tests 1鈥?, but **all four** branches of
`recoveryMessage` (`DeviceRecovery.kt:20-23`) mention the City owner, so that assertion is true for every possible
input and can never fail. Test 3's fingerprint assertion checks that a string the function never receives is absent
from its output. And no test payload contains a single JSON `null`, so exactly the two guards that the **real** server
exercises 鈥?an UNBOUND row arrives with `displayName:null` and `deviceId:null`, measured in the live payload 鈥?are untested; every assertion would still pass with those guards deleted. The suite also runs on
`org.json:json:20180813` (`app/build.gradle.kts:18-20`, because android.jar's org.json is stubbed), whose `optString`
returns `""` for JSON null while the device returns `"null"` 鈥?i.e. it validates the parser against the one
implementation where F6 cannot appear. Test 4 (`ownerSettingsUrlNeverSharesCredentialsOrUnsafeUrls`) is the
exception: it is genuine and pins real rejections.

### F9 鈥?INFORMATIONAL: two presentation details on the Android surface

The `when(page)` title expression has no `"Settings"` branch, so the recovery page header reads *"Connect your
city"* (`MainActivity.kt:100`) 鈥?the panel renders its own "Device recovery" title, so this is cosmetic. And the
parsed `owner` flag is never read anywhere in the app (grep: no use site), so the City owner and a member see
byte-identical guidance 鈥?the owner is told to "ask the City owner", and a member is offered a link to a Web surface
that requires the owner's own credential.

## 5. Completion gates, independently checked

| # | Gate (workbook 搂瀹屾垚闂ㄦ) | Verdict | Basis |
|---|---|---|---|
| 1 | Web recovery complete | PASS | typed clone warning without fingerprint, explicit recovery state, explicit rebind with proof, safe revoke; PROBE 8 end-to-end in a real browser |
| 2 | Android has a real actionable entry | PASS (F5 recorded) | `More > Settings > Device recovery` wired in `MainActivity.kt:135`; panel reports state, conflict, credential-free owner-Web deep link, reconnect action; 84/84 unit tests first-hand. The gate asks for a real actionable entry and that holds; F5 records that the entry answers for the City rather than for this device |
| 3 | clone finding no longer silently dropped | PASS | API returns `cloneFindings`; owner UI renders the typed reason; member payload deliberately scoped to `[]`; false case clean (PROBE 4, PROBE 14) |
| 4 | rebind / revoke authority no regression | PASS | PROBE 3, 5, 5b, 11, 12; `join503-enrollment.test.mjs` and the related set pass |
| 5 | Development / opposite-host Review PASS | **PASS (this report)** | twelve probes + two browser flows + author suite unmodified |
| 6 | exact-head CI green | PASS | runs 37206760171 / 37207112712 / 37207112720, all success on the reviewed head |
| 7 | PAPER_MATERIAL_INDEX complete | PASS (F2 recorded) | index present with scenarios and witness logs; the mandatory step counts are missing |
| 8 | terminal marker | RELEASED | `DEVICE_RECOVERY_ENTRY_ACCEPTED` |

Registry reconciliation performed by this review:

```text
capability-registry/records/CAP-IDENTITY-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      "Opposite physical-host Formal Review pending" replaced by the PASSED record
  evidence                        reviewer probes + this report added as review refs
workbook CEX-701
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the fourteen missing template fields backfilled (F1)
```

## 6. Regression and failure classification

```text
related set (17 files)   196 tests / 193 pass / 3 fail
  host-city-launcher.test.mjs x3   ENVIRONMENTAL, not attributable here: a resident City holds the coordination port
                                   on this host and the tests refuse to disturb it rather than fail on a defect.
                                   The same three fail on the reviewed head's unrelated runs and are documented in
                                   this programme's earlier reviews.
  everything else                  PASS, including join503-enrollment.test.mjs (the declared dependency),
                                   host-preflight.test.mjs and cex701-recovery-ui.test.mjs
```

The reviewed backend change is confined to the Windows inventory scan in `host-preflight.mjs`, and PROBE 10 pins its
invariant directly: a cold timeout retries exactly one **complete** scan (both observations renewed, not just the
failed half), a persistent timeout refuses after exactly two attempts with `HOST_SCAN_TIMEOUT`, a non-timeout error
refuses immediately with `HOST_SCAN_FAILED`, and **a failed scan throws rather than returning an empty host** 鈥?because an empty host is what authorises starting a second City.

## 7. What this review does NOT claim

* **No physical Android device was used.** The Compose surface was read, the parser was exercised by the project's own
  84-test unit suite run first-hand, and the API shapes it parses were confirmed against a real gateway. The
  author's OPPO offline observation is theirs. **Connected/native recovery remains `NOT_RUN`**, exactly as the
  capability record states, and the workbook permits that only because the user receives actionable guidance 鈥?which
  is what this review verified, not that recovery works natively. F5鈥揊8 are findings about the Android surface
  reached by reading and by executing the parser off-tree; the Compose UI itself was never rendered here.
* **The Android unit suite is not accepted as evidence of the Android parser's null handling.** F8 records why: it
  runs on a different `org.json` implementation from the shipped runtime and contains no null payloads. The two guards
  it does not cover were verified by reading the parser against the live payload shape, and F6's device-runtime
  consequence is stated as latency rather than as an observed failure, because no emulator or device run was performed.
* **No user-path measurement.** F2 records that the required before/after step counts do not exist; this review does
  not supply them, and no exposure-lag number is claimed.
* **No intent validation.** `intent_validation_status` stays `NOT_TESTED`: the reviewer confirmed the surface exists,
  is reachable and behaves, not that a real owner's intent was satisfied in production.
* F1 and F2 are **not** repaired in the reviewed artifact; F1 is reconciled in the control plane by this review and
  stated as such, F2 is left for the author because repairing it means taking the measurement.
* This verdict covers only `a24c04401308b11548626239e8ca1f9b4276bbdf`. A later head needs its own review, and
  `review/CEX-701-mech-review` is review evidence, not a merge candidate.
