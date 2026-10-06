# EM-006 Correction Report — Local-First Sub-worker Placement Gate

```text
MISSION              = EM-006 (Engineering Manager programme, task 6 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-006-local-first-subworker-placement.md
CLAIM_COMMIT         = 749cef6 (Digital-City main, claim of EM-006 Correction by Alien)
CLAIMED_AT           = 2026-09-30T16:26:22Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 2894e8da9d95f54dbb568d8acc510b91bdeae4fb
DEVELOPMENT_CI       = 36727765139-success
CORRECTION_BRANCH    = engineering-manager/EM-006-local-first-subworker-placement
CORRECTION_HEAD_SHA  = 3a3c4a5b1998eeb6b33ab3f7ee7c8d04bfbd8481
BRANCH_CI            = 36745309710 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = EM-006 11 pass, root 112 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 2894e8d, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews against a byte-verified immutable export taken before the review began
(`frozen-2894e8d`, three files `match=True`). Eleventh use of this isolation. Repair was verified by
replaying the original reproductions against the repaired module and by paired regression tests.

## 2. Confirmed defects and repairs

Fourteen confirmed (six by this host independently, fourteen by the reviewer); eleven distinct
mechanisms repaired, three recorded below.

| id | severity | mechanism | repair |
| --- | --- | --- | --- |
| C1 | **high** | the approval gate was a prototype-chain read, so a hand-built `Object.create({requires_user_approval: true})` was approved to `REMOTE_APPROVED` with `local_attempted_first: true` and no evidence | a proposal must be a bare own-property object, carry a justified fallback reason, and record a local attempt |
| C2 | **high** | a measured GPU load was validated and never read: a device with its GPU pinned at 100 % was placed as idle, and the measurement was not even in the evidence | GPU load blocks at 95 % and throttles at 80 %, and appears in the evidence |
| C3 | medium | policy numbers were bounded on one side only: `cpu_block_percent: 1000` disabled CPU blocking entirely and `reduce_concurrency_to: 1000000` handed out the whole pool | per-key ranges, both sides |
| C4 | medium | an over-subscribed worker count (`running 9 / max 2`) produced `LOCAL_THROTTLED concurrency 1` | a self-contradicting measurement is `LOCAL_UNAVAILABLE` |
| C5 | medium | `key in MEASUREMENT_SPEC`, and the nested blocks were not shape-checked at all | own-key membership plus per-block field lists |
| C6 | medium | a proposal could be built from a decision with no evidence (spreading a missing field yielded `{}` while the claim stayed true) | non-empty own evidence with its `observed_at` |
| C7 | medium | a candidate carrying a *different* justified reason was accepted (see §3 — recorded, not repaired) | — |
| C8 | medium | the speed-field scan used `Object.entries`, so a non-enumerable own `speed_rank` passed while the proposal still claimed `ranked_by_speed: false` | own-key-complete, cycle-safe scan |
| C9 | low | `isIsoInstant` was shape-only; an impossible instant was recorded as evidence | calendar round-trip |
| C10 | low | a cyclic candidate threw an untyped `RangeError` | `WeakSet` visited guard |
| C11 | low | `workers.max` had no ceiling (1.797e308 echoed as concurrency) and `free_bytes: 0.5` counted as capacity | integer bounds on both |

### C1 / C2 — the two that carried real consequence

The module's whole purpose is the sentence in its header: *attempt the local host first and never move
work because another device is faster*. The frozen revision let a caller **approve itself** past it —
`approveRemoteFallback` checked only the flag `requires_user_approval`, so a synthesised object became
`REMOTE_APPROVED` with `local_attempted_first: true` and nothing behind it — and simultaneously
**ignored a measurement it had already validated**, so a GPU-saturated machine was treated as idle and
handed the full worker pool. Both are now closed, and the approval path re-checks that the proposal
came from a measured blocking decision after a local attempt.

## 3. Reviewer claims reconciled

- **D2 is recorded as a disagreement, not repaired.** The reviewer holds that a candidate's
  `measured_reason` must equal the decision's reason. The author's suite deliberately pairs a
  `LOCAL_UNAVAILABLE` decision with candidates claiming `LOCAL_BLOCKED`, and the field's meaning is "the
  measured reason that justifies this candidate as a fallback", drawn from the two-element
  `FALLBACK_REASONS` set. I implemented the equality rule, the author's test failed, and I **reverted my
  fix rather than the test**: the test does not encode a defect, and nothing false is being asserted.
  Recorded so the Owner can rule on the stronger reading if it is wanted.
- **D3, D4, D5, D6, D7, D8, D10** map to C6, C6/§4.2, C3, C8/C5, C9, C10, C11.
- The reviewer's own **falsified suspicion** is recorded: it expected `cpu_throttle_percent` to be
  missing from `DEFAULT_POLICY` (making the throttle fail open); it is present, and the
  merge-then-validate also defeats a prototype-inherited policy override. Negative result kept.
- **Its "not exercised" note is accepted and important**: this module is stateless and pure, so
  guarantee 2/3's *state* half (slots, reservations, double-release, races) does not exist to attack
  here. That is a ceiling on what any reviewer can claim about it.

## 4. Deliberate non-fixes and boundaries

1. **Candidate `measured_reason` need not equal the decision reason** (§3).
2. **A proposal can still be approved twice.** Making approval single-use needs durable state the module
   deliberately does not hold (the same reason there is no proposal epoch). What *is* enforced is that
   approval cannot precede the measurement it relies on. **Carry-forward:** the workbook's acceptance
   line "LOCAL_BLOCKED/UNAVAILABLE produces at most one active proposal per proposal epoch" has **no
   epoch anywhere in this module**; it needs a durable proposal registry at integration.
3. **Unknown candidate fields are still copied into a proposal** (`rank_by`, `allowed`, and similar).
   Measurements now reject unknown fields, but a candidate is the seam where a provider-specific
   attribute belongs, and the module's declared guard for it is the speed-field scan. Recorded as a
   boundary and as the loosest remaining shape rule in this contract.
4. **`assertLocalFirstAttempted` accepts `[{scope: 'LOCAL'}]`** with no identifying evidence of work. A
   pure module cannot verify that an attempt happened; requiring a job/attempt reference would narrow it,
   and that is recorded rather than assumed.
5. **No Android device observation and no Computer-Use session** — a pure module with no device surface.

## 5. Tests and CI

Author suite **8/8 pass unchanged**. Suite extended **8 → 11 tests**, every negative assertion paired with
a legitimate neighbour (a saturated GPU throttles *and* an idle one keeps full concurrency; an
over-subscribed count is unavailable *and* an ordinary one is allowed; a forged proposal is refused *and*
an honest one is approved; a non-enumerable speed field is refused *and* a clean candidate is accepted).

```text
node --test tests/*.test.mjs                -> 112 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 2894e8d)
node scripts/check-bilingual.sh             -> SYNCHRONIZED
```

Implementation CI: **36745309710 — gateway-web success, android success** on
`engineering-manager/EM-006-local-first-subworker-placement` @ `3a3c4a5`.

## 6. Unstated decisions (problem / choice / rationale)

1. **What may be approved.** *Choice:* only a proposal that carries a justified fallback reason, a
   recorded local attempt and a bare own-property shape. *Rationale:* the invariant is that remote work
   follows a *measured* local refusal; an object with the right flag is not a measurement.
2. **What a measured GPU load means.** *Choice:* it blocks and throttles like CPU and memory, with the
   thresholds in policy (95/80) and the value in the evidence. *Rationale:* the field existed, was
   validated and was silently discarded — the clearest "measurement that is not a measurement" in the
   contract.
3. **What a contradictory measurement means.** *Choice:* `LOCAL_UNAVAILABLE`, not throttling. *Rationale:*
   more workers running than permitted means the input cannot be trusted; recommending "one worker" on a
   device already over its limit is a confident answer built on nonsense.
4. **How policy numbers are bounded.** *Choice:* explicit per-key ranges with the key set closed.
   *Rationale:* a one-sided non-negative check let policy disable the very blocking it configures.
5. **Whether approval may precede its evidence.** *Choice:* no. *Rationale:* a proposal built from a
   replayed decision should not be approved against evidence that did not exist yet.

## 7. Honest self-errors

- I implemented the reviewer's D2 as an equality rule without first reading the author's fixture for it;
  the test failed, and I **reverted my change rather than the test**. The lesson is the one I have been
  applying all session and forgot here: check what the existing suite asserts about a mechanism before
  deciding it is a defect.
- My revert script then cut the wrong number of lines and left the module syntactically broken. I
  recovered deterministically by restoring the frozen file and re-running both patch scripts (with the
  equality step removed) rather than hand-editing the damage — and confirmed the presence of the other
  repair markers and 11/11 green before pushing. Both incidents are recorded because "tests pass" was,
  again, exactly what a broken tree looked like at one point.
- My probe's own display helper threw on a cyclic result, which briefly looked like the module still
  failing; the cycle guard is in `findSpeedFields` and the throw came from `JSON.stringify` in my probe.

## 8. Result

Eleven distinct mechanisms repaired at the mechanism, with paired regression tests and a replay of the
original reproductions. One reviewer claim is recorded as a disagreement with evidence, five boundaries
are recorded with reasoning — including the workbook's own unmet "proposal epoch" line, which needs a
durable registry rather than a local guard — and the author's suite was never weakened.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/engineering-manager/EM-006-local-first-subworker-placement.md
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
