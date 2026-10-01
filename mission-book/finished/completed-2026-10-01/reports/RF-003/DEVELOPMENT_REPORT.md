# RF-003 Development Report — Same-Wi-Fi / LAN Discovery + Local Direct Path

```text
MISSION                  = RF-003 (Remote Fabric programme, task 3 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = b084e87 (Digital-City main, "claim(RF-003): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T13:47:25Z
CONTROL_REVISION_AT_CLAIM= bdaca97 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-003-local-discovery-lan-direct
IMPLEMENTATION_HEAD_SHA  = f0d8f59796a3d152a61f104682d3d86c2ca023c2
BRANCH_CI                = 36724660725 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-local-discovery-v1/` — `discovery.mjs` (adapter port + deterministic double,
advertisement validation, candidate normalization, pruning, pairing resolution, invocation gate,
direct-path upgrade, bounded scan planning, network-change re-resolution), `index.mjs`, 8-test suite,
and root `tests/remote-local-discovery.test.mjs`.

**Recorded deviation (D1)**: unlike RF-001/RF-002, this task ships as a **contract module under
`contracts/`** rather than a third module under `city/00-foundation/02-city-node-network/`. Reason: the
two sibling RF branches already each edit `city/CITY_IMPLEMENTATION_MANIFEST.json`,
`city/tests/manifest.test.mjs`, `tests/capability-registry.test.mjs` and both `city/docs/*/ARCHITECTURE.md`;
a third edit to the same lines would add a third guaranteed merge conflict for no functional gain. City
promotion is left to the merge workbook, which already has to take the union for RF-001/RF-002.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| adapters discover a peer on one LAN without manual IP entry | `an adapter discovers a peer on the LAN without manual address entry` (mDNS and broadcast adapters both produce the same candidate) |
| wired and Wi-Fi candidates normalize to the same device/pairing abstraction | `wired and Wi-Fi sightings normalize to the same device abstraction` |
| stale or duplicate advertisements do not create duplicate logical devices | `duplicate and stale advertisements never create duplicate logical devices` |
| untrusted discovery candidates cannot invoke capabilities | `an untrusted candidate cannot invoke anything` |
| trusted nodes upgrade to authenticated encrypted direct local transport | `only a trusted node with the right fingerprint upgrades to an encrypted direct path` |
| a local network change triggers rediscovery without changing logical identity | `a local network change re-resolves addresses without changing logical identity` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Where the module lives.** See §1: contract module rather than a third City module, to avoid a
third conflicting edit to shared City files. Recorded because it differs from both sibling RF branches.

**D2 — What identifies a candidate?** Options: (a) address; (b) address + interface; (c) the
cryptographic `device_id`. CHOICE: (c), with an address-keyed fallback *only* for unidentified
sightings, which stay non-pairable. Reason: invariant 2 — logical identity is cryptographic, never
network-derived. Keying by address would make a DHCP change create a new logical device, which is
exactly the duplicate-device failure the acceptance line forbids.

**D3 — How duplicates and wired+Wi-Fi sightings are reconciled.** CHOICE: one pass over the
advertisements merges sightings of the same `device_id` into a single candidate with a union of
addresses, interfaces and sources (source order is the declared preference: mDNS before broadcast
before multicast before direct), counting sightings and recording each merge as a duplicate. Reason:
merging is what makes "wired and Wi-Fi normalize to the same abstraction" and "duplicate advertisements
do not create duplicate devices" true at the same time, rather than two separate cleanups.

**D4 — Unidentified sightings.** CHOICE: kept as `identified: false` candidates that can be shown to a
human, but `resolveToPairing` returns `DEVICE_ID_REQUIRED` and `assertMayInvoke` throws. Reason: a
neighbour that has not told us its identity is still useful in a pairing UI; treating it as an
anonymous device would invite exactly the "same-LAN means trusted" mistake the workbook forbids.

**D5 — Where trust enters.** CHOICE: `resolveToPairing` returns an entry point (`DISCOVERY_LAN`, or
`DIRECT_ADDRESS` when the caller prefers a known address) plus `is_trust: false`, and the only path to
invocation is `assertMayInvoke` with a `TRUSTED` record whose `device_id` matches the candidate. Reason:
invariant 1 — many join methods, one trust protocol. The candidate never carries trust, and a spoofed
display name or MAC is never consulted (`mac_evidence_is_authority: false` is stamped on every
candidate).

**D6 — Direct path upgrade.** CHOICE: requires both a `TRUSTED` record and a matching `sha256:`
fingerprint, and returns `authenticated: true, encrypted: true` with quality metadata (interface kinds,
address count, best source) for the future path manager. Reason: the workbook asks for an
*authenticated encrypted* path after trust validation, and the path manager (RF-006) needs the metadata
without owning the decision.

**D7 — Bounded traffic.** CHOICE: the adapter contract states `bounded: true`, a round emits at most
256 advertisements with `truncated: true` when it clipped, and `planDirectScan` caps targets at 64 and
refuses a request for more (`UNBOUNDED_SCAN_REFUSED`). Reason: "bound discovery traffic and avoid
unbounded network scanning" — a scan plan that can be asked to sweep a /16 is an unbounded scanner with
extra steps.

**D8 — Network change.** CHOICE: a change invalidates *addresses*, never identity: retained identities
are preserved, an unreachable candidate keeps its `device_id` with an empty address list, a fresh
sighting for the same device supersedes its addresses, and `rediscovery_required` is flagged. Reason:
the acceptance line is "without changing logical identity". (My first implementation *dropped* the fresh
sighting as a duplicate of the retained entry; the test caught it and the merge was fixed — a
development defect found by the suite, not worked around.)

**D9 — No `schema.json`.** Runtime/discovery semantics validated in code, consistent with the other
programme branches.

## 3. Test summary

8 tests, all passing: adapter discovery with two sources producing one candidate and an unknown source
refused; wired+Wi-Fi merge (addresses, interface kinds, sources, sighting count, duplicate record) with
direct-preference changing only the entry point; duplicates and staleness (three sightings → one
candidate, same display name → two devices, unidentified → non-pairable, stale flag and prune by
`device_id`); the invocation gate (no trust, quarantined trust, wrong-device trust, spoofed name/MAC);
direct-path upgrade (untrusted, wrong fingerprint, malformed fingerprint, success with quality
metadata); network change (identity preserved, addresses dropped, rediscovery flagged, fresh sighting
supersedes, malformed interface refused); bounded traffic (64-target cap with refusal count, unbounded
request refused, 256-advertisement round cap with `truncated`); advertisement strictness (source,
instant, address array, interface shape, device id, unknown field, require-device-id option).

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 109 tests, 109 pass, 0 fail (101 baseline + 8 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36724660725 on f0d8f59796a3d152a61f104682d3d86c2ca023c2 | success |

## 5. Integration seams handed to sibling tasks

- RF-002 (pairing/trust): `resolveToPairing` produces `{entry_point: 'DISCOVERY_LAN' | 'DIRECT_ADDRESS',
  device_id, addresses}` — exactly the entry point `startSession` records. This module never creates a
  session and never mints trust.
- RF-001 (device identity): `device_id` is consumed as data and validated against the RF `dev-<32 hex>`
  shape; this module mints no identity and holds no key material.
- RF-004 (Bluetooth bootstrap) / RF-005 (remote invite): the same adapter port shape should carry their
  candidates, so all join methods converge on one candidate abstraction.
- RF-006 (path manager): `upgradeToDirectPath(...).quality` is the metadata to consume; the path decision
  belongs to RF-006.
- RF-009 (presence/reconnect): staleness here is advertisement freshness, not presence; presence must not
  be inferred from a live advertisement alone.
- EM-006/EM-007 and GAI-007: local reachability offered by this module is not permission and not
  placement; those programmes still resolve capability and policy.
- Merge workbook: (a) decide whether the local-discovery contract is promoted into the City building
  alongside RF-001/RF-002 (D1); (b) RF-001 and RF-002 already conflict on the manifest, census fixture
  and both architecture docs.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to make one device appear as two (differing interface lists, mixed
   case addresses, a sighting with an installation_ref but no device id), to make an untrusted candidate
   invoke through the direct path, and to defeat the traffic caps with many rounds.
2. Confirm D1 (contract module rather than City promotion) and whether the merge workbook should promote
   it.
3. Confirm D3's source preference order (mDNS, broadcast, multicast, direct) as the merge key when two
   sources disagree about a device.
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
