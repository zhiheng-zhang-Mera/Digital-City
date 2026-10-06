# BA-004 Correction Report — Multi-Assistant Presence, Switching + Explicit Handoff

```text
MISSION              = BA-004 (Butler Assistant programme, task 4 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-004-multi-assistant-handoff.md
CLAIM_COMMIT         = 6c8403a (Digital-City main, claim of BA-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:47:06Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = a29062fba3e88abee1830c4f1ecbd6c55e6d1c79
DEVELOPMENT_CI       = 36726727943-success
CORRECTION_BRANCH    = assistant/BA-004-multi-assistant-handoff
CORRECTION_HEAD_SHA  = b5c6249a32670da3cf0171a308e0cbddfba89d7a
BRANCH_CI            = 36733222394 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = BA-004 21 pass, root 122 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at a29062f, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews; the revision under review was exported to a byte-verified immutable path **before any
review began** and the reviewer imported only from that export:

```text
D:\A-Utopia\.runtime\evidence\mission-book\BA-004\frozen-a29062f\contracts\assistant-handoff-v1\
  handoff.mjs match=True   index.mjs match=True   tests/conformance.test.mjs match=True
```

Fifth use of this isolation. It mattered again: the reviewer's D2 (a half-applied refusal) and D5 (the
capability gate bypassed by the package's own declaration) are defects I had not found, and I had
already pushed nine repairs' worth of work before it reported.

Findings are merged **by mechanism, not by reporter**. Repair was verified by replaying the original
reproductions (`alien-verify-repair.mjs` 37 checks, `alien-verify-repair2.mjs` 27 checks — 64/64 PASS),
not only by the new regression tests.

## 2. Confirmed defects, eleven, all repaired

| id | found by | severity | mechanism | repair |
| --- | --- | --- | --- | --- |
| H1 | both | **critical** | `accept` never re-checks ownership; a stale concurrent handoff takes the task from a new owner and misreports who lost it | ownership + version re-checked at takeover |
| H2 | reviewer | **critical** | `reject`/`expire` mutate state, then read the task inside the return expression → untyped `TypeError` after half-applying | task read and validated before the mutation |
| H3 | both | high | duplicate proposal keyed on `handoff_id` only, so different content is silently discarded | content-aware duplicate |
| H4 | both | high | `findAuthorityFields` uses `Object.entries`: a non-enumerable own authority field is invisible | `Reflect.ownKeys` |
| H5 | reviewer | high | the capability gate trusts the package's own `required_capabilities`, so declaring `[]` bypasses it | a transfer must declare what it requires |
| H6 | both | med-high | `key in spec` admits fields named after `Object.prototype` members | `Object.hasOwn` + `Reflect.ownKeys` |
| H7 | both | medium | `outgoing_assistant_still_online: true` with no presence evidence | `null` (unknown) + an explicit verified flag |
| H8 | both | medium | `isIsoInstant` shape-only; transition times may precede the proposal | calendar round-trip + ordering check |
| H9 | both | medium | unbounded recursion in the authority scan → untyped `RangeError` | cycle-safe scan + iterative depth bound |
| H10 | reviewer | med-low | the task store double shallow-spreads: nested state is shared and mutable with no write recorded | deep copies; frozen write entries |
| H11 | both | low | `policy.grantsByAssistant[recipientRef]` reads the prototype chain → untyped `TypeError` and inherited grants | own-key lookup, typed refusal |

### H1 (critical) — a stale handoff took ownership from an owner that never proposed it

Ownership was verified only in `propose`. Two transfers proposed by A were therefore both acceptable,
and the second took the task away from the assistant that had just received it:

```text
propose h1 (A -> companion); propose h2 (A -> secretary)
accept h1 -> owner = assistant-companion
accept h2 -> accepted:true, owner = assistant-secretary, previous_owner_ref = assistant-butler
```

The workbook requires "one authoritative new owner" and that "a stale or concurrent handoff must not
produce two owners or lose ownership"; the architecture contract adds that ownership must be guarded
by authoritative task/version state. The audit record was also wrong: it named A as the previous owner
when the owner at takeover was the companion.

Repaired at takeover, before the recipient's capability is considered (a handoff whose proposer no
longer owns the task is void regardless of who receives it), and `previous_owner_ref` now comes from
the task rather than from the package. `task_version`, which the package declares and nothing
compared, is now a compare-and-set gate wherever the store exposes it (H1b below).

### H2 (critical) — a refusal could be half-applied

```js
record.state = 'REJECTED';
record.rejected_at = at;
return { ..., owner_ref: taskStore.getTask(record.handoff.task_ref).owner_ref };  // throws if gone
```

With the task gone, the call threw an untyped `TypeError` *after* the state flip: the refusal was
applied and the caller was told the operation crashed. Repaired by reading and validating the task
first, so a refusal that cannot be explained is not applied at all — verified by asserting the record
is still `PROPOSED` with no `rejected_at`.

### H5 (high) — the capability gate could be switched off by the package

`recomputeRecipientAuthority` intersects policy grants with `requiredCapabilities`, and those came from
the same package being validated:

```text
propose {required_capabilities: []} -> can_take_over: true for a recipient with no grants at all
```

So the recipient re-evaluation the workbook requires was vacuous whenever the package said it needed
nothing. A responsibility transfer must now declare the capabilities it is evaluated against; a
consultation still may declare none, because it transfers nothing.

### H4 / H11 — authority could pass through the guard, and be read from the prototype

* `findAuthorityFields` walked `Object.entries`, so `Object.defineProperty(h, 'lease', {enumerable:
  false})` carried authority past the one rule this module exists to enforce — `validateHandoff`
  returned `ok: true`. Now `Reflect.ownKeys`.
* `policy.grantsByAssistant[recipientRef]` consulted the prototype chain, so a recipient named
  `toString`, `valueOf`, `constructor` or `__proto__` picked up an `Object.prototype` member and died
  with `TypeError: function is not iterable`. Now own-key only, with a typed refusal for a non-array
  grant entry. No inherited grant can stand in for policy.

### H6 (med-high) — every field named after an `Object.prototype` member was "part of the contract"

The seventh contract in this programme with this hole, and the same reason the author's suite missed
it: the strictness test uses `extra: 1`, a name that is not an `Object.prototype` member. All twelve
own names were accepted (`errors = 0`) and cloned into the stored record, while an ordinary unknown
field was refused. Fixed with `Object.hasOwn(spec, key)` and a `Reflect.ownKeys` scan.

### H3 (high) — "already proposed" was true of anything sharing an id

A second `propose` with the same `handoff_id` but a different recipient and reason was reported as
`DUPLICATE_HANDOFF` and discarded, leaving the caller believing their proposal was recorded while the
first intent executed. Now an identical package is a duplicate and a different one is a typed refusal.

### H7 / H8 — two unearned or unvalidated facts

* `outgoing_assistant_still_online` was `true` when the caller supplied no online set at all — an
  assertion invented from missing evidence, on the very flag that says the outgoing assistant's
  background task keeps running. It is now `null` with `outgoing_online_verified: false`, and honest
  both ways when presence is supplied.
* `isIsoInstant` was regex-only, so `2026-13-45T99:99:99Z` and `2026-02-30T00:00:00.000Z` validated;
  and `accept`/`reject`/`expire` accepted any `at`, including `1999-01-01` for a handoff created in
  2026 — an audit trail that contradicts itself. Instants must round-trip, and a transition time may
  not precede the proposal.

### H9 / H10 — two ways the module's own evidence was unsound

* The authority scan recursed over data with no visited set, so a cyclic package, a self-referential
  `to`, or 20 000-deep nesting died with a codeless `RangeError`. Now cycle-safe plus an iterative
  depth bound.
* `createTaskStoreDouble` shallow-spread tasks, so a returned `getTask` view shared nested state with
  the store and with the caller's input array: mutating a view changed canonical state with **zero**
  entries in `__writes`, which made the double unusable as evidence for the conformance suite.
  Deep copies now; write-log entries are frozen.

## 3. Reviewer claims reconciled

- **D1's `task_version` half is repaired as far as this contract can.** The ownership re-check closes
  the reachable lost-ownership case; the version compare-and-set now engages whenever the store
  exposes `task_version`, and `TASK_STORE_PORT.version_revalidation_required = true` records the seam
  in code. It stays inactive with the port as declared, because that port has no version-bearing read.
  See §4.1 — this is the one part of a "critical" finding that is deliberately left to integration.
- **D2, D5, D10 accepted and repaired** — D5 in particular is a defect I would have missed: I had
  treated `required_capabilities` as the requirement, not as a caller-controlled opt-out.
- The reviewer's **falsified suspicions** are recorded as negative results so no later host re-spends
  the effort: snapshot aliasing of handoff records (they are genuinely deep-cloned), persisted
  non-enumerable grants (structuredClone drops them, so the *stored* form was clean — the *guard
  verdict* was the defect), replay minting a second owner, and `__proto__` pollution.
- **Correctly refused** (probed by both reviews, so it is not re-litigated): non-owner propose, a
  replayed accepted handoff, wrong acceptor, capability shortfall on honest packages, self-handoff,
  terminal/unknown task, malformed types, and enumerable authority fields.

## 4. Deliberate non-fixes and boundaries

1. **`task_version` cannot be enforced against the declared port.** `TASK_STORE_PORT` exposes
   `getTask/setOwner/setExecutor/recordCheckpoint` and no version, and the task fixtures carry none, so
   an unconditional version gate would refuse every handoff — a local repair cannot close it without
   rewriting the author's fixtures or inventing a store field, and inventing one is a design change,
   not a repair. Recorded as a typed carry-forward for the merge workbook: **the canonical task store
   must expose `task_version` so a stale handoff can be refused on version as well as on ownership.**
   Recorded rather than silently skipped, because the reviewer is right that the field is declared and
   compared nowhere.
2. **`createTaskStoreDouble.__table` / `__writes` remain exposed.** It is a test double and the port
   contract is what ships; the new tests use `__table` deliberately to simulate a vanished or changed
   task. Recorded as an observation.
3. **No new error codes.** Staleness, a conflicting re-proposal, an empty capability declaration and a
   bad timestamp are all `INVALID_HANDOFF` with precise details; the revoked capability reuses
   `SCOPE_WIDENING_FORBIDDEN`. Behaviour was added, vocabulary was not.
4. **Cross-restart persistence and true concurrency are not exercised.** This is a pure module; there
   is no store, scheduler or second process on this branch. Only the in-process guard behaviour was
   tested, and it is recorded as a typed seam rather than as success.
5. **No Android device observation and no Computer-Use session.** The workbook authorises them if
   acceptance requires observation; BA-004 is a pure protocol module with no device surface, so
   nothing was observed and Android Studio was not invoked.

## 5. Tests and CI

Author suite: **7/7 pass unchanged** — no author test encoded a defect, so none needed correcting.
Suite extended **7 → 21 tests**; every negative assertion has a legitimate neighbour that must still
pass (a stale handoff is refused *and* a legitimate transfer from the current owner succeeds; an empty
capability declaration is refused *and* a consultation may require nothing; a vanished task makes the
refusal typed *and* an intact one is still applied; a returned store view is a copy *and* a real write
is still recorded).

Repair verification replays the original reproductions: 64/64 checks PASS across two probes.

```text
node --test tests/*.test.mjs                -> 122 pass, 0 fail  (101 baseline + 21)
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at a29062f)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

Implementation CI: **36733222394 — gateway-web success, android success** on
`assistant/BA-004-multi-assistant-handoff` @ `b5c6249`.

## 6. Unstated decisions (problem / choice / rationale)

1. **Where the stale-handoff check belongs.** *Problem:* reject at proposal, at acceptance, or both?
   *Choice:* both, with the authoritative check at takeover. *Rationale:* concurrency is only visible
   at takeover; a proposal-time check cannot see another acceptance. It runs before the capability
   check because a handoff whose proposer no longer owns the task is void whoever receives it.
2. **How to treat a package that declares no capabilities.** *Problem:* refuse it, or accept that it
   needs nothing? *Choice:* refuse for a transfer, allow it for a consultation. *Rationale:* the
   workbook requires the recipient to be re-evaluated; a declaration of nothing makes that vacuous and
   turns a caller-controlled field into an opt-out from the only capability gate. A consultation
   transfers nothing, so it needs no requirement.
3. **`previous_owner_ref` source.** *Choice:* the task at takeover, not `handoff.from`.
   *Rationale:* the task is the authoritative record; the package is a request.
4. **Presence with no evidence.** *Choice:* `null` plus `outgoing_online_verified: false`, rather than
   `true`. *Rationale:* the module has no clock, store or network, so it cannot know; the workbook's
   acceptance line about the outgoing assistant's task hanging on this flag makes an invented `true`
   the wrong default.
5. **Cyclic/depth handling.** *Choice:* a cycle-safe scan plus an iterative depth bound
   (`MAX_HANDOFF_DEPTH = 32`) reported through the normal error channel. *Rationale:* the scan walks
   data, so depth is attacker-controlled, and an iterative bound cannot itself overflow.
6. **Deep-copying the test double.** *Choice:* copy in and out, freeze write entries. *Rationale:* a
   leaky double produces green evidence that means nothing — it undermined the very suite this task is
   judged on.
7. **Transition-time validation when no clock exists.** *Choice:* accept absent, refuse malformed or
   pre-proposal instants. *Rationale:* the module is pure and the caller may legitimately have no
   clock; what it must not do is record a self-contradicting audit trail.

## 7. Honest self-errors

- My first version of the stale-handoff repair put the capability recomputation *before* the ownership
  re-check, so a stale handoff to an incapable recipient was reported as a capability shortfall rather
  than as stale. My own new test caught it; the ordering is now explicit and commented.
- The same test initially reused the fixture policy, under which the second recipient had no grant, so
  the assertion was ambiguous between two refusals. Fixed by giving both recipients a grant, so the
  test proves the refusal is about staleness and nothing else.
- My first probe called `.coordinator` on the value returned by `createHandoffCoordinator`, which is
  the coordinator itself, and crashed before reaching the B4 scenario. Fixed the helper.
- I found H1, H3, H4, H6, H7, H8, H9, H11 and missed H2 and H5, which the reviewer found. Both are now
  repaired, and H5 is recorded as a class I should have been watching for: a guard whose *input* is
  supplied by the party being guarded.

## 8. Result

All eleven confirmed defects are repaired at the mechanism, with paired regression tests and a replay
of the original reproductions. No defect was closed by narrowing a test, no author test was rewritten,
and one half of the reviewer's critical finding (the `task_version` gate) is recorded as an explicit
integration seam with its reasoning rather than silently left open (§4.1). Nothing about this task
required device observation, so none was performed.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/butler-assistant/BA-004-multi-assistant-handoff.md
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
