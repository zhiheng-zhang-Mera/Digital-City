# JOIN-503 — Device Enrollment + Tokenless Routine Reconnect — DEVELOPMENT REPORT

Reading translation / 阅读译本：Complete reading translation of the historical source, not a second authoritative workbook or acceptance record. Original evidence blocks and unfinished boundaries are retained.

> Workbook: mission-book/connection-onboarding/JOIN-503-device-enrollment-and-tokenless-reconnect.md
> Programme: mission-book/connection-onboarding/README.md
> Standing rules: mission-book/CONSTRUCTION_RULES.md, mission-book/ASYNC_RELIEF_CONSTRUCTION.md
> Role: Development, host Alien
> Branch: join/JOIN-503-device-enrollment-and-tokenless-reconnect

```text
TASK_ID      JOIN-503
ROLE         DEVELOPMENT (Alien)
BRANCH       join/JOIN-503-device-enrollment-and-tokenless-reconnect
BASELINE     13109b4c206feb3c1a9107b369715e84af65eaf1
HEAD         ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7
CI           see development_ci in the workbook frontmatter (V0.2 checks)
STATUS       Development complete; opposite-host review NOT performed; dual-physical-host acceptance DEFERRED
```

## 1. Goal and conclusion

Ordinary daily startup should no longer require copying/pasting a bare token. This change makes first join enroll an installation instance; later startup has the device prove its identity and obtain a short-lived session from the City:

```text
first join (pairing exchange + declare installation)
  → City enrolls a logical device + an installation (RF-001 records)
  → durable installation credential stored on the MACHINE (git-ignored, owner-only)
  → browser receives only a short-lived sess: credential
future boot → device layer mints a session → ONLINE, nothing typed
revoke     → reconnect refused, typed, and no silent re-enrollment
```

## 2. Boundary: reuse rather than rebuild (workbook section 2)

Enrollment semantics come entirely from city/00-foundation/02-city-node-network/device-identity: RF-001 device_id / installation_id / fingerprint / UNBOUND-BOUND-QUARANTINED-RETIRED, resolveInstallationPresentation decision ladder, and detectCredentialClones. New services/dev-gateway/enrollment.mjs is a seam: retain records, issue installation credentials/sessions, validate sessions, translate lifecycle refusals into typed codes. There is no second device registry, MAC/IP identity, or second trust store. RF-002 services/dev-gateway/pairing.mjs is unchanged.

## 3. Change list

| File | Change |
|---|---|
| services/dev-gateway/enrollment.mjs | New registrar: enroll/openSession/checkSession/revoke/rebind/quarantine/list/cloneFindings. Pure logic with caller-injected clock and entropy. |
| apps/client/device-enrollment.mjs | New device layer: .runtime/device-enrollment.json read/write0600, enrollWithCity/openDeviceSession/refreshDeviceSession/listInstallations/revokeInstallation/inviteForExchange. |
| apps/web/enrollment.js | New browser layer: only sess: session credentials; readSessionFromHash accepts only sess: and rejects control tokens passed as sessions; refreshSession/fetchEnrolled/revokeEnrolled. |
| services/dev-gateway/server.mjs | New POST /device/enroll, POST /device/session, GET /device/installations, POST /device/installations/:id/{revoke,rebind}. auth() routes Bearer sess: to registrar every request, without cache. pairing/exchange can carry installation declaration and enroll in the same call. Snapshot gains enrolledDevice; typed errors no longer degrade to500. |
| services/dev-gateway/store.mjs | Three tables devices/installations/device_sessions, shaped like other tables. |
| scripts/utopia-client-launcher.mjs | At startup exchanges device credential for session and passes #session=… to browser instead of control token; --enroll joins another City once; --forget-device deletes local credential. |
| apps/web/app.js | Supports #session=; Settings device identity section shows current installation/expiry/enrolled-device list/removal. Session renews using itself. |
| apps/web/i18n/{en,zh-CN}.js | Device identity wording,284/284 keys aligned. |
| tests/join503-enrollment.test.mjs | New9 tests, all against real gateways. |

Unchanged: pairing.mjs, transport, scheduler/assistant, Android, and RF-001 itself.

## 4. Unspecified choices: problem, choice, reasoning

### D1 — Who enrolls at first join, under which authority

- Problem: enrollment creates authority, so cannot be open to unauthenticated requests; a joining device does not have the control token.
- Choice: attach enrollment to existing POST /pairing/exchange. Pairing exchange itself is the owner's proof: the owner explicitly generated a one-time code. The joining party declares installation in that same call; after successful exchange the City immediately enrolls and returns the durable credential visible once and the first session. POST /device/enroll remains but requires the control token.
- Rejected: having the joiner guess/obtain control token, violating “users do not manage long-term credentials”; a new public enroll route, allowing anyone to self-enroll.

### D2 — Session shape and who stores what

- Problem: section5 requires durable key at device/runtime layer, browser only session-scoped.
- Choice: sess:<32hex> prefix identifies sessions; auth() routes by prefix and queries registry every request without cache, so revoke is immediate. Durable credential resides in .runtime/device-enrollment.json0600, git-ignored, never in URL/DOM/log/repository.
- Reason: caching sessions would defer revoke until next restart, exactly what section9 forbids.

### D3 — POST /device/session must self-authenticate

- Problem: this is where credentials are presented; it cannot require prior auth().
- Choice: the sole selfAuthenticating exception, still executing version(req). Internally strict: installation credentials follow RF-001 ladder; presenting one's own session renews it. First implementation missed this and reconnect received401, a measured construction defect subsequently repaired and recorded here, not only in a commit.

### D4 — Renewal after expiry without a UI prompt

- Choice: Web renews hourly using the session itself. Failures SESSION_UNKNOWN / INSTALLATION_RETIRED / INSTALLATION_QUARANTINED clear local session and show re-pairing required. Device layer exchanges durable credential for a new session.
- Explicitly excluded: fallback to control token after failure; that would defeat revoke.

### D5 — Reinstall and rebind

- Choice: POST /device/enroll accepts unbound:true and creates an installation without a logical device. It has identity but can do nothing until explicit rebind with proof. Direct reuse of RF-001 createInstallation/rebindInstallation, the latter requiring proof.
- Reason: implicit inheritance for automation convenience could silently resurrect a retired device, forbidden by the workbook.

### D6 — Sessions when revoking an installation

- Choice: revoke both retires installation and revokes all its unrevoked sessions, returning sessionsRevoked. For self-revoke Web clears local session and returns to pairing.
- Reason: retiring only the record would let a revoked display work on its old session until expiry. Revocation must be immediate fact.

### D7 — Recorded endpoint is not identity

- Problem: a restarted test City has a different port, making recorded endpoint unreachable.
- Decision: port is not identity. openDeviceSession(record,{endpoint}) lets caller provide the currently reachable address, as launcher does; stored address is only a record. First implementation trusted only stored address and misreported a City restarted on another port as unreachable; repaired.

### D8 — Honest boundary of two-physical-host acceptance

- Choice: this host independently supplies only one-host/two-process/multiple-installation evidence, section5. Section9 Alien+Mech sequence stop→restart→automatic ONLINE→trusted-endpoint revoke→restart denied requires a second physical host. DEFERRED here; DEVICE_ENROLLMENT_RECONNECT_ACCEPTED is not set.

### D9 — No dedicated browser test of the new Settings panel

- Choice: state it accurately. Whole browser tests web.test/web-v02/web-i18n/JOIN-501 four tests are green after change, locale-key alignment passes, but none specifically drives the new device-identity panel. Unverified, not verified.

## 5. Automatic tests (tests/join503-enrollment.test.mjs,9 tests, all real gateways)

| Section8 clause | Coverage |
|---|---|
| 1 first approved join creates/reuses canonical installation identity | joinOnce uses real pairing exchange+installation declaration; assert ins-/dev-/cred- shapes, City visibility, empty cloneFindings. |
| 2 restart then reconnect without user-entered token | Close Gateway, restart same directory, exchange device credential alone for new session; verify real authority at /city. |
| 3 expired session internally re-authenticates without UI token prompt | Advance clock13h; old session401/SESSION_EXPIRED; device credential obtains a new session, never resurrecting old one. |
| 4 revoke denies reconnect | After revoke openDeviceSession throws INSTALLATION_RETIRED, retryable:false. |
| 5 revoked installation cannot silently mint membership | Old session immediately401; installation RETIRED. |
| 6 reinstall/rebind follows explicit lifecycle | New enrollment new device/installation/secret; unbound:true refuses action403 INSTALLATION_UNBOUND; proofless rebind403 rebind_proof_required; proof rebind to the same logical device works. |
| 7 no permanent secret in DOM/log/URL/repository | Snapshot/canonical events/persisted records/QR payload lack durable secret; device file holds it with0600, asserted outside Windows. |
| 8 engineering manual fallback isolated | Control-token route still works with enrolledDevice===null; no credential401; invite contains no cred-. |
| Additional | Correct credential+wrong instance403 CLONE_DETECTED and canonical DEVICE_CLONE_DETECTED event. Corrupt/unknown device file refused, not partly used. Structurally sound but unreachable CITY_UNREACHABLE, retryable:true, distinguished from credential issues. |

Full suite node --test tests/*.test.mjs:1080 tests/1078 pass/2 fail. Source records the same pair as JOIN-501 report: tests/capability-adapters.test.mjs and tests/city-roads.test.mjs, CORRUPT_INPUT. Reproduced in independent untouched-baseline worktree; local City-tree missing dependencies, unrelated to this change. This translation preserves that historical attribution as written.

## 6. Unfinished / honest boundaries

1. Opposite-host Formal Review incomplete: review_host remainsnull, review_complete:false.
2. Two-physical-host acceptance incomplete: second real host Mech must run complete section9 sequence.
3. New Settings device panel lacks dedicated browser testing, D9.
4. Android did not participate: QR payload format unchanged, Android participation not required; section9 does not name Android.
5. No “reviewed” claim. All conclusions are development-host self-tests.

语言配对 / Language pair: [原文 / Source](../DEVELOPMENT_REPORT.md)
