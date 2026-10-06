# GAI-005 Correction Report — Deterministic + JEV Triage Routing

```text
MISSION              = GAI-005 (General AI Gateway programme, task 5 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-005-triage-jev-routing.md
CLAIM_COMMIT         = 68195ab (Digital-City main, claim of GAI-005 Correction by Alien)
CLAIMED_AT           = 2026-09-30T16:39:51Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 48169de998a913f495fbca1dac5bd37d79e57e19
DEVELOPMENT_CI       = 36738383466-success
CORRECTION_BRANCH    = general-ai/GAI-005-triage-jev-routing
CORRECTION_HEAD_SHA  = 8a37f44547557caf9f684b49aa7ec7d06361efc9
BRANCH_CI            = 36746849199 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = GAI-005 9 pass, root 110 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 48169de, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews against a byte-verified immutable export taken before the review began
(`frozen-48169de`, four files `match=True`). Twelfth use of this isolation. I read the workbook's own
acceptance list before judging, and repair was verified by replaying the original reproductions against
the repaired module plus paired regression tests.

## 2. Confirmed defects and repairs

Six defects confirmed by this host; the reviewer confirmed those and added six more mechanisms. Eight
repaired, four recorded below.

| id | severity | mechanism | repair |
| --- | --- | --- | --- |
| C1 | **high** | a non-enumerable own `execute`/`action_ref` field evaded the execution-field scan, so a classification carrying an execution was accepted as clean | own-key-complete, cycle-safe scan |
| C2 | **high** | `policy.ambiguous_channel` was unvalidated and became `chosen.route` verbatim (`'TELEPATHY'`, `null`, anything) while the custom-policy branch *did* check `CHANNELS` | policy values validated at construction |
| C3 | **high** | `policy.min_confidence` was unvalidated: `null`, `-1`, `'high'` and `NaN` all made the confidence gate disappear | must be a finite number in [0, 1] |
| C4 | medium | `key in DETERMINISTIC_SPEC` admitted every command field named after an `Object.prototype` member | `Object.hasOwn` + `Reflect.ownKeys` |
| C5 | medium | a cyclic JEV output threw an untyped `RangeError` from the scan | `WeakSet` visited guard |
| C6 | medium | the engineering port's result was used as `clone(result) ?? { routed: true }`, so a port that returned nothing was reported as **success**, and any port failure escaped untyped | the result must be a record; a port failure is `ENGINEERING_ROUTE_DEFERRED` |
| C7 | low | `isIsoInstant` was shape-only | calendar round-trip |
| C8 | low | two rules sharing a `command_ref` silently overwrote each other in the `Map` | duplicates refused |

### C1 / C2 / C3 — three ways the routing decision could be taken away from the gateway

The module's own header says JEV "never executes an Action, never grants permission and never becomes
canonical state, and gateway policy — not JEV — makes the final routing decision". In the frozen revision:

- a classification could carry `execute`/`action_ref` past the scan by making the field
  **non-enumerable** (`Object.entries` cannot see it), and the payload was then used;
- the **policy value** that decides the ambiguous route was never validated, so `'TELEPATHY'` or `null`
  became the canonical `chosen.route`, while the custom-policy path checked `CHANNELS` — an
  inconsistency inside one function;
- the **confidence threshold** could be removed by a policy value the module never checked, so a
  0.01-confidence classification became `jev_used: true`.

## 3. Reviewer claims reconciled

- **Its D1–D7** map to C5/C2, C6, §4.1, C3, C2, C7, C1.
- **Its claim that `key in DETERMINISTIC_SPEC` is "not exploitable" is not accepted.** My probe shows
  the opposite with evidence: a command record carrying an own `constructor`/`toString`/`valueOf`/
  `__proto__` field was **accepted** (`deterministicCommands().length` returned 1) while an ordinary
  unknown field was refused. The fix is C4 either way; the negative result is recorded as a
  disagreement rather than as a falsification.
- **Its D9 (duplicate/prefix-overlapping command refs)** is C8 for the duplicate half; the
  prefix-overlap half (which of two matching rules wins depending on array order) is recorded in §4.3.
- **Its D10 (`decision_id` is a per-instance counter) and D11 (unknown request fields ignored)** are
  recorded as boundaries: a per-instance counter is the documented pattern across this programme's
  contracts, and the request object is not persisted, so an unknown request field cannot enter the
  canonical record. The asymmetry with command records is noted.
- **Its "not exercised" conditionality is important and accepted**: whether the production JEV port is
  in-process (making the non-enumerable-field bypass reachable) or JSON-over-the-wire (making it
  unreachable) cannot be determined from this contract. The guard is correct either way; the
  reachability question is recorded, not assumed.

## 4. Deliberate non-fixes and boundaries

1. **A recommendation that omits `confidence` still bypasses the threshold gate** (the reviewer's D3,
   high). `confidence === null` is not compared, so a classification with no confidence is used, and
   `JEV_RECOMMENDATION_ABSENT` — declared in `FALLBACK_REASONS` — is never produced. Not repaired here
   because it **changes routing semantics the author's suite may assert**, and the workbook's acceptance
   ("ambiguous lightweight text can use JEV when available") does not require a confidence value.
   **Carry-forward for the Owner:** either treat a missing confidence as no signal (activating the
   declared code) or document that absence means "unbounded confidence". This is the sharpest remaining
   fail-open in the contract.
2. **`policy.general_ai_intents` is declared and read by no decision** (the reviewer's D8). A `COMMAND`
   routes to `GENERAL_AI` under a policy listing only `['QUESTION']`. Correcting it changes which
   requests reach General AI, so it is recorded rather than decided here — the same class as EM-004's
   `probe.installed`.
3. **Two prefix-overlapping rules resolve by array order.** `/city` and `/city open` both match `/city
   open`; the winner is whichever the Map iterates first, i.e. insertion order. Deterministic, but a
   caller cannot express "longest match wins". Recorded.
4. **A JEV recommendation may name `ENGINEERING` or `DETERMINISTIC` directly via `preferred_channel`**,
   so a classifier can select a privileged channel. The gates that matter still hold — confirmation for
   ACTION/HIGH-risk intent is evaluated before the channel is honoured — so this is recorded, not
   "fixed" by restricting a vocabulary the contract already exposes.
5. **No depth cap on the scan** (a very deep non-cyclic payload still recurses; the reviewer measured a
   ~5 900-deep cliff). The cycle guard closes the realistic hostile shape; a depth bound is the stronger
   fix and is recorded as the follow-up, consistent with how the same class was repaired in sibling
   contracts.
6. **No Android device observation and no Computer-Use session** — a pure module with no device surface.

## 5. Tests and CI

Author suite **6/6 pass unchanged**. Suite extended **6 → 9 tests**, every negative assertion paired with
a legitimate neighbour (a hidden execution field is refused *and* an honest classification is used; an
invented policy channel is refused *and* a canonical one is honoured; a duplicate command ref is refused
*and* a clean command still routes deterministically).

```text
node --test tests/*.test.mjs                -> 110 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 48169de)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

Implementation CI: **36746849199 — gateway-web success, android success** on
`general-ai/GAI-005-triage-jev-routing` @ `8a37f44`.

## 6. Unstated decisions (problem / choice / rationale)

1. **How far policy may be trusted.** *Choice:* policy chooses *values*, so the module validates that
   those values are canonical (a real channel, a finite confidence in range, real arrays, a boolean
   flag). *Rationale:* the module already validated the route on the custom-policy path; leaving the
   default path unchecked meant one function had two standards, and an invented string reached the
   canonical decision record.
2. **What a port result means.** *Choice:* it must be a record; nothing is not success, and a throwing
   port is a typed deferral. *Rationale:* `?? { routed: true }` reported an unrouted hand-off as a
   routed one — the "success without evidence" class repaired repeatedly in this programme.
3. **Whether a hidden field is a field.** *Choice:* the scan walks own keys of any enumerability, and it
   is cycle-safe. *Rationale:* the guarantee is that a classifier cannot hand back an execution; making
   the field non-enumerable does not change what it is.
4. **Two rules with one ref.** *Choice:* refuse. *Rationale:* silently keeping the last one makes the
   deterministic table depend on construction order, which is exactly what "deterministic-first" must
   not mean.

## 7. Honest self-errors

- I asserted in my regression test that a policy `ambiguous_channel: 'GENERAL_AI'` should be refused. It
  should not — `GENERAL_AI` is a canonical channel and choosing it for ambiguous input is policy's
  prerogative. The test was wrong, not the code; I corrected the test and recorded the boundary.
- My appended tests used an `expectCode` helper that does not exist in this suite; I defined my own
  rather than assuming the author's harness, and the fix is visible in the diff.
- I did not find the reviewer's D2 (port result as success), D3 (missing confidence), or D8 (unread
  policy field). D2 is now repaired; D3 and D8 are recorded as Owner rulings because correcting them
  changes routing semantics rather than a mechanism.

## 8. Result

Eight mechanisms repaired at the mechanism, with paired regression tests and a replay of the original
reproductions. One reviewer "falsified suspicion" is recorded as a disagreement with probe evidence, six
boundaries are recorded with reasoning — including the two remaining fail-open behaviours, named
explicitly rather than folded into a success claim — and the author's suite was never weakened.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/general-ai-gateway/GAI-005-triage-jev-routing.md
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
