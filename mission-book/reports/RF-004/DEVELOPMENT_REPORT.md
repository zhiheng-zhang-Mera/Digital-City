# RF-004 Development Report — Bluetooth Bootstrap + IP Handoff

```text
MISSION                  = RF-004 (Remote Fabric programme, task 4 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = e23787f (Digital-City main, "claim(RF-004): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:43:09Z
CONTROL_REVISION_AT_CLAIM= 25e4e48 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-004-bluetooth-bootstrap-ip-handoff
IMPLEMENTATION_HEAD_SHA  = 3bcd4957f340441d15d0f780e980c6c56a0c6aa0
BRANCH_CI                = 36731611702 — success
LOCAL_CHECK_SUMMARY      = 106/106 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-bluetooth-bootstrap-v1/` — `bootstrap.mjs` (BLE transport port + double, bootstrap payload,
receive/handoff/scan, published limits), `index.mjs`, 5-test suite, root
`tests/remote-bluetooth-bootstrap.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Bluetooth is a bootstrap entry point converging on the one trust protocol | `a bootstrap payload is a pointer to the pairing path, never trust` (`entry_point: 'DISCOVERY_BLUETOOTH'`, `converges_on_pairing: true`) |
| carrying a payload grants no trust | same test — a payload claiming trust is refused (`BLUETOOTH_IS_NOT_TRUST`), plus `grants_trust: false` on every payload and return |
| a MAC address is never authority | `a MAC address is never consulted for a decision` (a MAC-shaped device id is refused; identity is cryptographic only) |
| the IP handoff re-verifies identity on the new path | `the IP handoff requires trust and re-verifies the fingerprint on the new path` |
| observed advertisements cannot be replayed | `an expired or replayed bootstrap is refused without partial state` |
| bounded bootstrap traffic | `scanning is bounded and payloads are strict` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Scan: no owned repair, and no eligible Correction for Mech — the only
Alien-developed task (EM-003) is already being corrected by Alien. So the development tier applied, and
RF-004 was chosen because Remote Fabric is the substrate the other programmes' cross-device gates depend
on (the same critical-path reasoning recorded for RF-003 and RF-001).

**D2 — What does Bluetooth actually carry?** OPTIONS: (a) a trust assertion; (b) a full credential
exchange; (c) a small invitation *pointer*. CHOICE: (c) — device id, fingerprint reference, single-use
nonce, up to eight IP candidates, TTL — and the receive path returns the entry point the one pairing
protocol expects rather than any trust state. Reason: invariant 1 ("many join methods, one trust
protocol") and invariant 3 (MAC is optional local evidence only). A payload that *claims* trust is refused
outright rather than sanitised, because a caller acting on `grants_trust: true` would be acting on the
radio rather than on the pairing path.

**D3 — When is the identity actually verified?** CHOICE: at the IP handoff, which requires an established
`TRUSTED` record for the device **and** the matching fingerprint presented over the new path, and returns
`verified_over_new_path: true` with `bluetooth_carried_trust: false`. Reason: the bootstrap path may be
brief, weak and observable, so the identity check must happen where the work will actually run. A
fingerprint mismatch on the new path (`FINGERPRINT_MISMATCH`) is the exact failure the invariant is
guarding against.

**D4 — Replay.** CHOICE: the nonce is single-use per bootstrap authority, so the same advertisement
observed twice is refused (`BOOTSTRAP_REPLAYED`) while a different nonce is a different invitation.
Reason: BLE advertisements are observable; without a single-use nonce an attacker could relay a captured
invitation. The payload TTL is evaluated on receipt, and an expired bootstrap returns no entry point at
all (no partial state).

**D5 — Bounded traffic.** CHOICE: bounded scan rounds (`MAX_SCAN_ROUNDS = 16`), bounded IP candidates
(`MAX_IP_CANDIDATES = 8`) and a bounded payload; an unbounded request is refused
(`UNBOUNDED_SCAN_REFUSED`) at both the bridge and the adapter. Reason: the workbook requires bounded
discovery traffic in RF-003's terms, and a radio sweep is the most tempting place to leave it unbounded.

**D6 — Where the code lives.** CHOICE: `contracts/remote-bluetooth-bootstrap-v1/` — a contract module, the
same choice recorded as RF-003 D1, keeping the City manifest/census/doc edits to the two sibling branches
that already made them.

**D7 — No `schema.json`.** Consistent with the other component branches.

## 3. Test summary

5 tests, all passing: bootstrap-as-pointer with the trust-claim refusal and the transport port's flags;
MAC-never-authority with MAC-shaped and malformed identity refusals; expiry and single-use-nonce replay
with a fresh-nonce acceptance; the handoff path (untrusted, quarantined, wrong-device, wrong-fingerprint on
either side, unadvertised address, duplicate handoff, and the successful verified handoff); and bounded
scanning with payload strictness (candidate count, address shape, empty nonce, malformed instant, missing
adapter, unknown bootstrap reference).

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 106 tests, 106 pass, 0 fail (101 baseline + 5 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36731611702 on 3bcd4957f340441d15d0f780e980c6c56a0c6aa0 | success |

## 5. Integration seams handed to sibling tasks

- RF-002 (pairing/trust): the received bootstrap yields exactly the entry point `startSession` records
  (`DISCOVERY_BLUETOOTH`) plus the fingerprint it must bind; this module creates no session and no trust.
- RF-003 (local discovery): both produce candidates for the same pairing path; at merge the two candidate
  shapes should be one abstraction so a Bluetooth sighting and a LAN sighting of one device converge.
- RF-001 (device identity): `device_id` is consumed as data and validated as `dev-<32 hex>`; no identity is
  minted here.
- RF-006 (path manager): the handoff result (`path: 'IP_DIRECT'`, authenticated, encrypted) is the input;
  address selection and fallback belong to RF-006.
- RF-009 (presence): a handoff is not presence; the receiving side must still revalidate before side
  effects.
- Platform adapters (Windows/Android): a real BLE adapter implements the three-method port; nothing above
  it changes.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to reuse a bootstrap after its handoff, to reach a handoff with a trust
   record for another installation of the same device, and to defeat the scan bounds through repeated
   single-round calls.
2. Confirm D3 (verification at handoff rather than at bootstrap) as the intended protocol shape.
3. Confirm whether an IP candidate should be re-verified per address or once per device.
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
