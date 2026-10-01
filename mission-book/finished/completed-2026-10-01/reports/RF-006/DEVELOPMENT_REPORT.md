# RF-006 Development Report — Secure Transport Path Manager + Relay Fallback

```text
MISSION                  = RF-006 (Remote Fabric programme, task 6 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0b3ba9c (Digital-City main, "claim(RF-006): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:46:20Z
CONTROL_REVISION_AT_CLAIM= d6214ed (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-006-secure-transport-path-manager
IMPLEMENTATION_HEAD_SHA  = 251e20bc3af4a2db57253a1a1e5332c976d17d51
BRANCH_CI                = 36739459945 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-path-manager-v1/` — `path-manager.mjs` (transport adapter port, preference-ordered path
selection, authenticated-encryption gate, relay semantics, migration, idempotent send, bounded metadata),
`index.mjs`, 7-test suite, root `tests/remote-path-manager.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Callers use one Fabric connect/send surface while tests swap transport adapters | `callers use one Fabric surface while the transport implementation is swapped underneath` (identical caller code against a direct-only and a relay-only adapter set; identical descriptor key sets) |
| Path selection prefers usable direct routes and falls back to relay honestly | `path selection prefers a usable direct route and falls back to relay honestly` (preference list asserted; `RELAY_FALLBACK` and `PREFERRED_DIRECT` reasons; full attempt trail) |
| Path loss can migrate/reconnect without creating a new logical device or duplicate command | `path loss migrates without a new logical device or a duplicated command` (`session_ref`/`device_id` unchanged, `logical_device_changed: false`, `commands_replayed: false`, duplicate `command_ref` refused with zero adapter calls) |
| A relay cannot authorize a peer merely because it forwarded traffic | `a relay forwards opaque payloads and can never authorize a peer` (`RELAY_CANNOT_AUTHORIZE`; audit event recorded) |
| Encrypted local and remote sessions reject unauthenticated peers | `an unauthenticated or unencrypted path is never adopted, not even on the LAN` (LAN held to the same requirement; relay not exempt) |
| A test relay can operate on opaque end-to-end-protected payloads | `a relay forwards opaque payloads…` (`relay_mode: OPAQUE_FORWARD`, `relay_plaintext_access: false`, plaintext payload refused with `PAYLOAD_MUST_BE_PROTECTED`) |
| Failover and simultaneous path races do not create two authoritative sessions for one exclusive action | `one exclusive action can never end up with two authoritative sessions` (racing connect reused; conflicting action refused; `authoritative_sessions: 1`) |
| Normalized path/session descriptor; bounded metadata without secrets | `path metadata is bounded, secret-free and frozen` (recursive secret scan empty; `identifies_device: false`) |
| Rendezvous/relay selection separate from pairing authority; relay not a permanent mandated route | tests 2, 4 and 6 (`TRUST_REQUIRED` gate, relay disabled by policy ⇒ honest `NO_USABLE_PATH`) |
| No business-layer dependency on concrete libraries/protocols | `TRANSPORT_ADAPTER_PORT` descriptor; adapters are injected doubles and the module names no protocol (no WebRTC/QUIC/WebSocket/WireGuard string anywhere) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, EM-004, EM-005, EM-008, EM-009, GAI-004, GAI-005, RF-004 and RF-005 Corrections).
Tie-break after GAI-005 excluded General AI, so RF-006 was chosen: RF-005's accepted confirmation explicitly
hands `path_negotiation` to RF-006, and RF-007/008/009/010 all sit on top of the path manager, so it is the
next blocker in the Remote Fabric programme.

**D2 — Where does transport specificity live?** CHOICE: behind an injected `TransportAdapterPort`
(`probe/connect/send/close`) keyed by *transport class*, with callers seeing only a normalized path
descriptor. Reason: the workbook forbids binding the Fabric API to WebRTC/QUIC/WebSocket/WireGuard, and the
first acceptance bullet ("swap transport adapters") is only provable if the caller's code is identical
across implementations — which the test does by running one `sessionFor()` helper against two adapter sets.

**D3 — What makes a path adoptable?** CHOICE: `authenticated === true` **and** `encrypted === true`,
enforced for every class including LAN and including relay, with the specific failure recorded
(`UNAUTHENTICATED_PATH_REFUSED` / `PLAINTEXT_PATH_REFUSED`) and selection continuing to the next candidate.
Reason: the workbook's out-of-scope list says "trusting LAN plaintext", and the acceptance bullet says
encrypted local *and* remote sessions reject unauthenticated peers. Holding LAN to the same rule is the
whole point — a nearby unauthenticated neighbour must not be more trusted than a remote one.

**D4 — Is relay a fallback or a route?** CHOICE: strict preference `LAN_DIRECT → INTERNET_DIRECT →
NAT_TRAVERSAL → RELAY`; relay is used only when no direct class is usable and can be disabled entirely by
policy. Reason: the workbook forbids making relay the permanent mandatory route. The preference list is part
of the contract and is asserted, so a future implementation cannot quietly reorder it.

**D5 — What can a relay do?** CHOICE: forward opaque end-to-end protected payloads only — mode is
`OPAQUE_FORWARD`, every path descriptor reports `relay_plaintext_access: false`, a `plaintext`/unprotected
envelope is refused before any adapter call, and a relay that reports `peer_authorized` or
`plaintext_access` is refused outright (`RELAY_CANNOT_AUTHORIZE`). Reason: RF invariant 10 says a relay must
not become the semantic owner of user data or commands; the dangerous direction is a relay *asserting*
authority, so that assertion is treated as a protocol violation rather than a hint.

**D6 — What is a session, and what is a path?** CHOICE: the session is logical and owns identity
(`session_ref`, `device_id`, `installation_id`, `exclusive_action_key`); the path is replaceable. Migration
replaces only the path, and the result states `logical_device_changed: false`, `path_derived_identity: false`
and `commands_replayed: false`. Reason: RF invariant 2 (identity is cryptographic, not network-derived) —
a new IP must never look like a new device.

**D7 — How are races resolved?** CHOICE: one authoritative session per peer. A second `connect` for the same
`exclusive_action_key` is idempotent (`reused: true`, `REUSED_SESSION`); a different exclusive action for the
same device is refused `SESSION_ALREADY_ACTIVE` while naming the live session; and every session descriptor
reports `authoritative_sessions: 1`. Reason: the acceptance bullet requires that failover/races cannot
produce two authoritative sessions for one exclusive action; returning the existing session is the honest
answer to a retry, while refusing a competing action is the honest answer to a conflict.

**D8 — Duplicate commands across failover.** CHOICE: `send` keeps a per-session log of
(`command_ref`, `action_key`); a repeat returns `sent: false, duplicate: true, adapter_called: false`
instead of resending. Reason: the workbook requires stable correlation ids and idempotent externally visible
retries; after a migration the caller's retry must not duplicate the side effect, and the test asserts the
new path's adapter was never called for the duplicate.

**D9 — Quality is not permission.** CHOICE: path metadata reports transport class, direct/relay, latency and
quality, alongside explicit `path_quality_grants_permission: false` and `permission_granted: false`; the
metadata carries no key material and `identifies_device: false`. Reason: the workbook names "using path
quality as permission" as out of scope and asks for bounded metadata for scheduling/UI, so the negative is
published as data rather than left to a reader's assumption.

**D10 — Trust gate.** CHOICE: `connect` requires a peer whose RF-002 trust state is `TRUSTED`
(`TRUST_REQUIRED` otherwise); a healthy path never implies trust. Reason: RF invariant 1 (all join methods
converge on one trust protocol) and the workbook's requirement that rendezvous/relay selection stay separate
from pairing authority. Path availability is not permission and not trust.

**D11 — Failure of the last path.** CHOICE: `migrate` throws a typed `NO_USABLE_PATH` carrying
`degraded: true`, `connected: false` and the attempt trail, and `onPathLost` reports
`alternative_available` honestly. Reason: RF invariant 9 — offline/unavailable must not be collapsed into a
success-looking state; the test asserts the manager never claims to be connected when nothing is usable.

**D12 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/remote-path-manager-v1/path-manager.mjs` | new — adapter port, selection, migration, send, metadata |
| `contracts/remote-path-manager-v1/index.mjs` | new — public surface |
| `contracts/remote-path-manager-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/remote-path-manager.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Two failures on first run: one genuine module defect and one test-construction mistake.

1. **Defect:** `sessions()` introspection used `structuredClone` over internal records that hold the adapter
   object, so it threw `DataCloneError` when an adapter had functions (every real adapter does). Fixed by
   projecting sessions to descriptors that omit the adapter — a caller should never receive a transport
   implementation from an introspection API anyway, so this was a leak as well as a crash.
2. **Test mistake:** the "unauthenticated path is never adopted" case built a manager whose
   `NAT_TRAVERSAL` and `RELAY` adapters were still honest defaults, so the manager correctly skipped the two
   dishonest paths and adopted an honest one — no refusal, and the assertion failed. Fixed the test to make
   the other classes unavailable, plus a second mistake where the relay assertion indexed the LAN attempt
   rather than the relay attempt. In both cases the module was right: skip the dishonest path, adopt the
   honest one.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36739459945 on 251e20bc3af4a2db57253a1a1e5332c976d17d51 | success |

## 6. Integration seams handed to sibling tasks

- **RF-002 (pairing/trust):** `connect` requires `trust_state: 'TRUSTED'`; this module never establishes
  trust and never authorizes a peer. A path exists only after RF-002 has decided.
- **RF-005 (invite rendezvous):** the accepted confirmation hands off with `path_negotiation: 'RF-006'`;
  `connect` is that entry point, and the rendezvous service stays out of the data path.
- **RF-001 (identity):** `device_id`/`installation_id` are carried through migration unchanged and are never
  derived from a path; `path_derived_identity: false` is asserted.
- **RF-007/RF-008 (capability registry, RPC/EVENT/STREAM):** `send` is the single command surface with a
  stable correlation id and an action key; RF-008 should build command/stream semantics on it rather than
  adding a second transport call path.
- **RF-009 (presence/offline/reconnect):** `onPathLost` reports loss without deciding presence; RF-009 should
  treat `alternative_available` as reachability input, not as trust or permission.
- **RF-010 (fabric policy boundary):** preference order, relay permission and the authentication requirement
  are deployment policy (`policy.preference`, `policy.allow_relay`,
  `policy.require_authenticated_encryption`) published through `policy()`.
- **EM-007 / EM-009:** a remote worker's reconnect must not be modelled as a local process restart, and an
  EM restart must not open a second Fabric session; both should call `connect`/`migrate` here instead.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: an adapter that reports `authenticated: true` but returns a path that
   later turns out to be a relay; two concurrent `migrate` calls for one session (the module has no async
   interleaving, so a synchronous double cannot express the race — an interleaved caller may need a
   migration epoch); a relay that flips `peer_authorized` only on the second connect; and a duplicate
   `command_ref` carrying a different `action_key`.
2. Confirm D7 (a racing connect for the same action key is reused; a different action is refused) and D8
   (duplicate suppression keyed on `command_ref` + `action_key`) as the intended readings.
3. Confirm whether a real migration needs a monotonic epoch/lease comparable to EM-009's lease epoch, which
   this module deliberately does not have because it holds no side-effect authority itself.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
