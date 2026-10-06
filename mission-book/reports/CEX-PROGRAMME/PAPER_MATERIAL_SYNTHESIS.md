# CEX programme — paper material synthesis

> Produced by CEX-790 as the workbook requires, aggregating the five entry workbooks and the opposite-host reviews
> performed on this host. Every figure below is traceable to a named artifact; nothing is inferred from a summary.

```text
PROGRAMME           CAPABILITY_ENTRY_CLOSEOUT (CEX-701 … CEX-705, audited by CEX-790)
AUDIT BASELINE      dependency union 5c7d46dcbf1b01259b5edaf574b620714beb40b7
AUDIT EVIDENCE      utopia:evidence/raw/mission-book/CEX-790/capability-inventory.json
                    utopia:evidence/raw/mission-book/CEX-790/CAPABILITY_ENTRY_INVENTORY.md
REVIEW EVIDENCE     mission-book/reports/CEX-70{1..5}/REVIEW_REPORT.md
```

## 1. Hidden capability count

```text
audit items total                                 145
EXPOSED                                           109
EXPOSED_ADVANCED                                    1
INTERNAL_PROTOCOL                                  24
CURRENT_ENTRY_GAP                                   8   (after curation: 5 registry gaps, 2 parity, 1 by design)
PARITY_GAP                                          3   (after curation: 2 real, 1 false positive)
registry records before the audit                  11
registry records after the audit                   12   (+ CAP-CAPABILITY-BRIDGE-001)
registry reality mismatches found                   1   (CAP-WORKER-POOL-AGENT-001)
```

The one **hidden capability** the final audit found is the capability-bridge invocation surface: user-reachable from
both Web and Android Services panels and named by no capability record. It is "hidden" in the registry sense, not in
the product sense — the UI existed, the registry did not know about it.

## 2. Gap taxonomy, with one kind per audited item

```text
REGISTRY_GAP             5   user-reachable surface with no capability record            (capability bridge)
PARITY_GAP               2   first-class surface on one platform only, by design         (host PRIMARY/MEMBER switch)
CURRENT_ENTRY_GAP        1   deliberately unwired control                                (generic CONFIRM)
FALSE_POSITIVE           3   classifier blind spots, resolved to EXPOSED                  (ACTION_WIRING, "Action" page)
FUTURE_PRODUCT_INTEGRATION 0  no backlog capability was pulled into a first-class surface
DEPRECATED               0
```

## 3. Web/Android parity gap count

```text
workbook-declared parity gaps closed by the programme   6 of 6
  CEX-701 device recovery / rebind / clone surface      Web + Android
  CEX-702 alternate-device choice                       Web + Android
  CEX-703 capability catalogue                          Web + Android
  CEX-704 owner onboarding / admission                  Web + Android
  CEX-705 member management / messages                  Web + Android
  (counted from the routes the Android client calls, verified by the CEX-705 review PROBE 7)
remaining parity gaps after the audit                   2
  the host PRIMARY/MEMBER role switch is browser-only, by design
```

## 4. Defects discovered by development versus by review

```text
BY DEVELOPMENT (retained in each workbook's failures list, not hidden)
  CEX-701  projection/model red; malformed enrolment red; same installation with wrong device red
  CEX-702  replay false-acceptance red; missing locale; navigation ticket invalidation
  CEX-703  missing parser red; layout failure beside availability; extra QR credential field red
  CEX-704  frozen harness clock INVALID; device CTRL+A input failure; share policy block
  CEX-705  projection missing model red; other-City/malformed enrolment red; malformed population red

BY OPPOSITE-HOST REVIEW (this host)
  CEX-701  F5 MEDIUM  aggregate "needs recovery" rendered as "this installation" (live city-scoped credential)
  CEX-701  F1/F2 LOW  share-failure guidance overwritten by the poll; other-surface session is a dead end
  CEX-702  F1 LOW     the workbook's mandatory handoff latency was left NOT_OBSERVABLE; measured by the review
  CEX-703  F1 MEDIUM  the Android availability chip ignores `mutating`, so a locally mutating target reads SAFE
  CEX-704  F1 LOW     the share-failure guidance is erased by the 2-second poll
  CEX-705  F1 MEDIUM  the member projection reports an offline node as connected; the same row says computeOnline false
  ALL      control-plane: 14–21 template frontmatter fields were absent from every one of the five workbooks
```

The review found **three** findings at MEDIUM and **no** review changed a verdict: all five released their terminal
markers, with findings recorded and left unrepaired by explicit decision.

## 5. Failures and repairs worth carrying forward

```text
an audit's instruments fail before its subject does
  The CEX-790 classifier first read the capability registry from the IMPLEMENTATION repo instead of the control plane,
  so eleven registered capabilities looked unregistered; and its route patterns lost the /api/v0/ prefix. Both would
  have produced a confident, wrong audit. Recorded in the development report.

a union of accepted work is not free
  Five accepted heads do not merge: an octopus merge fails on MainActivity.kt and a hand resolution twice dropped a
  function while editing a conflict block. The per-task symbol check caught it. The union was then validated by the
  five suites, the 154-test regression set, the bilingual gate and an Android build.

a reviewed head can still carry a stale verdict
  CAP-WORKER-POOL-AGENT-001 declared a pending Formal Review after WBC-603 had passed and released its marker.

a mandatory measurement left null three times
  handoff latency (CEX-702), approval latency and parity-gap count (CEX-704), message latency and parity-gap count
  (CEX-705) were all recorded NOT_OBSERVABLE in receipts even though each task's own fixture could measure them. The
  reviews measured them instead: 13 ms click-to-handoff, 8–11 ms approval round trip, 6–9 ms message delivery.
```

## 6. User steps before and after

```text
CEX-701  before: Settings dropped cloneFindings entirely; recovery had no UI
         after:  owner sees the typed conflict, selects the device, confirms — counted in the review at 2 interactions
CEX-702  before: no alternate-device action existed anywhere
         after:  1 navigation + 1 click (the author's own index), confirmed by the review in a real browser
CEX-703  before: capabilities were discoverable only AFTER a failed Ask (baseline terminal.js fetched targets only on
                 UNMATCHED, and the Android branch additionally required a click)
         after:  exactly 2 interactions with ZERO Ask submissions, measured by the review in a real browser
CEX-704  before: Android could only join; owner actions existed on Web only
         after:  generate / share / approve / reject reachable from 更多 → 配对, verified on the handset
CEX-705  before: City name, installations, revoke, roles, sharing and messages were Web-only
         after:  both surfaces; the review verified 6 of 6 listed features reachable from the Android routes
```

## 7. API → UI dropped-field cases

```text
CEX-701  cloneFindings served by GET /device/installations and DROPPED by the Web Settings list — the defect the
         workbook's premise names; the fix surfaced the typed reason without the credential fingerprint.
CEX-702  the DTO carried no device labels, so provider rows rendered without a name; candidateLabels was added.
CEX-704  GET /pairing/info reports no short code at all, so the code a user reads on the handset cannot be checked
         against that route; the review proved the shown digits are canonical by consuming them from another client.
CEX-705  the credential fingerprint travels in every installations row while the record lists it as intentionally
         hidden; the withholding is presentation-only, the value is a sha256 handle.
CEX-790  the audit itself found the inverse case: a route family reachable from both UIs and named by no record.
```

## 8. Scheduler semantic conflicts

```text
CEX-702  provider choice / alternate device / keep waiting / cancel must not collapse into a generic CONFIRM.
         Verified: keep-waiting writes NOTHING at all (no switchDeclined, no event, no non-GET request), and generic
         CONFIRM stays rendered disabled with no route behind it. The audit classifies CONFIRM as CURRENT_ENTRY_GAP
         BY DESIGN, which is the honest state until a canonically identical route exists.
CEX-702  strict-target tasks must not offer a conflicting "use another device" button: verified, and the server
         refuses with TARGET_DEVICE_BOUND and mutates nothing.
```

## 9. Real-device findings (three workbooks required a handset)

```text
CEX-704  10 scenarios on OPPO PERM00 (BICIPVNB5HS85H9T): generate with a canonical six-digit code and a QR bitmap,
         an ACTIVE session that never rotates (three independent proofs), the SYSTEM SHARE SHEET — which OPENS,
         CLOSING the author's declared NOT_RUN gap — consume by a second client with the device clearing its material,
         approve and reject both moving canonical truth, a 15 s TTL expiring without auto-generation, a double tap
         producing exactly one session, a code surviving background/resume, and the four legacy join controls intact.
CEX-705  9 scenarios on the same handset: owner reachability, owner rename, a session refused a rename in the UI AND
         at the server, self revoke clearing the credential from shared_prefs, cross-revoke refused on both sides,
         own-node sharing only, send/receive/receipt with a spoofed sender ignored, reconnect re-rendering canonical
         members, and a three-way Web/Android/canonical comparison. Crash and secret sweeps clean.
CEX-701  device work was the author's; the review verified the parser and contracts and read the Compose surface.
```

The one gap no review could close: **no second physical handset exists on this host**, so app-to-app messaging and a
receipt arriving on another phone remain NOT_OBSERVED, as the author's own index already stated.

## 10. Exact CI and test counts

```text
CEX-701  CI 37206760171 / 37207112712 / 37207112720 all success   author 10/10  review 12/12  Android 84/84
CEX-702  CI 37213802935 / 37213840569 / 37213840571 all success   author  4/4   review 10/10  Android 82/82
CEX-703  CI 37222683667 / 37222688854 / 37222688771 all success   author  3/3   review  7/7   Android 80/80
CEX-704  CI 37216216410 / 37216246024 / 37216246022 all success   author  1/1   review 10/10  Android 84/84
CEX-705  CI 37218345150 / 37218364139 / 37218364132 all success   author  1/1   review  7/7   Android 87/87
CEX-790  union validation: five task suites 12/12, join/pairing/enrollment/gateway 154/154,
         check-bilingual SYNCHRONIZED, Android assembleDebug BUILD SUCCESSFUL 18 suites / 97 tests / 0 failures
```

## 11. What this synthesis does not claim

No novelty, performance, autonomy-survival or cross-device claim is made anywhere above. The latencies are single-host
controlled fixtures. The audit's baseline is the dependency union, not `main`; none of the five heads is merged and no
workbook grants merge authority. The terminal marker `CAPABILITY_ENTRY_BASELINE_AUDITED` is a review outcome and is
**not** released by development: the workbook requires the reviewer to rebuild the inventory independently from the
code and to diff the two, and this host cannot review its own work.

语言配对 / Language pair: [English](./PAPER_MATERIAL_SYNTHESIS.md) · [中文](./zh-CN/PAPER_MATERIAL_SYNTHESIS.md)
