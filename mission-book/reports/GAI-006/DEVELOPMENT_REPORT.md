# GAI-006 Development Report — Conversation + InputBundle + Streaming + Cancellation

```text
MISSION                  = GAI-006 (General AI Gateway programme, task 6 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0802c6f (Digital-City main, "claim(GAI-006): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:54:33Z
CONTROL_REVISION_AT_CLAIM= ec5309b (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-006-conversation-input-stream-cancel
IMPLEMENTATION_HEAD_SHA  = ac2df607e5aa01744678aa1e26aab481187ff356
BRANCH_CI                = 36740524898 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/general-ai-conversation-v1/` — `conversation.mjs` (canonical conversation identity, backend
bindings, backend loss, InputBundle validation, staging plan/release, ordered partials, ResultEnvelope,
idempotent cancellation, late-result reconciliation), `index.mjs`, 7-test suite, root
`tests/general-ai-conversation.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| One Utopia conversation can continue while backend thread/device metadata changes | `one conversation continues while backend thread, provider and device metadata change` (rebind to a different provider/thread/device; same `conversation_id`; `conversation_identity_changed: false`; `thread_is_identity: false`) |
| Backend thread loss is reported and does not silently create a false continuation | `backend thread loss is reported and never becomes a silent false continuation` (`continuation_available: false`, `silent_false_continuation: false`, next turn refused with `REBIND_REQUIRED`, conversation not marked closed) |
| InputBundle validates size/type/digest/provenance metadata | `InputBundle enforces bounds, media type, digest and provenance` (typed `BOUNDS_EXCEEDED`, `MEDIA_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `DIGEST_REQUIRED`, `INVALID_DIGEST`, `PROVENANCE_REQUIRED`) |
| Temporary staging metadata has explicit cleanup policy | `temporary staging metadata always carries an explicit cleanup policy` (`every_item_has_explicit_policy`, `cleanup_by` required for `DELETE_AFTER_USE`, idempotent release) |
| Partial events are ordered/versioned and non-terminal | `partial events are ordered, versioned and never terminal, and RF envelopes stay non-canonical` (monotonic `seq`, `terminal: false`, `PARTIAL_OUT_OF_ORDER` on a gap) |
| Cancel is idempotent and late results after cancellation are reconciled rather than silently accepted | `cancellation is idempotent, works across channel changes, and reconciles late results` (same `cancellation_ref` on repeat, `LATE_RESULT_AFTER_CANCEL` reconciled + discarded, `result: null`) |
| Canonical conversation IDs independent of provider/device/channel; provider threads as backend refs | test 1 (identity contains no channel/thread/device token; `identity_is_provider_independent: true`, `provider_thread_is_canonical: false`) |
| Logical file refs carry origin device and staging policy rather than remote paths | test 3 (`origin_device_ref` on every item, `canonical_path: null`, `hard_coded_remote_path: false`) |
| ResultEnvelope with attachment references; partial never terminal | test 5 (`result_envelope_ref`, terminal true, `partials_are_terminal: false`) |
| GAI stream is the domain-semantic stream; RF envelopes never canonical | test 5 (`attachTransport` ⇒ `transport_envelope_is_canonical: false`, `canonical_state_source: 'GAI_CONVERSATION'`) |
| Cancellation/reconciliation works after execution-host/channel changes | test 6 (`binding_changed_since_opening: true`, `cancellation_works_across_channels: true`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, EM-004, EM-005, EM-008, EM-009, GAI-003, GAI-004, GAI-005, RF-004, RF-005 and
RF-006 Corrections). Tie-break after RF-006 excluded Remote Fabric, so GAI-006 was chosen: it is the next
GAI stage after GAI-005's routing and the conversation/cancellation semantics are what GAI-007
(device-aware remote execution) and GAI-009 (Utopia surface) both consume.

**D2 — What is a conversation's identity?** CHOICE: an entropy-derived `conversation:<32 hex>` that contains
no channel, provider, thread or device token; those are recorded as backend bindings with their own version
and `SUPERSEDED`/`LOST` states. Reason: the acceptance bullet requires continuation across backend metadata
changes, and RF invariant 2 generalises here — identity must not be derived from the transport or the
provider. The test asserts the identity string contains no `WEB`/`thread` token, which is a cheap structural
guard against someone later deriving it.

**D3 — What happens when the provider thread disappears?** CHOICE: `reportBackendLoss` marks the binding
`LOST` and returns `continuation_available: false`, `silent_false_continuation: false`,
`rebind_required: true`; the conversation stays `OPEN` (loss ≠ closing) and the next turn is refused with
`REBIND_REQUIRED`. Reason: "reported and does not silently create a false continuation" is an acceptance
bullet, and a system that says "continuing…" on a dead thread is exactly the failure mode. Keeping the
conversation open preserves the audit trail and lets a rebind continue properly.

**D4 — How much must an InputBundle prove?** CHOICE: bounded counts (files/images/references/context refs),
bounded text, an allow-listed media type, a size ceiling, a required sha256 digest for every file and image,
and provenance naming the source channel and device. Reason: the workbook asks for bounded metadata, digest
and provenance; requiring the digest (rather than accepting a missing one) means an unverified binary can
never enter canonical state.

**D5 — Digest error precision (surfaced by a test).** CHOICE: a missing digest is `DIGEST_REQUIRED`, a
present-but-malformed digest is `INVALID_DIGEST`. Reason: the first version ran the generic shape check
first, so `digest: undefined` reported `INVALID_BUNDLE` (a "malformed record") instead of the actionable
"you must supply a digest". Both are refusals, but the precise code is what a caller or a UI needs; the
suite caught it and the check order was changed to validate the digest field first.

**D6 — Where does staging state live?** CHOICE: the bundle and its items are immutable; release state is a
per-bundle set held beside the record. Reason: the first version mutated the frozen item (`item.staging_released
= true`) and threw `TypeError` — found by the suite. Keeping immutable records and external progress state is
the same discipline used elsewhere in this pool (the bundle is evidence, not a mutable working object).

**D7 — Is a bundle digest invented when no digest function exists?** CHOICE: no — `bundle_digest: null` with
`bundle_digest_status: 'NOT_COMPUTED'` and `digest_computed_by: null`; when a digest port is injected the
digest is computed and the field names the port. Reason: inventing a digest (or hashing in-module with no
declared algorithm) would produce a value a verifier could not reproduce; null plus an explicit status is the
honest form of "not available".

**D8 — What makes a partial non-terminal?** CHOICE: partials carry `seq` (strictly monotonic per turn),
`terminal: false`, `partial_is_terminal_success: false`, and the only terminal record is a `ResultEnvelope`
produced by `finalizeTurn`; emitting a partial after completion is refused. Reason: the workbook states
partial text is never a terminal success, and making the terminal record a distinct type is what stops a UI
or a caller from treating "the model stopped typing" as "the turn succeeded".

**D9 — Can Remote Fabric carry the stream?** CHOICE: `attachTransport` records a `transport_ref` and returns
`transport_envelope_is_canonical: false`, with `canonical_state_source: 'GAI_CONVERSATION'` on partials,
results and events. Reason: the workbook allows RF EVENT/STREAM carriage while forbidding the transport
envelope from becoming canonical conversation/result state; publishing the negative as data makes the
boundary checkable at merge.

**D10 — How does cancellation behave?** CHOICE: idempotent (a repeat returns the same `cancellation_ref`
with `duplicate: true`), effective regardless of the current binding (`binding_ref_at_cancel` recorded), and
a late result is *reconciled*: `accepted: false`, `reconciled: true`, a `reconciliation_ref`, and the result
reference is recorded as discarded while `turn.result` stays null. Reason: the acceptance bullet pairs
idempotence with reconciliation "rather than silently accepted"; discarding silently (no record) would lose
the evidence that a provider produced a result the user never asked for, so the reference is retained.

**D11 — Turn states.** CHOICE: `PENDING → STREAMING → COMPLETED | CANCELLED`, with terminal states
immutable. Reason: a small, total state machine is what makes "already complete" and "cancelled" typed
refusals rather than races; the test asserts a completed turn cannot be cancelled and a cancelled turn takes
no partials.

**D12 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/general-ai-conversation-v1/conversation.mjs` | new — conversation identity, bindings, loss, bundles, staging, stream, cancellation |
| `contracts/general-ai-conversation-v1/index.mjs` | new — public surface |
| `contracts/general-ai-conversation-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/general-ai-conversation.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Four failures on first run: two genuine module defects and two test-scaffolding problems.

1. **Defect:** `releaseStaging` mutated a frozen bundle item (`item.staging_released = true`) and threw
   `TypeError`. Fixed by keeping release state in a per-bundle set beside the immutable record (D6).
2. **Defect / precision:** a missing digest reported `INVALID_BUNDLE` from the generic shape check instead of
   `DIGEST_REQUIRED`. Fixed by validating the digest field before the shape check, and splitting
   missing (`DIGEST_REQUIRED`) from malformed (`INVALID_DIGEST`) (D5). The test expectation for a malformed
   `md5:` digest was updated to `INVALID_DIGEST` accordingly.
3. **Expectation:** `finalizeTurn({turn_ref})` with no `result_ref` on a completed turn was expected to
   report `TURN_ALREADY_COMPLETE`; the module reports the malformed request (`INVALID_REQUEST`) first. Both
   behaviours are now asserted separately, so the ordering is deliberate rather than incidental.
4. **Test double:** the deterministic entropy stub produced the same conversation id for two registries, so
   the "two registries share nothing" assertion failed. The stub now mixes a per-registry instance salt
   (masked with `>>> 0`, because an unmasked XOR produced negative hex and tripped the module's hex
   validation — itself a useful confirmation that the entropy validation is strict).

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36740524898 on ac2df607e5aa01744678aa1e26aab481187ff356 | success |

## 6. Integration seams handed to sibling tasks

- **GAI-003 (web channel persistent session):** an allowed Web session reopen maps to a new backend binding
  on the same conversation (`bindBackend`), and the session reference belongs to the binding, not to the
  conversation identity. A reopened session must not create a second conversation.
- **GAI-004 (API channel consent/budget):** a turn routed to the API channel still needs its own consent and
  budget admission; a conversation and a ResultEnvelope are never consent.
- **GAI-005 (triage routing):** the route decision determines which channel the turn runs on; a
  `CONFIRMATION_REQUIRED` route should open no turn until the user answers.
- **GAI-007 (device-aware remote execution):** execution may move between devices mid-turn; the turn and its
  `binding_ref` record where it ran, and a device change must not create a new conversation or a second turn.
- **GAI-008 (health/degradation):** `reportBackendLoss` and the typed fallbacks are the honest-degradation
  surface for conversations; a lost backend is a reportable condition, not an error to retry blindly.
- **RF-008 / RF-009 (typed stream, presence/reconnect):** `attachTransport` is the only place a transport
  reference enters GAI state and it is explicitly non-canonical; RF must carry partial/result bytes without
  owning them, and a reconnect must not replay a cancelled turn.
- **RF-006 (path manager):** stream carriage rides the selected path; a path migration must not duplicate a
  partial or a result, which is why partials are sequenced per turn rather than per path.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a partial emitted with `seq` omitted but after a cancelled turn; two turns
   open at once on one conversation sharing a bundle; a `cleanup_by` deadline in the past; a rebind during an
   active turn (the module allows it and records the binding per turn — confirm that is intended); and a
   bundle reference from another conversation (covered, but worth re-testing through a different path).
2. Confirm D10 (a late result is recorded as discarded rather than dropped silently) and D7 (no digest is
   invented without a digest port) as the intended readings.
3. Confirm whether `releaseStaging` should also be driven by the `cleanup_by` deadline automatically, which
   this synchronous module deliberately leaves to the caller/scheduler.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```
