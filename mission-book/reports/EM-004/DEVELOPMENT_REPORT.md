# EM-004 Development Report — Connector Capability / Probe / Auth / Instance Registry

```text
MISSION                  = EM-004 (Engineering Manager programme, task 4 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 2ec9553 (Digital-City main, "claim(EM-004): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T13:38:44Z
CONTROL_REVISION_AT_CLAIM= 0aa2284 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-004-capability-probe-auth-registry
IMPLEMENTATION_HEAD_SHA  = 6e72536f40a310a3d1c36688ef0e4fe1352f1b72
BRANCH_CI                = 36723706236 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-registry-v1/` — `registry.mjs` (records, probe facts, capability matching,
registry with probe isolation), `index.mjs` (public surface + guarantees), `tests/conformance.test.mjs`
(7 tests), and root `tests/engineering-registry.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| two instances of one connector type remain distinct | `one connector kind may have two distinct instances` (shared descriptor, distinct instance refs, duplicate instance and undeclared kind refused) |
| stale probe data is visible as stale and not silently healthy | `stale probe data is visible as stale and never silently healthy` (stale ⇒ `readiness: UNKNOWN`, capability `UNKNOWN`, `usable: false`, excluded from `usableOnly` listings) |
| auth READY cannot be inferred only from a live process | `auth READY is never inferred from a live process` (running+attachable with auth `MISSING` → `usable:false`, `AUTH_NOT_READY`; all six non-READY auth statuses refused) |
| capability mismatch produces a typed refusal before execution | `a capability mismatch is a typed refusal before execution` (`missing` for explicit `UNSUPPORTED`, `unknown` for unverified, both `CAPABILITY_MISMATCH`) |
| registry survives one connector probe throwing/timing out | `the registry survives a probe that throws or times out` (five mixed probe entries; failures recorded, successful probe applied, no fact rewritten by a failure) |
| no raw credential material is stored in registry records | `registry records refuse raw credential material and keep handles only` (secret-shaped fields refused; snapshot reports handle *presence*, never the value) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible opposite-host Correction
(EM-002 correction claimed by Alien; EM-003 and GAI-002 corrections belong to Alien), so the
unclaimed-Development tier applied. EM-004 chosen: EM is the largest pool, no other host is working in
it, and EM is a different programme from my previous claim (GAI), which the tie-break prefers.

**D2 — Descriptor vs instance.** CHOICE: `ConnectorDescriptor` (a connector *kind*: runtime, display
name, capability manifest) and `ConnectorInstance` (an installed/running/account instance, with its own
probe, process, auth and health) are separate records, and one kind may hold many instances. Reason:
the workbook names this split explicitly, and it is what lets the same worker exist twice on two
devices with different auth and freshness. Registering an instance whose kind is undeclared is refused
(`UNKNOWN_CONNECTOR_KIND`).

**D3 — Keeping four facts apart.** CHOICE: `processReadiness`, `auth.status`, `health` and
`capabilityOf` are computed independently and `usability()` requires *all* of them; it returns the
blocking list, not a boolean alone. Reason: the acceptance line "auth READY cannot be inferred only
from a live process" is the failure mode this task exists to prevent, and a single `ready` flag would
recreate it. A running, attachable process with `auth: MISSING` is therefore refused with
`AUTH_NOT_READY`.

**D4 — What a stale probe means.** CHOICE: a stale probe yields `readiness: UNKNOWN`, capability
`UNKNOWN` and `usable: false` — never the last observed state. Reason: "stale probe data is visible as
stale and not silently healthy". The freshness itself is returned alongside so an operator can see
*why* the answer is unknown, and the boundary is inclusive (`observed_at + ttl` is still FRESH; one
millisecond later is not).

**D5 — Missing capability vs unverified capability.** CHOICE: an explicitly `UNSUPPORTED` fact is
`missing`; a fact that is absent or `UNKNOWN` is `unknown`; both are `CAPABILITY_MISMATCH` but the
verdict distinguishes them. Reason: the workbook says unknown defaults to unknown/unsupported and is
never assumed true, and a dispatch decision needs to tell "this worker cannot do it" from "nobody has
verified that it can". (My first test draft collapsed the two; the module was right and the test was
corrected — recorded so the distinction is deliberate rather than incidental.)

**D6 — Probe isolation.** CHOICE: `probeAll` runs each probe inside its own guard, records
`{instance_ref, ok, code, detail}` per entry, and never rewrites an instance whose probe failed. Only
genuine probe execution failures (`PROBE_FAILED`, `PROBE_TIMEOUT`) enter the failure log; a caller
error such as an unregistered instance or a non-function probe is reported in the outcomes but is not a
probe failure. Reason: "the registry survives one connector probe throwing/timing out" — and a
differentiating failure log keeps the two classes honestly separate.

**D7 — No secret storage.** CHOICE: `auth` carries a `status` and an optional `handle_ref`; the
secret scan rejects credential-shaped field names anywhere in a record; the snapshot exposes only
`capability_handle_present`. Reason: the workbook states registry records must hold no raw credential
material, and handle values belong to the neutral store (the seam EM-008/GAI-002 also use).

**D8 — Fit without choosing.** CHOICE: `matchRequirements`/`eligibleInstances` report per-instance
verdicts and candidates; nothing ranks or selects. Reason: scheduling priority and remote placement are
explicitly out of scope, and the published contract flag `chooses_remote_host: false` states it.

**D9 — No `schema.json`.** Runtime/discovery semantics validated in code, consistent with BA-002 D2,
BA-003 D2, EM-003 D10 and GAI-002 D9.

## 3. Test summary

7 tests, all passing: descriptor/instance separation with duplicate and undeclared-kind refusals;
probe freshness (boundary-inclusive FRESH, STALE after ttl, UNKNOWN for an unparseable instant) with
stale-as-unknown capability and readiness and exclusion from usable listings; auth independence across
all six non-READY statuses plus independent health and process blockers and the attachability
distinction; capability matching (explicit unsupported vs unverified, typed refusal, stale ⇒
unverified); probe isolation across throwing, timing-out, successful, unknown-instance and
non-function entries with no fact rewriting; raw-credential refusal and handle-presence-only snapshots;
record strictness (version, unknown capability fact, bad support level, unknown field, device
reference shape, process state, health, incomplete probe) plus eligibility reporting.

Two development defects were found by my own tests and fixed in the module, not worked around:
`.map(structuredClone)` passed the array index as structuredClone's options (a real bug, fixed by
wrapping in an arrow), and the two test expectations noted in D5/D6 were corrected after confirming
the module's behaviour was the intended one.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36723706236 on 6e72536f40a310a3d1c36688ef0e4fe1352f1b72 | success |

## 5. Integration seams handed to sibling tasks

- EM-001 (core contracts): bind these records to `ConnectorRegistryPort`/`CapabilityManifest`/`AuthStatus`
  at merge; `listInstances`/`capabilities`/`authStatus`/`health` map directly onto that port.
- EM-002 (connector runtime): `updateProbe` is where the runtime's probe results land; the runtime's
  restart/safe-mode state belongs in `process.state`, not in `auth` or `health`.
- EM-005 (attention): `usability().blockers` is the honest input for "this worker needs you".
- EM-006/EM-007 (placement and remote fallback): `matchRequirements` gives fit; this module deliberately
  does not rank or select, and remote eligibility requires Remote Fabric presence (RF-009), which is
  not read here.
- EM-008 (credential/profile/session): the `handle_ref` is the only credential handle this registry
  holds; resolution stays in the neutral store.
- GAI-002 (provider/model/account registry): the two registries share the same discipline (typed
  absence, unknown-by-default, handle-only credentials, freshness) and should be reviewed together at
  merge for a consistent vocabulary.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to make an instance look usable with a stale probe or with auth that
   was never observed, to smuggle a capability claim into a descriptor that the instance does not
   honour, and to make one failing probe prevent another from being applied.
2. Confirm D5's distinction (unsupported ⇒ `missing`, unverified ⇒ `unknown`) as the vocabulary
   dispatch should read.
3. Confirm whether `health` should be derivable from probe facts or remain an independently supplied
   observation (this module keeps it independent).
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
