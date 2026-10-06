# RF-010 Correction Report — Frozen Fabric Public API + Policy Boundary

```text
MISSION              = RF-010 (Remote Fabric programme, task 10 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-010-fabric-policy-public-api.md
CLAIM_COMMIT         = d99690a (Digital-City main, claim of RF-010 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:50:24Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8739185479e1185145ef5ec6e02a76aaf15c3d6e
DEVELOPMENT_CI       = 36749030367-success
CORRECTION_BRANCH    = remote/RF-010-fabric-policy-public-api
CORRECTION_HEAD_SHA  = 4d7b9310b2c2e249f3330196d7324d23bdfb3761
BRANCH_CI            = 36799110745-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-010 22 pass (6 author + 16 Alien regressions), root 123 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at 8739185, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   8739185 (Mech)   run 36749030367   success 2026-09-30T17:06:28Z
corrected head     4d7b931 (Alien)  run 36799110745   success
  gateway-web  OK 1m51s  (job 110169228266)
  android      OK 1m0s   (job 110169228029)
```

Both heads executed their real workflow steps on GitHub-hosted runners. Hosted CI is green on the exact
corrected head, so this Correction satisfies its completion criterion.

**Remote Fabric component pool drained.** With RF-010 closed, RF-001..RF-010 all satisfy the two-stage
gate (Development complete on the authoring host, Correction complete on the other physical host, corrected
head pushed, required hosted CI green):

```text
REMOTE_COMPONENT_POOL_DRAINED
```

Per the correction runbook this marker is recorded as a state fact only: no Remote merge/integration
workbook is created here, and Mech's Remote integration lane is the Owner's to trigger — Mech was not
woken for it.

## 2. Independent review method

1. The Development head was exported with `git archive` and all four task blobs were verified against their
   Git objects, giving a byte-exact immutable review target:
   `D:\A-Utopia\.runtime\evidence\mission-book\RF-010\frozen-8739185\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export, told to read this task's
   workbook first, and required to reproduce every claim with a runnable probe labelled OBSERVED or
   SUSPECTED. It returned 15 findings against an author suite of 6 passing tests.
3. I had independently found 12 mechanisms. Merging **by mechanism** produced 16 repaired defects; the
   reviewer's five new mechanisms (the weaker stream path, the cyclic-config freezer crash, invented trust,
   the untyped adapter failure, the one-sided version check) were repaired in a second and third pass. Its
   contract questions are recorded as boundaries in §6.
4. Every repair is anchored by a probe that fails on the Development head. The same 22-test suite was run
   against both heads: **6 pass / 16 fail on `8739185`; 22 pass / 0 fail on `4d7b931`**.

## 3. Defects found and repaired

The author's suite (6/6 green on the Development head) catches none of them.

| # | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 1 | **The device-local foreground/confirmation rule was caller-opt-in.** A non-canonical (`'camera'`, `'GARBAGE'`) or omitted `resource_class` skipped the whole block — so a capability advertised with `requires_user_confirmation: true` executed anyway, and an exclusive foreground resource could be taken by a second action | `resource_class !== null && config.require_foreground_for.includes(resource_class)` gated both the exclusive check and the advertisement's own confirmation requirement | `resource_class` must be a canonical `RESOURCE_CLASSES` member; the advertisement is authoritative and supplies the class when the caller is silent; a class that contradicts the advertisement is refused; the confirmation requirement is evaluated **outside** the class gate |
| 2 | **A session was not bound to the device it was used for.** Another device's session satisfied a policy port that reported `session_valid: true` / `denied_despite_valid_session`, and `disconnect` deleted any session by ref regardless of its `device_ref` | `sessions.get(session_ref)` with no subject comparison | one `requireSessionFor(session_ref, device_ref)` used by `invoke`, `openStream` and `disconnect`; a cross-device session is a typed refusal |
| 3 | **An adapter could hand back a colliding or unauthenticated session.** A reused `session_ref` silently replaced the live session (and a later `disconnect` closed the wrong one), and an adapter reporting `authenticated: false, encrypted: false` still yielded a session claiming both | `result?.session_ref ?? ...` accepted unvalidated; `authenticated`/`encrypted` were hardcoded `true` | the adapter's `session_ref` must be text and must not collide (`INVALID_ADAPTER`); an adapter that reports an unauthenticated or unencrypted session yields `TRANSPORT_FAILED` and no session |
| 4 | **Absence of a policy port was a grant.** `policy: null` fabricated all four axes as true, so `invoke` reported `policy_granted: true` and `evaluated_axes` listed four axes nothing had evaluated | `policy === null ? {all true} : policy.evaluate(...)` | a missing policy port is a typed `INVALID_POLICY` refusal on the enforcement paths: the absence of a policy is not a permission source |
| 5 | **`presence_cleared` was asserted, not measured** (it was `true` even on a device the boundary had never seen), and the device's exclusive foreground claim was never released | hardcoded `presence_cleared: true`; `foregroundOwners` untouched by revocation | revocation reports `presence_cleared` from the transport's presence **after** the disconnect (`presence_state_after` included) and reports `foreground_released` |
| 6 | **The exclusive foreground claim was written before the transport call**, so a failed invocation left the resource held by an action that never ran (and the next action got `FOREGROUND_CONFLICT`) | claim installed at the top of the foreground block | the claim is installed only after the transport call returns |
| 7 | Stream and subscription control parameters were unvalidated: `window: -1`/`NaN` and `from_sequence: -5`/`NaN` were stored and forwarded to the adapter | no type or range check on either | `window` must be a positive integer, `from_sequence` a non-negative integer |
| 8 | **Caller-supplied instants were unvalidated**, and the shared instant check was shape-only, so `at: 'garbage'`, `at: 123` and calendar-impossible values were stamped into results and the journal | `at = when ?? now()` on twelve entry points; `isIsoInstant` is a regex | every caller instant goes through `callerInstant`, the injected clock and every instant check require a real instant |
| 9 | **`policy.config` was merged unvalidated and the adapter port was not a plain record.** `require_foreground_for: null` crashed the enforcement path with a `TypeError: ... reading 'includes'`; `api_version` was ignored; a class instance passed as the adapter | spread merge with no checks; `isPlainObject` accepted any non-array object | the config is validated (`api_version` must match, both foreground lists must be arrays of canonical resource classes) and canonical records must be plain records |
| 10 | **`openStream` was a strictly weaker enforcement path for the same capability**: no advertisement check, `resource_class` hardcoded `null` (so the foreground and confirmation rules were unreachable) and no `action_ref` (so the task/action grant had no subject) | a second, thinner pipeline | a stream runs the same gates as an invocation: advertisement, confirmation requirement, foreground rule, bound session, and `action_ref`/`resource_class` reach the policy port |
| 11 | An exclusive-foreground invocation could be made with **no subject at all** (`action_ref: null`), which both skipped the claim and allowed an unbounded set of concurrent exclusive holders | the exclusivity test compared caller strings and treated "no action" as "no constraint" | an exclusive foreground resource requires the action that owns it |
| 12 | **The adapter interface was not enforced and adapter failures escaped untyped.** Only `discover`/`connect` were validated, optional methods were silent no-ops whose results still claimed `state: 'OPEN'`/`reconnectable: true`/`disconnected: true`, and adapter throws surfaced as raw `Error` (`TRANSPORT_FAILED` was declared and never thrown). `pair()` also invented `trust_state: 'TRUSTED'` when the transport reported nothing | construction checked two methods; no error wrapper; `result?.trust_state ?? 'TRUSTED'` | every declared `TRANSPORT_ADAPTER` method is required at construction; adapter calls are wrapped so a failure is a typed `TRANSPORT_FAILED`; `pair` reports the trust protocol's state and refuses when none is reported |
| 13 | **A cyclic `policy.config` crashed the shared freezer** with an untyped `RangeError: Maximum call stack size exceeded` from `policyConfig()` | `freeze` recursed `Object.values` with no visited set | the freezer tracks visited objects, so a cycle is frozen rather than recursed forever |
| 14 | The capability version check was one-sided: with an adapter that omits the version, `capability_version: 99` was accepted (and forwarded) while `listCapabilities()` reported version 1 for the same capability | `match.capability_version !== undefined && ...` skipped the check | the advertised version is normalized (`?? 1`) and always compared |
| 15 | The emitted `denial_reason` was not a member of the exported `DENIAL_REASONS` vocabulary (`MISSING_OWNER_USER` vs the exported set), so a consumer could not map a denial to a declared reason | the reason was composed inline | the reason is drawn from the exported vocabulary by axis |
| 16 | The shape-only instant check accepted **calendar-impossible** instants (`2026-02-30T00:00:00Z`, `2026-99-99T99:99:99Z`), which then lied in every result and journal entry | regex-only validation | each instant component must survive a round trip through `Date` |

## 4. Local test summary

```text
corrected module  22 tests / 22 pass /  0 fail
development head  22 tests /  6 pass / 16 fail   ← the 16 Alien regressions are the difference
root              123 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at 8739185
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

Reproducible evidence under `D:\A-Utopia\.runtime\evidence\mission-book\RF-010\`:

- `frozen-8739185/` — byte-verified Development export (4/4 blobs matched Git objects);
- `probes/probe-a.mjs` — my pre-repair probes (12 mechanisms reproduced on the Development head);
- `probes/probe-b-postfix.mjs` — the same scenarios plus the reviewer's, against the corrected module,
  24/24 pass;
- `pre-fix-check/` — the corrected suite run against the **unfixed** module (16 failures);
- `patch-fabric-api.mjs`, `-2.mjs`, `-3.mjs` — the three re-runnable repair passes;
- `author-after-patch*.log`, `prefix-test.log`, `postfix-test.log`, `gate-*.log`, `ci-*.log`.

## 5. Failed attempts and corrections to my own judgement

- Two repair passes aborted before writing because an anchor was ambiguous or ordered wrongly (the
  `getPresence` call exists on two paths; `foregroundReleased` is computed **before** the disconnect call,
  not after). Both aborts were caught by the scripts' own occurrence guards, so no partial edit ever
  reached the file — the fail-fast pattern earned its keep.
- Four of my own assertions were wrong and the module was right: my probe's mock adapter omitted two
  declared methods (so the new interface check correctly refused it everywhere), I compared two separate
  `policyConfig()` clones, my stream test tried to open an exclusive resource with a different action than
  the one holding the claim, and my cycle assertion compared the wrong level of the circular structure.
  Each was fixed in the test or probe, never in the module.
- The reviewer's F1 was the mechanism I had already repaired, but its framing was sharper than mine: I had
  validated the caller's class and derived the class from the advertisement, yet I had left the
  advertisement's own `requires_user_confirmation` inside the class gate. Its probe caught the residual
  bypass; I hoisted the check out in a second pass.

## 6. Deliberate boundaries (recorded, not silently widened)

1. **`PUBLIC_PORTS` is the caller-facing port set, not the whole surface.** The returned object also exposes
   meta and diagnostic members (`apiVersion`, `publicPorts`, `transportAdapter`, `adapterBoundaries`,
   `policyConfig`, `intersectPolicy`, `releaseForeground`, `boundary`, `storeTaskGraph`,
   `storeAssistantState`, `integrationSeams`, `sessions`, `journal`). The author's suite pins
   `publicPorts().length === 11` and the exact list, so widening it inside a Correction would break the
   encoded contract; the mismatch is recorded as an Owner carry-forward (either enumerate every member or
   make the extras non-enumerable).
2. **`releaseForeground({ device_ref })` without a holder still releases the claim.** The author's suite
   asserts exactly that (`released: true` for a non-holder), so requiring the holder's own reference is an
   Owner-level contract change, not a Correction. The exclusive rule still requires a subject at invoke
   time (defect 11).
3. **Policy gating for `connect`/`subscribe`/`revokeDevice` is not settled by the workbook.** The workbook
   names capability *execution* in the intersection rule; revocation in particular must not be blockable by
   a policy that is itself under review. Recorded as a contract question rather than repaired.
4. **Foreground claims remain device-keyed, not resource-keyed.** An exclusive CAMERA claim therefore also
   blocks a MICROPHONE request on the same device. "Exclusive foreground" is naturally device-wide
   (one foreground at a time), and the workbook does not settle the granularity.
5. **`DENIAL_REASONS` still contains a misspelled member** (`NO_OWNDER_USER_GRANT`) and several members the
   module never emits (`SESSION_IS_NOT_PERMISSION`, `PRESENCE_IS_NOT_PERMISSION`, `FOREGROUND_NOT_OWNED`,
   `RESOURCE_BUSY`). The emitted reason is now a member of the set (defect 15); changing an exported
   constant's spelling is a version-sensitive change for other branches, so it is an Owner carry-forward.

## 7. Remaining external seam

Nothing in this task depends on hardware, a provider account or another programme. One seam is recorded:
the boundary *reports* device-local capability metadata (`requires_user_confirmation`, `resource_class`)
that it obtains from the injected adapter, so the device-local policy itself is only as current as the
adapter's advertisement. That proof belongs to the capability registry (RF-007) and the real transport
adapter, both of which are corrected components in this programme. Nothing was rewritten: the Development
head and every previously reported head are untouched.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
