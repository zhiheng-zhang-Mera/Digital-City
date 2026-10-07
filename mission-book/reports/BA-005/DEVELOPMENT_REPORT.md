# BA-005 Development Report — Digital-Me Context Gateway + Memory/Audience Boundaries

```text
MISSION                  = BA-005 (Butler Assistant programme, task 5 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0e7c7ef (Digital-City main, "claim(BA-005): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:19:35Z
CONTROL_REVISION_AT_CLAIM= c8eaadd (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-005-digital-me-context-gateway
IMPLEMENTATION_HEAD_SHA  = 4fec952d414cee8cd67245f901c71a75cee93b30
BRANCH_CI                = 36728731544 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/digital-me-gateway-v1/` — `gateway.mjs` (canonical read port + double, record contract,
audience visibility matrix, policy-mediated `query`, read-only write refusal, assistant-private state,
device-ephemeral rebuild), `index.mjs`, 8-test suite, root `tests/digital-me-gateway.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| different assistants receive different authorized scopes from the same Digital-Me | `different assistants receive different authorized scopes from the same Digital-Me` |
| a denied scope returns a typed refusal without partial leakage | `a denied scope is a typed refusal with no partial leakage` (`projection: null`, four distinguishable denial axes) |
| assistant profile/relationship changes never change canonical records | `assistant profile and relationship changes never change canonical records` (byte-identical snapshot, write refused, poisoned record rejected) |
| a private/audience-restricted fact is not surfaced through another audience without disclosure authorization | `a private fact is not surfaced through another audience without disclosure authorization` |
| device-ephemeral context disappears/rebuilds without corrupting durable assistant memory | `stale context is reported rather than served, and device-ephemeral context is never durable` |
| scope allow/deny, audience boundary, absence, staleness, provenance, cross-assistant isolation | all of the above plus `cross-assistant private memory is never visible to another assistant`, `least data by default…`, `every projection carries provenance…` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair and no eligible opposite-host Correction
(Alien was correcting RF-003), so the unclaimed-Development tier applied. BA-005 chosen under the
tie-break (different programme from my EM claim) and because it owns invariants 16–18.

**D2 — Direct access or a gateway port?** CHOICE: a read-only `DigitalMeReadPort` with
`listRecords`/`resolveValue`, and the gateway holds no copy of canonical state. Reason: the workbook puts
"assistant direct database access" out of scope and forbids bulk dumps; a port makes both checkable, and
the deterministic double lets the isolation tests run without a database.

**D3 — Where do values live?** PROBLEM: my first fixture put a `value` on the canonical record, which the
strict record contract rejected. CHOICE: values live in the port, keyed by `value_ref`; a record carries
references only, and `resolveValue` is the single way to obtain a value. Reason: this is what makes
"least data by default" a property of the *shape* rather than of a flag — a projection can only carry a
value when the caller asks *and* policy allows it (`allow_values`), and the port is the only thing that
can resolve one.

**D4 — What does a denial look like?** CHOICE: a refusal returns `{granted: false, code, detail,
projection: null, provenance}` — no projection object at all — and the axes are distinct:
`UNKNOWN_ASSISTANT`, `UNKNOWN_SCOPE`, `UNKNOWN_AUDIENCE`, `UNKNOWN_PURPOSE`, `SCOPE_DENIED`,
`PURPOSE_DENIED`, `AUDIENCE_DENIED`. Reason: "denied scope returns a typed refusal without partial
leakage" — a partially populated projection is the failure mode, and a caller needs to know *which* axis
to fix. The test asserts the serialized refusal contains none of the withheld facts or values.

**D5 — Knowledge versus disclosure.** CHOICE: the audience matrix decides who may hold a fact, and a
*separate* rule decides disclosure: a record whose recorded audience differs from the requested audience is
withheld unless `disclosure_authorized === true`, and the withholding reason distinguishes
`AUDIENCE_NOT_PERMITTED` (the matrix) from `DISCLOSURE_NOT_AUTHORIZED` (the rule). Reason: invariant 17.
The distinction matters operationally — the first means "this audience can never hold it", the second
means "it could, with authorization". Found while testing: my own test expected the matrix reason where
the disclosure rule was the actual (and more precise) blocker; the test was corrected and both reasons
are now asserted.

**D6 — Canonical identity is read-only.** CHOICE: the gateway exposes no write path, `write()` throws
`DIGITAL_ME_WRITE_FORBIDDEN`, a canonical record carrying assistant/authority fields is rejected
(recursive scan), and assistant persona/relationship state is returned by
`recordAssistantPrivateState` with `stored_in_digital_me: false`. Reason: invariants 2/3/18 — persona is
assistant-owned and must never leak into canonical user identity.

**D7 — Device-ephemeral context.** CHOICE: `DEVICE_EPHEMERAL` records are never included in a durable
projection (reported as `DEVICE_EPHEMERAL_NOT_DURABLE`), and `rebuildDeviceEphemeralContext` starts empty
with `durable: false`, `merged_into_durable_memory: false`. Reason: the acceptance line requires ephemeral
context to disappear and rebuild without corrupting durable memory; a rebuild that restored the previous
session would defeat it.

**D8 — Staleness.** CHOICE: a fact past its TTL is excluded from `facts` and listed in `stale`, never
served as current. Reason: the same discipline as BA-002/BA-003/GAI-002/EM-004 — a remembered fact must
not read as a current one.

**D9 — Provenance.** CHOICE: every projection *and* every refusal carries
`{assistant_ref, purpose, audience, scopes, policy_ref, decided_at}`. Reason: "provide explicit
denial/unavailable/stale behavior and audit provenance" — a denial that cannot be explained after the
fact is not auditable.

**D10 — No `schema.json`.** Consistent with the other programme branches.

## 3. Test summary

8 tests, all passing: per-assistant scope differentiation with the same port; the four denial axes with a
leak-free refusal; canonical immutability (snapshot equality, write refusal, poisoned-record rejection,
forbidden-field scan); private-versus-shared disclosure with both withholding reasons; cross-assistant
private-memory isolation; least-data defaults with `allow_values` gating; staleness reporting and
device-ephemeral rebuild; provenance on both granted and refused queries plus record/envelope strictness
and constructor refusals.

Two development findings are recorded: the `value`-on-record fixture mistake (D3), and my incorrect
withholding-reason expectation (D5) — in both cases the module's contract was the intended one and the
test was corrected rather than the rule relaxed.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 109 tests, 109 pass, 0 fail (101 baseline + 8 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36728731544 on 4fec952d414cee8cd67245f901c71a75cee93b30 | success |

## 5. Integration seams handed to sibling tasks

- BA-002 (Assistant Core): a ContextProjection from this gateway is the authorised source for the Core's
  committed memory references; the Core's own `projectContext` should consume this gateway rather than
  reading Digital-Me.
- BA-003 (embodiment): `deviceRef` scopes device-ephemeral context; the ephemeral rebuild belongs to the
  device session, not to durable assistant state.
- BA-004 (handoff): the audience scope in a handoff package is the same vocabulary as here; a recipient
  must not receive a projection the outgoing assistant was authorised for.
- BA-006/BA-007: a settings surface shows `policy_ref` and the withholding reasons rather than raw
  records, so a user can see *why* something was withheld.
- GAI-004 (consent/budget) and EM-008 (credential/profile): the neutral handle discipline is the same;
  this gateway adds the audience/disclosure dimension on top.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to leak a withheld fact through a channel other than `facts` (nested
   includes, error details, `stale` entries), to reach a value without `allow_values`, and to make an
   ephemeral record durable.
2. Confirm D5's two-reason model (`AUDIENCE_NOT_PERMITTED` versus `DISCLOSURE_NOT_AUTHORIZED`) as the
   audit vocabulary.
3. Confirm whether `includeValues` should be a per-purpose policy rather than a per-call flag.
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
