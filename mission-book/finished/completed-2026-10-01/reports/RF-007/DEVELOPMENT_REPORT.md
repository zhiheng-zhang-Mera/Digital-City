# RF-007 Development Report — Versioned Capability Registry + Addressing

```text
MISSION                  = RF-007 (Remote Fabric programme, task 7 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 04d1247 (Digital-City main, "claim(RF-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:12:05Z
CONTROL_REVISION_AT_CLAIM= 9fa6eaa (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-007-versioned-capability-registry
IMPLEMENTATION_HEAD_SHA  = 496d0520af64396508ba5144888aa2a33f176de3
BRANCH_CI                = 36742525949 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-capability-registry-v1/` — `capability-registry.mjs` (versioned ids, advertisements,
availability/loss, deterministic negotiation, trusted-node resolution, invocation tickets, wire
serialization), `index.mjs`, 7-test suite, root `tests/remote-capability-registry.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Two heterogeneous devices can advertise different implementations under the same logical capability | `two heterogeneous devices advertise different implementations of one logical capability` (`advertisement_count: 2`, `heterogeneous_implementations: true`, different `adapter_ref`) |
| Callers can request a compatible version without knowing device class | `callers resolve a compatible version without knowing the device class` (`device_class: null` on descriptors and resolutions; exact-major resolution; deterministic tie-break) |
| Unsupported versions fail explicitly | `an unsupported version fails explicitly instead of being coerced` (`INCOMPATIBLE_VERSION` with `supported_versions`, `coerced: false`, `best_effort_downgrade: false`) |
| Capability loss invalidates new invocations and is visible through presence/capability state | `capability loss invalidates new invocations and stays visible in state` (unavailable + `loss_reason` on the projection, `losses` in the node snapshot, invocations refused, re-advertisement bumps the version) |
| Exclusive/shared/background and live/queue metadata survive serialization/versioning | `exclusive/shared/background and live/queue metadata survive serialization and versioning` (wire round-trip equality; unknown execution keys rejected; an unknown wire contract version refused) |
| Versioned capability identifiers and descriptors; lookup by device and across trusted nodes | tests 1–3 (`parseCapabilityId`, `lookup`, `snapshot`, `resolveAcrossTrusted`) |
| Advertisement is availability metadata only; permission remains a separate policy decision | `an advertised capability is availability metadata, never permission` (`permission_granted: false` everywhere; invocation needs an explicit decision; ticket has `executed: false`) |
| Deterministic version negotiation, no best-effort coercion; dynamic loss/gain | tests 2, 3 and 4 |
| No hard-coded `phone_*`/`alien_*`/OS-specific upper-layer methods | `parseCapabilityId` rejects `phone_camera` and unversioned ids; descriptors carry `os_specific_method: null` and `device_specific: false` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, GAI-003…006, RF-004, RF-005 and RF-006
Corrections). Tie-break after BA-008 excluded Butler, so RF-007 was chosen: it is the addressing layer RF-008
(RPC/EVENT/STREAM) and GAI-007 (device-aware remote execution) both require, and RF invariant 6 makes
versioned capability addressing the only sanctioned way for callers to reach a device.

**D2 — How is a version negotiated?** OPTIONS: (a) semantic-version strings with range parsing; (b) an
explicit integer major set per advertisement with exact-match negotiation. CHOICE: (b), plus "highest
mutually available major" when the caller does not pin one. Reason: the acceptance bullet requires
deterministic negotiation and forbids hiding incompatible versions behind coercion; an integer set makes
negotiation a total, reviewable function with no string-grammar ambiguity, and `INCOMPATIBLE_VERSION` lists
exactly what was offered.

**D3 — Is a capability identifier device- or OS-specific?** CHOICE: no — `namespace.name@major` only, with
`device_specific: false`, `os_specific: false`, `device_class: null` and `os_specific_method: null` published
on the descriptors, and `phone_camera`/unversioned ids refused at parse time. Reason: the workbook's
out-of-scope list names hard-coded `phone_*`/`alien_*`/OS methods, and RF invariant 6 requires callers to
resolve versioned capabilities rather than device-specific routes. Publishing the negatives makes the rule
checkable rather than merely documented.

**D4 — What does advertising grant?** CHOICE: nothing. Every descriptor, lookup, snapshot and resolution
reports `permission_granted: false` and `capability_is_not_permission: true`, and `invoke` refuses with
`PERMISSION_DECISION_REQUIRED` unless the caller supplies an explicit policy decision, then returns a ticket
with `executed: false, external_side_effect: false`. Reason: "granting access because a capability is
advertised" is the first out-of-scope item, and RF invariant 11 keeps permission intersectional. Keeping the
registry out of execution also keeps it out of the transport (D8).

**D5 — How is capability loss represented?** CHOICE: loss is a recorded, versioned state change, not a
deletion — the advertisement becomes `UNAVAILABLE` with a typed `loss_reason`, a `loss` record is appended
with the previous availability, and the node snapshot lists both the (unavailable) capability and its
losses; regaining the capability re-advertises with a bumped `advertisement_version` on the same
`advertisement_ref`. Reason: the workbook requires loss to be visible through presence/capability state and
to invalidate new invocations. The suite found that `loss_reason` was missing from the projection itself
(only the `withdraw` result and the snapshot carried it), which undermined "visible through state"; it is now
on every projection.

**D6 — Deterministic tie-break.** CHOICE: eligible candidates sort by negotiated major (descending), then
`node_ref`, then `advertisement_version`; the chosen candidate is `eligible[0]`. Reason: two nodes offering
the same major must produce the same answer for the same input, and the ordering is asserted in the test
rather than left implicit.

**D7 — Trusted-node resolution.** CHOICE: `trusted_nodes` filters candidates, and an untrusted advertisement
appears in the candidate list with `trusted: false` and `excluded_reason: 'NOT_TRUSTED'`; if only untrusted
nodes advertise, resolution fails `NOT_TRUSTED`. Reason: RF invariant 1/4 — availability is not trust, and a
caller must be able to see *why* a node was not considered without the registry pretending the advertisement
does not exist.

**D8 — Serialization.** CHOICE: a strict `toWire`/`fromWire` pair that carries the contract version, refuses
a mismatched `wire_version` (`INCOMPATIBLE_CONTRACT`, `coerced: false`) and re-validates execution and
constraint metadata on the way in. Reason: the acceptance bullet requires execution metadata to survive
serialization/versioning, and a permissive parser is how reserved metadata silently changes meaning across a
version boundary.

**D9 — Scope discipline.** CHOICE: this registry holds transport-addressable node capabilities only; it does
not model provider/model or connector/worker capabilities, and it references the canonical RF device identity
(`node_ref`) rather than inventing one. Reason: the workbook assigns those to the domain registries
(GAI-002, EM-004/EM-006); the seam is recorded in §6.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/remote-capability-registry-v1/capability-registry.mjs` | new — ids, advertisements, negotiation, resolution, tickets, wire |
| `contracts/remote-capability-registry-v1/index.mjs` | new — public surface |
| `contracts/remote-capability-registry-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/remote-capability-registry.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. One failure on first run, and it was a **genuine defect**: capability loss was not fully visible
through the projection — `project()` did not expose `loss_reason`, so a consumer reading the capability
state (rather than the `withdraw` return value or the node snapshot) could see an unavailable capability
without the reason, and the acceptance bullet requires loss to be visible through
presence/capability state. Fixed by adding `loss_reason` to every projection; the rest of the suite passed
first time, including the wire round-trip and the negotiation ordering.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36742525949 on 496d0520af64396508ba5144888aa2a33f176de3 | success |

## 6. Integration seams handed to sibling tasks

- **RF-006 (path manager):** an `adapter_ref`/`endpoint_ref` from a ticket is reached over the session that
  `connect` established; capabilities never open their own transport, and a migrated path must keep the same
  `node_ref` and capability version.
- **RF-008 (typed RPC/EVENT/STREAM + reliable commands):** the invocation ticket is the addressing half of a
  command; RF-008 should carry `negotiated_major`, `adapter_ref` and the execution metadata into its command
  envelope and use the `exclusive` flag to decide whether a lease (BA-008) is required.
- **RF-009 (presence/offline/reconnect):** capability availability and node reachability are different
  facts — presence must not resurrect a withdrawn capability, and a reconnect should re-resolve rather than
  reuse a stale ticket.
- **RF-010 (fabric policy boundary/public API):** `permission_decision` is the injection point; the policy
  boundary owns the decision object and its `policy_ref`.
- **RF-001 (identity):** `node_ref` is the canonical device identity; this registry never mints an identity
  and never treats an address as one.
- **GAI-002 / GAI-007 (provider/model registry, device-aware execution):** a GAI route to a device capability
  resolves here and then passes through GAI-004's consent/budget gate; provider/model identifiers stay in the
  GAI domain registry and only reference `node_ref`.
- **EM-004 / EM-006 / EM-007 (engineering registry, placement, remote return):** connector/worker
  capabilities remain the Engineering domain registry; the shared vocabulary is `node_ref` plus a versioned
  capability id, and at merge the two registries should agree one identifier grammar.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a node advertising a capability at a major that its adapter cannot serve
   (the registry trusts `adapter_ref`, it cannot verify); two advertisements for the same node/capability
   racing a withdraw; a wire payload with duplicate entries for one node/capability (last write wins today —
   confirm); constraints that request only `requires_foreground: false` (matches everything today); and an
   `invoke` whose `permission_decision` is a truthy non-object.
2. Confirm D2 (integer-major negotiation, exact-match when requested) and D5 (loss is versioned state on the
   same advertisement rather than a new one) as the intended readings.
3. Confirm whether a withdrawn capability should also invalidate already-issued tickets, which this contract
   deliberately leaves to RF-008/RF-006 (the ticket is addressing, not a session).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
