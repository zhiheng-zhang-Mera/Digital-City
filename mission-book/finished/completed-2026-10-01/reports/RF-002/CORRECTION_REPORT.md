# RF-002 Correction Report — Unified Pairing + Trust Lifecycle

```text
MISSION                     = RF-002 (Remote Fabric programme, task 2 of 10)
STAGE                       = CORRECTION
CORRECTION_HOST             = Mech   (Development host was Alien — two-host gate satisfied)
CLAIM_COMMIT                = e21643b (Digital-City main, "claim(RF-002): Mech claims Correction stage")
CLAIMED_AT                  = 2026-09-30T13:05:57Z
DEVELOPMENT_HEAD_REVIEWED   = 3c0eb4fe91534e5ec68bf16f5f02ed6a3f413fd7
DEVELOPMENT_CI_REVIEWED     = 36717914252 (gateway-web success, android success)
IMPLEMENTATION_REPO         = zhiheng-zhang-Mera/utopia
CORRECTED_BRANCH            = remote/RF-002-unified-pairing-trust-lifecycle
CORRECTED_HEAD_SHA          = be86135e23f9d18bd45fbca623dceee2d593906e
CORRECTED_BRANCH_CI         = 36720364997 — gateway-web success, android success
LOCAL_CHECK_SUMMARY         = module 49/49, root 101/101, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
CORRECTION_COMPLETE         = true
MERGE                       = NOT PERFORMED (forbidden for component branches)
```

## 1. Method

1. **Independent reproduction**: the branch was checked out on Mech in a separate worktree; Alien's
   module suite ran unmodified — **38/38 pass** — before anything was touched.
2. **Two independent adversarial passes** were delegated in parallel (lifecycle/state-machine, and
   document/validation layer). Neither was allowed to modify `city/`; both wrote probes under
   `.runtime/evidence/mission-book/RF-002/correction-001/` and pinned their evidence to `3c0eb4f`.
3. **My own reading and probes** covered the same ground independently (`probe-mine.mjs`,
   `probe-verify.mjs`), because delegated findings are claims, not facts.
4. **Every claim was re-verified by me** before repair. Two delegated high-severity claims did **not**
   reproduce and are recorded as refuted (§5) rather than repaired.
5. Repairs were made directly on the same branch, one regression test each; then the whole local check
   suite, then branch CI.

## 2. Defects found and repaired

### C1 — a TRUSTED session was rewritten to EXPIRED (high)

`expireIfDue` wrote `state = 'EXPIRED'` directly, bypassing the transition gate; `TRUSTED` is absent
from `PAIRING_TERMINAL_STATES` while `PAIRING_TRANSITIONS.TRUSTED` is empty. So routine
`cleanupExpired()` — documented as *failed-pair* cleanup — rewrote a successful pairing, leaving the
trust record pointing at a session that no longer showed TRUSTED and appending a transition the table
forbids.

Observed (mine, pinned to `3c0eb4f`): `expireSession` → `state=EXPIRED`; `cleanupExpired` →
`expired=["pair-1212…"]`; transitions `[… 'TRUSTED', 'EXPIRED']`.

**Repair**: finality is *derived* from the transition table (`isFinalState`), used by `expireIfDue`,
`assertTransition`, `expireSession`, `cleanupExpired` and `inspectSessionDocument`. A state with no
outgoing edge is final, so a successful pairing can never be expired and moving out of it is a
`terminal_state` refusal. No second hand-maintained list was added.

### C2 — a live re-pair left two TRUSTED records for one device (high)

`replaceExisting: true` minted the replacement but never retired the predecessor: `[…trusts].find(device_id)`
returned the oldest record, so after a deliberate re-pair **both** records were TRUSTED,
`checkReconnect` accepted the *superseded* credential, and revoking the replacement left the device
authenticating through the old record — a revocation bypass. Alien's own open item predicted this;
their test covered only the *revoked*-predecessor path.

Observed: `listTrusts(device) = 2 (both TRUSTED)`; `checkReconnect(OLD credential) → allowed:true`;
`checkReconnect(NEW credential) → credential_unknown`; after revoking the new trust the old one still
authenticated.

**Repair**: a replacement supersedes every prior non-revoked record for the device
(`REVOKED` / reason `REPAIRED`, history preserved, ids returned as `superseded`), and
`resolveActiveTrust` reports ambiguity as `trust_conflict` instead of resolving it by insertion
order. After the repair a re-pair leaves exactly one live trust, and revoking it cuts the device off
under both credentials.

### C3 — the human preview was stored unvalidated and shared with the caller (high)

`presentDevicePreview` checked only `preview.fingerprint` and two booleans. A caller-supplied preview
with `mac_evidence.role = 'AUTHORITY'`, `authoritative: true`, `can_block_or_grant: true`, a foreign
`device_id` and an undeclared `private_key` field was **accepted and stored**; the declared
`PREVIEW_FIELDS` / `MAC_EVIDENCE_ROLE` / `MAC_AUTHORITY` constants were consulted by nothing. Because
the caller's object was stored by reference, a later mutation rewrote what the authority had recorded
(with no audit entry) unless the caller happened to pass a frozen object.

Observed: forged preview `presentDevicePreview → state=DEVICE_PREVIEW` with the forged block stored;
a non-object preview on the idempotent path returned `HUMAN_CONFIRM` as success.

**Repair**: the preview is validated against the declared field list, must carry the MAC evidence
constants with `authoritative`/`can_block_or_grant` false, and must name a valid `dev-<32 hex>` device
or null; it is deep-copied and frozen before storage; and the idempotent path refuses a null/decoy
preview instead of reporting success.

### C4 — confirmation tokens had no attempt budget (high)

`requestConfirmation` accepts a caller-chosen nonce whose digest is published in the session document,
and `confirmPairing` counted nothing: 2000 wrong guesses left the session open, and a later correct
guess still minted trust (`role: FULL_NODE`, `confirmed_by: 'attacker'`). Everything else needed to
confirm (`responder_fingerprint`, `device_id`) is public in the session document.

Observed (mine): `2000 wrong guesses accepted=0; session state=HUMAN_CONFIRM; trust minted=0` and then
`correct guess after 2000 failures → "FULL_NODE"`.

**Repair**: wrong tokens are counted; at `MAX_CONFIRMATION_ATTEMPTS` (5) the session transitions to
`FAILED` with `confirmation_attempts_exhausted` and the thrown code says so. After the repair the same
probe ends in `session state=FAILED` and the correct guess is refused with `terminal_state`.

### C5 — a refused `startSession` burned the challenge (medium)

`seenChallenges.set(...)` ran before `expires_at: instantOf(nowMs + ttlMs)`, so a call that could not
construct the session still consumed the nonce; the legitimate retry then failed as
`challenge_replayed`. Out-of-range instants also escaped as a bare `RangeError` rather than a typed
refusal.

Observed: `startSession(ttlMs = Number.MAX_SAFE_INTEGER)` → `RangeError: Invalid time value`, zero
sessions, then the sane retry → `challenge_replayed`.

**Repair**: the deadline is computed (and can refuse) before the challenge is recorded, and
out-of-range instants raise `PairingValidationError('instant')`. After the repair the refused call
leaves no state and the retry succeeds.

### C6 — the device trusted was not necessarily the device shown (medium)

`confirmPairing` accepted any `deviceId`, so a trust could be minted for a device the human never saw
in the preview; `macMismatchObserved` was coerced with `Boolean()`, so the string `'no'` recorded
`true`.

**Repair**: `preview.device_id` is bound to the confirmed device (`preview_mismatch`), and the MAC
mismatch flag must be a real boolean (`malformed`).

## 3. Claims verified as sound (evidence kept)

- Phase order cannot be skipped: confirming from `PAIRING_SESSION`/`EPHEMERAL_KEY_EXCHANGE` →
  `confirmation_not_available`; a foreign preview fingerprint → `fingerprint_mismatch`.
- Terminal states are truly terminal: every follow-up operation on REJECTED/CANCELLED/FAILED/EXPIRED →
  `terminal_state` with a byte-identical document and no trust.
- Replay protection holds: a reused nonce → `challenge_replayed`; a consumed token in a second session
  → `confirmation_replayed`; a failed confirmation neither burns the token nor creates trust.
- Revoked trust is terminal (`trust_revoked` on reconnect, rotate, role change, quarantine,
  re-revoke).
- Entry points cannot be faked; all six converge on one protocol; an unknown entry point is refused.
- MAC is never authority (`NOT_AUTHORITY`, `can_block_or_grant:false`, `trustFromMacEvidence().granted:false`)
  and trust is never a capability (`capabilitiesFromTrustRole('FULL_NODE') → []`).
- No key material in the audit log or the session document; `auditLeakScan` reports nothing.
- Expiry is inclusive at the deadline with no off-by-one; digests are invariant under key reordering.

**The encoding question is settled**: `challengeFromNonce('n1')` and `('n1\u0000')` produce different
challenges and different sessions; no challenge or token is shared. Harmless in both directions.

## 4. Decision log (problem → choice → reason)

**D1 — Trust delegated findings only after re-verification.**
Options: (a) repair everything the reviewers reported; (b) re-verify each claim, repair what reproduces.
CHOICE: (b). Reason: two delegated high-severity claims did not reproduce (§5). Repairing a
non-existent defect would have changed verified behaviour for no reason and made the report
unreliable.

**D2 — Declare TRUSTED terminal, or derive finality from the table (C1)?**
CHOICE: derive. `isFinalState(state) = PAIRING_TRANSITIONS[state].length === 0`. Reason: adding
`TRUSTED` to `PAIRING_TERMINAL_STATES` would have created a second hand-maintained list that can
drift, and would have changed the meaning of that constant (the states a session can *fail into*).
Deriving keeps one source of truth and also fixes `inspectSessionDocument`, which told consumers a
trusted session was not final.

**D3 — Supersede previous trust with REVOKED/REPAIRED, or add a SUPERSEDED state (C2)?**
CHOICE: reuse `REVOKED` with the already-declared reason `REPAIRED`. Reason: no new state, no
validator change, the record survives as history (the author's stated intent), and a superseded trust
is unambiguously unusable. A new state would have needed vocabulary, tests and merge attention for no
additional safety.

**D4 — Resolve two live records, or refuse them (C2)?**
CHOICE: refuse with `trust_conflict`, extracted as `resolveActiveTrust` so the decision is directly
testable with a hand-built population. Reason: after the supersede repair the state is unreachable
through the API, and "answering with whichever record came first" is exactly the silent behaviour that
hid the bypass. An unreachable-through-the-API guard still deserves a direct test.

**D5 — Validate previews against the declared fields, or freeze whatever arrives (C3)?**
CHOICE: both, plus copy-on-write. Reason: freezing alone would have locked in a forged
MAC-authority block, and validating alone would have left the caller able to rewrite the authority's
record after the human saw it.

**D6 — Attempt budget (C4).** CHOICE: count wrong tokens and fail the session at 5. REJECTED: a token
entropy floor — it is a caller/policy decision (a device may legitimately present a short local
confirmation code) and would have churned the existing fixtures; recorded as an Owner item.

**D7 — Repair breadth.** CHOICE: repair the six verified defects and record the rest as typed open
items with the probes that show them (§6) rather than claiming a broader fix. Reason: the remaining
findings are real but either need an Owner decision (token entropy), a cross-cutting refactor
(validator allow-lists and hostile-input totality), or a separate retention policy; none of them is a
trust bypass on the paths exercised.

**D8 — No evolution-feed event.** Unchanged from the development report's D13; this report is the
correction record.

## 5. Delegated claims that did **not** reproduce (recorded, not repaired)

1. *"A fabricated TRUSTED session validates (`ok:true`) and `inspectSessionDocument` reports it
   trusted."* **Refuted**: `validatePairingSession(forged)` → `ok:false` with
   `fingerprint: a TRUSTED session must name the fingerprint it was bound to`; a forged trust record
   also refuses. The reviewer's own probe may have used different bytes; no repair was needed.
2. *"Preview documents are shared and mutable, so a post-confirmation mutation rewrites the
   authority document."* **Partially refuted**: `buildDevicePreview` returns a frozen object, so
   mutating it throws and the digest is unchanged. The *real* half — a caller-supplied plain object
   with undeclared fields and forged MAC authority is stored unvalidated — is real and is repaired as
   C3.

Both are recorded because a later reader must not "re-fix" them.

## 6. Open items for the Owner / a future task (real, evidenced, deliberately not repaired here)

1. **Retention**: `cleanupExpired` marks final sessions but never deletes them (the reviewer started
   5000 sessions and all 5000 were retained). Bounding this needs a policy decision — the
   replay-protection challenge set must be kept (or bounded with its own TTL) so that eviction does
   not re-open nonce replay.
2. **Refusal totality on hostile input**: a document whose field is a `BigInt` or a cyclic structure
   makes the validator throw a `TypeError` from the error path instead of returning `ok:false`
   (reproduced by me: `Do not know how to serialize a BigInt`). The fix is a safe error path plus
   prototype/inherited-key hardening; it is a cross-cutting validator change rather than a trust fix.
3. **Digest is not a commitment**: unknown fields and `NaN`/`Map` coercion mean two different
   documents can share a digest. This belongs with the same validator-strictness work.
4. **`findSecretMaterial` breadth**: it does not recognise `privateKey`/`password`/`token`-style field
   names or by-value mnemonics, so a mnemonic recorded as a free-text `reason` is not reported by
   `auditLeakScan`. Free-text reasons are caller-supplied by design; a policy for what may be recorded
   there is an Owner decision.
5. **Quarantine is a one-way door**: the code comment says "reversible by an explicit decision" but no
   such operation exists. Either the comment or the API is wrong; I left behaviour unchanged and
   record it here rather than inventing an un-quarantine contract in a Correction.
6. **Token entropy floor** (D6) and **monotonic instants**: the injected clock is deliberate, so a
   stale `nowMs` is the caller's business; a monotonicity assertion belongs with a policy decision.
7. **Merge-workbook**: this branch and RF-001 both declare the `02-city-node-network` building and both
   touch `city/tests/manifest.test.mjs`, `tests/capability-registry.test.mjs` and the two
   `city/docs/*/ARCHITECTURE.md`. Take the union (two modules, one incubation-identity extension, one
   fixture repair).

## 7. Reconciliation with DEVELOPMENT_REPORT

- Every acceptance line the report maps to tests has those tests, and they pass on Mech.
- **Discrepancy 1**: D11 says `replaceExisting` "is now required for any device that already holds a
  record, and the old record is kept as history". Requiring the flag is true; *superseding* was not
  implemented for a live predecessor — the test only exercised the revoked-predecessor path (C2).
- **Discrepancy 2**: the report claims "a terminal state is terminal" and "a refusal never leaves the
  session changed". Both were false for a TRUSTED session (C1) and for a refused `startSession` (C5),
  because `expireIfDue` and `seenChallenges` bypassed the ordering the report describes as universal.
- **Discrepancy 3**: the report says the human preview is one of the security properties; it was
  stored unvalidated and not bound to the trusted identity (C3, C6).

## 8. Local checks and CI

| Check | Result |
|---|---|
| module suite `pairing-trust.test.mjs` | 49 pass / 0 fail (38 original + 11 regression) |
| `corepack pnpm test` | 101 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 records verified at 3c0eb4fe9153 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36720364997 on `be86135e23f9d18bd45fbca623dceee2d593906e` | gateway-web success, android success |

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Alien
CORRECTION_HOST     = Mech   (different physical host — two-host gate satisfied)
CORRECTED_HEAD_SHA  = be86135e23f9d18bd45fbca623dceee2d593906e
MERGE_STATUS        = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
