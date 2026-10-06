# JOIN-501 — Pairing Session Lifecycle + Persistent Display — DEVELOPMENT REPORT

Reading translation / 阅读译本：Complete historical reading translation, not a second authoritative record. Original code evidence and unfinished acceptance boundaries are retained.

> Workbook: mission-book/finished/completed-2026-10-06/connection-onboarding/JOIN-501-pairing-session-lifecycle-and-display.md
> Programme: mission-book/finished/completed-2026-10-06/connection-onboarding/README.md
> Standing rules: mission-book/CONSTRUCTION_RULES.md, mission-book/ASYNC_RELIEF_CONSTRUCTION.md
> Role: Development, host Alien
> Implementation repository: zhiheng-zhang-Mera/utopia
> Branch: join/JOIN-501-pairing-session-lifecycle

```text
TASK_ID      JOIN-501
ROLE         DEVELOPMENT (Alien)
BRANCH       join/JOIN-501-pairing-session-lifecycle
BASELINE     13109b4c206feb3c1a9107b369715e84af65eaf1   (Utopia main at claim time; V0.2 checks run 37112596448 SUCCESS on exactly this sha)
HEAD         e925ae1ef4dda6f51d89a1faa025d1b8666d8c58
CI           37116491572 COMPLETED SUCCESS on exactly e925ae1 (workflow V0.2 checks; jobs gateway-web + android)
STATUS       Development complete; opposite-host Formal Review NOT yet performed (see section 8)
```

## 1. Goal and conclusion

Owner semantics, programme README section3, override old UI behaviour:

```text
NO CLICK = NO CODE
IDLE --Generate--> ACTIVE --consumed--> CONSUMED --Generate--> ACTIVE(new)
                       \--expires-----> EXPIRED  --Generate--> ACTIVE(new)
```

Development conclusion: the old implementation did not merely lack a button; session lifecycle did not exist. Pairing material was a render byproduct, cleared unconditionally at five paths involving go(), pagehide, connection!=='ONLINE', and refresh(), while ACTIVE offered Revoke and refresh to rotate codes. This change makes lifecycle a testable state machine and removes all five implicit paths.

None of these paths may create pairing material anymore, corresponding to section3.1 prohibitions:

| Old path | Old behaviour | New behaviour |
|---|---|---|
| Enter Pairing page | No creation, but displayed city.descriptor.pairingSessionId | No creation; no material rendered before a click |
| go(next) navigation | Unconditional clearPairing() | No clearing; navigation back retains same session |
| pagehide | clearPairing() | Persist only, never clear |
| status(s!=='ONLINE') / WS reconnect | clearPairing('pairing.reconnect') | Never clear; offline affects only ability to Generate |
| refresh() snapshot | Unconditionally clear based on descriptor | Ask City through pairing/info first; end only after confirmed consumption/replacement |
| ACTIVE button | Revoke and refresh session creates new code | Code active · expires on its own, disabled; clicks make no creation call |

## 2. Real claim-time code baseline, measured independently

Pairing facts in apps/web/app.js at13109b4, read line by line rather than inferred from reports:

- Line9 declares pairing=null,pairingBusy=false,pairingEpoch=0,pairingNotice=''.
- clearPairing() line88 only sets pairing=null, without a state machine.
- go() line89 immediately calls clearPairing().
- status() line106 calls clearPairing('pairing.reconnect') when not ONLINE.
- refresh() line107 clears when pairing exists and city.descriptor?.pairingSessionId differs from pairing.pairingSessionId.
- Generate click line167 sets pairing=null before requesting, then unconditionally assigns; on failure the user's old code has already disappeared.
- Timer line173 handles expiry; pagehide line174 clears.

City-side services/dev-gateway/pairing.mjs is unchanged. active() requires !usedAt && clock<expiresAt && attempts<5. descriptor().pairingSessionId is nonempty only while active; consumption makes itnull. This is the key constraint for D1 below.

## 3. Changes inside the allowed boundary

| File | Change |
|---|---|
| apps/web/pairing-lifecycle.js | New sole state machine/persistence. Exports createPairingLifecycle(), STORAGE_KEY, three terminal reasons. |
| apps/web/app.js | Integrates state machine; removes five implicit clearing paths; adds generatePairing(), the page's only material-creation function, canonicalPairingSession() pairing/info query and reconcileRestoredPairing(). |
| apps/web/i18n/en.js, zh-CN.js | Adds pairing.active/used/revoked; rewrites pairing.explanation; removes obsolete pairing.refresh. Both key sets still identical271/271. |
| tests/pairing-lifecycle.test.mjs | New15 state-machine unit tests without browser. |
| tests/pairing-session-lifecycle-web.test.mjs | New4 real-Gateway/real-browser acceptance tests, including consumption by a second process. |
| tests/web-v02.test.mjs | Updates contract in place: old assertions required Owner-superseded Revoke and refresh rotation and navigation clearing. |

Unchanged: pairing.mjs, whose City session semantics are correct and misused by the page; transport; scheduler/assistant; Android; apps/web/index.html.

## 4. Unspecified construction choices: problem, choice, reasoning

Every point not fixed by the engineering book was decided below. D1 is the sole defect that initially appeared runnable but was wrong.

### D1 — Distinguishing consumption from an unanswered City at refresh/reload

- Problem: clearOnSessionChanged(canonical) must decide ACTIVE→CONSUMED/EXPIRED. First implementation treated every canonical!==ourSessionId, includingnull, as consumed.
- Measured symptom: after full reload, first snapshot still OFFLINE, descriptor unavailable, pairingSessionId undefined; treated as used, valid code removed, That code was used shown. Violates section3.3 forbidding early loss.
- Reasoning L2: runtime measurement > canonical source. Descriptor is indeterminate during boot. Public credential-free GET /api/v0/pairing/info supplies activeSession/current descriptor.pairingSessionId, the authoritative read-only noncreating answer.
- Choice: canonicalPairingSession() reads pairing/info and returns known:false on failure without guessing. Boot/refresh discrepancies ask first. known=false for unreachable City/protocol mismatch retains material and session; same sessionId does nothing; differing sessionId, includingnull, ends session: USED if before expiresAt, EXPIRED after.
- Why not the simpler “clear only for nonnull descriptor”: consumption producesnull, so ACTIVE would never converge toUSED, violating3.4.

### D2 — Persistence scope and key

- Problem:3.3 requires same still-valid session restored across reload/restart without permanent credential storage.
- Choice: sessionStorage['utopia.pairing-active-session'],version:1. Survives reload and page navigation but disappears on tab/browser close; localStorage would persist across sessions, the forbidden permanent credential. Stored only pairingSessionId/shortCode/createdAt/expiresAt/qrPayload/qrSvg, no token, asserted by tests.
- Restoration is not generation. Corrupt/wrong-version/incomplete/expired records discarded. Expired records produceEXPIRED; failed restoration never automatically generates a new code.

### D3 — Hide or disable the ACTIVE button

- Problem:3.2 recommends either hiding or disabled status.
- Choice: disabled plus wording. Hiding conceals that generation exists but should not currently be used; disabled button itself presents state. Also disabled offline because creation would necessarily fail.

### D4 — Existing material after a creation-request failure

- Problem: old code cleared pairing before request, silently losing user's code on failure.
- Choice: request first, replace only on success. pairingBusy disables in-flight button; failure puts City error in#error and retains state. create() refuses ACTIVE withSESSION_ALREADY_ACTIVE, so double clicks/stale buttons cannot rotate code.

### D5 — Consumption notification without a new API

- Problem:3.4 requires Owner quickly observing consumption; City has no new consumption event endpoint.
- Choice: reuse device exchange→City onChange→event stream→page refresh(), then D1 pairing/info verification. No second trust store/new endpoint; section4 only permits minimal read ability, and publicpairing/info already exists. Measured receiving-process exchange makes OwnerACTIVE→USED automatically without tests touching page.

### D6 — Boundary of updating tests/web-v02.test.mjs

- Problem: old assertions permit Revoke and refresh rotation and require#pairing-code0 after leaving. Directly contradict Owner rules; CONSTRUCTION_RULES§8 prohibits changing success definition to obtain green.
- Decision: migrate tests to new contract, not weaken gates. Replace rotation assertion with.disabled===true plus request counter proving no creation, stronger than unclickable appearance because synthetic clicks still dispatch. Replace navigation clearing with retention of same session, confirmed bypairing/infoid. Add disconnect-does-not-clear assertion: app.close() causesOFFLINE but code remains; document basis.
- No test removed and no existing assertion weakened.

### D7 — Honest boundary of two-machine physical acceptance

- Problem: section 7 requires the development host plus another real consumption endpoint, and Formal Review from another physical host.
- Choice: Alien independently supplies same-host/two-process evidence: a real owner Gateway and a separate receiver Gateway with different ports/tokens exchange through QR/invite (the source refers to section 6 T3). This is not two physical hosts. Cross-physical-host development consumption and opposite-host Formal Review remain DEFERRED, explicitly recorded as unmet in section 8; no PAIRING_SESSION_LIFECYCLE_ACCEPTED marker.

## 5. Automatic tests, actually run locally

### T1 tests/pairing-lifecycle.test.mjs, 15 tests, no browser

Covers the state-machine-testable parts of section 6 clauses 1–12: IDLE does not create and reads have zero writes; one click creates exactly one session; ACTIVE refuses another create; reads preserve id/code/payload; consumption produces USED; expiry produces EXPIRED without creation; an explicit post-expiry click creates a different new session; malformed responses cannot create a partial session; reload restores the same session with its remaining time; expired records restore as EXPIRED; corrupt/wrong-version records are discarded; explicit clear records a reason without creation; matching canonical identity leaves state unchanged.

### T2 tests/pairing-session-lifecycle-web.test.mjs, 4 tests, real Gateway + msedge

- A, primary acceptance: entry creation count is 0, remaining 0 after refresh/reconnect/navigation. One explicit click creates exactly once. ACTIVE re-render, forced clicks and language changes preserve id/code/payload without additional calls. SPA navigation retains the session; full reload restores it without creation. Material contains no control token. Another endpoint's exchange automatically makes the Owner page USED with Generate available. Spent-secret reuse returns 410; the next explicit click creates a different session.
- B, second-process consumption: Owner displays a code; a separate Gateway process with a different port/token exchanges using only the utopia://pair invite (200). Owner automatically becomes USED; City activeSession=false.
- C, expiry: TTL=3s; material disappears, expired reason appears and Generate becomes available, while creation count remains 1. Expiry does not generate; reload does not resurrect the expired code.
- D, credential ephemerality: session-scoped storage has no token. Another browser tab with its own sessionStorage shows IDLE and does not restore someone else's code. City reports no active session after expiry.

### T3 Full suite

```text
node --test tests/*.test.mjs
  tests 1070
  pass  1068
  fail  2
```

The failures are tests/capability-adapters.test.mjs and tests/city-roads.test.mjs, both CORRUPT_INPUT. Their unrelatedness was measured: an independent D:\A-Utopia-ci-baseline worktree at untouched baseline 13109b4 ran these two files unchanged and produced identical failures. They use the City tree's own city/node_modules, absent locally but installed by CI through pnpm --dir city install. This is a local environment gap. JOIN-501 did not touch services/capability-bridge/**, contracts/**, or the City documentation tree.

Other important gates actually run: node scripts/check-bilingual.mjs reports PAIR_STATUS=SYNCHRONIZED for docs, evidence and data-records. tests/web-i18n.test.mjs checks locale-key alignment and Web assets using only existing message keys; all pass.

Required hosted CI bound to the exact head: V0.2 checks 37116491572 at exactly e925ae1 completed SUCCESS. Both jobs succeeded: gateway-web on Windows with pnpm test, verify-promotion-history, rooms tests, city/test-all and check:docs; android on Ubuntu with testDebugUnitTest and assembleDebug. This also resolves attribution of the two local failures: the same CI suite is green after the repository's own City installation, corroborating untouched-baseline reproduction. Local PASS does not replace hosted CI; SHA and run match without borrowing a neighboring head's green result.

## 6. Physical acceptance completed and incomplete locally

| Section 7 requirement | Status | Evidence |
|---|---|---|
| Generate a code once | DONE | T2-A |
| City refresh during validity | DONE | T2-A, wait for a 4s refresh cycle plus manual pairing/info |
| Navigate away/back during validity | DONE | T2-A, Devices → Pairing, id/code unchanged |
| WebSocket reconnect during validity | DONE | T2-A, offline → online events recreate connection |
| Prove code/session unchanged | DONE | T2-A, DOM and pairing/info canonical session id double-check |
| Consume from another real endpoint | PARTIAL: same-host second process DONE; second physical host DEFERRED | T2-B independent Gateway process, 200; consume-invite.mjs ready for Mech |
| Owner ACTIVE → USED | DONE | T2-A / T2-B |
| Formal Review on another physical host | NOT DONE / DEFERRED | Section 8 |

## 7. Evidence pointers

- Raw local, git-ignored evidence: .runtime/evidence/mission-book/JOIN-501/alien-dev/.
  - validate-frontmatter.mjs: City's validate_frontmatter.py requires Python + PyYAML, unavailable locally. The same checks were replicated using the City tree's own YAML parser, including duplicate-key refusal. Across 395 files, 9 existing issues were found, all in the finished/ archive; connection-onboarding/ has 0.
  - apply-appjs-edit.mjs + appjs-edit-set.json: 12 exact literal app.js replacements. Any non-unique match aborts with an error, making the edit set reviewable rather than a collection of manual changes.
  - consume-invite.mjs: receiver consumption tool for the other host; returns only credential existence and length, never the value.
- Code and tests: section 3 table, on join/JOIN-501-pairing-session-lifecycle @ e925ae1.

## 8. Unfinished / honest boundaries, never treat as passed

1. Opposite-host Formal Review incomplete. CONSTRUCTION_RULES §3 requires different physical development/review hosts and prohibits self-review. This host is Alien; Mech was not online in this round. review_host remains null, review_complete remains false; no PAIRING_SESSION_LIFECYCLE_ACCEPTED marker.
2. Cross-physical-host consumption incomplete. T2-B has two real processes, not two real hosts. Section 8's minimum Alien Windows + Mech Windows topology is unmet.
3. Android did not participate. QR payload format is unchanged: utopia://pair?... remains the same City-generated string. Thus no Android change was triggered, nor participation required. If the Review host physically verifies that a scanned code remains valid until consumption, that is additional independent evidence; it was not done here.
4. No reviewed claim. All conclusions are development-host self-tests. Review must independently rerun and specifically try route / reload / reconnect to force early disappearance or secret code rotation.

语言配对 / Language pair: [原文 / Source](../DEVELOPMENT_REPORT.md)
