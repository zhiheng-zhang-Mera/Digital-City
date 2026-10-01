# GAI-006 Correction Report — Canonical Conversation + InputBundle + Streaming + Cancellation

```text
MISSION              = GAI-006 (General AI Gateway programme, task 6 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION (PARTIAL — see §5)
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-006-conversation-input-stream-cancel.md
CLAIM_COMMIT         = 844d357 (Digital-City main, claim of GAI-006 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:04:32Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = ac2df607e5aa01744678aa1e26aab481187ff356
DEVELOPMENT_CI       = 36740524898-success
CORRECTION_BRANCH    = general-ai/GAI-006-conversation-input-stream-cancel
CORRECTION_HEAD_SHA  = dd799e2789a2971783a230e2543efdc4d5b45bb2
BRANCH_CI            = 36800022352-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-006 14 pass (7 author + 7 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = false — material defects remain (see §5)
```

## 1. Hosted CI

```text
development head   ac2df60 (Mech)   run 36740524898   success 2026-09-30T15:56:25Z
corrected head     dd799e2 (Alien)  run 36800022352   success
  gateway-web  OK 2m21s  (job 110172028617)
  android      OK 1m7s   (job 110172028361)
```

The corrected head executed its real workflow steps on GitHub-hosted runners and passed. Green hosted CI on
this head does **not** close the task: §5 lists the confirmed mechanisms that are still unrepaired, so the
workbook stays `IN_PROGRESS` and `correction_complete` stays false.

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

## 5. CONFIRMED DEFECTS STILL UNREPAIRED — the reason this task is not complete

Each of these is reproduced by the reviewer's probes under `probes/` and is **not** caught by the author's
7/7-green suite. They remain open on the corrected head `dd799e2`:

| id | Mechanism (reviewer probe) | Why it matters |
| --- | --- | --- |
| **D7** | `eventsFor()` claims to be "the GAI domain-semantic stream for a conversation, in order" but replays only per-turn PARTIALs: the `{kind:'CANCELLED'}` record written by `cancelTurn` is never surfaced (although `EVENT_KINDS` declares `CANCELLED`), `seq` restarts per turn (`[1,2,1]` across turns), and every element hardcodes `terminal:false` — so a cancelled or completed turn is invisible in the stream it publishes (`p06`) | A consumer of the published stream cannot see cancellation or terminal state; the method's own contract is false |
| **D8** | `max_text_chars` bounds only the top-level `text`: a 1 MB `logical_ref` and a 1 MB `context_ref` were accepted, and a 5 KB object was accepted as a reference `note` (the note type hole is now closed; the length bounds are not) (`p08`) | The workbook requires bounded InputBundle metadata |
| **D6b** | `cleanup_by` is a validated field that **no decision reads**: `releaseStaging` ignores it, and a deadline in 1999 is accepted with `cleanup_required: true` (`p05`) | A staging deadline that is never enforced is validation theatre |
| **D5b** | The same mutate-then-clone shape may remain on paths not covered by this pass; the repaired fields are the binding refs and the result text | Should be re-probed exhaustively |
| **D12** | `INVALID_CONVERSATION` and `TRANSPORT_IS_NOT_CANONICAL` are declared and never thrown; `BACKEND_THREAD_LOST` appears only as a reason string | Declared refusal vocabulary that no caller can obtain |
| **D10** | `isDigest` accepts 8–64 hex characters, so a 32-bit string passes as a sha256 digest | **Author-encoded:** `conformance.test.mjs` asserts `isDigest('sha256:0123456789abcdef')` (16 hex) is true, so tightening to 64 hex is a contract change for the Owner |
| **D11** | `validateItem` fabricates `staging: {policy:'NO_STAGING'}` and `stagingPlan` then reports the constant `staging_explicit: true` / `every_item_has_explicit_policy` | **Author-encoded:** the author's suite asserts the constant is true for an item that declared no staging |

Contract questions the reviewer raised and I did **not** treat as defects (the workbook does not settle
them): a CLOSED conversation still accepts `createInputBundle`/`emitPartial`/`finalizeTurn` (only
`openTurn`/`bindBackend` refuse); `reportBackendLoss` never compares its `thread_ref` with the active
binding's, so a report for an unrelated thread marks the live binding LOST; a bundle may be replayed into
unlimited turns; a caller-supplied `result_ref` is never verified to exist.

**Next action for GAI-006:** repair D7 (build the stream from `turn.events` with a conversation-level
monotonic sequence and real `kind`/`terminal` values), D8 (apply the text bound to every free-text field),
D6b (enforce `cleanup_by` in `releaseStaging`), then re-run the reviewer's `p05`/`p06`/`p08` probes, add
their regressions, and only then set `correction_status: COMPLETE`. D10/D11 need an Owner ruling because the
author's suite encodes the current behaviour.

## 6. Remaining external seam

Nothing here depends on hardware, a provider account or another programme. The module's provider/model
binding is a reference carried for the caller; real provider truth belongs to GAI-002 and the live provider
adapter, which are corrected components in this programme.
