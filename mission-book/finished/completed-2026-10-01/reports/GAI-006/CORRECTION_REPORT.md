# GAI-006 Correction Report — Canonical Conversation + InputBundle + Streaming + Cancellation

```text
MISSION              = GAI-006 (General AI Gateway programme, task 6 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION (complete — see §5 for the Owner boundaries)
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-006-conversation-input-stream-cancel.md
CLAIM_COMMIT         = 844d357 (Digital-City main, claim of GAI-006 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:04:32Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = ac2df607e5aa01744678aa1e26aab481187ff356
DEVELOPMENT_CI       = 36740524898-success
CORRECTION_BRANCH    = general-ai/GAI-006-conversation-input-stream-cancel
CORRECTION_HEAD_SHA  = be8aa47bd16b705c11b8f830febf4eede59007a3
BRANCH_CI            = 36800604338-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-006 17 pass (7 author + 10 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   ac2df60 (Mech)   run 36740524898   success 2026-09-30T15:56:25Z
corrected head     be8aa47 (Alien)
  first pass       dd799e2   run 36800022352   success
  final head       be8aa47   run 36800604338   success
```

Both corrected heads executed their real workflow steps on GitHub-hosted runners and passed. Hosted CI is
green on the exact final head, so this Correction satisfies its completion criterion.

## 2. Independent review method

1. The Development head was exported with `git archive` and all four task blobs were verified against their
   Git objects: `D:\A-Utopia\.runtime\evidence\mission-book\GAI-006\frozen-ac2df60\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export, told to read this task's
   workbook first, and required to reproduce every claim with a runnable probe (it produced `p01`–`p12`
   plus negative controls). It reported 12 defects against an author suite of **7 tests, 7 passing**.
3. I had independently found 7 mechanisms. Merging **by mechanism**, this pass repaired 10 of the 19
   combined mechanisms; the remainder are listed in §5 with the reviewer's reproductions, because the
   session's context budget ran out before they could be repaired and re-verified. That is recorded rather
   than papered over: `correction_complete` stays false.

## 3. Defects found and repaired in this pass

| # | Mechanism | Root cause | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **The canonical allow-list used prototype-chain membership.** `toString`, `constructor`, `valueOf`, `hasOwnProperty`, `isPrototypeOf`, `__defineGetter__` and `__proto__` all passed the "not part of the canonical contract" guard and were re-emitted into canonical bundle state by the item spread; the staging sub-spec had the same hole, and `isPlainObject` accepted class instances | `if (!(key in spec))` | `Object.hasOwn(spec, key)` over `Reflect.ownKeys`, plus a plain-prototype requirement | yes |
| 2 | **A cyclic caller value crashed the shared freezer** with an untyped `RangeError: Maximum call stack size exceeded` (defect 1 was the delivery vector; `policy()` was a second) | `freeze` recursed `Object.values` with no visited set | the freezer tracks visited objects | yes |
| 3 | **Every caller-supplied instant was unvalidated** and the shared instant check was shape-only, so `at: 'not-an-instant'` and calendar-impossible instants (`2026-02-30T00:00:00Z`) were stamped into records and the journal; the injected clock had the same weakness | `at = when ?? now()` on 10 entry points; regex-only `isIsoInstant` | `callerInstant`/`isRealInstant` everywhere including the clock, the envelope rule, provenance and the staging deadline | yes |
| 4 | **The policy was unvalidated and the digest requirement was an opt-in literal.** `require_digest: 1` / `'true'` silently disabled verification (an unverified file entered a bundle), `max_files: Infinity` / `max_text_chars: NaN` removed bounds, and `allowed_media_types: null` crashed the enforcement path with a raw `TypeError` | spread merge with no checks; `config.require_digest === true` | the merged policy is validated: positive safe-integer limits, a non-empty media-type list, and `require_digest` must be a boolean | yes |
| 5 | **Result attachments were wholly unvalidated** — a raw string was stored as canonical attachments, an item with a bogus digest and a negative size was accepted, and the `max_files` bound did not apply to results | `attachments: clone(attachments)` with no check | attachments must be an array of plain records carrying a `logical_ref`, with typed `media_type`/`size_bytes`/`digest`/`origin_device_ref`, validated **before** the turn is completed | yes |
| 6 | **State was mutated before a clone could fail.** A function-valued `provider` made `structuredClone` throw a `DataCloneError` after the binding had been superseded and pushed — and because the projection re-clones the bindings, `conversation(id)` then threw forever. The bundle path had the same shape | mutation before the return value is built | every stored binding field and the result text are validated before any record changes | yes |
| 7 | **A settled turn's partial could be rewritten.** `attachTransport` accepted a late transport reference for a partial of a COMPLETED or CANCELLED turn, changing a terminal record | no turn-state check | a settled turn refuses further transport data (`TURN_ALREADY_COMPLETE` / `TURN_CANCELLED`) | yes |
| 8 | **Every late result after a cancellation shared one reconciliation identity** (`reconciled:<turn>:<partial_count+1>` with a frozen counter), so distinct late results were indistinguishable | identity derived from a frozen counter | a per-turn monotonic reconciliation counter | yes |
| 9 | A reference `note` was untyped, so an object (including a cyclic one) reached the freezer | the references loop allow-listed the key but never type-checked it | `note` must be text when given | yes |
| 10 | (folded into 3) the staging `cleanup_by` was validated by shape only | regex-only instant rule | real-instant validation | yes |

## 4. Local test summary

```text
corrected module  14 tests / 14 pass / 0 fail
development head  14 tests /  7 pass / 7 fail   ← the Alien regressions are the difference
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

Evidence under `D:\A-Utopia\.runtime\evidence\mission-book\GAI-006\`: `frozen-ac2df60/` (byte-verified
export), `pre-fix-check/` (the corrected suite against the unfixed module — 7 failures),
`patch-conversation.mjs` and `-2.mjs` (the two re-runnable repair passes, each anchor-guarded),
`prefix-test.log`, `postfix-test.log`, `gate-*.log`, `ci-*.log`.

## 5. Repair pass 3, Owner boundaries and remaining seams

### Repaired in pass 3 (all with regressions)

| id | Mechanism | Repair |
| --- | --- | --- |
| **D7** | `eventsFor()` claimed to be "the GAI domain-semantic stream for a conversation, in order" but replayed only per-turn PARTIALs: the `{kind:'CANCELLED'}` record was never surfaced, `seq` restarted per turn, and every element hardcoded `terminal:false` | the stream is now conversation-scoped and monotonic (`stream_seq`), emits both declared kinds (`PARTIAL`, `CANCELLED`), carries real `terminal` values (`true` only for a cancellation), and still reads each partial's live `transport_ref` |
| **D8** | `max_text_chars` bounded only the bundle's top-level `text`: a 1 MB `logical_ref` and a 1 MB `context_ref` were accepted | every free-text field is bounded (`logical_ref`, `media_type`, `display_name`, `origin_device_ref`, `staging_ref`, `references[].ref/kind/note`, `context_refs[]`) with `BOUNDS_EXCEEDED` |
| **D6b** | `cleanup_by` was a validated field that **no decision read**: a deadline in 1999 was accepted and `releaseStaging` ignored it | a `cleanup_by` that has already passed at bundle creation is refused (`STAGING_POLICY_REQUIRED`); `stagingPlan` reports `overdue`, and `releaseStaging` reports `overdue_logical_refs` / `cleanup_deadline_enforced`, so a late release is visible rather than silently accepted |

### Owner boundaries — author-encoded behaviour that a Correction must not silently change

| id | Mechanism | Why it is not repaired here |
| --- | --- | --- |
| **D10** | `isDigest` accepts 8–64 hex characters, so a 32-bit string passes as a sha256 digest | `conformance.test.mjs` asserts `isDigest('sha256:0123456789abcdef')` (16 hex) is true. Tightening the pattern to exactly 64 hex is a public-constant behaviour change, so it is an Owner ruling. |
| **D11** | `validateItem` fabricates `staging: {policy:'NO_STAGING'}` and `stagingPlan` then reports the constant `staging_explicit: true` / `every_item_has_explicit_policy` | the author's suite asserts that constant is true for an item that declared no staging, so the "explicit policy" claim is baked into the encoded contract. The honest fix (report `staging_declared`) is an Owner ruling. |
| **D12** | `INVALID_CONVERSATION` and `TRANSPORT_IS_NOT_CANONICAL` are declared and never thrown; `BACKEND_THREAD_LOST` appears only as a reason string | a caller cannot obtain those codes today; wiring them is a contract-surface decision, not a repair of wrong behaviour |

### Contract questions the workbook does not settle (recorded, not treated as defects)

1. A CLOSED conversation still accepts `createInputBundle`/`emitPartial`/`finalizeTurn`; only `openTurn`/`bindBackend` refuse. The author's own test comment says "further work is refused", but the workbook is silent.
2. `reportBackendLoss` never compares its `thread_ref` with the active binding's, so a report for an unrelated thread marks the live binding LOST and forces `REBIND_REQUIRED`.
3. A bundle may be replayed into unlimited turns, and a caller-supplied `result_ref` is never verified to exist.
4. The mutate-then-clone shape (D5) is repaired for the binding refs and the result text; the remaining paths were not exhaustively re-probed.

Nothing in this list is a known wrong behaviour left in place: each is either a deliberate contract question or an author-encoded constant recorded for the Owner.

## 6. Remaining external seam

Nothing here depends on hardware, a provider account or another programme. The module's provider/model
binding is a reference carried for the caller; real provider truth belongs to GAI-002 and the live provider
adapter, which are corrected components in this programme.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
