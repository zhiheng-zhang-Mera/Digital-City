# RF-005 Development Report — Remote Invite / Meeting Code / Deep Link Rendezvous

```text
MISSION                  = RF-005 (Remote Fabric programme, task 5 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = cd34ed2 (Digital-City main, "claim(RF-005): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:29:41Z
CONTROL_REVISION_AT_CLAIM= 43f2f5a (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-005-remote-invite-rendezvous
IMPLEMENTATION_HEAD_SHA  = 52646ac30c23ec33d70c4a787ac519be19969a89
BRANCH_CI                = 36737404307 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-invite-rendezvous-v1/` — `invite-rendezvous.mjs` (invite/rendezvous object, four
representations, locator parsing, preview, redeem, confirm, revoke, rate limiting, generic failures),
`index.mjs`, 6-test suite, root `tests/remote-invite-rendezvous.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| The same invite renders as code, deep link, web link and QR payload without creating separate trust records | `one invite renders as code, deep link, web link and QR payload without creating trust records` (`separate_trust_records: 0`, `creates_trust: false`; all four parse back to the same code; typed tolerance for case/spaces/ambiguous characters) |
| Expired/cancelled/already-used invites fail safely | `expired, cancelled and already-used invites fail with one indistinguishable generic error` |
| Guessing/enumeration tests do not leak whether arbitrary device IDs exist | Same test (a malformed locator fails byte-identically to an expired one) plus `guessing is rate-limited and never reveals whether a device exists` (identical failures across probes, per-client 429 with retry-after, no host identity in any failure or preview) |
| Clicking/entering an invite reaches pairing preview but cannot invoke capabilities before confirmation | `entering an invite reaches pairing preview but cannot invoke capabilities before confirmation` (`CONFIRMATION_REQUIRED`, `capabilities_invocable: false`; a declined confirmation grants nothing and does not consume the invite) |
| After trust establishment, the rendezvous token is no longer sufficient to reconnect | `an invite is a one-time rendezvous, and after trust it can no longer reconnect anything` (`RENDEZVOUS_IS_NOT_RECONNECT_AUTHORITY`, invite `USED` on one use, `RENDEZVOUS_IS_NOT_A_CAPABILITY_PATH` after acceptance) |
| Remote pairing can continue into the common transport/path manager without coupling to one relay provider | `the rendezvous service stays independent of the eventual data path` (no transport/session/relay/IP field anywhere in the accepted result; handoff names RF-006 for path negotiation and RF-002 for key exchange) |
| One versioned invite object with high-entropy id, short code, expiry, use count, cancellation | test 1 (code format + checksum), test 2 (expiry/cancel), test 5 (use count, `max_uses`, revoke) |
| Public code/link is a rendezvous locator, never permanent authentication or capability authorization | tests 1, 4 and 6 (`locator_only`, `grants_permission: false`, `is_authentication: false`, `reconnect_authority: false`, and no token/key/link material in any representation) |
| Anti-enumeration / generic errors; independent from the final data path | tests 2, 3 and 6 |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, EM-004, BA-006, EM-008, EM-009, GAI-004 and RF-004 Corrections). Tie-break after EM-009
excluded EM, so RF-005 was chosen: RF-001..RF-004 are already green, and RF-005 is the onboarding entry
point that makes them reachable across the Internet. It also unblocks RF-006 (path manager), which is the
next RF task in sequence.

**D2 — One object with four views, or four objects?** CHOICE: one rendezvous record, four derived
representations computed from the invariant parts (`invite_id`, `rendezvous_ref`, `code`, `expires_at`),
with `separate_trust_records: 0`. Reason: the acceptance bullet explicitly forbids separate trust records;
deriving the views from one record makes divergence impossible, and the test parses all four back to the
same code.

**D3 — What is inside a representation?** CHOICE: only the human code plus a version and (for QR) a source
marker. No token, no key, no device identity. Reason: the out-of-scope list forbids private keys or
permanent bearer tokens in URLs; the test asserts no `token|secret|key=|bearer` appears in any link.

**D4 — Code alphabet and check character.** CHOICE: Crockford base32 (no `I`, `L`, `O`, `U`), a 4-4-1
grouping and a check character computed from the payload; input folds case, spaces, separators,
`I`/`L`→`1` and `O`→`0`. Reason: a Zoom-like code is typed by humans from a screen, so the format must
tolerate transcription and detect typos. Validation is deliberately **local** — a bad checksum is a format
error, not a lookup, so it can never become an existence oracle.

**D5 — How do failures behave?** CHOICE: one `RENDEZVOUS_UNAVAILABLE` failure (404) for unknown, expired,
cancelled, used, over-use and malformed locators, byte-identical in code, detail, status and fields.
Rate limiting is the only distinguishable refusal, and it is applied **before** the code is examined.
Reason: "guessing/enumeration tests do not leak whether arbitrary device IDs exist" cannot be satisfied by
careful wording alone if the failure objects differ at all; the test compares the serialized failures for
identity rather than spot-checking fields. Making the limiter code-blind also means a valid code and an
invalid one are throttled identically.

**D6 — When may the host identity be disclosed?** CHOICE: never before an accepted confirmation. The
preview and the ticket both report `host_identity_disclosed: false` and `host_device_ref: null`; the
accepted confirmation is the first and only place the identity appears. Reason: RF invariant 2 (identity is
cryptographic, not derived from the locator) and the acceptance bullet that entering an invite must not
grant anything. The tests assert the host ref string is absent from the preview, the ticket, the
pre-confirmation refusal and every generic failure.

**D7 — Does redeeming consume an invite?** CHOICE: no — only an **accepted** confirmation consumes a use;
a declined confirmation leaves the invite `ACTIVE` and reusable. Reason: a guest who redeems a code is not
evidence the host agreed, and burning the invite on a declined or abandoned request would make a mistyped
"decline" destroy a legitimate rendezvous. The test drives decline → still usable → accept → `USED`.

**D8 — Multi-use.** CHOICE: one use by default; `max_uses > 1` requires both the caller's
`allow_multi_use` and a deployment policy that permits it, is capped (`max_uses_cap: 8`), and still ends in
`USED` when the count is reached. Reason: the workbook asks for one-use by default and explicit multi-use
only when policy says so; requiring both layers means a single caller cannot widen its own policy.

**D9 — Confirmation authority.** CHOICE: only `host_device_ref` may confirm or cancel; anyone else gets
`NOT_THE_HOST` (403). Reason: the invite's purpose is to let device B ask device A; if any holder of the
code could confirm, the code would be the authorization, which the workbook forbids.

**D10 — Randomness.** CHOICE: the entropy source is injected and required (`ENTROPY_REQUIRED`), with the
reference and code derived from it; the module never calls a random API itself. Reason: consistent with the
other component modules (injected ports, no ambient behaviour), and it makes the code/ref deterministic in
tests. Uniqueness is still enforced — a colliding code triggers re-minting and, if the source cannot
produce a fresh code, a typed refusal (this is what surfaced the test-double issue in §4).

**D11 — Rendezvous is not a session, a path or a capability route.** CHOICE: `reconnectViaInvite` always
refuses; `invokeCapability` refuses before confirmation (`CONFIRMATION_REQUIRED`) and after it
(`RENDEZVOUS_IS_NOT_A_CAPABILITY_PATH`), and the accepted result carries no transport/session/relay field.
Reason: RF invariant 5 (transport hidden, replaceable) and RF invariant 8 (session is not task authority);
the handoff object names `RF-002` for the key exchange and `RF-006` for path negotiation so the seams are
explicit rather than implied.

**D12 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/remote-invite-rendezvous-v1/invite-rendezvous.mjs` | new — invite object, representations, locator parsing, preview/redeem/confirm/revoke, throttling |
| `contracts/remote-invite-rendezvous-v1/index.mjs` | new — public surface |
| `contracts/remote-invite-rendezvous-v1/tests/conformance.test.mjs` | new — 6 conformance tests |
| `tests/remote-invite-rendezvous.test.mjs` | new — root runner entry (101 → 107 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

6 tests. Five failed on first run; one was a genuine module defect, four were corrected expectations or
test-double problems:

1. **Defect:** the HTTPS web-link representation did not parse back — `locateFromUrl` only understood the
   `?c=` query form while the web link uses a `/join/<code>` path. Fixed to accept both, so a link rendered
   by this module always resolves (a representation that cannot be parsed would send users to a dead
   rendezvous).
2. **Test double:** the deterministic entropy stub returned the same bytes on every call, so minting a
   second invite hit the collision guard and refused. The stub now mixes a per-call salt, modelling a real
   source; the module's collision guard was correct and was kept.
3. **Test helper:** the failure-capture helper dropped the error's extra fields, so `retry_after_ms` read as
   `undefined`. Fixed to carry them through (the module was right).
4. **Expectation:** a journal assertion required a `PREVIEWED` event on a path that redeemed a deep link
   directly. Corrected to assert `REDEEMED` and to assert that no preview was required — the module's
   behaviour (a deep link is a complete locator) is the intended one.
5. **Expectation:** one assertion in the rate-limit test was written as a self-referential tautology; it is
   now a real assertion that a second client still receives the generic failure, proving the limiter is per
   client and code-blind.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 107 tests, 107 pass, 0 fail (101 baseline + 6 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36737404307 on 52646ac30c23ec33d70c4a787ac519be19969a89 | success |

## 6. Integration seams handed to sibling tasks

- **RF-002 (unified pairing/trust):** the accepted confirmation hands off with
  `pairwise_key_exchange: 'RF-002'` and `entry_point: DISCOVERY_REMOTE_INVITE`; this module never creates a
  session or a trust record, so RF-002 remains the only trust authority. A rendezvous must be accepted by
  the host before RF-002 is entered.
- **RF-006 (secure transport path manager):** `path_negotiation: 'RF-006'`; the accepted result contains no
  transport, relay or address field, and the module reports `path_independent: true` /
  `relay_coupled: false` so the rendezvous can never become a relay-specific entry point.
- **RF-001/RF-003/RF-004 (identity, LAN discovery, Bluetooth bootstrap):** these are sibling bootstrap entry
  points; all of them must converge on the same RF-002 state machine. A rendezvous `host_device_ref` is
  RF-001's identity, and a Bluetooth payload and an invite code are both locators that grant nothing.
- **RF-007/RF-008 (capability registry, RPC/EVENT/STREAM):** `invokeCapability` deliberately refuses on both
  sides of confirmation, so capability invocation must arrive through versioned addressing, not through a
  ticket. If a future task wants a rendezvous-scoped pre-trust probe, it must add its own contract.
- **RF-009 (presence/offline/reconnect):** `reconnectViaInvite` always refuses; reconnect must consult
  current trust state, and an invite is not presence either.
- **RF-010 (fabric policy boundary/public API):** rate-limit and TTL configuration are deployment policy
  (`policy.rate_limit`, `default_ttl_ms`, `max_ttl_ms`, `allow_multi_use`, `max_uses_cap`) and are published
  via `policy()` for the policy boundary to own.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a code collision forced through a hostile entropy source; a ticket
   replayed after its invite was revoked; `preview` counts toward the rate limit while a valid guest is
   throttled out by an attacker sharing a client ref; the check character's collision probability for a
   deliberately mistyped code; and whether `revoke` after acceptance should also invalidate the ticket.
2. Confirm D7 (only an accepted confirmation consumes a use) and D9 (only the host may confirm/cancel) as
   the intended readings.
3. Confirm whether the generic failure should carry a correlation id for support, which would need to be
   provably non-oracular (this implementation deliberately carries none).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
