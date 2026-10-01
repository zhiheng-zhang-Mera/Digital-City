# RF-008 Correction Report — Typed RPC / Event / Stream + Reliable Commands

```text
MISSION              = RF-008 (Remote Fabric programme, task 8 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-008-typed-rpc-event-stream-commands.md
CLAIM_COMMIT         = 803259f (Digital-City main, claim of RF-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:26:05Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 761685b28fabdc0cb2d2dfe9f47e170d4fe82752
DEVELOPMENT_CI       = 36744638449-success
CORRECTION_BRANCH    = remote/RF-008-typed-rpc-event-stream-commands
CORRECTION_HEAD_SHA  = 4d974da6f18ec16b570bbc33709136188a5b05e2
BRANCH_CI            = 36796873900-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-008 20 pass (7 author + 13 Alien regressions), root 121 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at 761685b, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   761685b (Mech)   run 36744638449   success 2026-09-30T16:29:57Z
corrected head     4d974da (Alien)  run 36796873900   success
  gateway-web  OK 2m0s  (job 110162219319)
  android      OK 56s   (job 110162219572)
```

Both heads executed their real workflow steps on GitHub-hosted runners, including the Android build that
publishes a debug APK artifact. Hosted CI is green on the exact corrected head, so this Correction
satisfies its completion criterion.

## 2. Independent review method

The author's suite was not treated as evidence.

1. The Development head was exported with `git archive` and all four task blobs were verified against
   their Git objects (`git hash-object` == `git rev-parse 761685b:<path>`), giving a byte-exact,
   immutable review target: `D:\A-Utopia\.runtime\evidence\mission-book\RF-008\frozen-761685b\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export, given the workbook's
   goal, scope, out-of-scope list, required acceptance, the twelve mandatory Remote Fabric invariants and
   the codebase's recurring defect-class list, and was required to reproduce every claim with a runnable
   probe and to label findings OBSERVED or SUSPECTED.
3. The reviewer returned 10 findings; I had independently found 12 mechanisms. Merging **by mechanism**
   produced 16 repaired defects. Its `isPlainObject` prototype point was also adopted. Two of its
   findings are recorded as deliberate boundaries instead (§6), with rationale.
4. Every repair is anchored by a probe that fails on the Development head. The same 20-test suite was run
   against both heads: **7 pass / 13 fail on `761685b`; 20 pass / 0 fail on `4d974da`**.

## 3. Defects found and repaired

All sixteen are invisible to the author's suite, which passes 7/7 on the Development head.

| # | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 1 | The canonical-envelope allow-list used prototype-chain membership, so `toString`, `constructor`, `valueOf`, `hasOwnProperty`, `isPrototypeOf` and `__proto__` were accepted as envelope fields | `if (!(key in spec))` at the single shape gate | `Object.hasOwn(spec, key)` over `Reflect.ownKeys`, and `isPlainObject` now requires an object or null prototype |
| 2 | Reference fields had no type rule, so a **cyclic object** reached the deep freezer and the module crashed with an untyped `RangeError` (`Maximum call stack size exceeded`) from `publishEvent`, `dispatchCommand` and `cancelStream` | `task_ref`/`action_ref`/`idempotency_key`/`payload_ref`/`caused_by` were `nullable` but not `text` | all reference fields are nullable **text** (typed `INVALID_ENVELOPE`) |
| 3 | An object-valued `action_ref` made a legitimate retry look like a different action, because the comparison was reference equality | `existing.action_ref !== (envelope.action_ref ?? null)` | references are text, so the comparison is meaningful |
| 4 | Every caller-supplied instant (`at`) was unvalidated; a bad one silently no-opped a sweep, and all ten entry points accepted arbitrary instants into the journal | `at = when ?? now()` | every `at` goes through `callerInstant` (typed `INVALID_REQUEST`), and the envelope/clock instants require a **real** parseable instant, not just the ISO shape |
| 5 | The deadline was judged only against the envelope's own claimed instant, so a ten-minute-stale command was accepted as fresh | `Date.parse(deadline_at) <= Date.parse(envelope.at)` | the deadline is judged against **both** the registry clock and the claimed instant |
| 6 | `policy.max_deadline_ms` was declared but read by **no decision**, so deadlines were unbounded (a 100-year deadline was accepted) | dead policy field | the policy bound is enforced at dispatch (typed `INVALID_ENVELOPE`) |
| 7 | The merged policy was unvalidated, so `policy: { max_stream_window: Infinity }` lifted the window ceiling and an inconsistent policy was accepted | `{ ...DEFAULT_POLICY, ...policy }` with no checks | the merged policy is validated at construction (positive safe integers, default ≤ max) |
| 8 | A sweep could **fabricate an early timeout**: a caller-supplied future instant expired a command whose deadline had not passed | `sweepExpired` decided from `at` | the sweep decision uses the registry clock; the caller instant is validated and only recorded |
| 9 | `replayFrom` did not validate `from_sequence` (unlike `subscribe`), producing phantom gaps and poisoning the resume cursor | `from_sequence ?? subscription.resume_from_sequence` | the same non-negative-integer rule as `subscribe` |
| 10 | A **contiguous** replay reported a phantom gap: with the documented default `from_sequence: 0` it returned `gap_detected: true` and `missing_sequences: [0]`, and a mid-stream gap produced an empty missing list | `contiguous` counted replayed events against `highest - resume + 1` instead of testing membership | a gap is the set of sequence numbers in `[max(resume, 1), highest]` that were never published |
| 11 | `applyResult` accepted any state, so an "execution result" could move a command **backwards** and reported `executed: true` for a non-terminal command | only `COMMAND_STATES` membership was checked | an execution result must be a terminal state (`INVALID_TRANSITION` otherwise) |
| 12 | A terminal success could be **fabricated**: `applyResult({state: 'SUCCEEDED'})` without a result reference synthesized `"<command_id>:result"`, indistinguishable from a real one | `result_ref ?? \`${command_id}:result\`` | `SUCCEEDED` requires the target's real result reference (`FALSE_SUCCESS_REFUSED`); nothing is synthesized, and a failure keeps its own evidence reference |
| 13 | **False success across commands**: the idempotency cache was read by key alone, so retrying a RUNNING command returned another command's `SUCCEEDED` state and result reference | `idempotency.get(existing.idempotency_key)` | only the entry the command itself produced may be replayed; another command's result is not this command's result |
| 14 | A reused `command_id` could silently **change the subject it addresses**: a retry naming a different `target_ref`/`capability_id`/`origin_ref` was folded into the original command with those fields discarded | only `action_ref` was compared | divergence in any identifying field is refused (`COMMAND_ID_REUSED_WITH_DIFFERENT_ACTION`, with `diverged_fields`) |
| 15 | Stream accounting was corruptible and the backpressure bound was bypassable: negative/`NaN` bytes were accepted (bytes went negative) and credit replenishment ignored the configured window (repeated maximal grants reached 4.5e16) | `Number.isFinite(bytes) ? bytes : 0`, and `stream.credit += credit` with no ceiling | `bytes` must be a non-negative integer; replenishment may not push credit above `max_stream_window` (`BACKPRESSURE`) |
| 16 | A replayed `STREAM_SETUP` **clobbered a live stream** (frames_sent 2 → 0, kind/direction/credit reset, a CANCELLED stream resurrected to OPEN) and a replayed `subscribe` silently reset replay/reconnect state | unconditional `streams.set` / `subscriptions.set` | a duplicate `stream_ref`/`subscription_ref` is refused (`DUPLICATE_ENVELOPE`); reconnect uses `replayFrom` |

One further defect was introduced **by my own repair pass** and caught by the Alien regression suite before
push: `closeStream` validated `reason` while building its return object, so a bad reason set the stream to
`CLOSED` and then threw — a state change before a refusal. The third repair pass validates first and
mutates second (regression: `closeStream` with a cyclic reason leaves the stream `OPEN`).

## 4. Local test summary

```text
corrected module  20 tests / 20 pass /  0 fail
development head  20 tests /  7 pass / 13 fail   ← the 13 Alien regressions are the difference
root              121 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at 761685b
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

Reproducible evidence under `D:\A-Utopia\.runtime\evidence\mission-book\RF-008\`:

- `frozen-761685b/` — byte-verified Development export (4/4 blobs matched Git objects);
- `probes/probe-a.mjs` — my pre-repair probes (every defect reproduced on the Development head);
- `probes/probe-b-postfix.mjs` — the same scenarios against the corrected module, 18/18 pass;
- `pre-fix-check/` — the corrected suite run against the **unfixed** module (13 failures);
- `patch-dataplane.mjs`, `-2.mjs`, `-3.mjs` — the three re-runnable repair passes, each verifying its
  anchors before writing;
- `author-after-patch.log`, `author-after-patch2.log`, `prefix-test.log`, `postfix-test.log`,
  `gate-*.log`, `ci-*.log`.

## 5. Failed attempts and corrections to my own judgement

- Four of my own regression assertions were wrong and the module was right: I seeded the clock with
  `planeAt(600000)` although the author's helper takes **no** parameter (the stale-command case therefore
  never aged); I asserted a `clock` that returns an impossible instant would throw from `commands()`,
  which never consults the clock; I gave the sweep test a 600 000 ms deadline after adding a 300 000 ms
  policy ceiling; and I asserted a credit of 3 on a stream that opens with 2 credits (5 is correct). Each
  was fixed **in the test**, not in the module. This is the same failure mode as earlier tasks in this
  session: my own assertions break first.
- My second repair pass introduced a real defect (see §3) — validating a parameter while constructing the
  return value changed state before the refusal. The regression suite caught it; the third pass fixed the
  ordering. I record it rather than hiding it.
- One probe bug of my own (a missing `clock.advance` in the post-fix probe) crashed the probe, not the
  module.
- The reviewer's D4 (UNKNOWN not terminal) and its demand to gate `applyResult` on the deadline were not
  adopted; see §6 for the reasoning. Its `isPlainObject` point was adopted.

## 6. Deliberate boundaries (recorded, not silently widened)

1. **`UNKNOWN` stays recoverable.** The reviewer proposed making `UNKNOWN` terminal. The workbook requires
   only that offline/timeout/refused/unavailable/unknown/completed not be *collapsed*; treating `UNKNOWN`
   as a dead end would be the collapse. `UNKNOWN` means "the transport cannot tell yet", and a later
   authoritative executor result is the honest way to resolve it. `TIMEOUT` remains the terminal
   out-of-time outcome, and both are distinct states in `COMMAND_STATES`.
2. **A genuine late execution result is not discarded.** The reviewer asked for a deadline gate inside
   `applyResult`. The deadline gates *acceptance* (defect 5) and *delivery*; once an executor reports a real
   result reference, marking the command `TIMEOUT` instead would discard truthful evidence. The timeout
   decision belongs to `sweepExpired`, which now uses the registry clock (defect 8).
3. **Non-terminal state movement is allowed.** `transitionCommand` permits movement among non-terminal
   states because a transport may legitimately re-queue a command whose delivery was lost (reconnect
   recovery); terminal states are protected and cannot be overwritten. Requiring an acknowledgement before
   `RUNNING` would forbid honest "we no longer know the delivery state" reporting, so it is not enforced.
   The reviewer's observation that `acknowledgeDelivery` is unvalidated **was** repaired (defect 4).
4. **`STREAM_DATA` / `STREAM_CONTROL` remain advertised kinds without a frame-envelope ingest path.** The
   author's own test asserts both kinds are advertised, and the data/control paths take declared bare
   parameters. Building a second envelope ingest path would be Development work, not a Correction, so the
   repair is narrower: those paths now declare their accepted arguments and refuse anything else
   (defect 16's companion change), so a mismatched `envelope_version` can no longer be silently swallowed.
   Owner carry-forward: route frames through `checkShape` with real `STREAM_DATA`/`STREAM_CONTROL` specs,
   or stop advertising the kinds.

## 7. Remaining external seam

Nothing here depends on hardware, a provider account or another programme. One seam is recorded rather
than solved: an EVENT carrying a `sequence` that the topic has already passed is absorbed as
`duplicate: true` **without** checking whether the body diverges, so a conflicting re-use of an
`event_id` on the same topic is indistinguishable from a replay. Tightening it needs a divergence rule the
workbook does not specify, so it is left for the Owner.

## 8. Decisions taken where the documents left a choice

1. **Problem:** the deadline could be made to depend on the caller's clock in two places (dispatch and
   sweep). **Choice:** both decisions use the registry clock; the caller instant is validated and recorded
   only. **Rationale:** the injected clock is the authority for "now"; a bound is only a bound if the path
   that enforces it cannot be re-dated by its caller.
2. **Problem:** how to treat an idempotency key shared by two command ids. **Choice:** keep the author's
   encoded contract (a new command id is a new action, author test lines 145–147) but bind the **cache
   entry** to the command that produced it. **Rationale:** this closes a demonstrated false success without
   contradicting the author's test; the cache is per action, not per key.
3. **Problem:** whether a "result" may be non-terminal. **Choice:** require a terminal state and require a
   real result reference for success. **Rationale:** otherwise `applyResult` reported `executed: true` for a
   command that had not finished and manufactured success evidence.
4. **Problem:** whether to enforce a maximum deadline. **Choice:** enforce the declared
   `policy.max_deadline_ms` rather than delete the field. **Rationale:** the policy exists precisely to
   bound interactive staleness; a declared bound that no decision reads is validation theatre.
5. **Problem:** how far to go on the missing data/control envelope paths. **Choice:** close the silent-field
   hole (declared argument sets) and record the path itself as an Owner carry-forward. **Rationale:** the
   Correction mandate is repair, not new feature construction, and the author's test fixes the advertised
   kind list.
