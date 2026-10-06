# BA-005 Correction Report  - Digital-Me Scoped Context + Memory/Audience Gateway

```text
MISSION              = BA-005 (Butler Assistant programme, task 5 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-005-digital-me-context-gateway.md
CLAIM_COMMIT         = 12a5045 (Digital-City main, claim of BA-005 Correction by Alien)
CLAIMED_AT           = 2026-09-30T15:20:56Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 4fec952d414cee8cd67245f901c71a75cee93b30
DEVELOPMENT_CI       = 36728731544-success
CORRECTION_BRANCH    = assistant/BA-005-digital-me-context-gateway
CORRECTION_HEAD_SHA  = 6c6d2d43bb89f11c82fabfea021e1d565b773ec5
BRANCH_CI            = 3673— -  - gateway-web success, android success
LOCAL_CHECK_SUMMARY  = BA-005 21 pass, root 122 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 4fec952, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews against a byte-verified immutable export taken **before** the review began:

```text
D:\A-Utopia\.runtime\evidence\mission-book\BA-005\frozen-4fec952\contracts\digital-me-gateway-v1\
  gateway.mjs match=True   index.mjs match=True   tests/conformance.test.mjs match=True
```

Seventh use of this isolation. Repair was verified by replaying the original reproductions against the
repaired module (`alien-verify-repair.mjs` 31 checks, `alien-verify-repair2.mjs` 32 checks  - 63/63 PASS).

## 2. Confirmed defects and repairs

This module decides what an assistant may release to which audience, so its defects are disclosure
defects rather than bookkeeping. Fourteen confirmed, all repaired at the mechanism.

| id | found by | severity | mechanism | repair |
| --- | --- | --- | --- | --- |
| C1 | both | **critical** | `policy.assistants[ref]` read the prototype chain: an inherited grant authorized an assistant that owned none, and prototype-named assistants crashed untyped | own-key lookup on a null-prototype snapshot; malformed grant is a typed refusal |
| C2 | reviewer | **high** | `ASSISTANT_PRIVATE` had no owner, so any assistant granted that scope read another assistant's private facts *and values* | optional `owner_assistant_ref`, enforced as `NOT_THE_OWNER` |
| C3 | both | **high** | freshness one-sided: a future-dated or NaN-parsed record served as current, forever | two-sided bound + `MAX_CLOCK_SKEW_MS` |
| C4 | both | **high** | `key in RECORD_SPEC` admitted every field named after an `Object.prototype` member; non-enumerable own fields invisible | `Object.hasOwn` + `Reflect.ownKeys` |
| C5 | reviewer | **high** | an *inherited* forbidden field (and a class instance) passed validation | bare-object requirement |
| C6 | both | medium | `sensitivity` validated and copied but gating nothing | SENSITIVE requires explicit disclosure authorization |
| C7 | reviewer | medium | `resolveValue` handed out the port's own value object; a caller rewrote canonical data | copied on the way out |
| C8 | reviewer | medium | the gateway closed over the caller's live policy, so a grant added later widened authority | policy snapshotted at construction |
| C9 | reviewer | medium | a malformed record threw *mid-loop*, after the port read and with values already resolved | every fetched record validated before anything is assembled |
| C10 | reviewer | medium | duplicate `record_id` collapsed silently in the port | refused with `INVALID_RECORD` |
| C11 | reviewer | medium | `rebuildDeviceEphemeralContext` validated nothing and shallow-froze only | entries validated, cloned and deep-frozen |
| C12 | me | medium | cyclic/over-deep records �?untyped `RangeError` | cycle-safe scans + iterative depth bound |
| C13 | reviewer | low | `includeValues` read for truthiness: `'false'`, `1`, `{}`, `[]` all released values | strict `=== true` |
| C14 | me | low | `isIsoInstant` shape-only | calendar round-trip |

### C1 (critical)  - authority read through the prototype chain

```text
assistantRef "toString"/"valueOf"/"constructor"/"__proto__" -> untyped TypeError
policy.assistants inheriting a grant -> query({assistantRef: 'assistant-evil'}).granted = true
```

The reviewer's probe went further than mine: one key on `Object.prototype` granted an unknown assistant
**all value disclosure of SENSITIVE memory**, attributed to the real `policy_ref`. The lookup is now
own-key only, against a null-prototype snapshot of the policy, and a malformed grant is a typed
refusal rather than a crash.

### C2 (high)  - assistant-private memory had no owner

`ASSISTANT_PRIVATE` isolation rested entirely on which scopes an assistant happened to be granted, so
two assistants granted the same scope saw each other's private facts and values  - the opposite of the
contract's own published claim. The record now carries an optional `owner_assistant_ref`, and a
non-owner is refused with `NOT_THE_OWNER`.

**Bounded, and recorded as a seam.** The field is optional because the Development fixtures predate it;
enforcement is therefore conditional on the owner being present, which is what I could implement
without rewriting the author's fixtures or inventing a mandatory field. The published
`cross_assistant_private_memory_visible: false` guarantee is only true for owner-scoped records:
**the merge must make `owner_assistant_ref` mandatory for `ASSISTANT_PRIVATE`**, which requires
updating the Development fixtures. This is the one part of a high finding deliberately left to
integration, and it is stated rather than hidden.

### C3 (high)  - one-sided freshness, in the disclosure path

`age > ttl_ms` never fires for a record dated in the future, so a replayed or clock-skewed record was
served as current with nothing in `stale`; a `NaN`-parsing instant (`2026-09-99T99:99:99Z`, which the
shape-only regex accepted) did the same; and `ttl_ms` had a minimum but no maximum, so a record could
claim to stay current for a century. Freshness is two-sided with a documented skew tolerance, the ttl
has a ceiling and is clamped as well as validated, and an impossible instant is refused at validation.

### C4 / C5  - the strictness checks that did not check

`key in RECORD_SPEC` accepted own fields named after `Object.prototype` members (ninth contract in this
programme with that hole), `Object.entries` did not see non-enumerable own fields, and a *bare* check
was missing entirely: a record refusing `persona` as its own field accepted the same poison supplied
through a prototype, and a class instance passed as a canonical record. Own-key scans plus a
bare-object requirement now cover all three, and the forbidden-field scan is cycle-safe and bounded.

### C6  - a field that was validated, copied and never used

`sensitivity: 'SENSITIVE'` travelled into every projection and gated nothing, so a sensitive fact was
released exactly like an ordinary one. Releasing it now needs the same explicit disclosure
authorization the module already requires for release into another audience.

### C7–C11  - integrity of the decision and of the evidence

* The port handed out its own value object, so a caller could rewrite canonical user data and every
  later projection carried the edit.
* The gateway held the caller's live `policy`, so a grant pushed after construction silently widened
  authorization. The policy is snapshotted at construction; a legitimate policy change needs a new
  gateway, which is the right shape for an authority decision.
* A malformed record threw mid-loop, after the port read and with values already resolved, and
  out-of-scope records were never validated at all. Every fetched record is now validated before
  anything is assembled, so the refusal is typed and nothing is read out of the port.
* Duplicate `record_id`s collapsed silently in the port's Map  - two canonical records became one with
  no error; now `INVALID_RECORD`.
* Device-ephemeral rebuilds validated nothing and shallow-froze, so a fabricated
  `ASSISTANT_PRIVATE`/`SENSITIVE` payload was stamped as ephemeral and nested state stayed mutable.
  Entries are validated, cloned and deep-frozen.

## 3. Reviewer claims reconciled

- **D1, D2, D4, D5, D12** are C1, C5, C4, C3, C12  - the same mechanisms, repaired once.
- **D3, D6–D11, D13–D15** are C2, C7–C11, C13, C5.
- **D11 is not accepted.** The reviewer holds that `disclosure_authorized` is unreachable for its
  stated purpose because the visibility matrix runs first and the test compares against the requested
  audience. My probe shows the opposite for the mismatch cases that matter: an `OWNER_PRIVATE` record
  projected into `SHARED_DEVICE` is withheld with `DISCLOSURE_NOT_AUTHORIZED` and **is served when the
  flag is true**  - so the axis is reachable and does what it says. What is true is that a private fact
  cannot reach `PUBLIC_CHANNEL` even with the flag set, because the visibility matrix does not list it;
  that is stricter than the workbook requires and is recorded below rather than "repaired" by
  broadening disclosure.
- **D13's second half is fail-closed, not a hole.** A bogus policy vocabulary (`['ALL']`,
  `['EVERYONE']`) yields `SCOPE_DENIED`/`AUDIENCE_DENIED`, so an unknown grant never widens access; the
  untyped-`TypeError` half is repaired as part of C1.
- **Reviewer negative results recorded** so no later host re-spends the effort: case/whitespace/plural
  audience and scope spellings, wildcard audiences, inherited-required-field records, missing
  `value_ref`, `PUBLIC_CHANNEL`→`OWNER_PRIVATE`, `DEVICE_EPHEMERAL` in a query, and `__proto__`
  redirecting the prototype into a served record.

## 4. Deliberate non-fixes and boundaries

1. **`owner_assistant_ref` is optional** (C2). Making it mandatory is the correct end state and would
   break the Development fixtures; recorded as a merge seam above rather than forced here.
2. **A private fact cannot reach `PUBLIC_CHANNEL` even with `disclosure_authorized: true`.** This is
   stricter than the workbook's wording and is left as-is: broadening disclosure is not a repair.
3. **The `withheld` list names the facts that were withheld, including ones the audience may not see.**
   The Development suite asserts this explicitly, the workbook requires explicit denial and audit
   provenance, and the list is handed to the *assistant* (which is authorized for those scopes), not to
   the audience. Recorded as a boundary: a consumer that renders `withheld` into the audience would
   leak, and the module cannot control that.
4. **`MAX_CLOCK_SKEW_MS` (5 min), `MAX_TTL_MS` (24 h) and `MAX_RECORD_DEPTH` (32) are choices.**
   The workbook states no values; they are exported so they can be ruled on.
5. **`includeValues` remains a caller-supplied request.** It is now strictly boolean, and a value is
   still only released when the assistant's own policy grant allows it.
6. **No Android device observation and no Computer-Use session**  - a pure module with no device surface.

## 5. Tests and CI

Author suite **8/8 pass unchanged**. Suite extended **8 �?21 tests**, every negative assertion paired
with a legitimate neighbour. Verification replays: **63/63 PASS**.

```text
node --test tests/*.test.mjs                -> 122 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 4fec952)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

Implementation CI on `assistant/BA-005-digital-me-context-gateway` @ `6c6d2d4`: gateway-web success,
android success.

## 6. Unstated decisions (problem / choice / rationale)

1. **How to scope assistant-private memory.** *Choice:* an optional owner field enforced when present.
   *Rationale:* the workbook says private memory must not cross assistants; the record had no field to
   express ownership, and a mandatory field would invalidate the Development fixtures. Enforcing what
   can be enforced and naming the seam is better than a guarantee that silently is not one.
2. **What SENSITIVE means.** *Choice:* explicit disclosure authorization is required to release it.
   *Rationale:* it is the same rule the module already applies to release into another audience, so the
   field stops being decorative without inventing new policy.
3. **How a policy change is expressed.** *Choice:* snapshot at construction. *Rationale:* an authority
   decision must not be widened by mutating an object it merely referenced; a new grant is a new gateway.
4. **When a malformed record fails a query.** *Choice:* before anything is assembled or resolved.
   *Rationale:* the workbook requires a denial without partial leakage, and resolving values before the
   refusal reads canonical data for a request that will be refused.
5. **Strict `includeValues`.** *Choice:* `=== true`. *Rationale:* `'false'` and `[]` are truthy, and
   truthiness releasing user data is not a defensible reading of a least-data switch.

## 7. Honest self-errors

- Two of my new tests were wrong before the code was: I asserted an ephemeral entry's nested state was
  frozen (it was only cloned  - the test was right and the code needed a deep freeze) and I used a
  *string* port value in a mutation test, where writing a property to a primitive throws. The first
  caught a real gap; the second was pure test error.
- I did not find C2, C5, C7, C8, C9, C10, C11 or C13. C2 is the most important miss of this session:
  I read the module's published `cross_assistant_private_memory_visible: false` claim and did not test
  it, because the author's isolation test passes  - it passes only because the fixture gives each
  assistant a *different scope*. A published guarantee is a test target, not a description.
- I disagreed with the reviewer on D11 and checked before recording it, rather than accepting a
  finding because it was confidently stated.

## 8. Result

Fourteen confirmed defects repaired at the mechanism, with paired regression tests and a replay of the
original reproductions. One high finding (C2) is repaired as far as the record shape allows and its
remaining half is recorded as a mandatory merge seam; three other boundaries are recorded with their
reasoning. Nothing about this task required device observation.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/butler-assistant/BA-005-digital-me-context-gateway.md
```


## 历史编码说明 / Historical encoding note

本文件在此次整理前含无效UTF-8字节。仅将损坏标点改为普通连接符，其他无法恢复的序列显示为U+FFFD；没有猜测缺失文字或改写验收结论。原始字节保存在docs/encoding-evidence，可按SHA256核对。

This file contained invalid UTF-8 before maintenance. Damaged separator punctuation is rendered as a plain hyphen; other undecodable sequences are shown as U+FFFD. Missing text and acceptance conclusions are not inferred. Original bytes are retained under docs/encoding-evidence with SHA256 provenance.


## 中文阅读译本 / Chinese reading translation

[完整中文阅读译本](./zh-CN/CORRECTION_REPORT.md)保留全部章节、原代码证据和编码未知位置，不产生新的历史状态或验收。 / [Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md) preserves every section, original code evidence and unknown encoding locations; it creates no new historical state or acceptance.
