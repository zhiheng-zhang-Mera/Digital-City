# BA-002 Correction Report — Assistant Core (Shared Brain Runtime)

```text
MISSION              = BA-002 (Butler Assistant programme)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-002-shared-brain-runtime.md
CLAIM_COMMIT         = ab94734 (Digital-City main, claim of BA-002 Correction by Alien)
CLAIMED_AT           = 2026-09-30T12:40:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = d3fbf6c40c695758c3d91ae89162da39a7003349
CORRECTION_BRANCH    = assistant/BA-002-shared-brain-runtime
CORRECTION_HEAD_SHA  = e9add9d1773e46087f032e47572bf69420b3710f
BRANCH_CI            = 36716375960 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 120 pass / 0 fail, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

The Development head d3fbf6c was fetched into a separate worktree and attacked directly.
The workbook for this task is unusually explicit about what matters — "recovery tests
prove one-logical-assistant/many-context-projections semantics and reject stale local
scratch state as authority" and "concurrent promotion/update attempts use version/causal
checks rather than silent last-writer-wins" — so the probe was aimed at the three
mechanisms that carry those claims: the handle that identifies a session, the guard list
that decides what may enter authoritative state, and the snapshot that recovery trusts.

The author's own decision log was used as the specification to test against, not as
evidence. That is what produced the highest-severity finding: the implementation did not
match the behaviour its own D8 describes.

## 2. Independent review findings

Five defects, all reached from the public API, all repaired.

### DEFECT 1 (high) — authority entered authoritative state under a different spelling

`FORBIDDEN_CORE_STATE_FIELDS` is an exact-match list written in each concept's original
snake_case spelling, and `findForbiddenCoreStateFields` compared raw keys. Every other
spelling of the same concept was therefore accepted:

| payload field | Before | After |
|---|---|---|
| `execution_lease` | refused | refused |
| `executionLease` | **accepted and stored** | refused |
| `capability_grants` / `capabilityGrants` | refused / **accepted** | refused |
| `action_key` / `actionKey` | refused / **accepted** | refused |
| `user_self_model` / `userSelfModel` | refused / **accepted** | refused |
| `assistant_profile` / `assistantProfile` | refused / **accepted** | refused |

Proven end to end, not just at the scanner: `core.promote(...)` with
`payload: { executionLease: { holder: 'x', expires_at: '2027' } }` returned a durable
record containing it. That is the module's own stated boundary — "authoritative assistant
state is never canonical user identity, authority or a secret" — defeated by
capitalisation, and it is the mechanism behind invariant 19 (a lease is a safety
prerequisite, never a permission source) being bypassable by writing the field name
differently. The same raw comparison also let plural and camelCase secrets through:
`credentials`, `secrets`, `tokens`, `apiKeys`, `privateKeys` were all accepted while
`token` and `access_token` were refused.

**Repair:** names are normalised (camelCase split into words, every non-alphanumeric run
collapsed to one `_`, lowercased) before comparison, and the secret scan additionally
tolerates a trailing plural `s` while still exempting the reference forms the contract
allows (`*_ref`, `*_refs`, `*_handle`, `*_handles`, `*_id`) — so `grant_ref` and
`token_ref` stay legal and `credentials` does not.

### DEFECT 2 (high) — an embodiment reference from a previous session named a live embodiment

The reference was a bare monotonic counter:

```text
core A:      connectEmbodiment(...)  -> emb-1        (device dev-OLD)
snapshot -> restoreAssistantCore     -> new core, counter reset to 0
new core:    connectEmbodiment(...)  -> emb-1        (device dev-NEW, assistant a2)

restored.attestEmbodiment('emb-1') -> { valid: true, assistantId: 'a2', deviceId: 'dev-NEW' }
restored.promote('emb-1', ...)     -> promoted_by.device_id === 'dev-NEW'
```

The previous session's reference was therefore attested as **valid** for a different
assistant and a different device, and a stale device could promote durable state carrying
another device's provenance. This contradicts the behaviour the author's own D8 states
("`restoreAssistantCore(snapshot)` creates a new core (previous handles unknown →
`EMBODIMENT_NOT_CONNECTED`...)") and invariant 14 (local state is a cache; reconnect must
re-fetch authority). Notably the same "a global counter produces colliding ids after
recovery" reasoning was already applied to *record* ids under D7 — it was simply not
applied to *embodiment* ids.

**Repair:** the reference now carries the core epoch (`emb-e<epoch>-<n>`), so a previous
session's reference can never equal a current one. The restarted core answers
`UNKNOWN_EMBODIMENT` for it, and a promotion with it raises `EMBODIMENT_NOT_CONNECTED` —
exactly what D8 documents.

### DEFECT 3 (high) — recovery bypassed every promotion guard

`validateCoreSnapshot` checked only the outer shape (`assistant_id`, arrays,
`core_revision`), and `applySnapshot` cloned records straight in. A tampered snapshot was
therefore a complete bypass of `promote()`'s guards:

```text
snapshot.assistants[0].records[0].payload = { executionLease: { holder: 'attacker' } }
restoreAssistantCore(snapshot)  -> accepted; readDurable('a1') returns that payload
```

The same path accepted raw secrets, a `DEVICE_EPHEMERAL` record (a scope `promote`
explicitly refuses as unpromotable), a transient kind such as `SCRATCH_REASONING` stored
as a durable record, and an audience outside the disclosure vocabulary. This is the
"recovery must not resurrect something as truth" boundary: the promotion contract is only
as strong as the weakest path into durable state, and recovery was that path.

**Repair:** a snapshot *is* durable state and now satisfies the same guards a live
promotion satisfies — profile reference, record kind, memory scope (with
`DEVICE_EPHEMERAL` refused), disclosure audience, payload object-ness, and a forbidden
state/secret scan over every record payload, plus structural validation of causal events.

### DEFECT 4 (low) — `undefined` and `null` shared one idempotency fingerprint

`stableStringify` emitted an `undefined`-valued key as `null`, so with one idempotency key
a first promotion of `{a: undefined}` followed by a retry of `{a: null}` was reported as
`replayed: true` and the caller's *different* second payload was silently discarded.
A false replay in the mechanism whose entire purpose is distinguishing a retry from a
different intent.

**Repair:** `undefined`-valued keys are dropped from the fingerprint, so absent and
explicitly-null are different intents and the second call raises `IDEMPOTENCY_KEY_REUSE`.

### Recorded limitation, deliberately not "fixed"

A record re-labelled from `OWNER_PRIVATE` to `PUBLIC_CHANNEL` inside a tampered snapshot is
**not detectable**: `PUBLIC_CHANNEL` is itself a valid disclosure audience, so the
re-labelled record is structurally identical to one legitimately promoted as public.
Catching it requires a per-record integrity digest, which this contract does not carry —
that is a snapshot-integrity feature, not a repair, and belongs to a later task (it is
recorded as an integration seam below). The regression test asserts this non-detection
explicitly — `validateCoreSnapshot(relabelled).ok === true` — so the boundary is visible in
the suite rather than hidden behind a guard that only appears to cover the case. An
audience outside the disclosure vocabulary *is* refused, and that is asserted too.

## 3. Attacked and found sound (no repair needed)

| Attack | Result |
|---|---|
| `projectContext` from an embodiment asking for `PUBLIC_CHANNEL` on an `OWNER_PRIVATE` record | withheld with `AUDIENCE_NOT_PERMITTED` |
| projection asking for a scope a record does not have | withheld with `SCOPE_NOT_REQUESTED` |
| `DEVICE_EPHEMERAL` promoted as a durable record | refused (`EPHEMERAL_SCOPE_CANNOT_BE_PROMOTED`) |
| transient kind routed to the durable path | refused (`EPHEMERAL_STATE_CANNOT_BE_PROMOTED_AS_IS`) |
| durable kind routed to the transient path | refused (`DURABLE_KIND_REQUIRES_PROMOTION`) |
| `expectedRevision` omitted or non-integer | refused (`REVISION_CHECK_REQUIRED`) |
| stale `expectedRevision` on a new key | refused (`STALE_REVISION`) |
| profile fields copied into assistant state | refused (`INVALID_PROFILE_REFERENCE` — only `profile_ref`/`profile_revision` allowed) |
| one embodiment disconnecting while another remains | assistant stays active; handle is gone |
| stale handle after in-process `reloadFromSnapshot` | `EMBODIMENT_SESSION_EXPIRED`, projection carries `scope_stale: true` |
| idempotent replay of the same logical payload with different key order | correctly replays |

## 4. Decisions not specified by the book

**C1 — Fix the spelling gap per call site, or normalise once?**
Normalising inside `findForbiddenCoreStateFields` strengthens every existing caller with no
call-site change, and the promotion path has exactly two guard call sites that both route
through it. Chosen for the same reason as EM-001 C1.

**C2 — Should the epoch be in the reference, or should the counter simply be seeded from the snapshot?**
Seeding the counter would keep references short but would still allow a previous session's
ref to be *equal* to a fresh one whenever the same count is reached, so the staleness would
have to be detected by comparing a stored epoch — which is precisely the value the caller
cannot know. Putting the epoch in the string makes a stale reference structurally
impossible to confuse with a live one, at the cost of a longer identifier. Chosen.

**C3 — Validate the whole record on restore, or only the fields promotion controls?**
The whole record. The defect was that recovery was a *bypass*, and a partial check would
have left it a partial bypass — for example still allowing a transient kind to be restored
as a durable record, which is the specific thing the workbook's recovery acceptance
criterion forbids. Cost is one linear scan of state that recovery is already walking.

**C4 — Is adding snapshot validation scope creep?**
It is a repair. `validateCoreSnapshot` already existed and was already called on the
recovery path; it simply did not check the things the contract claims are invariants. The
workbook's recovery acceptance criterion makes the guard part of this task.

**C5 — Evolution-feed record.**
Not written, consistent with BA-001 D11 / EM-001 D13 / RF-001 D8: the evolution-event
schema is migration-scoped (`^MB-[0-9]{3}$`), so no BA event validates.

## 5. Defects fixed, with regression tests

| File | Change |
|---|---|
| `contracts/assistant-core-v1/core.mjs` | `normalizeFieldName` + normalised forbidden set + plural-tolerant secret check; epoch-bearing embodiment reference; snapshot validation covering records, events, scopes, audiences and payload forbidden-state; `stableStringify` drops undefined |
| `contracts/assistant-core-v1/tests/conformance.test.mjs` | 5 regression tests |

Regression tests added:

1. `authority and user-identity state cannot be promoted under a different spelling`
2. `a raw secret cannot be promoted under a plural or camelCase spelling`
3. `an embodiment reference from a previous epoch never names a live embodiment`
4. `a tampered snapshot cannot install authority, a secret, an unpromotable scope or an unknown audience as truth`
5. `a retry carrying a different payload is refused, not silently replayed`

Each asserts the refusal **and** a legitimate neighbour that must still pass
(`grant_ref`, `credential_ref`, a genuine snapshot that must still recover, a genuine retry
that must still replay), so the stricter guards cannot be satisfied by refusing everything.

## 6. Test summary

| Check | Result |
|---|---|
| hostile probe against the public core API | all attacks above refused after repair; probe recorded in the run evidence |
| `node --test contracts/assistant-core-v1/tests/conformance.test.mjs` | 19 pass / 0 fail (14 Development + 5 new) |
| `node --test tests/*.test.mjs` | 120 pass / 0 fail |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1801 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at d3fbf6c40c69 |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36716375960 on e9add9d1773e46087f032e47572bf69420b3710f | gateway-web success, android success |

FAILURE_REPAIR_SUMMARY: no test failed after the repair, and all 14 Development tests passed
unchanged, which is the evidence that the repair did not weaken the contract. As with
BA-001 and EM-001, every defect was found by the independent probe rather than by a failing
test.

## 7. Cross-task seams recorded (not solved here)

- **Snapshot integrity (new).** Because a snapshot carries no per-record digest, a tampered
  snapshot can re-label a record's audience (and, in general, any record field that is
  itself a legal value). Detecting this needs an integrity digest over each record, computed
  at promotion and verified on restore. Recorded here as an explicit, unclaimed seam for a
  later task — it is not solved, and it is not silently accepted either.
- **BA-003 (embodiment/foreground binding)** consumes `connectEmbodiment`. References now
  read `emb-e<epoch>-<n>` instead of `emb-<n>`; any code that assumed the old shape (for
  example by parsing the number out of it) must not.
- **BA-008 (execution lease / reconnect safety)** owns leases. This contract now refuses a
  lease-shaped *field* in assistant state in every spelling; it still does not implement
  lease semantics, and the `lease_ref` reference form remains the intended seam.
- **BA-005 (Digital-Me gateway)** owns real Digital-Me access. The forbidden-state list now
  also catches `digitalMe`/`DIGITAL_ME`/`userSelfModel` spellings, which strengthens the
  isolation this contract can already enforce on its own state.

## 8. Open items for the Owner

1. Snapshot integrity (section 7) is a real, unclosed hole in recovery trust. It is
   currently bounded by the fact that a snapshot is produced by this core and passed
   in-process, but any future persistence of a snapshot to disk or over a transport makes
   it an attack surface. A decision is needed on which task owns it.
2. The evolution-feed question (C5, BA-001 D11, EM-001 D13, RF-001 D8) remains open.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = e9add9d1773e46087f032e47572bf69420b3710f
BRANCH_CI           = 36716375960 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
