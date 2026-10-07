# RF-004 Correction Report — Bluetooth Bootstrap + IP Handoff

```text
MISSION              = RF-004 (Remote Fabric programme, task 4 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-004-bluetooth-bootstrap-ip-handoff.md
CLAIM_COMMIT         = 7f04b5e (Digital-City main, claim of RF-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T16:12:44Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 3bcd4957f340441d15d0f780e980c6c56a0c6aa0
DEVELOPMENT_CI       = 36731611702-success
CORRECTION_BRANCH    = remote/RF-004-bluetooth-bootstrap-ip-handoff
CORRECTION_HEAD_SHA  = 1bd7b13fc06c61d007c8fc6a1af7f9b5d8ec3514
BRANCH_CI            = 36743616282 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = RF-004 9 pass, root 110 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 3bcd495, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews against a byte-verified immutable export taken before the review began
(`frozen-3bcd495`, three files `match=True`). Tenth use of this isolation. Repair was verified by
replaying the original reproductions against the repaired module and by paired regression tests.

## 2. Confirmed defects and repairs

Eleven confirmed by the reviewer, seven by this host independently; ten distinct mechanisms. The
author's suite passes **5/5 throughout — every defect is in a path its tests never enter.**

| id | severity | mechanism | repair |
| --- | --- | --- | --- |
| C1 | **critical** | replay protection keyed a `Set` on object identity and never required a text nonce, so one advertisement minted many bootstraps and several `IP_DIRECT` handoffs | nonce must be non-empty text before the Set lookup |
| C2 | **high** | the payload's own `expires_at` was never validated: absent, unparseable and future-dated values all skipped the refusal | a real instant, inside a bounded window |
| C3 | **high** | an unreadable clock skipped the expiry check entirely (the default clock returns `null`) | an unreadable clock is a typed refusal, not a bypass |
| C4 | **high** | `handoffToIp` never re-checked the window: a 120 s bootstrap handed off ten years later | the record keeps `expires_at` and the handoff re-checks it, reaching the declared `EXPIRED` state |
| C5 | medium | `ip_candidates` was unvalidated on the receive path: 5 000 entries accepted, and a *string* was spread into characters so `'a'` became an authenticated address | array, cap and address shape validated as the create path already did |
| C6 | medium | the payload need not be a bare own-property object, so identity fields could arrive by inheritance | bare-object requirement |
| C7 | medium | unknown fields were admitted silently (`mac`, `ble_name`, `trusted`, `__proto__`, `constructor`) | explicit payload allow-list over `Reflect.ownKeys` |
| C8 | medium | `ttlMs` was bounded on one side only, and `MAX_SAFE_INTEGER` escaped as an untyped `RangeError` | ttl ceiling; the computed instant is built with a typed guard |
| C9 | medium | `isIsoInstant` was shape-only, so an impossible date passed and then crashed at `toISOString()` | calendar round-trip |
| C10 | low | the canonical record never stored the nonce (replay protection was unauditable) and the handoff echoed an unvalidated `at` | nonce retained; handoff clock validated |

The headline defect is C1/C2/C4 together: a bootstrap is supposed to be a short-lived *pointer*, and in
the frozen revision the window was caller-controlled, unvalidated, skipped whenever the clock could not
be read, and never consulted again at the handoff. One advertisement with no `expires_at` (or a
far-future one) produced a permanently valid basis for an authenticated, encrypted IP path.

## 3. Reviewer claims reconciled

- The reviewer's **D1** (getter-nonce replay) is closed by C1: requiring nonce text rejects a
  getter-returning-object before the Set is consulted.
- Its **D9** (nonce not retained), **D6** (bare object), **D7** (candidates), **D8** (unknown fields) map
  to C10, C6, C5, C7.
- **D10** (the transport double retains `advertisements` by reference) is repaired as part of C10's
  commit: the double copies its script on construction. Its other half — a mutable `__scans`
  inspection array — is recorded below.
- **D11** (a per-instance counter means two instances mint the same `bootstrap-1`) is recorded as a
  boundary: the record lives in the instance and unknown refs are refused, so a ref is instance-scoped
  by construction. Worth knowing at integration, not a single-instance defect.
- The reviewer's own negative results are recorded: **mutation-before-refusal does not occur here**
  (every refusal precedes the nonce write and the record write, and a refused receive does not advance
  the counter), and the `RangeError` occurs only in `createBootstrapPayload`, not on `receive`.

## 4. Deliberate non-fixes and boundaries

1. **`__scans` remains a live, caller-mutable array on the transport double.** It is a test-inspection
   affordance and the author's suite reads it; freezing it is a double-shape change with no acceptance
   value. Recorded.
2. **`MAX_BOOTSTRAP_TTL_MS` (10 minutes) is a choice.** The workbook states no ceiling and the author's
   default is 120 s; the value is exported so it can be ruled on.
3. **`bootstrap_ref` remains an instance-scoped counter.** The stated guarantee is determinism within an
   instance, which holds; content-binding the ref would change the public shape.
4. **No Android device observation and no Computer-Use session** — a pure module with no device surface.

## 5. Tests and CI

Author suite **5/5 pass unchanged**. Suite extended **5 → 9 tests**, every negative assertion paired with
a legitimate neighbour (a far-future window is refused *and* an in-window one is accepted; an expired
handoff is refused *and* an in-window one still hands off exactly once; a string candidate list is
refused *and* a clean list survives intact).

```text
node --test tests/*.test.mjs                -> 110 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 3bcd495)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

Implementation CI: **36743616282 — gateway-web success, android success** on
`remote/RF-004-bluetooth-bootstrap-ip-handoff` @ `1bd7b13`.

## 6. Unstated decisions (problem / choice / rationale)

1. **What bounds a bootstrap window.** *Choice:* the payload must carry a real instant, and the window
   from `advertised_at` may not exceed ten minutes. *Rationale:* the workbook makes Bluetooth a
   bootstrap *pointer*; an unbounded or absent window makes replay permanent, and the bound is enforced
   without a clock so a pure caller still gets it.
2. **What an unreadable clock means.** *Choice:* a typed refusal. *Rationale:* the frozen revision
   treated "I cannot read the clock" as "not expired", which is the fail-open shape of every one-sided
   bound repaired in this programme.
3. **Whether the window is re-checked at handoff.** *Choice:* yes, and the record keeps `expires_at`.
   *Rationale:* a received bootstrap is a claim about a moment; the handoff is the moment that matters,
   and `EXPIRED` was declared vocabulary that nothing could reach.
4. **How strict the payload is.** *Choice:* an explicit allow-list. *Rationale:* nine sibling contracts
   admitted unknown fields for the same reason (a prototype-chain membership test or no test at all);
   the canonical record should not be the place a transport extension lands.
5. **Whether the nonce belongs on the record.** *Choice:* yes. *Rationale:* replay protection that
   cannot be audited downstream is half a guarantee.

## 7. Honest self-errors

- My first patch script aborted **before writing** because it contained a no-op replacement whose anchor
  text did not match. That was the safe failure: the file was untouched, and the author's suite passing
  5/5 alerted me that no repair had landed. I removed the no-op step and re-ran. Worth recording because
  "tests pass" is exactly what a *failed* patch looks like.
- Two of my probe's own lines were wrong or imprecise: a handoff with an invented candidate was
  mislabelled, and the expired-payload control fired before the string-candidate case. Both were probe
  errors, corrected in the transcript.
- I did not find the reviewer's D1 (getter nonce) or D8 (unknown fields, before my allow-list). D1
  matters: it is the difference between "the nonce is checked" and "the nonce is checkable".

## 8. Result

Ten distinct mechanisms repaired at the mechanism, with paired regression tests and a replay of the
original reproductions. Four boundaries are recorded with reasoning, two reviewer claims are reconciled,
and the author's suite was never weakened.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/remote/RF-004-bluetooth-bootstrap-ip-handoff.md
```
