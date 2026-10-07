# RF-007 Correction Report — Versioned Capability Registry + Addressing

```text
MISSION              = RF-007 (Remote Fabric programme, task 7 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-007-versioned-capability-registry.md
CLAIM_COMMIT         = c1a1fe1 (Digital-City main, claim of RF-007 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:10:56Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 496d0520af64396508ba5144888aa2a33f176de3
DEVELOPMENT_CI       = 36742525949-success
CORRECTION_BRANCH    = remote/RF-007-versioned-capability-registry
CORRECTION_HEAD_SHA  = 8cfd96fe340167c5be17cf66ec3bdbc070515d5c
BRANCH_CI            = 36795919665-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-007 17 pass (7 author + 10 Alien regressions), root 118 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at 496d052, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   496d052 (Mech)   run 36742525949   success 2026-09-30T16:12:39Z
corrected head     8cfd96f (Alien)   run 36795919665   success
  gateway-web  OK 2m3s  (job 110159205978)
  android      OK 55s   (job 110159205676)
```

Both runs executed their real workflow steps on GitHub-hosted runners and completed every step
(including the Android build, which published a debug APK artifact). This task was never itself inside
the `GLOBAL_EXTERNAL_BLOCK` interval: Mech's Development run succeeded at 16:12:39Z, before the
account-level refusals began at ~17:19Z, and the corrected-head run succeeded after the Owner restored
GitHub Actions billing/spending. Hosted CI is green on the exact corrected head, so this Correction
satisfies its completion criterion.

## 2. Independent review method

Per the correction contract, the author's suite was not treated as evidence.

1. The Development head was exported with `git archive` and each of the four task blobs was verified
   against its Git object (`git hash-object` == `git rev-parse 496d052:<path>`), so the review target is
   byte-exact and cannot drift: `D:\A-Utopia\.runtime\evidence\mission-book\RF-007\frozen-496d052\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export and given the
   workbook's goal, scope, out-of-scope list, required acceptance, and the codebase's recurring
   defect-class list. It was required to reproduce every claim with a runnable probe and to label each
   finding OBSERVED or SUSPECTED.
3. The reviewer returned 9 findings. I had independently found 7 mechanisms; merging **by mechanism**
   (not by reporter) produced 11 repaired defects — the reviewer's `at`-defeats-expiry, stale-replay,
   untyped-RangeError, prototype-key, partial-write, validity-bypass and never-expires findings are the
   same mechanisms I had probed, and its policy-ceiling, non-enumerable-downgrade and mutable-descriptor
   findings were new to me.
4. Every repair was driven by a probe that fails on the Development head. The same 17-test suite was run
   against both heads: **7 pass / 10 fail on `496d052`; 17 pass / 0 fail on `8cfd96f`**.

## 3. Defects found and repaired

All eleven are invisible to the author's suite, which passes 7/7 on the Development head.

| # | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 1 | A caller-supplied `at` was never validated; a bad instant escaped as `RangeError: Invalid time value` from `Date.toISOString()` instead of a typed `CapabilityError` | `at = when ?? now()` at eight sites; only the injected clock passed through `isIsoInstant` | every caller instant goes through `callerInstant`, which throws typed `INVALID_REQUEST` |
| 2 | A shape-valid but impossible instant (`2026-13-45T99:99:99Z`) still parsed to `NaN`, so it defeated the shape check and re-leaked the `RangeError` — on the clock path too | `isIsoInstant` tests the ISO *shape* only | new `isRealInstant` = shape **and** `Number.isFinite(Date.parse(...))`, used for caller instants, the injected clock, and wire instants |
| 3 | The enforcement path's expiry gate was defeatable by a caller-chosen instant: `invoke` computed `expired` from the caller's `at`, so an advertisement expired at the registry's own clock still received an invocation ticket when the caller named an earlier instant | `project(advertisement, at)` was the only expiry evaluation on the invocation path | `invoke` evaluates expiry at **both** the requested instant and the registry clock and refuses if either says expired (the refusal carries `expired_at_requested_instant` and `expired_at_registry_clock`) |
| 4 | `key in DEFAULT_EXECUTION` let inherited `Object.prototype` names through the canonical execution-metadata allow-list: `toString`, `constructor`, `valueOf`, `hasOwnProperty`, `__proto__` were all stored into the descriptor | prototype-chain membership instead of own-key membership | `Object.hasOwn(DEFAULT_EXECUTION, key)` |
| 5 | A non-enumerable own canonical execution field was validated and then silently dropped: a declared `exclusivity: 'EXCLUSIVE'` was stored as the default `SHARED`, and the ticket reported `exclusive: false` | the unknown-key scan used `Object.keys` (enumerable only) while value checks read properties directly, and storage used object spread (own **enumerable** only) | `normaliseExecution` reads each canonical key once via `Object.hasOwn`, and `Reflect.ownKeys` drives the unknown-key scan so a non-enumerable non-canonical key is still refused |
| 6 | `fromWire` was not atomic: a payload refused at entry N left entries 1..N-1 installed, resolvable, and journalled as accepted | each loop iteration validated **and** `advertisements.set(...)`-ed in place | entries are staged, and state is committed only after the whole payload validates |
| 7 | `fromWire` had no advertisement-version monotonicity guard: a replayed stale snapshot overwrote newer state — replacing `endpoint_ref`/`adapter_ref` and silently resurrecting a capability recorded as lost. `ADVERTISEMENT_VERSION_CONFLICT` was declared in `CAPABILITY_CODES`/`CONFLICT_CODES` and never raised anywhere in the module | unconditional `set`, with `Number.isSafeInteger(v) ? v : 1` for the version | a wire entry may not replace a newer version, and may not clear a recorded loss unless its version is strictly newer than the lost one; otherwise typed `ADVERTISEMENT_VERSION_CONFLICT` |
| 8 | `fromWire` skipped the validation `advertise` enforces: unvalidated `supported_versions` elements let `['x', 2]` be stored so `Math.max` negotiated `NaN`, and `[0]`/`[-5]`/`[2.7]`/duplicates were accepted (a descriptor could hold `chosen_version: 7` with `supported_versions: [1]`); `node_ref`/`endpoint_ref`/`adapter_ref` were not required to be text; a duplicate (node, capability) pair in one payload was accepted | `fromWire` only checked `Array.isArray(...) && length > 0` | the same version/ref/availability rules as `advertise`, a positive-integer `advertisement_version`, an in-payload duplicate guard, and typed `INVALID_WIRE` |
| 9 | A wire advertisement with no or unparseable `expires_at` never expired: `Date.parse(undefined) <= Date.parse(at)` is `false`, so `expired` was permanently `false` and the entry stayed in `available_capabilities` | `expires_at` stored raw from the wire | `expires_at` must be a real instant (`INVALID_WIRE` otherwise), so an unbounded-staleness advertisement cannot be admitted |
| 10 | The TTL ceiling that bounds advertisement staleness was itself caller-supplied and unvalidated: `policy: { max_ttl_ms: Infinity }` accepted a 100-year TTL, and an inconsistent policy (`default_ttl_ms > max_ttl_ms`) was accepted even though it makes every default `advertise` throw | `config = { ...DEFAULT_CAPABILITY_POLICY, ...policy }` with no bound check | the merged policy is validated at construction: both TTL fields must be positive safe integers and `default_ttl_ms <= max_ttl_ms` |
| 11 | `advertisements()` was the only descriptor surface returning **mutable** objects (every other surface freezes), so a caller could locally forge `availability`, `loss_reason` or `permission_granted` on a descriptor | missing `freeze(...)` wrapper | `advertisements()` returns a frozen clone |

Two smaller bounds were closed with the same fixes: `parseCapabilityId` accepted an unbounded digit run
(`camera.capture@` + 400 nines → `major: Infinity`) and silently rounded a major beyond
`Number.MAX_SAFE_INTEGER`; it now requires a safe integer major.

## 4. Local test summary

```text
corrected module  17 tests / 17 pass / 0 fail
development head  17 tests /  7 pass / 10 fail   ← the 10 Alien regressions are the difference
root              118 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at 496d052
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

Reproducible evidence, all under `D:\A-Utopia\.runtime\evidence\mission-book\RF-007\`:

- `frozen-496d052/` — byte-verified Development export (4/4 blobs matched Git objects);
- `probes/probe-a.mjs` — my pre-repair probes (every defect reproduced on the Development head);
- `probes/probe-b-postfix.mjs` — the same scenarios against the corrected module, 12/12 pass;
- `pre-fix-check/` — the corrected test suite run against the **unfixed** module (10 failures);
- `patch-capability-registry.mjs`, `-2.mjs`, `-3.mjs`, `-4.mjs` — the four re-runnable repair passes,
  each of which verifies its anchors before writing;
- `prefix-test.log`, `postfix-test.log`, `gate-*.log`, `ci-*.log`.

## 5. Failed attempts and corrections to my own judgement

- My first caller-instant fix validated the ISO **shape** only. I then noticed that
  `2026-13-45T99:99:99Z` satisfies the shape but yields `NaN`, so the same `RangeError` would still
  escape — and that the module's own `now()` had always had that weakness. The second repair pass added
  `isRealInstant` and applied it to the clock and wire instants as well. The first fix alone would have
  been a partial repair reported as complete.
- One of my own regression tests was wrong: it configured `policy: { max_ttl_ms: 60000 }` while leaving
  the default TTL at 300 000, which my new policy validation correctly refused at construction. The
  **test** was wrong, not the module; I corrected the test to
  `{ default_ttl_ms: 30000, max_ttl_ms: 60000 }` and added an assertion that the configured default is
  honoured. (This is the same failure mode as earlier tasks in this session: my own assertions, not the
  module, were the first thing to break.)
- The reviewer's report claimed `freeze` "never calls `Object.freeze` on its own argument". That is
  inaccurate — `freeze` does return `Object.freeze(value)` for every object it walks. I verified the real
  defect it was pointing at (the missing `freeze` wrapper in `advertisements()`) and repaired that
  instead of the stated mechanism.
- The reviewer listed the unvalidated-major parse as "low / not material"; I repaired it anyway because
  it is one line and removes a non-integer from the addressing contract.

## 6. Remaining external seam

Nothing in this task depends on hardware, a provider account, or another programme. Two seams remain
open **by contract**, recorded rather than silently widened:

1. **The permission decision is not bound to its subject.** `invoke` accepts
   `permission_decision.granted === true` and reports `permission_granted: true`, but the decision object
   carries no `capability_id`/`node_ref`, so a decision granted for one capability could be replayed for
   another. The author's suite encodes the subject-less shape (`{ granted: true, policy_ref }`) in five
   places, so requiring a subject is a **contract change for the Owner**, not a Correction-scope repair.
   The registry itself never grants permission, so the advertised-vs-permitted invariant still holds.
2. **Trust is caller-supplied policy input.** `resolve`/`invoke` default to `trusted_nodes: null`, which
   means "apply no trust constraint"; the trusted-only entry point is `resolveAcrossTrusted`. Making
   trust mandatory on `invoke` would break the author's encoded contract in the same way.

## 7. Scope explicitly not fixed

- no device-class or OS-specific addressing was added (explicitly out of scope);
- the registry still does not decide task ownership, and no scheduling or assistant policy enters the
  descriptors;
- no programme merge, no `utopia/main` change, no new product surface;
- `toWire`'s payload shape is unchanged apart from now being validated on ingest.

Nothing was rewritten: the Development head `496d052` and the previously reported heads are untouched.

## 8. Decisions taken where the documents left a choice

1. **Problem:** the reviewer and I both found that a caller-chosen `at` defeats expiry, and two repairs
   were possible. **Choice:** keep `at` as a deterministic evaluation override on read-only surfaces, but
   make `invoke` refuse when *either* the requested instant *or* the registry clock says expired.
   **Rationale:** the injected clock is the authority for "now"; the change can only add refusals in the
   exact case that matters, so no legitimate unexpired invocation is affected and no author test breaks.
2. **Problem:** how strictly to treat a wire snapshot. **Choice:** refuse a regressive version outright,
   and refuse an equal version when the stored advertisement is currently lost; a strictly newer version
   is accepted and clears the loss. **Rationale:** the module already defines `advertisement_version` as
   the "visible versioned change" mechanism for regain, so a same-version payload that flips a loss back
   to `AVAILABLE` cannot be a legitimate regain — it is a replay. This preserves advertised regain while
   closing silent resurrection, and it finally uses the `ADVERTISEMENT_VERSION_CONFLICT` code the module
   had declared but never raised.
3. **Problem:** whether to repair the subject-less permission decision. **Choice:** record it as a seam.
   **Rationale:** the author's own tests encode the decision shape; changing a public contract shape
   inside a Correction would exceed bounded scope and would break the encoded contract.
4. **Problem:** whether to repair the unvalidated-major parse that the reviewer rated low.
   **Choice:** repair it. **Rationale:** one line, removes a non-integer major from the addressing
   contract, and cannot affect any valid input.
5. **Problem:** where to record findings. **Choice:** the four repair passes and all probes live in the
   git-ignored `.runtime/evidence` tree, with only the module, its tests, the workbook and this report
   committed. **Rationale:** the repair must be reviewable, but probe scaffolding and patch scripts are
   not product artifacts.
