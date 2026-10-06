# RF-002 Development Report — Unified Pairing + Trust Lifecycle

```text
MISSION                  = RF-002 (Remote Fabric programme, task 2 of 10)
PROGRAMME                = REMOTE_FABRIC_ENGINEERING
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Alien
CONTROL_BOOK             = Digital-City/mission-book/remote/RF-002-unified-pairing-trust-lifecycle.md
CROSS_PROGRAMME_CONTRACT = Digital-City/mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
CLAIM_COMMIT             = a6d570c (Digital-City main, claim of RF-002 Development by Alien)
CLAIMED_AT               = 2026-09-30T12:48:00Z
COMPONENT_BASELINE       = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/Utopia
IMPLEMENTATION_BRANCH    = remote/RF-002-unified-pairing-trust-lifecycle
IMPLEMENTATION_HEAD_SHA  = 3c0eb4fe91534e5ec68bf16f5f02ed6a3f413fd7
BRANCH_CI                = 36717914252 — gateway-web success, android success
ARCHITECTURE_CONTRACT    = REMOTE_FABRIC_V1
LOCAL_CHECK_SUMMARY      = root 101 pass, rooms 69 pass, city 1840 pass, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

New module `city/00-foundation/02-city-node-network/pairing-trust/`, in the building
RF-001 declared for the City map's *Device Node Fabric*:

| File | Purpose |
|---|---|
| `contracts.mjs` | entry points, phases, the legal-transition table, trust roles/states, document validation, the device-preview builder, canonical form, digests and the leak scanner |
| `pairing.mjs` | the pairing authority: session state machine, one-time confirmation, expiry/cleanup, trust lifecycle (rotate/revoke/lost/quarantine/re-pair), reconnect revalidation, audit log |
| `index.mjs` | public surface |
| `PROVENANCE.json` | programme-task provenance (no donor) and the recorded boundaries |
| `tests/pairing-trust.test.mjs` | 38 tests |

Shared files changed:

| File | Change |
|---|---|
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | declares building `02-city-node-network` + module `pairing-trust`; description updated from two to three incubation identities |
| `city/tests/manifest.test.mjs` | census entry + separate provenance proofs for a migration (`DONOR.json`) and a programme task (`PROVENANCE.json`) |
| `city/docs/{en,zh-CN}/ARCHITECTURE.md` | third incubation identity, RF-002 section, building tree |
| `tests/capability-registry.test.mjs` | replaced a brittle absolute census count (D8) |

Not touched: `apps/web/**`, `apps/android/**`, `services/**`, `agents/**`, `contracts/**`,
`platform/**`. No runtime behaviour changed. No branch merged to Utopia main.

## 2. Required acceptance coverage

| Required acceptance | Tests |
|---|---|
| local discovery, Bluetooth and remote invite all feed the same pairing state model | `every join entry point feeds the same pairing state machine`; `a Bluetooth bootstrap and a remote invite end in the same TRUSTED record` |
| two sides can display stable fingerprints for confirmation | `both sides present stable fingerprints, and the confirmation is bound to them`; `a preview that carries a different fingerprint than the key exchange is refused` |
| reused/expired pairing attempts are rejected | `a replayed bootstrap nonce is refused…`; `a confirmation token is single-use even across sessions`; `a wrong confirmation token is refused…`; `a session past its deadline cannot advance…`; `expiry is a fact about the clock…`; `failed-pair cleanup retires exactly the overdue sessions…` |
| revoked devices cannot reconnect with old credentials | `a revoked device cannot reconnect with its old credentials`; `a lost device loses every trust it holds…`; `a quarantined device is refused…` |
| trust role changes are explicit and auditable | `a trust role change is explicit, auditable and transfers no capability` |
| MAC mismatch may warn during local onboarding but cannot replace cryptographic identity checks | `local MAC evidence may warn a human but never blocks or grants`; `a missing or randomised MAC does not obstruct pairing`; `MAC evidence can never be turned into trust` |
| logs prove state transitions without leaking private key material | `the audit log proves every state transition without carrying key material`; `the leak scanner really detects a leak…` |

Additional negative/security coverage: the full legal-transition table
(`the transition table is respected and terminal states are terminal`), distinct outcome
codes for reject/cancel/fail, refusal at every phase, malformed session and trust documents
(21 refusal cases across two tests), wrong actor, wrong fingerprint, wrong credential,
unknown device, unknown trust, duplicate trust for one device, unpromotable scope, trust
id/device id/role/credential shape checks, purity of id minting, and a
non-vacuity check on the leak scanner (it must detect a planted leak, or its clean answer
would mean nothing).

## 3. Decision log (problem → options → choice → reason)

**D1 — Which task to claim after BA-002 Correction.**
A fresh global scan found no actionable owned repair and no eligible opposite-host
Correction (Mech had taken RF-001 Correction and was on GAI-001 Development), so the
unclaimed-Development tier applied. RF-002 was chosen: it is a different programme from the
previous claim (Butler), it continues the Remote Fabric substrate the other programmes'
final E2E gates depend on, and it builds directly on the identity model RF-001 authored —
so the seam between them is one this host can judge rather than guess.

**D2 — One module or a module per entry point?**
One. The mandatory invariant is "many join methods, one trust protocol", and the only way
the code can enforce that is for every entry point to be *data* (`ENTRY_POINTS`) consumed by
one state machine. A module per transport would have made the invariant a convention.

**D3 — Where the trust state machine lives.**
`city/00-foundation/02-city-node-network/pairing-trust`, beside `device-identity`. The City
map assigns node identity *and* trust to one building, and a pairing cannot be understood
apart from the identity it binds. Recorded in `PROVENANCE.json` with the rejected
alternative (a separate building).

**D4 — What a confirmation token is, and what is stored.**
The caller supplies a nonce; the authority stores only `sha256(nonce)` as
`confirmation_token_ref`. Reason: the audit log has to be publishable — "logs prove state
transitions without leaking private key material" — and a design that stored the token would
have failed that acceptance criterion by construction. The consumed-digest set lives in the
authority rather than in the session, which is what makes a token single-use *across*
sessions rather than only within one.

**D5 — Replay protection at the bootstrap step.**
A session's `challenge` is the digest of its nonce, and a nonce already used to open a
session is refused (`challenge_replayed`). Reason: "reused pairing attempts are rejected"
has to cover the case where an observer replays an entire handshake, not only the case where
a session is reused. The nonce itself never reaches the authority, so the seen-set is a set
of digests.

**D6 — Legal-transition table vs. per-operation guards.**
An explicit `PAIRING_TRANSITIONS` table, with one `transition()` gate every phase change
goes through. Reason: it makes "a session never skips the human preview" a property of data
rather than of five separate functions, and it lets a test enumerate it.

**D7 — Should a REJECTED transition be legal from the first phase?**
Originally `PAIRING_SESSION` could not be rejected, which meant a human could not refuse a
device immediately after discovery — only after a key exchange. Found while writing the test
`a pairing can be refused at any phase`: refusing must be available at every phase, so
`REJECTED` was added to the first phase's targets. Recorded because it was a design change
driven by an acceptance reading, not a bug fix.

**D8 — The fragile census fixture, again.**
`tests/capability-registry.test.mjs` asserts an absolute count of infrastructure buildings
(`kernelBuildings === 2`). Declaring the node-network building made it fail with
"actual: 3, expected: 2" — a census count, not the rule the test exists to check. This is the
third occurrence of the same latent defect class in this repository (MB-002, MB-005, and now
RF-001/RF-002), so it is repaired the same way: the buildings are named explicitly and a
non-vacuity assertion replaces the count. RF-001 makes the identical repair on its own
branch; the two will conflict textually at integration and the merge workbook must take
either (they are equivalent).

**D9 — `cancelPairing` and the caller's reason.**
Originally `cancelPairing` hard-coded `reason: 'CANCELLED'` while `reject`/`fail` recorded
the caller's. Found by the test `reject, cancel and fail are distinct recorded outcomes`:
"the user backed out" and "the transport died" are different facts and only the caller knows
which happened, so the reason is now recorded when supplied.

**D10 — A refusal must not mutate.**
Found while writing `a refusal never leaves the session changed`: the phase edge used to be
checked *after* the payload fields were assigned, so a session refused for being terminal
had already had `responder_fingerprint` (or `preview`, or `confirmation_token_ref`) written
into it. Every operation now checks the edge first (`assertTransition`) and its content
second. This is the same "a rejected write is a no-op" property the sibling contracts assert,
and it is now asserted here too.

**D11 — Re-pairing after revocation needs an explicit flag.**
The first draft allowed a revoked device to re-pair silently, because the "already trusted"
check skipped REVOKED records. That would make revoking a *lost* device undoable by simply
pairing again. `replaceExisting: true` is now required for any device that already holds a
record, and the old record is kept as history. Recorded because it changes the re-pair
semantics the workbook asks for.

**D12 — Snapshot-like persistence.**
Not implemented. The authority is in-memory, and a durable store plus its reload semantics
are outside this task's scope; recorded as a boundary in `PROVENANCE.json`.

**D13 — Evolution-feed record.**
Not used, consistent with BA-001 D11 / BA-002 C5 / EM-001 D13 / RF-001 D8: the
`contracts/evolution` event schema is migration-scoped (`^MB-[0-9]{3}$`, roles
`MIGRATION|VERIFICATION`), so no RF event validates and extending it would touch the frozen
`contracts/**` surface. This report and the workbook frontmatter are the construction record.

## 4. Test summary

| Check | Result |
|---|---|
| `node --test city/.../pairing-trust/tests/pairing-trust.test.mjs` | 38 pass / 0 fail |
| `node --test tests/*.test.mjs` | 101 pass / 0 fail |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1840 pass / 0 fail (baseline 1802 + 38 new) |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36717914252 on 3c0eb4fe91534e5ec68bf16f5f02ed6a3f413fd7 | **gateway-web success, android success** |

FAILURE_REPAIR_SUMMARY: four issues surfaced while writing the suite and all four were
repaired in the module rather than worked around in the test — the missing `REJECTED` edge
from the first phase (D7), the discarded cancel reason (D9), the mutate-before-refusal
ordering (D10), and the silent re-pair after revocation (D11). One test-side assumption was
also wrong and was corrected: the audit log legitimately contains both a `SESSION_STATE`
entry and a named event per phase, so the ordering assertion filters rather than expecting
only one of the two.

## 5. Integration seams handed to sibling tasks

- **RF-003 / RF-004 / RF-005** own discovery, Bluetooth bootstrap and remote rendezvous.
  They produce an `ENTRY_POINT` and call `startSession`; they must not create a second state
  machine, and the module deliberately performs no discovery itself.
- **RF-006** owns the secure transport path manager. This module binds fingerprints and
  establishes trust; it does not encrypt anything, and invariant 4 is not satisfied by it.
- **RF-009** owns presence/offline/reconnect audit. `checkReconnect` here answers whether a
  trust record still stands and the credential matches; it is not presence and not a session.
- **RF-010** owns the fabric policy boundary and public API. `capabilitiesFromTrustRole`
  always answers none, which is the seam that keeps trust from becoming permission.
- **RF-001** owns `device_id`/`installation_id`. This module consumes a device id and a
  credential fingerprint as data and mints neither.
- **EM-006 / EM-007 / GAI-007** depend on Remote Fabric for cross-device execution. A
  successful pairing here is not a capability grant; those programmes must still resolve
  capability and policy.
- **Merge-workbook seam:** this branch declares the building `02-city-node-network`, extends
  `city/tests/manifest.test.mjs` for programme-task incubators, updates both
  `city/docs/*/ARCHITECTURE.md`, and repairs the census fixture in
  `tests/capability-registry.test.mjs`. RF-001 does the same on its own branch. The Remote
  merge workbook must take the union of the two (two modules in one building; one
  incubation-identity extension; one fixture repair) rather than one side wholesale.

## 6. Open items for the Correction host / Owner

1. Adversarial review should attempt: a confirmation replay that reuses a session id across
   authorities; a challenge that differs only in encoding (the challenge is a digest of a
   string, so `'n1'` and `'n1\u0000'` are different nonces — confirm that is acceptable); a
   trust record whose `session_id` names a session that never reached `TRUSTED`; an entry
   point that is valid but was never actually used; and re-pair that leaves two TRUSTED
   records for one device if `replaceExisting` is combined with a different trust id.
2. Whether a rotated credential should trigger an automatic re-pair or always require an
   explicit re-pair is an Owner policy decision; this module refuses with a distinguishable
   `credential_rotated` reason rather than guessing.
3. The evolution-feed question (D13) remains open for the Owner, now with four programmes
   and three reports all recording the same reasoning.

```text
DEVELOPMENT_COMPLETE = true (branch CI 36717914252 green on both required jobs)
CORRECTION_ELIGIBLE  = true (must be performed by Mech, not Alien)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
