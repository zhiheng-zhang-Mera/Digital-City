# RF-010 Development Report — Fabric Policy Boundary + Public API

```text
MISSION                  = RF-010 (Remote Fabric programme, task 10 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = d8cc447 (Digital-City main, "claim(RF-010): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:06:40Z
CONTROL_REVISION_AT_CLAIM= 677890d (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-010-fabric-policy-public-api
IMPLEMENTATION_HEAD_SHA  = 8739185479e1185145ef5ec6e02a76aaf15c3d6e
BRANCH_CI                = 36749030367 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

**Programme note:** this is the last RF task. With RF-001..RF-010 all developed, the Remote Fabric
programme's component pool is complete; its merge workbook remains blocked until every branch passes the
two-stage/two-host gate (Alien's Corrections are in progress).

## 1. Deliverable

`contracts/remote-fabric-public-api-v1/` — `fabric-api.mjs` (frozen public ports, transport adapter boundary,
policy intersection, foreground-sensitive resource hooks, identity/task/assistant-state boundary statements,
integration seams), `index.mjs`, 6-test suite, root `tests/remote-fabric-public-api.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| A mock transport and a real/local adapter satisfy the same public Fabric API | `the public surface is frozen and a mock or real adapter satisfies it unchanged` (one caller routine runs against both; identical normalized results; transport hints never leak) |
| Upper layers can resolve device/capability/presence and invoke without knowing LAN/Bluetooth/relay details | Same test (`transport_class: 'HIDDEN_FROM_CALLER'`, `transport_specifics_exposed: false`, no transport string in the boundary projection) |
| Policy denial remains denial even with a valid authenticated session | `policy denial stays a denial even on a perfect authenticated session` (`denied_despite_valid_session: true`, zero transport calls) |
| An advertised capability without effective permission cannot execute | `an advertised capability without effective permission cannot execute` (advertised but `permission_granted: false`; unadvertised and wrong-version refusals) |
| A handoff/foreground change does not implicitly transfer task ownership or permission | `Fabric holds no task graph, no assistant state and no competing identity namespace` (`task_ownership_changed: false` on disconnect, `fabric_owns_task_ownership: false`, boundary statements) |
| Policy hook equivalent to Owner/User ∩ Caller/Assistant ∩ DeviceCapability ∩ TaskActionGrant | tests 2 and 3 (all four axes enforced and individually named in `denied_axes`) |
| Foreground-sensitive resource hooks for camera/microphone/screen | `foreground-sensitive resources are enforced locally without Fabric deciding ownership` (`FOREGROUND_CONFLICT` naming the holder, `USER_CONFIRMATION_REQUIRED`, holder-only release) |
| Exclusive/shared/background enforced without Fabric deciding assistant/task ownership | Same test (`fabric_decides_ownership: false`) |
| Adapter boundaries for Utopia Action/Room, Butler embodiment bus, GAI endpoints, Engineering connectors | Test 1 (`ADAPTER_BOUNDARIES` for all four, each stating what it does **not** own) |
| Canonical device identity; no competing physical-device namespace | Test 5 (`COMPETING_IDENTITY_NAMESPACE`; `canonical_namespace: 'REMOTE_FABRIC_DEVICE'`) |
| Fabric must not store City task graph or Assistant durable state | Test 5 (`FABRIC_DOES_NOT_OWN_TASK_TRUTH` / `FABRIC_DOES_NOT_OWN_ASSISTANT_STATE` with the owning subsystem named) |
| Contract tests proving transport can be swapped without upper-layer API change | Test 1 |
| Final-integration seams for RF-001..RF-009 and BA-003/BA-008/BA-009 without merging those branches | `integration seams are recorded without importing a sibling branch` (12 seams, `sibling_branches_imported: 0`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, EM-010, GAI-003…008, RF-004…008 Corrections;
RF-005 in progress). Tie-break after EM-010 excluded Engineering, so RF-010 was chosen: it closes the Remote
Fabric programme's component pool and is the boundary every other programme's integration task will be
written against, so it is worth completing while the RF contracts are fresh.

**D2 — What exactly is public?** CHOICE: the eleven workbook-named ports, published as `PUBLIC_PORTS` and
asserted by the suite; adding a port is a version change. Reason: "freeze the public boundary" is the goal,
and an enumerated list is the only form of "frozen" a reviewer can check. The module also publishes
`apiVersion()` and the adapter interface descriptor so a caller can assert compatibility at runtime.

**D3 — Where does transport live?** CHOICE: behind one injected adapter with the same method set
(`discover/connect/invoke/subscribe/openStream/disconnect`), with results normalized so nothing
transport-specific crosses the boundary — the test drives a mock and a "local" adapter whose results
*deliberately include a `transport_hint`* and asserts the hint never appears in the public result. Reason: the
acceptance bullet requires both adapters to satisfy the same API, and proving it needs a leak test rather
than an interface assertion alone.

**D4 — What grants permission?** CHOICE: only the four-axis intersection. `intersectPolicy` evaluates all four
axes and returns `session_is_permission: false`, `presence_is_permission: false`,
`trusted_device_is_permission: false`, `foreground_is_permission: false` and
`permission_is_intersectional: true`. Reason: RF invariant 11 and the workbook's out-of-scope list ("implicit
permission based on presence, trusted-device status or foreground name"). The denial result additionally
reports `denied_despite_valid_session: true` when a session existed, because that is the case a reviewer must
be able to see.

**D5 — Advertised capability vs permission.** CHOICE: `listCapabilities` returns availability metadata with
`permission_granted: false` and per-capability `advertisement_is_permission: false`, and `invoke` refuses
unadvertised capabilities, wrong versions (no coercion) and policy-denied calls, in that order. Reason: the
acceptance bullet separates advertisement from permission; refusing a version mismatch before policy avoids
reporting a policy denial for a call that could never run.

**D6 — Foreground-sensitive resources.** CHOICE: `CAMERA`/`MICROPHONE`/`SCREEN` are foreground-required and
`CAMERA`/`MICROPHONE` are exclusive; an exclusive resource refuses a second action naming the current holder,
a capability flagging `requires_user_confirmation` returns `USER_CONFIRMATION_REQUIRED`, and release is
holder-only (an unheld release is a no-op rather than an error). Reason: the workbook asks for device-local
foreground/confirmation hooks, and the module states `fabric_decides_ownership: false` because enforcing a
device-local rule is not the same as choosing an owner — a distinction that matters at merge with BA-006/BA-008.

**D7 — Identity, state and ownership boundaries.** CHOICE: `resolveDevice` refuses a `competing_namespace`
(`COMPETING_IDENTITY_NAMESPACE`), `storeTaskGraph`/`storeAssistantState` always refuse, and `disconnect`
reports `task_ownership_changed: false` and `trust_revoked: false` (while `revokeDevice` closes sessions and
streams and makes even a valid session useless). Reason: the workbook forbids competing device namespaces and
requires Fabric to hold no City task graph or Assistant state; conflating disconnect with revocation would
silently drop trust, which is a real hazard the test pins down.

**D8 — Integration seams.** CHOICE: publish all twelve seams as data (`task`, `seam`, `consumed_as`) with
`sibling_branches_imported: 0` and `fabric_depends_on_unfinished_siblings: false`. Reason: the workbook asks
for the seams to be *recorded* without merging or importing those branches, and the shared contract explicitly
forbids making local tests pass by importing a sibling branch. Recording the *consumption* of each seam (for
example "RF-009: `getPresence()` is reachability only", "BA-009: `policy.evaluate()` supplies the
intersection") is what the final-integration workbook will need.

**D9 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/remote-fabric-public-api-v1/fabric-api.mjs` | new — public ports, adapter boundary, policy intersection, foreground hooks, boundary statements, seams |
| `contracts/remote-fabric-public-api-v1/index.mjs` | new — public surface |
| `contracts/remote-fabric-public-api-v1/tests/conformance.test.mjs` | new — 6 conformance tests |
| `tests/remote-fabric-public-api.test.mjs` | new — root runner entry (101 → 107 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

6 tests. Three failures on first run — all test-side; **no module defect was found in this task** (worth
stating plainly rather than implying a fix):

1. **Test error:** the caller helper did not return `boundary`, so the leak assertion read `undefined`. Fixed
   to call `api.boundary()`.
2. **Test double:** the adapter returned `ONLINE` for every `device_ref`, including one it had never
   discovered, so the "unknown device is reported honestly" assertion failed. The double is now
   device-aware — the module was correctly relaying what the adapter said.
3. **Test error:** a journal assertion expected an `INVOKED` entry in an instance that had never invoked
   anything. The test now performs a connect/invoke before asserting, which also exercises the journal.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 107 tests, 107 pass, 0 fail (101 baseline + 6 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36749030367 on 8739185479e1185145ef5ec6e02a76aaf15c3d6e | success |

## 6. Integration seams handed to sibling tasks

- **Every RF task (RF-001..RF-009):** the seam table records how each is consumed through the public ports,
  and none is imported. At final integration the RF merge workbook should verify these twelve seams end to end
  (including the real two-device proof the programme still owes) rather than re-deriving them.
- **BA-003 / BA-008 / BA-009 (Butler):** embodiment binding, the embodiment event bus and duties/permission
  policy are the three Assistant-side seams; `policy.evaluate()` is where BA-009's intersection is supplied,
  and this module never decides assistant ownership.
- **GAI-002…GAI-009:** GAI endpoints consume `listCapabilities`/`invoke`; the policy port is the shared
  permission gate, and GAI's consent/budget admission remains a *separate* gate (this module cannot substitute
  for it).
- **EM-004 / EM-007 / EM-010:** Engineering connectors consume `resolveDevice`/`listCapabilities`/
  `openStream`; connector selection stays with EM-010 and this boundary stays capability-based.
- **City task core / Utopia Rooms:** `storeTaskGraph` refuses by design, so the task core must remain the
  owner; the Action/Room adapter boundary lists exactly which ports a Room surface may consume.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: an adapter whose `connect` returns a session for a revoked device (the
   module checks revocation before connecting, but a transport-initiated session is not covered); an `invoke`
   with `resource_class` set to a class the capability does not actually expose; two `openStream` calls
   competing for an exclusive foreground resource (streams currently bypass the foreground hook); a policy
   port that throws instead of returning a decision; and `releaseForeground` by a different caller on a
   non-exclusive resource.
2. Confirm D4 (only the four-axis intersection grants, with the negatives published) and D6 (Fabric enforces
   a device-local foreground rule but decides no ownership).
3. The stream/foreground gap in item 1 is the most likely real weakness: `openStream` evaluates policy but not
   the foreground hook, which the workbook's "camera/microphone/screen" wording arguably requires.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
