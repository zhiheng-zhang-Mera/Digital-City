# BA-001 Correction Report — Butler Zone + Personalization Contracts

```text
MISSION              = BA-001 (Butler Assistant programme)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-001-butler-zone-personalization.md
CLAIM_COMMIT         = 7f7b76a (Digital-City main, claim of BA-001 Correction by Alien)
CLAIMED_AT           = 2026-09-30T12:30:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 27f5c4e3ca77436c5fdacca229b2916b71180a0c
CORRECTION_BRANCH    = assistant/BA-001-butler-zone-personalization
CORRECTION_HEAD_SHA  = 8c7e1dc2d14b4c2d9d51e1c772017a529150795b
BRANCH_CI            = 36714796731 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 131 pass / 0 fail, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Correction was treated as a repair task, not a verification pass. The Development
head 27f5c4e was fetched into a separate worktree and attacked directly, reusing
none of the author's tests as the source of truth: a standalone probe
(`.scratch/probe.mjs`, Git-ignored) drove the public Zone API with hostile input, and
every claim in the Development report was re-derived from the code rather than read
from the report.

The author's own hand-off (report §6.1) named the attack surfaces to try: deep nesting,
array-of-objects, unicode/case-variant key names and prototype-pollution keys such as
`__proto__`. That list was taken as a starting point, not as the scope.

## 2. Independent review findings

Two real defects, both reachable from the public API, plus one class-level hardening
gap. Everything else attempted held.

### DEFECT 1 (high) — prototype injection through a profile patch

**Where:** `personalization.mjs` `applyProfilePatch`, reached from the public
`zone.patchProfile` — the write path BA-007's settings surface is told to use.

**What happened:**

```js
applyProfilePatch(base, JSON.parse('{"__proto__":{"isAdmin":true}}'))
// returned a profile whose prototype is {isAdmin:true},
// with Object.keys(next) unchanged and next.isAdmin === true
```

**Why it worked, in two steps:**

1. `const port = registry.ports[key]` answers `Object.prototype` for `__proto__`
   (and `constructor`, `toString`, …), which is truthy, so the
   `UNKNOWN_PERSONALIZATION_PORT` guard did not fire.
2. `next[key] = value` therefore executed with `key === '__proto__'`, which invokes the
   `__proto__` *setter* — it rewrites the object's prototype instead of adding a key.

**Why it matters:** every boundary in this contract is enforced by scanning own keys
(`Object.keys`, `Object.entries`, `validateProfile`). A property attached to the
prototype is invisible to all of them, so a validated profile could still answer
attacker-controlled values — including an authority-shaped value — to any consumer that
reads `profile.<something>`. It is a direct denial of `effectiveGrantsFromProfile`'s
guarantee that a profile grants nothing. It also silently changes the object's
identity, so two "equal" profiles can behave differently.

**Repair:** the patch path now refuses reserved prototype keys *before any assignment*,
and looks ports up with `Object.hasOwn` so an inherited name can never satisfy the port
guard. The registry itself no longer accepts a reserved port id, for the same reason.

### DEFECT 2 (medium) — undeclared port fields accepted for inherited property names

**Where:** `personalization.mjs` `validateProfile` (`!(key in port.default())`) and
`validateExtensions` (`!('value' in entry)`).

`in` walks the prototype chain, so `voice.toString`, `voice.valueOf`,
`voice.hasOwnProperty`, `voice.constructor` and `voice.isPrototypeOf` were all accepted
as *declared* fields (`validateProfile(...).ok === true`), directly contradicting the
comment on that line — "an undeclared field inside a port is a schema error" — and the
same claim in the Development report. `validateExtensions` had the same misuse for the
required `value` key.

**Repair:** `Object.hasOwn` in both places.

### Class-level hardening — reserved keys were not a concept

Both defects share a root cause: the contract had no notion of a key that must never
appear, so each site had to remember to look up safely. Reserved prototype keys
(`__proto__`, `prototype`, `constructor`) are now refused at every depth of a stored
profile document, of a bundle, of a patch and of a port registration, via
`findReservedKeyPaths`. The published schema states the same rule in
`x-authority-boundary.forbiddenPrototypeKeys`, and a test keeps schema and runtime in
step.

**Not fixed, deliberately:** `{ __proto__: ... }` written as an object *literal* sets the
prototype rather than creating a key, so it is not detectable as data and not this
contract's concern; the guard is against a key that arrives as data (JSON.parse, spread,
`Object.defineProperty`), which is the only way it can arrive over the wire.

## 3. Attacked and found sound (no repair needed)

Recorded so the review is auditable and so a future reader does not re-litigate them:

| Attack | Result |
|---|---|
| authority key nested deeply inside an extension value | refused (`…a.b.c.permission is an authority field`) |
| authority key inside an array of objects | refused (`…value[0].deeper[0].capabilities …`) |
| case variants (`Permissions`, `EXECUTION_LEASE`) | refused (`/i` pattern) |
| `effect: "ALLOW"` inside a nested rule object | refused |
| authority word as an extension namespace head (`permission.extra`) | refused |
| Digital-Me namespace (`digital-me`, `user-identity`) in a bundle | refused |
| duty label carrying `:` grant syntax (`act:device.control`) | refused |
| a top-level own `__proto__` key in a profile document | refused (unknown port + reserved key) |
| a reserved key inside a bundle's extension value | refused, and `importBundle` is atomic |
| duplicate assistant id, stale `expectedRevision`, rejected-write atomicity | behaved as documented |

One deliberate non-finding worth stating: a unicode lookalike key (`permіssions`, with a
Cyrillic `і`) is accepted. It is *not* a defect — that key is descriptive extension data,
no code path reads it, and it cannot grant anything because
`effectiveGrantsFromProfile()` always returns no grants. Refusing it would be
security theatre rather than a boundary.

## 4. Decisions not specified by the book

**C1 — Correction scope: fix everything, or only what the workbook lists?**
The workbook says "every discovered in-scope defect must be fixed directly on this same
branch and covered by regression tests". Both defects are in-scope: they are
personalization-contract authority and schema-strictness defects, which is precisely this
task's subject. The class-level reserved-key rule was added because fixing only the two
sites would leave the same trap for BA-007's settings writer; it is six lines and one scan.

**C2 — Reporting shape.**
`mission-book/reports/README.md` had no CORRECTION_REPORT format when this stage started.
Alien added the `DEVELOPMENT_REPORT`/`CORRECTION_REPORT` minimal formats to that file
during the RF-001 Development claim (decision D6 of `reports/RF-001/DEVELOPMENT_REPORT.md`),
and this report follows them. Recorded here because the format is itself a construction
decision and the two hosts must not diverge on it.

**C3 — Was the published schema in scope?**
Yes. The contract's own D12 claims schema↔runtime consistency, so a runtime rule that the
schema does not state would have made that claim false. `forbiddenPrototypeKeys` and the
matching note were added, with a test binding them to `RESERVED_KEY_PATTERN`.

**C4 — Evolution-feed record.**
Not written, for the same reason as BA-001 D11 and RF-001 D8: the
`contracts/evolution/mission-event-v1.schema.json` event vocabulary is migration-scoped
(`^MB-[0-9]{3}$`, roles `MIGRATION|VERIFICATION`), so no BA event validates and extending
it would touch a frozen contract. This report and the workbook frontmatter are the
construction record.

## 5. Defects fixed, with regression tests

Files changed on the same branch, on top of the Development head:

| File | Change |
|---|---|
| `contracts/butler-assistant-v1/personalization.mjs` | reserved-key pattern + `findReservedKeyPaths`; own-key port lookup in `applyProfilePatch`; patch rejects reserved keys before assignment; own-key port-field and extension-entry checks; registry rejects a reserved port id |
| `contracts/butler-assistant-v1/zone.mjs` | `validateBundle` refuses reserved keys anywhere in a bundle |
| `contracts/butler-assistant-v1/schema.json` | `x-authority-boundary.forbiddenPrototypeKeys` + note |
| `contracts/butler-assistant-v1/tests/conformance.test.mjs` | 8 regression tests |

Regression tests added (`tests/conformance.test.mjs`):

1. `a profile patch cannot rewrite a prototype or inject a hidden property`
2. `the Zone patch path is closed to prototype injection and leaves state untouched`
3. `a rejected patch leaves the stored profile byte-identical`
4. `inherited property names are not declared port fields`
5. `reserved keys are refused at every depth of a stored profile document`
6. `a bundle refuses a reserved key anywhere, including inside an extension value`
7. `a reserved key cannot be registered as a personalization port`
8. `the published schema states the reserved-prototype-key rule the runtime enforces`

Each negative test asserts both the refusal **and** that no state changed, because a guard
that throws after mutating is not a guard. Test 5 also asserts that a legitimate field of
the same port (`voice.speakingRate`) is still accepted, so the stricter check cannot be
satisfied by refusing everything.

## 6. Test summary

Independent probe plus the full local suite on the corrected head:

| Check | Result |
|---|---|
| hostile probe against the public Zone API | all attacks above refused; no state change |
| `node --test contracts/butler-assistant-v1/tests/conformance.test.mjs` | 30 pass / 0 fail (22 Development + 8 new) |
| `node --test tests/*.test.mjs` | 131 pass / 0 fail |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1801 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at 27f5c4e3ca77 |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36714796731 on 8c7e1dc2d14b4c2d9d51e1c772017a529150795b | gateway-web success, android success |

FAILURE_REPAIR_SUMMARY: no test failed after the repair; the 22 Development tests passed
unchanged, which is the evidence that the repair did not weaken the contract. The two
defects were found by the independent probe, not by a failing test — that is the point of
the Correction stage, and it is why the probe is recorded even though it is not part of CI.

## 7. Cross-task seams recorded (not solved here)

- **BA-007 (settings surface)** is the consumer of `patchProfile`. The reserved-key refusal
  is a behaviour change it must expect: a patch containing `__proto__`, `prototype` or
  `constructor` now throws `RESERVED_PROFILE_PATCH_KEY` instead of silently succeeding.
  The typed error vocabulary therefore has one new code; BA-007 should surface it as an
  invalid-input case, not a server fault.
- **BA-002/BA-005** read a profile's durable content. Nothing about the stored shape
  changed; only what is accepted into it.

## 8. Open items for the Owner

1. The reserved-key refusal is stricter than "reject authority fields" and will reject a
   payload that legitimately needs the literal key `constructor`. Judged correct for a
   profile contract (a descriptive profile has no such field), but it is a judgement, so
   it is recorded rather than assumed.
2. The evolution-feed question (C4, BA-001 D11, RF-001 D8) is still open for the Owner:
   either extend the event schema or state that the mission-book reports are the complete
   construction record for BA/RF/GAI/EM work.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = 8c7e1dc2d14b4c2d9d51e1c772017a529150795b
BRANCH_CI           = 36714796731 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
