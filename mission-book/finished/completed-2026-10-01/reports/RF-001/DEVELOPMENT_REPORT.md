RF-001 — Node Identity + Installation Lifecycle
PROGRAMME = REMOTE_FABRIC_ENGINEERING (Remote Fabric, task 1 of 10)
DEVELOPMENT_HOST = Alien
CONTROL_BOOK = Digital-City/mission-book/remote/RF-001-node-identity-installation-lifecycle.md
CROSS_PROGRAMME_CONTRACT = Digital-City/mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
CLAIM_COMMIT = 7e1a49984e14d9abcedcb401378af0235a10fbe2 (Digital-City main, "claim(RF-001): Alien claims Development stage")
COMPONENT_BASELINE = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c (Utopia main; all four programme pools share it)
IMPLEMENTATION_REPO = zhiheng-zhang-Mera/Utopia
IMPLEMENTATION_BRANCH = remote/RF-001-node-identity-installation-lifecycle
HEAD_SHA = b1ee127bb7ba292bda7b817dd4910b4498f446c1
BRANCH_CI = see BRANCH_CI below
ARCHITECTURE_CONTRACT = REMOTE_FABRIC_V1

This report has no template in `mission-book/reports/README.md`; the record
`mission-book/reports/README.md` covers ASSESSMENT/MIGRATION/VERIFICATION only. The format
used here is modelled on MIGRATION_REPORT.md and is a recorded decision (D6).

================================================================================
LANDING_BOUNDARY
================================================================================

New module, new building:

  city/00-foundation/02-city-node-network/device-identity/
    contracts.mjs                     versioned document contract, validation, canonical form
    identity.mjs                      lifecycle, clone detection, legacy migration
    index.mjs                         public surface
    PROVENANCE.json                   programme-task provenance (no donor)
    tests/device-identity.test.mjs    65 tests

Changed shared files (minimal, each justified):

  city/CITY_IMPLEMENTATION_MANIFEST.json   declares building 02-city-node-network + module
                                           device-identity; description updated from two to
                                           three incubation identities
  city/tests/manifest.test.mjs             census entry + separate provenance proofs for a
                                           migration (DONOR.json) and a programme task
                                           (PROVENANCE.json)
  city/docs/en/ARCHITECTURE.md             third incubation identity, RF-001 section, tree
  city/docs/zh-CN/ARCHITECTURE.md          same, mirrored
  tests/capability-registry.test.mjs       replaced a brittle absolute census count (D7)

Not touched: apps/web/**, apps/android/**, services/**, agents/**, contracts/**,
platform/**. No runtime behaviour changes. No branch merged to Utopia main.

================================================================================
PRESERVED_BEHAVIOR / WHAT WAS BUILT
================================================================================

The mandatory Remote Fabric project invariants this task is bound by, and where each is
implemented:

| Invariant | Implementation |
|---|---|
| 2. Logical identity is cryptographic, not network-derived | `deviceId` + `keys[]` + `activeKeyId` are the only authority fields (`DEVICE_IDENTITY_AUTHORITY_FIELDS`); IP/hostname/OS/model/MAC live in `metadata`, marked `METADATA_AUTHORITY = 'NOT_AUTHORITY'` |
| 3. MAC is optional local pairing evidence only | `normalizeMac`, `isLocallyAdministeredMac`, `macPairingEvidence` (`canBlockPairing` always false), `trustFromMacEvidence` (always refuses) |
| 8. Session is not task authority | module owns no task, no presence, no reachability, no permission |
| 9. Offline/reconnect is honest | module holds no session state at all; refusal codes are distinct and never collapsed |
| 11. Permission remains intersectional | module never grants permission; it only decides document validity and lifecycle meaning |

Lifecycle implemented: first-install enrollment (bound and unbound), rename, network
metadata recording, key rotation and revocation with exactly one active key, device and
installation retirement, explicit rebind with proof, reinstall that mints a new
`installationId`/`instanceId`/credential without inheriting the logical device,
credential-clone detection at single-record and population level, quarantine, and a
legacy-record migration hook.

================================================================================
REQUIRED_ACCEPTANCE_COVERAGE
================================================================================

Every "Required acceptance" line of the workbook maps to named tests:

| Required acceptance | Tests |
|---|---|
| IP/network changes do not change `device_id` | `an IP or hostname change does not change device_id`; `metadata is declared non-authoritative and device_id is not derived from it`; `a device with no network observation at all is valid` |
| rename changes display metadata without changing authority | `rename changes display metadata without changing authority`; `rename does not mutate the document it was given`; `two devices may share a display name: a name is never an identity`; `an empty or non-string rename is refused` |
| reinstall creates a new `installation_id` and requires explicit rebind/enrollment | `a reinstall mints a new installation_id and does not inherit the logical device`; `an unbound reinstalled installation can do nothing until it is explicitly rebound`; `rebinding requires explicit proof and refuses to invent it`; `an explicit rebind binds the reinstalled installation to the surviving logical device`; `a reinstall must actually mint new identities`; `enrollment refuses to create a bound installation without a device` |
| simulated credential clone is detected/rejected/quarantined | `a credential presented from a different physical instance is detected as a clone`; `quarantining a cloned installation is terminal and cannot be undone by the clone`; `a population scan finds two records sharing one installation identity under two instances`; `a population scan finds one installation identity carrying two credential fingerprints` |
| missing/randomized MAC does not block valid pairing paths | `a missing MAC does not block a valid pairing path`; `a randomised MAC does not block a valid pairing path`; `MAC randomisation is recognised from the locally-administered bit, not from a guess`; `MAC formatting, case and separators are normalised and never rejected`; `multiple NICs are all representable and none of them is privileged` |
| spoofed MAC alone cannot impersonate a trusted node | `spoofed MAC evidence alone cannot impersonate a trusted node`; `MAC never enters an authority-bearing field of a device document` |
| schema/version tests cover upgrade and malformed identity records | `a wrong schema version is refused by both validators`; `malformed device records are refused with a specific code` (24 cases); `malformed installation records are refused with a specific code` (16 cases); `a v1 document migrates to itself`; `a live gateway node row upgrades to a v1 device identity`; `an unknown future schema version is refused rather than guessed at` |

Negative/refusal coverage is first-class, not incidental: 24 malformed device cases and 16
malformed installation cases each assert a specific refusal code drawn from
`IDENTITY_REJECTION_CODES`, and `assert*` helpers are shown to carry the code.

Security coverage beyond the workbook list:
- `a credential secret never appears in a serialised installation document` (and the
  runtime helper `credentialLeakScan` makes it checkable, not just testable);
- `credential fingerprints are reproducible and secret-specific`;
- a rotated key is retained as history but immediately stops being authority;
- revoking the active key is refused rather than silently promoting another;
- a quarantined installation is refused for **every** presenter, so a clone cannot clear
  its own flag.

Purity: the module contains no `Date.now()`, `Math.random()`, `process.env`, filesystem or
socket access. Instants are `nowMs` parameters and entropy is an explicit 16-byte
`Uint8Array`; `randomEntropy()` is the single, isolated place real randomness is taken.
That is what makes the acceptance claims reproducible rather than timing-dependent.

================================================================================
EXPLICITLY_NOT_IMPLEMENTED
================================================================================

Recorded boundaries, not hidden gaps. Each is deferred to the Remote merge workbook per
CROSS_PROGRAMME_EXECUTION_CONTRACT.md section 5 ("Deferral is not success. Reports must
identify the exact pending seam.").

1. **No product/service consumer.** The natural seam is `services/dev-gateway` node
   registration, which today stores
   `{id, devicePrincipalId, displayName, metadata.platform, agentVersion, capabilities,
   online, lastHeartbeatAt}` with `devicePrincipalId === id`, no key material, no
   separation of logical device from installation and no clone detection. The workbook
   does not require consumption wiring, and section 5 freezes `services/**` unless the
   mission-book requires it, so this branch changes no runtime behaviour.
   `migrateDeviceIdentity` accepts exactly that row shape, so the upgrade path is real and
   tested rather than merely described.
2. **A legacy gateway row has no key material.** The migration therefore derives a
   placeholder key reference named `legacy-gateway` from the record itself. It does not
   claim the device holds a key it was never issued. A real enrollment must rotate it.
3. **No transport, discovery, Bluetooth, rendezvous, pairing UI or transport encryption.**
   Those are RF-002..RF-006. This module supplies the identity they converge on, and no
   transport.
4. **No presence, reachability or policy decision.** RF-009/RF-010 and shared Core own
   those. Presence or a valid session must never become permission; nothing here could
   express that even by accident.
5. **No evolution-feed event was recorded for RF-001.** See D8.

================================================================================
DECISIONS_NOT_SPECIFIED_BY_THE_BOOK
================================================================================

The workbook fixes the scope and the acceptance but leaves several structural choices
open. Each is recorded as problem -> choice -> rejected alternatives -> why.

--- D1. Where does a Remote Fabric module live in the City tree? ---
PROBLEM: The workbook names no `city/` path, and `city/CITY_IMPLEMENTATION_MANIFEST.json`
has no Remote Fabric or node-fabric building.
CHOICE: `city/00-foundation/02-city-node-network/device-identity`, declaring a new building
`02-city-node-network`.
WHY: The published City map already reserves exactly this building —
`00-城市地基/02-城市节点网(City-Node-Network)-&-设备节点互联层(Device-Node-Fabric)` — whose
`README.md` declares ownership of "node/device principal identity below Owner/Root
authority". The building number 02 was free between the existing `01-city-core` and
`03-capability-fabric`, matching the map's own numbering.
REJECTED: (a) `08-device-edge` — the map draws that district's boundary explicitly as
"which physical sensor/actuator capability exists", while device *identity* is Node Fabric;
(b) a new top-level district — would contradict the published map, which already assigns
node identity to 00-foundation.

--- D2. How is a non-migration mission-book module registered, honestly? ---
PROBLEM: `city/tests/manifest.test.mjs` recognised exactly two incubation identities: a
Room Pack room, and a mission-book migration `mb-<MB-ID>-<module>-lab` requiring a matching
`DONOR.json`. RF-001 is neither — no Room ever ran, and it is not a migration — so no
existing label is true.
CHOICE: Add an explicitly named third identity, the mission-book **programme-task**
incubator: room `mb-rf-001-device-identity-lab`, a `mission` block, and a
`PROVENANCE.json` with `donor: null`. The manifest validator/test recognition was widened
from MB-only to every mission-book task id (MB/BA/RF/GAI/EM), and the census test now proves
a migration's `DONOR.json` and a programme task's `PROVENANCE.json` in two separate checks.
WHY: The architecture doc already refuses to let a mission migration be written as a Room
Pack promotion, because "no room ever ran". RF-001 is in exactly that position but is not a
migration either. Writing it as a Room Pack room would require inventing an
`apps/rooms/promotions/<room>.json` record for a room that never existed; writing it as
`mb-001-...` would be a lie about which task produced it. A third named identity is the only
honest option, and it is structural for the remaining 40 tasks, 39 of which are also
programme tasks.
REJECTED: (a) Room Pack room with a fabricated promotion record — false provenance;
(b) omit manifest registration — contradicts the manifest's stated purpose as the record of
what really exists, and every prior mission registered its modules;
(c) reuse `MB-` with a fake mission id — false provenance of a different kind.

--- D3. Does the module advertise a capability? ---
PROBLEM: The manifest has a `capabilityProvider` flag, and the capability registry walks
implemented modules.
CHOICE: No capability. The module is not listed as a capability provider, and because
`00-foundation`/`02-city-node-network` is infrastructure, the registry skips it.
WHY: Identity infrastructure exposes no user-facing capability. The MB-003 precedent is
explicit that without this, Web and Android capability lists would advertise a
"BRIDGE_PENDING" capability for a product surface that does not exist. The existing test
`infrastructure modules are never advertised as capabilities` now covers this building too.

--- D4. What does "cloned credential" mean concretely? ---
PROBLEM: The workbook requires that two physical installations must not silently share one
active installation identity, but does not define the observable signal.
CHOICE: An installation document carries `installationId` (the identity) **and**
`instanceId` (the physical instance it was enrolled from) plus a credential fingerprint.
`resolveInstallationPresentation` classifies a presentation, and the same
`installationId` presenting a *different* `instanceId` is `CLONE_DETECTED`. A second,
population-level scan (`detectCredentialClones`) catches two records claiming one
installation identity.
WHY: A legitimate reinstall mints a new `installationId` (that is the workbook's own rule),
so a second `instanceId` under the *same* `installationId` cannot be legitimate. Ordering
matters and is documented in the ladder: clone detection runs before the unbound check so a
cloned credential is detectable even while unbound, and a credential *mismatch* is reported
separately from a credential *duplication* because they are different facts.
REJECTED: (a) treat any second presentation as a clone — would refuse normal reconnects;
(b) rely only on the population scan — would miss a clone before its record exists.

--- D5. How is MAC randomisation detected, without a guess? ---
PROBLEM: "Wi-Fi MAC randomization" must not block pairing, but sniffing heuristics would be
unfalsifiable.
CHOICE: Use the IEEE 802 locally-administered bit (bit 0x02 of the first octet), reported as
`randomized` and tested against the raw bit arithmetic.
WHY: It is a real, checkable property rather than a heuristic, and it correctly leaves an
*unreadable* MAC reported as `value: null, randomized: false` — "the OS would not tell us"
is not the same fact as "the OS told us it is randomised". Both are non-blocking.

--- D6. No DEVELOPMENT_REPORT template exists. ---
PROBLEM: `mission-book/reports/README.md` defines minimal formats for ASSESSMENT,
MIGRATION and VERIFICATION reports only, but README section 5 requires a
DEVELOPMENT_REPORT and (for the other host) a CORRECTION_REPORT.
CHOICE: Follow the MIGRATION_REPORT structure, adapted for the two-stage programme, and
add the two missing minimal formats to `reports/README.md` so the remaining 40 tasks and
both hosts produce consistent records.
WHY: Forty tasks across two hosts will otherwise invent forty shapes, and the reports exist
precisely so a second host and the Owner can read results quickly.

--- D7. A latent fragile fixture failed for the wrong reason. ---
PROBLEM: `tests/capability-registry.test.mjs` asserted
`assert.equal(kernelBuildings, 2, ...)`. Declaring a new infrastructure building made it
fail with "actual: 3, expected: 2" — a census count, not the rule the test exists to check.
CHOICE: Replace the absolute count with an explicit named list of infrastructure buildings
plus a non-vacuity assertion (`kernelBuildings > 0`), keeping the deliberate-update
property and naming the buildings.
WHY: This is the same class of brittle fixture MB-002 and MB-005 already had to repair in
this repository: a hard-coded census that breaks on any legitimate addition while detecting
nothing the surrounding loop does not already detect. Naming the buildings means a new
kernel building still requires a deliberate edit, but for the right reason.
REJECTED: (a) mark the new building `kind: "domain"` to keep the count at 2 — would be a
false statement about the building to satisfy a test; (b) loosen to `>= 2` — loses the
census entirely.

--- D8. No evolution-feed event for RF-001. ---
PROBLEM: Prior missions recorded bounded cross-host handoff events in
`data-records/evolution/inbox/mission-book/<MISSION_ID>/events.jsonl`.
CHOICE: Do not record events for RF-001.
WHY: `contracts/evolution/mission-event-v1.schema.json` pins
`missionId` to `^MB-[0-9]{3}$`, `eventId` to `^MB-[0-9]{3}:[a-f0-9]{16}$` and `role` to
`MIGRATION|VERIFICATION`, so no RF event validates, and `scripts/record-mission-event.mjs`
rejects it. Extending the schema would change `contracts/**`, which section 5 of the
architecture doc lists as frozen, and would be cross-cutting work outside this bounded task.
The handoff truth for this task therefore lives in this report and in the task workbook
frontmatter. Recorded so the absence is a decision, not an omission.

--- D9. `canonicalJson` is implemented locally rather than imported. ---
PROBLEM: `city/02-engineering/.../restart-protocol/canonical-json.mjs` already implements
the same canonical form, and a sibling module's `DONOR.json` warns that two copies of a
canonicaliser are a correctness hazard.
CHOICE: Implement the same semantics locally in `contracts.mjs`, and say why in its
docblock.
WHY: That warning applies where two processes must agree on one digest. The only reason the
engineering copy is shared is that a restart ticket checksum is recomputed by a *different
process*. No digest produced by this module is ever recomputed there, so importing it would
invert the 00-foundation -> 02-engineering ownership direction (a foundation module
depending on an engineering module) to buy nothing. The module is the only consumer of its
own digests, and the semantics are documented as identical.

--- D10. Placement of the `legacy-gateway` placeholder key. ---
PROBLEM: The live gateway node row has no key material, but a v1 `DeviceIdentity` requires
at least one key reference.
CHOICE: Derive a fingerprint from the record itself, name the key `legacy-gateway`, and
record in `PROVENANCE.json` and this report that it is a placeholder for a key the record
does not have.
REJECTED: (a) omit the key and relax the v1 contract — would make an unauthenticated
record satisfy the same document shape as an authenticated one, destroying the distinction
the module exists to create; (b) invent a random key — a fabricated cryptographic fact.

================================================================================
TEST_SUMMARY
================================================================================

Local checks, host Alien, on the branch head before push (raw log:
`.runtime/evidence/mission-book/RF-001/run-003/local-checks.txt`, Git-ignored):

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 101 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1867 pass / 0 fail |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records all PAIR_STATUS = SYNCHRONIZED |
| `device-identity` module suite (subset of the city run) | 65 pass / 0 fail |

Dependencies were installed in the worktree with the CI's own pinned manager
(`pnpm@11.19.0 install --frozen-lockfile`, then `--dir city`), so the run matches CI's
setup rather than relying on the main checkout's `node_modules`.

FAILURE_REPAIR_SUMMARY:
1. Two module tests failed on first run: one asserted `IdentityLifecycleError` where the
   validator correctly throws the base `DeviceIdentityError`, and one expected the
   `malformed` code for a bad device `state` where `contracts.mjs` returned `metadata`.
   Fixed the assertion to check the code, and corrected the validator to report `malformed`
   for a malformed state — the validator was wrong, not the test.
2. `tests/capability-registry.test.mjs` failed as described in D7 and was repaired there.

BRANCH_CI = GitHub Actions "V0.2 checks" run 36713816317 on
`remote/RF-001-node-identity-installation-lifecycle` @ b1ee127bb7ba292bda7b817dd4910b4498f446c1
— **gateway-web success, android success**. Both required jobs are green.

================================================================================
HANDOFF_TO_CORRECTION
================================================================================

The Correction Host must be a different physical host (Mech). The highest-value areas to
attack on this branch, in the author's own assessment:

1. **The refusal ladder order in `resolveInstallationPresentation`.** The claim that a
   clone is detectable before binding, and that a mismatch is distinguishable from a
   duplication, depends entirely on rung order. Try to construct a presentation that is
   accepted while two physical instances share one installation identity.
2. **`detectCredentialClones` completeness.** It groups by `installationId` only. Consider
   whether a clone that mints a fresh `installationId` but reuses a *credential
   fingerprint* is reachable, and whether that is in scope or a different task's problem.
3. **Key lifecycle vs. retirement.** Try to reach a state with zero or two active keys, or
   a retired device whose key still passes `assertActiveKey`.
4. **The migration placeholder.** Check that `migrateDeviceIdentity` cannot be used to turn
   an unauthenticated legacy row into something that passes a trust check it should not.
5. **The manifest/test provenance change (D2).** Verify that the widened mission-id
   recognition did not weaken the migration rule: a `DONOR.json`-less module must still fail,
   and a programme task must still fail if it declares a donor.
6. **The D7 fixture repair.** Check that `kernelBuildings > 0` plus the named list cannot
   pass vacuously.

DEVELOPMENT_COMPLETE = true (branch CI 36713816317 green on both required jobs)
CORRECTION_ELIGIBLE = true (must be performed by Mech, not Alien)
